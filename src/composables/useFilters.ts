import { ref, computed, watch } from 'vue'
import { debounce } from '@/utils/helpers'

/**
 * Composable pour gérer les filtres
 */
export function useFilters<T extends Record<string, any>>(initialFilters: T) {
    const filters = ref<T>({ ...initialFilters })
    const activeFiltersCount = computed(() => {
        return Object.values(filters.value).filter(value => {
            if (value === null || value === undefined || value === '') return false
            if (Array.isArray(value) && value.length === 0) return false
            return true
        }).length
    })

    const hasActiveFilters = computed(() => activeFiltersCount.value > 0)

    /**
     * Met à jour un filtre
     */
    const updateFilter = <K extends keyof T>(key: K, value: T[K]) => {
        filters.value[key] = value
    }

    /**
     * Met à jour plusieurs filtres
     */
    const updateFilters = (newFilters: Partial<T>) => {
        filters.value = { ...filters.value, ...newFilters }
    }

    /**
     * Réinitialise tous les filtres
     */
    const resetFilters = () => {
        filters.value = { ...initialFilters }
    }

    /**
     * Réinitialise un filtre spécifique
     */
    const resetFilter = <K extends keyof T>(key: K) => {
        filters.value[key] = initialFilters[key]
    }

    /**
     * Obtient les filtres actifs (non vides)
     */
    const getActiveFilters = (): Partial<T> => {
        const active: Partial<T> = {}

        Object.entries(filters.value).forEach(([key, value]) => {
            if (value !== null && value !== undefined && value !== '') {
                if (Array.isArray(value)) {
                    if (value.length > 0) {
                        active[key as keyof T] = value as T[keyof T]
                    }
                } else {
                    active[key as keyof T] = value as T[keyof T]
                }
            }
        })

        return active
    }

    /**
     * Crée un watcher debouncé sur les filtres
     */
    const watchFilters = (
        callback: (filters: T) => void,
        delay = 300
    ) => {
        const debouncedCallback = debounce(callback, delay)

        watch(
            () => filters.value,
            (newFilters) => {
                debouncedCallback(newFilters)
            },
            { deep: true }
        )
    }

    /**
     * Vérifie si un filtre est actif
     */
    const isFilterActive = <K extends keyof T>(key: K): boolean => {
        const value = filters.value[key]
        if (value === null || value === undefined || value === '') return false
        if (Array.isArray(value) && value.length === 0) return false
        return true
    }

    return {
        filters,
        activeFiltersCount,
        hasActiveFilters,
        updateFilter,
        updateFilters,
        resetFilters,
        resetFilter,
        getActiveFilters,
        watchFilters,
        isFilterActive,
    }
}
