<script setup lang="ts">
import {
  Building2,
  Factory,
  GraduationCap,
  HeartPulse,
  MapPin,
  Store,
  Truck,
} from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'

const useCases = [
  {
    icon: Building2,
    title: 'Kantor & Startup Modern',
    subtitle: 'WFO, WFH & Hybrid',
    description: 'Validasi kehadiran fleksibel berdasarkan radius GPS kantor atau IP jaringan terdaftar untuk tim hybrid.',
    stat: 'Efisiensi Waktu HR 85%',
    iconColor: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
  },
  {
    icon: Factory,
    title: 'Pabrik & Manufaktur',
    subtitle: 'Multi-Shift 24/7',
    description: 'Atur pergantian shift pagi, siang, dan malam dengan toleransi toleransi keterlambatan dan rotasi regu kerja.',
    stat: 'Kapasitas 1.000+ Operator',
    iconColor: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
  },
  {
    icon: Store,
    title: 'Retail & FnB Multi-Cabang',
    subtitle: 'Outlet & Restoran',
    description: 'Pantau kehadiran kasir, barista, dan staf toko di puluhan cabang secara terpusat dari satu dashboard owner.',
    stat: 'Monitoring Real-time Cabang',
    iconColor: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
  },
  {
    icon: Truck,
    title: 'Tim Lapangan & Logistik',
    subtitle: 'Sales & Kurir Mobile',
    description: 'Absensi clock-in langsung di lokasi klien atau rute pengantaran dengan verifikasi foto selfie dan titik GPS.',
    stat: 'Pelacakan Rute Akurat',
    iconColor: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
  },
  {
    icon: GraduationCap,
    title: 'Sekolah & Yayasan',
    subtitle: 'Pendidik & Staf',
    description: 'Rekap kehadiran guru, dosen, dan staf administrasi dengan integrasi laporan kehadiran bulanan.',
    stat: 'Laporan Kehadiran Instan',
    iconColor: 'text-sky-500 bg-sky-500/10 border-sky-500/20',
  },
  {
    icon: HeartPulse,
    title: 'Klinik & Layanan Kesehatan',
    subtitle: 'Dokter & Tenaga Medis',
    description: 'Manajemen jadwal shift jaga perawat dan dokter spesialis dengan kepatuhan jam kerja medis ketat.',
    stat: 'Jadwal Jaga Terstruktur',
    iconColor: 'text-rose-500 bg-rose-500/10 border-rose-500/20',
  },
]
</script>

<template>
  <section id="use-cases" class="relative py-24 sm:py-32 bg-muted/10">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section Header -->
      <div class="mx-auto max-w-3xl text-center">
        <Badge variant="outline" class="mb-4 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider">
          Solusi Industri
        </Badge>
        <h2 class="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl text-foreground">
          Dirancang untuk Ragam Ritme Kerja di Berbagai Industri
        </h2>
        <p class="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
          Setiap sektor memiliki dinamika kerja yang unik. Hadirin menyesuaikan alur presensi dengan model bisnis Anda.
        </p>
      </div>

      <!-- Use Cases Grid -->
      <div class="mx-auto mt-16 grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="item in useCases"
          :key="item.title"
          class="group relative flex flex-col justify-between rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-foreground/25 hover:shadow-xl"
        >
          <div>
            <!-- Icon -->
            <div class="flex items-center justify-between">
              <span :class="['flex size-12 items-center justify-center rounded-2xl border transition-transform duration-300 group-hover:scale-110', item.iconColor]">
                <component :is="item.icon" class="size-6" />
              </span>
              <span class="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                {{ item.subtitle }}
              </span>
            </div>

            <!-- Content -->
            <h3 class="mt-6 text-xl font-bold text-foreground tracking-tight">
              {{ item.title }}
            </h3>
            <p class="mt-2 text-sm leading-relaxed text-muted-foreground">
              {{ item.description }}
            </p>
          </div>

          <!-- Bottom Stat / Metric Tag -->
          <div class="mt-6 pt-4 border-t border-border/50 flex items-center justify-between text-xs">
            <span class="font-semibold text-foreground/90">{{ item.stat }}</span>
            <span class="text-primary font-medium group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
              Selengkapnya →
            </span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
