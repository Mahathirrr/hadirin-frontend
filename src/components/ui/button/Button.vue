<script setup lang="ts">
import { Primitive } from 'reka-ui'

import { computed } from 'vue'
import { useAttrs } from 'vue'

import { buttonVariants } from '.'
import { cn } from '@/lib/utils'

defineOptions({ inheritAttrs: false })

interface Props {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon' | 'icon-sm' | 'icon-lg'
  asChild?: boolean
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'default',
  asChild: false,
  type: 'button',
})

const attrs = useAttrs()
const className = computed(() => String(attrs.class ?? ''))
const forwardedAttrs = computed(() => {
  const { class: _c, type: _t, disabled: _d, ...rest } = attrs as Record<string, unknown>
  return rest
})
</script>

<template>
  <Primitive
    :as="'button'"
    :as-child="props.asChild"
    :type="props.type"
    :disabled="props.disabled"
    data-slot="button"
    v-bind="forwardedAttrs"
    :class="cn(buttonVariants({ variant: props.variant, size: props.size, class: className }))"
  >
    <slot />
  </Primitive>
</template>
