/**
 * Sanitizes input text to strip unsafe HTML tags, escape angle brackets,
 * and normalize whitespace.
 *
 * @param {string} input - The string to sanitize.
 * @param {number} [maxLength] - Optional maximum length for the string. If provided, the output string is truncated.
 * @returns {string} The sanitized string.
 */
export function sanitizeText(input: string, maxLength?: number): string {
  if (typeof input !== 'string') {
    return '';
  }

  // 1. Remove script and style tags and their contents
  let sanitized = input.replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, '');

  // 2. Remove all other HTML tags
  sanitized = sanitized.replace(/<\/?[a-z][^>]*>/gi, '');

  // 3. Escape standard HTML entities
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };
  const reg = /[&<>"'/]/ig;
  sanitized = sanitized.replace(reg, (match) => map[match] || match);

  // 4. Normalize whitespace
  sanitized = sanitized.replace(/\s+/g, ' ').trim();

  // 5. Truncate to max length if provided
  if (maxLength !== undefined && maxLength > 0) {
    sanitized = sanitized.slice(0, maxLength);
  }

  return sanitized;
}

/**
 * Cleans, deduplicates, and lowercases an array of tag strings.
 * Non-string entries and empty strings are filtered out.
 *
 * @param {string[]} tags - The array of tag strings to sanitize.
 * @returns {string[]} An array of cleaned, unique, lowercased tags.
 */
export function sanitizeTags(tags: string[]): string[] {
  if (!Array.isArray(tags)) {
    return [];
  }

  const cleanedTags = tags
    .filter((tag) => typeof tag === 'string')
    .map((tag) => {
      // Convert to lowercase and trim
      let cleanTag = tag.toLowerCase().trim();
      // Remove any non-alphanumeric, space, hyphen, or underscore characters
      cleanTag = cleanTag.replace(/[^\w\s-]/g, '');
      // Normalize whitespace
      cleanTag = cleanTag.replace(/\s+/g, ' ').trim();
      return cleanTag;
    })
    .filter((tag) => tag.length > 0);

  return Array.from(new Set(cleanedTags));
}

/**
 * Generates a URL-safe string from the input.
 * Normalizes diacritics, lowercases, replaces spaces and underscores with hyphens,
 * and removes invalid characters.
 *
 * @param {string} input - The string to slugify.
 * @returns {string} The resulting slug.
 */
export function slugify(input: string): string {
  if (typeof input !== 'string') {
    return '';
  }

  return input
    .normalize('NFD')                     // Normalize diacritics
    .replace(/[\u0300-\u036f]/g, '')      // Remove diacritic marks
    .toLowerCase()                        // Convert to lowercase
    .trim()                               // Trim whitespace
    .replace(/[\s_]+/g, '-')              // Replace spaces and underscores with hyphens
    .replace(/[^\w-]+/g, '')              // Remove non-word characters except hyphens
    .replace(/--+/g, '-')                 // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, '');             // Trim hyphens from start and end
}
