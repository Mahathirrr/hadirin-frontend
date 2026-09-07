<script setup lang="ts">
import { ScrollAreaCorner, ScrollAreaRoot, ScrollAreaViewport } from 'reka-ui'

import { cn } from '@/lib/utils'

import ScrollBar from './ScrollBar.vue'

const props = defineProps({ class: [String, Object] })
</script>

<template>
  <ScrollAreaRoot
    v-bind="$attrs"
    data-slot="scroll-area"
    :class="cn('relative', props.class, $attrs.class)"
  >
    <ScrollAreaViewport
      data-slot="scroll-area-viewport"
      class="focus-visible:ring-ring/50 size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:outline-1"
    >
      <slot />
    </ScrollAreaViewport>
    <ScrollBar />
    <ScrollAreaCorner />
  </ScrollAreaRoot>
</template>
