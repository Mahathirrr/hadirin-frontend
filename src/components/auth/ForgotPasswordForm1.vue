<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { toast } from 'vue-sonner'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { api } from '@/lib/api'
import { createAuthInputAttrs, enableAutofillGuard } from '@/lib/auth-form'
import { ROUTES } from '@/lib/routes'

const email = ref('')
const loading = ref(false)
const sent = ref(false)
const enabled = ref(true)
const fieldAttrs = createAuthInputAttrs(undefined, 'forgot')

onMounted(async () => {
  try {
    const status = await api.passwordResetStatus()
    enabled.value = status.enabled
  } catch {
    enabled.value = false
  }
})

async function onSubmit() {
  const trimmed = email.value.trim()
  if (!trimmed) {
    toast.error('Isi alamat email')
    return
  }
  loading.value = true
  try {
    const res = await api.forgotPassword(trimmed)
    sent.value = true
    toast.success(res.message)
  } catch (e) {
    toast.error(e instanceof Error ? e.message : 'Permintaan gagal')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <Card class="pt-1">
      <CardHeader class="text-center pt-5">
        <CardTitle class="text-xl">Lupa password?</CardTitle>
        <CardDescription>
          Masukkan email akun Anda. Kami mengirim tautan reset jika email terdaftar.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div v-if="!enabled" class="grid gap-4 text-sm text-muted-foreground">
          <p>Reset password lewat email belum aktif di server. Hubungi admin workspace atau masuk dengan Google jika akun Anda terhubung.</p>
          <RouterLink :to="ROUTES.signIn" class="text-center underline underline-offset-4">
            Kembali ke masuk
          </RouterLink>
        </div>
        <form v-else-if="!sent" @submit.prevent="onSubmit">
          <div class="grid gap-6">
            <div class="grid gap-3">
              <Label for="forgot-email">Email</Label>
              <Input
                id="forgot-email"
                v-model="email"
                type="email"
                placeholder="nama@perusahaan.com"
                required
                v-bind="fieldAttrs.email"
                @focus="enableAutofillGuard($event.target)"
              />
            </div>
            <Button type="submit" class="w-full cursor-pointer" :disabled="loading">
              Kirim tautan reset
            </Button>
            <div class="text-center text-sm">
              Ingat password?
              <RouterLink :to="ROUTES.signIn" class="underline underline-offset-4">
                Kembali ke masuk
              </RouterLink>
            </div>
          </div>
        </form>
        <div v-else class="grid gap-4 text-sm text-muted-foreground">
          <p>Periksa kotak masuk dan folder spam. Tautan berlaku 1 jam.</p>
          <RouterLink :to="ROUTES.signIn" class="text-center underline underline-offset-4">
            Kembali ke masuk
          </RouterLink>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
