<script setup lang="ts">
import { DialogTrigger } from 'reka-ui'
</script>

<template>
  <DialogTrigger v-bind="$attrs" data-slot="dialog-trigger">
    <slot />
  </DialogTrigger>
</template>
