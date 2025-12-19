import { UserRole, StockMovementType, ProductUnit } from '@/types'

// Rôles
export const ROLE_LABELS: Record<UserRole, string> = {
    [UserRole.SUPER_ADMIN]: 'Super Administrateur',
    [UserRole.COMPANY_ADMIN]: 'Administrateur Entreprise',
    [UserRole.BRANCH_MANAGER]: 'Gestionnaire de Branche',
    [UserRole.EMPLOYEE]: 'Employé',
}

export const ROLE_COLORS: Record<UserRole, string> = {
    [UserRole.SUPER_ADMIN]: 'badge-danger',
    [UserRole.COMPANY_ADMIN]: 'badge-primary',
    [UserRole.BRANCH_MANAGER]: 'badge-warning',
    [UserRole.EMPLOYEE]: 'badge-secondary',
}

// Types de mouvements de stock
export const MOVEMENT_TYPE_LABELS: Record<StockMovementType, string> = {
    [StockMovementType.PURCHASE]: 'Achat',
    [StockMovementType.SALE]: 'Vente',
    [StockMovementType.TRANSFER_OUT]: 'Transfert Sortant',
    [StockMovementType.TRANSFER_IN]: 'Transfert Entrant',
    [StockMovementType.ADJUSTMENT]: 'Ajustement',
    [StockMovementType.RETURN]: 'Retour',
    [StockMovementType.DAMAGE]: 'Dommage',
    [StockMovementType.INITIAL]: 'Stock Initial',
}

export const MOVEMENT_TYPE_COLORS: Record<StockMovementType, string> = {
    [StockMovementType.PURCHASE]: 'badge-success',
    [StockMovementType.SALE]: 'badge-primary',
    [StockMovementType.TRANSFER_OUT]: 'badge-warning',
    [StockMovementType.TRANSFER_IN]: 'badge-success',
    [StockMovementType.ADJUSTMENT]: 'badge-secondary',
    [StockMovementType.RETURN]: 'badge-warning',
    [StockMovementType.DAMAGE]: 'badge-danger',
    [StockMovementType.INITIAL]: 'badge-secondary',
}

// Unités de produit
export const PRODUCT_UNIT_LABELS: Record<ProductUnit, string> = {
    [ProductUnit.PIECE]: 'Pièce',
    [ProductUnit.KG]: 'Kilogramme',
    [ProductUnit.LITER]: 'Litre',
    [ProductUnit.METER]: 'Mètre',
    [ProductUnit.BOX]: 'Boîte',
    [ProductUnit.PACK]: 'Pack',
}

export const PRODUCT_UNIT_SYMBOLS: Record<ProductUnit, string> = {
    [ProductUnit.PIECE]: 'pcs',
    [ProductUnit.KG]: 'kg',
    [ProductUnit.LITER]: 'L',
    [ProductUnit.METER]: 'm',
    [ProductUnit.BOX]: 'box',
    [ProductUnit.PACK]: 'pack',
}

// Pagination
export const DEFAULT_PAGE_SIZE = 10
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100]

// Statuts
export const STATUS_LABELS = {
    active: 'Actif',
    inactive: 'Inactif',
}

export const STATUS_COLORS = {
    active: 'badge-success',
    inactive: 'badge-secondary',
}

// Clés de stockage local
export const STORAGE_KEYS = {
    AUTH_TOKEN: 'auth_token',
    USER: 'user',
    REMEMBER_ME: 'remember_me',
    THEME: 'theme',
    SIDEBAR_COLLAPSED: 'sidebar_collapsed',
} as const

// Messages
export const MESSAGES = {
    SUCCESS: {
        CREATED: 'Créé avec succès',
        UPDATED: 'Mis à jour avec succès',
        DELETED: 'Supprimé avec succès',
        RESTORED: 'Restauré avec succès',
        SAVED: 'Enregistré avec succès',
    },
    ERROR: {
        GENERIC: 'Une erreur est survenue',
        NETWORK: 'Erreur de connexion au serveur',
        UNAUTHORIZED: 'Vous devez être connecté',
        FORBIDDEN: 'Vous n\'avez pas les permissions nécessaires',
        NOT_FOUND: 'Ressource non trouvée',
        VALIDATION: 'Veuillez vérifier les données saisies',
    },
    CONFIRM: {
        DELETE: 'Êtes-vous sûr de vouloir supprimer ?',
        RESTORE: 'Êtes-vous sûr de vouloir restaurer ?',
        LOGOUT: 'Êtes-vous sûr de vouloir vous déconnecter ?',
    },
} as const

// Routes API
export const API_ROUTES = {
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        LOGOUT: '/auth/logout',
        ME: '/auth/me',
    },
    COMPANIES: '/companies',
    BRANCHES: '/branches',
    PRODUCTS: '/products',
    STOCKS: '/stocks',
    ROLES: '/roles',
} as const