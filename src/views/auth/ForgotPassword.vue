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
      <RouterLink to="/" class="flex items-center gap-2 self-center font-medium">
        <div
          class="bg-primary text-primary-foreground flex size-9 items-center justify-center rounded-md"
        >
          <Logo :size="24" />
        </div>
        ShadcnStore
      </RouterLink>
      <ForgotPasswordForm1 />
    </div>
  </div>
</template>
