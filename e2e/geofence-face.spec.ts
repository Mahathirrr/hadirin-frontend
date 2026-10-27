import { test, expect } from '@playwright/test'
import fs from 'node:fs'
import path from 'node:path'

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'https://hadirin.showcaseproject.my.id'
const adminEmail = process.env.E2E_ADMIN_EMAIL ?? 'muhammad.mahathir.id@gmail.com'
const adminPassword = process.env.E2E_ADMIN_PASSWORD ?? 'admin123'
const studentEmail = process.env.E2E_STUDENT_EMAIL ?? 'ahmad.rizki@student.usk.ac.id'
const studentPassword = process.env.E2E_STUDENT_PASSWORD ?? 'student123'

/** Minimal JPEG for enroll/verify (same bytes => sha256/embedding match in sidecar). */
function writeFixturePhoto(filePath: string) {
  const jpeg = Buffer.from([
    0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01, 0x01, 0x00, 0x00, 0x01, 0x00,
    0x01, 0x00, 0x00, 0xff, 0xd9,
  ])
  fs.mkdirSync(path.dirname(filePath), { recursive: true })
  fs.writeFileSync(filePath, jpeg)
}

async function login(page: import('@playwright/test').Page, email: string, password: string) {
  await page.goto('/auth/sign-in')
  await page.getByLabel(/email/i).fill(email)
  await page.getByLabel(/password|kata sandi/i).fill(password)
  await page.getByRole('button', { name: 'Masuk', exact: true }).click()
  await page.waitForURL(/summary|onboarding|karyawan|employees/, { timeout: 30_000 })
}

test.describe('Geofence & Face ID (production smoke)', () => {
  test.describe.configure({ mode: 'serial' })

  const fixturePhoto = path.join(process.cwd(), 'e2e/fixtures/test-face.jpg')

  test.beforeAll(() => {
    writeFixturePhoto(fixturePhoto)
  })

  test('admin: halaman geofence memuat peta & toggle', async ({ page }) => {
    test.skip(!process.env.E2E_RUN_PROD, 'Set E2E_RUN_PROD=1 untuk tes UI production')
    await login(page, adminEmail, adminPassword)
    await page.goto('/geofence')
    await expect(page.getByRole('heading', { name: /Geofence/i })).toBeVisible()
    await expect(page.getByText(/Geofence aktif|titik geofence/i).first()).toBeVisible({ timeout: 15_000 })
  })

  test('admin: enroll face + student check-in dengan GPS mock', async ({ page, context }) => {
    test.skip(!process.env.E2E_RUN_PROD, 'Set E2E_RUN_PROD=1 untuk tes UI production')

    await context.grantPermissions(['geolocation'])
    await context.setGeolocation({ latitude: 5.558733, longitude: 95.329642 })

    await login(page, adminEmail, adminPassword)
    await page.goto('/face-id')
    await expect(page.getByRole('heading', { name: /Face ID/i })).toBeVisible()

    const faceSwitch = page.locator('text=Face ID').locator('..').getByRole('switch').first()
    if (await faceSwitch.isVisible()) {
      const checked = await faceSwitch.getAttribute('data-state')
      if (checked !== 'checked') await faceSwitch.click()
    }

    await page.getByRole('button', { name: /Enrollment baru|Tambah enrollment/i }).first().click()
    await page.locator('input[type="file"]').first().setInputFiles(fixturePhoto)
    await page.getByRole('combobox').first().click()
    await page.getByRole('option', { name: /Ahmad Rizki/i }).click()
    await page.getByRole('button', { name: /Simpan enrollment/i }).click()
    await expect(page.getByText(/Enrollment berhasil/i)).toBeVisible({ timeout: 20_000 })

    await page.goto('/auth/sign-in')
    await login(page, studentEmail, studentPassword)
    await page.goto('/karyawan')
    await expect(page.getByRole('button', { name: /Check-in Face ID/i })).toBeVisible({ timeout: 15_000 })
    await page.getByRole('button', { name: /Check-in Face ID/i }).click()
    await page.locator('input[type="file"]').last().setInputFiles(fixturePhoto)
    await page.getByRole('button', { name: /Verifikasi & check-in/i }).click()
    await expect(page.getByText(/Check-in Face ID berhasil|Check-in berhasil/i)).toBeVisible({ timeout: 30_000 })
  })
})
