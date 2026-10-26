"use client";

import * as React from "react";
import Link from "next/link";
import { formatInTimeZone } from "date-fns-tz";
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  Navigation,
  ChevronRight,
  ClipboardCheck,
  Package,
  AlertTriangle,
  Wrench,
  CheckCircle2,
  ShieldAlert,
  Flame,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { businessConfig } from "@config/business.config";
import { StatusBadge } from "@/components/shared/StatusBadge";
import type { EnrichedJob } from "@/lib/server/operations";

const DEMO_TECH_OPTIONS = [
  { id: "tech-carlos", name: "Carlos Mendez" },
  { id: "tech-danny", name: "Danny Reyes" },
  { id: "tech-maria", name: "Maria Alvarez" },
  { id: "tech-tony", name: "Tony Brooks" },
];

const WEEK_DAYS = [
  { day: "Mon", date: "May 26", shift: "08:00A - 04:30P", type: "regular", stops: 2, status: "completed" },
  { day: "Tue", date: "May 27", shift: "07:00A - 04:30P", type: "active", stops: 2, status: "today" },
  { day: "Wed", date: "May 28", shift: "08:00A - 04:00P", type: "regular", stops: 3, status: "scheduled" },
  { day: "Thu", date: "May 29", shift: "ON-CALL 24H", type: "standby", stops: 1, status: "on_call" },
  { day: "Fri", date: "May 30", shift: "08:00A - 04:30P", type: "regular", stops: 2, status: "scheduled" },
  { day: "Sat", date: "May 31", shift: "OFF DUTY", type: "off", stops: 0, status: "off" },
  { day: "Sun", date: "Jun 01", shift: "OFF DUTY", type: "off", stops: 0, status: "off" },
];

const DEFAULT_SCHEDULE_JOBS: EnrichedJob[] = [
  {
    id: "job-1002",
    jobNumber: 1002,
    status: "in_progress",
    scheduledStart: "2025-05-27T13:30:00.000Z",
    scheduledEnd: "2025-05-27T15:30:00.000Z",
    addressLine1: "1421 Brickell Ave, Suite 400",
    city: "Miami",
    state: "FL",
    zip: "33131",
    customer: {
      id: "cust-2",
      name: "Sofia Martinez",
      phone: "(305) 555-0192",
      email: "sofia.m@brickell.com",
    },
    service: {
      id: "svc-ac-repair",
      name: "Emergency AC Diagnostic & Capacitor Repair",
      slug: "ac-repair",
      category: "Repair",
      priceType: "diagnostic",
      basePriceCents: 8900,
    },
  } as unknown as EnrichedJob,
  {
    id: "job-1003",
    jobNumber: 1003,
    status: "assigned",
    scheduledStart: "2025-05-27T17:15:00.000Z",
    scheduledEnd: "2025-05-27T19:00:00.000Z",
    addressLine1: "880 Mandalay Ave, Penthouse B",
    city: "Coral Gables",
    state: "FL",
    zip: "33134",
    customer: {
      id: "cust-3",
      name: "Marcus Vance",
      phone: "(305) 555-0148",
      email: "mvance@gables.io",
    },
    service: {
      id: "svc-tuneup",
      name: "21-Point Precision Tune-Up & Coil Wash",
      slug: "ac-tune-up",
      category: "Maintenance",
      priceType: "fixed",
      basePriceCents: 12900,
    },
  } as unknown as EnrichedJob,
];

