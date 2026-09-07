<script setup lang="ts">
import { NavigationMenuRoot } from 'reka-ui'

import { cn } from '@/lib/utils'

import NavigationMenuViewport from './NavigationMenuViewport.vue'

interface Props {
  class?: string
  viewport?: boolean
}

const props = withDefaults(defineProps<Props>(), { viewport: true })
</script>

<template>
  <NavigationMenuRoot
    v-bind="$attrs"
    data-slot="navigation-menu"
    :data-viewport="props.viewport"
    :class="cn('group/navigation-menu relative flex max-w-max flex-1 items-center justify-center', props.class, $attrs.class)"
  >
    <slot />
    <NavigationMenuViewport v-if="props.viewport" />
  </NavigationMenuRoot>
</template>
