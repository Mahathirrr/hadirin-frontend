<script setup lang="ts">
import { useFieldError } from 'vee-validate'

import { useId } from 'reka-ui'
import { computed } from 'vue'

import { cn } from '@/lib/utils'

import { injectFormFieldContext, provideFormItemContext } from './lib'

const props = defineProps<{ class?: string }>()

const formFieldContext = injectFormFieldContext({ name: '' })

const id = useId()
const errorMessage = useFieldError(formFieldContext.name)
const isError = computed(() => !!errorMessage.value)

provideFormItemContext({ id, isError, errorMessage })
</script>

<template>
  <div
    data-slot="form-item"
    :class="cn('grid gap-2', props.class)"
  >
    <slot />
  </div>
</template>
