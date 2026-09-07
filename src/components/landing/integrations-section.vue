<script setup lang="ts">
import { ArrowRight, CheckCircle2 } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface Integration {
  id: string
  name: string
  category: string
  description: string
  status: string
}

const badgeClass = 'text-muted-foreground bg-muted border-border'

const integrations: Integration[] = [
  {
    id: 'slack',
    name: 'Slack',
    category: 'Kolaborasi Tim',
    description: 'Kirim ringkasan clock-in pagi dan notifikasi keterlambatan langsung ke channel tim Anda.',
    status: 'Siap Pakai',
  },
  {
    id: 'google',
    name: 'Google Workspace',
    category: 'Kalender & Jadwal',
    description: 'Sinkronisasi pengajuan cuti yang disetujui otomatis ke Google Calendar tim.',
    status: '1-Klik Sync',
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp Business',
    category: 'Pengingat & Notifikasi',
    description: 'Broadcast pengingat clock-in otomatis dan slip rekap bulanan langsung ke nomor WhatsApp karyawan.',
    status: 'Resmi',
  },
  {
    id: 'telegram',
    name: 'Telegram Bot',
    category: 'Tim Lapangan',
    description: 'Bot kehadiran interaktif untuk presensi cepat tim sales dan kurir di lapangan.',
    status: 'Siap Pakai',
  },
  {
    id: 'teams',
    name: 'Microsoft Teams',
    category: 'Enterprise Workspace',
    description: 'Pembaruan status ketersediaan (available/on-leave) terhubung otomatis dengan shift kerja.',
    status: 'Enterprise',
  },
  {
    id: 'discord',
    name: 'Discord',
    category: 'Developer & Creative',
    description: 'Webhook kehadiran terstruktur untuk komunitas digital dan software house.',
    status: 'Webhook',
  },
  {
    id: 'notion',
    name: 'Notion',
    category: 'Dokumentasi & HR',
    description: 'Ekspor database absensi dan direktori karyawan ke halaman Notion perusahaan.',
    status: '2-Arah',
  },
  {
    id: 'jira',
    name: 'Jira & HRIS API',
    category: 'Manajemen Proyek',
    description: 'REST API & Webhook terbuka untuk integrasi payroll eksternal dan sistem ERP kustom.',
    status: 'REST API',
  },
]
</script>

