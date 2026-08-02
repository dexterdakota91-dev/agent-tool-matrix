# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e.spec.ts >> Agent Tool Matrix E2E Test Suite >> Workflow execution simulator runs successfully
- Location: tests/e2e.spec.ts:101:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('button', { name: 'Simulate Run' })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByRole('button', { name: 'Simulate Run' })

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
  - heading "Saved Workflows" [level=2]
  - paragraph: Select a workflow to load into the interactive simulation debugger.
  - heading "No Workflows Registered" [level=3]
  - paragraph: Go to the Builder tab to design and register your first automated pipeline.
  - heading "Interactive Simulator" [level=3]
  - paragraph: Select a pipeline from the left pane to view execution steps and run code tests.
- region "Notifications alt+T"
- alert
```

# Test source

```ts
  14  |     const title = page.locator('h1');
  15  |     await expect(title).toContainText('Agent Tool Matrix');
  16  |
  17  |     // Check search bar presence
  18  |     const searchInput = page.getByPlaceholder('Search Tools, Skills, Connectors, or by #tag');
  19  |     await expect(searchInput).toBeVisible();
  20  |
  21  |     // Check that we are on the Canvas tab by default
  22  |     const canvasBtn = page.getByRole('button', { name: 'Canvas' });
  23  |     await expect(canvasBtn).toBeVisible();
  24  |
  25  |     // Check that we have multiple tool cards rendered
  26  |     const cardHeadings = page.locator('h3');
  27  |     const count = await cardHeadings.count();
  28  |     expect(count).toBeGreaterThanOrEqual(6);
  29  |   });
  30  |
  31  |   test('Search and filter functionality', async ({ page }) => {
  32  |     // Search for Git Conflict Resolver
  33  |     const searchInput = page.getByPlaceholder('Search Tools, Skills, Connectors, or by #tag');
  34  |     await searchInput.fill('Git Conflict Resolver');
  35  |
  36  |     // Check that Git Conflict Resolver card is visible
  37  |     const card = page.locator('h3', { hasText: 'Git Conflict Resolver' }).first();
  38  |     await expect(card).toBeVisible();
  39  |   });
  40  |
  41  |   test('Selecting a tool card opens detailed view', async ({ page }) => {
  42  |     // Search for Git Conflict Resolver first to make it visible and clickable
  43  |     const searchInput = page.getByPlaceholder('Search Tools, Skills, Connectors, or by #tag');
  44  |     await searchInput.fill('Git Conflict Resolver');
  45  |
  46  |     // Click on Git Conflict Resolver card
  47  |     const card = page.locator('h3', { hasText: 'Git Conflict Resolver' }).first();
  48  |     await card.click();
  49  |
  50  |     // Verify detail panel elements
  51  |     const descTab = page.getByRole('button', { name: 'Description' });
  52  |     await expect(descTab).toBeVisible();
  53  |
  54  |     // Click metadata tab
  55  |     const metaTab = page.getByRole('button', { name: 'Metadata' });
  56  |     await expect(metaTab).toBeVisible();
  57  |     await metaTab.click();
  58  |
  59  |     // Verify metadata properties are displayed
  60  |     const typeLabel = page.getByText('Type');
  61  |     await expect(typeLabel).toBeVisible();
  62  |
  63  |     // Close detail view (select the first one to avoid strict mode violation)
  64  |     const clearBtn = page.getByRole('button', { name: 'Clear Selection' }).first();
  65  |     await expect(clearBtn).toBeVisible();
  66  |     await clearBtn.click();
  67  |     await expect(clearBtn).toBeHidden();
  68  |   });
  69  |
  70  |   test('Pipeline Builder and Saving Workflow', async ({ page }) => {
  71  |     // 1. Navigate to Builder tab
  72  |     const builderTab = page.getByRole('button', { name: 'Pipeline Builder' });
  73  |     await builderTab.click();
  74  |
  75  |     // 2. Add Git Conflict Resolver to Pipeline from the side node list
  76  |     const item = page.locator('div.rounded-xl', { hasText: 'Git Conflict Resolver' }).first();
  77  |     await expect(item).toBeVisible();
  78  |     const addBtn = item.getByRole('button', { name: 'Add Step' });
  79  |     await expect(addBtn).toBeVisible();
  80  |     await addBtn.click();
  81  |
  82  |     // Fill workflow metadata
  83  |     const testTitle = 'E2E Test Pipeline ' + Math.random().toString(36).substring(7);
  84  |     await page.getByPlaceholder('e.g. Design-to-Deploy Code pipeline').fill(testTitle);
  85  |     await page.getByPlaceholder('Describe output goals of this pipeline...').fill('E2E automation test run pipeline');
  86  |
  87  |     // Submit workflow save form
  88  |     const saveBtn = page.getByRole('button', { name: 'Assemble & Register Pipeline' });
  89  |     await expect(saveBtn).toBeVisible();
  90  |     await saveBtn.click();
  91  |
  92  |     // Verify navigation automatically goes to Workflows tab or workflow list
  93  |     const workflowsTab = page.getByRole('button', { name: 'Workflows' });
  94  |     await expect(workflowsTab).toBeVisible();
  95  |
  96  |     // We should be in Workflows tab and see our new pipeline
  97  |     const newWorkflowItem = page.locator('h3', { hasText: testTitle }).first();
  98  |     await expect(newWorkflowItem).toBeVisible();
  99  |   });
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
> 114 |     await expect(simulateBtn).toBeVisible();
      |                               ^ Error: expect(locator).toBeVisible() failed
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
  200 |     await expect(successAlert).toBeVisible();
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
```