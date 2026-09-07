<script setup lang="ts">
import {
  faDiscord,
  faMicrosoft,
  faSlack,
  faTelegram,
  faWhatsapp,
} from '@fortawesome/free-brands-svg-icons'
import {
  siGooglecalendar,
} from 'simple-icons'

import { Badge } from '@/components/ui/badge'

const integrations = [
  { name: 'Slack', icon: { path: faSlack.icon[4] as string, hex: '4A154B' } },
  { name: 'Google Calendar', icon: siGooglecalendar },
  { name: 'WhatsApp', icon: { path: faWhatsapp.icon[4] as string, hex: '25D366' } },
  { name: 'Telegram', icon: { path: faTelegram.icon[4] as string, hex: '26A5E4' } },
  { name: 'Microsoft', icon: { path: faMicrosoft.icon[4] as string, hex: '7FBA00' } },
  { name: 'Discord', icon: { path: faDiscord.icon[4] as string, hex: '5865F2' } },
]
</script>

<template>
  <section class="py-16 sm:py-20">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-2xl text-center">
        <Badge variant="outline" class="mb-4">Integrasi</Badge>
        <h2 class="mb-4 text-2xl font-bold tracking-tight sm:text-3xl">
          Hadirin.id siap terhubung ke alur kerja tim Anda
        </h2>
        <p class="text-muted-foreground">
          Notifikasi dan sinkronisasi dengan alat yang sudah dipakai tim sehari-hari.
        </p>
      </div>

      <div class="mx-auto mt-10 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-3">
        <div
          v-for="integration in integrations"
          :key="integration.name"
          class="flex items-center gap-3 rounded-xl bg-muted/70 px-4 py-3 text-sm font-medium text-foreground/80 shadow-sm"
        >
          <span class="grid size-7 place-items-center rounded-lg bg-card shadow-sm">
            <svg viewBox="0 0 24 24" class="size-4" aria-hidden="true">
              <path :d="integration.icon.path" :fill="`#${integration.icon.hex}`" />
            </svg>
          </span>
          {{ integration.name }}
        </div>
      </div>
    </div>
  </section>
</template>
