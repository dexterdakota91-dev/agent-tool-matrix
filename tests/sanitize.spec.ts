import { test, expect } from '@playwright/test';
import { sanitizeText, sanitizeTags, slugify } from '../src/lib/sanitize';

test.describe('Sanitize Utilities', () => {
  test.describe('sanitizeText', () => {
    test('should remove malicious HTML injection', () => {
      const input1 = '<script>alert("xss")</script>';
      expect(sanitizeText(input1)).toBe('alert("xss")');

      const input2 = '<img src="x" onerror="alert(1)">';
      expect(sanitizeText(input2)).toBe('');

      const input3 = 'Hello <b>world</b>!';
      expect(sanitizeText(input3)).toBe('Hello world!');
    });

    test('should normalize whitespace', () => {
      const input = '  This   is    spaced  out  ';
      expect(sanitizeText(input)).toBe('This is spaced out');
    });

    test('should truncate to maxLength', () => {
      const input = 'This is a very long string that should be truncated eventually';
      expect(sanitizeText(input, 10)).toBe('This is a ');
      expect(sanitizeText(input, 20)).toBe('This is a very long ');
    });

    test('should handle empty or null inputs safely', () => {
      expect(sanitizeText('')).toBe('');
      // Testing with any to verify runtime behavior if called from JS
      expect(sanitizeText(null as any)).toBe('');
      expect(sanitizeText(undefined as any)).toBe('');
    });
  });

  test.describe('sanitizeTags', () => {
    test('should handle duplicates, uppercase, and empty tags', () => {
      const input = [' React ', 'VUE', 'react', '', '  ', 'Svelte'];
      const output = sanitizeTags(input);

      expect(output).toHaveLength(3);
      expect(output).toContain('react');
      expect(output).toContain('vue');
      expect(output).toContain('svelte');
      expect(output).not.toContain('');
    });

    test('should handle invalid inputs gracefully', () => {
      expect(sanitizeTags(null as any)).toEqual([]);
      expect(sanitizeTags(undefined as any)).toEqual([]);
      expect(sanitizeTags("not an array" as any)).toEqual([]);
    });
  });

  test.describe('slugify', () => {
    test('should handle spaces and punctuation', () => {
      const input = 'Hello, World! This is a test.';
      expect(slugify(input)).toBe('hello-world-this-is-a-test');
    });

    test('should replace spaces with dashes and collapse multiple dashes', () => {
      const input = 'a    b  c---d';
      expect(slugify(input)).toBe('a-b-c-d');
    });

    test('should handle accented characters', () => {
      const input = 'Café fāçade jalapeño résumé';
      expect(slugify(input)).toBe('cafe-facade-jalapeno-resume');
    });

    test('should handle empty or null inputs', () => {
      expect(slugify('')).toBe('');
      expect(slugify(null as any)).toBe('');
      expect(slugify(undefined as any)).toBe('');
    });
  });
});
