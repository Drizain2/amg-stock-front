<script setup lang="ts">
import AppButton from '@/components/common/AppButton.vue'
import AppCard from '@/components/common/AppCard.vue'
import AppInput from '@/components/common/AppInput.vue'
import AppTable from '@/components/common/AppTable.vue'
import AppBadge from '@/components/common/AppBadge.vue'
import BranchSelector from '@/components/stocks/BranchSelector.vue'
import BranchStockCard from '@/components/stocks/BranchStockCard.vue'
import { useFilters, usePermissions } from '@/composables'
import { useAuthStore, useStockStore, useBranchStore } from '@/stores'
import { Stock, StockFilters } from '@/types'
import {
  AlertTriangle,
  ArrowLeft,
  Download,
  Package,
  Plus,
  TrendingUp,
  Search,
  Filter,
  ArrowRightLeft,
} from 'lucide-vue-next'
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { formatCurrency } from '@utils/formatters'

const router = useRouter()
const stockStore = useStockStore()
const branchStore = useBranchStore()
const authStore = useAuthStore()
const permissions = usePermissions()

// Filters
const { filters, updateFilter, resetFilter, hasActiveFilters } = useFilters<StockFilters>({
  product_id: undefined,
  branch_id: undefined,
  company_id: undefined,
  low_stock: undefined,
  page: 1,
  per_page: 20,
})

const searchQuery = ref('')
const showFilter = ref(false)
const loading = ref(false)
const selectedBranchId = ref<number | null>(null)

// Table columns
const columns = [
  { key: 'product', label: 'Produit', sortable: true },
  { key: 'branch', label: 'Branche', sortable: true },
  { key: 'quantity', label: 'Quantité', sortable: true, align: 'center' as const },
  { key: 'available', label: 'Disponible', sortable: false, align: 'center' as const },
  { key: 'reserved', label: 'Réservé', sortable: false, align: 'center' as const },
  { key: 'value', label: 'Valeur', sortable: false, align: 'right' as const },
  { key: 'status', label: 'Statut', sortable: false, align: 'center' as const },
  { key: 'actions', label: 'Actions', width: '150px', align: 'right' as const },
]

// Computed
const isCompanyAdmin = computed(() => authStore.isCompanyAdmin)
const isSuperAdmin = computed(() => authStore.isSuperAdmin)
const userBranchId = computed(() => authStore.userBranchId)
const userCompanyId = computed(() => authStore.userCompanyId)

const branches = computed(() => {
  if (isSuperAdmin.value) {
    return branchStore.branches
  }
  if (isCompanyAdmin.value && userCompanyId.value) {
    return branchStore.getBranchesByCompany(userCompanyId.value)
  }
  return []
})

const stocks = computed(() => {
  if (selectedBranchId.value) {
    return stockStore.getStockByBranch(selectedBranchId.value)
  }
  return stockStore.stocks
})

const lowStocks = computed(() => stockStore.lowStocks)
const hasStocks = computed(() => stocks.value.length > 0)
const lowStockCount = computed(() => stockStore.lowStockCount)

const totalStockValue = computed(() => {
  return stocks.value.reduce((sum, stock) => {
    return sum + stock.quantity * (stock.product?.selling_price || 0)
  }, 0)
})

const canAdjust = computed(() => permissions.stocks.value.canAdjust)
const canTransfer = computed(() => permissions.stocks.value.canTransfer)

// Quick Stats
const quickStats = computed(() => {
  const totalProducts = new Set(stocks.value.map(s => s.product.id)).size
  const totalQuantity = stocks.value.reduce((sum, s) => sum + s.quantity, 0)
  const totalAvailable = stocks.value.reduce((sum, s) => sum + s.available_quantity, 0)
  const lowStock = stocks.value.filter(s => s.is_low_stock).length

  return {
    totalProducts,
    totalAvailable,
    totalQuantity,
    totalValue: totalStockValue.value,
    lowStockCount: lowStock,
  }
})

// Branch stats for Company Admin
const branchStats = computed(() => {
  if (!isCompanyAdmin.value) return []
  return stockStore.getAllBranchesStocks
})

// Methods
const fetchStocks = async () => {
  loading.value = true
  try {
    if (isCompanyAdmin.value && branches.value.length > 0) {
      // Company Admin: charger les stocks de toutes les branches
      await stockStore.fetchAllCompanyStocks(branches.value)
    } else if (userBranchId.value) {
      // Branch Manager/Employee: charger uniquement sa branche
      await stockStore.fetchStocksByBranch(userBranchId.value)
    } else {
      // Super Admin: charger tous les stocks
      await stockStore.fetchStocksByBranch()
    }
  } catch (error) {
    console.error('Error fetching stocks', error)
  } finally {
    loading.value = false
  }
}

const handleSearch = (value: string | number) => {
  searchQuery.value = value as string
}

const goToAdjustment = (stock?: Stock) => {
  router.push({
    name: 'StockAdjust',
    query: stock
      ? {
          product_id: stock.product.id,
          branch_id: stock.branch.id,
        }
      : undefined,
  })
}

