<script setup lang="ts">
import { NavigationMenuTrigger } from 'reka-ui'
import { ChevronDownIcon } from 'lucide-vue-next'

import { cn } from '@/lib/utils'
import { navigationMenuTriggerStyle } from '.'

const props = defineProps({ class: [String, Object] })
</script>

<template>
  <NavigationMenuTrigger
    v-bind="$attrs"
    data-slot="navigation-menu-trigger"
    :class="cn(navigationMenuTriggerStyle(), 'group', props.class, $attrs.class)"
  >
    <slot />
    <ChevronDownIcon
      class="relative top-[1px] ml-1 size-3 transition duration-300 group-data-[state=open]:rotate-180"
      aria-hidden="true"
    />
  </NavigationMenuTrigger>
</template>
