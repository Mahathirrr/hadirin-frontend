<script setup lang="ts">
import { ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'

import DotPattern from '@/components/dot-pattern.vue'
import Logo from '@/components/logo.vue'
import { Button } from '@/components/ui/button'
</script>

<template>
  <section class="relative py-20 lg:py-28 overflow-hidden">
    <div class="container mx-auto px-4 lg:px-8">
      <div class="relative mx-auto max-w-5xl overflow-hidden rounded-3xl border border-border bg-foreground p-8 sm:p-14 lg:p-16 text-center text-background shadow-2xl">
        <div class="absolute inset-0 -z-0 pointer-events-none opacity-20">
          <DotPattern size="md" fade-style="ellipse" opacity="high" class="!bg-[radial-gradient(rgba(255,255,255,0.35)_1px,transparent_1px)]" />
        </div>

        <div class="relative z-10 flex flex-col items-center">
          <div class="mb-6 flex size-16 items-center justify-center rounded-2xl border border-background/15 bg-background/10 backdrop-blur-sm">
            <Logo :size="40" />
          </div>

          <h2 class="max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Siap Memulai Presensi Karyawan yang Lebih Disiplin & Akurat?
          </h2>

          <p class="mx-auto mt-4 max-w-xl text-base sm:text-lg text-background/70 leading-relaxed">
            Kelola kehadiran, cuti, dan rekap operasional tim dalam satu workspace Hadirin — setup cepat, tanpa ribet.
          </p>

          <div class="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              class="h-12 px-8 text-base font-semibold bg-background text-foreground hover:bg-background/90 shadow-xl cursor-pointer"
              as-child
            >
              <RouterLink to="/auth/sign-up">
                <span>Coba Gratis 14 Hari</span>
                <ArrowRight class="ms-2 size-4" />
              </RouterLink>
            </Button>

            <RouterLink
              to="/auth/sign-in"
              class="inline-flex h-12 items-center justify-center rounded-md border border-background/30 bg-transparent px-8 text-base font-medium text-background transition-colors hover:bg-background/10 cursor-pointer"
            >
              Masuk ke Workspace
            </RouterLink>
          </div>

          <div class="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-background/60">
            <div class="flex items-center gap-1.5">
              <CheckCircle2 class="size-4 text-background/80" />
              <span>Gratis 14 hari penuh</span>
            </div>
            <div class="flex items-center gap-1.5">
              <CheckCircle2 class="size-4 text-background/80" />
              <span>Tanpa kartu kredit</span>
            </div>
            <div class="flex items-center gap-1.5">
              <ShieldCheck class="size-4 text-background/80" />
              <span>Setup selesai dalam 2 menit</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
