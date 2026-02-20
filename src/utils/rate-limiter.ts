/**
 * Simple memory-based rate limiter for public mock endpoints
 */

interface RateLimitInfo {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitInfo>();

/**
 * Checks if a request should be rate limited
 * @param key Unique key for the requester (e.g., client IP)
 * @param limit Maximum number of requests allowed in the window
 * @param windowMs Window size in milliseconds (default 1 minute)
 * @returns boolean true if allowed, false if limited
 */
export function checkRateLimit(
  key: string,
  limit: number = 100,
  windowMs: number = 60000,
): { allowed: boolean; remaining: number; reset: number } {
  const now = Date.now();
  const info = rateLimitMap.get(key);

  if (!info || now > info.resetTime) {
    // New window or reset
    const newInfo = {
      count: 1,
      resetTime: now + windowMs,
    };
    rateLimitMap.set(key, newInfo);
    return {
      allowed: true,
      remaining: limit - 1,
      reset: newInfo.resetTime,
    };
  }

  if (info.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      reset: info.resetTime,
    };
  }

  info.count += 1;
  return {
    allowed: true,
    remaining: limit - info.count,
    reset: info.resetTime,
  };
}

// Cleanup interval to prevent memory leaks (runs every 5 minutes)
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, info] of rateLimitMap.entries()) {
      if (now > info.resetTime + 300000) {
        // Keep for 5 mins after reset for safety
        rateLimitMap.delete(key);
      }
    }
  }, 300000);
}
