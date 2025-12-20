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
  <nav class="mb-4">
    <ol class="flex items-center flex-wrap gap-2">
      <li
        v-for="(item, index) in breadcrumbs"
        :key="index"
        class="flex items-center gap-2"
      >
        <!-- Separator -->
        <svg
          v-if="index > 0"
          class="w-5 h-5 text-gray-400"
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
          class="text-sm text-gray-600 hover:text-primary-600 transition-colors"
        >
          {{ item.label }}
        </RouterLink>
        <span v-else class="text-sm text-gray-900 font-medium">
          {{ item.label }}
        </span>
      </li>
    </ol>
  </nav>
</template>
