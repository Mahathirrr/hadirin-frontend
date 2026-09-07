<script setup lang="ts">
import { Primitive } from 'reka-ui'

import { computed } from 'vue'
import { useAttrs } from 'vue'

import { cn } from '@/lib/utils'

import { sidebarMenuButtonVariants } from './sidebar-menu-button-variants'

defineOptions({ inheritAttrs: false })

interface Props {
  class?: string
  asChild?: boolean
  isActive?: boolean
  variant?: 'default' | 'outline'
  size?: 'default' | 'sm' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  asChild: false,
  isActive: false,
  variant: 'default',
  size: 'default',
})


const attrs = useAttrs()
const className = computed(() => String(attrs.class ?? ''))
const forwardedAttrs = computed(() => {
  const { class: _c, ...rest } = attrs as Record<string, unknown>
  return rest
})
</script>

<template>
  <Primitive
    :as="'button'"
    :as-child="props.asChild"
    :data-slot="'sidebar-menu-button'"
    data-sidebar="menu-button"
    :data-size="props.size"
    :data-active="props.isActive || undefined"
    v-bind="forwardedAttrs"
    :class="cn(
      sidebarMenuButtonVariants({ variant: props.variant, size: props.size, class: className }),
    )"
  >
    <slot />
  </Primitive>
</template>
