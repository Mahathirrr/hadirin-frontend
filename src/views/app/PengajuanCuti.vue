<script setup lang="ts">
import { computed, ref } from 'vue'
import { CalendarOff, CheckCircle2, Clock, FileText, XCircle } from 'lucide-vue-next'
import { toast } from 'vue-sonner'

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
import { Textarea } from '@/components/ui/textarea'
import { useWorkspaceLoader } from '@/composables/useWorkspaceData'
import { api } from '@/lib/api'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const statusFilter = ref('pending')
const typeFilter = ref('all')
const showForm = ref(false)
const showAlphaForm = ref(false)
const submitting = ref(false)

const form = ref({
  employee_id: '',
  type: 'annual',
  start_date: '',
  end_date: '',
  reason: '',
})

const alphaForm = ref({
  employee_id: '',
  date: new Date().toISOString().slice(0, 10),
  reason: 'Alfa — tidak hadir tanpa keterangan',
})

const isAdmin = computed(() =>
  auth.activeMembership?.role === 'owner' || auth.activeMembership?.role === 'admin',
)

const { data: rows, loading, load } = useWorkspaceLoader(async (token, ws) =>
  api.listLeaveRequests(token, ws) as Promise<Array<Record<string, unknown>>>,
)

const { data: employees } = useWorkspaceLoader(async (token, ws) =>
  api.listEmployees(token, ws) as Promise<Array<Record<string, unknown>>>,
)

const counts = computed(() => {
  const list = rows.value ?? []
  const c = { pending: 0, approved: 0, rejected: 0, canceled: 0 }
  for (const r of list) {
    const s = String(r.status)
    if (s in c) c[s as keyof typeof c]++
  }
  return c
})

const filtered = computed(() => {
  let list = rows.value ?? []
  if (statusFilter.value !== 'all') {
    list = list.filter((r) => r.status === statusFilter.value)
  }
  if (typeFilter.value !== 'all') {
    list = list.filter((r) => r.type === typeFilter.value)
  }
  return list
})

const statusLabel: Record<string, string> = {
  pending: 'Menunggu',
  approved: 'Disetujui',
  rejected: 'Ditolak',
  canceled: 'Dibatalkan',
}

const typeLabel: Record<string, string> = {
  annual: 'Cuti',
  sick: 'Sakit',
  personal: 'Izin',
  other: 'Lainnya',
}

function employeeName(row: Record<string, unknown>) {
  return (row.employee as { name?: string })?.name ?? `#${row.employee_id}`
}

async function submitLeave() {
  if (!auth.token || !auth.workspaceId) return
  if (!form.value.employee_id || !form.value.start_date || !form.value.end_date) {
    toast.error('Lengkapi karyawan dan tanggal cuti')
    return
  }
  submitting.value = true
  try {
    await api.createLeaveRequest(auth.token, auth.workspaceId, {
      employee_id: Number(form.value.employee_id),
      type: form.value.type,
      start_date: `${form.value.start_date}T00:00:00Z`,
      end_date: `${form.value.end_date}T23:59:59Z`,
      reason: form.value.reason.trim(),
    })
    toast.success('Pengajuan cuti dikirim')
    form.value = { employee_id: '', type: 'annual', start_date: '', end_date: '', reason: '' }
    showForm.value = false
    await load()
  } catch (e) {
    toast.error(e instanceof Error ? e.message : 'Gagal mengirim pengajuan')
  } finally {
    submitting.value = false
  }
}

async function submitAlpha() {
  if (!auth.token || !auth.workspaceId) return
  if (!alphaForm.value.employee_id || !alphaForm.value.date) {
    toast.error('Pilih karyawan dan tanggal alfa')
    return
  }
  submitting.value = true
  try {
    await api.createLeaveRequest(auth.token, auth.workspaceId, {
      employee_id: Number(alphaForm.value.employee_id),
      type: 'other',
      start_date: `${alphaForm.value.date}T00:00:00Z`,
      end_date: `${alphaForm.value.date}T23:59:59Z`,
      reason: alphaForm.value.reason.trim(),
      status: 'approved',
    })
    toast.success('Alfa dicatat')
    alphaForm.value.employee_id = ''
    showAlphaForm.value = false
    await load()
  } catch (e) {
    toast.error(e instanceof Error ? e.message : 'Gagal mencatat alfa')
  } finally {
    submitting.value = false
  }
}

