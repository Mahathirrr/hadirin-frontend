<script setup lang="ts">
import { DropdownMenuSeparator } from 'reka-ui'

import { cn } from '@/lib/utils'

const props = defineProps({ class: [String, Object] })
</script>

<template>
  <DropdownMenuSeparator
    v-bind="$attrs"
    data-slot="dropdown-menu-separator"
    :class="cn('bg-border -mx-1 my-1 h-px', props.class, $attrs.class)"
  />
</template>
