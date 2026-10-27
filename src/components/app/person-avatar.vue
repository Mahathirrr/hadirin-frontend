<script setup lang="ts">
import { computed } from 'vue'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { initials } from '@/lib/display'
import { personAvatarUrl } from '@/lib/user-avatar'
import { cn } from '@/lib/utils'

const props = defineProps<{
  name: string
  seed?: string | number
  class?: string
  imageClass?: string
  size?: number
}>()

const src = computed(() => personAvatarUrl(props.name, props.seed ?? props.name))
const alt = computed(() => props.name.trim() || 'Karyawan')
const fallback = computed(() => initials(props.name))
</script>

<template>
  <Avatar :class="cn('overflow-hidden border border-border/60 bg-muted', $props.class)">
    <AvatarImage :src="src" :alt="alt" :class="cn('object-cover', imageClass)" />
    <AvatarFallback class="bg-muted text-xs font-semibold text-muted-foreground">
      {{ fallback }}
    </AvatarFallback>
  </Avatar>
</template>
