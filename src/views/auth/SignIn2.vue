<script setup lang="ts">
import { RouterLink } from 'vue-router'

import LoginForm2 from '@/components/auth/LoginForm2.vue'
import Logo from '@/components/logo.vue'
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
          <LoginForm2 />
        </div>
      </div>
    </div>
    <div class="bg-muted relative hidden lg:flex flex-col justify-between p-10 text-white overflow-hidden">
      <img
        src="/auth/signin-bg.jpg"
        alt="Hadirin Workspace"
        class="absolute inset-0 h-full w-full object-cover"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/40" />
      <div class="relative z-10 flex items-center gap-2.5 font-semibold tracking-tight">
        <Logo :size="30" />
        <span class="text-xl text-white">Hadirin</span>
      </div>
      <div class="relative z-10 max-w-md rounded-2xl border border-white/10 bg-black/40 p-6 backdrop-blur-md shadow-2xl">
        <p class="text-sm font-medium leading-relaxed text-zinc-200">
          "Presensi instan, tracking lokasi transparan, dan rekap otomatis tanpa antrean fisik."
        </p>
        <div class="mt-4 flex items-center gap-2 text-xs text-emerald-400 font-medium">
          <span class="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Verifikasi Face ID & Geofence Aktif</span>
        </div>
      </div>
    </div>
  </div>
</template>
