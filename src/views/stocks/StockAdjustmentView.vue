<!-- src/views/stocks/StockAdjustmentView.vue -->
<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStockStore, useProductStore, useBranchStore, useAuthStore } from '@/stores'
import { useForm } from '@/composables'
import type { AdjustStockRequest } from '@/types'
import { StockMovementType } from '@/types'
import AppInput from '@components/common/AppInput.vue'
import AppButton from '@components/common/AppButton.vue'
import AppCard from '@components/common/AppCard.vue'
import AppAlert from '@components/common/AppAlert.vue'
import AppBadge from '@components/common/AppBadge.vue'
import { ArrowLeft, Save, X, Plus, Minus, Package,AlertTriangle } from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()
const stockStore = useStockStore()
const productStore = useProductStore()
const branchStore = useBranchStore()
const authStore = useAuthStore()

const generalError = ref<string | null>(null)
const selectedProduct = ref<any>(null)
const currentStock = ref<any>(null)

// Movement types
const movementTypes = [
  { value: StockMovementType.PURCHASE, label: 'Achat', icon: Plus, color: 'success' },
  { value: StockMovementType.ADJUSTMENT, label: 'Ajustement', icon: Package, color: 'primary' },
  { value: StockMovementType.RETURN, label: 'Retour', icon: Plus, color: 'warning' },
  { value: StockMovementType.DAMAGE, label: 'Dommage', icon: Minus, color: 'danger' },
]

// Form
const { values, errors, isSubmitting, setValue, submit, setErrors } = useForm<AdjustStockRequest>(
  {
    product_id: 0,
    branch_id: 0,
    type: StockMovementType.PURCHASE,
    quantity: 0,
    unit_cost: undefined,
    notes: '',
  },
  {
    product_id: [
      { required: true, message: 'Le produit est obligatoire' },
    ],
    branch_id: [
      { required: true, message: 'La branche est obligatoire' },
    ],
    quantity: [
      { required: true, message: 'La quantité est obligatoire' },
      {
        custom: (value) => {
          if (value <= 0) return 'La quantité doit être supérieure à 0'
          return true
        },
      },
    ],
  }
)

// Computed
const products = computed(() => productStore.products)
const branches = computed(() => branchStore.branches)

const isPositiveAdjustment = computed(() => {
  return [
    StockMovementType.PURCHASE,
    StockMovementType.ADJUSTMENT,
    StockMovementType.RETURN,
  ].includes(values.type as StockMovementType)
})

const newStockLevel = computed(() => {
  if (!currentStock.value) return 0
  
  const adjustment = isPositiveAdjustment.value ? values.quantity : -values.quantity
  return Math.max(0, currentStock.value.quantity + adjustment)
})

const totalCost = computed(() => {
  if (values.unit_cost && values.quantity) {
    return values.unit_cost * values.quantity
  }
  return 0
})

// Methods
const fetchProducts = async () => {
  try {
    await productStore.fetchProducts({
      is_active: true,
      track_stock: true,
    })
  } catch (error) {
    console.error('Error fetching products:', error)
  }
}

const fetchBranches = async () => {
  try {
    await branchStore.fetchBranches({ is_active: true })
  } catch (error) {
    console.error('Error fetching branches:', error)
  }
}

const loadCurrentStock = async () => {
  if (values.product_id && values.branch_id) {
    try {
      const stocks = await stockStore.fetchStocksByBranch(values.branch_id)
      currentStock.value = stocks?.find(s => s.product_id === values.product_id) || null
      
      // Load product details
      selectedProduct.value = await productStore.fetchProductById(values.product_id)
    } catch (error) {
      console.error('Error loading stock:', error)
    }
  }
}

const handleSubmit = async () => {
  generalError.value = null

  const success = await submit(async (formValues) => {
    try {
      // Adjust quantity based on movement type
      const adjustedQuantity = isPositiveAdjustment.value
        ? formValues.quantity
        : -formValues.quantity

      await stockStore.adjustStock({
        ...formValues,
        quantity: adjustedQuantity,
      })

      router.push({ name: 'StockList' })
    } catch (error: any) {
      if (error.status === 422 && error.errors) {
        setErrors(error.errors)
      } else {
        generalError.value = error.message || 'Une erreur est survenue'
      }
      throw error
    }
  })
}

const handleCancel = () => {
  router.push({ name: 'StockList' })
}

