<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { toast } from 'vue-sonner'

import { useAuthStore } from '@/stores/auth'
import { ROUTES } from '@/lib/routes'

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()

onMounted(async () => {
  const jwt = typeof route.query.token === 'string' ? route.query.token : ''
  if (!jwt) {
    toast.error('Token OAuth tidak ditemukan')
    router.replace(ROUTES.signIn)
    return
  }
  try {
    await auth.handleOAuthCallback(jwt)
    toast.success('Login Google berhasil')
    router.replace(auth.hasWorkspace ? ROUTES.summary : ROUTES.onboarding)
  } catch {
    toast.error('Gagal menyelesaikan login Google')
    router.replace(ROUTES.signIn)
  }
})
</script>

<template>
  <div class="flex min-h-svh items-center justify-center p-6 text-sm text-muted-foreground">
    Menyelesaikan login Google…
  </div>
</template>
