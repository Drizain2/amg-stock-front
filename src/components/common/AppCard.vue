<!-- src/components/common/AppCard.vue -->
<script setup lang="ts">
interface Props {
  title?: string
  subtitle?: string
  padding?: boolean
  hoverable?: boolean
}

withDefaults(defineProps<Props>(), {
  padding: true,
  hoverable: false,
})
</script>

<template>
  <div
    class="bg-white rounded-lg shadow-md transition-shadow duration-200"
    :class="{ 'hover:shadow-lg': hoverable, 'p-6': padding }"
  >
    <!-- Header -->
    <div v-if="title || subtitle || $slots.header" class="card-header" :class="{ 'mb-4': padding }">
      <slot name="header">
        <h3 v-if="title" class="text-lg font-semibold text-gray-900">
          {{ title }}
        </h3>
        <p v-if="subtitle" class="text-sm text-gray-600 mt-1">
          {{ subtitle }}
        </p>
      </slot>
    </div>

    <!-- Body -->
    <div class="card-body">
      <slot />
    </div>

    <!-- Footer -->
    <div v-if="$slots.footer" class="card-footer" :class="{ 'mt-4': padding }">
      <slot name="footer" />
    </div>
  </div>
</template>
