<script setup lang="ts">
import { AvatarImage } from 'reka-ui'

import { cn } from '@/lib/utils'

const props = defineProps({ class: [String, Object], src: { type: String, required: true } })
</script>

<template>
  <AvatarImage
    :src="props.src"
    data-slot="avatar-image"
    :class="cn('aspect-square size-full', props.class)"
  >
    <slot />
  </AvatarImage>
</template>
