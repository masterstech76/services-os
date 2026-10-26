"use client";

import * as React from "react";
import Link from "next/link";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  DollarSign,
  Briefcase,
  Users,
  Layers,
  ArrowUpRight,
  Download,
  Filter,
} from "lucide-react";
import { toast } from "sonner";

export default function AdminReportsOverviewPage() {
  const [selectedBranch, setSelectedBranch] = React.useState("All Branches");

  function handleGenerateReport() {
    toast.success("Fresh reporting pipeline compiled for May 2025");
  }

  return (
    <div className="space-y-6 pb-12">
      {/* ─────────────────────────────────────────────────────────────
          1. HEADER (Title & Subtitle)
      ───────────────────────────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Reports Overview
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Analyze revenue, job performance, and overall business operations.
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

        {/* Generate Report Button */}
        <button
          type="button"
          onClick={handleGenerateReport}
          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white text-xs font-semibold shadow-md shadow-orange-500/20 transition-all cursor-pointer active:scale-95"
        >
          <span>Generate Report</span>
        </button>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. 4 SUMMARY KPI CARDS (Matches Reference Screen Exactly)
      ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Revenue */}
        <div className="rounded-2xl border border-white/10 bg-[#0F172A] p-4 flex items-center justify-between shadow-lg">
          <div>
            <span className="text-xs text-slate-400 block mb-1">Total Revenue</span>
            <div className="text-2xl font-bold text-white">$48,320</div>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 mt-1">
              <span>&uarr; 12% vs last month</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        {/* Card 2: Completed Jobs */}
        <div className="rounded-2xl border border-white/10 bg-[#0F172A] p-4 flex items-center justify-between shadow-lg">
          <div>
            <span className="text-xs text-slate-400 block mb-1">Completed Jobs</span>
            <div className="text-2xl font-bold text-white">245</div>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 mt-1">
              <span>&uarr; 18% vs last month</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Briefcase className="w-5 h-5" />
          </div>
        </div>

        {/* Card 3: Active Customers */}
        <div className="rounded-2xl border border-white/10 bg-[#0F172A] p-4 flex items-center justify-between shadow-lg">
          <div>
            <span className="text-xs text-slate-400 block mb-1">Active Customers</span>
            <div className="text-2xl font-bold text-white">186</div>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 mt-1">
              <span>&uarr; 14% vs last month</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* Card 4: Avg. Job Value */}
        <div className="rounded-2xl border border-white/10 bg-[#0F172A] p-4 flex items-center justify-between shadow-lg">
          <div>
            <span className="text-xs text-slate-400 block mb-1">Avg. Job Value</span>
            <div className="text-2xl font-bold text-white">$197</div>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 mt-1">
              <span>&uarr; 8% vs last month</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-[#F97316]">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          4. CHARTS SECTION (Revenue Trend & Job Status Donut)
      ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Revenue Trend Area Chart */}
        <div className="lg:col-span-7 rounded-2xl border border-white/10 bg-[#0F172A] p-5 shadow-2xl flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white mb-4">Revenue Trend</h3>
          </div>

          <div className="h-64 w-full relative flex items-end">
            {/* SVG smooth area line chart */}
            <svg
              className="w-full h-full overflow-visible"
              viewBox="0 0 500 200"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Horizontal Grid lines */}
              <line x1="30" y1="20" x2="490" y2="20" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
              <line x1="30" y1="65" x2="490" y2="65" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
              <line x1="30" y1="110" x2="490" y2="110" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
              <line x1="30" y1="155" x2="490" y2="155" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
              <line x1="30" y1="190" x2="490" y2="190" stroke="rgba(255,255,255,0.1)" />

              {/* Y Axis text */}
              <text x="5" y="24" fill="#64748B" fontSize="10">$8K</text>
              <text x="5" y="69" fill="#64748B" fontSize="10">$6K</text>
              <text x="5" y="114" fill="#64748B" fontSize="10">$4K</text>
              <text x="5" y="159" fill="#64748B" fontSize="10">$2K</text>
              <text x="12" y="193" fill="#64748B" fontSize="10">$0</text>

              {/* Area path */}
              <path
                d="M 40 160 Q 90 120, 130 140 T 210 100 T 290 85 T 370 115 T 450 70 L 450 190 L 40 190 Z"
                fill="url(#revenueGradient)"
              />

              {/* Line path */}
              <path
                d="M 40 160 Q 90 120, 130 140 T 210 100 T 290 85 T 370 115 T 450 70"
                fill="none"
                stroke="#60A5FA"
                strokeWidth="2.5"
              />

              {/* Data points */}
              {[
                { cx: 40, cy: 160 },
                { cx: 130, cy: 140 },
                { cx: 210, cy: 100 },
                { cx: 290, cy: 85 },
                { cx: 370, cy: 115 },
                { cx: 450, cy: 70 },
              ].map((pt, i) => (
                <circle
                  key={i}
                  cx={pt.cx}
                  cy={pt.cy}
                  r="4"
                  fill="#60A5FA"
                  stroke="#0F172A"
                  strokeWidth="2"
                />
              ))}
            </svg>
          </div>

          {/* X Axis Labels */}
          <div className="flex justify-between pl-8 pr-4 pt-2 text-[11px] text-slate-400 font-medium">
            <span>May 1</span>
            <span>May 7</span>
            <span>May 14</span>
            <span>May 21</span>
            <span>May 28</span>
            <span>May 31</span>
          </div>
        </div>

        {/* Right: Job Status Donut Chart */}
        <div className="lg:col-span-5 rounded-2xl border border-white/10 bg-[#0F172A] p-5 shadow-2xl flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white mb-2">Job Status</h3>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-4">
            {/* Donut graphic */}
            <div className="relative w-40 h-40 flex items-center justify-center shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                {/* Background Ring */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="rgba(255,255,255,0.05)"
                  strokeWidth="12"
                />
                {/* Completed (60%): circumference ~ 238.7, length = 143 */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#10B981"
                  strokeWidth="12"
                  strokeDasharray="143 239"
                  strokeDashoffset="0"
                />
                {/* In Progress (18%): length = 43 */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#3B82F6"
                  strokeWidth="12"
                  strokeDasharray="43 239"
                  strokeDashoffset="-143"
                />
                {/* Cancelled (14%): length = 33 */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#EF4444"
                  strokeWidth="12"
                  strokeDasharray="33 239"
                  strokeDashoffset="-186"
                />
                {/* Rescheduled (8%): length = 19 */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#F59E0B"
                  strokeWidth="12"
                  strokeDasharray="19 239"
                  strokeDashoffset="-219"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-bold text-white">245</span>
                <span className="text-[10px] text-slate-400">Total Jobs</span>
              </div>
            </div>

            {/* Legend */}
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                <span className="text-slate-300">Completed</span>
                <span className="font-semibold text-white ml-auto pl-3">60%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0" />
                <span className="text-slate-300">In Progress</span>
                <span className="font-semibold text-white ml-auto pl-3">18%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0" />
                <span className="text-slate-300">Cancelled</span>
                <span className="font-semibold text-white ml-auto pl-3">14%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                <span className="text-slate-300">Rescheduled</span>
                <span className="font-semibold text-white ml-auto pl-3">8%</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
            <span>Overall completion rate</span>
            <span className="font-bold text-emerald-400">82.4%</span>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          5. SUB-REPORTS DIRECT NAVIGATION
      ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        <Link
          href="/admin/reports/jobs"
          className="p-4 rounded-2xl border border-white/10 bg-[#0F172A] hover:bg-white/5 transition-all group flex items-center justify-between"
        >
          <div>
            <span className="text-xs text-slate-400 block mb-0.5">Specialized Report</span>
            <span className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">
              Jobs Performance
            </span>
          </div>
          <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-blue-400 transition-colors" />
        </Link>

        <Link
          href="/admin/reports/revenue"
          className="p-4 rounded-2xl border border-white/10 bg-[#0F172A] hover:bg-white/5 transition-all group flex items-center justify-between"
        >
          <div>
            <span className="text-xs text-slate-400 block mb-0.5">Financial Breakdown</span>
            <span className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
              Revenue Breakdown
            </span>
          </div>
          <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-400 transition-colors" />
        </Link>

        <Link
          href="/admin/reports/technicians"
          className="p-4 rounded-2xl border border-white/10 bg-[#0F172A] hover:bg-white/5 transition-all group flex items-center justify-between"
        >
          <div>
            <span className="text-xs text-slate-400 block mb-0.5">Workforce Efficiency</span>
            <span className="text-sm font-bold text-white group-hover:text-[#F97316] transition-colors">
              Technician Metrics
            </span>
          </div>
          <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-[#F97316] transition-colors" />
        </Link>
      </div>
    </div>
  );
}
