<script setup lang="ts">
import { computed, ref } from 'vue'
import { ClipboardList, FileText, CalendarRange, Search } from 'lucide-vue-next'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { useWorkspaceLoader } from '@/composables/useWorkspaceData'
import { api } from '@/lib/api'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const activeTab = ref('plans')
const search = ref('')
const showPlanForm = ref(false)
const showReportForm = ref(false)
const submitting = ref(false)
const generating = ref(false)

const planForm = ref({
  employee_id: '',
  title: '',
  description: '',
  date: new Date().toISOString().slice(0, 10),
  status: 'pending',
})

const reportForm = ref({
  employee_id: '',
  title: '',
  content: '',
  date: new Date().toISOString().slice(0, 10),
})

const statusLabel: Record<string, string> = {
  pending: 'Menunggu',
  in_progress: 'Berjalan',
  completed: 'Selesai',
}

const { data: plans, load: reloadPlans } = useWorkspaceLoader(async (token, ws) =>
  api.listWorkPlans(token, ws) as Promise<Array<Record<string, unknown>>>,
)
const { data: reports, load: reloadReports } = useWorkspaceLoader(async (token, ws) =>
  api.listWorkReports(token, ws) as Promise<Array<Record<string, unknown>>>,
)
const { data: weeklyReports, load: reloadWeekly } = useWorkspaceLoader(async (token, ws) =>
  api.listWeeklyReports(token, ws) as Promise<Array<Record<string, unknown>>>,
)
const { data: employees } = useWorkspaceLoader(async (token, ws) =>
  api.listEmployees(token, ws) as Promise<Array<Record<string, unknown>>>,
)

const planCount = computed(() => plans.value?.length ?? 0)
const reportCount = computed(() => reports.value?.length ?? 0)
const weeklyCount = computed(() => weeklyReports.value?.length ?? 0)

const filteredPlans = computed(() => {
  const q = search.value.trim().toLowerCase()
  const list = plans.value ?? []
  if (!q) return list
  return list.filter((p) =>
    String(p.title ?? '').toLowerCase().includes(q)
    || String((p.employee as { name?: string })?.name ?? '').toLowerCase().includes(q),
  )
})

const filteredReports = computed(() => {
  const q = search.value.trim().toLowerCase()
  const list = reports.value ?? []
  if (!q) return list
  return list.filter((r) =>
    String(r.title ?? '').toLowerCase().includes(q)
    || String((r.employee as { name?: string })?.name ?? '').toLowerCase().includes(q),
  )
})

function employeeName(row: Record<string, unknown>) {
  return (row.employee as { name?: string })?.name ?? `#${row.employee_id}`
}

async function refreshAll() {
  await Promise.all([reloadPlans(), reloadReports(), reloadWeekly()])
}

async function submitPlan() {
  if (!auth.token || !auth.workspaceId) return
  if (!planForm.value.employee_id || !planForm.value.title.trim()) {
    toast.error('Pilih karyawan dan isi judul rencana kerja')
    return
  }
  submitting.value = true
  try {
    await api.createWorkPlan(auth.token, auth.workspaceId, {
      employee_id: Number(planForm.value.employee_id),
      title: planForm.value.title.trim(),
      description: planForm.value.description.trim(),
      date: `${planForm.value.date}T00:00:00Z`,
      status: planForm.value.status,
    })
    toast.success('Rencana kerja ditambahkan')
    planForm.value = {
      employee_id: '',
      title: '',
      description: '',
      date: new Date().toISOString().slice(0, 10),
      status: 'pending',
    }
    showPlanForm.value = false
    await reloadPlans()
  } catch (e) {
    toast.error(e instanceof Error ? e.message : 'Gagal menyimpan rencana kerja')
  } finally {
    submitting.value = false
  }
}

async function submitReport() {
  if (!auth.token || !auth.workspaceId) return
  if (!reportForm.value.employee_id || !reportForm.value.title.trim()) {
    toast.error('Pilih karyawan dan isi judul laporan')
    return
  }
  submitting.value = true
  try {
    await api.createWorkReport(auth.token, auth.workspaceId, {
      employee_id: Number(reportForm.value.employee_id),
      title: reportForm.value.title.trim(),
      content: reportForm.value.content.trim(),
      date: `${reportForm.value.date}T00:00:00Z`,
    })
    toast.success('Laporan harian ditambahkan')
    reportForm.value = {
      employee_id: '',
      title: '',
      content: '',
      date: new Date().toISOString().slice(0, 10),
    }
    showReportForm.value = false
    await reloadReports()
  } catch (e) {
    toast.error(e instanceof Error ? e.message : 'Gagal menyimpan laporan')
  } finally {
    submitting.value = false
  }
}

