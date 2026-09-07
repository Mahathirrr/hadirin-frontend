<script setup lang="ts">
import { SelectLabel } from 'reka-ui'

import { cn } from '@/lib/utils'

const props = defineProps({ class: [String, Object] })
</script>

<template>
  <SelectLabel
    v-bind="$attrs"
    data-slot="select-label"
    :class="cn('text-muted-foreground px-2 py-1.5 text-xs', props.class, $attrs.class)"
  >
    <slot />
  </SelectLabel>
</template>
