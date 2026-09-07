<script setup lang="ts">
import { Badge } from '@/components/ui/badge'

const features = [
  { title: 'Absensi harian', description: 'Masuk, pulang, dan keterlambatan tercatat otomatis.', type: 'attendance' },
  { title: 'Cuti dan izin', description: 'Pengajuan dan persetujuan dalam satu alur.', type: 'leave' },
  { title: 'Monitoring lokasi', description: 'Pantau kehadiran sesuai area kerja.', type: 'location' },
  { title: 'Data karyawan', description: 'Kelola anggota workspace dan status kehadiran.', type: 'employees' },
]
</script>

<template>
  <section id="features" class="py-24 sm:py-32">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="mx-auto mb-16 max-w-2xl text-center">
        <Badge variant="outline" class="mb-4">Fitur</Badge>
        <h2 class="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
          Dari check-in sampai laporan, semuanya mengalir rapi
        </h2>
        <p class="text-lg text-muted-foreground">
          Pantau kondisi tim setiap hari dan tangani kebutuhan operasional tanpa berpindah-pindah alat.
        </p>
      </div>

      <div class="mx-auto grid max-w-5xl gap-5 md:grid-cols-2">
        <div
          v-for="feature in features"
          :key="feature.title"
          class="group overflow-hidden rounded-2xl bg-muted/55 p-6 shadow-sm transition-transform duration-300 hover:-translate-y-1"
        >
          <div class="mb-6 flex aspect-[16/8] items-center overflow-hidden rounded-xl bg-card p-4 shadow-sm">
            <div v-if="feature.type === 'attendance'" class="w-full">
              <div class="mb-4 flex items-center justify-between">
                <span class="h-2 w-16 rounded-full bg-foreground/15" />
                <span class="rounded-full bg-foreground px-2 py-1 text-[9px] text-background">Hari ini</span>
              </div>
              <div class="flex items-end gap-2">
                <div v-for="height in [35, 60, 44, 75, 54, 88, 68]" :key="height" class="flex-1 rounded-t-sm bg-foreground/15" :style="{ height: `${height / 2}px` }" />
              </div>
            </div>

            <div v-else-if="feature.type === 'leave'" class="w-full space-y-2">
              <div class="flex items-center gap-3 rounded-lg bg-muted p-3">
                <span class="size-8 rounded-full bg-foreground/10" />
                <div class="flex-1 space-y-1.5"><span class="block h-2 w-20 rounded-full bg-foreground/20" /><span class="block h-1.5 w-14 rounded-full bg-foreground/10" /></div>
                <span class="rounded-full bg-foreground px-2 py-1 text-[9px] text-background">Setujui</span>
              </div>
              <div class="flex items-center gap-3 rounded-lg bg-muted/60 p-3">
                <span class="size-8 rounded-full bg-foreground/10" />
                <span class="h-2 w-24 rounded-full bg-foreground/15" />
              </div>
            </div>

            <div v-else-if="feature.type === 'location'" class="relative h-full w-full overflow-hidden rounded-lg bg-muted">
              <div class="absolute inset-0 opacity-60 [background-image:linear-gradient(#0000000d_1px,transparent_1px),linear-gradient(90deg,#0000000d_1px,transparent_1px)] [background-size:24px_24px]" />
              <span class="absolute top-[23%] left-[27%] size-3 rounded-full bg-foreground ring-4 ring-foreground/15" />
              <span class="absolute top-[57%] left-[63%] size-3 rounded-full bg-foreground ring-4 ring-foreground/15" />
              <span class="absolute top-[42%] left-[43%] size-2 rounded-full bg-foreground/30" />
              <svg viewBox="0 0 240 100" class="absolute inset-0 size-full" fill="none" aria-hidden="true">
                <path d="M60 28 C92 46 125 62 155 55" stroke="currentColor" class="text-foreground/30" stroke-width="1.5" stroke-dasharray="4 4" />
              </svg>
            </div>

            <div v-else class="w-full space-y-2">
              <div v-for="name in ['Nadia', 'Raka', 'Alya']" :key="name" class="flex items-center gap-3 rounded-lg bg-muted/70 px-3 py-2">
                <span class="size-7 rounded-full bg-foreground/10" />
                <span class="flex-1 text-[10px] font-medium">{{ name }}</span>
                <span class="size-1.5 rounded-full bg-foreground" />
              </div>
            </div>
          </div>

          <h3 class="text-lg font-semibold">{{ feature.title }}</h3>
          <p class="mt-2 text-sm text-muted-foreground">{{ feature.description }}</p>
        </div>
      </div>
    </div>
  </section>
</template>
