<script setup lang="ts">
import { computed, ref } from 'vue'
import { RefreshCw, ScanSearch, ShieldAlert } from 'lucide-vue-next'
import { toast } from 'vue-sonner'

import PageShell from '@/components/app/page-shell.vue'
import StatCard from '@/components/app/stat-card.vue'
import TableEmpty from '@/components/app/table-empty.vue'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useWorkspaceLoader } from '@/composables/useWorkspaceData'
import { api } from '@/lib/api'
import { useAuthStore } from '@/stores/auth'

type AnomalyRow = Record<string, unknown>
type Summary = { open: number; reviewing: number; closed: number; high_open: number; risk_score: number }

const auth = useAuthStore()
const statusFilter = ref<string>('all')
const scanning = ref(false)

const isAdmin = computed(() =>
  auth.activeMembership?.role === 'owner' || auth.activeMembership?.role === 'admin',
)

const { data: summary, load: reloadSummary } = useWorkspaceLoader<Summary>(
  (token, workspaceId) => api.anomalySummary(token, workspaceId),
)

const { data: alerts, loading, load: reloadAlerts } = useWorkspaceLoader<AnomalyRow[]>(
  async (token, workspaceId) => {
    const status = statusFilter.value === 'all' ? undefined : statusFilter.value
    return api.listAnomalyAlerts(token, workspaceId, status) as Promise<AnomalyRow[]>
  },
)

const filteredAlerts = computed(() => alerts.value ?? [])

const severityClass: Record<string, string> = {
  high: 'bg-red-100 text-red-800',
  medium: 'bg-amber-100 text-amber-800',
  low: 'bg-sky-100 text-sky-800',
}

const statusLabel: Record<string, string> = {
  open: 'Terbuka',
  reviewing: 'Ditinjau',
  closed: 'Ditutup',
}

const typeLabel: Record<string, string> = {
  geofence_violation: 'Geofence',
  outside_work_hours: 'Luar jam kerja',
  missing_checkout: 'Belum check-out',
  duplicate_check_in: 'Check-in ganda',
  repeated_late: 'Terlambat berulang',
  location_outside_geofence: 'Lokasi aktif',
  attendance_while_on_leave: 'Absen saat cuti',
}

async function refreshAll() {
  await Promise.all([reloadSummary(), reloadAlerts()])
}

async function runScan() {
  if (!auth.token || !auth.workspaceId) return
  if (!isAdmin.value) {
    toast.error('Hanya admin/owner yang dapat menjalankan scan')
    return
  }
  scanning.value = true
  try {
    const res = await api.scanAnomalyAlerts(auth.token, auth.workspaceId)
    toast.success(`Scan selesai: ${res.created} alert baru, ${res.skipped} duplikat dilewati`)
    await refreshAll()
  } catch (e) {
    toast.error(e instanceof Error ? e.message : 'Scan gagal')
  } finally {
    scanning.value = false
  }
}

async function markReviewing(row: AnomalyRow) {
  if (!auth.token || !isAdmin.value) return
  try {
    await api.updateAnomalyAlert(auth.token, Number(row.id), {
      status: 'reviewing',
      review_notes: 'Ditandai dari dashboard',
    })
    toast.success('Status diperbarui')
    await refreshAll()
  } catch (e) {
    toast.error(e instanceof Error ? e.message : 'Gagal memperbarui')
  }
}

async function markClosed(row: AnomalyRow) {
  if (!auth.token || !isAdmin.value) return
  try {
    await api.updateAnomalyAlert(auth.token, Number(row.id), {
      status: 'closed',
      review_notes: 'Ditutup setelah review',
    })
    toast.success('Alert ditutup')
    await refreshAll()
  } catch (e) {
    toast.error(e instanceof Error ? e.message : 'Gagal menutup')
  }
}

function onFilterChange() {
  void reloadAlerts()
}

