<script setup lang="ts">
import { cn } from '@/lib/utils'

const props = defineProps<{ class?: string }>()
</script>

<template>
  <div data-slot="command-separator" :class="cn('bg-border -mx-1 h-px', props.class)" />
</template>
