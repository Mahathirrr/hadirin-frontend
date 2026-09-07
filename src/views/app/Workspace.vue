<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'

import PageShell from '@/components/app/page-shell.vue'
import TableEmpty from '@/components/app/table-empty.vue'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { api, type DashboardSummary, type Workspace, type WorkspaceMember } from '@/lib/api'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()

const loading = ref(true)
const savingName = ref(false)
const savingSchedule = ref(false)
const deleting = ref(false)

const inviteCode = ref('')
const workspaceName = ref('')
const workspace = ref<Workspace | null>(null)
const members = ref<WorkspaceMember[]>([])
const summary = ref<DashboardSummary | null>(null)
const workStart = ref('08:00')
const workEnd = ref('17:00')
const lateThreshold = ref(15)

const isAdmin = computed(() =>
  auth.activeMembership?.role === 'owner' || auth.activeMembership?.role === 'admin',
)
const isOwner = computed(() => auth.activeMembership?.role === 'owner')

const roleLabel: Record<string, string> = {
  owner: 'Owner',
  admin: 'Admin',
  member: 'Member',
}

const weekdays = computed(() => {
  const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu']
  return days.map((day, i) => ({
    day,
    active: i < 5,
    in: workStart.value,
    out: workEnd.value,
  }))
})

async function loadAll() {
  if (!auth.token || !auth.workspaceId) return
  loading.value = true
  try {
    const [ws, memberList, dash, settingsRes, invite] = await Promise.all([
      api.getWorkspace(auth.token, auth.workspaceId),
      api.listWorkspaceMembers(auth.token, auth.workspaceId),
      api.dashboardSummary(auth.token, auth.workspaceId),
      api.getWorkspaceSettings(auth.token, auth.workspaceId),
      isAdmin.value ? api.getInviteCode(auth.token, auth.workspaceId) : Promise.resolve({ invite_code: '' }),
    ])
    workspace.value = ws
    workspaceName.value = ws.name
    members.value = memberList
    summary.value = dash
    workStart.value = settingsRes.data.work_start_time ?? '08:00'
    workEnd.value = settingsRes.data.work_end_time ?? '17:00'
    lateThreshold.value = settingsRes.data.late_threshold_minutes ?? 15
    if (invite.invite_code) inviteCode.value = invite.invite_code
  } catch (e) {
    toast.error(e instanceof Error ? e.message : 'Gagal memuat workspace')
  } finally {
    loading.value = false
  }
}

onMounted(loadAll)

async function resetInvite() {
  if (!auth.token || !auth.workspaceId || !isAdmin.value) return
  try {
    const res = await api.resetInviteCode(auth.token, auth.workspaceId)
    inviteCode.value = res.invite_code
    toast.success('Token undangan direset')
  } catch (e) {
    toast.error(e instanceof Error ? e.message : 'Gagal reset token')
  }
}

function copyInvite() {
  if (!inviteCode.value) return
  navigator.clipboard.writeText(inviteCode.value)
  toast.success('Token disalin')
}

async function saveWorkspaceName() {
  if (!auth.token || !auth.workspaceId || !isAdmin.value || !workspaceName.value.trim()) return
  savingName.value = true
  try {
    const ws = await api.updateWorkspace(auth.token, auth.workspaceId, { name: workspaceName.value.trim() })
    workspace.value = ws
    await auth.fetchMe()
    toast.success('Nama workspace disimpan')
  } catch (e) {
    toast.error(e instanceof Error ? e.message : 'Gagal menyimpan nama')
  } finally {
    savingName.value = false
  }
}

async function saveSchedule() {
  if (!auth.token || !auth.workspaceId || !isAdmin.value) return
  savingSchedule.value = true
  try {
    await api.updateWorkspaceSettings(auth.token, auth.workspaceId, {
      work_start_time: workStart.value,
      work_end_time: workEnd.value,
      late_threshold_minutes: lateThreshold.value,
    })
    toast.success('Jadwal kerja disimpan')
  } catch (e) {
    toast.error(e instanceof Error ? e.message : 'Gagal menyimpan jadwal')
  } finally {
    savingSchedule.value = false
  }
}

