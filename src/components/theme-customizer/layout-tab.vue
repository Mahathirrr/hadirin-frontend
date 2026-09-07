<script setup lang="ts">
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import {
  sidebarCollapsibleOptions,
  sidebarSideOptions,
  sidebarVariants,
} from '@/config/themeCustomizerConstants'
import { useSidebarConfig } from '@/hooks/useSidebarConfig'
import { useSidebar } from '@/components/ui/sidebar'

const { config: sidebarConfig, updateConfig: updateSidebarConfig } = useSidebarConfig()
const { toggleSidebar, state: sidebarState } = useSidebar()

function handleSidebarVariantSelect(variant: 'sidebar' | 'floating' | 'inset') {
  updateSidebarConfig({ variant })
}

function handleSidebarCollapsibleSelect(collapsible: 'offcanvas' | 'icon' | 'none') {
  updateSidebarConfig({ collapsible })
  if (collapsible === 'icon' && sidebarState.value === 'expanded') {
    toggleSidebar()
  }
}

function handleSidebarSideSelect(side: 'left' | 'right') {
  updateSidebarConfig({ side })
}

const isActiveVariant = (v: string) => sidebarConfig.variant === v
const isActiveCollapsible = (v: string) => sidebarConfig.collapsible === v
const isActiveSide = (v: string) => sidebarConfig.side === v
</script>

