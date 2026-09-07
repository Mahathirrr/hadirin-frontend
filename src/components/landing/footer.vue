<script setup lang="ts">
import { RouterLink } from 'vue-router'

import Logo from '@/components/logo.vue'

const footerLinks = {
  produk: [
    { name: 'Fitur', href: '#features' },
    { name: 'Harga', href: '#pricing' },
    { name: 'FAQ', href: '#faq' },
  ],
  perusahaan: [
    { name: 'Tentang', href: '#' },
    { name: 'Blog', href: '#' },
    { name: 'Karier', href: '#' },
  ],
  bantuan: [
    { name: 'Pusat bantuan', href: '#' },
    { name: 'Kontak', href: '#' },
    { name: 'Status', href: '#' },
  ],
}
</script>

<template>
  <footer class="bg-foreground text-background">
    <div class="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <RouterLink to="/" class="flex items-center space-x-2">
            <Logo :size="24" class="text-background" />
            <span class="font-bold">Hadirin</span>
          </RouterLink>
          <p class="mt-4 text-sm text-background/70">
            Platform absensi untuk tim modern.
          </p>
        </div>

        <div v-for="(links, title) in footerLinks" :key="title">
          <h4 class="mb-4 text-sm font-semibold capitalize">{{ title }}</h4>
          <ul class="space-y-2">
            <li v-for="link in links" :key="link.name">
              <a :href="link.href" class="text-sm text-background/70 transition-colors hover:text-background">
                {{ link.name }}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <p class="mt-10 text-sm text-background/60">
        © {{ new Date().getFullYear() }} Hadirin
      </p>
    </div>
  </footer>
</template>
