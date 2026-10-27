<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { toast } from 'vue-sonner'

import GoogleIcon from '@/components/icons/google-icon.vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { api } from '@/lib/api'
import { createAuthInputAttrs, enableAutofillGuard } from '@/lib/auth-form'
import { ROUTES } from '@/lib/routes'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()
const email = ref('')
const password = ref('')
const googleEnabled = ref(false)
const fieldAttrs = createAuthInputAttrs(undefined, 'login')

async function loadGoogleStatus() {
  try {
    const status = await api.googleAuthStatus()
    googleEnabled.value = status.enabled
  } catch {
    googleEnabled.value = false
  }
}

loadGoogleStatus()

onMounted(() => {
  if (route.query.oauth_error === '1') {
    toast.error('Login Google gagal atau dibatalkan. Coba lagi.')
  }
})

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
      <h1 class="text-2xl font-bold">Masuk ke akun Hadirin</h1>
      <p class="text-muted-foreground text-sm text-balance">
        Gunakan email dan password workspace Anda untuk mengakses dashboard presensi.
      </p>
    </div>

    <div class="grid gap-6">
      <div class="grid gap-3">
        <Label for="login-email">Email</Label>
        <Input
          id="login-email"
          v-model="email"
          placeholder="nama@perusahaan.com"
          required
          v-bind="fieldAttrs.email"
          @focus="enableAutofillGuard($event.target)"
        />
      </div>
      <div class="grid gap-3">
        <div class="flex items-center">
          <Label for="login-password">Password</Label>
          <RouterLink to="/auth/sign-up" class="ml-auto text-sm underline-offset-4 hover:underline">
            Lupa password?
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
        Masuk
      </Button>
      <div class="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
        <span class="bg-background text-muted-foreground relative z-10 px-2">Atau lanjutkan dengan</span>
      </div>
      <Button
        variant="outline"
        class="w-full cursor-pointer gap-2"
        type="button"
        :disabled="!googleEnabled"
        @click="loginWithGoogle"
      >
        <GoogleIcon />
        Masuk dengan Google
      </Button>
    </div>

    <div class="text-center text-sm">
      Belum punya akun?
      <RouterLink to="/auth/sign-up" class="underline underline-offset-4">Daftar</RouterLink>
    </div>
  </form>
</template>
