<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

interface BreadcrumbItem {
  label: string
  path?: string
}

const route = useRoute()

const breadcrumbs = computed<BreadcrumbItem[]>(() => {
  // Générer les breadcrumbs depuis la route
  const paths = route.path.split('/').filter(Boolean)
  const items: BreadcrumbItem[] = [{ label: 'Accueil', path: '/dashboard' }]

  let currentPath = ''
  paths.forEach((path, index) => {
    currentPath += `/${path}`
    
    // Labels personnalisés selon les routes
    const labels: Record<string, string> = {
      dashboard: 'Tableau de bord',
      companies: 'Entreprises',
      branches: 'Branches',
      products: 'Produits',
      stocks: 'Stocks',
      create: 'Créer',
      edit: 'Modifier',
    }

    const label = labels[path] || path
    
    items.push({
      label,
      path: index === paths.length - 1 ? undefined : currentPath,
    })
  })

  return items
})
</script>

<template>
  <nav class="breadcrumb">
    <ol class="breadcrumb-list">
      <li
        v-for="(item, index) in breadcrumbs"
        :key="index"
        class="breadcrumb-item"
      >
        <!-- Separator -->
        <svg
          v-if="index > 0"
          class="breadcrumb-separator"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fill-rule="evenodd"
            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
            clip-rule="evenodd"
          />
        </svg>

        <!-- Link or text -->
        <RouterLink
          v-if="item.path"
          :to="item.path"
          class="breadcrumb-link"
        >
          {{ item.label }}
        </RouterLink>
        <span v-else class="breadcrumb-current">
          {{ item.label }}
        </span>
      </li>
    </ol>
  </nav>
</template>

<style scoped>
.breadcrumb {
  @apply mb-4;
}

.breadcrumb-list {
  @apply flex items-center flex-wrap gap-2;
}

.breadcrumb-item {
  @apply flex items-center gap-2;
}

.breadcrumb-separator {
  @apply w-5 h-5 text-gray-400;
}

.breadcrumb-link {
  @apply text-sm text-gray-600 hover:text-primary-600 transition-colors;
}

.breadcrumb-current {
  @apply text-sm text-gray-900 font-medium;
}
</style>