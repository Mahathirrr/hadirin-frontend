<script setup lang="ts">
import { cn } from '@/lib/utils'

const props = defineProps({ class: [String, Object] })
</script>

<template>
  <div
    data-slot="card-header"
    :class="cn(
      '@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1 px-4 pt-3.5 pb-2 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-3',
      props.class,
    )"
  >
    <slot />
  </div>
</template>
