import { NextResponse } from "next/server";
import { resolveAdminSession, getAdminPaymentDetail, refundAdminPayment } from "@/lib/server/admin-portal";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await resolveAdminSession(request);
  if (!session) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "Admin access required" } },
      { status: 401 }
    );
  }

  const detail = getAdminPaymentDetail(params.id);
  if (!detail) {
    return NextResponse.json(
      { error: { code: "NOT_FOUND", message: "Payment record not found" } },
      { status: 404 }
    );
  }

  return NextResponse.json(detail);
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await resolveAdminSession(request);
  if (!session) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "Admin access required" } },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const action = body.action;

    if (action === "refund") {
      const ok = refundAdminPayment(params.id);
      if (!ok) {
        return NextResponse.json({ error: { code: "NOT_FOUND", message: "Payment not found" } }, { status: 404 });
      }
      return NextResponse.json({ success: true, message: "Payment marked as refunded" });
    }

    return NextResponse.json({ error: { code: "BAD_REQUEST", message: "Unknown action" } }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ error: { code: "SERVER_ERROR", message: "Failed to update payment" } }, { status: 500 });
  }
}
