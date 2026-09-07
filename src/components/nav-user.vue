<script setup lang="ts">
import {
  BellDot,
  CircleUser,
  CreditCard,
  EllipsisVertical,
  LogOut,
} from 'lucide-vue-next'
import { RouterLink } from 'vue-router'

import Logo from '@/components/logo.vue'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'

interface Props {
  user: { name: string; email: string; avatar: string }
}

const props = defineProps<Props>()

const { isMobile } = useSidebar()
</script>

<template>
  <SidebarMenu>
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <SidebarMenuButton
            size="lg"
            class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer"
          >
            <div class="flex h-8 w-8 items-center justify-center rounded-lg">
              <Logo :size="28" />
            </div>
            <div class="grid flex-1 text-left text-sm leading-tight">
              <span class="font-medium truncate">{{ props.user.name }}</span>
              <span class="text-muted-foreground truncate text-xs">
                {{ props.user.email }}
              </span>
            </div>
            <EllipsisVertical class="ml-auto size-4" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          class="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
          :side="isMobile ? 'bottom' : 'right'"
          align="end"
          :side-offset="4"
        >
          <DropdownMenuLabel class="p-0 font-normal">
            <div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
              <div class="h-8 w-8 rounded-lg">
                <Logo :size="28" />
              </div>
              <div class="grid flex-1 text-left text-sm leading-tight">
                <span class="font-medium truncate">{{ props.user.name }}</span>
                <span class="text-muted-foreground truncate text-xs">
                  {{ props.user.email }}
                </span>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem as-child class="cursor-pointer">
              <RouterLink to="/settings/account">
                <CircleUser />
                Account
              </RouterLink>
            </DropdownMenuItem>
            <DropdownMenuItem as-child class="cursor-pointer">
              <RouterLink to="/settings/billing">
                <CreditCard />
                Billing
              </RouterLink>
            </DropdownMenuItem>
            <DropdownMenuItem as-child class="cursor-pointer">
              <RouterLink to="/settings/notifications">
                <BellDot />
                Notifications
              </RouterLink>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem as-child class="cursor-pointer">
            <RouterLink to="/landing">
              <LogOut />
              Log out
            </RouterLink>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  </SidebarMenu>
</template>
