<script setup lang="ts">
import { cn } from '@/lib/utils'

const props = defineProps<{ class?: string; heading?: string }>()
</script>

<template>
  <div
    data-slot="command-group"
    :class="cn(
      'text-foreground [&_[cmdk-group-heading]]:text-muted-foreground overflow-hidden p-1 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium',
      props.class,
    )"
  >
    <p v-if="props.heading" cmdk-group-heading="true" class="px-2 py-1.5 text-xs font-medium text-muted-foreground">
      {{ props.heading }}
    </p>
    <slot />
  </div>
</template>
