<script setup lang="ts">
import { SelectRoot } from 'reka-ui'

interface Props {
  modelValue?: string
  defaultValue?: string
  disabled?: boolean
  name?: string
}

const props = defineProps<Props>()
defineEmits<{ (e: 'update:modelValue', value: string): void }>()
</script>

<template>
  <SelectRoot
    v-bind="props"
    :model-value="props.modelValue"
    data-slot="select"
    @update:model-value="$emit('update:modelValue', $event as string)"
  >
    <slot />
  </SelectRoot>
</template>
