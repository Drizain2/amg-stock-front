import { StockMovementType } from "./enums"

export interface BaseFilters {
    search?: string
    is_active?: boolean
    page?: number
    per_page?: number
    sort_by?: number
    sort_order?: "asc" | "desc"
}

export interface CompanyFilters extends BaseFilters {
    email?: string
    phone?: string
}

export interface BranchFilters extends BaseFilters {
    company_id?: number
    code?: string
}

export interface UserFilters extends BaseFilters {
    role_id?: number
    company_id?: number
    branch_id?: number
    email?: string
}

export interface ProductFilters extends BaseFilters {
    company_id?: number
    category_id?: number
    track_stock?: boolean
    sku?: string
    min_price?: number
    max_price?: number
    in_stock?: boolean
    low_stock?: boolean
}

export interface CategoryFilters extends BaseFilters {
    company_id?: number
    slug?: string
}

export interface StockFilters {
    product_id?: number
    branch_id?: number
    company_id?: number
    low_stock?: boolean
    page?: number
    per_page?: number
}

// export interface StockMovementFilters {
//     product_id?: number
//     branch_id?: number
//     to_branch_id?: number
//     type?: StockMovementType
//     user_id?: number
//     date_from?: string
//     date_to?: string
//     page?: number
//     per_page?: number
//     sort_by?: number
//     sort_order?: "asc" | "desc"
// }

export interface DateRangeFilter {
    start_date?: string
    end_date?: string
}

export interface PriceRangeFilter {
    min_price?: number
    max_price?: number
}