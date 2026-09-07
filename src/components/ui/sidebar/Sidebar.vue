<script setup lang="ts">
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'

import { cn } from '@/lib/utils'

import { SIDEBAR_WIDTH_MOBILE, useSidebar } from './context'

interface Props {
  side?: 'left' | 'right'
  variant?: 'sidebar' | 'floating' | 'inset'
  collapsible?: 'offcanvas' | 'icon' | 'none'
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  side: 'left',
  variant: 'sidebar',
  collapsible: 'offcanvas',
})

const { isMobile, state, openMobile, setOpenMobile } = useSidebar()
</script>

<template>
  <!-- Collapsible "none": always-visible static sidebar -->
  <div
    v-if="props.collapsible === 'none'"
    data-slot="sidebar"
    :class="cn('bg-sidebar text-sidebar-foreground flex h-full w-(--sidebar-width) flex-col', props.class)"
  >
    <slot />
  </div>

  <!-- Mobile: rendered in a Sheet -->
  <Sheet v-else-if="isMobile" :open="openMobile" @update:open="setOpenMobile">
    <SheetContent
      data-sidebar="sidebar"
      data-slot="sidebar"
      data-mobile="true"
      :side="props.side"
      class="bg-sidebar text-sidebar-foreground w-(--sidebar-width) p-0 [&>button]:hidden"
      :style="{ '--sidebar-width': SIDEBAR_WIDTH_MOBILE }"
    >
      <SheetHeader class="absolute">
        <SheetTitle class="sr-only">Sidebar</SheetTitle>
        <SheetDescription class="sr-only">Displays the mobile sidebar.</SheetDescription>
      </SheetHeader>
      <div class="flex h-full w-full flex-col">
        <slot />
      </div>
    </SheetContent>
  </Sheet>

  <!-- Desktop -->
  <div
    v-else
    class="group peer text-sidebar-foreground hidden md:block"
    :data-state="state"
    :data-collapsible="state === 'collapsed' ? props.collapsible : ''"
    :data-variant="props.variant"
    :data-side="props.side"
    data-slot="sidebar"
  >
    <!-- This is what handles the sidebar gap on desktop -->
    <div
      data-slot="sidebar-gap"
      :class="cn(
        'relative w-(--sidebar-width) bg-transparent transition-[width] duration-200 ease-linear',
        'group-data-[collapsible=offcanvas]:w-0',
        'group-data-[side=right]:rotate-180',
        props.variant === 'floating' || props.variant === 'inset'
          ? 'group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4)))]'
          : 'group-data-[collapsible=icon]:w-(--sidebar-width-icon)',
      )"
    />
    <div
      data-slot="sidebar-container"
      :class="cn(
        'fixed top-(--header-height) bottom-0 z-10 hidden h-[calc(100svh-var(--header-height))] w-(--sidebar-width) transition-[left,right,width] duration-200 ease-linear md:flex',
        props.side === 'left'
          ? 'left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]'
          : 'right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]',
        props.variant === 'floating' || props.variant === 'inset'
          ? 'p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]'
          : 'group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[side=left]:border-r group-data-[side=right]:border-l',
        props.class,
      )"
    >
      <div
        data-sidebar="sidebar"
        data-slot="sidebar-inner"
        class="bg-sidebar group-data-[variant=floating]:border-sidebar-border flex h-full w-full flex-col group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:shadow-sm"
      >
        <slot />
      </div>
    </div>
  </div>
</template>
