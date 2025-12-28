<script setup lang="ts">
import AppBadge from '@/components/common/AppBadge.vue'
import AppButton from '@/components/common/AppButton.vue'
import AppCard from '@/components/common/AppCard.vue'
import AppInput from '@/components/common/AppInput.vue'
import AppPagination from '@/components/common/AppPagination.vue'
import AppTable from '@/components/common/AppTable.vue'
import { useFilters, usePagination } from '@/composables'
import { useStockStore } from '@/stores'
import { StockMovementFilters, StockMovementType } from '@/types'
import { formatDate } from '@/utils'
import { ArrowLeft, Download, Filter, Search, TrendingDown, TrendingUp } from 'lucide-vue-next'
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const stockStore = useStockStore()

const { filters, updateFilter, hasActiveFilters, resetFilters } = useFilters<StockMovementFilters>({
  product_id: undefined,
  branch_id: undefined,
  type: undefined,
  date_from: undefined,
  date_to: undefined,
  page: 1,
  per_page: 20,
})

//Pagination
const pagination = usePagination()

const searchQuery = ref('')
const showFilters = ref(false)
const loading = ref(false)

// Movement type options
const movementTypes = [
  { value: '', label: 'Tous les types' },
  { value: StockMovementType.PURCHASE, label: 'Achat' },
  { value: StockMovementType.SALE, label: 'Vente' },
  { value: StockMovementType.TRANSFER_OUT, label: 'Transfert sortant' },
  { value: StockMovementType.TRANSFER_IN, label: 'Transfert entrant' },
  { value: StockMovementType.ADJUSTMENT, label: 'Ajustement' },
  { value: StockMovementType.RETURN, label: 'Retour' },
  { value: StockMovementType.DAMAGE, label: 'Dommage' },
  { value: StockMovementType.INITIAL, label: 'Stock initial' },
]

// Table columns
const columns = [
  { key: 'date', label: 'Date', sortable: true },
  { key: 'reference', label: 'Référence', sortable: false },
  { key: 'type', label: 'Type', sortable: false },
  { key: 'product', label: 'Produit', sortable: false },
  { key: 'branch', label: 'Branche', sortable: false },
  { key: 'quantity', label: 'Quantité', sortable: false, align: 'center' as const },
  { key: 'user', label: 'Utilisateur', sortable: false },
  { key: 'notes', label: 'Notes', sortable: false },
]

// Computed
const movements = computed(() => stockStore.movements)
const hasMovements = computed(() => movements.value.length > 0)

// Movement type badge variants
const getMovementTypeVariant = (type: StockMovementType) => {
  const variants: Record<
    StockMovementType,
    'primary' | 'success' | 'danger' | 'warning' | 'info' | 'secondary'
  > = {
    [StockMovementType.PURCHASE]: 'success',
    [StockMovementType.SALE]: 'primary',
    [StockMovementType.TRANSFER_OUT]: 'warning',
    [StockMovementType.TRANSFER_IN]: 'success',
    [StockMovementType.ADJUSTMENT]: 'info',
    [StockMovementType.RETURN]: 'warning',
    [StockMovementType.DAMAGE]: 'danger',
    [StockMovementType.INITIAL]: 'secondary',
  }
  return variants[type]
}

const getMovementTypeLabel = (type: StockMovementType) => {
  return movementTypes.find(t => t.value === type)?.label || type
}

// Methods
const fetchMovements = async () => {
  loading.value = true
  try {
    const response = await stockStore.fetchMovements({
      ...filters.value,
      page: pagination.currentPage.value,
      per_page: pagination.perPage.value,
    })

    if (response.meta) {
      pagination.updateFromMeta(response.meta)
    }
  } catch (error) {
    console.error('Error fetching movements:', error)
  } finally {
    loading.value = false
  }
}

const handlePageChange = (page: number) => {
  pagination.goToPage(page)
  updateFilter('page', page)
  fetchMovements()
}

