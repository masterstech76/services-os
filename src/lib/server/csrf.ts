import { NextResponse } from "next/server";

/**
 * Validates Origin / Referer headers against expected application hosts
 * to protect state-changing mutation endpoints against Cross-Site Request Forgery (CSRF).
 */
export function verifyCsrfOrigin(request: Request): { valid: boolean; response?: NextResponse } {
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");
  const host = request.headers.get("host");

  // In test runner or non-browser server callers, skip if both are absent
  const isTestOrLocal = Boolean(
    process.env.VITEST ||
    process.env.NODE_ENV === "test"
  );

  if (!origin && !referer) {
    if (isTestOrLocal) {
      return { valid: true };
    }
    // Reject state-changing mutations that lack Origin/Referer headers in production
    return {
      valid: false,
      response: NextResponse.json(
        { error: { code: "CSRF_FORBIDDEN", message: "Origin or Referer header required for state-changing operations." } },
        { status: 403 }
      ),
    };
  }

  const allowedOriginsSet = new Set<string>();

  // Allow localhost during development or testing
  if (process.env.NODE_ENV !== "production" || isTestOrLocal) {
    allowedOriginsSet.add("http://localhost:3000");
    allowedOriginsSet.add("http://127.0.0.1:3000");
  }

  if (host) {
    allowedOriginsSet.add(`http://${host}`);
    allowedOriginsSet.add(`https://${host}`);
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (appUrl) {
    try {
      const parsed = new URL(appUrl);
      allowedOriginsSet.add(parsed.origin);
    } catch {
      // ignore parsing error
    }
  }

  if (origin) {
    if (!allowedOriginsSet.has(origin)) {
      return {
        valid: false,
        response: NextResponse.json(
          { error: { code: "CSRF_FORBIDDEN", message: "Cross-origin request rejected." } },
          { status: 403 }
        ),
      };
    }
  }

  if (referer) {
    try {
      const refOrigin = new URL(referer).origin;
      if (!allowedOriginsSet.has(refOrigin)) {
        return {
          valid: false,
          response: NextResponse.json(
            { error: { code: "CSRF_FORBIDDEN", message: "Cross-origin request rejected." } },
            { status: 403 }
          ),
        };
      }
    } catch {
      return {
        valid: false,
        response: NextResponse.json(
          { error: { code: "CSRF_FORBIDDEN", message: "Invalid referer header." } },
          { status: 403 }
        ),
      };
    }
  }

  return { valid: true };
}
