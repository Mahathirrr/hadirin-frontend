<script setup lang="ts">
import { RouterLink } from 'vue-router'

import Logo from '@/components/logo.vue'

interface FooterLink {
  name: string
  href: string
  external?: boolean
}

const navigasi: FooterLink[] = [
  { name: 'Fitur', href: '#features' },
  { name: 'Integrasi', href: '#integrations' },
  { name: 'Solusi', href: '#use-cases' },
  { name: 'Harga', href: '#pricing' },
  { name: 'FAQ', href: '#faq' },
]

const akun: FooterLink[] = [
  { name: 'Masuk', href: '/auth/sign-in' },
  { name: 'Daftar Gratis', href: '/auth/sign-up' },
]
</script>

<template>
  <footer class="border-t border-border/70 bg-card/60 backdrop-blur-sm">
    <div class="container mx-auto px-4 py-14 sm:px-6 lg:px-8">
      <div class="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div class="space-y-4 sm:col-span-2 lg:col-span-2">
          <RouterLink to="/" class="inline-flex items-center gap-3">
            <Logo :size="40" class="shrink-0" />
            <span class="text-xl font-bold tracking-tight text-foreground">Hadirin</span>
          </RouterLink>
          <p class="max-w-md text-sm text-muted-foreground leading-relaxed">
            Platform presensi biometrik dan manajemen kehadiran untuk tim operasional di Indonesia.
          </p>
        </div>

        <div class="space-y-3">
          <h4 class="text-xs font-semibold uppercase tracking-wider text-foreground">
            Navigasi
          </h4>
          <ul class="space-y-2.5">
            <li v-for="link in navigasi" :key="link.name">
              <a
                :href="link.href"
                class="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {{ link.name }}
              </a>
            </li>
          </ul>
        </div>

        <div class="space-y-3">
          <h4 class="text-xs font-semibold uppercase tracking-wider text-foreground">
            Akun
          </h4>
          <ul class="space-y-2.5">
            <li v-for="link in akun" :key="link.name">
              <RouterLink
                :to="link.href"
                class="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {{ link.name }}
              </RouterLink>
            </li>
          </ul>
        </div>
      </div>

      <div class="mt-10 border-t border-border/50 pt-6 text-xs text-muted-foreground">
        <p>© {{ new Date().getFullYear() }} Hadirin. Seluruh hak cipta dilindungi.</p>
      </div>
    </div>
  </footer>
</template>
