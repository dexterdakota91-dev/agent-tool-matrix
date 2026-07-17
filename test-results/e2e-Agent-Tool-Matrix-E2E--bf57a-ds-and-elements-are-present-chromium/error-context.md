# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e.spec.ts >> Agent Tool Matrix E2E Test Suite >> Page loads and elements are present
- Location: tests\e2e.spec.ts:12:7

# Error details

```
Error: expect(received).toBeGreaterThanOrEqual(expected)

Expected: >= 6
Received:    1
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - main [ref=e3]:
      - navigation [ref=e4]:
        - generic [ref=e5]:
          - generic [ref=e6]: ATM
          - heading "Agent Tool Matrix" [level=1] [ref=e8]
        - generic [ref=e9]:
          - button "Canvas" [ref=e10]:
            - img [ref=e11]
            - generic [ref=e14]: Canvas
          - button "Pipeline Builder" [ref=e15]:
            - img [ref=e16]
            - generic [ref=e20]: Pipeline Builder
          - button "Workflows" [ref=e21]:
            - img [ref=e22]
            - generic [ref=e26]: Workflows
          - button "Settings" [ref=e27]:
            - img [ref=e28]
            - generic [ref=e31]: Settings
        - generic [ref=e32]:
          - link "Feedback Hub" [ref=e33] [cursor=pointer]:
            - /url: /comment
            - img [ref=e34]
            - generic [ref=e36]: Feedback Hub
          - button "Toggle theme" [ref=e37]:
            - img [ref=e38]
            - generic [ref=e44]: Toggle theme
          - button "Create Tool" [ref=e45]:
            - img [ref=e46]
            - generic [ref=e47]: Create Tool
      - generic [ref=e49]:
        - generic [ref=e50]:
          - generic [ref=e51]:
            - button "All" [ref=e52]
            - button "Prompts" [ref=e53]
            - button "Skills" [ref=e54]
            - button "MCPs" [ref=e55]
          - generic [ref=e56]:
            - img [ref=e57]
            - 'textbox "Search Tools, Skills, Connectors, or by #tag" [ref=e60]'
        - generic [ref=e61]:
          - img [ref=e62]
          - heading "No Tools Found" [level=3] [ref=e64]
          - paragraph [ref=e65]: Try altering your search or filter pills, or create a custom tool.
    - region "Notifications alt+T"
  - button "Open Next.js Dev Tools" [ref=e71] [cursor=pointer]:
    - img [ref=e72]
  - alert [ref=e75]
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | test.describe('Agent Tool Matrix E2E Test Suite', () => {
  4   |   test.describe.configure({ timeout: 60000 });
  5   | 
  6   |   test.beforeEach(async ({ page }) => {
  7   |     await page.goto('/');
  8   |     // Wait for the loader / synchronization to finish
  9   |     await expect(page.getByText('Syncing with Neon cluster...')).toBeHidden({ timeout: 40000 });
  10  |   });
  11  | 
  12  |   test('Page loads and elements are present', async ({ page }) => {
  13  |     // Check application title
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
> 28  |     expect(count).toBeGreaterThanOrEqual(6);
      |                   ^ Error: expect(received).toBeGreaterThanOrEqual(expected)
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
  72  |     const builderTab = page.getByRole('button', { name: 'Builder' });
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
```