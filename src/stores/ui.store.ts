import { defineStore } from "pinia";
import { ref } from "vue";

export const useUIStore = defineStore("ui", () => {
    //State
    const sidebarCollapsed = ref(false);
    const isMobile = ref(false);
    const isLoading = ref(false);
    const loadingMessage = ref<string>("");

    //Modal State
    const modalOpen = ref(false);
    const modalComponent = ref<string | null>(null);
    const modalProps = ref<Record<string, any>>({})

    const notifications = ref<Array<{
        id: string
        type: "success" | "error" | "warning" | "info"
        message: string
        duration?: number
    }>>([])

    //Actions
    const toggleSidebar = () => {
        sidebarCollapsed.value = !sidebarCollapsed.value;
    }

    const setSidebarCollapsed = (collapsed: boolean) => {
        sidebarCollapsed.value = collapsed;
    }

    const setMobile = (mobile: boolean) => {
        isMobile.value = mobile;
    }

    const showLoading = (message = "Chargement...") => {
        isLoading.value = true;
        loadingMessage.value = message;
    }

    const hideLoading = () => {
        isLoading.value = false;
        loadingMessage.value = "";
    }

    const openModal = (component: string, props: Record<string, any> = {}) => {
        modalComponent.value = component;
        modalProps.value = props;
        modalOpen.value = true;
    }

    const closeModal = () => {
        modalOpen.value = false;
        setTimeout(() => {
            modalComponent.value = null;
            modalProps.value = {};
        }, 300)
    }

    const addNotification = (
        type: "success" | "error" | "warning" | "info",
        message: string,
        duration = 5000
    ) => {
        const id = `notification-${Date.now()}`
        notifications.value.push({ id, type, message, duration })
        setTimeout(() => {
            removeNotification(id)
        }, duration)
    }

    const removeNotification = (id: string) => {
        const index = notifications.value.findIndex(n => n.id === id)
        if (index !== -1) {
            notifications.value.splice(index, 1)
        }
    }

    const clearNotifications = () => {
        notifications.value = []
    }

    return {
        //State
        sidebarCollapsed,
        isMobile,
        isLoading,
        loadingMessage,
        modalOpen,
        modalComponent,
        modalProps,
        notifications,
        //Actions
        toggleSidebar,
        setSidebarCollapsed,
        setMobile,
        showLoading,
        hideLoading,
        openModal,
        closeModal,
        addNotification,
        removeNotification,
        clearNotifications
    }
}, {
    persist: {
        key: "ui-store",
        storage: localStorage,
        pick: ["sidebarCollapsed"]
    }
})