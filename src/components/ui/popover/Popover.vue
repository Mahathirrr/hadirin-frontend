<script setup lang="ts">
import { PopoverRoot } from 'reka-ui'
</script>

<template>
  <PopoverRoot v-bind="$attrs" data-slot="popover">
    <slot />
  </PopoverRoot>
</template>
