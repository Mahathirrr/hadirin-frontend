<script setup lang="ts">
import { TabsList } from 'reka-ui'

import { cn } from '@/lib/utils'

const props = defineProps({ class: [String, Object] })
</script>

<template>
  <TabsList
    v-bind="$attrs"
    data-slot="tabs-list"
    :class="cn(
      'bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px]',
      props.class,
      $attrs.class,
    )"
  >
    <slot />
  </TabsList>
</template>
