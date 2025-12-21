<!-- src/components/products/ProductCard.vue -->
<script setup lang="ts">
import { computed } from 'vue'
import type { Product } from '@/types'
import AppBadge from '@components/common/AppBadge.vue'
import { formatCurrency } from '@/utils/formatters'
import { Package, Edit, Trash2, CheckCircle } from 'lucide-vue-next'
import { usePermissions } from '@/composables'

interface Props {
  product: Product
  selected?: boolean
  selectable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  selected: false,
  selectable: true,
})

const emit = defineEmits<{
  click: []
  select: []
  edit: []
  delete: []
}>()

const permissions = usePermissions()
const canEdit = computed(() => permissions.products.value.canEdit)
const canDelete = computed(() => permissions.products.value.canDelete)

const handleCardClick = (e: Event) => {
  // Don't trigger if clicking action buttons
  const target = e.target as HTMLElement
  if (target.closest('button')) return
  emit('click')
}
</script>

<template>
  <div
    @click="handleCardClick"
    :class="[
      'relative bg-white rounded-lg border-2 transition-all duration-200 cursor-pointer',
      'hover:shadow-lg hover:-translate-y-1',
      selected ? 'border-primary-600 shadow-lg' : 'border-gray-200',
    ]"
  >
    <!-- Selection checkbox -->
    <div v-if="selectable" class="absolute top-3 left-3 z-10">
      <button
        @click.stop="emit('select')"
        :class="[
          'w-6 h-6 rounded border-2 flex items-center justify-center transition-colors',
          selected
            ? 'bg-primary-600 border-primary-600'
            : 'bg-white border-gray-300 hover:border-primary-600',
        ]"
      >
        <CheckCircle v-if="selected" class="w-4 h-4 text-white" />
      </button>
    </div>

    <!-- Product Image -->
    <div class="aspect-square bg-gray-100 rounded-t-lg overflow-hidden">
      <img
        v-if="product.image"
        :src="product.image"
        :alt="product.name"
        class="w-full h-full object-cover"
      />
      <div v-else class="w-full h-full flex items-center justify-center">
        <Package class="w-20 h-20 text-gray-300" />
      </div>
    </div>

    <!-- Product Info -->
    <div class="p-4">
      <!-- Name & SKU -->
      <div class="mb-3">
        <h3 class="font-semibold text-gray-900 mb-1 line-clamp-2">
          {{ product.name }}
        </h3>
        <p class="text-xs font-mono text-gray-500">SKU: {{ product.sku }}</p>
      </div>

      <!-- Category -->
      <div v-if="product.category" class="mb-3">
        <AppBadge variant="secondary" size="sm">
          {{ product.category.name }}
        </AppBadge>
      </div>

      <!-- Price -->
      <div class="mb-3">
        <p class="text-lg font-bold text-primary-600">
          {{ formatCurrency(product.selling_price) }}
        </p>
        <p v-if="product.cost_price" class="text-xs text-gray-500">
          Coût: {{ formatCurrency(product.cost_price) }}
        </p>
      </div>

      <!-- Margin -->
      <div v-if="product.margin" class="mb-3 flex items-center gap-2">
        <span class="text-xs text-gray-600">Marge:</span>
        <AppBadge
          :variant="product.margin_percent && product.margin_percent > 30 ? 'success' : 'warning'"
          size="sm"
        >
          {{ formatCurrency(product.margin) }}
          <span v-if="product.margin_percent"> ({{ product.margin_percent.toFixed(1) }}%)</span>
        </AppBadge>
      </div>

      <!-- Status & Stock Tracking -->
      <div class="flex items-center gap-2 mb-4">
        <AppBadge :variant="product.is_active ? 'success' : 'secondary'" size="sm">
          {{ product.is_active ? 'Actif' : 'Inactif' }}
        </AppBadge>
        <AppBadge v-if="product.track_stock" variant="info" size="sm">
          Stock suivi
        </AppBadge>
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-2 pt-3 border-t border-gray-200">
        <button
          v-if="canEdit"
          @click.stop="emit('edit')"
          class="flex-1 px-3 py-2 text-sm font-medium text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
        >
          <Edit class="w-4 h-4 inline mr-1" />
          Modifier
        </button>
        <button
          v-if="canDelete"
          @click.stop="emit('delete')"
          class="flex-1 px-3 py-2 text-sm font-medium text-danger-600 hover:bg-danger-50 rounded-lg transition-colors"
        >
          <Trash2 class="w-4 h-4 inline mr-1" />
          Supprimer
        </button>
      </div>
    </div>

    <!-- Stock Alert Badge -->
    <div v-if="product.alert_quantity" class="absolute top-3 right-3">
      <AppBadge variant="warning" size="sm">
        Seuil: {{ product.alert_quantity }}
      </AppBadge>
    </div>
  </div>
</template>