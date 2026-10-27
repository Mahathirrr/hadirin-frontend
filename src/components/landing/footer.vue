<script setup lang="ts">
import { ArrowUpRight } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'

import Logo from '@/components/logo.vue'
import { Button } from '@/components/ui/button'

interface FooterLink {
  name: string
  href: string
  external?: boolean
}

const navigasi: FooterLink[] = [
  { name: 'Fitur', href: '#features' },
  { name: 'Solusi', href: '#use-cases' },
  { name: 'Harga', href: '#pricing' },
  { name: 'FAQ', href: '#faq' },
]

const produk: FooterLink[] = [
  { name: 'Masuk ke aplikasi', href: '/auth/sign-in' },
  { name: 'Lihat harga', href: '#pricing' },
]

const akun: FooterLink[] = [
  { name: 'Daftar akun', href: '/auth/sign-up' },
  { name: 'Lupa password', href: '/auth/forgot-password' },
]

const capabilities = ['GPS & QR absensi', 'Geofence', 'Face ID', 'Laporan CSV', 'Langganan']
</script>

<template>
  <footer class="relative border-t border-border bg-muted/30">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid gap-12 py-14 lg:grid-cols-12 lg:gap-8">
        <div class="space-y-6 lg:col-span-5">
          <RouterLink to="/" class="inline-flex items-center gap-3">
            <Logo :size="44" class="shrink-0" />
            <div class="leading-tight">
              <span class="block text-xl font-bold tracking-tight text-foreground">Hadirin</span>
              <span class="block text-[11px] font-medium text-muted-foreground">Presensi & operasional</span>
            </div>
          </RouterLink>

          <p class="max-w-sm text-sm leading-relaxed text-muted-foreground">
            Software presensi untuk perusahaan di Indonesia: absensi, cuti, shift, geofence, dan laporan mingguan.
            Paket langganan berbayar sesuai kebutuhan tim Anda.
          </p>

          <div class="flex flex-wrap gap-2">
            <span
              v-for="cap in capabilities"
              :key="cap"
              class="rounded-md border border-border/80 bg-background px-2.5 py-1 text-[11px] font-medium text-foreground/80"
            >
              {{ cap }}
            </span>
          </div>

          <Button variant="outline" size="sm" class="h-9 cursor-pointer" as-child>
            <RouterLink to="/auth/sign-up">
              Daftar akun
              <ArrowUpRight class="ml-1.5 size-3.5 opacity-70" />
            </RouterLink>
          </Button>
        </div>

        <div class="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-7 lg:pl-8">
          <div class="space-y-4">
            <h4 class="text-xs font-semibold uppercase tracking-wider text-foreground">
              Navigasi
            </h4>
            <ul class="space-y-2.5">
              <li v-for="link in navigasi" :key="link.name">
                <a
                  :href="link.href"
                  class="text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
                >
                  {{ link.name }}
                </a>
              </li>
            </ul>
          </div>

          <div class="space-y-4">
            <h4 class="text-xs font-semibold uppercase tracking-wider text-foreground">
              Produk
            </h4>
            <ul class="space-y-2.5">
              <li v-for="link in produk" :key="link.name">
                <RouterLink
                  :to="link.href"
                  class="inline-flex items-center gap-1 text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
                >
                  {{ link.name }}
                </RouterLink>
              </li>
            </ul>
          </div>

          <div class="space-y-4 col-span-2 sm:col-span-1">
            <h4 class="text-xs font-semibold uppercase tracking-wider text-foreground">
              Akun
            </h4>
            <ul class="space-y-2.5">
              <li v-for="link in akun" :key="link.name">
                <RouterLink
                  :to="link.href"
                  class="text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
                >
                  {{ link.name }}
                </RouterLink>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="flex flex-col gap-3 border-t border-border/60 py-6 sm:flex-row sm:items-center sm:justify-between">
        <p class="text-xs text-muted-foreground">
          © {{ new Date().getFullYear() }} Hadirin. Seluruh hak cipta dilindungi.
        </p>
        <p class="text-xs text-muted-foreground/90">
          Layanan presensi untuk perusahaan di Indonesia.
        </p>
      </div>
    </div>
  </footer>
</template>
