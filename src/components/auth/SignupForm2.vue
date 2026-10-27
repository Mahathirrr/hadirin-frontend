<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { toast } from 'vue-sonner'

import GoogleIcon from '@/components/icons/google-icon.vue'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { api } from '@/lib/api'
import { createAuthInputAttrs, enableAutofillGuard } from '@/lib/auth-form'
import { ROUTES } from '@/lib/routes'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()
const fullName = ref('')
const email = ref('')
const password = ref('')
const googleEnabled = ref(false)
const fieldAttrs = createAuthInputAttrs(undefined, 'register')

async function loadGoogleStatus() {
  try {
    const status = await api.googleAuthStatus()
    googleEnabled.value = status.enabled
  } catch {
    googleEnabled.value = false
  }
}

onMounted(() => {
  void loadGoogleStatus()
})

function loginWithGoogle() {
  if (!googleEnabled.value) {
    toast.error('Masuk dengan Google belum tersedia. Gunakan email dan kata sandi.')
    return
  }
  window.location.href = api.googleAuthStartUrl()
}

async function onSubmit() {
  const name = fullName.value.trim()
  const trimmedEmail = email.value.trim()
  const trimmedPassword = password.value
  if (name.length < 2 || !trimmedEmail || trimmedPassword.length < 6) {
    toast.error('Lengkapi nama, email, dan password minimal 6 karakter')
    return
  }
  try {
    await auth.register(name, trimmedEmail, trimmedPassword)
    toast.success('Akun berhasil dibuat')
    router.push(ROUTES.onboarding)
  } catch {
    toast.error(auth.error || 'Registrasi gagal')
  }
}
</script>

<template>
  <form
    data-auth-form
    class="flex flex-col gap-6"
    autocomplete="on"
    @submit.prevent="onSubmit"
  >
    <div class="flex flex-col items-center gap-2 text-center">
      <h1 class="text-2xl font-bold">Buat akun Hadirin</h1>
      <p class="text-muted-foreground text-sm text-balance">
        Daftar untuk mengelola presensi, geofence, dan Face ID untuk perusahaan Anda.
      </p>
    </div>

    <div class="grid gap-5">
      <div class="grid gap-2">
        <Label for="signup-name">Nama lengkap</Label>
        <Input
          id="signup-name"
          v-model="fullName"
          placeholder="Contoh: Ahmad Rizki"
          required
          v-bind="fieldAttrs.name"
          @focus="enableAutofillGuard($event.target)"
        />
      </div>
      <div class="grid gap-2">
        <Label for="signup-email">Email kerja</Label>
        <Input
          id="signup-email"
          v-model="email"
          placeholder="nama@perusahaan.com"
          required
          v-bind="fieldAttrs.email"
          @focus="enableAutofillGuard($event.target)"
        />
      </div>
      <div class="grid gap-2">
        <Label for="signup-password">Kata sandi</Label>
        <Input
          id="signup-password"
          v-model="password"
          required
          minlength="6"
          v-bind="fieldAttrs.password"
          @focus="enableAutofillGuard($event.target)"
        />
        <p id="signup-password-hint" class="text-xs text-muted-foreground">Minimal 6 karakter.</p>
      </div>
      <div class="flex items-start gap-2">
        <Checkbox id="terms" required class="mt-0.5" />
        <Label for="terms" class="text-sm font-normal leading-snug text-muted-foreground">
          Saya setuju
          <RouterLink :to="ROUTES.terms" target="_blank" class="text-foreground underline underline-offset-4 hover:text-primary">
            Syarat Layanan
          </RouterLink>
          dan
          <RouterLink :to="ROUTES.privacy" target="_blank" class="text-foreground underline underline-offset-4 hover:text-primary">
            Kebijakan Privasi
          </RouterLink>.
        </Label>
      </div>
      <Button type="submit" class="w-full cursor-pointer" :disabled="auth.loading">
        Daftar
      </Button>

      <div class="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
        <span class="bg-background text-muted-foreground relative z-10 px-2">Atau</span>
      </div>
      <Button
        variant="outline"
        class="w-full cursor-pointer gap-2"
        type="button"
        :disabled="!googleEnabled"
        @click="loginWithGoogle"
      >
        <GoogleIcon />
        Daftar dengan Google
      </Button>
    </div>

    <p class="text-center text-sm text-muted-foreground">
      Sudah punya akun?
      <RouterLink :to="ROUTES.signIn" class="text-foreground underline underline-offset-4">Masuk</RouterLink>
    </p>
  </form>
</template>
