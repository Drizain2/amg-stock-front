<!-- src/components/common/AppButton.vue -->
<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'outline'
  size?: 'xs' | 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  type?: 'button' | 'submit' | 'reset'
  fullwidth?: boolean
  icon?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
  loading: false,
  type: 'button',
  fullwidth: false,
  icon: false,
})
const emit = defineEmits<{ click: [event: MouseEvent] }>()

const buttonClass = computed(() => {
  const classes = [
    'btn px-4 py-2 rounded-lg font-medium transition-all duration-200 inline-flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2',
  ]

  //Size
  if (props.size === 'sm') classes.push('px-3 py-1.5 text-sm')
  if (props.size === 'md') classes.push('btn-md')
  if (props.size === 'lg') classes.push('px-6 py-3 text-lg')

  //Fullwidth
  if (props.fullwidth) classes.push('w-full')

  //Icon
  if (props.icon) classes.push('p-2 w-10 h-10')

  //Disabled or loading
  if (props.disabled || props.loading) classes.push('opacity-60 cursor-not-allowed')
  return classes.join(' ')
})
const varianClassess = {
  primary: 'bg-primary-200 text-white hover:bg-primary-700 focus:ring-primary-500',
  secondary: 'bg-secondary-200 text-secondary-900 hover:bg-secondary-300 focus:ring-secondary-500',
  success: 'bg-success-600 text-white hover:bg-success-700 focus:ring-success-500',
  danger: 'bg-danger-600 text-white hover:bg-danger-700 focus:ring-danger-500',
  warning: 'bg-warning-600 text-white hover:bg-warning-700 focus:ring-warning-500',
  outline:
    'border-2 border-primary-600 text-primary-600 bg-white hover:bg-primary-50 focus:ring-primary-500',
}
const handleClick = (event: MouseEvent) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>

<template>
  <button
    :type="type"
    :class="[buttonClass, varianClassess[variant]]"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <!-- Loadding spinner -->
    <span v-if="loading" class="inline-block mr-2">
      <svg
        class="animate-spin h-4 w-4"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        ></circle>
        <path
          class="opacity-75"
          fill="currentColor"
 
        ></path>
      </svg>
    </span>
    <!-- Content -->
    <slot />
  </button>
</template>
