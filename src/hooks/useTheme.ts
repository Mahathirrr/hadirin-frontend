import { useThemeContext } from '@/composables/useTheme'

export const useTheme = () => {
  const ctx = useThemeContext()
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider')
  return ctx
}
