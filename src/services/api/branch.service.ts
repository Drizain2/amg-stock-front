import { type BranchFilters, type PaginatedResponse, type Branch, BranchResponse, CreateCompanyRequest,  UpdateBranchRequest } from "@/types"
import { objectToQueryString } from "@/utils"
import apiClient from "./axios.config"

/**
 * Service de gestion des branches
 */
class BranchService {
    private readonly basePath = "/branches"

    /**
     * Liste toutes les branches avec pagination et filtres
     */
    async getAll(filters?: BranchFilters): Promise<PaginatedResponse<Branch>> {
        const querySting = filters ? objectToQueryString(filters) : ""
        const url = querySting ? `${this.basePath}?${querySting}` : this.basePath
        const { data } = await apiClient.get<PaginatedResponse<Branch>>(url)
        return data
    }

    /**
     * Recuperer une branche par son ID
     */
    async getById(id: number): Promise<Branch> {
        const { data } = await apiClient.get<BranchResponse>(`${this.basePath}/${id}`)
        return data.branch
    }

    /**
     * Récupere les branches d'une entreprise
     */
    async getByCompany(companyId: number):Promise<Branch[]>{
        const {data} = await apiClient.get<{branches: Branch[]}>(`/companies/${companyId}/branches`)
        return data.branches
    }

    /**
     * Créer une branche
     */
    async create(branchData: CreateCompanyRequest): Promise<Branch> {
        const { data } = await apiClient.post<BranchResponse>(this.basePath, branchData)
        return data.branch
    }

    /**
     * Mettre à jour une branche
     */
    async update(id: number, branchData: UpdateBranchRequest): Promise<Branch> {
        const { data } = await apiClient.put<BranchResponse>(`${this.basePath}/${id}`, branchData)
        return data.branch
    }

    /**
     * Supprimer une branche
     */
    async delete(id: number): Promise<void> {
        await apiClient.delete(`${this.basePath}/${id}`)
    }

    /**
     * Restaure une branche supprimée
     */
    async restore(id: number): Promise<Branch> {
        const { data } = await apiClient.post<BranchResponse>(
            `${this.basePath}/${id}/restore`
        )
        return data.branch
    }

    /**
     * Liste des branche supprimées
     */
    async getTrashed(): Promise<PaginatedResponse<Branch>> {
        const { data } = await apiClient.get<PaginatedResponse<Branch>>(`${this.basePath}/rashed/list`)
        return data
    }
}

export default new BranchService()