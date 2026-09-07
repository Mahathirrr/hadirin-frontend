<script setup lang="ts">
interface Props {
  size?: number
  class?: string
}

const props = withDefaults(defineProps<Props>(), { size: 24 })
</script>

<template>
  <svg
    :width="props.size"
    :height="props.size"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    :class="props.class"
  >
    <path d="M5 5h10.5a3 3 0 0 1 3 3v6.5H8a3 3 0 0 1-3-3V5Z" fill="currentColor" />
    <path d="M14 17.5h10.5a3 3 0 0 1 3 3V27H17a3 3 0 0 1-3-3v-6.5Z" fill="currentColor" />
    <path d="M18.5 10.5v7H12" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
</template>
