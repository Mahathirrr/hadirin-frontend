<script setup lang="ts">
import { RadioGroupRoot } from 'reka-ui'

import { cn } from '@/lib/utils'

const props = defineProps({ class: [String, Object] })
</script>

<template>
  <RadioGroupRoot
    v-bind="$attrs"
    data-slot="radio-group"
    :class="cn('grid gap-3', props.class, $attrs.class)"
  >
    <slot />
  </RadioGroupRoot>
</template>
