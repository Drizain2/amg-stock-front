<!-- src/components/auth/RegisterForm.vue -->
<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
// import { useAuthStore } from '@/stores/auth.store'
import AppInput from '@components/common/AppInput.vue'
import AppButton from '@components/common/AppButton.vue'
import AppAlert from '@components/common/AppAlert.vue'
import AppSpinner from '@components/common/AppSpinner.vue'

const emit = defineEmits<{
  (e: 'success'): void
  (e: 'login'): void
}>()

const router = useRouter()
// const authStore = useAuthStore()

const name = ref('')
const email = ref('')
const password = ref('')
const password_confirmation = ref('')
const loading = ref(false)
const error = ref<string | null>(null)

async function handleRegister() {
  error.value = null
  loading.value = true

  if (password.value !== password_confirmation.value) {
    error.value = 'Les mots de passe ne correspondent pas'
    loading.value = false
    return
  }
}
</script>

<template>
  <form @submit.prevent="handleRegister" class="space-y-6">
    <div class="text-center mb-8">
      <h2 class="text-3xl font-bold text-gray-900">Créer un compte</h2>
      <p class="mt-2 text-sm text-gray-600">Rejoignez-nous dès aujourd'hui</p>
    </div>

    <AppAlert v-if="error" type="error" class="mb-4">
      {{ error }}
    </AppAlert>

    <div class="space-y-5">
      <AppInput
        v-model="name"
        label="Nom complet"
        type="text"
        placeholder="John Doe"
        required
        autocomplete="name"
        :disabled="loading"
      />

      <AppInput
        v-model="email"
        label="Email"
        type="email"
        placeholder="john.doe@exemple.com"
        required
        autocomplete="email"
        :disabled="loading"
      />

      <AppInput
        v-model="password"
        label="Mot de passe"
        type="password"
        placeholder="••••••••"
        required
        minlength="8"
        autocomplete="new-password"
        :disabled="loading"
      />

      <AppInput
        v-model="password_confirmation"
        label="Confirmer le mot de passe"
        type="password"
        placeholder="••••••••"
        required
        autocomplete="new-password"
        :disabled="loading"
      />
    </div>

    <AppButton type="submit" variant="primary" size="lg" class="w-full" :loading="loading">
      <AppSpinner v-if="loading" class="mr-2" />
      S'inscrire
    </AppButton>
    <div class="bg-primary-600 text-white p-4">
      Test color
      </div>
    <p class="text-center text-sm text-gray-600">
      Déjà un compte ?
      <button
        type="button"
        @click="emit('login')"
        class="font-medium text-indigo-600 hover:text-indigo-500"
      >
        Se connecter
      </button>
    </p>
  </form>
</template>
