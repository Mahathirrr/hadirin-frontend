<script setup lang="ts">
import { NavigationMenuIndicator } from 'reka-ui'

import { cn } from '@/lib/utils'

const props = defineProps({ class: [String, Object] })
</script>

<template>
  <NavigationMenuIndicator
    v-bind="$attrs"
    data-slot="navigation-menu-indicator"
    :class="cn(
      'data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:fade-in top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden',
      props.class,
      $attrs.class,
    )"
  >
    <div class="bg-border relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm shadow-md" />
  </NavigationMenuIndicator>
</template>
