<script setup lang="ts">
import { Field } from 'vee-validate'

import { provideFormFieldContext } from './lib'

interface Props {
  name: string
}

const props = defineProps<Props>()

provideFormFieldContext({ name: props.name })
</script>

<template>
  <Field
    v-slot="{ field, errors, handleChange }"
    :name="props.name"
    v-bind="$attrs"
  >
    <slot
      :field="field"
      :errors="errors"
      :componentField="{ ...field, onChange: handleChange }"
    />
  </Field>
</template>
