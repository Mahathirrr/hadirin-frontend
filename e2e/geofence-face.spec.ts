import { test, expect } from '@playwright/test'
import fs from 'node:fs'
import path from 'node:path'

import { resetTodayAttendanceForEmails } from './lib/prod-reset.mjs'

const apiBase = (process.env.API_BASE ?? 'https://hadirin.showcaseproject.my.id/api').replace(/\/$/, '')
const adminEmail = process.env.E2E_ADMIN_EMAIL ?? 'muhammad.mahathir.id@gmail.com'
const adminPassword = process.env.E2E_ADMIN_PASSWORD ?? 'admin123'
const studentEmail = process.env.E2E_STUDENT_EMAIL ?? 'ahmad.rizki@student.usk.ac.id'
const studentPassword = process.env.E2E_STUDENT_PASSWORD ?? 'student123'
const medanEmail = process.env.E2E_MEDAN_EMAIL ?? 'siti.nurhaliza@student.usk.ac.id'
const medanPassword = process.env.E2E_MEDAN_PASSWORD ?? 'student123'

const fixturePhoto = path.join(process.cwd(), 'e2e/fixtures/test-face.jpg')

async function apiLogin(request: import('@playwright/test').APIRequestContext, email: string, password: string) {
  const res = await request.post(`${apiBase}/auth/login`, { data: { email, password } })
  expect(res.ok()).toBeTruthy()
  return (await res.json()).token as string
}

