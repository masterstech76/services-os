"use client";

import * as React from "react";
import {
  ShieldCheck,
  ShieldAlert,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  KeyRound,
  Database,
  Lock,
  Plus,
  ArrowRight,
  AlertTriangle,
  RefreshCw,
  Send,
  UserCheck,
  FileText,
  BadgeCheck,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  SUPER_ADMIN_COUNCIL,
  QUORUM_RULES,
  type QuorumChangeRequest,
  type SuperAdminMember,
  type QuorumActionType,
} from "@/lib/shared/quorum-types";

export default function MultiAdminApprovalsPage() {
  const [requests, setRequests] = React.useState<QuorumChangeRequest[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState<"pending" | "approved" | "history">("pending");

  // Selected current acting super admin (for simulation / demo quorum voting)
  const [actingSuperAdminId, setActingSuperAdminId] = React.useState("sa-1");

  // Vote Modal State
  const [votingRequest, setVotingRequest] = React.useState<QuorumChangeRequest | null>(null);
  const [voteChoice, setVoteChoice] = React.useState<"approve" | "reject">("approve");
  const [voteComment, setVoteComment] = React.useState("");
  const [stepUpPassword, setStepUpPassword] = React.useState("");
  const [isSubmittingVote, setIsSubmittingVote] = React.useState(false);

  // New Request Modal State
  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const [newActionType, setNewActionType] = React.useState<QuorumActionType>("SECURITY_CHANGES");
  const [newTitle, setNewTitle] = React.useState("");
  const [newDescription, setNewDescription] = React.useState("");
  const [newTargetResource, setNewTargetResource] = React.useState("");
  const [isCreatingRequest, setIsCreatingRequest] = React.useState(false);

  // Veto Modal State
  const [vetoRequest, setVetoRequest] = React.useState<QuorumChangeRequest | null>(null);
  const [vetoReason, setVetoReason] = React.useState("");
  const [isSubmittingVeto, setIsSubmittingVeto] = React.useState(false);

  const fetchApprovals = React.useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/approvals");
      if (res.ok) {
        const data = await res.json();
        setRequests(data.requests || []);
      }
    } catch {
      toast.error("Failed to load multi-admin approval requests");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void fetchApprovals();
  }, [fetchApprovals]);

  const actingSuperAdmin = SUPER_ADMIN_COUNCIL.find((s) => s.id === actingSuperAdminId) || SUPER_ADMIN_COUNCIL[0];

  async function handleCastVote(e: React.FormEvent) {
    e.preventDefault();
    if (!votingRequest) return;
    if (!stepUpPassword) {
      toast.error("Dual-session verification password is required to cast vote.");
      return;
    }

    setIsSubmittingVote(true);
    try {
      const res = await fetch("/api/admin/approvals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "vote",
          requestId: votingRequest.id,
          superAdminId: actingSuperAdminId,
          vote: voteChoice,
          comment: voteComment.trim() || undefined,
          stepUpPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error?.message || "Failed to register vote");
        return;
      }

      toast.success(
        voteChoice === "approve"
          ? `Super Admin approval cast by ${actingSuperAdmin.name}`
          : `Rejection vote cast by ${actingSuperAdmin.name}`
      );
      setVotingRequest(null);
      setVoteComment("");
      setStepUpPassword("");
      void fetchApprovals();
    } catch {
      toast.error("Network error submitting vote");
    } finally {
      setIsSubmittingVote(false);
    }
  }

  async function handleExecuteAction(req: QuorumChangeRequest) {
    try {
      const res = await fetch("/api/admin/approvals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "execute",
          requestId: req.id,
          executedBySuperAdminId: actingSuperAdminId,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error?.message || "Failed to execute approved action");
        return;
      }

      toast.success(`Action "${req.title}" executed successfully.`);
      void fetchApprovals();
    } catch {
      toast.error("Network error executing action");
    }
  }

  async function handleVetoSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!vetoRequest) return;
    if (!vetoReason.trim()) {
      toast.error("Please state reason for exercising emergency Super Admin veto.");
      return;
    }

    setIsSubmittingVeto(true);
    try {
      const res = await fetch("/api/admin/approvals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "veto",
          requestId: vetoRequest.id,
          superAdminId: actingSuperAdminId,
          reason: vetoReason.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error?.message || "Veto failed");
        return;
      }

      toast.warning(`Emergency VETO exercised by ${actingSuperAdmin.name}`);
      setVetoRequest(null);
      setVetoReason("");
      void fetchApprovals();
    } catch {
      toast.error("Network error submitting veto");
    } finally {
      setIsSubmittingVeto(false);
    }
  }

  async function handleCreateRequest(e: React.FormEvent) {
    e.preventDefault();
    if (!newTitle.trim() || !newDescription.trim()) {
      toast.error("Title and description are required.");
      return;
    }

    setIsCreatingRequest(true);
    try {
      const res = await fetch("/api/admin/approvals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create",
          actionType: newActionType,
          title: newTitle.trim(),
          description: newDescription.trim(),
          targetResource: newTargetResource.trim() || undefined,
          initiatorSuperAdminId: actingSuperAdminId,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error?.message || "Failed to create change proposal");
        return;
      }

      toast.success("New quorum proposal initiated with initiator approval recorded.");
      setShowCreateModal(false);
      setNewTitle("");
      setNewDescription("");
      setNewTargetResource("");
      void fetchApprovals();
    } catch {
      toast.error("Network error creating request");
    } finally {
      setIsCreatingRequest(false);
    }
  }

  const pendingRequests = requests.filter((r) => r.status === "pending" || r.status === "cooldown");
  const approvedRequests = requests.filter((r) => r.status === "approved");
  const historyRequests = requests.filter((r) => r.status === "executed" || r.status === "rejected" || r.status === "vetoed");

  const displayedRequests =
    activeTab === "pending"
      ? pendingRequests
      : activeTab === "approved"
      ? approvedRequests
      : historyRequests;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Zero Single-Point-of-Failure (5-Member Council)
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
              Cryptographic Quorum Engine
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white mt-2 flex items-center gap-2">
            <ShieldCheck className="w-7 h-7 text-emerald-400" />
            Enterprise Multi-Admin Approval Center
          </h1>
          <p className="text-slate-400 text-sm mt-1 max-w-3xl">
            Critical security policies, database connection pools, admin appointments, and encryption keys cannot be modified
            by a single individual. All high-impact changes require threshold quorum verification from the 5-member Super Admin Council.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => void fetchApprovals()}
            variant="outline"
            className="border-slate-700 bg-slate-900/60 text-slate-300 hover:text-white"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>

          <Button
            onClick={() => setShowCreateModal(true)}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium"
          >
            <Plus className="w-4 h-4 mr-2" />
            Propose Critical Change
          </Button>
        </div>
      </div>

      {/* Acting Super Admin Identity Switcher (For Pair Testing & Multi-Admin Simulation) */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center font-bold text-sm">
            {actingSuperAdmin.avatar}
          </div>
          <div>
            <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
              Current Acting Super Admin Voter
            </div>
            <div className="text-sm font-semibold text-white flex items-center gap-2">
              {actingSuperAdmin.name}
              <span className="text-xs text-slate-400 font-normal">({actingSuperAdmin.title})</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Label className="text-xs text-slate-400">Switch Council Seat:</Label>
          <select
            value={actingSuperAdminId}
            onChange={(e) => setActingSuperAdminId(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2 outline-none focus:border-emerald-500"
          >
            {SUPER_ADMIN_COUNCIL.map((adm) => (
              <option key={adm.id} value={adm.id}>
                {adm.name} — {adm.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Council of 5 Super Admins Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-400" />
            Council of 5 Super Admins (Quorum Voting Body)
          </h2>
          <span className="text-xs text-slate-400">All 5 seats active with cryptographic step-up credentials</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {SUPER_ADMIN_COUNCIL.map((adm) => {
            const isSelected = adm.id === actingSuperAdminId;
            return (
              <div
                key={adm.id}
                onClick={() => setActingSuperAdminId(adm.id)}
                className={`cursor-pointer border rounded-xl p-3.5 transition-all relative ${
                  isSelected
                    ? "bg-emerald-950/20 border-emerald-500/60 ring-1 ring-emerald-500/40"
                    : "bg-slate-900/40 border-slate-800 hover:border-slate-700"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="w-8 h-8 rounded-full bg-slate-800 text-slate-200 font-bold text-xs flex items-center justify-center border border-slate-700">
                    {adm.avatar}
                  </div>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 ring-4 ring-emerald-400/20" />
                </div>
                <div className="mt-2.5 font-semibold text-xs text-white truncate">{adm.name}</div>
                <div className="text-[11px] text-slate-400 leading-tight mt-0.5 line-clamp-2">{adm.title}</div>
                <div className="mt-2 text-[10px] text-emerald-400/90 font-mono flex items-center gap-1">
                  <BadgeCheck className="w-3 h-3" />
                  Voting Power: 1 Vote
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quorum Threshold Rules Table */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-400" />
            Constitutional Quorum Rules Matrix
          </div>
          <span className="text-xs text-slate-400">Strictly enforced server-side before execution</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3 text-xs">
          {Object.values(QUORUM_RULES).map((rule) => (
            <div key={rule.actionType} className="bg-slate-950/60 border border-slate-800 rounded-lg p-2.5 space-y-1">
              <div className="font-semibold text-slate-200">{rule.label}</div>
              <div className="text-slate-400 text-[11px] leading-tight">{rule.description}</div>
              <div className="flex items-center justify-between pt-1 border-t border-slate-900 text-[11px]">
                <span className="text-amber-400 font-mono font-bold">
                  {rule.requiredVotes} of {rule.totalSuperAdmins} Required
                </span>
                <span className="text-slate-400">
                  {rule.cooldownHours > 0 ? `${rule.cooldownHours}h Cooldown` : "Instant"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs & Change Requests List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("pending")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeTab === "pending"
                  ? "bg-emerald-500 text-white"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              Active Pending Quorum ({pendingRequests.length})
            </button>
            <button
              onClick={() => setActiveTab("approved")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeTab === "approved"
                  ? "bg-emerald-500 text-white"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              Approved & Ready ({approvedRequests.length})
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeTab === "history"
                  ? "bg-emerald-500 text-white"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              Audit History ({historyRequests.length})
            </button>
          </div>

          <div className="text-xs text-slate-400">
            {displayedRequests.length} Change Request{displayedRequests.length === 1 ? "" : "s"}
          </div>
        </div>

        {displayedRequests.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-slate-800 rounded-xl bg-slate-950/40">
            <CheckCircle2 className="w-10 h-10 text-slate-600 mx-auto mb-2" />
            <div className="text-sm font-semibold text-slate-300">No requests in this view</div>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
              All multi-admin approval requirements are currently satisfied.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {displayedRequests.map((req) => {
              const approvalVotes = req.votes.filter((v) => v.vote === "approve");
              const rejectionVotes = req.votes.filter((v) => v.vote === "reject");
              const hasVotedCurrent = req.votes.some((v) => v.superAdminId === actingSuperAdminId);
              const progressPct = Math.min(100, Math.round((approvalVotes.length / req.rule.requiredVotes) * 100));

              return (
                <div
                  key={req.id}
                  className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-4 hover:border-slate-700 transition-all"
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700">
                          {req.actionType}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            req.status === "approved"
                              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                              : req.status === "cooldown"
                              ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                              : req.status === "executed"
                              ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                              : req.status === "vetoed" || req.status === "rejected"
                              ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                              : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                          }`}
                        >
                          {req.status === "cooldown" ? "Security Cooldown" : req.status}
                        </span>
                        {req.rule.requiresUnanimous && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/10 text-red-400 border border-red-500/20">
                            Unanimous 5/5 Required
                          </span>
                        )}
                      </div>
                      <h3 className="text-base font-bold text-white mt-1">{req.title}</h3>
                      <p className="text-xs text-slate-400 leading-relaxed max-w-3xl">{req.description}</p>
                      {req.targetResource && (
                        <div className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                          <Database className="w-3 h-3 text-slate-400" />
                          Target Resource: <span className="text-slate-300">{req.targetResource}</span>
                        </div>
                      )}
                    </div>

                    {/* Progress Badge */}
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <div className="text-xs font-mono font-bold text-emerald-400">
                        {approvalVotes.length} / {req.rule.requiredVotes} Approvals
                      </div>
                      <div className="w-36 h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                        <div
                          className="h-full bg-emerald-500 transition-all duration-500"
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {req.rule.totalSuperAdmins - approvalVotes.length} more needed
                      </div>
                    </div>
                  </div>

                  {/* Voters Badges */}
                  <div className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-3 space-y-2">
                    <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <UserCheck className="w-3 h-3 text-emerald-400" />
                      Council Member Ballots Cast:
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {SUPER_ADMIN_COUNCIL.map((adm) => {
                        const castVote = req.votes.find((v) => v.superAdminId === adm.id);
                        return (
                          <div
                            key={adm.id}
                            className={`px-2.5 py-1 rounded text-xs flex items-center gap-1.5 border ${
                              castVote?.vote === "approve"
                                ? "bg-emerald-950/30 border-emerald-500/40 text-emerald-300"
                                : castVote?.vote === "reject"
                                ? "bg-rose-950/30 border-rose-500/40 text-rose-300"
                                : "bg-slate-900 border-slate-800 text-slate-400"
                            }`}
                          >
                            <span className="font-bold text-[10px]">{adm.avatar}</span>
                            <span>{adm.name.split(" ")[0]}</span>
                            {castVote?.vote === "approve" ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            ) : castVote?.vote === "reject" ? (
                              <XCircle className="w-3.5 h-3.5 text-rose-400" />
                            ) : (
                              <Clock className="w-3 h-3 text-slate-600" />
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Comments on votes */}
                    {req.votes.some((v) => v.comment) && (
                      <div className="mt-2 space-y-1 pt-2 border-t border-slate-900 text-xs">
                        {req.votes
                          .filter((v) => v.comment)
                          .map((v, i) => (
                            <div key={i} className="text-slate-400 text-[11px] flex items-start gap-1">
                              <span className="text-slate-300 font-semibold">{v.superAdminName}:</span>
                              <span>&ldquo;{v.comment}&rdquo;</span>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
                    <div className="text-[11px] text-slate-400">
                      Proposed by <span className="text-slate-300">{req.requestedBy.name}</span> on{" "}
                      {new Date(req.createdAt).toLocaleString()}
                    </div>

                    <div className="flex items-center gap-2">
                      {req.status === "pending" && (
                        <>
                          <Button
                            onClick={() => {
                              setVotingRequest(req);
                              setVoteChoice("approve");
                            }}
                            size="sm"
                            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                            Cast Vote as {actingSuperAdmin.name.split(" ")[0]}
                          </Button>

                          <Button
                            onClick={() => {
                              setVetoRequest(req);
                            }}
                            size="sm"
                            variant="destructive"
                            className="bg-rose-900/60 hover:bg-rose-800 text-rose-200 border border-rose-700/50 text-xs"
                          >
                            <ShieldAlert className="w-3.5 h-3.5 mr-1" />
                            Emergency Veto
                          </Button>
                        </>
                      )}

                      {(req.status === "approved" || req.status === "cooldown") && (
                        <Button
                          onClick={() => void handleExecuteAction(req)}
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold"
                        >
                          <Send className="w-3.5 h-3.5 mr-1" />
                          Execute Change ({req.rule.label})
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Step-Up Voting Modal */}
      {votingRequest && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Cast Super Admin Ballot</h3>
                <p className="text-xs text-slate-400">Step-Up Dual Session Verification</p>
              </div>
            </div>

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs space-y-1">
              <div className="text-slate-400">Proposing Action:</div>
              <div className="font-semibold text-slate-200">{votingRequest.title}</div>
              <div className="text-emerald-400 font-mono text-[11px]">
                Quorum Target: {votingRequest.rule.requiredVotes} of {votingRequest.rule.totalSuperAdmins} Approvals
              </div>
            </div>

            <form onSubmit={handleCastVote} className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs text-slate-300">Your Ballot Decision</Label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setVoteChoice("approve")}
                    className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                      voteChoice === "approve"
                        ? "bg-emerald-600 text-white border-emerald-500"
                        : "bg-slate-950 text-slate-400 border-slate-800"
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    APPROVE
                  </button>
                  <button
                    type="button"
                    onClick={() => setVoteChoice("reject")}
                    className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                      voteChoice === "reject"
                        ? "bg-rose-600 text-white border-rose-500"
                        : "bg-slate-950 text-slate-400 border-slate-800"
                    }`}
                  >
                    <XCircle className="w-4 h-4" />
                    REJECT
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-slate-300">Rationale / Note for Audit Ledger</Label>
                <Input
                  value={voteComment}
                  onChange={(e) => setVoteComment(e.target.value)}
                  placeholder="e.g. Reviewed architecture change; approved for deployment"
                  className="bg-slate-950 border-slate-700 text-xs text-white"
                />
              </div>

              <div className="space-y-1.5 pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <Label className="text-xs text-slate-300 font-semibold flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5 text-amber-400" />
                    Dual-Session Password / PIN
                  </Label>
                  <span className="text-[10px] text-amber-400">Step-Up Auth Required</span>
                </div>
                <Input
                  type="password"
                  value={stepUpPassword}
                  onChange={(e) => setStepUpPassword(e.target.value)}
                  placeholder="Enter your Super Admin credential or ServicePro2026!"
                  className="bg-slate-950 border-slate-700 text-xs text-white font-mono"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setVotingRequest(null)}
                  className="border-slate-700 text-xs text-slate-300"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmittingVote}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
                >
                  {isSubmittingVote ? "Recording Ballot..." : "Submit Signed Vote"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Emergency Veto Modal */}
      {vetoRequest && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-rose-900/50 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Exercise Emergency Super Admin Veto</h3>
                <p className="text-xs text-slate-400">Immediate Halt on Proposal Execution</p>
              </div>
            </div>

            <p className="text-xs text-rose-300 bg-rose-950/40 p-3 rounded-lg border border-rose-900/60">
              Any individual Super Admin member possesses absolute veto power during the proposal and cooldown review periods.
              Exercising this veto immediately aborts the proposed change and records the reason to the immutable compliance ledger.
            </p>

            <form onSubmit={handleVetoSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs text-slate-300">Mandatory Veto Reason</Label>
                <Textarea
                  value={vetoReason}
                  onChange={(e) => setVetoReason(e.target.value)}
                  placeholder="Detail the security, legal, or architectural concerns justifying this emergency stop..."
                  className="bg-slate-950 border-slate-700 text-xs text-white h-24"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setVetoRequest(null)}
                  className="border-slate-700 text-xs text-slate-300"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmittingVeto}
                  className="bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold"
                >
                  {isSubmittingVeto ? "Aborting..." : "Confirm & Enforce Veto"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Propose Change Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Propose High-Impact Quorum Change</h3>
                <p className="text-xs text-slate-400">Initiate multi-admin consensus workflow</p>
              </div>
            </div>

            <form onSubmit={handleCreateRequest} className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs text-slate-300">Change Classification & Quorum Rule</Label>
                <select
                  value={newActionType}
                  onChange={(e) => setNewActionType(e.target.value as QuorumActionType)}
                  className="w-full bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2.5 outline-none focus:border-emerald-500"
                >
                  {Object.values(QUORUM_RULES).map((r) => (
                    <option key={r.actionType} value={r.actionType}>
                      {r.label} ({r.requiredVotes}/{r.totalSuperAdmins} Super Admins Required)
                    </option>
                  ))}
                </select>
                <div className="text-[11px] text-amber-400 mt-1">
                  Threshold: {QUORUM_RULES[newActionType].requiredVotes} of {QUORUM_RULES[newActionType].totalSuperAdmins} Super Admin votes required. Cooldown: {QUORUM_RULES[newActionType].cooldownHours}h.
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-slate-300">Proposal Title</Label>
                <Input
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Upgrade PostgreSQL Cluster Pool Size to 25"
                  className="bg-slate-950 border-slate-700 text-xs text-white"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-slate-300">Target System / Resource</Label>
                <Input
                  value={newTargetResource}
                  onChange={(e) => setNewTargetResource(e.target.value)}
                  placeholder="e.g. database-pool-production or auth-policy"
                  className="bg-slate-950 border-slate-700 text-xs text-white font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-slate-300">Detailed Justification & Implementation Plan</Label>
                <Textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Explain why this change is needed and the expected operational impact..."
                  className="bg-slate-950 border-slate-700 text-xs text-white h-24"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCreateModal(false)}
                  className="border-slate-700 text-xs text-slate-300"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isCreatingRequest}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
                >
                  {isCreatingRequest ? "Initiating Proposal..." : "Submit to Council"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
