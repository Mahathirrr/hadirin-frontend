<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowDownToLine, FileDown, History } from 'lucide-vue-next'
import { toast } from 'vue-sonner'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { api } from '@/lib/api'
import { ROUTES } from '@/lib/routes'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()
const loading = ref<'download' | 'generate' | null>(null)

async function downloadLatestReport(event: Event) {
  event.preventDefault()
  if (!auth.token || !auth.workspaceId) {
    toast.error('Workspace aktif belum dipilih')
    return
  }

  loading.value = 'download'
  try {
    await api.downloadWeeklyReportFile(auth.token, auth.workspaceId)
    toast.success('Report mingguan berhasil diunduh')
  } catch (error) {
    toast.error(error instanceof Error ? error.message : 'Belum ada report mingguan yang selesai')
    router.push(ROUTES.workPlans)
  } finally {
    loading.value = null
  }
}

async function generateCurrentReport(event: Event) {
  event.preventDefault()
  if (!auth.token || !auth.workspaceId) {
    toast.error('Workspace aktif belum dipilih')
    return
  }

  loading.value = 'generate'
  try {
    const result = await api.generateWeeklyReport(auth.token, auth.workspaceId)
    toast.success(result.message || 'Generate report minggu berjalan dimulai')
    router.push(ROUTES.workPlans)
  } catch (error) {
    toast.error(error instanceof Error ? error.message : 'Gagal generate report mingguan')
  } finally {
    loading.value = null
  }
}
</script>

<template>
  <DropdownMenu :modal="false">
    <DropdownMenuTrigger
      class="inline-flex size-8 cursor-pointer items-center justify-center rounded-md text-white/90 transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/30"
      aria-label="Aksi report mingguan"
    >
      <ArrowDownToLine class="size-4" />
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" class="z-[120] w-72 border-zinc-800 bg-zinc-950 text-zinc-50">
      <DropdownMenuItem
        class="cursor-pointer gap-2 focus:bg-zinc-900 focus:text-zinc-50"
        :disabled="loading === 'download'"
        @select="downloadLatestReport"
      >
        <FileDown class="size-4 shrink-0" />
        <span>Unduh report mingguan selesai terakhir</span>
      </DropdownMenuItem>
      <DropdownMenuItem
        class="cursor-pointer gap-2 focus:bg-zinc-900 focus:text-zinc-50"
        :disabled="loading === 'generate'"
        @select="generateCurrentReport"
      >
        <History class="size-4 shrink-0" />
        <span>Generate report minggu berjalan</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
