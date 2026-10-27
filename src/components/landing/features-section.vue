<script setup lang="ts">
import {
  Camera,
  Clock,
  Download,
  FileSpreadsheet,
  MapPin,
  ScanFace,
  ShieldAlert,
} from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import ScrollReveal from '@/components/landing/scroll-reveal.vue'
</script>

<template>
  <section id="features" class="relative py-24 sm:py-32 bg-muted/20">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <ScrollReveal animation="fade-up">
        <div class="mx-auto max-w-3xl text-center">
          <Badge variant="outline" class="mb-4 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider">
            Fitur produk
          </Badge>
          <h2 class="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl text-foreground">
            Dari check-in hingga laporan mingguan, semuanya terlacak
          </h2>
          <p class="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
            Absensi GPS, QR, dan wajah, geofence multi-lokasi, cuti & persetujuan, shift, laporan CSV, serta peringatan anomali kehadiran.
          </p>
        </div>
      </ScrollReveal>

      <div class="mx-auto mt-16 grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-3">
        <div data-aos="fade-up" data-aos-delay="0" class="group relative flex flex-col justify-between overflow-hidden landing-card p-6 sm:p-8 md:col-span-2">
          <div>
            <div class="flex items-center justify-between">
              <span class="flex size-11 items-center justify-center rounded-2xl bg-muted text-foreground">
                <ScanFace class="size-6" />
              </span>
              <span class="rounded-full border border-border bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
                Anti-Titip Absen
              </span>
            </div>

            <h3 class="mt-6 text-xl sm:text-2xl font-bold text-foreground">
              Face ID dengan pendaftaran wajah
            </h3>
            <p class="mt-2 text-sm text-muted-foreground leading-relaxed max-w-xl">
              Admin mendaftarkan foto karyawan. Setiap check-in wajah diverifikasi terlebih dahulu agar absensi hanya tercatat setelah wajah cocok dengan data terdaftar.
            </p>
          </div>

          <div class="mt-6 rounded-2xl border border-border/70 bg-muted/40 p-4 sm:p-6">
            <div class="grid gap-4 sm:grid-cols-2 items-center">
              <div class="flex items-center gap-4 rounded-xl bg-card p-4 border border-border/60 shadow-sm">
                <div class="relative size-14 rounded-xl bg-muted/80 flex items-center justify-center border border-border/60">
                  <Camera class="size-6 text-muted-foreground" />
                  <span class="absolute -top-1 -right-1 size-3 rounded-full bg-foreground ring-2 ring-card" />
                </div>
                <div>
                  <p class="text-xs font-bold text-foreground">Scan wajah berhasil</p>
                  <p class="text-[11px] text-muted-foreground">Template cocok</p>
                  <p class="text-[11px] text-foreground font-medium">Verifikasi wajah berhasil</p>
                </div>
              </div>

              <div class="space-y-2 text-xs">
                <div class="flex items-center justify-between rounded-lg bg-card/60 px-3 py-2 border border-border/40">
                  <span class="text-muted-foreground">Masa verifikasi</span>
                  <span class="font-semibold text-foreground">5 menit</span>
                </div>
                <div class="flex items-center justify-between rounded-lg bg-card/60 px-3 py-2 border border-border/40">
                  <span class="text-muted-foreground">Enrollment aktif</span>
                  <span class="font-semibold text-foreground">1 per karyawan</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div data-aos="fade-up" data-aos-delay="80" class="group relative flex flex-col justify-between overflow-hidden landing-card p-6 sm:p-8 md:col-span-1">
          <div>
            <div class="flex items-center justify-between">
              <span class="flex size-11 items-center justify-center rounded-2xl bg-muted text-foreground">
                <MapPin class="size-6" />
              </span>
              <span class="rounded-full border border-border bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground">
                Multi-Cabang
              </span>
            </div>

            <h3 class="mt-6 text-xl font-bold text-foreground">
              Geofence radius presisi
            </h3>
            <p class="mt-2 text-sm text-muted-foreground leading-relaxed">
              Tentukan radius absensi di setiap kantor, pabrik, atau cabang toko. Karyawan hanya bisa clock-in saat berada di dalam perimeter.
            </p>
          </div>

          <div class="mt-6 rounded-2xl border border-border/70 bg-muted/40 p-4">
            <div class="flex items-center justify-between text-xs font-medium pb-3 border-b border-border/50">
              <span class="text-foreground font-semibold">HQ Jakarta Barat</span>
              <span class="text-muted-foreground">Radius 50m</span>
            </div>
            <div class="mt-3 flex items-center gap-3">
              <div class="flex size-8 items-center justify-center rounded-full bg-muted text-foreground font-bold text-xs">
                ✓
              </div>
              <div>
                <p class="text-xs font-semibold text-foreground">Jarak: 28m dari titik</p>
                <p class="text-[11px] text-muted-foreground">Absensi diizinkan</p>
              </div>
            </div>
          </div>
        </div>

        <div data-aos="fade-up" data-aos-delay="160" class="group relative flex flex-col justify-between overflow-hidden landing-card p-6 sm:p-8 md:col-span-1">
          <div>
            <div class="flex items-center justify-between">
              <span class="flex size-11 items-center justify-center rounded-2xl bg-muted text-foreground">
                <ShieldAlert class="size-6" />
              </span>
              <span class="rounded-full border border-border bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground">
                Peringatan otomatis
              </span>
            </div>

            <h3 class="mt-6 text-xl font-bold text-foreground">
              Deteksi anomali absensi
            </h3>
            <p class="mt-2 text-sm text-muted-foreground leading-relaxed">
              Hadirin menandai pola yang perlu ditinjau, seperti check-in ganda, keterlambatan berulang, absensi di luar geofence,
              kehadiran saat cuti disetujui, check-in di luar jam kerja, atau lokasi tidak sesuai area kerja.
            </p>
          </div>

          <div class="mt-6 space-y-2 rounded-2xl border border-border/70 bg-muted/40 p-3.5 text-xs">
            <div class="flex items-center justify-between rounded-lg bg-card px-3 py-2 border border-border/40">
              <span class="text-muted-foreground">Di luar geofence</span>
              <span class="font-semibold text-foreground">Peringatan</span>
            </div>
            <div class="flex items-center justify-between rounded-lg bg-card px-3 py-2 border border-border/40">
              <span class="text-muted-foreground">Check-in ganda</span>
              <span class="font-semibold text-foreground">Peringatan</span>
            </div>
            <div class="flex items-center justify-between rounded-lg bg-card px-3 py-2 border border-border/40">
              <span class="text-muted-foreground">Belum check-out</span>
              <span class="font-semibold text-foreground">Peringatan</span>
            </div>
          </div>
        </div>

        <div data-aos="fade-up" data-aos-delay="240" class="group relative flex flex-col justify-between overflow-hidden landing-card p-6 sm:p-8 md:col-span-1">
          <div>
            <div class="flex items-center justify-between">
              <span class="flex size-11 items-center justify-center rounded-2xl bg-muted text-foreground">
                <Clock class="size-6" />
              </span>
              <span class="rounded-full border border-border bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground">
                Otomatis
              </span>
            </div>

            <h3 class="mt-6 text-xl font-bold text-foreground">
              Pengajuan cuti & persetujuan
            </h3>
            <p class="mt-2 text-sm text-muted-foreground leading-relaxed">
              Karyawan mengajukan cuti lewat aplikasi. Persetujuan bertingkat: admin lalu pemilik akun perusahaan, sesuai kebijakan Anda.
            </p>
          </div>

          <div class="mt-6 rounded-2xl border border-border/70 bg-muted/40 p-3.5 space-y-2">
            <div class="rounded-xl bg-card p-3 border border-border/50 shadow-sm">
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-foreground">Cuti tahunan (2 hari)</span>
                <span class="text-[10px] text-muted-foreground font-semibold bg-muted px-2 py-0.5 rounded">Menunggu</span>
              </div>
              <p class="mt-1 text-[11px] text-muted-foreground">Rafi Pratama · Operasional</p>
            </div>
          </div>
        </div>

        <div data-aos="fade-up" data-aos-delay="320" class="group relative flex flex-col justify-between overflow-hidden landing-card p-6 sm:p-8 md:col-span-1">
          <div>
            <div class="flex items-center justify-between">
              <span class="flex size-11 items-center justify-center rounded-2xl bg-muted text-foreground">
                <FileSpreadsheet class="size-6" />
              </span>
              <span class="rounded-full border border-border bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground">
                Unduh CSV
              </span>
            </div>

            <h3 class="mt-6 text-xl font-bold text-foreground">
              Laporan mingguan (CSV)
            </h3>
            <p class="mt-2 text-sm text-muted-foreground leading-relaxed">
              Buat laporan mingguan per perusahaan dan unduh CSV dari dashboard. Cocok untuk rekapitulasi kehadiran dan cuti tim.
            </p>
          </div>

          <div class="mt-6 space-y-2 rounded-2xl border border-border/70 bg-muted/40 p-4">
            <div class="flex items-center justify-between text-xs">
              <span class="text-muted-foreground">Format ekspor</span>
              <span class="font-semibold text-foreground">CSV</span>
            </div>
            <div class="rounded-xl border border-border/60 bg-card p-3 shadow-sm">
              <div class="flex items-start gap-3">
                <span class="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Download class="size-4" />
                </span>
                <div class="min-w-0 flex-1">
                  <p class="truncate text-sm font-semibold text-foreground">laporan_mingguan.csv</p>
                  <p class="mt-0.5 text-[11px] leading-snug text-muted-foreground">
                    Dashboard → Laporan → pilih minggu → unduh
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
