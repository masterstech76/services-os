import { NextResponse } from "next/server";
import { emitSecurityAlert } from "@/lib/server/security-telemetry";

interface RateLimitRecord {
  count: number;
  resetAt: number;
  failureCount: number;
  lockoutUntil?: number;
}

// In-memory sliding window store with anti-tamper lockout tracking
const rateLimitStore = new Map<string, RateLimitRecord>();

// Clean up expired entries every 5 minutes to avoid memory accumulation
if (typeof setInterval !== "undefined") {
  const timer = setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitStore.entries()) {
      // Retain record if active lockout is still in effect
      if (record.lockoutUntil && record.lockoutUntil > now) {
        continue;
      }
      if (record.resetAt <= now) {
        rateLimitStore.delete(key);
      }
    }
  }, 5 * 60 * 1000);
  if (timer.unref) {
    timer.unref();
  }
}

export interface RateLimitOptions {
  /** Maximum allowed attempts per window. Hard ceiling is strictly 5 attempts to prevent brute-force. */
  limit?: number;
  /** Window duration in milliseconds (default: 60,000 ms = 1 minute) */
  windowMs?: number;
  /** Key prefix for namespace separation (e.g., "auth_login", "checkout") */
  keyPrefix?: string;
  /** Maximum consecutive attempts/failures before triggering prolonged security lockout (default: 5) */
  maxFailures?: number;
  /** Lockout duration after 5 failures in milliseconds (default: 15 minutes = 900,000 ms) */
  lockoutMs?: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetSeconds: number;
  isLockedOut?: boolean;
  response?: NextResponse;
}

/**
 * Extracts client IP from standard proxy and edge headers
 */
export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  return (
    request.headers.get("x-real-ip") ||
    request.headers.get("cf-connecting-ip") ||
    "127.0.0.1"
  );
}

/**
 * Enforces rate limiting with a strict maximum of 5 attempts (5<=0 limit).
 * Automatically triggers an extended 15-minute security lockout after 5 attempts/failures
 * to prevent automated hacking and brute-force bypasses.
 */
export function checkRateLimit(
  request: Request,
  options: RateLimitOptions = {}
): RateLimitResult {
  // Enforce strict ceiling: no more than 5 attempts allowed
  const requestedLimit = options.limit ?? 5;
  const limit = Math.max(1, Math.min(requestedLimit, 5));
  const windowMs = options.windowMs ?? 60_000;
  const maxFailures = Math.max(1, Math.min(options.maxFailures ?? 5, 5));
  const lockoutMs = options.lockoutMs ?? 15 * 60_000; // 15 minutes lockout
  const prefix = options.keyPrefix ?? "default";
  const ip = getClientIp(request);
  const key = `${prefix}:${ip}`;

  const now = Date.now();
  const existing = rateLimitStore.get(key);

  // 1. ACTIVE SECURITY LOCKOUT CHECK
  // If IP is currently in a 15-minute penalty lockout, reject immediately
  if (existing?.lockoutUntil && existing.lockoutUntil > now) {
    const remainingLockoutSeconds = Math.max(1, Math.ceil((existing.lockoutUntil - now) / 1000));
    const response = NextResponse.json(
      {
        error: {
          code: "SECURITY_LOCKOUT",
          message: `Maximum of 5 attempts exceeded. Security lockout active for ${remainingLockoutSeconds} seconds to stop brute-force hacking. Please try again later.`,
          retryAfterSeconds: remainingLockoutSeconds,
        },
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(remainingLockoutSeconds),
          "X-RateLimit-Limit": String(limit),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": String(Math.ceil(existing.lockoutUntil / 1000)),
          "X-RateLimit-Lockout": "true",
        },
      }
    );
    return {
      allowed: false,
      remaining: 0,
      resetSeconds: remainingLockoutSeconds,
      isLockedOut: true,
      response,
    };
  }

  // 2. WINDOW INITIALIZATION
  // If no record exists or previous non-lockout window has expired, start a fresh window
  if (!existing || existing.resetAt <= now) {
    rateLimitStore.set(key, {
      count: 1,
      resetAt: now + windowMs,
      failureCount: 0,
      lockoutUntil: undefined,
    });
    return {
      allowed: true,
      remaining: limit - 1,
      resetSeconds: Math.ceil(windowMs / 1000),
      isLockedOut: false,
    };
  }

  // 3. RATE LIMIT BREACH & LOCKOUT TRIGGER
  // When count reaches or exceeds allowed limit (no more than 5 attempts)
  if (existing.count >= limit) {
    existing.failureCount = (existing.failureCount || 0) + 1;
    existing.count += 1;

    // Trigger extended security lockout when reaching 5 attempts or failures
    const shouldLockout = existing.count >= maxFailures || existing.failureCount >= maxFailures;
    if (shouldLockout) {
      existing.lockoutUntil = now + lockoutMs;
      const lockoutSeconds = Math.ceil(lockoutMs / 1000);

      // Emit real-time SIEM security alert
      emitSecurityAlert({
        code: "SECURITY_LOCKOUT",
        severity: "HIGH",
        message: `Maximum 5 attempts exceeded. 15-minute security lockout active for IP: ${ip}`,
        ip,
        metadata: { prefix, attempts: existing.count, failureCount: existing.failureCount },
      }).catch(() => {});

      const response = NextResponse.json(
        {
          error: {
            code: "SECURITY_LOCKOUT",
            message: `Maximum of 5 attempts exceeded. Security lockout active for ${lockoutSeconds} seconds to stop brute-force hacking. Please try again later.`,
            retryAfterSeconds: lockoutSeconds,
          },
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(lockoutSeconds),
            "X-RateLimit-Limit": String(limit),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": String(Math.ceil((now + lockoutMs) / 1000)),
            "X-RateLimit-Lockout": "true",
          },
        }
      );

      return {
        allowed: false,
        remaining: 0,
        resetSeconds: lockoutSeconds,
        isLockedOut: true,
        response,
      };
    }

    // Standard rate limit window breach (prior to 5 consecutive failures)
    const resetSeconds = Math.max(1, Math.ceil((existing.resetAt - now) / 1000));
    const response = NextResponse.json(
      {
        error: {
          code: "RATE_LIMITED",
          message: `Too many requests. Please wait ${resetSeconds} seconds before trying again.`,
        },
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(resetSeconds),
          "X-RateLimit-Limit": String(limit),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": String(Math.ceil(existing.resetAt / 1000)),
          "X-RateLimit-Lockout": "false",
        },
      }
    );
    return {
      allowed: false,
      remaining: 0,
      resetSeconds,
      isLockedOut: false,
      response,
    };
  }

  // 4. ATTEMPT PERMITTED
  existing.count += 1;
  return {
    allowed: true,
    remaining: Math.max(0, limit - existing.count),
    resetSeconds: Math.ceil((existing.resetAt - now) / 1000),
    isLockedOut: false,
  };
}

