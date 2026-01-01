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
    const stocksByBranch = ref<Map<number, Stock[]>>(new Map())
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

    const getAllBranchesStocks = computed(()=>{
        const branchStocks: Array<{
            branchId: number
            stocks: Stock[]
            branchName: string
            branchCode:string
            totalValue: number
            lowStockCount: number
        }>=[]
        stocksByBranch.value.forEach((stocks, branchId)=>{
            const branch=stocks[0]?.branch
            if(branch){
                const totalValue=stocks.reduce((sum,stock)=>sum + stock.quantity * (stock.product?.selling_price || 0),0)
                const lowStockCount=stocks.filter(s=>s.is_low_stock).length
                branchStocks.push({
                    branchId: branch.id,
                    stocks,
                    branchName: branch.name,
                    branchCode: branch.code,
                    totalValue,
                    lowStockCount
                })
            }
        })
        return branchStocks
    })
    // Actions
    const fetchStocksByBranch = async (branchId?:number) => {
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

    const fetchAllCompanyStocks = async (branches:Array<{id:number}>)=>{
       try{
        isLoading.value=true
        stocksByBranch.value.clear()

        const promises =branches.map(branch=>stockService.getByBranch(branch.id).then(stocks=>{
            stocksByBranch.value.set(branch.id,stocks)
            return stocks
        }).catch(error=>{
            console.error(`Erreur lors du chargement des stocks pour la branche ID ${branch.id}:`, error)
            return []
        }))
        await Promise.all(promises)

        // consolider tous les stocks
        const allStocks:Stock[]=[]
        stocksByBranch.value.forEach(stocks=>{
            allStocks.push(...stocks)
        })
        stocks.value=allStocks
        return allStocks
       }
       catch (error) {
            console.error('Erreur lors du chargement des stocks de toutes les branches:', error)
            throw error
        } finally {
            isLoading.value = false
        }
    }

    const fetchStocksByProduct = async (productId: number) => {
        console.log('Fetching stocks for product ID:', productId)
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
            await fetchStocksByBranch()

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
        stocksByBranch,

        // Getters
        hasStocks,
        hasLowStocks,
        lowStockCount,
        totalStockValue,
        getStockByProduct,
        getStockByBranch,
        getAllBranchesStocks,

        // Actions
        fetchStocksByBranch,
        fetchStocksByProduct,
        adjustStock,
        transferStock,
        fetchMovements,
        fetchLowStocks,
        reset,
        fetchAllCompanyStocks,
    }
})
