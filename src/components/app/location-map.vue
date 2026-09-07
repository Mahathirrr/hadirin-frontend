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
}>(), {
  center: () => DEFAULT_MAP_CENTER,
  zoom: DEFAULT_MAP_ZOOM,
  fullHeight: false,
  minHeight: '320px',
  markers: () => [],
  circles: () => [],
  interactive: false,
})

const emit = defineEmits<{
  mapClick: [lat: number, lng: number]
}>()

const mapEl = ref<HTMLElement | null>(null)
let map: L.Map | null = null
let tileLayer: L.TileLayer | null = null
let markerLayer: L.LayerGroup | null = null
let circleLayer: L.LayerGroup | null = null

function renderOverlays() {
  if (!map) return

  markerLayer?.clearLayers()
  circleLayer?.clearLayers()
  markerLayer = L.layerGroup().addTo(map)
  circleLayer = L.layerGroup().addTo(map)

  const bounds: L.LatLngExpression[] = []

  for (const c of props.circles) {
    if (!Number.isFinite(c.lat) || !Number.isFinite(c.lng)) continue
    L.circle([c.lat, c.lng], {
      radius: c.radiusM,
      color: '#2563eb',
      fillColor: '#3b82f6',
      fillOpacity: 0.12,
      weight: 2,
    })
      .bindPopup(c.label ?? '')
      .addTo(circleLayer)
    bounds.push([c.lat, c.lng])
  }

  for (const m of props.markers) {
    if (!Number.isFinite(m.lat) || !Number.isFinite(m.lng)) continue
    L.marker([m.lat, m.lng]).bindPopup(m.label ?? '').addTo(markerLayer)
    bounds.push([m.lat, m.lng])
  }

  if (bounds.length > 0) {
    map.fitBounds(L.latLngBounds(bounds).pad(0.2))
  }
}

function initMap() {
  if (!mapEl.value || map) return

  map = L.map(mapEl.value, {
    zoomControl: false,
    attributionControl: true,
  }).setView(props.center, props.zoom)

  tileLayer = L.tileLayer(HADIRIN_MAP_TILES.url, {
    maxZoom: HADIRIN_MAP_TILES.maxZoom,
    attribution: HADIRIN_MAP_TILES.attribution,
  }).addTo(map)

  L.control.zoom({ position: 'topright' }).addTo(map)

  if (props.interactive) {
    map.on('click', (e: L.LeafletMouseEvent) => {
      emit('mapClick', e.latlng.lat, e.latlng.lng)
    })
  }

  setTimeout(() => map?.invalidateSize(), 120)
  setTimeout(() => map?.invalidateSize(), 400)
  renderOverlays()
}

watch(() => [props.center, props.zoom], ([center, zoom]) => {
  if (!map || !center) return
  map.setView(center, zoom ?? DEFAULT_MAP_ZOOM)
})

watch(() => [props.markers, props.circles], () => renderOverlays(), { deep: true })

onMounted(initMap)
onUnmounted(() => {
  markerLayer = null
  circleLayer = null
  tileLayer = null
  map?.remove()
  map = null
})

defineExpose({
  invalidateSize: () => map?.invalidateSize(),
  flyTo: (lat: number, lng: number, zoom = 15) => map?.flyTo([lat, lng], zoom),
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
.hadirin-map :deep(.leaflet-container) {
  height: 100%;
  width: 100%;
  background: hsl(var(--muted));
  font-family: inherit;
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
}
</style>
