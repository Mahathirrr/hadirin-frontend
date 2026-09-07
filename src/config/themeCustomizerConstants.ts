import type { RadiusOption, BrandColor } from '@/types/themeCustomizer'

// Radius options
export const radiusOptions: RadiusOption[] = [
  { name: '0', value: '0rem' },
  { name: '0.3', value: '0.3rem' },
  { name: '0.5', value: '0.5rem' },
  { name: '0.75', value: '0.75rem' },
  { name: '1.0', value: '1rem' },
]

// Sidebar variant options
export const sidebarVariants: { name: string; value: string }[] = [
  { name: 'Default', value: 'sidebar' },
  { name: 'Floating', value: 'floating' },
  { name: 'Inset', value: 'inset' },
]

// Sidebar collapsible options
export const sidebarCollapsibleOptions: { name: string; value: string }[] = [
  { name: 'Off Canvas', value: 'offcanvas' },
  { name: 'Icon', value: 'icon' },
  { name: 'None', value: 'none' },
]

// Sidebar side options
export const sidebarSideOptions: { name: string; value: string }[] = [
  { name: 'Left', value: 'left' },
  { name: 'Right', value: 'right' },
]

// Define brand colors for custom color inputs
export const baseColors: BrandColor[] = [
  { name: 'Primary', cssVar: '--primary' },
  { name: 'Primary Foreground', cssVar: '--primary-foreground' },
  { name: 'Secondary', cssVar: '--secondary' },
  { name: 'Secondary Foreground', cssVar: '--secondary-foreground' },
  { name: 'Accent', cssVar: '--accent' },
  { name: 'Accent Foreground', cssVar: '--accent-foreground' },
  { name: 'Muted', cssVar: '--muted' },
  { name: 'Muted Foreground', cssVar: '--muted-foreground' },
]
