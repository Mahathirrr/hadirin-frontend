<script setup lang="ts">
import { PopoverAnchor } from 'reka-ui'
</script>

<template>
  <PopoverAnchor v-bind="$attrs" data-slot="popover-anchor">
    <slot />
  </PopoverAnchor>
</template>
