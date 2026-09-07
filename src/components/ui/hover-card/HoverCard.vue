<script setup lang="ts">
import { HoverCardRoot } from 'reka-ui'
</script>

<template>
  <HoverCardRoot v-bind="$attrs" data-slot="hover-card">
    <slot />
  </HoverCardRoot>
</template>