async function apiWorkspace(request: import('@playwright/test').APIRequestContext, token: string, slugPart: string) {
  const res = await request.get(`${apiBase}/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
  expect(res.ok()).toBeTruthy()
  const body = await res.json()
  const m = body.memberships.find((x: { workspace?: { slug?: string } }) =>
    String(x.workspace?.slug ?? '').includes(slugPart),
  )
  const ws = m?.workspace_id ?? m?.workspace?.id
  expect(ws).toBeTruthy()
  return ws as number
}

async function prepareStudentFaceCheckIn(request: import('@playwright/test').APIRequestContext) {
  if (process.env.E2E_SKIP_SSH_RESET !== '1') {
    resetTodayAttendanceForEmails(['ahmad.rizki@student.usk.ac.id'])
  }
  const adminToken = await apiLogin(request, adminEmail, adminPassword)
  const hqWs = await apiWorkspace(request, adminToken, 'hq')
  const emps = await request.get(`${apiBase}/employees?workspace_id=${hqWs}`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  })
  const empList = ((await emps.json()) as { data?: Array<{ id: number; email: string }> }).data ?? []
  const emp = empList.find((e) => e.email?.includes('ahmad.rizki'))
  expect(emp?.id).toBeTruthy()

  const enroll = await request.post(`${apiBase}/face-enrollments?workspace_id=${hqWs}`, {
    headers: { Authorization: `Bearer ${adminToken}` },
    multipart: {
      employee_id: String(emp!.id),
      photo: { name: 'face.jpg', mimeType: 'image/jpeg', buffer: fs.readFileSync(fixturePhoto) },
    },
  })
  expect(enroll.status()).toBe(201)

  const geo = await request.get(`${apiBase}/geofences?workspace_id=${hqWs}`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  })
  const points = ((await geo.json()) as { data?: Array<{ latitude: number; longitude: number }> }).data ?? []
  const pt = points[0]
  expect(pt).toBeTruthy()
  return { lat: pt!.latitude, lon: pt!.longitude }
}

async function login(page: import('@playwright/test').Page, email: string, password: string) {
  await page.goto('/auth/sign-in', { waitUntil: 'domcontentloaded' })
  await page.getByLabel(/email/i).fill(email)
  await page.getByLabel(/password|kata sandi/i).fill(password)
  await page.getByRole('button', { name: 'Masuk', exact: true }).click()
  await expect(page.getByRole('link', { name: 'Ringkasan' })).toBeVisible({ timeout: 45_000 })
}

test.describe('Geofence & Face ID (production E2E)', () => {
  test.describe.configure({ mode: 'serial' })

  test.beforeAll(() => {
    if (!fs.existsSync(fixturePhoto)) throw new Error(`Missing ${fixturePhoto}`)
  })

  test('admin: halaman geofence', async ({ page }) => {
    test.skip(!process.env.E2E_RUN_PROD, 'Set E2E_RUN_PROD=1')
    await login(page, adminEmail, adminPassword)
    await page.goto('/geofence', { waitUntil: 'domcontentloaded' })
    await expect(page.getByRole('heading', { name: /Pengaturan Geofence/i })).toBeVisible({ timeout: 15_000 })
    await expect(page.getByText('Titik lokasi', { exact: true })).toBeVisible()
  })

  test('admin: halaman Face ID + enrollment form', async ({ page }) => {
    test.skip(!process.env.E2E_RUN_PROD, 'Set E2E_RUN_PROD=1')
    await login(page, adminEmail, adminPassword)
    await page.goto('/face-id', { waitUntil: 'domcontentloaded' })
    await expect(page.getByRole('heading', { name: /^Face ID$/ })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Enrollment baru' })).toBeVisible()
  })

  test('student HQ: Check-in Face ID end-to-end (UI)', async ({ page, context, request }) => {
    test.skip(!process.env.E2E_RUN_PROD, 'Set E2E_RUN_PROD=1')

    const { lat, lon } = await prepareStudentFaceCheckIn(request)
    await context.grantPermissions(['geolocation'])
    await context.setGeolocation({ latitude: lat, longitude: lon })

    await login(page, studentEmail, studentPassword)
    await page.goto('/employees', { waitUntil: 'domcontentloaded' })
    await expect(page.getByText(/Face ID aktif/i)).toBeVisible({ timeout: 15_000 })

    const checkInBtn = page.getByRole('button', { name: /Check-in Face ID/i })
    await expect(checkInBtn).toBeVisible({ timeout: 15_000 })
    await checkInBtn.click()
    await page.getByRole('dialog').locator('input[type="file"]').setInputFiles(fixturePhoto)

    const checkInDone = page.waitForResponse(
      (r) => r.url().includes('/attendance') && r.request().method() === 'POST' && r.status() === 201,
      { timeout: 45_000 },
    )
    await page.getByRole('button', { name: /Verifikasi & check-in/i }).click()
    await checkInDone
    await expect(page.getByRole('row', { name: /Ahmad Rizki/i }).locator('td').nth(2)).not.toHaveText('—')
  })

  test('student Medan: workspace switch + Check-in Face ID (UI)', async ({ page, context, request }) => {
    test.skip(!process.env.E2E_RUN_PROD, 'Set E2E_RUN_PROD=1')
    if (process.env.E2E_SKIP_SSH_RESET !== '1') {
      resetTodayAttendanceForEmails(['siti.nurhaliza@student.usk.ac.id'])
    }

    const adminToken = await apiLogin(request, adminEmail, adminPassword)
    const medanWs = await apiWorkspace(request, adminToken, 'medan')
    const emps = await request.get(`${apiBase}/employees?workspace_id=${medanWs}`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    })
    const list = ((await emps.json()) as { data?: Array<{ id: number; email: string }> }).data ?? []
    const siti = list.find((e) => e.email?.includes('siti.nurhaliza'))
    expect(siti?.id).toBeTruthy()
    await request.post(`${apiBase}/face-enrollments?workspace_id=${medanWs}`, {
      headers: { Authorization: `Bearer ${adminToken}` },
      multipart: {
        employee_id: String(siti!.id),
        photo: { name: 'face.jpg', mimeType: 'image/jpeg', buffer: fs.readFileSync(fixturePhoto) },
      },
    })

    const geo = await request.get(`${apiBase}/geofences?workspace_id=${medanWs}`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    })
    const pt = (((await geo.json()) as { data?: Array<{ latitude: number; longitude: number }> }).data ?? [])[0]
    expect(pt).toBeTruthy()

    await context.grantPermissions(['geolocation'])
    await context.setGeolocation({ latitude: pt!.latitude, longitude: pt!.longitude })

    await login(page, medanEmail, medanPassword)
    await page.getByRole('button', { name: /Showcase Project/i }).click()
    await page.getByRole('menuitem', { name: /Medan/i }).click()
    await page.goto('/employees', { waitUntil: 'domcontentloaded' })

    const btn = page.getByRole('button', { name: /Check-in Face ID/i })
    await expect(btn).toBeVisible({ timeout: 20_000 })
    await btn.click()
    await page.getByRole('dialog').locator('input[type="file"]').setInputFiles(fixturePhoto)
    const done = page.waitForResponse(
      (r) => r.url().includes('/attendance') && r.request().method() === 'POST' && r.status() === 201,
      { timeout: 45_000 },
    )
    await page.getByRole('button', { name: /Verifikasi & check-in/i }).click()
    await done
    await expect(page.getByRole('row', { name: /Siti Nurhaliza/i }).locator('td').nth(2)).not.toHaveText('—')
  })
})
