<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { AlertTriangle, CheckCircle2, Clock, Users } from 'lucide-vue-next'
import { toast } from 'vue-sonner'

import EmptyState from '@/components/app/empty-state.vue'
import PageShell from '@/components/app/page-shell.vue'
import StatCard from '@/components/app/stat-card.vue'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useWorkspaceLoader } from '@/composables/useWorkspaceData'
import { api } from '@/lib/api'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const activeDate = ref(new Date().toISOString().slice(0, 10))
const searchQuery = ref('')
const showAdd = ref(false)
const newName = ref('')
const newEmail = ref('')
const newDepartment = ref('')

const isAdmin = computed(() =>
  auth.activeMembership?.role === 'owner' || auth.activeMembership?.role === 'admin',
)

const { data: employees, load: reloadEmployees } = useWorkspaceLoader(async (token, ws) =>
  api.listEmployees(token, ws) as Promise<Array<Record<string, unknown>>>,
)

const { data: attendance, loading, load: reloadAttendance } = useWorkspaceLoader(async (token, ws) =>
  api.listAttendance(token, ws, activeDate.value) as Promise<Array<Record<string, unknown>>>,
)

watch(activeDate, () => { void reloadAttendance() })

const roleLabel = computed(() => auth.activeMembership?.role ?? 'member')

const attendanceByEmployee = computed(() => {
  const map = new Map<number, Record<string, unknown>>()
  for (const row of attendance.value ?? []) {
    map.set(Number(row.employee_id), row)
  }
  return map
})

const filtered = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  let emps = employees.value ?? []
  if (q) emps = emps.filter((e) => String(e.name ?? '').toLowerCase().includes(q))
  return emps
})

const stats = computed(() => {
  const total = (employees.value ?? []).length
  const rows = attendance.value ?? []
  const checkedIn = rows.filter((r) => r.check_in).length
  const checkedOut = rows.filter((r) => r.check_out).length
  const pending = Math.max(0, total - checkedIn)
  return { total, checkedIn, checkedOut, pending }
})

function formatTime(value: unknown) {
  if (!value) return '—'
  return String(value).slice(11, 16)
}

function employeeName(row: Record<string, unknown>) {
  return (row.employee as { name?: string })?.name ?? `#${row.employee_id}`
}

async function addEmployee() {
  if (!auth.token || !auth.workspaceId || !newName.value.trim()) return
  try {
    await api.createEmployee(auth.token, auth.workspaceId, {
      name: newName.value.trim(),
      email: newEmail.value.trim(),
      department: newDepartment.value.trim(),
      status: 'active',
    })
    toast.success('Karyawan ditambahkan')
    newName.value = ''
    newEmail.value = ''
    newDepartment.value = ''
    showAdd.value = false
    await reloadEmployees()
  } catch (e) {
    toast.error(e instanceof Error ? e.message : 'Gagal menambah karyawan')
  }
}

async function removeEmployee(id: number) {
  if (!auth.token || !isAdmin.value) return
  if (!window.confirm('Hapus karyawan ini?')) return
  try {
    await api.deleteEmployee(auth.token, id)
    toast.success('Karyawan dihapus')
    await reloadEmployees()
    await reloadAttendance()
  } catch (e) {
    toast.error(e instanceof Error ? e.message : 'Gagal menghapus karyawan')
  }
}

async function checkInEmployee(employeeId: number) {
  if (!auth.token || !auth.workspaceId || !isAdmin.value) return
  try {
    await api.createAttendance(auth.token, auth.workspaceId, { employee_id: employeeId })
    toast.success('Check-in berhasil')
    await reloadAttendance()
  } catch (e) {
    toast.error(e instanceof Error ? e.message : 'Gagal check-in')
  }
}

async function checkOutEmployee(employeeId: number) {
  if (!auth.token || !isAdmin.value) return
  const record = attendanceByEmployee.value.get(employeeId)
  if (!record?.id) return
  try {
    await api.patchAttendance(auth.token, Number(record.id), {
      check_out: new Date().toISOString(),
    })
    toast.success('Check-out berhasil')
    await reloadAttendance()
  } catch (e) {
    toast.error(e instanceof Error ? e.message : 'Gagal check-out')
  }
}

async function refreshAll() {
  await Promise.all([reloadEmployees(), reloadAttendance()])
}
</script>

