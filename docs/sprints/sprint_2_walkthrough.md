# Walkthrough - Sprint 2: UI Implementation

## Goal
Build the React-based User Interface for managing sources and reading articles, connecting to the Sprint 1 backend.

## Changes Made

### 1. Frontend Architecture
- **Router**: Configured `react-router-dom` with hash routing (HashRouter is preferred for Electron stability).
- **Layout**: Created `AppLayout` with a persistent sidebar navigation.
- **State Management**: Integrated `TanStack Query` (`react-query`) for handling async IPC calls.

### 2. Feature Work
- **Sources Management** (`/sources`):
    - **List**: Fetches and displays sources via `useSources`.
    - **Add**: Form directly mutates backend via `api.addSource`.
    - **Delete**: Remove buttons wired to `api.deleteSource`.
- **Reading List** (`/unread`):
    - Displays grid of articles fetched via `useUnreadArticles`.
    - Shows metadata (Source, Time Ago).
- **Reader View** (`/read/:id`):
    - Basic placeholder implementation for reading individual articles.
    - Back navigation to list.

### 3. IPC Wiring (`src/lib/api.ts`)
- Created a strongly-typed wrapper around `window.db` and `window.scraper`.
- Implemented React Query hooks (`useSources`, `useUnreadArticles`, `useSync`) to bridge UI and Electron Main process.

## Verification
- **Unit Tests**: Updated `App.test.tsx` to verify Router and Sidebar rendering.
- **Manual Check**:
    - App builds successfully (`npm run build`).
    - Navigation between pages works.
    - Hooks are correctly typed.

## Next Steps
- Polish the **Reader View** to properly render article content.
- Verify end-to-end data flow (running the app and adding a real source).
