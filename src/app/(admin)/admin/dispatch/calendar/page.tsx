"use client";

import * as React from "react";
import Link from "next/link";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  parseISO,
} from "date-fns";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  CalendarDays,
  RefreshCw,
  User,
  Wrench,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  DollarSign,
  Plus,
  Filter,
  Download,
  Printer,
  Search,
  RotateCcw,
  UserCheck,
  CalendarCheck,
  Phone,
  X,
  ExternalLink,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";
import { businessConfig } from "@config/business.config";
import { formatMoney } from "@/components/shared/Money";
import { JobDrawer } from "@/components/admin/JobDrawer";
import type { EnrichedJob } from "@/lib/server/operations";

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export interface CalendarAppointment {
  id: string;
  jobNumber: number;
  dateStr: string; // YYYY-MM-DD
  timeStr: string; // e.g. "9:00 AM"
  duration: string; // e.g. "2h"
  serviceName: string;
  category: "cooling" | "heating" | "plumbing" | "duct" | "thermostat";
  customerName: string;
  customerPhone: string;
  address: string;
  techName: string;
  techColor: string;
  status: "scheduled" | "in_progress" | "completed" | "pending" | "cancelled";
  priority: "High" | "Medium" | "Low";
  estimateCents: number;
}

// Sample appointment dataset spanning May 2025
const SAMPLE_APPOINTMENTS: CalendarAppointment[] = [
  {
    id: "cal-1",
    jobNumber: 1038,
    dateStr: "2025-05-14",
    timeStr: "9:00 AM",
    duration: "2h",
    serviceName: "AC Repair Diagnostic",
    category: "cooling",
    customerName: "Service Client A",
    customerPhone: "(XXX) XXX-XXXX",
    address: "800 NW 7th St, Miami",
    techName: "Lead Field Technician",
    techColor: "#3B82F6",
    status: "in_progress",
    priority: "High",
    estimateCents: 18900,
  },
  {
    id: "cal-2",
    jobNumber: 1041,
    dateStr: "2025-05-14",
    timeStr: "11:30 AM",
    duration: "1h 30m",
    serviceName: "Smart Thermostat Install",
    category: "thermostat",
    customerName: "Senior HVAC Specialist",
    customerPhone: "(XXX) XXX-XXXX",
    address: "1900 Coral Way, Miami",
    techName: "Tony Brooks",
    techColor: "#EC4899",
    status: "scheduled",
    priority: "Medium",
    estimateCents: 24900,
  },
  {
    id: "cal-3",
    jobNumber: 1045,
    dateStr: "2025-05-14",
    timeStr: "1:30 PM",
    duration: "2h",
    serviceName: "Whole-Home Air Duct Clean",
    category: "duct",
    customerName: "Elena Rodriguez",
    customerPhone: "(XXX) XXX-XXXX",
    address: "450 Alton Rd, Miami Beach",
    techName: "Maria Alvarez",
    techColor: "#A855F7",
    status: "scheduled",
    priority: "Medium",
    estimateCents: 12900,
  },
  {
    id: "cal-4",
    jobNumber: 1052,
    dateStr: "2025-05-14",
    timeStr: "4:00 PM",
    duration: "1h",
    serviceName: "Emergency AC Diagnostic",
    category: "cooling",
    customerName: "Service Client B",
    customerPhone: "(XXX) XXX-XXXX",
    address: "2840 SW 27th Ave, Miami",
    techName: "Lead Field Technician",
    techColor: "#3B82F6",
    status: "pending",
    priority: "High",
    estimateCents: 9900,
  },
  {
    id: "cal-5",
    jobNumber: 1040,
    dateStr: "2025-05-15",
    timeStr: "9:00 AM",
    duration: "2h",
    serviceName: "21-Point Seasonal Tune-Up",
    category: "cooling",
    customerName: "Sara Mitchell",
    customerPhone: "(XXX) XXX-XXXX",
    address: "1201 Brickell Ave, Miami",
    techName: "Danny Reyes",
    techColor: "#14B8A6",
    status: "scheduled",
    priority: "Medium",
    estimateCents: 8900,
  },
  {
    id: "cal-6",
    jobNumber: 1043,
    dateStr: "2025-05-15",
    timeStr: "1:00 PM",
    duration: "2h",
    serviceName: "R-410A Refrigerant Recharge",
    category: "cooling",
    customerName: "Michael Johnson",
    customerPhone: "(XXX) XXX-XXXX",
    address: "9100 SW 72nd St, Miami",
    techName: "Tony Brooks",
    techColor: "#EC4899",
    status: "scheduled",
    priority: "High",
    estimateCents: 19900,
  },
  {
    id: "cal-7",
    jobNumber: 1044,
    dateStr: "2025-05-16",
    timeStr: "10:00 AM",
    duration: "2h",
    serviceName: "Air Duct Sanitation",
    category: "duct",
    customerName: "Jessica Lee",
    customerPhone: "(XXX) XXX-XXXX",
    address: "600 5th St, Miami",
    techName: "Maria Alvarez",
    techColor: "#A855F7",
    status: "scheduled",
    priority: "Low",
    estimateCents: 24900,
  },
  {
    id: "cal-8",
    jobNumber: 1046,
    dateStr: "2025-05-16",
    timeStr: "2:30 PM",
    duration: "1h 30m",
    serviceName: "Thermostat Replacement",
    category: "thermostat",
    customerName: "Amanda Clark",
    customerPhone: "(XXX) XXX-XXXX",
    address: "7800 Collins Ave, Miami Beach",
    techName: "Danny Reyes",
    techColor: "#14B8A6",
    status: "pending",
    priority: "Medium",
    estimateCents: 14900,
  },
  {
    id: "cal-9",
    jobNumber: 1047,
    dateStr: "2025-05-19",
    timeStr: "9:00 AM",
    duration: "2h",
    serviceName: "Commercial Rooftop Inspection",
    category: "cooling",
    customerName: "Brian Miller",
    customerPhone: "(XXX) XXX-XXXX",
    address: "600 Brickell Ave, Miami",
    techName: "Lead Field Technician",
    techColor: "#3B82F6",
    status: "scheduled",
    priority: "High",
    estimateCents: 34900,
  },
  {
    id: "cal-10",
    jobNumber: 1048,
    dateStr: "2025-05-20",
    timeStr: "11:00 AM",
    duration: "1h 30m",
    serviceName: "Capacitor & Contactor Fix",
    category: "cooling",
    customerName: "Rachel Adams",
    customerPhone: "(XXX) XXX-XXXX",
    address: "1130 Washington Ave, Miami Beach",
    techName: "Tony Brooks",
    techColor: "#EC4899",
    status: "scheduled",
    priority: "High",
    estimateCents: 17900,
  },
  {
    id: "cal-11",
    jobNumber: 1050,
    dateStr: "2025-05-22",
    timeStr: "1:00 PM",
    duration: "2h",
    serviceName: "HVAC Compressor Tune-Up",
    category: "cooling",
    customerName: "Kevin White",
    customerPhone: "(XXX) XXX-XXXX",
    address: "2100 NE 1st Ct, Miami",
    techName: "Lead Field Technician",
    techColor: "#3B82F6",
    status: "scheduled",
    priority: "Medium",
    estimateCents: 15900,
  },
  {
    id: "cal-12",
    jobNumber: 1051,
    dateStr: "2025-05-27",
    timeStr: "10:30 AM",
    duration: "2h",
    serviceName: "Air Duct Microbial Fogging",
    category: "duct",
    customerName: "Diana Ross",
    customerPhone: "(XXX) XXX-XXXX",
    address: "3401 NE 5th Ave, Miami",
    techName: "Maria Alvarez",
    techColor: "#A855F7",
    status: "scheduled",
    priority: "Low",
    estimateCents: 22900,
  },
];

