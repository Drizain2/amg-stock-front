<script setup lang="ts">
import { ProductFilters, ProductUnit } from '@/types'
import { ref } from 'vue';
import AppButton from '../common/AppButton.vue';
import AppInput from '../common/AppInput.vue';

interface Props {
  filters: ProductFilters
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:filters': [filters: Partial<ProductFilters>]
  reset: []
}>()

//Filtre local
const localFilters = ref<Partial<ProductFilters>>({...props.filters})

// Product units options
const unitOptions = [
  { value: '', label: 'Toutes les unités' },
  { value: ProductUnit.PIECE, label: 'Pièce' },
  { value: ProductUnit.KG, label: 'Kilogramme' },
  { value: ProductUnit.LITER, label: 'Litre' },
  { value: ProductUnit.METER, label: 'Mètre' },
  { value: ProductUnit.BOX, label: 'Boîte' },
  { value: ProductUnit.PACK, label: 'Pack' },
]

// Status options
const statusOptions = [
  { value: '', label: 'Tous les statuts' },
  { value: 'true', label: 'Actif' },
  { value: 'false', label: 'Inactif' },
]

// Stock options
const stockOptions = [
  { value: '', label: 'Tous' },
  { value: 'true', label: 'En stock' },
  { value: 'false', label: 'Rupture' },
]

const updateLocalFilter = (key: keyof ProductFilters, value: any) => {
  localFilters.value[key] = value as any
}

const applyFilters =()=>{
    emit('update:filters',localFilters.value)
}

const resetFilters =()=>{
    emit('reset'),
    localFilters.value ={}
}
</script>

<template>
  <div class="p-6 bg-gray-50">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Category Filter -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1.5">
          Catégorie
        </label>
        <select
          :value="localFilters.category_id"
          @change="updateLocalFilter('category_id', ($event.target as HTMLSelectElement).value)"
          class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="">Toutes les catégories</option>
          <!-- TODO: Load categories dynamically -->
          <option value="1">Électronique</option>
          <option value="2">Informatique</option>
          <option value="3">Mobilier</option>
        </select>
      </div>

      <!-- Status Filter -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1.5">
          Statut
        </label>
        <select
          :value="localFilters.is_active?.toString()"
          @change="updateLocalFilter('is_active', ($event.target as HTMLSelectElement).value === 'true' ? true : ($event.target as HTMLSelectElement).value === 'false' ? false : undefined)"
          class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        >
          <option v-for="option in statusOptions" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
      </div>

      <!-- Stock Tracking Filter -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1.5">
          Suivi de stock
        </label>
        <select
          :value="localFilters.track_stock?.toString()"
          @change="updateLocalFilter('track_stock', ($event.target as HTMLSelectElement).value === 'true' ? true : ($event.target as HTMLSelectElement).value === 'false' ? false : undefined)"
          class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="">Tous</option>
          <option value="true">Avec suivi</option>
          <option value="false">Sans suivi</option>
        </select>
      </div>

      <!-- Stock Status Filter -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1.5">
          État du stock
        </label>
        <select
          :value="localFilters.in_stock?.toString()"
          @change="updateLocalFilter('in_stock', ($event.target as HTMLSelectElement).value === 'true' ? true : ($event.target as HTMLSelectElement).value === 'false' ? false : undefined)"
          class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        >
          <option v-for="option in stockOptions" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
      </div>

      <!-- Min Price -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1.5">
          Prix minimum (XOF)
        </label>
        <AppInput
          :model-value="localFilters.min_price ?? 0"
          @update:model-value="updateLocalFilter('min_price', $event)"
          type="number"
          placeholder="0"
          :min=0
        />
      </div>

      <!-- Max Price -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1.5">
          Prix maximum (XOF)
        </label>
        <AppInput
          :model-value="localFilters.max_price ?? 0"
          @update:model-value="updateLocalFilter('max_price', $event)"
          type="number"
          placeholder="1000000"
          :min="0"
        />
      </div>

      <!-- Low Stock Filter -->
      <div class="flex items-end">
        <label class="flex items-center cursor-pointer">
          <input
            type="checkbox"
            :checked="localFilters.low_stock"
            @change="updateLocalFilter('low_stock', ($event.target as HTMLInputElement).checked || undefined)"
            class="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          <span class="ml-2 text-sm font-medium text-gray-700">
            Stock faible uniquement
          </span>
        </label>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
      <AppButton variant="outline" @click="resetFilters">
        Réinitialiser
      </AppButton>
      <AppButton variant="primary" @click="applyFilters">
        Appliquer les filtres
      </AppButton>
    </div>
  </div>
</template>
