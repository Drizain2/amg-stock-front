import { companyService } from "@/services";
import type { Company, CompanyFilters, CreateCompanyRequest, UpdateCompanyRequest } from "@/types";
import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useToast } from "vue-toastification";

const toast = useToast()
export const useCompanyStore = defineStore('company', () => {
    //States
    const companies = ref<Company[]>([])
    const currentCompany = ref<Company | null>(null)
    const isLoading = ref(false)
    const pagination = ref({
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0
    })

    //Getters
    const hasCompanies = computed(() => companies.value.length > 0)
    const totalCompanies = computed(() => pagination.value.total)

    const activeCompanies = computed(() => companies.value.filter(company => company.is_active))

    //Actions
    const fetchCompanies = async (filters?: CompanyFilters) => {
        try {
            isLoading.value = true
            const response = await companyService.getAll(filters)

            companies.value = response.data

            if (response.meta) {
                pagination.value = {
                    current_page: response.meta.current_page,
                    last_page: response.meta.last_page,
                    per_page: response.meta.per_page,
                    total: response.meta.total
                }
            }
            return response
        } catch (error) {
            console.error("erreur lors du chargement des entreprises: ", error);
            throw error
        } finally {
            isLoading.value = false
        }
    }

    const fetchCompanyById = async (id: number) => {
        try {
            isLoading.value = true
            const company = await companyService.getById(id)
            currentCompany.value = company
            return company
        } catch (error) {
            console.error("Erreur lors du chargement de l'entreprise :", error);
            throw error
        } finally {
            isLoading.value = false
        }
    }

    const createCompany = async (data: CreateCompanyRequest) => {
        try {
            isLoading.value = true
            const company = await companyService.create(data)
            companies.value.unshift(company)
            toast.success("Entreprise créée avec succès")
            return company
        } catch (error) {
            toast.error("Erreur lors de la création de l'enreprise")
            throw error
        } finally {
            isLoading.value = false
        }
    }

    const updateCompany = async (id: number, data: UpdateCompanyRequest) => {
        try {
            isLoading.value = true
            const company = await companyService.update(id, data)

            //Mettre a jour dans la liste
            const index = companies.value.findIndex(c => c.id === id)
            if (index !== -1) {
                companies.value[index] = company
            }

            //Mettre a jour l'entreprise courante si 
            if (currentCompany.value?.id === id) {
                currentCompany.value = company
            }
            toast.success("Entreprise mise à jour avec succès")
            return company
        } catch (error) {
            toast.error("Erreur lors de la mise a jour de l'entreprise")
            throw error
        } finally {
            isLoading.value = false
        }
    }

    const deleteCompany = async (id: number) => {
        try {
            isLoading.value = true
            await companyService.delete(id)

            //Retirer de la liste
            const index = companies.value.findIndex(c => c.id === id)
            if (index !== -1) {
                companies.value.splice(index, 1)
            }

            toast.success('Entreprise supprimée avec succès')
        } catch (error) {
            toast.error("Erreur lors de la suppression de l'entreprise")
            throw error
        } finally {
            isLoading.value = false
        }
    }

    const restoreCompany = async (id: number) => {
        try {
            isLoading.value = true
            const company = await companyService.restore(id)
            companies.value.unshift(company)
            toast.success("Entreprise restaurée avec succès")
            return company
        } catch (error) {
            toast.error("Erreur lors de la restauration de l'entreprise")
            throw error
        } finally {
            isLoading.value = false
        }
    }

    const clearCurrentCompany = () => {
        currentCompany.value = null
    }

    const reset = () => {
        companies.value = []
        currentCompany.value = null
        pagination.value = {
            current_page: 1,
            last_page: 1,
            per_page: 10,
            total: 0
        }
    }
    return {
        //State
        companies,
        currentCompany,
        isLoading,
        pagination,

        //Getters
        hasCompanies,
        totalCompanies,
        activeCompanies,

        //Actions
        fetchCompanies,
        fetchCompanyById,
        createCompany,
        updateCompany,
        deleteCompany,
        restoreCompany,
        clearCurrentCompany,
        reset
    }
})