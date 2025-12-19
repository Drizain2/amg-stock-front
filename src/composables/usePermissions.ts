import { computed } from 'vue'
import { useAuthStore } from '@/stores'
import { UserRole } from '@/types'

/**
 * Composable pour gérer les permissions
 */
export function usePermissions() {
    const authStore = useAuthStore()

    const userRole = computed(() => authStore.userRole)
    const isSuperAdmin = computed(() => authStore.isSuperAdmin)
    const isCompanyAdmin = computed(() => authStore.isCompanyAdmin)
    const isBranchManager = computed(() => authStore.isBranchManager)
    const isEmployee = computed(() => authStore.isEmployee)

    /**
     * Permissions pour la gestion des entreprises
     */
    const companies = computed(() => ({
        canView: isSuperAdmin.value || isCompanyAdmin.value,
        canCreate: isSuperAdmin.value,
        canEdit: isSuperAdmin.value || isCompanyAdmin.value,
        canDelete: isSuperAdmin.value,
        canRestore: isSuperAdmin.value,
    }))

    /**
     * Permissions pour la gestion des branches
     */
    const branches = computed(() => ({
        canView: true, // Tous peuvent voir
        canCreate: isSuperAdmin.value || isCompanyAdmin.value,
        canEdit: isSuperAdmin.value || isCompanyAdmin.value,
        canDelete: isSuperAdmin.value || isCompanyAdmin.value,
        canRestore: isSuperAdmin.value || isCompanyAdmin.value,
    }))

    /**
     * Permissions pour la gestion des produits
     */
    const products = computed(() => ({
        canView: true, // Tous peuvent voir
        canCreate: isSuperAdmin.value || isCompanyAdmin.value || isBranchManager.value,
        canEdit: isSuperAdmin.value || isCompanyAdmin.value || isBranchManager.value,
        canDelete: isSuperAdmin.value || isCompanyAdmin.value || isBranchManager.value,
        canRestore: isSuperAdmin.value || isCompanyAdmin.value,
    }))

    /**
     * Permissions pour la gestion des stocks
     */
    const stocks = computed(() => ({
        canView: true, // Tous peuvent voir
        canAdjust: isSuperAdmin.value || isCompanyAdmin.value || isBranchManager.value,
        canTransfer: isSuperAdmin.value || isCompanyAdmin.value,
        canViewMovements: true, // Tous peuvent voir l'historique
        canViewLowStock: true, // Tous peuvent voir les alertes
    }))

    /**
     * Permissions pour la gestion des utilisateurs
     */
    const users = computed(() => ({
        canView: isSuperAdmin.value || isCompanyAdmin.value,
        canCreate: isSuperAdmin.value || isCompanyAdmin.value,
        canEdit: isSuperAdmin.value || isCompanyAdmin.value,
        canDelete: isSuperAdmin.value || isCompanyAdmin.value,
        canManageRoles: isSuperAdmin.value,
    }))

    /**
     * Permissions pour les rapports
     */
    const reports = computed(() => ({
        canView: true, // Tous peuvent voir les rapports
        canExport: isSuperAdmin.value || isCompanyAdmin.value || isBranchManager.value,
        canViewAll: isSuperAdmin.value,
        canViewCompany: isSuperAdmin.value || isCompanyAdmin.value,
        canViewBranch: true,
    }))

    /**
     * Vérifie si l'utilisateur peut effectuer une action sur une ressource
     */
    const can = (resource: string, action: string): boolean => {
        const permissions: Record<string, any> = {
            companies: companies.value,
            branches: branches.value,
            products: products.value,
            stocks: stocks.value,
            users: users.value,
            reports: reports.value,
        }

        const resourcePermissions = permissions[resource]
        if (!resourcePermissions) return false

        const permissionKey = `can${action.charAt(0).toUpperCase()}${action.slice(1)}`
        return resourcePermissions[permissionKey] || false
    }

    /**
     * Vérifie si l'utilisateur a au moins une des permissions
     */
    const canAny = (permissions: Array<{ resource: string; action: string }>): boolean => {
        return permissions.some(({ resource, action }) => can(resource, action))
    }

    /**
     * Vérifie si l'utilisateur a toutes les permissions
     */
    const canAll = (permissions: Array<{ resource: string; action: string }>): boolean => {
        return permissions.every(({ resource, action }) => can(resource, action))
    }

    /**
     * Obtient toutes les permissions de l'utilisateur
     */
    const getAllPermissions = () => {
        return {
            companies: companies.value,
            branches: branches.value,
            products: products.value,
            stocks: stocks.value,
            users: users.value,
            reports: reports.value,
        }
    }

    return {
        // Role checks
        userRole,
        isSuperAdmin,
        isCompanyAdmin,
        isBranchManager,
        isEmployee,

        // Permissions par ressource
        companies,
        branches,
        products,
        stocks,
        users,
        reports,

        // Methods
        can,
        canAny,
        canAll,
        getAllPermissions,
    }
}
