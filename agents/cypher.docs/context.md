# Cypher Context

## Strategic Goal
Built a "Pirate Reader" that seamlessly bypasses paywalls using your own credentials.

## Current State
- **Core Engine**: Functional (Puppeteer + SQLite).
- **UI**: Functional (React + Router).
- **Missing**: The "Secret Sauce" (Authentication handling).

## Next Directive: Sprint 3
**Focus**: Authentication & Paywalls.
**Key Deliverables**:
1.  **Login Window**: A `BrowserView` that lets users log in to sites (NYT, WSJ, etc.).
2.  **Cookie Jar**: Securely extracting and storing session cookies.
3.  **Injector**: Puppeteer injecting these cookies before scraping.

## Risks
- **Security**: Must use `safeStorage` for cookies.
- **Detection**: Puppeteer stealth needs to be robust.
