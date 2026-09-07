<script setup lang="ts">
import {
  BookOpen,
  ClipboardList,
  FileText,
  LayoutDashboard,
  MapPin,
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
        { title: 'Work Plans & Reports', url: ROUTES.workPlans, icon: ClipboardList },
        { title: 'Laporan', url: ROUTES.reports, icon: FileText },
        { title: 'Pengajuan Cuti', url: ROUTES.leaveRequests, icon: ScrollText },
        { title: 'Monitoring Lokasi', url: ROUTES.locationMonitoring, icon: MapPin },
        { title: 'Log audit', url: ROUTES.auditLogs, icon: ScrollText },
        { title: 'Deteksi Anomaly', url: ROUTES.anomalyDetection, icon: Radar },
        { title: 'Device QR', url: ROUTES.qrDevices, icon: QrCode },
        { title: 'Face ID', url: ROUTES.faceId, icon: ScanFace },
        { title: 'Karyawan', url: ROUTES.employees, icon: Users },
      ],
    },
    {
      label: 'PENGATURAN',
      items: [
        { title: 'Workspace', url: ROUTES.workspace, icon: Settings },
        { title: 'Geofence', url: ROUTES.geofence, icon: MapPin },
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
      <NavUser :user="{ name: auth.user?.name || 'Admin', email: auth.user?.email || 'admin@admin.com', avatar: '' }" />
    </SidebarFooter>
  </Sidebar>
</template>
