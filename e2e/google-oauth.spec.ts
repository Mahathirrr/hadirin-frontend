import { test, expect } from '@playwright/test'

const apiBase = (process.env.API_BASE ?? 'https://hadirin.showcaseproject.my.id/api').replace(/\/$/, '')

test.describe('Google OAuth (production)', () => {
  test('API status enabled', async ({ request }) => {
    test.skip(!process.env.E2E_RUN_PROD, 'Set E2E_RUN_PROD=1')
    const res = await request.get(`${apiBase}/auth/google/status`)
    expect(res.ok()).toBeTruthy()
    const body = await res.json()
    expect(body.enabled).toBe(true)
    expect(body.url).toBe('/api/auth/google/start')
  })

  test('start redirect ke Google + cookie oauth_state', async ({ request }) => {
    test.skip(!process.env.E2E_RUN_PROD, 'Set E2E_RUN_PROD=1')
    const res = await request.get(`${apiBase}/auth/google/start`, { maxRedirects: 0 })
    expect([302, 307]).toContain(res.status())
    const loc = res.headers()['location'] ?? ''
    expect(loc).toMatch(/accounts\.google\.com/)
    expect(loc).toContain('client_id=')
    const cookies = res.headers()['set-cookie'] ?? ''
    expect(cookies).toMatch(/oauth_state=/)
  })

  test('UI: tombol Masuk dengan Google aktif', async ({ page }) => {
    test.skip(!process.env.E2E_RUN_PROD, 'Set E2E_RUN_PROD=1')
    await page.goto('/auth/sign-in', { waitUntil: 'domcontentloaded' })
    const btn = page.getByRole('button', { name: /Masuk dengan Google/i })
    await expect(btn).toBeEnabled({ timeout: 15_000 })
  })
})
