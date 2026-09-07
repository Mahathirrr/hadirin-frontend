<script setup lang="ts">
import type { Component } from 'vue'
import { useRouter } from 'vue-router'
import {
  ClipboardList,
  Compass,
  FileText,
  LayoutDashboard,
  MapPin,
  QrCode,
  ScanFace,
  ScrollText,
  Settings,
  Users,
} from 'lucide-vue-next'

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { ROUTES } from '@/lib/routes'

interface SearchItem {
  title: string
  url: string
  group: string
  icon?: Component
}

interface Props {
  open: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{ (e: 'update:open', value: boolean): void }>()

const router = useRouter()

const searchItems: SearchItem[] = [
  { title: 'Ringkasan', url: ROUTES.summary, group: 'Operasional', icon: LayoutDashboard },
  { title: 'Work Plans & Reports', url: ROUTES.workPlans, group: 'Operasional', icon: ClipboardList },
  { title: 'Laporan', url: ROUTES.reports, group: 'Operasional', icon: FileText },
  { title: 'Pengajuan Cuti', url: ROUTES.leaveRequests, group: 'Operasional', icon: ScrollText },
  { title: 'Monitoring Lokasi', url: ROUTES.locationMonitoring, group: 'Operasional', icon: MapPin },
  { title: 'Log audit', url: ROUTES.auditLogs, group: 'Operasional', icon: ScrollText },
  { title: 'Device QR', url: ROUTES.qrDevices, group: 'Operasional', icon: QrCode },
  { title: 'Face ID', url: ROUTES.faceId, group: 'Operasional', icon: ScanFace },
  { title: 'Karyawan', url: ROUTES.employees, group: 'Operasional', icon: Users },
  { title: 'Workspace', url: ROUTES.workspace, group: 'Pengaturan', icon: Settings },
  { title: 'Panduan', url: ROUTES.guide, group: 'Operasional', icon: Compass },
  { title: 'Geofence', url: ROUTES.geofence, group: 'Pengaturan', icon: MapPin },
]

function groupedItems() {
  const acc: Record<string, SearchItem[]> = {}
  for (const item of searchItems) {
    if (!acc[item.group]) acc[item.group] = []
    acc[item.group].push(item)
  }
  return acc
}

function handleSelect(url: string) {
  router.push(url)
  emit('update:open', false)
}
</script>

<template>
  <Dialog :open="props.open" @update:open="$emit('update:open', $event)">
    <DialogContent class="z-[130] border-zinc-200 shadow-2xl max-w-[640px] overflow-hidden p-0 dark:border-zinc-800">
      <DialogTitle class="sr-only">Command Search</DialogTitle>
      <Command class="bg-white text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50 transition-transform duration-100 ease-out">
        <CommandInput placeholder="Cari halaman atau fitur Hadirin..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup
            v-for="(items, group) in groupedItems()"
            :key="group"
            :heading="group"
          >
            <CommandItem
              v-for="item in items"
              :key="item.url"
              :value="item.title"
              class="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium"
              @click="handleSelect(item.url)"
            >
              <component :is="item.icon" v-if="item.icon" class="mr-2 h-4 w-4" />
              {{ item.title }}
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </DialogContent>
  </Dialog>
</template>