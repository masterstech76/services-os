import "server-only";
import crypto from "crypto";
import {
  type SuperAdminMember,
  type QuorumActionType,
  type QuorumRule,
  type QuorumVote,
  type QuorumChangeRequest,
  SUPER_ADMIN_COUNCIL,
  QUORUM_RULES,
} from "@/lib/shared/quorum-types";

export type {
  SuperAdminMember,
  QuorumActionType,
  QuorumRule,
  QuorumVote,
  QuorumChangeRequest,
};

export { SUPER_ADMIN_COUNCIL, QUORUM_RULES };

// Global in-memory collection of Quorum Change Requests
const globalQuorumStore = globalThis as unknown as {
  __spQuorumRequests?: Map<string, QuorumChangeRequest>;
};

function getQuorumStore(): Map<string, QuorumChangeRequest> {
  if (!globalQuorumStore.__spQuorumRequests) {
    const store = new Map<string, QuorumChangeRequest>();

    // Seed realistic pending and approved requests
    const initialRequests: QuorumChangeRequest[] = [
      {
        id: "req_sec_101",
        actionType: "SECURITY_CHANGES",
        title: "Deploy AES-256 Cloud Vault Encryption for Database Locker",
        description: "Re-encrypt master environment secrets with zero-trust key rotation across Supabase & AWS RDS Aurora clusters.",
        requestedBy: {
          name: "Admin User",
          email: "david.chen@servicepro.demo",
          role: "super_admin",
        },
        rule: QUORUM_RULES.SECURITY_CHANGES,
        targetResource: "production-vault-cluster",
        votes: [
          {
            superAdminId: "sa-1",
            superAdminName: "Sarah Jenkins",
            vote: "approve",
            comment: "Cryptographic specifications verified. Approved.",
            stepUpVerified: true,
            timestamp: new Date(Date.now() - 3600000).toISOString(),
          },
          {
            superAdminId: "sa-2",
            superAdminName: "Admin User",
            vote: "approve",
            comment: "Initiated proposal.",
            stepUpVerified: true,
            timestamp: new Date(Date.now() - 3500000).toISOString(),
          },
          {
            superAdminId: "sa-3",
            superAdminName: "Elena Rostova",
            vote: "approve",
            comment: "Cloud migration tested in staging. All connection pools safe.",
            stepUpVerified: true,
            timestamp: new Date(Date.now() - 1800000).toISOString(),
          },
        ],
        status: "pending", // 3 of 4 required! Needs 1 more vote!
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        updatedAt: new Date(Date.now() - 1800000).toISOString(),
        auditTrail: [
          { actor: "Admin User", action: "REQUEST_CREATED", timestamp: new Date(Date.now() - 3600000).toISOString() },
          { actor: "Sarah Jenkins", action: "VOTE_APPROVED", timestamp: new Date(Date.now() - 3600000).toISOString() },
          { actor: "Elena Rostova", action: "VOTE_APPROVED", timestamp: new Date(Date.now() - 1800000).toISOString() },
        ],
      },
      {
        id: "req_adm_102",
        actionType: "NEW_ADMIN",
        title: "Onboard Senior Dispatch Supervisor (Carlos R. Vance)",
        description: "Provision operational administrative dashboard role for Florida regional dispatch operations.",
        requestedBy: {
          name: "Sarah Jenkins",
          email: "sarah.jenkins@servicepro.demo",
          role: "super_admin",
        },
        rule: QUORUM_RULES.NEW_ADMIN,
        targetResource: "usr-admin-carlos-vance",
        votes: [
          {
            superAdminId: "sa-1",
            superAdminName: "Sarah Jenkins",
            vote: "approve",
            comment: "Background check cleared.",
            stepUpVerified: true,
            timestamp: new Date(Date.now() - 7200000).toISOString(),
          },
          {
            superAdminId: "sa-5",
            superAdminName: "Victor Vance",
            vote: "approve",
            comment: "Approved for field dispatch lead.",
            stepUpVerified: true,
            timestamp: new Date(Date.now() - 5400000).toISOString(),
          },
        ],
        status: "approved", // 2 of 2 met!
        createdAt: new Date(Date.now() - 7200000).toISOString(),
        updatedAt: new Date(Date.now() - 5400000).toISOString(),
        auditTrail: [
          { actor: "Sarah Jenkins", action: "REQUEST_CREATED", timestamp: new Date(Date.now() - 7200000).toISOString() },
          { actor: "Sarah Jenkins", action: "VOTE_APPROVED", timestamp: new Date(Date.now() - 7200000).toISOString() },
          { actor: "Victor Vance", action: "VOTE_APPROVED", timestamp: new Date(Date.now() - 5400000).toISOString() },
          { actor: "System Consensus Engine", action: "QUORUM_THRESHOLD_ACHIEVED", timestamp: new Date(Date.now() - 5400000).toISOString() },
        ],
      },
      {
        id: "req_db_103",
        actionType: "DATABASE_ACCESS",
        title: "Enable Direct AWS Aurora RDS Read-Replica for Telemetry",
        description: "Provision fleet GPS breadcrumb analytical queries to AWS Aurora replica cluster.",
        requestedBy: {
          name: "Elena Rostova",
          email: "elena.rostova@servicepro.demo",
          role: "super_admin",
        },
        rule: QUORUM_RULES.DATABASE_ACCESS,
        targetResource: "aws-aurora-replica-01",
        votes: [
          {
            superAdminId: "sa-3",
            superAdminName: "Elena Rostova",
            vote: "approve",
            comment: "Read-only replica with bounded query limits.",
            stepUpVerified: true,
            timestamp: new Date(Date.now() - 10800000).toISOString(),
          },
        ],
        status: "pending", // 1 of 4 required!
        createdAt: new Date(Date.now() - 10800000).toISOString(),
        updatedAt: new Date(Date.now() - 10800000).toISOString(),
        auditTrail: [
          { actor: "Elena Rostova", action: "REQUEST_CREATED", timestamp: new Date(Date.now() - 10800000).toISOString() },
          { actor: "Elena Rostova", action: "VOTE_APPROVED", timestamp: new Date(Date.now() - 10800000).toISOString() },
        ],
      },
    ];

    initialRequests.forEach((req) => store.set(req.id, req));
    globalQuorumStore.__spQuorumRequests = store;
  }
  return globalQuorumStore.__spQuorumRequests;
}

