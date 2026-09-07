<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { MapPin, Search, Trash2 } from 'lucide-vue-next'
import { toast } from 'vue-sonner'

import EmptyState from '@/components/app/empty-state.vue'
import LocationMap from '@/components/app/location-map.vue'
import PageShell from '@/components/app/page-shell.vue'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { useWorkspaceLoader } from '@/composables/useWorkspaceData'
import { searchAddress } from '@/lib/geocode'
import { api, type IPWhitelistEntry } from '@/lib/api'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const geofenceEnabled = ref(false)
const ipWhitelistEnabled = ref(false)
const locationQuery = ref('')
const timezone = ref('Asia/Jakarta')
const radius = ref('100')
const maxGpsAccuracy = ref('100')
const ipAddresses = ref('')
const dirty = ref(false)
const saving = ref(false)
const searching = ref(false)
const geofences = ref<Array<Record<string, unknown>>>([])
const ipEntries = ref<IPWhitelistEntry[]>([])
const mapRef = ref<InstanceType<typeof LocationMap> | null>(null)
const selectedId = ref<number | null>(null)

const MAX_POINTS = 30

const isAdmin = computed(() =>
  auth.activeMembership?.role === 'owner' || auth.activeMembership?.role === 'admin',
)

const pointCount = computed(() => geofences.value.length)

const mapCircles = computed(() =>
  geofences.value.map((g) => ({
    lat: Number(g.latitude),
    lng: Number(g.longitude),
    radiusM: Number(g.radius_meters) || Number(radius.value) || 100,
    label: String(g.name ?? 'Geofence'),
  })),
)

const { load: reloadSettings } = useWorkspaceLoader(async (token, workspaceId) => {
  const [settingsRes, fences] = await Promise.all([
    api.getWorkspaceSettings(token, workspaceId),
    api.listGeofences(token, workspaceId),
  ])
  geofenceEnabled.value = settingsRes.data.geofence_enabled
  ipWhitelistEnabled.value = settingsRes.data.ip_whitelist_enabled
  timezone.value = settingsRes.data.timezone
  maxGpsAccuracy.value = String(settingsRes.data.max_gps_accuracy_m)
  geofences.value = fences as Array<Record<string, unknown>>
  ipEntries.value = settingsRes.ip_whitelist ?? []
  ipAddresses.value = ipEntries.value.map((e) => e.cidr).join('\n')
  dirty.value = false
  return settingsRes
})

watch(() => auth.workspaceId, () => { void reloadSettings() }, { immediate: true })

function markDirty() {
  dirty.value = true
}

async function searchLocation() {
  if (!locationQuery.value.trim()) return
  searching.value = true
  try {
    const result = await searchAddress(locationQuery.value)
    if (!result) {
      toast.error('Lokasi tidak ditemukan')
      return
    }
    mapRef.value?.flyTo(result.lat, result.lng)
    if (isAdmin.value) {
      await addGeofenceAt(result.lat, result.lng, result.label.split(',')[0] || result.label)
    } else {
      toast.success('Lokasi ditemukan di peta')
    }
  } catch {
    toast.error('Gagal mencari alamat')
  } finally {
    searching.value = false
  }
}

async function addGeofenceAt(lat: number, lng: number, name?: string) {
  if (!auth.token || !auth.workspaceId || !isAdmin.value) return
  if (geofences.value.length >= MAX_POINTS) {
    toast.error(`Maksimal ${MAX_POINTS} titik geofence`)
    return
  }
  try {
    const row = await api.createGeofence(auth.token, auth.workspaceId, {
      name: name?.trim() || `Titik ${geofences.value.length + 1}`,
      latitude: lat,
      longitude: lng,
      radius_meters: Number(radius.value) || 100,
      active: true,
    })
    geofences.value = [row, ...geofences.value]
    selectedId.value = Number(row.id)
    toast.success('Titik geofence ditambahkan')
  } catch (e) {
    toast.error(e instanceof Error ? e.message : 'Gagal menambah titik')
  }
}

async function onMapClick(lat: number, lng: number) {
  if (!isAdmin.value) return
  await addGeofenceAt(lat, lng)
}

