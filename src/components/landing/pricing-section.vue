<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { Check } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import ScrollReveal from '@/components/landing/scroll-reveal.vue'
import { api, type SubscriptionPlan } from '@/lib/api'
import { ROUTES } from '@/lib/routes'

const FEATURE_LABELS: Record<string, string> = {
  absensi: 'Absensi GPS, QR, check-in/out',
  geofence: 'Geofence & pembatasan lokasi',
  laporan: 'Laporan mingguan CSV',
  face_id: 'Face ID: pendaftaran & verifikasi wajah',
  anomaly: 'Peringatan anomali kehadiran',
  audit: 'Riwayat perubahan data perusahaan',
}

const plans = ref<SubscriptionPlan[]>([])
const billingEnabled = ref(false)
const loadError = ref(false)

onMounted(async () => {
  try {
    const status = await api.billingStatus()
    billingEnabled.value = status.enabled
    const res = await api.listSubscriptionPlans()
    plans.value = res.data ?? []
  } catch {
    loadError.value = true
  }
})

function formatIDR(n: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n)
}

function featureLines(plan: SubscriptionPlan): string[] {
  const raw = plan.features
  const keys: string[] = Array.isArray(raw) ? (raw as string[]) : []
  return keys.map((k) => FEATURE_LABELS[k] ?? k)
}

const sortedPlans = computed(() =>
  [...plans.value].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)),
)

const popularCode = 'pro'
</script>

<template>
  <section id="pricing" class="relative py-24 sm:py-32 bg-muted/20">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <ScrollReveal animation="fade-up">
        <div class="mx-auto max-w-3xl text-center">
          <Badge variant="outline" class="mb-4 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider">
            Langganan
          </Badge>
          <h2 class="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl text-foreground">
            Pilih paket untuk tim Anda
          </h2>
          <p class="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
            Harga dan fitur di bawah sama dengan yang Anda lihat setelah masuk ke aplikasi.
            Pembayaran dalam Rupiah, per periode langganan yang Anda pilih.
          </p>
        </div>
      </ScrollReveal>

      <div v-if="loadError" class="mx-auto mt-12 max-w-lg text-center text-sm text-muted-foreground">
        Paket tidak dapat dimuat. Masuk ke aplikasi untuk melihat pilihan langganan.
      </div>

      <div v-else-if="!billingEnabled" class="mx-auto mt-12 max-w-lg text-center text-sm text-muted-foreground">
        Daftar akun dan buka menu Langganan di aplikasi untuk melihat paket dan menyelesaikan pembayaran.
      </div>

      <div v-else class="mx-auto mt-16 grid max-w-6xl grid-cols-1 gap-8 pt-2 lg:grid-cols-3 items-stretch">
        <div
          v-for="(plan, index) in sortedPlans"
          :key="plan.id"
          data-aos="fade-up"
          :data-aos-delay="index * 90"
          :class="[
            'relative flex flex-col justify-between landing-card p-8',
            plan.code === popularCode ? 'border-2 border-primary' : '',
          ]"
        >
          <div v-if="plan.code === popularCode" class="mb-4 flex justify-center">
            <span class="rounded-full bg-primary px-4 py-1 text-xs font-semibold text-primary-foreground">
              Paling lengkap
            </span>
          </div>

          <div>
            <h3 class="text-xl font-bold text-foreground">{{ plan.name }}</h3>
            <p class="mt-2 text-xs sm:text-sm text-muted-foreground min-h-[40px] leading-relaxed">
              {{ plan.description }}
            </p>

            <div class="mt-6 flex items-baseline gap-1.5 flex-wrap">
              <span class="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground">
                {{ formatIDR(plan.price_idr) }}
              </span>
              <span class="text-xs sm:text-sm text-muted-foreground font-medium">
                / {{ plan.duration_days }} hari, max {{ plan.max_employees }} karyawan
              </span>
            </div>

            <div class="mt-6">
              <Button
                class="w-full h-11 text-sm font-semibold cursor-pointer"
                :variant="plan.code === popularCode ? 'default' : 'outline'"
                as-child
              >
                <RouterLink :to="ROUTES.signUp">Daftar & pilih paket</RouterLink>
              </Button>
            </div>

            <div class="mt-8 space-y-3">
              <p class="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Termasuk di paket ini:
              </p>
              <ul class="space-y-3 text-xs sm:text-sm">
                <li
                  v-for="feature in featureLines(plan)"
                  :key="feature"
                  class="flex items-start gap-3 text-foreground/90"
                >
                  <Check class="size-4 shrink-0 text-foreground/60 mt-0.5" />
                  <span class="leading-tight">{{ feature }}</span>
                </li>
              </ul>
            </div>
          </div>

          <div class="mt-8 pt-4 border-t border-border/50 text-[11px] text-muted-foreground text-center">
            Pembayaran setelah masuk ke aplikasi
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
