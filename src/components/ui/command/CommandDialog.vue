<script setup lang="ts">
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'

import { cn } from '@/lib/utils'

import Command from './Command.vue'

interface Props {
  open?: boolean
  title?: string
  description?: string
  class?: string
  showCloseButton?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Command Palette',
  description: 'Search for a command to run...',
  showCloseButton: true,
})

</script>

<template>
  <Dialog :open="props.open" @update:open="$emit('update:open', $event)">
    <DialogHeader class="sr-only">
      <DialogTitle>{{ props.title }}</DialogTitle>
      <DialogDescription>{{ props.description }}</DialogDescription>
    </DialogHeader>
    <DialogContent :show-close-button="props.showCloseButton" :class="cn('overflow-hidden p-0', props.class)">
      <Command
        class="[&_[cmdk-group-heading]]:text-muted-foreground **:data-[slot=command-input-wrapper]:h-12 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group]]:px-2 [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5"
      >
        <slot />
      </Command>
    </DialogContent>
  </Dialog>
</template>
