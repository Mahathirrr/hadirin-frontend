<script setup lang="ts">
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'
import Logo from '@/components/logo.vue'
import { Button } from '@/components/ui/button'
</script>

<template>
  <section class="relative py-20 lg:py-28 overflow-hidden">
    <div class="container mx-auto px-4 lg:px-8">
      <div class="relative mx-auto max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-zinc-900 via-zinc-950 to-black p-8 sm:p-14 lg:p-16 text-center text-white shadow-2xl">
        <!-- Ambient radial glow -->
        <div class="absolute -top-24 left-1/2 -z-0 h-64 w-96 -translate-x-1/2 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />
        <div class="absolute -bottom-24 left-1/2 -z-0 h-64 w-96 -translate-x-1/2 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none" />

        <div class="relative z-10 flex flex-col items-center">
          <!-- Logo Emblem -->
          <div class="mb-6 flex size-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-inner">
            <Logo :size="36" />
          </div>

          <!-- Headline -->
          <h2 class="max-w-3xl text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl text-white">
            Siap Memulai Presensi Karyawan yang Lebih Disiplin & Akurat?
          </h2>

          <p class="mx-auto mt-4 max-w-xl text-base sm:text-lg text-zinc-300 leading-relaxed">
            Bergabunglah dengan lebih dari 500+ perusahaan yang telah menyederhanakan tracking kehadiran, cuti, dan payroll bersama Hadirin.
          </p>

          <!-- Action Buttons -->
          <div class="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" class="h-12 px-8 text-base font-semibold bg-white text-zinc-950 hover:bg-zinc-100 shadow-xl cursor-pointer" as-child>
              <RouterLink to="/auth/sign-up">
                <span>Coba Gratis 14 Hari</span>
                <ArrowRight class="ms-2 size-4 text-zinc-950" />
              </RouterLink>
            </Button>

            <Button size="lg" variant="outline" class="h-12 px-8 text-base font-medium border-white/20 text-white hover:bg-white/10 cursor-pointer" as-child>
              <RouterLink to="/auth/sign-in">
                <span>Masuk ke Workspace</span>
              </RouterLink>
            </Button>
          </div>

          <!-- Trust Badges List -->
          <div class="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-400">
            <div class="flex items-center gap-1.5">
              <CheckCircle2 class="size-4 text-emerald-400" />
              <span>Gratis 14 hari penuh</span>
            </div>
            <div class="flex items-center gap-1.5">
              <CheckCircle2 class="size-4 text-emerald-400" />
              <span>Tanpa kartu kredit</span>
            </div>
            <div class="flex items-center gap-1.5">
              <ShieldCheck class="size-4 text-cyan-400" />
              <span>Setup selesai dalam 2 menit</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
