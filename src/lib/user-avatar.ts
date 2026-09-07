type AvatarUser = {
  id?: number
  name?: string
  email?: string
  avatar_url?: string
} | null | undefined

/** Deterministic illustrated avatar when user has no custom photo. */
export function userAvatarUrl(user: AvatarUser): string {
  const custom = user?.avatar_url?.trim()
  if (custom) return custom

  const seed = encodeURIComponent(String(user?.id ?? user?.email ?? user?.name ?? 'hadirin-user'))
  return `https://api.dicebear.com/9.x/adventurer/png?seed=${seed}&size=128&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`
}

export function userAvatarAlt(user: AvatarUser): string {
  return user?.name?.trim() || 'Profil pengguna'
}
