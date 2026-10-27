<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import {
  CheckCircle2,
  Clock,
  MapPin,
  Search,
  ShieldCheck,
  TrendingUp,
  UserCheck,
} from 'lucide-vue-next'

import PersonAvatar from '@/components/app/person-avatar.vue'
import { api, type PublicCatalog } from '@/lib/api'
import { sanitizeDisplayText } from '@/lib/display-text'
import { timezoneAbbrev } from '@/lib/timezone'
import { personAvatarUrl } from '@/lib/user-avatar'

const catalog = ref<PublicCatalog | null>(null)
const loading = ref(true)

onMounted(async () => {
  try {
    catalog.value = await api.publicCatalog()
  } catch {
    catalog.value = null
  } finally {
    loading.value = false
  }
})

const stats = computed(() => catalog.value?.stats)
const recentAttendance = computed(() => catalog.value?.recent_attendance ?? [])
const highlight = computed(() => catalog.value?.highlight)

const highlightVerificationLabel = computed(() => {
  const h = highlight.value
  if (!h) return ''
  if (h.face_verified) return 'Face ID terverifikasi'
  if (h.check_in_method === 'qr') return 'Check-in via QR device'
  if (h.check_in_method === 'face') return 'Check-in metode wajah'
  if (h.check_in_method) return `Check-in: ${h.check_in_method}`
  return 'Check-in tercatat'
})

const attendanceRate = computed(() => {
  const rate = Math.min(100, stats.value?.attendance_rate ?? 0)
  return `${rate.toFixed(1)}%`
})

const presentSummary = computed(() => {
  const attended =
    stats.value?.today_attended ??
    Math.min(
      stats.value?.active_employees ?? 0,
      (stats.value?.today_present ?? 0) + (stats.value?.today_late ?? 0),
    )
  const total = stats.value?.active_employees ?? 0
  return `${attended} dari ${total} karyawan hadir`
})

const onTimeSummary = computed(() => {
  const late = stats.value?.today_late ?? 0
  if (late === 0) return 'Semua tepat waktu'
  if (late === 1) return 'Hanya 1 keterlambatan'
  return `${late} keterlambatan hari ini`
})

const geofenceSummary = computed(() => {
  const count = stats.value?.active_geofences ?? 0
  return count === 1 ? '1 titik aktif' : `${count} cabang tersinkron`
})

const faceSummary = computed(() => {
  const enrolled = stats.value?.face_enrolled ?? 0
  const total = stats.value?.active_employees ?? 0
  if (total === 0) return 'Face ID siap digunakan'
  return `${enrolled} dari ${total} karyawan terdaftar`
})

const previewTimezone = computed(
  () => stats.value?.timezone ?? 'Asia/Jakarta',
)

const nowLabel = computed(() => {
  const tz = previewTimezone.value
  const parts = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    hour12: false,
    timeZone: tz,
  }).formatToParts(new Date())
  const hour = Number(parts.find((p) => p.type === 'hour')?.value ?? '0')
  const clock =
    new Intl.DateTimeFormat('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: tz,
    }).format(new Date()) + ` ${timezoneAbbrev(tz)}`

  let shift = 'Shift Siang'
  if (hour >= 5 && hour < 12) shift = 'Shift Pagi'
  else if (hour >= 16 || hour < 5) shift = 'Di luar jam masuk'

  return `${clock}, ${shift}`
})
</script>

