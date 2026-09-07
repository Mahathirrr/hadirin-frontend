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
import { Switch } from '@/components/ui/switch'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useWorkspaceLoader } from '@/composables/useWorkspaceData'
import { api } from '@/lib/api'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const toggling = ref(false)
const enrolling = ref(false)
const showEnroll = ref(false)
const selectedEmployee = ref('')
const photoFile = ref<File | null>(null)
const photoPreview = ref('')

const isAdmin = computed(() =>
  auth.activeMembership?.role === 'owner' || auth.activeMembership?.role === 'admin',
)

const { data: settingsRes, load: reloadSettings } = useWorkspaceLoader(async (token, ws) =>
  api.getWorkspaceSettings(token, ws),
)
const { data: enrollments, load: reloadEnrollments } = useWorkspaceLoader(async (token, ws) =>
  api.listFaceEnrollments(token, ws) as Promise<Array<Record<string, unknown>>>,
)
const { data: employees } = useWorkspaceLoader(async (token, ws) =>
  api.listEmployees(token, ws) as Promise<Array<Record<string, unknown>>>,
)

const faceEnabled = computed(() => settingsRes.value?.data.face_id_enabled ?? false)
const activeCount = computed(() =>
  (enrollments.value ?? []).filter((e) => e.status === 'active').length,
)

function onPhotoChange(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  photoFile.value = file ?? null
  if (photoPreview.value) URL.revokeObjectURL(photoPreview.value)
  photoPreview.value = file ? URL.createObjectURL(file) : ''
}

async function toggleFaceId(enabled: boolean) {
  if (!auth.token || !auth.workspaceId || !isAdmin.value) return
  toggling.value = true
  try {
    await api.updateWorkspaceSettings(auth.token, auth.workspaceId, { face_id_enabled: enabled })
    toast.success(enabled ? 'Face ID diaktifkan' : 'Face ID dinonaktifkan')
    await reloadSettings()
  } catch (e) {
    toast.error(e instanceof Error ? e.message : 'Gagal menyimpan pengaturan')
  } finally {
    toggling.value = false
  }
}

async function submitEnrollment() {
  if (!auth.token || !auth.workspaceId || !selectedEmployee.value || !photoFile.value) {
    toast.error('Pilih karyawan dan foto wajah')
    return
  }
  enrolling.value = true
  try {
    await api.createFaceEnrollment(
      auth.token,
      auth.workspaceId,
      Number(selectedEmployee.value),
      photoFile.value,
    )
    toast.success('Enrollment berhasil')
    selectedEmployee.value = ''
    photoFile.value = null
    if (photoPreview.value) URL.revokeObjectURL(photoPreview.value)
    photoPreview.value = ''
    showEnroll.value = false
    await reloadEnrollments()
  } catch (e) {
    toast.error(e instanceof Error ? e.message : 'Gagal enrollment')
  } finally {
    enrolling.value = false
  }
}

async function refreshAll() {
  await Promise.all([reloadSettings(), reloadEnrollments()])
}
</script>

<template>
  <PageShell title="Face ID" description="Enrollment wajah karyawan untuk verifikasi absensi.">
    <Card class="rounded-xl shadow-none">
      <CardHeader class="flex flex-row flex-wrap items-center justify-between gap-3 px-4 pt-4 pb-2">
        <div>
          <CardTitle class="text-base">Pengaturan Face ID</CardTitle>
          <p class="mt-0.5 text-sm text-muted-foreground">Engine lokal (hash template) — gratis & auditable.</p>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-sm">{{ faceEnabled ? 'Aktif' : 'Nonaktif' }}</span>
          <Switch
            :model-value="faceEnabled"
            :disabled="!isAdmin || toggling"
            @update:model-value="toggleFaceId"
          />
        </div>
      </CardHeader>
      <CardContent class="grid gap-3 px-4 pb-4 sm:grid-cols-3">
        <div class="rounded-lg border p-3">
          <p class="text-xs text-muted-foreground">Enrollment aktif</p>
          <p class="mt-1 text-2xl font-bold">{{ activeCount }}</p>
        </div>
        <div class="rounded-lg border p-3">
          <p class="text-xs text-muted-foreground">Engine</p>
          <p class="mt-1 text-lg font-medium">{{ settingsRes?.data.face_engine ?? 'local' }}</p>
        </div>
        <div class="flex items-end gap-2">
          <Button variant="outline" size="sm" @click="refreshAll">Refresh</Button>
          <Button v-if="isAdmin && faceEnabled" size="sm" @click="showEnroll = !showEnroll">
            {{ showEnroll ? 'Tutup' : 'Enrollment baru' }}
          </Button>
        </div>
      </CardContent>
    </Card>

    <Card v-if="showEnroll && isAdmin && faceEnabled" class="rounded-xl shadow-none">
      <CardHeader class="px-4 pt-4 pb-2">
        <CardTitle class="text-base">Enrollment wajah baru</CardTitle>
        <p class="text-sm text-muted-foreground">Gunakan foto frontal dengan pencahayaan cukup. Di HP bisa langsung ambil dari kamera.</p>
      </CardHeader>
      <CardContent class="grid gap-3 px-4 pb-4 sm:grid-cols-2">
        <div class="grid gap-1.5">
          <Label>Karyawan</Label>
          <Select v-model="selectedEmployee">
            <SelectTrigger><SelectValue placeholder="Pilih karyawan" /></SelectTrigger>
            <SelectContent>
              <SelectItem v-for="emp in employees ?? []" :key="String(emp.id)" :value="String(emp.id)">
                {{ emp.name }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div class="grid gap-1.5">
          <Label>Foto wajah</Label>
          <Input type="file" accept="image/*" capture="user" @change="onPhotoChange" />
        </div>
        <div v-if="photoPreview" class="sm:col-span-2">
          <img :src="photoPreview" alt="Preview wajah" class="max-h-48 rounded-lg border object-cover" />
        </div>
        <div class="sm:col-span-2">
          <Button size="sm" :disabled="enrolling" @click="submitEnrollment">
            {{ enrolling ? 'Mengunggah...' : 'Simpan enrollment' }}
          </Button>
        </div>
      </CardContent>
    </Card>

    <Card class="rounded-xl shadow-none">
      <CardHeader class="px-4 pt-4 pb-2">
        <CardTitle class="text-base">Daftar enrollment</CardTitle>
      </CardHeader>
      <CardContent class="px-4 pb-4">
        <TableEmpty v-if="(enrollments?.length ?? 0) === 0" message="Belum ada enrollment. Aktifkan Face ID lalu tambah enrollment baru." />
        <Table v-else>
          <TableHeader>
            <TableRow>
              <TableHead>Karyawan</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Sync</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="row in enrollments" :key="String(row.id)">
              <TableCell>{{ (row.employee as { name?: string })?.name ?? `#${row.employee_id}` }}</TableCell>
              <TableCell><Badge variant="secondary">{{ row.status }}</Badge></TableCell>
              <TableCell>{{ row.sync_status }}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </PageShell>
</template>
