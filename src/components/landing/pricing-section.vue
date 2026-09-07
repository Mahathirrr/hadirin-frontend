<script setup lang="ts">
import { ref } from 'vue'
import { Check } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import ScrollReveal from '@/components/landing/scroll-reveal.vue'

const isAnnual = ref(true)

interface Plan {
  id: string
  name: string
  description: string
  monthlyPrice: string
  annualPrice: string
  period: string
  features: string[]
  cta: string
  popular?: boolean
  badge?: string
}

const plans: Plan[] = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'Cocok untuk UKM & tim kecil yang baru mulai digitalisasi absensi.',
    monthlyPrice: 'Rp0',
    annualPrice: 'Rp0',
    period: 'Gratis selamanya',
    features: [
      'Hingga 10 karyawan aktif',
      'Absensi GPS mobile & QR Code',
      '1 titik lokasi Geofence kantor',
      'Pengajuan cuti & izin dasar',
      'Ekspor rekap Excel bulanan',
      'Dukungan via Email',
    ],
    cta: 'Mulai Gratis',
  },
  {
    id: 'pro',
    name: 'Pro Business',
    description: 'Paket terlengkap untuk perusahaan yang menuntut akurasi 100% tanpa kecurangan.',
    monthlyPrice: 'Rp18.000',
    annualPrice: 'Rp14.400',
    period: 'per karyawan / bulan',
    features: [
      'Semua fitur Starter',
      'Face ID Biometrik Anti-Spoofing',
      'Multi-Geofence cabang tak terbatas',
      'Deteksi Anomaly & Fake-GPS otomatis',
      'Alur persetujuan cuti & lembur bertingkat',
      'Integrasi Slack, WhatsApp & Google Calendar',
      'Laporan analitik keterlambatan & tren',
      'Dukungan prioritas WhatsApp HR',
    ],
    cta: 'Coba Gratis 14 Hari',
    popular: true,
    badge: 'Pilihan Terpopuler',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Solusi kustom dengan keamanan tingkat tinggi untuk korporasi skala besar.',
    monthlyPrice: 'Kustom',
    annualPrice: 'Kustom',
    period: 'disesuaikan kebutuhan',
    features: [
      'Semua fitur Pro Business',
      'Kapasitas karyawan tak terbatas',
      'REST API & Webhook HRIS kustom',
      'Integrasi SAP, Talenta & ERP internal',
      'SLA uptime 99.9% bergaransi',
      'Single Sign-On (SSO / SAML)',
      'Dedicated Account Manager 24/7',
      'Opsi implementasi on-premise / private cloud',
    ],
    cta: 'Hubungi Tim Sales',
  },
]
</script>

<template>
  <section id="pricing" class="relative py-24 sm:py-32 bg-muted/20">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section Header -->
      <ScrollReveal animation="fade-up">
        <div class="mx-auto max-w-3xl text-center">
        <Badge variant="outline" class="mb-4 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider">
          Harga Transparan
        </Badge>
        <h2 class="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl text-foreground">
          Investasi Terjangkau untuk Produktivitas Maksimal
        </h2>
        <p class="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
          Mulai gratis tanpa kartu kredit. Tingkatkan kapasitas kapan saja seiring pertumbuhan tim Anda.
        </p>

        <!-- Monthly / Annual Toggle -->
        <div class="mt-8 flex items-center justify-center gap-3">
          <span :class="['text-sm font-medium', !isAnnual ? 'text-foreground' : 'text-muted-foreground']">
            Bulanan
          </span>
          <button
            type="button"
            class="relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-muted p-0.5 transition-colors duration-200 ease-in-out focus:outline-none"
            :class="isAnnual ? 'bg-primary' : 'bg-muted-foreground/30'"
            @click="isAnnual = !isAnnual"
          >
            <span
              class="pointer-events-none inline-block size-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
              :class="isAnnual ? 'translate-x-7' : 'translate-x-0'"
            />
          </button>
          <span :class="['text-sm font-medium flex items-center gap-1.5', isAnnual ? 'text-foreground' : 'text-muted-foreground']">
            Tahunan
            <span class="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
              Hemat 20%
            </span>
          </span>
        </div>
        </div>
      </ScrollReveal>

      <!-- Pricing Cards Grid -->
      <div class="mx-auto mt-16 grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-3 items-stretch">
        <div
          v-for="(plan, index) in plans"
          :key="plan.id"
          data-aos="fade-up"
          :data-aos-delay="index * 90"
          :class="[
            'relative flex flex-col justify-between landing-card p-8',
            plan.popular ? 'border-2 border-primary' : '',
          ]"
        >
          <!-- Popular Ribbon Badge -->
          <div
            v-if="plan.popular"
            class="absolute -top-3.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 rounded-full bg-primary px-4 py-1 text-xs font-semibold text-primary-foreground shadow-md"
          >
            <span>{{ plan.badge }}</span>
          </div>

          <div>
            <!-- Title & Description -->
            <h3 class="text-xl font-bold text-foreground">{{ plan.name }}</h3>
            <p class="mt-2 text-xs sm:text-sm text-muted-foreground min-h-[40px] leading-relaxed">
              {{ plan.description }}
            </p>

            <!-- Price -->
            <div class="mt-6 flex items-baseline gap-1.5">
              <span class="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground">
                {{ isAnnual ? plan.annualPrice : plan.monthlyPrice }}
              </span>
              <span class="text-xs sm:text-sm text-muted-foreground font-medium">
                {{ plan.period }}
              </span>
            </div>

            <!-- CTA Button -->
            <div class="mt-6">
              <Button
                class="w-full h-11 text-sm font-semibold cursor-pointer"
                :variant="plan.popular ? 'default' : 'outline'"
                as-child
              >
                <RouterLink :to="plan.id === 'enterprise' ? '/auth/sign-up' : '/auth/sign-up'">
                  {{ plan.cta }}
                </RouterLink>
              </Button>
            </div>

            <!-- Feature List -->
            <div class="mt-8 space-y-3">
              <p class="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Fitur yang didapatkan:
              </p>
              <ul class="space-y-3 text-xs sm:text-sm">
                <li
                  v-for="feature in plan.features"
                  :key="feature"
                  class="flex items-start gap-3 text-foreground/90"
                >
                  <Check class="size-4 shrink-0 text-foreground/60 mt-0.5" />
                  <span class="leading-tight">{{ feature }}</span>
                </li>
              </ul>
            </div>
          </div>

          <!-- Bottom Micro-info -->
          <div class="mt-8 pt-4 border-t border-border/50 text-[11px] text-muted-foreground text-center">
            {{ plan.id === 'starter' ? 'Tanpa perlu kartu kredit' : 'Bisa dibatalkan kapan saja' }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
