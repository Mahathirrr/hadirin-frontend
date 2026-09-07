<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Compass,
  Sparkles,
} from 'lucide-vue-next'

import PageShell from '@/components/app/page-shell.vue'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { ROUTES } from '@/lib/routes'
import { useAuthStore } from '@/stores/auth'

type GuideStep = {
  id: number
  label: string
  title: string
  description: string
  actionLabel: string
  route: string
}

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()

const steps: GuideStep[] = [
  {
    id: 1,
    label: 'Langkah 1',
    title: 'Baca ringkasan operasional dulu',
    description:
      'Gunakan halaman ringkasan untuk melihat status kehadiran, anomali, dan ritme workspace sebelum mengambil keputusan berikutnya.',
    actionLabel: 'Buka ringkasan',
    route: ROUTES.summary,
  },
  {
    id: 2,
    label: 'Langkah 2',
    title: 'Undang dan rapikan akses tim',
    description:
      'Tambah anggota baru, cek role admin atau karyawan, lalu pastikan semua orang masuk ke workspace yang benar sejak awal.',
    actionLabel: 'Kelola anggota',
    route: ROUTES.workspace,
  },
  {
    id: 3,
    label: 'Langkah 3',
    title: 'Aktifkan device QR dan aturan lokasi',
    description:
      'Sambungkan device QR, verifikasi heartbeat, lalu rapikan geofence agar flow scan di lapangan konsisten dan aman.',
    actionLabel: 'Siapkan device QR',
    route: ROUTES.qrDevices,
  },
  {
    id: 4,
    label: 'Langkah 4',
    title: 'Pantau laporan dan tindak lanjut',
    description:
      'Masuk ke laporan untuk membaca tren kehadiran, mengecek exception, dan menyiapkan tindak lanjut admin harian.',
    actionLabel: 'Lihat laporan',
    route: ROUTES.reports,
  },
]

const wizardMode = computed(() => route.query.flow === 'wizard')
const currentStep = ref(1)

watch(
  () => route.query.step,
  (value) => {
    const parsed = Number(value)
    if (parsed >= 1 && parsed <= steps.length) currentStep.value = parsed
  },
  { immediate: true },
)

const activeStep = computed(() => steps[currentStep.value - 1]!)
const progressValue = computed(() => (currentStep.value / steps.length) * 100)

function openWizard(step = 1) {
  router.push({ path: ROUTES.guide, query: { flow: 'wizard', step: String(step) } })
}

function goToOverview() {
  router.push({ path: ROUTES.guide })
}

function goBack() {
  if (currentStep.value <= 1) {
    goToOverview()
    return
  }
  router.push({ path: ROUTES.guide, query: { flow: 'wizard', step: String(currentStep.value - 1) } })
}

function goNext() {
  if (currentStep.value >= steps.length) {
    goToOverview()
    return
  }
  router.push({ path: ROUTES.guide, query: { flow: 'wizard', step: String(currentStep.value + 1) } })
}

function openStepRoute(step: GuideStep) {
  router.push(step.route)
}
</script>

<template>
  <PageShell v-if="!wizardMode" title="Ringkasan Alur Kerja">
    <template #header>
      <div class="space-y-3">
        <div class="flex flex-wrap items-center gap-2">
          <Badge class="gap-1 bg-foreground text-background hover:bg-foreground/90">
            <Sparkles class="size-3" />
            Panduan
          </Badge>
          <Badge variant="secondary">Superadmin</Badge>
        </div>
        <p class="text-sm text-muted-foreground">{{ auth.workspaceName }}</p>
        <h1 class="text-2xl font-bold tracking-tight md:text-3xl">Ringkasan Alur Kerja</h1>
        <p class="max-w-2xl text-sm text-muted-foreground">
          Panduan ini menunjukkan urutan kerja utama: buka ringkasan, undang tim, aktifkan perangkat QR,
          lalu pantau laporan tanpa bolak-balik menebak menu.
        </p>
        <div class="flex flex-wrap gap-2 pt-1">
          <Button variant="outline" size="sm" @click="router.push(ROUTES.summary)">Kembali</Button>
          <Button size="sm" @click="openWizard(1)">Mulai Langkah Pertama</Button>
        </div>
      </div>
    </template>

    <div class="mx-auto flex w-full max-w-2xl flex-col gap-3">
      <Card
        v-for="step in steps"
        :key="step.id"
        class="cursor-pointer rounded-xl shadow-none transition-colors hover:bg-muted/20"
        @click="openStepRoute(step)"
      >
        <CardContent class="p-4">
          <div class="flex items-start justify-between gap-3">
            <p class="text-xs font-medium tracking-wide text-muted-foreground uppercase">{{ step.label }}</p>
            <ArrowUpRight class="size-4 shrink-0 text-muted-foreground" />
          </div>
          <h2 class="mt-2 text-lg font-semibold">{{ step.title }}</h2>
          <p class="mt-1 text-sm text-muted-foreground">{{ step.description }}</p>
        </CardContent>
      </Card>
    </div>
  </PageShell>

  <div v-else class="flex min-h-[calc(100vh-12rem)] flex-col items-center justify-center px-4 py-8">
    <div class="w-full max-w-lg space-y-5">
      <div class="text-center">
        <div class="mx-auto mb-4 flex size-11 items-center justify-center rounded-full bg-foreground text-background">
          <Compass class="size-5" />
        </div>
        <p class="text-sm text-muted-foreground">{{ auth.workspaceName }} • Superadmin</p>
        <h1 class="mt-3 text-xl font-bold tracking-tight md:text-2xl">
          Atur ritme kerja tim sebelum hari pertama dimulai.
        </h1>
        <p class="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          Panduan ini menunjukkan urutan kerja utama: buka ringkasan, undang tim, aktifkan perangkat QR,
          lalu pantau laporan tanpa bolak-balik menebak menu.
        </p>
      </div>

      <div class="space-y-2">
        <div class="flex items-center justify-between text-xs text-muted-foreground">
          <span>Progress</span>
          <span>{{ currentStep }} dari {{ steps.length }}</span>
        </div>
        <Progress :value="progressValue" class="h-2 bg-muted" />
      </div>

      <Card class="rounded-xl shadow-none">
        <CardContent class="space-y-4 p-5">
          <div>
            <p class="text-xs font-medium tracking-wide text-muted-foreground uppercase">{{ activeStep.label }}</p>
            <h2 class="mt-2 text-lg font-semibold">{{ activeStep.title }}</h2>
            <p class="mt-2 text-sm text-muted-foreground">{{ activeStep.description }}</p>
          </div>
          <Button variant="outline" class="w-full justify-between" @click="openStepRoute(activeStep)">
            {{ activeStep.actionLabel }}
            <ArrowUpRight class="size-4" />
          </Button>
        </CardContent>
      </Card>

      <div class="flex items-center justify-between border-t pt-4">
        <Button variant="ghost" size="sm" @click="goBack">Kembali</Button>
        <Button v-if="currentStep < steps.length" size="sm" @click="goNext">
          Lanjut
          <ArrowRight class="size-4" />
        </Button>
        <Button v-else size="sm" @click="goToOverview">
          Selesai
          <CheckCircle2 class="size-4" />
        </Button>
      </div>
    </div>
  </div>
</template>
