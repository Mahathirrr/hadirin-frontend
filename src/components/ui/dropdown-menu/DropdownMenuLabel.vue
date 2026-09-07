<script setup lang="ts">
import { DropdownMenuLabel } from 'reka-ui'

import { cn } from '@/lib/utils'

interface Props {
  class?: string
  inset?: boolean
}

const props = defineProps<Props>()
</script>

<template>
  <DropdownMenuLabel
    v-bind="$attrs"
    data-slot="dropdown-menu-label"
    :data-inset="props.inset ? '' : undefined"
    :class="cn('px-2 py-1.5 text-sm font-medium data-[inset]:pl-8', props.class, $attrs.class)"
  >
    <slot />
  </DropdownMenuLabel>
</template>
