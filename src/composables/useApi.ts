import { ApiException } from "@/types"
import { ref } from "vue"
import { useToast } from "vue-toastification"

const toast = useToast()
/**
 * Composable pour gerer les appels Api
 */
export function useApi<T = any>() {
    const data = ref<T | null>(null)
    const error = ref<ApiException | null>(null)
    const isLoading = ref(false)
    const isSuccess = ref(false)
    const isError = ref(false)

    /**
     * Excécute une  fonction async avec gestion d'etat
     */
    const execute = async (apiFunction: () => Promise<T>, options?: {
        showSuccessToast?: boolean
        successMessage?: string
        errorMessage?: string
        showErrorToast?: boolean
    }): Promise<T | null> => {
        const {
            showSuccessToast = false,
            successMessage = "Operation réussie",
            showErrorToast = true,
            errorMessage,
        } = options || {}
        try {
            isLoading.value = true
            isError.value = false
            isSuccess.value = false
            error.value = null

            const result = await apiFunction()
            data.value = result
            isSuccess.value = true

            if (showSuccessToast) {
                toast.success(successMessage)
            }

            return result
        } catch (err) {
            isError.value = true
            error.value = err as ApiException

            if (showErrorToast) {
                const message = errorMessage || (err as ApiException).message || "Une erreur s'est produites"
                toast.error(message)
            }
            return null
        } finally {
            isLoading.value = false
        }
    }

    /**
     * Réinitialise l'etat
     */
    const reset = () => {
        data.value = null
        error.value = null
        isLoading.value = false
        isSuccess.value = false
        isError.value = false
    }

    return {
        data, error, isLoading, isSuccess, isError, execute, reset
    }
}