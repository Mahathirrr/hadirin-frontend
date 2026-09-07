<script setup lang="ts">
import { cn } from '@/lib/utils'

defineProps<{
  title: string
  description?: string
  class?: string
}>()
</script>

<template>
  <div :class="cn('flex flex-col gap-4 px-4 lg:px-6', $props.class)">
    <div class="space-y-0.5">
      <slot name="header">
        <h1 class="text-2xl font-bold tracking-tight md:text-3xl">{{ title }}</h1>
        <p v-if="description" class="text-sm text-muted-foreground">{{ description }}</p>
      </slot>
    </div>
    <slot />
  </div>
</template>
