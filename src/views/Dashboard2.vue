<script setup lang="ts">
import { computed, ref } from 'vue'

import {
  ArrowUp,
  BarChart3,
  Download,
  DollarSign,
  Eye,
  FileText,
  MapPin,
  MoreHorizontal,
  Plus,
  Settings,
  ShoppingCart,
  Star,
  Target,
  TrendingDown,
  TrendingUp,
  User,
  Users,
} from 'lucide-vue-next'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import RechartsArea from '@/components/charts/RechartsArea.vue'
import RechartsBar from '@/components/charts/RechartsBar.vue'
import RechartsPie from '@/components/charts/RechartsPie.vue'

// ---------- Metrics ----------
const metrics = [
  { title: 'Total Revenue', value: '$54,230', change: '+12%', trend: 'up', icon: DollarSign, footer: 'Trending up this month', subfooter: 'Revenue for the last 6 months' },
  { title: 'Active Customers', value: '2,350', change: '+5.2%', trend: 'up', icon: Users, footer: 'Strong user retention', subfooter: 'Engagement exceeds targets' },
  { title: 'Total Orders', value: '1,247', change: '-2.1%', trend: 'down', icon: ShoppingCart, footer: 'Down 2% this period', subfooter: 'Order volume needs attention' },
  { title: 'Conversion Rate', value: '3.24%', change: '+8.3%', trend: 'up', icon: BarChart3, footer: 'Steady performance increase', subfooter: 'Meets conversion projections' },
]

// ---------- Sales chart ----------
const salesData = [
  { month: 'Jan', sales: 12500, target: 15000 },
  { month: 'Feb', sales: 18200, target: 15000 },
  { month: 'Mar', sales: 16800, target: 15000 },
  { month: 'Apr', sales: 22400, target: 20000 },
  { month: 'May', sales: 24600, target: 20000 },
  { month: 'Jun', sales: 28200, target: 25000 },
  { month: 'Jul', sales: 31500, target: 25000 },
  { month: 'Aug', sales: 29800, target: 25000 },
  { month: 'Sep', sales: 33200, target: 30000 },
  { month: 'Oct', sales: 35100, target: 30000 },
  { month: 'Nov', sales: 38900, target: 35000 },
  { month: 'Dec', sales: 42300, target: 35000 },
]
const salesRange = ref('12m')
const salesChartOption = computed(() => ({
  animation: false,
  tooltip: { trigger: 'axis' },
  grid: { left: 10, right: 10, top: 10, bottom: 0, containLabel: true },
  xAxis: { type: 'category', data: salesData.map((d) => d.month), axisLine: { show: false }, axisTick: { show: false }, axisLabel: { fontSize: 12, color: 'var(--muted-foreground)' } },
  yAxis: { type: 'value', axisLine: { show: false }, axisTick: { show: false }, axisLabel: { fontSize: 12, color: 'var(--muted-foreground)', formatter: (v: number) => `$${v.toLocaleString()}` }, splitLine: { lineStyle: { color: 'var(--muted)', type: 'dashed' } } },
  series: [
    {
      name: 'Target', type: 'line', stackId: '1', data: salesData.map((d) => d.target),
      lineStyle: { width: 1, color: 'var(--primary)', type: 'dashed' }, itemStyle: { color: 'var(--primary)' }, symbol: 'none',
      areaStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: 'var(--primary)', opacity: 0.2 }, { offset: 1, color: 'var(--primary)', opacity: 0 }] } },
    },
    {
      name: 'Sales', type: 'line', stackId: '2', data: salesData.map((d) => d.sales),
      lineStyle: { width: 1, color: 'var(--primary)' }, itemStyle: { color: 'var(--primary)' }, symbol: 'none',
      areaStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: 'var(--primary)', opacity: 0.4 }, { offset: 1, color: 'var(--primary)', opacity: 0.05 }] } },
    },
  ],
}))

