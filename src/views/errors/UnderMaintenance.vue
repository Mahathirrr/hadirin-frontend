<script setup lang="ts">
import { useRouter } from 'vue-router'

import { Button } from '@/components/ui/button'

const router = useRouter()
</script>

<template>
  <div class="mx-auto flex min-h-dvh flex-col items-center justify-center gap-8 p-8 md:gap-12 md:p-16">
    <img
      src="https://ui.shadcn.com/placeholder.svg"
      alt="placeholder image"
      class="aspect-video w-240 rounded-xl object-cover dark:brightness-[0.95] dark:invert"
    />
    <div class="text-center">
      <h1 class="mb-4 text-3xl font-bold">503</h1>
      <h2 class="mb-3 text-2xl font-semibold">Under Maintenance</h2>
      <p>The service is currently unavailable. Please try again later.</p>
      <div class="mt-6 flex items-center justify-center gap-4 md:mt-8">
        <Button class="cursor-pointer" @click="router.push('/dashboard')">Go Back Home</Button>
        <Button variant="outline" class="flex cursor-pointer items-center gap-1" @click="router.push('#') ">Contact Us</Button>
      </div>
    </div>
  </div>
</template>
