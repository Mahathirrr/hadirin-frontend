<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { toast } from 'vue-sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { api } from '@/lib/api'
import { createAuthInputAttrs, enableAutofillGuard } from '@/lib/auth-form'
import { ROUTES } from '@/lib/routes'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()
const email = ref('')
const password = ref('')
const googleEnabled = ref(false)
const fieldAttrs = createAuthInputAttrs()

async function loadGoogleStatus() {
  try {
    const status = await api.googleAuthStatus()
    googleEnabled.value = status.enabled
  } catch {
    googleEnabled.value = false
  }
}

loadGoogleStatus()

async function onSubmit() {
  const trimmedEmail = email.value.trim()
  const trimmedPassword = password.value
  if (!trimmedEmail || !trimmedPassword) {
    toast.error('Isi email dan password')
    return
  }
  try {
    await auth.login(trimmedEmail, trimmedPassword)
    toast.success('Login berhasil')
    router.push(auth.hasWorkspace ? ROUTES.summary : ROUTES.onboarding)
  } catch {
    toast.error(auth.error || 'Login gagal')
  }
}

function loginWithGoogle() {
  if (!googleEnabled.value) {
    toast.error('Google OAuth belum dikonfigurasi di server')
    return
  }
  window.location.href = api.googleAuthStartUrl()
}
</script>

<template>
  <form
    data-auth-form
    class="flex flex-col gap-6"
    autocomplete="off"
    @submit.prevent="onSubmit"
  >
    <input type="text" tabindex="-1" autocomplete="off" class="sr-only" aria-hidden="true" />
    <input type="password" tabindex="-1" autocomplete="off" class="sr-only" aria-hidden="true" />

    <div class="flex flex-col items-center gap-2 text-center">
      <h1 class="text-2xl font-bold">Login to your account</h1>
      <p class="text-muted-foreground text-sm text-balance">
        Enter your email below to login to your Hadirin account
      </p>
    </div>

    <div class="grid gap-6">
      <div class="grid gap-3">
        <Label for="login-email">Email</Label>
        <Input
          id="login-email"
          v-model="email"
          placeholder="admin@admin.com"
          required
          v-bind="fieldAttrs.email"
          @focus="enableAutofillGuard($event.target)"
        />
      </div>
      <div class="grid gap-3">
        <div class="flex items-center">
          <Label for="login-password">Password</Label>
          <RouterLink to="/auth/sign-up" class="ml-auto text-sm underline-offset-4 hover:underline">
            Forgot your password?
          </RouterLink>
        </div>
        <Input
          id="login-password"
          v-model="password"
          required
          v-bind="fieldAttrs.password"
          @focus="enableAutofillGuard($event.target)"
        />
      </div>
      <Button type="submit" class="w-full cursor-pointer" :disabled="auth.loading">
        Login
      </Button>
      <div class="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
        <span class="bg-background text-muted-foreground relative z-10 px-2">Or continue with</span>
      </div>
      <Button variant="outline" class="w-full cursor-pointer" type="button" :disabled="!googleEnabled" @click="loginWithGoogle">
        Login with Google
      </Button>
    </div>

    <div class="text-center text-sm">
      Don't have an account?
      <RouterLink to="/auth/sign-up" class="underline underline-offset-4">Sign up</RouterLink>
    </div>
  </form>
</template>