export function getAllQuorumRequests(): QuorumChangeRequest[] {
  const store = getQuorumStore();
  return Array.from(store.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function createQuorumRequest(params: {
  actionType: QuorumActionType;
  title: string;
  description: string;
  requestedBy: { name: string; email: string; role: string };
  targetResource?: string;
  payload?: Record<string, unknown>;
  autoApproveInitiatorId?: string;
}): QuorumChangeRequest {
  const store = getQuorumStore();
  const id = `req_${params.actionType.toLowerCase()}_${Date.now().toString(36)}`;
  const rule = QUORUM_RULES[params.actionType];

  const nowIso = new Date().toISOString();
  const votes: QuorumVote[] = [];
  const auditTrail = [
    {
      actor: params.requestedBy.name,
      action: "REQUEST_CREATED",
      timestamp: nowIso,
      note: `Change proposed with threshold ${rule.requiredVotes}/${rule.totalSuperAdmins} approvals required.`,
    },
  ];

  if (params.autoApproveInitiatorId) {
    const initiator = SUPER_ADMIN_COUNCIL.find((m) => m.id === params.autoApproveInitiatorId);
    if (initiator) {
      votes.push({
        superAdminId: initiator.id,
        superAdminName: initiator.name,
        vote: "approve",
        comment: "Proposed and self-approved.",
        stepUpVerified: true,
        timestamp: nowIso,
      });
      auditTrail.push({
        actor: initiator.name,
        action: "VOTE_APPROVED",
        timestamp: nowIso,
        note: "Initiator self-approved.",
      });
    }
  }

  const req: QuorumChangeRequest = {
    id,
    actionType: params.actionType,
    title: params.title,
    description: params.description,
    requestedBy: params.requestedBy,
    rule,
    targetResource: params.targetResource,
    payload: params.payload,
    votes,
    status: votes.length >= rule.requiredVotes ? "approved" : "pending",
    createdAt: nowIso,
    updatedAt: nowIso,
    auditTrail,
  };

  store.set(id, req);
  return req;
}

export function castQuorumVote(params: {
  requestId: string;
  superAdminId: string;
  vote: "approve" | "reject";
  comment?: string;
  stepUpVerified: boolean;
  ipAddress?: string;
}): { success: boolean; request?: QuorumChangeRequest; message?: string } {
  const store = getQuorumStore();
  const req = store.get(params.requestId);
  if (!req) return { success: false, message: "Request not found" };

  if (req.status !== "pending") {
    return { success: false, message: `Request is already in '${req.status}' state.` };
  }

  const admin = SUPER_ADMIN_COUNCIL.find((m) => m.id === params.superAdminId);
  if (!admin) return { success: false, message: "Super admin not found" };

  // Remove existing vote if any and replace
  req.votes = req.votes.filter((v) => v.superAdminId !== params.superAdminId);
  const nowIso = new Date().toISOString();

  req.votes.push({
    superAdminId: admin.id,
    superAdminName: admin.name,
    vote: params.vote,
    comment: params.comment,
    stepUpVerified: params.stepUpVerified,
    timestamp: nowIso,
    ipAddress: params.ipAddress,
  });

  req.auditTrail.push({
    actor: admin.name,
    action: params.vote === "approve" ? "VOTE_APPROVED" : "VOTE_REJECTED",
    timestamp: nowIso,
    note: params.comment,
  });

  const approvals = req.votes.filter((v) => v.vote === "approve").length;
  const rejections = req.votes.filter((v) => v.vote === "reject").length;

  // Check if rejected
  if (rejections > (req.rule.totalSuperAdmins - req.rule.requiredVotes)) {
    req.status = "rejected";
    req.auditTrail.push({
      actor: "Consensus Engine",
      action: "QUORUM_REJECTED",
      timestamp: nowIso,
      note: "Too many negative votes received; quorum cannot be satisfied.",
    });
  } else if (approvals >= req.rule.requiredVotes) {
    if (req.rule.cooldownHours > 0) {
      req.status = "cooldown";
      req.cooldownEndsAt = new Date(Date.now() + req.rule.cooldownHours * 3600000).toISOString();
      req.auditTrail.push({
        actor: "Consensus Engine",
        action: "COOLDOWN_INITIATED",
        timestamp: nowIso,
        note: `Approval threshold reached (${approvals}/${req.rule.requiredVotes}). Entering ${req.rule.cooldownHours}h security cooldown.`,
      });
    } else {
      req.status = "approved";
      req.auditTrail.push({
        actor: "Consensus Engine",
        action: "QUORUM_APPROVED",
        timestamp: nowIso,
        note: `Approval threshold satisfied (${approvals}/${req.rule.requiredVotes}). Ready for execution.`,
      });
    }
  }

  req.updatedAt = nowIso;
  store.set(req.id, req);
  return { success: true, request: req };
}

export function vetoQuorumRequest(params: {
  requestId: string;
  superAdminId: string;
  reason: string;
}): { success: boolean; request?: QuorumChangeRequest; message?: string } {
  const store = getQuorumStore();
  const req = store.get(params.requestId);
  if (!req) return { success: false, message: "Request not found" };

  const admin = SUPER_ADMIN_COUNCIL.find((m) => m.id === params.superAdminId);
  if (!admin) return { success: false, message: "Super admin not found" };

  const nowIso = new Date().toISOString();
  req.status = "vetoed";
  req.auditTrail.push({
    actor: admin.name,
    action: "EMERGENCY_VETO_EXERCISED",
    timestamp: nowIso,
    note: `VETO REASON: ${params.reason}`,
  });
  req.updatedAt = nowIso;
  store.set(req.id, req);

  return { success: true, request: req };
}

export function executeQuorumAction(params: {
  requestId: string;
  executedBySuperAdminId: string;
}): { success: boolean; request?: QuorumChangeRequest; message?: string } {
  const store = getQuorumStore();
  const req = store.get(params.requestId);
  if (!req) return { success: false, message: "Request not found" };

  if (req.status !== "approved" && req.status !== "cooldown") {
    return { success: false, message: `Cannot execute request in '${req.status}' status.` };
  }

  const admin = SUPER_ADMIN_COUNCIL.find((m) => m.id === params.executedBySuperAdminId);
  const nowIso = new Date().toISOString();

  req.status = "executed";
  req.executedAt = nowIso;
  req.executedBy = admin ? admin.name : "System Operator";

  req.auditTrail.push({
    actor: req.executedBy,
    action: "ACTION_EXECUTED",
    timestamp: nowIso,
    note: "Change applied to production system.",
  });

  req.updatedAt = nowIso;
  store.set(req.id, req);
  return { success: true, request: req };
}
