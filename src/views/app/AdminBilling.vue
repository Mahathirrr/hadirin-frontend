<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { toast } from 'vue-sonner'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { api, type BillingOrder, type SubscriptionPlan } from '@/lib/api'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const plans = ref<SubscriptionPlan[]>([])
const orders = ref<BillingOrder[]>([])
const loading = ref(true)

onMounted(async () => {
  if (!auth.token) return
  try {
    plans.value = (await api.adminListPlans(auth.token)).data
    orders.value = (await api.adminListOrders(auth.token)).data
  } catch {
    toast.error('Akses admin langganan ditolak atau gagal memuat')
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="mx-auto flex w-full max-w-5xl flex-col gap-8 p-6">
    <div>
      <h1 class="text-2xl font-semibold">Admin langganan</h1>
      <p class="text-muted-foreground text-sm">Kelola paket dan pantau transaksi langganan.</p>
    </div>
    <section>
      <h2 class="mb-2 font-medium">Paket</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Kode</TableHead>
            <TableHead>Nama</TableHead>
            <TableHead>Harga</TableHead>
            <TableHead>Aktif</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="p in plans" :key="p.id">
            <TableCell>{{ p.code }}</TableCell>
            <TableCell>{{ p.name }}</TableCell>
            <TableCell>Rp {{ p.price_idr.toLocaleString('id-ID') }}</TableCell>
            <TableCell>{{ p.is_active ? 'Ya' : 'Tidak' }}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </section>
    <section>
      <h2 class="mb-2 font-medium">Order terbaru</h2>
      <p v-if="loading" class="text-sm text-muted-foreground">Memuat…</p>
      <Table v-else>
        <TableHeader>
          <TableRow>
            <TableHead>Workspace</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Nominal</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="o in orders" :key="o.public_id">
            <TableCell>{{ o.workspace_id }}</TableCell>
            <TableCell>{{ o.status }}</TableCell>
            <TableCell>Rp {{ o.amount_idr.toLocaleString('id-ID') }}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </section>
  </div>
</template>
