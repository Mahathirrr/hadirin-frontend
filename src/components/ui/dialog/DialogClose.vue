<script setup lang="ts">
import { DialogClose } from 'reka-ui'
</script>

<template>
  <DialogClose v-bind="$attrs" data-slot="dialog-close">
    <slot />
  </DialogClose>
</template>
