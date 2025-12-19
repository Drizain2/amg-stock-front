<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push({ name: 'Dashboard' })
}

const reload = () => {
  window.location.reload()
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center px-4">
    <div class="text-center max-w-md">
      <!-- Icon -->
      <div class="mb-8">
        <span class="text-8xl">⚠️</span>
      </div>

      <!-- Title -->
      <h1 class="text-6xl font-bold text-warning-600 mb-4">500</h1>
      <h2 class="text-2xl font-semibold text-secondary-700 mb-4">Erreur serveur</h2>

      <!-- Description -->
      <p class="text-secondary-600 mb-8">
        Une erreur s'est produite sur le serveur. Veuillez réessayer plus tard.
      </p>

      <!-- Actions -->
      <div class="flex gap-4 justify-center">
        <button @click="reload" class="btn btn-outline">🔄 Recharger</button>
        <button @click="goHome" class="btn btn-primary">🏠 Accueil</button>
      </div>
    </div>
  </div>
</template>
