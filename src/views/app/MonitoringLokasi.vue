<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'

import LocationMap from '@/components/app/location-map.vue'
import PageShell from '@/components/app/page-shell.vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useWorkspaceLoader } from '@/composables/useWorkspaceData'
import { api } from '@/lib/api'
import { ROUTES } from '@/lib/routes'

const router = useRouter()

const { data: sessions, loading, load } = useWorkspaceLoader(async (token, workspaceId) =>
  api.listLocationSessions(token, workspaceId, true) as Promise<Array<Record<string, unknown>>>,
)

const mapMarkers = computed(() =>
  (sessions.value ?? []).map((s) => ({
    lat: Number(s.latitude),
    lng: Number(s.longitude),
    label: (s.employee as { name?: string })?.name ?? 'Karyawan',
  })),
)
</script>

<template>
  <PageShell
    title="Monitoring Lokasi"
    description="Pantau posisi karyawan yang sedang aktif bekerja. GPS indoor tidak akurat; jangan jadikan satu-satunya bukti disiplin."
  >
    <div class="grid min-h-[calc(100vh-16rem)] gap-3 lg:grid-cols-[minmax(280px,340px)_1fr] lg:items-stretch">
      <Card class="rounded-xl shadow-none lg:max-h-[calc(100vh-16rem)] lg:overflow-y-auto">
        <CardHeader class="flex flex-row items-center justify-between px-4 pt-4 pb-2">
          <div>
            <CardTitle class="text-base">Karyawan aktif</CardTitle>
            <p class="text-xs text-muted-foreground">{{ sessions?.length ?? 0 }} sesi terbuka</p>
          </div>
          <Button variant="outline" size="sm" :disabled="loading" @click="load">Refresh</Button>
        </CardHeader>
        <CardContent class="space-y-3 px-4 pb-4">
          <Input placeholder="Cari nama karyawan" />
          <div v-if="(sessions?.length ?? 0) === 0" class="rounded-lg border border-dashed border-border/70 bg-muted/15 px-4 py-10 text-center text-sm text-muted-foreground">
            Belum ada sesi lokasi aktif. Karyawan perlu mengirim ping GPS dari aplikasi mobile.
          </div>
          <div v-for="s in sessions" :key="String(s.id)" class="rounded-lg border p-3 text-sm">
            <p class="font-medium">{{ (s.employee as { name?: string })?.name ?? 'Karyawan' }}</p>
            <p class="text-xs text-muted-foreground">{{ s.latitude }}, {{ s.longitude }}</p>
          </div>
          <Button variant="link" class="h-auto p-0" @click="router.push(ROUTES.geofence)">Atur geofence</Button>
        </CardContent>
      </Card>

      <Card class="flex min-h-[420px] flex-col overflow-hidden rounded-xl p-0 shadow-none lg:min-h-0">
        <CardContent class="relative min-h-[420px] flex-1 p-0 lg:min-h-[calc(100vh-16rem)]">
          <LocationMap full-height min-height="420px" :markers="mapMarkers" class="h-full min-h-[420px] rounded-none lg:min-h-full" />
        </CardContent>
      </Card>
    </div>
  </PageShell>
</template>
