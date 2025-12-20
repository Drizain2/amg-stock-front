<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import AppInput from '@components/common/AppInput.vue'
import AppButton from '@components/common/AppButton.vue'
import AppAlert from '@components/common/AppAlert.vue'
import { useAuthStore } from '@/stores'
import { useForm } from '@/composables'
import type { RegisterRequest } from '@/types'

const emit = defineEmits<{
  success: []
  login: []
}>()

const router = useRouter()
const authStore = useAuthStore()

// Form state
interface RegisterFormData {
  first_name: string
  last_name: string
  email: string
  password: string
  password_confirmation: string
}

const { values, errors, isSubmitting, setValue, submit, setErrors, validateField } =
  useForm<RegisterFormData>(
    {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      password_confirmation: '',
    },
    {
      first_name: [
        { required: true, message: 'Le prénom est obligatoire' },
        { min: 2, message: 'Le prénom doit contenir au moins 2 caractères' },
      ],
      last_name: [
        { required: true, message: 'Le nom est obligatoire' },
        { min: 2, message: 'Le nom doit contenir au moins 2 caractères' },
      ],
      email: [
        { required: true, message: "L'email est obligatoire" },
        { email: true, message: 'Email invalide' },
      ],
      password: [
        { required: true, message: 'Le mot de passe est obligatoire' },
        { min: 8, message: 'Le mot de passe doit contenir au moins 8 caractères' },
        {
          custom: (value) => {
            const hasUpperCase = /[A-Z]/.test(value)
            const hasLowerCase = /[a-z]/.test(value)
            const hasNumbers = /\d/.test(value)
            if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
              return 'Le mot de passe doit contenir des majuscules, minuscules et chiffres'
            }
            return true
          },
        },
      ],
      password_confirmation: [
        { required: true, message: 'La confirmation est obligatoire' },
        {
          custom: (value) => {
            if (value !== values.password) {
              return 'Les mots de passe ne correspondent pas'
            }
            return true
          },
        },
      ],
    }
  )

const showPassword = ref(false)
const showPasswordConfirmation = ref(false)
const generalError = ref<string | null>(null)
const acceptTerms = ref(false)

