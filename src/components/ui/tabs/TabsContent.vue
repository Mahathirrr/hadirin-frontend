<script setup lang="ts">
import { TabsContent } from 'reka-ui'

import { cn } from '@/lib/utils'

const props = defineProps({ class: [String, Object], value: { type: String, required: true } })
</script>

<template>
  <TabsContent
    :value="props.value"
    v-bind="$attrs"
    data-slot="tabs-content"
    :class="cn('flex-1 outline-none', props.class, $attrs.class)"
  >
    <slot />
  </TabsContent>
</template>
