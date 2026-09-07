<script setup lang="ts">
import { computed } from 'vue'

import { assetUrl, cn } from '@/lib/utils'

interface Props {
  lightSrc: string
  darkSrc: string
  alt: string
  class?: string
  direction?: 'left' | 'right'
}

const props = withDefaults(defineProps<Props>(), { direction: 'left' })

const isRight = computed(() => props.direction === 'right')

function src(path: string) {
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  return assetUrl(path)
}
</script>

<template>
  <div :class="cn('group relative aspect-[4/3] w-full', props.class)">
    <div class="perspective-distant transform-3d">
      <!-- Animated background glow -->
      <div class="absolute rounded-3xl bg-gradient-to-r from-primary/10 via-blue-500/10 to-purple-500/10 opacity-0 blur-2xl transition-all duration-1000 group-hover:opacity-100 sm:-inset-8" />

      <!-- Main 3D container -->
      <div class="relative size-full transform-3d transition-all duration-700 ease-out group-hover:rotate-x-8 group-hover:rotate-y-12 group-hover:translate-z-16">
        <!-- Depth layers for 3D effect -->
        <div class="absolute inset-0 -translate-z-8 translate-x-2 translate-y-4 rounded-2xl">
          <div class="size-full rounded-2xl bg-gradient-to-br from-primary/10 via-background/40 to-secondary/10 shadow-xl" />
        </div>

        <!-- Main image container -->
        <div class="relative z-10 size-full overflow-hidden rounded-2xl shadow-2xl shadow-primary/20">
          <!-- Shimmer effect -->
          <div
            :class="cn(
              'absolute inset-0 z-20 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 ease-out pointer-events-none',
              isRight
                ? 'translate-x-full group-hover:-translate-x-full'
                : '-translate-x-full group-hover:translate-x-full',
            )"
          />

          <!-- Content fade mask -->
          <div
            :class="cn(
              'absolute inset-0 z-15 pointer-events-none',
              isRight
                ? 'bg-linear-to-l from-background from-0% via-background/85 via-15% to-transparent to-40%'
                : 'bg-linear-to-r from-background from-0% via-background/85 via-15% to-transparent to-40%',
            )"
          />

          <!-- Theme-aware images -->
          <img
            :src="src(lightSrc)"
            :alt="`${alt} - Light Mode`"
            :class="cn(
              'block size-full object-cover transition-transform duration-700 group-hover:scale-105 dark:hidden',
              isRight ? 'object-center' : 'object-left',
            )"
            loading="lazy"
            decoding="async"
          />

          <img
            :src="src(darkSrc)"
            :alt="`${alt} - Dark Mode`"
            :class="cn(
              'hidden size-full object-cover transition-transform duration-700 group-hover:scale-105 dark:block',
              isRight ? 'object-center' : 'object-left',
            )"
            loading="lazy"
            decoding="async"
          />

          <!-- Border highlight -->
          <div class="absolute inset-0 rounded-2xl ring-1 ring-white/20 transition-all duration-500 group-hover:ring-primary/40 dark:ring-white/10" />
        </div>
      </div>
    </div>
  </div>
</template>
