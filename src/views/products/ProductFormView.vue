<script setup lang="ts">
import AppAlert from '@/components/common/AppAlert.vue'
import AppButton from '@/components/common/AppButton.vue'
import AppCard from '@/components/common/AppCard.vue'
import AppInput from '@/components/common/AppInput.vue'
import { useForm } from '@/composables'
import { useCompanyStore, useProductStore } from '@/stores'
import {
  CreatedProductRequest,
  ProductFormData,
  ProductResponse,
  ProductUnit,
  UpdateProductRequest,
} from '@/types'
import { ProductUnit as ProductUnitEnum } from '@/types'
import { ArrowLeft, Save, X } from 'lucide-vue-next'
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const productStore = useProductStore()
const companyStore = useCompanyStore()

const generalError = ref<string | null>(null)

const isEditMode = computed(() => !!route.params.id)
const pageTitle = computed(() => (isEditMode.value ? 'Modifier le produit' : 'Nouveau produit'))

// Product units options
const unitOptions = [
  { value: ProductUnitEnum.PIECE, label: 'Pièce' },
  { value: ProductUnitEnum.KG, label: 'Kilogramme (kg)' },
  { value: ProductUnitEnum.LITER, label: 'Litre (L)' },
  { value: ProductUnitEnum.METER, label: 'Mètre (m)' },
  { value: ProductUnitEnum.BOX, label: 'Boîte' },
  { value: ProductUnitEnum.PACK, label: 'Pack' },
]

//Form
const { values, setValue, errors, setErrors, isSubmitting, submit } = useForm<ProductFormData>(
  {
    id: 0,
    name: '',
    sku: '',
    description: '',
    image: '',
    cost_price: 0,
    selling_price: 0,
    tax_rate: 0,
    alert_quantity: 5,
    unit: ProductUnit.PIECE,
    is_active: true,
    tract_stock: true,
    category_id: undefined,
    company_id: 0,
  },
  {
    name: [
      { required: true, message: 'Le nom est obligatoire' },
      { min: 3, message: 'Le nom doit contenir au moins 3 caractere' },
    ],
    sku: [
      { required: true, message: 'Le SKU est obligatoire' },
      { min: 3, message: 'Le SKU doit contenir au moins 3 caractères' },
    ],
    selling_price: [
      { required: true, message: 'Le prix de vente est obligatoire' },
      {
        custom: value => {
          if (value <= 0) return 'Le prix doit être supérieur à 0'
          return true
        },
      },
    ],
    alert_quantity: [
      { required: true, message: "Le seuil d'alerte est obligatoire" },
      {
        custom: value => {
          if (value < 0) return 'Le seuil ne peut pas être négatif'
          return true
        },
      },
    ],
  }
)

//Computed
const margin = computed(() => {
  if (values.cost_price && values.selling_price) {
    return values.selling_price - values.cost_price
  }
  return 0
})

const marginPercent = computed(() => {
  if (values.cost_price && values.selling_price && values.cost_price > 0) {
    return ((values.selling_price - values.cost_price) / values.cost_price) * 100
  }
  return 0
})

//Methodes
const generateSku = () => {
  const prefix = values.name.substring(0, 3).toUpperCase()
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(4, '0')
  setValue('sku', `${prefix}-${random}`)
}

const handleSubmit = async () => {
  generalError.value = null

  const success = await submit(async formValues => {
    try {
      if (isEditMode.value) {
        const updateData: UpdateProductRequest = {
          name: formValues.name,
          description: formValues.description,
          selling_price: formValues.selling_price,
          cost_price: Number(formValues.cost_price),
          sku: formValues.sku,
          is_active: formValues.is_active,
          tax_rate: formValues.tax_rate,
          alert_quantity: formValues.alert_quantity,
        }
        await productStore.updateProduct(Number(route.params.id), updateData)
      } else {
        const createData: CreatedProductRequest = {
          ...formValues,
          cost_price: Number(formValues.cost_price),
          company_id: companyStore.currentCompany?.id || 1,
        }
        await productStore.createProduct(createData)
        router.push({ name: 'ProductList' })
      }
    } catch (error: any) {
      if (error.status == 422 && error.errors) {
        setErrors(error.errors)
      } else {
        generalError.value = error.message || 'Une erreur est survenue'
      }
      throw error
    }
  })
}
const handleCancel = () => {
  router.push({ name: 'ProductList' })
}

