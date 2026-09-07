<script setup lang="ts">
import { ProgressIndicator, ProgressRoot } from 'reka-ui'

import { computed } from 'vue'

import { cn } from '@/lib/utils'

interface Props {
  class?: string
  value?: number
}

const props = withDefaults(defineProps<Props>(), { value: 0 })

const indicatorStyle = computed(() => ({
  transform: `translateX(-${100 - props.value}%)`,
}))
</script>

<template>
  <ProgressRoot
    v-bind="$attrs"
    data-slot="progress"
    :class="cn('bg-primary/20 relative h-2 w-full overflow-hidden rounded-full', props.class, $attrs.class)"
  >
    <ProgressIndicator
      data-slot="progress-indicator"
      class="bg-primary h-full w-full flex-1 transition-all"
      :style="indicatorStyle"
    />
  </ProgressRoot>
</template>
