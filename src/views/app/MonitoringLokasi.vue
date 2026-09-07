<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { MapPin, Radio, Users } from 'lucide-vue-next'
import { toast } from 'vue-sonner'

import EmptyState from '@/components/app/empty-state.vue'
import LocationMap from '@/components/app/location-map.vue'
import PageShell from '@/components/app/page-shell.vue'
import StatCard from '@/components/app/stat-card.vue'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useWorkspaceLoader } from '@/composables/useWorkspaceData'
import { api } from '@/lib/api'
import { ROUTES } from '@/lib/routes'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()
const search = ref('')
const intervalMinutes = ref('20')
const savingInterval = ref(false)

const isAdmin = computed(() =>
  auth.activeMembership?.role === 'owner' || auth.activeMembership?.role === 'admin',
)

const { data: sessions, loading, load: reloadSessions } = useWorkspaceLoader(async (token, workspaceId) =>
  api.listLocationSessions(token, workspaceId, true) as Promise<Array<Record<string, unknown>>>,
)

const { data: settingsRes, load: reloadSettings } = useWorkspaceLoader(async (token, ws) => {
  const res = await api.getWorkspaceSettings(token, ws)
  intervalMinutes.value = String(res.data.location_interval_minutes ?? 20)
  return res
})

const filtered = computed(() => {
  const q = search.value.trim().toLowerCase()
  const list = sessions.value ?? []
  if (!q) return list
  return list.filter((s) =>
    String((s.employee as { name?: string })?.name ?? '').toLowerCase().includes(q),
  )
})

const staleCount = computed(() =>
  (sessions.value ?? []).filter((s) => s.is_stale === true).length,
)

const mapMarkers = computed(() =>
  filtered.value.map((s) => ({
    lat: Number(s.latitude),
    lng: Number(s.longitude),
    label: (s.employee as { name?: string })?.name ?? 'Karyawan',
  })),
)

function formatTime(value: unknown) {
  if (!value) return '—'
  return String(value).slice(11, 16)
}

async function saveInterval() {
  if (!auth.token || !auth.workspaceId || !isAdmin.value) return
  savingInterval.value = true
  try {
    await api.updateWorkspaceSettings(auth.token, auth.workspaceId, {
      location_interval_minutes: Number(intervalMinutes.value),
    })
    toast.success('Interval lokasi disimpan')
    await reloadSettings()
  } catch (e) {
    toast.error(e instanceof Error ? e.message : 'Gagal menyimpan interval')
  } finally {
    savingInterval.value = false
  }
}

async function refreshAll() {
  await Promise.all([reloadSessions(), reloadSettings()])
}
</script>

<template>
  <PageShell
    title="Monitoring Lokasi"
    description="Pantau posisi karyawan dengan sesi lokasi aktif. GPS indoor kurang akurat — gunakan sebagai pelengkap audit."
  >
    <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard label="Sesi aktif" :value="sessions?.length ?? 0" :icon="Radio" />
      <StatCard label="Stale / terlambat" :value="staleCount" :icon="MapPin" hint="Lewat interval ping" />
      <StatCard label="Ditampilkan" :value="filtered.length" :icon="Users" />
      <StatCard label="Interval ping" :value="`${intervalMinutes} mnt`" :icon="MapPin" hint="Frekuensi update lokasi" />
    </div>

    <Card class="rounded-xl border-border/60 shadow-none">
      <CardHeader class="flex flex-row flex-wrap items-center justify-between gap-3">
        <div>
          <CardTitle class="text-base">Interval pengiriman lokasi</CardTitle>
          <p class="mt-0.5 text-sm text-muted-foreground">Seberapa sering aplikasi mobile mengirim ping GPS.</p>
        </div>
        <div class="flex items-end gap-2">
          <div class="grid gap-1">
            <Label class="text-xs text-muted-foreground">Interval</Label>
            <Select v-model="intervalMinutes" :disabled="!isAdmin">
              <SelectTrigger class="w-36"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 menit</SelectItem>
                <SelectItem value="10">10 menit</SelectItem>
                <SelectItem value="15">15 menit</SelectItem>
                <SelectItem value="20">20 menit</SelectItem>
                <SelectItem value="30">30 menit</SelectItem>
                <SelectItem value="60">60 menit</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button v-if="isAdmin" size="sm" :disabled="savingInterval" @click="saveInterval">
            {{ savingInterval ? '…' : 'Simpan' }}
          </Button>
        </div>
      </CardHeader>
    </Card>

    <div class="grid min-h-[calc(100vh-20rem)] gap-3 lg:grid-cols-[minmax(280px,340px)_1fr] lg:items-stretch">
      <Card class="rounded-xl border-border/60 shadow-none lg:max-h-[calc(100vh-20rem)] lg:overflow-y-auto">
        <CardHeader class="flex flex-row items-center justify-between">
          <div>
            <CardTitle class="text-base">Karyawan aktif</CardTitle>
            <p class="text-xs text-muted-foreground">{{ filtered.length }} sesi terbuka</p>
          </div>
          <Button variant="outline" size="sm" :disabled="loading" @click="refreshAll">Refresh</Button>
        </CardHeader>
        <CardContent class="space-y-3">
          <Input v-model="search" placeholder="Cari nama karyawan" />
          <EmptyState
            v-if="filtered.length === 0"
            :icon="MapPin"
            title="Tidak ada sesi aktif"
            description="Sesi lokasi muncul setelah karyawan mengirim ping GPS dari aplikasi mobile."
            compact
          />
          <div v-else class="space-y-2">
            <div
              v-for="s in filtered"
              :key="String(s.id)"
              class="rounded-lg border border-border/60 p-3 text-sm"
            >
              <p class="font-medium">{{ (s.employee as { name?: string })?.name ?? 'Karyawan' }}</p>
              <div class="mt-1 flex items-center gap-2">
                <Badge v-if="s.is_stale" variant="destructive" class="text-[10px]">Stale</Badge>
                <Badge v-else variant="secondary" class="text-[10px]">Live</Badge>
              </div>
              <p class="mt-0.5 text-xs text-muted-foreground">
                {{ Number(s.latitude).toFixed(5) }}, {{ Number(s.longitude).toFixed(5) }}
              </p>
              <p class="mt-1 text-xs text-muted-foreground">
                Terakhir: {{ formatTime(s.last_ping_at) }}
              </p>
            </div>
          </div>
          <div class="flex flex-wrap gap-2 pt-1">
            <Button variant="link" class="h-auto p-0" @click="router.push(ROUTES.geofence)">Atur geofence</Button>
            <Button variant="link" class="h-auto p-0" @click="router.push(ROUTES.reports)">Buka laporan</Button>
          </div>
        </CardContent>
      </Card>

      <Card class="flex min-h-[420px] flex-col overflow-hidden rounded-xl p-0 shadow-none lg:min-h-0">
        <CardContent class="relative min-h-[420px] flex-1 p-0 lg:min-h-[calc(100vh-20rem)]">
          <LocationMap
            full-height
            min-height="420px"
            :markers="mapMarkers"
            class="h-full min-h-[420px] rounded-none lg:min-h-full"
          />
        </CardContent>
      </Card>
    </div>
  </PageShell>
</template>
