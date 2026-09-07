<script setup lang="ts">
import { computed } from 'vue'

import { cn } from '@/lib/utils'

interface Props {
  class?: string
  size?: 'sm' | 'md' | 'lg'
  opacity?: 'low' | 'medium' | 'high'
  fadeStyle?: 'ellipse' | 'circle' | 'none'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  opacity: 'medium',
  fadeStyle: 'ellipse',
})

const sizePx = { sm: 12, md: 16, lg: 22 } as const
const opacityVal = { low: 0.45, medium: 0.65, high: 0.9 } as const

const maskMap = {
  ellipse: 'radial-gradient(ellipse 85% 75% at 50% 35%, #000 55%, transparent 100%)',
  circle: 'radial-gradient(circle at 50% 45%, #000 60%, transparent 100%)',
  none: 'none',
} as const

const patternStyle = computed(() => {
  const fade = props.fadeStyle
  const mask = maskMap[fade]

  return {
    backgroundImage: 'radial-gradient(circle, var(--dot-pattern-color) 1.5px, transparent 1.5px)',
    backgroundSize: `${sizePx[props.size]}px ${sizePx[props.size]}px`,
    opacity: opacityVal[props.opacity],
    WebkitMaskImage: fade === 'none' ? undefined : mask,
    maskImage: fade === 'none' ? undefined : mask,
  }
})
</script>

<template>
  <div
    :class="cn('absolute inset-0 pointer-events-none', props.class)"
    :style="patternStyle"
  />
</template>
