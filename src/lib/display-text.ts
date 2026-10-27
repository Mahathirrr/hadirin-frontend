/** Normalisasi teks dari API/DB agar aman ditampilkan (tanpa em dash / en dash). */
export function sanitizeDisplayText(value: string | null | undefined): string {
  if (!value) return ''
  return value
    .replace(/\u2014/g, ', ')
    .replace(/\u2013/g, ', ')
    .replace(/\s{2,}/g, ' ')
    .replace(/,\s*,/g, ',')
    .trim()
}
