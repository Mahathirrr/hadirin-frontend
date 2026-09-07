<script setup lang="ts">
import { AccordionItem } from 'reka-ui'

import { cn } from '@/lib/utils'

const props = defineProps({ class: [String, Object], value: { type: String, required: true } })
</script>

<template>
  <AccordionItem
    :value="props.value"
    v-bind="$attrs"
    data-slot="accordion-item"
    :class="cn('border-b last:border-b-0', props.class, $attrs.class)"
  >
    <slot />
  </AccordionItem>
</template>
