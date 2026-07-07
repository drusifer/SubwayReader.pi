# Neo Context

## Key Findings
- **Build System**: Vite with `vite-plugin-electron` handles multi-process builds efficiently.
- **IPC**: Disabled `ipcMain` temporarily to pass linting; needs to be re-enabled when handlers are implemented.
- **Environment**: TS configuration for `process.env` in Electron Main requires explicit handling or type assertion.

## Current State
- **Project Initialized**: `package.json`, `tsconfig`, `vite.config` set up.
- **Electron**: Main process (`main.ts`) and Preload (`preload.ts`) created and building.
- **Frontend**: React (`App.tsx`) scaffolded and building.
- **Database**: Schema defined in `electron/db/schema.ts` (not yet loaded).

## Next Steps
- Implement `ipcMain` handlers for database.
- Connect `better-sqlite3`.
- Implement basic Puppeteer launch test.
