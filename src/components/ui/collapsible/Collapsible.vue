<script setup lang="ts">
import { CollapsibleRoot } from 'reka-ui'
</script>

<template>
  <CollapsibleRoot v-bind="$attrs" data-slot="collapsible" :class="$attrs.class as string">
    <slot />
  </CollapsibleRoot>
</template>