// Password strength indicator
const passwordStrength = computed(() => {
  const password = values.password
  if (!password) return { score: 0, label: '', color: '' }

  let score = 0
  if (password.length >= 8) score++
  if (password.length >= 12) score++
  if (/[A-Z]/.test(password)) score++
  if (/[a-z]/.test(password)) score++
  if (/\d/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++

  const levels = [
    { score: 0, label: '', color: '' },
    { score: 2, label: 'Faible', color: 'bg-red-500' },
    { score: 3, label: 'Moyen', color: 'bg-orange-500' },
    { score: 5, label: 'Fort', color: 'bg-green-500' },
    { score: 6, label: 'Très fort', color: 'bg-green-600' },
  ]

  return levels.reduce((acc, level) => (score >= level.score ? level : acc))
})

const handleRegister = async () => {
  generalError.value = null

  if (!acceptTerms.value) {
    generalError.value = "Vous devez accepter les conditions d'utilisation"
    return
  }

  const success = await submit(async (formValues) => {
    try {
      const registerData: RegisterRequest = {
        email: formValues.email,
        password: formValues.password,
        password_confirmation: formValues.password_confirmation,
        first_name: formValues.first_name,
        last_name: formValues.last_name,
      }

      await authStore.register(registerData)
      emit('success')
      router.push({ name: 'Dashboard' })
    } catch (error: any) {
      if (error.status === 422 && error.errors) {
        setErrors(error.errors)
      } else {
        generalError.value = error.message || "Erreur lors de l'inscription. Veuillez réessayer."
      }
      throw error
    }
  })
}
</script>

<template>
  <form @submit.prevent="handleRegister" class="space-y-6">
    <!-- Title -->
    <div class="text-center mb-8">
      <h2 class="text-3xl font-bold text-gray-900">Créer un compte</h2>
      <p class="mt-2 text-sm text-gray-600">Rejoignez-nous dès aujourd'hui</p>
    </div>

    <!-- General Error Alert -->
    <AppAlert v-if="generalError" type="danger" dismissible @dismiss="generalError = null">
      {{ generalError }}
    </AppAlert>

    <!-- Form Fields -->
    <div class="space-y-5 p-4">
      <!-- Name Fields -->
      <div class="grid grid-cols-2 gap-4">
        <AppInput
          :model-value="values.first_name"
          @update:model-value="setValue('first_name', String($event))"
          label="Prénom"
          type="text"
          placeholder="John"
          autocomplete="given-name"
          :disabled="isSubmitting"
          :error="errors.first_name"
          required
        />

        <AppInput
          :model-value="values.last_name"
          @update:model-value="setValue('last_name', String($event))"
          label="Nom"
          type="text"
          placeholder="Doe"
          autocomplete="family-name"
          :disabled="isSubmitting"
          :error="errors.last_name"
          required
        />
      </div>

      <!-- Email Input -->
      <AppInput
        :model-value="values.email"
        @update:model-value="setValue('email', String($event))"
        label="Adresse email"
        type="email"
        placeholder="john.doe@exemple.com"
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
          autocomplete="new-password"
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
              @click="showPassword = !showPassword"
              class="text-gray-400 hover:text-gray-600 focus:outline-none"
              tabindex="-1"
            >
              <svg v-if="!showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            </button>
          </template>
        </AppInput>

        <!-- Password Strength Indicator -->
        <div v-if="values.password && passwordStrength.label" class="mt-2">
          <div class="flex items-center gap-2">
            <div class="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                :class="[passwordStrength.color, 'h-full transition-all duration-300']"
                :style="{ width: `${(passwordStrength.score / 6) * 100}%` }"
              ></div>
            </div>
            <span class="text-xs font-medium text-gray-600">{{ passwordStrength.label }}</span>
          </div>
        </div>
      </div>

      <!-- Password Confirmation -->
      <AppInput
        :model-value="values.password_confirmation"
        @update:model-value="setValue('password_confirmation', String($event))"
        label="Confirmer le mot de passe"
        :type="showPasswordConfirmation ? 'text' : 'password'"
        placeholder="••••••••"
        autocomplete="new-password"
        :disabled="isSubmitting"
        :error="errors.password_confirmation"
        required
      >
        <template #prepend>
          <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </template>
        <template #append>
          <button
            type="button"
            @click="showPasswordConfirmation = !showPasswordConfirmation"
            class="text-gray-400 hover:text-gray-600 focus:outline-none"
            tabindex="-1"
          >
            <svg v-if="!showPasswordConfirmation" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
            </svg>
          </button>
        </template>
      </AppInput>

      <!-- Terms and Conditions -->
      <div class="flex items-start">
        <input
          v-model="acceptTerms"
          type="checkbox"
          class="h-4 w-4 mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          :disabled="isSubmitting"
        />
        <label class="ml-2 text-sm text-gray-600 cursor-pointer">
          J'accepte les
          <a href="#" class="text-primary-600 hover:text-primary-500 font-medium">
            conditions d'utilisation
          </a>
          et la
          <a href="#" class="text-primary-600 hover:text-primary-500 font-medium">
            politique de confidentialité
          </a>
        </label>
      </div>
    </div>

    <!-- Submit Button -->
    <AppButton
      type="submit"
      variant="primary"
      size="lg"
      class="w-full"
      :loading="isSubmitting"
      :disabled="isSubmitting || !acceptTerms"
    >
      <template v-if="!isSubmitting">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
          />
        </svg>
        Créer mon compte
      </template>
    </AppButton>

    <!-- Login Link -->
    <div class="text-center">
      <p class="text-sm text-gray-600">
        Vous avez déjà un compte ?
        <button
          type="button"
          @click="emit('login')"
          class="font-medium text-primary-600 hover:text-primary-500 transition-colors"
        >
          Se connecter
        </button>
      </p>
    </div>
  </form>
</template>