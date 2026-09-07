<script setup lang="ts">
import { RouterLink } from 'vue-router'

import Logo from '@/components/logo.vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
</script>

<template>
  <div class="flex flex-col gap-6">
    <Card class="overflow-hidden p-0">
      <CardContent class="grid p-0 md:grid-cols-2">
        <form class="p-6 md:p-8">
          <div class="flex flex-col gap-6">
            <div class="mb-2 flex justify-center">
              <RouterLink to="/" class="flex items-center gap-2 font-medium">
                <div
                  class="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-md"
                >
                  <Logo :size="24" />
                </div>
                <span class="text-xl">ShadcnStore</span>
              </RouterLink>
            </div>
            <div class="flex flex-col items-center text-center">
              <h1 class="text-2xl font-bold">Forgot your password?</h1>
              <p class="text-muted-foreground text-balance">
                Enter your email to reset your ShadcnStore account password
              </p>
            </div>
            <div class="grid gap-3">
              <Label for="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <Button type="submit" class="w-full cursor-pointer">
              Send Reset Link
            </Button>
            <div class="text-center text-sm">
              Remember your password? 
              <RouterLink to="/auth/sign-in-3" class="underline underline-offset-4">
                Back to sign in
              </RouterLink>
            </div>
          </div>
        </form>
        <div class="bg-muted relative hidden md:block">
          <img
            src="https://ui.shadcn.com/placeholder.svg"
            alt="Image"
            class="absolute inset-0 h-full w-full object-cover dark:brightness-[0.95] dark:invert"
          />
        </div>
      </CardContent>
    </Card>
    <div class="text-muted-foreground text-center text-xs text-balance">
      By clicking continue, you agree to our <a href="#">Terms of Service</a> 
      and <a href="#">Privacy Policy</a>.
    </div>
  </div>
</template>
