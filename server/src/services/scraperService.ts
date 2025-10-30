import { chromium, type Browser, type Page } from "playwright"

export interface ScrapedMetrics {
  campaignsCount: number
  creativesCount: number
  impressions?: number
  reach?: number
  campaignStartDate?: Date
  campaignEndDate?: Date
  adTexts?: string[]
  pageName?: string
  scrapingStatus: "success" | "failed" | "partial"
  errorMessage?: string
}

interface ScraperConfig {
  timeout: number
  headless: boolean
  userAgent: string
  maxRetries: number
}

const defaultConfig: ScraperConfig = {
  timeout: parseInt(process.env.SCRAPING_TIMEOUT || "30000", 10),
  headless: process.env.SCRAPING_HEADLESS !== "false",
  userAgent:
    process.env.SCRAPING_USER_AGENT ||
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  maxRetries: 3,
}

/**
 * Scrapes Facebook Ads Library for offer metrics
 * @param url - The URL of the Facebook Ads Library page
 * @returns ScrapedMetrics object with extracted data
 */
export async function scrapeFacebookAdsLibrary(url: string, config: Partial<ScraperConfig> = {}): Promise<ScrapedMetrics> {
  const finalConfig = { ...defaultConfig, ...config }
  let browser: Browser | null = null
  let attempt = 0

  while (attempt < finalConfig.maxRetries) {
    try {
      attempt++
      console.log(`[Scraper] Attempt ${attempt}/${finalConfig.maxRetries} for URL: ${url}`)

      browser = await chromium.launch({
        headless: finalConfig.headless,
        timeout: finalConfig.timeout,
      })

      const context = await browser.newContext({
        userAgent: finalConfig.userAgent,
        viewport: { width: 1920, height: 1080 },
      })

      const page = await context.newPage()

      // Set timeout for page load
      page.setDefaultTimeout(finalConfig.timeout)

      // Navigate to the URL
      await page.goto(url, { waitUntil: "domcontentloaded" })

      // Wait a bit for dynamic content to load
      await page.waitForTimeout(3000)

      // Extract metrics based on Facebook Ads Library structure
      const metrics = await extractMetricsFromPage(page)

      await browser.close()
      browser = null

      console.log(`[Scraper] Successfully scraped URL: ${url}`, metrics)

      return {
        ...metrics,
        scrapingStatus: "success",
      }
    } catch (error) {
      console.error(`[Scraper] Error on attempt ${attempt}/${finalConfig.maxRetries}:`, error)

      if (browser) {
        try {
          await browser.close()
        } catch (closeError) {
          console.error("[Scraper] Error closing browser:", closeError)
        }
        browser = null
      }

      // If this was the last attempt, return failed status
      if (attempt >= finalConfig.maxRetries) {
        return {
          campaignsCount: 0,
          creativesCount: 0,
          scrapingStatus: "failed",
          errorMessage: error instanceof Error ? error.message : "Unknown error occurred",
        }
      }

      // Wait before retrying (exponential backoff)
      const backoffTime = Math.min(1000 * Math.pow(2, attempt - 1), 10000)
      console.log(`[Scraper] Waiting ${backoffTime}ms before retry...`)
      await new Promise((resolve) => setTimeout(resolve, backoffTime))
    }
  }

  // Should not reach here, but TypeScript needs a return
  return {
    campaignsCount: 0,
    creativesCount: 0,
    scrapingStatus: "failed",
    errorMessage: "Max retries exceeded",
  }
}

/**
 * Extracts metrics from the Facebook Ads Library page
 * NOTE: This is a placeholder implementation. The actual selectors will need to be
 * adjusted based on the real Facebook Ads Library page structure.
 */
async function extractMetricsFromPage(page: Page): Promise<Omit<ScrapedMetrics, "scrapingStatus" | "errorMessage">> {
  try {
    // IMPORTANT: These selectors are placeholders and need to be updated
    // based on the actual Facebook Ads Library page structure.
    // Facebook's page structure changes frequently, so this will need maintenance.

    // Wait for the main content to be visible
    await page.waitForSelector("body", { timeout: 5000 })

    // Example: Try to find campaign count
    // This is a PLACEHOLDER - actual implementation will depend on FB's structure
    let campaignsCount = 0
    let creativesCount = 0
    let impressions: number | undefined
    let reach: number | undefined
    let pageName: string | undefined
    const adTexts: string[] = []

    // Try to extract number of ads/campaigns
    // Facebook Ads Library typically shows this information in different formats
    try {
      // Look for text patterns like "X ads" or "X results"
      const pageContent = await page.content()

      // Extract page name from Facebook Ads Library
      // Try multiple selectors as Facebook structure may vary
      try {
        // Common selectors for page name in Facebook Ads Library
        const pageNameSelectors = [
          'h1',
          '[role="heading"]',
          'div[data-pagelet] h1',
          'a[href*="facebook.com/"][href*="advertiser_id"] span',
        ]

        for (const selector of pageNameSelectors) {
          const element = await page.$(selector)
          if (element) {
            const text = await element.textContent()
            if (text && text.trim().length > 0 && text.trim().length < 100) {
              pageName = text.trim()
              console.log(`[Scraper] Found page name: ${pageName}`)
              break
            }
          }
        }
      } catch (pageNameError) {
        console.warn("[Scraper] Could not extract page name:", pageNameError)
      }

      // Extract campaigns count (example pattern)
      const campaignsMatch = pageContent.match(/(\d+)\s+(campaign|ad|result)/i)
      if (campaignsMatch) {
        campaignsCount = parseInt(campaignsMatch[1], 10)
      }

      // Try to count visible ad cards (as fallback)
      const adCards = await page.$$('[role="article"], .ad-card, [data-testid*="ad"]')
      if (adCards.length > 0 && campaignsCount === 0) {
        campaignsCount = adCards.length
      }

      // For now, assume creativesCount is same as campaignsCount
      // This should be adjusted based on actual page structure
      creativesCount = campaignsCount

      // Try to extract ad texts from visible ads
      const textElements = await page.$$eval('p, span, div[role="heading"]', (elements) => {
        return elements
          .map((el) => el.textContent?.trim())
          .filter((text) => text && text.length > 20 && text.length < 500)
          .slice(0, 10) // Limit to first 10
      })

      adTexts.push(...textElements)

      // Remove duplicates
      const uniqueAdTexts = [...new Set(adTexts)]

      console.log(`[Scraper] Extracted: ${campaignsCount} campaigns, ${creativesCount} creatives, ${uniqueAdTexts.length} ad texts, page: ${pageName || 'unknown'}`)

      return {
        campaignsCount,
        creativesCount,
        impressions,
        reach,
        adTexts: uniqueAdTexts.length > 0 ? uniqueAdTexts : undefined,
        pageName,
      }
    } catch (extractError) {
      console.error("[Scraper] Error extracting metrics:", extractError)
      // Return partial data
      return {
        campaignsCount: 0,
        creativesCount: 0,
      }
    }
  } catch (error) {
    console.error("[Scraper] Error in extractMetricsFromPage:", error)
    throw error
  }
}

/**
 * Test function to verify scraper works with a URL
 * Can be called manually for debugging
 */
export async function testScraper(url: string): Promise<void> {
  console.log(`[Scraper] Testing scraper with URL: ${url}`)
  const result = await scrapeFacebookAdsLibrary(url, { headless: false })
  console.log("[Scraper] Test result:", result)
}
