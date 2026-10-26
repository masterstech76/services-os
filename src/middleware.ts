import { type NextRequest } from "next/server";
import { updateSessionAndEnforceRoles } from "@/lib/supabase/middleware";
import { verifyCsrfOrigin } from "@/lib/server/csrf";
import { checkRateLimit, getClientIp } from "@/lib/server/rate-limit";
import { emitSecurityAlert } from "@/lib/server/security-telemetry";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Centralized Protection for all API mutation endpoints (~75 routes)
  if (pathname.startsWith("/api/")) {
    const method = request.method.toUpperCase();
    const isMutation = ["POST", "PUT", "PATCH", "DELETE"].includes(method);

    // Signature-verified or token-authenticated external endpoints are exempt from CSRF
    const isExternalWebhookOrCron =
      pathname.startsWith("/api/stripe/webhook") ||
      pathname.startsWith("/api/sms/inbound") ||
      pathname.startsWith("/api/sms/status") ||
      pathname.startsWith("/api/cron/");

    if (isMutation && !isExternalWebhookOrCron) {
      // Enforce Cross-Site Request Forgery (CSRF) Origin Verification
      const csrf = verifyCsrfOrigin(request);
      if (!csrf.valid && csrf.response) {
        emitSecurityAlert({
          code: "CSRF_ORIGIN_MISMATCH",
          severity: "HIGH",
          message: `Blocked CSRF mutation attempt on ${pathname}`,
          ip: getClientIp(request),
          endpoint: pathname,
          method,
        }).catch(() => {});
        return csrf.response;
      }

      // Enforce Strict Anti-Hacking Rate Limiting per IP (Max 5 attempts + 15 min lockout)
      const isPaymentOrBooking =
        pathname.startsWith("/api/jobs/checkout") ||
        pathname.startsWith("/api/slots/hold") ||
        pathname.startsWith("/api/payments/") ||
        pathname.startsWith("/api/stripe/") ||
        pathname.startsWith("/api/auth/");

      const limit = 5; // Strict ceiling: maximum 5 attempts
      const keyPrefix = isPaymentOrBooking ? "api_mutation_sensitive" : "api_mutation_general";
      const lockoutMs = isPaymentOrBooking ? 15 * 60_000 : 5 * 60_000; // 15-minute anti-hacking lockout for sensitive operations

      const rl = checkRateLimit(request, { limit, windowMs: 60_000, keyPrefix, lockoutMs, maxFailures: 5 });
      if (!rl.allowed && rl.response) {
        return rl.response;
      }
    }
  }

  // 2. Role-based portal gatekeeping & Supabase session enforcement
  return updateSessionAndEnforceRoles(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
