<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router'

import SignupForm2 from '@/components/auth/SignupForm2.vue'
import Logo from '@/components/logo.vue'

const route = useRoute()
</script>

<template>
  <div class="grid min-h-svh lg:grid-cols-2">
    <div class="flex flex-col gap-4 p-6 md:p-10">
      <div class="flex justify-center gap-2 md:justify-start">
        <RouterLink to="/" class="flex items-center gap-2.5 font-semibold tracking-tight">
          <Logo :size="32" />
          <span>Hadirin</span>
        </RouterLink>
      </div>
      <div class="flex flex-1 items-center justify-center">
        <div class="w-full max-w-md">
          <SignupForm2 :key="route.fullPath" />
        </div>
      </div>
    </div>
    <div class="bg-muted relative hidden lg:flex flex-col justify-between p-10 text-white overflow-hidden">
      <img
        src="/auth/signup-bg.jpg"
        alt="Workspace Tim Hadirin"
        class="absolute inset-0 h-full w-full object-cover"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/40" />
      <div class="relative z-10 flex items-center gap-2.5 font-semibold tracking-tight">
        <Logo :size="30" />
        <span class="text-xl text-white">Hadirin</span>
      </div>
      <div class="relative z-10 max-w-md rounded-2xl border border-white/10 bg-black/40 p-6 backdrop-blur-md shadow-2xl">
        <p class="text-sm font-medium leading-relaxed text-zinc-200">
          "Bangun budaya kerja transparan, akuntabel, dan efisien dengan teknologi absensi pintar modern."
        </p>
        <div class="mt-4 flex items-center gap-2 text-xs text-emerald-400 font-medium">
          <span class="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Real-time Geofence, Face ID & Deteksi Anomaly</span>
        </div>
      </div>
    </div>
  </div>
</template>
