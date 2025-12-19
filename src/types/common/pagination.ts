
export interface PaginationMeta {
    current_page: number
    from: number
    last_page: number
    per_page: number
    to: number | null
    total: number
    path?: string
}

export interface PaginationLinks {
    first: string | null
    last: string | null
    prev: string | null
    next: string | null
    url?: string | null
    label?: string
    active?: boolean
}

export interface PaginatedResponse<T> {
    data: T[]
    links?: PaginationLinks
    meta?: PaginationMeta
    current_page?: number
    first_page_url?: string
    from?: number | null
    last_page?: number
    last_page_url?: string
    next_page_url?: string | null
    path?: string
    per_page: number
    prev_page?: number
    prev_page_url?: string | null
    to?: number | null
    total?: number
}

export interface PaginationParams {
    page?: number
    per_page?: number
    sort_by?: string
    sort_order?: "asc" | "desc"
}

export interface SimplePagination {
    current_page: number
    per_page: number
    total: number
    last_page: number
    has_more_pages: boolean
}