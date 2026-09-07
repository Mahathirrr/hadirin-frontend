<script setup lang="ts">
import { DialogPortal } from 'reka-ui'
</script>

<template>
  <DialogPortal v-bind="$attrs" data-slot="dialog-portal">
    <slot />
  </DialogPortal>
</template>
