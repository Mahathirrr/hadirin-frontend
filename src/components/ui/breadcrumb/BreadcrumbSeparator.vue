<script setup lang="ts">
import { ChevronRight } from 'lucide-vue-next'
import { useSlots } from 'vue'

import { cn } from '@/lib/utils'

const props = defineProps({ class: [String, Object] })
const slots = useSlots()
</script>

<template>
  <li
    v-bind="$attrs"
    data-slot="breadcrumb-separator"
    role="presentation"
    aria-hidden="true"
    :class="cn('[&>svg]:size-3.5', props.class)"
  >
    <slot v-if="slots.default" />
    <ChevronRight v-else />
  </li>
</template>
