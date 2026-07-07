# Product Requirements Document (PRD): SubwayReader

| Field | Value |
| :--- | :--- |
| **Project Name** | SubwayReader |
| **Status** | Draft v2 |
| **Owner** | Cypher (@Cypher) |
| **Target Audience** | Commuters with limited connectivity |
| **Key Capability** | automated offline news aggregation & reading |

## 1. Executive Summary
SubwayReader is a desktop/mobile application (Electron/Flutter) that automatically aggregates, downloads, and caches news articles from user-specified sources (Google News, NYT, Politico) for offline reading. It acts as a personal "offline internet" for your commute, handling authentication for paywalled content.

## 2. Problem Statement
Commuters need a reliable way to read *current* news without internet access. Existing solutions (Pocket, browser tabs) require manual saving or don't handle paywalled/dynamic content well. Users want a "morning paper" delivered digitally—fully collected and ready to read before they leave the house.

## 3. Goals & Success Metrics
*   **Goal 1 (Aggregation):** Automatically fetch top stories from Google News and other feed sources.
*   **Goal 2 (Auth/Paywalls):** Successfully retrieve full content from paywalled sites (NYT, Politico) using user's existing credentials.
*   **Goal 3 (Offline UX):** Provide a distraction-free, Markdown-based reading experience with essential images.
*   **Goal 4 (Zero-Backend):** Logic runs entirely on the client (headless browser/scraper); no external server required.
*   **Success Metric:** "Morning Sync" successfully captures 20+ articles (including paywalled ones) in < 5 minutes.

## 4. Key Features / User Stories

### Feature 1: The "Morning Sync"
*   **US.1.1**: As a user, I want a "Sync Now" button that fetches the latest headlines and full article content from my configured sources.
*   **US.1.2**: As a user, I want the app to use my cookies/session to bypass paywalls for sites I subscribe to.

### Feature 2: Feed Management
*   **US.2.1**: As a user, I want to define sources (e.g., "Google News Headlines", "Scientific American").
*   **US.2.2**: As a user, I want the app to curate content based on my Google News personalized feed.

### Feature 3: Offline Reading Interface
*   **US.3.1**: As a user, I want articles converted to clean Markdown/Simple HTML for reading.
*   **US.3.2**: As a user, I want to click links within articles; if cached, they open; if not, they are queued or marked as offline.

## 5. Non-Functional Requirements
*   **Technology Stack**: Electron or Flutter (Must support headless browsing/scraping).
*   **Architecture**: Local-first, Serverless.
*   **Data**: JSON/SQLite local database for metadata; Filesystem for cached content.
*   **Privacy**: Credentials stored locally and securely.

## 6. Assumptions & Risks
*   **Risk (Headless):** undetected headless browsing (Puppeteer/Playwright) is hard; news sites fight scrapers.
*   **Risk (Auth):** Managing/Injecting cookies into the headless session is complex.
*   **Assumption**: User will run the sync on a stable connection (Home Wi-Fi) before commuting.

## 7. Open Questions
*   @Morpheus: **Stack Choice**: Electron with Puppeteer (Node.js) vs Flutter? (Electron seems stronger for headless scraping/cookie manipulation).
*   @Morpheus: **Cookie approach**: Should we have an embedded "Login Mode" where the user logs in via the app, and we persist the cookies?

---
**Sign-off**:
*   Product: Cypher (Pending)
*   Tech: Morpheus (Pending)
