import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../lib/api'

export function useSources() {
    return useQuery({
        queryKey: ['sources'],
        queryFn: api.getSources
    })
}

export function useAddSource() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ name, url }: { name: string; url: string }) => api.addSource(name, url),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['sources'] })
        }
    })
}

export function useDeleteSource() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (id: number) => api.deleteSource(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['sources'] })
        }
    })
}

export function useUnreadArticles() {
    return useQuery({
        queryKey: ['articles', 'unread'],
        queryFn: api.getUnreadArticles
    })
}

export function useSync() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: () => api.sync(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['articles'] })
        }
    })
}