<template>
  <div class="space-y-6 p-4">
    <!-- Sidebar Variant -->
    <div class="space-y-3">
      <div>
        <Label class="text-sm font-medium">Sidebar Variant</Label>
        <p v-if="sidebarConfig.variant" class="text-muted-foreground mt-1 text-xs">
          {{ sidebarConfig.variant === 'sidebar' && 'Default: Standard sidebar layout' }}
          {{ sidebarConfig.variant === 'floating' && 'Floating: Floating sidebar with border' }}
          {{ sidebarConfig.variant === 'inset' && 'Inset: Inset sidebar with rounded corners' }}
        </p>
      </div>
      <div class="grid grid-cols-3 gap-3">
        <div
          v-for="variant in sidebarVariants"
          :key="variant.value"
          class="relative cursor-pointer rounded-md border p-4 transition-colors"
          :class="isActiveVariant(variant.value) ? 'border-primary bg-primary/10' : 'border-border hover:border-border/60'"
          @click="handleSidebarVariantSelect(variant.value as 'sidebar' | 'floating' | 'inset')"
        >
          <div class="space-y-2">
            <div class="text-center text-xs font-semibold">{{ variant.name }}</div>
            <div class="flex h-12 rounded border" :class="variant.value === 'inset' ? 'bg-muted' : 'bg-background'">
              <div
                class="flex w-3 flex-shrink-0 flex-col gap-0.5 bg-muted p-1"
                :class="variant.value === 'floating' ? 'm-1 rounded border-r' : variant.value === 'inset' ? 'ms-0 m-1 rounded bg-muted/80' : 'border-r'"
              >
                <div class="h-0.5 w-full rounded bg-foreground/60"></div>
                <div class="h-0.5 w-3/4 rounded bg-foreground/50"></div>
                <div class="h-0.5 w-2/3 rounded bg-foreground/40"></div>
                <div class="h-0.5 w-3/4 rounded bg-foreground/30"></div>
              </div>
              <div class="flex-1 rounded-sm border border-dashed border-muted-foreground/20 bg-background/50 m-1" :class="variant.value === 'inset' ? 'bg-background ms-0' : 'bg-background/50'"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Separator />

    <!-- Sidebar Collapsible Mode -->
    <div class="space-y-3">
      <div>
        <Label class="text-sm font-medium">Sidebar Collapsible Mode</Label>
        <p v-if="sidebarConfig.collapsible" class="text-muted-foreground mt-1 text-xs">
          {{ sidebarConfig.collapsible === 'offcanvas' && 'Off Canvas: Slides out of view' }}
          {{ sidebarConfig.collapsible === 'icon' && 'Icon: Collapses to icon only' }}
          {{ sidebarConfig.collapsible === 'none' && 'None: Always visible' }}
        </p>
      </div>
      <div class="grid grid-cols-3 gap-3">
        <div
          v-for="option in sidebarCollapsibleOptions"
          :key="option.value"
          class="relative cursor-pointer rounded-md border p-4 transition-colors"
          :class="isActiveCollapsible(option.value) ? 'border-primary bg-primary/10' : 'border-border hover:border-border/60'"
          @click="handleSidebarCollapsibleSelect(option.value as 'offcanvas' | 'icon' | 'none')"
        >
          <div class="space-y-2">
            <div class="text-center text-xs font-semibold">{{ option.name }}</div>
            <div class="flex h-12 rounded border bg-background">
              <template v-if="option.value === 'offcanvas'">
                <div class="flex flex-1 items-center justify-start rounded-sm border border-dashed border-muted-foreground/20 bg-background/50 p-2 m-1">
                  <div class="flex flex-col gap-0.5">
                    <div class="h-0.5 w-3 rounded bg-foreground/60"></div>
                    <div class="h-0.5 w-3 rounded bg-foreground/60"></div>
                    <div class="h-0.5 w-3 rounded bg-foreground/60"></div>
                  </div>
                </div>
              </template>
              <template v-else-if="option.value === 'icon'">
                <div class="flex w-4 flex-shrink-0 flex-col items-center gap-1 border-r bg-muted p-1">
                  <div class="h-2 w-2 rounded-sm bg-foreground/60"></div>
                  <div class="h-2 w-2 rounded-sm bg-foreground/40"></div>
                  <div class="h-2 w-2 rounded-sm bg-foreground/30"></div>
                </div>
                <div class="m-1 flex-1 rounded-sm border border-dashed border-muted-foreground/20 bg-background/50"></div>
              </template>
              <template v-else>
                <div class="flex w-6 flex-shrink-0 flex-col gap-0.5 border-r bg-muted p-1">
                  <div class="h-0.5 w-full rounded bg-foreground/60"></div>
                  <div class="h-0.5 w-3/4 rounded bg-foreground/50"></div>
                  <div class="h-0.5 w-2/3 rounded bg-foreground/40"></div>
                  <div class="h-0.5 w-3/4 rounded bg-foreground/30"></div>
                </div>
                <div class="m-1 flex-1 rounded-sm border border-dashed border-muted-foreground/20 bg-background/50"></div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Separator />

    <!-- Sidebar Side -->
    <div class="space-y-3">
      <div>
        <Label class="text-sm font-medium">Sidebar Position</Label>
        <p v-if="sidebarConfig.side" class="text-muted-foreground mt-1 text-xs">
          {{ sidebarConfig.side === 'left' && 'Left: Sidebar positioned on the left side' }}
          {{ sidebarConfig.side === 'right' && 'Right: Sidebar positioned on the right side' }}
        </p>
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div
          v-for="side in sidebarSideOptions"
          :key="side.value"
          class="relative cursor-pointer rounded-md border p-4 transition-colors"
          :class="isActiveSide(side.value) ? 'border-primary bg-primary/10' : 'border-border hover:border-border/60'"
          @click="handleSidebarSideSelect(side.value as 'left' | 'right')"
        >
          <div class="space-y-2">
            <div class="text-center text-xs font-semibold">{{ side.name }}</div>
            <div class="flex h-12 rounded border bg-background">
              <template v-if="side.value === 'left'">
                <div class="flex w-6 flex-shrink-0 flex-col gap-0.5 border-r bg-muted p-1">
                  <div class="h-0.5 w-full rounded bg-foreground/60"></div>
                  <div class="h-0.5 w-3/4 rounded bg-foreground/50"></div>
                  <div class="h-0.5 w-2/3 rounded bg-foreground/40"></div>
                  <div class="h-0.5 w-3/4 rounded bg-foreground/30"></div>
                </div>
                <div class="m-1 flex-1 rounded-sm border border-dashed border-muted-foreground/20 bg-background/50"></div>
              </template>
              <template v-else>
                <div class="m-1 flex-1 rounded-sm border border-dashed border-muted-foreground/20 bg-background/50"></div>
                <div class="flex w-6 flex-shrink-0 flex-col gap-0.5 border-l bg-muted p-1">
                  <div class="h-0.5 w-full rounded bg-foreground/60"></div>
                  <div class="h-0.5 w-3/4 rounded bg-foreground/50"></div>
                  <div class="h-0.5 w-2/3 rounded bg-foreground/40"></div>
                  <div class="h-0.5 w-3/4 rounded bg-foreground/30"></div>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
