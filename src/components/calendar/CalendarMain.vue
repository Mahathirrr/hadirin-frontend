<script setup lang="ts">
import {
  Calendar as CalendarIcon,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Grid3X3,
  List,
  MapPin,
  Menu,
  MoreHorizontal,
  Search,
  Users,
} from 'lucide-vue-next'
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  subMonths,
} from 'date-fns'
import { computed, ref, useAttrs } from 'vue'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

import eventsData from './data/events.json'
import { type CalendarEvent } from './types'

interface Props {
  selectedDate?: Date
  events?: CalendarEvent[]
}

const props = withDefaults(defineProps<Props>(), {
  selectedDate: undefined,
  events: undefined,
})

const emit = defineEmits<{
  (e: 'dateSelect', date: Date): void
  (e: 'menuClick'): void
  (e: 'eventClick', event: CalendarEvent): void
}>()

// Convert JSON events to CalendarEvent objects, fallback to imported data
const sampleEvents: CalendarEvent[] =
  props.events ||
  (eventsData as unknown as Array<{ date: string; type: string }>).map((event) => ({
    ...event,
    date: new Date(event.date),
    type: event.type as CalendarEvent['type'],
  }))

const currentDate = ref(props.selectedDate ? props.selectedDate : new Date())
const viewMode = ref<'month' | 'list'>('month')
const showEventDialog = ref(false)
const selectedEvent = ref<CalendarEvent | null>(null)

const monthStart = computed(() => startOfMonth(currentDate.value))
const monthEnd = computed(() => endOfMonth(currentDate.value))
const calendarStart = computed(() => {
  const d = new Date(monthStart.value)
  d.setDate(d.getDate() - monthStart.value.getDay())
  return d
})
const calendarEnd = computed(() => {
  const d = new Date(monthEnd.value)
  d.setDate(d.getDate() + (6 - monthEnd.value.getDay()))
  return d
})
const calendarDays = computed(() =>
  eachDayOfInterval({ start: calendarStart.value, end: calendarEnd.value }),
)

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function getEventsForDay(date: Date): CalendarEvent[] {
  return sampleEvents.filter((event) => isSameDay(event.date, date))
}

function navigateMonth(direction: 'prev' | 'next') {
  currentDate.value =
    direction === 'prev' ? subMonths(currentDate.value, 1) : addMonths(currentDate.value, 1)
}

function goToToday() {
  currentDate.value = new Date()
}

function handleEventClick(event: CalendarEvent) {
  // If the parent provides an event-click handler (e.g. opens the EventForm),
  // do NOT open the local detail dialog (matches the React reference).
  if (attrs.onEventClick) {
    emit('eventClick', event)
    return
  }
  selectedEvent.value = event
  showEventDialog.value = true
}

const attrs = useAttrs()

const upcomingEvents = computed(() =>
  sampleEvents
    .filter((event) => event.date >= new Date())
    .sort((a, b) => a.date.getTime() - b.date.getTime()),
)

function viewFromValue(v: string): 'month' | 'list' {
  return v === 'list' ? 'list' : 'month'
}
</script>

