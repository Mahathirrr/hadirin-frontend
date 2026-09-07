import { ref } from 'vue'

import { useThemeContext } from '@/composables/useTheme'

interface CircularTransitionHook {
  isTransitioning: () => boolean
  toggleTheme: (event: MouseEvent) => void
}

export function useCircularTransition(): CircularTransitionHook {
  const ctx = useThemeContext()
  const isTransitioningRef = ref(false)

  function startTransition(coords: { x: number; y: number }, callback: () => void) {
    if (isTransitioningRef.value) return

    isTransitioningRef.value = true

    // Set CSS variables for the circular reveal animation - exactly like tweakcn
    const x = (coords.x / window.innerWidth) * 100
    const y = (coords.y / window.innerHeight) * 100

    document.documentElement.style.setProperty('--x', `${x}%`)
    document.documentElement.style.setProperty('--y', `${y}%`)

    const doc = document as Document & {
      startViewTransition?: (cb: () => void) => { finished: Promise<void> }
    }

    // Check if View Transitions API is supported
    if (typeof doc.startViewTransition === 'function') {
      const transition = doc.startViewTransition(() => {
        callback()
      })
      transition.finished.finally(() => {
        isTransitioningRef.value = false
      })
    } else {
      // Fallback for browsers without View Transitions API
      callback()
      setTimeout(() => {
        isTransitioningRef.value = false
      }, 400)
    }
  }

  const toggleTheme = (event: MouseEvent) => {
    const coords = { x: event.clientX, y: event.clientY }
    startTransition(coords, () => {
      ctx.setTheme(ctx.theme === 'dark' ? 'light' : 'dark')
    })
  }

  return {
    isTransitioning: () => isTransitioningRef.value,
    toggleTheme,
  }
}
