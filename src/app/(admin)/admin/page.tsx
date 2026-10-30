"use client";

import * as React from "react";
import Link from "next/link";
import {
  Calendar,
  Briefcase,
  CheckCircle2,
  User,
  DollarSign,
  FileText,
  RefreshCw,
  AlertTriangle,
  Clock,
  MapPin,
  ChevronDown,
  ArrowRight,
  ShieldCheck,
  Check,
  Wrench,
  AlertCircle,
  Truck,
  Sparkles,
  Info,
} from "lucide-react";
import { toast } from "sonner";
import { JobDrawer } from "@/components/admin/JobDrawer";
import type { EnrichedJob } from "@/lib/server/operations";

export default function AdminOverviewPage() {
  const [loading, setLoading] = React.useState(false);
  const [selectedJob, setSelectedJob] = React.useState<EnrichedJob | null>(null);
  const [revenuePeriod, setRevenuePeriod] = React.useState("This Week");
  const [statusPeriod, setStatusPeriod] = React.useState("Today");
  const [hoveredRevenueDay, setHoveredRevenueDay] = React.useState<number | null>(6);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Operations & revenue data refreshed successfully!");
    }, 600);
  };

  // 6 KPI Metrics matching the approved reference
  const kpis = [
    {
      title: "Total Jobs Today",
      value: "24",
      subtext: "↑ 20% from yesterday",
      subtextColor: "text-blue-400",
      icon: Calendar,
      iconBg: "bg-blue-500/15 border-blue-500/30 text-blue-400",
    },
    {
      title: "Jobs In Progress",
      value: "8",
      subtext: "33% of total jobs",
      subtextColor: "text-slate-400",
      icon: Briefcase,
      iconBg: "bg-amber-500/15 border-amber-500/30 text-amber-400",
    },
    {
      title: "Completed Today",
      value: "12",
      subtext: "↑ 9% from yesterday",
      subtextColor: "text-emerald-400",
      icon: CheckCircle2,
      iconBg: "bg-emerald-500/15 border-emerald-500/30 text-emerald-400",
    },
    {
      title: "Pending Dispatch",
      value: "4",
      subtext: "Needs assignment",
      subtextColor: "text-purple-400",
      icon: User,
      iconBg: "bg-purple-500/15 border-purple-500/30 text-purple-400",
    },
    {
      title: "Today's Revenue",
      value: "$8,420",
      subtext: "↑ 15% from yesterday",
      subtextColor: "text-emerald-400",
      icon: DollarSign,
      iconBg: "bg-emerald-500/15 border-emerald-500/30 text-emerald-400",
    },
    {
      title: "Overdue Invoices",
      value: "6",
      subtext: "$2,180.00 outstanding",
      subtextColor: "text-rose-400",
      icon: FileText,
      iconBg: "bg-rose-500/15 border-rose-500/30 text-rose-400",
    },
  ];

  // Revenue chart data points (May 08 - May 14)
  const revenuePoints = [
    { date: "May 08", label: "08", amount: 12400, x: 30, y: 155 },
    { date: "May 09", label: "09", amount: 28500, x: 95, y: 75 },
    { date: "May 10", label: "10", amount: 23200, x: 160, y: 100 },
    { date: "May 11", label: "11", amount: 16800, x: 225, y: 135 },
    { date: "May 12", label: "12", amount: 20100, x: 290, y: 118 },
    { date: "May 13", label: "13", amount: 14500, x: 355, y: 146 },
    { date: "May 14", label: "14", amount: 27800, x: 420, y: 78, highlight: "$8,420" },
  ];

  // Live dispatch feed items
  const dispatchFeed = [
    {
      id: "feed-1",
      icon: User,
      iconColor: "text-blue-400 bg-blue-500/15 border-blue-500/30",
      title: (
        <span>
          <strong className="text-white font-semibold">Job #1037</strong> assigned to{" "}
          <strong className="text-white font-semibold">Lead Field Technician</strong>
        </span>
      ),
      meta: "AC Repair • 3100 NW 7th St",
      time: "2m ago",
    },
    {
      id: "feed-2",
      icon: Wrench,
      iconColor: "text-amber-400 bg-amber-500/15 border-amber-500/30",
      title: (
        <span>
          <strong className="text-white font-semibold">Maria Alvarez</strong> marked job{" "}
          <strong className="text-white font-semibold">#1031</strong> as In Progress
        </span>
      ),
      meta: "Duct Cleaning • 1900 Coral Way",
      time: "5m ago",
    },
    {
      id: "feed-3",
      icon: CheckCircle2,
      iconColor: "text-emerald-400 bg-emerald-500/15 border-emerald-500/30",
      title: (
        <span>
          <strong className="text-white font-semibold">Job #1035</strong> completed by{" "}
          <strong className="text-white font-semibold">Danny Reyes</strong>
        </span>
      ),
      meta: "AC Tune-Up • 450 Alton Rd",
      time: "18m ago",
    },
    {
      id: "feed-4",
      icon: FileText,
      iconColor: "text-purple-400 bg-purple-500/15 border-purple-500/30",
      title: (
        <span>
          <strong className="text-white font-semibold">Invoice #INV-1007</strong> paid by{" "}
          <strong className="text-white font-semibold">Service Client</strong>
        </span>
      ),
      meta: "$227.40 • AC Repair",
      time: "25m ago",
    },
  ];

  // Upcoming schedule list
  const upcomingSchedule = [
    {
      timeStart: "8:00 AM",
      timeEnd: "9:30 AM",
      service: "AC Repair",
      address: "3100 NW 7th St, Miami, FL 33125",
      techName: "Lead Field Technician",
      dotColor: "bg-blue-500",
      techId: "tech-001",
    },
    {
      timeStart: "10:00 AM",
      timeEnd: "11:00 AM",
      service: "Thermostat Install",
      address: "1540 Ferdinand St, Miami, FL 33134",
      techName: "Tony Brooks",
      dotColor: "bg-amber-500",
      techId: "tech-tony",
    },
    {
      timeStart: "11:30 AM",
      timeEnd: "12:30 PM",
      service: "Duct Cleaning",
      address: "1900 Coral Way, Miami, FL 33145",
      techName: "Maria Alvarez",
      dotColor: "bg-emerald-500",
      techId: "tech-maria",
    },
    {
      timeStart: "2:00 PM",
      timeEnd: "3:00 PM",
      service: "AC Tune-Up",
      address: "450 Alton Rd, Miami Beach, FL 33139",
      techName: "Danny Reyes",
      dotColor: "bg-purple-500",
      techId: "tech-danny",
    },
    {
      timeStart: "3:30 PM",
      timeEnd: "4:30 PM",
      service: "Refrigerant Recharge",
      address: "2840 SW 27th Ave, Miami, FL 33133",
      techName: "Tony Brooks",
      dotColor: "bg-[#F97316]",
      techId: "tech-tony",
    },
  ];

  // Top technicians today
  const topTechs = [
    {
      name: "Lead Field Technician",
      role: "HVAC Specialist",
      completedJobs: 4,
      revenue: "$1,820",
      avatar: "/images/avatar-david.jpg",
      id: "tech-001",
    },
    {
      name: "Maria Alvarez",
      role: "Duct Cleaning Expert",
      completedJobs: 3,
      revenue: "$1,280",
      avatar: "/images/avatar-sarah.jpg",
      id: "tech-maria",
    },
    {
      name: "Danny Reyes",
      role: "AC Specialist",
      completedJobs: 3,
      revenue: "$980",
      avatar: "/images/avatar-mike.jpg",
      id: "tech-danny",
    },
    {
      name: "Tony Brooks",
      role: "Installation Expert",
      completedJobs: 2,
      revenue: "$760",
      avatar: "/images/testimonial-david.jpg",
      id: "tech-tony",
    },
  ];

  // Recent alerts
  const recentAlerts = [
    {
      severity: "danger",
      icon: AlertTriangle,
      iconColor: "text-rose-400 bg-rose-500/15 border-rose-500/30",
      title: "2 jobs need immediate assignment",
      meta: "High priority • Miami, FL",
      time: "5m ago",
    },
    {
      severity: "warning",
      icon: AlertCircle,
      iconColor: "text-amber-400 bg-amber-500/15 border-amber-500/30",
      title: "Low inventory: R-410A Refrigerant",
      meta: "Only 3 units left in stock",
      time: "15m ago",
    },
    {
      severity: "info",
      icon: Info,
      iconColor: "text-blue-400 bg-blue-500/15 border-blue-500/30",
      title: "6 invoices overdue",
      meta: "Total: $2,180.00",
      time: "1h ago",
    },
    {
      severity: "success",
      icon: CheckCircle2,
      iconColor: "text-emerald-400 bg-emerald-500/15 border-emerald-500/30",
      title: "System backup completed",
      meta: "All data secured successfully",
      time: "2h ago",
    },
  ];

  return (
    <div className="space-y-6 pb-8">
      {/* ─────────────────────────────────────────────────────────────
          1. PAGE HEADER (Matches approved screenshot)
      ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Overview</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Welcome back, Admin! Here&apos;s what&apos;s happening today.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Date Selector Badge */}
          <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-[#0F172A]/90 px-3.5 py-2 text-xs font-medium text-slate-300 shadow-sm">
            <Calendar className="h-3.5 w-3.5 text-slate-400" />
            <span>May 14, 2025</span>
          </div>

          {/* Refresh Data Safety Orange Button */}
          <button
            type="button"
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center gap-1.5 rounded-lg bg-[#F97316] hover:bg-[#EA580C] px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-[#F97316]/30 hover:shadow-[#F97316]/50 transition-all cursor-pointer active:scale-95 disabled:opacity-70"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh Data</span>
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. TOP ROW: 6 KPI METRICS CARDS
      ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3.5">
        {kpis.map((kpi, idx) => {
          const IconComponent = kpi.icon;
          return (
            <div
              key={idx}
              className="rounded-2xl border border-white/10 bg-[#0F172A]/90 backdrop-blur-xl p-4 shadow-xl flex flex-col justify-between space-y-3 transition-all hover:border-white/20 hover:bg-[#0F172A]"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-400 leading-tight">
                  {kpi.title}
                </span>
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-xl border shrink-0 ${kpi.iconBg}`}
                >
                  <IconComponent className="h-4 w-4" />
                </div>
              </div>

              <div>
                <div className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
                  {kpi.value}
                </div>
                <div className={`text-[11px] font-medium mt-1 ${kpi.subtextColor}`}>
                  {kpi.subtext}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. MIDDLE ROW: REVENUE OVERVIEW, JOB STATUS, LIVE FEED
      ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Card 1: Revenue Overview */}
        <div className="rounded-2xl border border-white/10 bg-[#0F172A]/90 backdrop-blur-xl p-5 shadow-xl flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white">Revenue Overview</h3>
              <div className="text-xl font-extrabold text-white font-mono mt-1">$52,680</div>
              <span className="text-[11px] text-slate-400 font-medium">Total Revenue</span>
            </div>

            <div className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-[#080D16] px-2.5 py-1 text-xs text-slate-300">
              <span>{revenuePeriod}</span>
              <ChevronDown className="h-3 w-3 text-slate-400" />
            </div>
          </div>

          {/* SVG Line Chart */}
          <div className="relative pt-2 pb-1">
            <svg viewBox="0 0 450 180" className="w-full h-44 overflow-visible">
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="20" y1="30" x2="430" y2="30" stroke="#334155" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.4" />
              <line x1="20" y1="75" x2="430" y2="75" stroke="#334155" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.4" />
              <line x1="20" y1="120" x2="430" y2="120" stroke="#334155" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.4" />
              <line x1="20" y1="165" x2="430" y2="165" stroke="#334155" strokeWidth="0.8" opacity="0.6" />

              {/* Y Axis Labels */}
              <text x="0" y="34" fill="#64748B" fontSize="9" fontWeight="600">$30K</text>
              <text x="0" y="79" fill="#64748B" fontSize="9" fontWeight="600">$20K</text>
              <text x="0" y="124" fill="#64748B" fontSize="9" fontWeight="600">$10K</text>
              <text x="10" y="169" fill="#64748B" fontSize="9" fontWeight="600">$0</text>

              {/* Gradient Area Fill */}
              <path
                d="M 30 155 Q 60 75, 95 75 T 160 100 T 225 135 T 290 118 T 355 146 T 420 78 L 420 165 L 30 165 Z"
                fill="url(#revenueGrad)"
              />

              {/* Line Graph */}
              <path
                d="M 30 155 Q 60 75, 95 75 T 160 100 T 225 135 T 290 118 T 355 146 T 420 78"
                fill="none"
                stroke="#3B82F6"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* Data Points */}
              {revenuePoints.map((pt, i) => (
                <g key={i} className="cursor-pointer" onMouseEnter={() => setHoveredRevenueDay(i)}>
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={hoveredRevenueDay === i ? "5" : "3.5"}
                    fill="#3B82F6"
                    stroke="#FFFFFF"
                    strokeWidth="1.5"
                  />
                  {/* Tooltip on Highlighted Point */}
                  {hoveredRevenueDay === i ? (
                    <g>
                      <rect
                        x={pt.x - 42}
                        y={pt.y - 34}
                        width="84"
                        height="26"
                        rx="6"
                        fill="#080D16"
                        stroke="#334155"
                        strokeWidth="1"
                      />
                      <text
                        x={pt.x}
                        y={pt.y - 23}
                        fill="#94A3B8"
                        fontSize="8"
                        fontWeight="600"
                        textAnchor="middle"
                      >
                        {pt.date}, 2025
                      </text>
                      <text
                        x={pt.x}
                        y={pt.y - 12}
                        fill="#FFFFFF"
                        fontSize="9.5"
                        fontWeight="800"
                        textAnchor="middle"
                      >
                        {pt.highlight ?? `$${pt.amount.toLocaleString()}`}
                      </text>
                    </g>
                  ) : null}
                </g>
              ))}

              {/* X Axis Date Labels */}
              {revenuePoints.map((pt, i) => (
                <text
                  key={i}
                  x={pt.x}
                  y="180"
                  fill="#64748B"
                  fontSize="9.5"
                  fontWeight="600"
                  textAnchor="middle"
                >
                  {pt.date}
                </text>
              ))}
            </svg>
          </div>
        </div>

        {/* Card 2: Job Status Distribution */}
        <div className="rounded-2xl border border-white/10 bg-[#0F172A]/90 backdrop-blur-xl p-5 shadow-xl flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <h3 className="text-sm font-bold text-white">Job Status Distribution</h3>
            <div className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-[#080D16] px-2.5 py-1 text-xs text-slate-300">
              <span>{statusPeriod}</span>
              <ChevronDown className="h-3 w-3 text-slate-400" />
            </div>
          </div>

          <div className="flex items-center justify-center gap-6 py-2">
            {/* Donut Chart SVG */}
            <div className="relative flex items-center justify-center shrink-0">
              <svg width="150" height="150" viewBox="0 0 150 150">
                <circle
                  cx="75"
                  cy="75"
                  r="52"
                  fill="transparent"
                  stroke="#10B981"
                  strokeWidth="22"
                  strokeDasharray="163 163"
                  strokeDashoffset="0"
                />
                <circle
                  cx="75"
                  cy="75"
                  r="52"
                  fill="transparent"
                  stroke="#F59E0B"
                  strokeWidth="22"
                  strokeDasharray="108 218"
                  strokeDashoffset="-163"
                />
                <circle
                  cx="75"
                  cy="75"
                  r="52"
                  fill="transparent"
                  stroke="#F97316"
                  strokeWidth="22"
                  strokeDasharray="55 271"
                  strokeDashoffset="-271"
                />
                <circle
                  cx="75"
                  cy="75"
                  r="52"
                  fill="transparent"
                  stroke="#8B5CF6"
                  strokeWidth="22"
                  strokeDasharray="1 325"
                  strokeDashoffset="-325"
                />
              </svg>
              {/* Inner Label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-extrabold text-white tracking-tight">24</span>
                <span className="text-[10px] text-slate-400 font-medium">Total Jobs</span>
              </div>
            </div>

            {/* Legend */}
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-1.5 text-slate-300 font-medium">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Completed
                </span>
                <span className="text-white font-bold font-mono">12 (50%)</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-1.5 text-slate-300 font-medium">
                  <span className="h-2 w-2 rounded-full bg-amber-500" />
                  In Progress
                </span>
                <span className="text-white font-bold font-mono">8 (33%)</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-1.5 text-slate-300 font-medium">
                  <span className="h-2 w-2 rounded-full bg-[#F97316]" />
                  Pending
                </span>
                <span className="text-white font-bold font-mono">4 (17%)</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-1.5 text-slate-300 font-medium">
                  <span className="h-2 w-2 rounded-full bg-purple-500" />
                  Cancelled
                </span>
                <span className="text-white font-bold font-mono">0 (0%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Live Dispatch Feed */}
        <div className="rounded-2xl border border-white/10 bg-[#0F172A]/90 backdrop-blur-xl p-5 shadow-xl flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <h3 className="text-sm font-bold text-white">Live Dispatch Feed</h3>
            <Link
              href="/admin/dispatch"
              className="text-xs font-semibold text-[#F97316] hover:text-orange-400 transition-colors"
            >
              View All
            </Link>
          </div>

          <div className="space-y-3 flex-1 flex flex-col justify-around">
            {dispatchFeed.map((item) => {
              const IconComp = item.icon;
              return (
                <div key={item.id} className="flex items-start gap-3">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-xl border shrink-0 mt-0.5 ${item.iconColor}`}
                  >
                    <IconComp className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-200 leading-snug">{item.title}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{item.meta}</p>
                  </div>
                  <span className="text-[10px] text-slate-500 font-medium shrink-0">
                    {item.time}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          4. BOTTOM ROW: UPCOMING SCHEDULE, TOP TECHNICIANS, RECENT ALERTS
      ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Card 1: Upcoming Schedule */}
        <div className="rounded-2xl border border-white/10 bg-[#0F172A]/90 backdrop-blur-xl p-5 shadow-xl flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <h3 className="text-sm font-bold text-white">Upcoming Schedule</h3>
            <Link
              href="/admin/dispatch/calendar"
              className="text-xs font-semibold text-[#F97316] hover:text-orange-400 transition-colors"
            >
              View Calendar
            </Link>
          </div>

          <div className="space-y-3 flex-1">
            {upcomingSchedule.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className={`h-2 w-2 rounded-full shrink-0 ${item.dotColor}`} />
                  <div className="min-w-[100px] shrink-0 font-medium text-slate-300">
                    <div>{item.timeStart}</div>
                    <div className="text-[10px] text-slate-500">{item.timeEnd}</div>
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-white truncate">{item.service}</div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-1 truncate">
                      <MapPin className="h-3 w-3 text-[#F97316] shrink-0" />
                      <span className="truncate">{item.address}</span>
                    </div>
                  </div>
                </div>

                <Link
                  href={`/admin/technicians/${item.techId}`}
                  className="rounded-full bg-blue-500/10 border border-blue-500/20 px-2.5 py-0.5 text-[10px] font-semibold text-blue-300 shrink-0 hover:bg-blue-500/20 transition-colors"
                >
                  {item.techName}
                </Link>
              </div>
            ))}
          </div>

          <Link
            href="/admin/dispatch"
            className="w-full text-center py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-semibold text-white transition-all shadow-sm block"
          >
            View Full Schedule
          </Link>
        </div>

        {/* Card 2: Top Technicians Today */}
        <div className="rounded-2xl border border-white/10 bg-[#0F172A]/90 backdrop-blur-xl p-5 shadow-xl flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <h3 className="text-sm font-bold text-white">Top Technicians Today</h3>
            <Link
              href="/admin/technicians"
              className="text-xs font-semibold text-[#F97316] hover:text-orange-400 transition-colors"
            >
              View All
            </Link>
          </div>

          <div className="space-y-3.5 flex-1 flex flex-col justify-around">
            {topTechs.map((tech) => (
              <div key={tech.id} className="flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <img
                    src={tech.avatar}
                    alt={tech.name}
                    className="h-9 w-9 rounded-full object-cover border border-white/10 shrink-0"
                  />
                  <div>
                    <Link
                      href={`/admin/technicians/${tech.id}`}
                      className="font-bold text-white hover:text-orange-400 transition-colors"
                    >
                      {tech.name}
                    </Link>
                    <div className="text-[11px] text-slate-400">{tech.role}</div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-right">
                  <div>
                    <div className="font-bold text-white font-mono">{tech.completedJobs}</div>
                    <div className="text-[10px] text-slate-400">Jobs Completed</div>
                  </div>
                  <div>
                    <div className="font-bold text-emerald-400 font-mono">{tech.revenue}</div>
                    <div className="text-[10px] text-slate-400">Revenue</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Link
            href="/admin/technicians"
            className="w-full text-center py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-semibold text-white transition-all shadow-sm block"
          >
            View All Technicians
          </Link>
        </div>

        {/* Card 3: Recent Alerts */}
        <div className="rounded-2xl border border-white/10 bg-[#0F172A]/90 backdrop-blur-xl p-5 shadow-xl flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <h3 className="text-sm font-bold text-white">Recent Alerts</h3>
            <Link
              href="/admin/notifications"
              className="text-xs font-semibold text-[#F97316] hover:text-orange-400 transition-colors"
            >
              View All
            </Link>
          </div>

          <div className="space-y-3 flex-1 flex flex-col justify-around">
            {recentAlerts.map((alert, idx) => {
              const IconAlert = alert.icon;
              return (
                <div key={idx} className="flex items-start gap-3">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-xl border shrink-0 mt-0.5 ${alert.iconColor}`}
                  >
                    <IconAlert className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-white leading-snug">
                      {alert.title}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{alert.meta}</p>
                  </div>
                  <span className="text-[10px] text-slate-500 font-medium shrink-0">
                    {alert.time}
                  </span>
                </div>
              );
            })}
          </div>

          <Link
            href="/admin/audit-logs"
            className="w-full text-center py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-semibold text-white transition-all shadow-sm block"
          >
            View All Alerts
          </Link>
        </div>
      </div>

      <JobDrawer
        job={selectedJob}
        onClose={() => setSelectedJob(null)}
        onJobUpdated={() => handleRefresh()}
      />
    </div>
  );
}
