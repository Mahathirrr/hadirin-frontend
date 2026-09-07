<script setup lang="ts">
import {
  CheckCircle2,
  Clock,
  Fingerprint,
  MapPin,
  Search,
  ShieldCheck,
  Smartphone,
  TrendingUp,
  UserCheck,
  Users,
} from 'lucide-vue-next'
import Logo from '@/components/logo.vue'

const recentAttendance = [
  {
    name: 'Dimas Setiawan',
    role: 'Lead UI/UX Designer',
    dept: 'Product',
    time: '07:58 WIB',
    method: 'Face ID Mobile',
    status: 'Tepat Waktu',
    statusTone: 'emerald',
    location: 'Kantor Pusat (42m)',
    avatarBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    initials: 'DS',
  },
  {
    name: 'Siti Rahmadani',
    role: 'Senior Frontend Dev',
    dept: 'Engineering',
    time: '08:02 WIB',
    method: 'Face ID Mobile',
    status: 'Tepat Waktu',
    statusTone: 'emerald',
    location: 'Kantor Pusat (18m)',
    avatarBg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    initials: 'SR',
  },
  {
    name: 'Budi Kurniawan',
    role: 'Account Executive',
    dept: 'Sales & BD',
    time: '08:14 WIB',
    method: 'Geofence GPS',
    status: 'Tepat Waktu',
    statusTone: 'emerald',
    location: 'Cabang BSD (85m)',
    avatarBg: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
    initials: 'BK',
  },
  {
    name: 'Alya Putri',
    role: 'HR Specialist',
    dept: 'People Ops',
    time: '08:45 WIB',
    method: 'Device QR',
    status: 'Terlambat 15m',
    statusTone: 'amber',
    location: 'Lobi Utama',
    avatarBg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    initials: 'AP',
  },
]
</script>

