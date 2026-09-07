<script setup lang="ts">
import { PanelLeftIcon } from 'lucide-vue-next'

import { Button } from '@/components/ui/button'

import { cn } from '@/lib/utils'

import { useSidebar } from './context'

const props = defineProps<{ class?: string }>()

const { toggleSidebar } = useSidebar()
</script>

<template>
  <Button
    data-sidebar="trigger"
    data-slot="sidebar-trigger"
    variant="ghost"
    size="icon"
    :class="cn('size-7', props.class)"
    @click="toggleSidebar()"
  >
    <PanelLeftIcon />
    <span class="sr-only">Toggle Sidebar</span>
  </Button>
</template>
