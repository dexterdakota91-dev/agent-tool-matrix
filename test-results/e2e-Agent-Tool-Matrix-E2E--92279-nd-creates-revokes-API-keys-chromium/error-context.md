# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e.spec.ts >> Agent Tool Matrix E2E Test Suite >> Settings tab controls user role access levels and creates/revokes API keys
- Location: tests/e2e.spec.ts:147:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('API Key Generated Successfully!')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByText('API Key Generated Successfully!')

```

```yaml
- main:
  - navigation:
    - text: ATM
    - heading "Agent Tool Matrix" [level=1]
    - button "Canvas"
    - button "Pipeline Builder"
    - button "Workflows"
    - button "Settings"
    - button "Toggle theme"
    - button "Create Tool"
  - heading "ATM Settings & Connection Panel" [level=2]
  - paragraph: Audit Neon credentials and customize agent access tiers.
  - heading "Access Tier Control" [level=3]
  - text: Simulator User Identity
  - paragraph: Toggle admin privilege locks to simulate authorization gates.
  - button "Administrator"
  - button "Guest (Read-Only)"
  - heading "Neon Serverless Connectivity" [level=3]
  - text: Neon Cluster Host ep-sweet-sky-ahc8utpw-pooler.c-3.us-east-1.aws.neon.tech Database User neondb_owner Database Engine PostgreSQL 16 (Serverless)
  - heading "Agent Access Tiers & Tokens" [level=3]
  - text: Static Development Token
  - paragraph: Use this token for local agent client development and debugging.
  - code: dev_static_key_12345
  - button "Copy"
  - text: Register External Agent Credentials
  - paragraph: Generate a secure database-backed Bearer API key for production integrations.
  - textbox "e.g. Claude Code Subagent": E2E Test Key e2n90pk
  - button "Generate Key"
  - text: Active Integrations (0) No active custom keys registered.
