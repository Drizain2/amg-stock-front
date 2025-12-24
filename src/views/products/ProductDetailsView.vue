<!-- src/views/products/ProductDetailsView.vue -->
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useProductStore, useStockStore } from '@/stores'
import { usePermissions } from '@/composables'
import type { Product, Stock } from '@/types'
import AppButton from '@components/common/AppButton.vue'
import AppCard from '@components/common/AppCard.vue'
import AppBadge from '@components/common/AppBadge.vue'
import AppTable from '@components/common/AppTable.vue'
import { formatCurrency, formatDate } from '@/utils/formatters'
import {
  ArrowLeft,
  Edit,
  Trash2,
  Package,
  TrendingUp,
  BarChart3,
  AlertTriangle,
  Building2,
} from 'lucide-vue-next'
import AppSpinner from '@/components/common/AppSpinner.vue'

const router = useRouter()
const route = useRoute()
const productStore = useProductStore()
const stockStore = useStockStore()
const permissions = usePermissions()

const product = ref<Product | null>(null)
const stocks = ref<Stock[]>([])
const loading = ref(true)

const canEdit = computed(() => permissions.products.value.canEdit)
const canDelete = computed(() => permissions.products.value.canDelete)

// Stock columns
const stockColumns = [
  { key: 'branch', label: 'Branche', sortable: false },
  { key: 'quantity', label: 'Quantité', sortable: false, align: 'center' as const },
  { key: 'available', label: 'Disponible', sortable: false, align: 'center' as const },
  { key: 'reserved', label: 'Réservé', sortable: false, align: 'center' as const },
  { key: 'status', label: 'Statut', sortable: false, align: 'center' as const },
]

// Computed
const totalStock = computed(() => {
  return stocks.value.reduce((sum, stock) => sum + stock.quantity, 0)
})

const totalAvailable = computed(() => {
  return stocks.value.reduce((sum, stock) => sum + stock.available_quantity, 0)
})

const totalReserved = computed(() => {
  return stocks.value.reduce((sum, stock) => sum + stock.reserved_quantity, 0)
})

const lowStockBranches = computed(() => {
  return stocks.value.filter(stock => stock.is_low_stock)
})

const totalValue = computed(() => {
  if (!product.value) return 0
  return totalStock.value * product.value.selling_price
})

// Methods
const fetchProductDetails = async () => {
  loading.value = true
  try {
    const productId = Number(route.params.id)
    product.value = await productStore.fetchProductById(productId)
    
    // Fetch stocks for this product
    const stocksResponse = await stockStore.fetchStocksByProduct(productId)
    stocks.value = stocksResponse.stocks || []
  } catch (error) {
    console.error('Error loading product:', error)
  } finally {
    loading.value = false
  }
}

const handleEdit = () => {
  if (product.value) {
    router.push({ name: 'ProductEdit', params: { id: product.value.id } })
  }
}

const handleDelete = async () => {
  if (!product.value) return
  
  if (confirm(`Êtes-vous sûr de vouloir supprimer "${product.value.name}" ?`)) {
    try {
      await productStore.deleteProduct(product.value.id)
      router.push({ name: 'ProductList' })
    } catch (error) {
      console.error('Error deleting product:', error)
    }
  }
}

const goBack = () => {
  router.push({ name: 'ProductList' })
}

const goToStockAdjustment = () => {
  router.push({
    name: 'StockAdjust',
    query: { product_id: product.value?.id },
  })
}

const goToStockTransfer = () => {
  router.push({
    name: 'StockTransfer',
    query: { product_id: product.value?.id },
  })
}

// Lifecycle
onMounted(() => {
  fetchProductDetails()
})
</script>

