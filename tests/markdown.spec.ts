import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());

import { test, expect } from '@playwright/test';

test.describe('Markdown Rendering Security constraints', () => {
  test.describe.configure({ timeout: 60000 });

  let prisma: import('@prisma/client').PrismaClient;
  const toolTitle = 'Markdown Security Test Tool ' + Math.random().toString(36).substring(7);

  test.beforeAll(async () => {
    const prismaModule = await import('../src/lib/prisma');
    prisma = prismaModule.prisma;

    await prisma.tool.create({
      data: {
        title: toolTitle,
        type: 'prompt',
        description: 'Testing Markdown rendering constraints.',
        markdownContent: `
Here is a normal paragraph.

[External Link](https://example.com)

<script>alert("xss")</script>
<img src="x" onerror="alert('xss')" />
<b>Safe HTML is removed or escaped</b>

\`\`\`javascript
const x = 1;
\`\`\`
`,
      },
    });
  });

  test.afterAll(async () => {
    try {
      if (prisma) {
        await prisma.tool.deleteMany({
          where: {
            title: toolTitle,
          },
        });
      }
    } catch (err) {
      console.error('Failed to cleanup markdown test tools:', err);
    }
  });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for the loader / synchronization to finish
    await expect(page.getByText('Syncing with Neon cluster...')).toBeHidden({ timeout: 40000 });
  });

  test('Verify Markdown link, script sanitization, and code block rendering', async ({ page }) => {
    // 1. Search for the created tool
    const searchInput = page.getByPlaceholder('Search Tools, Skills, Connectors, or by #tag');
    await searchInput.fill(toolTitle);

    // 2. Click the tool card
    const card = page.getByRole('heading', { name: toolTitle, exact: true }).first();
    await expect(card).toBeVisible();
    await card.click();

    // 3. Ensure the SlideOutInspector opened by checking for the specific title
    const inspectorTitle = page.getByRole('button', { name: 'Description' });
    await expect(inspectorTitle).toBeVisible();

    // 4. Test Requirement 1: Verify external links have target="_blank" and rel="noopener noreferrer"
    const implementationTab = page.getByRole('button', { name: 'Code / Data' });
    await expect(implementationTab).toBeVisible();
    await implementationTab.click();

    const externalLink = page.locator('a:has-text("External Link")').first();
    await expect(externalLink).toBeVisible();
    await expect(externalLink).toHaveAttribute('target', '_blank');
    await expect(externalLink).toHaveAttribute('rel', 'noopener noreferrer');

    // 5. Test Requirement 2: Verify script tags and malicious HTML are sanitized
    // Wait for markdown renderer to render content
    const markdownContainer = page.locator('.font-sans').last();
    await expect(markdownContainer).toBeVisible();

    const scriptTags = markdownContainer.locator('script');
    expect(await scriptTags.count()).toBe(0);

    // Using evaluate to check if an image onerror was executed or injected as raw html
    // isomorph-dompurify strips it out entirely if configured, or escapes it.
    // Ensure the img tag with onerror is not present.
    const imgTags = markdownContainer.locator('img');
    expect(await imgTags.count()).toBe(0);

    // Check that we see the text but not raw active elements
    // The `<script>alert("xss")</script>` might be rendered as text if escaped or completely removed.
    // We just verify there are no active script nodes.

    // 6. Test Requirement 3: Verify code blocks and preformatted text display
    const preTag = markdownContainer.locator('pre');
    await expect(preTag).toBeVisible();

    const codeTag = preTag.locator('code');
    await expect(codeTag).toBeVisible();
    await expect(codeTag).toHaveClass(/javascript/);
    await expect(codeTag).toContainText('const x = 1;');
  });
});
