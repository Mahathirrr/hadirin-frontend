<script setup lang="ts">
import { Plus } from 'lucide-vue-next'

import DatePicker from './DatePicker.vue'
import Calendars from './Calendars.vue'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

interface Props {
  selectedDate?: Date
  events?: Array<{ date: Date; count: number }>
  className?: string
}

withDefaults(defineProps<Props>(), {
  selectedDate: undefined,
  events: () => [],
  className: '',
})

const emit = defineEmits<{
  (e: 'dateSelect', date: Date): void
  (e: 'newCalendar'): void
  (e: 'newEvent'): void
}>()
</script>

<template>
  <div :class="cn('bg-background flex h-full flex-col rounded-lg', className)">
    <!-- Add New Event Button -->
    <div class="border-b p-6">
      <Button class="w-full cursor-pointer" @click="emit('newEvent')">
        <Plus class="mr-2 h-4 w-4" />
        Add New Event
      </Button>
    </div>

    <!-- Date Picker -->
    <DatePicker
      :selected-date="selectedDate"
      :events="events"
      @date-select="(d: Date) => emit('dateSelect', d)"
    />

    <Separator />

    <!-- Calendars -->
    <div class="flex-1 p-4">
      <Calendars
        @calendar-toggle="(id: string, visible: boolean) => console.log(`Calendar ${id} visibility: ${visible}`)"
        @calendar-edit="(id: string) => console.log(`Edit calendar: ${id}`)"
        @calendar-delete="(id: string) => console.log(`Delete calendar: ${id}`)"
        @new-calendar="emit('newCalendar')"
      />
    </div>

    <!-- Footer -->
    <div class="border-t p-4">
      <Button
        variant="outline"
        class="w-full cursor-pointer justify-start"
        @click="emit('newCalendar')"
      >
        <Plus class="mr-2 h-4 w-4" />
        New Calendar
      </Button>
    </div>
  </div>
</template>
