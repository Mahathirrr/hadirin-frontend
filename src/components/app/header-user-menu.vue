<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { LogOut, Settings } from 'lucide-vue-next'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { deferDialogAction } from '@/lib/defer-open'
import { initials, usernameFromEmail } from '@/lib/display'
import { useAuthStore } from '@/stores/auth'

const emit = defineEmits<{ 'open-account': [] }>()

const auth = useAuthStore()
const router = useRouter()

const displayName = computed(() => auth.user?.name || 'Admin')
const handle = computed(() => usernameFromEmail(auth.user?.email || 'admin@hadirin.id'))

function openAccount(event: Event) {
  deferDialogAction(() => emit('open-account'), event)
}

function signOut() {
  auth.logout()
  router.push('/auth/sign-in')
}
</script>

<template>
  <DropdownMenu :modal="false">
    <DropdownMenuTrigger
      class="cursor-pointer rounded-full transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
      aria-label="Menu akun"
    >
      <Avatar class="size-8 border border-white/20">
        <AvatarFallback class="bg-violet-500 text-xs font-medium text-white">
          {{ initials(displayName) }}
        </AvatarFallback>
      </Avatar>
    </DropdownMenuTrigger>

    <DropdownMenuContent align="end" class="z-[120] w-64 border-zinc-200 bg-white text-zinc-950">
      <DropdownMenuLabel class="p-0 font-normal">
        <div class="flex items-center gap-3 px-2 py-2">
          <Avatar class="size-10">
            <AvatarFallback class="bg-violet-500 text-sm font-medium text-white">
              {{ initials(displayName) }}
            </AvatarFallback>
          </Avatar>
          <div class="min-w-0">
            <p class="truncate text-sm font-medium">{{ displayName }}</p>
            <p class="truncate text-xs text-muted-foreground">{{ handle }}</p>
          </div>
        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem class="cursor-pointer gap-2" @select="openAccount($event as Event)">
        <Settings class="size-4" />
        Manage account
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem class="cursor-pointer gap-2 text-destructive focus:text-destructive" @select="signOut">
        <LogOut class="size-4" />
        Sign out
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
