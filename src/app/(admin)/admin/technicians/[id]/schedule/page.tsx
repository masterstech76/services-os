/* eslint-disable @next/next/no-img-element */
"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  Plus,
  AlertTriangle,
  User,
  Users,
  Pause,
  SlidersHorizontal,
  CalendarDays,
  ShieldCheck,
  CheckCircle2,
  X,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";

interface ShiftBlock {
  id: string;
  techIndex: number; // 0: Robert C., 1: Maria A., 2: Danny R., 3: Sarah M., 4: Michael J.
  title: string;
  timeRange: string;
  topPct: number; // css top percentage
  heightPct: number; // css height percentage
  type: "working" | "appointment" | "on_call" | "time_off" | "conflict";
  bgClass: string;
  borderClass: string;
  textClass: string;
}

export default function AdminTechnicianSchedulePage() {
  const params = useParams<{ id: string }>();
  const [currentDate, setCurrentDate] = React.useState("May 14, 2025");
  const [viewMode, setViewMode] = React.useState<"day" | "week" | "month">("week");
  const [selectedDay, setSelectedDay] = React.useState("Wed 14");

  // Quick Action Modals
  const [showAddShiftModal, setShowAddShiftModal] = React.useState(false);
  const [showTimeOffModal, setShowTimeOffModal] = React.useState(false);

  // Top 5 KPI Metrics matching reference image
  const kpis = [
    {
      title: "Technicians Scheduled",
      value: "18",
      icon: Users,
      iconColor: "text-blue-400",
      iconBg: "bg-blue-500/15 border-blue-500/30",
    },
    {
      title: "Available",
      value: "8",
      icon: User,
      iconColor: "text-teal-400",
      iconBg: "bg-teal-500/15 border-teal-500/30",
    },
    {
      title: "On Leave",
      value: "3",
      icon: Pause,
      iconColor: "text-purple-400",
      iconBg: "bg-purple-500/15 border-purple-500/30",
    },
    {
      title: "Upcoming Shifts",
      value: "12",
      icon: Clock,
      iconColor: "text-blue-400",
      iconBg: "bg-blue-500/15 border-blue-500/30",
    },
    {
      title: "Conflicts",
      value: "1",
      icon: AlertTriangle,
      iconColor: "text-rose-400",
      iconBg: "bg-rose-500/15 border-rose-500/30",
    },
  ];

  const daysOfWeek = [
    { name: "Mon", date: "12" },
    { name: "Tue", date: "13" },
    { name: "Wed", date: "14", active: true },
    { name: "Thu", date: "15" },
    { name: "Fri", date: "16" },
    { name: "Sat", date: "17" },
    { name: "Sun", date: "18" },
  ];

  const technicians = [
    { id: "tech-1", name: "Robert C.", avatar: "/images/avatar-david.jpg" },
    { id: "tech-2", name: "Maria A.", avatar: "/images/avatar-sarah.jpg" },
    { id: "tech-3", name: "Danny R.", avatar: "/images/avatar-mike.jpg" },
    { id: "tech-4", name: "Sarah M.", avatar: "/images/avatar-sarah.jpg" },
    { id: "tech-5", name: "Michael J.", avatar: "/images/avatar-1.jpg" },
  ];

  const hoursRuler = ["8 AM", "10 AM", "12 PM", "2 PM", "4 PM", "6 PM", "8 PM"];

  // Shift & appointment blocks matching screenshot
  const shiftBlocks: ShiftBlock[] = [
    // Robert C.
    {
      id: "sb-1",
      techIndex: 0,
      title: "AC Repair",
      timeRange: "9:00 - 11:00 AM",
      topPct: 8,
      heightPct: 18,
      type: "working",
      bgClass: "bg-blue-600/25",
      borderClass: "border-blue-500/40",
      textClass: "text-blue-300",
    },
    {
      id: "sb-2",
      techIndex: 0,
      title: "Time Off",
      timeRange: "1:00 - 2:30 PM",
      topPct: 45,
      heightPct: 14,
      type: "time_off",
      bgClass: "bg-teal-500/20",
      borderClass: "border-teal-500/40",
      textClass: "text-teal-300",
    },
    // Maria A.
    {
      id: "sb-3",
      techIndex: 1,
      title: "Electrical",
      timeRange: "9:30 - 11:30 AM",
      topPct: 12,
      heightPct: 18,
      type: "working",
      bgClass: "bg-blue-600/25",
      borderClass: "border-blue-500/40",
      textClass: "text-blue-300",
    },
    {
      id: "sb-4",
      techIndex: 1,
      title: "HVAC",
      timeRange: "2:00 - 4:00 PM",
      topPct: 50,
      heightPct: 18,
      type: "working",
      bgClass: "bg-blue-600/25",
      borderClass: "border-blue-500/40",
      textClass: "text-blue-300",
    },
    // Danny R.
    {
      id: "sb-5",
      techIndex: 2,
      title: "Duct Cleaning",
      timeRange: "10:00 - 12:00",
      topPct: 16,
      heightPct: 18,
      type: "working",
      bgClass: "bg-blue-600/25",
      borderClass: "border-blue-500/40",
      textClass: "text-blue-300",
    },
    {
      id: "sb-6",
      techIndex: 2,
      title: "On Call",
      timeRange: "4:00 - 8:00 PM",
      topPct: 68,
      heightPct: 28,
      type: "on_call",
      bgClass: "bg-purple-600/25",
      borderClass: "border-purple-500/40",
      textClass: "text-purple-300",
    },
    // Sarah M.
    {
      id: "sb-7",
      techIndex: 3,
      title: "Plumbing",
      timeRange: "1:00 - 3:00",
      topPct: 42,
      heightPct: 18,
      type: "working",
      bgClass: "bg-blue-600/25",
      borderClass: "border-blue-500/40",
      textClass: "text-blue-300",
    },
    // Michael J.
    {
      id: "sb-8",
      techIndex: 4,
      title: "HVAC",
      timeRange: "2:00 - 4:00",
      topPct: 45,
      heightPct: 18,
      type: "working",
      bgClass: "bg-blue-600/25",
      borderClass: "border-blue-500/40",
      textClass: "text-blue-300",
    },
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-white p-4 lg:p-6 space-y-4">
      {/* Header with Date & View Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Technician Schedule</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Manage shifts, working hours, on-call schedules and time off.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Date Navigator */}
          <div className="flex items-center rounded-lg bg-[#0F172A] border border-white/10 px-3 py-1.5 text-xs font-medium text-slate-200 shadow-sm">
            <button
              onClick={() => setCurrentDate("May 13, 2025")}
              className="mr-2 text-slate-400 hover:text-white transition"
              title="Previous"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <Calendar className="w-3.5 h-3.5 mr-2 text-slate-400" />
            <span>{currentDate}</span>
            <button
              onClick={() => setCurrentDate("May 15, 2025")}
              className="ml-2 text-slate-400 hover:text-white transition"
              title="Next"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Today Button */}
          <button
            onClick={() => {
              setCurrentDate("May 14, 2025");
              toast.info("Viewing today's schedule");
            }}
            className="rounded-lg bg-[#0F172A] hover:bg-slate-800 border border-white/10 px-3 py-1.5 text-xs font-medium text-slate-200 transition shadow-sm"
          >
            Today
          </button>

          {/* View Mode Segmented Controls */}
          <div className="flex rounded-lg bg-[#0F172A] border border-white/10 p-0.5 text-xs font-medium">
            <button
              onClick={() => setViewMode("day")}
              className={`px-3 py-1 rounded transition ${
                viewMode === "day" ? "bg-blue-600 text-white font-bold" : "text-slate-400 hover:text-white"
              }`}
            >
              Day
            </button>
            <button
              onClick={() => setViewMode("week")}
              className={`px-3 py-1 rounded transition ${
                viewMode === "week" ? "bg-blue-600 text-white font-bold" : "text-slate-400 hover:text-white"
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setViewMode("month")}
              className={`px-3 py-1 rounded transition ${
                viewMode === "month" ? "bg-blue-600 text-white font-bold" : "text-slate-400 hover:text-white"
              }`}
            >
              Month
            </button>
          </div>

          {/* Add Shift CTA */}
          <button
            onClick={() => setShowAddShiftModal(true)}
            className="rounded-lg bg-[#F97316] hover:bg-[#EA580C] text-white px-4 py-1.5 text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-orange-500/20 active:scale-95 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Shift</span>
          </button>
        </div>
      </div>

      {/* Top 5 KPI Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className="rounded-xl bg-[#0F172A]/90 border border-white/10 p-3.5 flex flex-col justify-between shadow-md"
            >
              <div className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center border shrink-0 ${kpi.iconBg} ${kpi.iconColor}`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-medium text-slate-300 truncate">{kpi.title}</span>
              </div>

              <div className="mt-2.5">
                <div className="text-2xl font-bold text-white tracking-tight">{kpi.value}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Workspace Split: Calendar Grid (75%) + Right Control Sidebar (25%) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-start">
        {/* LEFT / CENTER: Weekly Calendar Grid */}
        <div className="xl:col-span-9 rounded-2xl bg-[#0F172A]/90 border border-white/10 p-4 space-y-4 shadow-xl">
          {/* Days of the Week Selector Row */}
          <div className="grid grid-cols-7 gap-2 pb-3 border-b border-white/10">
            {daysOfWeek.map((day) => {
              const isActive = selectedDay === `${day.name} ${day.date}`;
              return (
                <button
                  key={day.name}
                  onClick={() => setSelectedDay(`${day.name} ${day.date}`)}
                  className={`py-2 px-1 rounded-xl text-center transition flex flex-col items-center ${
                    isActive
                      ? "bg-blue-600/20 border border-blue-500 text-white shadow-md shadow-blue-500/20"
                      : "bg-[#080D1A]/60 hover:bg-slate-800/60 border border-white/5 text-slate-400"
                  }`}
                >
                  <span className="text-[10px] uppercase font-semibold">{day.name}</span>
                  <span className="text-sm font-bold mt-0.5">{day.date}</span>
                </button>
              );
            })}
          </div>

          {/* Technician Columns Headers */}
          <div className="grid grid-cols-12 gap-2 items-center text-xs text-slate-300">
            <div className="col-span-2 text-[11px] font-semibold text-slate-500 uppercase pl-2">
              Time
            </div>
            <div className="col-span-10 grid grid-cols-5 gap-2">
              {technicians.map((t) => (
                <div key={t.id} className="flex items-center gap-2 truncate">
                  <div className="relative w-6 h-6 rounded-full overflow-hidden border border-white/20 shrink-0 bg-slate-800">
                    <img src={t.avatar} alt={t.name} className="w-full h-full object-cover" />
                  </div>
                  <span className="text-xs font-bold text-white truncate">{t.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Schedule Canvas with Hours Grid */}
          <div className="relative h-[420px] rounded-xl bg-[#080D1A] border border-white/10 overflow-hidden">
            {/* Horizontal Grid lines for Hours */}
            <div className="absolute inset-0 flex flex-col justify-between py-2 pointer-events-none">
              {hoursRuler.map((hr, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-2 items-center border-b border-white/5 last:border-0 h-full">
                  <div className="col-span-2 text-[10px] font-mono text-slate-500 pl-3">
                    {hr}
                  </div>
                  <div className="col-span-10 h-full border-l border-white/5" />
                </div>
              ))}
            </div>

            {/* Vertical Columns for the 5 Technicians */}
            <div className="absolute inset-0 grid grid-cols-12 gap-2 pointer-events-none">
              <div className="col-span-2" />
              <div className="col-span-10 grid grid-cols-5 gap-2 h-full">
                {technicians.map((t, idx) => (
                  <div key={idx} className="border-r border-white/5 h-full last:border-0 relative pointer-events-auto">
                    {/* Render matching Shift Blocks for this Tech */}
                    {shiftBlocks
                      .filter((sb) => sb.techIndex === idx)
                      .map((block) => (
                        <div
                          key={block.id}
                          onClick={() => toast.info(`${block.title}: ${block.timeRange}`)}
                          className={`absolute left-1 right-1 rounded-lg p-2 border shadow-lg cursor-pointer transition hover:scale-[1.02] ${block.bgClass} ${block.borderClass}`}
                          style={{
                            top: `${block.topPct}%`,
                            height: `${block.heightPct}%`,
                          }}
                        >
                          <div className={`text-[11px] font-bold leading-tight ${block.textClass}`}>
                            {block.title}
                          </div>
                          <div className="text-[10px] text-slate-300 mt-0.5 leading-none">
                            {block.timeRange}
                          </div>
                        </div>
                      ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Legend */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              <span>Working Shift</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
              <span>Appointment</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
              <span>On Call</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-400" />
              <span>Time Off</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span>Conflict</span>
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR: Quick Actions, Upcoming Time Off, Shift Summary */}
        <div className="xl:col-span-3 space-y-4">
          {/* Card 1: Quick Actions */}
          <div className="rounded-2xl bg-[#0F172A]/90 border border-white/10 p-4 space-y-2.5 shadow-xl">
            <h3 className="text-xs font-bold text-white uppercase tracking-wide">
              Quick Actions
            </h3>
            <div className="space-y-1.5">
              <button
                onClick={() => setShowAddShiftModal(true)}
                className="w-full rounded-lg bg-slate-800 hover:bg-slate-700 border border-white/10 text-slate-200 py-2 px-3 text-xs font-medium flex items-center gap-2 transition"
              >
                <Plus className="w-3.5 h-3.5 text-orange-400" />
                <span>Add Shift</span>
              </button>
              <button
                onClick={() => setShowTimeOffModal(true)}
                className="w-full rounded-lg bg-slate-800 hover:bg-slate-700 border border-white/10 text-slate-200 py-2 px-3 text-xs font-medium flex items-center gap-2 transition"
              >
                <Pause className="w-3.5 h-3.5 text-purple-400" />
                <span>Request Time Off</span>
              </button>
              <button
                onClick={() => toast.info("Opening On-Call rotation manager")}
                className="w-full rounded-lg bg-slate-800 hover:bg-slate-700 border border-white/10 text-slate-200 py-2 px-3 text-xs font-medium flex items-center gap-2 transition"
              >
                <Clock className="w-3.5 h-3.5 text-blue-400" />
                <span>Manage On-Call</span>
              </button>
            </div>
          </div>

          {/* Card 2: Upcoming Time Off */}
          <div className="rounded-2xl bg-[#0F172A]/90 border border-white/10 p-4 space-y-3 shadow-xl">
            <h3 className="text-xs font-bold text-white uppercase tracking-wide">
              Upcoming Time Off
            </h3>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="relative w-6 h-6 rounded-full overflow-hidden border border-white/20 shrink-0">
                    <img src="/images/avatar-sarah.jpg" alt="Sarah" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="font-bold text-white">Sarah Mitchell</div>
                    <div className="text-[10px] text-slate-400">May 14 - 18</div>
                  </div>
                </div>
                <span className="border border-emerald-500/30 bg-emerald-500/15 text-emerald-400 text-[10px] font-semibold px-2 py-0.5 rounded">
                  Approved
                </span>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-white/5">
                <div className="flex items-center gap-2">
                  <div className="relative w-6 h-6 rounded-full overflow-hidden border border-white/20 shrink-0">
                    <img src="/images/avatar-2.jpg" alt="Jessica" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="font-bold text-white">Jessica Lee</div>
                    <div className="text-[10px] text-slate-400">May 19</div>
                  </div>
                </div>
                <span className="border border-amber-500/30 bg-amber-500/15 text-amber-400 text-[10px] font-semibold px-2 py-0.5 rounded">
                  Pending
                </span>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-white/5">
                <div className="flex items-center gap-2">
                  <div className="relative w-6 h-6 rounded-full overflow-hidden border border-white/20 shrink-0">
                    <img src="/images/avatar-3.jpg" alt="David" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="font-bold text-white">David Kim</div>
                    <div className="text-[10px] text-slate-400">May 22 - 25</div>
                  </div>
                </div>
                <span className="border border-emerald-500/30 bg-emerald-500/15 text-emerald-400 text-[10px] font-semibold px-2 py-0.5 rounded">
                  Approved
                </span>
              </div>
            </div>
          </div>

          {/* Card 3: Shift Summary */}
          <div className="rounded-2xl bg-[#0F172A]/90 border border-white/10 p-4 space-y-2.5 shadow-xl">
            <h3 className="text-xs font-bold text-white uppercase tracking-wide">
              Shift Summary
            </h3>
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="rounded-lg bg-[#080D1A] border border-white/5 p-2">
                <div className="text-[10px] text-slate-400">Total Shifts</div>
                <div className="text-xs font-bold text-white mt-0.5">12</div>
              </div>
              <div className="rounded-lg bg-[#080D1A] border border-white/5 p-2">
                <div className="text-[10px] text-slate-400">On Duty</div>
                <div className="text-xs font-bold text-emerald-400 mt-0.5">10</div>
              </div>
              <div className="rounded-lg bg-[#080D1A] border border-white/5 p-2">
                <div className="text-[10px] text-slate-400">Off Duty</div>
                <div className="text-xs font-bold text-slate-400 mt-0.5">2</div>
              </div>
              <div className="rounded-lg bg-[#080D1A] border border-white/5 p-2">
                <div className="text-[10px] text-slate-400">On Leave</div>
                <div className="text-xs font-bold text-purple-400 mt-0.5">3</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Shift Modal */}
      {showAddShiftModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="rounded-2xl bg-[#0F172A] border border-white/10 p-5 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h3 className="text-sm font-bold text-white">Add Technician Shift</h3>
              <button
                onClick={() => setShowAddShiftModal(false)}
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300">Technician</label>
                <select className="w-full rounded-lg bg-[#080D1A] border border-white/10 p-2 text-xs text-white mt-1">
                  <option>Robert Caldwell</option>
                  <option>Maria Alvarez</option>
                  <option>Danny Reyes</option>
                  <option>Sarah Mitchell</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300">Start Time</label>
                  <input type="time" defaultValue="08:00" className="w-full rounded-lg bg-[#080D1A] border border-white/10 p-2 text-xs text-white mt-1" />
                </div>
                <div>
                  <label className="text-slate-300">End Time</label>
                  <input type="time" defaultValue="17:00" className="w-full rounded-lg bg-[#080D1A] border border-white/10 p-2 text-xs text-white mt-1" />
                </div>
              </div>
              <div>
                <label className="text-slate-300">Shift Type</label>
                <select className="w-full rounded-lg bg-[#080D1A] border border-white/10 p-2 text-xs text-white mt-1">
                  <option>Standard Working Shift</option>
                  <option>On-Call Emergency Duty</option>
                  <option>Weekend Rapid Response</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => setShowAddShiftModal(false)}
                className="rounded px-3 py-1.5 text-xs text-slate-300 bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  toast.success("Shift added successfully!");
                  setShowAddShiftModal(false);
                }}
                className="rounded px-4 py-1.5 text-xs font-bold text-white bg-[#F97316]"
              >
                Save Shift
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Time Off Modal */}
      {showTimeOffModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="rounded-2xl bg-[#0F172A] border border-white/10 p-5 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h3 className="text-sm font-bold text-white">Request Time Off</h3>
              <button
                onClick={() => setShowTimeOffModal(false)}
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300">Technician</label>
                <select className="w-full rounded-lg bg-[#080D1A] border border-white/10 p-2 text-xs text-white mt-1">
                  <option>Robert Caldwell</option>
                  <option>Maria Alvarez</option>
                  <option>Danny Reyes</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300">Start Date</label>
                  <input type="date" defaultValue="2025-05-20" className="w-full rounded-lg bg-[#080D1A] border border-white/10 p-2 text-xs text-white mt-1" />
                </div>
                <div>
                  <label className="text-slate-300">End Date</label>
                  <input type="date" defaultValue="2025-05-22" className="w-full rounded-lg bg-[#080D1A] border border-white/10 p-2 text-xs text-white mt-1" />
                </div>
              </div>
              <div>
                <label className="text-slate-300">Reason</label>
                <input type="text" placeholder="Vacation, Personal, Training" className="w-full rounded-lg bg-[#080D1A] border border-white/10 p-2 text-xs text-white mt-1" />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => setShowTimeOffModal(false)}
                className="rounded px-3 py-1.5 text-xs text-slate-300 bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  toast.success("Time off request submitted!");
                  setShowTimeOffModal(false);
                }}
                className="rounded px-4 py-1.5 text-xs font-bold text-white bg-purple-600"
              >
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
