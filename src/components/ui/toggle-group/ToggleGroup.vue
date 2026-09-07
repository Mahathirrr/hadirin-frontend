<script setup lang="ts">
import { ToggleGroupRoot } from 'reka-ui'

import { provide } from 'vue'

import { cn } from '@/lib/utils'

import { ToggleGroupKey } from './context'

interface Props {
  class?: string
  variant?: 'default' | 'outline'
  size?: 'default' | 'sm' | 'lg'
  type?: 'single' | 'multiple'
}

const props = defineProps<Props>()
provide(ToggleGroupKey, { variant: props.variant, size: props.size })
</script>

<template>
  <ToggleGroupRoot
    v-bind="props"
    data-slot="toggle-group"
    :data-variant="props.variant"
    :data-size="props.size"
    :class="cn('group/toggle-group flex w-fit items-center rounded-md data-[variant=outline]:shadow-xs', props.class)"
  >
    <slot />
  </ToggleGroupRoot>
</template>
