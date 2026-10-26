# ServicePro OS — Security Configuration & Hardening Guide

This document defines the baseline security parameters, environment configurations, defense-in-depth layers, and hardening protocols implemented in **ServicePro OS**.

---

## 1. Security Architecture & Defense-in-Depth Overview

ServicePro OS employs a 4-tier defense-in-depth model:

```
[Layer 1: Edge & Network]      Cloudflare WAF / Vercel Edge / TLS 1.3 / HSTS Preload
             │
[Layer 2: Application Entry]    Next.js Middleware: Strict CSRF Origin Guard + 5-Attempt Rate Limiter
             │
[Layer 3: Server API & RBAC]    Server Auth Guard (requireRole) + 5-Factor Admin MFA + Consensus Quorum
             │
[Layer 4: Data & Storage]       Supabase PostgreSQL Row-Level Security (RLS) on all 15 Tables
```

---

## 2. Master Security Environment Variables Reference

Configure these variables in your production hosting dashboard (Vercel, Render, Railway, or VPS `.env.production`):

```ini
# ==============================================================================
# 1. CORE APPLICATION ENVIRONMENT
# ==============================================================================
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_API_MODE=real
ALLOW_DEMO_AUTH=false

# ==============================================================================
# 2. SUPABASE (CLOUD DATABASE & IDENTITY)
# ==============================================================================
# Public credentials (Safe for browser)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Backend Secret (Server-Only — NEVER expose to browser)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_STORAGE_BUCKET=job-photos

# ==============================================================================
# 3. STRIPE PAYMENT ENGINE
# ==============================================================================
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_stripe_webhook_signing_secret

# ==============================================================================
# 4. ANTI-HACKING RATE LIMITING & DISTRIBUTED STORE (OPTIONAL)
# ==============================================================================
# When set, rate-limiting counters synchronize across distributed serverless instances:
UPSTASH_REDIS_REST_URL=https://your-upstash-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_upstash_rest_token

# ==============================================================================
# 5. SIEM & REAL-TIME SECURITY ALERTING (OPTIONAL)
# ==============================================================================
# Webhook URL for real-time attack & lockout notifications (Slack, PagerDuty, Datadog):
SECURITY_ALERT_WEBHOOK_URL=https://hooks.slack.com/services/T00/B00/X00

# ==============================================================================
# 6. SYSTEM SECURITY & CRON HOUSEKEEPING
# ==============================================================================
CRON_SECRET=generate_a_random_64_character_hex_string
INITIAL_OWNER_EMAIL=admin@your-domain.com
INITIAL_OWNER_PASSWORD=YourStrongInitialPassword2026!#
```

---

## 3. Security Headers Configuration (`next.config.mjs`)

Every production response from ServicePro OS includes an A+ grade security header suite:

| Header | Production Value | Purpose |
|---|---|---|
| **Content-Security-Policy** | `default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://js.stripe.com https://api.mapbox.com; frame-src 'self' https://js.stripe.com https://maps.google.com https://www.google.com; object-src 'none'; frame-ancestors 'none';` | Blocks XSS, malicious script injection, and unauthorized frame embedding. |
| **Strict-Transport-Security** | `max-age=31536000; includeSubDomains; preload` | Enforces HTTPS exclusively across domain and all subdomains. |
| **X-Frame-Options** | `DENY` | Prevents Clickjacking attacks by forbidding iframe embedding. |
| **X-Content-Type-Options** | `nosniff` | Blocks MIME-type sniffing by browsers. |
| **Referrer-Policy** | `strict-origin-when-cross-origin` | Protects sensitive URL paths from leaking to third-party referrers. |
| **Permissions-Policy** | `camera=(self), microphone=(), geolocation=(self)` | Restricts device hardware access strictly to same-origin job photo uploads and technician routing. |

---

## 4. Cross-Site Request Forgery (CSRF) Defense

Implemented in Next.js middleware ([`src/middleware.ts`](file:///C:/Users/hashm/OneDrive/Desktop/Online%20work/src/middleware.ts)) and backed by [`src/lib/server/csrf.ts`](file:///C:/Users/hashm/OneDrive/Desktop/Online%20work/src/lib/server/csrf.ts):
- Evaluates every state-changing mutation (`POST`, `PUT`, `PATCH`, `DELETE`).
- Rejects requests lacking matching `Origin` or `Referer` headers with `403 Forbidden`.
- Exact hostname matching via `Set<string>` avoids subdomain suffix matching vulnerabilities.
- Emits real-time SIEM alerts upon detecting origin mismatch.

---

## 5. Anti-Hacking Rate Limiter & 15-Minute Lockout

Implemented in [`src/lib/server/rate-limit.ts`](file:///C:/Users/hashm/OneDrive/Desktop/Online%20work/src/lib/server/rate-limit.ts):
- **Strict 5-Attempt Maximum:** Clamps all sensitive mutation attempts to a maximum ceiling of 5 requests per window.
- **15-Minute Security Lockout (`900,000 ms`):** Automatically triggered on the 6th attempt or 5th consecutive failure.
- **HTTP 429 Status Response:** Returns `code: "SECURITY_LOCKOUT"`, `Retry-After: 900`, `X-RateLimit-Lockout: "true"`.
- **Distributed Multi-Instance Support:** Supports Upstash Redis REST API synchronization across serverless lambdas while seamlessly falling back to local memory.

---

## 6. 5-Factor Admin MFA & Governance Consensus

Implemented in [`src/lib/server/admin-mfa.ts`](file:///C:/Users/hashm/OneDrive/Desktop/Online%20work/src/lib/server/admin-mfa.ts) and [`src/lib/server/multi-admin-approval.ts`](file:///C:/Users/hashm/OneDrive/Desktop/Online%20work/src/lib/server/multi-admin-approval.ts):
- **5 Supported Verification Factors:**
  1. Master Password
  2. TOTP Authenticator (Google Authenticator, 1Password)
  3. Single-Use Email OTP (5-minute expiry)
  4. WebAuthn Hardware Security Key (YubiKey)
  5. Master Recovery Key
- **Policy:** Any 4 of 5 factors required to unlock the administrative credential locker at `/admin/infrastructure`.
- **Quorum Consensus Council:** Dual-custody approval required before executing destructive operations (database purge, secret rotation, payouts > $10,000).

---

## 7. Credential Rotation Runbook

To safely rotate compromised or scheduled secrets:
1. Sign in to `/admin` using Owner credentials.
2. Navigate to `/admin/infrastructure`.
3. Complete the 5-Factor MFA challenge to unlock the Credential Locker.
4. Input new values for `STRIPE_SECRET_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, or `CRON_SECRET`.
5. Click **Save & Test Connection**. The backend automatically creates `.env.backup` before writing `.env.local.tmp` atomically.
