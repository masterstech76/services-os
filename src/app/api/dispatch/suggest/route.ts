import { NextResponse } from "next/server";
import { requireRole } from "@/lib/server/auth-guard";
import { suggestTechniciansForJob } from "@/lib/server/operations";

export async function GET(request: Request) {
  const auth = await requireRole(request, ["owner", "admin"]);
  if (!auth.ok) {
    return auth.response;
  }

  const { searchParams } = new URL(request.url);
  const jobId = searchParams.get("jobId");
  if (!jobId) {
    return NextResponse.json(
      { error: { code: "INVALID_INPUT", message: "jobId is required" } },
      { status: 400 }
    );
  }

  const suggestions = suggestTechniciansForJob(jobId);
  return NextResponse.json({ suggestions });
}
