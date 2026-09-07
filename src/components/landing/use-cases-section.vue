<script setup lang="ts">
import { Badge } from '@/components/ui/badge'

const useCases = [
  { number: '01', title: 'Kantor', description: 'Absensi harian dan cuti untuk tim kantor.' },
  { number: '02', title: 'Pabrik', description: 'Shift kerja dan kehadiran di lokasi produksi.' },
  { number: '03', title: 'Retail', description: 'Pantau staf toko di beberapa cabang.' },
  { number: '04', title: 'Lapangan', description: 'Absensi berbasis lokasi untuk tim mobile.' },
  { number: '05', title: 'Sekolah', description: 'Kehadiran guru dan staf administrasi.' },
  { number: '06', title: 'Klinik', description: 'Jadwal dan kehadiran tenaga medis.' },
]
</script>

<template>
  <section class="bg-muted/30 py-16 sm:py-24">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="mx-auto mb-12 max-w-2xl text-center">
        <Badge variant="outline" class="mb-4">Use case</Badge>
        <h2 class="mb-4 text-2xl font-bold tracking-tight sm:text-3xl">
          Dirancang untuk ritme kerja tim yang berbeda
        </h2>
      </div>

      <div class="mx-auto grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="item in useCases"
          :key="item.title"
          class="group rounded-2xl bg-card/80 p-6 shadow-sm transition-transform duration-300 hover:-translate-y-1"
        >
          <div class="mb-7 flex items-center justify-between">
            <span class="text-xs font-medium text-muted-foreground">{{ item.number }}</span>
            <span class="grid size-7 place-items-center rounded-full bg-foreground text-[10px] font-semibold text-background transition-transform group-hover:rotate-12">A</span>
          </div>
          <h3 class="font-semibold">{{ item.title }}</h3>
          <p class="mt-2 text-sm text-muted-foreground">{{ item.description }}</p>
        </div>
      </div>
    </div>
  </section>
</template>
