# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: comment.spec.ts >> Agent Tool Matrix Comment & Feedback Flow >> Submitting feedback displays success state and updates list
- Location: tests/comment.spec.ts:49:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('Comment submitted successfully!')
Expected: visible
Timeout: 15000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 15000ms
  - waiting for getByText('Comment submitted successfully!')

```

```yaml
- alert
- main:
  - navigation:
    - text: ATM
    - heading "Agent Tool Matrix" [level=1]
    - link "Back to Dashboard":
      - /url: /
  - text: Developer Community Hub
  - heading "Feedback & Discussions" [level=2]
  - paragraph: Collaborate, report issues, and suggest new tools or integrations to expand the Agent Tool Matrix capabilities.
  - text: Leave a Comment Share your feedback, ideas, or tool suggestions.
  - textbox "Leave a Comment":
    - /placeholder: Type your comment here...
  - button "Submit Comment"
  - heading "Recent Activity 0" [level=3]
  - heading "No comments yet" [level=4]
  - paragraph: Be the first one to start the conversation! Submit your comment using the feedback form.
- region "Notifications alt+T"
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
  20 |             content: {
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
  36 |     await expect(heading).toContainText('Feedback & Discussions');
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
  57 |     await textarea.evaluate((node) => node.dispatchEvent(new Event("input", { bubbles: true })));
  58 |     await textarea.press("Tab");
  59 |
  60 |     // Verify button is now enabled
  61 |     const submitBtn = page.getByRole('button', { name: 'Submit Comment' });
  62 |     await submitBtn.waitFor({ state: "visible" });
  63 |     await page.waitForTimeout(500);
  64 |     await expect(submitBtn).toBeEnabled();
  65 |
  66 |     // Click submit
  67 |     await submitBtn.click();
  68 |
  69 |     // Verify success alert appears
  70 |     const successAlert = page.getByText('Comment submitted successfully!');
> 71 |     await expect(successAlert).toBeVisible({ timeout: 15000 });
     |                                ^ Error: expect(locator).toBeVisible() failed
  72 |
  73 |     // Verify the comment is rendered in the recent activity list
  74 |     const commentCard = page.getByText(commentText);
  75 |     await expect(commentCard).toBeVisible();
  76 |   });
  77 | });
  78 |
```