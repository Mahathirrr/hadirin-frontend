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
    title: 'Kantor & tim hybrid',
    subtitle: 'WFO & remote',
    description: 'Batasi absensi ke area kantor yang ditentukan. Karyawan check-in dari browser atau ponsel saat berada di lokasi kerja.',
  },
  {
    icon: Factory,
    title: 'Pabrik & manufaktur',
    subtitle: 'Shift & roster',
    description: 'Atur shift dan roster karyawan. Dapat peringatan otomatis untuk check-in di luar jam kerja atau lupa check-out.',
  },
  {
    icon: Store,
    title: 'Retail multi-cabang',
    subtitle: 'Banyak geofence',
    description: 'Kelola banyak cabang dalam satu akun perusahaan dan pantau ringkasan kehadiran per lokasi dari dashboard.',
  },
  {
    icon: Truck,
    title: 'Tim lapangan',
    subtitle: 'GPS & lokasi',
    description: 'Check-in dengan GPS, pantau lokasi tim di lapangan, dan verifikasi wajah jika diaktifkan oleh admin.',
  },
  {
    icon: GraduationCap,
    title: 'Sekolah & yayasan',
    subtitle: 'Staf & pengajar',
    description: 'Rekap kehadiran harian, cuti, dan unduhan laporan mingguan CSV untuk administrasi.',
  },
  {
    icon: HeartPulse,
    title: 'Klinik & layanan kesehatan',
    subtitle: 'Shift jaga',
    description: 'Kelola shift jaga, cuti, dan kepatuhan jam kerja dengan persetujuan cuti bertingkat dan riwayat perubahan.',
  },
]
</script>

<template>
  <section id="use-cases" class="relative py-24 sm:py-32 bg-muted/10">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <ScrollReveal animation="fade-up">
        <div class="mx-auto max-w-3xl text-center">
          <Badge variant="outline" class="mb-4 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider">
            Contoh pemakaian
          </Badge>
          <h2 class="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl text-foreground">
            Satu platform, berbagai pola kerja
          </h2>
          <p class="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
            Satu aplikasi untuk berbagai pola kerja: kantor, shift pabrik, retail multi-cabang, hingga tim di lapangan.
          </p>
        </div>
      </ScrollReveal>

      <div class="mx-auto mt-16 grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="(item, index) in useCases"
          :key="item.title"
          data-aos="fade-up"
          :data-aos-delay="index * 70"
          class="flex flex-col landing-card p-6 sm:p-8"
        >
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
      </div>
    </div>
  </section>
</template>
