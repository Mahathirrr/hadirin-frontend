<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'

import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  CircleCheckBig,
  Columns2,
  EllipsisVertical,
  GripVertical,
  Loader,
  Plus,
  TrendingDown,
  TrendingUp,
} from 'lucide-vue-next'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

import RechartsArea from '@/components/charts/RechartsArea.vue'

import { chartData } from '@/views/data/chartData'
import outlineData from '@/views/data/dashboardOutline'
import pastPerformanceData from '@/views/data/dashboardPastPerformance'
import keyPersonnelData from '@/views/data/dashboardKeyPersonnel'
import focusDocumentsData from '@/views/data/dashboardFocusDocuments'

const isMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches

const timeRange = ref<'90d' | '30d' | '7d'>('90d')
if (isMobile) timeRange.value = '7d'

const filteredChartData = computed(() =>
  chartData.filter((item) => {
    const date = new Date(item.date)
    const referenceDate = new Date('2024-06-30')
    let daysToSubtract = 90
    if (timeRange.value === '30d') daysToSubtract = 30
    else if (timeRange.value === '7d') daysToSubtract = 7
    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)
    return date >= startDate
  }),
)

const formatDate = (value: string) => {
  const d = new Date(value)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

const chartSeries = [
  { key: 'mobile', name: 'Mobile', color: 'var(--primary)', topOpacity: 0.8, bottomOpacity: 0.1 },
  { key: 'desktop', name: 'Desktop', color: 'var(--primary)', topOpacity: 1, bottomOpacity: 0.1 },
]

interface Row {
  id: number
  header: string
  type: string
  status: string
  target: string
  limit: string
  reviewer: string
}

type DatasetKey = 'outline' | 'past-performance' | 'key-personnel' | 'focus-documents'
const datasets: Record<DatasetKey, Row[]> = {
  outline: outlineData as Row[],
  'past-performance': pastPerformanceData as Row[],
  'key-personnel': keyPersonnelData as Row[],
  'focus-documents': focusDocumentsData as Row[],
}
const activeTab = ref<DatasetKey>('outline')
const tabDefs = [
  { value: 'outline', label: 'Outline' },
  { value: 'past-performance', label: 'Past Performance', count: 3 },
  { value: 'key-personnel', label: 'Key Personnel', count: 2 },
  { value: 'focus-documents', label: 'Focus Documents' },
]
const rowsPerPage = ref(10)
const pageIndex = ref(0)
const selected = ref<Set<number>>(new Set())
const sortKey = ref<keyof Row | ''>('')
const sortDir = ref<'asc' | 'desc'>('asc')
const activeRows = ref<Row[]>(datasets[activeTab.value])
const tabKeys: DatasetKey[] = ['outline', 'past-performance', 'key-personnel', 'focus-documents']

watch(activeTab, () => {
  activeRows.value = datasets[activeTab.value]
  pageIndex.value = 0
})
watch(rowsPerPage, () => (pageIndex.value = 0))

const pageRows = computed(() => {
  const rows = [...activeRows.value]
  if (sortKey.value) {
    const key = sortKey.value
    const dir = sortDir.value === 'asc' ? 1 : -1
    rows.sort((a, b) => String(a[key]).localeCompare(String(b[key])) * dir)
  }
  const start = pageIndex.value * rowsPerPage.value
  return rows.slice(start, start + rowsPerPage.value)
})
const pageCount = computed(() => Math.max(1, Math.ceil(activeRows.value.length / rowsPerPage.value)))
const selectedCount = computed(() => selected.value.size)
const allSelected = computed(() => pageRows.value.length > 0 && pageRows.value.every((r) => selected.value.has(r.id)))

function toggleSort(key: keyof Row) {
  if (sortKey.value === key) sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
  else {
    sortKey.value = key
    sortDir.value = 'asc'
  }
}
function toggleSelectAll() {
  const next = new Set(selected.value)
  const checked = allSelected.value
  pageRows.value.forEach((r) => {
    if (checked) next.delete(r.id)
    else next.add(r.id)
  })
  selected.value = next
}
function toggleRow(id: number) {
  const next = new Set(selected.value)
  if (next.has(id)) next.delete(id)
  else next.add(id)
  selected.value = next
}
const sortIcon = (key: keyof Row) => (sortKey.value === key ? (sortDir.value === 'asc' ? '↑' : '↓') : '')

const columnVisibility = reactive<Record<string, boolean>>({
  type: true,
  status: true,
  target: true,
  limit: true,
  reviewer: true,
})
const hideableColumns = ['type', 'status', 'target', 'limit', 'reviewer']

const viewer = ref<Row | null>(null)
const viewerOpen = ref(false)
function openViewer(row: Row) {
  viewer.value = { ...row }
  viewerOpen.value = true
}
</script>

<template>
  <div class="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
    <div class="@container/main px-4 space-y-6 lg:px-6">
      <div class="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card class="@container/card">
          <CardHeader>
            <CardDescription>Total Revenue</CardDescription>
            <CardTitle class="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">$1,250.00</CardTitle>
            <CardAction>
              <Badge variant="outline"><TrendingUp class="size-4" /> +12.5%</Badge>
            </CardAction>
          </CardHeader>
          <CardFooter class="flex-col items-start gap-1.5 text-sm">
            <div class="line-clamp-1 flex gap-2 font-medium">Trending up this month <TrendingUp class="size-4" /></div>
            <div class="text-muted-foreground">Visitors for the last 6 months</div>
          </CardFooter>
        </Card>
        <Card class="@container/card">
          <CardHeader>
            <CardDescription>New Customers</CardDescription>
            <CardTitle class="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">1,234</CardTitle>
            <CardAction>
              <Badge variant="outline"><TrendingDown class="size-4" /> -20%</Badge>
            </CardAction>
          </CardHeader>
          <CardFooter class="flex-col items-start gap-1.5 text-sm">
            <div class="line-clamp-1 flex gap-2 font-medium">Down 20% this period <TrendingDown class="size-4" /></div>
            <div class="text-muted-foreground">Acquisition needs attention</div>
          </CardFooter>
        </Card>
        <Card class="@container/card">
          <CardHeader>
            <CardDescription>Active Accounts</CardDescription>
            <CardTitle class="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">45,678</CardTitle>
            <CardAction>
              <Badge variant="outline"><TrendingUp class="size-4" /> +12.5%</Badge>
            </CardAction>
          </CardHeader>
          <CardFooter class="flex-col items-start gap-1.5 text-sm">
            <div class="line-clamp-1 flex gap-2 font-medium">Strong user retention <TrendingUp class="size-4" /></div>
            <div class="text-muted-foreground">Engagement exceed targets</div>
          </CardFooter>
        </Card>
        <Card class="@container/card">
          <CardHeader>
            <CardDescription>Growth Rate</CardDescription>
            <CardTitle class="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">4.5%</CardTitle>
            <CardAction>
              <Badge variant="outline"><TrendingUp class="size-4" /> +4.5%</Badge>
            </CardAction>
          </CardHeader>
          <CardFooter class="flex-col items-start gap-1.5 text-sm">
            <div class="line-clamp-1 flex gap-2 font-medium">Steady performance increase <TrendingUp class="size-4" /></div>
            <div class="text-muted-foreground">Meets growth projections</div>
          </CardFooter>
        </Card>
      </div>

      <Card class="@container/card">
        <CardHeader>
          <CardTitle>Total Visitors</CardTitle>
          <CardDescription>
            <span class="hidden @[540px]/card:block">Total for the last 3 months</span>
            <span class="@[540px]/card:hidden">Last 3 months</span>
          </CardDescription>
          <CardAction>
            <ToggleGroup
              type="single"
              :model-value="timeRange"
              variant="outline"
              class="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
              @update:model-value="(v: string) => (timeRange = v as any)"
            >
              <ToggleGroupItem value="90d" class="cursor-pointer">Last 3 months</ToggleGroupItem>
              <ToggleGroupItem value="30d" class="cursor-pointer">Last 30 days</ToggleGroupItem>
              <ToggleGroupItem value="7d" class="cursor-pointer">Last 7 days</ToggleGroupItem>
            </ToggleGroup>
            <Select :model-value="timeRange" @update:model-value="(v: string) => (timeRange = v as any)">
              <SelectTrigger
                class="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
                size="sm"
                aria-label="Select a value"
              >
                <SelectValue placeholder="Last 3 months" />
              </SelectTrigger>
              <SelectContent class="rounded-xl">
                <SelectItem value="90d" class="rounded-lg">Last 3 months</SelectItem>
                <SelectItem value="30d" class="rounded-lg">Last 30 days</SelectItem>
                <SelectItem value="7d" class="rounded-lg">Last 7 days</SelectItem>
              </SelectContent>
            </Select>
          </CardAction>
        </CardHeader>
        <CardContent class="px-2 pt-4 sm:px-6 sm:pt-6">
          <div class="aspect-auto h-[250px] w-full">
            <RechartsArea
              :data="filteredChartData"
              x-key="date"
              :series="chartSeries"
              :height="250"
              :x-formatter="formatDate"
            />
          </div>
        </CardContent>
      </Card>
    </div>

    <div class="@container/main">
      <div class="flex w-full flex-col justify-start gap-6">
        <div class="flex flex-wrap items-center justify-between gap-3 px-4 lg:px-6">
          <div class="flex items-center gap-2">
            <Label for="view-selector" class="sr-only">View</Label>
            <Select :model-value="activeTab" @update:model-value="activeTab = $event">
              <SelectTrigger class="flex w-fit cursor-pointer sm:hidden" size="sm" id="view-selector">
                <SelectValue placeholder="Select a view" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="outline">Outline</SelectItem>
                <SelectItem value="past-performance">Past Performance</SelectItem>
                <SelectItem value="key-personnel">Key Personnel</SelectItem>
                <SelectItem value="focus-documents">Focus Documents</SelectItem>
              </SelectContent>
            </Select>
            <div class="bg-muted text-muted-foreground hidden h-9 w-fit items-center justify-center rounded-lg p-[3px] sm:flex">
              <button
                v-for="t in tabDefs"
                :key="t.value"
                type="button"
                class="inline-flex h-[calc(100%-1px)] flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1"
                :class="activeTab === t.value ? 'bg-background text-foreground shadow-sm border-input dark:bg-input/30 dark:text-foreground' : 'text-foreground dark:text-muted-foreground'"
                @click="activeTab = t.value"
              >
                {{ t.label }}
                <Badge v-if="t.count" variant="secondary" class="bg-muted-foreground/30 size-5 rounded-full px-1">{{ t.count }}</Badge>
              </button>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger as-child>
                <Button variant="outline" size="sm" class="cursor-pointer">
                  <Columns2 class="size-4" /><span class="hidden lg:inline">Customize Columns</span><span class="lg:hidden">Columns</span><ChevronDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" class="w-56">
                <DropdownMenuCheckboxItem
                  v-for="col in hideableColumns"
                  :key="col"
                  class="cursor-pointer capitalize"
                  :checked="columnVisibility[col]"
                  @update:checked="columnVisibility[col] = $event"
                >
                  {{ col }}
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="outline" size="sm" class="cursor-pointer"><Plus class="size-4" /><span class="hidden lg:inline">Add Section</span></Button>
          </div>
        </div>

        <div
          v-for="tab in tabKeys"
          v-show="activeTab === tab"
          :key="tab"
          class="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
        >
            <div class="overflow-hidden rounded-lg border">
              <Table>
                <TableHeader class="bg-muted sticky top-0 z-10">
                  <TableRow>
                    <TableHead class="w-8"></TableHead>
                    <TableHead class="w-10"><div class="flex items-center justify-center"><Checkbox :checked="allSelected" @update:checked="toggleSelectAll" aria-label="Select all" /></div></TableHead>
                    <TableHead class="cursor-pointer" @click="toggleSort('header')">Header {{ sortIcon('header') }}</TableHead>
                    <TableHead v-if="columnVisibility.type" class="cursor-pointer" @click="toggleSort('type')">Section Type {{ sortIcon('type') }}</TableHead>
                    <TableHead v-if="columnVisibility.status" class="cursor-pointer" @click="toggleSort('status')">Status {{ sortIcon('status') }}</TableHead>
                    <TableHead v-if="columnVisibility.target" class="cursor-pointer" @click="toggleSort('target')">Target {{ sortIcon('target') }}</TableHead>
                    <TableHead v-if="columnVisibility.limit" class="cursor-pointer" @click="toggleSort('limit')">Limit {{ sortIcon('limit') }}</TableHead>
                    <TableHead v-if="columnVisibility.reviewer" class="cursor-pointer" @click="toggleSort('reviewer')">Reviewer {{ sortIcon('reviewer') }}</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow v-for="row in pageRows" :key="tab + '-' + row.id" :data-state="selected.has(row.id) ? 'selected' : undefined">
                    <TableCell class="w-8"><GripVertical class="text-muted-foreground size-3" /><span class="sr-only">Drag to reorder</span></TableCell>
                    <TableCell><div class="flex items-center justify-center"><Checkbox :checked="selected.has(row.id)" @update:checked="toggleRow(row.id)" aria-label="Select row" /></div></TableCell>
                    <TableCell><button type="button" class="cursor-pointer font-medium text-left" @click="openViewer(row)">{{ row.header }}</button></TableCell>
                    <TableCell v-if="columnVisibility.type"><span class="w-32"><Badge variant="outline" class="text-muted-foreground px-1.5">{{ row.type }}</Badge></span></TableCell>
                    <TableCell v-if="columnVisibility.status"><Badge variant="outline" class="text-muted-foreground px-1.5"><CircleCheckBig v-if="row.status === 'Done'" class="text-green-500 dark:text-green-400" /><Loader v-else />{{ row.status }}</Badge></TableCell>
                    <TableCell v-if="columnVisibility.target">
                      <form @submit.prevent>
                        <Label :for="`${row.id}-target`" class="sr-only">Target</Label>
                        <Input :id="`${row.id}-target`" class="hover:bg-input/30 focus-visible:bg-background dark:hover:bg-input/30 dark:focus-visible:bg-input/30 h-8 w-16 border-transparent bg-transparent shadow-none focus-visible:border dark:bg-transparent" :value="row.target" />
                      </form>
                    </TableCell>
                    <TableCell v-if="columnVisibility.limit">
                      <form @submit.prevent>
                        <Label :for="`${row.id}-limit`" class="sr-only">Limit</Label>
                        <Input :id="`${row.id}-limit`" class="hover:bg-input/30 focus-visible:bg-background dark:hover:bg-input/30 dark:focus-visible:bg-input/30 h-8 w-16 border-transparent bg-transparent shadow-none focus-visible:border dark:bg-transparent" :value="row.limit" />
                      </form>
                    </TableCell>
                    <TableCell v-if="columnVisibility.reviewer">
                      <template v-if="row.reviewer !== 'Assign reviewer'">
                        {{ row.reviewer }}
                      </template>
                      <template v-else>
                        <Label :for="`${row.id}-reviewer`" class="sr-only">Reviewer</Label>
                        <Select>
                          <SelectTrigger class="w-38 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate cursor-pointer" size="sm" :id="`${row.id}-reviewer`">
                            <SelectValue placeholder="Assign reviewer" />
                          </SelectTrigger>
                          <SelectContent align="end">
                            <SelectItem value="Eddie Lake">Eddie Lake</SelectItem>
                            <SelectItem value="Jamik Tashpulatov">Jamik Tashpulatov</SelectItem>
                          </SelectContent>
                        </Select>
                      </template>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger as-child>
                          <Button variant="ghost" class="data-[state=open]:bg-muted text-muted-foreground flex size-8 cursor-pointer" size="icon"><EllipsisVertical class="size-4" /><span class="sr-only">Open menu</span></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" class="w-32">
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem>Make a copy</DropdownMenuItem>
                          <DropdownMenuItem>Favorite</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                  <TableRow v-if="pageRows.length === 0"><TableCell :colspan="9" class="h-24 text-center">No results.</TableCell></TableRow>
                </TableBody>
              </Table>
            </div>
            <div class="flex items-center justify-between px-4">
              <div class="text-muted-foreground hidden flex-1 text-sm lg:flex">{{ selectedCount }} of {{ activeRows.length }} row(s) selected.</div>
              <div class="flex w-full items-center gap-8 lg:w-fit">
                <div class="hidden items-center gap-2 lg:flex">
                  <Label for="rows-per-page" class="text-sm font-medium">Rows per page</Label>
                  <Select :model-value="String(rowsPerPage)" @update:model-value="rowsPerPage = Number($event)">
                    <SelectTrigger size="sm" class="w-20 cursor-pointer" id="rows-per-page"><SelectValue /></SelectTrigger>
                    <SelectContent side="top">
                      <SelectItem v-for="size in [10, 20, 30, 40, 50]" :key="size" :value="String(size)">{{ size }}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div class="flex w-fit items-center justify-center text-sm font-medium">Page {{ pageIndex + 1 }} of {{ pageCount }}</div>
                <div class="ml-auto flex items-center gap-2 lg:ml-0">
                  <Button variant="outline" class="hidden h-8 w-8 cursor-pointer p-0 lg:flex" @click="pageIndex = 0" :disabled="pageIndex === 0"><span class="sr-only">Go to first page</span><ChevronsLeft /></Button>
                  <Button variant="outline" class="size-8 cursor-pointer" size="icon" @click="pageIndex--" :disabled="pageIndex === 0"><span class="sr-only">Go to previous page</span><ChevronLeft /></Button>
                  <Button variant="outline" class="size-8 cursor-pointer" size="icon" @click="pageIndex++" :disabled="pageIndex >= pageCount - 1"><span class="sr-only">Go to next page</span><ChevronRight /></Button>
                  <Button variant="outline" class="hidden size-8 cursor-pointer lg:flex" size="icon" @click="pageIndex = pageCount - 1" :disabled="pageIndex >= pageCount - 1"><span class="sr-only">Go to last page</span><ChevronsRight /></Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    <Dialog v-model:open="viewerOpen">
      <DialogContent class="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{{ viewer?.header }}</DialogTitle>
          <DialogDescription>Showing details for this section</DialogDescription>
        </DialogHeader>
        <div v-if="viewer" class="flex flex-col gap-4 text-sm">
          <div class="h-48 w-full">
            <RechartsArea :data="chartData" x-key="date" :series="chartSeries" :height="192" :x-formatter="formatDate" />
          </div>
          <div class="flex gap-2 font-medium"><TrendingUp class="size-4" /> Trending up by 5.2% this month</div>
          <div class="grid gap-3">
            <div class="flex flex-col gap-3"><Label>Header</Label><Input v-model="viewer.header" /></div>
            <div class="grid grid-cols-2 gap-4"><div class="flex flex-col gap-3"><Label>Type</Label><Input v-model="viewer.type" /></div><div class="flex flex-col gap-3"><Label>Status</Label><Input v-model="viewer.status" /></div></div>
            <div class="grid grid-cols-2 gap-4"><div class="flex flex-col gap-3"><Label>Target</Label><Input v-model="viewer.target" /></div><div class="flex flex-col gap-3"><Label>Limit</Label><Input v-model="viewer.limit" /></div></div>
            <div class="flex flex-col gap-3"><Label>Reviewer</Label><Input v-model="viewer.reviewer" /></div>
          </div>
        </div>
        <DialogFooter>
          <DialogClose as-child><Button class="cursor-pointer">Close</Button></DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>
