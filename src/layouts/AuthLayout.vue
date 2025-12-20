<!-- src/layouts/AuthLayout.vue -->
<script setup lang="ts">
import AppFooter from '@/components/layout/AppFooter.vue';
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute()
const pageTitle = computed(()=>{
  return route.meta.title as string || "Authentification"
})
</script>

<template>
  <div
    class="main-h-screen bg-linear-to-br from primary-50 to-secondary-100 flex items-center justifiy-center p-4"
  >
    <div class="w-full max-w-m">
      <!-- Logo/Branding -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-primary-600 mb-2">Stock Manager</h1>
        <p class="text-secondary-600">Systeme de gestion de stock multi-tenant</p>
      </div>

      <!-- Card principale -->
      <div class="bg-white rounded-2xl shadow-xl p-">
        <h2 class="text-2xl font-semibold text-center mb-6 text-secondary-900">
          {{ pageTitle }}
        </h2>

        <!-- COntenu de la page -->
        <RouterView />
      </div>
      <AppFooter />
    </div>
  </div>
</template>
<style>
/* Animations personnalisées */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
