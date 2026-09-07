import { inject, provide, type ComputedRef, type Ref } from 'vue'

export const SIDEBAR_COOKIE_NAME = 'sidebar_state'
export const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7
export const SIDEBAR_WIDTH = '16rem'
export const SIDEBAR_WIDTH_MOBILE = '18rem'
export const SIDEBAR_WIDTH_ICON = '3rem'

export type SidebarContextValue = {
  state: ComputedRef<'expanded' | 'collapsed'>
  open: Ref<boolean>
  setOpen: (open: boolean) => void
  openMobile: Ref<boolean>
  setOpenMobile: (open: boolean) => void
  isMobile: ComputedRef<boolean>
  toggleSidebar: () => void
}

const SidebarContextKey = Symbol('sidebar-context')

export function provideSidebar(value: SidebarContextValue) {
  provide(SidebarContextKey, value)
}

export function useSidebar(): SidebarContextValue {
  const ctx = inject<SidebarContextValue>(SidebarContextKey)
  if (!ctx) {
    throw new Error('useSidebar must be used within a SidebarProvider.')
  }
  return ctx
}
