<script setup lang="ts">
import { computed } from 'vue'
import { use } from 'echarts/core'
import { LineChart } from 'echarts/charts'
import { GridComponent, TooltipComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import VChart from 'vue-echarts'

use([CanvasRenderer, LineChart, GridComponent, TooltipComponent])

interface DayPoint {
  label: string
  rate: number
}

const props = withDefaults(defineProps<{
  data?: DayPoint[]
  averageRate?: number
}>(), {
  data: () => [],
  averageRate: 0,
})

const dayMap = ['MIN', 'SEN', 'SEL', 'RAB', 'KAM', 'JUM', 'SAB']

const chartPoints = computed(() => {
  if (props.data?.length) {
    return props.data.map((day) => ({ label: day.label, rate: Math.max(0, Math.min(100, day.rate)) }))
  }
  const points: Array<{ label: string; rate: number }> = []
  for (let i = 6; i >= 0; i -= 1) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    points.push({ label: dayMap[date.getDay()], rate: 0 })
  }
  return points
})

const chartOption = computed(() => {
  const labels = chartPoints.value.map((p) => p.label)
  const values = chartPoints.value.map((p) => p.rate)

  return {
    animationDuration: 400,
    grid: {
      left: 4,
      right: 8,
      top: 12,
      bottom: 4,
      containLabel: true,
    },
    tooltip: {
      trigger: 'axis',
      confine: true,
      appendToBody: false,
      backgroundColor: 'hsl(var(--popover))',
      borderColor: 'hsl(var(--border))',
      textStyle: {
        color: 'hsl(var(--popover-foreground))',
        fontSize: 12,
      },
      axisPointer: {
        type: 'line',
        lineStyle: { color: 'hsl(var(--border))', width: 1 },
      },
      valueFormatter: (value: number) => `${value}%`,
    },
    xAxis: {
      type: 'category',
      data: labels,
      boundaryGap: false,
      axisLine: { lineStyle: { color: 'hsl(var(--border))' } },
      axisTick: { show: false },
      axisLabel: {
        color: 'hsl(var(--muted-foreground))',
        fontSize: 11,
        interval: 0,
      },
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 100,
      splitNumber: 4,
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: {
        lineStyle: { color: 'hsl(var(--border))', opacity: 0.35, type: 'dashed' },
      },
      axisLabel: {
        color: 'hsl(var(--muted-foreground))',
        fontSize: 11,
        formatter: '{value}%',
      },
    },
    series: [
      {
        name: 'Rasio kehadiran',
        type: 'line',
        smooth: 0.35,
        symbol: 'circle',
        symbolSize: 7,
        showSymbol: true,
        connectNulls: true,
        lineStyle: {
          width: 2,
          color: 'hsl(var(--foreground))',
        },
        itemStyle: {
          color: 'hsl(var(--foreground))',
          borderColor: 'hsl(var(--background))',
          borderWidth: 2,
        },
        areaStyle: {
          color: 'hsl(var(--foreground))',
          opacity: 0.08,
        },
        data: values,
      },
    ],
  }
})
</script>

<template>
  <div class="h-52 w-full min-w-0">
    <VChart :option="chartOption" autoresize class="h-full w-full" />
  </div>
</template>
