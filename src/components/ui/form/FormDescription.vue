<script setup lang="ts">
import { cn } from '@/lib/utils'

import { injectFormItemContext } from './lib'

const props = defineProps<{ class?: string }>()

const formItemContext = injectFormItemContext()
</script>

<template>
  <p
    data-slot="form-description"
    :id="`${formItemContext.id}-form-item-description`"
    :class="cn('text-muted-foreground text-sm', props.class)"
  >
    <slot />
  </p>
</template>