<template>
  <div v-if="loading" class="flex items-center justify-center h-96">
    <!-- <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div> -->
     <AppSpinner text="Chargement..." color="text-primary-600"/>
  </div>

  <div v-else-if="product" class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <AppButton variant="ghost" icon @click="goBack">
          <ArrowLeft class="w-5 h-5" />
        </AppButton>
        <div>
          <h1 class="text-2xl font-bold text-gray-900">{{ product.name }}</h1>
          <p class="text-gray-600 mt-1">SKU: {{ product.sku }}</p>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <AppButton v-if="canEdit" variant="outline" @click="handleEdit">
          <Edit class="w-5 h-5 mr-2" />
          Modifier
        </AppButton>
        <AppButton v-if="canDelete" variant="danger" @click="handleDelete">
          <Trash2 class="w-5 h-5 mr-2" />
          Supprimer
        </AppButton>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <AppCard :padding="false">
        <div class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 mb-1">Stock Total</p>
              <p class="text-2xl font-bold text-gray-900">{{ totalStock }}</p>
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
              <p class="text-sm text-gray-600 mb-1">Disponible</p>
              <p class="text-2xl font-bold text-green-600">{{ totalAvailable }}</p>
            </div>
            <div class="p-3 rounded-full bg-green-100">
              <BarChart3 class="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </AppCard>

      <AppCard :padding="false">
        <div class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 mb-1">Valeur Totale</p>
              <p class="text-2xl font-bold text-purple-600">
                {{ formatCurrency(totalValue) }}
              </p>
            </div>
            <div class="p-3 rounded-full bg-purple-100">
              <TrendingUp class="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </AppCard>

      <AppCard :padding="false">
        <div class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 mb-1">Alertes Stock</p>
              <p class="text-2xl font-bold text-orange-600">{{ lowStockBranches.length }}</p>
            </div>
            <div class="p-3 rounded-full bg-orange-100">
              <AlertTriangle class="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </AppCard>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Product Details -->
      <div class="lg:col-span-2 space-y-6">
        <!-- General Info -->
        <AppCard title="Informations générales">
          <div class="space-y-4">
            <!-- Image & Basic Info -->
            <div class="flex gap-6">
              <div class="w-32 h-32 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                <img
                  v-if="product.image"
                  :src="product.image"
                  :alt="product.name"
                  class="w-full h-full object-cover"
                />
                <div v-else class="w-full h-full flex items-center justify-center">
                  <Package class="w-12 h-12 text-gray-400" />
                </div>
              </div>

              <div class="flex-1 space-y-3">
                <div>
                  <label class="text-sm font-medium text-gray-600">Nom</label>
                  <p class="text-gray-900 font-semibold">{{ product.name }}</p>
                </div>

                <div>
                  <label class="text-sm font-medium text-gray-600">Description</label>
                  <p class="text-gray-900">{{ product.description || 'Aucune description' }}</p>
                </div>

                <div class="flex items-center gap-4">
                  <AppBadge :variant="product.is_active ? 'success' : 'secondary'">
                    {{ product.is_active ? 'Actif' : 'Inactif' }}
                  </AppBadge>
                  <AppBadge v-if="product.track_stock" variant="info">
                    Stock suivi
                  </AppBadge>
                  <AppBadge v-if="product.category" variant="secondary">
                    {{ product.category.name }}
                  </AppBadge>
                </div>
              </div>
            </div>

            <!-- Details Grid -->
            <div class="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
              <div>
                <label class="text-sm font-medium text-gray-600">SKU</label>
                <p class="text-gray-900 font-mono">{{ product.sku }}</p>
              </div>

              <div>
                <label class="text-sm font-medium text-gray-600">Unité</label>
                <p class="text-gray-900">{{ product.unit }}</p>
              </div>

              <div>
                <label class="text-sm font-medium text-gray-600">Seuil d'alerte</label>
                <p class="text-gray-900">{{ product.alert_quantity }} unités</p>
              </div>

              <div>
                <label class="text-sm font-medium text-gray-600">Créé le</label>
                <p class="text-gray-900">{{ formatDate(product.created_at) }}</p>
              </div>
            </div>
          </div>
        </AppCard>

        <!-- Stock by Branch -->
        <AppCard>
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-gray-900">Stock par branche</h3>
              <div class="flex items-center gap-2">
                <AppButton variant="outline" size="sm" @click="goToStockAdjustment">
                  Ajuster
                </AppButton>
                <AppButton variant="primary" size="sm" @click="goToStockTransfer">
                  Transférer
                </AppButton>
              </div>
            </div>
          </template>

          <AppTable
            :columns="stockColumns"
            :data="stocks"
            :loading="false"
            empty-text="Aucun stock disponible"
          >
            <template #cell-branch="{ row }">
              <div class="flex items-center gap-2">
                <Building2 class="w-4 h-4 text-gray-400" />
                <div>
                  <p class="font-medium text-gray-900">{{ row.branch.name }}</p>
                  <p class="text-xs text-gray-500">{{ row.branch.code }}</p>
                </div>
              </div>
            </template>

            <template #cell-quantity="{ row }">
              <span class="font-semibold text-gray-900">{{ row.quantity }}</span>
            </template>

            <template #cell-available="{ row }">
              <span class="text-green-600 font-medium">{{ row.available_quantity }}</span>
            </template>

            <template #cell-reserved="{ row }">
              <span class="text-orange-600 font-medium">{{ row.reserved_quantity }}</span>
            </template>

            <template #cell-status="{ row }">
              <AppBadge
                :variant="row.is_low_stock ? 'warning' : 'success'"
                size="sm"
              >
                {{ row.is_low_stock ? 'Stock faible' : 'Normal' }}
              </AppBadge>
            </template>
          </AppTable>
        </AppCard>
      </div>

      <!-- Sidebar -->
      <div class="space-y-6">
        <!-- Pricing Card -->
        <AppCard title="Tarification">
          <div class="space-y-4">
            <div>
              <label class="text-sm font-medium text-gray-600">Prix de vente</label>
              <p class="text-2xl font-bold text-primary-600">
                {{ formatCurrency(product.selling_price) }}
              </p>
            </div>

            <div v-if="product.cost_price">
              <label class="text-sm font-medium text-gray-600">Prix d'achat</label>
              <p class="text-lg font-semibold text-gray-900">
                {{ formatCurrency(product.cost_price) }}
              </p>
            </div>

            <div v-if="product.margin" class="pt-4 border-t border-gray-200">
              <label class="text-sm font-medium text-gray-600">Marge bénéficiaire</label>
              <div class="flex items-baseline gap-2">
                <p class="text-lg font-bold text-green-600">
                  {{ formatCurrency(product.margin) }}
                </p>
                <span v-if="product.margin_percent" class="text-sm text-gray-600">
                  ({{ product.margin_percent.toFixed(1) }}%)
                </span>
              </div>
            </div>

            <div v-if="product.tax_rate">
              <label class="text-sm font-medium text-gray-600">Taxe</label>
              <p class="text-gray-900">{{ product.tax_rate }}%</p>
            </div>
          </div>
        </AppCard>

        <!-- Low Stock Alerts -->
        <AppCard v-if="lowStockBranches.length > 0" title="Alertes de stock">
          <div class="space-y-3">
            <div
              v-for="stock in lowStockBranches"
              :key="stock.id"
              class="p-3 bg-orange-50 border border-orange-200 rounded-lg"
            >
              <div class="flex items-center gap-2 mb-1">
                <AlertTriangle class="w-4 h-4 text-orange-600" />
                <p class="font-medium text-orange-900 text-sm">{{ stock.branch.name }}</p>
              </div>
              <p class="text-xs text-orange-700">
                Stock: {{ stock.quantity }} (Seuil: {{ product.alert_quantity }})
              </p>
            </div>
          </div>
        </AppCard>

        <!-- Company Info -->
        <AppCard v-if="product.company" title="Entreprise">
          <div class="space-y-2">
            <p class="font-medium text-gray-900">{{ product.company.name }}</p>
            <p v-if="product.company.email" class="text-sm text-gray-600">
              {{ product.company.email }}
            </p>
          </div>
        </AppCard>
      </div>
    </div>
  </div>

  <!-- Error State -->
  <div v-else class="flex items-center justify-center h-96">
    <div class="text-center">
      <Package class="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h3 class="text-lg font-semibold text-gray-900 mb-2">Produit introuvable</h3>
      <AppButton variant="primary" @click="goBack">
        Retour à la liste
      </AppButton>
    </div>
  </div>
</template>