const goToTransfer = (stock?: Stock) => {
  router.push({
    name: 'StockTransfer',
    query: stock
      ? {
          product_id: stock.product.id,
          from_branch_id: stock.branch.id,
        }
      : undefined,
  })
}

const goToMovements = () => {
  router.push({ name: 'StockMovements' })
}

const goToLowStock = () => {
  router.push({ name: 'LowStock' })
}

const handleExport = () => {
  console.log('Export stocks')
}

const handleBranchChange = async (branchId: number | null) => {
  selectedBranchId.value = branchId
}

// Watchers
watch(selectedBranchId, async (newBranchId) => {
  if (newBranchId) {
    loading.value = true
    try {
      await stockStore.fetchStocksByBranch(newBranchId)
    } catch (error) {
      console.error('Error fetching branch stocks:', error)
    } finally {
      loading.value = false
    }
  }
})

// Lifecycle
onMounted(async () => {
  // Charger les branches pour Company Admin
  if (isCompanyAdmin.value && userCompanyId.value) {
    await branchStore.fetchBranchesByCompany(userCompanyId.value)
  }
  
  await fetchStocks()
})
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Gestion des Stocks</h1>
        <p class="text-gray-600 mt-1">
          {{ isCompanyAdmin ? 'Vue d\'ensemble de toutes vos branches' : 'Suivez et gérez vos stocks en temps réel' }}
        </p>
      </div>

      <div class="flex items-center gap-3">
        <AppButton variant="outline" size="sm" @click="goToMovements">
          <TrendingUp class="w-4 h-4 mr-2" />
          Historique
        </AppButton>
        <AppButton variant="outline" size="sm" @click="handleExport">
          <Download class="w-4 h-4 mr-2" />
          Exporter
        </AppButton>
        <AppButton v-if="canAdjust" variant="success" size="sm" @click="() => goToAdjustment()">
          <Plus class="w-5 h-5 mr-2" />
          Ajuster
        </AppButton>
        <AppButton v-if="canTransfer" variant="primary" size="sm" @click="() => goToTransfer()">
          <ArrowRightLeft class="w-5 h-5 mr-2" />
          Transférer
        </AppButton>
      </div>
    </div>

    <!-- Quick Stats -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      <AppCard :padding="false">
        <div class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 mb-1">Produits</p>
              <p class="text-2xl font-bold text-gray-900">{{ quickStats.totalProducts }}</p>
            </div>
            <div class="p-3 rounded-full bg-blue-100">
              <Package class="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
      </AppCard>

      <AppCard :padding="false">
        <div class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 mb-1">Quantité totale</p>
              <p class="text-2xl font-bold text-gray-900">{{ quickStats.totalQuantity }}</p>
            </div>
            <div class="p-3 rounded-full bg-green-100">
              <TrendingUp class="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </AppCard>

      <AppCard :padding="false">
        <div class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 mb-1">Disponible</p>
              <p class="text-2xl font-bold text-green-600">{{ quickStats.totalAvailable }}</p>
            </div>
            <div class="p-3 rounded-full bg-green-100">
              <Package class="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </AppCard>

      <AppCard :padding="false">
        <div class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 mb-1">Valeur totale</p>
              <p class="text-xl font-bold text-purple-600">
                {{ formatCurrency(quickStats.totalValue) }}
              </p>
            </div>
            <div class="p-3 rounded-full bg-purple-100">
              <TrendingUp class="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </AppCard>

      <AppCard
        :padding="false"
        class="cursor-pointer hover:shadow-lg transition-shadow"
        @click="goToLowStock"
      >
        <div class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 mb-1">Stock faible</p>
              <p class="text-2xl font-bold text-orange-600">{{ quickStats.lowStockCount }}</p>
            </div>
            <div class="p-3 rounded-full bg-orange-100">
              <AlertTriangle class="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </AppCard>
    </div>

    <!-- Low Stock Alert -->
    <div v-if="lowStockCount > 0" class="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-lg">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <AlertTriangle class="w-6 h-6 text-orange-600" />
          <div>
            <p class="font-semibold text-orange-900">
              {{ lowStockCount }} produit{{ lowStockCount > 1 ? 's' : '' }} avec stock faible
            </p>
            <p class="text-sm text-orange-700">Certains produits ont atteint leur seuil d'alerte</p>
          </div>
        </div>
        <AppButton variant="outline" size="sm" @click="goToLowStock">
          Voir les alertes
        </AppButton>
      </div>
    </div>

    <!-- Branch Stats for Company Admin -->
    <div v-if="isCompanyAdmin && branchStats.length > 1" class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold text-gray-900">Stocks par branche</h2>
          <p class="text-sm text-gray-600 mt-1">Vue détaillée de vos {{ branchStats.length }} branches</p>
        </div>
        <AppButton 
          variant="outline"
          @click="selectedBranchId = null"
        >
          Vue consolidée
        </AppButton>
      </div>
      
      <div class="space-y-6">
        <BranchStockCard
          v-for="stat in branchStats"
          :key="stat.branchId"
          :branch-id="stat.branchId"
          :branch-name="stat.branchName"
          :branch-code="stat.branchCode"
          :stocks="stat.stocks"
          :can-adjust="canAdjust"
          @view-all="selectedBranchId = $event"
          @adjust="router.push({ name: 'StockAdjust', query: { branch_id: $event } })"
        />
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <!-- Branch Selector (for Company Admin) -->
      <div v-if="isCompanyAdmin && branches.length > 0" class="lg:col-span-1">
        <AppCard>
          <BranchSelector
            :branches="branches"
            :selected-branch-id="selectedBranchId"
            :show-all-option="true"
            @update:selected-branch-id="handleBranchChange"
          />
        </AppCard>
      </div>

      <!-- Stocks List -->
      <div :class="isCompanyAdmin && branches.length > 0 ? 'lg:col-span-3' : 'lg:col-span-4'">
        <!-- Filter Bar -->
        <AppCard :padding="false" class="mb-6">
          <div class="p-4">
            <div class="flex items-center gap-4">
              <div class="flex-1">
                <AppInput
                  :model-value="searchQuery"
                  @update:model-value="handleSearch"
                  type="search"
                  placeholder="Rechercher un produit..."
                >
                  <template #prepend>
                    <Search class="w-5 h-5 text-gray-400" />
                  </template>
                </AppInput>
              </div>
              <AppButton
                variant="outline"
                @click="showFilter = !showFilter"
                :class="{ 'bg-primary-50 border-primary-600 text-primary-600': hasActiveFilters }"
              >
                <Filter class="w-5 h-5 mr-2" />
                Filtres
              </AppButton>
            </div>
          </div>
        </AppCard>

        <!-- Stock Table -->
        <AppCard v-if="hasStocks" :padding="false">
          <div class="overflow-x-auto">
            <AppTable
              :columns="columns"
              :data="stocks"
              :loading="loading"
              empty-text="Aucun stock disponible"
              hoverable
            >
              <!-- Product -->
              <template #cell-product="{ row }">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center shrink-0">
                    <Package class="w-5 h-5 text-gray-400" />
                  </div>
                  <div>
                    <p class="font-medium text-gray-900">{{ row.product.name }}</p>
                    <p class="text-xs text-gray-500 font-mono">{{ row.product.sku }}</p>
                  </div>
                </div>
              </template>

              <!-- Branch -->
              <template #cell-branch="{ row }">
                <div>
                  <p class="font-medium text-gray-900">{{ row?.branch?.name }}</p>
                  <p class="text-xs text-gray-500">{{ row?.branch?.code }}</p>
                </div>
              </template>

              <!-- Quantity -->
              <template #cell-quantity="{ row }">
                <span class="text-lg font-bold text-gray-900">{{ row.quantity }}</span>
              </template>

              <!-- Available -->
              <template #cell-available="{ row }">
                <span class="text-green-600 font-semibold">{{ row.available_quantity }}</span>
              </template>

              <!-- Reserved -->
              <template #cell-reserved="{ row }">
                <span class="text-orange-600 font-semibold">{{ row.reserved_quantity }}</span>
              </template>

              <!-- Value -->
              <template #cell-value="{ row }">
                <span class="font-semibold text-gray-900">
                  {{ formatCurrency(row.quantity * Number(row.product.selling_price)) }}
                </span>
              </template>

              <!-- Status -->
              <template #cell-status="{ row }">
                <AppBadge :variant="row.is_low_stock ? 'warning' : 'success'" size="sm">
                  {{ row.is_low_stock ? 'Stock faible' : 'Normal' }}
                </AppBadge>
              </template>

              <!-- Actions -->
              <template #cell-actions="{ row }">
                <div class="flex items-center justify-end gap-2">
                  <AppButton
                    v-if="canAdjust"
                    variant="ghost"
                    size="sm"
                    icon
                    @click="goToAdjustment(row)"
                    title="Ajuster"
                  >
                    <Plus class="w-4 h-4" />
                  </AppButton>
                  <AppButton
                    v-if="canTransfer"
                    variant="ghost"
                    size="sm"
                    icon
                    @click="goToTransfer(row)"
                    title="Transférer"
                  >
                    <ArrowRightLeft class="w-4 h-4" />
                  </AppButton>
                </div>
              </template>
            </AppTable>
          </div>
        </AppCard>

        <!-- Empty State -->
        <AppCard v-else-if="!loading">
          <div class="text-center py-12">
            <Package class="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Aucun stock</h3>
            <p class="text-gray-600 mb-6">
              {{ selectedBranchId ? 'Cette branche n\'a pas de stock' : 'Commencez par ajouter du stock à vos produits' }}
            </p>
            <AppButton v-if="canAdjust" variant="primary" @click="goToAdjustment()">
              <Plus class="w-5 h-5 mr-2" />
              Ajouter du stock
            </AppButton>
          </div>
        </AppCard>
      </div>
    </div>
  </div>
</template>