<script setup lang="ts">
import AppFooter from '@/components/layout/AppFooter.vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import { onMounted, ref } from 'vue'
import AppBreadcrumb from '@/components/layout/AppBreadcrumb.vue'
import AppSidebar from '@/components/layout/AppSidebar.vue'

const sidebarCollapsed = ref(false)
onMounted(() => {
    console.log('DashBoard OK')
})

const toggleSidebar = () => {
    sidebarCollapsed.value = !sidebarCollapsed.value
}
</script>

<template>
    <div class="min-h-screen bg-gray-50">
        <!-- Header -->
        <AppHeader @toggle-sidebar="toggleSidebar" />

        <div class="flex">
        <!-- Sidebar -->
        <AppSidebar :collapsed="sidebarCollapsed" />

        <!-- Main Content -->
        <main
            class="flex-1 transition-all duration-300"
            :class="sidebarCollapsed ? 'ml-16' : 'ml-64'"
        >
            <div class="p-6">
                <!-- BreadCrum -->
                <AppBreadcrumb class="mb-6" />

                <!-- Page Content -->
                <div class="animate-fade-in min-h-screen">
                    <p>Bienvenue ici</p>
                    <RouterView />
                </div>
            </div>

            <!-- Footer -->
            <AppFooter />
        </main>
        </div>
    </div>
</template>

<style scoped>
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
.animate-fade-in {
    animation: fadeIn 0.3s ease-out;
}
</style>
