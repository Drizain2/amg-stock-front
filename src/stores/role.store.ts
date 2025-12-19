import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Role } from '@/types'
import { roleService } from '@/services'

export const useRoleStore = defineStore('role', () => {
    // State
    const roles = ref<Role[]>([])
    const isLoading = ref(false)

    // Getters
    const hasRoles = computed(() => roles.value.length > 0)

    const activeRoles = computed(() => roles.value.filter(role => role.is_active))

    const roleOptions = computed(() =>
        activeRoles.value.map(role => ({
            value: role.id,
            label: role.label,
            name: role.name,
            level: role.level,
        }))
    )

    const getRoleById = computed(() => {
        return (id: number) => roles.value.find(role => role.id === id)
    })

    const getRoleByName = computed(() => {
        return (name: string) => roles.value.find(role => role.name === name)
    })

    // Actions
    const fetchRoles = async () => {
        try {
            isLoading.value = true
            const fetchedRoles = await roleService.getAll()
            roles.value = fetchedRoles
            return fetchedRoles
        } catch (error) {
            console.error('Erreur lors du chargement des rôles:', error)
            throw error
        } finally {
            isLoading.value = false
        }
    }

    const fetchRoleById = async (id: number) => {
        try {
            isLoading.value = true
            const role = await roleService.getById(id)

            // Mettre à jour dans la liste si existe
            const index = roles.value.findIndex(r => r.id === id)
            if (index !== -1) {
                roles.value[index] = role
            } else {
                roles.value.push(role)
            }

            return role
        } catch (error) {
            console.error('Erreur lors du chargement du rôle:', error)
            throw error
        } finally {
            isLoading.value = false
        }
    }

    const reset = () => {
        roles.value = []
    }

    return {
        // State
        roles,
        isLoading,

        // Getters
        hasRoles,
        activeRoles,
        roleOptions,
        getRoleById,
        getRoleByName,

        // Actions
        fetchRoles,
        fetchRoleById,
        reset,
    }
})