- region "Notifications alt+T"
- alert
```

# Test source

```ts
  100 |
  101 |   test('Workflow execution simulator runs successfully', async ({ page }) => {
  102 |     test.setTimeout(60000);
  103 |     // Go to Workflows tab
  104 |     const workflowsTab = page.getByRole('button', { name: 'Workflows' });
  105 |     await workflowsTab.click();
  106 |
  107 |     // Select the first workflow
  108 |     const firstWorkflowHeader = page.locator('h3').first();
  109 |     await expect(firstWorkflowHeader).toBeVisible();
  110 |     await firstWorkflowHeader.click();
  111 |
  112 |     // Run simulation
  113 |     const simulateBtn = page.getByRole('button', { name: 'Simulate Run' });
  114 |     await expect(simulateBtn).toBeVisible();
  115 |     await simulateBtn.click();
  116 |
  117 |     // Verify simulation finishes successfully by waiting for complete log
  118 |     const successLog = page.getByText('PIPELINE EXECUTION COMPLETED WITH STATUS: SUCCESS');
  119 |     await expect(successLog).toBeVisible({ timeout: 25000 });
  120 |   });
  121 |
  122 |   test('Compilation Cart flow works correctly', async ({ page }) => {
  123 |     // 1. Click Git Conflict Resolver to open details view
  124 |     const card = page.locator('h3', { hasText: 'Git Conflict Resolver' }).first();
  125 |     await card.click();
  126 |
  127 |     // 2. Click "Add to Cart"
  128 |     const addToCartBtn = page.getByRole('button', { name: 'Add to Cart' });
  129 |     await expect(addToCartBtn).toBeVisible();
  130 |     await addToCartBtn.click();
  131 |
  132 |     // 3. Verify it changed to "Remove Cart"
  133 |     const removeCartBtn = page.getByRole('button', { name: 'Remove Cart' });
  134 |     await expect(removeCartBtn).toBeVisible();
  135 |
  136 |     // 4. Verify "Compile Cart" FAB is visible
  137 |     const compileCartBtn = page.getByRole('button', { name: 'Compile Cart' });
  138 |     await expect(compileCartBtn).toBeVisible();
  139 |
  140 |     // 5. Click "Remove Cart"
  141 |     await removeCartBtn.click();
  142 |
  143 |     // 6. Verify "Compile Cart" FAB is hidden
  144 |     await expect(compileCartBtn).toBeHidden();
  145 |   });
  146 |
  147 |   test('Settings tab controls user role access levels and creates/revokes API keys', async ({ page }) => {
  148 |     // 1. Navigate to Settings tab
  149 |     const settingsTab = page.getByRole('button', { name: 'Settings' });
  150 |     await settingsTab.click();
  151 |
  152 |     // Verify headers exist
  153 |     await expect(page.getByText('ATM Settings & Connection Panel')).toBeVisible();
  154 |     await expect(page.getByText('Access Tier Control')).toBeVisible();
  155 |     await expect(page.getByText('Neon Serverless Connectivity')).toBeVisible();
  156 |
  157 |     // 2. Locate Role buttons
  158 |     const guestBtn = page.getByRole('button', { name: 'Guest (Read-Only)' });
  159 |     const adminBtn = page.getByRole('button', { name: 'Administrator' });
  160 |     await expect(guestBtn).toBeVisible();
  161 |     await expect(adminBtn).toBeVisible();
  162 |
  163 |     // 3. Verify Create Tool button is enabled under Admin
  164 |     const createToolBtn = page.getByRole('button', { name: 'Create Tool' });
  165 |     await expect(createToolBtn).toBeEnabled();
  166 |
  167 |     // 4. Switch to Guest (Read-Only)
  168 |     await guestBtn.click();
  169 |
  170 |     // Verify Create Tool button is now disabled
  171 |     await expect(createToolBtn).toBeDisabled();
  172 |
  173 |     // Verify API Key Registration input is disabled
  174 |     const apiKeyInput = page.getByPlaceholder('e.g. Claude Code Subagent');
  175 |     const generateKeyBtn = page.getByRole('button', { name: 'Generate Key' });
  176 |     await expect(apiKeyInput).toBeDisabled();
  177 |     await expect(generateKeyBtn).toBeDisabled();
  178 |
  179 |     // 5. Switch back to Administrator
  180 |     await adminBtn.click();
  181 |     await expect(createToolBtn).toBeEnabled();
  182 |     await expect(apiKeyInput).toBeEnabled();
  183 |
  184 |     // The key registration button is initially disabled because the input field is empty
  185 |     await expect(generateKeyBtn).toBeDisabled();
  186 |
  187 |     // 6. Generate a new API key
  188 |     const testKeyName = 'E2E Test Key ' + Math.random().toString(36).substring(7);
  189 |     await apiKeyInput.fill(testKeyName);
  190 |
  191 |     // The button should now be enabled as the input is populated
  192 |     await expect(generateKeyBtn).toBeEnabled();
  193 |     await generateKeyBtn.click();
  194 |
  195 |     // Wait for the loader / synchronization to finish
  196 |     await expect(page.getByText('Syncing with Neon cluster...')).toBeHidden({ timeout: 25000 });
  197 |
  198 |     // Verify generated key alert appears
  199 |     const successAlert = page.getByText('API Key Generated Successfully!');
> 200 |     await expect(successAlert).toBeVisible();
      |                                ^ Error: expect(locator).toBeVisible() failed
  201 |
  202 |     // Verify the key appears in the list below
  203 |     const keyInList = page.getByText(testKeyName);
  204 |     await expect(keyInList).toBeVisible();
  205 |
  206 |     // 7. Revoke/delete the generated key
  207 |     // Locate the row containing testKeyName and click the delete button inside it
  208 |     const row = page.locator('div', { has: page.locator('div', { hasText: testKeyName }) }).locator('button').first();
  209 |     await expect(row).toBeVisible();
  210 |
  211 |     // Register a dialog handler to accept the confirm dialog
  212 |     page.once('dialog', async dialog => {
  213 |       await dialog.accept();
  214 |     });
  215 |     await row.click();
  216 |
  217 |     // Wait for the loader / synchronization to finish
  218 |     await expect(page.getByText('Syncing with Neon cluster...')).toBeHidden({ timeout: 25000 });
  219 |
  220 |     // Verify key disappears from list
  221 |     await expect(keyInList).toBeHidden();
  222 |   });
  223 |
  224 | });
  225 |
```