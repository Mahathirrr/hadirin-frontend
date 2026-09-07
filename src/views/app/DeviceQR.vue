<script setup lang="ts">
import { computed, ref } from 'vue'
import { toast } from 'vue-sonner'

import PageShell from '@/components/app/page-shell.vue'
import StatCard from '@/components/app/stat-card.vue'
import TableEmpty from '@/components/app/table-empty.vue'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useWorkspaceLoader } from '@/composables/useWorkspaceData'
import { api, API_URL } from '@/lib/api'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const regCode = ref('')

const { data: devices, loading, load } = useWorkspaceLoader(async (token, workspaceId) =>
  api.listQRDevices(token, workspaceId) as Promise<Array<Record<string, unknown>>>,
)

const activeCount = computed(() => (devices.value ?? []).filter((d) => d.active).length)
const onlineCount = computed(() =>
  (devices.value ?? []).filter((d) => d.last_seen_at).length,
)

async function generateCode() {
  if (!auth.token || !auth.workspaceId) return
  try {
    const row = await api.createQRRegistrationCode(auth.token, auth.workspaceId)
    regCode.value = row.code
    toast.success('Kode registrasi dibuat (15 menit)')
  } catch (e) {
    toast.error(e instanceof Error ? e.message : 'Gagal generate code')
  }
}

const pairingUrl = computed(() => `${API_URL}/qr-devices/register`)
</script>

<template>
  <PageShell
    title="Device QR"
    description="Kelola device QR permanen untuk check-in di lokasi kerja."
  >
    <Card class="rounded-xl shadow-none">
      <CardHeader class="flex flex-row flex-wrap items-start justify-between gap-3 px-4 pt-4 pb-2">
        <div>
          <Badge class="mb-1.5 bg-emerald-100 text-emerald-800 hover:bg-emerald-100">Admin</Badge>
          <CardTitle class="text-base">Kelola device QR permanen dari workspace aktif</CardTitle>
          <p class="mt-1 text-sm text-muted-foreground">
            Buat kode registrasi, pantau status device, dan cabut akses perangkat yang tidak dipakai lagi.
          </p>
        </div>
        <div class="flex gap-2">
          <Button size="sm" @click="generateCode">Generate code</Button>
          <Button variant="outline" size="sm" :disabled="loading" @click="load">Refresh</Button>
        </div>
      </CardHeader>
      <CardContent class="px-4 pb-4">
        <div class="grid gap-3 sm:grid-cols-3">
          <StatCard title="Device aktif" :value="activeCount" :hint="`dari ${devices?.length ?? 0} device`" />
          <StatCard title="Sedang online" :value="onlineCount" />
          <StatCard title="Registration code aktif" :value="regCode ? 1 : 0" />
        </div>
        <p v-if="regCode" class="mt-3 rounded-lg border bg-muted/30 p-3 font-mono text-sm">
          Kode: <strong>{{ regCode }}</strong> — POST {{ pairingUrl }}
        </p>
      </CardContent>
    </Card>

    <Card class="rounded-xl shadow-none">
      <CardHeader class="px-4 pt-4 pb-2">
        <CardTitle class="text-base">Daftar device</CardTitle>
      </CardHeader>
      <CardContent class="px-4 pb-4">
        <Table v-if="(devices?.length ?? 0) > 0">
          <TableHeader>
            <TableRow>
              <TableHead>Nama</TableHead>
              <TableHead>Kode</TableHead>
              <TableHead>Lokasi</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="d in devices" :key="String(d.id)">
              <TableCell>{{ d.name }}</TableCell>
              <TableCell class="font-mono text-xs">{{ d.device_code }}</TableCell>
              <TableCell>{{ d.location || '—' }}</TableCell>
              <TableCell>{{ d.active ? 'Aktif' : 'Nonaktif' }}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <TableEmpty v-else message="Belum ada device QR terdaftar." />
      </CardContent>
    </Card>
  </PageShell>
</template>
