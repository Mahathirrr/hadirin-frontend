import { defineConfig, devices } from '@playwright/test'

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'https://hadirin.showcaseproject.my.id'
const prodSmoke = process.env.E2E_RUN_PROD === '1' || !baseURL.includes('127.0.0.1')

export default defineConfig({
  testDir: 'e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  timeout: prodSmoke ? 90_000 : 30_000,
  use: {
    baseURL,
    trace: 'on-first-retry',
    navigationTimeout: prodSmoke ? 60_000 : 30_000,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    {
      name: 'mobile-iphone',
      use: {
        ...devices['Desktop Chrome'],
        viewport: devices['iPhone 13'].viewport,
        userAgent: devices['iPhone 13'].userAgent,
        deviceScaleFactor: devices['iPhone 13'].deviceScaleFactor,
        isMobile: true,
        hasTouch: true,
      },
    },
    {
      name: 'mobile-narrow',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 320, height: 568 },
        isMobile: true,
        hasTouch: true,
      },
    },
  ],
  webServer:
    process.env.PLAYWRIGHT_SKIP_WEBSERVER || prodSmoke
      ? undefined
      : {
          command: 'npm run preview -- --host 127.0.0.1 --port 4173',
          url: baseURL,
          reuseExistingServer: !process.env.CI,
        },
})
