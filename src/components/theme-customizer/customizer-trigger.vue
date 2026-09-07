<script setup lang="ts">
import { Settings } from 'lucide-vue-next'

import { Button } from '@/components/ui/button'
import { useSidebarConfig } from '@/contexts/sidebarContext'
import { cn } from '@/lib/utils'

defineProps<{ onClick?: () => void }>()

const { config: sidebarConfig } = useSidebarConfig()
</script>

<template>
  <Button
    @click="$emit('click', $event)"
    size="icon"
    :class="cn(
      'fixed top-1/2 z-50 h-12 w-12 -translate-y-1/2 cursor-pointer rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90',
      sidebarConfig.side === 'left' ? 'right-4' : 'left-4',
    )"
  >
    <Settings class="h-5 w-5" />
  </Button>
</template>