/**
 * Explicitly records a security failure (e.g. wrong password, bad MFA token).
 * After 5 failures, triggers an immediate 15-minute security lockout.
 */
export function recordSecurityFailure(
  request: Request,
  options: { keyPrefix?: string; lockoutMs?: number } = {}
): RateLimitResult {
  const prefix = options.keyPrefix ?? "security_fail";
  const ip = getClientIp(request);
  const key = `${prefix}:${ip}`;
  const now = Date.now();
  const lockoutMs = options.lockoutMs ?? 15 * 60_000;

  const existing = rateLimitStore.get(key) || {
    count: 0,
    resetAt: now + 60_000,
    failureCount: 0,
  };

  existing.failureCount = (existing.failureCount || 0) + 1;
  existing.count += 1;

  if (existing.failureCount >= 5) {
    existing.lockoutUntil = now + lockoutMs;
    rateLimitStore.set(key, existing);
    const lockoutSeconds = Math.ceil(lockoutMs / 1000);
    return {
      allowed: false,
      remaining: 0,
      resetSeconds: lockoutSeconds,
      isLockedOut: true,
      response: NextResponse.json(
        {
          error: {
            code: "SECURITY_LOCKOUT",
            message: `Maximum of 5 failed attempts exceeded. Security lockout active for ${lockoutSeconds} seconds to stop brute-force hacking.`,
            retryAfterSeconds: lockoutSeconds,
          },
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(lockoutSeconds),
            "X-RateLimit-Lockout": "true",
          },
        }
      ),
    };
  }

  rateLimitStore.set(key, existing);
  return {
    allowed: true,
    remaining: Math.max(0, 5 - existing.failureCount),
    resetSeconds: Math.ceil((existing.resetAt - now) / 1000),
    isLockedOut: false,
  };
}

/**
 * Checks whether an IP is currently locked out
 */
export function isClientLockedOut(
  request: Request,
  keyPrefix = "default"
): { isLockedOut: boolean; remainingLockoutSeconds: number } {
  const ip = getClientIp(request);
  const key = `${keyPrefix}:${ip}`;
  const existing = rateLimitStore.get(key);
  const now = Date.now();

  if (existing?.lockoutUntil && existing.lockoutUntil > now) {
    return {
      isLockedOut: true,
      remainingLockoutSeconds: Math.max(1, Math.ceil((existing.lockoutUntil - now) / 1000)),
    };
  }
  return { isLockedOut: false, remainingLockoutSeconds: 0 };
}

/**
 * Clears security failure count and lockout upon successful authentication
 */
export function clearSecurityFailures(request: Request, keyPrefix = "default"): void {
  const ip = getClientIp(request);
  const key = `${keyPrefix}:${ip}`;
  rateLimitStore.delete(key);
}

/** Clear all rate limits (useful in unit tests) */
export function resetRateLimits(): void {
  rateLimitStore.clear();
}

/**
 * Returns true if Upstash / Redis distributed rate limiting is enabled.
 */
export function isDistributedRateLimitEnabled(): boolean {
  return Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
}

/**
 * Syncs attempt count to Upstash Redis REST API when configured,
 * ensuring distributed multi-instance rate limiting across serverless lambdas.
 */
export async function syncDistributedRateLimit(key: string, ttlSeconds: number): Promise<number | null> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token || typeof fetch === "undefined") {
    return null;
  }

  try {
    const res = await fetch(`${url}/pipeline`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([
        ["INCR", key],
        ["EXPIRE", key, ttlSeconds],
      ]),
    });
    if (res.ok) {
      const data = await res.json();
      const count = data?.[0]?.result;
      return typeof count === "number" ? count : null;
    }
  } catch {
    // Failover seamlessly to local in-memory store
  }
  return null;
}
