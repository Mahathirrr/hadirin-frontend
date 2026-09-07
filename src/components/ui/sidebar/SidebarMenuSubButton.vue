<script setup lang="ts">
import { Primitive } from 'reka-ui'

import { computed } from 'vue'
import { useAttrs } from 'vue'

import { cn } from '@/lib/utils'

defineOptions({ inheritAttrs: false })

interface Props {
  class?: string
  asChild?: boolean
  size?: 'sm' | 'md'
  isActive?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  asChild: false,
  size: 'md',
  isActive: false,
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
    :as="'a'"
    :as-child="props.asChild"
    :data-slot="'sidebar-menu-sub-button'"
    data-sidebar="menu-sub-button"
    :data-size="props.size"
    :data-active="props.isActive || undefined"
    v-bind="forwardedAttrs"
    :class="cn(
      'text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground active:bg-sidebar-accent active:text-sidebar-accent-foreground [&>svg]:text-sidebar-accent-foreground flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 outline-hidden focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0',
      'data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground',
      props.size === 'sm' && 'text-xs',
      props.size === 'md' && 'text-sm',
      'group-data-[collapsible=icon]:hidden',
      className,
    )"
  >
    <slot />
  </Primitive>
</template>
