import { StockMovementType } from "../common/enums"

export interface StockMovement {
    id: number
    reference: string
    type: StockMovementType
    quantity: number
    unit_cost?: number | null
    notes?: string
    is_incoming: boolean
    is_outcoming: boolean
    product: {
        id: number
        name: string
        sku: string
    }
    branch: {
        id: number
        name: string
        code: string
    }
    to_branch?: {
        id: number
        name: string
        code: string
    } | null
    user: {
        id: number
        full_name: string
        email?: string
    }
    product_id: number
    branch_id: number
    to_branch_id?: number | null
    producuser_idt_id: number
    created_at: string
    updated_at: string
}
export interface StockMovementFilters {
    product_id?: number
    branch_id?: number
    type?: StockMovementType
    date_from?: string
    date_to?: string
    page?: number
    per_page?: number
}
export interface TransferStockResponse {
    message: string
    out_movement: StockMovement
    in_movement: StockMovement
}

export interface AdjustStockResponse {
    message: string
    movement: StockMovement
}

export interface StockMovementSummary {
    total_movements: number
    incoming_movements: number
    outgoing_movements: number
    total_incomming_quantity: number
    total_outgoing_quantity: number
    movements_by_type: Record<StockMovementType, number>
}