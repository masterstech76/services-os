"use client";

import * as React from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  AlertTriangle,
  User,
  Wrench,
  MapPin,
  CalendarDays,
  Plus,
  CheckCircle2,
  Phone,
  MessageSquare,
  ShieldCheck,
  Zap,
  Filter,
  SlidersHorizontal,
  Bookmark,
  Share2,
  Columns3,
  Trash2,
  RotateCcw,
  UserCheck,
  X,
  ExternalLink,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";
import { businessConfig } from "@config/business.config";
import { formatMoney } from "@/components/shared/Money";
import { JobDrawer } from "@/components/admin/JobDrawer";
import type { EnrichedJob } from "@/lib/server/operations";

const START_HOUR = 8; // 8:00 AM
const END_HOUR = 18; // 6:00 PM
const TOTAL_HOURS = END_HOUR - START_HOUR; // 10 hours

const HOURS_HEADERS = [
  "8 AM",
  "9 AM",
  "10 AM",
  "11 AM",
  "12 PM",
  "1 PM",
  "2 PM",
  "3 PM",
  "4 PM",
  "5 PM",
  "6 PM",
];

export interface GridJob {
  id: string;
  jobNumber: number;
  serviceName: string;
  category: "cooling" | "heating" | "plumbing" | "duct" | "thermostat" | "water_heater" | "appliance" | "break" | "available";
  address: string;
  cityZip: string;
  customerName: string;
  customerPhone: string;
  techId: string;
  startHour: number; // e.g. 8.0, 9.5, 11.0
  durationHours: number; // e.g. 1.0, 1.5, 2.0
  durationLabel: string; // e.g. "2h", "1h 30m"
  status: "in_progress" | "scheduled" | "completed" | "pending" | "cancelled" | "break" | "available";
  priority: "High" | "Medium" | "Low";
  isConflict?: boolean;
  estimateCents: number;
  notes?: string;
  accessCode?: string;
}

export interface GridTech {
  id: string;
  name: string;
  avatarUrl?: string;
  avatarColor: string;
  zone: string;
  status: "Available" | "On Job" | "En Route" | "On Break" | "Unavailable";
  statusColor: string;
  scheduledHours: number;
  maxHours: number;
  jobsCount: number;
  maxJobs: number;
}

const TECH_ROSTER: GridTech[] = [
  {
    id: "tech-001",
    name: "Lead Field Technician",
    avatarColor: "bg-blue-500",
    zone: "Zone A",
    status: "Available",
    statusColor: "bg-emerald-400",
    scheduledHours: 5,
    maxHours: 8,
    jobsCount: 5,
    maxJobs: 8,
  },
  {
    id: "tech-maria",
    name: "Maria Alvarez",
    avatarColor: "bg-purple-500",
    zone: "Zone B",
    status: "On Job",
    statusColor: "bg-blue-400",
    scheduledHours: 6,
    maxHours: 8,
    jobsCount: 4,
    maxJobs: 8,
  },
  {
    id: "tech-danny",
    name: "Danny Reyes",
    avatarColor: "bg-teal-500",
    zone: "Zone C",
    status: "Available",
    statusColor: "bg-emerald-400",
    scheduledHours: 4,
    maxHours: 8,
    jobsCount: 3,
    maxJobs: 8,
  },
  {
    id: "tech-tony",
    name: "Tony Brooks",
    avatarColor: "bg-pink-500",
    zone: "Zone A",
    status: "En Route",
    statusColor: "bg-amber-400",
    scheduledHours: 0,
    maxHours: 8,
    jobsCount: 6,
    maxJobs: 8,
  },
  {
    id: "tech-robert",
    name: "Robert Johnson",
    avatarColor: "bg-indigo-500",
    zone: "Zone B",
    status: "On Break",
    statusColor: "bg-purple-400",
    scheduledHours: 2,
    maxHours: 8,
    jobsCount: 2,
    maxJobs: 8,
  },
  {
    id: "tech-lisa",
    name: "Lisa Carter",
    avatarColor: "bg-emerald-500",
    zone: "Zone C",
    status: "Available",
    statusColor: "bg-emerald-400",
    scheduledHours: 6,
    maxHours: 8,
    jobsCount: 5,
    maxJobs: 8,
  },
  {
    id: "tech-james",
    name: "James Wilson",
    avatarColor: "bg-slate-500",
    zone: "Zone A",
    status: "Unavailable",
    statusColor: "bg-rose-400",
    scheduledHours: 0,
    maxHours: 8,
    jobsCount: 0,
    maxJobs: 8,
  },
  {
    id: "tech-patricia",
    name: "Patricia Garcia",
    avatarColor: "bg-rose-500",
    zone: "Zone B",
    status: "On Job",
    statusColor: "bg-blue-400",
    scheduledHours: 5,
    maxHours: 8,
    jobsCount: 5,
    maxJobs: 8,
  },
];

