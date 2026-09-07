<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  Activity,
  CalendarRange,
  QrCode,
  RefreshCw,
  TrendingUp,
  UserCheck,
  Users,
} from 'lucide-vue-next'

import AttendanceTrendChart from '@/components/app/attendance-trend-chart.vue'
import EmptyState from '@/components/app/empty-state.vue'
import PageShell from '@/components/app/page-shell.vue'
import StatCard from '@/components/app/stat-card.vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useWorkspaceLoader } from '@/composables/useWorkspaceData'
import { api, type DashboardSummary } from '@/lib/api'
import { ROUTES } from '@/lib/routes'
import { useAuthStore } from '@/stores/auth'

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
  const trend = summary.value?.attendance_trend_7d ?? []
  if (trend.length === 0) return 0
  const sum = trend.reduce((acc, point) => acc + point.rate, 0)
  return Math.round(sum / trend.length)
})

const trendChartData = computed(() =>
  (summary.value?.attendance_trend_7d ?? []).map((point) => ({
    label: point.day,
    rate: Math.round(point.rate),
  })),
)

const healthAlerts = computed(() => {
  const s = summary.value
  if (!s) return []
  const items: Array<{ tone: 'amber' | 'muted' | 'emerald'; text: string }> = []
  if ((s.stale_location_sessions ?? 0) > 0) {
    items.push({
      tone: 'amber',
      text: `${s.stale_location_sessions} sesi lokasi belum kirim ping sesuai interval`,
    })
  }
  if (s.pending_leaves > 0) {
    items.push({
      tone: 'amber',
      text: `${s.pending_leaves} pengajuan cuti menunggu persetujuan`,
    })
  }
  if (s.active_geofences === 0) {
    items.push({ tone: 'amber', text: 'Belum ada geofence aktif di workspace' })
  }
  if (s.active_qr_devices === 0) {
    items.push({ tone: 'muted', text: 'Belum ada device QR yang terdaftar' })
  }
  if (s.recent_attendances_7d === 0) {
    items.push({ tone: 'muted', text: 'Belum ada aktivitas absensi 7 hari terakhir' })
  }
  const presentRate = s.active_employees > 0
    ? Math.round((s.today_present / s.active_employees) * 100)
    : 0
  if (s.active_employees > 0 && presentRate < 70) {
    items.push({ tone: 'amber', text: `Rasio kehadiran hari ini ${presentRate}% — perlu dipantau` })
  }
  if (items.length === 0 && s.active_employees > 0) {
    items.push({ tone: 'emerald', text: 'Operasional berjalan normal untuk workspace aktif' })
  }
  return items
})

const toneDot: Record<string, string> = {
  amber: 'bg-amber-500',
  muted: 'bg-muted-foreground/40',
  emerald: 'bg-emerald-500',
}
</script>

<template>
  <PageShell
    title="Ringkasan Operasional"
    :description="`Ringkasan kehadiran dan aktivitas workspace ${auth.workspaceName}.`"
  >
    <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        label="Karyawan aktif"
        :value="loading ? '…' : (summary?.active_employees ?? 0)"
        :icon="Users"
        hint="Terdaftar di workspace"
      >
        <Button variant="outline" size="sm" class="mt-2" @click="router.push(ROUTES.employees)">
          Lihat karyawan
        </Button>
      </StatCard>
      <StatCard
        label="Hadir hari ini"
        :value="summary?.today_present ?? 0"
        :icon="UserCheck"
        :hint="`${summary?.today_late ?? 0} terlambat`"
      />
      <StatCard
        label="Rasio kehadiran"
        :value="rate"
        :icon="TrendingUp"
        :hint="`Rata-rata 7 hari ${averageRate}%`"
      />
      <StatCard
        label="Device QR aktif"
        :value="summary?.active_qr_devices ?? 0"
        :icon="QrCode"
        hint="Siap untuk scan kehadiran"
      >
        <Button variant="outline" size="sm" class="mt-2" @click="router.push(ROUTES.qrDevices)">
          Kelola device QR
        </Button>
      </StatCard>
    </div>

    <Card class="rounded-xl border-border/60 shadow-none">
      <CardHeader class="flex flex-row items-start justify-between gap-3">
        <div>
          <CardTitle class="text-base">Kesehatan operasional</CardTitle>
          <p class="mt-0.5 text-sm text-muted-foreground">Indikator cepat kondisi workspace hari ini.</p>
        </div>
        <Button variant="ghost" size="icon-sm" :disabled="loading" @click="load">
          <RefreshCw class="size-4" :class="loading ? 'animate-spin' : ''" />
        </Button>
      </CardHeader>
      <CardContent class="space-y-2">
        <div
          v-for="(alert, i) in healthAlerts"
          :key="i"
          class="flex items-center gap-2 rounded-lg border border-border/60 bg-muted/20 px-3 py-2.5 text-sm"
        >
          <span class="size-2 shrink-0 rounded-full" :class="toneDot[alert.tone]" />
          {{ alert.text }}
        </div>
        <p v-if="!summary && !loading" class="text-sm text-muted-foreground">Memuat ringkasan…</p>
      </CardContent>
    </Card>

    <div class="grid gap-3 lg:grid-cols-2">
      <Card class="rounded-xl border-border/60 shadow-none">
        <CardHeader>
          <CardTitle class="text-base">Tren kehadiran 7 hari</CardTitle>
          <p class="mt-0.5 text-sm text-muted-foreground">Rata-rata rasio kehadiran {{ averageRate }}%</p>
        </CardHeader>
        <CardContent>
          <AttendanceTrendChart :data="trendChartData" :average-rate="averageRate" />
        </CardContent>
      </Card>

      <Card class="rounded-xl border-border/60 shadow-none">
        <CardHeader>
          <CardTitle class="text-base">Aktivitas terkini</CardTitle>
          <p class="mt-0.5 text-sm text-muted-foreground">
            {{ summary?.recent_attendances_7d ?? 0 }} absensi tercatat 7 hari terakhir
          </p>
        </CardHeader>
        <CardContent>
          <EmptyState
            v-if="(summary?.recent_attendances_7d ?? 0) === 0"
            :icon="Activity"
            title="Belum ada aktivitas terbaru"
            description="Absensi karyawan akan muncul di sini setelah check-in pertama tercatat."
            compact
          >
            <template #actions>
              <Button variant="outline" size="sm" :disabled="loading" @click="load">Muat ulang</Button>
              <Button variant="outline" size="sm" @click="router.push(ROUTES.reports)">Buka laporan</Button>
            </template>
          </EmptyState>
          <div v-else class="space-y-2">
            <p class="text-sm text-muted-foreground">
              Lihat detail lengkap absensi harian dan audit di halaman Laporan.
            </p>
            <Button size="sm" variant="outline" @click="router.push(ROUTES.reports)">Buka laporan</Button>
          </div>
        </CardContent>
      </Card>
    </div>

    <Card class="rounded-xl border-border/60 shadow-none">
      <CardHeader>
        <div class="flex items-center gap-2 text-xs font-medium tracking-wide text-muted-foreground">
          <CalendarRange class="size-3.5" />
          Report mingguan
        </div>
      </CardHeader>
      <CardContent class="flex flex-col items-start gap-2">
        <p class="text-sm text-muted-foreground">
          Generate arsip CSV kehadiran mingguan untuk audit internal workspace.
        </p>
        <Button size="sm" @click="router.push(ROUTES.workPlans)">Kelola work plans & reports</Button>
      </CardContent>
    </Card>
  </PageShell>
</template>
