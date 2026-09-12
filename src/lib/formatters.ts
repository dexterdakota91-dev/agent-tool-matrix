/**
 * Utility functions for formatting strings, numbers, dates, and sizes.
 */

/**
 * Returns a human-readable relative time string (e.g., "just now", "5m ago", "2h ago", "3d ago").
 *
 * @param date - The date to format (Date object, string, or timestamp).
 * @returns Formatted relative time string.
 */
export function formatRelativeTime(date: Date | string | number | null | undefined): string {
  if (date === null || date === undefined) return 'Invalid Date';

  const d = new Date(date);
  if (isNaN(d.getTime())) return 'Invalid Date';

  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);

  // Handle future dates by defaulting to just now
  if (diffInSeconds < 0) return 'just now';

  if (diffInSeconds < 60) return 'just now';

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${diffInDays}d ago`;

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) return `${diffInMonths}mo ago`;

  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears}y ago`;
}

/**
 * Formats a number with commas (e.g., 1,234).
 *
 * @param num - The number to format.
 * @returns Formatted number string.
 */
export function formatNumber(num: number | null | undefined): string {
  if (typeof num !== 'number' || isNaN(num)) return '0';
  return new Intl.NumberFormat('en-US').format(num);
}

/**
 * Cleanly truncates a string to a specified maximum length, appending a suffix if truncated.
 *
 * @param str - The string to truncate.
 * @param maxLength - The maximum length of the resulting string including the suffix.
 * @param suffix - The string to append if truncated (defaults to "...").
 * @returns Truncated string.
 */
export function truncateString(str: string | null | undefined, maxLength: number, suffix: string = '...'): string {
  if (!str) return '';
  if (maxLength <= 0) return '';
  if (str.length <= maxLength) return str;

  const sliceLength = Math.max(0, maxLength - suffix.length);
  return str.slice(0, sliceLength) + suffix;
}

/**
 * Formats bytes into a human-readable size string (B, KB, MB, GB, etc.).
 *
 * @param bytes - The number of bytes.
 * @returns Formatted byte size string.
 */
export function formatByteSize(bytes: number | null | undefined): string {
  if (typeof bytes !== 'number' || isNaN(bytes) || bytes < 0) return '0 B';
  if (bytes === 0) return '0 B';

  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  // Safe bounds check for sizes array
  if (i >= sizes.length) {
    return `${parseFloat((bytes / Math.pow(k, sizes.length - 1)).toFixed(2))} ${sizes[sizes.length - 1]}`;
  }

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}
