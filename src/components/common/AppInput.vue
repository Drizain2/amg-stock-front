<!-- src/components/common/AppInput.vue -->
<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  modelValue: string | number
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search'
  placeholder?: string
  label?: string
  error?: string
  autocomplete?: string
  disabled?: boolean
  required?: boolean
  readonly?: boolean
  maxlength?: number
  min?: number
  max?: number
  step?: number
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  disabled: false,
  required: false,
  readonly: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
}>()

const inputClass = computed(() => {
  const classes = ['input']

  if (props.error) {
    classes.push('border-danger-500 focus:ring-danger-500')
  } else {
    classes.push('border-gray-500 focus:ring-primary-500')
  }

  if (props.disabled) {
    classes.push('bg-gray-100 cursor-not-allowed')
  }

  return classes.join(' ')
})

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', props.type === 'number' ? Number(target.value) : target.value)
}
</script>
<template>
  <div class="w-full">
    <label v-if="label" class="block text-sm font-medium text-gray-700 mb-1">
      {{ label }}
      <span v-if="required" class="text-danger-600">*</span>
    </label>

    <!-- Input -->
    <input
    class="w-full px-4 py-2 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:border-transparent"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :required="required"
      :autocomplete="autocomplete"
      :maxlength="maxlength"
      :min="min"
      :max="max"
      :step="step"
      :class="inputClass"
      @input="handleInput"
      @blur="emit('blur', $event)"
      @focus="emit('focus', $event)"
    />

    <!-- Error message -->
    <p class="mt-1 text-sm text-danger-600">
      {{ error }}
    </p>
  </div>
</template>

