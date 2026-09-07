<script setup lang="ts">
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

import { computed, ref, watch } from 'vue'
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

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface Props {
  selectedDate?: Date
  events?: Array<{ date: Date; count: number }>
}

const props = withDefaults(defineProps<Props>(), {
  selectedDate: undefined,
  events: () => [],
})

const emit = defineEmits<{ (e: 'dateSelect', date: Date): void }>()

const viewDate = ref(props.selectedDate ? props.selectedDate : new Date())

watch(
  () => props.selectedDate,
  (d) => {
    if (d) viewDate.value = d
  },
)

const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

const calendarDays = computed(() => {
  const start = startOfMonth(viewDate.value)
  const end = endOfMonth(viewDate.value)
  const gridStart = new Date(start)
  gridStart.setDate(gridStart.getDate() - start.getDay())
  const gridEnd = new Date(end)
  gridEnd.setDate(gridEnd.getDate() + (6 - end.getDay()))
  return eachDayOfInterval({ start: gridStart, end: gridEnd })
})

const eventCountByDay = computed(() => {
  const map = new Map<string, number>()
  for (const e of props.events) {
    map.set(e.date.toDateString(), e.count)
  }
  return map
})

function hasEvents(day: Date): boolean {
  return (eventCountByDay.value.get(day.toDateString()) || 0) > 0
}

function handleSelect(day: Date) {
  emit('dateSelect', day)
}

function prevMonth() {
  viewDate.value = subMonths(viewDate.value, 1)
}

function nextMonth() {
  viewDate.value = addMonths(viewDate.value, 1)
}
</script>

<template>
  <div class="flex flex-col gap-1 p-3">
    <!-- Header / month navigation -->
    <div class="relative flex items-center justify-center pt-1">
      <div class="flex w-full items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          class="text-muted-foreground hover:text-foreground size-7 cursor-pointer p-0"
          @click="prevMonth"
        >
          <ChevronLeft class="size-4" />
        </Button>
        <div class="text-sm font-medium">{{ format(viewDate, 'MMMM yyyy') }}</div>
        <Button
          variant="ghost"
          size="icon"
          class="text-muted-foreground hover:text-foreground size-7 cursor-pointer p-0"
          @click="nextMonth"
        >
          <ChevronRight class="size-4" />
        </Button>
      </div>
    </div>

    <!-- Weekdays -->
    <div class="mb-1 grid grid-cols-7">
      <div
        v-for="d in weekDays"
        :key="d"
        class="text-muted-foreground text-center text-[0.8rem] font-normal select-none"
      >
        {{ d }}
      </div>
    </div>

    <!-- Days grid -->
    <div class="grid grid-cols-7">
      <button
        v-for="day in calendarDays"
        :key="day.toISOString()"
        type="button"
        :class="cn(
          'group/day relative aspect-square w-full cursor-pointer select-none rounded-md p-0 text-center text-sm transition-colors',
          'hover:bg-accent hover:text-accent-foreground',
          isSameMonth(day, viewDate) ? 'text-foreground' : 'text-muted-foreground opacity-50',
          isToday(day) && !isSameDay(day, props.selectedDate) && 'bg-accent text-accent-foreground',
          isSameDay(day, props.selectedDate) && 'bg-primary text-primary-foreground hover:bg-primary',
          hasEvents(day) && 'relative after:absolute after:right-1 after:bottom-1 after:h-1.5 after:w-1.5 after:rounded-full after:bg-primary',
          isSameDay(day, props.selectedDate) && hasEvents(day) && 'after:bg-primary-foreground',
        )"
        @click="handleSelect(day)"
      >
        {{ format(day, 'd') }}
      </button>
    </div>
  </div>
</template>
