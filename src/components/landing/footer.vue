<script setup lang="ts">
import { RouterLink } from 'vue-router'
import Logo from '@/components/logo.vue'

const footerLinks = {
  produk: [
    { name: 'Fitur Utama', href: '#features' },
    { name: 'Face ID Biometrik', href: '#features' },
    { name: 'Geofence Multi-Cabang', href: '#features' },
    { name: 'Deteksi Anomaly AI', href: '#features' },
    { name: 'Paket & Harga', href: '#pricing' },
  ],
  integrasi: [
    { name: 'Slack Integration', href: '#integrations' },
    { name: 'WhatsApp Business API', href: '#integrations' },
    { name: 'Google Workspace', href: '#integrations' },
    { name: 'Microsoft Teams', href: '#integrations' },
    { name: 'REST API & Webhook', href: '#integrations' },
  ],
  solusi: [
    { name: 'Kantor & WFH Hybrid', href: '#use-cases' },
    { name: 'Pabrik & Multi-Shift', href: '#use-cases' },
    { name: 'Retail & Multi-Outlet', href: '#use-cases' },
    { name: 'Tim Sales & Lapangan', href: '#use-cases' },
    { name: 'Klinik & Kesehatan', href: '#use-cases' },
  ],
  perusahaan: [
    { name: 'Tanya Jawab (FAQ)', href: '#faq' },
    { name: 'Panduan Penggunaan', href: '/guide' },
    { name: 'Keamanan & Privasi', href: '#faq' },
    { name: 'Hubungi Sales', href: '/auth/sign-up' },
  ],
}
</script>

<template>
  <footer class="border-t border-border/70 bg-card/60 backdrop-blur-sm">
    <div class="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <div class="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
        <!-- Brand Column -->
        <div class="lg:col-span-1 space-y-4">
          <RouterLink to="/" class="flex items-center gap-2.5">
            <Logo :size="32" class="shrink-0" />
            <span class="text-xl font-bold tracking-tight text-foreground">Hadirin</span>
          </RouterLink>
          <p class="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Platform presensi biometrik & manajemen operasional kerja cerdas untuk perusahaan modern di Indonesia.
          </p>
          <div class="pt-2 text-xs text-muted-foreground">
            <span class="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-emerald-600 dark:text-emerald-400 font-medium">
              <span class="size-1.5 rounded-full bg-emerald-500" />
              Sistem Operasional 99.9%
            </span>
          </div>
        </div>

        <!-- Links Columns -->
        <div v-for="(links, title) in footerLinks" :key="title" class="space-y-3">
          <h4 class="text-xs font-bold uppercase tracking-wider text-foreground">
            {{ title }}
          </h4>
          <ul class="space-y-2.5">
            <li v-for="link in links" :key="link.name">
              <a
                :href="link.href"
                class="text-xs sm:text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {{ link.name }}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/50 pt-8 sm:flex-row text-xs text-muted-foreground">
        <p>© {{ new Date().getFullYear() }} Hadirin Platform. Seluruh hak cipta dilindungi undang-undang.</p>
        <div class="flex items-center gap-6">
          <a href="#faq" class="hover:text-foreground transition-colors">Kebijakan Privasi</a>
          <a href="#faq" class="hover:text-foreground transition-colors">Syarat Layanan</a>
          <a href="#faq" class="hover:text-foreground transition-colors">Keamanan Data</a>
        </div>
      </div>
    </div>
  </footer>
</template>
