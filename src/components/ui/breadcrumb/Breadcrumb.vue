<script setup lang="ts">
defineProps<{ class?: string }>()
</script>

<template>
  <nav aria-label="breadcrumb" data-slot="breadcrumb" v-bind="$attrs">
    <slot />
  </nav>
</template>
