<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { toast } from 'vue-sonner'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { api } from '@/lib/api'
import { ROUTES } from '@/lib/routes'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const loading = ref(false)
const sandbox = ref(true)
const order = ref<Awaited<ReturnType<typeof api.createCheckout>> | null>(null)

const planId = computed(() => Number(route.query.plan_id))
const workspaceId = computed(() => Number(route.query.workspace_id))

onMounted(async () => {
  if (!planId.value || !workspaceId.value || !auth.token) {
    toast.error('Parameter checkout tidak valid')
    router.push(ROUTES.subscription)
    return
  }
  loading.value = true
  try {
    order.value = await api.createCheckout(auth.token, workspaceId.value, planId.value)
    sandbox.value = order.value.sandbox
  } catch (e) {
    toast.error(e instanceof Error ? e.message : 'Checkout gagal')
    router.push(ROUTES.subscription)
  } finally {
    loading.value = false
  }
})

function pay() {
  if (order.value?.payment_url) {
    window.location.href = order.value.payment_url
  }
}

async function simulate() {
  if (!auth.token || !order.value?.order.public_id) return
  try {
    await api.simulateSandboxOrder(auth.token, order.value.order.public_id)
    toast.success('Simulasi pembayaran diproses')
    router.push(ROUTES.billingHistory)
  } catch (e) {
    toast.error(e instanceof Error ? e.message : 'Simulasi gagal')
  }
}
</script>

<template>
  <div class="mx-auto flex max-w-lg flex-col gap-4 p-6">
    <Card>
      <CardHeader>
        <CardTitle>Pembayaran langganan</CardTitle>
      </CardHeader>
      <CardContent class="flex flex-col gap-4">
        <p v-if="sandbox" class="rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm">
          Mode uji coba Xendit — buka halaman pembayaran, pilih metode, lalu klik banner merah
          <strong>Simulate payment</strong> di atas halaman invoice. Setelah itu gunakan tombol di bawah atau sync di riwayat.
        </p>
        <p v-if="loading" class="text-muted-foreground text-sm">Menyiapkan invoice…</p>
        <template v-else-if="order">
          <p class="text-sm">Total: <strong>Rp {{ order.order.amount_idr.toLocaleString('id-ID') }}</strong></p>
          <Button class="w-full cursor-pointer" @click="pay">Lanjut ke pembayaran</Button>
          <Button v-if="sandbox" variant="outline" class="w-full cursor-pointer" @click="simulate">
            Selesaikan pembayaran uji coba
          </Button>
        </template>
      </CardContent>
    </Card>
  </div>
</template>
