/* eslint-disable @next/next/no-img-element */
"use client";

import * as React from "react";
import Link from "next/link";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  User,
  Phone,
  CheckCircle2,
  AlertTriangle,
  Zap,
  SlidersHorizontal,
  Truck,
  Wrench,
  Plus,
  Minus,
  ArrowRight,
  ChevronsRight,
  ChevronsLeft,
  MessageSquare,
  PhoneCall,
  Pause,
  Timer,
} from "lucide-react";
import { toast } from "sonner";
import { GoogleMapEmbed } from "@/components/maps/GoogleMapEmbed";
import { JobDrawer } from "@/components/admin/JobDrawer";
import type { EnrichedJob } from "@/lib/server/operations";

interface UnassignedJob {
  id: string;
  jobNumber: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
  title: string;
  address: string;
  timeWindow: string;
  estimate: string;
  serviceCategory: string;
  customerName: string;
  customerPhone: string;
  notes: string[];
}

interface ActiveDispatchItem {
  id: string;
  jobNumber: string;
  techName: string;
  techAvatar: string;
  techStatus: "On Job" | "En Route" | "On Site" | "Available";
  techStatusColor: string;
  jobTitle: string;
  address: string;
  eta: string;
  scheduledTime: string;
  estimate: string;
  customerName: string;
  customerPhone: string;
  priority: "High" | "Medium" | "Low";
  serviceDetail: string;
  notes: string[];
}

interface MapMarker {
  id: string;
  type: "technician" | "on_job" | "en_route" | "job_location";
  label: string;
  sublabel: string;
  x: number; // percentage
  y: number; // percentage
  iconType: "truck" | "wrench" | "pin" | "dot";
  color: string;
  haloColor: string;
}