// Watchers
watch(() => [values.product_id, values.branch_id], () => {
  loadCurrentStock()
})

// Lifecycle
onMounted(async () => {
  await Promise.all([fetchProducts(), fetchBranches()])

  // Pre-fill from query params
  if (route.query.product_id) {
    setValue('product_id', Number(route.query.product_id))
  }
  if (route.query.branch_id) {
    setValue('branch_id', Number(route.query.branch_id))
  } else if (authStore.userBranchId) {
    setValue('branch_id', authStore.userBranchId)
  }
})
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <AppButton variant="ghost" icon @click="handleCancel">
          <ArrowLeft class="w-5 h-5" />
        </AppButton>
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Ajustement de stock</h1>
          <p class="text-gray-600 mt-1">
            Ajoutez ou retirez du stock pour un produit
          </p>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <AppButton variant="outline" @click="handleCancel" :disabled="isSubmitting">
          <X class="w-5 h-5 mr-2" />
          Annuler
        </AppButton>
        <AppButton variant="primary" @click="handleSubmit" :loading="isSubmitting">
          <Save class="w-5 h-5 mr-2" />
          Enregistrer
        </AppButton>
      </div>
    </div>

    <!-- Error Alert -->
    <AppAlert v-if="generalError" type="danger" dismissible @dismiss="generalError = null">
      {{ generalError }}
    </AppAlert>

    <form @submit.prevent="handleSubmit" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Main Form -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Selection Card -->
        <AppCard title="Sélection">
          <div class="space-y-4">
            <!-- Product Selection -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">
                Produit <span class="text-danger-600">*</span>
              </label>
              <select
                :value="values.product_id"
                @change="setValue('product_id', Number(($event.target as HTMLSelectElement).value))"
                :disabled="isSubmitting"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="0">Sélectionner un produit</option>
                <option v-for="product in products" :key="product.id" :value="product.id">
                  {{ product.name }} ({{ product.sku }})
                </option>
              </select>
              <p v-if="errors.product_id" class="mt-1.5 text-sm text-danger-600">
                {{ errors.product_id }}
              </p>
            </div>

            <!-- Branch Selection -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">
                Branche <span class="text-danger-600">*</span>
              </label>
              <select
                :value="values.branch_id"
                @change="setValue('branch_id', Number(($event.target as HTMLSelectElement).value))"
                :disabled="isSubmitting"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="0">Sélectionner une branche</option>
                <option v-for="branch in branches" :key="branch.id" :value="branch.id">
                  {{ branch.name }} ({{ branch.code }})
                </option>
              </select>
              <p v-if="errors.branch_id" class="mt-1.5 text-sm text-danger-600">
                {{ errors.branch_id }}
              </p>
            </div>
          </div>
        </AppCard>

        <!-- Movement Type Card -->
        <AppCard title="Type de mouvement">
          <div class="grid grid-cols-2 gap-4">
            <button
              v-for="type in movementTypes"
              :key="type.value"
              type="button"
              @click="setValue('type', type.value as StockMovementType)"
              :class="[
                'p-4 border-2 rounded-lg transition-all hover:shadow-md',
                values.type === type.value
                  ? `border-${type.color}-600 bg-${type.color}-50`
                  : 'border-gray-200 hover:border-gray-300',
              ]"
            >
              <component
                :is="type.icon"
                :class="[
                  'w-8 h-8 mx-auto mb-2',
                  values.type === type.value ? `text-${type.color}-600` : 'text-gray-400',
                ]"
              />
              <p
                :class="[
                  'font-medium',
                  values.type === type.value ? `text-${type.color}-900` : 'text-gray-700',
                ]"
              >
                {{ type.label }}
              </p>
            </button>
          </div>
        </AppCard>

        <!-- Quantity & Cost Card -->
        <AppCard title="Quantité et coût">
          <div class="space-y-4">
            <!-- Quantity -->
            <AppInput
              :model-value="values.quantity"
              @update:model-value="setValue('quantity', Number($event))"
              label="Quantité"
              type="number"
              placeholder="0"
              :min="1"
              :error="errors.quantity"
              :disabled="isSubmitting"
              required
            />

            <!-- Unit Cost (optional for purchases) -->
            <AppInput
              v-if="values.type === StockMovementType.PURCHASE"
              :model-value="String(values.unit_cost)"
              @update:model-value="setValue('unit_cost', Number($event) || undefined)"
              label="Coût unitaire (XOF)"
              type="number"
              placeholder="0"
              :min="0"
              :step="0.01"
              hint="Prix d'achat unitaire"
              :disabled="isSubmitting"
            />

            <!-- Total Cost Display -->
            <div v-if="totalCost > 0" class="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium text-blue-900">Coût total</span>
                <span class="text-lg font-bold text-blue-600">
                  {{ totalCost.toLocaleString('fr-FR') }} XOF
                </span>
              </div>
            </div>

            <!-- Notes -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">
                Notes
              </label>
              <textarea
                :value="values.notes"
                @input="setValue('notes', ($event.target as HTMLTextAreaElement).value)"
                rows="3"
                placeholder="Notes ou commentaires sur cet ajustement..."
                :disabled="isSubmitting"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
              />
            </div>
          </div>
        </AppCard>
      </div>

      <!-- Sidebar -->
      <div class="space-y-6">
        <!-- Current Stock Card -->
        <AppCard v-if="selectedProduct && currentStock" title="Stock actuel">
          <div class="space-y-4">
            <div class="flex items-center gap-3 pb-4 border-b border-gray-200">
              <div class="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center shrink-0">
                <Package class="w-6 h-6 text-gray-400" />
              </div>
              <div>
                <p class="font-medium text-gray-900">{{ selectedProduct.name }}</p>
                <p class="text-xs text-gray-500 font-mono">{{ selectedProduct.sku }}</p>
              </div>
            </div>

            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600">Quantité actuelle</span>
                <span class="text-lg font-bold text-gray-900">{{ currentStock.quantity }}</span>
              </div>

              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600">Disponible</span>
                <span class="font-semibold text-green-600">{{ currentStock.available_quantity }}</span>
              </div>

              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600">Réservé</span>
                <span class="font-semibold text-orange-600">{{ currentStock.reserved_quantity }}</span>
              </div>

              <div v-if="currentStock.is_low_stock" class="pt-3 border-t border-gray-200">
                <AppBadge variant="warning" size="sm">
                  Stock faible (Seuil: {{ selectedProduct.alert_quantity }})
                </AppBadge>
              </div>
            </div>
          </div>
        </AppCard>

        <!-- New Stock Level Card -->
        <AppCard v-if="selectedProduct && values.quantity > 0" title="Nouveau niveau">
          <div class="space-y-4">
            <div class="text-center py-6 bg-primary-50 rounded-lg">
              <p class="text-sm text-gray-600 mb-2">Nouveau stock</p>
              <p class="text-4xl font-bold text-primary-600">{{ newStockLevel }}</p>
              <p class="text-sm text-gray-600 mt-2">
                <span :class="isPositiveAdjustment ? 'text-green-600' : 'text-red-600'">
                  {{ isPositiveAdjustment ? '+' : '-' }}{{ values.quantity }}
                </span>
                unités
              </p>
            </div>

            <div v-if="newStockLevel <= selectedProduct.alert_quantity" class="p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <div class="flex items-start gap-2">
                <AlertTriangle class="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                <div>
                  <p class="text-sm font-medium text-orange-900">Attention</p>
                  <p class="text-xs text-orange-700 mt-1">
                    Le nouveau niveau sera inférieur au seuil d'alerte
                  </p>
                </div>
              </div>
            </div>
          </div>
        </AppCard>

        <!-- Summary Card -->
        <AppCard title="Résumé">
          <div class="space-y-3 text-sm">
            <div class="flex items-center justify-between">
              <span class="text-gray-600">Type</span>
              <AppBadge
                :variant="isPositiveAdjustment ? 'success' : 'danger'"
                size="sm"
              >
                {{ movementTypes.find((t: { value: any }) => t.value === values.type)?.label }}
              </AppBadge>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-gray-600">Mouvement</span>
              <span :class="isPositiveAdjustment ? 'text-green-600' : 'text-red-600'" class="font-semibold">
                {{ isPositiveAdjustment ? '+' : '-' }}{{ values.quantity }}
              </span>
            </div>
            <div v-if="totalCost > 0" class="flex items-center justify-between pt-3 border-t border-gray-200">
              <span class="text-gray-600">Coût total</span>
              <span class="font-semibold text-gray-900">
                {{ totalCost.toLocaleString('fr-FR') }} XOF
              </span>
            </div>
          </div>
        </AppCard>
      </div>
    </form>
  </div>
</template>