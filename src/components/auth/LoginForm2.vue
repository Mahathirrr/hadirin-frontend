<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { toast } from 'vue-sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { api } from '@/lib/api'
import { useAuthStore } from '@/stores/auth'
import { ROUTES } from '@/lib/routes'

const auth = useAuthStore()
const router = useRouter()
const email = ref('')
const password = ref('')
const googleEnabled = ref(false)

onMounted(async () => {
  try {
    const status = await api.googleAuthStatus()
    googleEnabled.value = status.enabled
  } catch {
    googleEnabled.value = false
  }
})

async function onSubmit() {
  if (!email.value || password.value.length < 6) {
    toast.error('Isi email dan password minimal 6 karakter')
    return
  }
  try {
    await auth.login(email.value, password.value)
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
  <form class="flex flex-col gap-6" @submit.prevent="onSubmit">
    <div class="flex flex-col items-center gap-2 text-center">
      <h1 class="text-2xl font-bold">Login to your account</h1>
      <p class="text-muted-foreground text-sm text-balance">
        Enter your email below to login to your Hadirin.id account
      </p>
    </div>
    <div class="grid gap-6">
      <div class="grid gap-3">
        <Label for="email">Email</Label>
        <Input id="email" v-model="email" type="email" placeholder="admin@hadirin.id" required />
      </div>
      <div class="grid gap-3">
        <div class="flex items-center">
          <Label for="password">Password</Label>
          <RouterLink to="/auth/sign-up" class="ml-auto text-sm underline-offset-4 hover:underline">
            Forgot your password?
          </RouterLink>
        </div>
        <Input id="password" v-model="password" type="password" required />
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
