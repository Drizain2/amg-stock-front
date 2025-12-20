<script setup lang="ts">
import { useRouter } from 'vue-router'
import RegisterForm from '@/components/auth/RegisterForm.vue'

const router = useRouter()

const goToLogin = () => {
  router.push({ name: 'Login' })
}

const handleSuccess = () => {
  router.push({ name: 'Dashboard' })
}
</script>

<template>
  <div>
    <RegisterForm @success="handleSuccess" @login="goToLogin" />
  </div>
</template>
