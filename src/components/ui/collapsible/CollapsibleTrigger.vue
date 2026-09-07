<script setup lang="ts">
import { CollapsibleTrigger } from 'reka-ui'
</script>

<template>
  <CollapsibleTrigger v-bind="$attrs" data-slot="collapsible-trigger">
    <slot />
  </CollapsibleTrigger>
</template>
