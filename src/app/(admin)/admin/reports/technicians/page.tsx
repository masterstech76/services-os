"use client";

import * as React from "react";
import Link from "next/link";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Download,
  Star,
  Award,
  ArrowLeft,
  User,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

interface TechMetricRow {
  id: string;
  name: string;
  avatar: string;
  jobsCompleted: number;
  revenue: string;
  rating: number;
  productivity: number;
}

const SAMPLE_TECH_METRICS: TechMetricRow[] = [
  {
    id: "tech-1",
    name: "Robert Caldwell",
    avatar: "/images/avatar-david.jpg",
    jobsCompleted: 62,
    revenue: "$12,480",
    rating: 4.8,
    productivity: 92,
  },
  {
    id: "tech-2",
    name: "Mike Johnson",
    avatar: "/images/avatar-mike.jpg",
    jobsCompleted: 54,
    revenue: "$10,620",
    rating: 4.6,
    productivity: 88,
  },
  {
    id: "tech-3",
    name: "Sarah Wilson",
    avatar: "/images/avatar-sarah.jpg",
    jobsCompleted: 48,
    revenue: "$9,780",
    rating: 4.7,
    productivity: 82,
  },
  {
    id: "tech-4",
    name: "David Lee",
    avatar: "/images/avatar-1.jpg",
    jobsCompleted: 43,
    revenue: "$8,540",
    rating: 4.5,
    productivity: 76,
  },
  {
    id: "tech-5",
    name: "Emma Davis",
    avatar: "/images/avatar-2.jpg",
    jobsCompleted: 38,
    revenue: "$7,260",
    rating: 4.4,
    productivity: 71,
  },
];

export default function AdminTechniciansReportPage() {
  const [selectedTech, setSelectedTech] = React.useState("All Technicians");
  const [selectedJobType, setSelectedJobType] = React.useState("All Job Types");
  const [techs, setTechs] = React.useState<TechMetricRow[]>(SAMPLE_TECH_METRICS);

  function exportCSV() {
    toast.success("Technician metrics report exported to CSV");
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
          Technician Metrics Report
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Analyze technician productivity, revenue, completed jobs, and customer ratings.
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
              <option value="Robert Caldwell">Robert Caldwell</option>
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
          3. TECHNICIAN METRICS TABLE (Matches Reference Screen Exactly)
      ───────────────────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-white/10 bg-[#0F172A] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0B1322] text-[11px] font-semibold text-slate-400 border-b border-white/10">
              <tr>
                <th className="px-5 py-3.5">Technician</th>
                <th className="px-5 py-3.5">Jobs Completed</th>
                <th className="px-5 py-3.5">Revenue</th>
                <th className="px-5 py-3.5">Avg. Rating</th>
                <th className="px-5 py-3.5">Productivity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {techs.map((tech) => (
                <tr
                  key={tech.id}
                  className="hover:bg-white/[0.03] transition-colors group"
                >
                  {/* Technician Info */}
                  <td className="px-5 py-3.5 font-semibold text-white whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <img
                        src={tech.avatar}
                        alt={tech.name}
                        className="w-8 h-8 rounded-full object-cover border border-white/10"
                      />
                      <span>{tech.name}</span>
                    </div>
                  </td>

                  {/* Jobs Completed */}
                  <td className="px-5 py-3.5 font-medium text-slate-200 whitespace-nowrap">
                    {tech.jobsCompleted}
                  </td>

                  {/* Revenue */}
                  <td className="px-5 py-3.5 font-semibold text-white whitespace-nowrap">
                    {tech.revenue}
                  </td>

                  {/* Avg Rating */}
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{tech.rating}</span>
                    </div>
                  </td>

                  {/* Productivity */}
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-24 h-2 rounded-full bg-white/10 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-blue-500"
                          style={{ width: `${tech.productivity}%` }}
                        />
                      </div>
                      <span className="font-semibold text-white">{tech.productivity}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="px-5 py-3 border-t border-white/10 bg-[#0B1322] text-xs text-slate-400">
          Showing 1-5 of 5 technicians
        </div>
      </div>
    </div>
  );
}
