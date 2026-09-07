<script setup lang="ts">
import { onBeforeUnmount, onMounted, reactive, watch } from 'vue'

import { provideThemeState, type Theme } from '@/composables/useTheme'

interface Props {
  defaultTheme?: Theme
  storageKey?: string
}

const props = withDefaults(defineProps<Props>(), {
  defaultTheme: 'system',
  storageKey: 'vite-ui-theme',
})

let stored = 'system'
try {
  stored = localStorage.getItem(props.storageKey) || props.defaultTheme
} catch {
  stored = props.defaultTheme
}

const state = reactive<{ theme: Theme; setTheme: (t: Theme) => void }>({
  theme: stored as Theme,
  setTheme: (theme: Theme) => {
    try {
      localStorage.setItem(props.storageKey, theme)
    } catch {
      /* ignore */
    }
    state.theme = theme
  },
})

provideThemeState(state)

function applyTheme(theme: Theme) {
  const root = document.documentElement
  root.classList.remove('light', 'dark')
  let resolved: Theme = theme
  if (theme === 'system') {
    resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }
  root.classList.add(resolved)
}

const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

const handleSystemChange = () => {
  if (state.theme === 'system') applyTheme('system')
}

onMounted(() => {
  applyTheme(state.theme)
  mediaQuery.addEventListener('change', handleSystemChange)
})

onBeforeUnmount(() => {
  mediaQuery.removeEventListener('change', handleSystemChange)
})

watch(
  () => state.theme,
  (t) => applyTheme(t),
)
</script>

<template>
  <slot />
</template>
