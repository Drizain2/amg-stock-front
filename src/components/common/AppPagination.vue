<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  currentPage: number
  totalPages: number
  perPage?: number
  total?: number
  maxPages?: number
}

const props = withDefaults(defineProps<Props>(), {
  maxPages: 7,
})

const emit = defineEmits<{
  'update:currentPage': [page: number]
  'update:perPage': [perPage: number]
}>()

const pages = computed(() => {
  const pageNumbers: (number | string)[] = []
  const { currentPage, totalPages, maxPages } = props

  if (totalPages <= maxPages) {
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i)
    }
  } else {
    const leftSide = Math.floor(maxPages / 2)
    const rightSide = maxPages - leftSide - 1

    if (currentPage <= leftSide + 1) {
      for (let i = 1; i <= maxPages - 1; i++) {
        pageNumbers.push(i)
      }
      pageNumbers.push('...')
      pageNumbers.push(totalPages)
    } else if (currentPage >= totalPages - rightSide) {
      pageNumbers.push(1)
      pageNumbers.push('...')
      for (let i = totalPages - maxPages + 2; i <= totalPages; i++) {
        pageNumbers.push(i)
      }
    } else {
      pageNumbers.push(1)
      pageNumbers.push('...')
      for (let i = currentPage - leftSide + 1; i <= currentPage + rightSide - 1; i++) {
        pageNumbers.push(i)
      }
      pageNumbers.push('...')
      pageNumbers.push(totalPages)
    }
  }

  return pageNumbers
})

const goToPage = (page: number) => {
  if (page >= 1 && page <= props.totalPages && page !== props.currentPage) {
    emit('update:currentPage', page)
  }
}

const hasNext = computed(() => props.currentPage < props.totalPages)
const hasPrevious = computed(() => props.currentPage > 1)
</script>

<template>
  <div class="flex items-center justify-between">
    <!-- Info -->
    <div v-if="total" class="text-sm text-gray-700">
      Affichage de
      <span class="font-medium">{{ (currentPage - 1) * perPage! + 1 }}</span>
      à
      <span class="font-medium">{{ Math.min(currentPage * perPage!, total) }}</span>
      sur
      <span class="font-medium">{{ total }}</span>
      résultats
    </div>

    <!-- Pagination -->
    <nav class="flex items-center gap-1">
      <!-- Previous -->
      <button
        type="button"
        :disabled="!hasPrevious"
        :class="[
          'pagination-btn',
          hasPrevious ? 'hover:bg-gray-100' : 'opacity-50 cursor-not-allowed',
        ]"
        @click="goToPage(currentPage - 1)"
      >
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fill-rule="evenodd"
            d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
            clip-rule="evenodd"
          />
        </svg>
      </button>

      <!-- Page numbers -->
      <button
        v-for="(page, index) in pages"
        :key="index"
        type="button"
        :disabled="page === '...'"
        :class="[
          'pagination-btn',
          page === currentPage ? 'pagination-btn-active' : 'hover:bg-gray-100',
          page === '...' ? 'cursor-default' : '',
        ]"
        @click="typeof page === 'number' && goToPage(page)"
      >
        {{ page }}
      </button>

      <!-- Next -->
      <button
        type="button"
        :disabled="!hasNext"
        :class="[
          'px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md transition-colors duration-200',
          hasNext
            ? 'hover:bg-gray-100'
            : 'opacity-50 cursor-not-allowed bg-primary-600 text-white border-primary-600',
        ]"
        @click="goToPage(currentPage + 1)"
      >
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fill-rule="evenodd"
            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
    </nav>
  </div>
</template>

<style scoped>
.pagination-btn-active {
  @apply bg-primary-600 text-white border-primary-600;
}
</style>
