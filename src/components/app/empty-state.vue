<script setup lang="ts">
import type { Component } from 'vue'

import { cn } from '@/lib/utils'

defineProps<{
  title: string
  description?: string
  icon?: Component
  compact?: boolean
  class?: string
}>()
</script>

<template>
  <div
    :class="cn(
      'flex flex-col items-center justify-center rounded-xl border border-dashed border-border/70 bg-muted/10 text-center',
      compact ? 'gap-2 px-4 py-6' : 'gap-3 px-4 py-8',
      $props.class,
    )"
  >
    <div
      v-if="icon"
      class="flex size-11 items-center justify-center rounded-full bg-muted/50 text-muted-foreground"
    >
      <component :is="icon" class="size-5" />
    </div>
    <div class="max-w-sm space-y-1">
      <p class="text-sm font-medium text-foreground">{{ title }}</p>
      <p v-if="description" class="text-sm text-muted-foreground">{{ description }}</p>
    </div>
    <div v-if="$slots.actions" class="flex flex-wrap items-center justify-center gap-2 pt-1">
      <slot name="actions" />
    </div>
  </div>
</template>
