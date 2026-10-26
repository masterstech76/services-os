"use client";

import * as React from "react";
import Link from "next/link";
import {
  DollarSign,
  CreditCard,
  CheckCircle2,
  Clock,
  ArrowRight,
  Download,
  ShieldCheck,
  Truck,
  User,
  Wrench,
  Sparkles,
  ChevronRight,
  Send,
  Building,
  Wallet,
  Calendar,
  AlertCircle,
  Search,
  Filter,
  MoreVertical,
  ChevronLeft,
  TrendingUp,
  X,
  Eye,
} from "lucide-react";
import { toast } from "sonner";
import { formatMoney } from "@/components/shared/Money";

export interface PayoutItem {
  id: string;
  technicianName: string;
  role: string;
  avatarInitials: string;
  avatarUrl?: string;
  jobsCount: number;
  earningsCents: number;
  status: "Paid" | "Pending";
}

const DEFAULT_PAYOUTS: PayoutItem[] = [
  {
    id: "pay-cm",
    technicianName: "Carlos Mendez",
    role: "HVAC Specialist",
    avatarInitials: "CM",
    avatarUrl: "/images/avatar-david.jpg",
    jobsCount: 12,
    earningsCents: 248000,
    status: "Paid",
  },
  {
    id: "pay-ma",
    technicianName: "Maria Alvarez",
    role: "Plumbing Expert",
    avatarInitials: "MA",
    avatarUrl: "/images/avatar-sarah.jpg",
    jobsCount: 10,
    earningsCents: 215000,
    status: "Paid",
  },
  {
    id: "pay-dr",
    technicianName: "Danny Reyes",
    role: "AC Specialist",
    avatarInitials: "DR",
    avatarUrl: "/images/avatar-mike.jpg",
    jobsCount: 8,
    earningsCents: 182000,
    status: "Pending",
  },
  {
    id: "pay-tb",
    technicianName: "Tony Brooks",
    role: "Installation Expert",
    avatarInitials: "TB",
    avatarUrl: "/images/avatar-1.jpg",
    jobsCount: 7,
    earningsCents: 154000,
    status: "Paid",
  },
  {
    id: "pay-lc",
    technicianName: "Lisa Carter",
    role: "Electrical Specialist",
    avatarInitials: "LC",
    avatarUrl: "/images/avatar-2.jpg",
    jobsCount: 6,
    earningsCents: 132000,
    status: "Paid",
  },
  {
    id: "pay-jw",
    technicianName: "James Wilson",
    role: "General Maintenance",
    avatarInitials: "JW",
    avatarUrl: "/images/avatar-david.jpg",
    jobsCount: 5,
    earningsCents: 118000,
    status: "Pending",
  },
];

