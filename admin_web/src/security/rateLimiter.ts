/**
 * ServicePro OS — Sliding Window Rate Limiter & Abuse Prevention Engine
 * Standards: OWASP ASVS v4.0.3, NIST SP 800-63B
 */

export interface RateLimitStatus {
  isLocked: boolean;
  remainingAttempts: number;
  lockoutRemainingSeconds: number;
  delayMs: number;
}

interface AttemptRecord {
  count: number;
  firstAttemptAt: number;
  lastAttemptAt: number;
  lockedUntil: number | null;
}

const MAX_LOGIN_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15-minute sliding window
const LOCKOUT_MS = 15 * 60 * 1000; // 15-minute lockout

class RateLimiter {
  private storageKey = 'servicepro_ratelimit_attempts';

  private getStore(): Record<string, AttemptRecord> {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  }

  private saveStore(store: Record<string, AttemptRecord>): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(store));
    } catch {}
  }

  public check(identifier: string): RateLimitStatus {
    const store = this.getStore();
    const now = Date.now();
    const record = store[identifier.toLowerCase()];

    if (!record) {
      return {
        isLocked: false,
        remainingAttempts: MAX_LOGIN_ATTEMPTS,
        lockoutRemainingSeconds: 0,
        delayMs: 0
      };
    }

    // Check if lockout has expired
    if (record.lockedUntil) {
      if (now < record.lockedUntil) {
        const remaining = Math.ceil((record.lockedUntil - now) / 1000);
        return {
          isLocked: true,
          remainingAttempts: 0,
          lockoutRemainingSeconds: remaining,
          delayMs: 4000
        };
      } else {
        // Lockout expired, reset counter
        delete store[identifier.toLowerCase()];
        this.saveStore(store);
        return {
          isLocked: false,
          remainingAttempts: MAX_LOGIN_ATTEMPTS,
          lockoutRemainingSeconds: 0,
          delayMs: 0
        };
      }
    }

    // Check if sliding window has passed
    if (now - record.firstAttemptAt > WINDOW_MS) {
      delete store[identifier.toLowerCase()];
      this.saveStore(store);
      return {
        isLocked: false,
        remainingAttempts: MAX_LOGIN_ATTEMPTS,
        lockoutRemainingSeconds: 0,
        delayMs: 0
      };
    }

    // Calculate progressive delay
    const delayMs = record.count >= 3 ? Math.min((record.count - 2) * 1000, 3000) : 0;
    const remaining = Math.max(0, MAX_LOGIN_ATTEMPTS - record.count);

    return {
      isLocked: record.count >= MAX_LOGIN_ATTEMPTS,
      remainingAttempts: remaining,
      lockoutRemainingSeconds: 0,
      delayMs
    };
  }

  public recordFailure(identifier: string): RateLimitStatus {
    const store = this.getStore();
    const now = Date.now();
    const id = identifier.toLowerCase();
    const existing = store[id];

    if (!existing || (now - existing.firstAttemptAt > WINDOW_MS && !existing.lockedUntil)) {
      store[id] = {
        count: 1,
        firstAttemptAt: now,
        lastAttemptAt: now,
        lockedUntil: null
      };
    } else {
      existing.count += 1;
      existing.lastAttemptAt = now;
      if (existing.count >= MAX_LOGIN_ATTEMPTS) {
        existing.lockedUntil = now + LOCKOUT_MS;
      }
    }

    this.saveStore(store);
    return this.check(id);
  }

  public reset(identifier: string): void {
    const store = this.getStore();
    delete store[identifier.toLowerCase()];
    this.saveStore(store);
  }
}

export const rateLimiter = new RateLimiter();
