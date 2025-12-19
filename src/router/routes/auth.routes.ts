import { RouteRecordRaw } from "vue-router";

const authRoutes: RouteRecordRaw[] = [
    {
        path:'/auth',
        component: ()=> import("@/layouts/AuthLayout.vue"),
        meta:{
            requiresAuth: false,
        },children:[
            {
                path:'login',
                name:'Login',
                component :()=> import("@views/auth/LoginView.vue"),
                meta:{
                    title: 'Connexion',
                    requiresAuth: false,
                },
            },
            {
                path:'register',
                name:'Register',
                component :()=> import("@views/auth/RegisterView.vue"),
                meta:{
                    title: 'Inscription',
                    requiresAuth: false,
                },
            },
        ]
    }
]
export default authRoutes