<script setup lang="ts">
import { SelectSeparator } from 'reka-ui'

import { cn } from '@/lib/utils'

const props = defineProps({ class: [String, Object] })
</script>

<template>
  <SelectSeparator
    v-bind="$attrs"
    data-slot="select-separator"
    :class="cn('bg-border pointer-events-none -mx-1 my-1 h-px', props.class, $attrs.class)"
  />
</template>
