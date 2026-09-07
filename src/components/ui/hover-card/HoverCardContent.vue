<script setup lang="ts">
import { HoverCardContent, HoverCardPortal } from 'reka-ui'

import { cn } from '@/lib/utils'

interface Props {
  class?: string
  align?: 'start' | 'center' | 'end'
  sideOffset?: number
}

const props = withDefaults(defineProps<Props>(), {
  align: 'center',
  sideOffset: 4,
})
</script>

<template>
  <HoverCardPortal data-slot="hover-card-portal">
    <HoverCardContent
      v-bind="props"
      data-slot="hover-card-content"
      :align="props.align"
      :side-offset="props.sideOffset"
      :class="cn(
        'bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-64 origin-(--reka-hover-card-content-transform-origin) rounded-md border p-4 shadow-md outline-hidden',
        props.class,
        $attrs.class,
      )"
    >
      <slot />
    </HoverCardContent>
  </HoverCardPortal>
</template>