async function removeGeofence(id: number) {
  if (!auth.token || !isAdmin.value) return
  try {
    await api.deleteGeofence(auth.token, id)
    geofences.value = geofences.value.filter((g) => Number(g.id) !== id)
    if (selectedId.value === id) selectedId.value = null
    toast.success('Titik dihapus')
  } catch (e) {
    toast.error(e instanceof Error ? e.message : 'Gagal menghapus titik')
  }
}

function focusGeofence(g: Record<string, unknown>) {
  selectedId.value = Number(g.id)
  mapRef.value?.flyTo(Number(g.latitude), Number(g.longitude))
}

async function saveSettings() {
  if (!auth.token || !auth.workspaceId || !isAdmin.value) return
  saving.value = true
  try {
    await api.updateWorkspaceSettings(auth.token, auth.workspaceId, {
      geofence_enabled: geofenceEnabled.value,
      ip_whitelist_enabled: ipWhitelistEnabled.value,
      timezone: timezone.value,
      max_gps_accuracy_m: Number(maxGpsAccuracy.value),
    })

    const desired = ipAddresses.value.split('\n').map((s) => s.trim()).filter(Boolean)
    const existing = new Set(ipEntries.value.map((e) => e.cidr))
    for (const cidr of desired) {
      if (!existing.has(cidr)) {
        await api.createIPWhitelist(auth.token, auth.workspaceId, { cidr })
      }
    }
    for (const entry of ipEntries.value) {
      if (!desired.includes(entry.cidr)) {
        await api.deleteIPWhitelist(auth.token, entry.id)
      }
    }

    toast.success('Pengaturan geofence disimpan')
    dirty.value = false
    await reloadSettings()
  } catch (e) {
    toast.error(e instanceof Error ? e.message : 'Gagal menyimpan pengaturan')
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <PageShell
    title="Pengaturan Geofence"
    description="Atur titik lokasi, radius validasi, dan whitelist IP untuk workspace aktif."
    class="pb-24"
  >
    <Card class="rounded-xl border-border/60 shadow-none">
      <CardHeader class="flex flex-row flex-wrap items-start justify-between gap-3">
        <div>
          <CardTitle class="text-base">Kebijakan lokasi & jaringan</CardTitle>
          <p class="mt-0.5 text-sm text-muted-foreground">
            Aktifkan geofence agar absensi hanya valid di area yang ditentukan.
          </p>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-xs text-muted-foreground">{{ geofenceEnabled ? 'Aktif' : 'Nonaktif' }}</span>
          <Switch v-model="geofenceEnabled" :disabled="!isAdmin" @update:model-value="markDirty" />
        </div>
      </CardHeader>
    </Card>

    <div class="grid min-h-[calc(100vh-18rem)] gap-3 lg:grid-cols-[minmax(300px,380px)_1fr] lg:items-stretch">
      <div class="flex flex-col gap-3">
        <Card class="rounded-xl border-border/60 shadow-none">
          <CardHeader class="flex flex-row items-center justify-between">
            <CardTitle class="text-base">Titik lokasi</CardTitle>
            <Badge variant="secondary">{{ pointCount }} / {{ MAX_POINTS }}</Badge>
          </CardHeader>
          <CardContent class="space-y-3">
            <div class="flex gap-2">
              <div class="relative min-w-0 flex-1">
                <Search class="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  v-model="locationQuery"
                  class="pl-9"
                  placeholder="Cari alamat atau gedung…"
                  @keydown.enter.prevent="searchLocation"
                />
              </div>
              <Button size="sm" :disabled="searching" @click="searchLocation">
                {{ searching ? '…' : 'Cari' }}
              </Button>
            </div>
            <p v-if="isAdmin" class="text-xs text-muted-foreground">
              Klik peta di kanan untuk menambah titik, atau cari alamat di atas.
            </p>

            <EmptyState
              v-if="pointCount === 0"
              :icon="MapPin"
              title="Belum ada titik geofence"
              description="Tambahkan titik lokasi kantor atau site kerja untuk validasi absensi."
              compact
            />
            <div v-else class="max-h-48 space-y-2 overflow-y-auto">
              <button
                v-for="g in geofences"
                :key="String(g.id)"
                type="button"
                class="flex w-full items-center justify-between gap-2 rounded-lg border px-3 py-2 text-left text-sm transition-colors hover:bg-muted/40"
                :class="selectedId === Number(g.id) ? 'border-primary bg-muted/30' : 'border-border/60'"
                @click="focusGeofence(g)"
              >
                <div class="min-w-0">
                  <p class="truncate font-medium">{{ g.name }}</p>
                  <p class="truncate text-xs text-muted-foreground">
                    {{ Number(g.latitude).toFixed(5) }}, {{ Number(g.longitude).toFixed(5) }}
                    · {{ g.radius_meters }}m
                  </p>
                </div>
                <Button
                  v-if="isAdmin"
                  variant="ghost"
                  size="icon-sm"
                  class="shrink-0 text-destructive"
                  @click.stop="removeGeofence(Number(g.id))"
                >
                  <Trash2 class="size-4" />
                </Button>
              </button>
            </div>
          </CardContent>
        </Card>

        <Card class="rounded-xl border-border/60 shadow-none">
          <CardHeader>
            <CardTitle class="text-base">Parameter validasi</CardTitle>
          </CardHeader>
          <CardContent class="space-y-3">
            <div class="grid gap-1.5">
              <Label>Timezone</Label>
              <Select v-model="timezone" :disabled="!isAdmin" @update:model-value="markDirty">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Asia/Jakarta">Asia/Jakarta</SelectItem>
                  <SelectItem value="Asia/Makassar">Asia/Makassar</SelectItem>
                  <SelectItem value="Asia/Jayapura">Asia/Jayapura</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div class="grid gap-3 sm:grid-cols-2">
              <div class="grid gap-1.5">
                <Label>Radius default (m)</Label>
                <Input v-model="radius" type="number" min="10" max="5000" :disabled="!isAdmin" @input="markDirty" />
              </div>
              <div class="grid gap-1.5">
                <Label>Akurasi GPS maks. (m)</Label>
                <Input v-model="maxGpsAccuracy" type="number" min="1" :disabled="!isAdmin" @input="markDirty" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card class="rounded-xl border-border/60 shadow-none">
          <CardHeader class="flex flex-row items-center justify-between">
            <div>
              <CardTitle class="text-base">IP whitelist</CardTitle>
              <p class="text-xs text-muted-foreground">Opsional — batasi akses API dari jaringan tertentu</p>
            </div>
            <Switch v-model="ipWhitelistEnabled" :disabled="!isAdmin" @update:model-value="markDirty" />
          </CardHeader>
          <CardContent>
            <Textarea
              v-model="ipAddresses"
              rows="3"
              placeholder="192.168.1.0/24&#10;10.0.0.5"
              class="font-mono text-xs"
              :disabled="!ipWhitelistEnabled || !isAdmin"
              @input="markDirty"
            />
          </CardContent>
        </Card>
      </div>

      <Card class="flex min-h-[420px] flex-col overflow-hidden rounded-xl p-0 shadow-none lg:min-h-0">
        <CardContent class="relative min-h-[420px] flex-1 p-0 lg:min-h-[calc(100vh-18rem)]">
          <LocationMap
            ref="mapRef"
            full-height
            min-height="420px"
            :circles="mapCircles"
            :interactive="isAdmin"
            class="h-full min-h-[420px] rounded-none lg:min-h-full"
            @map-click="onMapClick"
          />
        </CardContent>
      </Card>
    </div>

    <div
      v-if="dirty && isAdmin"
      class="fixed inset-x-0 bottom-6 z-30 flex justify-center px-4"
    >
      <div class="flex w-full max-w-xl items-center justify-between gap-3 rounded-full border bg-background/95 px-4 py-2.5 shadow-lg backdrop-blur">
        <p class="text-sm text-muted-foreground">Perubahan belum disimpan</p>
        <Button size="sm" :disabled="saving" @click="saveSettings">
          {{ saving ? 'Menyimpan…' : 'Simpan pengaturan' }}
        </Button>
      </div>
    </div>
  </PageShell>
</template>
