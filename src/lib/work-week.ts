import { normalizeWorkTime } from '@/lib/work-time'

export type WorkDaySchedule = {
  day: number
  active: boolean
  start_time: string
  end_time: string
}

export const WORK_DAY_LABELS: Record<number, string> = {
  1: 'Senin',
  2: 'Selasa',
  3: 'Rabu',
  4: 'Kamis',
  5: 'Jumat',
  6: 'Sabtu',
  7: 'Minggu',
}

export function defaultWorkWeek(start = '08:00', end = '17:00'): WorkDaySchedule[] {
  const s = normalizeWorkTime(start)
  const e = normalizeWorkTime(end)
  return Array.from({ length: 7 }, (_, i) => {
    const day = i + 1
    return {
      day,
      active: day <= 5,
      start_time: s,
      end_time: e,
    }
  })
}

export function normalizeWorkDay(row: WorkDaySchedule, fallbackStart = '08:00', fallbackEnd = '17:00'): WorkDaySchedule {
  return {
    day: row.day,
    active: row.active,
    start_time: normalizeWorkTime(row.start_time, fallbackStart),
    end_time: normalizeWorkTime(row.end_time, fallbackEnd),
  }
}

export function parseWorkWeekFromApi(
  raw: unknown,
  legacyStart?: string,
  legacyEnd?: string,
): WorkDaySchedule[] {
  const base = defaultWorkWeek(legacyStart, legacyEnd)
  if (!Array.isArray(raw) || raw.length === 0) return base
  const byDay = new Map<number, WorkDaySchedule>()
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue
    const row = item as Record<string, unknown>
    const day = Number(row.day)
    if (day < 1 || day > 7) continue
    byDay.set(day, normalizeWorkDay({
      day,
      active: Boolean(row.active),
      start_time: String(row.start_time ?? legacyStart ?? '08:00'),
      end_time: String(row.end_time ?? legacyEnd ?? '17:00'),
    }))
  }
  return base.map((d) => byDay.get(d.day) ?? d)
}

export function scheduleForSave(rows: WorkDaySchedule[]): WorkDaySchedule[] {
  return rows
    .slice()
    .sort((a, b) => a.day - b.day)
    .map((r) => normalizeWorkDay(r))
}
