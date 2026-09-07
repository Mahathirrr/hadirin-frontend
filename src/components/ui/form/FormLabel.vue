<script setup lang="ts">
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

import { injectFormItemContext } from './lib'

const props = defineProps<{ class?: string }>()

const formItemContext = injectFormItemContext()
</script>

<template>
  <Label
    data-slot="form-label"
    :data-error="formItemContext.isError.value"
    :html-for="formItemContext.id"
    :class="cn('data-[error=true]:text-destructive', props.class)"
  >
    <slot />
  </Label>
</template>
