import { NextResponse } from "next/server";
import { requireRole } from "@/lib/server/auth-guard";
import { getRevenueReport } from "@/lib/server/operations";

export async function GET(request: Request) {
  const auth = await requireRole(request, ["owner", "admin"]);
  if (!auth.ok) {
    return auth.response;
  }

  const { searchParams } = new URL(request.url);
  const fromDate = searchParams.get("from") ?? undefined;
  const toDate = searchParams.get("to") ?? undefined;
  const groupBy = (searchParams.get("groupBy") as "tech" | "service" | "day") ?? "tech";

  const report = getRevenueReport({ fromDate, toDate, groupBy });
  return NextResponse.json(report);
}
