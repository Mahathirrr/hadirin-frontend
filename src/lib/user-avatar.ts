type AvatarUser = {
  id?: number
  name?: string
  email?: string
  avatar_url?: string
} | null | undefined

const DICEBEAR_STYLE = 'lorelei'

function avatarSeed(user: AvatarUser): string {
  return String(user?.id ?? user?.email ?? user?.name ?? 'hadirin-user').trim()
}

function isOAuthPortrait(url: string): boolean {
  return /googleusercontent|ggpht\.com/i.test(url)
}

/** DiceBear portrait (deterministic, no upload). */
export function dicebearAvatarUrl(seed: string, size = 128): string {
  const s = encodeURIComponent(seed.trim() || 'hadirin')
  return `https://api.dicebear.com/9.x/${DICEBEAR_STYLE}/png?seed=${s}&size=${size}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`
}

export function personAvatarUrl(name: string, id?: number | string): string {
  const seed = id != null ? `${id}-${name}` : name
  return dicebearAvatarUrl(seed, 128)
}

/** Google OAuth photo, else DiceBear. */
export function userAvatarUrl(user: AvatarUser): string {
  const custom = user?.avatar_url?.trim()
  if (custom && isOAuthPortrait(custom)) return custom

  return dicebearAvatarUrl(avatarSeed(user))
}

export function userAvatarAlt(user: AvatarUser): string {
  return user?.name?.trim() || 'Profil pengguna'
}
