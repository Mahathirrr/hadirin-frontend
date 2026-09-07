<script setup lang="ts">
import { computed } from 'vue'
import { User } from 'lucide-vue-next'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { userAvatarAlt, userAvatarUrl } from '@/lib/user-avatar'
import { cn } from '@/lib/utils'

const props = defineProps<{
  user?: {
    id?: number
    name?: string
    email?: string
    avatar_url?: string
  } | null
  class?: string
  imageClass?: string
  fallbackClass?: string
}>()

const src = computed(() => userAvatarUrl(props.user))
const alt = computed(() => userAvatarAlt(props.user))
</script>

<template>
  <Avatar :class="cn('overflow-hidden border border-white/15 bg-zinc-800', $props.class)">
    <AvatarImage :src="src" :alt="alt" :class="cn('object-cover', imageClass)" />
    <AvatarFallback
      :class="cn(
        'bg-gradient-to-br from-sky-500 via-violet-500 to-indigo-600 text-white',
        fallbackClass,
      )"
    >
      <User class="size-[55%] opacity-90" stroke-width="2" />
    </AvatarFallback>
  </Avatar>
</template>