export default function AdminWorkerPayoutsPage() {
  const [payouts, setPayouts] = React.useState<PayoutItem[]>(DEFAULT_PAYOUTS);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [dateRange, setDateRange] = React.useState("This Month");
  const [activeMenuId, setActiveMenuId] = React.useState<string | null>(null);
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [disburseModalItem, setDisburseModalItem] = React.useState<PayoutItem | null>(null);

  // Filter
  const filtered = React.useMemo(() => {
    return payouts.filter((item) => {
      if (statusFilter !== "all" && item.status.toLowerCase() !== statusFilter.toLowerCase()) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = item.technicianName.toLowerCase().includes(q);
        const matchesRole = item.role.toLowerCase().includes(q);
        if (!matchesName && !matchesRole) return false;
      }
      return true;
    });
  }, [payouts, statusFilter, searchQuery]);

  function handleDisburseConfirm() {
    if (!disburseModalItem) return;
    setPayouts((prev) =>
      prev.map((p) => (p.id === disburseModalItem.id ? { ...p, status: "Paid" as const } : p))
    );
    toast.success(`Disbursed ${formatMoney(disburseModalItem.earningsCents)} to ${disburseModalItem.technicianName} via Direct Deposit.`);
    setDisburseModalItem(null);
  }

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* ─────────────────────────────────────────────────────────────
          1. HEADER (Exact match to Reference Screenshot)
      ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Worker Payouts
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage technician earnings, commissions, tips, and payouts.
          </p>
        </div>

        <button
          type="button"
          onClick={() => toast.success("Disbursement cycle initiated for all pending technician earnings")}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-[#020617] font-bold text-xs shadow-lg shadow-[#F97316]/20 transition-all w-fit cursor-pointer active:scale-95"
        >
          <DollarSign className="w-4 h-4 stroke-[2.5]" />
          <span>Authorize &amp; Disburse</span>
        </button>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. METRIC KPI CARDS (4 Columns matching Reference)
      ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Technicians */}
        <div className="rounded-2xl border border-white/10 bg-[#0B1322] p-4 sm:p-5 flex flex-col justify-between">
          <div className="text-xs font-medium text-slate-400">Total Technicians</div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              12
            </span>
          </div>
          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <span>Across 4 regional teams</span>
          </div>
        </div>

        {/* Total Earnings */}
        <div className="rounded-2xl border border-white/10 bg-[#0B1322] p-4 sm:p-5 flex flex-col justify-between">
          <div className="text-xs font-medium text-slate-400">Total Earnings</div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              $18,420
            </span>
          </div>
          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>16% this month</span>
          </div>
        </div>

        {/* Pending Payouts */}
        <div className="rounded-2xl border border-white/10 bg-[#0B1322] p-4 sm:p-5 flex flex-col justify-between">
          <div className="text-xs font-medium text-slate-400">Pending Payouts</div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              $2,350
            </span>
          </div>
          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-amber-400 font-medium">
            <Clock className="w-3.5 h-3.5" />
            <span>Scheduled this Friday</span>
          </div>
        </div>

        {/* This Month Payouts */}
        <div className="rounded-2xl border border-white/10 bg-[#0B1322] p-4 sm:p-5 flex flex-col justify-between">
          <div className="text-xs font-medium text-slate-400">This Month Payouts</div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              9
            </span>
          </div>
          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Successfully cleared</span>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. FILTER BAR (Search, Status, Date Range, Filter)
      ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search technicians..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#0B1322] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#F97316] transition-all"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          {/* Status Dropdown */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none px-3.5 py-2 pr-8 rounded-xl bg-[#0B1322] border border-white/10 text-xs text-slate-300 focus:outline-none focus:border-[#F97316] transition-all cursor-pointer"
            >
              <option value="all">Status: All Statuses</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Date Range Dropdown */}
          <div className="relative">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="appearance-none px-3.5 py-2 pr-8 rounded-xl bg-[#0B1322] border border-white/10 text-xs text-slate-300 focus:outline-none focus:border-[#F97316] transition-all cursor-pointer"
            >
              <option value="This Month">Date Range: This Month</option>
              <option value="Last Month">Date Range: Last Month</option>
              <option value="Last 90 Days">Date Range: Last 90 Days</option>
              <option value="All Time">Date Range: All Time</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Filter Button */}
          <button
            type="button"
            onClick={() => toast.info("Filter applied")}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0B1322] border border-white/10 hover:border-white/20 text-xs font-semibold text-slate-300 hover:text-white transition-all cursor-pointer"
          >
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          4. WORKER PAYOUTS TABLE (Exact match to Reference Screenshot)
      ───────────────────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-white/10 bg-[#0B1322] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 bg-[#0F172A]/70 text-slate-400 font-semibold tracking-wider">
                <th className="py-3 px-4">Technician</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Jobs</th>
                <th className="py-3 px-4">Earnings</th>
                <th className="py-3 px-4">Payout Status</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No technicians match the selected filters.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-white/[0.02] transition-colors group"
                  >
                    {/* Technician with Avatar */}
                    <td className="py-3.5 px-4 font-medium text-white">
                      <div className="flex items-center gap-2.5">
                        {item.avatarUrl ? (
                          <img
                            src={item.avatarUrl}
                            alt={item.technicianName}
                            className="w-7 h-7 rounded-full object-cover border border-white/10 shrink-0"
                          />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-[10px] font-bold text-slate-300 shrink-0">
                            {item.avatarInitials}
                          </div>
                        )}
                        <Link
                          href="/admin/technicians"
                          className="hover:text-[#F97316] transition-colors"
                        >
                          {item.technicianName}
                        </Link>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="py-3.5 px-4 text-slate-300">
                      {item.role}
                    </td>

                    {/* Jobs */}
                    <td className="py-3.5 px-4 font-mono font-medium text-white">
                      {item.jobsCount}
                    </td>

                    {/* Earnings */}
                    <td className="py-3.5 px-4 font-semibold text-white">
                      {formatMoney(item.earningsCents)}
                    </td>

                    {/* Payout Status */}
                    <td className="py-3.5 px-4">
                      {item.status === "Paid" ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                          Paid
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                          Pending
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-center relative">
                      <div className="inline-block text-left">
                        <button
                          type="button"
                          onClick={() => setActiveMenuId(activeMenuId === item.id ? null : item.id)}
                          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {/* Dropdown Menu */}
                        {activeMenuId === item.id && (
                          <div className="absolute right-4 mt-1 w-44 rounded-xl bg-[#0F172A] border border-white/15 shadow-2xl py-1.5 z-30 text-left">
                            <Link
                              href="/admin/technicians"
                              className="flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:bg-white/10 hover:text-white"
                              onClick={() => setActiveMenuId(null)}
                            >
                              <User className="w-3.5 h-3.5 text-slate-400" />
                              <span>View Profile</span>
                            </Link>
                            <Link
                              href="/admin/jobs"
                              className="flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:bg-white/10 hover:text-white"
                              onClick={() => setActiveMenuId(null)}
                            >
                              <Wrench className="w-3.5 h-3.5 text-slate-400" />
                              <span>View Assigned Jobs</span>
                            </Link>
                            {item.status === "Pending" && (
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveMenuId(null);
                                  setDisburseModalItem(item);
                                }}
                                className="flex items-center gap-2 w-full px-3 py-2 text-xs text-emerald-400 hover:bg-emerald-500/10 text-left"
                              >
                                <DollarSign className="w-3.5 h-3.5" />
                                <span>Disburse Payout</span>
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            5. TABLE FOOTER (Pagination matching Reference)
        ───────────────────────────────────────────────────────────── */}
        <div className="px-4 py-3.5 border-t border-white/10 bg-[#0F172A]/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-400">
          <div>
            Showing 1 to {filtered.length} of 12 technicians
          </div>

          <div className="flex items-center gap-4">
            {/* Pagination Controls */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="w-7 h-7 flex items-center justify-center rounded-lg border border-white/10 text-slate-400 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:pointer-events-none"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#F97316] text-white font-bold"
              >
                1
              </button>

              {[2, 3].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setPage(num)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg border border-transparent text-slate-400 hover:text-white hover:bg-white/5"
                >
                  {num}
                </button>
              ))}

              <button
                type="button"
                onClick={() => setPage((p) => p + 1)}
                className="w-7 h-7 flex items-center justify-center rounded-lg border border-white/10 text-slate-400 hover:text-white hover:bg-white/5"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Rows Per Page */}
            <div className="flex items-center gap-1.5 pl-2 border-l border-white/10">
              <span>Rows per page:</span>
              <select
                value={rowsPerPage}
                onChange={(e) => setRowsPerPage(Number(e.target.value))}
                className="bg-transparent text-white focus:outline-none cursor-pointer"
              >
                <option value={10} className="bg-[#0F172A] text-white">10</option>
                <option value={20} className="bg-[#0F172A] text-white">20</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          6. DISBURSE PAYOUT MODAL
      ───────────────────────────────────────────────────────────── */}
      {disburseModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0B1322] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                Disburse Payout to {disburseModalItem.technicianName}
              </h3>
              <button
                type="button"
                onClick={() => setDisburseModalItem(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <p>
                Confirm release of <strong className="text-white">{formatMoney(disburseModalItem.earningsCents)}</strong> for {disburseModalItem.jobsCount} completed jobs in this pay period.
              </p>
              <div className="p-3 rounded-xl bg-[#0F172A] border border-white/10 space-y-1">
                <div className="text-slate-400">Payment Routing:</div>
                <div className="font-semibold text-white">Direct Deposit (ACH · Chase Bank ••••7812)</div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => setDisburseModalItem(null)}
                className="px-4 py-2 rounded-xl border border-white/10 text-slate-300 hover:text-white hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDisburseConfirm}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
              >
                Authorize & Disburse
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
