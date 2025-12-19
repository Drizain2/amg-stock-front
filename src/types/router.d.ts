// src/types/router.d.ts
// Déclaration des types pour les métadonnées des routes

import 'vue-router'
import { UserRole } from './common/enums'

declare module 'vue-router' {
    interface RouteMeta {
        /**
         * Titre de la page (affiché dans le titre du navigateur)
         */
        title?: string

        /**
         * Si true, la route nécessite une authentification
         * @default true (sauf pour les routes publiques)
         */
        requiresAuth?: boolean

        /**
         * Rôles autorisés à accéder à cette route
         * Si vide ou undefined, tous les utilisateurs authentifiés peuvent accéder
         */
        roles?: UserRole[]

        /**
         * Permissions spécifiques requises
         */
        permissions?: string[]

        /**
         * Layout à utiliser pour cette route
         * @default 'DashboardLayout'
         */
        layout?: 'AuthLayout' | 'DashboardLayout' | 'EmptyLayout'

        /**
         * Icône pour le menu (si applicable)
         */
        icon?: string

        /**
         * Si true, afficher dans le menu de navigation
         * @default true
         */
        showInMenu?: boolean

        /**
         * Breadcrumb personnalisé
         */
        breadcrumb?: string | string[]

        /**
         * Désactiver le scroll vers le haut
         * @default false
         */
        keepScrollPosition?: boolean
    }
}

export { }