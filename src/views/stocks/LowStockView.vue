<!-- src/views/stocks/LowStockView.vue -->
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStockStore, useAuthStore } from '@/stores'
import { usePermissions } from '@/composables'
import type { Stock } from '@/types'
import AppButton from '@components/common/AppButton.vue'
import AppCard from '@components/common/AppCard.vue'
import AppTable from '@components/common/AppTable.vue'
import AppBadge from '@components/common/AppBadge.vue'
import { formatCurrency } from '@/utils/formatters'
import {
  ArrowLeft,
  AlertTriangle,
  Plus,
  ArrowRightLeft,
  Package,
  TrendingDown,
} from 'lucide-vue-next'

const router = useRouter()
const stockStore = useStockStore()
const authStore = useAuthStore()
const permissions = usePermissions()

const loading = ref(false)
const selectedBranch = ref<number | undefined>(undefined)

// Table columns
const columns = [
  { key: 'product', label: 'Produit', sortable: true },
  { key: 'branch', label: 'Branche', sortable: true },
  { key: 'stock', label: 'Stock actuel', sortable: true, align: 'center' as const },
  { key: 'threshold', label: 'Seuil', sortable: true, align: 'center' as const },
  { key: 'deficit', label: 'Manque', sortable: false, align: 'center' as const },
  { key: 'value', label: 'Valeur', sortable: false, align: 'right' as const },
  { key: 'actions', label: 'Actions', width: '150px', align: 'right' as const },
]

// Computed
const lowStocks = computed(() => stockStore.lowStocks)
const hasLowStocks = computed(() => stockStore.hasLowStocks)
const lowStockCount = computed(() => stockStore.lowStockCount)

const canAdjust = computed(() => permissions.stocks.value.canAdjust)
const canTransfer = computed(() => permissions.stocks.value.canTransfer)

const totalDeficit = computed(() => {
  return lowStocks.value.reduce((sum, stock) => {
    const deficit = stock.product.alert_quantity - stock.quantity
    return sum + Math.max(0, deficit)
  }, 0)
})

const totalValue = computed(() => {
  return lowStocks.value.reduce((sum, stock) => {
    return sum + stock.quantity * stock.product.selling_price
  }, 0)
})

const criticalStocks = computed(() => {
  return lowStocks.value.filter(stock => stock.quantity === 0)
})

// Methods
const fetchLowStocks = async () => {
  loading.value = true
  try {
    await stockStore.fetchLowStocks(selectedBranch.value)
  } catch (error) {
    console.error('Error fetching low stocks:', error)
  } finally {
    loading.value = false
  }
}

const goBack = () => {
  router.push({ name: 'StockList' })
}

const goToAdjustment = (stock: Stock) => {
  router.push({
    name: 'StockAdjust',
    query: {
      product_id: stock.product.id,
      branch_id: stock.branch.id,
    },
  })
}

const goToTransfer = (stock: Stock) => {
  router.push({
    name: 'StockTransfer',
    query: {
      product_id: stock.product.id,
      from_branch_id: stock.branch.id,
    },
  })
}

const getStockLevelVariant = (stock: Stock) => {
  if (stock.quantity === 0) return 'danger'
  if (stock.quantity <= stock.product.alert_quantity / 2) return 'warning'
  return 'info'
}

