<script setup lang="ts">
import { DialogTitle } from 'reka-ui'

import { cn } from '@/lib/utils'

const props = defineProps({ class: [String, Object] })
</script>

<template>
  <DialogTitle
    v-bind="$attrs"
    data-slot="sheet-title"
    :class="cn('text-foreground font-semibold', props.class, $attrs.class)"
  >
    <slot />
  </DialogTitle>
</template>
