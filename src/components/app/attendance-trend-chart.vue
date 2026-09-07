<script setup lang="ts">
import { computed } from 'vue'

import RechartsBar from '@/components/charts/RechartsBar.vue'

interface DayPoint {
  label: string
  rate: number
}

const props = withDefaults(defineProps<{
  data?: DayPoint[]
  averageRate?: number
}>(), {
  averageRate: 0,
})

const dayMap = ['MIN', 'SEN', 'SEL', 'RAB', 'KAM', 'JUM', 'SAB']

const chartData = computed(() => {
  if (props.data?.length) {
    return props.data.map((day) => ({ day: day.label, rate: day.rate }))
  }

  const points: Array<{ day: string; rate: number }> = []
  for (let i = 6; i >= 0; i -= 1) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    points.push({ day: dayMap[date.getDay()], rate: 0 })
  }
  return points
})
</script>

<template>
  <div class="relative h-44 w-full pr-12">
    <RechartsBar
      :data="chartData"
      x-key="day"
      :bars="[{ key: 'rate', name: 'Rasio kehadiran', color: 'var(--foreground)' }]"
      :height="176"
      :legend="false"
      :show-y-axis="false"
      :min-bar-height="8"
      bar-radius="pill"
      :zero-bar-opacity="0.2"
    />
    <span class="absolute top-1/2 right-0 -translate-y-1/2 rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
      {{ averageRate }}%
    </span>
  </div>
</template>
