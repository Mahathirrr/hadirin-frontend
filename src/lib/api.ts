import { ApiError, friendlyApiMessage } from '@/lib/api-error'

function resolveApiUrl(): string {
  const configured = import.meta.env.VITE_API_BASE?.trim()
  if (configured) {
    const base = configured.replace(/\/$/, '')
    return base.endsWith('/api') ? base : `${base}/api`
  }
  const legacy = import.meta.env.VITE_API_URL?.trim()
  if (legacy) return legacy
  if (typeof window !== 'undefined') return `${window.location.origin}/api`
  return 'http://localhost:8080/api'
}

const API_URL = resolveApiUrl()

function resolveApiOrigin(): string {
  if (API_URL.startsWith('/')) {
    if (typeof window !== 'undefined') return window.location.origin
    return ''
  }
  return API_URL.replace(/\/api\/?$/, '')
}

const API_ORIGIN = resolveApiOrigin()

export { ApiError }

type RequestOptions = {
  method?: string
  body?: unknown
  token?: string | null
  formData?: FormData
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers: Record<string, string> = {}
  if (!options.formData) headers['Content-Type'] = 'application/json'
  if (options.token) headers.Authorization = `Bearer ${options.token}`

  const res = await fetch(`${API_URL}${path}`, {
    method: options.method || 'GET',
    headers,
    body: options.formData ?? (options.body ? JSON.stringify(options.body) : undefined),
  })

  const data = await res.json().catch(() => ({} as Record<string, unknown>))
  if (!res.ok) {
    const raw = typeof data.error === 'string' ? data.error : ''
    const retryIn = typeof data.retry_in === 'number' ? data.retry_in : undefined
    throw new ApiError(friendlyApiMessage(res.status, raw, retryIn), res.status, retryIn)
  }
  return data as T
}

async function downloadWithAuth(path: string, token: string, filename: string) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) {
    const data = await res.json().catch(() => ({} as Record<string, unknown>))
    const raw = typeof data.error === 'string' ? data.error : ''
    throw new ApiError(friendlyApiMessage(res.status, raw), res.status)
  }
  const blob = await res.blob()
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

function unwrapList<T>(res: { data: T } | T): T {
  if (res && typeof res === 'object' && 'data' in res) return (res as { data: T }).data
  return res as T
}

export type Workspace = { id: number; name: string; slug: string; invite_code?: string; plan: string }
export type Membership = { workspace_id: number; role: string; workspace: Workspace }

export type DashboardSummary = {
  total_employees: number
  active_employees: number
  today_present: number
  today_late: number
  pending_leaves: number
  active_geofences: number
  active_qr_devices: number
  recent_attendances_7d: number
  stale_location_sessions?: number
  attendance_trend_7d?: Array<{ date: string; day: string; rate: number }>
}

export type WorkspaceSettings = {
  workspace_id: number
  geofence_enabled: boolean
  ip_whitelist_enabled: boolean
  timezone: string
  location_interval_minutes: number
  max_gps_accuracy_m: number
  face_id_enabled: boolean
  face_engine: string
  passkey_fallback_enabled: boolean
  work_start_time?: string
  work_end_time?: string
  late_threshold_minutes?: number
}

export type WorkspaceMember = {
  id: number
  workspace_id: number
  user_id: number
  role: string
  user?: { id: number; email: string; name: string; avatar_url?: string }
}

export type IPWhitelistEntry = { id: number; workspace_id: number; cidr: string; label?: string }

