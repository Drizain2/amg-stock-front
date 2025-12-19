import { ProductUnit } from "../common/enums"
import { Branch } from "./Branch"
import { Product } from "./Product"

export interface Stock {
    id: number
    quantity: number
    reserved_quantity: number
    available_quantity: number
    is_low_stock: boolean
    product: {
        id: number
        name: string
        sku: string
        alert_quantity: number
        unit: ProductUnit
        selling_price: number
    }
    branch: {
        id: number
        name: string
        code: string
    }
    product_id: number
    branch_id: number
    created_at: string
    updated_at: string
}

export interface StockByProduct {
    product: Product
    stock: Stock[]
    total_stock: number
    total_available: number
}

export interface StockByBranch {
    branch: Branch[]
    stocks: Stock[]
    low_stock_count: number
}

export interface AdjustStockRequest {
    product_id: number
    branch_id: number
    type: "PURCHASE" | "ADJUSTMENT" | "RETURN" | "DAMAGE"
    quantity: number
    unit_cost?: number
    notes?: string
}

export interface TransferStockRequest {
    product_id: number
    from_branch_id: number
    to_branch_id: number
    quantity: number
    notes?: string
}

export interface StockLevel {
    product_id: number
    product_name: string
    sku: string
    total_quantity: number
    available_quantity: number
    reserved_quantity: number
    branches: Array<{
        branch_id: number
        branch_name: string
        quantity: number
        available_quantiy: number
    }>
}
