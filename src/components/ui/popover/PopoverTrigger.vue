<script setup lang="ts">
import { PopoverTrigger } from 'reka-ui'
</script>

<template>
  <PopoverTrigger v-bind="$attrs" data-slot="popover-trigger">
    <slot />
  </PopoverTrigger>
</template>
