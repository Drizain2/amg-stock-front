import { ref } from 'vue'

/**
 * Composable pour gérer les modals
 */
export function useModal() {
    const isOpen = ref(false)
    const modalData = ref<any>(null)

    /**
     * Ouvre le modal
     */
    const open = (data?: any) => {
        modalData.value = data
        isOpen.value = true
    }

    /**
     * Ferme le modal
     */
    const close = () => {
        isOpen.value = false
        // Attendre la fin de l'animation avant de nettoyer les données
        setTimeout(() => {
            modalData.value = null
        }, 300)
    }

    /**
     * Toggle le modal
     */
    const toggle = () => {
        if (isOpen.value) {
            close()
        } else {
            open()
        }
    }

    /**
     * Met à jour les données du modal
     */
    const updateData = (data: any) => {
        modalData.value = data
    }

    return {
        isOpen,
        modalData,
        open,
        close,
        toggle,
        updateData,
    }
}

/**
 * Composable pour gérer un modal de confirmation
 */
export function useConfirmModal() {
    const { isOpen, modalData, open: openModal, close } = useModal()

    /**
     * Ouvre le modal de confirmation
     */
    const confirm = (
        title: string,
        message: string,
        onConfirm: () => void | Promise<void>,
        options?: {
            confirmText?: string
            cancelText?: string
            type?: 'danger' | 'warning' | 'info'
        }
    ) => {
        openModal({
            title,
            message,
            onConfirm,
            confirmText: options?.confirmText || 'Confirmer',
            cancelText: options?.cancelText || 'Annuler',
            type: options?.type || 'info',
        })
    }

    /**
     * Confirme l'action
     */
    const handleConfirm = async () => {
        if (modalData.value?.onConfirm) {
            await modalData.value.onConfirm()
        }
        close()
    }

    /**
     * Annule l'action
     */
    const handleCancel = () => {
        close()
    }

    return {
        isOpen,
        modalData,
        confirm,
        handleConfirm,
        handleCancel,
        close,
    }
}
