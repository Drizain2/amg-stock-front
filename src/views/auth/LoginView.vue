<script setup lang="ts">
import { useRouter } from 'vue-router'
import LoginForm from '@/components/auth/LoginForm.vue'

const router = useRouter()

const goToRegister = () => {
  router.push({ name: 'Register' })
}

const handleSuccess = () => {
  router.push({ name: 'Dashboard' })
}
</script>

<template>
  <div>
    <LoginForm @success="handleSuccess" @register="goToRegister" />
  </div>
</template>