<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

import EmptyState from '@/components/app/empty-state.vue'
import StatCard from '@/components/app/stat-card.vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { api } from '@/lib/api'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const rows = ref<Array<Record<string, unknown>>>([])
const loading = ref(true)

function isToday(iso: unknown) {
  if (!iso) return false
  const d = new Date(String(iso))
  const now = new Date()
  return d.getFullYear() === now.getFullYear()
    && d.getMonth() === now.getMonth()
    && d.getDate() === now.getDate()
}

const stats = computed(() => {
  const list = rows.value
  const today = list.filter((r) => isToday(r.created_at)).length
  const dataChanges = list.filter((r) => ['create', 'update', 'delete'].includes(String(r.action))).length
  const authActions = list.filter((r) =>
    ['login', 'join', 'reset_invite'].includes(String(r.action))
    || String(r.entity_type) === 'auth',
  ).length
  return {
    total: list.length,
    today,
    dataChanges,
    authActions,
  }
})

onMounted(async () => {
  if (auth.token && auth.workspaceId) {
    try {
      rows.value = await api.listAuditLogs(auth.token, auth.workspaceId)
    } catch {
      rows.value = []
    }
  }
  loading.value = false
})
</script>

<template>
  <div class="flex flex-col gap-6 px-4 lg:px-6">
    <div>
      <h1 class="text-3xl font-bold tracking-tight">Log audit</h1>
      <p class="text-sm text-muted-foreground">Riwayat aktivitas dan perubahan data penting di workspace.</p>
    </div>
    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard title="Total log" :value="stats.total" />
      <StatCard title="Hari ini" :value="stats.today" />
      <StatCard title="Perubahan data" :value="stats.dataChanges" />
      <StatCard title="Aksi akses" :value="stats.authActions" />
    </div>
    <Card class="rounded-xl shadow-none">
      <CardHeader><CardTitle>Daftar log</CardTitle></CardHeader>
      <CardContent>
        <div v-if="loading" class="py-8 text-center text-sm text-muted-foreground">Memuat...</div>
        <EmptyState v-else-if="!rows.length" title="Belum ada log audit" description="Aktivitas workspace akan tercatat otomatis." />
        <Table v-else>
          <TableHeader>
            <TableRow>
              <TableHead>Aksi</TableHead>
              <TableHead>Entitas</TableHead>
              <TableHead>Detail</TableHead>
              <TableHead>Waktu</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="(row, i) in rows" :key="i">
              <TableCell>{{ row.action }}</TableCell>
              <TableCell>{{ row.entity_type }}</TableCell>
              <TableCell>{{ row.details }}</TableCell>
              <TableCell class="text-xs">{{ String(row.created_at).replace('T', ' ').slice(0, 19) }}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </div>
</template>
