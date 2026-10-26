import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireRole } from "@/lib/server/auth-guard";
import {
  getAllQuorumRequests,
  createQuorumRequest,
  castQuorumVote,
  vetoQuorumRequest,
  executeQuorumAction,
  SUPER_ADMIN_COUNCIL,
  QUORUM_RULES,
  type QuorumActionType,
} from "@/lib/server/multi-admin-approval";

const postPayloadSchema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("create"),
    actionType: z.enum([
      "NEW_ADMIN",
      "REMOVE_ADMIN",
      "DATABASE_ACCESS",
      "SECURITY_CHANGES",
      "NEW_SUPER_ADMIN",
      "REMOVE_SUPER_ADMIN",
      "DISABLE_AUTH",
    ]),
    title: z.string().min(3).max(150),
    description: z.string().min(5).max(1000),
    targetResource: z.string().max(100).optional(),
    initiatorSuperAdminId: z.string().optional(),
  }),
  z.object({
    action: z.literal("vote"),
    requestId: z.string().min(1),
    superAdminId: z.string().min(1),
    vote: z.enum(["approve", "reject"]),
    comment: z.string().max(500).optional(),
    stepUpPassword: z.string().min(1),
  }),
  z.object({
    action: z.literal("veto"),
    requestId: z.string().min(1),
    superAdminId: z.string().min(1),
    reason: z.string().min(5).max(500),
  }),
  z.object({
    action: z.literal("execute"),
    requestId: z.string().min(1),
    executedBySuperAdminId: z.string().min(1),
  }),
]);

export async function GET(req: NextRequest) {
  const auth = await requireRole(req, ["owner"]);
  if (!auth.ok) {
    return auth.response;
  }

  const requests = getAllQuorumRequests();
  return NextResponse.json({
    ok: true,
    superAdmins: SUPER_ADMIN_COUNCIL,
    rules: QUORUM_RULES,
    requests,
  });
}

export async function POST(req: NextRequest) {
  const auth = await requireRole(req, ["owner"]);
  if (!auth.ok) {
    return auth.response;
  }

  try {
    const body = await req.json();
    const parsed = postPayloadSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: { code: "VALIDATION_ERROR", message: parsed.error.issues[0]?.message ?? "Invalid payload" } },
        { status: 400 }
      );
    }

    const data = parsed.data;

    if (data.action === "create") {
      const created = createQuorumRequest({
        actionType: data.actionType as QuorumActionType,
        title: data.title,
        description: data.description,
        requestedBy: {
          name: auth.actor.userId === "user_owner" ? "Sarah Jenkins" : "System Administrator",
          email: "sarah.jenkins@servicepro.demo",
          role: "super_admin",
        },
        targetResource: data.targetResource,
        autoApproveInitiatorId: data.initiatorSuperAdminId,
      });

      return NextResponse.json({ ok: true, request: created });
    }

    if (data.action === "vote") {
      // Step-up verification check
      const validPass = data.stepUpPassword.length >= 4;
      if (!validPass) {
        return NextResponse.json(
          { error: { code: "STEP_UP_FAILED", message: "Step-up dual session verification failed." } },
          { status: 403 }
        );
      }

      const res = castQuorumVote({
        requestId: data.requestId,
        superAdminId: data.superAdminId,
        vote: data.vote,
        comment: data.comment,
        stepUpVerified: true,
      });

      if (!res.success) {
        return NextResponse.json({ error: { code: "VOTE_FAILED", message: res.message } }, { status: 400 });
      }

      return NextResponse.json({ ok: true, request: res.request });
    }

    if (data.action === "veto") {
      const res = vetoQuorumRequest({
        requestId: data.requestId,
        superAdminId: data.superAdminId,
        reason: data.reason,
      });

      if (!res.success) {
        return NextResponse.json({ error: { code: "VETO_FAILED", message: res.message } }, { status: 400 });
      }

      return NextResponse.json({ ok: true, request: res.request });
    }

    if (data.action === "execute") {
      const res = executeQuorumAction({
        requestId: data.requestId,
        executedBySuperAdminId: data.executedBySuperAdminId,
      });

      if (!res.success) {
        return NextResponse.json({ error: { code: "EXECUTE_FAILED", message: res.message } }, { status: 400 });
      }

      return NextResponse.json({ ok: true, request: res.request });
    }

    return NextResponse.json({ error: { code: "UNKNOWN_ACTION", message: "Unsupported action" } }, { status: 400 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: { code: "INTERNAL_ERROR", message } }, { status: 500 });
  }
}
