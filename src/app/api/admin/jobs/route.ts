import { NextResponse } from "next/server";
import { z } from "zod";
import {
  resolveAdminSession,
  getAdminWorkOrders,
  createAdminJob,
} from "@/lib/server/admin-portal";

const createAdminJobSchema = z.object({
  customerName: z.string().min(1, "Customer name is required").max(100),
  customerPhone: z.string().min(7, "Valid customer phone is required").max(30),
  customerEmail: z.string().email("Valid customer email is required").optional().or(z.literal("")),
  addressLine1: z.string().min(1, "Address is required").max(200),
  addressLine2: z.string().max(100).optional(),
  city: z.string().max(100).optional(),
  state: z.string().max(50).optional(),
  zip: z.string().min(5, "Valid ZIP is required").max(10),
  serviceId: z.string().min(1, "Service selection is required"),
  scheduledStart: z.string().min(1, "Scheduled start time is required"),
  issueText: z.string().max(2000).optional(),
  notesInternal: z.string().max(2000).optional(),
  technicianId: z.string().nullable().optional(),
});

export async function GET(request: Request) {
  const session = await resolveAdminSession(request);
  if (!session) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "Admin access required" } },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") || undefined;
  const technicianId = searchParams.get("technicianId") || undefined;
  const customerId = searchParams.get("customerId") || undefined;
  const search = searchParams.get("q") || undefined;
  const date = searchParams.get("date") || undefined;
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "25", 10);

  const result = getAdminWorkOrders({
    status,
    technicianId,
    customerId,
    search,
    date,
    page,
    limit,
  });

  return NextResponse.json(result);
}

export async function POST(request: Request) {
  const session = await resolveAdminSession(request);
  if (!session) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "Admin access required" } },
      { status: 401 }
    );
  }

  try {
    const raw = await request.json().catch(() => null);
    const parsed = createAdminJobSchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json(
        { error: { code: "VALIDATION_ERROR", message: parsed.error.issues[0]?.message ?? "Invalid job details" } },
        { status: 400 }
      );
    }
    const body = parsed.data;
    const res = createAdminJob({
      customerName: body.customerName,
      customerPhone: body.customerPhone,
      customerEmail: body.customerEmail || undefined,
      addressLine1: body.addressLine1,
      addressLine2: body.addressLine2,
      city: body.city || "Miami",
      state: body.state || "FL",
      zip: body.zip,
      serviceId: body.serviceId,
      scheduledStart: body.scheduledStart,
      issueText: body.issueText,
      notesInternal: body.notesInternal,
      technicianId: body.technicianId || null,
      actor: session.name,
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: { code: "CREATE_JOB_ERROR", message: res.error || "Failed to create work order" } },
        { status: 400 }
      );
    }

    return NextResponse.json({ ok: true, job: res.job });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Bad request";
    return NextResponse.json(
      { error: { code: "BAD_REQUEST", message: msg } },
      { status: 400 }
    );
  }
}