// Jobs matching Image 1 & Image 2
const INITIAL_GRID_JOBS: GridJob[] = [
  // Lead Field Technician
  {
    id: "job-1038",
    jobNumber: 1038,
    serviceName: "AC Repair",
    category: "cooling",
    address: "800 NW 7th St",
    cityZip: "Miami, FL 33136",
    customerName: "Service Client A",
    customerPhone: "(XXX) XXX-XXXX",
    techId: "tech-001",
    startHour: 8.0,
    durationHours: 2.0,
    durationLabel: "2h",
    status: "scheduled",
    priority: "High",
    estimateCents: 18900,
    notes: "Customer requested Nest thermostat. Be on time (10:00 AM).",
    accessCode: "4587",
  },
  {
    id: "job-1041",
    jobNumber: 1041,
    serviceName: "Thermostat Install",
    category: "thermostat",
    address: "3100 NW 7th Ave",
    cityZip: "Miami, FL 33127",
    customerName: "Senior HVAC Specialist",
    customerPhone: "(XXX) XXX-XXXX",
    techId: "tech-001",
    startHour: 11.0,
    durationHours: 1.5,
    durationLabel: "1h 30m",
    status: "in_progress",
    priority: "Medium",
    estimateCents: 24900,
    notes: "Wiring diagram ready on site.",
  },
  {
    id: "job-1045",
    jobNumber: 1045,
    serviceName: "Duct Cleaning",
    category: "duct",
    address: "2000 NE 8th St",
    cityZip: "Miami, FL 33138",
    customerName: "Elena Rodriguez",
    customerPhone: "(XXX) XXX-XXXX",
    techId: "tech-001",
    startHour: 13.5,
    durationHours: 2.0,
    durationLabel: "2h",
    status: "scheduled",
    priority: "Medium",
    estimateCents: 12900,
  },
  {
    id: "job-1052",
    jobNumber: 1052,
    serviceName: "Water Heater",
    category: "water_heater",
    address: "1200 Biscayne Blvd",
    cityZip: "Miami, FL 33132",
    customerName: "Service Client B",
    customerPhone: "(XXX) XXX-XXXX",
    techId: "tech-001",
    startHour: 16.0,
    durationHours: 1.0,
    durationLabel: "1h",
    status: "pending",
    priority: "Low",
    estimateCents: 9900,
  },

  // Maria Alvarez
  {
    id: "job-1040",
    jobNumber: 1040,
    serviceName: "Plumbing Inspection",
    category: "plumbing",
    address: "2415 NE 163rd St",
    cityZip: "North Miami, FL 33160",
    customerName: "Sara Mitchell",
    customerPhone: "(XXX) XXX-XXXX",
    techId: "tech-maria",
    startHour: 9.0,
    durationHours: 2.0,
    durationLabel: "2h",
    status: "in_progress",
    priority: "High",
    estimateCents: 19900,
  },
  {
    id: "job-1048",
    jobNumber: 1048,
    serviceName: "Duct Cleaning",
    category: "duct",
    address: "305 Lincoln Rd",
    cityZip: "Miami Beach, FL 33139",
    customerName: "Michael Johnson",
    customerPhone: "(XXX) XXX-XXXX",
    techId: "tech-maria",
    startHour: 12.5,
    durationHours: 1.5,
    durationLabel: "1h 30m",
    status: "scheduled",
    priority: "Medium",
    estimateCents: 14900,
  },
  {
    id: "job-1055",
    jobNumber: 1055,
    serviceName: "AC Repair",
    category: "cooling",
    address: "1234 Collins Ave",
    cityZip: "Miami Beach, FL 33139",
    customerName: "Jessica Lee",
    customerPhone: "(XXX) XXX-XXXX",
    techId: "tech-maria",
    startHour: 15.5,
    durationHours: 2.0,
    durationLabel: "2h",
    status: "scheduled",
    priority: "High",
    estimateCents: 21900,
  },

  // Danny Reyes
  {
    id: "job-1043",
    jobNumber: 1043,
    serviceName: "AC Repair",
    category: "cooling",
    address: "1400 NE 2nd Ave",
    cityZip: "Miami, FL 33132",
    customerName: "Carlos Santana",
    customerPhone: "(XXX) XXX-XXXX",
    techId: "tech-danny",
    startHour: 9.5,
    durationHours: 2.0,
    durationLabel: "2h",
    status: "in_progress",
    priority: "High",
    isConflict: true,
    estimateCents: 27900,
    notes: "Compressor warning alert. Immediate refrigerant leak check.",
  },
  {
    id: "job-1050",
    jobNumber: 1050,
    serviceName: "Water Heater",
    category: "water_heater",
    address: "7800 Collins Ave",
    cityZip: "Miami Beach, FL 33141",
    customerName: "Amanda Clark",
    customerPhone: "(XXX) XXX-XXXX",
    techId: "tech-danny",
    startHour: 12.5,
    durationHours: 1.5,
    durationLabel: "1h 30m",
    status: "scheduled",
    priority: "Medium",
    estimateCents: 18900,
  },
  {
    id: "job-1057",
    jobNumber: 1057,
    serviceName: "Plumbing",
    category: "plumbing",
    address: "600 Brickell Ave",
    cityZip: "Miami, FL 33131",
    customerName: "Brian Miller",
    customerPhone: "(XXX) XXX-XXXX",
    techId: "tech-danny",
    startHour: 15.0,
    durationHours: 2.0,
    durationLabel: "2h",
    status: "scheduled",
    priority: "Low",
    estimateCents: 15900,
  },

  // Tony Brooks
  {
    id: "job-1044",
    jobNumber: 1044,
    serviceName: "Duct Cleaning",
    category: "duct",
    address: "1130 Washington Ave",
    cityZip: "Miami Beach, FL 33139",
    customerName: "Rachel Adams",
    customerPhone: "(XXX) XXX-XXXX",
    techId: "tech-tony",
    startHour: 9.0,
    durationHours: 1.5,
    durationLabel: "1h 30m",
    status: "in_progress",
    priority: "Medium",
    estimateCents: 13900,
  },
  {
    id: "job-1053",
    jobNumber: 1053,
    serviceName: "Thermostat",
    category: "thermostat",
    address: "2100 NE 1st Ct",
    cityZip: "Miami, FL 33137",
    customerName: "Kevin White",
    customerPhone: "(XXX) XXX-XXXX",
    techId: "tech-tony",
    startHour: 13.5,
    durationHours: 2.0,
    durationLabel: "2h",
    status: "scheduled",
    priority: "Low",
    estimateCents: 12900,
  },
  {
    id: "job-1058",
    jobNumber: 1058,
    serviceName: "AC Repair",
    category: "cooling",
    address: "3401 NE 5th Ave",
    cityZip: "Miami, FL 33137",
    customerName: "Diana Ross",
    customerPhone: "(XXX) XXX-XXXX",
    techId: "tech-tony",
    startHour: 16.0,
    durationHours: 2.0,
    durationLabel: "2h",
    status: "scheduled",
    priority: "High",
    estimateCents: 19900,
  },

  // Robert Johnson
  {
    id: "job-1046",
    jobNumber: 1046,
    serviceName: "On Break",
    category: "break",
    address: "Central Depot",
    cityZip: "Miami, FL",
    customerName: "Staff Break",
    customerPhone: "-",
    techId: "tech-robert",
    startHour: 12.0,
    durationHours: 2.0,
    durationLabel: "2h",
    status: "break",
    priority: "Low",
    estimateCents: 0,
  },
  {
    id: "job-1054",
    jobNumber: 1054,
    serviceName: "Plumbing",
    category: "plumbing",
    address: "420 Lincoln Rd",
    cityZip: "Miami Beach, FL 33139",
    customerName: "George King",
    customerPhone: "(XXX) XXX-XXXX",
    techId: "tech-robert",
    startHour: 15.0,
    durationHours: 1.5,
    durationLabel: "1h 30m",
    status: "scheduled",
    priority: "Medium",
    estimateCents: 14900,
  },

  // Lisa Carter
  {
    id: "job-1049",
    jobNumber: 1049,
    serviceName: "AC Repair",
    category: "cooling",
    address: "1500 Brickell Ave",
    cityZip: "Miami, FL 33129",
    customerName: "Sandra Bullock",
    customerPhone: "(XXX) XXX-XXXX",
    techId: "tech-lisa",
    startHour: 9.5,
    durationHours: 2.0,
    durationLabel: "2h",
    status: "scheduled",
    priority: "High",
    estimateCents: 21900,
  },
  {
    id: "job-1056",
    jobNumber: 1056,
    serviceName: "Thermostat",
    category: "thermostat",
    address: "901 Biscayne Blvd",
    cityZip: "Miami, FL 33132",
    customerName: "Edward Norton",
    customerPhone: "(XXX) XXX-XXXX",
    techId: "tech-lisa",
    startHour: 14.0,
    durationHours: 1.5,
    durationLabel: "1h 30m",
    status: "in_progress",
    priority: "Medium",
    estimateCents: 16900,
  },

  // James Wilson (On Leave)
  {
    id: "job-leave",
    jobNumber: 0,
    serviceName: "On Leave",
    category: "break",
    address: "Approved Time Off",
    cityZip: "-",
    customerName: "Roster Leave",
    customerPhone: "-",
    techId: "tech-james",
    startHour: 8.0,
    durationHours: 9.0,
    durationLabel: "8:00 AM - 5:00 PM",
    status: "break",
    priority: "Low",
    estimateCents: 0,
  },
];

