import { computed } from 'vue'
import { useAuthStore } from '@/stores'
import { UserRole } from '@/types'

/**
 * Composable pour gérer l'authentification
 */
export function useAuth() {
    const authStore = useAuthStore()

    // Computed properties
    const user = computed(() => authStore.user)
    const isAuthenticated = computed(() => authStore.isAuthenticated)
    const isLoading = computed(() => authStore.isLoading)
    const userRole = computed(() => authStore.userRole)

    // Role checks
    const isSuperAdmin = computed(() => authStore.isSuperAdmin)
    const isCompanyAdmin = computed(() => authStore.isCompanyAdmin)
    const isBranchManager = computed(() => authStore.isBranchManager)
    const isEmployee = computed(() => authStore.isEmployee)

    // User info
    const userCompanyId = computed(() => authStore.userCompanyId)
    const userBranchId = computed(() => authStore.userBranchId)
    const userFullName = computed(() => authStore.user?.full_name || '')
    const userEmail = computed(() => authStore.user?.email || '')

    // Methods
    const login = authStore.login
    const logout = authStore.logout
    const register = authStore.register
    const checkAuth = authStore.checkAuth
    const refreshUser = authStore.refreshUser

    /**
     * Vérifie si l'utilisateur a une permission spécifique
     */
    const hasPermission = (permission: string): boolean => {
        return authStore.hasPermission(permission)
    }

    /**
     * Vérifie si l'utilisateur a au moins un des rôles
     */
    const hasAnyRole = (roles: UserRole[]): boolean => {
        return userRole.value ? roles.includes(userRole.value) : false
    }

    /**
     * Vérifie si l'utilisateur peut accéder à une entreprise
     */
    const canAccessCompany = (companyId: number): boolean => {
        return authStore.canAccessCompany(companyId)
    }

    /**
     * Vérifie si l'utilisateur peut accéder à une branche
     */
    const canAccessBranch = (branchId: number): boolean => {
        return authStore.canAccessBranch(branchId)
    }

    /**
     * Vérifie si l'utilisateur peut gérer les entreprises
     */
    const canManageCompanies = computed(() => {
        return isSuperAdmin.value || isCompanyAdmin.value
    })

    /**
     * Vérifie si l'utilisateur peut gérer les branches
     */
    const canManageBranches = computed(() => {
        return isSuperAdmin.value || isCompanyAdmin.value
    })

    /**
     * Vérifie si l'utilisateur peut gérer les produits
     */
    const canManageProducts = computed(() => {
        return isSuperAdmin.value || isCompanyAdmin.value || isBranchManager.value
    })

    /**
     * Vérifie si l'utilisateur peut gérer les stocks
     */
    const canManageStock = computed(() => {
        return isSuperAdmin.value || isCompanyAdmin.value || isBranchManager.value
    })

    /**
     * Vérifie si l'utilisateur peut transférer du stock
     */
    const canTransferStock = computed(() => {
        return isSuperAdmin.value || isCompanyAdmin.value
    })

    return {
        // State
        user,
        isAuthenticated,
        isLoading,
        userRole,

        // Role checks
        isSuperAdmin,
        isCompanyAdmin,
        isBranchManager,
        isEmployee,

        // User info
        userCompanyId,
        userBranchId,
        userFullName,
        userEmail,

        // Methods
        login,
        logout,
        register,
        checkAuth,
        refreshUser,
        hasPermission,
        hasAnyRole,
        canAccessCompany,
        canAccessBranch,

        // Permissions
        canManageCompanies,
        canManageBranches,
        canManageProducts,
        canManageStock,
        canTransferStock,
    }
}