import type { DashboardSummary, Membership, PublicCatalog } from '@/lib/api'
import { DEV_MOCK_MEMBERSHIPS, DEV_MOCK_USER, DEV_MOCK_WORKSPACE_ID } from '@/lib/dev'

const mockSummary: DashboardSummary = {
  total_employees: 24,
  active_employees: 22,
  today_present: 19,
  today_late: 2,
  pending_leaves: 3,
  active_geofences: 2,
  active_qr_devices: 4,
  recent_attendances_7d: 86,
  stale_location_sessions: 1,
  attendance_trend_7d: [
    { date: '2026-09-02', day: 'Sen', rate: 82 },
    { date: '2026-09-03', day: 'Sel', rate: 88 },
    { date: '2026-09-04', day: 'Rab', rate: 91 },
    { date: '2026-09-05', day: 'Kam', rate: 86 },
    { date: '2026-09-06', day: 'Jum', rate: 79 },
    { date: '2026-09-07', day: 'Sab', rate: 45 },
    { date: '2026-09-08', day: 'Min', rate: 86 },
  ],
}

const mockEmployees = [
  { id: 1, name: 'Ahmad Rizki', email: 'ahmad.rizki@student.usk.ac.id', department: 'Teknik Informatika', status: 'active' },
  { id: 2, name: 'Siti Nurhaliza', email: 'siti.nurhaliza@student.usk.ac.id', department: 'Teknik Informatika', status: 'active' },
  { id: 3, name: 'Budi Santoso', email: 'budi.santoso@student.usk.ac.id', department: 'Teknik Informatika', status: 'active' },
  { id: 4, name: 'Dewi Lestari', email: 'dewi.lestari@showcaseproject.my.id', department: 'People Ops', status: 'active' },
]

const mockAttendance = [
  {
    id: 1,
    employee_id: 1,
    employee: { id: 1, name: 'Ahmad Rizki' },
    created_at: '2026-09-08T08:02:00+07:00',
    updated_at: '2026-09-08T08:02:00+07:00',
    check_in: '08:02',
    check_out: '17:05',
    status: 'present',
    check_in_method: 'qr',
  },
  {
    id: 2,
    employee_id: 2,
    employee: { id: 2, name: 'Siti Nurhaliza' },
    created_at: '2026-09-08T08:15:00+07:00',
    updated_at: '2026-09-08T08:15:00+07:00',
    check_in: '08:15',
    check_out: '17:10',
    status: 'late',
    check_in_method: 'geofence',
  },
  {
    id: 3,
    employee_id: 3,
    employee: { id: 3, name: 'Budi Pratama' },
    created_at: '2026-09-08T07:55:00+07:00',
    updated_at: '2026-09-08T07:55:00+07:00',
    check_in: '07:55',
    check_out: '16:58',
    status: 'present',
    check_in_method: 'manual',
  },
  {
    id: 4,
    employee_id: 4,
    employee: { id: 4, name: 'Dewi Lestari' },
    created_at: '2026-09-08T08:00:00+07:00',
    updated_at: '2026-09-08T08:00:00+07:00',
    check_in: '08:00',
    check_out: '17:00',
    status: 'present',
    check_in_method: 'face_id',
  },
]

function workspaceIdFromPath(path: string): number {
  const match = path.match(/workspace_id=(\d+)/)
  return match ? Number(match[1]) : DEV_MOCK_WORKSPACE_ID
}

/** Returns mock response for a given API path, or null if no mock exists. */
export function devMockResponse<T>(path: string, method: string): T | null {
  const p = path.replace(/\/$/, '')
  const ws = workspaceIdFromPath(p)

  if (method === 'GET' && p === '/auth/me') {
    return {
      user: DEV_MOCK_USER,
      memberships: DEV_MOCK_MEMBERSHIPS as unknown as Membership[],
    } as T
  }

  if (method === 'GET' && p.startsWith('/dashboard/summary')) {
    return mockSummary as T
  }

  if (method === 'GET' && p.startsWith('/employees')) {
    return { data: mockEmployees } as T
  }

  if (method === 'GET' && p.startsWith('/attendance')) {
    return { data: mockAttendance } as T
  }

  if (method === 'GET' && p.startsWith('/leave-requests')) {
    return { data: [] } as T
  }

  if (method === 'GET' && p.startsWith('/audit-logs')) {
    return {
      data: [
        {
          id: 1,
          action: 'create',
          entity_type: 'attendance',
          entity_id: 1,
          details: 'Ahmad Rizki — face_id (Kampus USK — Fakultas Teknik)',
          created_at: new Date().toISOString(),
        },
        {
          id: 2,
          action: 'create',
          entity_type: 'attendance',
          entity_id: 2,
          details: 'Siti Nurhaliza — qr (Lobby Kantor)',
          created_at: new Date().toISOString(),
        },
      ],
    } as T
  }

  if (method === 'GET' && p.startsWith('/reports/weekly')) {
    const now = new Date()
    const weekStart = new Date(now)
    weekStart.setDate(now.getDate() - now.getDay() + 1)
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekStart.getDate() + 6)
    return {
      data: [
        {
          id: 1,
          week_start: weekStart.toISOString(),
          week_end: weekEnd.toISOString(),
          status: 'completed',
          generated_at: now.toISOString(),
        },
      ],
    } as T
  }

  if (method === 'GET' && p.startsWith('/anomaly-alerts/summary')) {
    return { open: 2, reviewing: 1, closed: 5, high_open: 1, risk_score: 32 } as T
  }

  if (method === 'GET' && p.startsWith('/anomaly-alerts')) {
    return { data: [] } as T
  }

  if (method === 'GET' && p.startsWith('/qr-devices')) {
    return { data: [] } as T
  }

  if (method === 'GET' && p.startsWith('/geofences')) {
    return { data: [] } as T
  }

  if (method === 'GET' && p.startsWith('/workspace-settings')) {
    return {
      data: {
        workspace_id: ws,
        geofence_enabled: true,
        ip_whitelist_enabled: false,
        timezone: 'Asia/Jakarta',
        location_interval_minutes: 15,
        max_gps_accuracy_m: 50,
        face_id_enabled: true,
        face_engine: 'mock',
        passkey_fallback_enabled: true,
      },
      ip_whitelist: [],
    } as T
  }

  if (method === 'GET' && p.startsWith('/workspaces/')) {
    return DEV_MOCK_MEMBERSHIPS[0].workspace as T
  }

  if (method === 'GET' && p === '/workspaces') {
    return { data: [DEV_MOCK_MEMBERSHIPS[0].workspace] } as T
  }

  if (method === 'GET' && p === '/public/catalog') {
    const catalog: PublicCatalog = {
      stats: {
        total_employees: 24,
        active_employees: 22,
        today_present: 19,
        today_late: 2,
        attendance_rate: 95.5,
        on_time_rate: 90.5,
        active_geofences: 2,
        face_enrolled: 8,
        open_anomalies: 1,
      },
      recent_attendance: [
        {
          name: 'Ahmad Rizki',
          role: 'Staff',
          department: 'Ops',
          time: '08:02 WIB',
          status: 'Tepat Waktu',
          on_time: true,
          location: 'HQ',
          initials: 'AR',
        },
      ],
      highlight: {
        name: 'Ahmad Rizki',
        check_in_time: '08:02 WIB',
        check_in_method: 'face',
        face_verified: true,
      },
    }
    return catalog as T
  }

  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) return {} as T

  return null
}
