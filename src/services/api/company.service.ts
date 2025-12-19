import { type CompanyFilters, type PaginatedResponse, type Company, CompanyResponse, CreateCompanyRequest, UpdatedCompanyResponse, UpdateCompanyRequest } from "@/types"
import { objectToQueryString } from "@/utils"
import apiClient from "./axios.config"
import { number } from "yup"

/**
 * Service de gedtion des companies
 */
class CompanyService {
    private readonly basePath = "/companies"

    /**
     * Liste toutes les entreprises avec pagination et filtres
     */
    async getAll(filters?: CompanyFilters): Promise<PaginatedResponse<Company>> {
        const querySting = filters ? objectToQueryString(filters) : ""
        const url = querySting ? `${this.basePath}?${querySting}` : this.basePath
        const { data } = await apiClient.get<PaginatedResponse<Company>>(url)
        return data
    }

    /**
     * Recuperer une entreprise par son ID
     */
    async getById(id: number): Promise<Company> {
        const { data } = await apiClient.get<CompanyResponse>(`${this.basePath}/${id}`)
        return data.company
    }

    /**
     * Créer une entreprise
     */
    async create(companyData: CreateCompanyRequest): Promise<Company> {
        const { data } = await apiClient.post<CompanyResponse>(this.basePath, companyData)
        return data.company
    }

    /**
     * Mettre à jour une entreprise
     */
    async update(id: number, companyData: UpdateCompanyRequest): Promise<Company> {
        const { data } = await apiClient.put<CompanyResponse>(`${this.basePath}/${id}`, companyData)
        return data.company
    }

    /**
     * Supprimer une entreprise
     */
    async delete(id: number): Promise<void> {
        await apiClient.delete(`${this.basePath}/${id}`)
    }

    /**
     * Restaure une entreprise supprimée
     */
    async restore(id: number): Promise<Company> {
        const { data } = await apiClient.post<CompanyResponse>(
            `${this.basePath}/${id}/restore`
        )
        return data.company
    }

    /**
     * Liste des entreprise supprimées
     */
    async getTrashed(): Promise<PaginatedResponse<Company>> {
        const { data } = await apiClient.get<PaginatedResponse<Company>>(`${this.basePath}/rashed/list`)
        return data
    }
}

export default new CompanyService()