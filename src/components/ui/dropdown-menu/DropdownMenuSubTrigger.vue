<script setup lang="ts">
import { DropdownMenuSubTrigger } from 'reka-ui'
import { ChevronRightIcon } from 'lucide-vue-next'

import { cn } from '@/lib/utils'

interface Props {
  class?: string
  inset?: boolean
}

const props = defineProps<Props>()
</script>

<template>
  <DropdownMenuSubTrigger
    v-bind="$attrs"
    data-slot="dropdown-menu-sub-trigger"
    :data-inset="props.inset ? '' : undefined"
    :class="cn(
      'focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[inset]:pl-8',
      props.class,
      $attrs.class,
    )"
  >
    <slot />
    <ChevronRightIcon class="ml-auto size-4" />
  </DropdownMenuSubTrigger>
</template>
