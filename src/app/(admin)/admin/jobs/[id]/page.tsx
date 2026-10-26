/* eslint-disable @next/next/no-img-element */
"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Clock,
  DollarSign,
  MapPin,
  User,
  Phone,
  Wrench,
  CheckCircle2,
  FileText,
  Download,
  ExternalLink,
  Star,
  Sparkles,
  AlertTriangle,
  Building,
  Mail,
  ShieldCheck,
  Send,
} from "lucide-react";
import { toast } from "sonner";

interface TimelineEvent {
  id: string;
  title: string;
  time: string;
  subtext: string;
  dotColor: string;
  completed: boolean;
}

export default function AdminJobDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const rawId = params?.id ?? "1047";
  const jobNumber = rawId.startsWith("job-") ? rawId.replace("job-", "#") : `#${rawId}`;

  // Tabs
  const [activeTab, setActiveTab] = React.useState<
    "overview" | "timeline" | "customer" | "technician" | "invoice"
  >("overview");

  // Dynamic status state
  const [status, setStatus] = React.useState<"In Progress" | "Completed" | "On Hold" | "Scheduled">("In Progress");
  const [assignedTech, setAssignedTech] = React.useState("Carlos Mendez");
  const [reassignOpen, setReassignOpen] = React.useState(false);

  const timelineEvents: TimelineEvent[] = [
    {
      id: "ev-1",
      title: "Job Created",
      time: "May 14, 2025 · 08:32 AM",
      subtext: "by Admin & Team",
      dotColor: "bg-blue-400",
      completed: true,
    },
    {
      id: "ev-2",
      title: "Technician Assigned",
      time: "May 14, 2025 · 08:45 AM",
      subtext: "Carlos Mendez",
      dotColor: "bg-blue-400",
      completed: true,
    },
    {
      id: "ev-3",
      title: "On Site",
      time: "May 14, 2025 · 09:15 AM",
      subtext: "Technician arrived at location",
      dotColor: "bg-teal-400",
      completed: true,
    },
    {
      id: "ev-4",
      title: "In Progress",
      time: "May 14, 2025 · 09:30 AM",
      subtext: "Service in progress",
      dotColor: "bg-blue-400",
      completed: true,
    },
    {
      id: "ev-5",
      title: "Completed",
      time: "May 14, 2025 · 11:20 AM",
      subtext: "Job completed",
      dotColor: "bg-slate-600",
      completed: false,
    },
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-white p-4 lg:p-6 space-y-4">
      {/* Header with Back button and Status Pill */}
      <div>
        <Link
          href="/admin/jobs"
          className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 font-medium transition mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Jobs</span>
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Job Dossier</h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              View an individual job&apos;s details, timeline, customer information, technician and invoice.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setReassignOpen(true)}
              className="border border-orange-500/40 bg-orange-500/15 hover:bg-orange-500/25 text-orange-400 text-xs font-bold px-3.5 py-1.5 rounded-full flex items-center gap-1.5 transition cursor-pointer"
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>Reassign Tech</span>
            </button>
            <span className="border border-blue-500/40 bg-blue-500/15 text-blue-400 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              {status}
            </span>
          </div>
        </div>
      </div>

      {/* Top Hero Summary Card matching reference image */}
      <div className="rounded-2xl bg-[#0F172A]/90 border border-white/10 p-5 shadow-xl grid grid-cols-1 md:grid-cols-3 gap-5 items-center">
        {/* Left: Job Number, Title, Schedule & Total Cost */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-orange-400 font-mono">
              {jobNumber.length <= 1 ? "WO-8427" : jobNumber}
            </span>
          </div>
          <div className="text-sm font-semibold text-white">AC Repair - Residential</div>

          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 pt-1">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>May 14, 2025</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>9:00 AM - 11:00 AM</span>
            </div>
          </div>

          <div className="pt-1.5">
            <span className="text-lg font-bold text-white tracking-tight">$155.00</span>
            <span className="text-xs text-slate-400 ml-1.5">Total Cost</span>
          </div>
        </div>

        {/* Middle: Customer Box */}
        <div className="rounded-xl bg-[#080D1A]/80 border border-white/5 p-3.5 flex items-center gap-3">
          <div className="relative w-11 h-11 rounded-full overflow-hidden border border-white/20 shrink-0 bg-slate-800">
            <img
              src="/images/avatar-1.jpg"
              alt="Robert Caldwell"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0">
            <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              Customer
            </div>
            <div className="text-xs font-bold text-white truncate mt-0.5">Robert Caldwell</div>
            <div className="text-[11px] text-slate-400 truncate mt-0.5">+1 (305) 555-0180</div>
            <div className="text-[11px] text-slate-400 truncate">Miami, FL 33145</div>
          </div>
        </div>

        {/* Right: Technician Box */}
        <div className="rounded-xl bg-[#080D1A]/80 border border-white/5 p-3.5 flex items-center gap-3">
          <div className="relative w-11 h-11 rounded-full overflow-hidden border border-white/20 shrink-0 bg-slate-800">
            <img
              src="/images/avatar-david.jpg"
              alt="Carlos Mendez"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Technician
              </div>
              <button
                type="button"
                onClick={() => setReassignOpen(true)}
                className="text-[10px] font-bold text-[#F97316] hover:underline cursor-pointer"
              >
                Reassign
              </button>
            </div>
            <div className="text-xs font-bold text-white truncate mt-0.5">{assignedTech}</div>
            <div className="text-[11px] text-slate-400 truncate mt-0.5">HVAC Specialist</div>
            <div className="text-[11px] text-amber-400 flex items-center gap-1 mt-0.5 font-medium">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>4.8 (24 jobs)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs Row */}
      <div className="flex items-center gap-1 border-b border-white/10 pb-2 overflow-x-auto text-xs font-medium">
        {[
          { id: "overview", label: "Overview" },
          { id: "timeline", label: "Timeline" },
          { id: "customer", label: "Customer Info" },
          { id: "technician", label: "Technician Info" },
          { id: "invoice", label: "Invoice" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3.5 py-1.5 rounded-lg transition shrink-0 ${
              activeTab === tab.id
                ? "bg-orange-500/15 text-orange-400 font-bold border border-orange-500/30"
                : "text-slate-400 hover:text-white hover:bg-slate-800/50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Dossier Content */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
          {/* COLUMN 1: Job Details & Notes */}
          <div className="space-y-4">
            {/* Box 1: Job Details */}
            <div className="rounded-2xl bg-[#0F172A]/90 border border-white/10 p-4 space-y-3.5">
              <h2 className="text-xs font-bold text-white uppercase tracking-wide">
                Job Details
              </h2>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Service</span>
                  <span className="text-white font-medium">AC Repair &amp; Maintenance</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Priority</span>
                  <span className="border border-rose-500/30 bg-rose-500/15 text-rose-400 text-[10px] font-bold px-2 py-0.5 rounded">
                    High
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Status</span>
                  <span className="border border-blue-500/30 bg-blue-500/15 text-blue-400 text-[10px] font-bold px-2 py-0.5 rounded">
                    In Progress
                  </span>
                </div>

                <div className="flex items-start justify-between gap-2 pt-1 border-t border-white/5">
                  <span className="text-slate-400 flex items-center gap-1 shrink-0">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span>Service Address</span>
                  </span>
                  <span className="text-white font-medium text-right leading-snug">
                    1234 Ocean Dr, Miami, FL 33145
                  </span>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-white/5">
                  <span className="text-slate-400 flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-slate-500" />
                    <span>Technician</span>
                  </span>
                  <span className="text-white font-medium">Carlos Mendez</span>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-white/5">
                  <span className="text-slate-400">Created By</span>
                  <span className="text-white font-medium">Admin &amp; Team</span>
                </div>
              </div>
            </div>

            {/* Box 2: Notes */}
            <div className="rounded-2xl bg-[#0F172A]/90 border border-white/10 p-4 space-y-2">
              <h2 className="text-xs font-bold text-white uppercase tracking-wide">
                Notes
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed bg-[#080D1A]/80 p-3 rounded-lg border border-white/5">
                Customer reported no cooling. Check refrigerant levels and clean filters.
              </p>
            </div>
          </div>

          {/* COLUMN 2: Timeline */}
          <div className="space-y-4">
            <div className="rounded-2xl bg-[#0F172A]/90 border border-white/10 p-4 space-y-4">
              <h2 className="text-xs font-bold text-white uppercase tracking-wide">
                Timeline
              </h2>

              <div className="relative pl-6 space-y-5 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-white/10">
                {timelineEvents.map((ev) => (
                  <div key={ev.id} className="relative group">
                    {/* Circle Dot */}
                    <div
                      className={`absolute -left-6 top-1 w-3 h-3 rounded-full border-2 border-[#0F172A] ${ev.dotColor} shadow-md`}
                    />
                    <div className="text-xs font-bold text-white">{ev.title}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{ev.time}</div>
                    <div className="text-[11px] text-slate-400">{ev.subtext}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* COLUMN 3: Invoice Summary */}
          <div className="space-y-4">
            <div className="rounded-2xl bg-[#0F172A]/90 border border-white/10 p-4 space-y-4">
              <h2 className="text-xs font-bold text-white uppercase tracking-wide">
                Invoice Summary
              </h2>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Service Charge</span>
                  <span className="text-white font-medium">$120.00</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Parts &amp; Materials</span>
                  <span className="text-white font-medium">$35.00</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Tax (7%)</span>
                  <span className="text-white font-medium">$10.85</span>
                </div>

                <div className="pt-2.5 border-t border-white/10 flex items-center justify-between">
                  <span className="text-sm font-bold text-white">Total Amount</span>
                  <span className="text-base font-bold text-white">$155.00</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 space-y-2">
                <Link
                  href="/admin/invoices/inv-2026-001"
                  className="w-full rounded-lg bg-[#F97316] hover:bg-[#EA580C] text-[#020617] py-2 text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-orange-500/20 active:scale-95 transition"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>View Invoice</span>
                </Link>

                <button
                  type="button"
                  onClick={() => toast.success("Downloading PDF Work Order Dossier...")}
                  className="w-full rounded-lg bg-slate-800 hover:bg-slate-700 border border-white/10 text-slate-200 py-2 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                >
                  <Download className="w-3.5 h-3.5 text-slate-400" />
                  <span>Download PDF</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Timeline Tab */}
      {activeTab === "timeline" && (
        <div className="rounded-2xl bg-[#0F172A]/90 border border-white/10 p-6 space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wide">
            Audit Activity Timeline
          </h2>
          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-white/10">
            {timelineEvents.map((ev) => (
              <div key={ev.id} className="relative">
                <div
                  className={`absolute -left-6 top-1 w-3 h-3 rounded-full border-2 border-[#0F172A] ${ev.dotColor}`}
                />
                <div className="text-sm font-bold text-white">{ev.title}</div>
                <div className="text-xs text-slate-400 mt-0.5">{ev.time}</div>
                <div className="text-xs text-slate-300 mt-1">{ev.subtext}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Customer Info Tab */}
      {activeTab === "customer" && (
        <div className="rounded-2xl bg-[#0F172A]/90 border border-white/10 p-6 space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wide">
            Customer Information &amp; History
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-2">
              <div className="text-slate-400">Full Name: <span className="text-white font-bold">Robert Caldwell</span></div>
              <div className="text-slate-400">Phone: <span className="text-white font-bold">+1 (305) 555-0180</span></div>
              <div className="text-slate-400">Email: <span className="text-white font-bold">r.caldwell@gmail.com</span></div>
            </div>
            <div className="space-y-2">
              <div className="text-slate-400">Service Address: <span className="text-white font-bold">1234 Ocean Dr, Miami, FL 33145</span></div>
              <div className="text-slate-400">Total Work Orders: <span className="text-white font-bold">4 Completed</span></div>
              <div className="text-slate-400">Membership: <span className="text-emerald-400 font-bold">Gold Plan Member</span></div>
            </div>
          </div>
        </div>
      )}

      {/* Technician Info Tab */}
      {activeTab === "technician" && (
        <div className="rounded-2xl bg-[#0F172A]/90 border border-white/10 p-6 space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wide">
            Assigned Technician Profile
          </h2>
          <div className="flex items-center gap-4">
            <img
              src="/images/avatar-david.jpg"
              alt="Carlos Mendez"
              className="w-14 h-14 rounded-full object-cover border border-white/20"
            />
            <div>
              <div className="text-base font-bold text-white">Carlos Mendez</div>
              <div className="text-xs text-slate-400">HVAC Specialist · EPA Certified Section 608 Universal</div>
              <div className="text-xs text-emerald-400 mt-1">★ 4.8 Rating (24 reviews) · Zone A Master Tech</div>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Tab */}
      {activeTab === "invoice" && (
        <div className="rounded-2xl bg-[#0F172A]/90 border border-white/10 p-6 space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wide">
            Associated Invoice #INV-2026-001
          </h2>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-white/5">
              <span>AC Diagnostic &amp; System Refrigerant Check</span>
              <span className="font-bold">$120.00</span>
            </div>
            <div className="flex justify-between py-1 border-b border-white/5">
              <span>Standard 16x25x1 Air Filter Replacement (x2)</span>
              <span className="font-bold">$35.00</span>
            </div>
            <div className="flex justify-between py-1 border-b border-white/5">
              <span>Florida State &amp; County Sales Tax (7%)</span>
              <span className="font-bold">$10.85</span>
            </div>
            <div className="flex justify-between py-2 text-sm font-bold text-white border-t border-white/10">
              <span>Total Paid</span>
              <span>$155.00</span>
            </div>
          </div>
        </div>
      )}

      {/* Job Reassignment Modal */}
      {reassignOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150"
          onClick={() => setReassignOpen(false)}
        >
          <div
            className="w-full max-w-lg rounded-3xl border border-white/15 bg-[#0B132B] p-6 sm:p-7 shadow-2xl space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#F97316]">
                In-Place Dispatch Reassignment
              </span>
              <h3 className="text-lg font-extrabold text-white mt-0.5">
                Reassign Technician for Job {jobNumber}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Select an available certified technician to immediately transfer route telemetry and customer ETA notifications.
              </p>
            </div>

            <div className="space-y-2">
              {[
                { name: "Carlos Mendez", role: "Master HVAC Tech · Truck #04", eta: "On Site / 8 mins", match: "98% Match" },
                { name: "Tony Brooks", role: "Senior Diagnostic Tech · Truck #02", eta: "14 mins away", match: "95% Match" },
                { name: "Maria Alvarez", role: "Airflow & Duct Specialist · Truck #06", eta: "19 mins away", match: "91% Match" },
                { name: "Danny Reyes", role: "Heating & Furnace Specialist · Truck #09", eta: "24 mins away", match: "89% Match" },
              ].map((tech) => (
                <button
                  key={tech.name}
                  type="button"
                  onClick={() => setAssignedTech(tech.name)}
                  className={`w-full flex items-center justify-between p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                    assignedTech === tech.name
                      ? "border-[#F97316] bg-[#F97316]/15 text-white"
                      : "border-white/10 bg-[#070C16] text-slate-300 hover:bg-white/5"
                  }`}
                >
                  <div>
                    <div className="text-xs font-bold text-white">{tech.name}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{tech.role}</div>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 text-[10px] font-bold">
                      {tech.match}
                    </span>
                    <div className="text-[11px] text-slate-400 mt-0.5">{tech.eta}</div>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex justify-end gap-2.5 pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => setReassignOpen(false)}
                className="px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-xs font-semibold text-slate-300 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  toast.success(`Job ${jobNumber} reassigned to ${assignedTech}`);
                  setReassignOpen(false);
                }}
                className="px-5 py-2.5 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-[#020617] font-black text-xs cursor-pointer shadow-lg shadow-orange-500/20"
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
