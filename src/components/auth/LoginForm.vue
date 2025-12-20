-- Active: 1764154971244@@127.0.0.1@3306@gestion_stock
<!-- src/components/auth/LoginForm.vue -->
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import AppInput from '../common/AppInput.vue'
import AppButton from '../common/AppButton.vue'
import AppSpinner from '../common/AppSpinner.vue'
import { useAuthStore } from '@/stores'
import { LoginRequest } from '@/types'
import AppAlert from '../common/AppAlert.vue'
import { useForm } from '@/composables'

const authStore = useAuthStore()
const router = useRouter()
const emit = defineEmits<{
  success: []
  register: []
}>()

//Form state
const { values, setValue, errors, setErrors, touched, isSubmitting, isValid, submit, reset } =
  useForm<LoginRequest>(
    {
      email: '',
      password: '',
    },
    {
      email: [
        { required: true, message: "L'email est obligatoire" },
        { email: true, message: "L'email invalide" },
      ],
      password: [
        { required: true, message: 'Le mot de passe est obligatoire' },
        { min: 6, message: 'Minimum 6 caractères' },
      ],
    }
  )
const remember = ref(false)
const loading = ref(false)
const error = ref<string | null>(null)
const showPassword = ref(false)
const generalError = ref<string | null>(null)

const handleLogin = async () => {
  generalError.value = null

  const success = await submit(async formValues => {
    try {
      await authStore.login(formValues)
      emit('success')
      router.push({ name: 'Dashboard' })
    } catch (error: any) {
      if (error.status === 422 && error.errors) {
        setErrors(error.errors)
      } else {
        generalError.value = error.message || 'Identifiants invalides. Veuillez réessayer.'
      }
      throw error
    }
  })
}
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}
</script>

<template>
  <form @submit.prevent="handleLogin" class="space-y-6">
    <div class="text-center mb-8">
      <h2 class="text-3xl font-bold text-gray-900">Connexion</h2>
      <p class="mt-2 text-sm text-gray-600">Accédez à votre tableau de bord</p>
    </div>

    <AppAlert v-if="error" type="error" class="mb-4">
      {{ generalError }}
    </AppAlert>

    <!-- Form Field -->
    <div class="space-y-5">
      <AppInput
        v-model="values.email"
        @update:model-value="setValue('email', String($event))"
        label="Email"
        type="email"
        placeholder="john.doe@exemple.com"
        required
        autocomplete="email"
        :disabled="isSubmitting"
        :error="errors.email"
      >
        <template #prepend>
          <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
            />
          </svg>
        </template>
      </AppInput>
      <!-- Password Input -->
      <AppInput
        v-model="values.password"
        @update:model-value="setValue('password', String($event))"
        label="Mot de passe"
        :type="showPassword ? 'text' : 'password'"
        placeholder="••••••••"
        required
        autocomplete="current-password"
        :disabled="isSubmitting"
        :error="errors.password"
      >
        <template #prepend>
          <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </template>
        <template #append>
          <button
            type="button"
            @click="togglePasswordVisibility"
            class="text-gray-400 hover:text-gray-600 focus:outline-none"
            tabindex="-1"
          >
            <svg
              v-if="!showPassword"
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
              />
            </svg>
          </button>
        </template>
      </AppInput>

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

    <!-- Submit Button -->
    <AppButton
      type="submit"
      variant="primary"
      size="lg"
      class="w-full"
      :loading="isSubmitting"
      :disabled="isSubmitting"
    >
      <template v-if="!isSubmitting"> Se connecter </template>
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
