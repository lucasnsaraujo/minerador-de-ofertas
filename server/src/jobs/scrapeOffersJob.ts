import cron from "node-cron"
import { db } from "../context"
import { offerTable, offerSnapshotTable } from "@fsb/drizzle"
import { eq } from "drizzle-orm"
import { scrapeFacebookAdsLibrary } from "../services/scraperService"

/**
 * Cron job that scrapes all active offers every hour
 * Schedule: "0 * * * *" = At minute 0 of every hour
 */
export function startOfferScraperJob() {
  // Run every hour at minute 0
  const job = cron.schedule(
    "0 * * * *",
    async () => {
      console.log("[Cron] Starting offer scraper job...")
      await scrapeAllOffers()
    },
    {
      scheduled: true,
      timezone: "America/Sao_Paulo", // Adjust to your timezone
    }
  )

  console.log("[Cron] Offer scraper job scheduled to run every hour")

  // Run once on startup for testing (optional - comment out in production)
  // setTimeout(() => {
  //   console.log("[Cron] Running initial scrape on startup...")
  //   scrapeAllOffers().catch(console.error)
  // }, 5000)

  return job
}

/**
 * Scrapes all active offers and saves snapshots to the database
 */
export async function scrapeAllOffers(): Promise<void> {
  try {
    // Get all active offers from the database
    const activeOffers = await db.query.offerTable.findMany({
      where: eq(offerTable.isActive, true),
    })

    if (activeOffers.length === 0) {
      console.log("[Cron] No active offers to scrape")
      return
    }

    console.log(`[Cron] Found ${activeOffers.length} active offers to scrape`)

    // Process offers sequentially to avoid overwhelming the system
    // For production, consider using a queue system for better control
    for (const offer of activeOffers) {
      try {
        console.log(`[Cron] Scraping offer ${offer.id}: ${offer.name} (${offer.url})`)

        // Scrape the offer
        const metrics = await scrapeFacebookAdsLibrary(offer.url)

        // Save snapshot to database
        await db.insert(offerSnapshotTable).values({
          offerId: offer.id,
          timestamp: new Date(),
          campaignsCount: metrics.campaignsCount,
          creativesCount: metrics.creativesCount,
          impressions: metrics.impressions,
          reach: metrics.reach,
          campaignStartDate: metrics.campaignStartDate,
          campaignEndDate: metrics.campaignEndDate,
          adTexts: metrics.adTexts as any, // jsonb type
          scrapingStatus: metrics.scrapingStatus,
          errorMessage: metrics.errorMessage,
        })

        console.log(`[Cron] Successfully scraped and saved snapshot for offer ${offer.id}`)

        // Add a small delay between scrapes to be respectful
        await new Promise((resolve) => setTimeout(resolve, 2000))
      } catch (error) {
        console.error(`[Cron] Error scraping offer ${offer.id}:`, error)

        // Save a failed snapshot
        try {
          await db.insert(offerSnapshotTable).values({
            offerId: offer.id,
            timestamp: new Date(),
            campaignsCount: 0,
            creativesCount: 0,
            scrapingStatus: "failed",
            errorMessage: error instanceof Error ? error.message : "Unknown error",
          })
        } catch (insertError) {
          console.error(`[Cron] Error saving failed snapshot for offer ${offer.id}:`, insertError)
        }
      }
    }

    console.log("[Cron] Offer scraper job completed")
  } catch (error) {
    console.error("[Cron] Error in scrapeAllOffers:", error)
  }
}

/**
 * Scrapes a single offer immediately (useful for testing or triggering from API)
 */
export async function scrapeSingleOffer(offerId: string): Promise<void> {
  try {
    const offer = await db.query.offerTable.findFirst({
      where: eq(offerTable.id, offerId),
    })

    if (!offer) {
      throw new Error(`Offer ${offerId} not found`)
    }

    console.log(`[Scraper] Scraping single offer ${offer.id}: ${offer.name}`)

    const metrics = await scrapeFacebookAdsLibrary(offer.url)

    await db.insert(offerSnapshotTable).values({
      offerId: offer.id,
      timestamp: new Date(),
      campaignsCount: metrics.campaignsCount,
      creativesCount: metrics.creativesCount,
      impressions: metrics.impressions,
      reach: metrics.reach,
      campaignStartDate: metrics.campaignStartDate,
      campaignEndDate: metrics.campaignEndDate,
      adTexts: metrics.adTexts as any,
      scrapingStatus: metrics.scrapingStatus,
      errorMessage: metrics.errorMessage,
    })

    console.log(`[Scraper] Successfully scraped offer ${offer.id}`)
  } catch (error) {
    console.error(`[Scraper] Error scraping single offer ${offerId}:`, error)
    throw error
  }
}