async function deleteWorkspace() {
  if (!auth.token || !auth.workspaceId || !isOwner.value) return
  const name = workspace.value?.name ?? 'workspace ini'
  if (!window.confirm(`Hapus "${name}" permanen? Semua data absensi dan konfigurasi ikut terhapus.`)) return
  deleting.value = true
  try {
    await api.deleteWorkspace(auth.token, auth.workspaceId)
    toast.success('Workspace dihapus')
    await auth.fetchMe()
    if (auth.hasWorkspace) {
      await loadAll()
    } else {
      await router.push('/onboarding')
    }
  } catch (e) {
    toast.error(e instanceof Error ? e.message : 'Gagal menghapus workspace')
  } finally {
    deleting.value = false
  }
}
</script>

<template>
  <PageShell
    title="Workspace Management"
    description="Kelola member, jadwal kerja, dan profil workspace."
  >
    <div v-if="loading" class="py-12 text-center text-sm text-muted-foreground">Memuat workspace...</div>

    <template v-else>
      <div class="grid gap-3 sm:grid-cols-3">
        <Card class="rounded-xl shadow-none">
          <CardContent class="px-4 py-4">
            <p class="text-xs text-muted-foreground">Paket</p>
            <p class="mt-1 text-lg font-bold uppercase">{{ workspace?.plan ?? 'free' }}</p>
          </CardContent>
        </Card>
        <Card class="rounded-xl shadow-none">
          <CardContent class="px-4 py-4">
            <p class="text-xs text-muted-foreground">Karyawan aktif</p>
            <p class="mt-1 text-lg font-bold">{{ summary?.active_employees ?? 0 }} / {{ summary?.total_employees ?? 0 }}</p>
          </CardContent>
        </Card>
        <Card class="rounded-xl shadow-none">
          <CardContent class="px-4 py-4">
            <p class="text-xs text-muted-foreground">Member workspace</p>
            <p class="mt-1 text-lg font-bold">{{ members.length }}</p>
          </CardContent>
        </Card>
      </div>

      <div class="grid gap-3 lg:grid-cols-2">
        <Card v-if="isAdmin" class="rounded-xl shadow-none">
          <CardHeader class="px-4 pt-4 pb-2">
            <CardTitle class="text-base">Kode undangan</CardTitle>
          </CardHeader>
          <CardContent class="space-y-2 px-4 pb-4">
            <div class="flex flex-col gap-2 sm:flex-row">
              <Input :model-value="inviteCode || '—'" readonly class="min-w-0 font-mono text-sm" />
              <div class="flex gap-2">
                <Button variant="outline" size="sm" :disabled="!inviteCode" @click="copyInvite">Salin</Button>
                <Button variant="outline" size="sm" @click="resetInvite">Putar ulang</Button>
              </div>
            </div>
            <p class="text-xs text-muted-foreground">Bagikan token ini agar user lain bisa join workspace setelah login.</p>
          </CardContent>
        </Card>

        <Card class="rounded-xl shadow-none">
          <CardHeader class="px-4 pt-4 pb-2">
            <CardTitle class="text-base">Profil workspace</CardTitle>
          </CardHeader>
          <CardContent class="space-y-3 px-4 pb-4">
            <div class="grid gap-1.5">
              <Label for="workspace-name">Nama workspace</Label>
              <Input id="workspace-name" v-model="workspaceName" :disabled="!isAdmin" />
            </div>
            <div class="grid gap-1 text-sm text-muted-foreground">
              <p>Slug: {{ workspace?.slug }}</p>
              <p>Device QR aktif: {{ summary?.active_qr_devices ?? 0 }}</p>
              <p>Geofence aktif: {{ summary?.active_geofences ?? 0 }}</p>
            </div>
            <Button v-if="isAdmin" size="sm" :disabled="savingName" @click="saveWorkspaceName">
              {{ savingName ? 'Menyimpan...' : 'Simpan nama workspace' }}
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card class="rounded-xl shadow-none">
        <CardHeader class="flex flex-row items-center justify-between px-4 pt-4 pb-2">
          <div>
            <CardTitle class="text-base">Jadwal jam kerja</CardTitle>
            <p class="mt-0.5 text-sm text-muted-foreground">Senin–Jumat mengikuti jam di bawah. Sabtu/Minggu libur.</p>
          </div>
          <Button v-if="isAdmin" size="sm" :disabled="savingSchedule" @click="saveSchedule">
            {{ savingSchedule ? 'Menyimpan...' : 'Simpan jadwal' }}
          </Button>
        </CardHeader>
        <CardContent class="space-y-3 px-4 pb-4">
          <div v-if="isAdmin" class="grid gap-3 sm:grid-cols-3">
            <div class="grid gap-1.5">
              <Label for="work-start">Jam masuk</Label>
              <Input id="work-start" v-model="workStart" type="time" />
            </div>
            <div class="grid gap-1.5">
              <Label for="work-end">Jam pulang</Label>
              <Input id="work-end" v-model="workEnd" type="time" />
            </div>
            <div class="grid gap-1.5">
              <Label for="late-threshold">Toleransi telat (menit)</Label>
              <Input id="late-threshold" v-model.number="lateThreshold" type="number" min="0" max="120" />
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Hari</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Jam masuk</TableHead>
                <TableHead>Jam pulang</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="row in weekdays" :key="row.day">
                <TableCell>{{ row.day }}</TableCell>
                <TableCell>
                  <Badge :variant="row.active ? 'default' : 'secondary'">{{ row.active ? 'Kerja' : 'Libur' }}</Badge>
                </TableCell>
                <TableCell>{{ row.active ? row.in : '—' }}</TableCell>
                <TableCell>{{ row.active ? row.out : '—' }}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card class="rounded-xl shadow-none">
        <CardHeader class="flex flex-row items-center justify-between px-4 pt-4 pb-2">
          <CardTitle class="text-base">Manajemen member</CardTitle>
          <Button variant="outline" size="sm" @click="loadAll">Refresh</Button>
        </CardHeader>
        <CardContent class="px-4 pb-4">
          <TableEmpty v-if="members.length === 0" message="Belum ada member." />
          <Table v-else>
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Bergabung</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="m in members" :key="m.id">
                <TableCell>{{ m.user?.name ?? `#${m.user_id}` }}</TableCell>
                <TableCell>{{ m.user?.email ?? '—' }}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{{ roleLabel[m.role] ?? m.role }}</Badge>
                </TableCell>
                <TableCell class="text-xs text-muted-foreground">
                  {{ m.user_id === auth.user?.id ? 'Anda' : 'Member' }}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card v-if="isOwner" class="rounded-xl border-red-200 bg-red-50/40 shadow-none">
        <CardHeader class="flex flex-row items-start justify-between gap-3 px-4 pt-4 pb-2">
          <div>
            <CardTitle class="text-base text-red-900">Zona risiko</CardTitle>
            <p class="mt-1 text-sm text-red-800/80">
              Menghapus workspace akan menghapus semua data absensi, member, dan konfigurasi terkait secara permanen.
            </p>
          </div>
          <Button variant="destructive" size="sm" :disabled="deleting" @click="deleteWorkspace">
            {{ deleting ? 'Menghapus...' : 'Hapus workspace' }}
          </Button>
        </CardHeader>
        <CardContent class="grid gap-2 px-4 pb-4 sm:grid-cols-3">
          <div class="rounded border border-red-200 bg-background p-2 text-sm">
            <p class="text-muted-foreground">Total member</p>
            <p class="font-bold">{{ members.length }}</p>
          </div>
          <div class="rounded border border-red-200 bg-background p-2 text-sm">
            <p class="text-muted-foreground">Karyawan</p>
            <p class="font-bold">{{ summary?.total_employees ?? 0 }}</p>
          </div>
          <div class="rounded border border-red-200 bg-background p-2 text-sm">
            <p class="text-muted-foreground">Log audit</p>
            <p class="font-bold">Tercatat otomatis</p>
          </div>
        </CardContent>
      </Card>
    </template>
  </PageShell>
</template>
