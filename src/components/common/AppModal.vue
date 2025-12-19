<!-- src/components/common/AppModal.vue -->
<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'

interface Props {
  modelValue: boolean
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  closeOnOverlay?: boolean
  showClose?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  closeOnverlay: true,
  showClose: true,
})
const emit = defineEmits<{ 'update:modelValue': [value: boolean]; close: [] }>()

const sizeClasses = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-full mx-4',
}

const close = () => {
  emit('update:modelValue', false)
  emit('close')
}

const handleOverlayClick = () => {
  if (props.closeOnOverlay) {
    close()
  }
}

const handleEscape = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && props.modelValue) {
    close()
  }
}
onMounted(() => {
  document.addEventListener('keydown', handleEscape)
})
onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape)
})
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 overflow-y-auto"
        aria-labelledby="modal-title"
        role="dialog"
        aria-modal="true"
      >
        <!-- Overlay -->
        <div
          class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          @click="handleOverlayClick"
        ></div>

        <!-- Modal -->
        <div class="flex min-h-screen items-center justify-center p-4">
          <div
            :class="['relative bg-white rounded-lg shadow-xl w-full', sizeClasses[size]]"
            @click.stop
          >
            <!-- Header -->
            <div
              v-if="title || showClose || $slots.header"
              class="flex items-start justify-between p-6 border-b border-gray-200"
            >
              <slot class="header">
                <h3 v-if="title" class="text-lg font-semibold text-gray-900">
                  {{ title }}
                </h3>
              </slot>

              <button v-if="showClose" type="button" class="modal-close" @click="close">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.58614.293-4.293a1 1 0 111.414 1.414L11.414 1014.293 4.293a1 1 01-1.414 1.414L10 11.414.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.29305.707a1 1 0 010-1.414z"
                  />
                </svg>
              </button>
            </div>

            <!-- Body -->
            <div class="p-6">
              <slot />
            </div>

            <!-- Footer -->
            <div
              v-if="$slots.footer"
              class="flex items-center justify-end gap-3 p-6 border-t border-gray-200"
            >
              <slot name="footer" />
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-content,
.modal-leave-active .modal-content {
  transition: transform 0.3s ease;
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  transform: scale(0.95);
}
</style>
