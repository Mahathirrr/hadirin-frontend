<script setup lang="ts">
import { Clock, FileText, MapPin, Users } from 'lucide-vue-next'
import type { Component } from 'vue'

import DotPattern from '@/components/dot-pattern.vue'
import { Card, CardContent } from '@/components/ui/card'

interface Stat {
  icon: Component
  value: string
  label: string
  description: string
}

const stats: Stat[] = [
  { icon: Clock, value: 'Absensi', label: 'Harian', description: 'Masuk, pulang, terlambat' },
  { icon: Users, value: 'Tim', label: 'Workspace', description: 'Karyawan dalam satu tempat' },
  { icon: MapPin, value: 'Lokasi', label: 'Kerja', description: 'Pantau kehadiran di lapangan' },
  { icon: FileText, value: 'Laporan', label: 'Operasional', description: 'Cuti, work plan, audit' },
]
</script>

<template>
  <section class="relative py-12 sm:py-16">
    <!-- Background with transparency -->
    <div class="absolute inset-0 bg-gradient-to-r from-primary/8 via-transparent to-secondary/20" />
    <DotPattern class="opacity-75" size="md" fade-style="circle" />

    <div class="container relative mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Stats Grid -->
      <div class="grid grid-cols-2 gap-6 lg:grid-cols-4 md:gap-8">
        <Card v-for="(stat, index) in stats" :key="index" class="border-border/50 bg-background/60 py-0 text-center backdrop-blur-sm">
          <CardContent class="p-6">
            <div class="mb-4 flex justify-center">
              <div class="rounded-xl bg-primary/10 p-3">
                <component :is="stat.icon" class="h-6 w-6 text-primary" />
              </div>
            </div>
            <div class="space-y-1">
              <h3 class="text-foreground text-2xl font-bold sm:text-3xl">
                {{ stat.value }}
              </h3>
              <p class="font-semibold text-foreground">{{ stat.label }}</p>
              <p class="text-sm text-muted-foreground">{{ stat.description }}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </section>
</template>
