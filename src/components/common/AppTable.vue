<script setup lang="ts" generic="T">
interface Column {
  key: string
  label: string
  sortable?: boolean
  width?: string
  align?: 'left' | 'center' | 'right'
}

interface Props {
  columns: Column[]
  data: T[]
  loading?: boolean
  emptyText?: string
  hoverable?: boolean
  striped?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  emptyText: 'Aucune donnée disponible',
  hoverable: true,
  striped: false,
})

const emit = defineEmits<{
  sort: [column: string]
  rowClick: [row: T]
}>()

const getCellValue = (row: any, key: string) => {
  return key.split('.').reduce((obj, k) => obj?.[k], row)
}

const getAlignClass = (align?: string) => {
  switch (align) {
    case 'center':
      return 'text-center'
    case 'right':
      return 'text-right'
    default:
      return 'text-left'
  }
}
</script>

<template>
  <div class="overflow-x-auto">
    <table class="w-full border-collapse">
      <!-- Head -->
      <thead class="bg-gray-50 border-b border-gray-200">
        <tr>
          <th
            class="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"
            v-for="column in columns"
            :key="column.key"
            :style="{ width: column.width }"
            :class="[getAlignClass(column.align)]"
          >
            <div
              class="flex items-center gap-2"
              :class="{
                'justify-center': column.align === 'center',
                'justify-end': column.align === 'right',
              }"
            >
              <span>{{ column.label }}</span>
              <button
                v-if="column.sortable"
                type="button"
                class="text-gray-400 hover:text-gray-600"
                @click="emit('sort', column.key)"
              >
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 12l5 5 5-5H5z" />
                  <path d="M15 8l-5-5-5 5h10z" />
                </svg>
              </button>
            </div>
          </th>
        </tr>
      </thead>

      <!-- Body -->
      <tbody class="table-body">
        <!-- Loading -->
        <tr v-if="loading">
          <td
            :colspan="columns.length"
            class="text-center py-8 px-6 whitespace-nowrap text-sm text-gray-900"
          >
            <div class="flex justify-center">
              <svg
                class="animate-spin h-8 w-8 text-primary-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
          </td>
        </tr>

        <!-- Empty -->
        <tr v-else-if="!data || data.length === 0">
          <td
            :colspan="columns.length"
            class="text-center py-8 text-gray-500 px-6whitespace-nowrap text-sm"
          >
            {{ emptyText }}
          </td>
        </tr>

        <!-- Data -->
        <tr
          v-else
          v-for="(row, index) in data"
          :key="index"
          :class="[
            'border-b border-gray-200 transition-colors',
            { 'hover:bg-gray-50 cursor-pointer': hoverable },
            { 'bg-gray-50': striped && index % 2 === 1 },
          ]"
          @click="emit('rowClick', row)"
        >
          <td v-for="column in columns" :key="column.key" :class="[getAlignClass(column.align)]">
            <slot :name="`cell-${column.key}`" :row="row" :value="getCellValue(row, column.key)">
              {{ getCellValue(row, column.key) }}
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

