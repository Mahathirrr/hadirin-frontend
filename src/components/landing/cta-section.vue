<script setup lang="ts">
import { ArrowRight } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'

import DotPattern from '@/components/dot-pattern.vue'
import Logo from '@/components/logo.vue'
import ScrollReveal from '@/components/landing/scroll-reveal.vue'
import { Button } from '@/components/ui/button'
</script>

<template>
  <section class="relative py-20 lg:py-28 overflow-hidden">
    <div class="container mx-auto px-4 lg:px-8">
      <ScrollReveal animation="fade-up" :duration="800">
        <div class="relative mx-auto max-w-5xl overflow-hidden rounded-3xl border border-border bg-foreground p-8 sm:p-14 lg:p-16 text-center text-background shadow-2xl">
          <div class="absolute inset-0 -z-0 pointer-events-none opacity-20">
            <DotPattern size="md" fade-style="ellipse" opacity="high" class="!bg-[radial-gradient(rgba(255,255,255,0.35)_1px,transparent_1px)]" />
          </div>

          <div class="relative z-10 flex flex-col items-center">
            <div class="mb-6 flex size-16 items-center justify-center rounded-2xl border border-background/15 bg-background/10 backdrop-blur-sm">
              <Logo :size="40" />
            </div>

            <h2 class="max-w-3xl text-3xl font-bold tracking-tight text-background sm:text-4xl lg:text-5xl">
              Siap mengelola presensi tim Anda?
            </h2>

            <p class="mx-auto mt-4 max-w-xl text-base sm:text-lg text-background/70 leading-relaxed">
              Daftar perusahaan, undang tim, lalu kelola absensi dan laporan dari dashboard yang sama.
            </p>

            <div class="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                size="lg"
                class="h-12 px-8 text-base font-semibold bg-background text-foreground hover:bg-background/90 shadow-xl cursor-pointer"
                as-child
              >
                <RouterLink to="/auth/sign-up">
                  <span>Daftar Akun</span>
                  <ArrowRight class="ms-2 size-4" />
                </RouterLink>
              </Button>

              <RouterLink
                to="/auth/sign-in"
                class="inline-flex h-12 items-center justify-center rounded-md border border-background/30 bg-transparent px-8 text-base font-medium text-background transition-colors hover:bg-background/10 cursor-pointer"
              >
                Masuk
              </RouterLink>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </div>
  </section>
</template>
