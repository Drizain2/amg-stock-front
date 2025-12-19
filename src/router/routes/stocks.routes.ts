import { UserRole } from "@/types";
import { RouteRecordRaw } from "vue-router";

const stockRoutes: RouteRecordRaw[] = [
    {
        path: "/stocks",
        component: () => import("@layouts/DashboardLayout.vue"),
        meta: {
            requiresAuth: true,
        },
        // children: [
        //     {
        //         path: '',
        //         name: "StockList",
        //         component: () => import("@views/stocks/StocksView.vue"),
        //         meta: {
        //             title: "Gestion des stocks",
        //             requiresAuth: true,
        //             roles: [
        //                 UserRole.SUPER_ADMIN,
        //                 UserRole.COMPANY_ADMIN,
        //                 UserRole.BRANCH_MANAGER,
        //                 UserRole.EMPLOYEE,
        //             ]
        //         }
        //     },
        //     {
        //         path: "adjust",
        //         name: "StockAdjust",
        //         component: () => import("@view/stocks/StockAdjustmentView.vue"),
        //         meta: {
        //             title: "Ajuster le stock",
        //             requiresAuth: true,
        //             roles: [UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.BRANCH_MANAGER]
        //         }
        //     },
        //     {
        //         path: "transfer",
        //         name: "StockTransfer",
        //         component: () => import("@view/stocks/StockTransferView.vue"),
        //         meta: {
        //             title: "Transfer du stock",
        //             requiresAuth: true,
        //             roles: [UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.BRANCH_MANAGER]
        //         }
        //     },
        //     {
        //         path: "movements",
        //         name: "StockMovements",
        //         component: () => import("@view/stocks/StockMovementView.vue"),
        //         meta: {
        //             title: "Historique des mouvements",
        //             requiresAuth: true,
        //             roles: [UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.BRANCH_MANAGER, UserRole.EMPLOYEE]
        //         }
        //     },
        //     {
        //         path: "low-stock",
        //         name: "LowStock",
        //         component: () => import("@view/stocks/LowStockView.vue"),
        //         meta: {
        //             title: "Stock faible",
        //             requiresAuth: true,
        //             roles: [UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.BRANCH_MANAGER, UserRole.EMPLOYEE]
        //         }
        //     },
        // ]
    }
]

export default stockRoutes;