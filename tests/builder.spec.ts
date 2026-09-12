import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());

import { test, expect } from '@playwright/test';

test.describe('Workflow Pipeline Builder Tab E2E Test Suite', () => {
  test.describe.configure({ timeout: 60000 });

  let prisma: import('@prisma/client').PrismaClient;

  test.beforeAll(async () => {
    const prismaModule = await import('../src/lib/prisma');
    prisma = prismaModule.prisma;
  });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for the loader / synchronization to finish
    await expect(page.getByText('Syncing with Neon cluster...')).toBeHidden({ timeout: 40000 });
  });

  test('Builder tab initialization and empty state display', async ({ page }) => {
    // Navigate to Builder tab
    const builderTab = page.getByRole('button', { name: 'Pipeline Builder' });
    await builderTab.click();

    // Verify structural headers
    await expect(page.getByText('Select Component Nodes')).toBeVisible();
    await expect(page.getByText('Active Pipeline Sequence')).toBeVisible();

    // Verify search functionality UI exists
    const searchInput = page.getByPlaceholder('Filter node list...');
    await expect(searchInput).toBeVisible();

    // Verify empty state display
    await expect(page.getByText('Pipeline Queue is Empty')).toBeVisible();
    await expect(page.getByText('Quick Suggestions')).toBeVisible();
  });

  test('Adding, reordering, and removing steps in the pipeline', async ({ page }) => {
    // Navigate to Builder tab
    const builderTab = page.getByRole('button', { name: 'Pipeline Builder' });
    await builderTab.click();

    // Add multiple tools to create a sequence
    const addBtns = page.getByRole('button', { name: 'Add Step' });

    // Check if we have at least 2 tools available
    const toolsCount = await addBtns.count();
    if (toolsCount < 2) {
      test.skip(true, 'Not enough tools available to test pipeline builder');
    }

    // Add first step
    await addBtns.nth(0).click();
    // Add second step
    await addBtns.nth(1).click();

    // Ensure the empty state is hidden
    await expect(page.getByText('Pipeline Queue is Empty')).toBeHidden();

    // Verify step counter markers
    await expect(page.getByText('1', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('2', { exact: true }).first()).toBeVisible();

    // Test moving the first step down
    const moveDownBtns = page.getByRole('button', { name: 'Move step down' });
    const moveUpBtns = page.getByRole('button', { name: 'Move step up' });
    const removeBtns = page.getByRole('button', { name: 'Remove step' });

    // Initial sequence checks
    await expect(moveDownBtns).toHaveCount(2);

    // First step can move down but not up
    await expect(moveUpBtns.nth(0)).toBeDisabled();
    await expect(moveDownBtns.nth(0)).toBeEnabled();

    // Click move down on the first step
    await moveDownBtns.nth(0).click();

    // The order should now be flipped, the new first step (previously second) should have move up disabled
    await expect(moveUpBtns.nth(0)).toBeDisabled();

    // Test removing a step (remove the second step in the sequence)
    await removeBtns.nth(1).click();

    // Verify length of sequence decreased (only 1 remove button left)
    await expect(page.getByRole('button', { name: 'Remove step' })).toHaveCount(1);

    // Verify only '1' step marker is present
    await expect(page.getByText('1', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('2', { exact: true }).first()).toBeHidden();
  });

  test('Clearing all steps from the pipeline', async ({ page }) => {
    // Navigate to Builder tab
    const builderTab = page.getByRole('button', { name: 'Pipeline Builder' });
    await builderTab.click();

    // Add a tool to create a sequence
    const addBtns = page.getByRole('button', { name: 'Add Step' });
    await addBtns.first().click();

    // Ensure step was added
    await expect(page.getByText('Pipeline Queue is Empty')).toBeHidden();

    // Click Clear All
    const clearAllBtn = page.getByRole('button', { name: 'Clear All' });
    await expect(clearAllBtn).toBeVisible();
    await clearAllBtn.click();

    // Verify the pipeline returned to empty state
    await expect(page.getByText('Pipeline Queue is Empty')).toBeVisible();
    await expect(page.getByText('Quick Suggestions')).toBeVisible();
  });
});