<template>
  <div class="relative mx-auto max-w-6xl">
    <!-- Ambient Backdrop Glow -->
    <div class="absolute -top-12 left-1/2 -z-10 h-72 w-[85%] -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />

    <!-- Main Window Container -->
    <div class="overflow-hidden rounded-2xl sm:rounded-3xl border border-border/80 bg-card shadow-[0_25px_70px_-15px_rgba(0,0,0,0.3)] transition-all duration-300">
      <!-- Window Topbar -->
      <div class="flex items-center justify-between border-b border-border/70 bg-muted/40 px-4 py-3 sm:px-6">
        <div class="flex items-center gap-2">
          <span class="size-3 rounded-full bg-rose-500/80" />
          <span class="size-3 rounded-full bg-amber-500/80" />
          <span class="size-3 rounded-full bg-emerald-500/80" />
          <div class="ml-3 hidden sm:flex items-center gap-2 rounded-md bg-background/70 px-3 py-1 text-xs text-muted-foreground border border-border/40">
            <Search class="size-3.5" />
            <span>Cari karyawan, departemen, atau log kehadiran...</span>
          </div>
        </div>

        <div class="flex items-center gap-3 text-xs font-medium">
          <div class="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <span class="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Presensi Real-time Aktif</span>
          </div>
          <span class="hidden sm:inline text-muted-foreground">08:45 WIB • Shift Pagi</span>
        </div>
      </div>

      <!-- Window Dashboard Body -->
      <div class="p-4 sm:p-6 lg:p-8 space-y-6">
        <!-- Stats Row -->
        <div class="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <div class="rounded-xl border border-border/60 bg-muted/30 p-4 transition-all hover:bg-muted/50">
            <div class="flex items-center justify-between">
              <span class="text-xs font-medium text-muted-foreground">Tingkat Kehadiran</span>
              <span class="rounded-md bg-emerald-500/10 p-1 text-emerald-600 dark:text-emerald-400">
                <TrendingUp class="size-3.5" />
              </span>
            </div>
            <div class="mt-2 flex items-baseline gap-2">
              <span class="text-2xl font-bold tracking-tight">97.5%</span>
              <span class="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">+3.8%</span>
            </div>
            <p class="mt-1 text-[11px] text-muted-foreground">39 dari 40 karyawan hadir</p>
          </div>

          <div class="rounded-xl border border-border/60 bg-muted/30 p-4 transition-all hover:bg-muted/50">
            <div class="flex items-center justify-between">
              <span class="text-xs font-medium text-muted-foreground">Tepat Waktu</span>
              <span class="rounded-md bg-blue-500/10 p-1 text-blue-600 dark:text-blue-400">
                <Clock class="size-3.5" />
              </span>
            </div>
            <div class="mt-2 flex items-baseline gap-2">
              <span class="text-2xl font-bold tracking-tight">38 Org</span>
              <span class="text-[11px] font-medium text-muted-foreground">Rata-rata 08:04</span>
            </div>
            <p class="mt-1 text-[11px] text-muted-foreground">Hanya 1 keterlambatan</p>
          </div>

          <div class="rounded-xl border border-border/60 bg-muted/30 p-4 transition-all hover:bg-muted/50">
            <div class="flex items-center justify-between">
              <span class="text-xs font-medium text-muted-foreground">Face ID Biometrik</span>
              <span class="rounded-md bg-emerald-500/10 p-1 text-emerald-600 dark:text-emerald-400">
                <ShieldCheck class="size-3.5" />
              </span>
            </div>
            <div class="mt-2 flex items-baseline gap-2">
              <span class="text-2xl font-bold tracking-tight">100%</span>
              <span class="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">Valid</span>
            </div>
            <p class="mt-1 text-[11px] text-muted-foreground">0 titip absen terdeteksi</p>
          </div>

          <div class="rounded-xl border border-border/60 bg-muted/30 p-4 transition-all hover:bg-muted/50">
            <div class="flex items-center justify-between">
              <span class="text-xs font-medium text-muted-foreground">Geofence Multi-Lokasi</span>
              <span class="rounded-md bg-purple-500/10 p-1 text-purple-600 dark:text-purple-400">
                <MapPin class="size-3.5" />
              </span>
            </div>
            <div class="mt-2 flex items-baseline gap-2">
              <span class="text-2xl font-bold tracking-tight">3 Cabang</span>
              <span class="text-[11px] font-medium text-purple-600 dark:text-purple-400">Tersinkron</span>
            </div>
            <p class="mt-1 text-[11px] text-muted-foreground">Radius 100m aktif</p>
          </div>
        </div>

        <!-- Table Container -->
        <div class="rounded-xl border border-border/60 bg-muted/20 overflow-hidden">
          <div class="flex items-center justify-between border-b border-border/50 px-4 py-3 bg-muted/30">
            <div class="flex items-center gap-2">
              <UserCheck class="size-4 text-foreground" />
              <span class="text-xs sm:text-sm font-semibold text-foreground">Log Presensi Hari Ini</span>
            </div>
            <span class="text-[11px] text-muted-foreground">Update otomatis setiap 30 detik</span>
          </div>

          <div class="divide-y divide-border/40">
            <div
              v-for="item in recentAttendance"
              :key="item.name"
              class="flex flex-col gap-2 p-3 sm:flex-row sm:items-center sm:justify-between sm:px-4 sm:py-3 transition-colors hover:bg-muted/40"
            >
              <div class="flex items-center gap-3">
                <div :class="['flex size-9 items-center justify-center rounded-full font-bold text-xs shrink-0', item.avatarBg]">
                  {{ item.initials }}
                </div>
                <div>
                  <div class="flex items-center gap-2">
                    <p class="text-xs sm:text-sm font-semibold text-foreground">{{ item.name }}</p>
                    <span class="rounded bg-muted px-1.5 py-0.2 text-[10px] text-muted-foreground font-medium">
                      {{ item.dept }}
                    </span>
                  </div>
                  <p class="text-[11px] text-muted-foreground">{{ item.role }}</p>
                </div>
              </div>

              <div class="flex items-center gap-4 text-xs">
                <div class="flex items-center gap-1 text-muted-foreground">
                  <MapPin class="size-3.5 text-muted-foreground/70" />
                  <span class="text-[11px]">{{ item.location }}</span>
                </div>
                <div class="flex items-center gap-1.5 font-medium text-foreground">
                  <Clock class="size-3.5 text-primary" />
                  <span class="text-[11px]">{{ item.time }}</span>
                </div>
                <span
                  :class="[
                    'rounded-full px-2.5 py-0.5 text-[11px] font-semibold border',
                    item.statusTone === 'emerald'
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
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

    <!-- Floating Mobile Verification Card (Overlaid Bottom Right) -->
    <div class="absolute -right-2 -bottom-6 sm:-right-4 sm:-bottom-8 w-64 sm:w-72 rounded-2xl border border-border/90 bg-card/95 p-4 shadow-2xl backdrop-blur-xl transition-transform duration-300 hover:scale-105 hidden md:block">
      <div class="flex items-center justify-between pb-3 border-b border-border/60">
        <div class="flex items-center gap-2">
          <div class="size-2 rounded-full bg-emerald-500 animate-ping" />
          <span class="text-xs font-semibold text-foreground">Verifikasi Presensi</span>
        </div>
        <span class="text-[10px] font-medium text-muted-foreground">Mobile App</span>
      </div>

      <div class="mt-3 flex items-center gap-3">
        <div class="relative size-12 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-md">
          <div class="flex size-full items-center justify-center rounded-full bg-card font-bold text-sm text-foreground">
            RZ
          </div>
          <span class="absolute bottom-0 right-0 grid size-4 place-items-center rounded-full bg-emerald-500 text-white ring-2 ring-card">
            <CheckCircle2 class="size-3" />
          </span>
        </div>
        <div>
          <p class="text-xs font-bold text-foreground">Reza Pahlevi</p>
          <p class="text-[11px] text-muted-foreground">Face ID Match 99.8%</p>
          <div class="mt-1 flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
            <MapPin class="size-3" />
            <span>Di dalam radius kantor</span>
          </div>
        </div>
      </div>

      <div class="mt-3 rounded-lg bg-muted/60 p-2 text-center text-[11px] font-medium text-muted-foreground">
        ✅ Absen Masuk Berhasil (08:00 WIB)
      </div>
    </div>
  </div>
</template>
