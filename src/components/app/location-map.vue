<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

import {
  HADIRIN_MAP_TILES,
  DEFAULT_MAP_CENTER,
  DEFAULT_MAP_ZOOM,
} from '@/lib/map-tiles'
import { cn } from '@/lib/utils'

export type MapMarker = { lat: number; lng: number; label?: string }
export type MapCircle = { lat: number; lng: number; radiusM: number; label?: string }

const props = withDefaults(defineProps<{
  center?: [number, number]
  zoom?: number
  fullHeight?: boolean
  minHeight?: string
  class?: string
  markers?: MapMarker[]
  circles?: MapCircle[]
  interactive?: boolean
  fitCircles?: boolean
}>(), {
  center: () => DEFAULT_MAP_CENTER,
  zoom: DEFAULT_MAP_ZOOM,
  fullHeight: false,
  minHeight: '320px',
  markers: () => [],
  circles: () => [],
  interactive: false,
  fitCircles: true,
})

const emit = defineEmits<{
  mapClick: [lat: number, lng: number]
}>()

const mapEl = ref<HTMLElement | null>(null)
let map: L.Map | null = null
let markerLayer: L.LayerGroup | null = null
let circleLayer: L.LayerGroup | null = null
let resizeObserver: ResizeObserver | null = null
let scrollTimer: ReturnType<typeof setTimeout> | null = null
let didFitBounds = false

const circleColors = ['#2563eb', '#0d9488', '#7c3aed', '#ea580c', '#db2777', '#0891b2']

function renderOverlays() {
  if (!map) return

  markerLayer?.clearLayers()
  circleLayer?.clearLayers()
  markerLayer = L.layerGroup().addTo(map)
  circleLayer = L.layerGroup().addTo(map)

  const bounds: L.LatLngExpression[] = []

  props.circles.forEach((c, index) => {
    if (!Number.isFinite(c.lat) || !Number.isFinite(c.lng)) return
    const color = circleColors[index % circleColors.length]
    L.circle([c.lat, c.lng], {
      radius: c.radiusM,
      color,
      fillColor: color,
      fillOpacity: 0.14,
      weight: 2,
    })
      .bindPopup(c.label ?? '')
      .addTo(circleLayer!)
    L.circleMarker([c.lat, c.lng], {
      radius: 5,
      color,
      fillColor: color,
      fillOpacity: 1,
      weight: 2,
    })
      .bindPopup(c.label ?? '')
      .addTo(markerLayer!)
    bounds.push([c.lat, c.lng])
  })

  for (const m of props.markers) {
    if (!Number.isFinite(m.lat) || !Number.isFinite(m.lng)) continue
    L.circleMarker([m.lat, m.lng], {
      radius: 6,
      color: '#2563eb',
      fillColor: '#2563eb',
      fillOpacity: 1,
      weight: 2,
    })
      .bindPopup(m.label ?? '')
      .addTo(markerLayer!)
    bounds.push([m.lat, m.lng])
  }

  if (props.fitCircles && bounds.length > 0 && !didFitBounds) {
    if (bounds.length === 1) {
      map.setView(bounds[0] as L.LatLngExpression, 15)
    } else {
      map.fitBounds(L.latLngBounds(bounds).pad(0.15), { maxZoom: 14 })
    }
    didFitBounds = true
  }
}

function scheduleInvalidate() {
  if (scrollTimer) clearTimeout(scrollTimer)
  scrollTimer = setTimeout(() => map?.invalidateSize({ animate: false }), 120)
}

function onWindowScroll() {
  scheduleInvalidate()
}

function initMap() {
  if (!mapEl.value || map) return

  map = L.map(mapEl.value, {
    zoomControl: false,
    attributionControl: true,
    preferCanvas: true,
  }).setView(props.center, props.zoom)

  L.tileLayer(HADIRIN_MAP_TILES.url, {
    maxZoom: HADIRIN_MAP_TILES.maxZoom,
    attribution: HADIRIN_MAP_TILES.attribution,
  }).addTo(map)

  L.control.zoom({ position: 'topright' }).addTo(map)

  if (props.interactive) {
    map.on('click', (e: L.LeafletMouseEvent) => {
      emit('mapClick', e.latlng.lat, e.latlng.lng)
    })
  }

  if (mapEl.value) {
    resizeObserver = new ResizeObserver(() => scheduleInvalidate())
    resizeObserver.observe(mapEl.value)
  }
  window.addEventListener('scroll', onWindowScroll, { passive: true, capture: true })
  window.addEventListener('resize', onWindowScroll, { passive: true })

  scheduleInvalidate()
  renderOverlays()
}

watch(
  () => ({ center: props.center, zoom: props.zoom }),
  ({ center, zoom }) => {
    if (!map) return
    map.setView(center, zoom ?? DEFAULT_MAP_ZOOM)
  },
)

watch(
  () => props.circles,
  () => {
    didFitBounds = false
    renderOverlays()
  },
  { deep: true },
)

watch(() => props.markers, () => renderOverlays(), { deep: true })

onMounted(initMap)
onUnmounted(() => {
  if (scrollTimer) clearTimeout(scrollTimer)
  window.removeEventListener('scroll', onWindowScroll, true)
  window.removeEventListener('resize', onWindowScroll)
  resizeObserver?.disconnect()
  markerLayer = null
  circleLayer = null
  map?.remove()
  map = null
})

defineExpose({
  invalidateSize: () => map?.invalidateSize({ animate: false }),
  flyTo: (lat: number, lng: number, zoom = 15) => {
    didFitBounds = true
    map?.flyTo([lat, lng], zoom)
  },
})
</script>

<template>
  <div
    ref="mapEl"
    :class="cn(
      'hadirin-map w-full overflow-hidden rounded-lg bg-muted/30',
      fullHeight ? 'h-full min-h-0' : 'min-h-[var(--map-min-height)]',
      props.class,
    )"
    :style="{ '--map-min-height': minHeight }"
  />
</template>

<style scoped>
.hadirin-map {
  position: relative;
  z-index: 0;
  isolation: isolate;
  contain: layout paint style;
  transform: translateZ(0);
}

.hadirin-map :deep(.leaflet-container) {
  height: 100%;
  width: 100%;
  background: hsl(var(--muted));
  font-family: inherit;
  z-index: 0;
}

.hadirin-map :deep(.leaflet-control-container) {
  position: relative;
  z-index: 5;
}

.hadirin-map :deep(.leaflet-tile-pane) {
  filter: grayscale(1) contrast(1.04) brightness(1.03);
}

.hadirin-map :deep(.leaflet-control-zoom a) {
  border-color: hsl(var(--border));
  color: hsl(var(--foreground));
  background: hsl(var(--background));
}

.hadirin-map :deep(.leaflet-control-zoom a:hover) {
  background: hsl(var(--muted));
}

.hadirin-map :deep(.leaflet-control-attribution) {
  background: hsl(var(--background) / 0.85);
  color: hsl(var(--muted-foreground));
  font-size: 10px;
  max-width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
