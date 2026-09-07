<script setup lang="ts">
import { cn } from '@/lib/utils'

const props = defineProps({ class: [String, Object] })
</script>

<template>
  <div
    data-slot="card"
    :class="cn('bg-card text-card-foreground flex flex-col gap-0 rounded-xl border py-0 shadow-sm', props.class)"
  >
    <slot />
  </div>
</template>
