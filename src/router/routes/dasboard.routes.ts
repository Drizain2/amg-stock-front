import { UserRole } from "@/types";
import { RouteRecordRaw } from "vue-router";

const dashboardRoutes : RouteRecordRaw[] = [
    {
        path:'/dashboard',
        component: ()=> import("@layouts/DashboardLayout.vue"),
        meta:{
            requiresAuth: true,
        },children: [
            {path:"",
            name :"Dashboard",
            component: ()=> import("@views/dashboard/DasboardView.vue"),
            meta: {
                title:"Tableau de bord",
                
                requiresAuth: true,
                roles : [
                    UserRole.SUPER_ADMIN,
                    UserRole.COMPANY_ADMIN,
                    UserRole.BRANCH_MANAGER,
                    UserRole.EMPLOYEE,
                ]
            }
        }
        ]
    }
]
export default dashboardRoutes