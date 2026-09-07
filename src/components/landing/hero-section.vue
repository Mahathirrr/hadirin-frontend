<script setup lang="ts">
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles, Star } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'

import DotPattern from '@/components/dot-pattern.vue'
import HeroPreview from '@/components/landing/hero-preview.vue'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
</script>

<template>
  <section id="hero" class="relative overflow-hidden bg-gradient-to-b from-background via-background/95 to-muted/20 pt-20 pb-20 sm:pt-28 sm:pb-28">
    <div class="absolute inset-0 -z-10 pointer-events-none">
      <DotPattern class="opacity-60" size="lg" fade-style="ellipse" />
    </div>

    <div class="container relative mx-auto px-4 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-4xl text-center">
        <!-- Release Badge -->
        <div class="mb-8 flex justify-center">
          <Badge variant="outline" class="group flex items-center gap-2 rounded-full border-border/80 bg-card/80 px-4 py-1.5 text-xs font-semibold shadow-sm backdrop-blur-sm transition-colors hover:border-foreground/30">
            <Sparkles class="size-3.5 text-amber-500 animate-pulse" />
            <span class="text-foreground">Hadirin 2.0 Telah Hadir</span>
            <span class="text-muted-foreground">•</span>
            <span class="text-muted-foreground font-normal">Biometric Face ID & Multi-Geofence</span>
            <ArrowRight class="size-3 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
          </Badge>
        </div>

        <!-- Headline -->
        <h1 class="text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl text-foreground">
          Bikin Absen Karyawan Jadi
          <span class="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 bg-clip-text text-transparent">
            Otomatis & Akurat
          </span>
        </h1>

        <!-- Subtitle -->
        <p class="mx-auto mt-6 max-w-2xl text-base sm:text-lg lg:text-xl text-muted-foreground leading-relaxed">
          Tinggalkan mesin fingerprint lawas dan absensi manual yang rentan titip absen. Hadirin menghadirkan verifikasi wajah biometrik, geofence presisi, dan rekap otomatis dalam satu dashboard modern.
        </p>

        <!-- CTA Buttons -->
        <div class="mt-8 flex flex-col items-center justify-center gap-3.5 sm:flex-row sm:gap-4">
          <Button size="lg" class="h-12 px-8 text-base font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all cursor-pointer" as-child>
            <RouterLink to="/auth/sign-up">
              <span>Mulai Gratis 14 Hari</span>
              <ArrowRight class="ml-2 size-4" />
            </RouterLink>
          </Button>

          <Button variant="outline" size="lg" class="h-12 px-8 text-base font-medium cursor-pointer" as-child>
            <a href="#features">Pelajari Fitur</a>
          </Button>
        </div>

        <!-- Social Proof Stats Row -->
        <div class="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground sm:gap-8">
          <div class="flex items-center gap-1.5">
            <div class="flex text-amber-400">
              <Star v-for="i in 5" :key="i" class="size-3.5 fill-current" />
            </div>
            <span class="font-semibold text-foreground">4.9/5</span>
            <span>(500+ Perusahaan)</span>
          </div>

          <div class="flex items-center gap-1.5">
            <CheckCircle2 class="size-4 text-emerald-500" />
            <span class="font-medium text-foreground">99.8% Akurasi Face ID</span>
          </div>

          <div class="flex items-center gap-1.5">
            <ShieldCheck class="size-4 text-teal-500" />
            <span class="font-medium text-foreground">Anti Fake-GPS & Titip Absen</span>
          </div>
        </div>
      </div>

      <!-- Hero Preview Window Container -->
      <div class="mx-auto mt-16 max-w-6xl sm:mt-20">
        <HeroPreview />
      </div>
    </div>
  </section>
</template>
