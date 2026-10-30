"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Wrench,
  MapPin,
  Clock,
  Phone,
  Navigation,
  CheckCircle2,
  AlertCircle,
  Truck,
  ArrowRight,
  Filter,
  Package,
  FileCheck,
  Key,
  Car,
  Route,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface TechJobItem {
  id: string;
  jobNumber: number;
  stopSequence: number;
  status: "in_progress" | "assigned" | "on_the_way" | "completed";
  customerName: string;
  phone: string;
  serviceTitle: string;
  address: string;
  scheduledTime: string;
  issue: string;
  distanceFromPrev?: string;
  driveTimeFromPrev?: string;
  gateCode?: string;
  parkingInfo?: string;
}

const DEMO_JOBS: TechJobItem[] = [
  {
    id: "job-1001",
    jobNumber: 1001,
    stopSequence: 1,
    status: "completed",
    customerName: "Service Client Q",
    phone: "(XXX) XXX-XXXX",
    serviceTitle: "Smart Ecobee Thermostat Install & C-Wire Setup",
    address: "8800 NW 36th St, Doral FL 33178",
    scheduledTime: "07:00 AM – 08:15 AM",
    issue: "Install customer-supplied smart thermostat, verify C-wire voltage. System verified cooling.",
    distanceFromPrev: "0.0 mi (Depot Start)",
    driveTimeFromPrev: "Depot Departure",
    gateCode: "None (Front Door)",
    parkingInfo: "Driveway Parking",
  },
  {
    id: "job-1004",
    jobNumber: 1004,
    stopSequence: 2,
    status: "in_progress",
    customerName: "Service Client",
    phone: "(XXX) XXX-XXXX",
    serviceTitle: "Emergency AC Diagnostic & Dual Capacitor Replacement",
    address: "1421 Brickell Ave, Apt 18B, Miami FL 33131",
    scheduledTime: "08:30 AM – 10:30 AM",
    issue: "AC blowing warm 78°F air, outdoor condenser humming loudly. Circuit breaker tripped once.",
    distanceFromPrev: "12.4 mi from Stop 1",
    driveTimeFromPrev: "22 mins via SR-836 E",
    gateCode: "#4912 (Call Box)",
    parkingInfo: "Visitor Bay 18 • Freight Elevator Key at Desk",
  },
  {
    id: "job-1002",
    jobNumber: 1002,
    stopSequence: 3,
    status: "assigned",
    customerName: "Service Client",
    phone: "(XXX) XXX-XXXX",
    serviceTitle: "Comprehensive Seasonal AC Tune-Up & Coil Sanitization",
    address: "3200 Grand Ave, Coconut Grove FL 33133",
    scheduledTime: "11:00 AM – 01:00 PM",
    issue: "Annual maintenance service, filter replacement & coil sanitization check.",
    distanceFromPrev: "4.8 mi from Stop 2",
    driveTimeFromPrev: "14 mins via S Bayshore Dr",
    gateCode: "Call Box *12",
    parkingInfo: "Rear Alley Service Entrance",
  },
  {
    id: "job-1005",
    jobNumber: 1005,
    stopSequence: 4,
    status: "assigned",
    customerName: "Service Client",
    phone: "(XXX) XXX-XXXX",
    serviceTitle: "Refrigerant Leak Diagnostic & R-410A Recharge",
    address: "540 Biltmore Way, Coral Gables FL 33134",
    scheduledTime: "01:30 PM – 03:30 PM",
    issue: "Low cooling capacity, ice forming on suction line in attic air handler.",
    distanceFromPrev: "3.2 mi from Stop 3",
    driveTimeFromPrev: "10 mins via Coral Way",
    gateCode: "Gate Code 2049#",
    parkingInfo: "Street Parking Permitted (Tech Permit in Van)",
  },
];

