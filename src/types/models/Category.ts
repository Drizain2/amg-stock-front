import { Company } from "./Company"

export interface Category {
    id: number
    name: number
    slug: string
    descrption?: string | null
    is_active: boolean
    company_id: number
    company: Company
    created_at: string
    updated_at: string
    deleted_at?: string | null
}

export interface CategoryFormData {
    name: string
    descriptions?: string
    slug?: string
    is_active?: boolean
    company_id: number
}

export interface CreateCategoryRequest {
    name: string
    descriptions?: string
    slug?: string
    is_active?: boolean
    company_id: number
}
export interface UpdateCategoryRequest {
    name?: string
    descriptions?: string
    slug?: string
    is_active?: boolean
    company_id?: number
}

export interface CategoryOption {
    value: number
    label: string
    slug: string
}