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

const props = withDefaults(defineProps<{
  center?: [number, number]
  zoom?: number
  fullHeight?: boolean
  minHeight?: string
  class?: string
  markers?: Array<{ lat: number; lng: number; label?: string }>
}>(), {
  center: () => DEFAULT_MAP_CENTER,
  zoom: DEFAULT_MAP_ZOOM,
  fullHeight: false,
  minHeight: '320px',
  markers: () => [],
})

const mapEl = ref<HTMLElement | null>(null)
let map: L.Map | null = null
let tileLayer: L.TileLayer | null = null
let markerLayer: L.LayerGroup | null = null

function renderMarkers() {
  if (!map) return
  markerLayer?.clearLayers()
  markerLayer = L.layerGroup().addTo(map)
  for (const m of props.markers) {
    if (!Number.isFinite(m.lat) || !Number.isFinite(m.lng)) continue
    L.marker([m.lat, m.lng]).bindPopup(m.label ?? '').addTo(markerLayer)
  }
  if (props.markers.length > 0) {
    const bounds = L.latLngBounds(props.markers.map((m) => [m.lat, m.lng] as [number, number]))
    map.fitBounds(bounds.pad(0.2))
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

  setTimeout(() => map?.invalidateSize(), 120)
  setTimeout(() => map?.invalidateSize(), 400)
  renderMarkers()
}

watch(() => [props.center, props.zoom], ([center, zoom]) => {
  if (!map || !center) return
  map.setView(center, zoom ?? DEFAULT_MAP_ZOOM)
})

watch(() => props.markers, () => renderMarkers(), { deep: true })

onMounted(initMap)
onUnmounted(() => {
  markerLayer = null
  tileLayer = null
  map?.remove()
  map = null
})

defineExpose({
  invalidateSize: () => map?.invalidateSize(),
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
