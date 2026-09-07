export const ROUTES = {
  landing: '/',
  signIn: '/auth/sign-in',
  signUp: '/auth/sign-up',
  onboarding: '/onboarding',
  authCallback: '/auth/callback',
  summary: '/summary',
  workPlans: '/work-plans',
  reports: '/reports',
  leaveRequests: '/leave-requests',
  locationMonitoring: '/location-monitoring',
  auditLogs: '/audit-logs',
  anomalyDetection: '/anomaly-detection',
  qrDevices: '/qr-devices',
  faceId: '/face-id',
  employees: '/employees',
  workspace: '/workspace',
  geofence: '/geofence',
  guide: '/guide',
} as const

export type RouteName =
  | 'summary'
  | 'work-plans'
  | 'reports'
  | 'leave-requests'
  | 'location-monitoring'
  | 'audit-logs'
  | 'anomaly-detection'
  | 'qr-devices'
  | 'face-id'
  | 'employees'
  | 'workspace'
  | 'geofence'
  | 'guide'

export const DASHBOARD_ROUTE_NAMES = new Set<RouteName>([
  'summary',
  'work-plans',
  'reports',
  'leave-requests',
  'location-monitoring',
  'audit-logs',
  'anomaly-detection',
  'qr-devices',
  'face-id',
  'employees',
  'workspace',
  'geofence',
  'guide',
])

/** Legacy Indonesian paths kept for backward-compatible redirects. */
export const LEGACY_ROUTE_REDIRECTS: Record<string, string> = {
  '/ringkasan': ROUTES.summary,
  '/laporan': ROUTES.reports,
  '/pengajuan-cuti': ROUTES.leaveRequests,
  '/monitoring-lokasi': ROUTES.locationMonitoring,
  '/log-audit': ROUTES.auditLogs,
  '/deteksi-anomaly': ROUTES.anomalyDetection,
  '/karyawan': ROUTES.employees,
  '/device-qr': ROUTES.qrDevices,
  '/panduan': ROUTES.guide,
}
