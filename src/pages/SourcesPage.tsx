import { useState } from 'react'
import { useSources, useAddSource, useDeleteSource } from '../hooks/useSources'
import { Plus, Trash2, Globe } from 'lucide-react'

export function SourcesPage() {
    const { data: sources, isLoading } = useSources()
    const addSource = useAddSource()
    const deleteSource = useDeleteSource()

    const [name, setName] = useState('')
    const [url, setUrl] = useState('')

    const transformUrl = (input: string) => {
        let finalUrl = input.trim();
        if (!finalUrl) return '';
        if (!/^https?:\/\//i.test(finalUrl)) {
            finalUrl = 'https://' + finalUrl;
        }
        return finalUrl;
    }

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault()
        if (!name || !url) return

        // Basic normalization of URL could happen here or in backend
        // For now, let's just pass it.
        addSource.mutate({ name, url: transformUrl(url) }, {
            onSuccess: () => {
                setName('')
                setUrl('')
            }
        })
    }

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-100">Sources</h1>
            </div>

            {/* Add Source Card */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-8 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-200 mb-4 flex items-center gap-2">
                    <Plus className="w-5 h-5 text-blue-500" />
                    Add New Source
                </h2>
                <form onSubmit={handleAdd} className="flex gap-4 items-end">
                    <div className="flex-1 space-y-1">
                        <label className="text-xs font-medium text-gray-500 uppercase">Site Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Hacker News"
                            className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        />
                    </div>
                    <div className="flex-[2] space-y-1">
                        <label className="text-xs font-medium text-gray-500 uppercase">URL</label>
                        <input
                            type="text"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="e.g. news.ycombinator.com"
                            className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={addSource.isPending}
                        className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
                    >
                        {addSource.isPending ? 'Adding...' : 'Add Source'}
                    </button>
                </form>
            </div>

            {/* Sources List */}
            <div className="space-y-4">
                {isLoading && <p className="text-gray-500">Loading sources...</p>}

                {sources?.length === 0 && (
                    <div className="text-center py-12 bg-gray-900/50 rounded-xl border border-dashed border-gray-800">
                        <p className="text-gray-500">No sources added yet.</p>
                    </div>
                )}

                {sources?.map((source) => (
                    <div key={source.id} className="bg-gray-900 border border-gray-800 rounded-lg p-4 flex items-center justify-between group">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-400">
                                <Globe className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-200">{source.name}</h3>
                                <a href={source.url} target="_blank" rel="noreferrer" className="text-sm text-blue-400 hover:underline">
                                    {source.url}
                                </a>
                            </div>
                        </div>

                        <button
                            onClick={() => deleteSource.mutate(source.id)}
                            className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                            title="Delete Source"
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}
