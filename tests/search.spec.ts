import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());

import { test, expect } from '@playwright/test';
import { PrismaClient } from '@prisma/client';

const token = process.env.DEV_AGENT_TOKEN || 'dev_static_key_12345';
const authHeaders = {
  'Authorization': `Bearer ${token}`
};

test.describe('Search API Test Suite', () => {
  test.describe.configure({ mode: 'serial' });

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
              startsWith: 'Search API Test'
            }
          }
        });
      }
    } catch (e) {
      console.error('Cleanup failed', e);
    }
  });

  test('Verify 401 Unauthorized when unauthenticated', async ({ request }) => {
    const response = await request.get('/api/tools/search?q=test');
    expect(response.status()).toBe(401);
    const json = await response.json();
    expect(json).toEqual({ error: 'Unauthorized' });
  });

  test('Verify 400 Bad Request when search query q is missing or whitespace only', async ({ request }) => {
    const resMissing = await request.get('/api/tools/search', { headers: authHeaders });
    expect(resMissing.status()).toBe(400);

    const resWhitespace = await request.get('/api/tools/search?q=   ', { headers: authHeaders });
    expect(resWhitespace.status()).toBe(400);
  });

  test('Verify pagination parameters return results and pagination structure', async ({ request }) => {
    // Create some tools to test pagination
    for (let i = 0; i < 7; i++) {
      await prisma.tool.create({
        data: { title: `Search API Test Pagination ${i}`, type: 'prompt', description: 'desc' }
      });
    }

    const response = await request.get('/api/tools/search?q=Search API Test Pagination&page=1&limit=5', { headers: authHeaders });
    expect(response.status()).toBe(200);
    const json = await response.json();

    expect(json.results).toBeDefined();
    expect(Array.isArray(json.results)).toBeTruthy();
    expect(json.results.length).toBeLessThanOrEqual(5);

    expect(json.pagination).toBeDefined();
    expect(json.pagination.total).toBeGreaterThanOrEqual(7);
    expect(json.pagination.page).toBe(1);
    expect(json.pagination.limit).toBe(5);
    expect(json.pagination.totalPages).toBeGreaterThanOrEqual(2);
  });

  test('Verify multi-tag filtering matches tools having either tag', async ({ request }) => {
    // Create tools with specific tags
    await prisma.tool.create({
      data: { title: 'Search API Test Tag 1', type: 'prompt', tags: ['prompt'], description: 'Multi-tag filtering test' }
    });
    await prisma.tool.create({
      data: { title: 'Search API Test Tag 2', type: 'prompt', tags: ['ai'], description: 'Multi-tag filtering test' }
    });
    await prisma.tool.create({
      data: { title: 'Search API Test Tag 3', type: 'prompt', tags: ['other'], description: 'Multi-tag filtering test' }
    });

    const response = await request.get('/api/tools/search?q=Multi-tag filtering test&tags=prompt,ai', { headers: authHeaders });
    expect(response.status()).toBe(200);
    const json = await response.json();

    expect(json.results).toBeDefined();
    expect(Array.isArray(json.results)).toBeTruthy();

    // Should match tools with 'prompt' OR 'ai' tag (Tag 1 and Tag 2)
    const titles = json.results.map((t: { title: string }) => t.title);
    expect(titles).toContain('Search API Test Tag 1');
    expect(titles).toContain('Search API Test Tag 2');
    expect(titles).not.toContain('Search API Test Tag 3');
  });
});
