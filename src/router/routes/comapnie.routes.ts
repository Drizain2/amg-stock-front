import { UserRole } from "@/types";
import { RouteRecordRaw } from "vue-router";


const companyRoutes: RouteRecordRaw[] = [
    {
        path: '/companies',
        component: () => import("@layouts/DashboardLayout.vue"),
        meta: {
            requiresAuth: true,
            roles: [UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN]
        },
        children: [{
            path: '',
            name: 'CompanyList',
            component: () => import("@views/companies/CompaniesView.vue"),
            meta: {
                name: "Entreprise",
                requiresAuth: true,
                roles: [UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN]
            }
        },
        {
            path: 'create',
            name: 'CompanyCreate',
            component: () => import("@views/companies/CompanyFormView.vue"),
            meta: {
                name: "Créer une entreprise",
                requireAuth: true,
                roles: [UserRole.SUPER_ADMIN],
            }
        },
        {
            path: ':id',
            name: 'CompanyDetails',
            component: () => import("@views/companies/CompanyDetailsView.vue"),
            meta: {
                name: "Détails de l'entreprise",
                requireAuth: true,
                roles: [UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN],
            }
        }, {
            path: ':id/edit',
            name: 'CompanyEdit',
            component: () => import("@views/companies/CompanyFormView.vue"),
            meta: {
                name: "Modifier l'entreprise",
                requireAuth: true,
                roles: [UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN],
            }

        }
        ]
    }
]

export default companyRoutes;