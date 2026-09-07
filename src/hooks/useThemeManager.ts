import { reactive } from 'vue'

import { baseColors } from '@/config/themeCustomizerConstants'
import { colorThemes, tweakcnThemes } from '@/config/themeData'
import type { ImportedTheme, ThemePreset } from '@/types/themeCustomizer'

export function useThemeManager() {
  const brandColorsValues = reactive<Record<string, string>>({})

  const resetTheme = () => {
    const root = document.documentElement
    const allPossibleVars = [
      'background', 'foreground', 'card', 'card-foreground', 'popover', 'popover-foreground',
      'primary', 'primary-foreground', 'secondary', 'secondary-foreground', 'muted', 'muted-foreground',
      'accent', 'accent-foreground', 'destructive', 'destructive-foreground', 'border', 'input',
      'ring', 'radius',
      'chart-1', 'chart-2', 'chart-3', 'chart-4', 'chart-5',
      'sidebar', 'sidebar-background', 'sidebar-foreground', 'sidebar-primary', 'sidebar-primary-foreground',
      'sidebar-accent', 'sidebar-accent-foreground', 'sidebar-border', 'sidebar-ring',
      'font-sans', 'font-serif', 'font-mono',
      'shadow-2xs', 'shadow-xs', 'shadow-sm', 'shadow', 'shadow-md', 'shadow-lg', 'shadow-xl', 'shadow-2xl',
      'spacing', 'tracking-normal',
      'card-header', 'card-content', 'card-footer', 'muted-background', 'accent-background',
      'destructive-background', 'warning', 'warning-foreground', 'success', 'success-foreground',
      'info', 'info-foreground',
    ]
    allPossibleVars.forEach((varName) => {
      root.style.removeProperty(`--${varName}`)
    })
    const inlineStyles = root.style
    for (let i = inlineStyles.length - 1; i >= 0; i--) {
      const property = inlineStyles[i]
      if (property.startsWith('--')) {
        root.style.removeProperty(property)
      }
    }
  }

  const clearBrandColors = () => {
    Object.keys(brandColorsValues).forEach((k) => delete brandColorsValues[k])
  }

  const updateBrandColorsFromTheme = (styles: Record<string, string>) => {
    clearBrandColors()
    baseColors.forEach((color) => {
      const cssVar = color.cssVar.replace('--', '')
      if (styles[cssVar]) {
        brandColorsValues[color.cssVar] = styles[cssVar]
      }
    })
  }

  const applyTheme = (themeValue: string, darkMode: boolean) => {
    const theme = colorThemes.find((t) => t.value === themeValue)
    if (!theme) return
    resetTheme()
    const styles = darkMode ? theme.preset.styles.dark : theme.preset.styles.light
    const root = document.documentElement
    Object.entries(styles).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value)
    })
    updateBrandColorsFromTheme(styles as Record<string, string>)
  }

  const applyTweakcnTheme = (themePreset: ThemePreset, darkMode: boolean) => {
    resetTheme()
    const styles = darkMode ? themePreset.styles.dark : themePreset.styles.light
    const root = document.documentElement
    Object.entries(styles).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value)
    })
    updateBrandColorsFromTheme(styles as Record<string, string>)
  }

  const applyImportedTheme = (themeData: ImportedTheme, darkMode: boolean) => {
    const root = document.documentElement
    const themeVars = darkMode ? themeData.dark : themeData.light
    Object.entries(themeVars).forEach(([variable, value]) => {
      root.style.setProperty(`--${variable}`, value)
    })
    clearBrandColors()
    baseColors.forEach((color) => {
      const varName = color.cssVar.replace('--', '')
      if (themeVars[varName]) {
        brandColorsValues[color.cssVar] = themeVars[varName]
      }
    })
  }

  const applyRadius = (radius: string) => {
    document.documentElement.style.setProperty('--radius', radius)
  }

  const handleColorChange = (cssVar: string, value: string) => {
    document.documentElement.style.setProperty(cssVar, value)
  }

  return {
    brandColorsValues,
    setBrandColorsValues: clearBrandColors,
    resetTheme,
    applyTheme,
    applyTweakcnTheme,
    applyImportedTheme,
    applyRadius,
    handleColorChange,
    updateBrandColorsFromTheme,
    // re-export theme lists for convenience
    colorThemes,
    tweakcnThemes,
  }
}
