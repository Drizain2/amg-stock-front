<!-- src/components/auth/LoginForm.vue -->
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import AppInput from '../common/AppInput.vue';
import AppButton from '../common/AppButton.vue';
import AppSpinner from '../common/AppSpinner.vue';
import { useAuthStore } from '@/stores';
import { LoginRequest } from '@/types';
import AppAlert from '../common/AppAlert.vue';

const authStore = useAuthStore()
const emit = defineEmits<{
  (e: 'success'): void
  (e: 'register'): void
}>()

const router = useRouter()
// const authStore = useAuthStore()

const form = reactive<LoginRequest>({
  email:'',
  password:''
})
const remember = ref(false)
const loading = ref(false)
const error = ref<string | null>(null)


async function handleLogin() {
  error.value = null
  loading.value = true
   await authStore.login(form)

}
</script>

<template>
  <form @submit.prevent="handleLogin" class="space-y-6 ">
    <div class="text-center mb-8">
      <h2 class="text-3xl font-bold text-gray-900">Connexion</h2>
      <p class="mt-2 text-sm text-gray-600">Accédez à votre tableau de bord</p>
    </div>

    <AppAlert v-if="error" type="error" class="mb-4">
      {{ error }}
    </AppAlert>

    <div class="space-y-5">
      <AppInput
        v-model="form.email"
        label="Email"
        type="email"
        placeholder="john.doe@exemple.com"
        required
        autocomplete="email"
        :disabled="loading"
      />

      <AppInput
        v-model="form.password"
        label="Mot de passe"
        type="password"
        placeholder="••••••••"
        required
        autocomplete="current-password"
        :disabled="loading"
      />

      <div class="flex items-center justify-between">
        <label class="flex items-center">
          <input
            v-model="remember"
            type="checkbox"
            class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <span class="ml-2 text-sm text-gray-600">Rester connecté</span>
        </label>

        <a href="#" class="text-sm font-medium text-indigo-600 hover:text-indigo-500">
          Mot de passe oublié ?
        </a>
      </div>
    </div>

    <AppButton
      type="submit"
      variant="primary"
      size="lg"
      class="w-full"
      :loading="loading"
      :disabled="loading"
    >
      <AppSpinner v-if="loading" class="mr-2" />
      Se connecter
    </AppButton>

    <p class="text-center text-sm text-gray-600">
      Pas encore de compte ?
      <button
        type="button"
        @click="emit('register')"
        class="font-medium text-indigo-600 hover:text-indigo-500"
      >
        S'inscrire
      </button>
    </p>
  </form>
</template>
