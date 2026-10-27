<script setup lang="ts">
import { computed, ref } from 'vue'
import { CalendarRange, Plus, Trash2 } from 'lucide-vue-next'
import { toast } from 'vue-sonner'

import EmptyState from '@/components/app/empty-state.vue'
import PageShell from '@/components/app/page-shell.vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useEmployeeAccess } from '@/composables/useEmployeeAccess'
import { useWorkspaceLoader } from '@/composables/useWorkspaceData'
import { api } from '@/lib/api'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const { isManager } = useEmployeeAccess()
const shiftForm = ref({ name: '', start_time: '08:00', end_time: '17:00', days_of_week: '1,2,3,4,5' })
const assignForm = ref({ employee_id: '', shift_id: '', effective_from: new Date().toISOString().slice(0, 10) })
const saving = ref(false)

const { data: shifts, loading: loadingShifts, load: reloadShifts } = useWorkspaceLoader(async (token, ws) =>
  api.listWorkShifts(token, ws) as Promise<Array<Record<string, unknown>>>,
)
const { data: roster, loading: loadingRoster, load: reloadRoster } = useWorkspaceLoader(async (token, ws) =>
  api.listEmployeeShifts(token, ws) as Promise<Array<Record<string, unknown>>>,
)
const { data: employees } = useWorkspaceLoader(async (token, ws) =>
  api.listEmployees(token, ws) as Promise<Array<Record<string, unknown>>>,
)

const isAdmin = isManager
const busy = computed(() => loadingShifts.value || loadingRoster.value)

async function createShift() {
  if (!auth.token || !auth.workspaceId || !shiftForm.value.name.trim()) return
  saving.value = true
  try {
    await api.createWorkShift(auth.token, auth.workspaceId, shiftForm.value)
    toast.success('Shift dibuat')
    shiftForm.value.name = ''
    await reloadShifts()
  } catch (e) {
    toast.error(e instanceof Error ? e.message : 'Gagal membuat shift')
  } finally {
    saving.value = false
  }
}

async function assignShift() {
  if (!auth.token || !auth.workspaceId) return
  if (!assignForm.value.employee_id || !assignForm.value.shift_id) {
    toast.error('Pilih karyawan dan shift')
    return
  }
  saving.value = true
  try {
    await api.assignEmployeeShift(auth.token, auth.workspaceId, {
      employee_id: Number(assignForm.value.employee_id),
      shift_id: Number(assignForm.value.shift_id),
      effective_from: `${assignForm.value.effective_from}T00:00:00Z`,
    })
    toast.success('Roster diperbarui')
    assignForm.value.employee_id = ''
    await reloadRoster()
  } catch (e) {
    toast.error(e instanceof Error ? e.message : 'Gagal assign shift')
  } finally {
    saving.value = false
  }
}

async function removeShift(id: number) {
  if (!auth.token || !auth.workspaceId) return
  try {
    await api.deleteWorkShift(auth.token, auth.workspaceId, id)
    await reloadShifts()
    await reloadRoster()
  } catch (e) {
    toast.error(e instanceof Error ? e.message : 'Gagal menghapus shift')
  }
}

function rosterEmployeeName(r: Record<string, unknown>) {
  return (r.employee as { name?: string } | undefined)?.name ?? String(r.employee_id)
}

function rosterShiftName(r: Record<string, unknown>) {
  return (r.shift as { name?: string } | undefined)?.name ?? String(r.shift_id)
}

async function removeAssignment(id: number) {
  if (!auth.token || !auth.workspaceId) return
  try {
    await api.deleteEmployeeShift(auth.token, auth.workspaceId, id)
    await reloadRoster()
  } catch (e) {
    toast.error(e instanceof Error ? e.message : 'Gagal menghapus assignment')
  }
}
</script>

<template>
  <PageShell
    title="Shift & Roster"
    description="Kelola jam kerja shift dan penugasan karyawan per periode."
  >
    <div v-if="!isAdmin" class="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
      Hanya admin perusahaan yang dapat mengelola shift dan roster.
    </div>

    <div v-else class="grid gap-4 lg:grid-cols-2">
      <Card class="rounded-xl border-border/60 shadow-none">
        <CardHeader>
          <CardTitle class="flex items-center gap-2 text-base">
            <CalendarRange class="size-4" />
            Daftar shift
          </CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="grid gap-2 sm:grid-cols-2">
            <div class="grid gap-1.5 sm:col-span-2">
              <Label>Nama shift</Label>
              <Input v-model="shiftForm.name" placeholder="Reguler HQ" />
            </div>
            <div class="grid gap-1.5">
              <Label>Mulai</Label>
              <Input v-model="shiftForm.start_time" type="time" />
            </div>
            <div class="grid gap-1.5">
              <Label>Selesai</Label>
              <Input v-model="shiftForm.end_time" type="time" />
            </div>
            <div class="grid gap-1.5 sm:col-span-2">
              <Label>Hari (1=Sen … 7=Min)</Label>
              <Input v-model="shiftForm.days_of_week" />
            </div>
          </div>
          <Button size="sm" :disabled="saving" @click="createShift">
            <Plus class="mr-1 size-4" />
            Tambah shift
          </Button>
          <EmptyState v-if="!busy && !(shifts?.length)" title="Belum ada shift" compact />
          <Table v-else>
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>Jam</TableHead>
                <TableHead class="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="s in shifts ?? []" :key="String(s.id)">
                <TableCell>{{ s.name }}</TableCell>
                <TableCell>{{ s.start_time }} - {{ s.end_time }}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" class="size-8" @click="removeShift(Number(s.id))">
                    <Trash2 class="size-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card class="rounded-xl border-border/60 shadow-none">
        <CardHeader>
          <CardTitle class="text-base">Roster karyawan</CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="grid gap-2">
            <Label>Karyawan</Label>
            <Select v-model="assignForm.employee_id">
              <SelectTrigger><SelectValue placeholder="Pilih karyawan" /></SelectTrigger>
              <SelectContent>
                <SelectItem v-for="e in employees ?? []" :key="String(e.id)" :value="String(e.id)">
                  {{ e.name }}
                </SelectItem>
              </SelectContent>
            </Select>
            <Label>Shift</Label>
            <Select v-model="assignForm.shift_id">
              <SelectTrigger><SelectValue placeholder="Pilih shift" /></SelectTrigger>
              <SelectContent>
                <SelectItem v-for="s in shifts ?? []" :key="String(s.id)" :value="String(s.id)">
                  {{ s.name }}
                </SelectItem>
              </SelectContent>
            </Select>
            <Label>Berlaku dari</Label>
            <Input v-model="assignForm.effective_from" type="date" />
          </div>
          <Button size="sm" :disabled="saving" @click="assignShift">Assign</Button>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Karyawan</TableHead>
                <TableHead>Shift</TableHead>
                <TableHead class="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="r in roster ?? []" :key="String(r.id)">
                <TableCell>{{ rosterEmployeeName(r) }}</TableCell>
                <TableCell>{{ rosterShiftName(r) }}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" class="size-8" @click="removeAssignment(Number(r.id))">
                    <Trash2 class="size-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  </PageShell>
</template>
