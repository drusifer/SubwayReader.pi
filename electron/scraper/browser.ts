import puppeteer, { Browser } from 'puppeteer-core'
import fs from 'node:fs'

// Attempt to find Chrome executable
// On simple dev environments, we might rely on the user having Chrome installed.
// For production, we'd bundle or verify.
function findChrome(): string {
    const platforms: Record<string, string[]> = {
        linux: [
            '/usr/bin/google-chrome',
            '/usr/bin/google-chrome-stable',
            '/usr/bin/chromium',
            '/usr/bin/chromium-browser',
            '/snap/bin/chromium',
        ],
        darwin: [
            '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
            '/Applications/Chromium.app/Contents/MacOS/Chromium',
        ],
        win32: [
            'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
            'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
        ],
    }

    const paths = platforms[process.platform] || []
    for (const p of paths) {
        if (fs.existsSync(p)) return p
    }
    return ''
}

let browser: Browser | null = null

export async function launchBrowser() {
    if (browser) return browser

    const executablePath = findChrome()
    if (!executablePath) {
        throw new Error('Chrome/Chromium executable not found. Please install Chrome.')
    }

    browser = await puppeteer.launch({
        executablePath,
        headless: true, // or 'new'
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu',
        ],
        defaultViewport: { width: 1280, height: 800 },
    }) as unknown as Browser

    return browser
}

export async function closeBrowser() {
    if (browser) {
        await browser.close()
        browser = null
    }
}

export async function createPage(b: Browser) {
    const page = await b.newPage()
    // Set a realistic User Agent to avoid detection
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36')
    return page
}
