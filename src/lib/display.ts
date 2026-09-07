export function initials(value: string) {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
    .slice(0, 2) || '?'
}

export function usernameFromEmail(email: string) {
  return email.split('@')[0] || email
}

export function workspaceBadgeClass(id: number) {
  const palette = ['bg-emerald-500', 'bg-sky-500', 'bg-amber-500', 'bg-violet-500', 'bg-rose-500']
  return palette[id % palette.length]
}

export function truncateText(value: string, max = 16) {
  if (value.length <= max) return value
  return `${value.slice(0, max - 1)}…`
}
