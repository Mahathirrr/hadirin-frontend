<script setup lang="ts">
import { Bell, Clock, Download, Plus, Settings, Share, Users } from 'lucide-vue-next'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

const emit = defineEmits<{
  (e: 'newEvent'): void
  (e: 'newMeeting'): void
  (e: 'newReminder'): void
  (e: 'settings'): void
}>()

const quickStats = [
  { label: "Today's Events", value: '3', color: 'bg-blue-500' },
  { label: 'This Week', value: '12', color: 'bg-green-500' },
  { label: 'Pending', value: '2', color: 'bg-orange-500' },
]
</script>

<template>
  <div class="space-y-4">
    <!-- Quick Stats -->
    <Card>
      <CardHeader class="pb-3">
        <CardTitle class="text-sm font-medium">Overview</CardTitle>
      </CardHeader>
      <CardContent class="space-y-3">
        <div v-for="(stat, index) in quickStats" :key="index" class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div :class="`h-2 w-2 rounded-full ${stat.color}`" />
            <span class="text-muted-foreground text-sm">{{ stat.label }}</span>
          </div>
          <Badge variant="secondary">{{ stat.value }}</Badge>
        </div>
      </CardContent>
    </Card>

    <!-- Quick Actions -->
    <Card>
      <CardHeader class="pb-3">
        <CardTitle class="text-sm font-medium">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent class="space-y-2">
        <Button variant="outline" class="w-full cursor-pointer justify-start" @click="emit('newEvent')">
          <Plus class="mr-2 h-4 w-4" />
          New Event
        </Button>
        <Button variant="outline" class="w-full cursor-pointer justify-start" @click="emit('newMeeting')">
          <Users class="mr-2 h-4 w-4" />
          Schedule Meeting
        </Button>
        <Button variant="outline" class="w-full cursor-pointer justify-start" @click="emit('newReminder')">
          <Bell class="mr-2 h-4 w-4" />
          Set Reminder
        </Button>

        <Separator class="my-3" />

        <Button variant="ghost" size="sm" class="w-full cursor-pointer justify-start">
          <Share class="mr-2 h-4 w-4" />
          Share Calendar
        </Button>
        <Button variant="ghost" size="sm" class="w-full cursor-pointer justify-start">
          <Download class="mr-2 h-4 w-4" />
          Export
        </Button>
        <Button variant="ghost" size="sm" class="w-full cursor-pointer justify-start" @click="emit('settings')">
          <Settings class="mr-2 h-4 w-4" />
          Settings
        </Button>
      </CardContent>
    </Card>

    <!-- Upcoming Events -->
    <Card>
      <CardHeader class="pb-3">
        <CardTitle class="flex items-center gap-2 text-sm font-medium">
          <Clock class="h-4 w-4" />
          Next Up
        </CardTitle>
      </CardHeader>
      <CardContent class="space-y-3">
        <div class="space-y-2">
          <div class="flex items-start gap-3">
            <div class="bg-blue-500 mt-2 h-2 w-2 rounded-full" />
            <div class="min-w-0 flex-1">
              <p class="text-sm font-medium truncate">Team Standup</p>
              <p class="text-muted-foreground text-xs">9:00 AM • Conference Room A</p>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <div class="bg-purple-500 mt-2 h-2 w-2 rounded-full" />
            <div class="min-w-0 flex-1">
              <p class="text-sm font-medium truncate">Design Review</p>
              <p class="text-muted-foreground text-xs">2:00 PM • Virtual</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
