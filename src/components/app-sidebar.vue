<script setup lang="ts">
import {
  BookOpen,
  ClipboardList,
  FileText,
  LayoutDashboard,
  MapPin,
  CalendarRange,
  QrCode,
  ScanFace,
  ScrollText,
  Settings,
  Radar,
  Users,
} from 'lucide-vue-next'
import { RouterLink } from 'vue-router'

import NavMain from './nav-main.vue'
import NavUser from '@/components/nav-user.vue'
import { ROUTES } from '@/lib/routes'
import { useAuthStore } from '@/stores/auth'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

const auth = useAuthStore()

const data = {
  navGroups: [
    {
      label: 'OPERASIONAL',
      items: [
        { title: 'Ringkasan', url: ROUTES.summary, icon: LayoutDashboard },
        { title: 'Rencana & laporan kerja', url: ROUTES.workPlans, icon: ClipboardList },
        { title: 'Laporan', url: ROUTES.reports, icon: FileText },
        { title: 'Pengajuan Cuti', url: ROUTES.leaveRequests, icon: ScrollText },
        { title: 'Monitoring Lokasi', url: ROUTES.locationMonitoring, icon: MapPin },
        { title: 'Riwayat aktivitas', url: ROUTES.auditLogs, icon: ScrollText },
        { title: 'Deteksi anomali', url: ROUTES.anomalyDetection, icon: Radar },
        { title: 'Perangkat QR', url: ROUTES.qrDevices, icon: QrCode },
        { title: 'Face ID', url: ROUTES.faceId, icon: ScanFace },
        { title: 'Karyawan', url: ROUTES.employees, icon: Users },
      ],
    },
    {
      label: 'PENGATURAN',
      items: [
        { title: 'Perusahaan', url: ROUTES.workspace, icon: Settings },
        { title: 'Geofence', url: ROUTES.geofence, icon: MapPin },
        { title: 'Shift & Roster', url: ROUTES.shiftRoster, icon: CalendarRange },
      ],
    },
  ],
}
</script>

<template>
  <Sidebar>
    <SidebarContent class="pt-2">
      <NavMain
        v-for="group in data.navGroups"
        :key="group.label"
        :label="group.label"
        :items="group.items"
      />
    </SidebarContent>
    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton as-child class="cursor-pointer">
            <RouterLink :to="ROUTES.guide">
              <BookOpen />
              <span>Panduan</span>
            </RouterLink>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
      <NavUser
        :user="{
          id: auth.user?.id,
          name: auth.user?.name || 'Admin',
          email: auth.user?.email || 'admin@admin.com',
          avatar_url: auth.user?.avatar_url,
        }"
      />
    </SidebarFooter>
  </Sidebar>
</template>
