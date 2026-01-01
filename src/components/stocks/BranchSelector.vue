<!-- src/components/stocks/BranchSelector.vue -->
<script setup lang="ts">
import { computed } from 'vue'
import type { Branch } from '@/types'
import { Building2, CheckCircle } from 'lucide-vue-next'

interface Props {
  branches: Branch[]
  selectedBranchId?: number | null
  showAllOption?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  selectedBranchId: null,
  showAllOption: true
})

const emit = defineEmits<{
  'update:selectedBranchId': [branchId: number | null]
}>()

const handleSelect = (branchId: number | null) => {
  emit('update:selectedBranchId', branchId)
}
</script>

<template>
  <div class="space-y-2">
    <label class="block text-sm font-medium text-gray-700 mb-2">
      Filtrer par branche
    </label>

    <!-- All Branches Option -->
    <button
      v-if="showAllOption"
      type="button"
      @click="handleSelect(null)"
      :class="[
        'w-full flex items-center justify-between p-3 rounded-lg border-2 transition-all',
        selectedBranchId === null
          ? 'border-primary-600 bg-primary-50'
          : 'border-gray-200 hover:border-gray-300 bg-white'
      ]"
    >
      <div class="flex items-center gap-3">
        <div :class="[
          'w-10 h-10 rounded-lg flex items-center justify-center',
          selectedBranchId === null ? 'bg-primary-100' : 'bg-gray-100'
        ]">
          <Building2 :class="[
            'w-5 h-5',
            selectedBranchId === null ? 'text-primary-600' : 'text-gray-400'
          ]" />
        </div>
        <div class="text-left">
          <p :class="[
            'font-medium',
            selectedBranchId === null ? 'text-primary-900' : 'text-gray-900'
          ]">
            Toutes les branches
          </p>
          <p class="text-xs text-gray-500">
            {{ branches.length }} branche{{ branches.length > 1 ? 's' : '' }}
          </p>
        </div>
      </div>
      <CheckCircle
        v-if="selectedBranchId === null"
        class="w-5 h-5 text-primary-600"
      />
    </button>

    <!-- Individual Branches -->
    <button
      v-for="branch in branches"
      :key="branch.id"
      type="button"
      @click="handleSelect(branch.id)"
      :class="[
        'w-full flex items-center justify-between p-3 rounded-lg border-2 transition-all',
        selectedBranchId === branch.id
          ? 'border-primary-600 bg-primary-50'
          : 'border-gray-200 hover:border-gray-300 bg-white'
      ]"
    >
      <div class="flex items-center gap-3">
        <div :class="[
          'w-10 h-10 rounded-lg flex items-center justify-center',
          selectedBranchId === branch.id ? 'bg-primary-100' : 'bg-gray-100'
        ]">
          <Building2 :class="[
            'w-5 h-5',
            selectedBranchId === branch.id ? 'text-primary-600' : 'text-gray-400'
          ]" />
        </div>
        <div class="text-left">
          <p :class="[
            'font-medium',
            selectedBranchId === branch.id ? 'text-primary-900' : 'text-gray-900'
          ]">
            {{ branch.name }}
          </p>
          <p class="text-xs text-gray-500">{{ branch.code }}</p>
        </div>
      </div>
      <CheckCircle
        v-if="selectedBranchId === branch.id"
        class="w-5 h-5 text-primary-600"
      />
    </button>
  </div>
</template>