<script setup lang="ts">
import { DialogRoot } from 'reka-ui'

interface Props {
  open?: boolean
  defaultOpen?: boolean
}

const props = defineProps<Props>()

defineEmits<{ (e: 'update:open', value: boolean): void }>()
</script>

<template>
  <DialogRoot
    :open="props.open"
    :default-open="props.defaultOpen"
    data-slot="sheet"
    @update:open="$emit('update:open', $event)"
  >
    <slot />
  </DialogRoot>
</template>
