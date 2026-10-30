"use client";

import * as React from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  MapPin,
  Navigation,
  ArrowRight,
  PlusCircle,
  FileText,
  AlertCircle,
  Phone,
  User,
  Filter,
} from "lucide-react";
import { format } from "date-fns";
import { formatBusinessTime, formatMoneyCents } from "@/lib/domain/format";
import { businessConfig } from "@config/business.config";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { BookingMiniWindowModal } from "@/components/booking/BookingMiniWindowModal";
import type { EnrichedJob } from "@/lib/server/operations";

const TABS = [
  { id: "all", label: "All Appointments" },
  { id: "upcoming", label: "Upcoming" },
  { id: "active", label: "In Progress" },
  { id: "completed", label: "Completed" },
  { id: "cancelled", label: "Cancelled" },
];

const DEFAULT_JOBS: EnrichedJob[] = [];

export default function AppointmentsPage() {
  const [selectedTab, setSelectedTab] = React.useState("all");
  const [jobs, setJobs] = React.useState<EnrichedJob[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [bookingModalOpen, setBookingModalOpen] = React.useState(false);

  const filterDefaultJobs = React.useCallback((status: string) => {
    if (status === "upcoming") return DEFAULT_JOBS.filter((j) => ["unassigned", "assigned"].includes(j.status));
    if (status === "active") return DEFAULT_JOBS.filter((j) => ["on_the_way", "in_progress"].includes(j.status));
    if (status === "completed") return DEFAULT_JOBS.filter((j) => j.status === "completed");
    if (status === "cancelled") return DEFAULT_JOBS.filter((j) => j.status === "cancelled");
    return DEFAULT_JOBS;
  }, []);

  const fetchAppointments = React.useCallback(async (status: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/account/appointments?status=${status}`);
      if (!res.ok) {
        setJobs(filterDefaultJobs(status));
        return;
      }
      const data = await res.json();
      if (!data.jobs || data.jobs.length === 0) {
        setJobs(filterDefaultJobs(status));
      } else {
        setJobs(data.jobs);
      }
    } catch {
      setJobs(filterDefaultJobs(status));
    } finally {
      setLoading(false);
    }
  }, [filterDefaultJobs]);

  React.useEffect(() => {
    fetchAppointments(selectedTab);
  }, [selectedTab, fetchAppointments]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Appointments &amp; Service History
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Track current service dispatches, view past work orders, and manage schedules.
          </p>
        </div>

        <Button
          type="button"
          onClick={() => setBookingModalOpen(true)}
          className="bg-[#F97316] hover:bg-[#EA580C] text-white font-bold text-xs sm:text-sm shadow-lg shadow-orange-500/20 rounded-xl px-5 py-2.5 cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            <span>Book New Service</span>
          </div>
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-white/10">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setSelectedTab(tab.id)}
            className={`whitespace-nowrap px-4 py-2.5 text-xs font-bold rounded-xl transition-all ${
              selectedTab === tab.id
                ? "bg-[#F97316] text-white shadow-md shadow-orange-500/20"
                : "text-slate-300 hover:text-white hover:bg-white/5"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-44 rounded-3xl bg-white/5 border border-white/10 animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-3xl border border-red-500/30 bg-red-500/10 p-8 text-center space-y-3">
          <AlertCircle className="h-7 w-7 text-red-400 mx-auto" />
          <p className="font-bold text-white">{error}</p>
          <Button
            onClick={() => fetchAppointments(selectedTab)}
            size="sm"
            variant="outline"
            className="text-xs rounded-xl border-white/15 bg-white/5 text-white"
          >
            Retry
          </Button>
        </div>
      ) : jobs.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-[#0F172A]/85 backdrop-blur-xl p-10 text-center space-y-4 shadow-xl">
          <div className="h-12 w-12 rounded-2xl bg-orange-500/10 border border-orange-500/25 text-[#F97316] flex items-center justify-center mx-auto">
            <Calendar className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-extrabold text-white">No appointments yet</h3>
          <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
            There are no appointments matching your current filter. Schedule a certified HVAC technician in under 60 seconds.
          </p>
          <Button
            type="button"
            size="sm"
            onClick={() => setBookingModalOpen(true)}
            className="bg-[#F97316] hover:bg-[#EA580C] text-white font-bold text-xs rounded-xl shadow-md cursor-pointer px-5 py-2.5"
          >
            <span>Book Service</span>
          </Button>
        </div>
      ) : (
        <div className="space-y-5">
          {jobs.map((job) => {
            const isLive = ["on_the_way", "in_progress"].includes(job.status);
            const canModify = ["unassigned", "assigned"].includes(job.status);

            return (
              <div
                key={job.id}
                className={`rounded-3xl border bg-[#0F172A]/85 backdrop-blur-xl p-6 sm:p-7 shadow-2xl space-y-5 transition-all ${
                  isLive ? "border-2 border-orange-500 shadow-orange-500/15" : "border-white/10 hover:border-orange-500/30"
                }`}
              >
                {/* Top Row: Job #, Service Title, Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-slate-400 bg-white/5 px-2.5 py-1 rounded-md border border-white/10">
                      Job #{job.jobNumber}
                    </span>
                    <h3 className="text-base sm:text-lg font-extrabold text-white">
                      {job.service.name}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    {isLive && (
                      <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 animate-pulse">
                        <Navigation className="h-3.5 w-3.5" />
                        <span>En Route</span>
                      </span>
                    )}
                    <StatusBadge status={job.status} />
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-xs">
                  <div className="space-y-1.5">
                    <span className="text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                      Scheduled Time
                    </span>
                    <p className="font-bold text-white flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-[#F97316]" />
                      <span>{format(new Date(job.scheduledStart), "EEE, MMM d, yyyy")}</span>
                    </p>
                    <p className="text-slate-300 flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5 text-slate-400" />
                      <span>
                        {formatBusinessTime(job.scheduledStart)} – {formatBusinessTime(job.scheduledEnd)}
                      </span>
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                      Service Location
                    </span>
                    <p className="font-bold text-white flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-[#F97316]" />
                      <span className="truncate">{job.addressLine1}</span>
                    </p>
                    <p className="text-slate-300 truncate">
                      {job.city}, {job.state} {job.zip}
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                      Assigned Technician
                    </span>
                    {job.technician ? (
                      <div>
                        <p className="font-bold text-white flex items-center gap-2 text-sm">
                          <User className="h-4 w-4 text-[#F97316]" />
                          <span>{job.technician.name}</span>
                        </p>
                        <a
                          href={`tel:${job.technician.phone}`}
                          className="text-slate-300 hover:text-[#F97316] font-medium transition-colors"
                        >
                          {job.technician.phone}
                        </a>
                      </div>
                    ) : (
                      <p className="text-slate-400 italic">Assigning nearest tech...</p>
                    )}
                  </div>
                </div>

                {/* Bottom Action Bar */}
                <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                  <div className="text-xs text-slate-300">
                    <span>Deposit: </span>
                    <span className="font-bold text-white">
                      {formatMoneyCents(job.depositCents)}
                    </span>
                    {job.totalCents && (
                      <>
                        <span className="mx-2 text-slate-500">•</span>
                        <span>Total: </span>
                        <span className="font-bold text-emerald-400">
                          {formatMoneyCents(job.totalCents)}
                        </span>
                      </>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    {isLive && (
                      <Button
                        asChild
                        size="sm"
                        className="bg-[#F97316] hover:bg-[#EA580C] text-white font-bold text-xs rounded-xl shadow-md"
                      >
                        <Link href={`/account/appointments/${job.id}/track`}>
                          <Navigation className="h-3.5 w-3.5 mr-1 text-white" />
                          <span>Track Live ETA</span>
                        </Link>
                      </Button>
                    )}

                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="text-xs font-bold border-white/15 bg-white/5 hover:bg-white/10 text-white rounded-xl"
                    >
                      <Link href={`/account/appointments/${job.id}`}>
                        <span>View Work Order</span>
                        <ArrowRight className="h-3.5 w-3.5 ml-1" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Global Booking Mini Window Modal */}
      <BookingMiniWindowModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
      />
    </div>
  );
}

