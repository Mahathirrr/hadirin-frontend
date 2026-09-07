<script setup lang="ts">
// Pixel-faithful replica of recharts AreaChart + shadcn ChartContainer/ChartTooltipContent.
// Matches recharts defaults: margin {top:5,right:5,bottom:5,left:5}, XAxis height ~30,
// YAxis nice ticks, solid border/50 grid (or dashed per prop), 2px smooth areas.
import { onBeforeUnmount, onMounted, ref } from 'vue'

interface Series {
  key: string
  name: string
  color: string
  dash?: string
  width?: number
  topOpacity?: number
  bottomOpacity?: number
}

interface Props {
  data: Record<string, any>[]
  xKey: string
  series: Series[]
  height?: number
  xFormatter?: (value: any, index: number) => string
  yFormatter?: (value: number) => string
  showYAxis?: boolean
  grid?: 'solid' | 'dashed'
  yTickCount?: number
  minTickGap?: number
}

const props = withDefaults(defineProps<Props>(), {
  height: 250,
  showYAxis: false,
  grid: 'solid',
  yTickCount: 5,
  minTickGap: 32,
})

const containerRef = ref<HTMLDivElement | null>(null)
const width = ref(600)
const hover = ref<{ x: number; y: number; index: number } | null>(null)
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

// recharts geometry
const M = { top: 5, right: 5, bottom: 5, left: 5 }
const axisH = 30 // XAxis default height (labels + ticks)
const plotTop = () => M.top
const plotBottom = () => props.height - M.bottom - axisH
const plotLeft = () => (props.showYAxis ? 42 : M.left)
const plotRight = () => M.right

function yMax() {
  let m = 0
  for (const s of props.series) for (const d of props.data) m = Math.max(m, Number(d[s.key]) || 0)
  return m === 0 ? 1 : m
}
function tickStep(start: number, stop: number, count: number) {
  const step0 = Math.abs(stop - start) / Math.max(0, count)
  let step1 = Math.pow(10, Math.floor(Math.log10(step0)))
  const error = step0 / step1
  if (error >= Math.sqrt(50)) step1 *= 10
  else if (error >= Math.sqrt(10)) step1 *= 5
  else if (error >= Math.sqrt(2)) step1 *= 2
  return step1
}
function d3Ticks(start: number, stop: number, count: number) {
  const step = tickStep(start, stop, count)
  const top = Math.ceil(stop / step) * step
  const out: number[] = []
  for (let v = Math.ceil(start / step) * step; v <= top; v += step) out.push(v)
  return out
}
const ticks = (() => {
  let cache: number[] = []
  return () => {
    const t = d3Ticks(0, yMax(), props.yTickCount)
    if (t.length !== cache.length || (cache.length && t[t.length - 1] !== cache[cache.length - 1])) cache = t
    return t
  }
})()
function yScale(v: number) {
  const max = ticks()[ticks().length - 1]
  return plotTop() + (1 - v / max) * (plotBottom() - plotTop())
}
function xScale(i: number) {
  const n = props.data.length
  if (n <= 1) return plotLeft() + (plotRightTo() - plotLeft()) / 2
  return plotLeft() + (i / (n - 1)) * (plotRightTo() - plotLeft())
}
const plotRightTo = () => width.value - plotRight()

function linePath(s: Series) {
  const pts = props.data.map((d, i) => ({ x: xScale(i), y: yScale(Number(d[s.key]) || 0) }))
  if (pts.length === 0) return ''
  if (pts.length === 1) return `M ${pts[0].x},${pts[0].y} L ${pts[0].x + 1},${pts[0].y}`
  let d = `M ${pts[0].x},${pts[0].y}`
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i]
    const p1 = pts[i + 1]
    const c1x = p0.x + (p1.x - p0.x) / 2
    d += ` C ${c1x},${p0.y} ${c1x},${p1.y} ${p1.x},${p1.y}`
  }
  return d
}
function areaPath(s: Series) {
  const base = yScale(0)
  const firstX = xScale(0)
  const lastX = xScale(props.data.length - 1)
  return `${linePath(s)} L ${lastX},${base} L ${firstX},${base} Z`
}

