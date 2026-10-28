<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { Pencil } from 'lucide-vue-next'
import { toast } from 'vue-sonner'

import PageShell from '@/components/app/page-shell.vue'
import TableEmpty from '@/components/app/table-empty.vue'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { api, type DashboardSummary, type Workspace, type WorkspaceMember } from '@/lib/api'
import TimezoneSelect from '@/components/app/timezone-select.vue'
import { timezoneAbbrev } from '@/lib/timezone'
import { normalizeWorkTime } from '@/lib/work-time'
import {
  defaultWorkWeek,
  parseWorkWeekFromApi,
  scheduleForSave,
  WORK_DAY_LABELS,
  type WorkDaySchedule,
} from '@/lib/work-week'
import { ROUTES } from '@/lib/routes'
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
const workWeek = ref<WorkDaySchedule[]>(defaultWorkWeek())
const lateThreshold = ref(15)
const settingsInterval = ref(20)
const timezone = ref('Asia/Jakarta')
const scheduleDirty = ref(false)
const scheduleBaseline = ref('')

function snapshotSchedule() {
  return JSON.stringify({
    timezone: timezone.value,
    workWeek: scheduleForSave(workWeek.value),
    lateThreshold: lateThreshold.value,
  })
}

function markScheduleDirty() {
  scheduleDirty.value = snapshotSchedule() !== scheduleBaseline.value
}

watch([timezone, workWeek, lateThreshold], markScheduleDirty, { deep: true })

const isAdmin = computed(() =>
  auth.activeMembership?.role === 'owner' || auth.activeMembership?.role === 'admin',
)
const isOwner = computed(() => auth.activeMembership?.role === 'owner')

const roleLabel: Record<string, string> = {
  owner: 'Owner',
  admin: 'Admin',
  member: 'Member',
}

const scheduleSummary = computed(() => {
  const active = workWeek.value.filter((d) => d.active)
  const names = active.map((d) => WORK_DAY_LABELS[d.day]).join(', ')
  return `${active.length} hari kerja (${names || 'belum ada'}) · zona ${timezoneAbbrev(timezone.value)}`
})

