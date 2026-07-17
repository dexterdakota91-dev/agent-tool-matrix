import { test, expect } from '@playwright/test';

test.describe('Agent Tool Matrix API & MCP E2E Test Suite', () => {
  // Guarantee serial execution to preserve tool creation ID across tests
  test.describe.configure({ mode: 'serial' });

  const token = 'dev_static_key_12345';
  let createdToolId: string;
  let createdToolTitle: string;
  let createdWorkflowId: string;

  test('GET /api/v1/tools - unauthorized without key', async ({ request }) => {
    const response = await request.get('/api/v1/tools');
    expect(response.status()).toBe(401);
  });

  test('GET /api/v1/tools - authorized', async ({ request }) => {
    const response = await request.get('/api/v1/tools', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.tools).toBeDefined();
    expect(Array.isArray(body.tools)).toBe(true);
  });

  test('POST /api/v1/tools - create tool programmatically', async ({ request }) => {
    createdToolTitle = 'API Test Tool ' + Math.random().toString(36).substring(7);
    const payload = {
      title: createdToolTitle,
      type: 'prompt',
      description: 'Programmatic API test tool description',
      markdownContent: 'API Test Prompt content: hello {{input}}',
      tags: ['test', 'api']
    };

    const response = await request.post('/api/v1/tools', {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      data: payload
    });

    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.tool).toBeDefined();
    expect(body.tool.title).toBe(payload.title);
    expect(body.tool.id).toBeDefined();
    createdToolId = body.tool.id;
  });

  test('GET /api/tools/search - search for created tool', async ({ request }) => {
    expect(createdToolId).toBeDefined();

    // Test unauthorized search
    const badRes = await request.get(`/api/tools/search?q=${encodeURIComponent(createdToolTitle)}`);
    expect(badRes.status()).toBe(401);

    // Test authorized search
    const response = await request.get(`/api/tools/search?q=${encodeURIComponent(createdToolTitle)}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.results).toBeDefined();
    expect(body.results.length).toBeGreaterThanOrEqual(1);
    expect(body.results[0].id).toBe(createdToolId);
  });

  test('GET /api/tools/checkout - checkout created tool', async ({ request }) => {
    expect(createdToolId).toBeDefined();

    // Test unauthorized checkout
    const badRes = await request.get(`/api/tools/checkout?id=${createdToolId}`);
    expect(badRes.status()).toBe(401);

    // Test authorized checkout
    const response = await request.get(`/api/tools/checkout?id=${createdToolId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    expect(response.status()).toBe(200);
    const content = await response.text();
    expect(content).toBe('API Test Prompt content: hello {{input}}');
  });

  test('POST /api/v1/workflows - create workflow programmatically', async ({ request }) => {
    expect(createdToolId).toBeDefined();

    const payload = {
      title: 'API Test Workflow ' + Math.random().toString(36).substring(7),
      description: 'Programmatic workflow description',
      toolIds: [createdToolId]
    };

    const response = await request.post('/api/v1/workflows', {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      data: payload
    });

    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.workflow).toBeDefined();
    expect(body.workflow.title).toBe(payload.title);
    expect(body.workflow.tools.length).toBe(1);
    expect(body.workflow.tools[0].toolId).toBe(createdToolId);
    createdWorkflowId = body.workflow.id;
  });

  test('POST /api/v1/workflows - create workflow with duplicate tool IDs', async ({ request }) => {
    expect(createdToolId).toBeDefined();

    const payload = {
      title: 'API Test Duplicate Workflow ' + Math.random().toString(36).substring(7),
      description: 'Programmatic workflow with duplicate tools description',
      toolIds: [createdToolId, createdToolId]
    };

    const response = await request.post('/api/v1/workflows', {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      data: payload
    });

    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.workflow).toBeDefined();
    expect(body.workflow.title).toBe(payload.title);
    expect(body.workflow.tools.length).toBe(2);
    expect(body.workflow.tools[0].toolId).toBe(createdToolId);
    expect(body.workflow.tools[1].toolId).toBe(createdToolId);
  });

  test('GET /api/v1/workflows - list workflows', async ({ request }) => {
    const response = await request.get('/api/v1/workflows', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.workflows).toBeDefined();
    expect(Array.isArray(body.workflows)).toBe(true);
    const hasCreated = body.workflows.some((w: { id: string }) => w.id === createdWorkflowId);
    expect(hasCreated).toBe(true);
  });

  // --- NEW API EDGE CASE TESTS ---

  test('GET /api/v1/tools - filter by invalid type parameter', async ({ request }) => {
    const response = await request.get('/api/v1/tools?type=invalid_type', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    expect(response.status()).toBe(200);
  });

  test('POST /api/v1/tools - missing title (Bad Request)', async ({ request }) => {
    const payload = {
      type: 'prompt',
      description: 'Missing title'
    };
    const response = await request.post('/api/v1/tools', {
      headers: { 'Authorization': `Bearer ${token}` },
      data: payload
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error).toContain('Missing required fields');
  });

  test('POST /api/v1/tools - invalid tool type (Bad Request)', async ({ request }) => {
    const payload = {
      title: 'Invalid Type Tool',
      type: 'invalid_type',
      description: 'Invalid type'
    };
    const response = await request.post('/api/v1/tools', {
      headers: { 'Authorization': `Bearer ${token}` },
      data: payload
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error).toContain('Invalid tool type');
  });

  test('POST /api/v1/tools - invalid JSON body (Bad Request)', async ({ request }) => {
    const response = await request.post('/api/v1/tools', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      data: Buffer.from('{invalid-json-here}')
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error).toContain('Invalid JSON body');
  });

  test('GET /api/tools/search - missing q parameter (Bad Request)', async ({ request }) => {
    const response = await request.get('/api/tools/search', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error).toContain('Missing query parameter "q"');
  });

  test('GET /api/tools/checkout - missing id parameter (Bad Request)', async ({ request }) => {
    const response = await request.get('/api/tools/checkout', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error).toContain('Missing query parameter "id"');
  });

  test('GET /api/tools/checkout - tool not found (Not Found)', async ({ request }) => {
    const nonExistentId = '00000000-0000-0000-0000-000000000000';
    const response = await request.get(`/api/tools/checkout?id=${nonExistentId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    expect(response.status()).toBe(404);
    const body = await response.json();
    expect(body.error).toContain('Tool not found');
  });

  test('POST /api/v1/workflows - missing title (Bad Request)', async ({ request }) => {
    const payload = {
      toolIds: [createdToolId]
    };
    const response = await request.post('/api/v1/workflows', {
      headers: { 'Authorization': `Bearer ${token}` },
      data: payload
    });
    expect(response.status()).toBe(400);
  });

  test('POST /api/v1/workflows - non-existent toolIds (Bad Request)', async ({ request }) => {
    const payload = {
      title: 'Bad Workflow',
      toolIds: ['00000000-0000-0000-0000-000000000000']
    };
    const response = await request.post('/api/v1/workflows', {
      headers: { 'Authorization': `Bearer ${token}` },
      data: payload
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error).toContain('One or more tool IDs do not exist');
  });

  test('MCP SSE Server - unauthorized GET', async ({ request }) => {
    const response = await request.get('/api/mcp?connectionId=123');
    expect(response.status()).toBe(401);
  });

  test('MCP SSE Server - unauthorized POST', async ({ request }) => {
    const response = await request.post('/api/mcp?connectionId=123', {
      data: { jsonrpc: '2.0', method: 'initialize', id: 1 }
    });
    expect(response.status()).toBe(401);
  });

  test('MCP SSE Server - missing connectionId POST (Bad Request)', async ({ request }) => {
    const response = await request.post('/api/mcp', {
      headers: { 'Authorization': `Bearer ${token}` },
      data: { jsonrpc: '2.0', method: 'initialize', id: 1 }
    });
    expect(response.status()).toBe(400);
  });

  test('MCP SSE Server - invalid connectionId POST (Not Found)', async ({ request }) => {
    const response = await request.post('/api/mcp?connectionId=invalid_connection_id_here', {
      headers: { 'Authorization': `Bearer ${token}` },
      data: { jsonrpc: '2.0', method: 'initialize', id: 1 }
    });
    expect(response.status()).toBe(404);
  });

  // --- MCP SSE Server E2E Flow ---

  test('MCP SSE Server E2E Flow', async () => {
    expect(createdToolId).toBeDefined();
    const connectionId = 'e2e-mcp-conn-' + Math.random().toString(36).substring(7);
    const sseUrl = `http://localhost:3000/api/mcp?connectionId=${connectionId}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
      // 1. Establish SSE GET stream
      const sseResponse = await fetch(sseUrl, {
        headers: { 'Authorization': `Bearer ${token}` },
        signal: controller.signal
      });

      expect(sseResponse.status).toBe(200);

      const reader = sseResponse.body!.getReader();
      const decoder = new TextDecoder();

      // Read initial connection event
      const { value: initVal } = await reader.read();
      const initText = decoder.decode(initVal);
      expect(initText).toContain('event: endpoint');

      // 2. Call POST 'initialize'
      const initPayload = {
        jsonrpc: '2.0',
        id: 1,
        method: 'initialize',
        params: {}
      };

      const postInitRes = await fetch(`http://localhost:3000/api/mcp?connectionId=${connectionId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(initPayload)
      });
      expect(postInitRes.status).toBe(202);

      // Read response from the SSE stream
      const { value: resVal } = await reader.read();
      const resText = decoder.decode(resVal);
      expect(resText).toContain('event: message');

      const parsedRes = JSON.parse(resText.replace('event: message\ndata: ', '').trim());
      expect(parsedRes.id).toBe(1);
      expect(parsedRes.result.serverInfo.name).toBe('Agent Tool Matrix (ATM)');

      // 3. Call POST 'tools/call' and verify {{input}} interpolation matches patched logic
      const normalizeName = (title: string): string => {
        return title.replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();
      };
      const toolMcpName = normalizeName(createdToolTitle);

      const callPayload = {
        jsonrpc: '2.0',
        id: 2,
        method: 'tools/call',
        params: {
          name: toolMcpName,
          arguments: {
            input: 'Antigravity'
          }
        }
      };

      const postCallRes = await fetch(`http://localhost:3000/api/mcp?connectionId=${connectionId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(callPayload)
      });
      expect(postCallRes.status).toBe(202);

      // Read response from SSE stream
      const { value: callVal } = await reader.read();
      const callText = decoder.decode(callVal);
      expect(callText).toContain('event: message');

      const parsedCallRes = JSON.parse(callText.replace('event: message\ndata: ', '').trim());
      expect(parsedCallRes.id).toBe(2);
      expect(parsedCallRes.result.content[0].text).toBe('API Test Prompt content: hello Antigravity');

      // Abort clean up
      controller.abort();
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        throw err;
      }
    } finally {
      clearTimeout(timeoutId);
    }
  });

  test('MCP SSE Server - invalid JSON-RPC method response', async () => {
    const connectionId = 'e2e-mcp-conn-invalid-' + Math.random().toString(36).substring(7);
    const sseUrl = `http://localhost:3000/api/mcp?connectionId=${connectionId}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const sseResponse = await fetch(sseUrl, {
        headers: { 'Authorization': `Bearer ${token}` },
        signal: controller.signal
      });
      expect(sseResponse.status).toBe(200);

      const reader = sseResponse.body!.getReader();
      const decoder = new TextDecoder();

      // Read connection event
      await reader.read();

      // Call POST with non-existent method
      const invalidPayload = {
        jsonrpc: '2.0',
        id: 99,
        method: 'non_existent_method_xyz',
        params: {}
      };

      const postRes = await fetch(`http://localhost:3000/api/mcp?connectionId=${connectionId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(invalidPayload)
      });
      expect(postRes.status).toBe(202);

      // Read error message from the SSE stream
      const { value: errVal } = await reader.read();
      const errText = decoder.decode(errVal);
      expect(errText).toContain('event: message');

      const parsedErr = JSON.parse(errText.replace('event: message\ndata: ', '').trim());
      expect(parsedErr.id).toBe(99);
      expect(parsedErr.error).toBeDefined();
      expect(parsedErr.error.code).toBe(-32601);
      expect(parsedErr.error.message).toContain('Method non_existent_method_xyz not found');

      controller.abort();
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        throw err;
      }
    } finally {
      clearTimeout(timeoutId);
    }
  });
});
