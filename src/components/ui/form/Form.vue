<script setup lang="ts">
import { Form as VeeForm } from 'vee-validate'

interface Props {
  class?: string
  as?: string
}

const props = withDefaults(defineProps<Props>(), {
  as: 'form',
})
</script>

<template>
  <VeeForm :as="props.as" :class="props.class" v-bind="$attrs">
    <slot />
  </VeeForm>
</template>
