<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuth, usePermissions } from '@/composables'

interface Props {
  collapsed?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  collapsed: false,
})

const route = useRoute()
const { user } = useAuth()
const perms = usePermissions()

interface MenuItem {
  title: string
  icon: string
  path: string
  permission?: boolean
  children?: MenuItem[]
}

const menuItems = computed<MenuItem[]>(() => [
  {
    title: 'Tableau de bord',
    icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
    path: '/dashboard',
    permission: true,
  },
  {
    title: 'Entreprises',
    icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
    path: '/companies',
    permission: perms.companies.value.canView,
  },
  {
    title: 'Branches',
    icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z',
    path: '/branches',
    permission: perms.branches.value.canView,
  },
  {
    title: 'Produits',
    icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
    path: '/products',
    permission: perms.products.value.canView,
  },
  {
    title: 'Stocks',
    icon: 'M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4',
    path: '/stocks',
    permission: perms.stocks.value.canView,
  },
])

const isActive = (path: string) => {
  return route.path.startsWith(path)
}
</script>

<template>
  <aside
    :class="[
      'sidebar',
      collapsed ? 'sidebar-collapsed' : 'sidebar-expanded'
    ]"
  >
    <!-- User info -->
    <div v-if="!collapsed" class="sidebar-user">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-semibold">
          {{ user?.first_name?.[0] }}{{ user?.last_name?.[0] }}
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-gray-900 truncate">
            {{ user?.full_name }}
          </p>
          <p class="text-xs text-gray-500 truncate">
            {{ user?.role.label }}
          </p>
        </div>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="sidebar-nav">
      <RouterLink
        v-for="item in menuItems.filter(i => i.permission)"
        :key="item.path"
        :to="item.path"
        :class="[
          'nav-item',
          isActive(item.path) ? 'nav-item-active' : 'nav-item-inactive'
        ]"
        :title="collapsed ? item.title : undefined"
      >
        <svg class="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="item.icon" />
        </svg>
        <span v-if="!collapsed" class="nav-item-text">
          {{ item.title }}
        </span>
      </RouterLink>
    </nav>

    <!-- Footer -->
    <div v-if="!collapsed" class="sidebar-footer">
      <p class="text-xs text-gray-500 text-center">
        © 2024 Stock Management
      </p>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  @apply fixed left-0 top-16 bottom-0 bg-white border-r border-gray-200 transition-all duration-300 z-30;
  @apply flex flex-col;
}

.sidebar-expanded {
  @apply w-64;
}

.sidebar-collapsed {
  @apply w-16;
}

.sidebar-user {
  @apply p-4 border-b border-gray-200;
}

.sidebar-nav {
  @apply flex-1 overflow-y-auto py-4 px-3 space-y-1;
}

.nav-item {
  @apply flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors;
}

.nav-item-active {
  @apply bg-primary-50 text-primary-700;
}

.nav-item-inactive {
  @apply text-gray-700 hover:bg-gray-100;
}

.nav-item-text {
  @apply text-sm font-medium;
}

.sidebar-footer {
  @apply p-4 border-t border-gray-200;
}
</style>