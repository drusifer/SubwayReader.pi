const express = require('express');
const cors = require('cors');
const { JSDOM } = require('jsdom');
const { Readability } = require('@mozilla/readability');
const TurndownService = require('turndown');
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

/**
 * API Endpoint: /api/parse
 * Fetches a URL, cleans the HTML using Readability, and converts it to Markdown.
 */
app.get('/api/parse', async (req, res) => {
  const targetUrl = req.query.url;

  if (!targetUrl) {
    return res.status(400).json({ error: 'Missing url parameter' });
  }

  try {
    console.log(`[Proxy] Fetching: ${targetUrl}`);
    
    // 1. Fetch the raw HTML
    const response = await fetch(targetUrl, {
      headers: {
        // Use a real browser User-Agent to avoid being blocked by sites like Wikipedia
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    if (!response.ok) {
        throw new Error(`Failed to fetch ${targetUrl}: ${response.status} ${response.statusText}`);
    }
    
    const html = await response.text();

    // 2. Parse HTML with JSDOM
    const doc = new JSDOM(html, { url: targetUrl });
    const document = doc.window.document;

    // 2b. Aggressive Pre-cleaning (User Story 4.1 Refinement)
    // Remove common clutter before Readability even sees it
    const clutterSelectors = [
      'nav', 'footer', 'header', 'aside', 
      '.ad', '.advertisement', '.social-share', '.cookie-consent', 
      '#sidebar', '#comments', '.related-posts'
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
    
    // Safety net: Remove scripts/styles if they survived Readability
    turndownService.remove(['script', 'style', 'iframe', 'object', 'video']);

    const markdown = turndownService.turndown(article.content);

    // 5. Return JSON response
    res.json({
      title: article.title,
      content: markdown,
      excerpt: article.excerpt,
      siteName: article.siteName || new URL(targetUrl).hostname
    });

  } catch (error) {
    console.error('[Proxy] Error parsing article:', error);
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
  console.log(` Subway Reader Server running`);
  console.log(` Local:   http://localhost:${PORT}`);
  console.log(` Network: http://<raspberry-pi-ip>:${PORT}`);
  console.log(`=============================================`);
});