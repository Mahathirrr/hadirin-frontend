<script setup lang="ts">
import { RouterLink } from 'vue-router'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
</script>

<template>
  <form class="flex flex-col gap-6">
    <div class="flex flex-col items-center gap-2 text-center">
      <h1 class="text-2xl font-bold">Forgot your password?</h1>
      <p class="text-muted-foreground text-sm text-balance">
        Enter your email address and we'll send you a link to reset your password
      </p>
    </div>
    <div class="grid gap-6">
      <div class="grid gap-3">
        <Label for="email">Email</Label>
        <Input id="email" type="email" placeholder="m@example.com" required />
      </div>
      <Button type="submit" class="w-full cursor-pointer">
        Send Reset Link
      </Button>
    </div>
    <div class="text-center text-sm">
      Remember your password? 
      <RouterLink to="/auth/sign-in-2" class="underline underline-offset-4">
        Back to sign in
      </RouterLink>
    </div>
  </form>
</template>
