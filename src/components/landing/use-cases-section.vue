<script setup lang="ts">
import {
  Building2,
  Factory,
  GraduationCap,
  HeartPulse,
  Store,
  Truck,
} from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import ScrollReveal from '@/components/landing/scroll-reveal.vue'

const useCases = [
  {
    icon: Building2,
    title: 'Kantor & Startup Modern',
    subtitle: 'WFO, WFH & Hybrid',
    description: 'Validasi kehadiran fleksibel berdasarkan radius GPS kantor atau IP jaringan terdaftar untuk tim hybrid.',
    stat: 'Efisiensi Waktu HR 85%',
  },
  {
    icon: Factory,
    title: 'Pabrik & Manufaktur',
    subtitle: 'Multi-Shift 24/7',
    description: 'Atur pergantian shift pagi, siang, dan malam dengan toleransi keterlambatan dan rotasi regu kerja.',
    stat: 'Kapasitas 1.000+ Operator',
  },
  {
    icon: Store,
    title: 'Retail & FnB Multi-Cabang',
    subtitle: 'Outlet & Restoran',
    description: 'Pantau kehadiran kasir, barista, dan staf toko di puluhan cabang secara terpusat dari satu dashboard owner.',
    stat: 'Monitoring Real-time Cabang',
  },
  {
    icon: Truck,
    title: 'Tim Lapangan & Logistik',
    subtitle: 'Sales & Kurir Mobile',
    description: 'Absensi clock-in langsung di lokasi klien atau rute pengantaran dengan verifikasi foto selfie dan titik GPS.',
    stat: 'Pelacakan Rute Akurat',
  },
  {
    icon: GraduationCap,
    title: 'Sekolah & Yayasan',
    subtitle: 'Pendidik & Staf',
    description: 'Rekap kehadiran guru, dosen, dan staf administrasi dengan integrasi laporan kehadiran bulanan.',
    stat: 'Laporan Kehadiran Instan',
  },
  {
    icon: HeartPulse,
    title: 'Klinik & Layanan Kesehatan',
    subtitle: 'Dokter & Tenaga Medis',
    description: 'Manajemen jadwal shift jaga perawat dan dokter spesialis dengan kepatuhan jam kerja medis ketat.',
    stat: 'Jadwal Jaga Terstruktur',
  },
]
</script>

<template>
  <section id="use-cases" class="relative py-24 sm:py-32 bg-muted/10">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <ScrollReveal animation="fade-up">
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
      </ScrollReveal>

      <div class="mx-auto mt-16 grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="(item, index) in useCases"
          :key="item.title"
          data-aos="fade-up"
          :data-aos-delay="index * 70"
          class="flex flex-col justify-between landing-card p-6 sm:p-8"
        >
          <div>
            <div class="flex items-center justify-between">
              <span class="flex size-12 items-center justify-center rounded-2xl border border-border bg-muted text-foreground">
                <component :is="item.icon" class="size-6" />
              </span>
              <span class="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                {{ item.subtitle }}
              </span>
            </div>

            <h3 class="mt-6 text-xl font-bold text-foreground tracking-tight">
              {{ item.title }}
            </h3>
            <p class="mt-2 text-sm leading-relaxed text-muted-foreground">
              {{ item.description }}
            </p>
          </div>

          <div class="mt-6 pt-4 border-t border-border/50 text-xs">
            <span class="font-semibold text-foreground/90">{{ item.stat }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