export default function AdminDispatchDedicatedGridPage() {
  const [gridJobs, setGridJobs] = React.useState<GridJob[]>(INITIAL_GRID_JOBS);
  const [selectedJob, setSelectedJob] = React.useState<GridJob>(INITIAL_GRID_JOBS[0]);
  const [activeInspectorTab, setActiveInspectorTab] = React.useState<"details" | "technician" | "customer">("details");
  const [viewScale, setViewScale] = React.useState<"hourly" | "daily" | "weekly">("hourly");
  const [currentDateStr, setCurrentDateStr] = React.useState<string>("May 14, 2025");
  const [serviceFilter, setServiceFilter] = React.useState<string>("all");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [priorityFilter, setPriorityFilter] = React.useState<string>("all");
  const [areaFilter, setAreaFilter] = React.useState<string>("all");
  const [searchTech, setSearchTech] = React.useState<string>("");
  const [selectedJobIds, setSelectedJobIds] = React.useState<string[]>(["job-1038", "job-1041", "job-1045"]);
  const [inspectorOpen, setInspectorOpen] = React.useState<boolean>(true);
  const [reassignModalOpen, setReassignModalOpen] = React.useState<boolean>(false);
  const [selectedTargetTech, setSelectedTargetTech] = React.useState<string>("tech-maria");

  // Filtered Tech Roster
  const filteredTechs = TECH_ROSTER.filter((t) => {
    if (searchTech.trim()) {
      const q = searchTech.toLowerCase();
      return t.name.toLowerCase().includes(q) || t.zone.toLowerCase().includes(q);
    }
    if (areaFilter !== "all" && !t.zone.toLowerCase().includes(areaFilter.toLowerCase())) {
      return false;
    }
    return true;
  });

  // Calculate style for a job block in the timeline grid
  const getJobStyle = (job: GridJob) => {
    const leftPercent = ((job.startHour - START_HOUR) / TOTAL_HOURS) * 100;
    const widthPercent = (job.durationHours / TOTAL_HOURS) * 100;

    return {
      left: `${Math.max(0, leftPercent)}%`,
      width: `${Math.min(100 - leftPercent, widthPercent)}%`,
    };
  };

  const getJobColorClass = (job: GridJob) => {
    if (job.isConflict) {
      return "border-rose-500/70 bg-rose-950/80 text-rose-200 ring-1 ring-rose-500/50";
    }
    if (job.category === "break") {
      return "border-purple-500/40 bg-purple-950/60 text-purple-200";
    }
    if (job.category === "cooling") {
      return "border-emerald-500/50 bg-emerald-950/70 text-emerald-200 hover:border-emerald-400";
    }
    if (job.category === "duct") {
      return "border-amber-500/50 bg-amber-950/70 text-amber-200 hover:border-amber-400";
    }
    if (job.category === "plumbing") {
      return "border-blue-500/50 bg-blue-950/70 text-blue-200 hover:border-blue-400";
    }
    if (job.category === "water_heater") {
      return "border-sky-500/50 bg-sky-950/70 text-sky-200 hover:border-sky-400";
    }
    if (job.category === "thermostat") {
      return "border-blue-600/50 bg-blue-900/60 text-blue-200 hover:border-blue-400";
    }
    if (job.category === "appliance") {
      return "border-rose-500/50 bg-rose-950/70 text-rose-200 hover:border-rose-400";
    }
    return "border-slate-600/40 bg-slate-900/80 text-slate-300";
  };

  const handleReassignJob = () => {
    setGridJobs((prev) =>
      prev.map((j) => (j.id === selectedJob.id ? { ...j, techId: selectedTargetTech } : j))
    );
    const targetTech = TECH_ROSTER.find((t) => t.id === selectedTargetTech);
    toast.success(`Job #${selectedJob.jobNumber} reassigned to ${targetTech?.name || "Technician"}`);
    setReassignModalOpen(false);
  };

  const handleAutoAssign = () => {
    toast.success("AI Dispatcher: Rebalanced 3 jobs based on drive distance and zone availability!");
  };

  return (
    <div className="space-y-4 pb-16">
      {/* ─────────────────────────────────────────────────────────────
          1. HEADER & GLOBAL CONTROLS
      ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
            <span>Dispatch – Dedicated Grid</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Schedule and reassign jobs using a technician-based time grid.
          </p>
        </div>

        {/* Date Navigator, View Switchers & Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Date Picker Bar */}
          <div className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-[#0F172A] px-2.5 py-1.5 text-xs text-white">
            <button
              type="button"
              onClick={() => setCurrentDateStr("May 13, 2025")}
              className="p-1 hover:text-orange-400 transition-colors"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            <span className="font-semibold px-2">{currentDateStr}</span>
            <button
              type="button"
              onClick={() => setCurrentDateStr("May 15, 2025")}
              className="p-1 hover:text-orange-400 transition-colors"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => setCurrentDateStr("May 14, 2025")}
            className="rounded-xl border border-white/10 bg-[#0F172A] hover:bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:text-white transition-all cursor-pointer"
          >
            Today
          </button>

          {/* Day / Week / Month Pill Switcher */}
          <div className="inline-flex rounded-xl border border-white/10 bg-[#0F172A] p-0.5 text-xs font-semibold">
            <button
              type="button"
              className="px-3 py-1 rounded-lg bg-emerald-600 text-white shadow-sm"
            >
              Day
            </button>
            <button
              type="button"
              className="px-3 py-1 rounded-lg text-slate-400 hover:text-white flex items-center gap-1"
            >
              <span>Week</span>
              <ChevronDown className="h-3 w-3" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => toast.info("Filter sidebar opened")}
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-[#0F172A] hover:bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:text-white transition-all cursor-pointer"
          >
            <Filter className="h-3.5 w-3.5 text-slate-400" />
            <span>Filter</span>
          </button>

          <Link
            href="/admin/jobs/create"
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3.5 py-1.5 text-xs shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5 stroke-[3]" />
            <span>New Job</span>
          </Link>

          <button
            type="button"
            onClick={handleAutoAssign}
            className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-semibold px-3 py-1.5 text-xs transition-all cursor-pointer"
          >
            <Zap className="h-3.5 w-3.5 text-emerald-400 fill-emerald-400" />
            <span>Auto Assign</span>
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. SUMMARY 6-METRIC CARDS (Matching Image 1 Exactly)
      ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Total Jobs */}
        <div className="rounded-2xl border border-white/10 bg-[#0F172A]/90 p-4 shadow-xl backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">Total Jobs</span>
            <div className="h-7 w-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Calendar className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="text-2xl font-black text-white font-mono">32</div>
            <div className="text-[11px] font-semibold text-emerald-400 mt-0.5">
              ↑ 12% vs. yesterday
            </div>
          </div>
        </div>

        {/* Completed */}
        <div className="rounded-2xl border border-white/10 bg-[#0F172A]/90 p-4 shadow-xl backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">Completed</span>
            <div className="h-7 w-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="text-2xl font-black text-white font-mono">14</div>
            <div className="text-[11px] font-semibold text-emerald-400 mt-0.5">
              ↑ 18% today
            </div>
          </div>
        </div>

        {/* In Progress */}
        <div className="rounded-2xl border border-white/10 bg-[#0F172A]/90 p-4 shadow-xl backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">In Progress</span>
            <div className="h-7 w-7 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="text-2xl font-black text-white font-mono">8</div>
            <div className="text-[11px] font-semibold text-sky-400 mt-0.5">
              ↑ 6% today
            </div>
          </div>
        </div>

        {/* Scheduled */}
        <div className="rounded-2xl border border-white/10 bg-[#0F172A]/90 p-4 shadow-xl backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">Scheduled</span>
            <div className="h-7 w-7 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <CalendarDays className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="text-2xl font-black text-white font-mono">6</div>
            <div className="text-[11px] font-medium text-slate-400 mt-0.5">
              ↑ 0% today
            </div>
          </div>
        </div>

        {/* Pending */}
        <div className="rounded-2xl border border-white/10 bg-[#0F172A]/90 p-4 shadow-xl backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">Pending</span>
            <div className="h-7 w-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="text-2xl font-black text-white font-mono">3</div>
            <div className="text-[11px] font-semibold text-amber-400 mt-0.5">
              ↓ 25% today
            </div>
          </div>
        </div>

        {/* Cancelled */}
        <div className="rounded-2xl border border-white/10 bg-[#0F172A]/90 p-4 shadow-xl backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">Cancelled</span>
            <div className="h-7 w-7 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <X className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="text-2xl font-black text-white font-mono">1</div>
            <div className="text-[11px] font-semibold text-rose-400 mt-0.5">
              ↓ 50% today
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. FILTER CONTROLS TOOLBAR & VIEW SCALE SWITCHER
      ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 flex-wrap flex-1">
          {/* Search technician */}
          <div className="relative w-48 sm:w-56">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchTech}
              onChange={(e) => setSearchTech(e.target.value)}
              placeholder="Search technician..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-white/10 bg-[#0B1322] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/60 transition-colors"
            />
          </div>

          {/* Service Dropdown */}
          <select
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
            className="rounded-xl border border-white/10 bg-[#0B1322] px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500/60"
          >
            <option value="all">All Services</option>
            <option value="cooling">AC Repair</option>
            <option value="thermostat">Thermostat</option>
            <option value="duct">Duct Cleaning</option>
            <option value="plumbing">Plumbing</option>
            <option value="water_heater">Water Heater</option>
          </select>

          {/* Status Dropdown */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-white/10 bg-[#0B1322] px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500/60"
          >
            <option value="all">All Status</option>
            <option value="scheduled">Scheduled</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
          </select>

          {/* Priority Dropdown */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="rounded-xl border border-white/10 bg-[#0B1322] px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500/60"
          >
            <option value="all">All Priority</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <button
            type="button"
            onClick={() => {
              setSearchTech("");
              setServiceFilter("all");
              setStatusFilter("all");
              setPriorityFilter("all");
              setAreaFilter("all");
            }}
            className="text-xs font-semibold text-rose-400 hover:text-rose-300 ml-1 transition-colors"
          >
            Clear
          </button>
        </div>

        {/* View scale buttons */}
        <div className="inline-flex rounded-xl border border-white/10 bg-[#0F172A] p-0.5 text-xs font-semibold self-end lg:self-auto">
          <button
            type="button"
            onClick={() => setViewScale("hourly")}
            className={`px-3 py-1 rounded-lg transition-all ${
              viewScale === "hourly"
                ? "bg-emerald-600 text-white shadow-sm font-bold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Hourly
          </button>
          <button
            type="button"
            onClick={() => setViewScale("daily")}
            className={`px-3 py-1 rounded-lg transition-all ${
              viewScale === "daily"
                ? "bg-emerald-600 text-white shadow-sm font-bold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Daily
          </button>
          <button
            type="button"
            onClick={() => setViewScale("weekly")}
            className={`px-3 py-1 rounded-lg transition-all ${
              viewScale === "weekly"
                ? "bg-emerald-600 text-white shadow-sm font-bold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Weekly
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          4. MAIN DISPATCH GRID & RIGHT INSPECTOR
      ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 items-start">
        {/* LEFT (3 Cols on XL): Timeline Grid */}
        <div className="xl:col-span-3 rounded-2xl border border-white/10 bg-[#0F172A]/90 backdrop-blur-xl shadow-2xl overflow-hidden flex flex-col justify-between">
          <div className="overflow-x-auto [scrollbar-width:thin]">
            <div className="min-w-[950px]">
              {/* Header: Date Subtitle Bar */}
              <div className="bg-[#0B1322] border-b border-white/10 px-4 py-2 text-center text-xs font-bold text-slate-300">
                May 14, 2025 (Wed)
              </div>

              {/* Time Column Headers: 8 AM - 6 PM */}
              <div className="grid grid-cols-12 border-b border-white/10 bg-[#0B1322]/80 text-[11px] font-bold text-slate-400">
                <div className="col-span-3 px-4 py-2.5 border-r border-white/10 text-left">
                  Technician ({filteredTechs.length})
                </div>
                {HOURS_HEADERS.slice(0, 9).map((hour, idx) => (
                  <div
                    key={hour}
                    className="col-span-1 px-1 py-2.5 text-center border-r border-white/5 last:border-r-0"
                  >
                    {hour}
                  </div>
                ))}
              </div>

              {/* Technician Rows */}
              <div className="divide-y divide-white/5">
                {filteredTechs.map((tech) => {
                  const techJobs = gridJobs.filter((j) => j.techId === tech.id);

                  return (
                    <div
                      key={tech.id}
                      className="grid grid-cols-12 min-h-[72px] hover:bg-white/[0.02] transition-colors group relative"
                    >
                      {/* Left: Tech Info (Col Span 3) */}
                      <div className="col-span-3 p-3 border-r border-white/10 flex items-center justify-between">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div
                            className={`h-8 w-8 rounded-full ${tech.avatarColor} flex items-center justify-center font-bold text-white text-xs shrink-0 shadow-sm`}
                          >
                            {tech.name.split(" ").map((n) => n[0]).join("")}
                          </div>
                          <div className="min-w-0">
                            <span className="font-bold text-xs text-white block truncate">
                              {tech.name}
                            </span>
                            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-0.5">
                              <span
                                className={`h-1.5 w-1.5 rounded-full ${tech.statusColor}`}
                              />
                              <span>{tech.status}</span>
                              <span>·</span>
                              <span className="text-slate-500 truncate">{tech.zone} · {tech.jobsCount}/8 jobs</span>
                            </div>
                          </div>
                        </div>

                        <ChevronRight className="h-4 w-4 text-slate-600 group-hover:text-slate-300 transition-colors shrink-0" />
                      </div>

                      {/* Right: Timeline Swimlane (Col Span 9) */}
                      <div className="col-span-9 relative p-1.5 h-full">
                        {/* Background Hour Grid Lines */}
                        <div className="absolute inset-0 grid grid-cols-9 pointer-events-none">
                          {Array.from({ length: 9 }).map((_, i) => (
                            <div
                              key={i}
                              className="border-r border-white/[0.03] last:border-r-0 h-full"
                            />
                          ))}
                        </div>

                        {/* Positioned Job Cards */}
                        <div className="relative h-full w-full min-h-[56px]">
                          {techJobs.map((job) => {
                            const isSelected = selectedJob.id === job.id;
                            const jobStyle = getJobStyle(job);
                            const colorClass = getJobColorClass(job);

                            return (
                              <button
                                key={job.id}
                                type="button"
                                onClick={() => setSelectedJob(job)}
                                style={jobStyle}
                                className={`absolute top-1 bottom-1 rounded-xl border p-2 text-left shadow-lg transition-all flex flex-col justify-between overflow-hidden cursor-pointer ${colorClass} ${
                                  isSelected ? "ring-2 ring-emerald-400 scale-[1.01] z-20" : "z-10"
                                }`}
                              >
                                <div className="flex items-center justify-between w-full gap-1">
                                  <span className="font-mono text-[10px] font-black truncate">
                                    {job.jobNumber > 0 ? `#${job.jobNumber} ` : ""}
                                    {job.serviceName}
                                  </span>
                                  {job.isConflict && (
                                    <AlertTriangle className="h-3 w-3 text-rose-400 shrink-0" />
                                  )}
                                </div>
                                <div className="text-[9px] text-slate-300 truncate mt-0.5">
                                  {job.address}
                                </div>
                                <span className="font-mono text-[9px] text-slate-400 font-bold block">
                                  {job.durationLabel}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Bottom Action Bar */}
          <div className="p-3 bg-[#0B1322] border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-slate-300">
                {selectedJobIds.length} jobs selected
              </span>

              <button
                type="button"
                onClick={() => setReassignModalOpen(true)}
                className="px-2.5 py-1 rounded-lg border border-white/10 bg-[#0F172A] hover:bg-white/10 text-slate-200 transition-colors"
              >
                Assign Technician
              </button>

              <button
                type="button"
                onClick={() => toast.success("Batch status updated")}
                className="px-2.5 py-1 rounded-lg border border-white/10 bg-[#0F172A] hover:bg-white/10 text-slate-200 transition-colors"
              >
                Change Status
              </button>

              <button
                type="button"
                onClick={() => toast.success("Rescheduled selected appointments")}
                className="px-2.5 py-1 rounded-lg border border-white/10 bg-[#0F172A] hover:bg-white/10 text-slate-200 transition-colors"
              >
                Reschedule
              </button>

              <button
                type="button"
                onClick={() => {
                  toast.success("Deleted selected jobs");
                  setSelectedJobIds([]);
                }}
                className="px-2.5 py-1 rounded-lg border border-rose-500/30 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-colors font-semibold"
              >
                Delete
              </button>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center gap-1 self-end sm:self-auto">
              <button
                type="button"
                className="h-7 w-7 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center text-slate-400 hover:text-white"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                className="h-7 w-7 rounded-lg bg-emerald-600 font-bold text-white flex items-center justify-center text-xs"
              >
                1
              </button>
              <button
                type="button"
                className="h-7 w-7 rounded-lg text-slate-400 hover:text-white flex items-center justify-center text-xs"
              >
                2
              </button>
              <button
                type="button"
                className="h-7 w-7 rounded-lg text-slate-400 hover:text-white flex items-center justify-center text-xs"
              >
                3
              </button>
              <button
                type="button"
                className="h-7 w-7 rounded-lg text-slate-400 hover:text-white flex items-center justify-center text-xs"
              >
                4
              </button>
              <button
                type="button"
                className="h-7 w-7 rounded-lg text-slate-400 hover:text-white flex items-center justify-center text-xs"
              >
                5
              </button>
              <button
                type="button"
                className="h-7 w-7 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center text-slate-400 hover:text-white"
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT (1 Col on XL): Sticky Job Details Inspector Card (Matching Image 1 Exactly) */}
        <div className="xl:col-span-1 rounded-2xl border border-white/10 bg-[#0F172A]/95 backdrop-blur-xl shadow-2xl p-5 space-y-4 sticky top-4">
          {/* Top Tabs: Job Details, Technician, Customer */}
          <div className="flex items-center border-b border-white/10 pb-2 text-xs font-bold gap-4">
            <button
              type="button"
              onClick={() => setActiveInspectorTab("details")}
              className={`pb-1 transition-colors ${
                activeInspectorTab === "details"
                  ? "text-emerald-400 border-b-2 border-emerald-400"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Job Details
            </button>
            <button
              type="button"
              onClick={() => setActiveInspectorTab("technician")}
              className={`pb-1 transition-colors ${
                activeInspectorTab === "technician"
                  ? "text-emerald-400 border-b-2 border-emerald-400"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Technician
            </button>
            <button
              type="button"
              onClick={() => setActiveInspectorTab("customer")}
              className={`pb-1 transition-colors ${
                activeInspectorTab === "customer"
                  ? "text-emerald-400 border-b-2 border-emerald-400"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Customer
            </button>
          </div>

          {/* Job Number & Status Badge */}
          <div className="flex items-center justify-between">
            <h2 className="font-mono text-xl font-black text-emerald-400">
              #{selectedJob.jobNumber || "1038"}
            </h2>
            <span className="rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider">
              {selectedJob.status.replace("_", " ")}
            </span>
          </div>

          {/* Service Name & Time */}
          <div className="space-y-1.5 text-xs">
            <div className="flex items-center gap-2 font-bold text-white text-sm">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>{selectedJob.serviceName}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <Clock className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              <span>Today, 9:00 AM - 11:00 AM ({selectedJob.durationLabel})</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{selectedJob.address}, {selectedJob.cityZip}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <User className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              <span>{selectedJob.customerName}</span>
            </div>
            <div className="text-[11px] text-slate-400 pl-5.5">
              {selectedJob.customerPhone}
            </div>
          </div>

          {/* Service Details & Priority / Estimated Cost */}
          <div className="pt-2 border-t border-white/10 space-y-2 text-xs">
            <span className="text-[11px] font-bold text-slate-400 block">Service Details</span>
            <p className="text-white font-medium">
              {selectedJob.serviceName} - Unit diagnostic and repair
            </p>
            <div className="flex items-center justify-between pt-1">
              <div>
                <span className="text-[10px] text-slate-400 block">Priority</span>
                <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30 mt-0.5">
                  {selectedJob.priority}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block">Estimated Cost</span>
                <span className="font-mono text-sm font-black text-white">
                  {formatMoney(selectedJob.estimateCents)}
                </span>
              </div>
            </div>
          </div>

          {/* Assigned Technician Card */}
          <div className="pt-2 border-t border-white/10 space-y-2">
            <span className="text-[11px] font-bold text-slate-400 block">Assigned Technician</span>
            <div className="rounded-xl border border-white/10 bg-[#0B1322] p-3 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center font-bold text-white text-xs">
                  CM
                </div>
                <div>
                  <span className="font-bold text-xs text-white block">Lead Field Technician</span>
                  <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 mt-0.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    <span>Available</span>
                  </div>
                </div>
              </div>
              <Link
                href="/admin/technicians"
                className="text-[10px] font-semibold text-slate-400 hover:text-white"
              >
                View Profile
              </Link>
            </div>

            {/* Message & Call buttons */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => toast.success("Dispatched in-app message to technician")}
                className="flex items-center justify-center gap-1.5 py-2 rounded-xl border border-white/10 bg-[#0B1322] hover:bg-white/10 text-xs font-semibold text-white transition-colors"
              >
                <MessageSquare className="h-3.5 w-3.5 text-slate-300" />
                <span>Message</span>
              </button>
              <a
                href="tel:3055550142"
                className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white transition-colors"
              >
                <Phone className="h-3.5 w-3.5" />
                <span>Call</span>
              </a>
            </div>
          </div>

          {/* Customer Notes */}
          <div className="pt-2 border-t border-white/10 space-y-1.5 text-xs">
            <span className="text-[11px] font-bold text-slate-400 block">Customer Notes</span>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              • Customer requested Nest thermostat.
              <br />
              • Be on time (10:00 AM).
              {selectedJob.accessCode && (
                <>
                  <br />
                  • Access code: {selectedJob.accessCode}
                </>
              )}
            </p>
          </div>

          {/* Quick Actions at bottom */}
          <div className="pt-2 border-t border-white/10 space-y-2">
            <span className="text-[11px] font-bold text-slate-400 block">Quick Actions</span>
            <div className="grid grid-cols-2 gap-2">
              <Link
                href={`/admin/jobs/${selectedJob.id}`}
                className="py-2 text-center rounded-xl border border-white/10 bg-[#0B1322] hover:bg-white/10 text-xs font-semibold text-white transition-colors"
              >
                View Full Details
              </Link>
              <button
                type="button"
                onClick={() => setReassignModalOpen(true)}
                className="py-2 text-center rounded-xl border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 text-xs font-bold text-emerald-400 transition-colors"
              >
                Reassign
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Reassign Modal */}
      {reassignModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        >
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0F172A] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h3 className="text-base font-bold text-white">
                Reassign Job #{selectedJob.jobNumber}
              </h3>
              <button
                type="button"
                onClick={() => setReassignModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="text-xs text-slate-400">
              Select a qualified technician to take over this work order ({selectedJob.durationLabel}).
            </p>
            <select
              value={selectedTargetTech}
              onChange={(e) => setSelectedTargetTech(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[#080D16] p-2.5 text-xs text-white"
            >
              <option value="tech-001">Lead Field Technician (Zone A · Available)</option>
              <option value="tech-maria">Maria Alvarez (Zone B · Available)</option>
              <option value="tech-danny">Danny Reyes (Zone C · Available)</option>
              <option value="tech-tony">Tony Brooks (Zone A · En Route)</option>
              <option value="tech-lisa">Lisa Carter (Zone C · Working)</option>
            </select>
            <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => setReassignModalOpen(false)}
                className="px-3.5 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleReassignJob}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
              >
                Confirm Reassignment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
