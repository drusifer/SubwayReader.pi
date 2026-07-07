# Architecture Document: SubwayReader

## 1. High-Level Architecture
SubwayReader uses a **Local-First, Zero-Backend** architecture. The application runs entirely on the user's machine, acting as an automated agent that browses, scrapes, and curates content on their behalf.

### 1.1 Technology Stack
*   **Runtime**: [Electron](https://www.electronjs.org/) (Chromium + Node.js)
    *   *Why*: Provides the necessary Node.js environment for headless browsing (Puppeteer) while offering a rich web-based UI.
*   **Frontend**: React + TypeScript + TailwindCSS
    *   *Why*: Modern, component-based UI development.
*   **Headless Browser**: [Puppeteer](https://pptr.dev/) (bundled with Electron or separate binary)
    *   *Why*: Best-in-class control over Chrome for scraping and cookie manipulation.
*   **Database**: [better-sqlite3](https://github.com/WiseLibs/better-sqlite3)
    *   *Why*: Fast, synchronous, file-based SQL DB suitable for Electron.
*   **State Management**: React Query (Server State) + Zustand (Client State)

## 2. Core Components

### 2.1 The "Aggregator" (Main Process)
Runs in Electron's Main Process (Node.js). Responsible for:
*   **Job Scheduling**: Orchestrating "Morning Sync".
*   **Puppeteer Manager**: Launching/managing headless browser instances.
*   **Content Parser**: Converting raw HTML to stored Markdown/Content.
*   **Persistence**: Writing to SQLite and filesystem.

### 2.2 The "Reader" (Renderer Process)
Runs in Electron's Renderer Process (Web/React). Responsible for:
*   **Library View**: Displaying fetched articles.
*   **Reader View**: Distraction-free content rendering.
*   **Config UI**: Managing sources and scheduling.
*   **Auth Proxy**: Hosting the "Login View" for user authentication.

## 3. Key Workflows

### 3.1 Authentication (The "Login Mode")
To solve the paywall issue (US.1.2), we do **not** reverse-engineer login APIs. Instead, we use the user's browser session.
1.  User clicks "Login to [Source]" in the App.
2.  App opens a visible `BrowserView` (or child window) loading the source's login page.
3.  User manually logs in.
4.  App detects successful login (via URL change or cookie presence).
5.  App extracts cookies (`session_id`, etc.) via Electron/Puppeteer API.
6.  App saves cookies securely (encrypted) to local DB/Store.

### 3.2 The "Morning Sync"
1.  Scheduler triggers (or User clicks "Sync").
2.  Aggregator prompts Puppeteer to launch (Headless).
3.  **For each Source**:
    *   Load saved cookies.
    *   Navigate to configured URL (e.g., `news.google.com/my-feed`).
    *   Scroll/Interact to load dynamic content.
    *   Extract article URLs (deduplicate against DB).
    *   **For each New Article**:
        *   Navigate to article URL.
        *   Extract content (Readability.js approach).
        *   Download essential images (local cache).
        *   Save metadata to DB, content to FS.
4.  Notify user: "Running low on storage" or "Sync Complete".

## 4. Data Model (SQLite)

```sql
CREATE TABLE sources (
  id INTEGER PRIMARY KEY,
  name TEXT,
  url TEXT,
  login_url TEXT,
  selector_config JSON -- Custom selectors for parsing
);

CREATE TABLE articles (
  id INTEGER PRIMARY KEY,
  source_id INTEGER,
  title TEXT,
  url TEXT UNIQUE,
  author TEXT,
  published_at DATETIME,
  crawled_at DATETIME,
  local_path TEXT, -- Path to main markdown/html file
  is_read BOOLEAN DEFAULT 0,
  is_paywalled BOOLEAN
);
```

## 5. Security & Privacy
*   **Credentials**: We never see the user's password. We only hold session cookies.
*   **Encryption**: Cookies stored in SQLite should be encrypted using Electron's `safeStorage` API.
*   **Network**: No data leaves the device except to the original news sources.

## 6. Open Decisions (Resolved)
*   **Stack**: Electron confirmed. Flutter is too restricted for the required Node.js scraping capabilities.
*   **Cookie Approach**: "Login Mode" confirmed. We will piggyback on standard browser authentication sessions.
