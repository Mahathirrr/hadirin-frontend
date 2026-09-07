<script setup lang="ts">
import { TooltipTrigger } from 'reka-ui'
</script>

<template>
  <TooltipTrigger v-bind="$attrs" data-slot="tooltip-trigger">
    <slot />
  </TooltipTrigger>
</template>