function employeeName(row: AnomalyRow) {
  const emp = row.employee as { name?: string } | undefined
  return emp?.name ?? (row.employee_id ? `Karyawan #${row.employee_id}` : '—')
}

function formatType(t: unknown) {
  return typeLabel[String(t)] ?? String(t)
}
</script>

<template>
  <PageShell
    title="Deteksi Anomaly"
    description="Pantau pola absensi tidak wajar berbasis aturan yang dapat diaudit (bukan black-box ML)."
  >
    <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard title="Anomaly terbuka" :value="summary?.open ?? 0" />
      <StatCard title="Ditinjau" :value="summary?.reviewing ?? 0" />
      <StatCard title="Ditutup" :value="summary?.closed ?? 0" />
      <StatCard title="Skor risiko" :value="summary?.risk_score ?? 0" hint="0–100, bobot severity" />
    </div>

    <Card class="rounded-xl shadow-none">
      <CardHeader class="flex flex-row flex-wrap items-center justify-between gap-3 px-4 pt-4 pb-2">
        <div>
          <CardTitle class="text-base">Daftar anomaly</CardTitle>
          <p class="mt-0.5 text-sm text-muted-foreground">
            Rule engine: geofence, jam kerja, check-out, duplikasi, keterlambatan, cuti, lokasi aktif.
          </p>
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <Select v-model="statusFilter" @update:model-value="onFilterChange">
            <SelectTrigger class="w-36"><SelectValue placeholder="Semua status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua status</SelectItem>
              <SelectItem value="open">Terbuka</SelectItem>
              <SelectItem value="reviewing">Ditinjau</SelectItem>
              <SelectItem value="closed">Ditutup</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" :disabled="loading" @click="refreshAll">
            <RefreshCw class="size-4" :class="loading ? 'animate-spin' : ''" />
          </Button>
          <Button v-if="isAdmin" size="sm" :disabled="scanning" @click="runScan">
            <ScanSearch class="size-4" />
            {{ scanning ? 'Scanning…' : 'Jalankan scan' }}
          </Button>
        </div>
      </CardHeader>
      <CardContent class="px-4 pb-4">
        <div v-if="(summary?.high_open ?? 0) > 0" class="mb-3 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-900">
          <ShieldAlert class="size-4 shrink-0" />
          {{ summary?.high_open }} alert severity tinggi masih terbuka — prioritaskan review.
        </div>

        <div v-if="loading" class="py-8 text-center text-sm text-muted-foreground">Memuat…</div>
        <TableEmpty
          v-else-if="filteredAlerts.length === 0"
          title="Belum ada anomaly"
          description="Jalankan scan (admin) setelah ada data absensi/lokasi, atau tunggu alert baru dari scan berikutnya."
        />
        <Table v-else>
          <TableHeader>
            <TableRow>
              <TableHead>Karyawan</TableHead>
              <TableHead>Tipe</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Deskripsi</TableHead>
              <TableHead v-if="isAdmin" class="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="row in filteredAlerts" :key="String(row.id)">
              <TableCell>{{ employeeName(row) }}</TableCell>
              <TableCell>{{ formatType(row.alert_type) }}</TableCell>
              <TableCell>
                <Badge :class="severityClass[String(row.severity)] ?? ''" variant="secondary">
                  {{ row.severity }}
                </Badge>
              </TableCell>
              <TableCell>{{ statusLabel[String(row.status)] ?? row.status }}</TableCell>
              <TableCell class="max-w-xs truncate text-sm text-muted-foreground">{{ row.description }}</TableCell>
              <TableCell v-if="isAdmin" class="space-x-1 text-right">
                <Button
                  v-if="row.status === 'open'"
                  variant="outline"
                  size="sm"
                  @click="markReviewing(row)"
                >
                  Tinjau
                </Button>
                <Button
                  v-if="row.status !== 'closed'"
                  variant="ghost"
                  size="sm"
                  @click="markClosed(row)"
                >
                  Tutup
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </PageShell>
</template>
