<!-- src/components/products/InitialStockForm.vue -->
<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Branch, InitialStockData } from '@/types'
import AppInput from '@/components/common/AppInput.vue'
import AppButton from '@/components/common/AppButton.vue'
import AppBadge from '@/components/common/AppBadge.vue'
import { Plus, Trash2, Building2, Package, Info } from 'lucide-vue-next'

interface Props {
  branches: Branch[]
  modelValue: InitialStockData[]
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:modelValue': [value: InitialStockData[]]
}>()

const localStocks = ref<InitialStockData[]>([...props.modelValue])

const availableBranches = computed(() => {
  const usedBranchIds = localStocks.value.map(s => s.branch_id)
  return props.branches.filter(b => !usedBranchIds.includes(b.id))
})

const totalQuantity = computed(() => {
  return localStocks.value.reduce((sum, stock) => sum + (stock.quantity || 0), 0)
})

const totalValue = computed(() => {
  return localStocks.value.reduce((sum, stock) => 
    sum + ((stock.quantity || 0) * (stock.unit_cost || 0)), 0
  )
})

const addStock = () => {
  if (availableBranches.value.length === 0) return
  
  localStocks.value.push({
    branch_id: availableBranches.value[0].id,
    quantity: 0,
    unit_cost: 0,
    notes: ''
  })
  
  emit('update:modelValue', localStocks.value)
}

const removeStock = (index: number) => {
  localStocks.value.splice(index, 1)
  emit('update:modelValue', localStocks.value)
}

const updateStock = (index: number, field: keyof InitialStockData, value: any) => {
  localStocks.value[index] = {
    ...localStocks.value[index],
    [field]: value
  }
  emit('update:modelValue', localStocks.value)
}

const getBranchName = (branchId: number) => {
  return props.branches.find(b => b.id === branchId)?.name || ''
}

const getBranchCode = (branchId: number) => {
  return props.branches.find(b => b.id === branchId)?.code || ''
}
</script>

<template>
  <div class="space-y-4">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h3 class="text-lg font-semibold text-gray-900">Stock initial par branche</h3>
        <p class="text-sm text-gray-600 mt-1">
          Définissez le stock de départ pour chaque branche (optionnel)
        </p>
      </div>
      <AppButton
        type="button"
        variant="primary"
        size="sm"
        @click="addStock"
        :disabled="availableBranches.length === 0"
      >
        <Plus class="w-4 h-4 mr-2" />
        Ajouter une branche
      </AppButton>
    </div>

    <!-- Info Alert -->
    <div v-if="localStocks.length === 0" class="p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <div class="flex items-start gap-3">
        <Info class="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <p class="text-sm font-medium text-blue-900">Stock initial optionnel</p>
          <p class="text-xs text-blue-700 mt-1">
            Vous pouvez créer le produit sans stock initial et l'ajouter plus tard, 
            ou définir le stock de départ pour chaque branche maintenant.
          </p>
        </div>
      </div>
    </div>

    <!-- Stock Summary (if any) -->
    <div v-if="localStocks.length > 0" class="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
      <div class="text-center">
        <p class="text-xs text-gray-600 mb-1">Branches configurées</p>
        <p class="text-2xl font-bold text-gray-900">{{ localStocks.length }}</p>
      </div>
      <div class="text-center">
        <p class="text-xs text-gray-600 mb-1">Quantité totale</p>
        <p class="text-2xl font-bold text-blue-600">{{ totalQuantity }}</p>
      </div>
      <div class="text-center">
        <p class="text-xs text-gray-600 mb-1">Valeur totale</p>
        <p class="text-xl font-bold text-purple-600">
          {{ totalValue.toLocaleString('fr-FR') }} XOF
        </p>
      </div>
    </div>

    <!-- Stock Forms -->
    <div v-if="localStocks.length > 0" class="space-y-3">
      <div
        v-for="(stock, index) in localStocks"
        :key="index"
        class="p-4 bg-white border-2 border-gray-200 rounded-lg hover:border-primary-200 transition-all"
      >
        <div class="flex items-start gap-4">
          <!-- Branch Icon -->
          <div class="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center shrink-0">
            <Building2 class="w-6 h-6 text-primary-600" />
          </div>

          <!-- Form Fields -->
          <div class="flex-1 space-y-3">
            <!-- Branch Selection -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">
                Branche <span class="text-danger-600">*</span>
              </label>
              <select
                :value="stock.branch_id"
                @change="updateStock(index, 'branch_id', Number(($event.target as HTMLSelectElement).value))"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option 
                  v-for="branch in [...branches.filter(b => b.id === stock.branch_id), ...availableBranches]"
                  :key="branch.id"
                  :value="branch.id"
                >
                  {{ branch.name }} ({{ branch.code }})
                </option>
              </select>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <!-- Quantity -->
              <AppInput
                :model-value="stock.quantity"
                @update:model-value="updateStock(index, 'quantity', Number($event))"
                label="Quantité initiale"
                type="number"
                placeholder="0"
                :min="0"
                required
              >
                <template #prepend>
                  <Package class="w-5 h-5 text-gray-400" />
                </template>
              </AppInput>

              <!-- Unit Cost -->
              <AppInput
                :model-value="stock.unit_cost || 0"
                @update:model-value="updateStock(index, 'unit_cost', Number($event))"
                label="Coût unitaire (XOF)"
                type="number"
                placeholder="0"
                :min="0"
                :step="0.01"
                hint="Optionnel"
              />
            </div>

            <!-- Notes -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">
                Notes
              </label>
              <textarea
                :value="stock.notes"
                @input="updateStock(index, 'notes', ($event.target as HTMLTextAreaElement).value)"
                rows="2"
                placeholder="Notes sur ce stock initial (optionnel)..."
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none text-sm"
              />
            </div>

            <!-- Stock Info -->
            <div class="flex items-center gap-4 pt-2 border-t border-gray-200">
              <div class="flex items-center gap-2 text-sm">
                <span class="text-gray-600">Branche:</span>
                <AppBadge variant="secondary" size="sm">
                  {{ getBranchName(stock.branch_id) }}
                </AppBadge>
              </div>
              <div class="flex items-center gap-2 text-sm">
                <span class="text-gray-600">Valeur totale:</span>
                <span class="font-semibold text-gray-900">
                  {{ ((stock.quantity || 0) * (stock.unit_cost || 0)).toLocaleString('fr-FR') }} XOF
                </span>
              </div>
            </div>
          </div>

          <!-- Remove Button -->
          <button
            type="button"
            @click="removeStock(index)"
            class="p-2 text-danger-600 hover:bg-danger-50 rounded-lg transition-colors"
            title="Supprimer"
          >
            <Trash2 class="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>

    <!-- No branches available -->
    <div v-if="availableBranches.length === 0 && localStocks.length > 0" class="p-3 bg-orange-50 border border-orange-200 rounded-lg">
      <p class="text-sm text-orange-800">
        Toutes les branches disponibles ont été configurées.
      </p>
    </div>
  </div>
</template>