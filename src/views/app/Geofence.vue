<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { MapPin, Search } from 'lucide-vue-next'
import { toast } from 'vue-sonner'

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
const geofences = ref<Array<Record<string, unknown>>>([])
const ipEntries = ref<IPWhitelistEntry[]>([])

const pointCount = computed(() => geofences.value.length)

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

function searchLocation() {
  toast.message('Gunakan klik peta untuk menambahkan titik geofence')
  markDirty()
}

async function saveSettings() {
  if (!auth.token || !auth.workspaceId) return
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
  }
}
</script>

<template>
  <PageShell
    title="Pengaturan Geofence"
    description="Atur titik lokasi, radius validasi, dan whitelist IP untuk workspace aktif."
    class="pb-24"
  >
    <Card class="rounded-xl shadow-none">
      <CardHeader class="flex flex-row flex-wrap items-start justify-between gap-3 px-4 pt-4 pb-2">
        <div>
          <CardTitle class="text-base">Kebijakan Lokasi & Jaringan</CardTitle>
          <p class="mt-0.5 text-sm text-muted-foreground">
            Atur area absensi, whitelist jaringan, dan kontrol validasi scan sesuai kebijakan kantor.
          </p>
        </div>
        <div class="flex items-center gap-2">
          <div class="text-right text-xs">
            <p class="font-medium">Geofence</p>
            <p class="text-muted-foreground">Status absensi</p>
          </div>
          <Switch v-model="geofenceEnabled" @update:model-value="markDirty" />
        </div>
      </CardHeader>
      <CardContent class="px-4 pb-4">
        <div class="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
          Fitur geofence dan whitelist IP tersedia di paket Pro.
        </div>
      </CardContent>
    </Card>

    <div class="grid min-h-[calc(100vh-18rem)] gap-3 lg:grid-cols-[minmax(300px,380px)_1fr] lg:items-stretch">
      <div class="flex flex-col gap-3">
        <Card class="rounded-xl shadow-none">
          <CardHeader class="flex flex-row items-center justify-between px-4 pt-4 pb-2">
            <CardTitle class="text-base">Titik Lokasi</CardTitle>
            <Badge variant="secondary">{{ pointCount }} / 30</Badge>
          </CardHeader>
          <CardContent class="space-y-3 px-4 pb-4">
            <div class="flex gap-2">
              <div class="relative min-w-0 flex-1">
                <Search class="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  v-model="locationQuery"
                  class="pl-9"
                  placeholder="Cari kantor, alamat, atau geoloc..."
                  @input="markDirty"
                />
              </div>
              <Button size="sm" @click="searchLocation">Cari</Button>
            </div>
            <p class="text-xs text-muted-foreground">
              Cari alamat, tempel URL Google Maps, atau klik peta di kanan untuk menambahkan titik.
            </p>
            <div class="flex min-h-36 flex-col items-center justify-center rounded-lg border border-dashed border-border/70 bg-muted/15 px-4 py-8 text-center text-sm text-muted-foreground">
              <MapPin class="mb-2 size-5 opacity-60" />
              Belum ada titik. Cari alamat atau klik peta untuk menambahkan lokasi.
            </div>
          </CardContent>
        </Card>

        <Card class="rounded-xl shadow-none">
          <CardHeader class="px-4 pt-4 pb-2">
            <CardTitle class="text-base">Parameter Validasi</CardTitle>
          </CardHeader>
          <CardContent class="space-y-3 px-4 pb-4">
            <div class="grid gap-1.5">
              <Label>Timezone</Label>
              <Select v-model="timezone" @update:model-value="markDirty">
                <SelectTrigger><SelectValue placeholder="Asia/Jakarta" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Asia/Jakarta">Asia/Jakarta</SelectItem>
                  <SelectItem value="Asia/Makassar">Asia/Makassar</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div class="grid gap-3 sm:grid-cols-2">
              <div class="grid gap-1.5">
                <Label>Radius (meter)</Label>
                <Input v-model="radius" type="number" @input="markDirty" />
              </div>
              <div class="grid gap-1.5">
                <Label>Akurasi GPS maks. (m)</Label>
                <Input v-model="maxGpsAccuracy" type="number" @input="markDirty" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card class="rounded-xl shadow-none">
          <CardHeader class="flex flex-row items-center justify-between px-4 pt-4 pb-2">
            <div>
              <CardTitle class="text-base">IP Whitelist</CardTitle>
              <p class="text-xs text-muted-foreground">Hanya izinkan IP tertentu</p>
            </div>
            <Switch v-model="ipWhitelistEnabled" @update:model-value="markDirty" />
          </CardHeader>
          <CardContent class="px-4 pb-4">
            <Textarea
              v-model="ipAddresses"
              rows="3"
              placeholder="192.168.1.0/24&#10;10.0.0.5"
              class="font-mono text-xs"
              :disabled="!ipWhitelistEnabled"
              @input="markDirty"
            />
          </CardContent>
        </Card>
      </div>

      <Card class="flex min-h-[420px] flex-col overflow-hidden rounded-xl p-0 shadow-none lg:min-h-0">
        <CardContent class="relative min-h-[420px] flex-1 p-0 lg:min-h-[calc(100vh-18rem)]">
          <LocationMap full-height min-height="420px" class="h-full min-h-[420px] rounded-none lg:min-h-full" />
        </CardContent>
      </Card>
    </div>

    <div
      v-if="dirty"
      class="fixed inset-x-0 bottom-6 z-30 flex justify-center px-4"
    >
      <div class="flex w-full max-w-xl items-center justify-between gap-3 rounded-full border bg-background/95 px-4 py-2.5 shadow-lg backdrop-blur">
        <p class="text-sm text-muted-foreground">Ada perubahan yang belum disimpan?</p>
        <Button size="sm" @click="saveSettings">Simpan Pengaturan</Button>
      </div>
    </div>
  </PageShell>
</template>
