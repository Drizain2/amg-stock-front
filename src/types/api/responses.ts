import { PaginatedResponse } from "../common/pagination"
import { Branch } from "../models/Branch"
import { Category } from "../models/Category"
import { Company } from "../models/Company"
import { Product } from "../models/Product"
import { Role } from "../models/Role"
import { Stock } from "../models/Stock"
import { StockMovement } from "../models/StockMovement"
import { User } from "../models/Users"


// ============================================
// RÉPONSES GÉNÉRIQUES
// ============================================

export interface MessageResponse {
    message: string
}

export interface ApiResponse<T> {
    data?: T
    message?: string
    success?: boolean
}

export interface HealthCheckResponse {
    status: string
    message: string
    timestamp: string
}

// ============================================
// AUTHENTIFICATION
// ============================================

export interface AuthResponse {
    message: string
    user: User
    token: string
}
export interface LoginResponse extends AuthResponse { }
export interface RegisterRespone extends AuthResponse { }

export interface MeResponse {
    user: User
}
export interface LogoutResponse {
    message: string
}
// ============================================
// USER
// ============================================

export interface UserResponse {
    message?: string
    user: User
}
export interface UserCreatedResponse {
    message: string
    user: User
}

export interface UserUpdatedResponse {
    message: string
    user: User
}

export interface UserDeletedResponse {
    message: string
}

export interface UsersResponse extends PaginatedResponse<User> {}

// ============================================
// ROLE
// ============================================
export interface RolesResponse {
    roles: Role[]
}
export interface RoleResponse {
    role: Role
}

// ============================================
// COMPANY
// ============================================
export interface CompanyResponse {
    message: string
    company: Company
}
export interface CreatedCompanyResponse {
    message: string
    company: Company
}
export interface UpdatedCompanyResponse {
    message: string
    company: Company
}
export interface DeletedCompanyResponse {
    message: string
}

export interface CompanyRestoredResponse {
    message: string
    company: Company
}

export interface CompaniesTrashedResponse extends PaginatedResponse<Company> {}

// ============================================
// BRANCH
// ============================================

export interface BranchResponse {
    message?: string
    branch: Branch
}

export interface BranchesResponse extends PaginatedResponse<Branch> {}

export interface BranchCreatedResponse {
    message: string
    branch: Branch
}

export interface BranchUpdatedResponse {
    message: string
    branch: Branch
}

export interface BranchDeletedResponse {
    message: string
}

export interface BranchRestoredResponse {
    message: string
    branch: Branch
}

export interface BranchesTrashedResponse extends PaginatedResponse<Branch> {}

export interface BranchesByCompanyResponse {
    branches: Branch[]
}

// ============================================
// CATEGORY
// ============================================

export interface CategoryResponse {
    message?: string
    category: Category
}

export interface CategoriesResponse extends PaginatedResponse<Category> { }

export interface CategoryCreatedResponse {
    message: string
    category: Category
}

export interface CategoryUpdatedResponse {
    message: string
    category: Category
}

export interface CategoryDeletedResponse {
    message: string
}

// ============================================
// PRODUCT
// ============================================

export interface ProductResponse {
    message?: string
    product: Product
}

export interface ProductsResponse extends PaginatedResponse<Product> { }

export interface ProductCreatedResponse {
    message: string
    product: Product
}

export interface ProductUpdatedResponse {
    message: string
    product: Product
}

export interface ProductDeletedResponse {
    message: string
}

export interface ProductRestoredResponse {
    message: string
    product: Product
}

export interface ProductsTrashedResponse extends PaginatedResponse<Product> { }

// ============================================
// STOCK
// ============================================

export interface StockResponse {
    message?: string
    stock: Stock
}

export interface StocksResponse {
    data: Stock[]
}

export interface StocksByBranchResponse {
    data: Stock[]
}

export interface StocksByProductResponse {
    products: Product
    stocks: Stock[]
    total_stock: number
    total_available: number
}

export interface LowStockResponse {
    count: number
    stocks: Stock[]
}

// ============================================
// STOCK MOVEMENT
// ============================================

export interface StockMovementResponse {
    message?: string
    movement: StockMovement
}

export interface StockMovementsResponse extends PaginatedResponse<StockMovement> { }

// export interface AdjustStockResponse {
//     message: string
//     movement: StockMovement
// }

// export interface TransferStockResponse {
//     message: string
//     out_movement: StockMovement
//     in_movement: StockMovement
// }

// ============================================
// ERREURS
// ============================================

export interface ErrorResponse {
    message: string
    errors?: Record<string, string[]>
    status?: number
    error?: string
}

export interface ValidationErrorResponse {
    message: string
    errors: Record<string, string[]>
}

// ============================================
// UPLOAD
// ============================================

export interface UploadResponse {
    message: string
    url: string
    path: string
    filename: string
    size: number
}

// ============================================
// STATISTIQUES / DASHBOARD
// ============================================

export interface DashboardStatsResponse {
    total_products: number
    total_stock_value: number
    low_stock_products: number
    total_movements_today: number
    recent_movements: StockMovement[]
    stock_by_branch: Array<{
        branch_id: number
        branch_name: string
        total_stock: number
        low_stock_count: number
    }>
}