export default function TechJobsPage() {
  const router = useRouter();
  const [filter, setFilter] = React.useState<"all" | "active" | "completed">("all");
  const [startingJobId, setStartingJobId] = React.useState<string | null>(null);
  const [reoptimizing, setReoptimizing] = React.useState(false);

  const filteredJobs = DEMO_JOBS.filter((j) => {
    if (filter === "active") return j.status !== "completed";
    if (filter === "completed") return j.status === "completed";
    return true;
  });

  const handleStartTravel = (job: TechJobItem) => {
    setStartingJobId(job.id);
    toast.success(`Routing started to Stop #${job.stopSequence}: ${job.customerName}`, {
      description: "Automated SMS notification dispatched to customer.",
    });
    setTimeout(() => {
      setStartingJobId(null);
      router.push(`/tech/jobs/${job.id}`);
    }, 400);
  };

  const handleRequestOptimization = () => {
    setReoptimizing(true);
    toast.info("Requesting Dispatch Route Optimization...", {
      description: "Checking real-time I-95 & US-1 traffic for optimal stop sequencing.",
    });
    setTimeout(() => {
      setReoptimizing(false);
      toast.success("Route Confirmed", {
        description: "Current sequence is optimal. Lowest fuel consumption & on-time ETA verified.",
      });
    }, 1200);
  };

  return (
    <div className="space-y-6 w-full">
      {/* ─────────────────────────────────────────────────────────────
          PAGE HEADER
      ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <Link href="/tech" className="hover:text-white transition-colors">
              Technician Dashboard
            </Link>
            <span>/</span>
            <span className="text-[#F97316] font-bold">Today&apos;s Route &amp; Sequence</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Route className="h-6 w-6 text-[#F97316]" />
            Today&apos;s Route Sequence &amp; Stop Ledger
          </h1>
          <p className="text-xs text-slate-300 mt-0.5">
            Scheduled field stops for today&apos;s assigned route &bull; Metro Service Corridor
          </p>
        </div>

        {/* Action & Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={handleRequestOptimization}
            disabled={reoptimizing}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 text-xs font-bold transition-all shadow-sm cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${reoptimizing ? "animate-spin" : ""}`} />
            <span>Optimize Order</span>
          </button>

          <div className="flex items-center gap-1.5 p-1 rounded-full bg-white/5 border border-white/10 text-xs font-bold">
            <button
              type="button"
              onClick={() => setFilter("all")}
              className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                filter === "all"
                  ? "bg-[#F97316] text-[#0C1523] shadow-md"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              All ({DEMO_JOBS.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter("active")}
              className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                filter === "active"
                  ? "bg-[#F97316] text-[#0C1523] shadow-md"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              Active (3)
            </button>
            <button
              type="button"
              onClick={() => setFilter("completed")}
              className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                filter === "completed"
                  ? "bg-[#F97316] text-[#0C1523] shadow-md"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              Done (1)
            </button>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          ROUTE SEQUENCE STEPPER & WORK ORDERS
      ───────────────────────────────────────────────────────────── */}
      <div className="space-y-4">
        {filteredJobs.map((job) => {
          const isDone = job.status === "completed";
          const isInProgress = job.status === "in_progress";

          return (
            <div
              key={job.id}
              className={`rounded-2xl border p-5 transition-all shadow-xl backdrop-blur-xl relative overflow-hidden ${
                isInProgress
                  ? "bg-gradient-to-r from-orange-500/15 via-[#0F172A] to-[#0F172A] border-orange-500/40 ring-1 ring-orange-500/30"
                  : isDone
                  ? "bg-[#0F172A]/60 border-white/5 opacity-80"
                  : "bg-[#0F172A]/85 border-white/10 hover:border-white/20"
              }`}
            >
              {/* Route Stepper Badge */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shadow-md ${
                      isDone
                        ? "bg-emerald-500 text-slate-950"
                        : isInProgress
                        ? "bg-[#F97316] text-[#0C1523] animate-pulse"
                        : "bg-blue-500 text-white"
                    }`}
                  >
                    {job.stopSequence}
                  </div>
                  <span className="text-xs font-bold text-white tracking-wide uppercase">
                    Stop #{job.stopSequence} of 4
                  </span>
                  <span className="text-slate-500 text-xs">&bull;</span>
                  <span className="text-xs text-slate-400 font-medium">
                    {job.distanceFromPrev} {job.driveTimeFromPrev && `(${job.driveTimeFromPrev})`}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-white/10 text-white">
                    WO-{job.jobNumber}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                      isInProgress
                        ? "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                        : isDone
                        ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                        : "bg-blue-500/15 text-blue-400 border border-blue-500/30"
                    }`}
                  >
                    {job.status.replace("_", " ")}
                  </span>
                </div>
              </div>

              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Left: Job Meta, Access Codes & Address */}
                <div className="space-y-2 flex-1">
                  <h3 className="text-base font-bold text-white tracking-tight">
                    {job.serviceTitle}
                  </h3>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
                    <div className="flex items-center gap-1.5 font-semibold text-white">
                      <span>{job.customerName}</span>
                      <a
                        href={`tel:${job.phone}`}
                        className="text-orange-400 hover:text-orange-300 text-[11px] underline"
                      >
                        {job.phone}
                      </a>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <Clock className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                      <span>{job.scheduledTime}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <MapPin className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      <span>{job.address}</span>
                    </div>
                  </div>

                  {/* Prominent Access & Parking Badges */}
                  {(job.gateCode || job.parkingInfo) && (
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      {job.gateCode && (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
                          <Key className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Access: {job.gateCode}</span>
                        </div>
                      )}
                      {job.parkingInfo && (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-500/15 border border-blue-500/30 text-blue-300 text-xs font-semibold">
                          <Car className="w-3.5 h-3.5 text-blue-400" />
                          <span>Parking: {job.parkingInfo}</span>
                        </div>
                      )}
                    </div>
                  )}

                  <p className="text-xs text-slate-400 bg-black/30 p-2.5 rounded-xl border border-white/5">
                    <strong className="text-slate-300">Diagnostic Notes: </strong>
                    {job.issue}
                  </p>
                </div>

                {/* Right: Actions */}
                <div className="flex flex-wrap items-center gap-2 lg:flex-col lg:items-end shrink-0">
                  <Link
                    href={`/tech/jobs/${job.id}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white text-xs font-bold transition-all cursor-pointer"
                  >
                    <span>Open Work Order</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>

                  {!isDone && (
                    <button
                      type="button"
                      onClick={() => handleStartTravel(job)}
                      disabled={startingJobId === job.id}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#F97316] hover:bg-orange-600 text-[#0C1523] text-xs font-black shadow-md shadow-orange-500/20 transition-all cursor-pointer"
                    >
                      <Navigation className="h-3.5 w-3.5" />
                      <span>{startingJobId === job.id ? "Routing..." : "Start Navigation"}</span>
                    </button>
                  )}

                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <Link
                      href={`/tech/jobs/${job.id}/checklist`}
                      className="hover:text-orange-400 transition-colors"
                    >
                      Diagnostics
                    </Link>
                    <span>&bull;</span>
                    <Link
                      href={`/tech/jobs/${job.id}/estimate`}
                      className="hover:text-orange-400 transition-colors"
                    >
                      Estimate
                    </Link>
                    <span>&bull;</span>
                    <Link
                      href={`/tech/jobs/${job.id}/parts`}
                      className="hover:text-orange-400 transition-colors"
                    >
                      Parts
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
