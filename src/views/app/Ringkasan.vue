<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { Activity, Info, QrCode, RefreshCw, TrendingUp, UserCheck, Users } from 'lucide-vue-next'

import AttendanceTrendChart from '@/components/app/attendance-trend-chart.vue'
import PageShell from '@/components/app/page-shell.vue'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useWorkspaceLoader } from '@/composables/useWorkspaceData'
import { api, type DashboardSummary } from '@/lib/api'
import { useAuthStore } from '@/stores/auth'
import { ROUTES } from '@/lib/routes'

const auth = useAuthStore()
const router = useRouter()

const { data: summary, loading, load } = useWorkspaceLoader<DashboardSummary>(
  (token, workspaceId) => api.dashboardSummary(token, workspaceId),
)

const rate = computed(() => {
  const s = summary.value
  if (!s || s.active_employees === 0) return '0%'
  return `${Math.round((s.today_present / s.active_employees) * 100)}%`
})

const averageRate = computed(() => {
  const s = summary.value
  if (!s || s.active_employees === 0) return 0
  return Math.round((s.recent_attendances_7d / (s.active_employees * 7)) * 100)
})
</script>

<template>
  <PageShell
    title="Ringkasan Operasional"
    :description="`Menampilkan ringkasan untuk workspace aktif: ${auth.workspaceName}.`"
  >
    <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <Card class="rounded-xl shadow-none">
        <CardContent class="flex items-start justify-between p-4">
          <div>
            <p class="text-sm text-muted-foreground">Karyawan aktif</p>
            <p class="mt-1 text-3xl font-bold">{{ summary?.active_employees ?? (loading ? '…' : 0) }}</p>
            <Button variant="outline" size="sm" class="mt-2" @click="router.push(ROUTES.employees)">Lihat karyawan</Button>
          </div>
          <Users class="size-4 text-muted-foreground" />
        </CardContent>
      </Card>
      <Card class="rounded-xl shadow-none">
        <CardContent class="p-4">
          <div class="flex items-start justify-between">
            <p class="text-sm text-muted-foreground">Hadir hari ini</p>
            <UserCheck class="size-4 text-muted-foreground" />
          </div>
          <p class="mt-1 text-3xl font-bold">{{ summary?.today_present ?? 0 }}</p>
          <p class="mt-1 text-xs text-muted-foreground">{{ summary?.today_late ?? 0 }} terlambat</p>
        </CardContent>
      </Card>
      <Card class="rounded-xl shadow-none">
        <CardContent class="p-4">
          <div class="flex items-start justify-between">
            <p class="text-sm text-muted-foreground">Rasio kehadiran</p>
            <TrendingUp class="size-4 text-muted-foreground" />
          </div>
          <p class="mt-1 text-3xl font-bold">{{ rate }}</p>
          <p class="mt-1 text-xs text-muted-foreground">Rata-rata 7 hari {{ averageRate }}%</p>
        </CardContent>
      </Card>
      <Card class="rounded-xl shadow-none">
        <CardContent class="flex items-start justify-between p-4">
          <div>
            <p class="text-sm text-muted-foreground">Device QR aktif</p>
            <p class="mt-1 text-3xl font-bold">{{ summary?.active_qr_devices ?? 0 }}</p>
            <Button variant="outline" size="sm" class="mt-2" @click="router.push(ROUTES.qrDevices)">Kelola device QR</Button>
          </div>
          <QrCode class="size-4 text-muted-foreground" />
        </CardContent>
      </Card>
    </div>

    <Card class="rounded-xl shadow-none">
      <CardHeader class="flex flex-row items-start justify-between gap-3 px-4 pt-4 pb-2">
        <div>
          <CardTitle class="text-base">Kesehatan operasional</CardTitle>
          <p class="mt-0.5 text-sm text-muted-foreground">Sorotan cepat untuk memeriksa kondisi workspace aktif.</p>
        </div>
        <Button variant="ghost" size="icon-sm" :disabled="loading" @click="load">
          <RefreshCw class="size-4" :class="loading ? 'animate-spin' : ''" />
        </Button>
      </CardHeader>
      <CardContent class="space-y-2 px-4 pb-4">
        <div v-if="summary && summary.pending_leaves > 0" class="flex items-center gap-2 rounded-lg border bg-muted/30 px-3 py-2.5 text-sm">
          <span class="size-2 rounded-full bg-amber-500" />{{ summary.pending_leaves }} pengajuan cuti menunggu persetujuan
        </div>
        <div v-if="summary && summary.active_geofences === 0" class="flex items-center gap-2 rounded-lg border bg-muted/30 px-3 py-2.5 text-sm">
          <span class="size-2 rounded-full bg-amber-500" />Belum ada geofence aktif
        </div>
        <div v-if="summary && summary.recent_attendances_7d === 0" class="flex items-center gap-2 rounded-lg border bg-muted/30 px-3 py-2.5 text-sm">
          <span class="size-2 rounded-full bg-muted-foreground/40" />Belum ada aktivitas absensi 7 hari terakhir
        </div>
        <div v-if="!summary && !loading" class="text-sm text-muted-foreground">Belum ada data ringkasan.</div>
      </CardContent>
    </Card>

    <div class="grid gap-3 lg:grid-cols-2">
      <Card class="rounded-xl shadow-none">
        <CardHeader class="flex flex-row items-start justify-between gap-3 px-4 pt-4 pb-2">
          <div>
            <CardTitle class="text-base">Tren kehadiran 7 hari</CardTitle>
            <p class="mt-0.5 text-sm text-muted-foreground">Rata-rata rasio kehadiran {{ averageRate }}%</p>
          </div>
        </CardHeader>
        <CardContent class="px-4 pb-4">
          <AttendanceTrendChart :average-rate="averageRate" />
        </CardContent>
      </Card>

      <Card class="rounded-xl shadow-none">
        <CardHeader class="flex flex-row items-start justify-between gap-3 px-4 pt-4 pb-2">
          <div>
            <CardTitle class="text-base">Aktivitas terkini</CardTitle>
            <p class="mt-0.5 text-sm text-muted-foreground">{{ summary?.recent_attendances_7d ?? 0 }} absensi 7 hari terakhir</p>
          </div>
        </CardHeader>
        <CardContent class="px-4 pb-4">
          <div class="flex min-h-44 flex-col items-center justify-center rounded-lg border border-dashed border-border/70 bg-muted/15 px-6 py-8 text-center">
            <Info class="mb-2 size-6 text-muted-foreground" />
            <p class="max-w-sm text-sm font-medium">Lihat detail absensi di halaman Laporan atau Karyawan.</p>
            <div class="mt-3 flex flex-wrap justify-center gap-2">
              <Button variant="outline" size="sm" @click="load">Muat ulang</Button>
              <Button variant="outline" size="sm" @click="router.push(ROUTES.reports)">Buka laporan</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <Card class="rounded-xl shadow-none">
      <CardHeader class="px-4 pt-4 pb-1">
        <div class="flex items-center gap-2 text-xs font-medium tracking-wide text-muted-foreground">
          <Activity class="size-3.5" />
          STATUS REPORT MINGGUAN
        </div>
      </CardHeader>
      <CardContent class="flex flex-col items-start gap-2 px-4 pb-4">
        <p class="text-sm text-muted-foreground">
          Generate laporan mingguan CSV dari menu report di header atau halaman Work Plans.
        </p>
        <Button size="sm" @click="router.push(ROUTES.workPlans)">Buka work plans & reports</Button>
      </CardContent>
    </Card>
  </PageShell>
</template>
