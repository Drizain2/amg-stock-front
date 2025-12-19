import { useToast as useVueToast } from 'vue-toastification'

/**
 * Composable pour gérer les notifications toast
 */
export function useToast() {
    const toast = useVueToast()

    /**
     * Affiche un toast de succès
     */
    const success = (message: string, duration = 3000) => {
        toast.success(message, { timeout: duration })
    }

    /**
     * Affiche un toast d'erreur
     */
    const error = (message: string, duration = 5000) => {
        toast.error(message, { timeout: duration })
    }

    /**
     * Affiche un toast d'avertissement
     */
    const warning = (message: string, duration = 4000) => {
        toast.warning(message, { timeout: duration })
    }

    /**
     * Affiche un toast d'information
     */
    const info = (message: string, duration = 3000) => {
        toast.info(message, { timeout: duration })
    }

    /**
     * Affiche un toast de chargement
     */
    const loading = (message: string) => {
        return toast.info(message, {
            timeout: false,
            closeButton: false,
            closeOnClick: false,
        })
    }

    /**
     * Ferme tous les toasts
     */
    const clear = () => {
        toast.clear()
    }

    /**
     * Affiche un toast personnalisé
     */
    const custom = (
        message: string,
        type: 'success' | 'error' | 'warning' | 'info' = 'info',
        options?: any
    ) => {
        toast[type](message, options)
    }

    return {
        success,
        error,
        warning,
        info,
        loading,
        clear,
        custom,
        toast, // Instance originale pour des cas avancés
    }
}
