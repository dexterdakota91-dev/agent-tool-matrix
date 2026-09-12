import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());

import { test, expect } from '@playwright/test';
import { PrismaClient } from '@prisma/client';

const token = process.env.DEV_AGENT_TOKEN || 'dev_static_key_12345';
const authHeaders = {
  'Authorization': `Bearer ${token}`
};

test.describe('API v1 E2E Test Suite', () => {
  test.describe.configure({ mode: 'serial' });

  let prisma: PrismaClient;

  test.beforeAll(async () => {
    const prismaModule = await import('../src/lib/prisma');
    prisma = prismaModule.prisma;
  });

  test.afterAll(async () => {
    try {
      if (prisma) {
        await prisma.workflow.deleteMany({
          where: {
            title: {
              startsWith: 'v1 API Test'
            }
          }
        });
        await prisma.tool.deleteMany({
          where: {
            title: {
              startsWith: 'v1 API Test'
            }
          }
        });
      }
    } catch (e) {
      console.error('Cleanup failed', e);
    }
  });

  test.describe('GET /api/v1/tools', () => {
    test('Verify 401 Unauthorized when Bearer token is missing', async ({ request }) => {
      const response = await request.get('/api/v1/tools');
      expect(response.status()).toBe(401);
      const json = await response.json();
      expect(json).toEqual({ error: 'Unauthorized' });
    });

    test('Verify 401 Unauthorized when Bearer token is invalid', async ({ request }) => {
      const response = await request.get('/api/v1/tools', {
        headers: { 'Authorization': 'Bearer invalid_token' }
      });
      expect(response.status()).toBe(401);
    });

    test('Verify 200 OK and valid JSON array { tools: [...] } when authorized', async ({ request }) => {
      const response = await request.get('/api/v1/tools', { headers: authHeaders });
      expect(response.status()).toBe(200);
      const json = await response.json();
      expect(Array.isArray(json.tools)).toBeTruthy();
    });

    test('Verify query parameter filtering: ?type=prompt, ?type=skill, ?type=mcp, and ?tag=...', async ({ request }) => {
      // Create some tools to filter
      const tool1 = await request.post('/api/v1/tools', {
        headers: authHeaders,
        data: { title: 'v1 API Test Prompt', type: 'prompt', tags: ['tagA'] }
      });
      const tool2 = await request.post('/api/v1/tools', {
        headers: authHeaders,
        data: { title: 'v1 API Test Skill', type: 'skill', tags: ['tagB'] }
      });
      const tool3 = await request.post('/api/v1/tools', {
        headers: authHeaders,
        data: { title: 'v1 API Test MCP', type: 'mcp', tags: ['tagA', 'tagB'] }
      });

      expect(tool1.status()).toBe(201);
      expect(tool2.status()).toBe(201);
      expect(tool3.status()).toBe(201);

      // Filter by type=prompt
      const promptRes = await request.get('/api/v1/tools?type=prompt', { headers: authHeaders });
      const promptJson = await promptRes.json();
      expect(promptJson.tools.every((t: any) => t.type === 'prompt')).toBeTruthy();
      expect(promptJson.tools.some((t: any) => t.title === 'v1 API Test Prompt')).toBeTruthy();

      // Filter by type=skill
      const skillRes = await request.get('/api/v1/tools?type=skill', { headers: authHeaders });
      const skillJson = await skillRes.json();
      expect(skillJson.tools.every((t: any) => t.type === 'skill')).toBeTruthy();
      expect(skillJson.tools.some((t: any) => t.title === 'v1 API Test Skill')).toBeTruthy();

      // Filter by type=mcp
      const mcpRes = await request.get('/api/v1/tools?type=mcp', { headers: authHeaders });
      const mcpJson = await mcpRes.json();
      expect(mcpJson.tools.every((t: any) => t.type === 'mcp')).toBeTruthy();
      expect(mcpJson.tools.some((t: any) => t.title === 'v1 API Test MCP')).toBeTruthy();

      // Filter by tag=tagA
      const tagARes = await request.get('/api/v1/tools?tag=tagA', { headers: authHeaders });
      const tagAJson = await tagARes.json();
      expect(tagAJson.tools.some((t: any) => t.title === 'v1 API Test Prompt')).toBeTruthy();
      expect(tagAJson.tools.some((t: any) => t.title === 'v1 API Test MCP')).toBeTruthy();
      expect(tagAJson.tools.some((t: any) => t.title === 'v1 API Test Skill')).toBeFalsy();
    });
  });

  test.describe('POST /api/v1/tools', () => {
    test('Verify 400 Bad Request when missing required fields (title, type) or invalid type', async ({ request }) => {
      // Missing title
      const res1 = await request.post('/api/v1/tools', {
        headers: authHeaders,
        data: { type: 'prompt' }
      });
      expect(res1.status()).toBe(400);

      // Missing type
      const res2 = await request.post('/api/v1/tools', {
        headers: authHeaders,
        data: { title: 'v1 API Test Tool' }
      });
      expect(res2.status()).toBe(400);

      // Invalid type
      const res3 = await request.post('/api/v1/tools', {
        headers: authHeaders,
        data: { title: 'v1 API Test Tool', type: 'invalid' }
      });
      expect(res3.status()).toBe(400);
    });

    test('Verify 200 OK / 201 Created and persisted tool when valid payload is sent', async ({ request }) => {
      const res = await request.post('/api/v1/tools', {
        headers: authHeaders,
        data: { title: 'v1 API Test New Tool', type: 'prompt', description: 'Test description', markdownContent: '# Test', tags: ['test'] }
      });
      expect(res.status()).toBe(201);
      const json = await res.json();
      expect(json.tool.title).toBe('v1 API Test New Tool');
      expect(json.tool.type).toBe('prompt');
      expect(json.tool.description).toBe('Test description');
      expect(json.tool.markdownContent).toBe('# Test');
      expect(json.tool.tags).toEqual(['test']);
      expect(json.tool.id).toBeDefined();

      // Verify persisted in DB
      const getRes = await request.get('/api/v1/tools', { headers: authHeaders });
      const getJson = await getRes.json();
      expect(getJson.tools.some((t: any) => t.id === json.tool.id)).toBeTruthy();
    });
  });

  test.describe('GET /api/v1/workflows', () => {
    test('Verify 401 Unauthorized without auth', async ({ request }) => {
      const response = await request.get('/api/v1/workflows');
      expect(response.status()).toBe(401);
    });

    test('Verify 200 OK and valid JSON array { workflows: [...] } with nested step tool details when authorized', async ({ request }) => {
      // Create a tool to link to workflow
      const toolRes = await request.post('/api/v1/tools', {
        headers: authHeaders,
        data: { title: 'v1 API Test Tool for Workflow GET', type: 'skill' }
      });
      const toolId = (await toolRes.json()).tool.id;

      // Create a workflow
      const wfRes = await request.post('/api/v1/workflows', {
        headers: authHeaders,
        data: { title: 'v1 API Test Workflow GET', toolIds: [toolId] }
      });
      expect(wfRes.status()).toBe(201);

      // Fetch workflows
      const response = await request.get('/api/v1/workflows', { headers: authHeaders });
      expect(response.status()).toBe(200);
      const json = await response.json();
      expect(Array.isArray(json.workflows)).toBeTruthy();

      const wf = json.workflows.find((w: any) => w.title === 'v1 API Test Workflow GET');
      expect(wf).toBeDefined();
      expect(wf.tools).toBeDefined();
      expect(Array.isArray(wf.tools)).toBeTruthy();
      expect(wf.tools[0].tool.title).toBe('v1 API Test Tool for Workflow GET');
    });
  });

  test.describe('POST /api/v1/workflows', () => {
    test('Verify 400 Bad Request when missing title or toolIds array', async ({ request }) => {
      // Missing title
      const res1 = await request.post('/api/v1/workflows', {
        headers: authHeaders,
        data: { toolIds: [] }
      });
      expect(res1.status()).toBe(400);

      // Missing toolIds
      const res2 = await request.post('/api/v1/workflows', {
        headers: authHeaders,
        data: { title: 'v1 API Test Workflow POST' }
      });
      expect(res2.status()).toBe(400);

      // toolIds not an array
      const res3 = await request.post('/api/v1/workflows', {
        headers: authHeaders,
        data: { title: 'v1 API Test Workflow POST', toolIds: 'not_array' }
      });
      expect(res3.status()).toBe(400);
    });

    test('Verify handling when nonexistent toolIds are passed', async ({ request }) => {
      // Must use a valid UUID string for the nonexistent id to avoid Prisma type errors
      const validUuidNonexistent = '00000000-0000-0000-0000-000000000000';
      const res = await request.post('/api/v1/workflows', {
        headers: authHeaders,
        data: { title: 'v1 API Test Workflow POST', toolIds: [validUuidNonexistent] }
      });
      expect(res.status()).toBe(400);
      const json = await res.json();
      expect(json.error).toContain('do not exist in the database');
    });

    test('Verify successful creation with valid toolIds', async ({ request }) => {
      // Create a tool to link to workflow
      const toolRes = await request.post('/api/v1/tools', {
        headers: authHeaders,
        data: { title: 'v1 API Test Tool for Workflow POST', type: 'skill' }
      });
      const toolId = (await toolRes.json()).tool.id;

      // Create a workflow
      const wfRes = await request.post('/api/v1/workflows', {
        headers: authHeaders,
        data: { title: 'v1 API Test Workflow POST Success', description: 'Test description', toolIds: [toolId] }
      });
      expect(wfRes.status()).toBe(201);
      const json = await wfRes.json();

      expect(json.workflow.title).toBe('v1 API Test Workflow POST Success');
      expect(json.workflow.description).toBe('Test description');
      expect(json.workflow.tools.length).toBe(1);
      expect(json.workflow.tools[0].toolId).toBe(toolId);
    });
  });
});
