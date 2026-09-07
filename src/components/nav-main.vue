<script setup lang="ts">
import { ChevronRight } from 'lucide-vue-next'

import type { Component } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar'

interface NavItem {
  title: string
  url: string
  icon?: Component
  isActive?: boolean
  items?: { title: string; url: string; isActive?: boolean }[]
}

interface Props {
  label: string
  items: NavItem[]
}

const props = defineProps<Props>()

const route = useRoute()

function shouldBeOpen(item: NavItem) {
  if (item.isActive) return true
  return item.items?.some((sub) => route.path === sub.url) || false
}

function isExternal(item: NavItem) {
  return item.title === 'Auth Pages' || item.title === 'Errors'
}
</script>

<template>
  <SidebarGroup>
    <SidebarGroupLabel>{{ props.label }}</SidebarGroupLabel>
    <SidebarMenu>
      <template v-for="item in props.items" :key="item.title">
        <Collapsible :default-open="shouldBeOpen(item)" class="group/collapsible">
          <SidebarMenuItem>
            <template v-if="item.items?.length">
              <CollapsibleTrigger as-child>
                <SidebarMenuButton tooltip="item.title" class="cursor-pointer">
                  <component :is="item.icon" v-if="item.icon" />
                  <span>{{ item.title }}</span>
                  <ChevronRight
                    class="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
                  />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  <SidebarMenuSubItem v-for="sub in item.items" :key="sub.title">
                    <SidebarMenuSubButton
                      as-child
                      class="cursor-pointer"
                      :is-active="route.path === sub.url"
                    >
                      <RouterLink
                        :to="sub.url"
                        :target="isExternal(item) ? '_blank' : undefined"
                        :rel="isExternal(item) ? 'noopener noreferrer' : undefined"
                      >
                        <span>{{ sub.title }}</span>
                      </RouterLink>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </CollapsibleContent>
            </template>
            <template v-else>
              <SidebarMenuButton
                as-child
                tooltip="item.title"
                class="cursor-pointer"
                :is-active="route.path === item.url"
              >
                <RouterLink :to="item.url">
                  <component :is="item.icon" v-if="item.icon" />
                  <span>{{ item.title }}</span>
                </RouterLink>
              </SidebarMenuButton>
            </template>
          </SidebarMenuItem>
        </Collapsible>
      </template>
    </SidebarMenu>
  </SidebarGroup>
</template>
