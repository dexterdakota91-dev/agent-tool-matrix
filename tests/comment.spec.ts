import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());

import { test, expect } from '@playwright/test';

test.describe('Agent Tool Matrix Comment & Feedback Flow', () => {
  let prisma: import('@prisma/client').PrismaClient;

  test.beforeAll(async () => {
    const prismaModule = await import('../src/lib/prisma');
    prisma = prismaModule.prisma;
  });

  test.afterAll(async () => {
    // Optional: cleanup comments created during test runs to keep the database tidy
    try {
      if (prisma) {
        await prisma.comment.deleteMany({
          where: {
            comment: {
              startsWith: 'E2E Comment:'
            }
          }
        });
      }
    } catch (error) {
      console.error('Failed to cleanup E2E comments:', error);
    }
  });

  test('Page loads and form elements are present', async ({ page }) => {
    await page.goto('/comment');

    // Title check
    const heading = page.locator('h2');
    await expect(heading).toContainText('Feedback & Discussions');

    // Input elements checks
    const textarea = page.locator('textarea#comment');
    await expect(textarea).toBeVisible();
    await expect(textarea).toHaveAttribute('placeholder', 'Type your comment here...');

    // Submit button check
    const submitBtn = page.getByRole('button', { name: 'Submit Comment' });
    await expect(submitBtn).toBeVisible();
    await expect(submitBtn).toBeDisabled(); // Initially disabled because field is empty
  });

  test('Submitting feedback displays success state and updates list', async ({ page }) => {
    await page.goto('/comment');

    const randomStr = Math.random().toString(36).substring(7);
    const commentText = `E2E Comment: feedback test run ${randomStr}`;

    const textarea = page.locator('textarea#comment');
    await textarea.fill(commentText);

    // Verify button is now enabled
    const submitBtn = page.getByRole('button', { name: 'Submit Comment' });
    await expect(submitBtn).toBeEnabled();

    // Click submit
    await submitBtn.click();

    // Verify success alert appears
    const successAlert = page.getByText('Comment submitted successfully!');
    await expect(successAlert).toBeVisible({ timeout: 15000 });

    // Verify the comment is rendered in the recent activity list
    const commentCard = page.getByText(commentText);
    await expect(commentCard).toBeVisible();
  });
});
