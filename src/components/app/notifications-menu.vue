<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Bell } from 'lucide-vue-next'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { api } from '@/lib/api'
import { useAuthStore } from '@/stores/auth'
import { registerWebPush } from '@/composables/useWebPush'

const auth = useAuthStore()
const items = ref<Array<Record<string, unknown>>>([])
const unread = ref(0)
const loading = ref(false)

async function refresh() {
  if (!auth.token) return
  loading.value = true
  try {
    const res = await api.listNotifications(auth.token)
    items.value = res.data
    unread.value = Number(res.unread_count ?? 0)
  } finally {
    loading.value = false
  }
}

async function markRead(id: number) {
  if (!auth.token) return
  await api.markNotificationRead(auth.token, id)
  await refresh()
}

async function markAllRead() {
  if (!auth.token) return
  await api.markAllNotificationsRead(auth.token)
  await refresh()
}

onMounted(() => {
  void refresh()
  if (auth.token) void registerWebPush(auth.token)
})
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" size="icon" class="relative text-white hover:bg-white/10" @click="refresh">
        <Bell class="size-4" />
        <span
          v-if="unread > 0"
          class="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-black"
        >
          {{ unread > 9 ? '9+' : unread }}
        </span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" class="w-80">
      <DropdownMenuLabel class="flex items-center justify-between">
        Notifikasi
        <button type="button" class="text-xs text-primary" @click="markAllRead">Tandai semua dibaca</button>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <div v-if="loading" class="px-3 py-4 text-sm text-muted-foreground">Memuat…</div>
      <div v-else-if="!items.length" class="px-3 py-4 text-sm text-muted-foreground">Tidak ada notifikasi.</div>
      <DropdownMenuItem
        v-for="n in items"
        :key="String(n.id)"
        class="cursor-pointer flex-col items-start gap-0.5 whitespace-normal"
        @click="markRead(Number(n.id))"
      >
        <span class="font-medium">{{ n.title }}</span>
        <span class="text-xs text-muted-foreground">{{ n.body }}</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
