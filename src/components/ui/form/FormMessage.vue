<script setup lang="ts">
import { useSlots } from 'vue'

import { cn } from '@/lib/utils'

import { injectFormItemContext } from './lib'

const props = defineProps<{ class?: string }>()

const slots = useSlots()
const formItemContext = injectFormItemContext()

const hasBody = () => !!formItemContext.errorMessage.value || !!slots.default
</script>

<template>
  <p
    v-if="hasBody()"
    data-slot="form-message"
    :id="`${formItemContext.id}-form-item-message`"
    :class="cn('text-destructive text-sm', props.class)"
  >
    <slot>{{ formItemContext.errorMessage.value }}</slot>
  </p>
</template>