<template>
  <div class="flex h-full flex-col">
    <!-- Header -->
    <div
      class="flex flex-col flex-wrap gap-4 border-b p-6 md:flex-row md:items-center md:justify-between"
    >
      <div class="flex flex-wrap items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          class="xl:hidden cursor-pointer"
          @click="emit('menuClick')"
        >
          <Menu class="h-4 w-4" />
        </Button>

        <div class="flex items-center gap-2">
          <Button variant="outline" size="sm" class="cursor-pointer" @click="navigateMonth('prev')">
            <ChevronLeft class="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" class="cursor-pointer" @click="navigateMonth('next')">
            <ChevronRight class="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" class="cursor-pointer" @click="goToToday">
            Today
          </Button>
        </div>

        <h1 class="text-2xl font-semibold">{{ format(currentDate, 'MMMM yyyy') }}</h1>
      </div>

      <div class="flex flex-col gap-3 md:flex-row md:items-center">
        <div class="relative">
          <Search
            class="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2"
          />
          <Input placeholder="Search events..." class="w-64 pl-10" />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <Button variant="outline" class="cursor-pointer">
              <Grid3X3 v-if="viewMode === 'month'" class="mr-2 h-4 w-4" />
              <List v-if="viewMode === 'list'" class="mr-2 h-4 w-4" />
              {{ viewMode.charAt(0).toUpperCase() + viewMode.slice(1) }}
              <ChevronDown class="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem class="cursor-pointer" @select="viewMode = 'month'">
              <Grid3X3 class="mr-2 h-4 w-4" />
              Month
            </DropdownMenuItem>
            <DropdownMenuItem class="cursor-pointer" @select="viewMode = 'list'">
              <List class="mr-2 h-4 w-4" />
              List
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>

    <!-- Calendar Month Grid -->
    <div v-if="viewMode === 'month'" class="bg-background flex-1">
      <div class="grid grid-cols-7 border-b">
        <div
          v-for="day in weekDays"
          :key="day"
          class="text-muted-foreground border-r p-4 text-center text-sm font-medium last:border-r-0"
        >
          {{ day }}
        </div>
      </div>
      <div class="grid flex-1 grid-cols-7">
        <div
          v-for="day in calendarDays"
          :key="day.toISOString()"
          :class="cn(
            'hover:bg-accent/50 min-h-[120px] cursor-pointer border-r border-b p-2 transition-colors last:border-r-0',
            isSameMonth(day, currentDate) ? 'bg-background' : 'text-muted-foreground bg-muted/30',
            props.selectedDate && isSameDay(day, props.selectedDate) && 'ring-primary ring-2 ring-inset',
            isToday(day) && 'bg-accent/20',
          )"
          @click="emit('dateSelect', day)"
        >
          <div class="mb-1 flex items-center justify-between">
            <span
              :class="cn(
                'text-sm font-medium',
                isToday(day) && 'bg-primary text-primary-foreground flex h-6 w-6 items-center justify-center rounded-md text-xs',
              )"
            >
              {{ format(day, 'd') }}
            </span>
            <span v-if="getEventsForDay(day).length > 2" class="text-xs text-muted-foreground">
              +{{ getEventsForDay(day).length - 2 }}
            </span>
          </div>

          <div class="space-y-1">
            <div
              v-for="event in getEventsForDay(day).slice(0, 2)"
              :key="event.id"
              :class="cn('text-white cursor-pointer truncate rounded-sm p-1 text-xs', event.color)"
              @click.stop="handleEventClick(event)"
            >
              <div class="flex items-center gap-1">
                <Clock class="h-3 w-3" />
                <span class="truncate">{{ event.title }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- List View -->
    <div v-else class="flex-1 p-6">
      <div class="space-y-4">
        <Card
          v-for="event in upcomingEvents"
          :key="event.id"
          class="hover:shadow-md cursor-pointer transition-shadow"
          @click="handleEventClick(event)"
        >
          <CardContent class="px-4">
            <div class="flex items-start justify-between">
              <div class="flex items-start gap-3">
                <div :class="cn('mt-1.5 h-3 w-3 rounded-full', event.color)" />
                <div class="flex-1">
                  <h3 class="font-medium">{{ event.title }}</h3>
                  <div class="text-muted-foreground mt-2 flex flex-wrap items-center gap-4 text-sm">
                    <div class="flex flex-wrap items-center gap-1">
                      <CalendarIcon class="h-4 w-4" />
                      {{ format(event.date, 'MMM d, yyyy') }}
                    </div>
                    <div class="flex flex-wrap items-center gap-1">
                      <Clock class="h-4 w-4" />
                      {{ event.time }}
                    </div>
                    <div class="flex flex-wrap items-center gap-1">
                      <MapPin class="h-4 w-4" />
                      {{ event.location }}
                    </div>
                  </div>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <div class="flex -space-x-2">
                  <Avatar
                    v-for="(attendee, index) in event.attendees.slice(0, 3)"
                    :key="index"
                    class="border-background border-2"
                  >
                    <AvatarFallback class="text-xs">{{ attendee }}</AvatarFallback>
                  </Avatar>
                </div>
                <Button variant="ghost" size="sm" class="cursor-pointer">
                  <MoreHorizontal class="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>

    <!-- Event Detail Dialog -->
    <Dialog :open="showEventDialog" @update:open="(v: boolean) => (showEventDialog = v)">
      <DialogContent class="max-w-md">
        <DialogHeader>
          <DialogTitle>{{ selectedEvent?.title || 'Event Details' }}</DialogTitle>
          <DialogDescription>View and manage this calendar event</DialogDescription>
        </DialogHeader>
        <div v-if="selectedEvent" class="space-y-4">
          <div class="flex items-center gap-2">
            <CalendarIcon class="text-muted-foreground h-4 w-4" />
            <span>{{ format(selectedEvent.date, 'EEEE, MMMM d, yyyy') }}</span>
          </div>
          <div class="flex items-center gap-2">
            <Clock class="text-muted-foreground h-4 w-4" />
            <span>{{ selectedEvent.time }} ({{ selectedEvent.duration }})</span>
          </div>
          <div class="flex items-center gap-2">
            <MapPin class="text-muted-foreground h-4 w-4" />
            <span>{{ selectedEvent.location }}</span>
          </div>
          <div class="flex items-center gap-2">
            <Users class="text-muted-foreground h-4 w-4" />
            <div class="flex items-center gap-2">
              <span>Attendees:</span>
              <div class="flex -space-x-2">
                <Avatar
                  v-for="(attendee, index) in selectedEvent.attendees"
                  :key="index"
                  class="border-background h-6 w-6 border-2"
                >
                  <AvatarFallback class="text-xs">{{ attendee }}</AvatarFallback>
                </Avatar>
              </div>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <Badge variant="secondary" :class="cn('text-white', selectedEvent.color)">
              {{ selectedEvent.type }}
            </Badge>
          </div>
          <div class="flex gap-2 pt-4">
            <Button variant="outline" class="flex-1 cursor-pointer" @click="showEventDialog = false">
              Edit
            </Button>
            <Button
              variant="destructive"
              class="flex-1 cursor-pointer"
              @click="showEventDialog = false"
            >
              Delete
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  </div>
</template>
