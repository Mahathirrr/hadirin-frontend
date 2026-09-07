import { createRouter, createWebHistory } from 'vue-router'

import { DASHBOARD_ROUTE_NAMES, ROUTES, type RouteName } from '@/lib/routes'
import { useAuthStore } from '@/stores/auth'

const basename = (import.meta.env.VITE_BASENAME as string) || ''

const router = createRouter({
  history: createWebHistory(basename),
  scrollBehavior() {
    return { top: 0 }
  },
  routes: [
    { path: ROUTES.landing, name: 'landing', component: () => import('@/views/LandingPage.vue') },
    { path: ROUTES.signIn, name: 'sign-in', component: () => import('@/views/auth/SignIn.vue'), meta: { guest: true } },
    { path: ROUTES.signUp, name: 'sign-up', component: () => import('@/views/auth/SignUp.vue'), meta: { guest: true } },
    { path: ROUTES.authCallback, name: 'auth-callback', component: () => import('@/views/auth/OAuthCallback.vue'), meta: { guest: true } },
    { path: ROUTES.onboarding, name: 'onboarding', component: () => import('@/views/auth/WorkspaceOnboarding.vue'), meta: { requiresAuth: true, onboarding: true } },
    {
      path: '/',
      component: () => import('@/components/layouts/shell-route.vue'),
      children: [
        { path: 'dashboard', redirect: ROUTES.summary },
        { path: 'summary', name: 'summary', component: () => import('@/views/app/Ringkasan.vue') },
        { path: 'work-plans', name: 'work-plans', meta: { title: 'Work Plans & Reports', description: 'Kelola rencana kerja dan laporan.' }, component: () => import('@/views/app/WorkPlans.vue') },
        { path: 'reports', name: 'reports', meta: { title: 'Laporan', description: 'Audit kehadiran harian.' }, component: () => import('@/views/app/Laporan.vue') },
        { path: 'leave-requests', name: 'leave-requests', meta: { title: 'Pengajuan Cuti', description: 'Tinjau cuti, izin, dan sakit.' }, component: () => import('@/views/app/PengajuanCuti.vue') },
        { path: 'location-monitoring', name: 'location-monitoring', meta: { title: 'Monitoring Lokasi', description: 'Pantau posisi karyawan aktif.' }, component: () => import('@/views/app/MonitoringLokasi.vue') },
        { path: 'audit-logs', name: 'audit-logs', meta: { title: 'Log audit', description: 'Riwayat perubahan workspace.' }, component: () => import('@/views/app/LogAudit.vue') },
        { path: 'anomaly-detection', name: 'anomaly-detection', meta: { title: 'Deteksi Anomaly', description: 'Pola absensi tidak wajar.' }, component: () => import('@/views/app/DeteksiAnomaly.vue') },
        { path: 'qr-devices', name: 'qr-devices', meta: { title: 'Device QR', description: 'Kelola device QR permanen.' }, component: () => import('@/views/app/DeviceQR.vue') },
        { path: 'face-id', name: 'face-id', meta: { title: 'Face ID', description: 'Enrollment wajah karyawan.' }, component: () => import('@/views/app/FaceID.vue') },
        { path: 'employees', name: 'employees', meta: { title: 'Karyawan', description: 'Review absensi karyawan.' }, component: () => import('@/views/app/Karyawan.vue') },
        { path: 'workspace', name: 'workspace', meta: { title: 'Workspace', description: 'Billing, member, dan undangan.' }, component: () => import('@/views/app/Workspace.vue') },
        { path: 'geofence', name: 'geofence', meta: { title: 'Geofence', description: 'Titik lokasi dan validasi.' }, component: () => import('@/views/app/Geofence.vue') },
        { path: 'guide', name: 'guide', meta: { title: 'Panduan', description: 'Ringkasan alur kerja workspace.' }, component: () => import('@/views/app/Guide.vue') },
        // Legacy Indonesian paths → English routes
        { path: 'ringkasan', redirect: ROUTES.summary },
        { path: 'laporan', redirect: ROUTES.reports },
        { path: 'pengajuan-cuti', redirect: ROUTES.leaveRequests },
        { path: 'monitoring-lokasi', redirect: ROUTES.locationMonitoring },
        { path: 'log-audit', redirect: ROUTES.auditLogs },
        { path: 'deteksi-anomaly', redirect: ROUTES.anomalyDetection },
        { path: 'karyawan', redirect: ROUTES.employees },
        { path: 'device-qr', redirect: ROUTES.qrDevices },
        { path: 'panduan', redirect: ROUTES.guide },
      ],
    },
    { path: '/:pathMatch(.*)*', redirect: ROUTES.landing },
  ],
})

router.beforeEach(async (to) => {
  const auth = useAuthStore()

  if (!auth.user && auth.token) {
    await auth.init()
  }

  if (to.meta.guest && auth.isAuthenticated && to.name !== 'auth-callback') {
    return auth.hasWorkspace ? ROUTES.summary : ROUTES.onboarding
  }
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return ROUTES.signIn
  }
  if (to.meta.requiresWorkspace && auth.isAuthenticated && !auth.hasWorkspace) {
    return ROUTES.onboarding
  }
  if (to.meta.onboarding && auth.hasWorkspace) {
    return ROUTES.summary
  }
  if (typeof to.name === 'string' && DASHBOARD_ROUTE_NAMES.has(to.name as RouteName) && !auth.isAuthenticated) {
    return ROUTES.signIn
  }
  if (typeof to.name === 'string' && DASHBOARD_ROUTE_NAMES.has(to.name as RouteName) && auth.isAuthenticated && !auth.hasWorkspace) {
    return ROUTES.onboarding
  }
  return true
})

export default router
