/**
 * Default number of items to return in a paginated response.
 */
export const DEFAULT_PAGE_SIZE = 20;

/**
 * Maximum allowed number of items to return in a paginated response.
 */
export const MAX_PAGE_SIZE = 100;

/**
 * Default maximum number of requests allowed within the rate limit window.
 */
export const DEFAULT_RATE_LIMIT = 60;

/**
 * Time window in milliseconds for rate limiting.
 */
export const RATE_LIMIT_WINDOW_MS = 60_000;

/**
 * Supported tool types in the system.
 */
export const TOOL_TYPES = ['prompt', 'skill', 'mcp'] as const;

/**
 * Type representing the supported tool types.
 */
export type ToolType = typeof TOOL_TYPES[number];

/**
 * Common API error codes and their default messages.
 */
export const API_ERRORS = {
  UNAUTHORIZED: {
    code: 'UNAUTHORIZED',
    message: 'Authentication is required to access this resource.',
  },
  FORBIDDEN: {
    code: 'FORBIDDEN',
    message: 'You do not have permission to perform this action.',
  },
  NOT_FOUND: {
    code: 'NOT_FOUND',
    message: 'The requested resource could not be found.',
  },
  BAD_REQUEST: {
    code: 'BAD_REQUEST',
    message: 'The request was invalid or could not be processed.',
  },
  RATE_LIMITED: {
    code: 'RATE_LIMITED',
    message: 'Too many requests, please try again later.',
  },
  INTERNAL_ERROR: {
    code: 'INTERNAL_ERROR',
    message: 'An unexpected internal error occurred.',
  },
} as const;
