/** Normalisasi jam kerja API (TIME/ISO) ke HH:MM untuk input dan tampilan. */
export function normalizeWorkTime(value: string | undefined | null, fallback = '08:00'): string {
  if (!value?.trim()) return fallback
  const match = value.trim().match(/^(\d{1,2}):(\d{2})/)
  if (!match) return fallback
  const hours = Math.min(23, Math.max(0, Number.parseInt(match[1], 10)))
  const minutes = Math.min(59, Math.max(0, Number.parseInt(match[2], 10)))
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
}

export function formatWorkTimeRange(start: string, end: string): string {
  return `${normalizeWorkTime(start)}-${normalizeWorkTime(end)}`
}
