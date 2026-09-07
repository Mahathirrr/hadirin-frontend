<script setup lang="ts">
import { ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'

import DotPattern from '@/components/dot-pattern.vue'
import HeroPreview from '@/components/landing/hero-preview.vue'
import ScrollReveal from '@/components/landing/scroll-reveal.vue'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
</script>

<template>
  <section id="hero" class="relative isolate overflow-hidden bg-background pt-24 pb-20 sm:pt-32 sm:pb-28">
    <DotPattern size="lg" fade-style="ellipse" opacity="high" />

    <div class="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
      <ScrollReveal animation="fade-up" :duration="800">
        <div class="mx-auto max-w-4xl text-center">
        <div class="mb-8 flex justify-center">
          <Badge variant="outline" class="rounded-full border-border bg-card/80 px-4 py-1.5 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur-sm">
            Hadirin 2.0 — Face ID & Multi-Geofence
          </Badge>
        </div>

        <h1 class="text-4xl font-bold tracking-tight sm:text-6xl lg:text-[4.25rem] lg:leading-[1.08] text-foreground">
          Bikin Absen Karyawan Jadi
          <span class="block sm:inline sm:ml-2 text-foreground/80">
            Otomatis & Akurat
          </span>
        </h1>

        <p class="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed">
          Tinggalkan mesin fingerprint lawas dan absensi manual yang rentan titip absen. Hadirin menghadirkan verifikasi wajah biometrik, geofence presisi, dan rekap otomatis dalam satu dashboard modern.
        </p>

        <div class="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <Button size="lg" class="h-12 px-8 text-base font-semibold cursor-pointer" as-child>
            <RouterLink to="/auth/sign-up">
              <span>Mulai Gratis 14 Hari</span>
              <ArrowRight class="ml-2 size-4" />
            </RouterLink>
          </Button>

          <Button variant="outline" size="lg" class="h-12 px-8 text-base font-medium cursor-pointer" as-child>
            <a href="#features">Pelajari Fitur</a>
          </Button>
        </div>

        <div class="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-muted-foreground">
          <div class="flex items-center gap-2">
            <CheckCircle2 class="size-4 text-foreground/70" />
            <span>99.8% Akurasi Face ID</span>
          </div>
          <div class="flex items-center gap-2">
            <ShieldCheck class="size-4 text-foreground/70" />
            <span>Anti Fake-GPS & Titip Absen</span>
          </div>
        </div>
        </div>
      </ScrollReveal>

      <ScrollReveal animation="fade-up" :delay="120" :duration="900">
        <div class="mx-auto mt-16 max-w-6xl sm:mt-20">
          <HeroPreview />
        </div>
      </ScrollReveal>
    </div>
  </section>
</template>
