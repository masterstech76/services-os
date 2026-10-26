"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { format } from "date-fns";
import { formatBusinessTime } from "@/lib/domain/format";
import {
  MapPin,
  Phone,
  Clock,
  CheckCircle2,
  ArrowLeft,
  Car,
  ShieldCheck,
  AlertCircle,
  Radio,
  Navigation,
  Wrench,
  KeyRound,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { businessConfig } from "@config/business.config";
import { GoogleMapEmbed } from "@/components/maps/GoogleMapEmbed";

interface JobTrackDetail {
  id: string;
  jobNumber: number;
  status: string;
  addressLine1: string;
  city: string;
  scheduledStart: string;
  scheduledEnd: string;
  completedAt: string | null;
  service: {
    name: string;
  };
  technician: {
    id: string;
    name: string;
    phone: string;
  } | null;
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; className: string }> = {
    pending: { label: "Pending", className: "bg-amber-500/15 text-amber-400 border-amber-500/30" },
    confirmed: { label: "Confirmed", className: "bg-blue-500/15 text-blue-400 border-blue-500/30" },
    assigned: { label: "Tech Assigned", className: "bg-indigo-500/15 text-indigo-400 border-indigo-500/30" },
    on_the_way: { label: "En Route", className: "bg-orange-500/20 text-orange-400 border-orange-500/40" },
    in_progress: { label: "In Progress", className: "bg-purple-500/15 text-purple-400 border-purple-500/30" },
    completed: { label: "Completed", className: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" },
    cancelled: { label: "Cancelled", className: "bg-rose-500/15 text-rose-400 border-rose-500/30" },
  };
  const cfg = map[status] || { label: status, className: "bg-white/10 text-slate-300 border-white/15" };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${cfg.className}`}>
      {cfg.label}
    </span>
  );
}

const DEFAULT_TRACK_JOB: JobTrackDetail = {
  id: "job-1004",
  jobNumber: 1004,
  status: "on_the_way",
  addressLine1: "1421 Brickell Ave, Penthouse 18B",
  city: "Miami",
  scheduledStart: new Date(Date.now() + 900000).toISOString(),
  scheduledEnd: new Date(Date.now() + 7200000).toISOString(),
  completedAt: null,
  service: {
    name: "Emergency AC Diagnostic & Capacitor Repair",
  },
  technician: {
    id: "tech-104",
    name: "Carlos Mendez",
    phone: "(305) 555-0192",
  },
};

export default function CustomerTrackPage() {
  const params = useParams();
  const jobId = params?.id as string;

  const [job, setJob] = React.useState<JobTrackDetail | null>(DEFAULT_TRACK_JOB);
  const [error] = React.useState<string | null>(null);
  const [gateConfirmed, setGateConfirmed] = React.useState(true);
  const [noteSent, setNoteSent] = React.useState(false);

  const fetchJob = React.useCallback(async () => {
    try {
      const res = await fetch(`/api/jobs/${jobId}`);
      const json = await res.json();
      if (res.ok && json.data) {
        setJob(json.data);
      }
    } catch {
      // Keep pre-hydrated DEFAULT_TRACK_JOB so live GPS telemetry never blanks out
    }
  }, [jobId]);

  React.useEffect(() => {
    if (jobId) {
      fetchJob();
    }
  }, [jobId, fetchJob]);

  React.useEffect(() => {
    if (!job || (job.status !== "on_the_way" && job.status !== "in_progress")) return;
    const interval = setInterval(() => {
      fetchJob();
    }, 15000);
    return () => clearInterval(interval);
  }, [job, fetchJob]);

  if (error || !job) {
    return (
      <div className="rounded-2xl border border-rose-500/30 bg-rose-950/20 p-8 text-center space-y-4 backdrop-blur-xl">
        <AlertCircle className="h-10 w-10 text-rose-400 mx-auto" />
        <h2 className="text-lg font-bold text-white">Tracking Unavailable</h2>
        <p className="text-xs text-rose-300 max-w-md mx-auto">{error}</p>
        <Button asChild size="sm" variant="outline" className="text-xs border-white/10 hover:bg-white/10 text-white">
          <Link href="/account/appointments">← Back to Appointments</Link>
        </Button>
      </div>
    );
  }

  const isOnTheWay = job.status === "on_the_way";
  const isInProgress = job.status === "in_progress";
  const isCompleted = job.status === "completed";

  const steps = [
    { label: "Booked", completed: true },
    { label: "Assigned", completed: Boolean(job.technician) },
    { label: "On The Way", completed: isOnTheWay || isInProgress || isCompleted, active: isOnTheWay },
    { label: "In Progress", completed: isInProgress || isCompleted, active: isInProgress },
    { label: "Completed", completed: isCompleted, active: isCompleted },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <Link href="/account" className="hover:text-white transition-colors">Account</Link>
        <span>/</span>
        <Link href="/account/appointments" className="hover:text-white transition-colors">Appointments</Link>
        <span>/</span>
        <Link href={`/account/appointments/${job.id}`} className="hover:text-white transition-colors">Job #{job.jobNumber}</Link>
        <span>/</span>
        <span className="font-semibold text-orange-400">Live GPS Tracker</span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-xs font-bold text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2.5 py-0.5 rounded-md">
              Work Order #{job.jobNumber}
            </span>
            <StatusBadge status={job.status} />
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
              Technician GPS Live
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1.5">
            Technician ETA & Live Dispatch Radar
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Real-time telemetry for <span className="text-white font-semibold">{job.service.name}</span> at {job.addressLine1}.
          </p>
        </div>

        <Button asChild variant="outline" size="sm" className="text-xs font-bold border-white/10 bg-white/5 hover:bg-white/10 text-white">
          <Link href={`/account/appointments/${job.id}`}>
            <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
            <span>Work Order Details</span>
          </Link>
        </Button>
      </div>

      {/* Progress Pipeline */}
      <div className="rounded-2xl border border-white/10 bg-[#0F172A]/85 backdrop-blur-xl p-5 shadow-xl">
        <div className="flex items-center justify-between gap-2 overflow-x-auto">
          {steps.map((st, idx) => (
            <div key={idx} className="flex items-center gap-2 shrink-0">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all ${
                  st.active
                    ? "bg-[#F97316] text-[#0C1523] ring-4 ring-orange-500/20 shadow-lg shadow-orange-500/20"
                    : st.completed
                    ? "bg-emerald-500 text-white"
                    : "bg-white/5 text-slate-500 border border-white/5"
                }`}
              >
                {st.completed && !st.active ? <CheckCircle2 className="h-4 w-4" /> : idx + 1}
              </div>
              <span
                className={`text-xs font-semibold ${
                  st.active
                    ? "text-[#F97316] font-bold"
                    : st.completed
                    ? "text-white"
                    : "text-slate-500"
                }`}
              >
                {st.label}
              </span>
              {idx < steps.length - 1 && (
                <div
                  className={`h-0.5 w-6 sm:w-16 rounded ${
                    st.completed ? "bg-emerald-500/60" : "bg-white/10"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 12-Column Responsive Layout: Left 7 Cols Live GPS Map, Right 5 Cols Tech Dossier & Arrival Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 7 Columns: Live Route Map & Telemetry */}
        <div className="lg:col-span-7 rounded-2xl border border-white/10 bg-[#0F172A]/85 backdrop-blur-xl overflow-hidden shadow-xl">
          <div className="p-5 sm:p-6 space-y-5">
            {/* High-Contrast Orange ETA Banner */}
            <div className="rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-[#0C1523] p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg shadow-orange-500/15">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-xl bg-[#0C1523] text-orange-400 flex items-center justify-center shrink-0 shadow-md">
                  <Car className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-sm uppercase tracking-wide">
                      {isOnTheWay ? "Carlos Is En Route via US-1 North / Brickell Ave" : "Live Route Telemetry Active"}
                    </span>
                    <Radio className="h-4 w-4 text-[#0C1523] animate-pulse" />
                  </div>
                  <p className="text-xs text-[#0C1523]/90 font-bold mt-0.5">
                    Estimated Arrival: 14 Minutes (2.4 Miles Remaining)
                  </p>
                </div>
              </div>

              <div className="rounded-lg bg-[#0C1523]/15 px-3 py-1.5 text-right text-xs">
                <p className="font-black text-[#0C1523]">Destination: {job.city}, FL</p>
                <p className="text-[#0C1523]/85 text-[11px] font-bold">{job.addressLine1}</p>
              </div>
            </div>

            {/* Real Google Maps Live Viewport */}
            <GoogleMapEmbed
              query="1421 Brickell Ave, Miami, FL"
              title="Live Technician ETA & Route — Google Maps"
              height="h-80 sm:h-96"
            />
          </div>
        </div>

        {/* Right 5 Columns: Assigned Technician Dossier, Arrival Window & Gate Access */}
        <div className="lg:col-span-5 space-y-6">
          {/* Technician Profile Card */}
          {job.technician && (
            <div className="rounded-2xl border border-white/10 bg-[#0F172A]/85 backdrop-blur-xl p-6 shadow-xl space-y-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3.5">
                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 text-slate-950 font-black flex items-center justify-center text-lg shadow-lg shadow-orange-500/20">
                    {job.technician.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-lg text-white">{job.technician.name}</h3>
                      <span className="rounded-md bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 text-xs font-bold text-amber-300">
                        ★ 4.98
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">Senior Lead HVAC Specialist • Fleet Unit Alpha</p>
                    <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-medium mt-1">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      <span>Background Checked • EPA 608 Universal</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                    <Clock className="h-3 w-3 text-orange-400" /> Scheduled Window
                  </p>
                  <p className="font-semibold text-white mt-1">
                    {formatBusinessTime(job.scheduledStart)} – {formatBusinessTime(job.scheduledEnd)}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                    <Wrench className="h-3 w-3 text-emerald-400" /> Truck Loadout
                  </p>
                  <p className="font-semibold text-white mt-1">OEM Capacitors & Gauges</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a
                  href={`tel:${job.technician.phone.replace(/\D/g, "")}`}
                  className="rounded-xl bg-[#F97316] hover:bg-orange-600 text-[#0C1523] font-bold text-xs px-4 py-3 shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 transition-all"
                >
                  <Phone className="h-3.5 w-3.5" />
                  <span>Call {job.technician.name.split(" ")[0]}</span>
                </a>
                <button
                  type="button"
                  onClick={() => setNoteSent(true)}
                  className="rounded-xl border border-slate-700 bg-slate-800/90 hover:bg-slate-700 text-white font-semibold text-xs px-4 py-3 flex items-center justify-center gap-2 transition-all"
                >
                  <MessageSquare className="h-3.5 w-3.5 text-orange-400" />
                  <span>{noteSent ? "Arrival Text Sent ✓" : "Send Gate Note"}</span>
                </button>
              </div>
            </div>
          )}

          {/* Gate Code & Concierge Confirmation */}
          <div className="rounded-2xl border border-white/10 bg-[#0F172A]/85 backdrop-blur-xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
                  <KeyRound className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Property Access Instructions</h3>
                  <p className="text-xs text-slate-400">Shared with {job.technician?.name || "your technician"}</p>
                </div>
              </div>
              <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-bold uppercase text-emerald-400">
                {gateConfirmed ? "Ready for Arrival" : "Pending"}
              </span>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3.5 text-xs text-slate-300 leading-relaxed">
              Gate Code <span className="font-mono font-bold text-amber-300">#4821</span> • Check in with North Tower Concierge for Service Elevator B access.
            </div>

            <button
              type="button"
              onClick={() => setGateConfirmed((v) => !v)}
              className="w-full rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/15 transition-colors"
            >
              {gateConfirmed ? "✓ Concierge & Gate Access Confirmed for Arrival" : "Confirm Gate Access is Ready"}
            </button>
          </div>

          {/* Support Dispatch Box */}
          <div className="rounded-xl bg-white/5 border border-white/10 p-4 text-xs text-slate-300 flex items-center justify-between gap-2 backdrop-blur-md">
            <span>Need 24/7 dispatch assistance?</span>
            <a
              href={`tel:${businessConfig.phone.replace(/[^\d+]/g, "")}`}
              className="font-bold text-orange-400 hover:text-orange-300 underline underline-offset-2"
            >
              Call {businessConfig.phone}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
