<!-- src/components/common/AppBadge.vue -->
<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info'
  size?: 'sm' | 'md' | 'lg'
  dot?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  dot: false,
})
const badgeClass = computed(() => {
  const classes = ['badge inline-flex items-center rounded-full front-medium']

  //Variant
  classes.push(`badge-${props.variant}`)
  if (props.variant === 'primary') classes.push('bg-primary-100 text-primary-800')
  if (props.variant === 'secondary') classes.push('bg-secondary-100 text-secondary-800')
  if (props.variant === 'success') classes.push('bg-success-100 text-success-800')
  if (props.variant === 'warning') classes.push('bg-warning-100 text-warning-800')
  if (props.variant === 'danger') classes.push('bg-danger-100 text-danger-800')
  if (props.variant === 'info') classes.push('bg-blue-100 text-blue-800')
  //Size
  if (props.size === 'sm') classes.push('text-xs px-2 py-0.5')
  if (props.size === 'md') classes.push('text-sm px-2.5 py-0.5')
  if (props.size === 'lg') classes.push('text-base px-3 py-1')

  return classes.join(' ')
})
</script>

<template>
  <span :class="badgeClass">
    <!-- Dot indicatoe -->
    <span v-if="dot" class="inline-block w-2 h-2 rounded-full mr-1.5 bg-current"></span>

    <!-- Content -->
    <slot />
  </span>
</template>
