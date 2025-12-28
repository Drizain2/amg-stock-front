import { type PaginatedResponse, Stock, StocksByProductResponse, AdjustStockRequest, StockMovement, AdjustStockResponse, TransferStockRequest, TransferStockResponse, StockMovementFilters, LowStockResponse } from "@/types"
import { objectToQueryString } from "@/utils"
import apiClient from "./axios.config"

/**
 * Service de gestion des produits
 */
class StockService {
    private readonly basePath = "/stocks"

    /**
     * Liste tous les stocks d'une branche
     */
    async getByBranch(brancId: number): Promise<Stock[]> {
        const { data } = await apiClient.get<{ data: Stock[] }>(`${this.basePath}/branch/${brancId}`)
        return data.data
    }
    /**
     * Récupére les stocks d'un produit dans toutes les branches
     */
    async getByProduct(productId: number): Promise<StocksByProductResponse> {
        const { data } = await apiClient.get<StocksByProductResponse>(`${this.basePath}/product/${productId}`)
        return data
    }

    /**
     * Ajuste le stock
     */
    async adjust(adjustData: AdjustStockRequest): Promise<StockMovement> {
        const { data } = await apiClient.post<AdjustStockResponse>(`${this.basePath}/adjust`, adjustData)
        return data.movement
    }

    /**
     * Transfert de stock
     */
    async transfer(transferData: TransferStockRequest): Promise<{
        out_movement: StockMovement
        in_movement: StockMovement
    }> {
        const { data } = await apiClient.post<TransferStockResponse>(`${this.basePath}/transfer`, transferData)
        return {
            out_movement: data.out_movement,
            in_movement: data.in_movement
        }
    }

    /**
     * Récupére lhistorique des movements de stock
     */
    async getMovements(filters?: StockMovementFilters): Promise<PaginatedResponse<StockMovement>> {
        const querySting = filters ? objectToQueryString(filters) : ""
        const url = querySting ? `${this.basePath}/movements?${querySting}` : `${this.basePath}/movements`
        const { data } = await apiClient.get<PaginatedResponse<StockMovement>>(url)

        return data
    }

    /**
     * Recuperer les produit avec stock faible
     */
    async getLowStock(branchId?: number): Promise<Stock[]> {
        const querySting = branchId ? `?branch_id=${branchId}` : ""
        console.log('query',querySting)
        const { data } = await apiClient.get<LowStockResponse>(`${this.basePath}/low-stock${querySting}`)
        return data.stocks
    }
}

export default new StockService()