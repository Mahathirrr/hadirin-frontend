import { test, expect, type Page } from '@playwright/test'

import { ROUTES } from '../src/lib/routes'

test.setTimeout(120_000)

const adminEmail = process.env.E2E_ADMIN_EMAIL ?? process.env.E2E_EMAIL ?? 'muhammad.mahathir.id@gmail.com'
const adminPassword = process.env.E2E_ADMIN_PASSWORD ?? process.env.E2E_PASSWORD ?? 'admin123'
const memberEmail = process.env.E2E_STUDENT_EMAIL ?? 'ahmad.rizki@student.usk.ac.id'
const memberPassword = process.env.E2E_STUDENT_PASSWORD ?? 'student123'

const PUBLIC_PATHS = [
  ROUTES.landing,
  ROUTES.signIn,
  ROUTES.signUp,
  ROUTES.forgotPassword,
  ROUTES.terms,
  ROUTES.privacy,
  ROUTES.engineeringPerformance,
] as const

const APP_PATHS = [
  ROUTES.summary,
  ROUTES.workPlans,
  ROUTES.reports,
  ROUTES.leaveRequests,
  ROUTES.locationMonitoring,
  ROUTES.auditLogs,
  ROUTES.anomalyDetection,
  ROUTES.qrDevices,
  ROUTES.faceId,
  ROUTES.employees,
  ROUTES.workspace,
  ROUTES.geofence,
  ROUTES.shiftRoster,
  ROUTES.guide,
  ROUTES.subscription,
  ROUTES.billingHistory,
] as const

async function horizontalOverflowPx(page: Page) {
  return page.evaluate(() => {
    const root = document.documentElement
    return Math.max(0, root.scrollWidth - root.clientWidth)
  })
}

async function assertNoHorizontalOverflow(page: Page, label: string) {
  await page.waitForLoadState('domcontentloaded')
  await page.waitForTimeout(400)
  const overflow = await horizontalOverflowPx(page)
  expect(overflow, `${label}: scrollWidth melebihi viewport (${overflow}px)`).toBeLessThanOrEqual(3)
}

async function signIn(page: Page, email: string, password: string) {
  await page.goto(ROUTES.signIn)
  await page.getByLabel(/email/i).fill(email)
  await page.getByLabel(/password|kata sandi/i).fill(password)
  await Promise.all([
    page.waitForURL(/summary|onboarding|employees/, { timeout: 60_000, waitUntil: 'commit' }),
    page.getByRole('button', { name: 'Masuk', exact: true }).click(),
  ])
  if (page.url().includes('onboarding')) {
    throw new Error('Akun belum punya workspace, tidak bisa audit app routes')
  }
}

test.describe('Mobile overflow — publik', () => {
  for (const path of PUBLIC_PATHS) {
    test(`publik ${path}`, async ({ page }) => {
      await page.goto(path)
      await assertNoHorizontalOverflow(page, path)
    })
  }
})

test.describe('Mobile overflow — admin', () => {
  test.describe.configure({ mode: 'serial' })

  test.beforeEach(async ({ page }) => {
    await signIn(page, adminEmail, adminPassword)
  })

  for (const path of APP_PATHS) {
    test(`admin ${path}`, async ({ page }) => {
      await page.goto(path)
      await assertNoHorizontalOverflow(page, path)
    })
  }
})

test.describe('Mobile overflow — karyawan', () => {
  test.describe.configure({ mode: 'serial' })

  test.beforeEach(async ({ page }) => {
    await signIn(page, memberEmail, memberPassword)
  })

  const memberPaths = [
    ROUTES.summary,
    ROUTES.workPlans,
    ROUTES.reports,
    ROUTES.leaveRequests,
    ROUTES.employees,
    ROUTES.guide,
  ] as const

  for (const path of memberPaths) {
    test(`member ${path}`, async ({ page }) => {
      await page.goto(path)
      await assertNoHorizontalOverflow(page, path)
    })
  }
})

test.describe('Mobile overflow — viewport kecil', () => {
  test.describe.configure({ mode: 'serial' })

  test('landing 320px', async ({ page }) => {
    await page.goto(ROUTES.landing)
    await assertNoHorizontalOverflow(page, 'landing-320')
  })

  test('ringkasan admin 320px', async ({ page }) => {
    await signIn(page, adminEmail, adminPassword)
    await page.goto(ROUTES.summary)
    await assertNoHorizontalOverflow(page, 'summary-320')
  })
})
