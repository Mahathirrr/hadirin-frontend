<script setup lang="ts">
import { RouterLink } from 'vue-router'

import SignupForm2 from '@/components/auth/SignupForm2.vue'
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
          <SignupForm2 />
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
