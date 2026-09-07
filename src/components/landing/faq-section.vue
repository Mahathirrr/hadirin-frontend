<script setup lang="ts">
import { CircleHelp, HelpCircle, MessageSquare } from 'lucide-vue-next'
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
    question: 'Bagaimana Hadirin mencegah kecurangan titip absen dan pemalsuan foto?',
    answer: 'Hadirin dilengkapi Face ID Biometrik dengan teknologi Liveness Detection AI. Sistem secara akurat memverifikasi bahwa subjek adalah manusia hidup asli di depan kamera, secara otomatis menolak foto dari layar ponsel lain, video rekaman, topeng, maupun cetakan kertas.',
  },
  {
    value: 'item-2',
    question: 'Bagaimana cara kerja Geofence dan apakah bisa dimanipulasi Fake GPS?',
    answer: 'Admin dapat menentukan titik koordinat kantor dan batas radius presensi (misal 50 meter). Hadirin memiliki modul pendeteksi anomali yang otomatis memblokir aplikasi Mock Location (Fake GPS) serta perangkat yang telah dimodifikasi (root/jailbreak). Karyawan di luar perimeter tidak dapat melakukan absensi masuk.',
  },
  {
    value: 'item-3',
    question: 'Bisakah Hadirin digunakan untuk mengelola banyak cabang kantor sekaligus?',
    answer: 'Tentu. Hadirin mendukung fitur Multi-Geofence tanpa batas. Anda dapat mendaftarkan kantor pusat, gudang logistik, pabrik, serta puluhan cabang outlet ritel. Setiap karyawan dapat diatur agar hanya diizinkan absen di cabang tempat mereka ditugaskan.',
  },
  {
    value: 'item-4',
    question: 'Bagaimana cara mengintegrasikan data absensi ke sistem payroll perusahaan?',
    answer: 'Data absensi, total jam kerja, keterlambatan, lembur, dan izin cuti dapat diunduh instan dalam format Excel (.xlsx), CSV, atau PDF. Untuk perusahaan skala enterprise, Hadirin menyediakan REST API dan Webhook untuk sinkronisasi otomatis ke SAP, Mekari Talenta, atau sistem ERP internal Anda.',
  },
  {
    value: 'item-5',
    question: 'Apakah data biometrik dan privasi karyawan terjamin keamanannya?',
    answer: 'Keamanan data adalah prioritas tertinggi kami. Seluruh transmisi dan penyimpanan data dienkripsi dengan standar AES-256 dan TLS 1.3. Kami mematuhi regulasi Undang-Undang Perlindungan Data Pribadi (UU PDP) dan tidak pernah membagikan data kepada pihak ketiga.',
  },
  {
    value: 'item-6',
    question: 'Apakah tim di lapangan tetap bisa absen saat koneksi sinyal lemah?',
    answer: 'Ya. Hadirin dilengkapi fitur offline sync cerdas. Waktu absensi dan koordinat GPS akan dikunci secara aman dengan stempel waktu kriptografis di perangkat, lalu disinkronkan otomatis ke server saat ponsel kembali terhubung ke jaringan internet.',
  },
]
</script>

<template>
  <section id="faq" class="relative py-24 sm:py-32">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section Header -->
      <ScrollReveal animation="fade-up">
        <div class="mx-auto mb-16 max-w-3xl text-center">
        <Badge variant="outline" class="mb-4 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider">
          Tanya Jawab
        </Badge>
        <h2 class="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl text-foreground">
          Pertanyaan yang Sering Diajukan
        </h2>
        <p class="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
          Temukan jawaban atas pertanyaan umum seputar fitur, keamanan biometrik, dan implementasi Hadirin di perusahaan Anda.
        </p>
        </div>
      </ScrollReveal>

      <!-- FAQ Accordion -->
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

        <!-- Help Banner -->
        <ScrollReveal animation="fade-up" :delay="100">
          <div class="mt-12 flex flex-col items-center justify-between gap-4 landing-card p-6 sm:flex-row sm:p-8">
          <div>
            <h4 class="text-base sm:text-lg font-semibold text-foreground">Masih punya pertanyaan lain?</h4>
            <p class="mt-1 text-xs sm:text-sm text-muted-foreground">
              Tim spesialis kami siap membantu menjelaskan solusi presensi yang paling cocok untuk tim Anda.
            </p>
          </div>
          <Button variant="outline" class="cursor-pointer shrink-0" as-child>
            <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer">
              <MessageSquare class="mr-2 size-4" />
              <span>Hubungi Kami via WhatsApp</span>
            </a>
          </Button>
          </div>
        </ScrollReveal>
      </div>
    </div>
  </section>
</template>
