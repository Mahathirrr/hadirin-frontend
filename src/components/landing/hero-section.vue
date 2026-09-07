<script setup lang="ts">
import { ArrowRight } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'

import DotPattern from '@/components/dot-pattern.vue'
import HeroPreview from '@/components/landing/hero-preview.vue'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
</script>

<template>
  <section id="hero" class="relative overflow-hidden bg-gradient-to-b from-background to-background/80 pt-16 pb-16 sm:pt-20">
    <div class="absolute inset-0">
      <DotPattern class="opacity-100" size="md" fade-style="ellipse" />
    </div>

    <div class="container relative mx-auto px-4 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-3xl text-center">
        <div class="mb-8 flex justify-center">
          <Badge variant="outline" class="px-4 py-2">
            Operasional kehadiran, lebih terkendali
          </Badge>
        </div>

        <h1 class="mb-6 text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
          Kehadiran tim
          <span class="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            tanpa ribet
          </span>
        </h1>

        <p class="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground sm:text-xl">
          Satu ruang kerja untuk absensi, pengajuan, lokasi, dan tindak lanjut harian tim Anda.
        </p>

        <div class="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Button size="lg" class="cursor-pointer text-base" as-child>
            <RouterLink to="/auth/sign-up">
              Mulai Sekarang
              <ArrowRight class="ml-2 h-4 w-4" />
            </RouterLink>
          </Button>
          <Button variant="outline" size="lg" class="cursor-pointer text-base" as-child>
            <RouterLink to="/auth/sign-in">Masuk</RouterLink>
          </Button>
        </div>
      </div>

      <div class="mx-auto mt-16 max-w-5xl pb-10 sm:mt-20">
        <HeroPreview />
      </div>
    </div>
  </section>
</template>