<template>
  <section id="integrations" class="relative py-24 sm:py-32 overflow-hidden">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section Header -->
      <div class="mx-auto max-w-3xl text-center">
        <Badge variant="outline" class="mb-4 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider">
          Ekosistem & Integrasi
        </Badge>
        <h2 class="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
          Terhubung Mulus ke Alat yang Sudah Digunakan Tim Anda
        </h2>
        <p class="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
          Tidak perlu mengubah kebiasaan kerja tim. Hadirin terintegrasi langsung dengan platform komunikasi,
          kalender, dan sistem payroll Anda tanpa konfigurasi rumit.
        </p>
      </div>

      <!-- Integrations Grid -->
      <div class="mx-auto mt-16 grid max-w-6xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div
          v-for="item in integrations"
          :key="item.id"
          class="group relative flex flex-col justify-between rounded-2xl border border-border/70 bg-card/60 p-6 backdrop-blur-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:border-foreground/25 hover:bg-card hover:shadow-xl hover:shadow-foreground/5"
        >
          <div>
            <!-- Header with Icon & Status -->
            <div class="flex items-center justify-between mb-4">
              <div class="flex size-12 items-center justify-center rounded-xl bg-muted/80 p-2.5 shadow-sm transition-transform duration-300 group-hover:scale-105">
                <!-- Slack Official SVG -->
                <svg v-if="item.id === 'slack'" viewBox="0 0 128 128" class="size-6 shrink-0" aria-hidden="true">
                  <path d="M26.7 80.3c0 7.4-6 13.4-13.4 13.4S0 87.7 0 80.3s6-13.4 13.4-13.4h13.3v13.4z" fill="#E01E5A"/>
                  <path d="M33.4 80.3c0-7.4 6-13.4 13.4-13.4s13.4 6 13.4 13.4v33.4c0 7.4-6 13.4-13.4 13.4s-13.4-6-13.4-13.4V80.3z" fill="#E01E5A"/>
                  <path d="M46.8 26.7c-7.4 0-13.4-6-13.4-13.4S39.4 0 46.8 0s13.4 6 13.4 13.4v13.3H46.8z" fill="#36C5F0"/>
                  <path d="M46.8 33.4c7.4 0 13.4 6 13.4 13.4s-6 13.4-13.4 13.4H13.4C6 60.2 0 54.2 0 46.8s6-13.4 13.4-13.4h33.4z" fill="#36C5F0"/>
                  <path d="M101.3 46.8c0-7.4 6-13.4 13.4-13.4s13.4 6 13.4 13.4-6 13.4-13.4 13.4h-13.4V46.8z" fill="#2EB67D"/>
                  <path d="M94.6 46.8c0 7.4-6 13.4-13.4 13.4s-13.4-6-13.4-13.4V13.4C81.2 6 87.2 0 94.6 0s13.4 6 13.4 13.4v33.4z" fill="#2EB67D"/>
                  <path d="M81.2 101.3c7.4 0 13.4 6 13.4 13.4s-6 13.4-13.4 13.4-13.4-6-13.4-13.4v-13.4h13.4z" fill="#ECB22E"/>
                  <path d="M81.2 94.6c-7.4 0-13.4-6-13.4-13.4s6-13.4 13.4-13.4h33.4c7.4 0 13.4 6 13.4 13.4s-6 13.4-13.4 13.4H81.2z" fill="#ECB22E"/>
                </svg>

                <!-- Google Official 4-Color SVG -->
                <svg v-else-if="item.id === 'google'" viewBox="0 0 24 24" class="size-6 shrink-0" aria-hidden="true">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                </svg>

                <!-- WhatsApp Official SVG -->
                <svg v-else-if="item.id === 'whatsapp'" viewBox="0 0 24 24" class="size-6 shrink-0" aria-hidden="true">
                  <path d="M17.472 14.382c-.301-.15-1.78-.879-2.056-.98-.276-.1-.477-.15-.678.15-.2.3-.778.98-.954 1.18-.175.2-.351.226-.652.075-.301-.15-1.272-.469-2.423-1.496-.895-.799-1.5-1.786-1.676-2.087-.175-.301-.019-.464.132-.614.135-.135.301-.351.451-.527.15-.175.2-.301.301-.501.1-.2.05-.376-.025-.526-.075-.15-.677-1.631-.928-2.232-.244-.585-.492-.506-.677-.516-.176-.008-.376-.01-.577-.01-.201 0-.527.075-.803.376s-1.054 1.029-1.054 2.509c0 1.48 1.079 2.909 1.229 3.109.15.2 2.124 3.243 5.145 4.549.719.311 1.28.497 1.718.636.722.23 1.378.197 1.898.12.579-.086 1.78-.727 2.031-1.429.251-.702.251-1.303.176-1.429-.075-.125-.276-.2-.577-.35zM12.05 21.785h-.002a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.999-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c0-5.445 4.43-9.874 9.879-9.874 2.637 0 5.116 1.028 6.98 2.894a9.836 9.836 0 0 1 2.891 6.984c-.001 5.447-4.431 9.877-9.87 9.877z" fill="#25D366"/>
                </svg>

                <!-- Telegram Official SVG -->
                <svg v-else-if="item.id === 'telegram'" viewBox="0 0 24 24" class="size-6 shrink-0" aria-hidden="true">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" fill="#26A5E4"/>
                </svg>

                <!-- Teams Official SVG -->
                <svg v-else-if="item.id === 'teams'" viewBox="0 0 24 24" class="size-6 shrink-0" aria-hidden="true">
                  <path d="M19.5 7.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm2 2h-4a1.5 1.5 0 0 0-1.5 1.5v4.25a2.25 2.25 0 0 0 4.5 0V11h1a1.5 1.5 0 0 0 1.5-1.5v-.5a1.5 1.5 0 0 0-1.5-1.5zM14.5 5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zm3 3.5h-6A1.5 1.5 0 0 0 10 10v7a2.5 2.5 0 0 0 5 0v-2.5h2.5a1.5 1.5 0 0 0 1.5-1.5V10a1.5 1.5 0 0 0-1.5-1.5zM6 7.5A2.5 2.5 0 1 0 6 2.5a2.5 2.5 0 0 0 0 5zM9 10H3a2 2 0 0 0-2 2v4a3 3 0 0 0 6 0v-1h2a2 2 0 0 0 2-2v-1a2 2 0 0 0-2-2z" fill="#6264A7"/>
                </svg>

                <!-- Discord Official SVG -->
                <svg v-else-if="item.id === 'discord'" viewBox="0 0 24 24" class="size-6 shrink-0" aria-hidden="true">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" fill="#5865F2"/>
                </svg>

                <!-- Notion Official SVG -->
                <svg v-else-if="item.id === 'notion'" viewBox="0 0 24 24" class="size-6 shrink-0" aria-hidden="true">
                  <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466zm.793 3.08v13.904c0 .747.373 1.027 1.213.98l14.523-.84c.84-.046.933-.56.933-1.167V6.354c0-.606-.233-.933-.746-.887l-15.176.887c-.56.047-.747.373-.747.933zm14.337.747c.093.42 0 .84-.42.887l-.7.14v10.545c-.56.327-1.167.513-1.727.513-.933 0-1.306-.326-2.053-1.26l-5.32-8.307v7.98l1.493.326s0 .747-.98.747l-3.36.186c-.094-.186 0-.606.373-.7l1.073-.28V9.102l-1.447-.14c-.093-.373.14-.84.653-.886l3.874-.233 5.46 8.353V8.868l-1.26-.14c-.093-.42.187-.84.7-.887z" fill="currentColor"/>
                </svg>

                <!-- Jira / API SVG -->
                <svg v-else viewBox="0 0 24 24" class="size-6 shrink-0" aria-hidden="true">
                  <path d="M11.53 2c0 2.4 1.97 4.35 4.39 4.35h1.74v1.74c0 2.4 1.97 4.35 4.39 4.35V2h-10.52zm-5.76 5.82c0 2.4 1.97 4.35 4.39 4.35h1.74v1.74c0 2.4 1.97 4.35 4.39 4.35V7.82H5.77zM0 13.65c0 2.4 1.97 4.35 4.39 4.35h1.74v1.74c0 2.4 1.97 4.35 4.39 4.35V13.65H0z" fill="#0052CC"/>
                </svg>
              </div>

              <span :class="['rounded-full border px-2.5 py-0.5 text-[11px] font-medium', badgeClass]">
                {{ item.status }}
              </span>
            </div>

            <!-- Content -->
            <p class="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
              {{ item.category }}
            </p>
            <h3 class="mt-1 text-base font-semibold tracking-tight text-foreground">
              {{ item.name }}
            </h3>
            <p class="mt-2 text-xs leading-relaxed text-muted-foreground">
              {{ item.description }}
            </p>
          </div>

          <!-- Bottom check status -->
          <div class="mt-5 pt-3 border-t border-border/50 flex items-center gap-1.5 text-[11px] text-muted-foreground group-hover:text-foreground transition-colors">
            <CheckCircle2 class="size-3.5 text-foreground/60 shrink-0" />
            <span>Integrasi aktif & otomatis</span>
          </div>
        </div>
      </div>

      <!-- Bottom API Banner -->
      <div class="mx-auto mt-12 max-w-4xl rounded-2xl border border-border/70 bg-muted/40 p-6 backdrop-blur-sm sm:flex sm:items-center sm:justify-between sm:p-8">
        <div>
          <h4 class="text-base sm:text-lg font-semibold text-foreground">
            Butuh integrasi dengan sistem payroll atau HR internal?
          </h4>
          <p class="mt-1 text-xs sm:text-sm text-muted-foreground">
            Gunakan REST API & Webhook Hadirin untuk menghubungkan absensi dengan SAP, Talenta, Mekari, atau database kustom.
          </p>
        </div>
        <div class="mt-4 sm:mt-0 sm:shrink-0">
          <Button variant="outline" size="sm" class="cursor-pointer gap-2" as-child>
            <RouterLink to="/auth/sign-up">
              <span>Buka Dokumentasi API</span>
              <ArrowRight class="size-3.5" />
            </RouterLink>
          </Button>
        </div>
      </div>
    </div>
  </section>
</template>
