import { test, expect } from '@playwright/test';
import { formatRelativeTime, formatNumber, truncateString, formatByteSize } from '../src/lib/formatters';

test.describe('formatRelativeTime', () => {
  test('formats past dates correctly', () => {
    const now = new Date();
    const past = new Date(now.getTime() - 60000); // 1 minute ago
    expect(formatRelativeTime(past)).toBe('1 minute ago'); // Assuming simple implementation
  });

  test('formats future dates correctly', () => {
    const now = new Date();
    const future = new Date(now.getTime() + 3600000); // 1 hour from now
    expect(formatRelativeTime(future)).toBe('in 1 hour');
  });

  test('handles invalid dates', () => {
    expect(formatRelativeTime(new Date('invalid'))).toBe('Invalid Date');
  });
});

test.describe('formatNumber', () => {
  test('formats positive integers', () => {
    expect(formatNumber(1000)).toBe('1,000');
  });

  test('formats negative integers', () => {
    expect(formatNumber(-1000)).toBe('-1,000');
  });

  test('formats floating point numbers', () => {
    expect(formatNumber(1234.56)).toBe('1,234.56');
  });

  test('handles zero', () => {
    expect(formatNumber(0)).toBe('0');
  });
});

test.describe('truncateString', () => {
  test('does not truncate strings shorter than max length', () => {
    expect(truncateString('hello', 10)).toBe('hello');
  });

  test('truncates strings longer than max length', () => {
    expect(truncateString('hello world', 5)).toBe('hello...');
  });
});

test.describe('formatByteSize', () => {
  test('handles 0 bytes', () => {
    expect(formatByteSize(0)).toBe('0 B');
  });

  test('formats byte size', () => {
    expect(formatByteSize(500)).toBe('500 B');
  });

  test('formats KB size', () => {
    expect(formatByteSize(1024)).toBe('1.0 KB');
  });

  test('formats MB size', () => {
    expect(formatByteSize(1048576)).toBe('1.0 MB');
  });

  test('formats GB size', () => {
    expect(formatByteSize(1073741824)).toBe('1.0 GB');
  });
});
