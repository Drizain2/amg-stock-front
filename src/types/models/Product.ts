import { ProductUnit } from "../common/enums"
import { StockMovement } from "./StockMovement"


export interface Product {
    id: number
    name: string
    sku: string
    description?: string | null
    image?: string | null
    cost_price?: number | null
    selling_price: number
    tax_rate: number
    margin?: number
    margin_percent?: number | null
    alert_quantity: number
    unit: ProductUnit
    is_active: boolean
    track_stock: boolean
    company_id: number
    category_id?: number | null
    company?: {
        id: number
        name: string
        email?: string
    }
    category?: {
        id: number
        name: string
        slug: string
    } | null
    created_at: string
    updated_at: string
    deleted_at?: string | null
}

export interface ProductFormData {
    id: number
    name: string
    sku: string
    description?: string | null
    image?: string | null
    cost_price?: number | null
    selling_price: number
    tax_rate: number
    alert_quantity: number
    unit?: ProductUnit
    is_active?: boolean
    tract_stock?: boolean
    company_id: number
    branch_id: number
    quantity: number
    category_id?: number | null
}
export interface CreatedProductRequest {
    name: string
    sku: string
    description?: string | null
    image?: string | null
    cost_price: number
    selling_price: number
    tax_rate?: number
    alert_quantity: number
    unit?: ProductUnit
    is_active?: boolean
    tract_stock?: boolean
    company_id: number
    category_id?: number | null
    branch_id: number
    quantity: number
}
export interface UpdateProductRequest {
    name?: string
    sku?: string
    description?: string | null
    image?: string | null
    cost_price?: number
    selling_price?: number
    tax_rate?: number
    alert_quantity?: number
    unit?: ProductUnit
    is_active?: boolean
    tract_stock?: boolean
    company_id?: number
    category_id?: number | null
}

export interface ProductOption {
    value: number
    label: string
    sku: string
    unit: ProductUnit
    selling_price: number
}

export interface InitialStockData{
    branch_id: number
    quantity: number
    unit_cost?: number
    notes?:string
}

export interface CreateProductWithStockRequest{
    // Product data
  name: string
  sku: string
  description?: string | null
  image?: string | null
  cost_price: number
  selling_price: number
  tax_rate?: number
  alert_quantity: number
  unit?: ProductUnit
  is_active?: boolean
  track_stock?: boolean
  company_id: number
  category_id?: number | null
  
  // Initial stocks for branches
  initial_stocks?: InitialStockData[]
}

export interface ProductWithStockResponse {
  message: string
  product: Product
  stocks: Array<{
    branch_id: number
    branch_name: string
    quantity: number
    movement: StockMovement
  }>
}

// src/types/api/responses.ts (ajout)
