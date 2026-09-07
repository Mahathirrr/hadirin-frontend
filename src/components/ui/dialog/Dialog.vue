<script setup lang="ts">
import { DialogRoot } from 'reka-ui'

interface Props {
  open?: boolean
  defaultOpen?: boolean
  modal?: boolean
}

const props = defineProps<Props>()

defineEmits<{ (e: 'update:open', value: boolean): void }>()
</script>

<template>
  <DialogRoot
    :open="props.open"
    :default-open="props.defaultOpen"
    :modal="props.modal"
    data-slot="dialog"
    @update:open="$emit('update:open', $event)"
  >
    <slot />
  </DialogRoot>
</template>