<template>
  <div class="relative mx-auto max-w-6xl">
    <div class="overflow-hidden rounded-2xl sm:rounded-3xl border border-border/80 bg-card shadow-[0_20px_60px_-20px_rgba(0,0,0,0.25)] transition-all duration-300">
      <div class="flex items-center justify-between border-b border-border/70 bg-muted/40 px-4 py-3 sm:px-6">
        <div class="flex items-center gap-2">
          <span class="size-3 rounded-full bg-foreground/20" />
          <span class="size-3 rounded-full bg-foreground/30" />
          <span class="size-3 rounded-full bg-foreground/40" />
          <div class="ml-3 hidden sm:flex items-center gap-2 rounded-md bg-background/70 px-3 py-1 text-xs text-muted-foreground border border-border/40">
            <Search class="size-3.5" />
            <span>Cari karyawan, departemen, atau log kehadiran...</span>
          </div>
        </div>

        <div class="flex items-center gap-3 text-xs font-medium">
          <div class="flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-foreground border border-border/60">
            <span class="size-1.5 rounded-full bg-foreground/70" />
            <span>Presensi Real-time Aktif</span>
          </div>
          <span class="hidden sm:inline text-muted-foreground">{{ nowLabel }}</span>
        </div>
      </div>

      <div class="p-4 sm:p-6 lg:p-8 space-y-6">
        <div class="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <div class="rounded-xl border border-border/60 bg-muted/30 p-4">
            <div class="flex items-center justify-between">
              <span class="text-xs font-medium text-muted-foreground">Tingkat Kehadiran</span>
              <span class="rounded-md bg-muted p-1 text-foreground">
                <TrendingUp class="size-3.5" />
              </span>
            </div>
            <div class="mt-2 flex items-baseline gap-2">
              <span class="text-2xl font-bold tracking-tight">{{ loading ? '…' : attendanceRate }}</span>
            </div>
            <p class="mt-1 text-[11px] text-muted-foreground">{{ loading ? 'Memuat data…' : presentSummary }}</p>
          </div>

          <div class="rounded-xl border border-border/60 bg-muted/30 p-4">
            <div class="flex items-center justify-between">
              <span class="text-xs font-medium text-muted-foreground">Tepat Waktu</span>
              <span class="rounded-md bg-muted p-1 text-foreground">
                <Clock class="size-3.5" />
              </span>
            </div>
            <div class="mt-2 flex items-baseline gap-2">
              <span class="text-2xl font-bold tracking-tight">{{ loading ? '…' : (stats?.today_present ?? 0) }}</span>
              <span class="text-[11px] font-medium text-muted-foreground">Org hadir tepat waktu</span>
            </div>
            <p class="mt-1 text-[11px] text-muted-foreground">{{ loading ? 'Memuat data…' : onTimeSummary }}</p>
          </div>

          <div class="rounded-xl border border-border/60 bg-muted/30 p-4">
            <div class="flex items-center justify-between">
              <span class="text-xs font-medium text-muted-foreground">Face ID Biometrik</span>
              <span class="rounded-md bg-muted p-1 text-foreground">
                <ShieldCheck class="size-3.5" />
              </span>
            </div>
            <div class="mt-2 flex items-baseline gap-2">
              <span class="text-2xl font-bold tracking-tight">{{ loading ? '…' : (stats?.face_enrolled ?? 0) }}</span>
              <span class="text-[11px] font-medium text-muted-foreground">Terdaftar</span>
            </div>
            <p class="mt-1 text-[11px] text-muted-foreground">{{ loading ? 'Memuat data…' : faceSummary }}</p>
          </div>

          <div class="rounded-xl border border-border/60 bg-muted/30 p-4">
            <div class="flex items-center justify-between">
              <span class="text-xs font-medium text-muted-foreground">Geofence Multi-Lokasi</span>
              <span class="rounded-md bg-muted p-1 text-foreground">
                <MapPin class="size-3.5" />
              </span>
            </div>
            <div class="mt-2 flex items-baseline gap-2">
              <span class="text-2xl font-bold tracking-tight">{{ loading ? '…' : (stats?.active_geofences ?? 0) }}</span>
              <span class="text-[11px] font-medium text-muted-foreground">Titik</span>
            </div>
            <p class="mt-1 text-[11px] text-muted-foreground">{{ loading ? 'Memuat data…' : geofenceSummary }}</p>
          </div>
        </div>

        <div class="rounded-xl border border-border/60 bg-muted/20 overflow-hidden">
          <div class="flex items-center justify-between border-b border-border/50 px-4 py-3 bg-muted/30">
            <div class="flex items-center gap-2">
              <UserCheck class="size-4 text-foreground" />
              <span class="text-xs sm:text-sm font-semibold text-foreground">Log Presensi Hari Ini</span>
            </div>
            <span class="text-[11px] text-muted-foreground">Diperbarui otomatis</span>
          </div>

          <div v-if="loading" class="p-6 text-center text-sm text-muted-foreground">
            Memuat log presensi…
          </div>
          <div v-else-if="recentAttendance.length === 0" class="p-6 text-center text-sm text-muted-foreground">
            Belum ada presensi hari ini.
          </div>
          <div v-else class="divide-y divide-border/40">
            <div
              v-for="item in recentAttendance"
              :key="`${item.name}-${item.time}`"
              class="flex flex-col gap-2 p-3 sm:flex-row sm:items-center sm:justify-between sm:px-4 sm:py-3"
            >
              <div class="flex items-center gap-3">
                <PersonAvatar :name="item.name" :seed="item.name" class="size-9 shrink-0" />
                <div>
                  <div class="flex items-center gap-2">
                    <p class="text-xs sm:text-sm font-semibold text-foreground">{{ item.name }}</p>
                    <span class="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground font-medium">
                      {{ item.department }}
                    </span>
                  </div>
                  <p class="text-[11px] text-muted-foreground">{{ item.role }}</p>
                </div>
              </div>

              <div class="flex items-center gap-4 text-xs">
                <div class="flex items-center gap-1 text-muted-foreground">
                  <MapPin class="size-3.5" />
                  <span class="text-[11px]">{{ sanitizeDisplayText(item.location) || 'Kantor Pusat' }}</span>
                </div>
                <div class="flex items-center gap-1.5 font-medium text-foreground">
                  <Clock class="size-3.5" />
                  <span class="text-[11px]">{{ item.time }}</span>
                </div>
                <span
                  :class="[
                    'rounded-full px-2.5 py-0.5 text-[11px] font-semibold border',
                    item.on_time
                      ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-200'
                      : 'border-amber-500/35 bg-amber-500/10 text-amber-900 dark:text-amber-100',
                  ]"
                >
                  {{ item.status }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="highlight?.name"
      class="absolute -right-2 -bottom-6 sm:-right-4 sm:-bottom-8 w-64 sm:w-72 rounded-2xl border border-border/90 bg-card/95 p-4 shadow-2xl backdrop-blur-xl hidden md:block"
    >
      <div class="flex items-center justify-between pb-3 border-b border-border/60">
        <div class="flex items-center gap-2">
          <div class="size-2 rounded-full bg-foreground/70" />
          <span class="text-xs font-semibold text-foreground">Verifikasi Presensi</span>
        </div>
        <span class="text-[10px] font-medium text-muted-foreground">Mobile App</span>
      </div>

      <div class="mt-3 flex items-center gap-3">
        <div class="relative size-12 shrink-0">
          <img
            :src="personAvatarUrl(highlight.name, highlight.name)"
            :alt="highlight.name"
            class="size-12 rounded-full border-2 border-border object-cover bg-muted"
            width="48"
            height="48"
            loading="lazy"
          />
          <span class="absolute bottom-0 right-0 grid size-4 place-items-center rounded-full bg-foreground text-background ring-2 ring-card">
            <CheckCircle2 class="size-3" />
          </span>
        </div>
        <div>
          <p class="text-xs font-bold text-foreground">{{ highlight.name }}</p>
          <p class="text-[11px] text-muted-foreground">{{ highlightVerificationLabel }}</p>
          <div class="mt-1 flex items-center gap-1 text-[10px] text-muted-foreground font-medium">
            <MapPin class="size-3" />
            <span>Di dalam radius kantor</span>
          </div>
        </div>
      </div>

      <div class="mt-3 rounded-lg bg-muted/60 p-2 text-center text-[11px] font-medium text-muted-foreground">
        Absen Masuk Berhasil ({{ highlight.check_in_time }})
      </div>
    </div>
  </div>
</template>
