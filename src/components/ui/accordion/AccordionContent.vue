<script setup lang="ts">
import { AccordionContent } from 'reka-ui'

import { cn } from '@/lib/utils'

const props = defineProps({ class: [String, Object] })
</script>

<template>
  <AccordionContent
    v-bind="$attrs"
    data-slot="accordion-content"
    class="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden text-sm"
  >
    <div :class="cn('pt-0 pb-4', props.class, $attrs.class)">
      <slot />
    </div>
  </AccordionContent>
</template>