// Lifecycle
onMounted(() => {
  if (authStore.userBranchId) {
    selectedBranch.value = authStore.userBranchId
  }
  fetchLowStocks()
})
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <AppButton variant="ghost" icon @click="goBack">
          <ArrowLeft class="w-5 h-5" />
        </AppButton>
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Alertes de Stock Faible</h1>
          <p class="text-gray-600 mt-1">Produits nécessitant un réapprovisionnement urgent</p>
        </div>
      </div>
    </div>

    <!-- Alert Banner -->
    <div
      v-if="criticalStocks.length > 0"
      class="bg-danger-50 border-l-4 border-danger-500 p-4 rounded-lg"
    >
      <div class="flex items-center gap-3">
        <AlertTriangle class="w-6 h-6 text-danger-600 shrink-0" />
        <div>
          <p class="font-semibold text-danger-900">
            {{ criticalStocks.length }} produit{{ criticalStocks.length > 1 ? 's' : '' }} en rupture
            de stock
          </p>
          <p class="text-sm text-danger-700">
            Intervention immédiate requise pour éviter toute interruption
          </p>
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <AppCard :padding="false">
        <div class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 mb-1">Produits concernés</p>
              <p class="text-2xl font-bold text-orange-600">{{ lowStockCount }}</p>
            </div>
            <div class="p-3 rounded-full bg-orange-100">
              <AlertTriangle class="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </AppCard>

      <AppCard :padding="false">
        <div class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 mb-1">Ruptures de stock</p>
              <p class="text-2xl font-bold text-danger-600">{{ criticalStocks.length }}</p>
            </div>
            <div class="p-3 rounded-full bg-danger-100">
              <TrendingDown class="w-6 h-6 text-danger-600" />
            </div>
          </div>
        </div>
      </AppCard>

      <AppCard :padding="false">
        <div class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 mb-1">Manque total</p>
              <p class="text-2xl font-bold text-gray-900">{{ totalDeficit }}</p>
              <p class="text-xs text-gray-500 mt-1">unités</p>
            </div>
            <div class="p-3 rounded-full bg-gray-100">
              <Package class="w-6 h-6 text-gray-600" />
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
                {{ formatCurrency(totalValue) }}
              </p>
            </div>
            <div class="p-3 rounded-full bg-purple-100">
              <Package class="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </AppCard>
    </div>

    <!-- Low Stock Table -->
    <AppCard v-if="hasLowStocks" :padding="false">
      <div class="overflow-x-auto">
        <AppTable
          :columns="columns"
          :data="lowStocks"
          :loading="loading"
          empty-text="Aucune alerte de stock"
          hoverable
        >
          <!-- Product -->
          <template #cell-product="{ row }">
            <div class="flex items-center gap-3">
              <div
                class="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center shrink-0"
              >
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
              <p class="font-medium text-gray-900">{{ row.branch.name }}</p>
              <p class="text-xs text-gray-500">{{ row.branch.code }}</p>
            </div>
          </template>

          <!-- Stock -->
          <template #cell-stock="{ row }">
            <div class="text-center">
              <AppBadge :variant="getStockLevelVariant(row)" size="sm">
                {{ row.quantity }}
              </AppBadge>
            </div>
          </template>

          <!-- Threshold -->
          <template #cell-threshold="{ row }">
            <div class="text-center">
              <span class="text-gray-900 font-semibold">{{ row.product.alert_quantity }}</span>
            </div>
          </template>

          <!-- Deficit -->
          <template #cell-deficit="{ row }">
            <div class="text-center">
              <span class="text-danger-600 font-bold">
                {{ Math.max(0, row.product.alert_quantity - row.quantity) }}
              </span>
            </div>
          </template>

          <!-- Value -->
          <template #cell-value="{ row }">
            <span class="font-semibold text-gray-900">
              {{ formatCurrency(row.quantity * row.product.selling_price) }}
            </span>
          </template>

          <!-- Actions -->
          <template #cell-actions="{ row }">
            <div class="flex items-center justify-end gap-2">
              <AppButton
                v-if="canAdjust"
                variant="success"
                size="sm"
                @click="goToAdjustment(row)"
                title="Ajuster le stock"
              >
                <Plus class="w-4 h-4 mr-1" />
                Ajouter
              </AppButton>
              <AppButton
                v-if="canTransfer"
                variant="outline"
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
        <div
          class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <svg
            class="w-10 h-10 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Tous les stocks sont normaux</h3>
        <p class="text-gray-600">Aucun produit n'a atteint son seuil d'alerte</p>
      </div>
    </AppCard>
  </div>
</template>
