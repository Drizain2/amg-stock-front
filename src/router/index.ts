import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import productRoutes from "./routes/products.routes";
import stockRoutes from "./routes/stocks.routes";
import { authGuard } from "./guards/auth.guard";
import { roleGuard } from "./guards/role.guard";
import authRoutes from "./routes/auth.routes";
import branchRoutes from "./routes/branche.routes";
import companyRoutes from "./routes/comapnie.routes";
import dashboardRoutes from "./routes/dasboard.routes";


const routes: RouteRecordRaw[] = [
    //Redirection racine vers dashboard
    {
        path: '/',
        redirect: '/dashboard',
    },
    // Routes d'authentification (publique)
    ...authRoutes,

    // Routes protéteés (nécessitent authentification)
    ...dashboardRoutes,
    ...companyRoutes,
    ...branchRoutes,
    ...productRoutes,
    ...stockRoutes,

    //Route 404 - Page non trouvée
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import("@views/errors/NotFoundView.vue"),
        meta: {
            title: 'Page non trouvée'
        }
    }
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        } else {
            return { top: 0 }
        }
    },
})

//Guards globaux
router.beforeEach(authGuard)
router.beforeEach(roleGuard)

//Mise à jour du titre de la page
router.afterEach(to=>{
    const baseTitle= import.meta.env.VITE_APP_TITLE || "Stock Management"
    document.title = to.meta.title ? `${to.meta.title} - ${baseTitle}`: baseTitle
})
export default router;