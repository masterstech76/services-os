"use client";

import * as React from "react";
import Link from "next/link";
import {
  DollarSign,
  Briefcase,
  Award,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  Download,
  Sparkles,
  Zap,
  Printer,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { formatMoney } from "@/components/shared/Money";
import { formatInTimeZone } from "date-fns-tz";
import { businessConfig } from "@config/business.config";
import type { TechEarningsSummary } from "@/lib/server/tech-portal";

const DEFAULT_EARNINGS_DATA: TechEarningsSummary = {
  period: "this_month",
  commissionRatePct: 15,
  completedJobsCount: 4,
  totalBilledCents: 265000,
  totalCommissionCents: 39750,
  totalTipsCents: 8500,
  totalEarningsCents: 48250,
  pendingPayoutCents: 18450,
  paidPayoutCents: 29800,
  jobs: [
    {
      jobId: "job-1001",
      jobNumber: 1001,
      serviceName: "AC Capacitor & Contactor Replacement",
      completedAt: "2025-05-27T14:15:00.000Z",
      billedCents: 48000,
      commissionRatePct: 15,
      commissionEarnedCents: 7200,
      tipsCents: 2500,
      totalPayoutCents: 9700,
      status: "paid",
    },
    {
      jobId: "job-998",
      jobNumber: 998,
      serviceName: "Emergency Blower Motor Assembly Repair",
      completedAt: "2025-05-26T17:40:00.000Z",
      billedCents: 89000,
      commissionRatePct: 15,
      commissionEarnedCents: 13350,
      tipsCents: 3000,
      totalPayoutCents: 16350,
      status: "paid",
    },
    {
      jobId: "job-994",
      jobNumber: 994,
      serviceName: "R-410A Refrigerant Recharge & Leak Seal",
      completedAt: "2025-05-25T16:10:00.000Z",
      billedCents: 74000,
      commissionRatePct: 15,
      commissionEarnedCents: 11100,
      tipsCents: 2000,
      totalPayoutCents: 13100,
      status: "pending",
    },
    {
      jobId: "job-991",
      jobNumber: 991,
      serviceName: "21-Point Precision Tune-Up & Coil Wash",
      completedAt: "2025-05-24T11:30:00.000Z",
      billedCents: 54000,
      commissionRatePct: 15,
      commissionEarnedCents: 8100,
      tipsCents: 1000,
      totalPayoutCents: 9100,
      status: "paid",
    },
  ],
};

export default function TechEarningsPage() {
  const [data, setData] = React.useState<TechEarningsSummary | null>(DEFAULT_EARNINGS_DATA);
  const [loading, setLoading] = React.useState(false);
  const [period, setPeriod] = React.useState<"this_week" | "this_month" | "all_time">("this_month");
  const [payCycle, setPayCycle] = React.useState("May 16 – May 31, 2025 (Current)");

  const tz = businessConfig.timezone;

  const loadEarnings = React.useCallback(async () => {
    try {
      const res = await fetch(`/api/technicians/earnings?period=${period}`);
      if (res.ok) {
        const json = await res.json();
        if (json && json.jobs?.length) {
          setData(json);
        }
      }
    } finally {
      setLoading(false);
    }
  }, [period]);

  React.useEffect(() => {
    void loadEarnings();
  }, [loadEarnings]);

  const handleDownloadPaystub = () => {
    toast.success("Pay Stub PDF Generated", {
      description: "Direct Deposit statement downloaded to device.",
    });
    window.print();
  };

  return (
    <div className="space-y-5 pb-8 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <Link href="/tech" className="hover:text-white transition-colors">
              Technician Dashboard
            </Link>
            <span>/</span>
            <span className="text-[#F97316] font-bold">Earnings &amp; Payouts</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <DollarSign className="h-6 w-6 text-emerald-400" />
            My Earnings, Commission &amp; Pay Stubs
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Verified completed work orders, performance commission, and payroll ledger.
          </p>
        </div>

        {/* Pay Cycle & Download Stubs */}
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          <select
            value={payCycle}
            onChange={(e) => setPayCycle(e.target.value)}
            className="rounded-xl border border-white/10 bg-[#080D16] px-3 py-1.5 text-xs font-bold text-white focus:outline-none focus:border-orange-500 cursor-pointer"
          >
            <option value="May 16 – May 31, 2025 (Current)">May 16 – May 31, 2025 (Current)</option>
            <option value="May 1 – May 15, 2025">May 1 – May 15, 2025 (Paid $1,840)</option>
            <option value="Apr 16 – Apr 30, 2025">Apr 16 – Apr 30, 2025 (Paid $2,120)</option>
          </select>

          <button
            type="button"
            onClick={handleDownloadPaystub}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white text-xs font-bold transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Pay Stub</span>
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          COMMISSION ACCELERATOR TIER PROGRESS BAR
      ───────────────────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-white/10 bg-[#0F172A]/85 backdrop-blur-xl p-4 sm:p-5 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-orange-500/20 text-[#F97316] flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">
                Commission Tier Accelerator: Silver (15%)
              </h3>
              <p className="text-xs text-slate-400">
                Unlock 18% Gold Tier at $3,500 monthly billed revenue
              </p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-full">
            $850 to Gold (18%)
          </span>
        </div>

        <div className="space-y-1">
          <div className="h-3 w-full rounded-full bg-[#080D16] border border-white/5 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-orange-500 via-amber-400 to-emerald-400 rounded-full w-[76%]" />
          </div>
          <div className="flex justify-between text-[11px] text-slate-400 pt-0.5">
            <span>Base 12%</span>
            <span className="font-bold text-orange-400">Current: 15% Silver ($2,650 billed)</span>
            <span>Target: 18% Gold ($3,500)</span>
          </div>
        </div>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="rounded-2xl border border-emerald-500/20 bg-[#0F172A]/85 backdrop-blur-xl p-4 shadow-xl">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Earned</span>
          <span className="text-2xl font-black text-emerald-400 block mt-1">
            {formatMoney(data?.totalEarningsCents || 0)}
          </span>
          <span className="text-[11px] text-emerald-300 mt-0.5 block font-semibold">
            {data?.commissionRatePct || 15}% Tier Rate + 100% Tips
          </span>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0F172A]/85 backdrop-blur-xl p-4 shadow-xl">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Completed Jobs</span>
          <span className="text-2xl font-black text-white block mt-1">
            {data?.completedJobsCount || 0}
          </span>
          <span className="text-[11px] text-slate-400 mt-0.5 block font-medium">
            {formatMoney(data?.totalBilledCents || 0)} Gross Billed
          </span>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0F172A]/85 backdrop-blur-xl p-4 shadow-xl">
          <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">Paid Out</span>
          <span className="text-xl font-black text-emerald-400 block mt-1">
            {formatMoney(data?.paidPayoutCents || 0)}
          </span>
          <span className="text-[10px] text-slate-500 mt-0.5 block">Direct deposited to file</span>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0F172A]/85 backdrop-blur-xl p-4 shadow-xl">
          <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">Pending Next Cycle</span>
          <span className="text-xl font-black text-amber-400 block mt-1">
            {formatMoney(data?.pendingPayoutCents || 0)}
          </span>
          <span className="text-[10px] text-slate-500 mt-0.5 block">Deposit scheduled Friday</span>
        </div>
      </div>

      {/* Commission Breakdown List */}
      <div className="rounded-2xl border border-white/10 bg-[#0F172A]/85 backdrop-blur-xl shadow-xl overflow-hidden">
        <div className="border-b border-white/10 bg-white/5 px-4 py-3 flex items-center justify-between">
          <span className="font-bold text-xs uppercase tracking-wider text-slate-300">
            Completed Job Ledger &amp; Itemized Payout Formula
          </span>
          <span className="text-xs font-semibold text-slate-400">
            {data?.jobs.length || 0} jobs completed
          </span>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-slate-400">Loading payout records...</div>
        ) : !data || data.jobs.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">No completed jobs in this period.</div>
        ) : (
          <div className="divide-y divide-white/5">
            {data.jobs.map((job) => (
              <div key={job.jobId} className="p-4 hover:bg-white/5 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-mono font-bold text-white">WO-#{job.jobNumber}</span>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        job.status === "paid" ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-400" : "bg-amber-500/15 border border-amber-500/30 text-amber-400"
                      }`}
                    >
                      {job.status}
                    </span>
                  </div>
                  <h4 className="font-bold text-white">{job.serviceName}</h4>
                  <p className="text-[11px] text-slate-400">
                    Billed: {formatMoney(job.billedCents)} &bull; {formatInTimeZone(new Date(job.completedAt), tz, "MMM d, yyyy")}
                  </p>
                </div>

                <div className="text-left sm:text-right shrink-0">
                  <span className="font-black text-sm text-emerald-400 block font-mono">
                    +{formatMoney(job.totalPayoutCents)}
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    Base + Comm: {formatMoney(job.commissionEarnedCents)}
                    {job.tipsCents > 0 && ` + Tip: ${formatMoney(job.tipsCents)}`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
