<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { toast } from 'vue-sonner'
import {
  CalendarCheck,
  CheckCircle2,
  ClipboardList,
  Download,
  FileSpreadsheet,
  ScanLine,
} from 'lucide-vue-next'

import EmptyState from '@/components/app/empty-state.vue'
import PageShell from '@/components/app/page-shell.vue'
import StatCard from '@/components/app/stat-card.vue'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useWorkspaceLoader } from '@/composables/useWorkspaceData'
import { api } from '@/lib/api'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const activeDate = ref(new Date().toISOString().slice(0, 10))
const nameFilter = ref('')
const statusFilter = ref('all')
const attendanceOpen = ref(true)
const scanOpen = ref(true)
const reportOpen = ref(true)
const generating = ref(false)

const { data: records, loading, load: reloadAttendance } = useWorkspaceLoader(async (token, workspaceId) =>
  api.listAttendance(token, workspaceId, activeDate.value) as Promise<Array<Record<string, unknown>>>,
)

const { data: auditLogs, load: reloadAudit } = useWorkspaceLoader(async (token, workspaceId) =>
  api.listAuditLogs(token, workspaceId) as Promise<Array<Record<string, unknown>>>,
)

const { data: weeklyReports, load: reloadWeekly } = useWorkspaceLoader(async (token, workspaceId) =>
  api.listWeeklyReports(token, workspaceId) as Promise<Array<Record<string, unknown>>>,
)

watch(activeDate, () => { void reloadAttendance() })

const filteredRecords = computed(() => {
  let list = records.value ?? []
  const q = nameFilter.value.trim().toLowerCase()
  if (q) {
    list = list.filter((r) =>
      String((r.employee as { name?: string })?.name ?? '').toLowerCase().includes(q),
    )
  }
  if (statusFilter.value !== 'all') {
    list = list.filter((r) => String(r.status) === statusFilter.value)
  }
  return list
})

const presentCount = computed(() =>
  (records.value ?? []).filter((r) => r.status === 'present' || r.status === 'late').length,
)

const checkoutCount = computed(() =>
  (records.value ?? []).filter((r) => r.check_out).length,
)

const editedCount = computed(() =>
  (records.value ?? []).filter((r) => {
    const created = String(r.created_at ?? '')
    const updated = String(r.updated_at ?? '')
    return updated && created && updated !== created
  }).length,
)

const scanEvents = computed(() => {
  const date = activeDate.value
  return (auditLogs.value ?? []).filter((log) => {
    if (String(log.entity_type) !== 'attendance') return false
    return String(log.created_at ?? '').slice(0, 10) === date
  })
})

const scanSuccess = computed(() =>
  scanEvents.value.filter((e) => String(e.action) === 'create').length,
)

function formatTime(value: unknown) {
  if (!value) return '—'
  const s = String(value)
  if (s.includes('T')) return s.slice(11, 16)
  return s.slice(0, 5)
}

function employeeName(row: Record<string, unknown>) {
  return (row.employee as { name?: string })?.name ?? `#${row.employee_id}`
}

function statusLabel(status: unknown) {
  const map: Record<string, string> = {
    present: 'Hadir',
    late: 'Terlambat',
    absent: 'Tidak hadir',
  }
  return map[String(status)] ?? String(status)
}

function resetFilters() {
  nameFilter.value = ''
  statusFilter.value = 'all'
}

async function refreshAll() {
  await Promise.all([reloadAttendance(), reloadAudit(), reloadWeekly()])
}

async function generateWeekly() {
  if (!auth.token || !auth.workspaceId) return
  generating.value = true
  try {
    const res = await api.generateWeeklyReport(auth.token, auth.workspaceId)
    toast.success(res.message || 'Report mingguan berhasil dibuat')
    await reloadWeekly()
  } catch (e) {
    toast.error(e instanceof Error ? e.message : 'Gagal membuat report mingguan')
  } finally {
    generating.value = false
  }
}

