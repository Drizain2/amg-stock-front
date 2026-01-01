import { type ProductFilters, type PaginatedResponse, type Product, ProductResponse,  UpdateProductRequest, CreatedProductRequest, CreateProductWithStockRequest, CreateProductWithStockResponse } from "@/types"
import { objectToQueryString } from "@/utils"
import apiClient from "./axios.config"

/**
 * Service de gestion des produits
 */
class ProductService {
    private readonly basePath = "/products"

    /**
     * Liste toutes les produits avec pagination et filtres
     */
    async getAll(filters?: ProductFilters): Promise<PaginatedResponse<Product>> {
        const querySting = filters ? objectToQueryString(filters) : ""
        const url = querySting ? `${this.basePath}?${querySting}` : this.basePath
        const { data } = await apiClient.get<PaginatedResponse<Product>>(url)
        return data
    }

    /**
     * Recuperer un produit par son ID
     */
    async getById(id: number): Promise<Product> {
        const { data } = await apiClient.get<ProductResponse>(`${this.basePath}/${id}`)
        return data.product
    }

    /**
     * Créer une produit
     */
    async create(productData: CreatedProductRequest): Promise<Product> {
        const { data } = await apiClient.post<ProductResponse>(this.basePath, productData)
        return data.product
    }

    /**
     * Créer une produit avec stock initial
     */
    async createWithStock(productData: CreateProductWithStockRequest):Promise<CreateProductWithStockResponse>{
        const {data} = await apiClient.post<CreateProductWithStockResponse>(`${this.basePath}/with-stock`, productData)
        return data
    }
    /**
     * Mettre à jour une produit
     */
    async update(id: number, productData: UpdateProductRequest): Promise<Product> {
        const { data } = await apiClient.put<ProductResponse>(`${this.basePath}/${id}`, productData)
        return data.product
    }

    /**
     * Supprimer une produit
     */
    async delete(id: number): Promise<void> {
        await apiClient.delete(`${this.basePath}/${id}`)
    }

    /**
     * Restaure une produit supprimée
     */
    async restore(id: number): Promise<Product> {
        const { data } = await apiClient.post<ProductResponse>(
            `${this.basePath}/${id}/restore`
        )
        return data.product
    }

    /**
     * Liste des produit supprimées
     */
    async getTrashed(): Promise<PaginatedResponse<Product>> {
        const { data } = await apiClient.get<PaginatedResponse<Product>>(`${this.basePath}/rashed/list`)
        return data
    }
}

export default new ProductService()