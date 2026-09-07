<script setup lang="ts">
import { onMounted, ref } from 'vue'

import EmptyState from '@/components/app/empty-state.vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { api } from '@/lib/api'
import { useAuthStore } from '@/stores/auth'

const props = withDefaults(defineProps<{
  title?: string
  description?: string
  listTitle?: string
  embedded?: boolean
  fetchKey?: 'employees' | 'attendance' | 'leave' | 'audit' | 'qr' | 'geofence'
}>(), {
  title: '',
  description: '',
  listTitle: 'Daftar data',
  embedded: false,
})

const auth = useAuthStore()
const rows = ref<Array<Record<string, unknown>>>([])
const loading = ref(true)

onMounted(async () => {
  if (auth.token && auth.workspaceId && props.fetchKey) {
    try {
      const map = {
        employees: () => api.listEmployees(auth.token!, auth.workspaceId!),
        attendance: () => api.listAttendance(auth.token!, auth.workspaceId!),
        leave: () => api.listLeaveRequests(auth.token!, auth.workspaceId!),
        audit: () => api.listAuditLogs(auth.token!, auth.workspaceId!),
        qr: () => api.listQRDevices(auth.token!, auth.workspaceId!),
        geofence: () => api.listGeofences(auth.token!, auth.workspaceId!),
      }
      rows.value = await map[props.fetchKey]()
    } catch {
      rows.value = []
    }
  }
  loading.value = false
})
</script>

<template>
  <div :class="embedded ? 'flex flex-col gap-3' : 'flex flex-col gap-4'">
    <div v-if="!embedded && (title || description)">
      <h1 class="text-3xl font-bold tracking-tight">{{ title }}</h1>
      <p v-if="description" class="mt-1 text-sm text-muted-foreground">{{ description }}</p>
    </div>
    <slot name="toolbar" />
    <Card class="rounded-xl shadow-none">
      <CardHeader class="px-4 pt-4 pb-2">
        <CardTitle class="text-base">{{ listTitle }}</CardTitle>
      </CardHeader>
      <CardContent class="px-4 pb-4">
        <div v-if="loading" class="py-6 text-center text-sm text-muted-foreground">Memuat...</div>
        <EmptyState v-else-if="!rows.length" title="Belum ada data" description="Data akan muncul setelah workspace mulai digunakan." />
        <Table v-else>
          <TableHeader>
            <TableRow>
              <TableHead v-for="key in Object.keys(rows[0]).slice(0, 6)" :key="key">{{ key }}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="(row, i) in rows" :key="i">
              <TableCell v-for="key in Object.keys(rows[0]).slice(0, 6)" :key="key">{{ row[key] }}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
    <slot />
  </div>
</template>
