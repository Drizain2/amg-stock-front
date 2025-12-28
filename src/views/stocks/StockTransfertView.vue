<script setup lang="ts">
import AppAlert from '@/components/common/AppAlert.vue'
import AppBadge from '@/components/common/AppBadge.vue'
import AppButton from '@/components/common/AppButton.vue'
import AppCard from '@/components/common/AppCard.vue'
import AppInput from '@/components/common/AppInput.vue'
import { useForm } from '@/composables'
import { useAuthStore, useBranchStore, useProductStore, useStockStore } from '@/stores'
import { TransferStockRequest } from '@/types'
import { AlertTriangle, ArrowLeft, Save, X,ArrowRightLeft, Building2 } from 'lucide-vue-next'
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const productStore = useProductStore()
const branchStore = useBranchStore()
const stockStore = useStockStore()

const generalError = ref<string | null>(null)
const selectedProduct = ref<any>(null)
const sourceStock = ref<any>(null)
const destinationStock = ref<any>(null)

// Form
const { values, errors, setErrors, isSubmitting, setValue, submit } = useForm<TransferStockRequest>(
  {
    product_id: 0,
    to_branch_id: 0,
    from_branch_id: 0,
    quantity: 0,
    notes: '',
  },
  {
    product_id: [{ required: true, message: 'Le produit est obligatoire' }],
    from_branch_id: [{ required: true, message: 'La branche source est obligatoire' }],
    to_branch_id: [
      { required: true, message: 'La branche destination est obligatoire' },
      {
        custom: value => {
          if (value === values.from_branch_id) {
            return 'La branche destination doit être différente de la branche source'
          }
          return true
        },
      },
    ],
    quantity: [
      {
        required: true,
        message: 'La quantite est obligatoire',
      },
      {
        custom: value => {
          if (value === 0) {
            return 'La quantité doit être supérieur à 0'
          }
          if (sourceStock.value && value > sourceStock.value.available_quantity) {
            return `Quantité insuffisante ( disponible: ${sourceStock.value.available_quantity})`
          }
          return true
        },
      },
    ],
  }
)

//computed
const products = computed(() => productStore.products)
const branches = computed(() => branchStore.branches)

const availableBranches = computed(() => {
  return branches.value.filter(b => b.id !== values.from_branch_id)
})

const canTransfer = computed(() => {
  return (
    sourceStock.value &&
    values.quantity > 0 &&
    values.quantity <= sourceStock.value.available_quantity &&
    values.from_branch_id !== values.to_branch_id
  )
})

const newSourceStock = computed(() => {
  if (!sourceStock.value) return 0
  return sourceStock.value.quantity - values.quantity
})
const newDestinationStock = computed(() => {
  if (!destinationStock.value) return values.quantity
  return destinationStock.value.quantity + values.quantity
})

// Method
const fetchProducts = async () => {
  try {
    await productStore.fetchProducts({ is_active: true, track_stock: true })
  } catch (error) {
    console.error('Error fetching product', error)
  }
}

const fetchBranches = async () => {
  try {
    await branchStore.fetchBranches({ is_active: true })
  } catch (error) {
    console.error('Error fecthing branch', error)
  }
}

const loadStockInfo = async () => {
  if (values.product_id) {
    try {
      //load product details
      selectedProduct.value = await productStore.fetchProductById(values.product_id)

      //Charger le stock de ce produit des branches
      if (values.from_branch_id) {
        const stocks = await stockStore.fetchStocksByBranch(values.from_branch_id)
        sourceStock.value = stocks.find(s => s.product_id === values.product_id)
      }
    } catch (error) {
      console.error('Error fecthing stock info', error)
    }
  }
}

