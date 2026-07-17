# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: api.spec.ts >> Agent Tool Matrix API & MCP E2E Test Suite >> GET /api/v1/tools - authorized
- Location: tests\api.spec.ts:17:7

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 200
Received: 500
```

# Test source

```ts
  1   | ﻿import { test, expect } from '@playwright/test';
  2   | 
  3   | test.describe('Agent Tool Matrix API & MCP E2E Test Suite', () => {
  4   |   // Guarantee serial execution to preserve tool creation ID across tests
  5   |   test.describe.configure({ mode: 'serial' });
  6   | 
  7   |   const token = 'dev_static_key_12345';
  8   |   let createdToolId: string;
  9   |   let createdToolTitle: string;
  10  |   let createdWorkflowId: string;
  11  | 
  12  |   test('GET /api/v1/tools - unauthorized without key', async ({ request }) => {
  13  |     const response = await request.get('/api/v1/tools');
  14  |     expect(response.status()).toBe(401);
  15  |   });
  16  | 
  17  |   test('GET /api/v1/tools - authorized', async ({ request }) => {
  18  |     const response = await request.get('/api/v1/tools', {
  19  |       headers: {
  20  |         'Authorization': `Bearer ${token}`
  21  |       }
  22  |     });
> 23  |     expect(response.status()).toBe(200);
      |                               ^ Error: expect(received).toBe(expected) // Object.is equality
  24  |     const body = await response.json();
  25  |     expect(body.tools).toBeDefined();
  26  |     expect(Array.isArray(body.tools)).toBe(true);
  27  |   });
  28  | 
  29  |   test('POST /api/v1/tools - create tool programmatically', async ({ request }) => {
  30  |     createdToolTitle = 'API Test Tool ' + Math.random().toString(36).substring(7);
  31  |     const payload = {
  32  |       title: createdToolTitle,
  33  |       type: 'prompt',
  34  |       description: 'Programmatic API test tool description',
  35  |       markdownContent: 'API Test Prompt content: hello {{input}}',
  36  |       tags: ['test', 'api']
  37  |     };
  38  | 
  39  |     const response = await request.post('/api/v1/tools', {
  40  |       headers: {
  41  |         'Authorization': `Bearer ${token}`
  42  |       },
  43  |       data: payload
  44  |     });
  45  | 
  46  |     expect(response.status()).toBe(201);
  47  |     const body = await response.json();
  48  |     expect(body.tool).toBeDefined();
  49  |     expect(body.tool.title).toBe(payload.title);
  50  |     expect(body.tool.id).toBeDefined();
  51  |     createdToolId = body.tool.id;
  52  |   });
  53  | 
  54  |   test('GET /api/tools/search - search for created tool', async ({ request }) => {
  55  |     expect(createdToolId).toBeDefined();
  56  |     
  57  |     // Test unauthorized search
  58  |     const badRes = await request.get(`/api/tools/search?q=${encodeURIComponent(createdToolTitle)}`);
  59  |     expect(badRes.status()).toBe(401);
  60  | 
  61  |     // Test authorized search
  62  |     const response = await request.get(`/api/tools/search?q=${encodeURIComponent(createdToolTitle)}`, {
  63  |       headers: {
  64  |         'Authorization': `Bearer ${token}`
  65  |       }
  66  |     });
  67  |     expect(response.status()).toBe(200);
  68  |     const body = await response.json();
  69  |     expect(body.results).toBeDefined();
  70  |     expect(body.results.length).toBeGreaterThanOrEqual(1);
  71  |     expect(body.results[0].id).toBe(createdToolId);
  72  |   });
  73  | 
  74  |   test('GET /api/tools/checkout - checkout created tool', async ({ request }) => {
  75  |     expect(createdToolId).toBeDefined();
  76  | 
  77  |     // Test unauthorized checkout
  78  |     const badRes = await request.get(`/api/tools/checkout?id=${createdToolId}`);
  79  |     expect(badRes.status()).toBe(401);
  80  | 
  81  |     // Test authorized checkout
  82  |     const response = await request.get(`/api/tools/checkout?id=${createdToolId}`, {
  83  |       headers: {
  84  |         'Authorization': `Bearer ${token}`
  85  |       }
  86  |     });
  87  |     expect(response.status()).toBe(200);
  88  |     const content = await response.text();
  89  |     expect(content).toBe('API Test Prompt content: hello {{input}}');
  90  |   });
  91  | 
  92  |   test('POST /api/v1/workflows - create workflow programmatically', async ({ request }) => {
  93  |     expect(createdToolId).toBeDefined();
  94  | 
  95  |     const payload = {
  96  |       title: 'API Test Workflow ' + Math.random().toString(36).substring(7),
  97  |       description: 'Programmatic workflow description',
  98  |       toolIds: [createdToolId]
  99  |     };
  100 | 
  101 |     const response = await request.post('/api/v1/workflows', {
  102 |       headers: {
  103 |         'Authorization': `Bearer ${token}`
  104 |       },
  105 |       data: payload
  106 |     });
  107 | 
  108 |     expect(response.status()).toBe(201);
  109 |     const body = await response.json();
  110 |     expect(body.workflow).toBeDefined();
  111 |     expect(body.workflow.title).toBe(payload.title);
  112 |     expect(body.workflow.tools.length).toBe(1);
  113 |     expect(body.workflow.tools[0].toolId).toBe(createdToolId);
  114 |     createdWorkflowId = body.workflow.id;
  115 |   });
  116 | 
  117 |   test('POST /api/v1/workflows - create workflow with duplicate tool IDs', async ({ request }) => {
  118 |     expect(createdToolId).toBeDefined();
  119 | 
  120 |     const payload = {
  121 |       title: 'API Test Duplicate Workflow ' + Math.random().toString(36).substring(7),
  122 |       description: 'Programmatic workflow with duplicate tools description',
  123 |       toolIds: [createdToolId, createdToolId]
```