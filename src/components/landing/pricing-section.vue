<script setup lang="ts">
import { Check } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface Plan {
  name: string
  description: string
  price: string
  period: string
  features: string[]
  cta: string
  popular?: boolean
}

const plans: Plan[] = [
  {
    name: 'Gratis',
    description: 'Untuk tim kecil yang baru mulai',
    price: 'Rp0',
    period: 'Tanpa biaya',
    features: ['Satu workspace', 'Absensi harian', 'Pengajuan cuti', 'Data karyawan', 'Kode undangan'],
    cta: 'Mulai Sekarang',
  },
  {
    name: 'Lite',
    description: 'Operasional harian yang lebih lengkap',
    price: 'Rp50.000',
    period: 'Per bulan',
    features: ['Monitoring lokasi', 'Device QR', 'Work plan dan laporan', 'Log audit', 'Geofence'],
    cta: 'Pilih Lite',
    popular: true,
  },
  {
    name: 'Enterprise',
    description: 'Untuk tim dengan kebutuhan khusus',
    price: 'Custom',
    period: 'Hubungi kami',
    features: ['Face ID', 'Deteksi anomaly', 'Lebih banyak anggota', 'Pengaturan lanjutan'],
    cta: 'Hubungi Kami',
  },
]
</script>

<template>
  <section id="pricing" class="bg-muted/40 py-24 sm:py-32">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="mx-auto mb-12 max-w-2xl text-center">
        <Badge variant="outline" class="mb-4">Harga</Badge>
        <h2 class="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">Mulai gratis, naikkan saat tim siap</h2>
        <p class="text-lg text-muted-foreground">
          Pilih paket yang sesuai dengan ukuran dan kebutuhan operasional tim Anda.
        </p>
      </div>

      <div class="mx-auto grid max-w-6xl gap-6 lg:grid-cols-3">
        <div
          v-for="plan in plans"
          :key="plan.name"
          class="flex flex-col gap-6 rounded-2xl bg-card/80 p-8 shadow-sm"
          :class="plan.popular ? 'bg-card shadow-xl ring-1 ring-foreground/10 lg:-my-2' : ''"
        >
          <div>
            <div class="mb-2 flex items-center gap-2">
              <span class="text-lg font-medium">{{ plan.name }}</span>
              <Badge v-if="plan.popular" class="bg-primary text-primary-foreground">Terpopuler</Badge>
            </div>
            <p class="text-sm text-muted-foreground">{{ plan.description }}</p>
          </div>

          <div>
            <div class="text-4xl font-bold">{{ plan.price }}</div>
            <div class="text-sm text-muted-foreground">{{ plan.period }}</div>
          </div>

          <Button
            class="w-full cursor-pointer"
            :variant="plan.popular ? 'default' : 'secondary'"
            as-child
          >
            <RouterLink to="/auth/sign-up">{{ plan.cta }}</RouterLink>
          </Button>

          <ul class="space-y-3 text-sm">
            <li v-for="feature in plan.features" :key="feature" class="flex items-center gap-3">
              <Check class="size-4 shrink-0 text-muted-foreground" :stroke-width="2.5" />
              <span>{{ feature }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>
