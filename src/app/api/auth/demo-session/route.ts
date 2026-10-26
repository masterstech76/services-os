import { NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/server/rate-limit";
import { verifyCsrfOrigin } from "@/lib/server/csrf";

export async function POST(request: Request) {
  // 1. CSRF Protection
  const csrf = verifyCsrfOrigin(request);
  if (!csrf.valid && csrf.response) {
    return csrf.response;
  }

  // 2. Strict Anti-Hacking Rate Limiting (max 5 attempts with 15-minute lockout)
  const rl = checkRateLimit(request, { limit: 5, windowMs: 60_000, keyPrefix: "auth_demo_session", lockoutMs: 15 * 60_000, maxFailures: 5 });
  if (!rl.allowed && rl.response) {
    return rl.response;
  }

  // 3. Production lock: In production, demo auth is strictly disabled by default (opt-in only via ALLOW_DEMO_AUTH=true)
  const isProduction = process.env.NODE_ENV === "production";
  const isExplicitlyAllowed = process.env.ALLOW_DEMO_AUTH === "true";
  if (isProduction && !isExplicitlyAllowed) {
    return NextResponse.json(
      {
        error: {
          code: "FORBIDDEN",
          message: "Demo authentication is disabled in production.",
        },
      },
      { status: 403 }
    );
  }

  const body = (await request.json()) as {
    role?: "owner" | "admin" | "technician" | "customer" | "clear";
    technicianId?: string;
  };

  const response = NextResponse.json({
    ok: true,
    role: body.role ?? "owner",
    technicianId: body.technicianId ?? "tech-carlos",
  });

  if (body.role === "clear") {
    response.cookies.delete("servicepro_dev_role");
    response.cookies.delete("sp_demo_role");
    response.cookies.delete("sp_demo_tech_id");
    return response;
  }

  const role = body.role ?? "owner";
  const isProd = process.env.NODE_ENV === "production";
  response.cookies.set("servicepro_dev_role", role, {
    path: "/",
    httpOnly: true,
    secure: isProd,
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7,
  });
  response.cookies.set("sp_demo_role", role, {
    path: "/",
    httpOnly: true,
    secure: isProd,
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7,
  });

  if (body.technicianId) {
    response.cookies.set("sp_demo_tech_id", body.technicianId, {
      path: "/",
      httpOnly: true,
      secure: isProd,
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7,
    });
  }

  return response;
}
