import { UserRole } from "../common/enums"

export interface Role {
    id: number
    name: UserRole
    label: string
    is_active: boolean
    description?: string|null
    level: number
    created_at:string
    updated_at:string
}
export interface RoleOption {
    value: number
    label: string
    name:string
    level: number
    description?:string
}

export interface RolePermissions{
    canManageCompanies:boolean
    canManageBranches:boolean
    canManageUsers:boolean
    canManageProducts:boolean
    canManageStocks:boolean
    canViewReports:boolean
    canTransferStock:boolean
    canAdjustStock:boolean
}