<script setup lang="ts">
import { computed, ref } from 'vue'
import { toast } from 'vue-sonner'

import PageShell from '@/components/app/page-shell.vue'
import TableEmpty from '@/components/app/table-empty.vue'
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
const statusFilter = ref('all')
const showForm = ref(false)
const submitting = ref(false)

const form = ref({
  employee_id: '',
  type: 'annual',
  start_date: '',
  end_date: '',
  reason: '',
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

const filtered = computed(() => {
  const list = rows.value ?? []
  if (statusFilter.value === 'all') return list
  return list.filter((r) => r.status === statusFilter.value)
})

const counts = computed(() => {
  const list = rows.value ?? []
  const c = { pending: 0, approved: 0, rejected: 0, canceled: 0 }
  for (const r of list) {
    const s = String(r.status)
    if (s in c) c[s as keyof typeof c]++
  }
  return c
})

const statusLabel: Record<string, string> = {
  pending: 'Menunggu',
  approved: 'Disetujui',
  rejected: 'Ditolak',
  canceled: 'Dibatalkan',
}

const typeLabel: Record<string, string> = {
  annual: 'Cuti tahunan',
  sick: 'Sakit',
  personal: 'Izin pribadi',
  other: 'Lainnya',
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
  <PageShell title="Pengajuan Cuti" description="Ajukan atau tinjau pengajuan cuti, izin, dan sakit.">
    <Card v-if="isAdmin" class="rounded-xl shadow-none">
      <CardHeader class="flex flex-row flex-wrap items-center justify-between gap-3 px-4 pt-4 pb-2">
        <div>
          <CardTitle class="text-base">Buat pengajuan</CardTitle>
          <p class="mt-0.5 text-sm text-muted-foreground">Admin dapat mengajukan cuti atas nama karyawan.</p>
        </div>
        <Button variant="outline" size="sm" @click="showForm = !showForm">
          {{ showForm ? 'Tutup form' : 'Pengajuan baru' }}
        </Button>
      </CardHeader>
      <CardContent v-if="showForm" class="grid gap-3 px-4 pb-4 sm:grid-cols-2">
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
            {{ submitting ? 'Mengirim...' : 'Kirim pengajuan' }}
          </Button>
        </div>
      </CardContent>
    </Card>

    <Card class="rounded-xl shadow-none">
      <CardHeader class="flex flex-row flex-wrap items-center justify-between gap-3 px-4 pt-4 pb-2">
        <div>
          <CardTitle class="text-base">Antrian pengajuan</CardTitle>
          <p class="mt-0.5 text-sm text-muted-foreground">Filter berdasarkan status pengajuan.</p>
        </div>
        <Button variant="outline" size="sm" :disabled="loading" @click="load">Refresh</Button>
      </CardHeader>
      <CardContent class="space-y-3 px-4 pb-4">
        <div class="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
          <Select v-model="statusFilter">
            <SelectTrigger class="w-full sm:w-40"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua</SelectItem>
              <SelectItem value="pending">Menunggu</SelectItem>
              <SelectItem value="approved">Disetujui</SelectItem>
              <SelectItem value="rejected">Ditolak</SelectItem>
            </SelectContent>
          </Select>
          <p class="text-sm text-muted-foreground sm:ml-auto">
            Pending: {{ counts.pending }} · Approved: {{ counts.approved }} · Rejected: {{ counts.rejected }}
          </p>
        </div>
        <TableEmpty v-if="filtered.length === 0" message="Tidak ada pengajuan untuk filter ini." />
        <Table v-else>
          <TableHeader>
            <TableRow>
              <TableHead>Karyawan</TableHead>
              <TableHead>Jenis</TableHead>
              <TableHead>Periode</TableHead>
              <TableHead>Status</TableHead>
              <TableHead v-if="isAdmin" class="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="row in filtered" :key="String(row.id)">
              <TableCell>{{ (row.employee as { name?: string })?.name ?? `#${row.employee_id}` }}</TableCell>
              <TableCell>{{ typeLabel[String(row.type)] ?? row.type }}</TableCell>
              <TableCell class="text-xs">{{ String(row.start_date).slice(0, 10) }} – {{ String(row.end_date).slice(0, 10) }}</TableCell>
              <TableCell>
                <Badge variant="secondary">{{ statusLabel[String(row.status)] ?? row.status }}</Badge>
              </TableCell>
              <TableCell v-if="isAdmin" class="space-x-1 text-right">
                <template v-if="row.status === 'pending'">
                  <Button size="sm" variant="outline" @click="review(Number(row.id), 'approved')">Setujui</Button>
                  <Button size="sm" variant="ghost" @click="review(Number(row.id), 'rejected')">Tolak</Button>
                </template>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </PageShell>
</template>
