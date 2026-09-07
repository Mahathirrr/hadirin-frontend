<script setup lang="ts">
import { TabsRoot } from 'reka-ui'

import { cn } from '@/lib/utils'

interface Props {
  class?: string
  modelValue?: string
  defaultValue?: string
}

const props = defineProps<Props>()

defineEmits<{ (e: 'update:modelValue', value: string): void }>()
</script>

<template>
  <TabsRoot
    :model-value="props.modelValue"
    :default-value="props.defaultValue"
    data-slot="tabs"
    :class="cn('flex flex-col gap-2', props.class)"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <slot />
  </TabsRoot>
</template>
