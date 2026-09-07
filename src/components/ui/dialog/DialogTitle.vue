<script setup lang="ts">
import { DialogTitle } from 'reka-ui'

import { cn } from '@/lib/utils'

const props = defineProps({ class: [String, Object] })
</script>

<template>
  <DialogTitle
    v-bind="$attrs"
    data-slot="dialog-title"
    :class="cn('text-lg leading-none font-semibold', props.class, $attrs.class)"
  >
    <slot />
  </DialogTitle>
</template>
