# Implementation Plan - Sprint 2: UI Implementation

## Goal Description
Build the Frontend UI (React) to interact with the backend mechanics. Focus on Source management and Article reading.

## User Review Required
> [!NOTE]
> This sprint transitions from "Backend" to "Frontend". UI will reference the `index.css` established in initialization but we will likely need to refine styles for the reading experience.

## Proposed Changes

### Frontend Architecture
#### [NEW] [src/components/layout/AppLayout.tsx](file:///home/drusifer/Projects/SubwayReader/src/components/layout/AppLayout.tsx)
- Sidebar navigation (Sources, Unread, Settings).
- Main content area.

#### [NEW] [src/router.tsx](file:///home/drusifer/Projects/SubwayReader/src/router.tsx)
- React Router setup (`/sources`, `/unread`, `/read/:id`).

### Features
#### [NEW] [src/pages/SourcesPage.tsx](file:///home/drusifer/Projects/SubwayReader/src/pages/SourcesPage.tsx)
- List current sources via `window.db.getSources()`.
- Add new source form (Modal or Inline).

#### [NEW] [src/pages/UnreadPage.tsx](file:///home/drusifer/Projects/SubwayReader/src/pages/UnreadPage.tsx)
- Grid/List of unread articles (Title, Source, Date).

#### [NEW] [src/pages/ReaderPage.tsx](file:///home/drusifer/Projects/SubwayReader/src/pages/ReaderPage.tsx)
- Markdown/HTML renderer for the article content.

## Verification Plan

### Manual Verification
1.  **Navigation**: Click sidebar links, verify route changes.
2.  **Add Source**: Input "Hacker News", click Add, verify it appears in list.
3.  **Sync**: Click "Sync Now" button, verify articles appear in Unread list.
4.  **Read**: Click an article, verify content loads.
