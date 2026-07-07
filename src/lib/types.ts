export interface Source {
    id: number
    name: string
    url: string
    login_url?: string
    selector_config?: any
}

export interface Article {
    id: number
    source_id: number
    title: string
    url: string
    crawled_at: string
    is_read: number
    is_paywalled?: number
}
