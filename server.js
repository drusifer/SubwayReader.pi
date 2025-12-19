const express = require('express');
const cors = require('cors');
const { JSDOM } = require('jsdom');
const { Readability } = require('@mozilla/readability');
const TurndownService = require('turndown');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for development flexibility
app.use(cors());
app.use(express.json());

// Serve static files from the React build directory
// Vite builds to 'dist' by default
app.use(express.static(path.join(__dirname, 'dist')));

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
        'User-Agent': 'SubwayReader/1.0 (RaspberryPi; +http://localhost:3000)'
      }
    });
    
    if (!response.ok) {
        throw new Error(`Failed to fetch ${targetUrl}: ${response.status} ${response.statusText}`);
    }
    
    const html = await response.text();

    // 2. Parse HTML with JSDOM
    const doc = new JSDOM(html, { url: targetUrl });
    
    // 3. Extract main content with Readability
    const reader = new Readability(doc.window.document);
    const article = reader.parse();

    if (!article) {
      return res.status(500).json({ error: 'Failed to parse article content' });
    }

    // 4. Convert HTML to Markdown with Turndown
    const turndownService = new TurndownService({
      headingStyle: 'atx',
      codeBlockStyle: 'fenced'
    });
    
    // Remove scripts, styles, and other unwanted elements before converting if Readability missed them
    turndownService.remove(['script', 'style', 'iframe', 'nav', 'footer']);

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
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`=============================================`);
  console.log(` Subway Reader Server running`);
  console.log(` Local:   http://localhost:${PORT}`);
  console.log(` Network: http://<raspberry-pi-ip>:${PORT}`);
  console.log(`=============================================`);
});