export const api = {
  register: (name: string, email: string, password: string) =>
    request<{ token: string; user: { id: number; email: string; name: string } }>('/auth/register', {
      method: 'POST',
      body: { name, email, password },
    }),
  login: (email: string, password: string) =>
    request<{ token: string; user: { id: number; email: string; name: string } }>('/auth/login', {
      method: 'POST',
      body: { email, password },
    }),
  googleAuthStatus: () => request<{ enabled: boolean; url: string }>('/auth/google/status'),
  googleAuthStartUrl: () => `${API_ORIGIN}/api/auth/google/start`,
  me: (token: string) =>
    request<{ user: { id: number; email: string; name: string; avatar_url?: string }; memberships: Membership[] }>('/auth/me', { token }),
  createWorkspace: (token: string, name: string) =>
    request<Workspace>('/workspaces', { method: 'POST', token, body: { name } }),
  joinWorkspace: (token: string, inviteCode: string) =>
    request<Workspace>('/workspaces/join', { method: 'POST', token, body: { invite_code: inviteCode } }),
  getInviteCode: (token: string, workspaceId: number) =>
    request<{ invite_code: string }>(`/workspaces/${workspaceId}/invite-code`, { token }),
  resetInviteCode: (token: string, workspaceId: number) =>
    request<{ invite_code: string }>(`/workspaces/${workspaceId}/invite-code/reset`, { method: 'POST', token }),
  getWorkspace: (token: string, workspaceId: number) =>
    request<Workspace>(`/workspaces/${workspaceId}`, { token }),
  updateWorkspace: (token: string, workspaceId: number, body: { name: string }) =>
    request<Workspace>(`/workspaces/${workspaceId}`, { method: 'PUT', token, body }),
  deleteWorkspace: (token: string, workspaceId: number) =>
    request<{ message: string }>(`/workspaces/${workspaceId}`, { method: 'DELETE', token }),
  listWorkspaceMembers: async (token: string, workspaceId: number) =>
    unwrapList(await request<{ data: WorkspaceMember[] }>(`/workspaces/${workspaceId}/members`, { token })),
  dashboardSummary: (token: string, workspaceId: number) =>
    request<DashboardSummary>(`/dashboard/summary?workspace_id=${workspaceId}`, { token }),
  listEmployees: async (token: string, workspaceId: number) =>
    unwrapList(await request<{ data: Array<Record<string, unknown>> }>(`/employees?workspace_id=${workspaceId}`, { token })),
  createEmployee: (token: string, workspaceId: number, body: Record<string, unknown>) =>
    request<Record<string, unknown>>(`/employees?workspace_id=${workspaceId}`, { method: 'POST', token, body }),
  updateEmployee: (token: string, id: number, body: Record<string, unknown>) =>
    request<Record<string, unknown>>(`/employees/${id}`, { method: 'PUT', token, body }),
  deleteEmployee: (token: string, id: number) =>
    request<{ message: string }>(`/employees/${id}`, { method: 'DELETE', token }),
  listAttendance: async (token: string, workspaceId: number, date?: string) =>
    unwrapList(await request<{ data: Array<Record<string, unknown>> }>(`/attendance?workspace_id=${workspaceId}${date ? `&date=${date}` : ''}`, { token })),
  createAttendance: (token: string, workspaceId: number, body: Record<string, unknown>) =>
    request<Record<string, unknown>>(`/attendance?workspace_id=${workspaceId}`, { method: 'POST', token, body }),
  patchAttendance: (token: string, id: number, body: Record<string, unknown>) =>
    request<Record<string, unknown>>(`/attendance/${id}`, { method: 'PATCH', token, body }),
  listLeaveRequests: async (token: string, workspaceId: number) =>
    unwrapList(await request<{ data: Array<Record<string, unknown>> }>(`/leave-requests?workspace_id=${workspaceId}`, { token })),
  createLeaveRequest: (token: string, workspaceId: number, body: Record<string, unknown>) =>
    request<Record<string, unknown>>(`/leave-requests?workspace_id=${workspaceId}`, { method: 'POST', token, body }),
  updateLeaveRequest: (token: string, id: number, body: Record<string, unknown>) =>
    request<Record<string, unknown>>(`/leave-requests/${id}`, { method: 'PATCH', token, body }),
  listAuditLogs: async (token: string, workspaceId: number) =>
    unwrapList(await request<{ data: Array<Record<string, unknown>> }>(`/audit-logs?workspace_id=${workspaceId}`, { token })),
  listAnomalyAlerts: async (token: string, workspaceId: number, status?: string) =>
    unwrapList(await request<{ data: Array<Record<string, unknown>> }>(
      `/anomaly-alerts?workspace_id=${workspaceId}${status ? `&status=${status}` : ''}`,
      { token },
    )),
  anomalySummary: (token: string, workspaceId: number) =>
    request<{ open: number; reviewing: number; closed: number; high_open: number; risk_score: number }>(
      `/anomaly-alerts/summary?workspace_id=${workspaceId}`,
      { token },
    ),
  scanAnomalyAlerts: (token: string, workspaceId: number) =>
    request<{ scanned: number; created: number; skipped: number; message: string }>(
      `/anomaly-alerts/scan?workspace_id=${workspaceId}`,
      { method: 'POST', token },
    ),
  updateAnomalyAlert: (token: string, id: number, body: { status: string; review_notes?: string }) =>
    request<Record<string, unknown>>(`/anomaly-alerts/${id}`, { method: 'PATCH', token, body }),
  listQRDevices: async (token: string, workspaceId: number) =>
    unwrapList(await request<{ data: Array<Record<string, unknown>> }>(`/qr-devices?workspace_id=${workspaceId}`, { token })),
  createQRDevice: (token: string, workspaceId: number, body: Record<string, unknown>) =>
    request<Record<string, unknown>>(`/qr-devices?workspace_id=${workspaceId}`, { method: 'POST', token, body }),
  updateQRDevice: (token: string, id: number, body: Record<string, unknown>) =>
    request<Record<string, unknown>>(`/qr-devices/${id}`, { method: 'PUT', token, body }),
  deleteQRDevice: (token: string, id: number) =>
    request<{ message: string }>(`/qr-devices/${id}`, { method: 'DELETE', token }),
  createQRRegistrationCode: (token: string, workspaceId: number) =>
    request<{ code: string; expires_at: string }>(`/qr-devices/registration-codes?workspace_id=${workspaceId}`, { method: 'POST', token }),
  listGeofences: async (token: string, workspaceId: number) =>
    unwrapList(await request<{ data: Array<Record<string, unknown>> }>(`/geofences?workspace_id=${workspaceId}`, { token })),
  createGeofence: (token: string, workspaceId: number, body: Record<string, unknown>) =>
    request<Record<string, unknown>>(`/geofences?workspace_id=${workspaceId}`, { method: 'POST', token, body }),
  updateGeofence: (token: string, id: number, body: Record<string, unknown>) =>
    request<Record<string, unknown>>(`/geofences/${id}`, { method: 'PUT', token, body }),
  deleteGeofence: (token: string, id: number) =>
    request<{ message: string }>(`/geofences/${id}`, { method: 'DELETE', token }),
  getWorkspaceSettings: (token: string, workspaceId: number) =>
    request<{ data: WorkspaceSettings; ip_whitelist: IPWhitelistEntry[] }>(`/workspace-settings?workspace_id=${workspaceId}`, { token }),
  updateWorkspaceSettings: (token: string, workspaceId: number, body: Partial<WorkspaceSettings>) =>
    request<{ data: WorkspaceSettings }>(`/workspace-settings?workspace_id=${workspaceId}`, { method: 'PUT', token, body }),
  listIPWhitelist: async (token: string, workspaceId: number) =>
    unwrapList(await request<{ data: IPWhitelistEntry[] }>(`/ip-whitelist?workspace_id=${workspaceId}`, { token })),
  createIPWhitelist: (token: string, workspaceId: number, body: { cidr: string; label?: string }) =>
    request<IPWhitelistEntry>(`/ip-whitelist?workspace_id=${workspaceId}`, { method: 'POST', token, body }),
  deleteIPWhitelist: (token: string, id: number) =>
    request<{ message: string }>(`/ip-whitelist/${id}`, { method: 'DELETE', token }),
  listLocationSessions: async (token: string, workspaceId: number, active = true) =>
    unwrapList(await request<{ data: Array<Record<string, unknown>> }>(`/location-sessions?workspace_id=${workspaceId}&active=${active}`, { token })),
  pingLocation: (token: string, workspaceId: number, body: Record<string, unknown>) =>
    request<Record<string, unknown>>(`/location-sessions/ping?workspace_id=${workspaceId}`, { method: 'POST', token, body }),
  listFaceEnrollments: async (token: string, workspaceId: number) =>
    unwrapList(await request<{ data: Array<Record<string, unknown>> }>(`/face-enrollments?workspace_id=${workspaceId}`, { token })),
  createFaceEnrollment: (token: string, workspaceId: number, employeeId: number, photo: File) => {
    const form = new FormData()
    form.append('employee_id', String(employeeId))
    form.append('photo', photo)
    return request<Record<string, unknown>>(`/face-enrollments?workspace_id=${workspaceId}`, {
      method: 'POST',
      token,
      formData: form,
    })
  },
  verifyFaceEnrollment: (token: string, workspaceId: number, employeeId: number, photo: File) => {
    const form = new FormData()
    form.append('employee_id', String(employeeId))
    form.append('photo', photo)
    return request<{
      match: boolean
      verification_token?: string
      expires_in_seconds?: number
      employee_id?: number
    }>(`/face-enrollments/verify?workspace_id=${workspaceId}`, {
      method: 'POST',
      token,
      formData: form,
    })
  },
  deleteFaceEnrollment: (token: string, id: number) =>
    request<{ message: string }>(`/face-enrollments/${id}`, { method: 'DELETE', token }),
  listPasskeys: async (token: string, workspaceId: number) =>
    unwrapList(await request<{ data: Array<Record<string, unknown>> }>(`/passkeys?workspace_id=${workspaceId}`, { token })),
  beginPasskeyRegistration: (token: string, workspaceId: number, label?: string) =>
    request<{ options: PublicKeyCredentialCreationOptions; workspace_id: number; label?: string }>(
      '/passkeys/register/begin',
      { method: 'POST', token, body: { workspace_id: workspaceId, label } },
    ),
  finishPasskeyRegistration: (token: string, workspaceId: number, credential: unknown, label?: string) =>
    request<Record<string, unknown>>(
      `/passkeys/register/finish?workspace_id=${workspaceId}${label ? `&label=${encodeURIComponent(label)}` : ''}`,
      { method: 'POST', token, body: credential },
    ),
  deletePasskey: (token: string, id: number) =>
    request<{ message: string }>(`/passkeys/${id}`, { method: 'DELETE', token }),
  listWorkPlans: async (token: string, workspaceId: number) =>
    unwrapList(await request<{ data: Array<Record<string, unknown>> }>(`/work-plans?workspace_id=${workspaceId}`, { token })),
  createWorkPlan: (token: string, workspaceId: number, body: Record<string, unknown>) =>
    request<Record<string, unknown>>(`/work-plans?workspace_id=${workspaceId}`, { method: 'POST', token, body }),
  deleteWorkPlan: (token: string, id: number) =>
    request<{ message: string }>(`/work-plans/${id}`, { method: 'DELETE', token }),
  listWorkReports: async (token: string, workspaceId: number) =>
    unwrapList(await request<{ data: Array<Record<string, unknown>> }>(`/work-reports?workspace_id=${workspaceId}`, { token })),
  createWorkReport: (token: string, workspaceId: number, body: Record<string, unknown>) =>
    request<Record<string, unknown>>(`/work-reports?workspace_id=${workspaceId}`, { method: 'POST', token, body }),
  listWorkspaces: async (token: string) =>
    unwrapList(await request<{ data: Workspace[] }>('/workspaces', { token })),
  listWeeklyReports: async (token: string, workspaceId: number) =>
    unwrapList(await request<{ data: Array<Record<string, unknown>> }>(`/reports/weekly?workspace_id=${workspaceId}`, { token })),
  downloadLatestWeeklyReport: async (token: string, workspaceId: number) =>
    request<{ download_url?: string; message?: string }>(`/reports/weekly/latest?workspace_id=${workspaceId}`, { token }),
  generateWeeklyReport: async (token: string, workspaceId: number) =>
    request<{ message: string; status?: string; download_url?: string }>(
      `/reports/weekly/generate?workspace_id=${workspaceId}`,
      { method: 'POST', token },
    ),
  downloadWeeklyReportFile: async (token: string, workspaceId: number) => {
    const latest = await request<{ id?: number; download_url?: string }>(
      `/reports/weekly/latest?workspace_id=${workspaceId}`,
      { token },
    )
    if (!latest.id) throw new ApiError('Belum ada report mingguan yang selesai', 404)
    await api.downloadWeeklyReportById(token, latest.id)
  },
  downloadWeeklyReportById: async (token: string, reportId: number) => {
    await downloadWithAuth(`/reports/weekly/${reportId}/download`, token, `weekly-report-${reportId}.csv`)
  },
  weeklyReportDownloadUrl: (reportId: number) => `${API_URL}/reports/weekly/${reportId}/download`,
}

export { API_ORIGIN, API_URL }
