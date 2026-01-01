<!-- src/components/stocks/BranchStockCard.vue -->
<script setup lang="ts">
import { computed } from 'vue'
import type { Stock } from '@/types'
import { Package, Plus, AlertTriangle, ChevronRight } from 'lucide-vue-next'
import AppButton from '@/components/common/AppButton.vue'
import AppBadge from '@/components/common/AppBadge.vue'
import { formatCurrency } from '@/utils/formatters'

interface Props {
  branchId: number
  branchName: string
  branchCode: string
  stocks: Stock[]
  canAdjust?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  canAdjust: false
})

const emit = defineEmits<{
  'view-all': [branchId: number]
  'adjust': [branchId: number]
}>()

// Computed
const totalQuantity = computed(() => 
  props.stocks.reduce((sum, s) => sum + s.quantity, 0)
)

const totalAvailable = computed(() => 
  props.stocks.reduce((sum, s) => sum + s.available_quantity, 0)
)

const totalValue = computed(() => 
  props.stocks.reduce((sum, s) => 
    sum + s.quantity * Number(s.product.selling_price), 0
  )
)

const lowStockCount = computed(() => 
  props.stocks.filter(s => s.is_low_stock).length
)

const topStocks = computed(() => props.stocks.slice(0, 5))
const hasMoreStocks = computed(() => props.stocks.length > 5)
</script>

<template>
  <div class="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-gray-100 hover:border-primary-200 transition-all duration-200">
    <!-- Header with Branch Info and Stats -->
    <div class="bg-linear-to-r from-primary-600 to-blue-600 p-6">
      <div class="flex items-center justify-between">
        <!-- Branch Name (Left) -->
        <div class="flex items-center gap-4">
          <div class="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Package class="w-7 h-7 text-white" />
          </div>
          <div>
            <h3 class="text-xl font-bold text-white">{{ branchName }}</h3>
            <p class="text-sm text-white/80 font-medium">{{ branchCode }}</p>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex items-center gap-2">
          <AppButton 
            v-if="canAdjust"
            variant="outline"
            size="sm"
            class="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20"
            @click="emit('adjust', branchId)"
          >
            <Plus class="w-4 h-4 mr-1" />
            Ajuster
          </AppButton>
        </div>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-4 gap-4 p-6 bg-gray-50 border-b border-gray-200">
      <!-- Total Products -->
      <div class="text-center">
        <p class="text-xs font-medium text-gray-600 uppercase mb-1">Produits</p>
        <p class="text-3xl font-bold text-gray-900">{{ stocks.length }}</p>
      </div>

      <!-- Total Quantity -->
      <div class="text-center">
        <p class="text-xs font-medium text-gray-600 uppercase mb-1">Quantité</p>
        <p class="text-3xl font-bold text-blue-600">{{ totalQuantity }}</p>
      </div>

      <!-- Available -->
      <div class="text-center">
        <p class="text-xs font-medium text-gray-600 uppercase mb-1">Disponible</p>
        <p class="text-3xl font-bold text-green-600">{{ totalAvailable }}</p>
      </div>

      <!-- Total Value -->
      <div class="text-center">
        <p class="text-xs font-medium text-gray-600 uppercase mb-1">Valeur</p>
        <p class="text-2xl font-bold text-purple-600">
          {{ formatCurrency(totalValue).replace(/\s/g, '') }}
        </p>
      </div>
    </div>

    <!-- Low Stock Alert (if any) -->
    <div 
      v-if="lowStockCount > 0" 
      class="bg-orange-50 border-b border-orange-200 px-6 py-3"
    >
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <AlertTriangle class="w-5 h-5 text-orange-600" />
          <p class="text-sm font-semibold text-orange-900">
            {{ lowStockCount }} produit{{ lowStockCount > 1 ? 's' : '' }} en stock faible
          </p>
        </div>
        <AppBadge variant="warning" size="sm">
          Alerte
        </AppBadge>
      </div>
    </div>

    <!-- Stock List -->
    <div class="p-6">
      <div class="flex items-center justify-between mb-4">
        <h4 class="text-sm font-bold text-gray-900 uppercase tracking-wide">
          Détails du stock
        </h4>
        <button
          @click="emit('view-all', branchId)"
          class="flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
        >
          Tout voir
          <ChevronRight class="w-4 h-4" />
        </button>
      </div>

      <!-- Stock Items -->
      <div class="space-y-2">
        <div 
          v-for="stock in topStocks" 
          :key="stock.id"
          class="group flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-all duration-200 cursor-pointer"
          @click="emit('view-all', branchId)"
        >
          <!-- Product Info -->
          <div class="flex items-center gap-3 flex-1">
            <div class="w-12 h-12 rounded-lg bg-white shadow-sm flex items-center justify-center group-hover:shadow-md transition-shadow">
              <Package class="w-6 h-6 text-gray-400 group-hover:text-primary-600 transition-colors" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="font-semibold text-gray-900 text-sm truncate">
                {{ stock.product.name }}
              </p>
              <p class="text-xs text-gray-500 font-mono">
                {{ stock.product.sku }}
              </p>
            </div>
          </div>

          <!-- Stock Stats -->
          <div class="flex items-center gap-6">
            <!-- Quantity -->
            <div class="text-center min-w-16">
              <p class="text-xs text-gray-500 mb-0.5">Qté</p>
              <p class="text-lg font-bold text-gray-900">{{ stock.quantity }}</p>
            </div>

            <!-- Available -->
            <div class="text-center min-w-16">
              <p class="text-xs text-gray-500 mb-0.5">Dispo</p>
              <p class="text-lg font-bold text-green-600">{{ stock.available_quantity }}</p>
            </div>

            <!-- Value -->
            <div class="text-right min-w-28">
              <p class="text-xs text-gray-500 mb-0.5">Valeur</p>
              <p class="text-sm font-bold text-gray-900">
                {{ formatCurrency(Number(stock.product.selling_price)) }}
              </p>
            </div>

            <!-- Status Badge -->
            <div class="min-w-20">
              <AppBadge 
                :variant="stock.is_low_stock ? 'warning' : 'success'" 
                size="sm"
              >
                {{ stock.is_low_stock ? 'Faible' : 'Normal' }}
              </AppBadge>
            </div>
          </div>
        </div>

        <!-- Show More -->
        <button
          v-if="hasMoreStocks"
          @click="emit('view-all', branchId)"
          class="w-full p-3 text-center text-sm font-medium text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors"
        >
          + {{ stocks.length - 5 }} autre{{ stocks.length - 5 > 1 ? 's' : '' }} produit{{ stocks.length - 5 > 1 ? 's' : '' }}
        </button>
      </div>
    </div>
  </div>
</template>