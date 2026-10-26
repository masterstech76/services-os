import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireRole } from "@/lib/server/auth-guard";
import { collectJobPayment } from "@/lib/server/operations";
import { verifyCsrfOrigin } from "@/lib/server/csrf";
import { checkRateLimit } from "@/lib/server/rate-limit";

const recordPaymentSchema = z.object({
  jobId: z.string().min(1),
  method: z.enum(["cash", "check", "card_on_file", "tap_card"]),
  tipCents: z.number().int().min(0).default(0),
  cardBrand: z.string().optional(),
  cardLast4: z.string().optional(),
  cardholderName: z.string().optional(),
  checkReference: z.string().optional(),
});

export async function POST(req: NextRequest) {
  // 1. Role Authorization
  const auth = await requireRole(req, ["owner", "admin", "technician"]);
  if (!auth.ok) {
    return auth.response;
  }

  // 2. CSRF Protection
  const csrf = verifyCsrfOrigin(req);
  if (!csrf.valid && csrf.response) {
    return csrf.response;
  }

  // 3. Sensitive rate limiting (maximum 5 attempts with 15-minute lockout to stop brute-force hacking)
  const rl = checkRateLimit(req, { limit: 5, windowMs: 60_000, keyPrefix: "payment_record", lockoutMs: 15 * 60_000, maxFailures: 5 });
  if (!rl.allowed && rl.response) {
    return rl.response;
  }

  try {
    const body = await req.json();
    const parsed = recordPaymentSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: { code: "VALIDATION_ERROR", message: parsed.error.issues[0]?.message ?? "Invalid payment payload" } },
        { status: 400 }
      );
    }

    const result = await collectJobPayment({
      jobId: parsed.data.jobId,
      method: parsed.data.method,
      tipCents: parsed.data.tipCents,
      cardBrand: parsed.data.cardBrand,
      cardLast4: parsed.data.cardLast4,
      cardholderName: parsed.data.cardholderName,
      checkReference: parsed.data.checkReference,
      actorLabel: "owner/tech",
    });

    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to record payment";
    return NextResponse.json(
      { error: { code: "PAYMENT_RECORD_FAILED", message } },
      { status: 400 }
    );
  }
}
