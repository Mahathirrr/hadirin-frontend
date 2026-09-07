<script setup lang="ts">
import { ref } from 'vue'

import { cn } from '@/lib/utils'

import { provideCommand } from './context'

const props = defineProps<{ class?: string }>()

const query = ref('')
const visibleCount = ref(0)

provideCommand({
  query,
  setQuery: (value: string) => {
    query.value = value
  },
  visibleCount,
})
</script>

<template>
  <div
    data-slot="command"
    :class="cn(
      'bg-popover text-popover-foreground flex h-full w-full flex-col overflow-hidden rounded-md',
      props.class,
    )"
  >
    <slot />
  </div>
</template>
