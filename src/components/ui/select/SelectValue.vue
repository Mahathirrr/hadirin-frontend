<script setup lang="ts">
import { SelectValue } from 'reka-ui'

interface Props {
  class?: string
  placeholder?: string
}

defineProps<Props>()
</script>

<template>
  <SelectValue
    v-bind="$attrs"
    data-slot="select-value"
    :class="($attrs.class as string)"
    :placeholder="placeholder"
  >
    <slot />
  </SelectValue>
</template>
