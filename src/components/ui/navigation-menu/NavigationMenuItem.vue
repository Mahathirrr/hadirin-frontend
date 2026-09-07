<script setup lang="ts">
import { NavigationMenuItem } from 'reka-ui'

import { cn } from '@/lib/utils'

const props = defineProps({ class: [String, Object] })
</script>

<template>
  <NavigationMenuItem
    v-bind="$attrs"
    data-slot="navigation-menu-item"
    :class="cn('relative', props.class, $attrs.class)"
  >
    <slot />
  </NavigationMenuItem>
</template>
