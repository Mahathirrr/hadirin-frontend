<script setup lang="ts">
import { ArrowRight } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'

import { Button } from '@/components/ui/button'
</script>

<template>
  <section class="py-16 lg:py-24">
    <div class="container mx-auto px-4 lg:px-8">
      <div class="mx-auto max-w-4xl rounded-3xl bg-primary px-8 py-16 text-center text-primary-foreground sm:px-12">
        <h2 class="text-3xl font-bold tracking-tight sm:text-4xl">
          Siap memulai absensi yang lebih disiplin?
        </h2>
        <p class="mx-auto mt-4 max-w-xl text-primary-foreground/80">
          Buat workspace, undang tim, dan mulai catat kehadiran hari ini.
        </p>
        <div class="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
          <Button size="lg" variant="secondary" class="cursor-pointer" as-child>
            <RouterLink to="/auth/sign-up">
              Mulai Sekarang
              <ArrowRight class="ms-2 size-4" />
            </RouterLink>
          </Button>
          <Button size="lg" variant="ghost" class="cursor-pointer text-primary-foreground hover:bg-primary-foreground/10" as-child>
            <RouterLink to="/auth/sign-in">Masuk</RouterLink>
          </Button>
        </div>
      </div>
    </div>
  </section>
</template>
