<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router'

import LoginForm2 from '@/components/auth/LoginForm2.vue'
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
          <LoginForm2 :key="route.fullPath" />
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
          "Hadirin mempermudah pencatatan kehadiran dan monitoring lokasi tim secara presisi dengan verifikasi Face ID dan geofence pintar."
        </p>
        <div class="mt-4 flex items-center gap-3">
          <div class="h-9 w-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center font-semibold text-xs text-zinc-200">
            HR
          </div>
          <div>
            <p class="text-xs font-semibold text-white">Manajemen Operasional & Tim</p>
            <p class="text-xs text-zinc-400">Presensi biometrik & geofence terintegrasi</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
