<script setup lang="ts">
import { DropdownMenuTrigger } from 'reka-ui'

import { cn } from '@/lib/utils'

const props = defineProps<{ class?: string }>()
</script>

<template>
  <DropdownMenuTrigger
    v-bind="$attrs"
    data-slot="dropdown-menu-trigger"
    :class="cn('cursor-pointer', props.class, $attrs.class as string)"
  >
    <slot />
  </DropdownMenuTrigger>
</template>
