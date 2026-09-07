import { inject, provide, reactive } from 'vue'

export type Theme = 'dark' | 'light' | 'system'

export interface ThemeProviderState {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeProviderKey = Symbol('theme')

export function provideThemeState(state: ThemeProviderState) {
  provide(ThemeProviderKey, reactive(state))
}

export function useThemeContext(): ThemeProviderState {
  return (
    inject<ThemeProviderState>(ThemeProviderKey, {
      theme: 'system',
      setTheme: () => {},
    }) ?? { theme: 'system', setTheme: () => {} }
  )
}
