import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type {
    Product,
    ProductFilters,
    CreatedProductRequest,
    UpdateProductRequest,
    CreateProductWithStockResponse,
} from '@/types'
import { productService } from '@/services'
import { useToast } from 'vue-toastification'

const toast = useToast()

export const useProductStore = defineStore('product', () => {
    // State
    const products = ref<Product[]>([])
    const currentProduct = ref<Product | null>(null)
    const isLoading = ref(false)
    const pagination = ref({
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0,
    })

    // Getters
    const hasProducts = computed(() => products.value.length > 0)

    const totalProducts = computed(() => pagination.value.total)

    const activeProducts = computed(() => products.value.filter(p => p.is_active))

    const trackedProducts = computed(() => products.value.filter(p => p.track_stock))

    const getProductsByCategory = computed(() => {
        return (categoryId: number) => products.value.filter(p => p.category_id === categoryId)
    })

    // Actions
    const fetchProducts = async (filters?: ProductFilters) => {
        try {
            isLoading.value = true
            const response = await productService.getAll(filters)

            products.value = response.data

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
            console.error('Erreur lors du chargement des produits:', error)
            throw error
        } finally {
            isLoading.value = false
        }
    }

    const fetchProductById = async (id: number) => {
        try {
            isLoading.value = true
            const product = await productService.getById(id)
            currentProduct.value = product
            return product
        } catch (error) {
            console.error('Erreur lors du chargement du produit:', error)
            throw error
        } finally {
            isLoading.value = false
        }
    }

    const createProduct = async (data: CreatedProductRequest) => {
        try {
            isLoading.value = true
            const product = await productService.create(data)
            products.value.unshift(product)
            toast.success('Produit créé avec succès')
            return product
        } catch (error) {
            toast.error('Erreur lors de la création du produit')
            throw error
        } finally {
            isLoading.value = false
        }
    }

    const createProductWithStock = async(data:CreatedProductRequest):Promise<CreateProductWithStockResponse> => {
        try {
            isLoading.value = true
            const response = await productService.createWithStock(data)
            products.value.unshift(response.product)
            // Message de succès détaillé
            const branchCount = response.stocks.length
            const totalQuantity = response.stocks.reduce((sum, s) => sum + s.quantity, 0)
            
            toast.success(
                `Produit créé avec succès ! Stock initial: ${totalQuantity} unités réparties sur ${branchCount} branche${branchCount > 1 ? 's' : ''}`
            )
            return response
        } catch (error) {
            toast.error('Erreur lors de la création du produit')
            throw error
        } finally {
            isLoading.value = false
        }
    }

    const updateProduct = async (id: number, data: UpdateProductRequest) => {
        try {
            isLoading.value = true
            const product = await productService.update(id, data)

            const index = products.value.findIndex(p => p.id === id)
            if (index !== -1) {
                products.value[index] = product
            }

            if (currentProduct.value?.id === id) {
                currentProduct.value = product
            }

            toast.success('Produit mis à jour avec succès')
            return product
        } catch (error) {
            toast.error('Erreur lors de la mise à jour du produit')
            throw error
        } finally {
            isLoading.value = false
        }
    }

    const deleteProduct = async (id: number) => {
        try {
            isLoading.value = true
            await productService.delete(id)

            const index = products.value.findIndex(p => p.id === id)
            if (index !== -1) {
                products.value.splice(index, 1)
            }

            toast.success('Produit supprimé avec succès')
        } catch (error) {
            toast.error('Erreur lors de la suppression du produit')
            throw error
        } finally {
            isLoading.value = false
        }
    }

    const restoreProduct = async (id: number) => {
        try {
            isLoading.value = true
            const product = await productService.restore(id)
            products.value.unshift(product)
            toast.success('Produit restauré avec succès')
            return product
        } catch (error) {
            toast.error('Erreur lors de la restauration du produit')
            throw error
        } finally {
            isLoading.value = false
        }
    }

    const clearCurrentProduct = () => {
        currentProduct.value = null
    }

    const reset = () => {
        products.value = []
        currentProduct.value = null
        pagination.value = {
            current_page: 1,
            last_page: 1,
            per_page: 10,
            total: 0,
        }
    }

    return {
        // State
        products,
        currentProduct,
        isLoading,
        pagination,

        // Getters
        hasProducts,
        totalProducts,
        activeProducts,
        trackedProducts,
        getProductsByCategory,

        // Actions
        fetchProducts,
        fetchProductById,
        createProduct,
        updateProduct,
        deleteProduct,
        restoreProduct,
        clearCurrentProduct,
        reset,
        createProductWithStock,
    }
})
