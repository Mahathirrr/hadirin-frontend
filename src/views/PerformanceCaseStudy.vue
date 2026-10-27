<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ROUTES } from '@/lib/routes'

type EndpointStat = {
  name: string
  cold_first_ms: number
  warm_excluding_first: { p50_ms: number; p95_ms: number; avg_ms: number }
}

type PerfFile = {
  captured_at: string
  endpoints: EndpointStat[]
}

const before = ref<PerfFile | null>(null)
const after = ref<PerfFile | null>(null)
const loadError = ref('')

onMounted(async () => {
  try {
    const [b, a] = await Promise.all([
      fetch('/perf/results-before.json').then((r) => r.json()),
      fetch('/perf/results-after.json').then((r) => r.json()),
    ])
    before.value = b
    after.value = a
  } catch {
    loadError.value = 'Data perbandingan kecepatan belum tersedia.'
  }
})

function findDash(file: PerfFile | null) {
  return file?.endpoints.find((e) => e.name.includes('dashboard')) ?? null
}

function findAtt(file: PerfFile | null) {
  return file?.endpoints.find((e) => e.name.includes('attendance')) ?? null
}

const dashImprovement = computed(() => {
  const b = findDash(before.value)?.warm_excluding_first.p50_ms
  const a = findDash(after.value)?.warm_excluding_first.p50_ms
  if (!b || !a) return null
  return Math.round((1 - a / b) * 100)
})
</script>

<template>
  <div class="min-h-screen bg-background">
    <header class="border-b bg-card/40 px-4 py-6">
      <div class="mx-auto flex max-w-4xl flex-col gap-2">
        <RouterLink :to="ROUTES.landing" class="text-sm text-muted-foreground hover:underline">← Hadirin</RouterLink>
        <h1 class="text-2xl font-semibold tracking-tight">Kecepatan & stabilitas</h1>
        <p class="text-muted-foreground text-sm max-w-2xl">
          Ringkasan hasil pengukuran waktu muat halaman ringkasan dan daftar absensi setelah penyesuaian produk.
          Angka di bawah membantu tim admin merasakan respons aplikasi saat dipakai sehari-hari.
        </p>
      </div>
    </header>

    <main class="mx-auto max-w-4xl space-y-6 px-4 py-8">
      <p v-if="loadError" class="text-destructive text-sm">{{ loadError }}</p>

      <Card v-if="dashImprovement != null">
        <CardHeader>
          <CardTitle>Halaman ringkasan</CardTitle>
          <CardDescription>Waktu muat rata-rata setelah beberapa kali dibuka (pola pemakaian harian)</CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="flex flex-wrap items-end gap-6">
            <div>
              <p class="text-xs text-muted-foreground">Sebelum</p>
              <p class="text-3xl font-bold tabular-nums">{{ findDash(before)?.warm_excluding_first.p50_ms }} ms</p>
            </div>
            <div class="text-muted-foreground pb-1">→</div>
            <div>
              <p class="text-xs text-muted-foreground">Sesudah</p>
              <p class="text-3xl font-bold tabular-nums text-emerald-600">{{ findDash(after)?.warm_excluding_first.p50_ms }} ms</p>
            </div>
            <p class="text-sm text-muted-foreground pb-1">≈ {{ dashImprovement }}% lebih cepat</p>
          </div>
          <img
            src="/perf/hadirin-performance-diagram.svg"
            alt="Ilustrasi alur peningkatan kecepatan Hadirin"
            class="w-full rounded-lg border bg-white p-2 dark:invert dark:brightness-90"
            width="920"
            height="420"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Yang kami prioritaskan</CardTitle>
        </CardHeader>
        <CardContent class="space-y-3 text-sm text-muted-foreground">
          <p><strong class="text-foreground">Respons dashboard:</strong> ringkasan kehadiran terasa lebih cepat saat dibuka berulang.</p>
          <p><strong class="text-foreground">Daftar absensi:</strong> pencarian dan scroll harian lebih ringan.</p>
          <p><strong class="text-foreground">Pengalaman landing:</strong> halaman utama tetap ringan saat pertama kali dibuka.</p>
        </CardContent>
      </Card>

      <Card v-if="before && after">
        <CardHeader>
          <CardTitle>Daftar absensi harian</CardTitle>
        </CardHeader>
        <CardContent class="flex gap-8 text-sm">
          <span>Sebelum: <strong class="tabular-nums">{{ findAtt(before)?.warm_excluding_first.p50_ms }} ms</strong></span>
          <span>Sesudah: <strong class="tabular-nums text-emerald-600">{{ findAtt(after)?.warm_excluding_first.p50_ms }} ms</strong></span>
        </CardContent>
      </Card>
    </main>
  </div>
</template>
