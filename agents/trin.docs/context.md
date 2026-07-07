# Trin Context

## Key Decisions
- **Strategy**: Test Pyramid (70/20/10).
- **Tools**: `vitest` (Unit/Integration), `Playwright` (E2E).
- **Configuration**: `vitest.setup.ts` loads `@testing-library/jest-dom` for component testing.

## Current State
- `docs/TEST_PLAN.md` created.
- `vitest` installed and configured.
- `src/App.test.tsx` passes locally.

## Next Steps
- Implement Unit Tests for `electron/db/schema.ts` (once logic exists).
- Setup Playwright for E2E.
