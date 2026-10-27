<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
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

const route = useRoute()
const router = useRouter()
const password = ref('')
const confirm = ref('')
const loading = ref(false)
const done = ref(false)
const fieldAttrs = createAuthInputAttrs(undefined, 'reset')

const token = computed(() => (typeof route.query.token === 'string' ? route.query.token.trim() : ''))

async function onSubmit() {
  if (!token.value) {
    toast.error('Tautan reset tidak valid. Minta link baru dari halaman lupa password.')
    return
  }
  if (password.value.length < 6) {
    toast.error('Password minimal 6 karakter')
    return
  }
  if (password.value !== confirm.value) {
    toast.error('Konfirmasi password tidak cocok')
    return
  }
  loading.value = true
  try {
    const res = await api.resetPassword(token.value, password.value)
    done.value = true
    toast.success(res.message)
    setTimeout(() => router.push(ROUTES.signIn), 1500)
  } catch (e) {
    toast.error(e instanceof Error ? e.message : 'Gagal mengubah password')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <Card class="pt-1">
      <CardHeader class="text-center pt-5">
        <CardTitle class="text-xl">Atur password baru</CardTitle>
        <CardDescription>
          Masukkan password baru untuk akun Hadirin Anda.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form v-if="!done" @submit.prevent="onSubmit">
          <div class="grid gap-6">
            <div v-if="!token" class="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              Tautan tidak lengkap. Buka link dari email atau
              <RouterLink :to="ROUTES.forgotPassword" class="underline">minta link baru</RouterLink>.
            </div>
            <div class="grid gap-3">
              <Label for="reset-password">Password baru</Label>
              <Input
                id="reset-password"
                v-model="password"
                required
                minlength="6"
                v-bind="fieldAttrs.password"
                @focus="enableAutofillGuard($event.target)"
              />
            </div>
            <div class="grid gap-3">
              <Label for="reset-confirm">Ulangi password</Label>
              <Input
                id="reset-confirm"
                v-model="confirm"
                required
                minlength="6"
                v-bind="fieldAttrs.password"
                @focus="enableAutofillGuard($event.target)"
              />
            </div>
            <Button type="submit" class="w-full cursor-pointer" :disabled="loading || !token">
              Simpan password
            </Button>
            <div class="text-center text-sm">
              <RouterLink :to="ROUTES.signIn" class="underline underline-offset-4">
                Kembali ke masuk
              </RouterLink>
            </div>
          </div>
        </form>
        <p v-else class="text-center text-sm text-muted-foreground">
          Mengalihkan ke halaman masuk…
        </p>
      </CardContent>
    </Card>
  </div>
</template>
