export interface SuperAdminMember {
  id: string;
  name: string;
  email: string;
  role: "super_admin";
  title: string;
  avatar: string;
  department: string;
  status: "active" | "away";
}

export type QuorumActionType =
  | "NEW_ADMIN"
  | "REMOVE_ADMIN"
  | "DATABASE_ACCESS"
  | "SECURITY_CHANGES"
  | "NEW_SUPER_ADMIN"
  | "REMOVE_SUPER_ADMIN"
  | "DISABLE_AUTH";

export interface QuorumRule {
  actionType: QuorumActionType;
  label: string;
  description: string;
  requiredVotes: number;
  totalSuperAdmins: number;
  requiresUnanimous: boolean;
  cooldownHours: number;
}

export interface QuorumVote {
  superAdminId: string;
  superAdminName: string;
  vote: "approve" | "reject";
  comment?: string;
  stepUpVerified: boolean;
  timestamp: string;
  ipAddress?: string;
}

export interface QuorumChangeRequest {
  id: string;
  actionType: QuorumActionType;
  title: string;
  description: string;
  requestedBy: {
    name: string;
    email: string;
    role: string;
  };
  rule: QuorumRule;
  targetResource?: string;
  payload?: Record<string, unknown>;
  votes: QuorumVote[];
  status: "pending" | "approved" | "cooldown" | "rejected" | "executed" | "vetoed";
  cooldownEndsAt?: string;
  createdAt: string;
  updatedAt: string;
  executedAt?: string;
  executedBy?: string;
  auditTrail: Array<{
    actor: string;
    action: string;
    timestamp: string;
    note?: string;
  }>;
}

export const SUPER_ADMIN_COUNCIL: SuperAdminMember[] = [
  {
    id: "sa-1",
    name: "Sarah Jenkins",
    email: "sarah.jenkins@servicepro.demo",
    role: "super_admin",
    title: "Chief Information Security Officer & Founder",
    avatar: "SJ",
    department: "Security & Governance",
    status: "active",
  },
  {
    id: "sa-2",
    name: "David Chen",
    email: "david.chen@servicepro.demo",
    role: "super_admin",
    title: "Chief Technology Officer",
    avatar: "DC",
    department: "Engineering Architecture",
    status: "active",
  },
  {
    id: "sa-3",
    name: "Elena Rostova",
    email: "elena.rostova@servicepro.demo",
    role: "super_admin",
    title: "Principal Infrastructure Architect",
    avatar: "ER",
    department: "Cloud Operations",
    status: "active",
  },
  {
    id: "sa-4",
    name: "Marcus Sterling",
    email: "marcus.sterling@servicepro.demo",
    role: "super_admin",
    title: "Director of Risk & Compliance",
    avatar: "MS",
    department: "Regulatory Compliance",
    status: "active",
  },
  {
    id: "sa-5",
    name: "Victor Vance",
    email: "victor.vance@servicepro.demo",
    role: "super_admin",
    title: "Executive VP of Field Operations & Co-Founder",
    avatar: "VV",
    department: "Executive Committee",
    status: "active",
  },
];

export const QUORUM_RULES: Record<QuorumActionType, QuorumRule> = {
  NEW_ADMIN: {
    actionType: "NEW_ADMIN",
    label: "Create Standard Admin",
    description: "Grant operations admin credentials to new management staff",
    requiredVotes: 2,
    totalSuperAdmins: 5,
    requiresUnanimous: false,
    cooldownHours: 0,
  },
  REMOVE_ADMIN: {
    actionType: "REMOVE_ADMIN",
    label: "Revoke / Remove Admin",
    description: "Revoke administrative privileges from operational staff",
    requiredVotes: 3,
    totalSuperAdmins: 5,
    requiresUnanimous: false,
    cooldownHours: 0,
  },
  DATABASE_ACCESS: {
    actionType: "DATABASE_ACCESS",
    label: "Production Database / Credential Access",
    description: "Modify live PostgreSQL connection pools or AWS Aurora credentials",
    requiredVotes: 4,
    totalSuperAdmins: 5,
    requiresUnanimous: false,
    cooldownHours: 24,
  },
  SECURITY_CHANGES: {
    actionType: "SECURITY_CHANGES",
    label: "Security Policy / Firewall Changes",
    description: "Alter MFA policies, encryption keys, or CSRF origin permissions",
    requiredVotes: 4,
    totalSuperAdmins: 5,
    requiresUnanimous: false,
    cooldownHours: 24,
  },
  NEW_SUPER_ADMIN: {
    actionType: "NEW_SUPER_ADMIN",
    label: "Promote New Super Admin",
    description: "Admit a new member into the core Super Admin Council",
    requiredVotes: 5,
    totalSuperAdmins: 5,
    requiresUnanimous: true,
    cooldownHours: 48,
  },
  REMOVE_SUPER_ADMIN: {
    actionType: "REMOVE_SUPER_ADMIN",
    label: "Expel / Demote Super Admin",
    description: "Strip voting powers from an existing Super Admin member",
    requiredVotes: 5,
    totalSuperAdmins: 5,
    requiresUnanimous: true,
    cooldownHours: 48,
  },
  DISABLE_AUTH: {
    actionType: "DISABLE_AUTH",
    label: "Emergency Bypass / Disable Authentication",
    description: "Temporarily bypass authentication guards during DR procedures",
    requiredVotes: 5,
    totalSuperAdmins: 5,
    requiresUnanimous: true,
    cooldownHours: 72,
  },
};
