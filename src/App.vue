<script setup lang="ts">
import { onMounted, ref } from 'vue'
import AppHeader from './components/layout/AppHeader.vue';

onMounted(() => {
  console.log('App mounted')
})
</script>

<template>
  <div id="app" class="min-h-screen">
    <RouterView />
  </div>
</template>
