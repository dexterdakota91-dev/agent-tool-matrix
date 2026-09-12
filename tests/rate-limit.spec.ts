import { test, expect } from '@playwright/test';

// Use a type import or regular import so that the actual import fails at runtime
// if the file doesn't exist yet, rather than using a mock implementation.
// @ts-ignore - Ignoring TS error for missing file during QA test creation
import { rateLimit } from '../src/lib/rate-limit';

test.describe('Rate Limiter', () => {

  test('Test rate limit allowance under threshold', async () => {
    const key = 'test1-token';
    expect(await rateLimit(key, 3, 1000)).toBe(true);
    expect(await rateLimit(key, 3, 1000)).toBe(true);
    expect(await rateLimit(key, 3, 1000)).toBe(true);
  });

  test('Test rate limit rejection when requests exceed limit within the time window', async () => {
    const key = 'test2-token';
    expect(await rateLimit(key, 2, 1000)).toBe(true);
    expect(await rateLimit(key, 2, 1000)).toBe(true);
    expect(await rateLimit(key, 2, 1000)).toBe(false);
  });

  test('Test key isolation (token A exceeding limit does not block token B)', async () => {
    const keyA = 'test3-tokenA';
    const keyB = 'test3-tokenB';
    expect(await rateLimit(keyA, 1, 1000)).toBe(true);
    expect(await rateLimit(keyA, 1, 1000)).toBe(false);

    expect(await rateLimit(keyB, 1, 1000)).toBe(true);
  });

  test('Test reset behavior after window expiration (using simulated timers or clock advances)', async () => {
    const key = 'test4-token';
    expect(await rateLimit(key, 1, 100)).toBe(true);
    expect(await rateLimit(key, 1, 100)).toBe(false);

    // Use a small sleep to actually wait out the window in the real system
    await new Promise(r => setTimeout(r, 101));

    expect(await rateLimit(key, 1, 100)).toBe(true);
  });
});
