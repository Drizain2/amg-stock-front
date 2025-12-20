<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import AppInput from '@components/common/AppInput.vue'
import AppButton from '@components/common/AppButton.vue'
import AppAlert from '@components/common/AppAlert.vue'
import { useAuthStore } from '@/stores'
import { useForm } from '@/composables'
import type { LoginRequest } from '@/types'

const emit = defineEmits<{
  success: []
  register: []
}>()

const router = useRouter()
const authStore = useAuthStore()

// Form state
const { values, errors, isSubmitting, setValue, submit, setErrors } = useForm<LoginRequest>(
  {
    email: '',
    password: '',
  },
  {
    email: [
      { required: true, message: 'L\'email est obligatoire' },
      { email: true, message: 'Email invalide' },
    ],
    password: [
      { required: true, message: 'Le mot de passe est obligatoire' },
      { min: 6, message: 'Le mot de passe doit contenir au moins 6 caractères' },
    ],
  }
)

const remember = ref(false)
const showPassword = ref(false)
const generalError = ref<string | null>(null)

const handleLogin = async () => {
  generalError.value = null

  const success = await submit(async (formValues) => {
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
    <!-- Title -->
    <div class="text-center mb-8">
      <h2 class="text-3xl font-bold text-gray-900">Connexion</h2>
      <p class="mt-2 text-sm text-gray-600">Accédez à votre tableau de bord</p>
    </div>

    <!-- General Error Alert -->
    <AppAlert v-if="generalError" type="danger" dismissible @dismiss="generalError = null">
      {{ generalError }}
    </AppAlert>

    <!-- Form Fields -->
    <div class="space-y-5 p-4">
      <!-- Email Input -->
      <AppInput
        :model-value="values.email"
        @update:model-value="setValue('email', String($event))"
        label="Adresse email"
        type="email"
        placeholder="exemple@email.com"
        autocomplete="email"
        :disabled="isSubmitting"
        :error="errors.email"
        required
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
      <div>
        <AppInput
          :model-value="values.password"
          @update:model-value="setValue('password', String($event))"
          label="Mot de passe"
          :type="showPassword ? 'text' : 'password'"
          placeholder="••••••••"
          autocomplete="current-password"
          :disabled="isSubmitting"
          :error="errors.password"
          required
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
              <svg v-if="!showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      </div>

      <!-- Remember Me & Forgot Password -->
      <div class="flex items-center justify-between">
        <label class="flex items-center cursor-pointer">
          <input
            v-model="remember"
            type="checkbox"
            class="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            :disabled="isSubmitting"
          />
          <span class="ml-2 text-sm text-gray-600">Se souvenir de moi</span>
        </label>

        <a
          href="#"
          class="text-sm font-medium text-primary-600 hover:text-primary-500 transition-colors"
          @click.prevent="$router.push({ name: 'ForgotPassword' })"
        >
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
      <template v-if="!isSubmitting">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
          />
        </svg>
        Se connecter
      </template>
    </AppButton>

    <!-- Register Link -->
    <div class="text-center">
      <p class="text-sm text-gray-600">
        Pas encore de compte ?
        <button
          type="button"
          @click="emit('register')"
          class="font-medium text-primary-600 hover:text-primary-500 transition-colors"
        >
          Créer un compte
        </button>
      </p>
    </div>
    
  </form>
</template>