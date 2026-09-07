export type GeocodeResult = {
  lat: number
  lng: number
  label: string
}

export async function searchAddress(query: string): Promise<GeocodeResult | null> {
  const q = query.trim()
  if (!q) return null

  const url = new URL('https://nominatim.openstreetmap.org/search')
  url.searchParams.set('q', q)
  url.searchParams.set('format', 'json')
  url.searchParams.set('limit', '1')

  const res = await fetch(url.toString(), {
    headers: { Accept: 'application/json' },
  })
  if (!res.ok) return null

  const data = await res.json() as Array<{ lat: string; lon: string; display_name: string }>
  const first = data[0]
  if (!first) return null

  return {
    lat: Number(first.lat),
    lng: Number(first.lon),
    label: first.display_name,
  }
}
