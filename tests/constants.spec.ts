import { test, expect } from '@playwright/test';
import {
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
  DEFAULT_RATE_LIMIT,
  RATE_LIMIT_WINDOW_MS,
  TOOL_TYPES,
  API_ERRORS,
} from '../src/lib/constants';

test.describe('Constants Definitions', () => {
  test('Pagination Limits are defined and have expected values', () => {
    expect(DEFAULT_PAGE_SIZE).toBeDefined();
    expect(typeof DEFAULT_PAGE_SIZE).toBe('number');
    expect(DEFAULT_PAGE_SIZE).toBe(20);

    expect(MAX_PAGE_SIZE).toBeDefined();
    expect(typeof MAX_PAGE_SIZE).toBe('number');
    expect(MAX_PAGE_SIZE).toBe(100);

    // Max page size should be greater than or equal to default page size
    expect(MAX_PAGE_SIZE).toBeGreaterThanOrEqual(DEFAULT_PAGE_SIZE);
  });

  test('Rate limit thresholds are defined and have expected values', () => {
    expect(DEFAULT_RATE_LIMIT).toBeDefined();
    expect(typeof DEFAULT_RATE_LIMIT).toBe('number');
    expect(DEFAULT_RATE_LIMIT).toBe(60);

    expect(RATE_LIMIT_WINDOW_MS).toBeDefined();
    expect(typeof RATE_LIMIT_WINDOW_MS).toBe('number');
    expect(RATE_LIMIT_WINDOW_MS).toBe(60_000); // 60 seconds
  });

  test('TOOL_TYPES is defined and non-empty', () => {
    expect(TOOL_TYPES).toBeDefined();
    expect(Array.isArray(TOOL_TYPES)).toBe(true);
    expect(TOOL_TYPES.length).toBeGreaterThan(0);

    expect(TOOL_TYPES).toContain('prompt');
    expect(TOOL_TYPES).toContain('skill');
    expect(TOOL_TYPES).toContain('mcp');
  });

  test('API_ERRORS is defined and has required keys', () => {
    expect(API_ERRORS).toBeDefined();
    expect(typeof API_ERRORS).toBe('object');
    expect(Object.keys(API_ERRORS).length).toBeGreaterThan(0);

    // Verify expected error definitions exist
    expect(API_ERRORS).toHaveProperty('UNAUTHORIZED');
    expect(API_ERRORS).toHaveProperty('FORBIDDEN');
    expect(API_ERRORS).toHaveProperty('NOT_FOUND');
    expect(API_ERRORS).toHaveProperty('BAD_REQUEST');
    expect(API_ERRORS).toHaveProperty('RATE_LIMITED');
    expect(API_ERRORS).toHaveProperty('INTERNAL_ERROR');

    // Validate internal structure of an error
    expect(API_ERRORS.UNAUTHORIZED).toHaveProperty('code', 'UNAUTHORIZED');
    expect(API_ERRORS.UNAUTHORIZED).toHaveProperty('message');
  });
});
