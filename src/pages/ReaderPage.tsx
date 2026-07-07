import { useParams, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export function ReaderPage() {
    const { id } = useParams()
    // const { data: article } = useArticle(id) // We need a hook for single article if we want full details
    // For now, let's just placeholder it.

    return (
        <div className="max-w-3xl mx-auto p-6">
            <div className="mb-6">
                <Link to="/unread" className="text-gray-500 hover:text-blue-400 flex items-center gap-2 transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                    Back to Reading List
                </Link>
            </div>

            <article className="prose prose-invert prose-lg max-w-none">
                <h1 className="text-4xl font-bold tracking-tight mb-4">Article {id}</h1>
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-8 pb-8 border-b border-gray-800">
                    <span>Author Name</span>
                    <span>•</span>
                    <span>Published Date</span>
                </div>

                <div className="space-y-4 text-gray-300 leading-relaxed">
                    <p>
                        This is a placeholder for the article content. In a real implementation,
                        we would fetch the parsed content (Markdown/HTML) from the database.
                    </p>
                    <p>
                        Since we scrape mostly links right now, we might need a "Readability" step
                        to extract full text content using Mozilla's Readability.js or similar
                        in the Puppeteer step.
                    </p>
                </div>
            </article>
        </div>
    )
}
