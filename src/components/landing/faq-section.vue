<script setup lang="ts">
import { ArrowRight, HelpCircle } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import ScrollReveal from '@/components/landing/scroll-reveal.vue'

interface FaqItem {
  value: string
  question: string
  answer: string
}

const faqItems: FaqItem[] = [
  {
    value: 'item-1',
    question: 'Apa itu Hadirin?',
    answer:
      'Hadirin adalah aplikasi presensi untuk perusahaan: absensi harian, geofence, cuti, shift, laporan mingguan, dan verifikasi wajah opsional. Cocok untuk kantor, pabrik, retail, sekolah, dan tim lapangan.',
  },
  {
    value: 'item-2',
    question: 'Bagaimana cara karyawan melakukan absensi?',
    answer:
      'Karyawan check-in lewat GPS di area yang Anda tentukan, scan QR di perangkat yang didaftarkan, atau verifikasi wajah jika fitur tersebut diaktifkan oleh admin perusahaan.',
  },
  {
    value: 'item-3',
    question: 'Bisakah dipakai untuk banyak cabang?',
    answer:
      'Ya. Anda dapat menambah beberapa titik lokasi kerja dan melihat ringkasan kehadiran per cabang dari dashboard.',
  },
  {
    value: 'item-4',
    question: 'Bagaimana langganan dan pembayaran?',
    answer:
      'Setelah daftar, pilih paket sesuai jumlah karyawan dan fitur yang dibutuhkan. Pembayaran dalam Rupiah per periode langganan, melalui halaman Langganan setelah Anda masuk.',
  },
  {
    value: 'item-5',
    question: 'Bagaimana pengajuan dan persetujuan cuti?',
    answer:
      'Karyawan mengajukan cuti lewat aplikasi. Admin atau pemilik akun perusahaan menyetujui atau menolak sesuai kebijakan internal Anda.',
  },
  {
    value: 'item-6',
    question: 'Bagaimana mendapatkan laporan kehadiran?',
    answer:
      'Unduh laporan mingguan dalam format CSV dari dashboard. Data absensi dan cuti siap dipakai untuk rekapitulasi kehadiran tim.',
  },
]
</script>

<template>
  <section id="faq" class="relative py-24 sm:py-32">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <ScrollReveal animation="fade-up">
        <div class="mx-auto mb-16 max-w-3xl text-center">
          <Badge variant="outline" class="mb-4 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider">
            Tanya jawab
          </Badge>
          <h2 class="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl text-foreground">
            Pertanyaan yang sering diajukan
          </h2>
          <p class="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
            Jawaban singkat seputar absensi, langganan, cuti, dan laporan untuk tim HR dan operasional.
          </p>
        </div>
      </ScrollReveal>

      <div class="mx-auto max-w-4xl">
        <Accordion type="single" collapsible class="space-y-4">
          <AccordionItem
            v-for="(item, index) in faqItems"
            :key="item.value"
            :value="item.value"
            data-aos="fade-up"
            :data-aos-delay="index * 50"
            class="landing-card px-6"
          >
            <AccordionTrigger class="py-5 text-start font-semibold text-foreground hover:no-underline text-base sm:text-lg">
              <div class="flex items-center gap-3">
                <span class="flex size-7 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground">
                  <HelpCircle class="size-4" />
                </span>
                <span>{{ item.question }}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent class="pb-6 pt-1 text-sm sm:text-base leading-relaxed text-muted-foreground">
              {{ item.answer }}
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <ScrollReveal animation="fade-up" :delay="100">
          <div class="mt-12 flex flex-col items-center justify-between gap-4 landing-card p-6 sm:flex-row sm:p-8">
            <div>
              <h4 class="text-base sm:text-lg font-semibold text-foreground">Masih punya pertanyaan?</h4>
              <p class="mt-1 text-xs sm:text-sm text-muted-foreground">
                Daftar akun dan kelola presensi tim Anda dari dashboard Hadirin.
              </p>
            </div>
            <Button variant="outline" class="cursor-pointer shrink-0" as-child>
              <RouterLink to="/auth/sign-up">
                <span>Daftar akun</span>
                <ArrowRight class="ml-2 size-4" />
              </RouterLink>
            </Button>
          </div>
        </ScrollReveal>
      </div>
    </div>
  </section>
</template>