// ---------- Revenue breakdown ----------
const revenueData = [
  { category: 'subscriptions', label: 'Subscriptions', value: 45, amount: 24500, color: 'var(--chart-1)' },
  { category: 'sales', label: 'One-time Sales', value: 30, amount: 16300, color: 'var(--chart-2)' },
  { category: 'services', label: 'Services', value: 15, amount: 8150, color: 'var(--chart-3)' },
  { category: 'partnerships', label: 'Partnerships', value: 10, amount: 5430, color: 'var(--chart-4)' },
]
const activeCategory = ref('sales')
const activeIndex = computed(() => revenueData.findIndex((item) => item.category === activeCategory.value))
const activeAmount = computed(() => revenueData[activeIndex.value]?.amount ?? 0)
const revenueOption = computed(() => ({
  animation: false,
  tooltip: { trigger: 'item' },
  series: [
    {
      type: 'pie',
      radius: ['55%', '80%'],
      center: ['50%', '50%'],
      avoidLabelOverlap: false,
      itemStyle: { borderRadius: 4, borderColor: 'var(--background)', borderWidth: 2 },
      label: { show: false, position: 'center' },
      emphasis: { label: { show: true, fontSize: 22, fontWeight: 'bold' } },
      labelLine: { show: false },
      data: revenueData.map((d) => ({ name: d.label, value: d.value, itemStyle: { color: d.color } })),
    },
  ],
  graphic: [
    { type: 'text', left: 'center', top: '42%', style: { text: `$${activeAmount.value.toLocaleString()}`, fontSize: 22, fontWeight: 700, fill: 'var(--foreground)', textAlign: 'center' } },
    { type: 'text', left: 'center', top: '54%', style: { text: 'Total Revenue', fontSize: 12, fill: 'var(--muted-foreground)', textAlign: 'center' } },
  ],
}))

// ---------- Recent transactions ----------
const transactions = [
  { id: 'TXN-001', name: 'Olivia Martin', email: 'olivia.martin@email.com', avatar: 'https://notion-avatars.netlify.app/api/avatar/?preset=female-', amount: '$1,999.00', status: 'completed', date: '2 hours ago' },
  { id: 'TXN-002', name: 'Jackson Lee', email: 'jackson.lee@email.com', avatar: 'https://notion-avatars.netlify.app/api/avatar/?preset=male-1', amount: '$2,999.00', status: 'pending', date: '5 hours ago' },
  { id: 'TXN-003', name: 'Isabella Nguyen', email: 'isabella.nguyen@email.com', avatar: 'https://notion-avatars.netlify.app/api/avatar/?preset=female-2', amount: '$39.00', status: 'completed', date: '1 day ago' },
  { id: 'TXN-004', name: 'William Kim', email: 'will@email.com', avatar: 'https://notion-avatars.netlify.app/api/avatar/?preset=male-5', amount: '$299.00', status: 'failed', date: '2 days ago' },
  { id: 'TXN-005', name: 'Sofia Davis', email: 'sofia.davis@email.com', avatar: 'https://notion-avatars.netlify.app/api/avatar/?preset=female-4', amount: '$99.00', status: 'completed', date: '3 days ago' },
]
const statusVariant = (s: string) => (s === 'completed' ? 'default' : s === 'pending' ? 'secondary' : 'destructive')

// ---------- Top products ----------
const products = [
  { id: 1, name: 'Premium Dashboard', sales: 2847, revenue: '$142,350', growth: '+23%', rating: 4.8, stock: 145, category: 'Software' },
  { id: 2, name: 'Analytics Pro', sales: 1923, revenue: '$96,150', growth: '+18%', rating: 4.6, stock: 67, category: 'Tools' },
  { id: 3, name: 'Mobile App Suite', sales: 1456, revenue: '$72,800', growth: '+12%', rating: 4.9, stock: 234, category: 'Mobile' },
  { id: 4, name: 'Enterprise License', sales: 892, revenue: '$178,400', growth: '+8%', rating: 4.7, stock: 12, category: 'Enterprise' },
  { id: 5, name: 'Basic Subscription', sales: 3421, revenue: '$68,420', growth: '+31%', rating: 4.4, stock: 999, category: 'Subscription' },
]
const maxSales = Math.max(...products.map((p) => p.sales))