const handleSubmit = async () => {
  generalError.value = null
  if (!canTransfer) {
    generalError.value = 'Veuillez verifier les informations du transfert'
    return
  }

  const success = await submit(async formvalue => {
    try {
      await stockStore.transferStock(formvalue)
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

const swapBranches = () => {
  const temp = values.from_branch_id
  setValue('from_branch_id', values.to_branch_id)
  setValue('to_branch_id', temp)
}

// Watchers
watch(
  () => [values.product_id, values.from_branch_id, values.to_branch_id],
  () => {
    loadStockInfo()
  }
)

onMounted(async () => {
  await Promise.all([fetchProducts(), fetchBranches()])

  if (route.query.product_id) {
    setValue('product_id', Number(route.query.product_id))
  }
  if (route.query.from_branch_id) {
    setValue('from_branch_id', Number(route.query.from_branch_id))
  }
})
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <AppButton variant="ghost" @click="handleCancel">
          <ArrowLeft class="w-5 h-5" />
        </AppButton>
        <div>
          <p class="text-bold text-2xl text-gray-900">Transfert de stock</p>
          <p class="text-gray-600 mt-1">Transferez du stock entre vos branches</p>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <AppButton variant="outline" :disabled="isSubmitting" @click="handleCancel">
          <X class="w-5 h-5 mr-2" />
        </AppButton>
        <AppButton
          variant="primary"
          @click="handleSubmit"
          :loading="isSubmitting"
          :disabled="!canTransfer"
        >
          <Save class="w-5 h-5 mr-2" />
          Transférer
        </AppButton>
      </div>
    </div>

    <!-- Error Alert -->
    <AppAlert v-if="generalError" type="danger" dismissible @dismiss="generalError = null">
      {{ generalError }}
    </AppAlert>

    <!-- Warning insuffisante -->
    <AppAlert type="warning" v-if="sourceStock && values.quantity > sourceStock.available_quantity">
      <div class="flex items-center gap-2">
        <AlertTriangle class="w-5 h-5 shrink-0 mt-0.5" />
        <div>
          <p class="font-medium">Stock Insuffisant</p>
          <p class="text-sm mt-1">
            Seulement {{ sourceStock.available_quantity }} unités disponible dans la branche source
          </p>
        </div>
      </div>
    </AppAlert>

    <form @submit.prevent="handleSubmit" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Main Form -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Product Selection Card -->
        <AppCard title="Produit à transférer">
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
        </AppCard>

        <!-- Transfer Route Card -->
        <AppCard title="Itinéraire du transfert">
          <div class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- From Branch -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">
                  Branche source <span class="text-danger-600">*</span>
                </label>
                <select
                  :value="values.from_branch_id"
                  @change="setValue('from_branch_id', Number(($event.target as HTMLSelectElement).value))"
                  :disabled="isSubmitting"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="0">Depuis...</option>
                  <option v-for="branch in branches" :key="branch.id" :value="branch.id">
                    {{ branch.name }} ({{ branch.code }})
                  </option>
                </select>
                <p v-if="errors.from_branch_id" class="mt-1.5 text-sm text-danger-600">
                  {{ errors.from_branch_id }}
                </p>
              </div>

              <!-- To Branch -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">
                  Branche destination <span class="text-danger-600">*</span>
                </label>
                <select
                  :value="values.to_branch_id"
                  @change="setValue('to_branch_id', Number(($event.target as HTMLSelectElement).value))"
                  :disabled="isSubmitting"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="0">Vers...</option>
                  <option
                    v-for="branch in availableBranches"
                    :key="branch.id"
                    :value="branch.id"
                  >
                    {{ branch.name }} ({{ branch.code }})
                  </option>
                </select>
                <p v-if="errors.to_branch_id" class="mt-1.5 text-sm text-danger-600">
                  {{ errors.to_branch_id }}
                </p>
              </div>
            </div>

            <!-- Swap Button -->
            <div class="flex justify-center">
              <AppButton
                type="button"
                variant="ghost"
                @click="swapBranches"
                :disabled="!values.from_branch_id || !values.to_branch_id || isSubmitting"
              >
                <ArrowRightLeft class="w-4 h-4 mr-2" />
                Inverser
              </AppButton>
            </div>

            <!-- Visual Flow -->
            <div
              v-if="values.from_branch_id && values.to_branch_id"
              class="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div class="flex items-center gap-2">
                <Building2 class="w-5 h-5 text-gray-400" />
                <span class="font-medium text-gray-900">
                  {{ branches.find(b => b.id === values.from_branch_id)?.name }}
                </span>
              </div>
              <ArrowRightLeft class="w-6 h-6 text-primary-600" />
              <div class="flex items-center gap-2">
                <Building2 class="w-5 h-5 text-gray-400" />
                <span class="font-medium text-gray-900">
                  {{ branches.find(b => b.id === values.to_branch_id)?.name }}
                </span>
              </div>
            </div>
          </div>
        </AppCard>

        <!-- Quantity & Notes Card -->
        <AppCard title="Quantité et notes">
          <div class="space-y-4">
            <!-- Quantity -->
            <div>
              <AppInput
                :model-value="values.quantity"
                @update:model-value="setValue('quantity', Number($event))"
                label="Quantité à transférer"
                type="number"
                placeholder="0"
                :min="1"
                :max="sourceStock?.available_quantity"
                :hint="sourceStock ? `Disponible: ${sourceStock.available_quantity}` : undefined"
                :error="errors.quantity"
                :disabled="isSubmitting || !sourceStock"
                required
              />
            </div>

            <!-- Quick Quantity Buttons -->
            <div v-if="sourceStock" class="flex gap-2">
              <AppButton
                v-for="percent in [25, 50, 75, 100]"
                :key="percent"
                type="button"
                variant="outline"
                size="sm"
                @click="setValue('quantity', Math.floor(sourceStock.available_quantity * (percent / 100)))"
                :disabled="isSubmitting"
              >
                {{ percent }}%
              </AppButton>
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
                placeholder="Raison du transfert, informations complémentaires..."
                :disabled="isSubmitting"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
              />
            </div>
          </div>
        </AppCard>
      </div>

      <!-- Sidebar -->
      <div class="space-y-6">
        <!-- Product Info Card -->
        <AppCard v-if="selectedProduct" title="Produit">
          <div class="space-y-3">
            <div class="flex items-center gap-3 pb-3 border-b border-gray-200">
              <div class="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center shrink-0">
                <Package class="w-6 h-6 text-gray-400" />
              </div>
              <div>
                <p class="font-medium text-gray-900">{{ selectedProduct.name }}</p>
                <p class="text-xs text-gray-500 font-mono">{{ selectedProduct.sku }}</p>
              </div>
            </div>

            <div class="flex items-center justify-between text-sm">
              <span class="text-gray-600">Unité</span>
              <AppBadge variant="secondary" size="sm">
                {{ selectedProduct.unit }}
              </AppBadge>
            </div>
          </div>
        </AppCard>

        <!-- Source Stock Card -->
        <AppCard v-if="sourceStock" title="Stock source">
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">Stock actuel</span>
              <span class="text-lg font-bold text-gray-900">{{ sourceStock.quantity }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">Disponible</span>
              <span class="font-semibold text-green-600">{{ sourceStock.available_quantity }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">Réservé</span>
              <span class="font-semibold text-orange-600">{{ sourceStock.reserved_quantity }}</span>
            </div>

            <div v-if="values.quantity > 0" class="pt-3 border-t border-gray-200">
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium text-gray-900">Nouveau stock</span>
                <span
                  :class="[
                    'text-lg font-bold',
                    newSourceStock <= selectedProduct?.alert_quantity
                      ? 'text-orange-600'
                      : 'text-gray-900',
                  ]"
                >
                  {{ newSourceStock }}
                </span>
              </div>
              <p class="text-xs text-gray-500 mt-1">
                -{{ values.quantity }} unités
              </p>
            </div>
          </div>
        </AppCard>

        <!-- Destination Stock Card -->
        <AppCard v-if="values.to_branch_id" title="Stock destination">
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">Stock actuel</span>
              <span class="text-lg font-bold text-gray-900">
                {{ destinationStock?.quantity || 0 }}
              </span>
            </div>

            <div v-if="values.quantity > 0" class="pt-3 border-t border-gray-200">
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium text-gray-900">Nouveau stock</span>
                <span class="text-lg font-bold text-green-600">
                  {{ newDestinationStock }}
                </span>
              </div>
              <p class="text-xs text-gray-500 mt-1">
                +{{ values.quantity }} unités
              </p>
            </div>
          </div>
        </AppCard>

        <!-- Summary Card -->
        <AppCard v-if="canTransfer" title="Résumé du transfert">
          <div class="space-y-3">
            <div class="p-4 bg-blue-50 rounded-lg text-center">
              <p class="text-sm text-gray-600 mb-1">Quantité transférée</p>
              <p class="text-3xl font-bold text-blue-600">{{ values.quantity }}</p>
            </div>

            <div class="grid grid-cols-2 gap-3 text-sm">
              <div class="p-3 bg-red-50 rounded-lg text-center">
                <p class="text-gray-600 mb-1">Source</p>
                <p class="font-bold text-red-600">-{{ values.quantity }}</p>
              </div>
              <div class="p-3 bg-green-50 rounded-lg text-center">
                <p class="text-gray-600 mb-1">Destination</p>
                <p class="font-bold text-green-600">+{{ values.quantity }}</p>
              </div>
            </div>
          </div>
        </AppCard>
      </div>
    </form>
  </div>
</template>
