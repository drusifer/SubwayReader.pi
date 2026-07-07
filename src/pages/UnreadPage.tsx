import { useUnreadArticles } from '../hooks/useSources'
import { BookOpen, Calendar, Globe } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatDistanceToNow } from 'date-fns'

export function UnreadPage() {
    const { data: articles, isLoading } = useUnreadArticles()

    if (isLoading) {
        return (
            <div className="p-6 flex items-center justify-center h-full">
                <p className="text-gray-500 animate-pulse">Loading articles...</p>
            </div>
        )
    }

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-100 flex items-center gap-3">
                    <BookOpen className="w-8 h-8 text-blue-500" />
                    Reading List
                    <span className="text-lg font-normal text-gray-500 ml-2">
                        ({articles?.length ?? 0})
                    </span>
                </h1>
            </div>

            <div className="grid gap-4">
                {articles?.map((article) => (
                    <Link
                        key={article.id}
                        to={`/read/${article.id}`}
                        className="group bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-blue-500/50 transition-all hover:bg-gray-800/50"
                    >
                        <div className="flex justify-between items-start gap-4">
                            <div>
                                <h3 className="text-xl font-semibold text-gray-200 group-hover:text-blue-400 mb-2 line-clamp-2">
                                    {article.title}
                                </h3>
                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                    <div className="flex items-center gap-1.5">
                                        <Globe className="w-4 h-4" />
                                        <span className="truncate max-w-[200px]">{new URL(article.url).hostname}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Calendar className="w-4 h-4" />
                                        <span>{formatDistanceToNow(new Date(article.crawled_at), { addSuffix: true })}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Optional: Add Read/Archive button here */}
                        </div>
                    </Link>
                ))}

                {articles?.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-gray-400 text-lg">All caught up! No unread articles.</p>
                        <Link to="/sources" className="text-blue-500 hover:underline mt-2 inline-block">
                            Manage Sources
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}
