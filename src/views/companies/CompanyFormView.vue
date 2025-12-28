<!-- src/views/companies/CompanyFormView.vue -->
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useCompanyStore } from '@/stores'
import { useForm } from '@/composables'
import type { CompanyFormData } from '@/types'
import AppInput from '@components/common/AppInput.vue'
import AppButton from '@components/common/AppButton.vue'
import AppCard from '@components/common/AppCard.vue'
import AppAlert from '@components/common/AppAlert.vue'
import { ArrowLeft, Save, X, Building2 } from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()
const companyStore = useCompanyStore()

const isEditMode = computed(() => !!route.params.id)
const pageTitle = computed(() => isEditMode.value ? 'Modifier l\'entreprise' : 'Nouvelle entreprise')

const generalError = ref<string | null>(null)

// Form
const { values, errors, isSubmitting, setValue, submit, setErrors } = useForm<CompanyFormData>(
  {
    name: '',
    email: '',
    phone: '',
    address: '',
    tax_id: '',
    is_active: true,
  },
  {
    name: [
      { required: true, message: 'Le nom est obligatoire' },
      { min: 3, message: 'Le nom doit contenir au moins 3 caractères' },
    ],
    email: [
      { email: true, message: 'Email invalide' },
    ],
    phone: [
      {
        pattern: /^(\+225|0)?[0-9]{10}$/,
        message: 'Numéro de téléphone invalide',
      },
    ],
  }
)

// Methods
const handleSubmit = async () => {
  generalError.value = null

  const success = await submit(async (formValues) => {
    try {
      if (isEditMode.value) {
        await companyStore.updateCompany(Number(route.params.id), formValues)
      } else {
        await companyStore.createCompany(formValues)
      }

      router.push({ name: 'CompanyList' })
    } catch (error: any) {
      if (error.status === 422 && error.errors) {
        setErrors(error.errors)
      } else {
        generalError.value = error.message || 'Une erreur est survenue'
      }
      throw error
    }
  })
}

const handleCancel = () => {
  router.push({ name: 'CompanyList' })
}

