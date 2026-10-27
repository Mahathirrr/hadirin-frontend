<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { toast } from 'vue-sonner'

import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { api, type BillingOrder } from '@/lib/api'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const orders = ref<BillingOrder[]>([])
const loading = ref(true)
const workspaceId = computed(() => auth.activeMembership?.workspace_id ?? 0)

onMounted(async () => {
  if (!auth.token || !workspaceId.value) {
    loading.value = false
    return
  }
  try {
    const res = await api.listBillingOrders(auth.token, workspaceId.value)
    orders.value = res.data
  } catch {
    toast.error('Gagal memuat riwayat')
  } finally {
    loading.value = false
  }
})

async function syncOrder(id: string) {
  if (!auth.token) return
  try {
    await api.syncBillingOrder(auth.token, id)
    toast.success('Status diperbarui')
  } catch (e) {
    toast.error(e instanceof Error ? e.message : 'Sync gagal')
  }
}
</script>

<template>
  <div class="mx-auto flex w-full max-w-4xl flex-col gap-4 p-6">
    <h1 class="text-2xl font-semibold">Riwayat pembayaran</h1>
    <p v-if="loading" class="text-muted-foreground text-sm">Memuat…</p>
    <Table v-else>
      <TableHeader>
        <TableRow>
          <TableHead>Paket</TableHead>
          <TableHead>Nominal</TableHead>
          <TableHead>Status</TableHead>
          <TableHead class="text-right">Aksi</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="o in orders" :key="o.public_id">
          <TableCell>{{ o.plan?.name ?? o.plan_id }}</TableCell>
          <TableCell>Rp {{ o.amount_idr.toLocaleString('id-ID') }}</TableCell>
          <TableCell>{{ o.status }}</TableCell>
          <TableCell class="text-right">
            <Button v-if="o.status === 'pending'" size="sm" variant="outline" class="cursor-pointer" @click="syncOrder(o.public_id)">
              Cek status
            </Button>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>
