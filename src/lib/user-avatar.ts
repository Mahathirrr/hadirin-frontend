type AvatarUser = {
  id?: number
  name?: string
  email?: string
  avatar_url?: string
} | null | undefined

const DEMO_AVATARS: Record<string, string> = {
  'muhammad.mahathir.id@gmail.com': '/auth/avatars/demo-admin.jpg',
  'ahmad.rizki@student.usk.ac.id': '/auth/avatars/demo-student.jpg',
  'siti.nurhaliza@student.usk.ac.id': '/auth/avatars/demo-student.jpg',
}

function resolveAvatarUrl(raw: string): string {
  if (raw.startsWith('http://') || raw.startsWith('https://') || raw.startsWith('data:')) return raw
  if (raw.startsWith('/') && typeof window !== 'undefined') return `${window.location.origin}${raw}`
  if (raw.startsWith('/')) return raw
  return raw
}

/** Custom URL, demo portrait, then deterministic fallback. */
export function userAvatarUrl(user: AvatarUser): string {
  const custom = user?.avatar_url?.trim()
  if (custom) return resolveAvatarUrl(custom)

  const email = user?.email?.trim().toLowerCase()
  if (email && DEMO_AVATARS[email]) return resolveAvatarUrl(DEMO_AVATARS[email])

  const seed = encodeURIComponent(String(user?.id ?? user?.email ?? user?.name ?? 'hadirin-user'))
  return `https://api.dicebear.com/9.x/adventurer/png?seed=${seed}&size=128&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`
}

export function userAvatarAlt(user: AvatarUser): string {
  return user?.name?.trim() || 'Profil pengguna'
}
