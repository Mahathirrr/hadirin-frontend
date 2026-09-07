<script setup lang="ts">
import { SwitchRoot, SwitchThumb } from 'reka-ui'

import { cn } from '@/lib/utils'

interface Props {
  class?: string
  checked?: boolean
  disabled?: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{ (e: 'update:checked', value: boolean): void }>()

function handleUpdate(value: boolean) {
  emit('update:checked', value)
}
</script>

<template>
  <SwitchRoot
    :model-value="props.checked"
    data-slot="switch"
    :class="cn(
      'peer data-[state=checked]:bg-primary data-[state=unchecked]:bg-input focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[state=unchecked]:bg-input/80 inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50',
      props.class,
      $attrs.class,
    )"
    @update:model-value="handleUpdate"
  >
    <SwitchThumb
      data-slot="switch-thumb"
      :class="cn(
        'bg-background dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-primary-foreground pointer-events-none block size-4 rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0',
      )"
    />
  </SwitchRoot>
</template>
