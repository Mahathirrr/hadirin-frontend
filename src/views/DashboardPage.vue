<script setup lang="ts">
import { ArrowUpRight, LayoutDashboard } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

const stats = [
  { label: 'Total Revenue', value: '$45,231.89', change: '+20.1%' },
  { label: 'Active Users', value: '2,350', change: '+180.1%' },
  { label: 'New Deals', value: '1,204', change: '+19%' },
  { label: 'Conversion Rate', value: '3.2%', change: '-1.4%' },
]
</script>

<template>
  <div className="min-h-screen bg-background">
    <header className="flex h-16 items-center justify-between border-b px-6">
      <div className="flex items-center gap-2">
        <LayoutDashboard className="h-5 w-5" />
        <span className="text-lg font-bold tracking-tight">Dashboard</span>
      </div>
      <div className="flex items-center gap-3">
        <Badge variant="secondary">Vue 3 + TypeScript</Badge>
        <Button variant="outline" size="sm" as-child>
          <RouterLink to="/landing">View Landing</RouterLink>
        </Button>
      </div>
    </header>

    <main className="container mx-auto max-w-6xl space-y-6 px-6 py-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
        <p className="text-muted-foreground text-sm">
          Here's what's happening with your projects today.
        </p>
      </div>

      <Separator />

      <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card v-for="stat in stats" :key="stat.label">
          <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle class="text-sm font-medium">{{ stat.label }}</CardTitle>
            <ArrowUpRight class="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-bold">{{ stat.value }}</div>
            <p class="text-muted-foreground text-xs">{{ stat.change }} from last month</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Overview</CardTitle>
        </CardHeader>
        <CardContent class="pb-8">
          <div class="flex h-40 items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground">
            Chart coming soon — this shell is ready for the full dashboard port.
          </div>
        </CardContent>
      </Card>
    </main>
  </div>
</template>
