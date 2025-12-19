import { UserRole } from "@/types";
import { RouteRecordRaw } from "vue-router";

const productRoutes : RouteRecordRaw[]=[
    {
        path:"/products",
        component:()=> import ("@layouts/DashboardLayout.vue"),
        meta:{
            requiresAuth: true,
        },
        // children:[
        //     {
        //         path:"",
        //         name:"ProductList",
        //         component:()=> import ("@views/products/ProductView.vue"),
        //         meta:{
        //             title:"Produits",
        //             requiresAuth:true,
        //             roles:[
        //                 UserRole.SUPER_ADMIN,
        //                 UserRole.COMPANY_ADMIN,
        //                 UserRole.BRANCH_MANAGER,
        //                 UserRole.EMPLOYEE,
        //             ]
        //         }
        //     },
        //     {
        //         path:'create',
        //         name:'ProductCreate',
        //         component:()=>import("@views/products/ProductFormView.vue"),
        //         meta:{
        //             title:'Créer un produit',
        //             requiresAuth:true,
        //             roles:[
        //                 UserRole.SUPER_ADMIN,
        //                 UserRole.COMPANY_ADMIN,
        //                 UserRole.BRANCH_MANAGER,
        //             ]
        //         }
        //     },
        //     {
        //         path:':id',
        //         name:'ProductDetails',
        //         component:()=>import("@views/products/ProductDetailsView.vue"),
        //         meta:{
        //             title:"Details du produit",
        //             requiresAuth:true,
        //             roles:[
        //                 UserRole.SUPER_ADMIN,
        //                 UserRole.COMPANY_ADMIN,
        //                 UserRole.BRANCH_MANAGER,
        //                 UserRole.EMPLOYEE,
        //             ]
        //         }
        //     },
        //     {
        //         path:':id/edit',
        //         name:'ProductDetails',
        //         component:()=>import("@views/products/ProductFormView.vue"),
        //         meta:{
        //             title:"Modifier le produit",
        //             requiresAuth:true,
        //             roles:[
        //                 UserRole.SUPER_ADMIN,
        //                 UserRole.COMPANY_ADMIN,
        //                 UserRole.BRANCH_MANAGER,
        //             ]
        //         }
        //     }
        // ]
    }
]

export default productRoutes;