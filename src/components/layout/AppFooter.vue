<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>
<template>
  <footer class="mt-auto py-4 border-t border-gray-200 bg-white">
    <div class="flex items-center justify-between">
      <p class="text-sm text-gray-600">
        <p class="text-center mt-8 text-xs text-gray-500">
        © {{currentYear}} StockMaster Pro. Tous droits réservés.
      </p>
      </p>

      <div class="flex items-centers gap-4 text-sm test-gray-600">
        <a href="#" class="hover:text-primary-600 transition-colors"> À propos</a>
        <span class="text-gray-300">|</span>
        <a href="#" class="hover:text-primary-600 transition-colors"> Support</a>
        <span class="text-gray-300">|</span>
        <a href="#" class="hover:text-primary-600 transition-colors"> Confidentialité</a>
      </div>
    </div>
  </footer>
</template>
