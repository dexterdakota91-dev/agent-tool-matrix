/**
 * Configuration options for the rate limiter.
 */
export interface RateLimitOptions {
  /** The time window in milliseconds. */
  interval: number;
  /** Maximum number of unique tokens to track per interval to prevent memory exhaustion. Default is 500. */
  uniqueTokenPerInterval?: number;
}

/**
 * Result of a rate limit check.
 */
export interface RateLimitResult {
  /** Whether the request is allowed. */
  success: boolean;
  /** The maximum number of requests allowed in the current window. */
  limit: number;
  /** The number of remaining requests allowed in the current window. */
  remaining: number;
  /** The Unix timestamp (in ms) when the current rate limit window resets. */
  reset: number;
}

/**
 * Creates an in-memory rate limiter using a sliding window log approach.
 * Automatically cleans up stale entries to prevent memory leaks.
 *
 * @param options - Configuration options for the rate limiter.
 * @returns An object containing the check function.
 */
export function rateLimit(options: RateLimitOptions) {
  const tokenCache = new Map<string, number[]>();
  let lastSweep = Date.now();
  const interval = options.interval;
  const uniqueTokenPerInterval = options.uniqueTokenPerInterval || 500;

  return {
    /**
     * Checks if a token has exceeded the rate limit.
     *
     * @param limit - The maximum number of requests allowed per interval.
     * @param token - The unique identifier for the requester (e.g., IP address).
     * @returns A promise that resolves to the rate limit status.
     */
    check: (limit: number, token: string): Promise<RateLimitResult> => {
      return new Promise((resolve, reject) => {
        try {
          const now = Date.now();

          // Cleanup stale timestamps lazily
          if (now - lastSweep > interval) {
            for (const [key, timestamps] of tokenCache.entries()) {
              const validTimestamps = timestamps.filter((ts) => now - ts < interval);
              if (validTimestamps.length === 0) {
                tokenCache.delete(key);
              } else {
                tokenCache.set(key, validTimestamps);
              }
            }
            lastSweep = now;
          }

          const timestamps = tokenCache.get(token) || [];
          const validTimestamps = timestamps.filter((ts) => now - ts < interval);

          const isRateLimited = validTimestamps.length >= limit;

          if (!isRateLimited) {
            validTimestamps.push(now);
          }

          tokenCache.set(token, validTimestamps);

          // Prevent memory exhaustion
          if (tokenCache.size > uniqueTokenPerInterval) {
            const firstKey = tokenCache.keys().next().value;
            // Never delete the token we just inserted
            if (firstKey !== undefined && firstKey !== token) {
              tokenCache.delete(firstKey);
            }
          }

          const remaining = isRateLimited ? 0 : Math.max(0, limit - validTimestamps.length);
          const reset = validTimestamps.length > 0 ? validTimestamps[0] + interval : now + interval;

          resolve({
            success: !isRateLimited,
            limit,
            remaining,
            reset,
          });
        } catch (error) {
          reject(error);
        }
      });
    },
  };
}
