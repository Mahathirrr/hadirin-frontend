<script setup lang="ts">
import { CheckboxIndicator, CheckboxRoot } from 'reka-ui'
import { CheckIcon } from 'lucide-vue-next'

import { cn } from '@/lib/utils'

interface Props {
  class?: string
  checked?: boolean | 'indeterminate'
  disabled?: boolean
  required?: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:checked', value: boolean | 'indeterminate'): void
  (e: 'change', value: boolean): void
}>()

function handleUpdate(value: boolean | 'indeterminate') {
  emit('update:checked', value)
  emit('change', value as boolean)
}
</script>

<template>
  <CheckboxRoot
    :model-value="props.checked"
    data-slot="checkbox"
    :class="cn(
      'peer border-input dark:bg-input/30 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:data-[state=checked]:bg-primary data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50',
      props.class,
    )"
    @update:model-value="handleUpdate"
  >
    <CheckboxIndicator
      data-slot="checkbox-indicator"
      class="flex items-center justify-center text-current transition-none"
    >
      <CheckIcon class="size-3.5" />
    </CheckboxIndicator>
  </CheckboxRoot>
</template>
