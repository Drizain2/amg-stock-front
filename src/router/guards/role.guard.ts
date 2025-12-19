import { useAuthStore } from "@/stores"
import { UserRole } from "@/types"
import { RouteLocationNormalized, NavigationGuardNext } from "vue-router"

export const roleGuard = (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext
) => {
    const authStore = useAuthStore()
    const user = authStore.user
    const requiredRoles = to.meta.roles as UserRole[]

    //Si aucun role n'est requis,authoriser
    if (!requiredRoles || requiredRoles.length === 0) {
        next()
        return
    }

    //verifier si l'utilisateur est connecté
    if (!user) {
        next({ name: "Login" })
        return
    }

    //Verifier si l'utilisateur a un des roles
    const userRole = user.role.name
    const hasRequiredRole = requiredRoles.includes(userRole)

    if (!hasRequiredRole) {
        //Pas les permissions nécessaires
        next({
            name: 'Forbiden',
            params: { message: "Vous n'avez pas les permissions nécessaires pour acceder à cette page" }
        })
        return
    }

    next()
}
//Verifier si l'utilisateur à un role special
export const hasRole = (role: UserRole): boolean => {
    const authStore = useAuthStore()
    return authStore.user?.role.name === role
}

//Helper pour verifier si l'utilisateur a au moin un des roles
export const hasAnyRole = (roles: UserRole[]): boolean => {
    const authStore = useAuthStore()
    const userRole = authStore.user?.role.name
    return userRole ? roles.includes(userRole) : false
}

/**
 * Helper pour verifier les permissions par role
 */
export const can = (permission: string): boolean => {
    const authStore = useAuthStore()
    const user = authStore.user

    if (!user) return false

    const userRole = user.role.name

    //Permission par rôle
    const permissions: Record<UserRole, string[]> = {
        [UserRole.SUPER_ADMIN]: ["*"],//Toutes les permissions
        [UserRole.COMPANY_ADMIN]: [
            'manage.branches',
            'manage.products',
            'manage.stock',
            'manage.users',
            'view.reports',
            'transfer.stock',
            'adjust.stock'
        ],
        [UserRole.BRANCH_MANAGER]: ['manage.products',
            'manage.stock', 'view.reports', 'adjust.stock'],
        [UserRole.EMPLOYEE]: ["view.products", 'view.stock']
    }
    const userPermission = permissions[userRole] || []

    if (userPermission.includes("*")) return true

    return userPermission.includes(permission)
}