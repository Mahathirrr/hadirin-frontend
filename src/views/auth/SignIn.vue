<script setup lang="ts">
import { RouterLink } from 'vue-router'

import LoginForm2 from '@/components/auth/LoginForm2.vue'
import Logo from '@/components/logo.vue'
</script>

<template>
  <div class="grid min-h-svh lg:grid-cols-2">
    <div class="flex flex-col gap-4 p-6 md:p-10">
      <div class="flex justify-center gap-2 md:justify-start">
        <RouterLink to="/" class="flex items-center gap-2 font-medium">
          <Logo :size="24" class="text-primary" />
          Hadirin.id
        </RouterLink>
      </div>
      <div class="flex flex-1 items-center justify-center">
        <div class="w-full max-w-md">
          <LoginForm2 />
        </div>
      </div>
    </div>
    <div class="bg-muted relative hidden lg:block">
      <img
        src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1400&q=80"
        alt="Tim kolaborasi"
        class="absolute inset-0 h-full w-full object-cover"
      />
    </div>
  </div>
</template>
