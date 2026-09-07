<script setup lang="ts">
import { ScrollAreaScrollbar, ScrollAreaThumb } from 'reka-ui'

import { cn } from '@/lib/utils'

interface Props {
  class?: string
  orientation?: 'vertical' | 'horizontal'
}

const props = withDefaults(defineProps<Props>(), { orientation: 'vertical' })
</script>

<template>
  <ScrollAreaScrollbar
    v-bind="props"
    data-slot="scroll-area-scrollbar"
    :orientation="props.orientation"
    :class="cn(
      'flex touch-none p-px transition-colors select-none',
      props.orientation === 'vertical' && 'h-full w-2.5 border-l border-l-transparent',
      props.orientation === 'horizontal' && 'h-2.5 flex-col border-t border-t-transparent',
      props.class,
      $attrs.class,
    )"
  >
    <ScrollAreaThumb
      data-slot="scroll-area-thumb"
      class="bg-border relative flex-1 rounded-full"
    />
  </ScrollAreaScrollbar>
</template>
