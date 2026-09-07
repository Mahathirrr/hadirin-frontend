<script setup lang="ts">
import { AccordionRoot } from 'reka-ui'

import { cn } from '@/lib/utils'

const props = defineProps({ class: [String, Object] })
</script>

<template>
  <AccordionRoot v-bind="$attrs" data-slot="accordion" :class="cn('', props.class)">
    <slot />
  </AccordionRoot>
</template>
