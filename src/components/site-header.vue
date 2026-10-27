<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { RefreshCw, Search } from 'lucide-vue-next'
import { toast } from 'vue-sonner'

import AccountSettingsDialog from '@/components/app/account-settings-dialog.vue'
import CreateWorkspaceDialog from '@/components/app/create-workspace-dialog.vue'
import JoinWorkspaceDialog from '@/components/app/join-workspace-dialog.vue'
import CommandSearch from '@/components/command-search.vue'
import HeaderReportMenu from '@/components/app/header-report-menu.vue'
import NotificationsMenu from '@/components/app/notifications-menu.vue'
import HeaderUserMenu from '@/components/app/header-user-menu.vue'
import UserAvatar from '@/components/app/user-avatar.vue'
import WorkspaceSwitcher from '@/components/app/workspace-switcher.vue'
import Logo from '@/components/logo.vue'
import { Button } from '@/components/ui/button'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { truncateText } from '@/lib/display'
import { ROUTES } from '@/lib/routes'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const searchOpen = ref(false)
const refreshing = ref(false)
const createWorkspaceOpen = ref(false)
const joinWorkspaceOpen = ref(false)
const accountOpen = ref(false)

function openAccountSettings() {
  accountOpen.value = true
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'k' && (event.metaKey || event.ctrlKey)) {
    event.preventDefault()
    searchOpen.value = !searchOpen.value
  }
}

async function refreshWorkspace() {
  refreshing.value = true
  try {
    await auth.fetchMe()
    toast.success('Data perusahaan diperbarui')
  } catch {
    toast.error('Gagal memuat ulang data perusahaan')
  } finally {
    refreshing.value = false
  }
}

onMounted(() => {
  if (auth.token && !auth.user) void auth.init()
  window.addEventListener('keydown', onKeydown)
})
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <header class="fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-zinc-950/90 text-white shadow-sm backdrop-blur-md supports-[backdrop-filter]:bg-zinc-950/75">
    <div class="flex h-14 items-center gap-2 px-3 sm:gap-3 sm:px-4">
      <RouterLink
        :to="ROUTES.summary"
        class="flex min-w-0 shrink cursor-pointer items-center gap-2 rounded-md border-r border-white/20 px-1 py-1 pr-2 transition-colors hover:bg-white/10 sm:pr-3"
      >
        <Logo :size="22" class="shrink-0 text-white" />
        <span class="max-w-[5rem] truncate text-sm font-semibold tracking-tight sm:max-w-none">Hadirin</span>
      </RouterLink>

      <SidebarTrigger class="-ml-1 cursor-pointer text-white hover:bg-white/10 hover:text-white" />

      <div class="hidden min-w-0 items-center gap-2 text-sm text-zinc-300 md:flex">
        <UserAvatar :user="auth.user" class="size-6 shrink-0" />
        <span class="max-w-[8rem] truncate lg:max-w-[10rem]">
          {{ truncateText(auth.user?.name || 'Admin', 18) }}
        </span>
        <span class="text-white/35">/</span>
        <WorkspaceSwitcher
          @open-create="createWorkspaceOpen = true"
          @open-join="joinWorkspaceOpen = true"
        />
      </div>

      <div class="ml-auto flex shrink-0 items-center gap-2">
        <div class="hidden h-9 w-56 shrink-0 items-stretch overflow-hidden rounded-full border border-white/15 bg-white/5 md:flex lg:w-64">
          <button
            type="button"
            class="flex min-w-0 flex-1 cursor-pointer items-center gap-2 px-3 text-left text-sm text-zinc-400 transition-colors hover:bg-white/5 hover:text-zinc-200"
            @click="searchOpen = true"
          >
            <Search class="size-4 shrink-0" />
            <span class="truncate">Cari attendance karyawan</span>
            <kbd class="ml-auto hidden rounded border border-white/15 bg-black/40 px-1.5 py-0.5 text-[10px] text-zinc-500 lg:inline">
              Ctrl+K
            </kbd>
          </button>
          <button
            type="button"
            class="cursor-pointer border-l border-white/15 px-3 text-sm text-white transition-colors hover:bg-white/10"
            @click="searchOpen = true"
          >
            Cari
          </button>
        </div>

        <Button
          variant="ghost"
          size="icon"
          class="cursor-pointer text-white hover:bg-white/10 hover:text-white md:hidden"
          aria-label="Cari"
          @click="searchOpen = true"
        >
          <Search class="size-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          class="cursor-pointer text-white hover:bg-white/10 hover:text-white"
          aria-label="Muat ulang data"
          :disabled="refreshing"
          @click="refreshWorkspace"
        >
          <RefreshCw class="size-4" :class="refreshing ? 'animate-spin' : ''" />
        </Button>

        <NotificationsMenu />
        <div class="hidden sm:contents">
          <HeaderReportMenu />
        </div>
        <HeaderUserMenu @open-account="openAccountSettings" />
      </div>
    </div>

    <div class="flex min-w-0 items-center gap-2 border-t border-white/10 px-3 py-2 text-sm text-zinc-300 md:hidden">
      <UserAvatar :user="auth.user" class="size-6 shrink-0" />
      <span class="min-w-0 max-w-[38%] truncate">{{ auth.user?.name || 'Admin' }}</span>
      <span class="shrink-0 text-white/35">/</span>
      <div class="min-w-0 flex-1">
        <WorkspaceSwitcher
          class="w-full max-w-full"
          @open-create="createWorkspaceOpen = true"
          @open-join="joinWorkspaceOpen = true"
        />
      </div>
    </div>
  </header>

  <CommandSearch :open="searchOpen" @update:open="searchOpen = $event" />

  <CreateWorkspaceDialog v-model:open="createWorkspaceOpen" />
  <JoinWorkspaceDialog v-model:open="joinWorkspaceOpen" />
  <AccountSettingsDialog v-model:open="accountOpen" />
</template>