// Lifecycle
onMounted(async () => {
  if (isEditMode.value) {
    try {
      const company = await companyStore.fetchCompanyById(Number(route.params.id))
      
      // Populate form
      Object.keys(values).forEach((key) => {
        const value = company[key as keyof typeof company]
        if (value !== undefined) {
          setValue(key as keyof CompanyFormData, value as any)
        }
      })
    } catch (error) {
      console.error('Error loading company:', error)
      generalError.value = 'Erreur lors du chargement de l\'entreprise'
    }
  }
})
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <AppButton variant="ghost" icon @click="handleCancel">
          <ArrowLeft class="w-5 h-5" />
        </AppButton>
        <div>
          <h1 class="text-2xl font-bold text-gray-900">{{ pageTitle }}</h1>
          <p class="text-gray-600 mt-1">
            {{ isEditMode ? 'Modifiez les informations de l\'entreprise' : 'Créez une nouvelle entreprise dans votre système' }}
          </p>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <AppButton variant="outline" @click="handleCancel" :disabled="isSubmitting">
          <X class="w-5 h-5 mr-2" />
          Annuler
        </AppButton>
        <AppButton variant="primary" @click="handleSubmit" :loading="isSubmitting">
          <Save class="w-5 h-5 mr-2" />
          {{ isEditMode ? 'Enregistrer' : 'Créer' }}
        </AppButton>
      </div>
    </div>

    <!-- Error Alert -->
    <AppAlert v-if="generalError" type="danger" dismissible @dismiss="generalError = null">
      {{ generalError }}
    </AppAlert>

    <form @submit.prevent="handleSubmit" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Main Information -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Basic Info Card -->
        <AppCard title="Informations de base">
          <div class="space-y-4">
            <!-- Name -->
            <AppInput
              :model-value="values.name"
              @update:model-value="setValue('name', String($event))"
              label="Nom de l'entreprise"
              placeholder="Ex: TechCorp Solutions"
              :error="errors.name"
              :disabled="isSubmitting"
              required
            >
              <template #prepend>
                <Building2 class="w-5 h-5 text-gray-400" />
              </template>
            </AppInput>

            <!-- Email -->
            <AppInput
              :model-value="values.email ||''"
              @update:model-value="setValue('email', String($event))"
              label="Email"
              type="email"
              placeholder="contact@entreprise.com"
              :error="errors.email"
              :disabled="isSubmitting"
            >
              <template #prepend>
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </template>
            </AppInput>

            <!-- Phone -->
            <AppInput
              :model-value="values.phone||''"
              @update:model-value="setValue('phone', String($event))"
              label="Téléphone"
              type="tel"
              placeholder="+225 XX XX XX XX XX"
              hint="Format: +225 XXXXXXXXXX ou 0XXXXXXXXXX"
              :error="errors.phone"
              :disabled="isSubmitting"
            >
              <template #prepend>
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </template>
            </AppInput>

            <!-- Address -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">
                Adresse
              </label>
              <textarea
                :value="values.address"
                @input="setValue('address', ($event.target as HTMLTextAreaElement).value)"
                rows="3"
                placeholder="Adresse complète de l'entreprise..."
                :disabled="isSubmitting"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
              />
            </div>
          </div>
        </AppCard>

        <!-- Tax Information Card -->
        <AppCard title="Informations fiscales">
          <div class="space-y-4">
            <!-- Tax ID -->
            <AppInput
              :model-value="values.tax_id ||0"
              @update:model-value="setValue('tax_id', $event as string)"
              label="Numéro fiscal / SIRET"
              placeholder="Ex: 123456789"
              hint="Numéro d'identification fiscale de l'entreprise"
              :error="errors.tax_id"
              :disabled="isSubmitting"
            >
              <template #prepend>
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </template>
            </AppInput>

            <div class="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div class="flex items-start gap-2">
                <svg class="w-5 h-5 text-blue-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p class="text-sm font-medium text-blue-900">Information</p>
                  <p class="text-xs text-blue-700 mt-1">
                    Ces informations fiscales sont utilisées pour la génération des documents comptables
                  </p>
                </div>
              </div>
            </div>
          </div>
        </AppCard>
      </div>

      <!-- Sidebar -->
      <div class="space-y-6">
        <!-- Status Card -->
        <AppCard title="Statut">
          <div class="space-y-4">
            <!-- Active Status -->
            <label class="flex items-center cursor-pointer p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <input
                type="checkbox"
                :checked="values.is_active"
                @change="setValue('is_active', ($event.target as HTMLInputElement).checked)"
                :disabled="isSubmitting"
                class="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <div class="ml-3">
                <p class="text-sm font-medium text-gray-900">
                  Entreprise active
                </p>
                <p class="text-xs text-gray-500 mt-0.5">
                  Les entreprises inactives ne peuvent pas créer de nouvelles branches
                </p>
              </div>
            </label>

            <div class="p-3 bg-gray-50 rounded-lg">
              <div class="flex items-center gap-2 mb-2">
                <div :class="[
                  'w-3 h-3 rounded-full',
                  values.is_active ? 'bg-green-500' : 'bg-gray-400'
                ]"></div>
                <span class="text-sm font-medium text-gray-700">
                  Statut: {{ values.is_active ? 'Actif' : 'Inactif' }}
                </span>
              </div>
              <p class="text-xs text-gray-600">
                {{ values.is_active 
                  ? 'L\'entreprise peut gérer ses branches et produits' 
                  : 'L\'entreprise est désactivée temporairement'
                }}
              </p>
            </div>
          </div>
        </AppCard>

        <!-- Info Card -->
        <AppCard title="À propos">
          <div class="space-y-3 text-sm text-gray-600">
            <div class="flex items-start gap-2">
              <svg class="w-5 h-5 text-primary-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>Une entreprise peut avoir plusieurs branches dans différentes localisations.</p>
            </div>
            
            <div class="flex items-start gap-2">
              <svg class="w-5 h-5 text-primary-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>Chaque branche peut gérer son propre stock de manière indépendante.</p>
            </div>

            <div class="flex items-start gap-2">
              <svg class="w-5 h-5 text-primary-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <p>Les utilisateurs peuvent être assignés à des entreprises et branches spécifiques.</p>
            </div>
          </div>
        </AppCard>

        <!-- Preview Card (only in edit mode) -->
        <AppCard v-if="isEditMode" title="Aperçu">
          <div class="space-y-3">
            <div class="p-4 bg-linear-to-br from-primary-50 to-blue-50 rounded-lg border border-primary-200">
              <div class="flex items-center gap-3 mb-3">
                <div class="w-12 h-12 rounded-lg bg-primary-600 flex items-center justify-center">
                  <Building2 class="w-6 h-6 text-white" />
                </div>
                <div>
                  <p class="font-semibold text-gray-900">{{ values.name || 'Nom de l\'entreprise' }}</p>
                  <p class="text-xs text-gray-600">{{ values.email || 'Email' }}</p>
                </div>
              </div>
              <div class="text-xs text-gray-600 space-y-1">
                <p v-if="values.phone">📞 {{ values.phone }}</p>
                <p v-if="values.address">📍 {{ values.address }}</p>
              </div>
            </div>
          </div>
        </AppCard>
      </div>
    </form>
  </div>
</template>