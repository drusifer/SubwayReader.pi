# User Stories: Subway Reader

## Epic 1: Feed & Discovery
**As a commuter**, I want to quickly scan available content so that I can decide what to read during my trip.

*   **Story 1.1: View Headline Feed**
    *   **As a** user,
    *   **I want to** see a list of article headlines with their source and category,
    *   **So that** I can browse the latest news efficiently.
    *   *Acceptance Criteria:*
        *   Display Title, Source (e.g., TechCrunch), and Category.
        *   Layout must be mobile-friendly.

*   **Story 1.2: Visual Offline Status**
    *   **As a** user with intermittent connectivity,
    *   **I want to** see visual indicators (Icons) for which articles are downloaded vs. online-only,
    *   **So that** I don't try to open an un-cached article while in a subway tunnel.
    *   *Acceptance Criteria:*
        *   Green Checkmark icon for downloaded/offline-ready articles.
        *   Download/Cloud icon for articles pending sync.

*   **Story 1.3: AI Teaser Summaries**
    *   **As a** busy reader,
    *   **I want to** read a short AI-generated summary (approx. 15 words) on the card,
    *   **So that** I know if an article is worth opening without loading the full text.
    *   *Acceptance Criteria:*
        *   Use Google Gemini API to generate summaries during the sync process.
        *   Display summary below the headline in the feed.

*   **Story 1.4: Google Sign-In**
    *   **As a** user,
    *   **I want to** sign in with my Google Account,
    *   **So that** the news curation feels more personalized and I can see my profile.
    *   *Acceptance Criteria:*
        *   "Sign in with Google" button in Settings.
        *   Display user name and avatar upon login.
        *   Use user identity to enhance Gemini prompts.

---

## Epic 2: Synchronization (The "Subway" Workflow)
**As a user**, I want to batch-download content while I have a signal so that I have a library of content when I go offline.

*   **Story 2.1: One-Tap Sync**
    *   **As a** user about to enter the subway,
    *   **I want to** press a single "Sync Feed" button,
    *   **So that** the app automatically downloads the full content for all new articles.
    *   *Acceptance Criteria:*
        *   Button located in the "Thumb Zone" (bottom of screen).
        *   Iterate through non-downloaded articles.
        *   Fetch full text via Proxy Server.
        *   Fetch AI summary via Gemini.

*   **Story 2.2: Sync Progress Feedback**
    *   **As a** user,
    *   **I want to** see a progress indicator (e.g., "Downloading 3/10"),
    *   **So that** I know when it is safe to disconnect or lose signal.

*   **Story 2.3: Local Persistence**
    *   **As a** system,
    *   **I want to** save the full Markdown content and metadata to `localStorage`,
    *   **So that** the data persists even if the browser tab is closed or the device goes offline.

*   **Story 2.4: Resilient Sync & Error Handling**
    *   **As a** user syncing a feed,
    *   **I want to** see a visual error indicator if a specific article fails to download (e.g., broken link/404),
    *   **So that** I know why content is missing, but the rest of my feed continues to sync successfully.
    *   *Acceptance Criteria:*
        *   If the Proxy returns an error (404/500), mark the specific article with an Error icon.
        *   Do not abort the entire batch; continue to the next article.
        *   Allow the user to distinguish between "Available", "Downloaded", and "Failed".

---

## Epic 3: Reading Experience
**As a reader**, I want a comfortable, distraction-free reading environment optimized for mobile devices.

*   **Story 3.1: Distraction-Free Reader View**
    *   **As a** reader,
    *   **I want to** view articles as clean Markdown without ads, popups, or complex navigation,
    *   **So that** I can focus purely on the text.
    *   *Acceptance Criteria:*
        *   Render Markdown to HTML.
        *   Hide the main App Header and Feed.
        *   Provide a simple "Back" button.

*   **Story 3.2: Dark Mode**
    *   **As a** commuter in a dark tunnel,
    *   **I want to** toggle a Dark Mode theme,
    *   **So that** the screen doesn't hurt my eyes.

*   **Story 3.3: Typography Controls**
    *   **As a** reader,
    *   **I want to** adjust the font size and toggle between Serif and Sans-Serif fonts,
    *   **So that** the text is legible regardless of my eyesight or lighting conditions.

---

## Epic 4: Technical Architecture (Proxy & Hardware)
**As a developer**, I want a robust backend that handles the "dirty work" of web scraping and parsing.

*   **Story 4.1: CORS Proxy & Parsing**
    *   **As a** client application,
    *   **I want to** request a URL from a custom Node.js server,
    *   **So that** I bypass CORS restrictions and receive clean data.
    *   *Acceptance Criteria:*
        *   Server accepts `?url=` parameter.
        *   Server fetches raw HTML.
        *   Server uses `JSDOM` and `Readability` to extract main content.
        *   Server uses `Turndown` to convert HTML to Markdown.

*   **Story 4.2: Development Simulation Mode**
    *   **As a** developer or tester,
    *   **I want to** toggle a "Simulated Mode",
    *   **So that** I can test the UI and reading experience without needing the Raspberry Pi server running.
    *   *Acceptance Criteria:*
        *   Toggle available in Settings.
        *   When active, return hardcoded Mock Markdown instead of making network requests.

*   **Story 4.3: Live Server Configuration**
    *   **As a** user with a self-hosted setup,
    *   **I want to** input my specific Raspberry Pi IP address (e.g., `http://192.168.1.50:3000`),
    *   **So that** the PWA knows where to send the parsing requests.