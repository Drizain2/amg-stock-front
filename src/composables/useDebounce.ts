import { ref, watch, type Ref } from 'vue'

/**
 * Composable pour debouncer une valeur
 */
export function useDebounce<T>(value: Ref<T>, delay = 300): Ref<T> {
    const debouncedValue = ref(value.value) as Ref<T>
    let timeout: ReturnType<typeof setTimeout> | null = null

    watch(value, newValue => {
        if (timeout) {
            clearTimeout(timeout)
        }

        timeout = setTimeout(() => {
            debouncedValue.value = newValue
        }, delay)
    })

    return debouncedValue
}

/**
 * Composable pour debouncer une fonction
 */
export function useDebounceFn<T extends (...args: any[]) => any>(
    fn: T,
    delay = 300
): (...args: Parameters<T>) => void {
    let timeout: ReturnType<typeof setTimeout> | null = null
    return (...args: Parameters<T>) => {
        if (timeout) {
            clearTimeout(timeout)
        }

        timeout = setTimeout(() => {
            fn(...args)
        }, delay)
    }
}