<template>
  <PageShell
    title="Review Absensi Karyawan"
    description="Tinjau kehadiran harian per karyawan dan kelola data karyawan workspace."
  >
    <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard label="Total karyawan" :value="stats.total" :icon="Users" />
      <StatCard label="Sudah check-in" :value="stats.checkedIn" :icon="CheckCircle2" />
      <StatCard label="Sudah check-out" :value="stats.checkedOut" :icon="Clock" />
      <StatCard label="Belum check-in" :value="stats.pending" :icon="AlertTriangle" hint="Perlu ditindaklanjuti" />
    </div>

    <Card class="rounded-xl border-border/60 shadow-none">
      <CardHeader class="flex flex-row flex-wrap items-center justify-between gap-3">
        <div>
          <CardTitle class="text-base">Filter review harian</CardTitle>
          <p class="mt-0.5 text-sm text-muted-foreground">
            Role: {{ roleLabel }} · Data live tanggal {{ activeDate }}
          </p>
        </div>
        <div class="flex flex-wrap items-end gap-2">
          <div class="grid gap-1">
            <Label class="text-xs text-muted-foreground">Tanggal</Label>
            <Input v-model="activeDate" type="date" class="w-40" />
          </div>
          <Button variant="outline" size="sm" :disabled="loading" @click="refreshAll">Refresh</Button>
        </div>
      </CardHeader>
      <CardContent class="space-y-3">
        <Input v-model="searchQuery" placeholder="Cari nama karyawan…" />
      </CardContent>
    </Card>

    <Card class="rounded-xl border-border/60 shadow-none">
      <CardHeader class="flex flex-row flex-wrap items-center justify-between gap-3">
        <CardTitle class="text-base">Daftar karyawan & absensi</CardTitle>
        <Button v-if="isAdmin" size="sm" @click="showAdd = !showAdd">
          {{ showAdd ? 'Tutup' : 'Tambah karyawan' }}
        </Button>
      </CardHeader>
      <CardContent class="space-y-3">
        <div v-if="showAdd && isAdmin" class="grid gap-3 rounded-lg border border-border/60 bg-muted/10 p-3 md:grid-cols-4">
          <div class="grid gap-1.5">
            <Label>Nama</Label>
            <Input v-model="newName" placeholder="Nama lengkap" />
          </div>
          <div class="grid gap-1.5">
            <Label>Email</Label>
            <Input v-model="newEmail" type="email" placeholder="opsional" />
          </div>
          <div class="grid gap-1.5">
            <Label>Departemen</Label>
            <Input v-model="newDepartment" placeholder="opsional" />
          </div>
          <div class="flex items-end">
            <Button class="w-full" @click="addEmployee">Simpan</Button>
          </div>
        </div>

        <EmptyState
          v-if="filtered.length === 0"
          :icon="Users"
          title="Belum ada karyawan"
          description="Tambahkan karyawan pertama untuk mulai mencatat absensi harian."
          compact
        >
          <template v-if="isAdmin" #actions>
            <Button size="sm" @click="showAdd = true">Tambah karyawan</Button>
          </template>
        </EmptyState>

        <div v-else class="overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>Departemen</TableHead>
                <TableHead>Check-in</TableHead>
                <TableHead>Check-out</TableHead>
                <TableHead>Status</TableHead>
                <TableHead v-if="isAdmin" class="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="emp in filtered" :key="String(emp.id)">
                <TableCell class="font-medium">{{ emp.name }}</TableCell>
                <TableCell class="text-muted-foreground">{{ emp.department || '—' }}</TableCell>
                <TableCell class="tabular-nums">
                  {{ formatTime(attendanceByEmployee.get(Number(emp.id))?.check_in) }}
                </TableCell>
                <TableCell class="tabular-nums">
                  {{ formatTime(attendanceByEmployee.get(Number(emp.id))?.check_out) }}
                </TableCell>
                <TableCell>
                  <Badge
                    v-if="attendanceByEmployee.has(Number(emp.id))"
                    variant="secondary"
                  >
                    {{ attendanceByEmployee.get(Number(emp.id))?.status ?? 'hadir' }}
                  </Badge>
                  <Badge v-else variant="outline">Belum absen</Badge>
                </TableCell>
                <TableCell v-if="isAdmin" class="text-right">
                  <div class="flex justify-end gap-1">
                    <Button
                      v-if="!attendanceByEmployee.has(Number(emp.id))"
                      variant="outline"
                      size="sm"
                      @click="checkInEmployee(Number(emp.id))"
                    >
                      Check-in
                    </Button>
                    <Button
                      v-else-if="!attendanceByEmployee.get(Number(emp.id))?.check_out"
                      variant="outline"
                      size="sm"
                      @click="checkOutEmployee(Number(emp.id))"
                    >
                      Check-out
                    </Button>
                    <Button variant="ghost" size="sm" @click="removeEmployee(Number(emp.id))">
                      Hapus
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  </PageShell>
</template>
