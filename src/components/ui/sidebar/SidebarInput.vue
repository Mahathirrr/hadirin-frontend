<script setup lang="ts">
import { Input } from '@/components/ui/input'

import { cn } from '@/lib/utils'

const props = defineProps<{ class?: string }>()
</script>

<template>
  <Input
    data-slot="sidebar-input"
    data-sidebar="input"
    :class="cn('bg-background h-8 w-full shadow-none', props.class)"
  />
</template>
