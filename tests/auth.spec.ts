import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());

import { test, expect } from '@playwright/test';
import { validateApiKey } from '../src/lib/auth-api';

test.describe('API Key Validation Unit Tests', () => {
  const validToken = process.env.DEV_AGENT_TOKEN || 'dev_static_key_12345';

  test('validates Bearer token header handling', async () => {
    const req = new Request('http://localhost/api/test', {
      headers: {
        'Authorization': `Bearer ${validToken}`
      }
    });
    const result = await validateApiKey(req);
    expect(result).toBe(true);
  });

  test('validates alternative x-api-key header handling', async () => {
    const req = new Request('http://localhost/api/test', {
      headers: {
        'x-api-key': validToken
      }
    });
    const result = await validateApiKey(req);
    expect(result).toBe(true);
  });

  test('validates query parameter fallback (?apiKey=<token>)', async () => {
    const req = new Request(`http://localhost/api/test?apiKey=${validToken}`);
    const result = await validateApiKey(req);
    expect(result).toBe(true);
  });

  test('denies missing token', async () => {
    const req = new Request('http://localhost/api/test');
    const result = await validateApiKey(req);
    expect(result).toBe(false);
  });

  test('denies empty token in header', async () => {
    const req = new Request('http://localhost/api/test', {
      headers: {
        'Authorization': `Bearer `
      }
    });
    const result = await validateApiKey(req);
    expect(result).toBe(false);
  });

  test('denies whitespace token in query parameter', async () => {
    const req = new Request(`http://localhost/api/test?apiKey=   `);
    const result = await validateApiKey(req);
    expect(result).toBe(false);
  });

  test('denies token exceeding 256 characters (DoS mitigation)', async () => {
    const longToken = 'a'.repeat(257);
    const req = new Request('http://localhost/api/test', {
      headers: {
        'x-api-key': longToken
      }
    });
    const result = await validateApiKey(req);
    expect(result).toBe(false);
  });

  test('denies invalid token', async () => {
    const req = new Request('http://localhost/api/test', {
      headers: {
        'Authorization': `Bearer invalid_token_123`
      }
    });
    const result = await validateApiKey(req);
    expect(result).toBe(false);
  });
});