export default function AdminDispatchBoardPage() {
  const [currentDate, setCurrentDate] = React.useState("May 14, 2025");
  const [isAutoAssigning, setIsAutoAssigning] = React.useState(false);
  const [detailsPanelOpen, setDetailsPanelOpen] = React.useState(true);
  const [mapZoom, setMapZoom] = React.useState(1);
  const [filterActive, setFilterActive] = React.useState(false);
  const [drawerJob, setDrawerJob] = React.useState<EnrichedJob | null>(null);

  // Selected job for the right-hand inspection drawer (matches #1038 in the reference image)
  const [selectedJob, setSelectedJob] = React.useState({
    id: "job-1038",
    jobNumber: "#1038",
    statusBadge: "Scheduled",
    title: "Thermostat Install",
    timeWindow: "Today, 10:00 AM - 11:30 AM (1h 30m)",
    address: "3100 NW 7th St, Miami, FL 33125",
    customerName: "Service Client A",
    customerPhone: "(XXX) XXX-XXXX",
    service: "Thermostat Installation - Smart Thermostat",
    priority: "Medium",
    assignedTech: {
      name: "Lead Field Technician",
      avatar: "/images/avatar-david.jpg",
      status: "On Job",
    },
    estimate: "$249.00",
    notes: [
      "Customer requested Nest thermostat.",
      "Be on time (10:00 AM).",
    ],
  });

  // Top 6 KPI Metric Cards matching reference image
  const kpis = [
    {
      id: "pending",
      title: "Pending Dispatch",
      value: "12",
      subtext: "Needs Assignment",
      subtextColor: "text-rose-400",
      icon: Clock,
      iconColor: "text-amber-400",
      iconBg: "bg-amber-500/15 border-amber-500/30",
    },
    {
      id: "inprogress",
      title: "In Progress",
      value: "8",
      subtext: "On Going",
      subtextColor: "text-blue-400",
      icon: User,
      iconColor: "text-blue-400",
      iconBg: "bg-blue-500/15 border-blue-500/30",
    },
    {
      id: "completed",
      title: "Completed Today",
      value: "14",
      subtext: "+3 vs. yesterday",
      subtextColor: "text-emerald-400",
      icon: CheckCircle2,
      iconColor: "text-emerald-400",
      iconBg: "bg-emerald-500/15 border-emerald-500/30",
    },
    {
      id: "onhold",
      title: "On Hold",
      value: "3",
      subtext: "Waiting for Parts",
      subtextColor: "text-purple-400",
      icon: Pause,
      iconColor: "text-purple-400",
      iconBg: "bg-purple-500/15 border-purple-500/30",
    },
    {
      id: "overdue",
      title: "Overdue",
      value: "2",
      subtext: "Needs Attention",
      subtextColor: "text-rose-400",
      icon: AlertTriangle,
      iconColor: "text-rose-400",
      iconBg: "bg-rose-500/15 border-rose-500/30",
    },
    {
      id: "avgtime",
      title: "Avg. Response Time",
      value: "32 min",
      subtext: "Target < 60 min",
      subtextColor: "text-amber-400",
      icon: Timer,
      iconColor: "text-amber-400",
      iconBg: "bg-amber-500/15 border-amber-500/30",
    },
  ];

  // Unassigned jobs list matching reference image
  const unassignedJobs: UnassignedJob[] = [
    {
      id: "job-1047",
      jobNumber: "WO-8427",
      priority: "HIGH",
      title: "AC Repair",
      address: "1220 SW 8th St, Miami, FL 33130",
      timeWindow: "Today, 9:00 AM - 11:00 AM",
      estimate: "$189.00",
      serviceCategory: "HVAC Emergency Cooling",
      customerName: "IAQ & Systems Specialist",
      customerPhone: "(XXX) XXX-XXXX",
      notes: ["Compressor humming, no cold air.", "Gate code #4412."],
    },
    {
      id: "job-1048",
      jobNumber: "WO-8428",
      priority: "MEDIUM",
      title: "Thermostat Install",
      address: "2100 Biscayne Blvd, Miami, FL 33137",
      timeWindow: "Today, 11:30 AM - 1:30 PM",
      estimate: "$249.00",
      serviceCategory: "Controls & Smart Home",
      customerName: "Senior HVAC Specialist",
      customerPhone: "(XXX) XXX-XXXX",
      notes: ["Ecobee SmartThermostat with Sensor.", "Customer will be home at 11:15 AM."],
    },
    {
      id: "job-1049",
      jobNumber: "WO-8429",
      priority: "MEDIUM",
      title: "Duct Cleaning",
      address: "305 Lincoln Rd, Miami Beach, FL 33139",
      timeWindow: "Today, 1:00 PM - 3:00 PM",
      estimate: "$129.00",
      serviceCategory: "Air Quality & Ventilation",
      customerName: "Service Client S",
      customerPhone: "(XXX) XXX-XXXX",
      notes: ["Bi-annual allergen sanitization.", "Street parking voucher provided."],
    },
    {
      id: "job-1050",
      jobNumber: "#1050",
      priority: "LOW",
      title: "Water Heater Service",
      address: "7800 Collins Ave, Miami Beach, FL 33141",
      timeWindow: "Today, 2:30 PM - 5:00 PM",
      estimate: "$199.00",
      serviceCategory: "Plumbing & Hot Water",
      customerName: "Service Client C",
      customerPhone: "(XXX) XXX-XXXX",
      notes: ["Pilot light intermittent.", "Water heater located in garage utility closet."],
    },
  ];

  // Active Dispatch list matching reference image
  const activeDispatches: ActiveDispatchItem[] = [
    {
      id: "dispatch-1038",
      jobNumber: "#1038",
      techName: "Lead Field Technician",
      techAvatar: "/images/avatar-david.jpg",
      techStatus: "On Job",
      techStatusColor: "bg-emerald-400",
      jobTitle: "AC Repair",
      address: "800 NW 7th St, Miami, FL 33136",
      eta: "ETA 12 min",
      scheduledTime: "10:30 AM",
      estimate: "$249.00",
      customerName: "Service Client A",
      customerPhone: "(XXX) XXX-XXXX",
      priority: "Medium",
      serviceDetail: "Thermostat Installation - Smart Thermostat",
      notes: ["Customer requested Nest thermostat.", "Be on time (10:00 AM)."],
    },
    {
      id: "dispatch-1041",
      jobNumber: "WO-8421",
      techName: "Senior Field Tech",
      techAvatar: "/images/avatar-sarah.jpg",
      techStatus: "En Route",
      techStatusColor: "bg-blue-400",
      jobTitle: "Thermostat Install",
      address: "3100 NW 7th Ave, Miami, FL 33127",
      eta: "ETA 18 min",
      scheduledTime: "11:00 AM",
      estimate: "$249.00",
      customerName: "Service Client",
      customerPhone: "(XXX) XXX-XXXX",
      priority: "Medium",
      serviceDetail: "Smart Thermostat Integration & Wiring",
      notes: ["Old Honeywell unit replacement.", "Check C-wire voltage."],
    },
    {
      id: "dispatch-1043",
      jobNumber: "WO-8423",
      techName: "Diagnostic Specialist",
      techAvatar: "/images/avatar-mike.jpg",
      techStatus: "On Site",
      techStatusColor: "bg-amber-400",
      jobTitle: "Duct Cleaning",
      address: "1400 NE 2nd Ave, Miami, FL 33132",
      eta: "ETA 34 min",
      scheduledTime: "12:30 PM",
      estimate: "$179.00",
      customerName: "Service Client Q",
      customerPhone: "(XXX) XXX-XXXX",
      priority: "High",
      serviceDetail: "Full Ductwork Sanitization & HEPA filtration",
      notes: ["Commercial suite on 4th floor.", "Loading bay access code #9021."],
    },
    {
      id: "dispatch-1044",
      jobNumber: "WO-8424",
      techName: "HVAC Systems Lead",
      techAvatar: "/images/avatar-1.jpg",
      techStatus: "En Route",
      techStatusColor: "bg-blue-400",
      jobTitle: "AC Repair",
      address: "7200 SW 57th Ave, Miami, FL 33143",
      eta: "ETA 42 min",
      scheduledTime: "1:30 PM",
      estimate: "$210.00",
      customerName: "Service Client T",
      customerPhone: "(XXX) XXX-XXXX",
      priority: "High",
      serviceDetail: "Condenser Fan Motor Replacement",
      notes: ["Requires 1/3 HP motor from truck inventory."],
    },
    {
      id: "dispatch-1045",
      jobNumber: "WO-8425",
      techName: "Field Service Tech",
      techAvatar: "/images/avatar-2.jpg",
      techStatus: "En Route",
      techStatusColor: "bg-blue-400",
      jobTitle: "Water Heater Service",
      address: "8901 Collins Ave, Miami Beach, FL 33154",
      eta: "ETA 55 min",
      scheduledTime: "2:00 PM",
      estimate: "$199.00",
      customerName: "Service Client R",
      customerPhone: "(XXX) XXX-XXXX",
      priority: "Low",
      serviceDetail: "50-Gallon Gas Water Heater Diagnostic",
      notes: ["Customer requested afternoon arrival window."],
    },
  ];

  // Map markers for live GPS map visualization (matching exact positions in reference image)
  const mapMarkers: MapMarker[] = [
    {
      id: "m-job-1",
      type: "job_location",
      label: "WO-8427 AC Repair",
      sublabel: "Needs Tech",
      x: 27,
      y: 65,
      iconType: "pin",
      color: "#EF4444", // Red
      haloColor: "rgba(239, 68, 68, 0.25)",
    },
    {
      id: "m-tech-1",
      type: "technician",
      label: "Carlos (Unit Alpha)",
      sublabel: "Available",
      x: 42,
      y: 55,
      iconType: "truck",
      color: "#14B8A6", // Teal/Green
      haloColor: "rgba(20, 184, 166, 0.25)",
    },
    {
      id: "m-tech-2",
      type: "technician",
      label: "Danny (Unit Beta)",
      sublabel: "Wynwood Online",
      x: 52,
      y: 48,
      iconType: "truck",
      color: "#10B981", // Green
      haloColor: "rgba(16, 185, 129, 0.25)",
    },
    {
      id: "m-enroute-1",
      type: "en_route",
      label: "Maria (Unit Gamma)",
      sublabel: "En Route to WO-8421",
      x: 48,
      y: 62,
      iconType: "truck",
      color: "#F59E0B", // Amber
      haloColor: "rgba(245, 158, 11, 0.25)",
    },
    {
      id: "m-onjob-1",
      type: "on_job",
      label: "WO-8438 (Carlos)",
      sublabel: "Downtown Miami",
      x: 58,
      y: 65,
      iconType: "wrench",
      color: "#3B82F6", // Blue
      haloColor: "rgba(59, 130, 246, 0.25)",
    },
    {
      id: "m-enroute-2",
      type: "en_route",
      label: "Robert (Unit Delta)",
      sublabel: "MacArthur Causeway",
      x: 68,
      y: 63,
      iconType: "truck",
      color: "#F59E0B",
      haloColor: "rgba(245, 158, 11, 0.25)",
    },
    {
      id: "m-onjob-2",
      type: "on_job",
      label: "WO-8425 Beachside",
      sublabel: "Collins Ave",
      x: 77,
      y: 58,
      iconType: "pin",
      color: "#3B82F6",
      haloColor: "rgba(59, 130, 246, 0.25)",
    },
    {
      id: "m-tech-3",
      type: "technician",
      label: "Tony (Unit Epsilon)",
      sublabel: "North Beach",
      x: 70,
      y: 35,
      iconType: "dot",
      color: "#10B981",
      haloColor: "rgba(16, 185, 129, 0.25)",
    },
  ];

  // Handle auto-assign action
  const handleAutoAssign = () => {
    setIsAutoAssigning(true);
    toast.info("Running AI Dispatch Optimization...", {
      description: "Evaluating technician geo-proximity, skills, and traffic conditions.",
    });

    setTimeout(() => {
      setIsAutoAssigning(false);
      toast.success("Auto-Dispatch Complete!", {
        description: "4 unassigned jobs matched to nearest available technicians.",
      });
    }, 1200);
  };

  // Select an unassigned job into inspector
  const handleSelectUnassigned = (job: UnassignedJob) => {
    setSelectedJob({
      id: job.id,
      jobNumber: job.jobNumber,
      statusBadge: "Unassigned",
      title: job.title,
      timeWindow: job.timeWindow,
      address: job.address,
      customerName: job.customerName,
      customerPhone: job.customerPhone,
      service: job.serviceCategory,
      priority: job.priority === "HIGH" ? "High" : job.priority === "MEDIUM" ? "Medium" : "Low",
      assignedTech: {
        name: "Unassigned",
        avatar: "/images/avatar-david.jpg",
        status: "Pending Dispatch",
      },
      estimate: job.estimate,
      notes: job.notes,
    });
    setDetailsPanelOpen(true);
  };

  // Select an active dispatch into inspector
  const handleSelectActiveDispatch = (item: ActiveDispatchItem) => {
    setSelectedJob({
      id: item.id,
      jobNumber: item.jobNumber,
      statusBadge: item.techStatus === "On Job" ? "Scheduled" : item.techStatus,
      title: item.jobTitle,
      timeWindow: `Today, ${item.scheduledTime} (ETA ${item.eta.replace("ETA ", "")})`,
      address: item.address,
      customerName: item.customerName,
      customerPhone: item.customerPhone,
      service: item.serviceDetail,
      priority: item.priority,
      assignedTech: {
        name: item.techName,
        avatar: item.techAvatar,
        status: item.techStatus,
      },
      estimate: item.estimate,
      notes: item.notes,
    });
    setDetailsPanelOpen(true);
  };

  // Quick message tech
  const handleMessageTech = () => {
    toast.success(`Message sent to ${selectedJob.assignedTech.name}`, {
      description: `SMS dispatched for work order ${selectedJob.jobNumber}.`,
    });
  };

  // Quick call tech
  const handleCallTech = () => {
    toast.info(`Calling ${selectedJob.assignedTech.name}...`, {
      description: `Dialing field unit direct line: (XXX) XXX-XXXX`,
    });
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white p-3 lg:p-5 space-y-4">
      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Dispatch Board</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Assign jobs to technicians and monitor live dispatch operations.
          </p>
        </div>

        {/* Date and scheduling controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Date Picker Button */}
          <div className="flex items-center rounded-lg bg-[#0F172A] border border-white/10 px-3 py-1.5 text-xs font-medium text-slate-200 shadow-sm">
            <Calendar className="w-3.5 h-3.5 mr-2 text-slate-400" />
            <span>{currentDate}</span>
            <button
              onClick={() => setCurrentDate("May 15, 2025")}
              className="ml-2 text-slate-400 hover:text-white transition"
              title="Next Day"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Today Button */}
          <button
            onClick={() => {
              setCurrentDate("May 14, 2025");
              toast.info("Viewing today's live schedule");
            }}
            className="rounded-lg bg-[#0F172A] hover:bg-slate-800 border border-white/10 px-3 py-1.5 text-xs font-medium text-slate-200 transition shadow-sm"
          >
            Today
          </button>

          {/* Filters Button */}
          <button
            onClick={() => {
              setFilterActive(!filterActive);
              toast.info(filterActive ? "Filters cleared" : "Filters drawer opened");
            }}
            className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition shadow-sm ${
              filterActive
                ? "bg-orange-500/10 border-orange-500/40 text-orange-400"
                : "bg-[#0F172A] hover:bg-slate-800 border-white/10 text-slate-200"
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters</span>
          </button>

          {/* Auto Assign CTA */}
          <button
            onClick={handleAutoAssign}
            disabled={isAutoAssigning}
            className="flex items-center gap-1.5 rounded-lg bg-[#F97316] hover:bg-[#EA580C] text-white px-4 py-1.5 text-xs font-bold shadow-lg shadow-orange-500/20 active:scale-95 transition disabled:opacity-50"
          >
            <Zap className={`w-3.5 h-3.5 ${isAutoAssigning ? "animate-spin" : "fill-current"}`} />
            <span>{isAutoAssigning ? "Optimizing..." : "Auto Assign"}</span>
          </button>
        </div>
      </div>

      {/* 2. Top 6 KPI Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-2">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.id}
              className="rounded-xl bg-[#0F172A]/90 border border-white/10 p-2.5 flex flex-col justify-between shadow-md hover:border-white/20 transition group cursor-pointer"
              onClick={() => toast.info(`Viewing ${kpi.title} breakdown`)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 min-w-0">
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center border shrink-0 ${kpi.iconBg} ${kpi.iconColor}`}
                  >
                    <Icon className="w-2.5 h-2.5" />
                  </div>
                  <span className="text-[11px] font-medium text-slate-300 whitespace-nowrap">{kpi.title}</span>
                </div>
                <ChevronRight className="w-3 h-3 text-slate-500 group-hover:text-slate-300 transition shrink-0 ml-1" />
              </div>

              <div className="mt-1.5">
                <div className="text-xl font-bold text-white tracking-tight">{kpi.value}</div>
                <div className={`text-[10px] font-medium mt-0.5 ${kpi.subtextColor}`}>
                  {kpi.subtext}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Main Operational Workspace (3 Columns) */}
      <div className="grid grid-cols-12 gap-3.5 items-start">
        {/* LEFT COLUMN: Unassigned Jobs Queue */}
        <div className="col-span-12 lg:col-span-3 space-y-2.5">
          <div className="rounded-xl bg-[#0F172A]/90 border border-white/10 p-3">
            {/* Header */}
            <div className="flex items-center justify-between pb-2.5 border-b border-white/10">
              <h2 className="text-xs font-bold text-white tracking-wide uppercase">
                Unassigned Jobs (12)
              </h2>
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400 hover:text-white cursor-pointer transition" />
            </div>

            {/* Jobs List */}
            <div className="space-y-2 mt-2.5">
              {unassignedJobs.map((job) => {
                const isSelected = selectedJob.jobNumber === job.jobNumber;
                return (
                  <div
                    key={job.id}
                    onClick={() => handleSelectUnassigned(job)}
                    className={`rounded-lg p-2.5 border transition cursor-pointer ${
                      isSelected
                        ? "bg-slate-800/90 border-[#F97316] ring-1 ring-[#F97316]/50 shadow-md shadow-orange-500/10"
                        : "bg-[#080D1A]/80 hover:bg-slate-800/60 border-white/10"
                    }`}
                  >
                    {/* Job ID & Priority Badge */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-orange-400 font-mono">
                        {job.jobNumber}
                      </span>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider ${
                          job.priority === "HIGH"
                            ? "bg-rose-500/15 text-rose-400 border-rose-500/30"
                            : job.priority === "MEDIUM"
                            ? "bg-amber-500/15 text-amber-400 border-amber-500/30"
                            : "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                        }`}
                      >
                        {job.priority}
                      </span>
                    </div>

                    {/* Job Title */}
                    <div className="text-xs font-bold text-white mt-0.5">{job.title}</div>

                    {/* Address */}
                    <div className="flex items-center gap-1.5 text-slate-400 text-[10px] mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                      <span className="truncate">{job.address}</span>
                    </div>

                    {/* Scheduled Time */}
                    <div className="flex items-center gap-1.5 text-slate-400 text-[10px] mt-0.5">
                      <Clock className="w-3 h-3 text-slate-500 shrink-0" />
                      <span>{job.timeWindow}</span>
                    </div>

                    {/* Footer: Estimate & Quick Assign Action */}
                    <div className="flex items-center justify-between mt-1.5 pt-1.5 border-t border-white/5">
                      <span className="text-[11px] text-slate-400 font-medium">
                        Est. <span className="text-white font-semibold">{job.estimate}</span>
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectUnassigned(job);
                          toast.success(`Assigning ${job.jobNumber}`, {
                            description: "Select technician from schedule or auto-match.",
                          });
                        }}
                        className="text-xs font-semibold text-orange-400 hover:text-orange-300 flex items-center gap-1 transition"
                      >
                        <span>Assign</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* CENTER COLUMN: Live Dispatch Map & Active Dispatch Monitoring */}
        <div className={`col-span-12 ${detailsPanelOpen ? "lg:col-span-6" : "lg:col-span-9"} space-y-3`}>
          {/* Card 1: Real Google Maps Live Dispatch Radar */}
          <div className="rounded-xl overflow-hidden shadow-2xl">
            <GoogleMapEmbed
              query="Miami, FL"
              title="Real Google Maps Live Fleet Dispatch Radar"
              height="h-64 sm:h-72"
            />
          </div>

          {/* Card 2: Active Dispatch Monitoring */}
          <div className="rounded-xl bg-[#0F172A]/90 border border-white/10 p-3.5 space-y-2">
            {/* Header */}
            <div className="flex items-center justify-between pb-1.5 border-b border-white/10">
              <h2 className="text-xs font-bold text-white tracking-wide uppercase">
                Active Dispatch (8)
              </h2>
              <button
                onClick={() => toast.info("Viewing all 8 active dispatches")}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition"
              >
                <span>View All</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* Dispatches Rows */}
            <div className="divide-y divide-white/5">
              {activeDispatches.map((item) => {
                const isSelected = selectedJob.jobNumber === item.jobNumber;
                return (
                  <div
                    key={item.id}
                    onClick={() => handleSelectActiveDispatch(item)}
                    className={`py-1.5 px-2 rounded-lg flex items-center justify-between gap-3 transition cursor-pointer ${
                      isSelected
                        ? "bg-slate-800/80 ring-1 ring-white/10"
                        : "hover:bg-slate-800/40"
                    }`}
                  >
                    {/* Left: Avatar & Technician */}
                    <div className="flex items-center gap-2 min-w-[130px] sm:min-w-[150px]">
                      <div className="relative w-7 h-7 rounded-full overflow-hidden border border-white/20 shrink-0 bg-slate-800">
                        <img
                          src={item.techAvatar}
                          alt={item.techName}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // Fallback to initials if image doesn't render
                            (e.currentTarget as HTMLElement).style.display = 'none';
                          }}
                        />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white leading-tight">
                          {item.techName}
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-0.5">
                          <span className={`w-1.5 h-1.5 rounded-full ${item.techStatusColor}`} />
                          <span>{item.techStatus}</span>
                        </div>
                      </div>
                    </div>

                    {/* Middle: Job & Location */}
                    <div className="hidden sm:block flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 text-xs text-slate-200 truncate">
                        <span className="font-mono text-orange-400 font-semibold">
                          {item.jobNumber}
                        </span>
                        <span className="font-semibold text-white">{item.jobTitle}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 truncate mt-0.5">
                        {item.address}
                      </div>
                    </div>

                    {/* Right: ETA & View Button */}
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <div className="text-xs font-semibold text-emerald-400 leading-tight">
                          {item.eta}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {item.scheduledTime}
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectActiveDispatch(item);
                        }}
                        className="rounded bg-slate-800 hover:bg-slate-700 border border-white/10 px-2.5 py-1 text-xs font-medium text-slate-200 transition"
                      >
                        View
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Job Details Inspector Panel */}
        {detailsPanelOpen && (
          <div className="col-span-12 lg:col-span-3 space-y-2.5">
            <div className="rounded-xl bg-[#0F172A]/90 border border-white/10 p-3.5 space-y-3">
              {/* Header with collapse icon */}
              <div className="flex items-center justify-between pb-1.5 border-b border-white/10">
                <h2 className="text-xs font-bold text-white tracking-wide uppercase">
                  Job Details
                </h2>
                <button
                  onClick={() => setDetailsPanelOpen(false)}
                  className="text-slate-400 hover:text-white transition p-1"
                  title="Collapse Panel"
                >
                  <ChevronsRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Job Number & Status Badge */}
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-orange-400 font-mono">
                  {selectedJob.jobNumber}
                </span>
                <span className="border border-emerald-500/30 bg-emerald-500/15 text-emerald-400 text-xs font-semibold px-2 py-0.5 rounded-full">
                  {selectedJob.statusBadge}
                </span>
              </div>

              {/* Job Title */}
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">
                  {selectedJob.title}
                </h3>
              </div>

              {/* Meta Rows (Time, Address, Customer, Phone) */}
              <div className="space-y-1.5 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{selectedJob.timeWindow}</span>
                </div>

                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span className="text-slate-300 leading-snug">{selectedJob.address}</span>
                </div>

                <div className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{selectedJob.customerName}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{selectedJob.customerPhone}</span>
                </div>
              </div>

              {/* Service Details */}
              <div className="pt-2 border-t border-white/10 space-y-1">
                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  Service
                </div>
                <div className="flex items-center gap-1.5 text-xs text-white font-medium">
                  <Wrench className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                  <span>{selectedJob.service}</span>
                </div>
              </div>

              {/* Priority */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-slate-400">Priority</span>
                <span className="border border-amber-500/30 bg-amber-500/20 text-amber-400 text-[11px] font-semibold px-2 py-0.5 rounded">
                  {selectedJob.priority}
                </span>
              </div>

              {/* Assigned To */}
              <div className="pt-2 border-t border-white/10 space-y-1.5">
                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  Assigned To
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative w-6 h-6 rounded-full overflow-hidden border border-white/20 shrink-0 bg-slate-800">
                    <img
                      src={selectedJob.assignedTech.avatar}
                      alt={selectedJob.assignedTech.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-xs font-bold text-white">
                    {selectedJob.assignedTech.name}
                  </span>
                  <div className="flex items-center gap-1 text-[10px] text-slate-400 ml-auto">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>{selectedJob.assignedTech.status}</span>
                  </div>
                </div>
              </div>

              {/* Estimated Cost */}
              <div className="flex items-center justify-between pt-2 border-t border-white/10">
                <span className="text-xs text-slate-400">Estimated Cost</span>
                <span className="text-base font-bold text-white">{selectedJob.estimate}</span>
              </div>

              {/* Notes */}
              <div className="pt-2 border-t border-white/10 space-y-1">
                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  Notes
                </div>
                <ul className="text-xs text-slate-300 space-y-0.5 list-disc list-inside">
                  {selectedJob.notes.map((note, idx) => (
                    <li key={idx} className="leading-snug">
                      {note}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Quick Communication Actions (Message Tech & Call) */}
              <div className="pt-2.5 border-t border-white/10 flex items-center gap-2">
                <button
                  onClick={handleMessageTech}
                  className="flex-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-white/10 py-2 px-3 text-xs font-semibold text-slate-200 flex items-center justify-center gap-1.5 shadow-sm transition active:scale-95"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-slate-300" />
                  <span>Message Tech</span>
                </button>

                <button
                  onClick={handleCallTech}
                  className="flex-1 rounded-lg bg-[#059669] hover:bg-[#047857] text-white py-2 px-3 text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 transition active:scale-95"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Call</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Restore Drawer button when collapsed */}
        {!detailsPanelOpen && (
          <div className="col-span-12 lg:col-span-3 flex justify-end">
            <button
              onClick={() => setDetailsPanelOpen(true)}
              className="rounded-lg bg-[#0F172A] border border-white/10 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1.5 shadow-sm"
            >
              <ChevronsLeft className="w-4 h-4" />
              <span>Expand Job Details</span>
            </button>
          </div>
        )}
      </div>

      {/* Preserve full JobDrawer modal support for deep inspection */}
      {drawerJob && (
        <JobDrawer
          job={drawerJob}
          onClose={() => setDrawerJob(null)}
          onJobUpdated={() => setDrawerJob(null)}
        />
      )}
    </div>
  );
}
