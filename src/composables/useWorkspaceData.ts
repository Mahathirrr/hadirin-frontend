import { ref, watch } from 'vue'

import { useAuthStore } from '@/stores/auth'

export function useWorkspaceId() {
  const auth = useAuthStore()
  return () => auth.workspaceId
}

export function useWorkspaceLoader<T>(loader: (token: string, workspaceId: number) => Promise<T>, immediate = true) {
  const auth = useAuthStore()
  const data = ref<T | null>(null)
  const loading = ref(false)
  const error = ref('')

  async function load() {
    if (!auth.token || !auth.workspaceId) return
    loading.value = true
    error.value = ''
    try {
      data.value = await loader(auth.token, auth.workspaceId)
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Gagal memuat data'
      data.value = null
    } finally {
      loading.value = false
    }
  }

  if (immediate) {
    watch(() => [auth.token, auth.workspaceId] as const, () => { void load() }, { immediate: true })
  }

  return { data, loading, error, load, auth }
}
