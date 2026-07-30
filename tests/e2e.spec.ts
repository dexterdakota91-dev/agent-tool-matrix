import { test, expect } from '@playwright/test';

test.describe('Agent Tool Matrix E2E Test Suite', () => {
  test.describe.configure({ timeout: 60000 });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for the loader / synchronization to finish
    await expect(page.getByText('Syncing with Neon cluster...')).toBeHidden({ timeout: 40000 });
  });

  test('Page loads and elements are present', async ({ page }) => {
    // Check application title
    const title = page.locator('h1');
    await expect(title).toContainText('Agent Tool Matrix');

    // Check search bar presence
    const searchInput = page.getByPlaceholder('Search Tools, Skills, Connectors, or by #tag');
    await expect(searchInput).toBeVisible();

    // Check that we are on the Canvas tab by default
    const canvasBtn = page.getByRole('button', { name: 'Canvas' });
    await expect(canvasBtn).toBeVisible();

    // Check that we have multiple tool cards rendered
    const cardHeadings = page.locator('h3');
    const count = await cardHeadings.count();
    expect(count).toBeGreaterThanOrEqual(6);
  });

  test('Search and filter functionality', async ({ page }) => {
    // Search for Git Master
    const searchInput = page.getByPlaceholder('Search Tools, Skills, Connectors, or by #tag');
    await searchInput.fill('Git Master');

    // Check that Git Master card is visible
    const card = page.locator('h3', { hasText: 'Git Master' }).first();
    await expect(card).toBeVisible();
  });

  test('Selecting a tool card opens detailed view', async ({ page }) => {
    // Search for Git Master first to make it visible and clickable
    const searchInput = page.getByPlaceholder('Search Tools, Skills, Connectors, or by #tag');
    await searchInput.fill('Git Master');

    // Click on Git Master card
    const card = page.locator('h3', { hasText: 'Git Master' }).first();
    await card.click();

    // Verify detail panel elements
    const descTab = page.getByRole('button', { name: 'Description' });
    await expect(descTab).toBeVisible();

    // Click metadata tab
    const metaTab = page.getByRole('button', { name: 'Metadata' });
    await expect(metaTab).toBeVisible();
    await metaTab.click();

    // Verify metadata properties are displayed
    const typeLabel = page.getByText('Type');
    await expect(typeLabel).toBeVisible();

    // Close detail view (select the first one to avoid strict mode violation)
    const clearBtn = page.getByRole('button', { name: 'Clear Selection' }).first();
    await expect(clearBtn).toBeVisible();
    await clearBtn.click();
    await expect(clearBtn).toBeHidden();
  });

  test('Pipeline Builder and Saving Workflow', async ({ page }) => {
    // 1. Navigate to Builder tab
    const builderTab = page.getByRole('button', { name: 'Pipeline Builder' });
    await builderTab.click();

    // 2. Add Git Master to Pipeline from the side node list
    const item = page.locator('div.rounded-xl', { hasText: 'Git Master' }).first();
    await expect(item).toBeVisible();
    const addBtn = item.getByRole('button', { name: 'Add Step' });
    await expect(addBtn).toBeVisible();
    await addBtn.click();

    // Fill workflow metadata
    const testTitle = 'E2E Test Pipeline ' + Math.random().toString(36).substring(7);
    await page.getByPlaceholder('e.g. Design-to-Deploy Code pipeline').fill(testTitle);
    await page.getByPlaceholder('Describe output goals of this pipeline...').fill('E2E automation test run pipeline');

    // Submit workflow save form
    const saveBtn = page.getByRole('button', { name: 'Assemble & Register Pipeline' });
    await expect(saveBtn).toBeVisible();
    await saveBtn.click();

    // Verify navigation automatically goes to Workflows tab or workflow list
    const workflowsTab = page.getByRole('button', { name: 'Workflows' });
    await expect(workflowsTab).toBeVisible();

    // We should be in Workflows tab and see our new pipeline
    const newWorkflowItem = page.locator('h3', { hasText: testTitle }).first();
    await expect(newWorkflowItem).toBeVisible();
  });

  test('Workflow execution simulator runs successfully', async ({ page }) => {
    test.setTimeout(60000);
    // Go to Workflows tab
    const workflowsTab = page.getByRole('button', { name: 'Workflows' });
    await workflowsTab.click();

    // Select the first workflow
    const firstWorkflowHeader = page.locator('h3').first();
    await expect(firstWorkflowHeader).toBeVisible();
    await firstWorkflowHeader.click();

    // Run simulation
    const simulateBtn = page.getByRole('button', { name: 'Simulate Run' });
    await expect(simulateBtn).toBeVisible();
    await simulateBtn.click();

    // Verify simulation finishes successfully by waiting for complete log
    const successLog = page.getByText('PIPELINE EXECUTION COMPLETED WITH STATUS: SUCCESS');
    await expect(successLog).toBeVisible({ timeout: 25000 });
  });

  test('Compilation Cart flow works correctly', async ({ page }) => {
    // 1. Click Git Master to open details view
    const card = page.locator('h3', { hasText: 'Git Master' }).first();
    await card.click();

    // 2. Click "Add to Cart"
    const addToCartBtn = page.getByRole('button', { name: 'Add to Cart' });
    await expect(addToCartBtn).toBeVisible();
    await addToCartBtn.click();

    // 3. Verify it changed to "Remove Cart"
    const removeCartBtn = page.getByRole('button', { name: 'Remove Cart' });
    await expect(removeCartBtn).toBeVisible();

    // 4. Verify "Compile Cart" FAB is visible
    const compileCartBtn = page.getByRole('button', { name: 'Compile Cart' });
    await expect(compileCartBtn).toBeVisible();

    // 5. Click "Remove Cart"
    await removeCartBtn.click();

    // 6. Verify "Compile Cart" FAB is hidden
    await expect(compileCartBtn).toBeHidden();
  });

  test('Settings tab controls user role access levels and creates/revokes API keys', async ({ page }) => {
    // 1. Navigate to Settings tab
    const settingsTab = page.getByRole('button', { name: 'Settings' });
    await settingsTab.click();

    // Verify headers exist
    await expect(page.getByText('ATM Settings & Connection Panel')).toBeVisible();
    await expect(page.getByText('Access Tier Control')).toBeVisible();
    await expect(page.getByText('Neon Serverless Connectivity')).toBeVisible();

    // 2. Locate Role buttons
    const guestBtn = page.getByRole('button', { name: 'Guest (Read-Only)' });
    const adminBtn = page.getByRole('button', { name: 'Administrator' });
    await expect(guestBtn).toBeVisible();
    await expect(adminBtn).toBeVisible();

    // 3. Verify Create Tool button is enabled under Admin
    const createToolBtn = page.getByRole('button', { name: 'Create Tool' });
    await expect(createToolBtn).toBeEnabled();

    // 4. Switch to Guest (Read-Only)
    await guestBtn.click();

    // Verify Create Tool button is now disabled
    await expect(createToolBtn).toBeDisabled();

    // Verify API Key Registration input is disabled
    const apiKeyInput = page.getByPlaceholder('e.g. Claude Code Subagent');
    const generateKeyBtn = page.getByRole('button', { name: 'Generate Key' });
    await expect(apiKeyInput).toBeDisabled();
    await expect(generateKeyBtn).toBeDisabled();

    // 5. Switch back to Administrator
    await adminBtn.click();
    await expect(createToolBtn).toBeEnabled();
    await expect(apiKeyInput).toBeEnabled();

    // The key registration button is initially disabled because the input field is empty
    await expect(generateKeyBtn).toBeDisabled();

    // 6. Generate a new API key
    const testKeyName = 'E2E Test Key ' + Math.random().toString(36).substring(7);
    await apiKeyInput.fill(testKeyName);

    // The button should now be enabled as the input is populated
    await expect(generateKeyBtn).toBeEnabled();
    await generateKeyBtn.click();

    // Wait for the loader / synchronization to finish
    await expect(page.getByText('Syncing with Neon cluster...')).toBeHidden({ timeout: 25000 });

    // Verify generated key alert appears
    const successAlert = page.getByText('API Key Generated Successfully!');
    await expect(successAlert).toBeVisible();

    // Verify the key appears in the list below
    const keyInList = page.getByText(testKeyName);
    await expect(keyInList).toBeVisible();

    // 7. Revoke/delete the generated key
    // Locate the row containing testKeyName and click the delete button inside it
    const row = page.locator('div', { has: page.locator('div', { hasText: testKeyName }) }).locator('button').first();
    await expect(row).toBeVisible();

    // Register a dialog handler to accept the confirm dialog
    page.once('dialog', async dialog => {
      await dialog.accept();
    });
    await row.click();

    // Wait for the loader / synchronization to finish
    await expect(page.getByText('Syncing with Neon cluster...')).toBeHidden({ timeout: 25000 });

    // Verify key disappears from list
    await expect(keyInList).toBeHidden();
  });

});
