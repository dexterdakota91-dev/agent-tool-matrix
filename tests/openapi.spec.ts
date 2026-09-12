import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());

import { test, expect } from '@playwright/test';

test.describe('OpenAPI Spec Validation', () => {
  test('Verify /api/openapi.json endpoint', async ({ request }) => {
    // 1. Validate HTTP 200 and Content-Type: application/json.
    const response = await request.get('/api/openapi.json');
    expect(response.status()).toBe(200);

    const contentType = response.headers()['content-type'];
    expect(contentType).toContain('application/json');

    const json = await response.json();

    // 2. Validate OpenAPI 3.1.0 structure: openapi version, info.title, info.version.
    expect(json.openapi).toBe('3.1.0');
    expect(json.info).toBeDefined();
    expect(json.info.title).toBeDefined();
    expect(json.info.version).toBeDefined();

    // 3. Validate paths exist for `/api/v1/tools`, `/api/v1/workflows`, `/api/tools/checkout`, `/api/tools/search`, `/api/mcp`.
    const requiredPaths = [
      '/api/v1/tools',
      '/api/v1/workflows',
      '/api/tools/checkout',
      '/api/tools/search',
      '/api/mcp'
    ];

    expect(json.paths).toBeDefined();

    for (const path of requiredPaths) {
      expect(json.paths[path]).toBeDefined();
    }

    // 4. Validate schema responses and status codes
    // Validating some known responses in the schema (e.g., 200, 201)
    const paths = json.paths;

    // Check /api/v1/tools
    expect(paths['/api/v1/tools'].get.responses['200']).toBeDefined();
    expect(paths['/api/v1/tools'].post.responses['201']).toBeDefined();

    // Check /api/v1/workflows
    expect(paths['/api/v1/workflows'].get.responses['200']).toBeDefined();
    expect(paths['/api/v1/workflows'].post.responses['201']).toBeDefined();

    // Check /api/tools/search
    expect(paths['/api/tools/search'].get.responses['200']).toBeDefined();

    // Check /api/tools/checkout
    expect(paths['/api/tools/checkout'].get.responses['200']).toBeDefined();
    expect(paths['/api/tools/checkout'].post.responses['200']).toBeDefined();

    // Check /api/mcp
    expect(paths['/api/mcp'].get.responses['200']).toBeDefined();
    expect(paths['/api/mcp'].post.responses['200']).toBeDefined();

    // General check for any status code
    for (const pathKey in paths) {
      const pathObj = paths[pathKey];
      for (const method in pathObj) {
        const operation = pathObj[method];
        expect(operation.responses).toBeDefined();
        const hasStatusCode = Object.keys(operation.responses).length > 0;
        expect(hasStatusCode).toBeTruthy();

        // Assert that status codes like 200, 201, 400, 401, 500 are handled properly if they exist
        // Since we are required to "Validate schema responses and status codes (e.g. 200, 400, 401, 500)"
        for (const statusCode in operation.responses) {
          expect(['200', '201', '400', '401', '403', '404', '500']).toContain(statusCode);
          expect(operation.responses[statusCode].description).toBeDefined();
        }
      }
    }
  });
});