async function generateWeeklyCsv() {
  if (!auth.token || !auth.workspaceId) return
  generating.value = true
  try {
    const res = await api.generateWeeklyReport(auth.token, auth.workspaceId)
    toast.success(res.message || 'Report mingguan berhasil dibuat')
    await reloadWeekly()
    if (res.download_url) {
      await api.downloadWeeklyReportFile(auth.token, auth.workspaceId)
    }
  } catch (e) {
    toast.error(e instanceof Error ? e.message : 'Gagal membuat report mingguan')
  } finally {
    generating.value = false
  }
}

async function downloadWeekly(id: number) {
  if (!auth.token || !auth.workspaceId) return
  try {
    await api.downloadWeeklyReportById(auth.token, id)
    toast.success('Report diunduh')
  } catch (e) {
    toast.error(e instanceof Error ? e.message : 'Gagal mengunduh report')
  }
}
</script>

<template>
  <PageShell
    title="Work Plans & Reports"
    description="Kelola rencana kerja harian, laporan operasional, dan export mingguan workspace."
  >
    <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard label="Rencana kerja" :value="planCount" :icon="ClipboardList" />
      <StatCard label="Laporan harian" :value="reportCount" :icon="FileText" />
      <StatCard label="Report mingguan" :value="weeklyCount" :icon="CalendarRange" hint="Riwayat generate CSV" />
      <StatCard label="Karyawan" :value="employees?.length ?? 0" hint="Siap di-assign ke rencana" />
    </div>

    <Card class="rounded-xl border-border/60 shadow-none">
      <CardContent class="flex flex-col gap-3 pt-4 sm:flex-row sm:items-center">
        <div class="relative min-w-0 flex-1">
          <Search class="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input v-model="search" class="pl-9" placeholder="Cari judul, karyawan, atau tanggal…" />
        </div>
        <div class="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" @click="refreshAll">Muat ulang</Button>
          <Button size="sm" :disabled="generating" @click="generateWeeklyCsv">
            {{ generating ? 'Memproses…' : 'Generate CSV mingguan' }}
          </Button>
        </div>
      </CardContent>
    </Card>

    <Tabs v-model="activeTab" class="gap-4">
      <TabsList class="h-auto w-full justify-start gap-1 overflow-x-auto rounded-lg bg-muted/40 p-1">
        <TabsTrigger value="plans" class="cursor-pointer shrink-0">Work Plans</TabsTrigger>
        <TabsTrigger value="reports" class="cursor-pointer shrink-0">Work Reports</TabsTrigger>
        <TabsTrigger value="weekly" class="cursor-pointer shrink-0">Mingguan</TabsTrigger>
      </TabsList>

      <TabsContent value="plans" class="space-y-3">
        <Card class="rounded-xl border-border/60 shadow-none">
          <CardHeader class="flex flex-row flex-wrap items-center justify-between gap-3">
            <div>
              <CardTitle class="text-base">Rencana kerja</CardTitle>
              <p class="mt-0.5 text-sm text-muted-foreground">Atur target harian per karyawan.</p>
            </div>
            <Button size="sm" @click="showPlanForm = !showPlanForm">
              {{ showPlanForm ? 'Tutup' : 'Tambah rencana' }}
            </Button>
          </CardHeader>
          <CardContent v-if="showPlanForm" class="grid gap-3 border-t pt-3 sm:grid-cols-2">
            <div class="grid gap-1.5 sm:col-span-2">
              <Label>Karyawan</Label>
              <Select v-model="planForm.employee_id">
                <SelectTrigger><SelectValue placeholder="Pilih karyawan" /></SelectTrigger>
                <SelectContent>
                  <SelectItem v-for="emp in employees ?? []" :key="String(emp.id)" :value="String(emp.id)">
                    {{ emp.name }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div class="grid gap-1.5 sm:col-span-2">
              <Label>Judul rencana</Label>
              <Input v-model="planForm.title" placeholder="Contoh: Patroli area produksi" />
            </div>
            <div class="grid gap-1.5">
              <Label>Tanggal</Label>
              <Input v-model="planForm.date" type="date" />
            </div>
            <div class="grid gap-1.5">
              <Label>Status</Label>
              <Select v-model="planForm.status">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Menunggu</SelectItem>
                  <SelectItem value="in_progress">Berjalan</SelectItem>
                  <SelectItem value="completed">Selesai</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div class="grid gap-1.5 sm:col-span-2">
              <Label>Catatan (opsional)</Label>
              <Textarea v-model="planForm.description" rows="2" placeholder="Detail tugas atau lokasi" />
            </div>
            <div class="sm:col-span-2">
              <Button size="sm" :disabled="submitting" @click="submitPlan">
                {{ submitting ? 'Menyimpan…' : 'Simpan rencana' }}
              </Button>
            </div>
          </CardContent>
        </Card>

        <EmptyState
          v-if="filteredPlans.length === 0"
          :icon="ClipboardList"
          title="Belum ada rencana kerja"
          description="Tambahkan rencana harian untuk karyawan agar target operasional tercatat rapi."
        >
          <template #actions>
            <Button size="sm" @click="showPlanForm = true">Tambah rencana pertama</Button>
          </template>
        </EmptyState>
        <div v-else class="grid gap-2">
          <Card v-for="p in filteredPlans" :key="String(p.id)" class="rounded-xl border-border/60 shadow-none">
            <CardContent class="flex flex-wrap items-start justify-between gap-3 px-4 py-3.5">
              <div class="min-w-0">
                <p class="font-medium">{{ p.title }}</p>
                <p class="mt-0.5 text-sm text-muted-foreground">
                  {{ employeeName(p) }} · {{ String(p.date).slice(0, 10) }}
                </p>
                <p v-if="p.description" class="mt-2 text-sm text-muted-foreground">{{ p.description }}</p>
              </div>
              <Badge variant="secondary">{{ statusLabel[String(p.status)] ?? p.status }}</Badge>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="reports" class="space-y-3">
        <Card class="rounded-xl border-border/60 shadow-none">
          <CardHeader class="flex flex-row flex-wrap items-center justify-between gap-3">
            <div>
              <CardTitle class="text-base">Laporan harian</CardTitle>
              <p class="mt-0.5 text-sm text-muted-foreground">Ringkasan aktivitas karyawan per hari.</p>
            </div>
            <Button size="sm" @click="showReportForm = !showReportForm">
              {{ showReportForm ? 'Tutup' : 'Tambah laporan' }}
            </Button>
          </CardHeader>
          <CardContent v-if="showReportForm" class="grid gap-3 border-t pt-3 sm:grid-cols-2">
            <div class="grid gap-1.5 sm:col-span-2">
              <Label>Karyawan</Label>
              <Select v-model="reportForm.employee_id">
                <SelectTrigger><SelectValue placeholder="Pilih karyawan" /></SelectTrigger>
                <SelectContent>
                  <SelectItem v-for="emp in employees ?? []" :key="String(emp.id)" :value="String(emp.id)">
                    {{ emp.name }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div class="grid gap-1.5 sm:col-span-2">
              <Label>Judul laporan</Label>
              <Input v-model="reportForm.title" placeholder="Contoh: Laporan shift pagi" />
            </div>
            <div class="grid gap-1.5">
              <Label>Tanggal</Label>
              <Input v-model="reportForm.date" type="date" />
            </div>
            <div class="grid gap-1.5 sm:col-span-2">
              <Label>Isi laporan</Label>
              <Textarea v-model="reportForm.content" rows="3" placeholder="Ringkasan pekerjaan hari ini" />
            </div>
            <div class="sm:col-span-2">
              <Button size="sm" :disabled="submitting" @click="submitReport">
                {{ submitting ? 'Menyimpan…' : 'Simpan laporan' }}
              </Button>
            </div>
          </CardContent>
        </Card>

        <EmptyState
          v-if="filteredReports.length === 0"
          :icon="FileText"
          title="Belum ada laporan harian"
          description="Catat laporan operasional harian dari tim Anda di sini."
        >
          <template #actions>
            <Button size="sm" @click="showReportForm = true">Tambah laporan pertama</Button>
          </template>
        </EmptyState>
        <div v-else class="grid gap-2">
          <Card v-for="r in filteredReports" :key="String(r.id)" class="rounded-xl border-border/60 shadow-none">
            <CardContent class="px-4 py-3.5">
              <p class="font-medium">{{ r.title }}</p>
              <p class="mt-0.5 text-sm text-muted-foreground">
                {{ employeeName(r) }} · {{ String(r.date).slice(0, 10) }}
              </p>
              <p v-if="r.content" class="mt-2 text-sm text-muted-foreground">{{ r.content }}</p>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="weekly" class="space-y-3">
        <EmptyState
          v-if="weeklyCount === 0"
          :icon="CalendarRange"
          title="Belum ada report mingguan"
          description="Generate CSV kehadiran 7 hari terakhir untuk arsip dan audit internal."
        >
          <template #actions>
            <Button size="sm" :disabled="generating" @click="generateWeeklyCsv">
              {{ generating ? 'Memproses…' : 'Generate report mingguan' }}
            </Button>
          </template>
        </EmptyState>
        <div v-else class="grid gap-2">
          <Card v-for="w in weeklyReports ?? []" :key="String(w.id)" class="rounded-xl border-border/60 shadow-none">
            <CardContent class="flex flex-wrap items-center justify-between gap-3 px-4 py-3.5">
              <div>
                <p class="font-medium">
                  {{ String(w.week_start).slice(0, 10) }} – {{ String(w.week_end).slice(0, 10) }}
                </p>
                <p class="mt-0.5 text-sm text-muted-foreground">
                  Status: {{ w.status }}
                  <span v-if="w.generated_at"> · {{ String(w.generated_at).slice(0, 16).replace('T', ' ') }}</span>
                </p>
              </div>
              <Button
                v-if="w.status === 'completed'"
                variant="outline"
                size="sm"
                @click="downloadWeekly(Number(w.id))"
              >
                Unduh CSV
              </Button>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  </PageShell>
</template>
