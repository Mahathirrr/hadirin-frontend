<script setup lang="ts">
import { CircleHelp } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface FaqItem {
  value: string
  question: string
  answer: string
}

const faqItems: FaqItem[] = [
  { value: 'item-1', question: 'Apa itu Hadirin?', answer: 'Hadirin adalah aplikasi absensi untuk tim. Admin membuat workspace, mengundang anggota, lalu mencatat kehadiran, cuti, lokasi, dan laporan operasional.' },
  { value: 'item-2', question: 'Bagaimana cara mulai memakai Hadirin?', answer: 'Daftar akun, lalu buat workspace baru atau gabung dengan kode undangan dari admin. Setelah itu Anda langsung masuk ke dashboard.' },
  { value: 'item-3', question: 'Apakah saya bisa mengundang tim?', answer: 'Bisa. Setiap workspace punya kode undangan. Admin bisa membagikan kode itu, atau meresetnya jika perlu.' },
  { value: 'item-4', question: 'Data apa yang bisa dikelola?', answer: 'Kehadiran harian, pengajuan cuti, karyawan, geofence, device QR, work plan, laporan, dan log audit.' },
  { value: 'item-5', question: 'Apakah harus punya perusahaan besar?', answer: 'Tidak. Hadirin bisa dipakai tim kecil dulu, lalu ditambah anggota seiring kebutuhan.' },
  { value: 'item-6', question: 'Bagaimana jika saya belum punya workspace?', answer: 'Setelah login Anda diarahkan ke halaman onboarding untuk membuat workspace atau bergabung dengan kode undangan.' },
]
</script>

<template>
  <section id="faq" class="py-24 sm:py-32">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section Header -->
      <div class="mx-auto mb-16 max-w-2xl text-center">
        <Badge variant="outline" class="mb-4">FAQ</Badge>
        <h2 class="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">Pertanyaan yang sering muncul</h2>
        <p class="text-lg text-muted-foreground">
          Hal-hal dasar tentang cara kerja Hadirin, workspace, dan data kehadiran tim.
        </p>
      </div>

      <!-- FAQ Content -->
      <div class="mx-auto max-w-4xl">
        <div class="bg-transparent">
          <div class="p-0">
            <Accordion type="single" collapsible class="space-y-5">
              <AccordionItem v-for="item in faqItems" :key="item.value" :value="item.value" class="rounded-xl bg-muted/40">
                <AccordionTrigger class="cursor-pointer items-center gap-4 rounded-none bg-transparent py-2 ps-3 pe-4 hover:no-underline data-[state=open]:border-b">
                  <div class="flex items-center gap-4">
                    <div class="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <CircleHelp class="size-5" />
                    </div>
                    <span class="text-start font-semibold">{{ item.question }}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent class="bg-transparent p-4">{{ item.answer }}</AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        <!-- Contact Support CTA -->
        <div class="mt-12 text-center">
          <p class="mb-4 text-muted-foreground">Siap mencoba Hadirin?</p>
          <Button class="cursor-pointer" as-child>
            <RouterLink to="/auth/sign-up">Buat akun</RouterLink>
          </Button>
        </div>
      </div>
    </div>
  </section>
</template>