async function downloadWeekly(id: number) {
  if (!auth.token) return
  try {
    await api.downloadWeeklyReportById(auth.token, id)
    toast.success('Report diunduh')
  } catch (e) {
    toast.error(e instanceof Error ? e.message : 'Gagal mengunduh report')
  }
}

const dataCondition = computed(() => {
  const n = records.value?.length ?? 0
  if (n === 0) return 'Belum ada data absensi untuk tanggal ini'
  return `${n} catatan absensi untuk ${activeDate.value}`
})
</script>

<template>
  <PageShell title="Laporan & Audit Kehadiran">
    <template #header>
      <div class="flex flex-wrap items-start justify-between gap-3">
        <div class="space-y-0.5">
          <h1 class="text-2xl font-bold tracking-tight md:text-3xl">Laporan & Audit Kehadiran</h1>
          <p class="text-sm text-muted-foreground">
            Tinjau catatan kehadiran harian, event scan, dan riwayat report mingguan workspace.
          </p>
        </div>
        <Badge variant="outline" class="shrink-0 tabular-nums">Tanggal: {{ activeDate }}</Badge>
      </div>
    </template>

    <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard label="Total data" :value="records?.length ?? 0" :icon="ClipboardList" />
      <StatCard label="Check-in" :value="presentCount" :icon="CheckCircle2" />
      <StatCard label="Check-out" :value="checkoutCount" :icon="CalendarCheck" />
      <StatCard label="Diedit" :value="editedCount" :icon="FileSpreadsheet" hint="Record dengan perubahan" />
    </div>

    <Card class="rounded-xl border-border/60 shadow-none">
      <CardHeader>
        <CardTitle class="text-base">Filter absensi harian</CardTitle>
      </CardHeader>
      <CardContent class="space-y-3">
        <div class="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <div class="grid gap-1.5">
            <Label>Tanggal</Label>
            <Input v-model="activeDate" type="date" />
          </div>
          <div class="grid gap-1.5">
            <Label>Nama karyawan</Label>
            <Input v-model="nameFilter" placeholder="Cari nama karyawan" />
          </div>
          <div class="grid gap-1.5 xl:col-span-2">
            <Label>Status kehadiran</Label>
            <Select v-model="statusFilter">
              <SelectTrigger><SelectValue placeholder="Semua status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua</SelectItem>
                <SelectItem value="present">Hadir</SelectItem>
                <SelectItem value="late">Terlambat</SelectItem>
                <SelectItem value="absent">Tidak hadir</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div class="flex flex-wrap items-center gap-2 border-t border-border/60 pt-3">
          <Button size="sm" variant="outline" :disabled="loading" @click="refreshAll">
            {{ loading ? 'Memuat…' : 'Muat ulang data' }}
          </Button>
          <Button size="sm" variant="ghost" @click="resetFilters">Reset filter</Button>
          <span class="text-xs text-muted-foreground">{{ dataCondition }}</span>
        </div>
      </CardContent>
    </Card>

    <Card class="rounded-xl border-border/60 shadow-none">
      <CardHeader class="flex flex-row items-center justify-between gap-3">
        <CardTitle class="text-base">Data absensi</CardTitle>
        <Button variant="outline" size="sm" @click="attendanceOpen = !attendanceOpen">
          {{ attendanceOpen ? 'Sembunyikan' : 'Tampilkan' }}
        </Button>
      </CardHeader>
      <CardContent v-if="attendanceOpen">
        <EmptyState
          v-if="filteredRecords.length === 0"
          :icon="ClipboardList"
          title="Tidak ada data absensi"
          :description="`Belum ada catatan kehadiran untuk ${activeDate}. Pilih tanggal lain atau pastikan karyawan sudah check-in.`"
          compact
        />
        <div v-else class="overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Karyawan</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Jam datang</TableHead>
                <TableHead>Jam pulang</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Metode</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="row in filteredRecords" :key="String(row.id)">
                <TableCell class="font-medium">{{ employeeName(row) }}</TableCell>
                <TableCell class="tabular-nums">{{ String(row.created_at).slice(0, 10) }}</TableCell>
                <TableCell class="tabular-nums">{{ formatTime(row.check_in) }}</TableCell>
                <TableCell class="tabular-nums">{{ formatTime(row.check_out) }}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{{ statusLabel(row.status) }}</Badge>
                </TableCell>
                <TableCell class="text-muted-foreground">{{ row.check_in_method || 'manual' }}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>

    <Card class="rounded-xl border-border/60 shadow-none">
      <CardHeader class="flex flex-row flex-wrap items-center justify-between gap-3">
        <CardTitle class="text-base">Event scan & absensi</CardTitle>
        <Button variant="outline" size="sm" @click="scanOpen = !scanOpen">
          {{ scanOpen ? 'Sembunyikan' : 'Tampilkan' }}
        </Button>
      </CardHeader>
      <CardContent v-if="scanOpen" class="space-y-3">
        <div class="grid gap-2 sm:grid-cols-3">
          <StatCard label="Total event" :value="scanEvents.length" :icon="ScanLine" class="!shadow-none" />
          <StatCard label="Check-in tercatat" :value="scanSuccess" class="!shadow-none" />
          <StatCard label="Hari aktif" :value="activeDate" class="!shadow-none" />
        </div>
        <EmptyState
          v-if="scanEvents.length === 0"
          :icon="ScanLine"
          title="Belum ada event scan"
          description="Event check-in via QR atau manual akan tercatat otomatis di log audit."
          compact
        />
        <div v-else class="overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Waktu</TableHead>
                <TableHead>Aksi</TableHead>
                <TableHead>Detail</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="(ev, i) in scanEvents" :key="i">
                <TableCell class="tabular-nums">{{ String(ev.created_at).slice(11, 19) }}</TableCell>
                <TableCell>{{ ev.action }}</TableCell>
                <TableCell class="text-muted-foreground">{{ ev.details || '—' }}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>

    <Card class="rounded-xl border-border/60 shadow-none">
      <CardHeader class="flex flex-row flex-wrap items-center justify-between gap-3">
        <div>
          <CardTitle class="text-base">Riwayat report mingguan</CardTitle>
          <p class="mt-0.5 text-sm text-muted-foreground">Arsip CSV kehadiran per minggu.</p>
        </div>
        <div class="flex flex-wrap gap-2">
          <Button size="sm" :disabled="generating" @click="generateWeekly">
            {{ generating ? 'Memproses…' : 'Generate report mingguan' }}
          </Button>
          <Button variant="outline" size="sm" @click="reloadWeekly">Muat ulang</Button>
        </div>
      </CardHeader>
      <CardContent v-if="reportOpen" class="space-y-3">
        <EmptyState
          v-if="(weeklyReports?.length ?? 0) === 0"
          :icon="FileSpreadsheet"
          title="Belum ada report mingguan"
          description="Generate report pertama untuk mengarsipkan data kehadiran minggu berjalan."
          compact
        >
          <template #actions>
            <Button size="sm" :disabled="generating" @click="generateWeekly">
              {{ generating ? 'Memproses…' : 'Generate report pertama' }}
            </Button>
          </template>
        </EmptyState>
        <div v-else class="overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Minggu</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Waktu generate</TableHead>
                <TableHead class="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="w in weeklyReports ?? []" :key="String(w.id)">
                <TableCell class="tabular-nums">
                  {{ String(w.week_start).slice(0, 10) }} – {{ String(w.week_end).slice(0, 10) }}
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{{ w.status }}</Badge>
                </TableCell>
                <TableCell class="tabular-nums text-muted-foreground">
                  {{ w.generated_at ? String(w.generated_at).slice(0, 16).replace('T', ' ') : '—' }}
                </TableCell>
                <TableCell class="text-right">
                  <Button
                    v-if="w.status === 'completed'"
                    variant="outline"
                    size="sm"
                    @click="downloadWeekly(Number(w.id))"
                  >
                    <Download class="mr-1 size-3.5" />
                    Unduh CSV
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  </PageShell>
</template>