async function review(id: number, status: 'approved' | 'rejected') {
  if (!auth.token || !isAdmin.value) return
  try {
    await api.updateLeaveRequest(auth.token, id, { status })
    toast.success(status === 'approved' ? 'Pengajuan disetujui' : 'Pengajuan ditolak')
    await load()
  } catch (e) {
    toast.error(e instanceof Error ? e.message : 'Gagal memperbarui status')
  }
}
</script>

<template>
  <PageShell
    title="Pengajuan Cuti"
    description="Tinjau pengajuan cuti, izin, dan sakit. Catat alfa untuk ketidakhadiran tanpa keterangan."
  >
    <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard label="Menunggu" :value="counts.pending" :icon="Clock" />
      <StatCard label="Disetujui" :value="counts.approved" :icon="CheckCircle2" />
      <StatCard label="Ditolak" :value="counts.rejected" :icon="XCircle" />
      <StatCard label="Total pengajuan" :value="rows?.length ?? 0" :icon="FileText" />
    </div>

    <Card v-if="isAdmin" class="rounded-xl border-border/60 shadow-none">
      <CardHeader class="flex flex-row flex-wrap items-center justify-between gap-3">
        <div>
          <CardTitle class="text-base">Buat pengajuan</CardTitle>
          <p class="mt-0.5 text-sm text-muted-foreground">Admin dapat mengajukan cuti atas nama karyawan.</p>
        </div>
        <Button variant="outline" size="sm" @click="showForm = !showForm">
          {{ showForm ? 'Tutup form' : 'Pengajuan baru' }}
        </Button>
      </CardHeader>
      <CardContent v-if="showForm" class="grid gap-3 border-t pt-3 sm:grid-cols-2">
        <div class="grid gap-1.5 sm:col-span-2">
          <Label>Karyawan</Label>
          <Select v-model="form.employee_id">
            <SelectTrigger><SelectValue placeholder="Pilih karyawan" /></SelectTrigger>
            <SelectContent>
              <SelectItem v-for="emp in employees ?? []" :key="String(emp.id)" :value="String(emp.id)">
                {{ emp.name }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div class="grid gap-1.5">
          <Label>Jenis</Label>
          <Select v-model="form.type">
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="annual">Cuti tahunan</SelectItem>
              <SelectItem value="sick">Sakit</SelectItem>
              <SelectItem value="personal">Izin pribadi</SelectItem>
              <SelectItem value="other">Lainnya</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div class="grid gap-1.5">
          <Label>Alasan (opsional)</Label>
          <Textarea v-model="form.reason" rows="2" placeholder="Contoh: acara keluarga" />
        </div>
        <div class="grid gap-1.5">
          <Label>Tanggal mulai</Label>
          <Input v-model="form.start_date" type="date" />
        </div>
        <div class="grid gap-1.5">
          <Label>Tanggal selesai</Label>
          <Input v-model="form.end_date" type="date" :min="form.start_date" />
        </div>
        <div class="sm:col-span-2">
          <Button size="sm" :disabled="submitting" @click="submitLeave">
            {{ submitting ? 'Mengirim…' : 'Kirim pengajuan' }}
          </Button>
        </div>
      </CardContent>
    </Card>

    <Card class="rounded-xl border-border/60 shadow-none">
      <CardHeader class="flex flex-row flex-wrap items-center justify-between gap-3">
        <div>
          <CardTitle class="text-base">Antrian pengajuan</CardTitle>
          <p class="mt-0.5 text-sm text-muted-foreground">Setujui, tolak, atau catat alfa langsung dari antrian.</p>
        </div>
        <div class="flex flex-wrap gap-2">
          <Button v-if="isAdmin" variant="outline" size="sm" @click="showAlphaForm = !showAlphaForm">
            {{ showAlphaForm ? 'Tutup' : 'Tandai alfa' }}
          </Button>
          <Button variant="outline" size="sm" :disabled="loading" @click="load">Muat ulang</Button>
        </div>
      </CardHeader>
      <CardContent class="space-y-3">
        <div v-if="showAlphaForm && isAdmin" class="grid gap-3 rounded-lg border border-border/60 bg-muted/10 p-4 sm:grid-cols-2">
          <div class="grid gap-1.5 sm:col-span-2">
            <Label>Karyawan</Label>
            <Select v-model="alphaForm.employee_id">
              <SelectTrigger><SelectValue placeholder="Pilih karyawan" /></SelectTrigger>
              <SelectContent>
                <SelectItem v-for="emp in employees ?? []" :key="String(emp.id)" :value="String(emp.id)">
                  {{ emp.name }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div class="grid gap-1.5">
            <Label>Tanggal</Label>
            <Input v-model="alphaForm.date" type="date" />
          </div>
          <div class="grid gap-1.5">
            <Label>Catatan</Label>
            <Input v-model="alphaForm.reason" />
          </div>
          <div class="sm:col-span-2">
            <Button size="sm" :disabled="submitting" @click="submitAlpha">
              {{ submitting ? 'Menyimpan…' : 'Simpan alfa' }}
            </Button>
          </div>
        </div>

        <div class="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
          <div class="grid gap-1.5">
            <Label class="text-xs text-muted-foreground">Status</Label>
            <Select v-model="statusFilter">
              <SelectTrigger class="w-full sm:w-40"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua</SelectItem>
                <SelectItem value="pending">Menunggu</SelectItem>
                <SelectItem value="approved">Disetujui</SelectItem>
                <SelectItem value="rejected">Ditolak</SelectItem>
                <SelectItem value="canceled">Dibatalkan</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div class="grid gap-1.5">
            <Label class="text-xs text-muted-foreground">Jenis</Label>
            <Select v-model="typeFilter">
              <SelectTrigger class="w-full sm:w-40"><SelectValue placeholder="Jenis" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua</SelectItem>
                <SelectItem value="annual">Cuti</SelectItem>
                <SelectItem value="personal">Izin</SelectItem>
                <SelectItem value="sick">Sakit</SelectItem>
                <SelectItem value="other">Lainnya</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <EmptyState
          v-if="filtered.length === 0"
          :icon="CalendarOff"
          title="Tidak ada pengajuan"
          description="Belum ada pengajuan cuti untuk filter yang dipilih. Buat pengajuan baru atau ubah filter."
          compact
        >
          <template v-if="isAdmin" #actions>
            <Button size="sm" @click="showForm = true">Buat pengajuan</Button>
          </template>
        </EmptyState>

        <div v-else class="overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Karyawan</TableHead>
                <TableHead>Jenis</TableHead>
                <TableHead>Periode</TableHead>
                <TableHead>Alasan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead v-if="isAdmin" class="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="row in filtered" :key="String(row.id)">
                <TableCell class="font-medium">{{ employeeName(row) }}</TableCell>
                <TableCell>{{ typeLabel[String(row.type)] ?? row.type }}</TableCell>
                <TableCell class="tabular-nums text-xs">
                  {{ String(row.start_date).slice(0, 10) }} – {{ String(row.end_date).slice(0, 10) }}
                </TableCell>
                <TableCell class="max-w-[200px] truncate text-muted-foreground">
                  {{ row.reason || '—' }}
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{{ statusLabel[String(row.status)] ?? row.status }}</Badge>
                </TableCell>
                <TableCell v-if="isAdmin" class="space-x-1 text-right">
                  <template v-if="row.status === 'pending'">
                    <Button size="sm" variant="outline" @click="review(Number(row.id), 'approved')">
                      Setujui
                    </Button>
                    <Button size="sm" variant="ghost" @click="review(Number(row.id), 'rejected')">
                      Tolak
                    </Button>
                  </template>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  </PageShell>
</template>
