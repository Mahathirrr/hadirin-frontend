export const ROUTES = {
  landing: '/',
  signIn: '/auth/sign-in',
  signUp: '/auth/sign-up',
  forgotPassword: '/auth/forgot-password',
  resetPassword: '/auth/reset-password',
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
  shiftRoster: '/shift-roster',
  guide: '/guide',
  subscription: '/subscription',
  subscriptionCheckout: '/subscription/checkout',
  billingHistory: '/billing/history',
  billingAdmin: '/billing/admin',
  engineeringPerformance: '/engineering/performance',
  terms: '/legal/syarat-layanan',
  privacy: '/legal/kebijakan-privasi',
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
  | 'shift-roster'
  | 'guide'
  | 'subscription'
  | 'subscription-checkout'
  | 'billing-history'
  | 'billing-admin'

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
  'shift-roster',
  'guide',
  'subscription',
  'subscription-checkout',
  'billing-history',
  'billing-admin',
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
