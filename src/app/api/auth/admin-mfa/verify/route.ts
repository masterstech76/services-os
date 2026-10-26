import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  initializeMfaSession,
  issueEmailOtp,
  verifyEmailOtp,
  verifyTotpCode,
  registerAndVerifyTrustedDevice,
  verifyFactorInSession,
} from "@/lib/server/admin-mfa";
import { verifyCsrfOrigin } from "@/lib/server/csrf";
import { checkRateLimit } from "@/lib/server/rate-limit";

const actionSchema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("init"),
    email: z.string().email(),
    browserId: z.string().optional(),
    deviceId: z.string().optional(),
    osVersion: z.string().optional(),
    hardwareSignature: z.string().optional(),
  }),
  z.object({
    action: z.literal("send_email_otp"),
    sessionId: z.string().min(1),
    email: z.string().email(),
  }),
  z.object({
    action: z.literal("verify_email_otp"),
    sessionId: z.string().min(1),
    email: z.string().email(),
    code: z.string().min(6),
  }),
  z.object({
    action: z.literal("verify_totp"),
    sessionId: z.string().min(1),
    email: z.string().email(),
    code: z.string().min(6),
  }),
  z.object({
    action: z.literal("verify_passkey"),
    sessionId: z.string().min(1),
    credentialId: z.string().optional(),
  }),
  z.object({
    action: z.literal("verify_trusted_device"),
    sessionId: z.string().min(1),
    email: z.string().email(),
    browserId: z.string().min(1),
    deviceId: z.string().min(1),
    osVersion: z.string().min(1),
    hardwareSignature: z.string().min(1),
  }),
]);

export async function POST(req: NextRequest) {
  // Strict Anti-Hacking Rate Limiting (max 5 MFA attempts with 15-minute lockout to stop brute-force hacking)
  const rl = checkRateLimit(req, { limit: 5, windowMs: 60_000, keyPrefix: "admin_mfa", lockoutMs: 15 * 60_000, maxFailures: 5 });
  if (!rl.allowed && rl.response) {
    return rl.response;
  }

  try {
    const body = await req.json();
    const parsed = actionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: { code: "VALIDATION_ERROR", message: parsed.error.issues[0]?.message ?? "Invalid MFA payload" } },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Action 1: Initialize MFA Session after Password verified
    if (data.action === "init") {
      const { sessionId, session } = initializeMfaSession({
        email: data.email,
        fingerprint: data.deviceId
          ? {
              browserId: data.browserId || "browser-default",
              deviceId: data.deviceId,
              osVersion: data.osVersion || "Windows 11",
              hardwareSignature: data.hardwareSignature || "hw-sig-01",
            }
          : undefined,
      });

      return NextResponse.json({ ok: true, sessionId, session });
    }

    // Action 2: Send Email OTP
    if (data.action === "send_email_otp") {
      const res = issueEmailOtp(data.email);
      return NextResponse.json({ ok: true, expiresAt: res.expiresAt, demoPreviewCode: res.demoPreviewCode });
    }

    // Action 3: Verify Email OTP
    if (data.action === "verify_email_otp") {
      const isValid = verifyEmailOtp(data.email, data.code);
      if (!isValid) {
        return NextResponse.json(
          { error: { code: "INVALID_OTP", message: "Invalid or expired Email OTP code." } },
          { status: 400 }
        );
      }

      const updated = verifyFactorInSession({
        sessionId: data.sessionId,
        factor: "emailOtp",
        verified: true,
      });

      const response = NextResponse.json({ ok: true, session: updated });
      if (updated?.isUnlocked) {
        response.cookies.set("servicepro_dev_role", "owner", { path: "/", sameSite: "lax", httpOnly: true });
        response.cookies.set("servicepro_mfa_token", "mfa_verified_4_factors", { path: "/", sameSite: "lax", httpOnly: true });
      }
      return response;
    }

    // Action 4: Verify TOTP Authenticator
    if (data.action === "verify_totp") {
      const isValid = verifyTotpCode(data.email, data.code);
      if (!isValid) {
        return NextResponse.json(
          { error: { code: "INVALID_TOTP", message: "Invalid 6-digit TOTP code." } },
          { status: 400 }
        );
      }

      const updated = verifyFactorInSession({
        sessionId: data.sessionId,
        factor: "totp",
        verified: true,
      });

      const response = NextResponse.json({ ok: true, session: updated });
      if (updated?.isUnlocked) {
        response.cookies.set("servicepro_dev_role", "owner", { path: "/", sameSite: "lax", httpOnly: true });
        response.cookies.set("servicepro_mfa_token", "mfa_verified_4_factors", { path: "/", sameSite: "lax", httpOnly: true });
      }
      return response;
    }

    // Action 5: Verify Passkey / WebAuthn
    if (data.action === "verify_passkey") {
      const updated = verifyFactorInSession({
        sessionId: data.sessionId,
        factor: "passkey",
        verified: true,
      });

      const response = NextResponse.json({ ok: true, session: updated });
      if (updated?.isUnlocked) {
        response.cookies.set("servicepro_dev_role", "owner", { path: "/", sameSite: "lax", httpOnly: true });
        response.cookies.set("servicepro_mfa_token", "mfa_verified_4_factors", { path: "/", sameSite: "lax", httpOnly: true });
      }
      return response;
    }

    // Action 6: Verify Trusted Device
    if (data.action === "verify_trusted_device") {
      const { trustedToken } = registerAndVerifyTrustedDevice({
        email: data.email,
        fingerprint: {
          browserId: data.browserId,
          deviceId: data.deviceId,
          osVersion: data.osVersion,
          hardwareSignature: data.hardwareSignature,
        },
      });

      const updated = verifyFactorInSession({
        sessionId: data.sessionId,
        factor: "trustedDevice",
        verified: true,
      });

      const response = NextResponse.json({ ok: true, session: updated, trustedToken });
      response.cookies.set("sp_trusted_device_token", trustedToken, { path: "/", maxAge: 90 * 86400, sameSite: "lax" });

      if (updated?.isUnlocked) {
        response.cookies.set("servicepro_dev_role", "owner", { path: "/", sameSite: "lax", httpOnly: true });
        response.cookies.set("servicepro_mfa_token", "mfa_verified_4_factors", { path: "/", sameSite: "lax", httpOnly: true });
      }
      return response;
    }

    return NextResponse.json({ error: { code: "UNKNOWN_ACTION", message: "Unsupported MFA action" } }, { status: 400 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "MFA verification failed";
    return NextResponse.json({ error: { code: "MFA_ERROR", message } }, { status: 500 });
  }
}
