import { onBeforeUnmount, onMounted, ref } from 'vue'

export function useFullscreen() {
  const isFullscreen = ref(false)

  function handleFullscreenChange() {
    isFullscreen.value = !!document.fullscreenElement
  }

  onMounted(() => {
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    isFullscreen.value = !!document.fullscreenElement
  })

  onBeforeUnmount(() => {
    document.removeEventListener('fullscreenchange', handleFullscreenChange)
  })

  function enterFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(console.error)
    }
  }

  function exitFullscreen() {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(console.error)
    }
  }

  function toggleFullscreen() {
    if (isFullscreen.value) exitFullscreen()
    else enterFullscreen()
  }

  return { isFullscreen, enterFullscreen, exitFullscreen, toggleFullscreen }
}
