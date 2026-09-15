import { defineConfig, devices } from '@playwright/test';

const hasDatabase = Boolean(process.env.DATABASE_URL || process.env.DATABASE_URL_UNPOOLED);

export default defineConfig({
  testDir: './tests',
  testMatch: hasDatabase
    ? '**/*.spec.ts'
    : [
        '**/auth.spec.ts',
        '**/constants.spec.ts',
        '**/export-utils.spec.ts',
        '**/formatters.spec.ts',
        '**/openapi.spec.ts',
        '**/rate-limit.spec.ts',
        '**/sanitize.spec.ts',
        '**/useCanvasStore.spec.ts',
      ],
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 1, // Use 1 worker to avoid concurrency issues during DB states
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    headless: true,
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: hasDatabase
    ? {
        command: process.env.CI ? 'npm run start' : 'npm run dev',
        url: 'http://localhost:3000',
        reuseExistingServer: !process.env.CI,
        timeout: 120000,
      }
    : undefined,
});
