<script setup lang="ts">
import { DialogDescription } from 'reka-ui'

import { cn } from '@/lib/utils'

const props = defineProps({ class: [String, Object] })
</script>

<template>
  <DialogDescription
    v-bind="$attrs"
    data-slot="sheet-description"
    :class="cn('text-muted-foreground text-sm', props.class, $attrs.class)"
  >
    <slot />
  </DialogDescription>
</template>
