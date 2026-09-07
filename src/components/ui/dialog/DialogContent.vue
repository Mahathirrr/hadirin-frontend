<script setup lang="ts">
import { DialogClose, DialogContent, DialogOverlay, DialogPortal } from 'reka-ui'
import { XIcon } from 'lucide-vue-next'

import { cn } from '@/lib/utils'

interface Props {
  class?: string
  showCloseButton?: boolean
}

const props = withDefaults(defineProps<Props>(), { showCloseButton: true })

defineOptions({ inheritAttrs: false })
</script>

<template>
  <DialogPortal data-slot="dialog-portal">
    <DialogOverlay />
    <DialogContent
      data-slot="dialog-content"
      :class="cn(
        'bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-[130] grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg',
        props.class,
        $attrs.class as string,
      )"
      v-bind="$attrs"
    >
      <slot />
      <DialogClose
        v-if="props.showCloseButton"
        data-slot="dialog-close"
        class="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 flex size-8 cursor-pointer items-center justify-center rounded-md border border-border/80 bg-background text-muted-foreground opacity-100 shadow-xs transition-colors hover:bg-muted hover:text-foreground focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=\'size-\'])]:size-4"
      >
        <XIcon />
        <span class="sr-only">Close</span>
      </DialogClose>
    </DialogContent>
  </DialogPortal>
</template>
