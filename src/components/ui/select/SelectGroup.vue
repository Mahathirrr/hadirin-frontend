<script setup lang="ts">
import { SelectGroup } from 'reka-ui'

defineProps<{ class?: string }>()
</script>

<template>
  <SelectGroup v-bind="$attrs" data-slot="select-group" :class="$attrs.class as string">
    <slot />
  </SelectGroup>
</template>
