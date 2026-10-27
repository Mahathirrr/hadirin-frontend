<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { api, type SubscriptionPlan } from '@/lib/api'
import { ROUTES } from '@/lib/routes'
import { useAuthStore } from '@/stores/auth'
const auth = useAuthStore()
const router = useRouter()
const plans = ref<SubscriptionPlan[]>([])
const subscription = ref<Awaited<ReturnType<typeof api.getSubscription>> | null>(null)
const loading = ref(true)
const billingEnabled = ref(false)
const sandbox = ref(false)

const workspaceId = computed(() => auth.activeMembership?.workspace_id ?? 0)

onMounted(async () => {
  try {
    const status = await api.billingStatus()
    billingEnabled.value = status.enabled
    sandbox.value = status.sandbox
    plans.value = (await api.listSubscriptionPlans()).data
    if (workspaceId.value) {
      subscription.value = await api.getSubscription(auth.token!, workspaceId.value)
    }
  } catch {
    toast.error('Gagal memuat data langganan')
  } finally {
    loading.value = false
  }
})

function formatIDR(n: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n)
}

function checkout(planId: number) {
  if (!workspaceId.value) {
    toast.error('Pilih workspace terlebih dahulu')
    return
  }
  router.push({ name: 'subscription-checkout', query: { plan_id: String(planId), workspace_id: String(workspaceId.value) } })
}
</script>

<template>
  <div class="mx-auto flex w-full max-w-5xl flex-col gap-6 p-4 md:p-6">
    <div>
      <h1 class="text-2xl font-semibold tracking-tight">Langganan workspace</h1>
      <p class="text-muted-foreground text-sm">Kelola paket Hadirin untuk organisasi Anda.</p>
    </div>

    <div
      v-if="sandbox"
      class="rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-900 dark:text-amber-100"
    >
      Mode uji coba — pembayaran tidak nyata (Mayar sandbox).
    </div>

    <Card v-if="subscription">
      <CardHeader>
        <CardTitle>Status saat ini</CardTitle>
        <CardDescription>
          Paket {{ subscription.plan?.name }} · berlaku hingga
          {{ new Date(subscription.current_period_end).toLocaleDateString('id-ID') }}
        </CardDescription>
      </CardHeader>
      <CardContent class="text-sm">
        Status: <span class="font-medium">{{ subscription.status }}</span>
      </CardContent>
    </Card>

    <div v-if="loading" class="text-muted-foreground text-sm">Memuat paket…</div>
    <div v-else-if="!billingEnabled" class="text-muted-foreground text-sm">
      Billing belum aktif di server.
    </div>
    <div v-else class="grid gap-4 md:grid-cols-3">
      <Card v-for="plan in plans" :key="plan.id">
        <CardHeader>
          <CardTitle>{{ plan.name }}</CardTitle>
          <CardDescription>{{ plan.description }}</CardDescription>
        </CardHeader>
        <CardContent class="flex flex-col gap-4">
          <p class="text-2xl font-bold">{{ formatIDR(plan.price_idr) }}<span class="text-muted-foreground text-sm font-normal">/bulan</span></p>
          <Button class="cursor-pointer" @click="checkout(plan.id)">Pilih paket</Button>
        </CardContent>
      </Card>
    </div>

    <Button variant="outline" class="w-fit cursor-pointer" @click="router.push(ROUTES.billingHistory)">
      Riwayat transaksi
    </Button>
  </div>
</template>
