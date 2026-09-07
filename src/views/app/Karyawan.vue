<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { toast } from 'vue-sonner'

import PageShell from '@/components/app/page-shell.vue'
import TableEmpty from '@/components/app/table-empty.vue'
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

const { data: employees, load: reloadEmployees } = useWorkspaceLoader(async (token, ws) =>
  api.listEmployees(token, ws) as Promise<Array<Record<string, unknown>>>,
)

const { data: attendance, load: reloadAttendance } = useWorkspaceLoader(async (token, ws) =>
  api.listAttendance(token, ws, activeDate.value) as Promise<Array<Record<string, unknown>>>,
)

watch(activeDate, () => { void reloadAttendance() })

const roleLabel = computed(() => auth.activeMembership?.role ?? 'member')

const filtered = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  const emps = employees.value ?? []
  if (!q) return emps
  return emps.filter((e) => String(e.name ?? '').toLowerCase().includes(q))
})

const stats = computed(() => {
  const rows = attendance.value ?? []
  const checkedIn = rows.length
  const checkedOut = rows.filter((r) => r.check_out).length
  const total = (employees.value ?? []).length
  return { total, checkedIn, checkedOut, pending: Math.max(0, total - checkedIn) }
})

async function addEmployee() {
  if (!auth.token || !auth.workspaceId || !newName.value.trim()) return
  try {
    await api.createEmployee(auth.token, auth.workspaceId, {
      name: newName.value.trim(),
      email: newEmail.value.trim(),
      status: 'active',
    })
    toast.success('Karyawan ditambahkan')
    newName.value = ''
    newEmail.value = ''
    showAdd.value = false
    await reloadEmployees()
  } catch (e) {
    toast.error(e instanceof Error ? e.message : 'Gagal menambah karyawan')
  }
}
</script>

<template>
  <PageShell title="Review Absensi Karyawan" description="Mulai dari pengecualian, lalu koreksi seperlunya.">
    <Card class="rounded-xl shadow-none">
      <CardHeader class="flex flex-row flex-wrap items-start justify-between gap-3 px-4 pt-4 pb-2">
        <div>
          <CardTitle class="text-base">Ringkasan workspace</CardTitle>
          <p class="mt-1 text-sm text-muted-foreground">Data live dari absensi tanggal {{ activeDate }}.</p>
        </div>
        <div class="text-right text-sm text-muted-foreground">
          <p>Role: <span class="font-medium text-foreground">{{ roleLabel }}</span></p>
        </div>
      </CardHeader>
      <CardContent class="px-4 pb-4">
        <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div class="rounded-lg border p-3">
            <p class="text-xs text-muted-foreground">Total karyawan</p>
            <p class="mt-1 text-2xl font-bold">{{ stats.total }}</p>
          </div>
          <div class="rounded-lg border p-3">
            <p class="text-xs text-muted-foreground">Sudah check-in</p>
            <p class="mt-1 text-2xl font-bold">{{ stats.checkedIn }}</p>
          </div>
          <div class="rounded-lg border p-3">
            <p class="text-xs text-muted-foreground">Sudah check-out</p>
            <p class="mt-1 text-2xl font-bold">{{ stats.checkedOut }}</p>
          </div>
          <div class="rounded-lg border border-amber-200 bg-amber-50/50 p-3">
            <p class="text-xs text-amber-800">Belum check-in</p>
            <p class="mt-1 text-2xl font-bold">{{ stats.pending }}</p>
          </div>
        </div>
      </CardContent>
    </Card>

    <Card class="rounded-xl shadow-none">
      <CardHeader class="flex flex-row flex-wrap items-center justify-between gap-3 px-4 pt-4 pb-2">
        <CardTitle class="text-base">Daftar karyawan</CardTitle>
        <Button size="sm" @click="showAdd = !showAdd">Tambah karyawan</Button>
      </CardHeader>
      <CardContent class="space-y-3 px-4 pb-4">
        <div v-if="showAdd" class="grid gap-3 rounded-lg border bg-muted/20 p-3 md:grid-cols-3">
          <div class="grid gap-1.5">
            <Label>Nama</Label>
            <Input v-model="newName" placeholder="Nama lengkap" />
          </div>
          <div class="grid gap-1.5">
            <Label>Email (opsional)</Label>
            <Input v-model="newEmail" type="email" placeholder="email@perusahaan.id" />
          </div>
          <div class="flex items-end">
            <Button class="w-full" @click="addEmployee">Simpan</Button>
          </div>
        </div>
        <Input v-model="searchQuery" placeholder="Cari nama karyawan..." />
        <TableEmpty v-if="filtered.length === 0" message="Belum ada karyawan. Tambahkan karyawan pertama." />
        <Table v-else>
          <TableHeader>
            <TableRow>
              <TableHead>Nama</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Departemen</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="emp in filtered" :key="String(emp.id)">
              <TableCell>{{ emp.name }}</TableCell>
              <TableCell>{{ emp.email || '—' }}</TableCell>
              <TableCell>{{ emp.department || '—' }}</TableCell>
              <TableCell>
                <Badge variant="secondary">{{ emp.status || 'active' }}</Badge>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </PageShell>
</template>
