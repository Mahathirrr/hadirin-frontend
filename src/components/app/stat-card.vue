<script setup lang="ts">
import type { Component } from 'vue'

import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

defineProps<{
  label?: string
  title?: string
  value: string | number
  hint?: string
  icon?: Component
  class?: string
}>()
</script>

<template>
  <Card :class="cn('rounded-xl border-border/60 bg-card shadow-none', $props.class)">
    <CardContent class="flex items-start justify-between gap-3 px-4 py-3.5">
      <div class="min-w-0 flex-1">
        <p class="text-sm font-medium text-muted-foreground">{{ label ?? title }}</p>
        <p class="mt-1 text-3xl font-bold tracking-tight tabular-nums">{{ value }}</p>
        <p v-if="hint" class="mt-1 text-xs text-muted-foreground">{{ hint }}</p>
        <slot />
      </div>
      <div
        v-if="icon"
        class="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted/60 text-muted-foreground"
      >
        <component :is="icon" class="size-4" />
      </div>
    </CardContent>
  </Card>
</template>
