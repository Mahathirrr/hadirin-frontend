import { inject, provide, reactive } from 'vue'

export interface SidebarConfig {
  variant: 'sidebar' | 'floating' | 'inset'
  collapsible: 'offcanvas' | 'icon' | 'none'
  side: 'left' | 'right'
}

export interface SidebarContextValue {
  config: SidebarConfig
  updateConfig: (config: Partial<SidebarConfig>) => void
}

const SidebarContextKey = Symbol('sidebar-context')

export function provideSidebarConfig() {
  const state = reactive<SidebarContextValue>({
    config: {
      variant: 'inset',
      collapsible: 'offcanvas',
      side: 'left',
    },
    updateConfig: (newConfig: Partial<SidebarConfig>) => {
      Object.assign(state.config, newConfig)
    },
  })
  provide(SidebarContextKey, state)
  return state
}

export function useSidebarConfig(): SidebarContextValue {
  const ctx = inject<SidebarContextValue | undefined>(SidebarContextKey)
  if (!ctx) {
    throw new Error('useSidebarConfig must be used within a SidebarConfigProvider')
  }
  return ctx
}
