/**
 * Free raster tiles — no API key, no registration.
 * @see https://operations.osmfoundation.org/policies/tiles/
 */
export const HADIRIN_MAP_TILES = {
  url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  maxZoom: 19,
} as const

export const DEFAULT_MAP_CENTER: [number, number] = [-2.5, 118]
export const DEFAULT_MAP_ZOOM = 5
