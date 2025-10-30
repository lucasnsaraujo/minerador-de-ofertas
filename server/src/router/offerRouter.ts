import { protectedProcedure, router } from "../trpc"
import { offerTable, offerSnapshotTable, drizzleOrm } from "@fsb/drizzle"
import { zod } from "@fsb/shared"
import { scrapeSingleOffer } from "../jobs/scrapeOffersJob"

const { eq, and, desc, gte, sql } = drizzleOrm

const offerRouter = router({
  /**
   * Create a new offer and run initial scraping
   */
  createOffer: protectedProcedure.input(zod.zodCreateOffer).mutation(async (opts) => {
    const db = opts.ctx.db
    const userId = opts.ctx.user.id

    // Create the offer
    const [offer] = await db
      .insert(offerTable)
      .values({
        userId,
        url: opts.input.url,
        name: opts.input.name,
        type: opts.input.type,
        region: opts.input.region,
        isActive: true,
      })
      .returning()

    // Trigger initial scraping in the background (don't wait)
    scrapeSingleOffer(offer.id).catch((error) => {
      console.error(`[Offer] Error in initial scraping for offer ${offer.id}:`, error)
    })

    return offer
  }),

  /**
   * Get all offers for the current user with optional filters
   * Returns offers with their latest snapshot and 24h delta
   */
  getOffers: protectedProcedure.input(zod.zodGetOffers).query(async (opts) => {
    const db = opts.ctx.db
    const userId = opts.ctx.user.id
    const { type, region, limit, offset } = opts.input

    // Build where conditions
    const conditions = [eq(offerTable.userId, userId)]
    if (type) conditions.push(eq(offerTable.type, type))
    if (region) conditions.push(eq(offerTable.region, region))

    // Get offers with their latest snapshot
    const offers = await db.query.offerTable.findMany({
      where: and(...conditions),
      limit,
      offset,
      orderBy: [desc(offerTable.createdAt)],
      with: {
        snapshots: {
          orderBy: [desc(offerSnapshotTable.timestamp)],
          limit: 1,
        },
      },
    })

    // For each offer, calculate 24h delta
    const offersWithDelta = await Promise.all(
      offers.map(async (offer) => {
        const latestSnapshot = offer.snapshots[0]

        if (!latestSnapshot) {
          return {
            ...offer,
            latestSnapshot: null,
            delta24h: null,
          }
        }

        // Get snapshot from 24 hours ago
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
        const snapshot24hAgo = await db.query.offerSnapshotTable.findFirst({
          where: and(eq(offerSnapshotTable.offerId, offer.id), gte(offerSnapshotTable.timestamp, twentyFourHoursAgo)),
          orderBy: [desc(offerSnapshotTable.timestamp)],
        })

        const delta24h = snapshot24hAgo
          ? {
              campaignsCount: latestSnapshot.campaignsCount - snapshot24hAgo.campaignsCount,
              creativesCount: latestSnapshot.creativesCount - snapshot24hAgo.creativesCount,
            }
          : null

        return {
          ...offer,
          latestSnapshot,
          delta24h,
        }
      })
    )

    // Get total count for pagination
    const [{ count: total }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(offerTable)
      .where(and(...conditions))

    return {
      offers: offersWithDelta,
      total,
      limit,
      offset,
    }
  }),

  /**
   * Get detailed information about a specific offer
   * Includes the offer and its latest snapshot
   */
  getOfferDetails: protectedProcedure.input(zod.zodGetOfferDetails).query(async (opts) => {
    const db = opts.ctx.db
    const userId = opts.ctx.user.id
    const { offerId } = opts.input

    // Get offer with latest snapshot
    const offer = await db.query.offerTable.findFirst({
      where: and(eq(offerTable.id, offerId), eq(offerTable.userId, userId)),
      with: {
        snapshots: {
          orderBy: [desc(offerSnapshotTable.timestamp)],
          limit: 1,
        },
      },
    })

    if (!offer) {
      throw new Error("Offer not found")
    }

    return offer
  }),

  /**
   * Get chart data for an offer (last N days)
   */
  getOfferChartData: protectedProcedure.input(zod.zodGetOfferChartData).query(async (opts) => {
    const db = opts.ctx.db
    const userId = opts.ctx.user.id
    const { offerId, days } = opts.input

    // Verify ownership
    const offer = await db.query.offerTable.findFirst({
      where: and(eq(offerTable.id, offerId), eq(offerTable.userId, userId)),
    })

    if (!offer) {
      throw new Error("Offer not found")
    }

    // Get snapshots from last N days
    const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
    const snapshots = await db.query.offerSnapshotTable.findMany({
      where: and(eq(offerSnapshotTable.offerId, offerId), gte(offerSnapshotTable.timestamp, cutoffDate)),
      orderBy: [desc(offerSnapshotTable.timestamp)],
    })

    return snapshots
  }),

  /**
   * Get historical snapshots for an offer (paginated)
   */
  getOfferSnapshots: protectedProcedure.input(zod.zodGetOfferSnapshots).query(async (opts) => {
    const db = opts.ctx.db
    const userId = opts.ctx.user.id
    const { offerId, limit, offset } = opts.input

    // Verify ownership
    const offer = await db.query.offerTable.findFirst({
      where: and(eq(offerTable.id, offerId), eq(offerTable.userId, userId)),
    })

    if (!offer) {
      throw new Error("Offer not found")
    }

    // Get snapshots with pagination
    const snapshots = await db.query.offerSnapshotTable.findMany({
      where: eq(offerSnapshotTable.offerId, offerId),
      orderBy: [desc(offerSnapshotTable.timestamp)],
      limit,
      offset,
    })

    // Get total count
    const [{ count: total }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(offerSnapshotTable)
      .where(eq(offerSnapshotTable.offerId, offerId))

    return {
      snapshots,
      total,
      limit,
      offset,
    }
  }),

  /**
   * Update an offer's metadata
   */
  updateOffer: protectedProcedure.input(zod.zodUpdateOffer).mutation(async (opts) => {
    const db = opts.ctx.db
    const userId = opts.ctx.user.id
    const { offerId, ...updates } = opts.input

    // Verify ownership
    const offer = await db.query.offerTable.findFirst({
      where: and(eq(offerTable.id, offerId), eq(offerTable.userId, userId)),
    })

    if (!offer) {
      throw new Error("Offer not found")
    }

    // Update the offer
    const [updatedOffer] = await db
      .update(offerTable)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(offerTable.id, offerId))
      .returning()

    return updatedOffer
  }),

  /**
   * Delete an offer (and all its snapshots due to cascade)
   */
  deleteOffer: protectedProcedure.input(zod.zodDeleteOffer).mutation(async (opts) => {
    const db = opts.ctx.db
    const userId = opts.ctx.user.id
    const { offerId } = opts.input

    // Verify ownership
    const offer = await db.query.offerTable.findFirst({
      where: and(eq(offerTable.id, offerId), eq(offerTable.userId, userId)),
    })

    if (!offer) {
      throw new Error("Offer not found")
    }

    // Delete the offer (snapshots will be cascaded)
    await db.delete(offerTable).where(eq(offerTable.id, offerId))

    return { success: true }
  }),

  /**
   * Trigger manual scraping for a specific offer
   */
  triggerScraping: protectedProcedure.input(zod.zodGetOfferDetails).mutation(async (opts) => {
    const db = opts.ctx.db
    const userId = opts.ctx.user.id
    const { offerId } = opts.input

    // Verify ownership
    const offer = await db.query.offerTable.findFirst({
      where: and(eq(offerTable.id, offerId), eq(offerTable.userId, userId)),
    })

    if (!offer) {
      throw new Error("Offer not found")
    }

    // Trigger scraping (don't wait for completion)
    scrapeSingleOffer(offerId).catch((error) => {
      console.error(`[Offer] Error in manual scraping for offer ${offerId}:`, error)
    })

    return { success: true, message: "Scraping triggered" }
  }),
})

export default offerRouter
