import { createHashRouter, RouterProvider, Navigate } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'
import { SourcesPage } from './pages/SourcesPage'
import { UnreadPage } from './pages/UnreadPage'
import { ReaderPage } from './pages/ReaderPage'

const router = createHashRouter([
    {
        path: '/',
        element: <AppLayout />,
        children: [
            { index: true, element: <Navigate to="/unread" replace /> },
            { path: 'unread', element: <UnreadPage /> },
            { path: 'read/:id', element: <ReaderPage /> },
            { path: 'sources', element: <SourcesPage /> },
        ],
    },
])

export function AppRouter() {
    return <RouterProvider router={router} />
}
