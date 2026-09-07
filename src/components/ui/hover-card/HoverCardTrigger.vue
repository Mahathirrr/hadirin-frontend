<script setup lang="ts">
import { HoverCardTrigger } from 'reka-ui'
</script>

<template>
  <HoverCardTrigger v-bind="$attrs" data-slot="hover-card-trigger">
    <slot />
  </HoverCardTrigger>
</template>
