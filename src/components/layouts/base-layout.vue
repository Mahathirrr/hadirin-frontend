<script setup lang="ts">
import AppSidebar from '@/components/app-sidebar.vue'
import SiteHeader from '@/components/site-header.vue'
import SiteFooter from '@/components/site-footer.vue'
import { provideSidebarConfig } from '@/contexts/sidebarContext'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'

const sidebar = provideSidebarConfig()
</script>

<template>
  <SidebarProvider
    :class="[
      sidebar.config.collapsible === 'none' ? 'sidebar-none-mode' : '',
      'pt-[5.5rem] md:pt-(--header-height)',
    ]"
    :style="{
      '--sidebar-width': '16rem',
      '--sidebar-width-icon': '3rem',
      '--header-height': '3.5rem',
    }"
  >
    <SiteHeader />

    <template v-if="sidebar.config.side === 'left'">
      <AppSidebar
        :variant="sidebar.config.variant"
        :collapsible="sidebar.config.collapsible"
        :side="sidebar.config.side"
      />
      <SidebarInset>
        <div class="flex flex-1 flex-col">
          <div class="@container/main flex flex-1 flex-col gap-2">
            <div class="flex flex-col gap-3 py-3 md:gap-4 md:py-4">
              <slot />
            </div>
          </div>
        </div>
        <SiteFooter />
      </SidebarInset>
    </template>
    <template v-else>
      <SidebarInset>
        <div class="flex flex-1 flex-col">
          <div class="@container/main flex flex-1 flex-col gap-2">
            <div class="flex flex-col gap-3 py-3 md:gap-4 md:py-4">
              <slot />
            </div>
          </div>
        </div>
        <SiteFooter />
      </SidebarInset>
      <AppSidebar
        :variant="sidebar.config.variant"
        :collapsible="sidebar.config.collapsible"
        :side="sidebar.config.side"
      />
    </template>
  </SidebarProvider>
</template>