function xTickIndices() {
  const n = props.data.length
  if (n <= 1) return [0]
  const usable = plotRightTo() - plotLeft()
  // ~1 label per 120px -> sparse, readable, close to reference spacing
  const target = Math.max(3, Math.floor(usable / 120))
  const step = Math.max(1, Math.round((n - 1) / target))
  const idx: number[] = []
  for (let i = 0; i < n; i += step) idx.push(i)
  if (idx[idx.length - 1] !== n - 1) idx.push(n - 1)
  return idx
}

const gid = () => `chart-${props.xKey}`
function onMove(e: MouseEvent) {
  const rect = containerRef.value?.getBoundingClientRect()
  if (!rect || props.data.length === 0) return
  const x = e.clientX - rect.left
  const n = props.data.length
  let i = Math.round(((x - plotLeft()) / (plotRightTo() - plotLeft())) * (n - 1))
  i = Math.max(0, Math.min(n - 1, i))
  hover.value = { x: xScale(i), y: e.clientY - rect.top, index: i }
}
const tooltipLabel = (index: number) =>
  props.xFormatter ? props.xFormatter(props.data[index][props.xKey], index) : String(props.data[index][props.xKey])
</script>

<template>
  <div
    ref="containerRef"
    class="relative h-full w-full"
    @mousemove="onMove"
    @mouseleave="hover = null"
  >
    <svg
      :width="width"
      :height="height"
      :viewBox="`0 0 ${width} ${height}`"
      role="img"
      class="overflow-visible"
    >
      <defs>
        <linearGradient v-for="(s, si) in series" :key="`${gid()}-fill-${si}`" :id="`${gid()}-fill-${si}`" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" :stop-color="s.color" :stop-opacity="s.topOpacity ?? 0.8" />
          <stop offset="95%" :stop-color="s.color" :stop-opacity="s.bottomOpacity ?? 0.05" />
        </linearGradient>
      </defs>

      <!-- grid -->
      <g class="text-border">
        <line
          v-for="(v, i) in ticks()"
          :key="`g${i}`"
          :x1="plotLeft()"
          :x2="plotRightTo()"
          :y1="yScale(v)"
          :y2="yScale(v)"
          stroke="currentColor"
          :stroke-opacity="grid === 'dashed' ? 0.3 : 0.5"
          :stroke-dasharray="grid === 'dashed' ? '3 3' : undefined"
        />
      </g>

      <!-- y labels -->
      <g v-if="showYAxis" class="fill-muted-foreground" font-size="12">
        <text v-for="(v, i) in ticks()" :key="`y${i}`" :x="plotLeft() - 8" :y="yScale(v) + 4" text-anchor="end">
          {{ yFormatter ? yFormatter(v) : Math.round(v) }}
        </text>
      </g>

      <!-- series -->
      <template v-for="(s, si) in series" :key="s.key">
        <path :d="areaPath(s)" :fill="`url(#${gid()}-fill-${si})`" />
        <path :d="linePath(s)" fill="none" :stroke="s.color" :stroke-width="s.width ?? 2" :stroke-dasharray="s.dash" stroke-linejoin="round" stroke-linecap="round" />
      </template>

      <!-- x labels -->
      <g class="fill-muted-foreground" font-size="12">
        <text v-for="i in xTickIndices()" :key="`x${i}`" :x="xScale(i)" :y="height - 8" text-anchor="middle">
          {{ xFormatter ? xFormatter(data[i][xKey], i) : data[i][xKey] }}
        </text>
      </g>

      <!-- no cursor line (recharts cursor={false}) -->
    </svg>

    <!-- shadcn ChartTooltipContent replica -->
    <div
      v-if="hover"
      class="border-border/50 bg-background pointer-events-none absolute z-50 grid min-w-[8rem] items-start gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs shadow-xl"
      :style="{ left: `${Math.min(hover.x + 12, width - 140)}px`, top: `${Math.max(0, Math.min(hover.y - 44, height - 90))}px` }"
    >
      <div class="font-medium">{{ tooltipLabel(hover.index) }}</div>
      <div class="grid gap-1.5">
        <div v-for="s in series" :key="s.key" class="flex w-full flex-wrap items-center gap-2">
          <div class="h-2.5 w-2.5 shrink-0 rounded-[2px]" :style="{ background: s.color }" />
          <div class="flex flex-1 items-center justify-between leading-none">
            <span class="text-muted-foreground">{{ s.name }}</span>
            <span class="text-foreground font-mono font-medium tabular-nums">{{ Number(data[hover.index][s.key]).toLocaleString() }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
