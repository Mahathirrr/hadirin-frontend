<script setup lang="ts">
defineProps<{
  message: string
  compact?: boolean
}>()
</script>

<template>
  <div
    class="rounded-lg border border-dashed border-border/70 bg-muted/15 text-center text-sm text-muted-foreground"
    :class="compact ? 'px-4 py-8' : 'px-6 py-10'"
  >
    {{ message }}
  </div>
</template>
