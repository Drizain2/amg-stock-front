import { Branch } from "./Branch"

export interface Company {
    id: number
    name: string
    email?: string | null
    phone?: string | null
    address?: string | null
    tax_rate: string
    is_active: boolean
    branches?: Branch[]
    created_at: string
    updated_at: string
    deleted_at?: string | null
}
export interface CompanyFormData {
    name: string
    email?: string
    phone?: string
    address?: string
    tax_id?: string
    is_active?: boolean
}

export interface CreateCompanyRequest {
    name: string
    email?: string
    phone?: string
    address?: string
    tax_id?: string
    is_active?: boolean
}

export interface UpdateCompanyRequest {
    name?: string
    email?: string
    phone?: string
    address?: string
    tax_id?: string
    is_active?: boolean
}

export interface CompanyOption {
    value: number
    label: string
    email?: string
}