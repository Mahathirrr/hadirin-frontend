import { test, expect } from '@playwright/test'

test('landing page memuat judul Hadirin', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('link', { name: /Hadirin/i }).first()).toBeVisible()
})

test('halaman sign-in memuat form', async ({ page }) => {
  await page.goto('/auth/sign-in')
  await expect(page.getByRole('heading', { name: /Masuk ke akun Hadirin/i })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Masuk', exact: true })).toBeVisible()
})

test.describe('authenticated', () => {
  test.skip(!process.env.E2E_EMAIL || !process.env.E2E_PASSWORD, 'Set E2E_EMAIL dan E2E_PASSWORD')

  test('login dan buka ringkasan', async ({ page }) => {
    await page.goto('/auth/sign-in')
    await page.getByLabel(/email/i).fill(process.env.E2E_EMAIL!)
    await page.getByLabel(/password|kata sandi/i).fill(process.env.E2E_PASSWORD!)
    await page.getByRole('button', { name: /masuk|sign in|login/i }).click()
    await page.waitForURL(/summary|onboarding/, { timeout: 20000 })
    if (page.url().includes('onboarding')) {
      test.skip(true, 'Akun belum punya workspace')
    }
    await expect(page).toHaveURL(/summary/)
  })
})
