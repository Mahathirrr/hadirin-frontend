<script setup lang="ts">
import { Primitive } from 'reka-ui'

import { computed } from 'vue'
import { useAttrs } from 'vue'

import { cn } from '@/lib/utils'

defineOptions({ inheritAttrs: false })

interface Props {
  class?: string
  asChild?: boolean
  showOnHover?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  asChild: false,
  showOnHover: false,
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
    :data-slot="'sidebar-menu-action'"
    data-sidebar="menu-action"
    v-bind="forwardedAttrs"
    :class="cn(
      'text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground peer-hover/menu-button:text-sidebar-accent-foreground absolute top-1.5 right-1 flex aspect-square w-5 items-center justify-center rounded-md p-0 outline-hidden transition-transform focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0',
      'after:absolute after:-inset-2 md:after:hidden',
      'peer-data-[size=sm]/menu-button:top-1',
      'peer-data-[size=default]/menu-button:top-1.5',
      'peer-data-[size=lg]/menu-button:top-2.5',
      'group-data-[collapsible=icon]:hidden',
      props.showOnHover &&
        'peer-data-[active=true]/menu-button:text-sidebar-accent-foreground group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 data-[state=open]:opacity-100 md:opacity-0',
      className,
    )"
  >
    <slot />
  </Primitive>
</template>
