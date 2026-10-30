"use client";

import * as React from "react";
import Link from "next/link";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Download,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Briefcase,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";

export default function AdminJobsPerformanceReportPage() {
  const [selectedTech, setSelectedTech] = React.useState("All Technicians");
  const [selectedJobType, setSelectedJobType] = React.useState("All Job Types");

  function exportCSV() {
    toast.success("Jobs performance report exported to CSV");
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
          Jobs Performance Report
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Analyze completed jobs, cancellations, and completion times.
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

          {/* Technicians Dropdown */}
          <div className="relative">
            <select
              value={selectedTech}
              onChange={(e) => setSelectedTech(e.target.value)}
              className="appearance-none bg-[#0F172A] border border-white/10 text-slate-300 text-xs rounded-xl px-3.5 py-1.5 pr-8 focus:outline-none focus:border-[#F97316] cursor-pointer"
            >
              <option value="All Technicians">All Technicians</option>
              <option value="Service Client A">Service Client A</option>
              <option value="Mike Johnson">Mike Johnson</option>
              <option value="Sarah Wilson">Sarah Wilson</option>
              <option value="David Lee">David Lee</option>
              <option value="Emma Davis">Emma Davis</option>
            </select>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 rotate-90 pointer-events-none" />
          </div>

          {/* Job Types Dropdown */}
          <div className="relative">
            <select
              value={selectedJobType}
              onChange={(e) => setSelectedJobType(e.target.value)}
              className="appearance-none bg-[#0F172A] border border-white/10 text-slate-300 text-xs rounded-xl px-3.5 py-1.5 pr-8 focus:outline-none focus:border-[#F97316] cursor-pointer"
            >
              <option value="All Job Types">All Job Types</option>
              <option value="AC Repair">AC Repair</option>
              <option value="Emergency HVAC">Emergency HVAC</option>
              <option value="Duct Cleaning">Duct Cleaning</option>
              <option value="Electrical Repair">Electrical Repair</option>
              <option value="Plumbing Diagnostic">Plumbing Diagnostic</option>
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
          3. 4 KPI METRIC CARDS
      ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Jobs */}
        <div className="rounded-2xl border border-white/10 bg-[#0F172A] p-4 flex items-center justify-between shadow-lg">
          <div>
            <span className="text-xs text-slate-400 block mb-1">Total Jobs</span>
            <div className="text-2xl font-bold text-white">312</div>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 mt-1">
              <span>&uarr; 12%</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Briefcase className="w-5 h-5" />
          </div>
        </div>

        {/* Completed */}
        <div className="rounded-2xl border border-white/10 bg-[#0F172A] p-4 flex items-center justify-between shadow-lg">
          <div>
            <span className="text-xs text-slate-400 block mb-1">Completed</span>
            <div className="text-2xl font-bold text-white">245</div>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 mt-1">
              <span>&uarr; 18%</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        {/* Cancelled */}
        <div className="rounded-2xl border border-white/10 bg-[#0F172A] p-4 flex items-center justify-between shadow-lg">
          <div>
            <span className="text-xs text-slate-400 block mb-1">Cancelled</span>
            <div className="text-2xl font-bold text-white">32</div>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-rose-400 mt-1">
              <span>&darr; 5%</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
            <XCircle className="w-5 h-5" />
          </div>
        </div>

        {/* Avg. Completion Time */}
        <div className="rounded-2xl border border-white/10 bg-[#0F172A] p-4 flex items-center justify-between shadow-lg">
          <div>
            <span className="text-xs text-slate-400 block mb-1">Avg. Completion Time</span>
            <div className="text-2xl font-bold text-white">2h 34m</div>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 mt-1">
              <span>&darr; 22%</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Clock className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          4. CHARTS SECTION (Jobs Trend & Completion Time Donut)
      ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Jobs Trend Grouped Bars */}
        <div className="lg:col-span-7 rounded-2xl border border-white/10 bg-[#0F172A] p-5 shadow-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white">Jobs Trend</h3>
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <span className="text-slate-300 font-medium">Completed</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span className="text-slate-300 font-medium">Cancelled</span>
              </div>
            </div>
          </div>

          {/* Grouped Bar Chart */}
          <div className="h-64 w-full relative flex items-end">
            <svg
              className="w-full h-full overflow-visible"
              viewBox="0 0 500 200"
              preserveAspectRatio="none"
            >
              {/* Horizontal Grid lines */}
              <line x1="30" y1="20" x2="490" y2="20" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
              <line x1="30" y1="65" x2="490" y2="65" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
              <line x1="30" y1="110" x2="490" y2="110" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
              <line x1="30" y1="155" x2="490" y2="155" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
              <line x1="30" y1="190" x2="490" y2="190" stroke="rgba(255,255,255,0.1)" />

              {/* Y Axis text */}
              <text x="5" y="24" fill="#64748B" fontSize="10">80</text>
              <text x="5" y="69" fill="#64748B" fontSize="10">60</text>
              <text x="5" y="114" fill="#64748B" fontSize="10">40</text>
              <text x="5" y="159" fill="#64748B" fontSize="10">20</text>
              <text x="12" y="193" fill="#64748B" fontSize="10">0</text>

              {/* Weekly Clusters: 15 bar pairs across the month */}
              {[
                { x: 45, compH: 100, cancH: 18 },
                { x: 75, compH: 120, cancH: 22 },
                { x: 105, compH: 95, cancH: 14 },
                { x: 135, compH: 130, cancH: 20 },
                { x: 165, compH: 145, cancH: 26 },
                { x: 195, compH: 110, cancH: 16 },
                { x: 225, compH: 135, cancH: 18 },
                { x: 255, compH: 150, cancH: 24 },
                { x: 285, compH: 125, cancH: 15 },
                { x: 315, compH: 140, cancH: 22 },
                { x: 345, compH: 160, cancH: 30 },
                { x: 375, compH: 130, cancH: 18 },
                { x: 405, compH: 145, cancH: 20 },
                { x: 435, compH: 155, cancH: 25 },
              ].map((b, i) => (
                <g key={i}>
                  {/* Completed bar (blue) */}
                  <rect
                    x={b.x}
                    y={190 - b.compH}
                    width="10"
                    height={b.compH}
                    rx="2"
                    fill="#3B82F6"
                  />
                  {/* Cancelled bar (rose) */}
                  <rect
                    x={b.x + 12}
                    y={190 - b.cancH}
                    width="6"
                    height={b.cancH}
                    rx="1.5"
                    fill="#EF4444"
                  />
                </g>
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

        {/* Right: Job Completion Time Donut Chart */}
        <div className="lg:col-span-5 rounded-2xl border border-white/10 bg-[#0F172A] p-5 shadow-2xl flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white mb-2">Job Completion Time</h3>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-4">
            {/* Donut graphic */}
            <div className="relative w-40 h-40 flex items-center justify-center shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="rgba(255,255,255,0.05)"
                  strokeWidth="12"
                />
                {/* < 1 hour (42%): length = 100 */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#3B82F6"
                  strokeWidth="12"
                  strokeDasharray="100 239"
                  strokeDashoffset="0"
                />
                {/* 1-3 hours (38%): length = 91 */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#06B6D4"
                  strokeWidth="12"
                  strokeDasharray="91 239"
                  strokeDashoffset="-100"
                />
                {/* 3-6 hours (15%): length = 36 */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#8B5CF6"
                  strokeWidth="12"
                  strokeDasharray="36 239"
                  strokeDashoffset="-191"
                />
                {/* > 6 hours (5%): length = 12 */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#EC4899"
                  strokeWidth="12"
                  strokeDasharray="12 239"
                  strokeDashoffset="-227"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-bold text-white">2h 34m</span>
                <span className="text-[10px] text-slate-400">Avg. Time</span>
              </div>
            </div>

            {/* Legend */}
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0" />
                <span className="text-slate-300">&lt; 1 hour</span>
                <span className="font-semibold text-white ml-auto pl-3">42%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 shrink-0" />
                <span className="text-slate-300">1 - 3 hours</span>
                <span className="font-semibold text-white ml-auto pl-3">38%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shrink-0" />
                <span className="text-slate-300">3 - 6 hours</span>
                <span className="font-semibold text-white ml-auto pl-3">15%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-pink-500 shrink-0" />
                <span className="text-slate-300">&gt; 6 hours</span>
                <span className="font-semibold text-white ml-auto pl-3">5%</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
            <span>Fast turnaround (&lt;3h)</span>
            <span className="font-bold text-cyan-400">80.0% of jobs</span>
          </div>
        </div>
      </div>
    </div>
  );
}
