const express = require('express');
const cors = require('cors');
const { JSDOM } = require('jsdom');
const { Readability } = require('@mozilla/readability');
const TurndownService = require('turndown');
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for development flexibility
app.use(cors());
app.use(express.json());

// Serve static files from the React build directory
// Vite builds to 'dist' by default
const DIST_PATH = path.join(__dirname, 'dist');
const INDEX_PATH = path.join(DIST_PATH, 'index.html');

// Check if build exists
if (!fs.existsSync(DIST_PATH)) {
  console.warn('\n⚠️  WARNING: "dist" directory not found.');
  console.warn('   The server will run, but the UI will not be accessible.');
  console.warn('   Please run "npm run build" to generate frontend assets.\n');
}

app.use(express.static(DIST_PATH));

// Shared browser instance to avoid launch overhead, but we manage pages individually
let browserInstance = null;

async function getBrowser() {
    if (!browserInstance) {
        browserInstance = await puppeteer.launch({
            headless: 'new',
            args: [
                '--no-sandbox', 
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage', // Important for docker/pi environments
                '--disable-accelerated-2d-canvas',
                '--disable-gpu'
            ]
        });
    }
    return browserInstance;
}

/**
 * API Endpoint: /api/parse
 * Fetches a URL using Puppeteer (UX simulation) to bypass soft paywalls/bot-detection,
 * then cleans with Readability and converts to Markdown.
 */
app.get('/api/parse', async (req, res) => {
  const targetUrl = req.query.url;

  if (!targetUrl) {
    return res.status(400).json({ error: 'Missing url parameter' });
  }

  let page = null;
  
  try {
    console.log(`[Proxy] 🌐 Fetching (UX Mode): ${targetUrl}`);
    
    const browser = await getBrowser();
    page = await browser.newPage();
    
    // Set a realistic User Agent
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36');

    // Optimize: block images, styles, fonts to speed up
    await page.setRequestInterception(true);
    page.on('request', (req) => {
        if (['image', 'stylesheet', 'font', 'media'].includes(req.resourceType())) {
            req.abort();
        } else {
            req.continue();
        }
    });

    // Navigate with timeout
    await page.goto(targetUrl, { 
        waitUntil: 'domcontentloaded',
        timeout: 20000 // 20s timeout
    });
    
    // Optional: Wait a moment for dynamic content hydration (SPA)
    // await new Promise(r => setTimeout(r, 1000));

    // Extract the full HTML after JS execution
    const html = await page.content();
    
    await page.close();
    page = null; // Mark as closed

    // 2. Parse HTML with JSDOM
    const doc = new JSDOM(html, { url: targetUrl });
    const document = doc.window.document;

    // 2b. Aggressive Pre-cleaning
    // Remove common clutter before Readability
    const clutterSelectors = [
      'nav', 'footer', 'header', 'aside', 
      '.ad', '.advertisement', '.social-share', '.cookie-consent', 
      '#sidebar', '#comments', '.related-posts',
      '[aria-modal="true"]', // Modals often block content
      '.modal', '.popup'
    ];
    clutterSelectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(el => el.remove());
    });
    
    // 3. Extract main content with Readability
    const reader = new Readability(document);
    const article = reader.parse();

    if (!article) {
      return res.status(500).json({ error: 'Failed to parse article content' });
    }

    // 4. Convert HTML to Markdown with Turndown
    const turndownService = new TurndownService({
      headingStyle: 'atx',
      codeBlockStyle: 'fenced'
    });
    
    turndownService.remove(['script', 'style', 'iframe', 'object', 'video', 'button', 'form']);

    const markdown = turndownService.turndown(article.content);

    console.log(`[Proxy] ✅ Successfully parsed: "${article.title}"`);

    // 5. Return JSON response
    res.json({
      title: article.title,
      content: markdown,
      excerpt: article.excerpt,
      siteName: article.siteName || new URL(targetUrl).hostname
    });

  } catch (error) {
    console.error('[Proxy] ❌ Error parsing article:', error);
    if (page) await page.close().catch(() => {});
    res.status(500).json({ error: error.message });
  }
});

// Fallback: Handle client-side routing by serving index.html for unknown routes
app.get('*', (req, res) => {
  if (fs.existsSync(INDEX_PATH)) {
    res.sendFile(INDEX_PATH);
  } else {
    res.status(404).send(`
      <h1>Frontend Build Not Found</h1>
      <p>The <code>dist/index.html</code> file is missing.</p>
      <p>Please run the following command to build the application:</p>
      <pre>npm run build</pre>
      <p>Then refresh this page.</p>
    `);
  }
});

app.listen(PORT, () => {
  console.log(`=============================================`);
  console.log(` Subway Reader Server running (w/ Puppeteer)`);
  console.log(` Local:   http://localhost:${PORT}`);
  console.log(` Network: http://<raspberry-pi-ip>:${PORT}`);
  console.log(`=============================================`);
});