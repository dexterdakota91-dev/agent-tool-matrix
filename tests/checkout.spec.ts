import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());

import { test, expect } from '@playwright/test';
import type { PrismaClient } from '@prisma/client';

test.describe('Batch Tool Checkout API Test Suite', () => {
  let prisma: PrismaClient;

  test.beforeAll(async () => {
    const prismaModule = await import('../src/lib/prisma');
    prisma = prismaModule.prisma;
  });

  test.afterAll(async () => {
    try {
      if (prisma) {
        await prisma.tool.deleteMany({
          where: {
            title: {
              startsWith: 'Checkout Test Tool'
            }
          }
        });
      }
    } catch (err) {
      console.error('Failed to cleanup API test tools:', err);
    }
  });

  const token = 'dev_static_key_12345';
  let tool1Id: string;
  let tool2Id: string;

  test.beforeAll(async () => {
    const tool1 = await prisma.tool.create({
      data: {
        title: 'Checkout Test Tool 1',
        type: 'prompt',
        description: 'First test tool',
        markdownContent: 'Content 1'
      }
    });
    tool1Id = tool1.id;

    const tool2 = await prisma.tool.create({
      data: {
        title: 'Checkout Test Tool 2',
        type: 'prompt',
        description: 'Second test tool',
        markdownContent: 'Content 2'
      }
    });
    tool2Id = tool2.id;
  });

  test('1. Verify 401 Unauthorized when auth token is missing or invalid', async ({ request }) => {
    // Missing token
    const missingTokenRes = await request.get(`/api/tools/checkout?id=${tool1Id}`);
    expect(missingTokenRes.status()).toBe(401);

    // Invalid token
    const invalidTokenRes = await request.get(`/api/tools/checkout?id=${tool1Id}`, {
      headers: {
        'Authorization': 'Bearer invalid_token'
      }
    });
    expect(invalidTokenRes.status()).toBe(401);
  });

  test('2. Verify GET with single ?id=... returns raw markdown content', async ({ request }) => {
    const response = await request.get(`/api/tools/checkout?id=${tool1Id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    expect(response.status()).toBe(200);
    const contentType = response.headers()['content-type'];
    expect(contentType).toContain('text/plain');

    const text = await response.text();
    expect(text).toBe('Content 1');
  });

  test('3. Verify GET with comma-separated ?ids=id1,id2 returns bundled markdown with clean section dividers', async ({ request }) => {
    const response = await request.get(`/api/tools/checkout?ids=${tool1Id},${tool2Id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    expect(response.status()).toBe(200);
    const contentType = response.headers()['content-type'];
    expect(contentType).toContain('text/plain');

    const text = await response.text();
    expect(text).toContain('# Checkout Test Tool 1\n\nContent 1');
    expect(text).toContain('\n\n---\n\n');
    expect(text).toContain('# Checkout Test Tool 2\n\nContent 2');
  });

  test('4. Verify POST with JSON { toolIds: [...] } returns structured JSON response with tools array', async ({ request }) => {
    const response = await request.post(`/api/tools/checkout`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      },
      data: {
        toolIds: [tool1Id, tool2Id]
      }
    });
    expect(response.status()).toBe(200);

    const json = await response.json();
    expect(json.count).toBe(2);
    expect(Array.isArray(json.tools)).toBe(true);
    expect(json.tools.length).toBe(2);

    const fetchedTool1 = json.tools.find((t: { id: string, title: string, markdownContent: string }) => t.id === tool1Id);
    expect(fetchedTool1).toBeDefined();
    expect(fetchedTool1.title).toBe('Checkout Test Tool 1');
    expect(fetchedTool1.markdownContent).toBe('Content 1');
  });

  test('5. Verify 404 response when nonexistent tool ID is requested', async ({ request }) => {
    // Note: use a valid UUID to avoid Prisma type errors as per instructions
    const fakeId = '00000000-0000-0000-0000-000000000000';
    const response = await request.get(`/api/tools/checkout?id=${fakeId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    expect(response.status()).toBe(404);
  });
});
