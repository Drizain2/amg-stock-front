<script setup lang="ts">
import { useAuth } from '@/composables'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const emit = defineEmits<{
  toggleSidebar: []
}>()

const { user, userFullName, logout } = useAuth()
const router = useRouter()

const showUserMenu = ref(false)

const handleLogout = async () => {  
  await logout()
  router.push('/auth/login')
}
</script>

<template>
  <header class="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-40">
    <div class="flex items-center justify-between h-full px-6">
      <!-- Left side -->
      <div class="flex items-center gap-4">
        <button
          type="button"
          class="text-gray-500 hover:text-gray-700 transition-colors"
          @click="emit('toggleSidebar')"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        <!-- Logo/Title -->
        <div class="flex items-center gap-2">
          <span class="text-2xl">coli</span>
          <h1 class="text-xl font-bold text-gray-900">Stock Management</h1>
        </div>
      </div>

      <!-- Rigth Side -->
      <div class="flex items-center gap-4">
        <!-- Notification -->
        <button
          type="button"
          class="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
        </button>

        <!-- User Menu -->
        <div class="relative">
          <button
            type="button"
            class="flex items-center gap-3 hover:bg-gray-100 rounded-lg px-3 py-2 transition-colors"
            @click="showUserMenu = !showUserMenu"
          >
            <div
              class="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white font-semibold"
            >
              {{
                userFullName
                  .split(' ')
                  .map(n => n[0])
                  .join('')
                  .substring(0, 2)
              }}
            </div>
            <div class="text-left hidden md:block">
              <p class="tex-sm font-medium text-gray-900">{{ userFullName }}</p>
              <p class="text-xs text-gray-500">{{ user?.role.label }}</p>
            </div>
            <svg class="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              />
            </svg>
          </button>

          <!-- Dropdown -->
          <Transition name="dropdown">
            <div
              v-if="showUserMenu"
              class="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
            >
              <RouterLink
                to="/profile"
                class="flex items-center gap-3 p-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                @click="showUserMenu = false"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                Mon profil
              </RouterLink>
              <RouterLink
                to="/settings"
                class="flex items-center gap-3 p-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                @click="showUserMenu = false"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                Paramètres
              </RouterLink>

              <hr class="my-2 border-gray-200" />

              <button type="button" class="flex items-center gap-3 px-4 py-2 text-sm  hover:bg-gray-100 transition-colors text-danger-600 w-full" @click="handleLogout">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Déconnexion
              </button>
            </div>
          </Transition>
        </div>
      </div>
    </div>
  </header>
</template>
