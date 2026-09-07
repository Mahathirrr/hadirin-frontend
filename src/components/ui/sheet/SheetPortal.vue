<script setup lang="ts">
import { DialogPortal } from 'reka-ui'
</script>

<template>
  <DialogPortal v-bind="$attrs" data-slot="sheet-portal">
    <slot />
  </DialogPortal>
</template>
