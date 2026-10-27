<script setup lang="ts">
import { RouterLink } from 'vue-router'

import Logo from '@/components/logo.vue'
import { ROUTES } from '@/lib/routes'

export interface LegalSection {
  id: string
  title: string
  paragraphs: string[]
  bullets?: string[]
}

defineProps<{
  title: string
  description: string
  lastUpdated: string
  sections: LegalSection[]
}>()
</script>

<template>
  <div class="min-h-screen bg-background">
    <header class="sticky top-0 z-40 border-b border-border/60 bg-background/90 backdrop-blur-md">
      <div class="container mx-auto flex h-14 items-center justify-between px-4 sm:px-6 lg:px-8">
        <RouterLink to="/" class="inline-flex items-center gap-2.5 font-semibold tracking-tight">
          <Logo :size="32" />
          <span>Hadirin</span>
        </RouterLink>
        <nav class="flex items-center gap-4 text-sm">
          <RouterLink :to="ROUTES.terms" class="text-muted-foreground hover:text-foreground">Syarat</RouterLink>
          <RouterLink :to="ROUTES.privacy" class="text-muted-foreground hover:text-foreground">Privasi</RouterLink>
        </nav>
      </div>
    </header>

    <main class="container mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <RouterLink :to="ROUTES.landing" class="text-sm text-muted-foreground hover:text-foreground hover:underline">
        Kembali ke beranda
      </RouterLink>

      <header class="mt-6 space-y-3 border-b border-border/60 pb-8">
        <h1 class="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{{ title }}</h1>
        <p class="text-base leading-relaxed text-muted-foreground">{{ description }}</p>
        <p class="text-xs text-muted-foreground">Terakhir diperbarui: {{ lastUpdated }}</p>
      </header>

      <article class="mt-10 space-y-10">
        <section v-for="section in sections" :key="section.id" :id="section.id" class="scroll-mt-24">
          <h2 class="text-lg font-semibold tracking-tight text-foreground sm:text-xl">
            {{ section.title }}
          </h2>
          <div class="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
            <p v-for="(para, i) in section.paragraphs" :key="i">{{ para }}</p>
            <ul v-if="section.bullets?.length" class="list-disc space-y-1.5 pl-5">
              <li v-for="(item, j) in section.bullets" :key="j">{{ item }}</li>
            </ul>
          </div>
        </section>
      </article>

      <footer class="mt-14 border-t border-border/60 pt-8 text-sm text-muted-foreground">
        <p>
          Pertanyaan terkait dokumen ini:
          <a href="mailto:muhammad.mahathir.id@gmail.com" class="text-foreground underline underline-offset-4">
            muhammad.mahathir.id@gmail.com
          </a>
        </p>
        <p class="mt-4 flex flex-wrap gap-x-4 gap-y-1">
          <RouterLink :to="ROUTES.terms" class="hover:text-foreground hover:underline">Syarat Layanan</RouterLink>
          <RouterLink :to="ROUTES.privacy" class="hover:text-foreground hover:underline">Kebijakan Privasi</RouterLink>
        </p>
      </footer>
    </main>
  </div>
</template>
