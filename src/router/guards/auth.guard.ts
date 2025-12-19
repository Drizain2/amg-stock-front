import { useAuthStore } from "@/stores"
import { RouteLocationNormalized, NavigationGuardNext } from "vue-router"
export const authGuard = (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext
) => {
    const authStore = useAuthStore()
    const isAuthenticated = authStore.isAuthenticated
    const requiresAuth = to.meta.requiresAuth !== false

    //Routes publique(ne neccessite pas de connexion)
    const publicRoutes = ["Login", "Register", "ForgetPassword", "NotFound"]
    const isPublicRoute = publicRoutes.includes(to.name as string)

    if (requiresAuth && !isPublicRoute) {
        //Route Protegée
        if (!isAuthenticated) {
            //NOn connecté, redirection vers login
            next({
                name: "Login",
                query: { redirect: to.fullPath },
            })
            return
        }
    } else if (isPublicRoute && isAuthenticated) {
        //Déjà connecté et tentative d'accès à une page
        //Rediriger vers le dashboard
        next({ name: "Dashboard" })
        return
    }
    //Authoriser la navigation
    next()
}