// ---------- Customer insights ----------
const customerGrowthData = [
  { month: 'Jan', new: 245, returning: 890, churn: 45 },
  { month: 'Feb', new: 312, returning: 934, churn: 52 },
  { month: 'Mar', new: 289, returning: 1023, churn: 38 },
  { month: 'Apr', new: 456, returning: 1156, churn: 61 },
  { month: 'May', new: 523, returning: 1298, churn: 47 },
  { month: 'Jun', new: 634, returning: 1445, churn: 55 },
]
const growthOption = computed(() => ({
  animation: false,
  tooltip: { trigger: 'axis' },
  grid: { left: 10, right: 10, top: 20, bottom: 20, containLabel: true },
  xAxis: { type: 'category', data: customerGrowthData.map((d) => d.month), axisLine: { lineStyle: { color: 'var(--border)' } }, axisTick: { lineStyle: { color: 'var(--border)' } }, axisLabel: { fontSize: 12 } },
  yAxis: { type: 'value', axisLine: { lineStyle: { color: 'var(--border)' } }, axisTick: { lineStyle: { color: 'var(--border)' } }, axisLabel: { fontSize: 12 } },
  series: [
    { name: 'New Customers', type: 'bar', data: customerGrowthData.map((d) => d.new), itemStyle: { color: 'var(--chart-1)', borderRadius: [2, 2, 0, 0] } },
    { name: 'Returning', type: 'bar', data: customerGrowthData.map((d) => d.returning), itemStyle: { color: 'var(--chart-2)', borderRadius: [2, 2, 0, 0] } },
    { name: 'Churned', type: 'bar', data: customerGrowthData.map((d) => d.churn), itemStyle: { color: 'var(--chart-3)', borderRadius: [2, 2, 0, 0] } },
  ],
}))

const keyMetrics = [
  { label: 'Total Customers', value: '15,847', change: '+12.5%', icon: Users, color: 'text-green-600' },
  { label: 'Retention Rate', value: '94.2%', change: '+1.8%', icon: Target, color: 'text-blue-600' },
  { label: 'Avg. Order Value', value: '$42.50', change: '+5.2%', icon: ShoppingCart, color: 'text-orange-600' },
  { label: 'Churn Rate', value: '3.1%', change: '-0.4%', icon: TrendingDown, color: 'text-red-600' },
]

const demographicsData = [
  { ageGroup: '18-24', customers: 2847, percentage: '18.0%', growth: '+15.2%', growthColor: 'text-green-600' },
  { ageGroup: '25-34', customers: 4521, percentage: '28.5%', growth: '+8.7%', growthColor: 'text-green-600' },
  { ageGroup: '35-44', customers: 3982, percentage: '25.1%', growth: '+3.4%', growthColor: 'text-blue-600' },
  { ageGroup: '45-54', customers: 2734, percentage: '17.2%', growth: '+1.2%', growthColor: 'text-orange-600' },
  { ageGroup: '55+', customers: 1763, percentage: '11.2%', growth: '-2.1%', growthColor: 'text-red-600' },
]
const regionsData = [
  { region: 'North America', customers: 6847, revenue: '$847,523', growth: '+12.3%', growthColor: 'text-green-600' },
  { region: 'Europe', customers: 4521, revenue: '$563,891', growth: '+9.7%', growthColor: 'text-green-600' },
  { region: 'Asia Pacific', customers: 2892, revenue: '$321,456', growth: '+18.4%', growthColor: 'text-blue-600' },
  { region: 'Latin America', customers: 1123, revenue: '$187,234', growth: '+15.8%', growthColor: 'text-green-600' },
  { region: 'Others', customers: 464, revenue: '$67,891', growth: '+5.2%', growthColor: 'text-orange-600' },
]
</script>

