<!-- src/views/companies/CompanyDetailsView.vue -->
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useCompanyStore, useBranchStore } from '@/stores'
import { usePermissions } from '@/composables'
import type { Company, Branch } from '@/types'
import AppButton from '@components/common/AppButton.vue'
import AppCard from '@components/common/AppCard.vue'
import AppBadge from '@components/common/AppBadge.vue'
import AppTable from '@components/common/AppTable.vue'
import {
  ArrowLeft,
  Edit,
  Trash2,
  Building2,
  MapPin,
  Mail,
  Phone,
  FileText,
  Plus,
  Users,
  Package,
} from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()
const companyStore = useCompanyStore()
const branchStore = useBranchStore()
const permissions = usePermissions()

const company = ref<Company | null>(null)
const branches = ref<Branch[]>([])
const loading = ref(true)

const canEdit = computed(() => permissions.companies.value.canEdit)
const canDelete = computed(() => permissions.companies.value.canDelete)
const canManageBranches = computed(() => permissions.branches.value.canCreate)

// Branch columns
const branchColumns = [
  { key: 'name', label: 'Branche', sortable: true },
  { key: 'code', label: 'Code', sortable: true },
  { key: 'contact', label: 'Contact', sortable: false },
  { key: 'status', label: 'Statut', sortable: false, align: 'center' as const },
  { key: 'created', label: 'Créée le', sortable: true },
  { key: 'actions', label: 'Actions', width: '100px', align: 'right' as const },
]

// Methods
const fetchCompanyDetails = async () => {
  loading.value = true
  try {
    const companyId = Number(route.params.id)
    company.value = await companyStore.fetchCompanyById(companyId)

    // Fetch branches for this company
    branches.value = await branchStore.fetchBranchesByCompany(companyId)
  } catch (error) {
    console.error('Error loading company:', error)
  } finally {
    loading.value = false
  }
}

const handleEdit = () => {
  if (company.value) {
    router.push({ name: 'CompanyEdit', params: { id: company.value.id } })
  }
}

const handleDelete = async () => {
  if (!company.value) return

  if (confirm(`Êtes-vous sûr de vouloir supprimer "${company.value.name}" ?`)) {
    try {
      await companyStore.deleteCompany(company.value.id)
      router.push({ name: 'CompanyList' })
    } catch (error) {
      console.error('Error deleting company:', error)
    }
  }
}

const goBack = () => {
  router.push({ name: 'CompanyList' })
}

const goToCreateBranch = () => {
  router.push({
    name: 'BranchCreate',
    query: { company_id: company.value?.id },
  })
}

const goToBranchDetails = (branch: Branch) => {
  router.push({ name: 'BranchDetails', params: { id: branch.id } })
}

const goToEditBranch = (branch: Branch) => {
  router.push({ name: 'BranchEdit', params: { id: branch.id } })
}

// Lifecycle
onMounted(() => {
  fetchCompanyDetails()
})
</script>

