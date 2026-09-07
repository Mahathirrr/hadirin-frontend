import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

export function useIsMobile(query = '(max-width: 768px)') {
  const isMobile = ref(false)

  let mql: MediaQueryList | null = null

  const update = () => {
    isMobile.value = mql?.matches ?? false
  }

  onMounted(() => {
    mql = window.matchMedia(query)
    update()
    mql.addEventListener('change', update)
  })

  onBeforeUnmount(() => {
    mql?.removeEventListener('change', update)
  })

  return computed(() => isMobile.value)
}
