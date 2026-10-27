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
    <div class="bg-muted relative hidden lg:block">
      <img
        src="https://ui.shadcn.com/placeholder.svg"
        alt="Image"
        class="absolute inset-0 h-full w-full object-cover dark:brightness-[0.95] dark:invert"
      />
    </div>
  </div>
</template>
