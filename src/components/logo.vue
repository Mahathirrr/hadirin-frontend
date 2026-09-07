<script setup lang="ts">
interface Props {
  size?: number
  class?: string
}

const props = withDefaults(defineProps<Props>(), { size: 32 })
</script>

<template>
  <img
    src="/logo.png"
    alt="Hadirin Logo"
    :width="props.size"
    :height="props.size"
    :style="{ width: `${props.size}px`, height: `${props.size}px` }"
    :class="['inline-block object-contain select-none shrink-0 drop-shadow-sm', props.class]"
  />
</template>
