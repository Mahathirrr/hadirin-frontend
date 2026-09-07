<script setup lang="ts">
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { computed, ref } from 'vue'

import { cn } from '@/lib/utils'

const props = defineProps<{ modelValue?: Date }>()
const emit = defineEmits<{ (e: 'update:modelValue', value: Date): void }>()

const viewDate = ref<Date>(new Date(props.modelValue ?? new Date()))

const weekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

const year = computed(() => viewDate.value.getFullYear())
const month = computed(() => viewDate.value.getMonth())

const monthLabel = computed(
  () => `${viewDate.value.toLocaleString('en-US', { month: 'long' })} ${year.value}`,
)

const days = computed(() => {
  const first = new Date(year.value, month.value, 1)
  const startOffset = first.getDay()
  const daysInMonth = new Date(year.value, month.value + 1, 0).getDate()
  const cells: (Date | null)[] = []
  for (let i = 0; i < startOffset; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year.value, month.value, d))
  return cells
})

function isSelected(date: Date) {
  if (!props.modelValue) return false
  return date.toDateString() === props.modelValue.toDateString()
}
function isToday(date: Date) {
  return date.toDateString() === new Date().toDateString()
}

function prevMonth() {
  viewDate.value = new Date(year.value, month.value - 1, 1)
}
function nextMonth() {
  viewDate.value = new Date(year.value, month.value + 1, 1)
}
function pick(date: Date) {
  emit('update:modelValue', date)
}
</script>

<template>
  <div class="w-fit p-3">
    <div class="flex items-center justify-center gap-1">
      <button
        type="button"
        class="cursor-pointer rounded-md p-2 opacity-50 transition-opacity hover:opacity-100"
        aria-label="Go to previous month"
        @click="prevMonth"
      >
        <ChevronLeft class="size-4" />
      </button>
      <div class="flex h-9 flex-1 items-center justify-center text-sm font-medium">
        {{ monthLabel }}
      </div>
      <button
        type="button"
        class="cursor-pointer rounded-md p-2 opacity-50 transition-opacity hover:opacity-100"
        aria-label="Go to next month"
        @click="nextMonth"
      >
        <ChevronRight class="size-4" />
      </button>
    </div>
    <div class="mt-2 grid grid-cols-7 gap-1">
      <div
        v-for="(day, i) in weekdays"
        :key="i"
        class="text-muted-foreground flex h-8 w-8 items-center justify-center rounded-md text-xs"
      >
        {{ day }}
      </div>
      <template v-for="(date, i) in days" :key="i">
        <div v-if="!date" class="h-8 w-8" />
        <button
          v-else
          type="button"
          class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-sm transition-colors"
          :class="cn(
            isSelected(date) && 'bg-primary text-primary-foreground',
            !isSelected(date) && isToday(date) && 'bg-accent text-accent-foreground',
            !isSelected(date) && !isToday(date) && 'hover:bg-accent hover:text-accent-foreground',
          )"
          @click="pick(date)"
        >
          {{ date.getDate() }}
        </button>
      </template>
    </div>
  </div>
</template>
