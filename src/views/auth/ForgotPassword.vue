<script setup lang="ts">
import { RouterLink } from 'vue-router'

import ForgotPasswordForm1 from '@/components/auth/ForgotPasswordForm1.vue'
import Logo from '@/components/logo.vue'
</script>

<template>
  <div
    class="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10"
  >
    <div class="flex w-full max-w-sm flex-col gap-6">
      <RouterLink to="/" class="flex items-center gap-2.5 self-center font-semibold tracking-tight text-lg">
        <Logo :size="32" />
        <span>Hadirin</span>
      </RouterLink>
      <ForgotPasswordForm1 />
    </div>
  </div>
</template>
