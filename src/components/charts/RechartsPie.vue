<script setup lang="ts">
// Pixel-faithful replica of recharts PieChart donut + shadcn ChartLegend.
import { computed } from 'vue'

interface Slice {
  name: string
  value: number
  color: string
}

interface Props {
  data: Slice[]
  height?: number
  centerLabel?: string
  centerValue?: string
  innerRadius?: number
  outerRadius?: number
  strokeWidth?: number
}

const props = withDefaults(defineProps<Props>(), {
  height: 300,
  innerRadius: 60,
  outerRadius: 145,
  strokeWidth: 5,
})

const total = computed(() => props.data.reduce((s, d) => s + d.value, 0) || 1)
const SIZE = 300
const cx = SIZE / 2
const cy = SIZE / 2

function polar(r: number, deg: number) {
  const rad = ((deg - 90) * Math.PI) / 180
  return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)]
}
function arcPath(i: number) {
  let angle = 0
  for (let k = 0; k < i; k++) angle += (props.data[k].value / total.value) * 360
  const sweep = (props.data[i].value / total.value) * 360
  const a0 = angle
  const a1 = angle + sweep
  const [x0, y0] = polar(props.outerRadius, a0)
  const [x1, y1] = polar(props.outerRadius, a1)
  const [x2, y2] = polar(props.innerRadius, a1)
  const [x3, y3] = polar(props.innerRadius, a0)
  const large = sweep > 180 ? 1 : 0
  return `M ${x0},${y0} A ${props.outerRadius},${props.outerRadius} 0 ${large} 1 ${x1},${y1} L ${x2},${y2} A ${props.innerRadius},${props.innerRadius} 0 ${large} 0 ${x3},${y3} Z`
}
</script>

<template>
  <div class="flex w-full flex-col items-center gap-4">
    <svg :viewBox="`0 0 ${SIZE} ${SIZE}`" class="w-full" role="img" :style="{ maxWidth: `${Math.min(height, SIZE)}px` }">
      <path
        v-for="(d, i) in data"
        :key="i"
        :d="arcPath(i)"
        :fill="d.color"
        stroke="var(--background)"
        :stroke-width="strokeWidth"
      />
      <text x="150" y="150" text-anchor="middle" dominant-baseline="central" class="fill-foreground" font-size="30" font-weight="700">
        {{ centerValue }}
      </text>
      <text x="150" y="174" text-anchor="middle" class="fill-muted-foreground" font-size="14">
        {{ centerLabel }}
      </text>
    </svg>

    <!-- shadcn ChartLegend replica -->
    <div class="flex flex-wrap items-center justify-center gap-4 pt-3">
      <div v-for="(d, i) in data" :key="i" class="flex items-center gap-1.5 text-xs">
        <div class="h-2 w-2 shrink-0 rounded-[2px]" :style="{ backgroundColor: d.color }" />
        <span>{{ d.name }}</span>
      </div>
    </div>
  </div>
</template>
