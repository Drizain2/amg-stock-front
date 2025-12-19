import { branchService } from "@/services";
import type { Branch, BranchFilters, CreateBranchRequest, UpdateBranchRequest } from "@/types";
import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useToast } from "vue-toastification";

const toast = useToast()
export const useBranchStore = defineStore('branch', () => {
    //States
    const branches = ref<Branch[]>([])
    const currentBranch = ref<Branch | null>(null)
    const isLoading = ref(false)
    const pagination = ref({
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0
    })

    //Getters
    const hasBranch = computed(() => branches.value.length > 0)
    const totalBranches = computed(() => pagination.value.total)

    const activeBranches = computed(() => branches.value.filter(branch => branch.is_active))

    const getBranchesByCompany = computed(() => {
        return (companyId: number) => branches.value.filter(b => b.company.id === companyId)
    })

    //Actions
    const fetchBranches = async (filters?: BranchFilters) => {
        try {
            isLoading.value = true
            const response = await branchService.getAll(filters)

            branches.value = response.data

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
            console.error("erreur lors du chargement des branches: ", error);
            throw error
        } finally {
            isLoading.value = false
        }
    }

    const fetchBranchById = async (id: number) => {
        try {
            isLoading.value = true
            const branch = await branchService.getById(id)
            currentBranch.value = branch
            return branch
        } catch (error) {
            console.error("Erreur lors du chargement de la branche :", error);
            throw error
        } finally {
            isLoading.value = false
        }
    }

    const fetchBranchesByCompany = async (companyId: number) => {
        try {
            isLoading.value = true
            const fetchedBranches = await branchService.getByCompany(companyId)
            //Merge avec les braches existantes
            fetchedBranches.forEach(branch => {
                const index = branches.value.findIndex(b => b.id === branch.id)
                if (index === -1) {
                    branches.value.push(branch)
                } else {
                    branches.value[index] = branch
                }
            })
            return fetchedBranches
        } catch (error) {
            console.error("Erreur lors du chargement de la branche :", error);
            throw error
        } finally {
            isLoading.value = false
        }
    }

    const createBranch = async (data: CreateBranchRequest) => {
        try {
            isLoading.value = true
            const branch = await branchService.create(data)
            branches.value.unshift(branch)
            toast.success("Branche créée avec succès")
            return branch
        } catch (error) {
            toast.error("Erreur lors de la création de la branche")
            throw error
        } finally {
            isLoading.value = false
        }
    }

    const updateBranch = async (id: number, data: UpdateBranchRequest) => {
        try {
            isLoading.value = true
            const branch = await branchService.update(id, data)

            //Mettre a jour dans la liste
            const index = branches.value.findIndex(c => c.id === id)
            if (index !== -1) {
                branches.value[index] = branch
            }

            //Mettre a jour l'entreprise courante si 
            if (currentBranch.value?.id === id) {
                currentBranch.value = branch
            }
            toast.success("Branche mise à jour avec succès")
            return branch
        } catch (error) {
            toast.error("Erreur lors de la mise a jour de l'entreprise")
            throw error
        } finally {
            isLoading.value = false
        }
    }

    const deleteBranch = async (id: number) => {
        try {
            isLoading.value = true
            await branchService.delete(id)

            //Retirer de la liste
            const index = branches.value.findIndex(c => c.id === id)
            if (index !== -1) {
                branches.value.splice(index, 1)
            }

            toast.success('Branche supprimée avec succès')
        } catch (error) {
            toast.error("Erreur lors de la suppression de la branche")
            throw error
        } finally {
            isLoading.value = false
        }
    }

    const restoreBranch = async (id: number) => {
        try {
            isLoading.value = true
            const branch = await branchService.restore(id)
            branches.value.unshift(branch)
            toast.success("Branche restaurée avec succès")  
            return branch
        } catch (error) {
            toast.error("Erreur lors de la restauration de la branche")
            throw error
        } finally {
            isLoading.value = false
        }
    }

    const clearCurrentBranch = () => {
        currentBranch.value = null
    }

    const reset = () => {
        branches.value = []
        currentBranch.value = null
        pagination.value = {
            current_page: 1,
            last_page: 1,
            per_page: 10,
            total: 0
        }
    }
    return {
        //State
        branches,
        currentBranch,
        isLoading,
        pagination,

        //Getters
        hasBranch,
        totalBranches,
        activeBranches,
        getBranchesByCompany,

        //Actions
        fetchBranches,
        fetchBranchById,
        fetchBranchesByCompany,
        createBranch,
        updateBranch,
        deleteBranch,
        restoreBranch,
        clearCurrentBranch,
        reset
    }
})