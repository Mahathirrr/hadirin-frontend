<script setup lang="ts">
import { Primitive } from 'reka-ui'

import { computed } from 'vue'
import { useAttrs } from 'vue'

import { cn } from '@/lib/utils'

defineOptions({ inheritAttrs: false })

interface Props {
  class?: string
  asChild?: boolean
}

const props = withDefaults(defineProps<Props>(), { asChild: false })

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
    data-slot="breadcrumb-link"
    v-bind="forwardedAttrs"
    :class="cn('hover:text-foreground transition-colors', props.class, className)"
  >
    <slot />
  </Primitive>
</template>