<template>
  <div v-if="loading" class="flex items-center justify-center h-96">
    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
  </div>

  <div v-else-if="company" class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <AppButton variant="ghost" icon @click="goBack">
          <ArrowLeft class="w-5 h-5" />
        </AppButton>
        <div>
          <h1 class="text-2xl font-bold text-gray-900">{{ company.name }}</h1>
          <p class="text-gray-600 mt-1">Détails de l'entreprise</p>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <AppButton v-if="canEdit" variant="outline" @click="handleEdit">
          <Edit class="w-5 h-5 mr-2" />
          Modifier
        </AppButton>
        <AppButton v-if="canDelete" variant="danger" @click="handleDelete">
          <Trash2 class="w-5 h-5 mr-2" />
          Supprimer
        </AppButton>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <AppCard :padding="false">
        <div class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 mb-1">Branches</p>
              <p class="text-2xl font-bold text-primary-600">{{ branches.length }}</p>
            </div>
            <div class="p-3 rounded-full bg-primary-100">
              <MapPin class="w-6 h-6 text-primary-600" />
            </div>
          </div>
        </div>
      </AppCard>

      <AppCard :padding="false">
        <div class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 mb-1">Branches actives</p>
              <p class="text-2xl font-bold text-green-600">
                {{ branches.filter(b => b.is_active).length }}
              </p>
            </div>
            <div class="p-3 rounded-full bg-green-100">
              <Building2 class="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </AppCard>

      <AppCard :padding="false">
        <div class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 mb-1">Utilisateurs</p>
              <p class="text-2xl font-bold text-purple-600">-</p>
            </div>
            <div class="p-3 rounded-full bg-purple-100">
              <Users class="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </AppCard>

      <AppCard :padding="false">
        <div class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 mb-1">Produits</p>
              <p class="text-2xl font-bold text-orange-600">-</p>
            </div>
            <div class="p-3 rounded-full bg-orange-100">
              <Package class="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </AppCard>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Company Details -->
      <div class="lg:col-span-2 space-y-6">
        <!-- General Info -->
        <AppCard title="Informations générales">
          <div class="space-y-4">
            <!-- Company Header -->
            <div class="flex items-center gap-4 pb-4 border-b border-gray-200">
              <div class="w-16 h-16 rounded-lg bg-primary-100 flex items-center justify-center">
                <Building2 class="w-8 h-8 text-primary-600" />
              </div>
              <div>
                <h3 class="text-xl font-bold text-gray-900">{{ company.name }}</h3>
                <AppBadge
                  :variant="company.is_active ? 'success' : 'secondary'"
                  size="sm"
                  class="mt-1"
                >
                  {{ company.is_active ? 'Actif' : 'Inactif' }}
                </AppBadge>
              </div>
            </div>

            <!-- Contact Info -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div v-if="company.email" class="flex items-start gap-3">
                <div class="p-2 bg-gray-100 rounded-lg">
                  <Mail class="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-600">Email</p>
                  <a :href="`mailto:${company.email}`" class="text-gray-900 hover:text-primary-600">
                    {{ company.email }}
                  </a>
                </div>
              </div>

              <div v-if="company.phone" class="flex items-start gap-3">
                <div class="p-2 bg-gray-100 rounded-lg">
                  <Phone class="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-600">Téléphone</p>
                  <a :href="`tel:${company.phone}`" class="text-gray-900 hover:text-primary-600">
                    {{ company.phone }}
                  </a>
                </div>
              </div>

              <div v-if="company.address" class="flex items-start gap-3 md:col-span-2">
                <div class="p-2 bg-gray-100 rounded-lg">
                  <MapPin class="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-600">Adresse</p>
                  <p class="text-gray-900">{{ company.address }}</p>
                </div>
              </div>

              <div v-if="company.tax_rate" class="flex items-start gap-3">
                <div class="p-2 bg-gray-100 rounded-lg">
                  <FileText class="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-600">Numéro fiscal</p>
                  <p class="text-gray-900 font-mono">{{ company.tax_rate }}</p>
                </div>
              </div>

              <div class="flex items-start gap-3">
                <div class="p-2 bg-gray-100 rounded-lg">
                  <svg
                    class="w-5 h-5 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-600">Créée le</p>
                  <p class="text-gray-900">{{ company.created_at }}</p>
                </div>
              </div>
            </div>
          </div>
        </AppCard>

        <!-- Branches List -->
        <AppCard>
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-gray-900">Branches ({{ branches.length }})</h3>
              <AppButton
                v-if="canManageBranches"
                variant="primary"
                size="sm"
                @click="goToCreateBranch"
              >
                <Plus class="w-4 h-4 mr-2" />
                Ajouter une branche
              </AppButton>
            </div>
          </template>

          <div v-if="branches.length > 0">
            <AppTable
              :columns="branchColumns"
              :data="branches"
              :loading="false"
              empty-text="Aucune branche"
              hoverable
            >
              <!-- Name -->
              <template #cell-name="{ row }">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <MapPin class="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <button
                      @click="goToBranchDetails(row)"
                      class="font-medium text-gray-900 hover:text-primary-600 transition-colors"
                    >
                      {{ row.name }}
                    </button>
                    <p v-if="row.adddress" class="text-xs text-gray-500 mt-0.5">
                      {{ row.adddress }}
                    </p>
                  </div>
                </div>
              </template>

              <!-- Code -->
              <template #cell-code="{ row }">
                <span class="font-mono text-sm text-gray-700 bg-gray-100 px-2 py-1 rounded">
                  {{ row.code }}
                </span>
              </template>

              <!-- Contact -->
              <template #cell-contact="{ row }">
                <div class="text-sm">
                  <p v-if="row.email" class="text-gray-900">{{ row.email }}</p>
                  <p v-if="row.phone" class="text-gray-600">{{ row.phone }}</p>
                  <span v-if="!row.email && !row.phone" class="text-gray-400">-</span>
                </div>
              </template>

              <!-- Status -->
              <template #cell-status="{ row }">
                <AppBadge :variant="row.is_active ? 'success' : 'secondary'" size="sm">
                  {{ row.is_active ? 'Actif' : 'Inactif' }}
                </AppBadge>
              </template>

              <!-- Created -->
              <template #cell-created="{ row }">
                <span class="text-sm text-gray-600">{{ row.created_at }}</span>
              </template>

              <!-- Actions -->
              <template #cell-actions="{ row }">
                <div class="flex items-center justify-end gap-2">
                  <AppButton
                    variant="ghost"
                    size="sm"
                    icon
                    @click="goToEditBranch(row)"
                    title="Modifier"
                  >
                    <Edit class="w-4 h-4" />
                  </AppButton>
                </div>
              </template>
            </AppTable>
          </div>

          <div v-else class="text-center py-8">
            <MapPin class="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p class="text-gray-600 mb-4">Aucune branche pour cette entreprise</p>
            <AppButton
              v-if="canManageBranches"
              variant="primary"
              size="sm"
              @click="goToCreateBranch"
            >
              <Plus class="w-4 h-4 mr-2" />
              Créer la première branche
            </AppButton>
          </div>
        </AppCard>
      </div>

      <!-- Sidebar -->
      <div class="space-y-6">
        <!-- Quick Actions -->
        <AppCard title="Actions rapides">
          <div class="space-y-2">
            <AppButton
              v-if="canManageBranches"
              variant="outline"
              class="w-full justify-start"
              @click="goToCreateBranch"
            >
              <Plus class="w-4 h-4 mr-2" />
              Ajouter une branche
            </AppButton>

            <AppButton
              v-if="canEdit"
              variant="outline"
              class="w-full justify-start"
              @click="handleEdit"
            >
              <Edit class="w-4 h-4 mr-2" />
              Modifier l'entreprise
            </AppButton>
          </div>
        </AppCard>

        <!-- Activity Card -->
        <AppCard title="Activité">
          <div class="space-y-3 text-sm">
            <div class="flex items-center justify-between">
              <span class="text-gray-600">Statut</span>
              <AppBadge :variant="company.is_active ? 'success' : 'secondary'" size="sm">
                {{ company.is_active ? 'Actif' : 'Inactif' }}
              </AppBadge>
            </div>

            <div class="flex items-center justify-between">
              <span class="text-gray-600">Branches</span>
              <span class="font-semibold text-gray-900">{{ branches.length }}</span>
            </div>

            <div class="flex items-center justify-between">
              <span class="text-gray-600">Branches actives</span>
              <span class="font-semibold text-green-600">
                {{ branches.filter(b => b.is_active).length }}
              </span>
            </div>

            <div class="pt-3 border-t border-gray-200">
              <p class="text-xs text-gray-600">Créée le {{ company.created_at }}</p>
              <p class="text-xs text-gray-600 mt-1">
                Mise à jour le {{ company.updated_at }}
              </p>
            </div>
          </div>
        </AppCard>
      </div>
    </div>
  </div>

  <!-- Error State -->
  <div v-else class="flex items-center justify-center h-96">
    <div class="text-center">
      <Building2 class="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h3 class="text-lg font-semibold text-gray-900 mb-2">Entreprise introuvable</h3>
      <AppButton variant="primary" @click="goBack"> Retour à la liste </AppButton>
    </div>
  </div>
</template>
