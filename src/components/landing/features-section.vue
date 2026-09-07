<script setup lang="ts">
import {
  AlertTriangle,
  ArrowUpRight,
  Camera,
  CheckCircle2,
  Clock,
  Download,
  FileSpreadsheet,
  Lock,
  MapPin,
  ScanFace,
  Shield,
  ShieldAlert,
  Smartphone,
  Sparkles,
  Users,
} from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
</script>

<template>
  <section id="features" class="relative py-24 sm:py-32 bg-muted/20">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section Header -->
      <div class="mx-auto max-w-3xl text-center">
        <Badge variant="outline" class="mb-4 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider">
          Fitur Komprehensif
        </Badge>
        <h2 class="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl text-foreground">
          Dari Check-in Hingga Payroll, Semuanya Mengalir Rapi
        </h2>
        <p class="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
          Semua instrumen yang dibutuhkan tim HR dan operasional untuk mengelola absensi karyawan tanpa celah kecurangan dan tanpa antrean manual.
        </p>
      </div>

      <!-- Bento Grid -->
      <div class="mx-auto mt-16 grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-3">
        <!-- Bento 1: Face ID (Span 2) -->
        <div class="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-sm transition-all duration-300 hover:border-foreground/20 hover:shadow-xl md:col-span-2">
          <div>
            <div class="flex items-center justify-between">
              <span class="flex size-11 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <ScanFace class="size-6" />
              </span>
              <span class="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                Anti-Titip Absen
              </span>
            </div>

            <h3 class="mt-6 text-xl sm:text-2xl font-bold text-foreground">
              Face ID Biometrik dengan Liveness Detection
            </h3>
            <p class="mt-2 text-sm text-muted-foreground leading-relaxed max-w-xl">
              Teknologi pencocokan wajah berbasis AI yang membedakan wajah asli dengan foto, video rekaman, atau cetakan kertas. Verifikasi tuntas dalam 0.3 detik.
            </p>
          </div>

          <!-- Interactive UI Simulation -->
          <div class="mt-6 rounded-2xl border border-border/70 bg-muted/40 p-4 sm:p-6">
            <div class="grid gap-4 sm:grid-cols-2 items-center">
              <div class="flex items-center gap-4 rounded-xl bg-card p-4 border border-border/60 shadow-sm">
                <div class="relative size-14 rounded-xl bg-muted/80 flex items-center justify-center border border-border/60">
                  <Camera class="size-6 text-muted-foreground" />
                  <span class="absolute -top-1 -right-1 size-3 rounded-full bg-emerald-500 ring-2 ring-card" />
                </div>
                <div>
                  <p class="text-xs font-bold text-foreground">Scan Wajah Berhasil</p>
                  <p class="text-[11px] text-muted-foreground">Kecocokan: 99.8%</p>
                  <p class="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">Liveness: Terverifikasi</p>
                </div>
              </div>

              <div class="space-y-2 text-xs">
                <div class="flex items-center justify-between rounded-lg bg-card/60 px-3 py-2 border border-border/40">
                  <span class="text-muted-foreground">Waktu Verifikasi</span>
                  <span class="font-semibold text-foreground">0.3 Detik</span>
                </div>
                <div class="flex items-center justify-between rounded-lg bg-card/60 px-3 py-2 border border-border/40">
                  <span class="text-muted-foreground">Perlindungan Anti-Spoofing</span>
                  <span class="font-semibold text-emerald-600 dark:text-emerald-400">Aktif</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Bento 2: Geofence GPS Presisi -->
        <div class="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-sm transition-all duration-300 hover:border-foreground/20 hover:shadow-xl md:col-span-1">
          <div>
            <div class="flex items-center justify-between">
              <span class="flex size-11 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                <MapPin class="size-6" />
              </span>
              <span class="rounded-full border border-blue-500/20 bg-blue-500/10 px-2.5 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400">
                Multi-Cabang
              </span>
            </div>

            <h3 class="mt-6 text-xl font-bold text-foreground">
              Geofence Radius Presisi
            </h3>
            <p class="mt-2 text-sm text-muted-foreground leading-relaxed">
              Tentukan radius absensi di setiap kantor, pabrik, atau cabang toko. Karyawan hanya bisa clock-in saat berada di dalam perimeter.
            </p>
          </div>

          <!-- Geofence Visual Widget -->
          <div class="mt-6 rounded-2xl border border-border/70 bg-muted/40 p-4">
            <div class="flex items-center justify-between text-xs font-medium pb-3 border-b border-border/50">
              <span class="text-foreground font-semibold">HQ Jakarta Barat</span>
              <span class="text-muted-foreground">Radius 50m</span>
            </div>
            <div class="mt-3 flex items-center gap-3">
              <div class="flex size-8 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                ✓
              </div>
              <div>
                <p class="text-xs font-semibold text-foreground">Jarak: 28m dari Titik</p>
                <p class="text-[11px] text-emerald-600 dark:text-emerald-400">Absensi diizinkan</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Bento 3: Deteksi Anomaly & Anti-Fake GPS -->
        <div class="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-sm transition-all duration-300 hover:border-foreground/20 hover:shadow-xl md:col-span-1">
          <div>
            <div class="flex items-center justify-between">
              <span class="flex size-11 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
                <ShieldAlert class="size-6" />
              </span>
              <span class="rounded-full border border-rose-500/20 bg-rose-500/10 px-2.5 py-1 text-xs font-semibold text-rose-600 dark:text-rose-400">
                Keamanan AI
              </span>
            </div>

            <h3 class="mt-6 text-xl font-bold text-foreground">
              Deteksi Anomaly & Fake GPS
            </h3>
            <p class="mt-2 text-sm text-muted-foreground leading-relaxed">
              Secara cerdas memblokir aplikasi pemalsu lokasi, smartphone dengan akses root/jailbreak, dan kloning aplikasi.
            </p>
          </div>

          <div class="mt-6 space-y-2 rounded-2xl border border-border/70 bg-muted/40 p-3.5 text-xs">
            <div class="flex items-center justify-between rounded-lg bg-card px-3 py-2 border border-border/40">
              <span class="text-muted-foreground">Mock GPS App</span>
              <span class="font-semibold text-rose-600 dark:text-rose-400">Terblokir</span>
            </div>
            <div class="flex items-center justify-between rounded-lg bg-card px-3 py-2 border border-border/40">
              <span class="text-muted-foreground">Root / Jailbreak</span>
              <span class="font-semibold text-rose-600 dark:text-rose-400">Ditolak</span>
            </div>
            <div class="flex items-center justify-between rounded-lg bg-card px-3 py-2 border border-border/40">
              <span class="text-muted-foreground">Integrity Check</span>
              <span class="font-semibold text-emerald-600 dark:text-emerald-400">100% Aman</span>
            </div>
          </div>
        </div>

        <!-- Bento 4: Cuti & Perizinan 1-Klik -->
        <div class="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-sm transition-all duration-300 hover:border-foreground/20 hover:shadow-xl md:col-span-1">
          <div>
            <div class="flex items-center justify-between">
              <span class="flex size-11 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <Clock class="size-6" />
              </span>
              <span class="rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-600 dark:text-amber-400">
                Otomatis
              </span>
            </div>

            <h3 class="mt-6 text-xl font-bold text-foreground">
              Pengajuan Cuti & Lembur
            </h3>
            <p class="mt-2 text-sm text-muted-foreground leading-relaxed">
              Karyawan ajukan cuti atau lembur dalam hitungan detik. Manajer menerima notifikasi dan menyetujui langsung dari smartphone.
            </p>
          </div>

          <div class="mt-6 rounded-2xl border border-border/70 bg-muted/40 p-3.5 space-y-2">
            <div class="rounded-xl bg-card p-3 border border-border/50 shadow-sm">
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-foreground">Cuti Tahunan (2 Hari)</span>
                <span class="text-[10px] text-amber-600 dark:text-amber-400 font-semibold bg-amber-500/10 px-2 py-0.5 rounded">Menunggu</span>
              </div>
              <p class="mt-1 text-[11px] text-muted-foreground">Rafi Pratama • Tim Backend</p>
              <div class="mt-2.5 flex gap-2">
                <button class="flex-1 rounded-md bg-emerald-600 py-1 text-[11px] font-semibold text-white hover:bg-emerald-700 transition-colors">
                  Setujui
                </button>
                <button class="rounded-md border border-border px-3 py-1 text-[11px] font-medium text-muted-foreground hover:bg-muted transition-colors">
                  Tolak
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Bento 5: Ekspor Payroll (Col Span 1 or 2) -->
        <div class="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-sm transition-all duration-300 hover:border-foreground/20 hover:shadow-xl md:col-span-1">
          <div>
            <div class="flex items-center justify-between">
              <span class="flex size-11 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                <FileSpreadsheet class="size-6" />
              </span>
              <span class="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-2.5 py-1 text-xs font-semibold text-cyan-600 dark:text-cyan-400">
                1-Klik Rekap
              </span>
            </div>

            <h3 class="mt-6 text-xl font-bold text-foreground">
              Rekapitulasi Siap Payroll
            </h3>
            <p class="mt-2 text-sm text-muted-foreground leading-relaxed">
              Ekspor rekapitulasi kehadiran, keterlambatan, dan lembur langsung ke format Excel, CSV, atau sinkronisasi otomatis ke software penggajian.
            </p>
          </div>

          <div class="mt-6 rounded-2xl border border-border/70 bg-muted/40 p-4">
            <div class="flex items-center justify-between text-xs">
              <span class="text-muted-foreground">Periode:</span>
              <span class="font-semibold text-foreground">1 - 31 September</span>
            </div>
            <div class="mt-3 flex items-center justify-between rounded-xl bg-card p-2.5 border border-border/60">
              <div class="flex items-center gap-2 text-xs">
                <Download class="size-4 text-primary" />
                <span class="font-medium text-foreground">rekap_kehadiran.xlsx</span>
              </div>
              <span class="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                Siap Unduh
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
