import { Role, RoleResponse, RolesResponse } from "@/types"
import apiClient from "./axios.config"

/**
 * Service de gestion des rôles
 */
class RoleService {
    private readonly basePath = "/roles"

    /**
  * Liste tous les rôles actifs
  */
    async getAll(): Promise<Role[]> {
        const { data } = await apiClient.get<RolesResponse>(this.basePath)
        return data.roles
    }

    /**
   * Récupère un rôle par son ID
   */
    async getById(id: number): Promise<Role> {
        const { data } = await apiClient.get<RoleResponse>(`${this.basePath}/${id}`)
        return data.role
    }
}

export default new RoleService()