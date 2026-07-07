import { Link, Outlet, useLocation } from 'react-router-dom'
import { LayoutDashboard, Newspaper, TrainFront } from 'lucide-react'
import { clsx } from 'clsx'

export function AppLayout() {
    const location = useLocation()

    const navItems = [
        { label: 'Unread', path: '/unread', icon: LayoutDashboard },
        { label: 'Sources', path: '/sources', icon: Newspaper },
        // { label: 'Settings', path: '/settings', icon: Settings },
    ]

    return (
        <div className="flex h-screen bg-gray-900 text-gray-100">
            {/* Sidebar */}
            <aside className="w-64 border-r border-gray-800 flex flex-col">
                <div className="p-6 flex items-center gap-3">
                    <TrainFront className="w-8 h-8 text-blue-500" />
                    <h1 className="text-xl font-bold tracking-tight">SubwayReader</h1>
                </div>

                <nav className="flex-1 px-4 space-y-2">
                    {navItems.map((item) => {
                        const Icon = item.icon
                        const isActive = location.pathname.startsWith(item.path)
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={clsx(
                                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                                    isActive
                                        ? "bg-blue-600/20 text-blue-400"
                                        : "hover:bg-gray-800 text-gray-400 hover:text-gray-200"
                                )}
                            >
                                <Icon className="w-5 h-5" />
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        )
                    })}
                </nav>

                <div className="p-4 border-t border-gray-800 text-xs text-gray-600 text-center">
                    v0.1.0 (Alpha)
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto bg-gray-950">
                <Outlet />
            </main>
        </div>
    )
}
