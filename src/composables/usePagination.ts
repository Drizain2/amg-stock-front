import { PaginationMeta } from "@/types"
import { computed, ref } from "vue"
import { number } from "yup"

/**
 * Composable pour gérer la pagination
 */
export function usePagination(initialPerpage = 10) {
    const currentPage = ref(1)
    const perPage = ref(initialPerpage)
    const lastPage = ref(1)
    const total = ref(0)
    const from = ref(0)
    const to = ref(0)

    //Computed
    const hasNextPage = computed(() => currentPage.value < lastPage.value)
    const hasPreviousPage = computed(() => currentPage.value > 1)
    const totalPages = computed(() => lastPage.value)
    const isEmpty = computed(() => total.value === 0)

    /**
     * Va à une page specifique
     */

    const goToPage = (page: number) => {
        if (page >= 1 && page <= lastPage.value) {
            currentPage.value = page
        }
    }

    /**
     * Va sur la page suivante
     */
    const nextPage = () => {
        if (hasNextPage.value) {
            currentPage.value++
        }
    }
    /**
     * Va sur la page precedente
     */
    const previousPage = () => {
        if (hasPreviousPage.value) {
            currentPage.value--
        }
    }

    /**
     * Va a la premier page
     */
    const firstPage = () => {
        currentPage.value = 1
    }
    /**
     * Va a la dernière page
     */
    const golastPage = () => {
        currentPage.value = lastPage.value
    }

    /**
     * Changer le nombre d'element par page
     */
    const changePerPage = (newPerPage: number) => {
        perPage.value = newPerPage
        currentPage.value = 1
    }

    /**
     * Met à jour les données de pagination depuis l'API
     */
    const updateFromMeta = (meta: PaginationMeta) => {
        currentPage.value = meta.current_page
        lastPage.value = meta.last_page
        perPage.value = meta.per_page
        total.value = meta.total
        to.value = meta.to || 0
        from.value = meta.from || 0
    }
    /**
     * 
     * Obtenir les parametres de pagination pour API
     */
    const getParams = () => {
        return {
            page: currentPage.value,
            per_page: perPage.value
        }
    }

    /**
     * Réinitialise la pagination
     */
    const reset = () => {
        currentPage.value = 1
        perPage.value = initialPerpage
        total.value = 0
        lastPage.value = 0
        from.value = 0
        to.value = 0
    }

    /**
     * Calcule les numéros de pages à afficher
     */
    const getPageNumbers = (maxPages = 5) => {
        const pages: number[] = []
        const half = Math.floor(maxPages / 2)

        let start = Math.max(1, currentPage.value - half)
        let end = Math.min(lastPage.value, start + maxPages - 1)

        if (end - start < maxPages - 1) {
            start = Math.max(1, end - maxPages + 1)
        }

        for (let i = start; i <= end; i++) {
            pages.push(i)
        }

        return pages
    }

    return {
        //State
        currentPage,
        perPage,
        total,
        lastPage,
        from,
        to,

        //Computed
        hasNextPage,
        hasPreviousPage,
        totalPages,
        isEmpty,

        //Methods
        goToPage,
        nextPage,
        previousPage,
        firstPage,
        golastPage,
        changePerPage,
        updateFromMeta,
        reset,
        getPageNumbers,
        getParams
    }
}