"use client";

import * as React from "react";
import Link from "next/link";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Download,
  DollarSign,
  TrendingUp,
  Percent,
  CreditCard,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";

export default function AdminRevenueBreakdownReportPage() {
  const [selectedBranch, setSelectedBranch] = React.useState("All Branches");

  function exportCSV() {
    toast.success("Revenue breakdown report exported to CSV");
  }

  return (
    <div className="space-y-6 pb-12">
      {/* ─────────────────────────────────────────────────────────────
          1. HEADER (Title & Subtitle)
      ───────────────────────────────────────────────────────────── */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Link
            href="/admin/reports"
            className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Reports Overview</span>
          </Link>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Revenue Breakdown Report
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Analyze revenue, labor costs, parts margins, and payment methods.
        </p>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. FILTER TOOLBAR
      ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Date Range Picker */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/10 bg-[#0F172A] text-xs font-medium text-slate-300">
            <button type="button" className="text-slate-400 hover:text-white transition-colors">
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>May 1, 2025 &rarr; May 31, 2025</span>
            <button type="button" className="text-slate-400 hover:text-white transition-colors">
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Branches Dropdown */}
          <div className="relative">
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="appearance-none bg-[#0F172A] border border-white/10 text-slate-300 text-xs rounded-xl px-3.5 py-1.5 pr-8 focus:outline-none focus:border-[#F97316] cursor-pointer"
            >
              <option value="All Branches">All Branches</option>
              <option value="Downtown HQ">Downtown HQ</option>
              <option value="North Metro">North Metro</option>
              <option value="West Suburban">West Suburban</option>
            </select>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 rotate-90 pointer-events-none" />
          </div>
        </div>

        {/* Export Button */}
        <button
          type="button"
          onClick={exportCSV}
          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white text-xs font-semibold shadow-md shadow-orange-500/20 transition-all cursor-pointer active:scale-95"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export</span>
        </button>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. 4 FINANCIAL KPI CARDS (Matches Reference Screen Exactly)
      ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="rounded-2xl border border-white/10 bg-[#0F172A] p-4 shadow-lg">
          <span className="text-xs text-slate-400 block mb-1">Total Revenue</span>
          <div className="text-2xl font-bold text-white">$48,320</div>
          <div className="text-[11px] font-semibold text-emerald-400 mt-1">
            &uarr; 12%
          </div>
        </div>

        {/* Labor Costs */}
        <div className="rounded-2xl border border-white/10 bg-[#0F172A] p-4 shadow-lg">
          <span className="text-xs text-slate-400 block mb-1">Labor Costs</span>
          <div className="text-2xl font-bold text-white">$24,680</div>
          <div className="text-[11px] font-medium text-slate-400 mt-1">
            51% of revenue
          </div>
        </div>

        {/* Parts Margin */}
        <div className="rounded-2xl border border-white/10 bg-[#0F172A] p-4 shadow-lg">
          <span className="text-xs text-slate-400 block mb-1">Parts Margin</span>
          <div className="text-2xl font-bold text-white">$16,240</div>
          <div className="text-[11px] font-medium text-slate-400 mt-1">
            34% of revenue
          </div>
        </div>

        {/* Net Profit */}
        <div className="rounded-2xl border border-white/10 bg-[#0F172A] p-4 shadow-lg">
          <span className="text-xs text-slate-400 block mb-1">Net Profit</span>
          <div className="text-2xl font-bold text-white">$7,400</div>
          <div className="text-[11px] font-medium text-slate-400 mt-1">
            15% of revenue
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          4. CHARTS SECTION (Revenue by Source & Payment Methods)
      ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Revenue by Source Donut */}
        <div className="lg:col-span-6 rounded-2xl border border-white/10 bg-[#0F172A] p-5 shadow-2xl flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white mb-2">Revenue by Source</h3>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-4">
            {/* Donut graphic */}
            <div className="relative w-44 h-44 flex items-center justify-center shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="rgba(255,255,255,0.05)"
                  strokeWidth="12"
                />
                {/* Labor (51%): length = 122 */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#06B6D4"
                  strokeWidth="12"
                  strokeDasharray="122 239"
                  strokeDashoffset="0"
                />
                {/* Parts (36%): length = 86 */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#8B5CF6"
                  strokeWidth="12"
                  strokeDasharray="86 239"
                  strokeDashoffset="-122"
                />
                {/* Service Fees (11%): length = 26 */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#10B981"
                  strokeWidth="12"
                  strokeDasharray="26 239"
                  strokeDashoffset="-208"
                />
                {/* Other (2%): length = 5 */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#64748B"
                  strokeWidth="12"
                  strokeDasharray="5 239"
                  strokeDashoffset="-234"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-bold text-white">$48,320</span>
                <span className="text-[10px] text-slate-400">Total Revenue</span>
              </div>
            </div>

            {/* Legend */}
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 shrink-0" />
                <span className="text-slate-300">Labor</span>
                <span className="font-semibold text-white ml-auto pl-4">51%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shrink-0" />
                <span className="text-slate-300">Parts</span>
                <span className="font-semibold text-white ml-auto pl-4">36%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                <span className="text-slate-300">Service Fees</span>
                <span className="font-semibold text-white ml-auto pl-4">11%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-500 shrink-0" />
                <span className="text-slate-300">Other</span>
                <span className="font-semibold text-white ml-auto pl-4">2%</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
            <span>Primary Revenue Driver</span>
            <span className="font-bold text-cyan-400">Field Diagnostics & Labor</span>
          </div>
        </div>

        {/* Right: Payment Methods Bar Chart */}
        <div className="lg:col-span-6 rounded-2xl border border-white/10 bg-[#0F172A] p-5 shadow-2xl flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white mb-2">Payment Methods</h3>
          </div>

          <div className="h-56 flex items-end justify-around gap-4 px-4 pb-2 pt-6">
            {/* Cash */}
            <div className="flex flex-col items-center gap-2 h-full justify-end group">
              <span className="text-xs font-bold text-emerald-400">32%</span>
              <div className="w-14 sm:w-16 rounded-t-xl bg-emerald-500 h-[64%] transition-all group-hover:brightness-110" />
              <div className="text-center pt-1">
                <span className="text-xs font-semibold text-white block">Cash</span>
                <span className="text-[10px] text-slate-400 font-mono">$15,460</span>
              </div>
            </div>

            {/* Card */}
            <div className="flex flex-col items-center gap-2 h-full justify-end group">
              <span className="text-xs font-bold text-blue-400">48%</span>
              <div className="w-14 sm:w-16 rounded-t-xl bg-blue-500 h-[96%] transition-all group-hover:brightness-110" />
              <div className="text-center pt-1">
                <span className="text-xs font-semibold text-white block">Card</span>
                <span className="text-[10px] text-slate-400 font-mono">$23,190</span>
              </div>
            </div>

            {/* Online */}
            <div className="flex flex-col items-center gap-2 h-full justify-end group">
              <span className="text-xs font-bold text-purple-400">15%</span>
              <div className="w-14 sm:w-16 rounded-t-xl bg-purple-500 h-[30%] transition-all group-hover:brightness-110" />
              <div className="text-center pt-1">
                <span className="text-xs font-semibold text-white block">Online</span>
                <span className="text-[10px] text-slate-400 font-mono">$7,260</span>
              </div>
            </div>

            {/* Other */}
            <div className="flex flex-col items-center gap-2 h-full justify-end group">
              <span className="text-xs font-bold text-slate-400">5%</span>
              <div className="w-14 sm:w-16 rounded-t-xl bg-slate-600 h-[10%] transition-all group-hover:brightness-110" />
              <div className="text-center pt-1">
                <span className="text-xs font-semibold text-white block">Other</span>
                <span className="text-[10px] text-slate-400 font-mono">$2,410</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
            <span>Card Processing Settlement</span>
            <span className="font-bold text-blue-400">Stripe Connected (Instant Payout)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
