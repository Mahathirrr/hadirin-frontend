<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

defineProps<{
  title: string
  value: string | number
  hint?: string
}>()
</script>

<template>
  <Card class="rounded-xl border-border/60 shadow-none">
    <CardHeader class="space-y-0 px-4 pt-4 pb-2">
      <CardTitle class="text-sm font-medium text-muted-foreground">{{ title }}</CardTitle>
    </CardHeader>
    <CardContent class="px-4 pt-0 pb-4">
      <div class="text-2xl font-bold tracking-tight">{{ value }}</div>
      <p v-if="hint" class="mt-0.5 text-xs text-muted-foreground">{{ hint }}</p>
      <slot />
    </CardContent>
  </Card>
</template>
