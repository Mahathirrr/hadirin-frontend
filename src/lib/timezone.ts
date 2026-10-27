/** Zona waktu perusahaan — simpan & kirim ke API sebagai IANA (bukan offset manual). */
export const INDONESIA_WORKSPACE_TIMEZONES = [
  {
    value: 'Asia/Jakarta',
    label: 'WIB — Jakarta, Sumatera, Jawa, Kalimantan (Barat/Tengah)',
    abbrev: 'WIB',
  },
  {
    value: 'Asia/Makassar',
    label: 'WITA — Bali, Nusa Tenggara, Sulawesi, Kalimantan (Timur/Selatan)',
    abbrev: 'WITA',
  },
  {
    value: 'Asia/Jayapura',
    label: 'WIT — Maluku & Papua',
    abbrev: 'WIT',
  },
] as const

export type IndonesiaWorkspaceTimezone = (typeof INDONESIA_WORKSPACE_TIMEZONES)[number]['value']

export function timezoneAbbrev(iana: string | undefined): string {
  const row = INDONESIA_WORKSPACE_TIMEZONES.find((z) => z.value === iana)
  return row?.abbrev ?? 'WIB'
}

export function formatClockInZone(isoOrDate: string | Date, iana: string): string {
  const d = typeof isoOrDate === 'string' ? new Date(isoOrDate) : isoOrDate
  const clock = new Intl.DateTimeFormat('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: iana,
  }).format(d)
  return `${clock} ${timezoneAbbrev(iana)}`
}
