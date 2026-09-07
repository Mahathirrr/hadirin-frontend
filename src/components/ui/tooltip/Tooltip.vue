<script setup lang="ts">
import { TooltipRoot } from 'reka-ui'
</script>

<template>
  <TooltipRoot v-bind="$attrs" data-slot="tooltip">
    <slot />
  </TooltipRoot>
</template>
