
//=========================================
// AUTHENTIFICATION
//===========================================
export interface LoginRequest {
    email: string
    password: string
}

export interface RegisterRequest {
    email: string
    password: string
    password_confirmation: string
    first_name: string
    last_name: string
    role_id?: number
    company_id?: number
    branch_id?: number
}

export interface ResetPasswordRequest {
    email: string
}

export interface UpdatePasswordRequest {
    current_password: string
    password: string
    password_confirmation: string
}

//=========================================
// COMPANY
//===========================================

// export interface CreateCompanyRequest {
//     name: string
//     email?: string
//     phone?: string
//     address?: string
//     tax_id?: string
//     is_active?: boolean
// }

// export interface UpdateCompanyRequest {
//     name?: string
//     email?: string
//     phone?: string
//     address?: string
//     tax_id?: string
//     is_active?: boolean
// }

export interface ReserveStockRequest {
    product_id: number
    branch_id: number
    quantity: number
    notes?: string
}
export interface ReleaseStockRequest {
    product_id: number
    branch_id: number
    quantity: number
    notes?: string
}

//==============================
// UPLOAD
//==============================

export interface UploadFileRequest {
    file: File
    folder?: string
}

export interface UploadImageRequest {
    image: File
    folder?: string
    max_width?: number
    max_height?: number
}