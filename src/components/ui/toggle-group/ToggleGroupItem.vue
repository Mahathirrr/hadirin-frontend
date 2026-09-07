<script setup lang="ts">
import { ToggleGroupItem } from 'reka-ui'
import { inject } from 'vue'

import { cn } from '@/lib/utils'
import { toggleVariants } from '@/components/ui/toggle/toggle-variants'
import { ToggleGroupKey, type ToggleGroupContextValue } from './context'

interface Props {
  class?: string
  variant?: 'default' | 'outline'
  size?: 'default' | 'sm' | 'lg'
  value: string
}

const props = defineProps<Props>()
const context = inject<ToggleGroupContextValue>(ToggleGroupKey, {})
const variant = props.variant || context.variant
const size = props.size || context.size
</script>

<template>
  <ToggleGroupItem
    :value="props.value"
    v-bind="$attrs"
    data-slot="toggle-group-item"
    :data-variant="variant"
    :data-size="size"
    :class="cn(
      toggleVariants({ variant, size }),
      'min-w-0 flex-1 shrink-0 rounded-none shadow-none first:rounded-l-md last:rounded-r-md focus:z-10 focus-visible:z-10 data-[variant=outline]:border-l-0 data-[variant=outline]:first:border-l',
      props.class,
    )"
  >
    <slot />
  </ToggleGroupItem>
</template>
