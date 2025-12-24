<script setup lang="ts">
import AppBadge from '@/components/common/AppBadge.vue'
import AppButton from '@/components/common/AppButton.vue'
import AppCard from '@/components/common/AppCard.vue'
import AppInput from '@/components/common/AppInput.vue'
import AppPagination from '@/components/common/AppPagination.vue'
import AppTable from '@/components/common/AppTable.vue'
import ProductFiltersPanel from '@/components/products/ProductFiltersPanel.vue'
import { useDebounce, useFilters, usePagination, usePermissions } from '@/composables'
import { useProductStore } from '@/stores'
import { Product, ProductFilters } from '@/types'
import { formatCurrency } from '@/utils/formatters'
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Upload, Plus, Grid, List, Package, Filter, Download } from 'lucide-vue-next'
import ProductCard from '@/components/products/ProductCard.vue'
import AppModal from '@/components/common/AppModal.vue'

const router = useRouter()
const productStore = useProductStore()
const permissions = usePermissions()

// View mode (grid or table)
const viewMode = ref<'grid' | 'table'>('table')

const { filters, updateFilter, resetFilters, hasActiveFilters } = useFilters<ProductFilters>({
  search: '',
  company_id: undefined,
  category_id: undefined,
  is_active: undefined,
  track_stock: undefined,
  in_stock: undefined,
  max_price: undefined,
  min_price: undefined,
  low_stock: undefined,
  page: 1,
  per_page: 20,
})

//Pagination
const pagination = usePagination(20)

//Debounce
const debounceSearch = useDebounce(
  computed(() => filters.value.search),
  500
)

// Show filterPanel
const showFilters = ref(false)

// Selected products for bulk actions
const selectedProducts = ref<number[]>([])

// Loading state
const loading = ref(false)

// Table columns
const columns = [
  { key: 'image', label: '', width: '60px' },
  { key: 'name', label: 'Produit', sortable: true },
  { key: 'sku', label: 'SKU', sortable: true },
  { key: 'category', label: 'Catégorie', sortable: false },
  { key: 'price', label: 'Prix', sortable: true, align: 'right' as const },
  { key: 'stock', label: 'Stock', sortable: false, align: 'center' as const },
  { key: 'status', label: 'Statut', sortable: false, align: 'center' as const },
  { key: 'actions', label: 'Actions', width: '120px', align: 'right' as const },
]

// Computed
const products = computed(() => productStore.products)
const hasProducts = computed(() => productStore.hasProducts)
const canCreate = computed(() => permissions.products.value.canCreate)
const canEdit = computed(() => permissions.products.value.canEdit)
const canDelete = computed(() => permissions.products.value.canDelete)

//Methods
const fetchProducts = async () => {
  loading.value = true
  try {
    const response = await productStore.fetchProducts({
      ...filters.value,
      page: pagination.currentPage.value,
      per_page: pagination.perPage.value,
    })

    if (response.meta) {
      pagination.updateFromMeta(response.meta)
    }
  } catch (error) {
    console.error('erreur lors de la recuperation', error)
  } finally {
    loading.value = false
  }
}

const handlePageChange = (page: number) => {
  ;(pagination.goToPage(page), updateFilter('page', page))
}

const handleSearch = (value: string | number) => {
  updateFilter('search', String(value))
  pagination.firstPage()
}

const handleFilterChange = (newFilters: Partial<ProductFilters>) => {
  Object.entries(newFilters).forEach(([key, value]) => {
    updateFilter(key as keyof ProductFilters, value)
  })
  pagination.firstPage()
}

const handleResetFilters = () => {
  ;(resetFilters(), pagination.reset(), (showFilters.value = false))
}

const toggleSelectAll = () => {
  if (selectedProducts.value.length === products.value.length) {
    selectedProducts.value = []
  } else {
    selectedProducts.value = products.value.map(p => p.id)
  }
}

const toggleSelect = (productId: number) => {
  const index = selectedProducts.value.indexOf(productId)
  if (index > -1) {
    selectedProducts.value.splice(index, 1)
  } else {
    selectedProducts.value.push(productId)
  }
}

const isSelected = (productId: number) => {
  return selectedProducts.value.includes(productId)
}
const goToCreate = () => {
  router.push({ name: 'ProductCreate' })
}
const goToDetail = (products: Product) => {
  router.push({ name: 'ProductDetails', params: { id: products.id } })
}
const goToEdit = (products: Product) => {
  router.push({ name: 'ProductEdit', params: { id: products.id } })
}
const isOpen =ref(false)
const handleOpen = () => {
  isOpen.value = !isOpen.value
}
const handleDelete = async (products: Product) => {
  if (confirm(`Êtes vous sûr de vouloir supprimer ${products.name} ?`)) {
    try {
      productStore.deleteProduct(products.id)
      await fetchProducts()
    } catch (error) {
      console.error('Error deleting product:', error)
    }
  }
}

