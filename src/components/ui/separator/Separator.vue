<script setup lang="ts">
import { Separator } from 'reka-ui'

import { cn } from '@/lib/utils'

interface Props {
  class?: string
  orientation?: 'horizontal' | 'vertical'
  decorative?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  orientation: 'horizontal',
  decorative: true,
})
</script>

<template>
  <Separator
    :orientation="props.orientation"
    :decorative="props.decorative"
    data-slot="separator"
    :class="cn(
      'bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px',
      props.class,
    )"
  >
    <slot />
  </Separator>
</template>
