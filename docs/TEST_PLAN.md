# Test Plan: SubwayReader

## Strategy: The Test Pyramid
We adhere to the [Test Pyramid](https://martinfowler.com/articles/practical-test-pyramid.html) to ensure a stable, maintainable codebase.

### 1. Unit Tests (70%)
**Scope**: Individual functions, classes, and logic.
**Tooling**: `vitest` (Renderer & Logic), `jest` (Main Process if needed, or stick to `vitest` for everything).
**Characteristics**: 
- Fast (< 5ms per test).
- No I/O (Mock FS, Mock DB, Mock Network).
- Run on every file save.

**Key Targets**:
- `ArticleParser` logic (HTML -> Markdown).
- `Scheduler` timing logic.
- React Components (using React Testing Library).
- SQL Query builders.

### 2. Integration Tests (20%)
**Scope**: Interaction between two distinct modules.
**Tooling**: `vitest` + `better-sqlite3` (in-memory), Electron IPC Mocks.
**Characteristics**:
- Checks wiring.
- Uses real (in-memory) database.
- Mocks external network (websites).

**Key Targets**:
- **Database Layer**: Verify `saveArticle` writes to SQLite correctly.
- **IPC Bridge**: Verify Renderer can request data from Main process.
- **Puppeteer Wrapper**: Verify the browser launches and returns handles (mocking the actual page navigation).

### 3. End-to-End (E2E) Tests (10%)
**Scope**: Full application flow from user perspective.
**Tooling**: `Playwright` (Native Electron support).
**Characteristics**:
- Slow, flaky (by nature), realistic.
- Runs the actual Electron binary.
- Requires network (or sophisticated network mocking).

**Key Targets**:
- **App Launch**: Verify the app starts and renders the dashboard.
- **Source Configuration**: User adds a new source -> persistence.
- **Sync Flow (Mocked)**: Trigger sync, intercept HTTP, verify UI updates.

## Tooling Setup

### Testing Framework: `vitest`
Why: Faster than Jest, native Vite integration, compatible with both Node (Main) and Browser (Renderer) environments.

### E2E Framework: `Playwright`
Why: Best-in-class Electron support, powerful debugging, auto-waiting.

## CI/CD Strategy
1.  **Commit Hook**: Run Lint + Unit Tests.
2.  **Pull Request**: Run Integration Tests.
3.  **Nightly/Release**: Run E2E Tests.

## Implementation Roadmap
1.  **Phase 1**: Set up `vitest` for Main and Renderer.
2.  **Phase 2**: Write Unit Tests for `db/schema.ts` (if logic exists) and default parsing helpers.
3.  **Phase 3**: Set up `Playwright` for Electron launch test.
