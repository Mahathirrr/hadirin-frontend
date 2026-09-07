<script setup lang="ts">
import CalendarSidebar from './CalendarSidebar.vue'
import CalendarMain from './CalendarMain.vue'
import EventForm from './EventForm.vue'
import { useCalendar } from './useCalendar'

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'

import { type CalendarEvent } from './types'

interface Props {
  events: CalendarEvent[]
  eventDates: Array<{ date: Date; count: number }>
}

const props = defineProps<Props>()

const calendar = useCalendar(props.events)
</script>

<template>
  <div class="bg-background relative rounded-lg border">
      <div class="flex min-h-[800px]">
        <!-- Desktop Sidebar -->
        <div class="hidden w-80 flex-shrink-0 border-r xl:block">
          <CalendarSidebar
            :selected-date="calendar.selectedDate.value"
            :events="eventDates"
            class="h-full"
            @date-select="calendar.handleDateSelect"
            @new-calendar="calendar.handleNewCalendar"
            @new-event="calendar.handleNewEvent"
          />
        </div>

        <!-- Main Calendar Panel -->
        <div class="min-w-0 flex-1">
          <CalendarMain
            :selected-date="calendar.selectedDate.value"
            :events="calendar.events.value"
            @date-select="calendar.handleDateSelect"
            @menu-click="calendar.setShowCalendarSheet(true)"
            @event-click="calendar.handleEditEvent"
          />
        </div>
      </div>

      <!-- Mobile/Tablet Sheet -->
      <Sheet :open="calendar.showCalendarSheet.value" @update:open="calendar.setShowCalendarSheet">
        <SheetContent side="left" class="w-80 p-0" :style="{ position: 'absolute' }">
          <SheetHeader class="p-4 pb-2">
            <SheetTitle>Calendar</SheetTitle>
            <SheetDescription>Browse dates and manage your calendar events</SheetDescription>
          </SheetHeader>
          <CalendarSidebar
            :selected-date="calendar.selectedDate.value"
            :events="eventDates"
            class="h-full"
            @date-select="calendar.handleDateSelect"
            @new-calendar="calendar.handleNewCalendar"
            @new-event="calendar.handleNewEvent"
          />
        </SheetContent>
      </Sheet>
    </div>

    <!-- Event Form Dialog -->
    <EventForm
      :event="calendar.editingEvent.value"
      :open="calendar.showEventForm.value"
      @update:open="calendar.setShowEventForm"
      @save="calendar.handleSaveEvent"
      @delete="calendar.handleDeleteEvent"
    />
</template>
