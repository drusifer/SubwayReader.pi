import { launchBrowser, closeBrowser, createPage } from './browser'
import { getSources } from '../db/models/source'
import { saveArticle } from '../db/models/article'

export async function runSync() {
    const sources = getSources()
    if (sources.length === 0) {
        console.log('No sources configured.')
        return { count: 0 }
    }

    const browser = await launchBrowser()
    let newArticlesCount = 0

    try {
        for (const source of sources) {
            console.log(`Syncing ${source.name} (${source.url})...`)
            const page = await createPage(browser)

            try {
                await page.goto(source.url, { waitUntil: 'domcontentloaded', timeout: 30000 })

                // Basic scraping strategy: Find all links that look like articles (heuristic)
                // Ideally, we use source.selector_config to pick a specific container
                const links = await page.evaluate(() => {
                    const anchors = Array.from(document.querySelectorAll('a'))
                    return anchors
                        .filter(a => a.href && a.innerText.length > 10) // Basic filter
                        .map(a => ({
                            title: a.innerText.trim(),
                            url: a.href
                        }))
                })

                // Save found links
                for (const link of links) {
                    // Deduplication happens in DB (UNIQUE constraint on URL)
                    const result = saveArticle({
                        source_id: source.id,
                        title: link.title,
                        url: link.url,
                        crawled_at: new Date().toISOString(),
                        is_read: 0
                    })
                    if (result !== 0) newArticlesCount++
                }

            } catch (err) {
                console.error(`Failed to sync ${source.name}:`, err)
            } finally {
                await page.close()
            }
        }
    } finally {
        // We might keep browser open in future optimization, but for now close it
        // await closeBrowser() 
        // Actually, keep it open if we want to read? No, Aggregator finishes then closes.
        await closeBrowser()
    }

    return { count: newArticlesCount }
}