const handleSearch = (value: string | number) => {
  searchQuery.value = String(value)
  // TODO: Implement search
}

const handleExport = () => {
  // TODO: Implement export
  console.log('Export movements')
}

const goBack = () => {
  router.push({ name: 'StockList' })
}

// Lifecycle
onMounted(() => {
  fetchMovements()
})
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <AppButton variant="ghost" icon @click="goBack">
          <ArrowLeft class="h-5 w-5" />
        </AppButton>
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Historique des mouvements</h1>
          <p class="text-gray-600 mt-1">
            Consultez l'historique complet de tous les mouvements de stock
          </p>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <AppButton variant="outline" size="sm" @click="handleExport">
          <Download class="w-5 h-5 mr-4" />
        </AppButton>
      </div>
    </div>

    <!-- Stats Card -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <AppCard :padding="false">
        <div class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 mb-1">Total mouvements</p>
              <p class="text-2xl font-bold text-gray-900">{{ pagination.total }}</p>
            </div>
            <div class="p-3 rounded-full bg-blue-100">
              <TrendingUp class="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
      </AppCard>

      <AppCard :padding="false">
        <div class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 mb-1">Entrées</p>
              <p class="text-2xl font-bold text-green-600">
                {{ movements.filter(m => m.is_incoming).length }}
              </p>
            </div>
            <div class="p-3 rounded-full bg-green-100">
              <TrendingUp class="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>
      </AppCard>

      <AppCard :padding="false">
        <div class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 mb-1">Sorties</p>
              <p class="text-2xl font-bold text-red-600">
                {{ movements.filter(m => m.is_outcoming).length }}
              </p>
            </div>
            <div class="p-3 rounded-full bg-red-100">
              <TrendingDown class="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </AppCard>

      <AppCard :padding="false">
        <div class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 mb-1">Aujourd'hui</p>
              <p class="text-2xl font-bold text-purple-600">
                {{
                  movements.filter(m => {
                    const today = new Date().toDateString()
                    const movementDate = new Date(m.created_at).toDateString()
                    return today === movementDate
                  }).length
                }}
              </p>
            </div>
            <div class="p-3 rounded-full bg-purple-100">
              <TrendingUp class="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </AppCard>
    </div>

    <!-- Fiter Bar -->
    <AppCard :padding="false">
      <div class="p-4">
        <div class="flex items-center gap-4">
          <!-- Search -->
          <AppInput
            :model-value="searchQuery"
            @update:model-value="handleSearch"
            type="search"
            placeholder="Rechercher par produit,réference..."
          >
            <template #prepend>
              <Search class="w-5 h-5 text-gray-400" />
            </template>
          </AppInput>
        </div>
        <!-- Fiter toggle -->
        <AppButton
          variant="outline"
          @click="showFilters != showFilters"
          :class="{ 'bg-primary-50 border-primary-600 text-primary-600': hasActiveFilters }"
        >
          <Filter class="w-5 h-5 mr-2" />
          Filtres
        </AppButton>
      </div>
      <!-- Filter pannel -->
      <div v-if="showFilters" class="mt-4 pt-4 border-t border-gray-200">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <!-- Type filters -->
          <div>
            <label for="" class="block text-sm font-medium text-gray-700 mb-1.5">
              Type de mouvement
            </label>
            <select
              :value="filters.type"
              @change="
                updateFilter(
                  'type',
                  (($event.target as HTMLSelectElement).value as StockMovementType) || undefined
                )
              "
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option v-for="type in movementTypes" :key="type.value" :value="type.value">
                {{ type.label }}
              </option>
            </select>
          </div>
          <!-- Date from -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5"> Du </label>
            <AppInput
              :model-value="filters.date_from || ''"
              @update:model-value="updateFilter('date_from', $event as string)"
              type="date"
            />
          </div>

          <!-- Date To -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5"> Au </label>
            <AppInput
              :model-value="filters.date_to || ''"
              @update:model-value="updateFilter('date_to', $event as string)"
              type="date"
            />
          </div>

          <!-- Actions -->
          <div class="flex items-end gap-2">
            <AppButton variant="outline" size="sm" @click="resetFilters" class="flex-1">
              Réinitialiser
            </AppButton>
            <AppButton variant="primary" size="sm" @click="fetchMovements" class="flex-1">
              Appliquer
            </AppButton>
          </div>
        </div>
      </div>
    </AppCard>

    <!-- Movement table -->
    <AppCard v-if="hasMovements" :padding="false">
      <div class="overflow-x-auto">
        <AppTable
          :columns="columns"
          :data="movements"
          :loading="loading"
          empty-text="Aucun mouvement trouvé"
          hoverable
        >
          <!-- date -->
          <template #cell-date="{ row }">
            <div>
              <p class="font-meduim text-gray-900">{{ formatDate(row.created_at) }}</p>
              <p class="text-xs text-gray-500">
                {{
                  new Date(row.created_at).toLocaleTimeString('fr-FR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                }}
              </p>
            </div>
          </template>

          <!-- reference -->
          <template #cell-reference="{ row }">
            <span class="font-mono text-sm text-gray-700">{{ row.reference }}</span>
          </template>
          <!-- Type -->
          <template #cell-type="{ row }">
            <AppBadge :variant="getMovementTypeVariant(row.type)" size="sm">
              {{ getMovementTypeLabel(row.type) }}
            </AppBadge>
          </template>

          <!-- Product -->
          <template #cell-product="{ row }">
            <div>
              <p class="font-medium text-gray-900">{{ row.product.name }}</p>
              <p class="text-xs text-gray-500 font-mono">{{ row.product.sku }}</p>
            </div>
          </template>

          <!-- Branch -->
          <template #cell-branch="{ row }">
            <div>
              <p class="font-medium text-gray-900">{{ row.branch.name }}</p>
              <p v-if="row.to_branch" class="text-xs text-gray-500">→ {{ row.to_branch.name }}</p>
            </div>
          </template>

          <!-- Quantity -->
          <template #cell-quantity="{ row }">
            <div class="flex items-center justify-center gap-2">
              <TrendingUp v-if="row.is_incoming" class="w-4 h-4 text-green-600" />
              <TrendingDown v-else class="w-4 h-4 text-red-600" />
              <span :class="['font-bold', row.is_incoming ? 'text-green-600' : 'text-red-600']">
                {{ row.is_incoming ? '+' : '-' }}{{ Math.abs(row.quantity) }}
              </span>
            </div>
          </template>

          <!-- User -->
          <template #cell-user="{ row }">
            <div>
              <p class="text-sm text-gray-900">{{ row.user.full_name }}</p>
              <p v-if="row.user.email" class="text-xs text-gray-500">{{ row.user.email }}</p>
            </div>
          </template>

          <!-- Notes -->
          <template #cell-notes="{ row }">
            <p v-if="row.notes" class="text-sm text-gray-600 max-w-xs truncate">
              {{ row.notes }}
            </p>
            <span v-else class="text-sm text-gray-400">-</span>
          </template>
        </AppTable>
      </div>
    </AppCard>

    <!-- Empty State -->
    <AppCard v-else-if="!loading">
      <div class="text-center py-12">
        <TrendingUp class="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Aucun mouvement</h3>
        <p class="text-gray-600">L'historique des mouvements apparaîtra ici</p>
      </div>
    </AppCard>

    <!-- Pagination -->
    <AppPagination
      v-if="hasMovements && pagination.totalPages.value > 1"
      :current-page="pagination.currentPage.value"
      :per-page="pagination.perPage.value"
      :total-pages="pagination.totalPages.value"
      :total="pagination.total.value"
      @update:current-page="handlePageChange"
    />
  </div>
</template>
