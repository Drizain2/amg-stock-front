<script lang="ts" setup>
import AppBadge from '@/components/common/AppBadge.vue'
import AppButton from '@/components/common/AppButton.vue'
import AppCard from '@/components/common/AppCard.vue'
import AppPagination from '@/components/common/AppPagination.vue'
import AppInput from '@/components/common/AppInput.vue'
import AppTable from '@/components/common/AppTable.vue'
import { useDebounce, useFilters, usePagination, usePermissions } from '@/composables'
import { useCompanyStore } from '@/stores'
import { Company, CompanyFilters } from '@/types'
import { formatDate } from '@/utils'
import { Building2, Edit, Eye, Plus, Search, Trash2,Filter,RotateCcw } from 'lucide-vue-next'
import { computed,onMounted,ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const companyStore = useCompanyStore()
const permmissions = usePermissions()

//filter
const { filters,updateFilter,resetFilters,hasActiveFilters } = useFilters<CompanyFilters>({
  search: '',
  is_active: undefined,
  per_page: 20,
  page: 1,
})

//pagination
const pagination = usePagination()

// Debounced search
const debouncedSearch = useDebounce(
  computed(() => filters.value.search),
  500
)

const showFilters = ref(false)
const loading = ref(false)
const viewMode = ref<'active' | 'deleted'>('active')

// Table columns
const columns = [
  { key: 'name', label: 'Entreprise', sortable: true },
  { key: 'email', label: 'Email', sortable: false },
  { key: 'phone', label: 'Téléphone', sortable: false },
  { key: 'branches', label: 'Branches', sortable: false, align: 'center' as const },
  { key: 'status', label: 'Statut', sortable: false, align: 'center' as const },
  { key: 'created', label: 'Créée le', sortable: true },
  { key: 'actions', label: 'Actions', width: '120px', align: 'right' as const },
]

//Computed
const companies = computed(() => companyStore.companies)
const hasCompanies = computed(() => companyStore.hasCompanies)
const totalCompanies = computed(() => companyStore.totalCompanies)
const activeCompanies = computed(() => companyStore.activeCompanies)

const canCreate = computed(() => permmissions.companies.value.canCreate)
const canEdit = computed(() => permmissions.companies.value.canEdit)
const canDelete = computed(() => permmissions.companies.value.canDelete)

//Methode
const fetchCompanies = async () => {
  loading.value = true
  try {
    const response = await companyStore.fetchCompanies({
      ...filters.value,
      page: filters.value.page,
      per_page: filters.value.per_page,
    })
    if (response.meta) {
      pagination.updateFromMeta(response.meta)
    }
  } catch (error) {
    console.error('Error fetching companies', error)
  } finally {
    loading.value = false
  }
}

const handlePageChange = (page: number) => {
  pagination.goToPage(page)
  updateFilter('page', page)
}

const handleSearch = (value: string | number) => {
  updateFilter('search', value as string)
  pagination.firstPage()
}

const goToCreate = () => {
  router.push({ name: 'CompanyCreate' })
}

const goToDetails = (company: Company) => {
  router.push({ name: 'CompanyDetails', params: { id: company.id } })
}

const goToEdit = (company: Company) => {
  router.push({ name: 'CompanyEdit', params: { id: company.id } })
}

const handleDelete = async (company: Company) => {
  if (confirm(`Êtes-vous sûr de vouloir supprimer "${company.name}" ?`)) {
    try {
      await companyStore.deleteCompany(company.id)
      await fetchCompanies()
    } catch (error) {
      console.error('Error deleting company:', error)
    }
  }
}

const handleRestore = async (company: Company) => {
  if (confirm(`Restaurer "${company.name}" ?`)) {
    try {
      await companyStore.restoreCompany(company.id)
      await fetchCompanies()
    } catch (error) {
      console.error('Error restoring company:', error)
    }
  }
}

//watchers
watch(()=>pagination.currentPage.value,()=>{
    fetchCompanies()
})

//lifeCycle
onMounted(()=>{fetchCompanies()})
</script>
<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Entreprises</h1>
        <p class="text-gray-600 mt-1">
          Gérez vos entreprises et leurs branches
          <span v-if="totalCompanies > 0" class="text-gray-500">
            ({{ totalCompanies }} entreprise{{ totalCompanies > 1 ? 's' : '' }})
          </span>
        </p>
      </div>

      <div class="flex items-center gap-3">
        <AppButton v-if="canCreate" variant="primary" @click="goToCreate">
          <Plus class="w-5 h-5 mr-2" />
          Nouvelle entreprise
        </AppButton>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <AppCard :padding="false">
        <div class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 mb-1">Total</p>
              <p class="text-2xl font-bold text-gray-900">{{ totalCompanies }}</p>
            </div>
            <div class="p-3 rounded-full bg-blue-100">
              <Building2 class="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
      </AppCard>

      <AppCard :padding="false">
        <div class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 mb-1">Actives</p>
              <p class="text-2xl font-bold text-green-600">{{ activeCompanies.length }}</p>
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
              <p class="text-sm text-gray-600 mb-1">Inactives</p>
              <p class="text-2xl font-bold text-gray-600">
                {{ totalCompanies - activeCompanies.length }}
              </p>
            </div>
            <div class="p-3 rounded-full bg-gray-100">
              <Building2 class="w-6 h-6 text-gray-600" />
            </div>
          </div>
        </div>
      </AppCard>

      <AppCard :padding="false">
        <div class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 mb-1">Total branches</p>
              <p class="text-2xl font-bold text-purple-600">
                {{ companies.reduce((sum, c) => sum + (c.branches?.length || 0), 0) }}
              </p>
            </div>
            <div class="p-3 rounded-full bg-purple-100">
              <Building2 class="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </AppCard>
    </div>

    <!-- Filters Bar -->
    <AppCard :padding="false">
      <div class="p-4 space-y-4">
        <div class="flex items-center gap-4">
          <!-- Search -->
          <div class="flex-1">
            <AppInput
              :model-value="filters.search ||''"
              @update:model-value="handleSearch"
              type="search"
              placeholder="Rechercher par nom, email..."
            >
              <template #prepend>
                <Search class="w-5 h-5 text-gray-400" />
              </template>
            </AppInput>
          </div>

          <!-- View Mode Toggle -->
          <div class="flex items-center gap-1 border border-gray-300 rounded-lg p-1">
            <button
              @click="viewMode = 'active'"
              :class="[
                'px-4 py-2 rounded text-sm font-medium transition-colors',
                viewMode === 'active'
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              ]"
            >
              Actives
            </button>
            <button
              @click="viewMode = 'deleted'"
              :class="[
                'px-4 py-2 rounded text-sm font-medium transition-colors',
                viewMode === 'deleted'
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              ]"
            >
              Supprimées
            </button>
          </div>

          <!-- Filter toggle -->
          <AppButton
            variant="outline"
            @click="showFilters = !showFilters"
            :class="{ 'bg-primary-50 border-primary-600 text-primary-600': hasActiveFilters }"
          >
            <Filter class="w-4 h-4 mr-2" />
            Filtres
          </AppButton>
        </div>

        <!-- Filters Panel -->
        <div v-if="showFilters" class="pt-4 border-t border-gray-200">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <!-- Status Filter -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">
                Statut
              </label>
              <select
                :value="filters.is_active?.toString()"
                @change="updateFilter('is_active', ($event.target as HTMLSelectElement).value === 'true' ? true : ($event.target as HTMLSelectElement).value === 'false' ? false : undefined)"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Tous les statuts</option>
                <option value="true">Actif</option>
                <option value="false">Inactif</option>
              </select>
            </div>

            <!-- Actions -->
            <div class="flex items-end gap-2 md:col-span-2">
              <AppButton variant="outline" @click="resetFilters" class="flex-1">
                Réinitialiser
              </AppButton>
              <AppButton variant="primary" @click="fetchCompanies" class="flex-1">
                Appliquer
              </AppButton>
            </div>
          </div>
        </div>
      </div>
    </AppCard>

    <!-- Companies Table -->
    <AppCard v-if="hasCompanies" :padding="false">
      <div class="overflow-x-auto">
        <AppTable
          :columns="columns"
          :data="companies"
          :loading="loading"
          empty-text="Aucune entreprise trouvée"
          hoverable
        >
          <!-- Name -->
          <template #cell-name="{ row }">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center shrink-0">
                <Building2 class="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <button
                  @click="goToDetails(row)"
                  class="font-medium text-gray-900 hover:text-primary-600 transition-colors"
                >
                  {{ row.name }}
                </button>
                <p v-if="row.address" class="text-xs text-gray-500 mt-0.5">
                  {{ row.address }}
                </p>
              </div>
            </div>
          </template>

          <!-- Email -->
          <template #cell-email="{ row }">
            <a
              v-if="row.email"
              :href="`mailto:${row.email}`"
              class="text-sm text-primary-600 hover:text-primary-700"
            >
              {{ row.email }}
            </a>
            <span v-else class="text-sm text-gray-400">-</span>
          </template>

          <!-- Phone -->
          <template #cell-phone="{ row }">
            <a
              v-if="row.phone"
              :href="`tel:${row.phone}`"
              class="text-sm text-gray-700 hover:text-primary-600"
            >
              {{ row.phone }}
            </a>
            <span v-else class="text-sm text-gray-400">-</span>
          </template>

          <!-- Branches -->
          <template #cell-branches="{ row }">
            <AppBadge variant="info" size="sm">
              {{ row.branches?.length || 0 }} branche{{ (row.branches?.length || 0) > 1 ? 's' : '' }}
            </AppBadge>
          </template>

          <!-- Status -->
          <template #cell-status="{ row }">
            <AppBadge :variant="row.is_active ? 'success' : 'secondary'" size="sm">
              {{ row.is_active ? 'Actif' : 'Inactif' }}
            </AppBadge>
          </template>

          <!-- Created -->
          <template #cell-created="{ row }">
            <span class="text-sm text-gray-600">{{ formatDate(row.created_at) }}</span>
          </template>

          <!-- Actions -->
          <template #cell-actions="{ row }">
            <div class="flex items-center justify-end gap-2">
              <AppButton
                variant="ghost"
                size="sm"
                icon
                @click="goToDetails(row)"
                title="Voir les détails"
              >
                <Eye class="w-4 h-4" />
              </AppButton>
              
              <template v-if="!row.deleted_at">
                <AppButton
                  v-if="canEdit"
                  variant="ghost"
                  size="sm"
                  icon
                  @click="goToEdit(row)"
                  title="Modifier"
                >
                  <Edit class="w-4 h-4" />
                </AppButton>
                <AppButton
                  v-if="canDelete"
                  variant="ghost"
                  size="sm"
                  icon
                  @click="handleDelete(row)"
                  title="Supprimer"
                  class="text-danger-600 hover:bg-danger-50"
                >
                  <Trash2 class="w-4 h-4" />
                </AppButton>
              </template>
              
              <AppButton
                v-else
                variant="ghost"
                size="sm"
                icon
                @click="handleRestore(row)"
                title="Restaurer"
                class="text-success-600 hover:bg-success-50"
              >
                <RotateCcw class="w-4 h-4" />
              </AppButton>
            </div>
          </template>
        </AppTable>
      </div>
    </AppCard>

    <!-- Empty State -->
    <AppCard v-else-if="!loading">
      <div class="text-center py-12">
        <Building2 class="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Aucune entreprise</h3>
        <p class="text-gray-600 mb-6">
          Commencez par créer votre première entreprise
        </p>
        <AppButton v-if="canCreate" variant="primary" @click="goToCreate">
          <Plus class="w-5 h-5 mr-2" />
          Créer une entreprise
        </AppButton>
      </div>
    </AppCard>

    <!-- Pagination -->
    <AppPagination
      v-if="hasCompanies && pagination.totalPages.value > 1"
      :current-page="pagination.currentPage.value"
      :total-pages="pagination.totalPages.value"
      :per-page="pagination.perPage.value"
      :total="pagination.total.value"
      @update:current-page="handlePageChange"
    />
  </div>
</template>