export default function TechSchedulePage() {
  const [techId, setTechId] = React.useState("tech-carlos");
  const [viewFilter, setViewFilter] = React.useState<"today" | "tomorrow" | "week">("today");
  const [jobs, setJobs] = React.useState<EnrichedJob[]>(DEFAULT_SCHEDULE_JOBS);
  const [loading, setLoading] = React.useState(false);

  const fetchSchedule = React.useCallback(async (activeTechId: string, filter: string) => {
    try {
      const res = await fetch(`/api/technicians/schedule?filter=${filter}`);
      if (res.ok) {
        const data = await res.json();
        if (data.jobs?.length) {
          setJobs(data.jobs);
        }
      }
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void fetchSchedule(techId, viewFilter);
  }, [techId, viewFilter, fetchSchedule]);

  const tz = businessConfig.timezone;

  return (
    <div className="space-y-5 w-full">
      {/* Top Banner & Technician Profile Context */}
      <div className="rounded-2xl border border-white/10 bg-[#0F172A]/85 backdrop-blur-xl p-4 shadow-xl">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#080D16] border border-orange-500/30 text-orange-400 font-bold shadow-sm">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-base font-bold text-white">Technician Shift &amp; On-Call Schedule</h1>
              <p className="text-xs text-slate-400">Assigned field dispatch roster &bull; Miami Metro</p>
            </div>
          </div>
          <select
            aria-label="Select technician schedule"
            value={techId}
            onChange={async (e) => {
              const newId = e.target.value;
              setTechId(newId);
              try {
                await fetch("/api/auth/demo-session", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ role: "technician", technicianId: newId }),
                });
              } catch {
                // silent
              }
            }}
            className="rounded-xl border border-white/10 bg-[#080D16] px-2.5 py-1 text-xs font-bold text-white focus:outline-none focus:border-orange-500 cursor-pointer"
          >
            {DEMO_TECH_OPTIONS.map((t) => (
              <option key={t.id} value={t.id} className="bg-[#0F172A] text-white">
                {t.name}
              </option>
            ))}
          </select>
        </div>

        {/* Filter Pills */}
        <div className="grid grid-cols-3 gap-1.5 rounded-xl bg-[#080D16] p-1 border border-white/5">
          <button
            type="button"
            onClick={() => setViewFilter("today")}
            className={`rounded-lg py-1.5 text-xs font-bold transition-all cursor-pointer ${
              viewFilter === "today"
                ? "bg-[#F97316] text-[#0C1523] shadow-md shadow-orange-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Today (Tue)
          </button>
          <button
            type="button"
            onClick={() => setViewFilter("tomorrow")}
            className={`rounded-lg py-1.5 text-xs font-bold transition-all cursor-pointer ${
              viewFilter === "tomorrow"
                ? "bg-[#F97316] text-[#0C1523] shadow-md shadow-orange-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Tomorrow (Wed)
          </button>
          <button
            type="button"
            onClick={() => setViewFilter("week")}
            className={`rounded-lg py-1.5 text-xs font-bold transition-all cursor-pointer ${
              viewFilter === "week"
                ? "bg-[#F97316] text-[#0C1523] shadow-md shadow-orange-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Next 7 Days
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          7-DAY VISUAL SHIFT TIMELINE GRID
      ───────────────────────────────────────────────────────────── */}
      <section aria-label="7-Day Shift Grid" className="rounded-2xl border border-white/10 bg-[#0F172A]/85 backdrop-blur-xl p-4 shadow-xl space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-orange-400" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-white">
              7-Day Shift Timeline &bull; 40.0 Regular Hours Scheduled
            </h2>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            Shift Confirmed
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {WEEK_DAYS.map((w) => (
            <div
              key={w.day}
              className={`p-3 rounded-xl border text-center transition-all ${
                w.status === "today"
                  ? "border-orange-500 bg-orange-500/15 ring-1 ring-orange-400 shadow-md"
                  : w.status === "on_call"
                  ? "border-amber-500/50 bg-amber-500/10"
                  : w.status === "off"
                  ? "border-white/5 bg-black/20 opacity-60"
                  : "border-white/10 bg-[#080D16]"
              }`}
            >
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                {w.day} &bull; {w.date}
              </span>
              <span
                className={`text-xs font-bold block mt-1.5 leading-tight ${
                  w.status === "today"
                    ? "text-orange-400"
                    : w.status === "on_call"
                    ? "text-amber-400 font-mono"
                    : "text-white"
                }`}
              >
                {w.shift}
              </span>
              <span className="text-[10px] text-slate-400 block mt-1">
                {w.stops > 0 ? `${w.stops} Stops` : "No Stops"}
              </span>
            </div>
          ))}
        </div>

        {/* On-Call & Shift Swap Action Footer */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-white/5 text-xs text-slate-300">
          <div className="flex items-center gap-1.5 text-amber-300">
            <Flame className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Heat Wave Rotation: Thu Standby 24h covers Brickell &amp; Downtown emergency calls.</span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/tech/leave"
              className="inline-flex items-center gap-1 px-3 py-1 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-white font-semibold transition-colors"
            >
              <span>Request Shift Swap / Leave &rarr;</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Schedule Summary Bar */}
      <div className="flex items-center justify-between px-1">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
          {viewFilter === "today" ? "Today's Work Orders" : viewFilter === "tomorrow" ? "Tomorrow's Schedule" : "Weekly Schedule"}
        </span>
        <span className="inline-flex items-center rounded-full bg-orange-500/15 border border-orange-500/30 px-2.5 py-0.5 text-xs font-bold text-orange-400">
          {jobs.length} {jobs.length === 1 ? "Job" : "Jobs"} Assigned
        </span>
      </div>

      {/* Loading Skeleton */}
      {loading ? (
        <div className="space-y-3">
          <div className="h-32 animate-pulse rounded-2xl bg-white/5 border border-white/5" />
          <div className="h-32 animate-pulse rounded-2xl bg-white/5 border border-white/5" />
          <div className="h-32 animate-pulse rounded-2xl bg-white/5 border border-white/5" />
        </div>
      ) : jobs.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/15 bg-[#0F172A]/85 backdrop-blur-xl p-8 text-center shadow-xl">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white/5 text-slate-400 mb-3">
            <CheckCircle2 className="h-6 w-6 text-emerald-400" />
          </div>
          <h3 className="text-sm font-bold text-white">No scheduled visits in this window</h3>
          <p className="mt-1 text-xs text-slate-400">
            Check back later or contact dispatch for emergency calls and standby assignments.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {jobs.map((job, idx) => {
            const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
              `${job.addressLine1}, ${job.city}, ${job.state} ${job.zip}`
            )}`;

            return (
              <div
                key={job.id}
                className="overflow-hidden rounded-2xl border border-white/10 bg-[#0F172A]/85 backdrop-blur-xl shadow-xl transition-all hover:border-orange-500/30"
              >
                {/* Job Card Header */}
                <div className="border-b border-white/10 bg-white/5 px-4 py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-500/20 text-orange-400 text-[10px] font-bold">
                      {idx + 1}
                    </span>
                    <span className="font-mono text-xs font-bold text-white">
                      WO-#{job.jobNumber}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={job.status} />
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-orange-400 mb-1">
                      <Clock className="h-3.5 w-3.5 text-orange-400" />
                      <span>
                        {formatInTimeZone(new Date(job.scheduledStart), tz, "EEEE, MMM d · h:mm a")} –{" "}
                        {formatInTimeZone(new Date(job.scheduledEnd), tz, "h:mm a")}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-white tracking-tight">{job.service.name}</h3>
                    <p className="text-xs font-semibold text-slate-300 mt-0.5">{job.customer.name}</p>
                  </div>

                  <p className="text-xs text-slate-400 flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>
                      {job.addressLine1}, {job.city}, {job.state} {job.zip}
                    </span>
                  </p>

                  <div className="grid grid-cols-2 gap-2 pt-1 border-t border-white/10">
                    <a
                      href={`tel:${job.customer.phone}`}
                      className="flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 py-2 text-xs font-bold text-white hover:bg-white/10 transition-colors"
                    >
                      <Phone className="h-3.5 w-3.5 text-emerald-400" />
                      Call Customer
                    </a>
                    <a
                      href={mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 py-2 text-xs font-bold text-white hover:bg-white/10 transition-colors"
                    >
                      <Navigation className="h-3.5 w-3.5 text-sky-400" />
                      Directions
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
