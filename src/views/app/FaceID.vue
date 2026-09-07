<script setup lang="ts">
import { computed, ref } from 'vue'
import { Fingerprint, ScanFace, ShieldCheck, Users } from 'lucide-vue-next'
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
import { Switch } from '@/components/ui/switch'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useWorkspaceLoader } from '@/composables/useWorkspaceData'
import { api } from '@/lib/api'
import { createPasskey } from '@/lib/passkey'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const toggling = ref(false)
const enrolling = ref(false)
const registeringPasskey = ref(false)
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
const { data: passkeys, load: reloadPasskeys } = useWorkspaceLoader(async (token, ws) =>
  api.listPasskeys(token, ws) as Promise<Array<Record<string, unknown>>>,
)
const { data: employees } = useWorkspaceLoader(async (token, ws) =>
  api.listEmployees(token, ws) as Promise<Array<Record<string, unknown>>>,
)

const faceEnabled = computed(() => settingsRes.value?.data.face_id_enabled ?? false)
const passkeyEnabled = computed(() => settingsRes.value?.data.passkey_fallback_enabled ?? false)
const activeCount = computed(() =>
  (enrollments.value ?? []).filter((e) => e.status === 'active').length,
)
const pendingCount = computed(() =>
  (enrollments.value ?? []).filter((e) => e.status !== 'active').length,
)

function onPhotoChange(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  photoFile.value = file ?? null
  if (photoPreview.value) URL.revokeObjectURL(photoPreview.value)
  photoPreview.value = file ? URL.createObjectURL(file) : ''
}

async function updateSettings(patch: Record<string, unknown>) {
  if (!auth.token || !auth.workspaceId || !isAdmin.value) return
  toggling.value = true
  try {
    await api.updateWorkspaceSettings(auth.token, auth.workspaceId, patch)
    await reloadSettings()
  } catch (e) {
    toast.error(e instanceof Error ? e.message : 'Gagal menyimpan pengaturan')
  } finally {
    toggling.value = false
  }
}

async function toggleFaceId(enabled: boolean) {
  await updateSettings({ face_id_enabled: enabled })
  toast.success(enabled ? 'Face ID diaktifkan' : 'Face ID dinonaktifkan')
}

