# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: comment.spec.ts >> Agent Tool Matrix Comment & Feedback Flow >> Page loads and form elements are present
- Location: tests\comment.spec.ts:31:7

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: locator('h2')
Expected substring: "Feedback & Discussions"
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toContainText" with timeout 5000ms
  - waiting for locator('h2')

```

```yaml
- img
- heading "This page couldn’t load" [level=1]
- paragraph: A server error occurred. Reload to try again.
- button "Reload"
- paragraph: ERROR 3551523559
```

# Test source

```ts
  1  | ﻿import { loadEnvConfig } from '@next/env';
  2  | loadEnvConfig(process.cwd());
  3  | 
  4  | import { test, expect } from '@playwright/test';
  5  | 
  6  | test.describe('Agent Tool Matrix Comment & Feedback Flow', () => {
  7  |   let prisma: import('@prisma/client').PrismaClient;
  8  | 
  9  |   test.beforeAll(async () => {
  10 |     const prismaModule = await import('../src/lib/prisma');
  11 |     prisma = prismaModule.prisma;
  12 |   });
  13 | 
  14 |   test.afterAll(async () => {
  15 |     // Optional: cleanup comments created during test runs to keep the database tidy
  16 |     try {
  17 |       if (prisma) {
  18 |         await prisma.comment.deleteMany({
  19 |           where: {
  20 |             comment: {
  21 |               startsWith: 'E2E Comment:'
  22 |             }
  23 |           }
  24 |         });
  25 |       }
  26 |     } catch (error) {
  27 |       console.error('Failed to cleanup E2E comments:', error);
  28 |     }
  29 |   });
  30 | 
  31 |   test('Page loads and form elements are present', async ({ page }) => {
  32 |     await page.goto('/comment');
  33 | 
  34 |     // Title check
  35 |     const heading = page.locator('h2');
> 36 |     await expect(heading).toContainText('Feedback & Discussions');
     |                           ^ Error: expect(locator).toContainText(expected) failed
  37 | 
  38 |     // Input elements checks
  39 |     const textarea = page.locator('textarea#comment');
  40 |     await expect(textarea).toBeVisible();
  41 |     await expect(textarea).toHaveAttribute('placeholder', 'Type your comment here...');
  42 | 
  43 |     // Submit button check
  44 |     const submitBtn = page.getByRole('button', { name: 'Submit Comment' });
  45 |     await expect(submitBtn).toBeVisible();
  46 |     await expect(submitBtn).toBeDisabled(); // Initially disabled because field is empty
  47 |   });
  48 | 
  49 |   test('Submitting feedback displays success state and updates list', async ({ page }) => {
  50 |     await page.goto('/comment');
  51 | 
  52 |     const randomStr = Math.random().toString(36).substring(7);
  53 |     const commentText = `E2E Comment: feedback test run ${randomStr}`;
  54 | 
  55 |     const textarea = page.locator('textarea#comment');
  56 |     await textarea.fill(commentText);
  57 | 
  58 |     // Verify button is now enabled
  59 |     const submitBtn = page.getByRole('button', { name: 'Submit Comment' });
  60 |     await expect(submitBtn).toBeEnabled();
  61 | 
  62 |     // Click submit
  63 |     await submitBtn.click();
  64 | 
  65 |     // Verify success alert appears
  66 |     const successAlert = page.getByText('Comment submitted successfully!');
  67 |     await expect(successAlert).toBeVisible({ timeout: 15000 });
  68 | 
  69 |     // Verify the comment is rendered in the recent activity list
  70 |     const commentCard = page.getByText(commentText);
  71 |     await expect(commentCard).toBeVisible();
  72 |   });
  73 | });
  74 | 
```