function onDayTimeChange(row: WorkDaySchedule, field: 'start_time' | 'end_time', value: string) {
  row[field] = normalizeWorkTime(value)
}

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
    workWeek.value = parseWorkWeekFromApi(
      settingsRes.data.work_week_schedule,
      settingsRes.data.work_start_time,
      settingsRes.data.work_end_time,
    )
    lateThreshold.value = settingsRes.data.late_threshold_minutes ?? 15
    settingsInterval.value = settingsRes.data.location_interval_minutes ?? 20
    timezone.value = settingsRes.data.timezone ?? 'Asia/Jakarta'
    scheduleBaseline.value = snapshotSchedule()
    scheduleDirty.value = false
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
  const rows = scheduleForSave(workWeek.value)
  if (!rows.some((d) => d.active)) {
    toast.error('Minimal satu hari kerja harus aktif')
    return
  }
  savingSchedule.value = true
  try {
    await api.updateWorkspaceSettings(auth.token, auth.workspaceId, {
      timezone: timezone.value,
      work_week_schedule: rows,
      late_threshold_minutes: lateThreshold.value,
    })
    toast.success('Jadwal kerja disimpan')
    await loadAll()
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
    title="Pengaturan perusahaan"
    description="Kelola anggota tim, jadwal kerja, dan profil perusahaan."
  >
    <div v-if="loading" class="py-12 text-center text-sm text-muted-foreground">Memuat workspace...</div>

    <template v-else>
      <div class="grid gap-3 sm:grid-cols-3">
        <Card class="rounded-xl shadow-none">
          <CardContent class="py-3.5">
            <p class="text-xs text-muted-foreground">Paket</p>
            <p class="mt-1 text-lg font-bold uppercase">{{ workspace?.plan ?? 'free' }}</p>
          </CardContent>
        </Card>
        <Card class="rounded-xl shadow-none">
          <CardContent class="py-3.5">
            <p class="text-xs text-muted-foreground">Karyawan aktif</p>
            <p class="mt-1 text-lg font-bold">{{ summary?.active_employees ?? 0 }} / {{ summary?.total_employees ?? 0 }}</p>
          </CardContent>
        </Card>
        <Card class="rounded-xl shadow-none">
          <CardContent class="py-3.5">
            <p class="text-xs text-muted-foreground">Member workspace</p>
            <p class="mt-1 text-lg font-bold">{{ members.length }}</p>
          </CardContent>
        </Card>
      </div>

      <div class="grid gap-3 lg:grid-cols-2">
        <Card v-if="isAdmin" class="rounded-xl shadow-none">
          <CardHeader>
            <CardTitle class="text-base">Kode undangan</CardTitle>
          </CardHeader>
          <CardContent class="space-y-2">
            <div class="flex flex-col gap-2 sm:flex-row">
              <Input :model-value="inviteCode || '-'" readonly class="min-w-0 font-mono text-sm" />
              <div class="flex gap-2">
                <Button variant="outline" size="sm" :disabled="!inviteCode" @click="copyInvite">Salin</Button>
                <Button variant="outline" size="sm" @click="resetInvite">Putar ulang</Button>
              </div>
            </div>
            <p class="text-xs text-muted-foreground">Bagikan token ini agar user lain bisa join workspace setelah login.</p>
          </CardContent>
        </Card>

        <Card class="rounded-xl shadow-none">
          <CardHeader>
            <CardTitle class="text-base">Profil workspace</CardTitle>
          </CardHeader>
          <CardContent class="space-y-3">
            <div class="grid gap-1.5">
              <Label for="workspace-name">Nama workspace</Label>
              <Input id="workspace-name" v-model="workspaceName" :disabled="!isAdmin" />
            </div>
            <div class="grid gap-1 text-sm text-muted-foreground">
              <p>Slug: {{ workspace?.slug }}</p>
              <p>Device QR aktif: {{ summary?.active_qr_devices ?? 0 }}</p>
              <p>Geofence aktif: {{ summary?.active_geofences ?? 0 }}</p>
              <p>Interval lokasi: {{ settingsInterval }} menit</p>
            </div>
            <Button v-if="isAdmin" size="sm" :disabled="savingName" @click="saveWorkspaceName">
              {{ savingName ? 'Menyimpan...' : 'Simpan nama workspace' }}
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card class="rounded-xl border-border/60 shadow-none">
        <CardHeader class="space-y-1">
          <CardTitle class="text-base">Jadwal jam kerja</CardTitle>
          <p class="text-sm text-muted-foreground">
            Atur jam masuk dan pulang per hari. Dipakai untuk status hadir/telat absensi.
          </p>
        </CardHeader>
        <CardContent class="space-y-4">
          <div
            v-if="!isAdmin"
            class="rounded-lg border border-amber-200/80 bg-amber-50/80 px-3 py-2.5 text-sm text-amber-950 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-100"
          >
            Role Anda: <strong>{{ roleLabel[auth.activeMembership?.role ?? 'member'] ?? 'Member' }}</strong>.
            Hanya <strong>Admin</strong> atau <strong>Owner</strong> yang bisa mengubah jadwal di sini.
          </div>

          <div
            class="rounded-lg border border-primary/20 bg-primary/5 px-3 py-2.5 text-sm"
            :class="isAdmin ? '' : 'opacity-90'"
          >
            <p class="font-medium tabular-nums">{{ scheduleSummary }}</p>
            <p class="mt-1 text-muted-foreground">
              Toleransi telat {{ lateThreshold }} menit setelah jam masuk.
            </p>
          </div>

          <div
            class="space-y-4 rounded-xl border-2 border-dashed border-border/80 bg-muted/10 p-4"
            :class="isAdmin ? 'border-primary/30' : ''"
          >
            <div class="flex flex-wrap items-center justify-between gap-2">
              <div class="flex items-center gap-2">
                <Pencil class="size-4 text-muted-foreground" />
                <h3 class="text-sm font-semibold">Edit per hari</h3>
              </div>
              <Badge v-if="isAdmin && scheduleDirty" variant="secondary">Belum disimpan</Badge>
            </div>

            <div class="grid max-w-3xl gap-3 sm:grid-cols-2">
              <div class="grid gap-1.5 sm:col-span-2">
                <Label>Zona waktu</Label>
                <TimezoneSelect v-model="timezone" :disabled="!isAdmin" />
              </div>
              <div class="grid gap-1.5">
                <Label for="late-threshold">Toleransi telat (menit)</Label>
                <Input
                  id="late-threshold"
                  v-model.number="lateThreshold"
                  type="number"
                  min="0"
                  max="120"
                  class="tabular-nums"
                  :disabled="!isAdmin"
                />
              </div>
            </div>

            <div v-if="isAdmin" class="flex flex-wrap items-center gap-2">
              <Button size="sm" :disabled="savingSchedule || !scheduleDirty" @click="saveSchedule">
                {{ savingSchedule ? 'Menyimpan…' : 'Simpan jadwal' }}
              </Button>
              <Button
                v-if="scheduleDirty"
                size="sm"
                variant="outline"
                :disabled="savingSchedule"
                @click="loadAll"
              >
                Batalkan perubahan
              </Button>
            </div>

            <p v-if="isAdmin" class="text-xs text-muted-foreground">
              Jam berbeda per karyawan atau shift khusus: buka
              <RouterLink :to="ROUTES.shiftRoster" class="text-primary underline-offset-2 hover:underline">
                Shift &amp; Roster
              </RouterLink>.
            </p>
          </div>

          <div class="overflow-x-auto rounded-lg border border-border/60">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Hari</TableHead>
                  <TableHead>Hari kerja</TableHead>
                  <TableHead class="tabular-nums">Jam masuk</TableHead>
                  <TableHead class="tabular-nums">Jam pulang</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow v-for="row in workWeek" :key="row.day">
                  <TableCell class="font-medium">{{ WORK_DAY_LABELS[row.day] }}</TableCell>
                  <TableCell>
                    <div class="flex items-center gap-2">
                      <Switch
                        :checked="row.active"
                        :disabled="!isAdmin"
                        @update:checked="(v: boolean) => { row.active = v }"
                      />
                      <Badge :variant="row.active ? 'default' : 'secondary'">
                        {{ row.active ? 'Kerja' : 'Libur' }}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell class="tabular-nums">
                    <Input
                      v-if="isAdmin"
                      :model-value="row.start_time"
                      type="time"
                      step="60"
                      class="h-8 w-[7.25rem] tabular-nums"
                      :disabled="!row.active"
                      @update:model-value="(v) => onDayTimeChange(row, 'start_time', String(v))"
                    />
                    <span v-else class="text-muted-foreground">{{ row.active ? row.start_time : '-' }}</span>
                  </TableCell>
                  <TableCell class="tabular-nums">
                    <Input
                      v-if="isAdmin"
                      :model-value="row.end_time"
                      type="time"
                      step="60"
                      class="h-8 w-[7.25rem] tabular-nums"
                      :disabled="!row.active"
                      @update:model-value="(v) => onDayTimeChange(row, 'end_time', String(v))"
                    />
                    <span v-else class="text-muted-foreground">{{ row.active ? row.end_time : '-' }}</span>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card class="rounded-xl shadow-none">
        <CardHeader class="flex flex-row items-center justify-between">
          <CardTitle class="text-base">Manajemen member</CardTitle>
          <Button variant="outline" size="sm" @click="loadAll">Refresh</Button>
        </CardHeader>
        <CardContent>
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
                <TableCell>{{ m.user?.email ?? '-' }}</TableCell>
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
        <CardHeader class="flex flex-row items-start justify-between gap-3">
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
        <CardContent class="grid gap-2 sm:grid-cols-3">
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
