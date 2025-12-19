import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type {
    Stock,
    StockMovement,
    AdjustStockRequest,
    TransferStockRequest,
    StockMovementFilters,
} from '@/types'
import { stockService } from '@/services'
import { useToast } from 'vue-toastification'

const toast = useToast()

export const useStockStore = defineStore('stock', () => {
    // State
    const stocks = ref<Stock[]>([])
    const movements = ref<StockMovement[]>([])
    const lowStocks = ref<Stock[]>([])
    const isLoading = ref(false)
    const pagination = ref({
        current_page: 1,
        last_page: 1,
        per_page: 20,
        total: 0,
    })

    // Getters
    const hasStocks = computed(() => stocks.value.length > 0)

    const hasLowStocks = computed(() => lowStocks.value.length > 0)

    const lowStockCount = computed(() => lowStocks.value.length)

    const totalStockValue = computed(() => {
        return stocks.value.reduce((total, stock) => {
            return total + stock.quantity * (stock.product?.selling_price || 0)
        }, 0)
    })

    const getStockByProduct = computed(() => {
        return (productId: number) => stocks.value.filter(s => s.product.id === productId)
    })

    const getStockByBranch = computed(() => {
        return (branchId: number) => stocks.value.filter(s => s.branch.id === branchId)
    })

    // Actions
    const fetchStocksByBranch = async (branchId: number) => {
        try {
            isLoading.value = true
            const fetchedStocks = await stockService.getByBranch(branchId)
            stocks.value = fetchedStocks
            return fetchedStocks
        } catch (error) {
            console.error('Erreur lors du chargement des stocks:', error)
            throw error
        } finally {
            isLoading.value = false
        }
    }

    const fetchStocksByProduct = async (productId: number) => {
        try {
            isLoading.value = true
            const response = await stockService.getByProduct(productId)
            return response
        } catch (error) {
            console.error('Erreur lors du chargement des stocks:', error)
            throw error
        } finally {
            isLoading.value = false
        }
    }

    const adjustStock = async (data: AdjustStockRequest) => {
        try {
            isLoading.value = true
            const movement = await stockService.adjust(data)

            // Ajouter le mouvement à la liste
            movements.value.unshift(movement)

            // Rafraîchir les stocks de la branche
            await fetchStocksByBranch(data.branch_id)

            toast.success('Stock ajusté avec succès')
            return movement
        } catch (error) {
            toast.error("Erreur lors de l'ajustement du stock")
            throw error
        } finally {
            isLoading.value = false
        }
    }

    const transferStock = async (data: TransferStockRequest) => {
        try {
            isLoading.value = true
            const result = await stockService.transfer(data)

            // Ajouter les mouvements
            movements.value.unshift(result.out_movement, result.in_movement)

            toast.success('Stock transféré avec succès')
            return result
        } catch (error) {
            toast.error('Erreur lors du transfert du stock')
            throw error
        } finally {
            isLoading.value = false
        }
    }

    const fetchMovements = async (filters?: StockMovementFilters) => {
        try {
            isLoading.value = true
            const response = await stockService.getMovements(filters)

            movements.value = response.data

            if (response.meta) {
                pagination.value = {
                    current_page: response.meta.current_page,
                    last_page: response.meta.last_page,
                    per_page: response.meta.per_page,
                    total: response.meta.total,
                }
            }

            return response
        } catch (error) {
            console.error('Erreur lors du chargement des mouvements:', error)
            throw error
        } finally {
            isLoading.value = false
        }
    }

    const fetchLowStocks = async (branchId?: number) => {
        try {
            isLoading.value = true
            const fetchedStocks = await stockService.getLowStock(branchId)
            lowStocks.value = fetchedStocks
            return fetchedStocks
        } catch (error) {
            console.error('Erreur lors du chargement des stocks faibles:', error)
            throw error
        } finally {
            isLoading.value = false
        }
    }

    const reset = () => {
        stocks.value = []
        movements.value = []
        lowStocks.value = []
        pagination.value = {
            current_page: 1,
            last_page: 1,
            per_page: 20,
            total: 0,
        }
    }

    return {
        // State
        stocks,
        movements,
        lowStocks,
        isLoading,
        pagination,

        // Getters
        hasStocks,
        hasLowStocks,
        lowStockCount,
        totalStockValue,
        getStockByProduct,
        getStockByBranch,

        // Actions
        fetchStocksByBranch,
        fetchStocksByProduct,
        adjustStock,
        transferStock,
        fetchMovements,
        fetchLowStocks,
        reset,
    }
})