const handleBulkDelete = async () => {
  if (selectedProducts.value.length === 0) return

  if (confirm(`Supprimer ${selectedProducts.value.length} produit(s) ?`)) {
    try {
      for (const id of selectedProducts.value) {
        await productStore.deleteProduct(id)
      }
      selectedProducts.value = []
      await fetchProducts()
    } catch (error) {
      console.error('Error deleting products:', error)
    }
  }
}

const handleExport = () => {
  // TODO: Implement export functionality
  console.log('Export products')
}

const handleImport = () => {
  // TODO: Implement import functionality
  console.log('Import products')
}

//Watchers
watch(debounceSearch, () => {
  fetchProducts()
})

watch(
  () => pagination.currentPage.value,
  () => {
    fetchProducts()
  }
)
// Lifecycle
onMounted(() => {
  fetchProducts()
})
</script>
<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-centers justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Produits</h1>
        <p class="text-gray-600 mt-1">
          Gérez votre catalogue de produits
          <span v-if="pagination.total.value > 0" class="text-gray-500">
            ({{ pagination.total }} produit{{ pagination.total.value > 1 ? 's' : '' }})
          </span>
        </p>
      </div>

      <div class="flex items-center gap-3">
        <!-- Export /Import -->
        <AppButton variant="outline" size="sm" @click="handleImport">
          <Upload class="w-4 h-4 mr-2" />
          Importer
        </AppButton>
        <AppButton variant="outline" size="sm" @click="handleExport">
          <Download class="w-4 h-4 mr-2" />
          Exporter
        </AppButton>

        <!-- Create button -->
        <AppButton v-if="canCreate" variant="primary" @click="goToCreate">
          <Plus class="w-5 h-5 mr-2" />
          Nouveau produit
        </AppButton>
      </div>
    </div>

    <!-- Filters Bar -->
    <AppCard :padding="false">
      <div class="p-4 space-y-4">
        <div class="flex items-center gap-4">
          <!-- Search -->
          <div class="flex-1">
            <AppInput
              :model-value="filters.search || ''"
              @update:model-value="handleSearch"
              type="search"
              placeholder="Rechercher par nom, SKU..."
              class="w-full"
            >
              <template #prepend>
                <svg
                  class="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </template>
            </AppInput>
          </div>

          <!-- Filter toggle -->
          <AppButton
            variant="outline"
            @click="showFilters = !showFilters"
            :class="{ 'bg-primary-50 border-primary-600 text-primary-600': hasActiveFilters }"
          >
            <Filter class="w-4 h-4 mr-2" />
            Filtres
            <span
              v-if="hasActiveFilters"
              class="ml-2 px-2 py-0.5 bg-primary-600 text-white text-xs rounded-full"
            >
              {{ Object.keys(filters).filter(k => filters[k as keyof ProductFilters]).length }}
            </span>
          </AppButton>

          <!-- View Mode toggle -->
          <div class="flex items-center gap-1 border-gray-300 rounded-lg p-1">
            <button
              @click="viewMode = 'table'"
              :class="[
                'p-2 rounded transition-colors',
                viewMode === 'table'
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100',
              ]"
            >
              <List class="w-4 h-4" />
            </button>
            <button
              @click="viewMode = 'grid'"
              :class="[
                'p-2 rounded transition-colors',
                viewMode === 'grid'
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100',
              ]"
            >
              <Grid class="w-4 h-4" />
            </button>
          </div>
        </div>

        <!-- Active filters -->
        <div class="flex items-center gap-2 flex-wrap">
          <span class="text-sm text-gray-600">Filtes actifs: </span>
          <AppBadge
            v-for="(value, key) in filters"
            :key="key"
            v-show="value"
            variant="primary"
            size="sm"
            class="cursor-pointer"
            @click="updateFilter(key as keyof ProductFilters, undefined)"
          >
            {{ key }} : {{ value }}
            <svg class="w-3 h-3 ml-1" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clip-rule="evenodd"
              />
            </svg>
          </AppBadge>
          <button
            @click="handleResetFilters"
            class="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            Tout effacer
          </button>
        </div>
      </div>

      <!-- Filtre panel -->
      <ProductFiltersPanel
        v-if="showFilters"
        :filters="filters"
        @update:filters="handleFilterChange"
        @reset="handleResetFilters"
        class="border-t border-gray-200"
      />
    </AppCard>

    <!-- Bulk actions -->
    <div
      v-if="selectedProducts.length > 0"
      class="bg-primary-50 border border-primary-200 rounded-lg p-4"
    >
      <div class="flex items-center justify-between">
        <span class="text-sm font-medium text-primary-900">
          {{ selectedProducts.length }} produit(s) sélectionné(s)
        </span>
        <div class="flex items-center gap-2">
          <AppButton variant="outline" size="sm" @click="selectedProducts = []">
            Annuler
          </AppButton>
          <AppButton v-if="canDelete" variant="danger" size="sm" @click="handleBulkDelete">
            Supprimer
          </AppButton>
        </div>
      </div>
    </div>

    <!-- Products List/Grid -->
    <AppCard v-if="hasProducts" :padding="false">
      <!-- Table view -->
      <div v-if="viewMode === 'table'" class="overflow-x-auto">
        <AppTable
          :columns="columns"
          :data="products"
          :loading="loading"
          empty-text="Aucun produit trouvé"
          hoverable
        >
          <!-- Checkbox column -->
          <template #cell-checkbox="{ row }">
            <input
              type="checkbox"
              :checked="isSelected(row.id)"
              @change="toggleSelect(row.id)"
              class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
          </template>

          <!-- Image -->
          <template #cell-image="{ row }">
            <div
              class="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center"
            >
              <img
                v-if="row.image"
                :src="row.image"
                :alt="row.name"
                class="w-full h-full object-cover"
              />
              <Package v-else class="w-6 h-6 text-gray-400" />
            </div>
          </template>

          <!-- Name -->
          <template #cell-name="{ row }">
            <div>
              <button
                @click="goToDetail(row)"
                class="font-medium text-gray-900 hover:text-primary-600 transition-colors"
              >
                {{ row.name }}
              </button>
              <p v-if="row.description" class="text-xs text-gray-500 mt-0.5 truncate max-w-xs">
                {{ row.description }}
              </p>
            </div>
          </template>
          <!-- SKU -->
          <template #cell-sku="{ row }">
            <span class="font-mono text-sm text-gray-700">{{ row.sku }}</span>
          </template>

          <!-- Category -->
          <template #cell-category="{ row }">
            <AppBadge v-if="row.category" variant="secondary" size="sm">
              {{ row.category.name }}
            </AppBadge>
            <span v-else class="text-sm text-gray-400">-</span>
          </template>

          <!-- Price -->
          <template #cell-price="{ row }">
            <div class="text-right">
              <p class="font-semibold text-gray-900">{{ formatCurrency(row.selling_price) }}</p>
              <p v-if="row.cost_price" class="text-xs text-gray-500">
                Coût: {{ formatCurrency(row.cost_price) }}
              </p>
            </div>
          </template>

          <!-- Stock -->
          <template #cell-stock="{ row }">
            <div class="flex items-center justify-center gap-2">
              <AppBadge variant="info" size="sm"> Stock suivi </AppBadge>
            </div>
          </template>

          <!-- Status -->
          <template #cell-status="{ row }">
            <AppBadge :variant="row.is_active ? 'success' : 'secondary'" size="sm">
              {{ row.is_active ? 'Actif' : 'Inactif' }}
            </AppBadge>
          </template>

          <!-- Actions -->
          <template #cell-actions="{ row }">
            <div class="flex items-center justify-end gap-2">
              <AppButton
                variant="ghost"
                size="sm"
                icon
                @click="goToDetail(row)"
                title="Voir les détails"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </AppButton>
              <AppButton
                v-if="canEdit"
                variant="ghost"
                size="sm"
                icon
                @click="goToEdit(row)"
                title="Modifier"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </AppButton>
              <AppButton
                v-if="canDelete"
                variant="ghost"
                size="sm"
                icon
                @click="handleDelete(row)"
                title="Supprimer"
                class="text-danger-600 hover:bg-danger-50"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </AppButton>
            </div>
          </template>
        </AppTable>
      </div>
      <div v-if="viewMode ==='grid'" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <div v-for="value in products">
            <ProductCard :product="value" :key="value.id"   :selectable="true"/>
        </div>
      </div>
    </AppCard>
    <!-- Pagination -->
    <AppPagination
      v-if="hasProducts && pagination.totalPages.value > 1"
      :current-page="pagination.currentPage.value"
      :total-pages="pagination.totalPages.value"
      :per-page="pagination.perPage.value"
      :total="pagination.total.value"
      @update:current-page="handlePageChange"
    />
  </div>

  <AppModal v-model="isOpen" title="Créer un produit" size="lg">
  <form>
    <!-- Formulaire -->
  </form>
  
  
  <template #footer>
    <AppButton variant="outline" @click="isOpen = false">
      Annuler
    </AppButton>
    <AppButton variant="primary">
      Créer
    </AppButton>
  </template>
</AppModal>
</template>
