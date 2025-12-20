<script setup lang="ts">
import { onMounted } from 'vue'

onMounted(() => {
  console.log('App mounted')
})
</script>

<template>
  <div id="app" class="min-h-screen">
    <RouterView />
  </div>
</template>
