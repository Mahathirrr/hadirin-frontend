<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import PageShell from '@/components/app/page-shell.vue'
import StatCard from '@/components/app/stat-card.vue'
import TableEmpty from '@/components/app/table-empty.vue'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useWorkspaceLoader } from '@/composables/useWorkspaceData'
import { api } from '@/lib/api'

const activeDate = ref(new Date().toISOString().slice(0, 10))
const attendanceOpen = ref(true)
const scanOpen = ref(true)
const reportOpen = ref(true)

const { data: records, loading, load } = useWorkspaceLoader(async (token, workspaceId) =>
  api.listAttendance(token, workspaceId, activeDate.value) as Promise<Array<Record<string, unknown>>>,
)

watch(activeDate, () => { void load() })

const presentCount = computed(() =>
  (records.value ?? []).filter((r) => r.status === 'present').length,
)
</script>

<template>
  <PageShell title="Laporan & Audit Kehadiran">
    <template #header>
      <div class="flex flex-wrap items-start justify-between gap-3">
        <div class="space-y-0.5">
          <h1 class="text-2xl font-bold tracking-tight md:text-3xl">Laporan & Audit Kehadiran</h1>
          <p class="text-sm text-muted-foreground">
            Tinjau dan audit catatan kehadiran harian karyawan, scan event, dan riwayat report mingguan.
          </p>
        </div>
        <Badge variant="outline" class="shrink-0">Tanggal aktif: {{ activeDate }}</Badge>
      </div>
    </template>

    <Card class="rounded-xl shadow-none">
      <CardHeader class="px-4 pt-4 pb-2">
        <CardTitle class="text-base">Ringkasan absensi</CardTitle>
      </CardHeader>
      <CardContent class="space-y-3 px-4 pb-4">
        <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard title="Total data" :value="records?.length ?? 0" />
          <StatCard title="Check-in" :value="presentCount" />
          <StatCard title="Check-out" :value="(records ?? []).filter((r) => r.check_out).length" />
          <StatCard title="Diedit" :value="0" />
        </div>
        <div class="grid gap-3 md:grid-cols-3">
          <div class="rounded-lg border bg-muted/20 p-3 text-sm">
            <p class="font-medium">Kondisi data</p>
            <p class="mt-1 text-muted-foreground">Ubah tanggal jika belum ada data absensi untuk hari ini.</p>
          </div>
          <div class="rounded-lg border bg-muted/20 p-3 text-sm">
            <p class="font-medium">Scan harian</p>
            <p class="mt-1 text-muted-foreground">Event scan QR/device akan tercatat di bawah setelah ada aktivitas.</p>
          </div>
          <div class="rounded-lg border bg-muted/20 p-3 text-sm">
            <p class="font-medium">Riwayat report</p>
            <p class="mt-1 text-muted-foreground">Report mingguan otomatis muncul setelah generate pertama.</p>
          </div>
        </div>
      </CardContent>
    </Card>

    <Card class="rounded-xl shadow-none">
      <CardHeader class="px-4 pt-4 pb-2">
        <CardTitle class="text-base">Filter absensi harian</CardTitle>
      </CardHeader>
      <CardContent class="space-y-3 px-4 pb-4">
        <div class="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <div class="grid gap-1.5">
            <Label>Tanggal</Label>
            <Input type="date" v-model="activeDate" />
          </div>
          <div class="grid gap-1.5">
            <Label>Nama karyawan</Label>
            <Input placeholder="Cari nama" />
          </div>
          <div class="grid gap-1.5">
            <Label>Status edit</Label>
            <Select default-value="all">
              <SelectTrigger><SelectValue placeholder="Semua" /></SelectTrigger>
              <SelectContent><SelectItem value="all">Semua</SelectItem></SelectContent>
            </Select>
          </div>
          <div class="grid gap-1.5">
            <Label>Status attendance</Label>
            <Select default-value="all">
              <SelectTrigger><SelectValue placeholder="Semua" /></SelectTrigger>
              <SelectContent><SelectItem value="all">Semua</SelectItem></SelectContent>
            </Select>
          </div>
        </div>
        <div class="flex flex-wrap items-center gap-2 border-t pt-3">
          <span class="text-xs font-medium uppercase tracking-wide text-muted-foreground">Aksi cepat</span>
          <Button size="sm">Terapkan filter</Button>
          <Button variant="outline" size="sm">Reset filter</Button>
          <Button variant="outline" size="sm">Sinkronkan attendance</Button>
        </div>
      </CardContent>
    </Card>

    <Card class="rounded-xl shadow-none">
      <CardHeader class="flex flex-row items-center justify-between gap-3 px-4 pt-4 pb-2">
        <CardTitle class="text-base">Data attendance</CardTitle>
        <div class="flex gap-2">
          <Button variant="outline" size="sm" @click="attendanceOpen = !attendanceOpen">
            {{ attendanceOpen ? 'Sembunyikan' : 'Tampilkan' }}
          </Button>
          <Button variant="outline" size="sm">Sinkronkan attendance</Button>
        </div>
      </CardHeader>
      <CardContent v-if="attendanceOpen" class="px-4 pb-4">
        <TableEmpty message="Tidak ada data absensi untuk filter saat ini." compact />
      </CardContent>
    </Card>

    <Card class="rounded-xl shadow-none">
      <CardHeader class="flex flex-row flex-wrap items-center justify-between gap-3 px-4 pt-4 pb-2">
        <CardTitle class="text-base">Scan events</CardTitle>
        <div class="flex flex-wrap gap-2">
          <Select default-value="all">
            <SelectTrigger class="w-36"><SelectValue placeholder="Status scan" /></SelectTrigger>
            <SelectContent><SelectItem value="all">Semua</SelectItem></SelectContent>
          </Select>
          <Button variant="outline" size="sm">Sinkronkan scan event</Button>
        </div>
      </CardHeader>
      <CardContent v-if="scanOpen" class="space-y-3 px-4 pb-4">
        <div class="grid gap-2 sm:grid-cols-3">
          <div class="rounded-lg border bg-foreground px-3 py-2 text-sm text-background">Total: 0</div>
          <div class="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">Berhasil: 0</div>
          <div class="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">Ditolak: 0</div>
        </div>
        <TableEmpty message="Belum ada scan event untuk tanggal aktif." compact />
      </CardContent>
    </Card>

    <Card class="rounded-xl shadow-none">
      <CardHeader class="flex flex-row flex-wrap items-center justify-between gap-3 px-4 pt-4 pb-2">
        <CardTitle class="text-base">Riwayat report mingguan</CardTitle>
        <div class="flex flex-wrap gap-2">
          <Select default-value="all">
            <SelectTrigger class="w-36"><SelectValue placeholder="Team" /></SelectTrigger>
            <SelectContent><SelectItem value="all">Semua team</SelectItem></SelectContent>
          </Select>
          <Button size="sm">Generate report scope ini</Button>
          <Button variant="outline" size="sm">Sinkronkan riwayat report</Button>
        </div>
      </CardHeader>
      <CardContent v-if="reportOpen" class="space-y-3 px-4 pb-4">
        <div class="rounded-lg border border-sky-200 bg-sky-50 px-3 py-2 text-sm text-sky-900">
          <span class="font-medium">Scope Excel mingguan:</span>
          report akan mencakup semua karyawan aktif di workspace untuk minggu berjalan.
        </div>
        <TableEmpty message="Belum ada riwayat report mingguan." compact />
      </CardContent>
    </Card>
  </PageShell>
</template>
