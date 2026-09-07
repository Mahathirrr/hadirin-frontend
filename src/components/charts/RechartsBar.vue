<script setup lang="ts">
// Recharts-style BarChart replica (grouped bars) + HTML tooltip + legend.
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

interface Bar {
  key: string
  name: string
  color: string
}

interface Props {
  data: Record<string, any>[]
  xKey: string
  bars: Bar[]
  height?: number
  yFormatter?: (v: number) => string
  legend?: boolean
  showYAxis?: boolean
  showGrid?: boolean
  minBarHeight?: number
  barRadius?: number | 'pill'
  zeroBarOpacity?: number
  xFormatter?: (v: any, i: number) => string
}

const props = withDefaults(defineProps<Props>(), {
  height: 375,
  legend: true,
  showYAxis: true,
  showGrid: true,
  minBarHeight: 0,
  barRadius: 2,
  zeroBarOpacity: 1,
})

const containerRef = ref<HTMLDivElement | null>(null)
const width = ref(600)
const hover = ref<{ x: number; index: number } | null>(null)
let ro: ResizeObserver | null = null

onMounted(() => {
  if (containerRef.value) {
    width.value = containerRef.value.clientWidth || 600
    ro = new ResizeObserver(() => {
      if (containerRef.value) width.value = containerRef.value.clientWidth || 600
    })
    ro.observe(containerRef.value)
  }
})
onBeforeUnmount(() => ro?.disconnect())

const left = computed(() => (props.showYAxis ? 32 : 8))
const right = 12
const top = 16
const bottom = 32

const maxV = computed(() => {
  let m = 0
  for (const b of props.bars) for (const d of props.data) m = Math.max(m, Number(d[b.key]) || 0)
  return m === 0 ? 100 : m
})
function tickStep(start: number, stop: number, count: number) {
  const step0 = Math.abs(stop - start) / Math.max(0, count)
  let step1 = Math.pow(10, Math.floor(Math.log10(step0)))
  const error = step0 / step1
  if (error >= Math.sqrt(50)) step1 *= 10
  else if (error >= Math.sqrt(10)) step1 *= 5
  else if (error >= Math.sqrt(2)) step1 *= 2
  return step1
}
const yTicks = computed(() => {
  const span = maxV.value
  const step = tickStep(0, span, 4)
  const top = Math.ceil(span / step) * step
  const out: number[] = []
  for (let v = Math.ceil(0 / step) * step; v <= top; v += step) out.push(v)
  return out
})
const yMax = computed(() => yTicks.value[yTicks.value.length - 1] || 1)
function yScale(v: number) {
  return top + (1 - v / yMax.value) * (props.height - top - bottom)
}
const groupW = () => Math.max(8, (width.value - left.value - right) / props.data.length)
function barWidth() {
  return Math.min(groupW() * 0.6, 32) * 0.85
}
function barMetrics(value: number) {
  const rawHeight = Math.max(0, yScale(0) - yScale(value))
  if (value <= 0 && props.minBarHeight > 0) {
    return {
      height: props.minBarHeight,
      y: yScale(0) - props.minBarHeight,
      opacity: props.zeroBarOpacity,
    }
  }
  return {
    height: rawHeight,
    y: yScale(value),
    opacity: 1,
  }
}
function barCornerRadius(width: number, height: number) {
  if (props.barRadius === 'pill') return Math.min(width / 2, height / 2)
  return props.barRadius
}
function barX(i: number, bi: number) {
  const n = props.bars.length
  const gw = groupW()
  const bw = barWidth()
  return left.value + i * gw + (gw - bw) / 2 + (bi - (n - 1) / 2) * (bw * 0.9)
}

function onMove(e: MouseEvent) {
  const rect = containerRef.value?.getBoundingClientRect()
  if (!rect || props.data.length === 0) return
  const x = e.clientX - rect.left
  let i = Math.floor((x - left.value) / groupW())
  i = Math.max(0, Math.min(props.data.length - 1, i))
  hover.value = { x: left.value + i * groupW() + groupW() / 2, index: i }
}
const label = (i: number) =>
  props.xFormatter ? props.xFormatter(props.data[i][props.xKey], i) : String(props.data[i][props.xKey])
</script>

<template>
  <div ref="containerRef" class="relative h-full w-full" @mousemove="onMove" @mouseleave="hover = null">
    <svg :width="width" :height="height" :viewBox="`0 0 ${width} ${height}`" role="img">
      <!-- grid -->
      <g v-if="showGrid" class="text-muted">
        <line
          v-for="(v, i) in yTicks"
          :key="i"
          :x1="left"
          :x2="width - right"
          :y1="yScale(v)"
          :y2="yScale(v)"
          stroke="currentColor"
          stroke-opacity="0.25"
          :stroke-dasharray="'3 3'"
        />
      </g>
      <!-- y labels -->
      <g v-if="showYAxis" class="fill-muted-foreground" font-size="12">
        <text v-for="(v, i) in yTicks" :key="`y${i}`" :x="left - 6" :y="yScale(v) + 4" text-anchor="end">
          {{ yFormatter ? yFormatter(v) : Math.round(v) }}
        </text>
      </g>
      <!-- x labels -->
      <g class="fill-muted-foreground" font-size="12">
        <text v-for="(d, i) in data" :key="`x${i}`" :x="left + i * groupW() + groupW() / 2" :y="height - 10" text-anchor="middle">
          {{ label(i) }}
        </text>
      </g>
      <!-- bars -->
      <template v-for="(b, bi) in bars" :key="b.key">
        <rect
          v-for="(d, i) in data"
          :key="`${b.key}-${i}`"
          :x="barX(i, bi)"
          :y="barMetrics(Number(d[b.key]) || 0).y"
          :width="barWidth()"
          :height="barMetrics(Number(d[b.key]) || 0).height"
          :fill="b.color"
          :fill-opacity="barMetrics(Number(d[b.key]) || 0).opacity"
          :rx="barCornerRadius(barWidth(), barMetrics(Number(d[b.key]) || 0).height)"
        />
      </template>
      <!-- hover indicator -->
      <line
        v-if="hover"
        :x1="hover.x"
        :x2="hover.x"
        :y1="top"
        :y2="height - bottom"
        stroke="var(--border)"
        stroke-width="1"
      />
    </svg>

    <div
      v-if="hover"
      class="bg-popover text-popover-foreground pointer-events-none absolute z-50 min-w-32 rounded-md border px-3 py-1.5 text-xs shadow-md"
      :style="{ left: `${Math.min(hover.x + 10, width - 150)}px`, top: '4px' }"
    >
      <div class="font-medium">{{ label(hover.index) }}</div>
      <div v-for="b in bars" :key="b.key" class="mt-1 flex items-center gap-2">
        <span class="inline-block size-2.5 shrink-0 rounded-full" :style="{ background: b.color }" />
        <span class="text-muted-foreground">{{ b.name }}</span>
        <span class="ml-auto font-medium tabular-nums">{{ data[hover.index][b.key] }}</span>
      </div>
    </div>

    <div v-if="legend" class="mt-2 flex flex-wrap items-center justify-center gap-4">
      <div v-for="b in bars" :key="b.key" class="flex items-center gap-1.5 text-xs text-muted-foreground">
        <span class="inline-block size-2.5 rounded-full" :style="{ background: b.color }" />
        {{ b.name }}
      </div>
    </div>
  </div>
</template>
