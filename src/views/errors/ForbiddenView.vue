<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '@/composables'

const router = useRouter()
const route = useRoute()
const { userRole, user } = useAuth()

const message = computed(() => {
  return route.params.message as string || "Vous n'avez pas les permissions nécessaires pour accéder à cette page."
})

const goHome = () => {
  router.push({ name: 'Dashboard' })
}

const goBack = () => {
  router.back()
}

const contactAdmin = () => {
  // Logique pour contacter l'admin ou ouvrir un ticket
  console.log('Contact admin')
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center px-4">
    <div class="text-center max-w-md">
      <!-- Icon -->
      <div class="mb-8">
        <span class="text-8xl">🚫</span>
      </div>

      <!-- Title -->
      <h1 class="text-6xl font-bold text-danger-600 mb-4">403</h1>
      <h2 class="text-2xl font-semibold text-secondary-700 mb-4">Accès refusé</h2>

      <!-- Description -->
      <p class="text-secondary-600 mb-2">
        {{ message }}
      </p>

      <div v-if="user" class="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p class="text-sm text-blue-800 mb-1">
          <strong>Votre rôle:</strong> {{ user.role.label }}
        </p>
        <p class="text-xs text-blue-600">
          Pour accéder à cette ressource, vous devez disposer de permissions supplémentaires.
        </p>
      </div>

      <!-- Actions -->
      <div class="flex flex-col gap-3 mt-8">
        <div class="flex gap-4 justify-center">
          <button @click="goBack" class="btn btn-outline">
            Retour
          </button>
          <button @click="goHome" class="btn btn-primary">
            Accueil
          </button>
        </div>
        <button 
          @click="contactAdmin" 
          class="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          Demander l'accès à un administrateur
        </button>
      </div>
    </div>
  </div>
</template>