onMounted(async()=>{
  if(isEditMode.value){
    try{
      const product = await productStore.fetchProductById(Number(route.params.id))
      Object.keys(values).forEach((key) => {
        const value = product[key as keyof typeof product]
        if(value !== undefined){
          setValue(key as keyof ProductFormData, value as any)
        }
        
      });
    }catch(error){
      console.error('Error loading product:', error)
      generalError.value = 'Erreur lors du chargement du produit'
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
            {{
              isEditMode
                ? 'Modifiez les informations du produit'
                : 'Ajoutez un nouveau produit à votre catalogue'
            }}
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

    <!-- Form -->
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Main informations -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Basic Info Card -->
          <AppCard title="Informations de base">
            <div class="space-y-4">
              <!-- Name -->
              <AppInput
                :model-value="values.name"
                @update:model-value="setValue('name', String($event))"
                label="Nom du produit"
                placeholder="Ex: Laptop Dell XPS 15"
                :error="errors.name"
                :disabled="isSubmitting"
                required
              />

              <!-- SKU -->
              <div class="flex gap-2">
                <div class="flex-1">
                  <AppInput
                    :model-value="values.sku"
                    @update:model-value="setValue('sku', String($event))"
                    label="SKU (Code produit)"
                    placeholder="Ex: LAP-001"
                    :error="errors.sku"
                    :disabled="isSubmitting"
                    required
                  />
                </div>
                <div class="pt-6">
                  <AppButton
                    type="button"
                    variant="outline"
                    @click="generateSku"
                    :disabled="isSubmitting || !values.name"
                  >
                    Générer
                  </AppButton>
                </div>
              </div>

              <!-- description -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5"> Description </label>
                <textarea
                  :value="values.description"
                  @input="setValue('description', ($event.target as HTMLTextAreaElement).value)"
                  rows="4"
                  placeholder="Description détaillée du produit..."
                  :disabled="isSubmitting"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                />
              </div>

              <!-- Category -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5"> Catégorie </label>
                <select
                  :value="values.category_id"
                  @change="
                    setValue(
                      'category_id',
                      Number(($event.target as HTMLSelectElement).value) || undefined
                    )
                  "
                  :disabled="isSubmitting"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option :value="undefined">Aucune catégorie</option>
                  <!-- TODO: Load categories dynamically -->
                  <option value="1">Électronique</option>
                  <option value="2">Informatique</option>
                  <option value="3">Mobilier</option>
                </select>
              </div>

              <!-- Unit -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">
                  Unité de mesure <span class="text-danger-600">*</span>
                </label>
                <select
                  :value="values.unit"
                  @change="
                    setValue('unit', ($event.target as HTMLSelectElement).value as ProductUnit)
                  "
                  :disabled="isSubmitting"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option v-for="option in unitOptions" :key="option.value" :value="option.value">
                    {{ option.label }}
                  </option>
                </select>
              </div>
            </div>
          </AppCard>

          <!-- Pricing Card -->
          <AppCard title="Tarification">
            <div class="space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <!-- cost price -->
                <AppInput
                  :model-value="Number(values.cost_price)"
                  @update:model-value="setValue('cost_price', Number($event))"
                  label="Prix d'achat (XOF)"
                  type="number"
                  placeholder="0"
                  :min="0"
                  :step="100"
                  :error="errors.cost_price"
                  :disabled="isSubmitting"
                />
                <!-- Sell price -->
                <AppInput
                  :model-value="Number(values.selling_price)"
                  @update:model-value="setValue('selling_price', Number($event))"
                  label="Prix de vente (XOF)"
                  type="number"
                  placeholder="0"
                  :min="0"
                  :step="100"
                  :error="errors.selling_price"
                  :disabled="isSubmitting"
                />

                <!-- Tax Rate -->
                <AppInput
                  :model-value="values.tax_rate"
                  @update:model-value="setValue('tax_rate', Number($event))"
                  label="Taux de taxe (%)"
                  type="number"
                  placeholder="0"
                  :min="0"
                  :max="100"
                  :step="0.01"
                  :error="errors.tax_rate"
                  :disabled="isSubmitting"
                />
                <!-- Margin Display -->
                <div v-if="margin > 0" class="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div class="flex items-center justify-between">
                    <span class="text-sm font-medium text-green-900">Marge bénéficiaire</span>
                    <div class="text-right">
                      <p class="text-lg font-bold text-green-600">
                        {{ margin.toLocaleString('fr-FR') }} FCFA
                      </p>
                      <p class="text-sm text-green-600">{{ marginPercent.toFixed(2) }} %</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </AppCard>

          <!-- Inventory Card -->
          <AppCard title="Gestion du stock">
            <div class="space-y">
              <div class="grid grid-cols-2 gap-4">
                <!-- Track Stoke -->
                <label class="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    :checked="values.tract_stock"
                    @change="setValue('tract_stock', ($event.target as HTMLInputElement).checked)"
                    :disabled="isSubmitting"
                    class="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span class="ml-2 text-sm font-medium text-gray-700">
                    Suivre le stock de ce produit
                  </span>
                </label>

                <!-- Alert Quantity -->
                <AppInput
                  :model-value="values.alert_quantity"
                  @update:model-value="setValue('alert_quantity', Number($event))"
                  label="Seuil d'alerte de stock"
                  type="number"
                  placeholder="5"
                  :min="0"
                  hint="Une alerte sera déclenchée lorsque le stock atteindra ce niveau"
                  :error="errors.alert_quantity"
                  :disabled="isSubmitting"
                  required
                />
              </div>
            </div>
          </AppCard>
          <AppCard title="Statut">
            <div class="space-y-4">
              <!-- Active Status -->
              <label class="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  :checked="values.is_active"
                  @change="setValue('is_active', ($event.target as HTMLInputElement).checked)"
                  :disabled="isSubmitting"
                  class="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span class="ml-2 text-sm font-medium text-gray-700"> Produit actif </span>
              </label>

              <p class="text-xs text-gray-500">
                Les produits inactifs ne seront pas visibles dans le catalogue
              </p>
            </div>
          </AppCard>
        </div>

        <!-- SideBar -->
        <div class="space-y-6">
          <!-- Status Card -->
        </div>
      </div>
    </form>
  </div>
</template>
