import { Company } from "./Company"

export interface Branch {
    id: number
    name: string
    code: string
    email?: string | null
    is_active: boolean
    company: Company
    phone?: string
    adddress?:string|null
    created_at:string
    updated_at:string
    deleted_at:string|null

}
export interface BranchFormData {
    name: string
    code: string
    email?: string
    phone?: string
    address?: string
    is_active?: boolean
    company_id: number
}
export interface CreateBranchRequest {
    name: string
    code: string
    email?: string
    phone?: string
    address?: string
    is_active?: boolean
    company_id: number
}
export interface UpdateBranchRequest {
    name?: string
    code?: string
    email?: string
    phone?: string
    address?: string
    is_active?: boolean
    company_id?: number
}

export interface BranchOption {
    value: number
    label: string
    code: string
    company_id?: number
}