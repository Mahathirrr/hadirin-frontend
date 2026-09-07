<script setup lang="ts">
import { Primitive } from 'reka-ui'

import { injectFormItemContext } from './lib'

interface Props {
  asChild?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  asChild: true,
})

const formItemContext = injectFormItemContext()
</script>

<template>
  <Primitive
    :as="'div'"
    :as-child="props.asChild"
    data-slot="form-control"
    :id="formItemContext.id"
    :aria-describedby="
      !formItemContext.isError.value
        ? `${formItemContext.id}-form-item-description`
        : `${formItemContext.id}-form-item-description ${formItemContext.id}-form-item-message`
    "
    :aria-invalid="formItemContext.isError.value || undefined"
  >
    <slot />
  </Primitive>
</template>