<template>
  <div class="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
    <div class="flex-1 space-y-6 px-6 pt-0">
      <div class="flex flex-col justify-between gap-4 md:flex-row md:items-center md:gap-6">
        <div class="flex flex-col gap-2">
          <h1 class="text-2xl font-bold tracking-tight">Business Dashboard</h1>
          <p class="text-muted-foreground">Monitor your business performance and key metrics in real-time</p>
        </div>
        <div class="flex items-center space-x-2">
          <Button class="cursor-pointer"><Plus class="mr-2 h-4 w-4" /> New Sale</Button>
          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <Button variant="outline" class="cursor-pointer"><Settings class="mr-2 h-4 w-4" /> Actions</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem class="cursor-pointer"><FileText class="mr-2 h-4 w-4" /> Generate Report</DropdownMenuItem>
              <DropdownMenuItem class="cursor-pointer"><Download class="mr-2 h-4 w-4" /> Export Data</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem class="cursor-pointer"><Settings class="mr-2 h-4 w-4" /> Dashboard Settings</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div class="@container/main space-y-6">
        <!-- Metrics -->
        <div class="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs grid gap-4 sm:grid-cols-2 @5xl:grid-cols-4">
          <Card v-for="metric in metrics" :key="metric.title" class="cursor-pointer">
            <CardHeader>
              <CardDescription>{{ metric.title }}</CardDescription>
              <CardTitle class="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">{{ metric.value }}</CardTitle>
              <CardAction>
                <Badge variant="outline">
                  <component :is="metric.trend === 'up' ? TrendingUp : TrendingDown" class="h-4 w-4" />
                  {{ metric.change }}
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter class="flex-col items-start gap-1.5 text-sm">
              <div class="line-clamp-1 flex gap-2 font-medium">{{ metric.footer }} <component :is="metric.trend === 'up' ? TrendingUp : TrendingDown" class="size-4" /></div>
              <div class="text-muted-foreground">{{ metric.subfooter }}</div>
            </CardFooter>
          </Card>
        </div>

        <!-- Charts -->
        <div class="grid grid-cols-1 gap-6 @5xl:grid-cols-2">
          <Card class="cursor-pointer">
            <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle>Sales Performance</CardTitle>
                <CardDescription>Monthly sales vs targets</CardDescription>
              </div>
              <div class="flex items-center space-x-2">
                <Select :model-value="salesRange" @update:model-value="salesRange = $event">
                  <SelectTrigger class="w-32 cursor-pointer"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3m" class="cursor-pointer">Last 3 months</SelectItem>
                    <SelectItem value="6m" class="cursor-pointer">Last 6 months</SelectItem>
                    <SelectItem value="12m" class="cursor-pointer">Last 12 months</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" class="cursor-pointer">Export</Button>
              </div>
            </CardHeader>
            <CardContent class="p-0 pt-6">
              <div class="px-6 pb-6">
                <div class="h-[350px] w-full">
                  <RechartsArea
                    :data="salesData"
                    x-key="month"
                    :series="[
                      { key: 'target', name: 'Target', color: 'var(--primary)', dash: '5 5', width: 1, topOpacity: 0.2, bottomOpacity: 0 },
                      { key: 'sales', name: 'Sales', color: 'var(--primary)', width: 1, topOpacity: 0.4, bottomOpacity: 0.05 },
                    ]"
                    :height="350"
                    show-y-axis
                    grid="dashed"
                    :y-formatter="(v: number) => `$${v.toLocaleString()}`"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card class="flex cursor-pointer flex-col">
            <CardHeader class="flex flex-col space-y-2 pb-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
              <div>
                <CardTitle>Revenue Breakdown</CardTitle>
                <CardDescription>Revenue distribution by source</CardDescription>
              </div>
              <div class="flex items-center space-x-2">
                <Select :model-value="activeCategory" @update:model-value="activeCategory = $event">
                  <SelectTrigger class="w-[175px] cursor-pointer rounded-lg" aria-label="Select a category"><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent align="end" class="rounded-lg">
                    <SelectItem v-for="d in revenueData" :key="d.category" :value="d.category" class="cursor-pointer">{{ d.label }}</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" class="cursor-pointer">Export</Button>
              </div>
            </CardHeader>
            <CardContent class="flex flex-1 justify-center">
              <div class="w-full max-w-[300px]">
                <RechartsPie
                  :data="revenueData.map((d) => ({ name: d.label, value: d.amount, color: d.color }))"
                  :height="300"
                  center-label="Revenue"
                  :center-value="`$${Math.round(activeAmount / 1000)}K`"
                />
              </div>
            </CardContent>
            <CardFooter class="flex-col gap-2 text-sm">
              <div class="flex w-full items-center gap-2 font-medium leading-none">
                <span class="text-muted-foreground">{{ revenueData[activeIndex]?.label }}</span>
                <ArrowUp class="text-green-500 h-4 w-4" />
              </div>
              <div class="text-muted-foreground leading-none">{{ revenueData[activeIndex]?.value }}% of revenue</div>
            </CardFooter>
          </Card>
        </div>

        <!-- Lists -->
        <div class="grid grid-cols-1 gap-6 @5xl:grid-cols-2">
          <Card class="cursor-pointer">
            <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-4">
              <div>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>Latest customer transactions</CardDescription>
              </div>
              <Button variant="outline" size="sm" class="cursor-pointer"><Eye class="mr-2 h-4 w-4" /> View All</Button>
            </CardHeader>
            <CardContent class="space-y-4">
              <div v-for="t in transactions" :key="t.id">
                <div class="flex gap-2 rounded-lg border p-3">
                  <Avatar class="h-8 w-8"><AvatarImage :src="t.avatar" :alt="t.name" /><AvatarFallback>{{ t.name.split(' ').map((n) => n[0]).join('') }}</AvatarFallback></Avatar>
                  <div class="flex flex-1 flex-wrap items-center justify-between gap-1">
                    <div class="flex items-center space-x-3">
                      <div class="min-w-0 flex-1">
                        <p class="truncate text-sm font-medium">{{ t.name }}</p>
                        <p class="text-muted-foreground truncate text-xs">{{ t.email }}</p>
                      </div>
                    </div>
                    <div class="flex items-center space-x-3">
                      <Badge :variant="statusVariant(t.status) as any" class="cursor-pointer">{{ t.status }}</Badge>
                      <div class="text-right">
                        <p class="text-sm font-medium">{{ t.amount }}</p>
                        <p class="text-muted-foreground text-xs">{{ t.date }}</p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger as-child>
                          <Button variant="ghost" size="sm" class="h-8 w-8 cursor-pointer p-0"><MoreHorizontal class="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem class="cursor-pointer">View Details</DropdownMenuItem>
                          <DropdownMenuItem class="cursor-pointer">Download Receipt</DropdownMenuItem>
                          <DropdownMenuItem class="cursor-pointer">Contact Customer</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card class="cursor-pointer">
            <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-4">
              <div>
                <CardTitle>Top Products</CardTitle>
                <CardDescription>Best performing products this month</CardDescription>
              </div>
              <Button variant="outline" size="sm" class="cursor-pointer"><Eye class="mr-2 h-4 w-4" /> View All</Button>
            </CardHeader>
            <CardContent class="space-y-4">
              <div v-for="(p, index) in products" :key="p.id" class="flex items-center gap-2 rounded-lg border p-3">
                <div class="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold">
                  #{{ index + 1 }}
                </div>
                <div class="flex flex-1 flex-wrap items-center justify-between space-x-3 gap-2">
                  <div class="">
                    <div class="flex items-center space-x-2">
                      <p class="truncate text-sm font-medium">{{ p.name }}</p>
                      <Badge variant="outline" class="text-xs">{{ p.category }}</Badge>
                    </div>
                    <div class="mt-1 flex items-center space-x-2">
                      <div class="flex items-center space-x-1">
                        <Star class="text-yellow-400 h-3 w-3 fill-yellow-400" />
                        <span class="text-muted-foreground text-xs">{{ p.rating }}</span>
                      </div>
                      <span class="text-muted-foreground text-xs">•</span>
                      <span class="text-muted-foreground text-xs">{{ p.sales }} sales</span>
                    </div>
                  </div>
                  <div class="space-y-1 text-right">
                    <div class="flex items-center space-x-2">
                      <p class="text-sm font-medium">{{ p.revenue }}</p>
                      <Badge variant="outline" class="border-green-200 text-green-600 cursor-pointer">
                        <TrendingUp class="mr-1 h-3 w-3" />
                        {{ p.growth }}
                      </Badge>
                    </div>
                    <div class="flex items-center space-x-2">
                      <span class="text-muted-foreground text-xs">Stock: {{ p.stock }}</span>
                      <Progress :value="p.stock > 100 ? 100 : (p.stock / 100) * 100" class="h-1 w-12" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <!-- Customer Insights -->
        <Card class="h-fit">
          <CardHeader>
            <CardTitle>Customer Insights</CardTitle>
            <CardDescription>Growth trends and demographics</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs :default-value="'growth'" class="w-full">
              <TabsList class="bg-muted/50 h-12 w-full grid-cols-3 rounded-lg p-1">
                <TabsTrigger value="growth" class="flex cursor-pointer items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"><TrendingUp class="h-4 w-4" /><span class="hidden sm:inline">Growth</span></TabsTrigger>
                <TabsTrigger value="demographics" class="flex cursor-pointer items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"><User class="h-4 w-4" /><span class="hidden sm:inline">Demographics</span></TabsTrigger>
                <TabsTrigger value="regions" class="flex cursor-pointer items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"><MapPin class="h-4 w-4" /><span class="hidden sm:inline">Regions</span></TabsTrigger>
              </TabsList>

              <TabsContent value="growth" class="mt-8 space-y-6">
                <div class="grid grid-cols-10 gap-6">
                  <div class="col-span-10 xl:col-span-7">
                    <h3 class="text-muted-foreground mb-6 text-sm font-medium">Customer Growth Trends</h3>
                    <div class="h-[375px] w-full">
                      <RechartsBar
                        :data="customerGrowthData"
                        x-key="month"
                        :bars="[
                          { key: 'new', name: 'New Customers', color: 'var(--chart-1)' },
                          { key: 'returning', name: 'Returning', color: 'var(--chart-2)' },
                          { key: 'churn', name: 'Churned', color: 'var(--chart-3)' },
                        ]"
                        :height="375"
                        :legend="false"
                      />
                    </div>
                  </div>
                  <div class="col-span-10 space-y-5 xl:col-span-3">
                    <h3 class="text-muted-foreground mb-6 text-sm font-medium">Key Metrics</h3>
                    <div class="grid grid-cols-3 gap-5">
                      <div class="rounded-lg border p-4 max-lg:col-span-3 xl:col-span-3">
                        <div class="mb-2 flex items-center gap-2">
                          <TrendingUp class="text-primary h-4 w-4" />
                          <span class="text-sm font-medium">Total Customers</span>
                        </div>
                        <div class="text-2xl font-bold">15,847</div>
                        <div class="text-green-600 mt-1 flex items-center gap-1 text-xs">
                          <ArrowUp class="h-3 w-3" /> +12.5% from last month
                        </div>
                      </div>
                      <div class="rounded-lg border p-4 max-lg:col-span-3 xl:col-span-3">
                        <div class="mb-2 flex items-center gap-2">
                          <Users class="text-muted-foreground h-4 w-4" />
                          <span class="text-sm font-medium">Retention Rate</span>
                        </div>
                        <div class="text-2xl font-bold">92.4%</div>
                        <div class="text-green-600 mt-1 flex items-center gap-1 text-xs">
                          <ArrowUp class="h-3 w-3" /> +2.1% improvement
                        </div>
                      </div>
                      <div class="rounded-lg border p-4 max-lg:col-span-3 xl:col-span-3">
                        <div class="mb-2 flex items-center gap-2">
                          <Target class="text-muted-foreground h-4 w-4" />
                          <span class="text-sm font-medium">Avg. LTV</span>
                        </div>
                        <div class="text-2xl font-bold">$2,847</div>
                        <div class="text-green-600 mt-1 flex items-center gap-1 text-xs">
                          <ArrowUp class="h-3 w-3" /> +8.3% growth
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="demographics" class="mt-8">
                <div class="rounded-lg border bg-card">
                  <Table>
                    <TableHeader>
                      <TableRow class="border-b">
                        <TableHead class="px-6 py-5 font-semibold">Age Group</TableHead>
                        <TableHead class="px-6 py-5 text-right font-semibold">Customers</TableHead>
                        <TableHead class="px-6 py-5 text-right font-semibold">Percentage</TableHead>
                        <TableHead class="px-6 py-5 text-right font-semibold">Growth</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow v-for="d in demographicsData" :key="d.ageGroup" class="hover:bg-muted/30 transition-colors">
                        <TableCell class="px-6 py-5 font-medium">{{ d.ageGroup }}</TableCell>
                        <TableCell class="px-6 py-5 text-right">{{ d.customers.toLocaleString() }}</TableCell>
                        <TableCell class="px-6 py-5 text-right">{{ d.percentage }}</TableCell>
                        <TableCell class="px-6 py-5 text-right"><span :class="d.growthColor" class="font-medium">{{ d.growth }}</span></TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
                <div class="flex items-center justify-end space-x-2 py-6">
                  <div class="text-muted-foreground hidden text-sm sm:block">0 of {{ demographicsData.length }} row(s) selected.</div>
                  <div class="space-x-2 space-y-2">
                    <Button variant="outline" size="sm" disabled>Previous</Button>
                    <Button variant="outline" size="sm" disabled>Next</Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="regions" class="mt-8">
                <div class="rounded-lg border bg-card">
                  <Table>
                    <TableHeader>
                      <TableRow class="border-b">
                        <TableHead class="px-6 py-5 font-semibold">Region</TableHead>
                        <TableHead class="px-6 py-5 text-right font-semibold">Customers</TableHead>
                        <TableHead class="px-6 py-5 text-right font-semibold">Revenue</TableHead>
                        <TableHead class="px-6 py-5 text-right font-semibold">Growth</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow v-for="d in regionsData" :key="d.region" class="hover:bg-muted/30 transition-colors">
                        <TableCell class="px-6 py-5 font-medium">{{ d.region }}</TableCell>
                        <TableCell class="px-6 py-5 text-right">{{ d.customers.toLocaleString() }}</TableCell>
                        <TableCell class="px-6 py-5 text-right">{{ d.revenue }}</TableCell>
                        <TableCell class="px-6 py-5 text-right"><span :class="d.growthColor" class="font-medium">{{ d.growth }}</span></TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
                <div class="flex items-center justify-end space-x-2 py-6">
                  <div class="text-muted-foreground hidden text-sm sm:block">0 of {{ regionsData.length }} row(s) selected.</div>
                  <div class="space-x-2 space-y-2">
                    <Button variant="outline" size="sm" disabled>Previous</Button>
                    <Button variant="outline" size="sm" disabled>Next</Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>
