import { UserRole } from "@/types";
import { RouteRecordRaw } from "vue-router";


const branchRoutes : RouteRecordRaw[]=[
    {
        path: '/branches',
        component:()=> import ("@layouts/DashboardLayout.vue"),
        meta:{
            requiresAuth: true,
            roles:[UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.BRANCH_MANAGER]
        },
    //     children:[{
    //         path:'',
    //         name:'BranchesList',
    //         component:()=> import ("@views/branches/BranchListView.vue"),
    //         meta:{
    //             name:"Entreprise",
    //             requiresAuth: true,
    //             roles:[UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN,UserRole.BRANCH_MANAGER]
    //         }
    //     },
    //     {
    //         path:'create',
    //         name:'BranchCreate',
    //         component:()=> import("@views/branches/BranchFormView.vue"),
    //         meta:{
    //             name:"Créer une branche",
    //             requireAuth:true,
    //             roles:[UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN],
    //         }
    //     },
    //     {
    //         path:':id',
    //         name:'BranchDetails',
    //         component:()=>import("@views/branches/BranchDetailsView.vue"),
    //         meta:{
    //             name:"Détails de la branche",
    //             requireAuth:true,
    //             roles:[UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.BRANCH_MANAGER],
    //         }
    //     },{
    //         path:':id/edit',
    //         name:'BranchEdit',
    //         component:()=>import("@views/branches/BranchFormView.vue"),
    //         meta:{
    //             name:"Modifier la branche",
    //             requireAuth:true,
    //             roles:[UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.BRANCH_MANAGER],
    //         }
            
    //     }
    // ]
    }
]

export default branchRoutes;