export default function AdminDispatchMonthlyCalendarPage() {
  const [currentMonth, setCurrentMonth] = React.useState<Date>(new Date(2025, 4, 1)); // May 2025
  const [selectedDate, setSelectedDate] = React.useState<Date>(new Date(2025, 4, 14)); // May 14, 2025
  const [appointments, setAppointments] = React.useState<CalendarAppointment[]>(SAMPLE_APPOINTMENTS);
  const [viewMode, setViewMode] = React.useState<"month" | "week" | "day">("month");

  // Filters
  const [search, setSearch] = React.useState<string>("");
  const [techFilter, setTechFilter] = React.useState<string>("all");
  const [serviceFilter, setServiceFilter] = React.useState<string>("all");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [priorityFilter, setPriorityFilter] = React.useState<string>("all");

  // Quick Schedule Modal state
  const [scheduleModalOpen, setScheduleModalOpen] = React.useState<boolean>(false);
  const [newCustomerName, setNewCustomerName] = React.useState<string>("");
  const [newServiceName, setNewServiceName] = React.useState<string>("AC Repair");
  const [newTechName, setNewTechName] = React.useState<string>("Lead Field Technician");
  const [newTimeStr, setNewTimeStr] = React.useState<string>("09:00 AM");

  // Month interval calculation
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);
  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  // Filtered Appointments
  const filteredAppointments = appointments.filter((app) => {
    if (techFilter !== "all" && !app.techName.toLowerCase().includes(techFilter.toLowerCase())) {
      return false;
    }
    if (serviceFilter !== "all" && app.category !== serviceFilter) {
      return false;
    }
    if (statusFilter !== "all" && app.status !== statusFilter) {
      return false;
    }
    if (priorityFilter !== "all" && app.priority.toLowerCase() !== priorityFilter.toLowerCase()) {
      return false;
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      const hay = `${app.jobNumber} ${app.customerName} ${app.serviceName} ${app.address}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  // Helper to find appointments for a specific day
  const getDayAppointments = (day: Date) => {
    const formatted = format(day, "yyyy-MM-dd");
    return filteredAppointments.filter((a) => a.dateStr === formatted);
  };

  const selectedDateAppointments = getDayAppointments(selectedDate);
  const selectedDateStrFormatted = format(selectedDate, "EEEE, MMMM d, yyyy");

  // Add new appointment
  const handleCreateAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomerName.trim()) {
      toast.error("Please enter a customer name");
      return;
    }

    const newApp: CalendarAppointment = {
      id: `cal-custom-${Date.now()}`,
      jobNumber: Math.floor(1000 + Math.random() * 900),
      dateStr: format(selectedDate, "yyyy-MM-dd"),
      timeStr: newTimeStr,
      duration: "1h 30m",
      serviceName: newServiceName,
      category: "cooling",
      customerName: newCustomerName,
      customerPhone: "(XXX) XXX-XXXX",
      address: "Downtown Miami, FL",
      techName: newTechName,
      techColor: "#3B82F6",
      status: "scheduled",
      priority: "Medium",
      estimateCents: 14900,
    };

    setAppointments((prev) => [...prev, newApp]);
    toast.success(`Booked #${newApp.jobNumber} on ${format(selectedDate, "MMM d, yyyy")}!`);
    setScheduleModalOpen(false);
    setNewCustomerName("");
  };

  return (
    <div className="space-y-4 pb-16">
      {/* ─────────────────────────────────────────────────────────────
          1. HEADER & GLOBAL CONTROLS
      ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
            <span>Dispatch – Monthly Calendar</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            View and manage monthly service appointments, daily job volumes, and technician availability.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setScheduleModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-[#020617] font-bold px-4 py-2 text-xs shadow-lg shadow-orange-500/20 transition-all cursor-pointer active:scale-95 w-fit"
        >
          <Plus className="h-4 w-4 stroke-[3]" />
          <span>Schedule Job</span>
        </button>
      </div>

      {/* Traversal Toolbar */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Month Traversal */}
          <div className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-[#0F172A] px-2.5 py-1.5 text-xs text-white">
            <button
              type="button"
              onClick={() => setCurrentMonth((prev) => subMonths(prev, 1))}
              className="p-1 hover:text-orange-400 transition-colors"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            <span className="font-semibold px-2">{format(currentMonth, "MMMM yyyy")}</span>
            <button
              type="button"
              onClick={() => setCurrentMonth((prev) => addMonths(prev, 1))}
              className="p-1 hover:text-orange-400 transition-colors"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              setCurrentMonth(new Date());
              setSelectedDate(new Date());
            }}
            className="rounded-xl border border-white/10 bg-[#0F172A] hover:bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:text-white transition-all cursor-pointer"
          >
            Today
          </button>

          {/* Month / Week / Day view switcher */}
          <div className="inline-flex rounded-xl border border-white/10 bg-[#0F172A] p-0.5 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setViewMode("month")}
              className={`px-3 py-1 rounded-lg transition-all ${
                viewMode === "month"
                  ? "bg-[#F97316] text-[#020617] font-bold shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Month
            </button>
            <button
              type="button"
              onClick={() => setViewMode("week")}
              className={`px-3 py-1 rounded-lg transition-all ${
                viewMode === "week"
                  ? "bg-[#F97316] text-[#020617] font-bold shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Week
            </button>
            <button
              type="button"
              onClick={() => setViewMode("day")}
              className={`px-3 py-1 rounded-lg transition-all ${
                viewMode === "day"
                  ? "bg-[#F97316] text-[#020617] font-bold shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Day
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-[#0F172A] hover:bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:text-white transition-all cursor-pointer"
        >
          <Printer className="h-3.5 w-3.5 text-slate-400" />
          <span>Print Schedule</span>
        </button>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. MONTHLY WORKLOAD 4-METRIC CARDS
      ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="rounded-2xl border border-white/10 bg-[#0F172A]/90 p-4 shadow-xl backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">Monthly Volume</span>
            <div className="h-7 w-7 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <CalendarIcon className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="text-2xl font-black text-white font-mono">{appointments.length} Visits</div>
            <div className="text-[11px] font-semibold text-emerald-400 mt-0.5">
              Across 22 operating days
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0F172A]/90 p-4 shadow-xl backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">Completed &amp; Cleared</span>
            <div className="h-7 w-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="text-2xl font-black text-emerald-400 font-mono">18 Completed</div>
            <div className="text-[11px] font-medium text-slate-400 mt-0.5">
              100% on-time resolution
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0F172A]/90 p-4 shadow-xl backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">Pending Assignment</span>
            <div className="h-7 w-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="text-2xl font-black text-amber-400 font-mono">2 In Queue</div>
            <div className="text-[11px] font-medium text-slate-400 mt-0.5">
              Needs field technician
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0F172A]/90 p-4 shadow-xl backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">Capacity Alerts</span>
            <div className="h-7 w-7 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <AlertTriangle className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="text-2xl font-black text-white font-mono">0 Double-Bookings</div>
            <div className="text-[11px] font-semibold text-emerald-400 mt-0.5">
              All routes conflict-free
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. ADVANCED FILTER BAR
      ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 flex-wrap flex-1">
          <div className="relative w-52 sm:w-60">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search appointment..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-white/10 bg-[#0B1322] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500/60"
            />
          </div>

          <select
            value={techFilter}
            onChange={(e) => setTechFilter(e.target.value)}
            className="rounded-xl border border-white/10 bg-[#0B1322] px-3 py-1.5 text-xs text-white focus:outline-none focus:border-orange-500/60"
          >
            <option value="all">All Technicians</option>
            <option value="Lead Field Technician">Lead Field Technician</option>
            <option value="Tony Brooks">Tony Brooks</option>
            <option value="Maria Alvarez">Maria Alvarez</option>
            <option value="Danny Reyes">Danny Reyes</option>
          </select>

          <select
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
            className="rounded-xl border border-white/10 bg-[#0B1322] px-3 py-1.5 text-xs text-white focus:outline-none focus:border-orange-500/60"
          >
            <option value="all">All Categories</option>
            <option value="cooling">Cooling / AC</option>
            <option value="duct">Air Ducts</option>
            <option value="thermostat">Controls</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="rounded-xl border border-white/10 bg-[#0B1322] px-3 py-1.5 text-xs text-white focus:outline-none focus:border-orange-500/60"
          >
            <option value="all">All Priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <button
            type="button"
            onClick={() => {
              setSearch("");
              setTechFilter("all");
              setServiceFilter("all");
              setPriorityFilter("all");
            }}
            className="text-xs font-semibold text-rose-400 hover:text-rose-300 ml-1 transition-colors"
          >
            Clear Filters
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          <span>Normal (1-3)</span>
          <span className="h-2 w-2 rounded-full bg-amber-400 ml-2" />
          <span>Busy (4-6)</span>
          <span className="h-2 w-2 rounded-full bg-rose-400 ml-2" />
          <span>Full Capacity (7+)</span>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          4. 7-COLUMN MONTHLY CALENDAR GRID & RIGHT DAY SUMMARY
      ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 items-start">
        {/* LEFT (3 Cols on XL): Monthly Calendar Grid */}
        <div className="xl:col-span-3 rounded-2xl border border-white/10 bg-[#0F172A]/90 backdrop-blur-xl shadow-2xl overflow-hidden">
          {/* Day of Week Headers */}
          <div className="grid grid-cols-7 border-b border-white/10 bg-[#0B1322] text-center text-xs font-bold text-slate-400">
            {DAYS_OF_WEEK.map((d) => (
              <div key={d} className="py-2.5 border-r border-white/5 last:border-r-0">
                {d}
              </div>
            ))}
          </div>

          {/* 7-Column Days Grid */}
          <div className="grid grid-cols-7 divide-x divide-y divide-white/5">
            {calendarDays.map((day) => {
              const dayStr = format(day, "yyyy-MM-dd");
              const isSelected = isSameDay(day, selectedDate);
              const isCurrentMonth = isSameMonth(day, currentMonth);
              const isTodayDate = isToday(day);
              const dayApps = getDayAppointments(day);

              // Workload density
              const densityClass =
                dayApps.length >= 7
                  ? "bg-rose-500"
                  : dayApps.length >= 4
                  ? "bg-amber-500"
                  : dayApps.length > 0
                  ? "bg-emerald-500"
                  : "bg-transparent";

              return (
                <div
                  key={dayStr}
                  onClick={() => setSelectedDate(day)}
                  className={`min-h-[110px] p-2 flex flex-col justify-between transition-all group cursor-pointer relative ${
                    isSelected
                      ? "bg-orange-500/10 ring-2 ring-orange-500/50 z-10"
                      : isCurrentMonth
                      ? "hover:bg-white/[0.03]"
                      : "opacity-30 bg-white/[0.01]"
                  }`}
                >
                  {/* Top Day Header */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`h-6 w-6 rounded-lg text-xs font-bold flex items-center justify-center font-mono ${
                        isTodayDate
                          ? "bg-[#F97316] text-[#020617] font-black shadow-md shadow-orange-500/30"
                          : isSelected
                          ? "text-orange-400 font-black"
                          : "text-slate-300"
                      }`}
                    >
                      {format(day, "d")}
                    </span>

                    {/* Workload dot & Quick Add */}
                    <div className="flex items-center gap-1.5">
                      {dayApps.length > 0 && (
                        <span
                          className={`h-2 w-2 rounded-full ${densityClass}`}
                          title={`${dayApps.length} appointments`}
                        />
                      )}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedDate(day);
                          setScheduleModalOpen(true);
                        }}
                        className="opacity-0 group-hover:opacity-100 h-5 w-5 rounded bg-white/10 hover:bg-orange-500 text-white hover:text-[#020617] flex items-center justify-center transition-all"
                        title="Book appointment on this day"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>

                  {/* Appointments list in cell */}
                  <div className="space-y-1 my-1">
                    {dayApps.slice(0, 3).map((app) => (
                      <div
                        key={app.id}
                        className="rounded-md border border-white/5 bg-[#0B1322] px-1.5 py-0.5 text-[9px] flex items-center gap-1 truncate font-medium text-slate-200"
                      >
                        <span
                          className="h-1.5 w-1.5 rounded-full shrink-0"
                          style={{ backgroundColor: app.techColor }}
                        />
                        <span className="font-mono text-slate-400 shrink-0">{app.timeStr}</span>
                        <span className="truncate">{app.serviceName}</span>
                      </div>
                    ))}
                    {dayApps.length > 3 && (
                      <span className="text-[9px] font-bold text-orange-400 block pl-1">
                        +{dayApps.length - 3} more
                      </span>
                    )}
                  </div>

                  {/* Bottom Day Footer */}
                  <div className="text-[9px] text-slate-500 font-mono text-right">
                    {dayApps.length > 0 ? `${dayApps.length} jobs` : ""}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT (1 Col on XL): Sticky Daily Appointment Summary Inspector */}
        <div className="xl:col-span-1 rounded-2xl border border-white/10 bg-[#0F172A]/95 backdrop-blur-xl shadow-2xl p-5 space-y-4 sticky top-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400 block">
                Daily Appointment Inspector
              </span>
              <h2 className="text-sm font-bold text-white mt-0.5">
                {selectedDateStrFormatted}
              </h2>
            </div>
            <span className="rounded-full bg-white/5 border border-white/10 px-2.5 py-0.5 text-xs font-mono font-bold text-slate-300">
              {selectedDateAppointments.length} Bookings
            </span>
          </div>

          {/* Workload Capacity Bar for Selected Day */}
          <div className="rounded-xl border border-white/5 bg-[#0B1322] p-3 space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-300">Workload Capacity</span>
              <span className="text-emerald-400">{selectedDateAppointments.length}/8 Slots</span>
            </div>
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-amber-500 rounded-full"
                style={{ width: `${Math.min(100, (selectedDateAppointments.length / 8) * 100)}%` }}
              />
            </div>
          </div>

          {/* Appointments List for Day */}
          <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1 [scrollbar-width:thin]">
            {selectedDateAppointments.length === 0 ? (
              <div className="text-center p-8 space-y-2 text-xs text-slate-400">
                <CalendarCheck className="h-8 w-8 text-slate-600 mx-auto" />
                <p>No appointments booked on this date.</p>
                <button
                  type="button"
                  onClick={() => setScheduleModalOpen(true)}
                  className="px-3 py-1.5 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/30 text-xs font-semibold hover:bg-orange-500/20"
                >
                  + Add First Appointment
                </button>
              </div>
            ) : (
              selectedDateAppointments.map((app) => (
                <div
                  key={app.id}
                  className="rounded-xl border border-white/10 bg-[#0B1322] p-3.5 space-y-2 text-xs hover:border-orange-500/40 transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-orange-400">
                      #{app.jobNumber}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        app.priority === "High"
                          ? "bg-rose-500/15 text-rose-400 border border-rose-500/30"
                          : "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                      }`}
                    >
                      {app.priority}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-white text-xs">{app.serviceName}</h3>
                    <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                      <Clock className="h-3 w-3 text-slate-500 shrink-0" />
                      <span>{app.timeStr} ({app.duration})</span>
                    </p>
                  </div>

                  <div className="pt-1.5 border-t border-white/5 space-y-1 text-[11px]">
                    <div className="flex items-center justify-between text-slate-300">
                      <span>Customer:</span>
                      <span className="font-semibold text-white">{app.customerName}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-300">
                      <span>Location:</span>
                      <span className="text-slate-400 truncate max-w-[150px]">{app.address}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-300">
                      <span>Technician:</span>
                      <span className="flex items-center gap-1 font-semibold text-white">
                        <span
                          className="h-1.5 w-1.5 rounded-full"
                          style={{ backgroundColor: app.techColor }}
                        />
                        {app.techName}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    <span className="font-mono font-bold text-emerald-400">
                      {formatMoney(app.estimateCents)}
                    </span>
                    <Link
                      href={`/admin/jobs/${app.id}`}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-orange-400 hover:text-orange-300"
                    >
                      <span>Dossier</span>
                      <ChevronRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>

          <button
            type="button"
            onClick={() => setScheduleModalOpen(true)}
            className="w-full py-2.5 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/30 text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Schedule Appointment on {format(selectedDate, "MMM d")}</span>
          </button>
        </div>
      </div>

      {/* Quick Schedule Modal */}
      {scheduleModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        >
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0F172A] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h3 className="text-base font-bold text-white">
                Schedule Service on {format(selectedDate, "MMM d, yyyy")}
              </h3>
              <button
                type="button"
                onClick={() => setScheduleModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateAppointment} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Customer Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Robert Smith"
                  value={newCustomerName}
                  onChange={(e) => setNewCustomerName(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-[#080D16] p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Service Type</label>
                <select
                  value={newServiceName}
                  onChange={(e) => setNewServiceName(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-[#080D16] p-2.5 text-white"
                >
                  <option value="AC Repair Diagnostic & Fix">AC Repair Diagnostic &amp; Fix</option>
                  <option value="Smart Thermostat Installation">Smart Thermostat Installation</option>
                  <option value="Whole-Home Air Duct Cleaning">Whole-Home Air Duct Cleaning</option>
                  <option value="21-Point AC Seasonal Tune-Up">21-Point AC Seasonal Tune-Up</option>
                  <option value="Refrigerant Recharge & Leak Test">Refrigerant Recharge &amp; Leak Test</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Time Slot</label>
                  <select
                    value={newTimeStr}
                    onChange={(e) => setNewTimeStr(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#080D16] p-2.5 text-white"
                  >
                    <option value="09:00 AM">09:00 AM</option>
                    <option value="11:30 AM">11:30 AM</option>
                    <option value="01:30 PM">01:30 PM</option>
                    <option value="03:30 PM">03:30 PM</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Technician</label>
                  <select
                    value={newTechName}
                    onChange={(e) => setNewTechName(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#080D16] p-2.5 text-white"
                  >
                    <option value="Lead Field Technician">Lead Field Technician (Zone A)</option>
                    <option value="Tony Brooks">Tony Brooks (Zone A)</option>
                    <option value="Maria Alvarez">Maria Alvarez (Zone B)</option>
                    <option value="Danny Reyes">Danny Reyes (Zone C)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setScheduleModalOpen(false)}
                  className="px-3.5 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#F97316] text-[#020617] font-bold text-xs shadow-md shadow-orange-500/20"
                >
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