async function togglePasskey(enabled: boolean) {
  await updateSettings({ passkey_fallback_enabled: enabled })
  toast.success(enabled ? 'Fallback passkey diaktifkan' : 'Fallback passkey dinonaktifkan')
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

async function revokeEnrollment(id: number) {
  if (!auth.token || !isAdmin.value || !window.confirm('Cabut enrollment wajah ini?')) return
  try {
    await api.deleteFaceEnrollment(auth.token, id)
    toast.success('Enrollment dicabut')
    await reloadEnrollments()
  } catch (e) {
    toast.error(e instanceof Error ? e.message : 'Gagal mencabut enrollment')
  }
}

async function registerPasskey() {
  if (!auth.token || !auth.workspaceId || !passkeyEnabled.value) return
  registeringPasskey.value = true
  try {
    const begin = await api.beginPasskeyRegistration(auth.token, auth.workspaceId, 'Device utama')
    const credential = await createPasskey(begin.options)
    await api.finishPasskeyRegistration(auth.token, auth.workspaceId, credential, 'Device utama')
    toast.success('Passkey berhasil didaftarkan')
    await reloadPasskeys()
  } catch (e) {
    toast.error(e instanceof Error ? e.message : 'Gagal mendaftarkan passkey')
  } finally {
    registeringPasskey.value = false
  }
}

async function removePasskey(id: number) {
  if (!auth.token || !window.confirm('Hapus passkey ini?')) return
  try {
    await api.deletePasskey(auth.token, id)
    toast.success('Passkey dihapus')
    await reloadPasskeys()
  } catch (e) {
    toast.error(e instanceof Error ? e.message : 'Gagal menghapus passkey')
  }
}

async function refreshAll() {
  await Promise.all([reloadSettings(), reloadEnrollments(), reloadPasskeys()])
}
</script>

<template>
  <PageShell title="Face ID" description="Enrollment wajah karyawan untuk verifikasi absensi workspace.">
    <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard label="Enrollment aktif" :value="activeCount" :icon="ScanFace" />
      <StatCard label="Perlu tindak lanjut" :value="pendingCount" :icon="ShieldCheck" />
      <StatCard label="Karyawan" :value="employees?.length ?? 0" :icon="Users" />
      <StatCard
        label="Engine"
        :value="settingsRes?.data.face_engine ?? 'local'"
        :icon="Fingerprint"
        hint="Template hash lokal"
      />
    </div>

    <Card class="rounded-xl border-border/60 shadow-none">
      <CardHeader class="flex flex-row flex-wrap items-center justify-between gap-3">
        <div>
          <CardTitle class="text-base">Pengaturan Face ID</CardTitle>
          <p class="mt-0.5 text-sm text-muted-foreground">
            Aktifkan verifikasi wajah dan kelola enrollment karyawan.
          </p>
        </div>
        <Button variant="outline" size="sm" @click="refreshAll">Refresh</Button>
      </CardHeader>
      <CardContent class="grid gap-4 sm:grid-cols-2">
        <div class="flex items-center justify-between rounded-lg border border-border/60 px-3 py-2.5">
          <div>
            <p class="text-sm font-medium">Face ID</p>
            <p class="text-xs text-muted-foreground">{{ faceEnabled ? 'Aktif' : 'Nonaktif' }}</p>
          </div>
          <Switch
            :model-value="faceEnabled"
            :disabled="!isAdmin || toggling"
            @update:model-value="toggleFaceId"
          />
        </div>
        <div class="flex items-center justify-between rounded-lg border border-border/60 px-3 py-2.5">
          <div>
            <p class="text-sm font-medium">Fallback passkey</p>
            <p class="text-xs text-muted-foreground">Cadangan jika verifikasi wajah gagal</p>
          </div>
          <Switch
            :model-value="passkeyEnabled"
            :disabled="!isAdmin || toggling || !faceEnabled"
            @update:model-value="togglePasskey"
          />
        </div>
        <div v-if="isAdmin && faceEnabled" class="sm:col-span-2 flex flex-wrap gap-2">
          <Button size="sm" @click="showEnroll = !showEnroll">
            {{ showEnroll ? 'Tutup form enrollment' : 'Enrollment baru' }}
          </Button>
          <Button
            v-if="passkeyEnabled"
            size="sm"
            variant="outline"
            :disabled="registeringPasskey"
            @click="registerPasskey"
          >
            {{ registeringPasskey ? 'Mendaftarkan…' : 'Daftarkan passkey' }}
          </Button>
        </div>
      </CardContent>
    </Card>

    <Card v-if="showEnroll && isAdmin && faceEnabled" class="rounded-xl border-border/60 shadow-none">
      <CardHeader>
        <CardTitle class="text-base">Enrollment wajah baru</CardTitle>
        <p class="text-sm text-muted-foreground">Foto frontal dengan pencahayaan cukup.</p>
      </CardHeader>
      <CardContent class="grid gap-3 sm:grid-cols-2">
        <div class="grid gap-1.5 sm:col-span-2">
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
        <div class="grid gap-1.5 sm:col-span-2">
          <Label>Foto wajah</Label>
          <Input type="file" accept="image/*" capture="user" @change="onPhotoChange" />
        </div>
        <div v-if="photoPreview" class="sm:col-span-2">
          <img :src="photoPreview" alt="Preview wajah" class="max-h-48 rounded-lg border object-cover" />
        </div>
        <div class="sm:col-span-2">
          <Button size="sm" :disabled="enrolling" @click="submitEnrollment">
            {{ enrolling ? 'Mengunggah…' : 'Simpan enrollment' }}
          </Button>
        </div>
      </CardContent>
    </Card>

    <Card class="rounded-xl border-border/60 shadow-none">
      <CardHeader>
        <CardTitle class="text-base">Daftar enrollment karyawan</CardTitle>
      </CardHeader>
      <CardContent>
        <EmptyState
          v-if="(enrollments?.length ?? 0) === 0"
          :icon="ScanFace"
          title="Belum ada enrollment"
          description="Aktifkan Face ID lalu tambahkan enrollment untuk karyawan yang akan verifikasi wajah."
          compact
        >
          <template v-if="isAdmin && faceEnabled" #actions>
            <Button size="sm" @click="showEnroll = true">Tambah enrollment</Button>
          </template>
        </EmptyState>
        <div v-else class="overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Karyawan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Sync</TableHead>
                <TableHead>Waktu</TableHead>
                <TableHead v-if="isAdmin" class="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="row in enrollments" :key="String(row.id)">
                <TableCell class="font-medium">
                  {{ (row.employee as { name?: string })?.name ?? `#${row.employee_id}` }}
                </TableCell>
                <TableCell><Badge variant="secondary">{{ row.status }}</Badge></TableCell>
                <TableCell>{{ row.sync_status }}</TableCell>
                <TableCell class="tabular-nums text-xs text-muted-foreground">
                  {{ String(row.created_at ?? '').slice(0, 16).replace('T', ' ') }}
                </TableCell>
                <TableCell v-if="isAdmin" class="text-right">
                  <Button variant="ghost" size="sm" @click="revokeEnrollment(Number(row.id))">
                    Cabut
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>

    <Card v-if="passkeyEnabled" class="rounded-xl border-border/60 shadow-none">
      <CardHeader>
        <CardTitle class="text-base">Passkey terdaftar</CardTitle>
        <p class="text-sm text-muted-foreground">WebAuthn passkey sebagai fallback verifikasi absensi.</p>
      </CardHeader>
      <CardContent>
        <EmptyState
          v-if="(passkeys?.length ?? 0) === 0"
          :icon="Fingerprint"
          title="Belum ada passkey"
          description="Daftarkan passkey perangkat untuk fallback saat verifikasi wajah gagal."
          compact
        >
          <template #actions>
            <Button size="sm" :disabled="registeringPasskey" @click="registerPasskey">
              Daftarkan passkey
            </Button>
          </template>
        </EmptyState>
        <div v-else class="space-y-2">
          <div
            v-for="key in passkeys"
            :key="String(key.id)"
            class="flex items-center justify-between rounded-lg border border-border/60 px-3 py-2"
          >
            <div>
              <p class="text-sm font-medium">{{ key.label || 'Passkey' }}</p>
              <p class="text-xs text-muted-foreground">ID {{ String(key.credential_id ?? '').slice(0, 12) }}…</p>
            </div>
            <Button variant="ghost" size="sm" @click="removePasskey(Number(key.id))">Hapus</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  </PageShell>
</template>
