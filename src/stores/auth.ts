import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import { api, type Membership, type Workspace } from '@/lib/api'
import { ApiError } from '@/lib/api-error'

const TOKEN_KEY = 'hadirin_token'
const WORKSPACE_KEY = 'hadirin_workspace_id'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem(TOKEN_KEY))
  const user = ref<{ id: number; email: string; name: string; avatar_url?: string } | null>(null)
  const memberships = ref<Membership[]>([])
  const workspaceId = ref<number | null>(Number(localStorage.getItem(WORKSPACE_KEY)) || null)
  const loading = ref(false)
  const error = ref('')

  const workspaceName = computed(() => {
    const active = memberships.value.find((x) => x.workspace_id === workspaceId.value)
    if (active?.workspace.name) return active.workspace.name
    return 'Workspace'
  })

  const activeMembership = computed(() =>
    memberships.value.find((x) => x.workspace_id === workspaceId.value) ?? memberships.value[0] ?? null,
  )

  const hasWorkspace = computed(() => memberships.value.length > 0 && !!workspaceId.value)
  const isAuthenticated = computed(() => !!token.value)

  function setWorkspace(id: number) {
    workspaceId.value = id
    localStorage.setItem(WORKSPACE_KEY, String(id))
  }

  function setToken(jwt: string) {
    token.value = jwt
    localStorage.setItem(TOKEN_KEY, jwt)
  }

  async function login(email: string, password: string) {
    loading.value = true
    error.value = ''
    try {
      const res = await api.login(email, password)
      setToken(res.token)
      user.value = res.user
      await fetchMe()
    } catch (e) {
      error.value = e instanceof ApiError ? e.message : 'Login gagal'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function register(name: string, email: string, password: string) {
    loading.value = true
    error.value = ''
    try {
      const res = await api.register(name, email, password)
      setToken(res.token)
      user.value = res.user
      memberships.value = []
      workspaceId.value = null
      localStorage.removeItem(WORKSPACE_KEY)
    } catch (e) {
      error.value = e instanceof ApiError ? e.message : 'Registrasi gagal'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function handleOAuthCallback(jwt: string) {
    setToken(jwt)
    await fetchMe()
  }

  async function fetchMe() {
    if (!token.value) return
    const res = await api.me(token.value)
    user.value = res.user
    memberships.value = res.memberships
    if (res.memberships.length > 0) {
      const saved = workspaceId.value
      const exists = res.memberships.some((m) => m.workspace_id === saved)
      setWorkspace(exists && saved ? saved : res.memberships[0].workspace_id)
    } else {
      workspaceId.value = null
      localStorage.removeItem(WORKSPACE_KEY)
    }
  }

  async function createWorkspace(name: string): Promise<Workspace> {
    if (!token.value) throw new Error('Unauthorized')
    const ws = await api.createWorkspace(token.value, name)
    await fetchMe()
    setWorkspace(ws.id)
    return ws
  }

  async function joinWorkspace(inviteCode: string): Promise<Workspace> {
    if (!token.value) throw new Error('Unauthorized')
    const ws = await api.joinWorkspace(token.value, inviteCode)
    await fetchMe()
    setWorkspace(ws.id)
    return ws
  }

  function logout() {
    token.value = null
    user.value = null
    memberships.value = []
    workspaceId.value = null
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(WORKSPACE_KEY)
  }

  async function init() {
    if (!token.value) return
    try {
      await fetchMe()
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) {
        logout()
      }
    }
  }

  return {
    token, user, memberships, workspaceId, workspaceName, activeMembership, loading, error,
    hasWorkspace, isAuthenticated,
    login, register, logout, init, fetchMe, createWorkspace, joinWorkspace, setWorkspace,
    handleOAuthCallback, setToken,
  }
})
