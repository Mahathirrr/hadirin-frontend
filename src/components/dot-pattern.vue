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

const sizeMap: Record<string, string> = {
  sm: '[background-size:12px_12px]',
  md: '[background-size:16px_16px]',
  lg: '[background-size:20px_20px]',
}

const opacityMap: Record<string, string> = {
  low: 'opacity-30',
  medium: 'opacity-50',
  high: 'opacity-70',
}

const fadeMap: Record<string, string> = {
  ellipse: '[mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]',
  circle: '[mask-image:radial-gradient(circle_at_50%_50%,#000_70%,transparent_100%)]',
  none: '',
}

const cls = computed(() =>
  cn(
    'absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#374151_1px,transparent_1px)]',
    sizeMap[props.size],
    fadeMap[props.fadeStyle],
    opacityMap[props.opacity],
    props.class,
  ),
)
</script>

<template>
  <div :class="cls" />
</template>
