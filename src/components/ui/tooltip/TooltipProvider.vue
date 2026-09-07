<script setup lang="ts">
import { TooltipProvider } from 'reka-ui'

interface Props {
  delayDuration?: number
}

defineProps<Props>()
</script>

<template>
  <TooltipProvider
    v-bind="$attrs"
    :delay-duration="delayDuration ?? 0"
    data-slot="tooltip-provider"
  >
    <slot />
  </TooltipProvider>
</template>
