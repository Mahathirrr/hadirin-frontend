<script setup lang="ts">
import { NavigationMenuList } from 'reka-ui'

import { cn } from '@/lib/utils'

const props = defineProps({ class: [String, Object] })
</script>

<template>
  <NavigationMenuList
    v-bind="$attrs"
    data-slot="navigation-menu-list"
    :class="cn('group flex flex-1 list-none items-center justify-center gap-1', props.class, $attrs.class)"
  >
    <slot />
  </NavigationMenuList>
</template>
