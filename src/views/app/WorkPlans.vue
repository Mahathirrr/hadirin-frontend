<script setup lang="ts">
import { computed, ref } from 'vue'
import { toast } from 'vue-sonner'

import PageShell from '@/components/app/page-shell.vue'
import TableEmpty from '@/components/app/table-empty.vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useWorkspaceLoader } from '@/composables/useWorkspaceData'
import { api } from '@/lib/api'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const activeTab = ref('plans')
const generating = ref(false)

const { data: plans, load: reloadPlans } = useWorkspaceLoader(async (token, ws) =>
  api.listWorkPlans(token, ws) as Promise<Array<Record<string, unknown>>>,
)
const { data: reports, load: reloadReports } = useWorkspaceLoader(async (token, ws) =>
  api.listWorkReports(token, ws) as Promise<Array<Record<string, unknown>>>,
)

const planCount = computed(() => plans.value?.length ?? 0)
const reportCount = computed(() => reports.value?.length ?? 0)

async function generateWeeklyCsv() {
  if (!auth.token || !auth.workspaceId) return
  generating.value = true
  try {
    const res = await api.generateWeeklyReport(auth.token, auth.workspaceId)
    toast.success(res.message || 'Report mingguan dibuat')
    if (res.download_url) {
      await api.downloadWeeklyReportFile(auth.token, auth.workspaceId)
    }
  } catch (e) {
    toast.error(e instanceof Error ? e.message : 'Gagal generate report')
  } finally {
    generating.value = false
  }
}
</script>

<template>
  <PageShell title="Work Plans & Reports" description="Kelola rencana kerja dan laporan operasional.">
    <Card class="rounded-xl shadow-none">
      <CardContent class="flex flex-wrap items-center gap-2 p-4">
        <Button variant="outline" size="sm" :disabled="generating" @click="generateWeeklyCsv">
          {{ generating ? 'Memproses…' : 'Generate CSV mingguan' }}
        </Button>
        <Button variant="ghost" size="sm" @click="reloadPlans(); reloadReports()">Refresh</Button>
        <p class="text-xs text-muted-foreground">Export CSV kehadiran 7 hari terakhir untuk audit internal.</p>
      </CardContent>
    </Card>

    <Tabs v-model="activeTab" class="gap-3">
      <TabsList class="h-auto w-full justify-start gap-1 rounded-lg bg-muted/40 p-1">
        <TabsTrigger value="plans" class="cursor-pointer">Work Plans ({{ planCount }})</TabsTrigger>
        <TabsTrigger value="reports" class="cursor-pointer">Work Reports ({{ reportCount }})</TabsTrigger>
      </TabsList>
      <TabsContent value="plans">
        <Card class="rounded-xl shadow-none">
          <CardHeader class="px-4 pt-4 pb-2"><CardTitle class="text-base">Rencana kerja</CardTitle></CardHeader>
          <CardContent class="px-4 pb-4">
            <TableEmpty v-if="planCount === 0" message="Belum ada work plan. Buat via API atau integrasi mobile." />
            <ul v-else class="space-y-2 text-sm">
              <li v-for="p in plans" :key="String(p.id)" class="rounded-lg border px-3 py-2">
                <p class="font-medium">{{ p.title }}</p>
                <p class="text-xs text-muted-foreground">{{ p.date }} · {{ p.status }}</p>
              </li>
            </ul>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="reports">
        <Card class="rounded-xl shadow-none">
          <CardHeader class="px-4 pt-4 pb-2"><CardTitle class="text-base">Laporan harian</CardTitle></CardHeader>
          <CardContent class="px-4 pb-4">
            <TableEmpty v-if="reportCount === 0" message="Belum ada work report." />
            <ul v-else class="space-y-2 text-sm">
              <li v-for="r in reports" :key="String(r.id)" class="rounded-lg border px-3 py-2">
                <p class="font-medium">{{ r.title }}</p>
                <p class="text-xs text-muted-foreground">{{ r.date }}</p>
              </li>
            </ul>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  </PageShell>
</template>
