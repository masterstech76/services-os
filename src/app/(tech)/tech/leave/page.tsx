"use client";

import * as React from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle2,
  CalendarOff,
  User,
  Truck,
  ArrowLeft,
  Send,
  ShieldAlert,
  HelpCircle,
  FileText,
  Flame,
  Wrench,
  Palmtree,
  HeartPulse,
  Sun,
} from "lucide-react";
import { toast } from "sonner";
import { businessConfig } from "@config/business.config";

interface LeaveRecord {
  id: string;
  workerName: string;
  startDate: string;
  endDate: string;
  timeRange: string;
  duration: string;
  reason: string;
  notes: string;
  isEmergency: boolean;
  status: "pending" | "approved" | "emergency_dispatched";
  submittedAt: string;
}

const INITIAL_RECORDS: LeaveRecord[] = [
  {
    id: "LEV-1042",
    workerName: "",
    startDate: "2026-11-04",
    endDate: "2026-11-06",
    timeRange: "All Day",
    duration: "3 Days",
    reason: "Vacation / Holiday",
    notes: "Annual family holiday requested 2 weeks in advance. Handed over pending filter orders.",
    isEmergency: false,
    status: "approved",
    submittedAt: "2026-10-18 09:30 AM",
  },
  {
    id: "LEV-1039",
    workerName: "",
    startDate: "2026-10-12",
    endDate: "2026-10-12",
    timeRange: "01:00 PM - 05:00 PM",
    duration: "Half Day PM (4h)",
    reason: "Medical / Doctor",
    notes: "Doctor follow-up checkup. Morning route completed.",
    isEmergency: false,
    status: "approved",
    submittedAt: "2026-10-08 02:15 PM",
  },
];

const LEAVE_REASONS = [
  "Vacation / Holiday",
  "Family Emergency",
  "Medical / Doctor",
  "Van Breakdown",
  "Personal Day",
  "Other",
];

const DURATION_PRESETS = [
  { label: "Full Day (8h)", value: "Full Day (8h)" },
  { label: "Half Day AM (4h)", value: "Half Day AM (4h)" },
  { label: "Half Day PM (4h)", value: "Half Day PM (4h)" },
  { label: "Multi-Day", value: "Multi-Day" },
  { label: "Custom Hours", value: "Custom Hours" },
];

export default function TechLeavePage() {
  const [workerName, setWorkerName] = React.useState("");
  const [startDate, setStartDate] = React.useState("");
  const [endDate, setEndDate] = React.useState("");
  const [isAllDay, setIsAllDay] = React.useState(true);
  const [startTime, setStartTime] = React.useState("08:00");
  const [endTime, setEndTime] = React.useState("17:00");
  const [duration, setDuration] = React.useState("Full Day (8h)");
  const [reason, setReason] = React.useState("Vacation / Holiday");
  const [otherReason, setOtherReason] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const [isEmergency, setIsEmergency] = React.useState(false);
  const [submittedTicket, setSubmittedTicket] = React.useState<LeaveRecord | null>(null);
  const [leaveHistory, setLeaveHistory] = React.useState<LeaveRecord[]>(INITIAL_RECORDS);
  const [activeTab, setActiveTab] = React.useState<"form" | "history">("form");

  // Pre-fill today's date
  React.useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setStartDate(today);
    setEndDate(today);
  }, []);

  // 1-Tap Emergency Van Breakdown Dispatch Fast-Track
  const handleVanBreakdownAlert = () => {
    const newRecord: LeaveRecord = {
      id: `EMG-${Math.floor(1000 + Math.random() * 9000)}`,
      workerName: workerName || "Assigned Technician",
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date().toISOString().split("T")[0],
      timeRange: "Immediate",
      duration: "Immediate Roadside",
      reason: "Van Breakdown / Roadside Towing",
      notes: "Fleet vehicle experiencing mechanical breakdown. GPS ping sent to dispatch. Tow truck requested.",
      isEmergency: true,
      status: "emergency_dispatched",
      submittedAt: new Date().toLocaleString(),
    };

    setLeaveHistory([newRecord, ...leaveHistory]);
    setSubmittedTicket(newRecord);
    setActiveTab("history");

    toast.error("ROADSIDE EMERGENCY DISPATCH SENT", {
      description: "Tow service summoned. Remaining route stops re-allocated to available backup technicians.",
    });
  };

  function handleEmergencyToggle() {
    const nextState = !isEmergency;
    setIsEmergency(nextState);
    if (nextState) {
      setReason("Van Breakdown");
      setDuration("Full Day (8h)");
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const selectedReason = reason === "Other" ? `Other: ${otherReason}` : reason;
    const timeDisplay = isAllDay ? "All Day" : `${startTime} – ${endTime}`;
    const newId = `LEV-${Math.floor(1000 + Math.random() * 9000)}`;

    const newRecord: LeaveRecord = {
      id: newId,
      workerName,
      startDate: startDate || new Date().toISOString().split("T")[0],
      endDate: endDate || startDate || new Date().toISOString().split("T")[0],
      timeRange: timeDisplay,
      duration,
      reason: selectedReason,
      notes,
      isEmergency,
      status: isEmergency ? "emergency_dispatched" : "pending",
      submittedAt: new Date().toLocaleString(),
    };

    setLeaveHistory([newRecord, ...leaveHistory]);
    setSubmittedTicket(newRecord);
    setActiveTab("history");
    toast.success("Leave request submitted to Dispatch");
  }

  return (
    <div className="space-y-5 w-full pb-12">
      {/* Top Breadcrumb & Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/tech"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Dashboard</span>
        </Link>
        <span className="text-[11px] text-slate-400">
          Field Operations Unit &bull; {businessConfig.businessName}
        </span>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          PTO BALANCE OVERVIEW CARDS
      ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <div className="rounded-2xl border border-blue-500/30 bg-[#0B1528] p-3 sm:p-4 text-center shadow-lg">
          <Palmtree className="w-5 h-5 text-blue-400 mx-auto mb-1" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Vacation</span>
          <span className="text-xl sm:text-2xl font-black text-white block mt-0.5">12 Days</span>
          <span className="text-[10px] text-blue-300">Available PTO</span>
        </div>

        <div className="rounded-2xl border border-emerald-500/30 bg-[#0B1E22] p-3 sm:p-4 text-center shadow-lg">
          <HeartPulse className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Sick / Medical</span>
          <span className="text-xl sm:text-2xl font-black text-white block mt-0.5">4 Days</span>
          <span className="text-[10px] text-emerald-300">Paid Sick Leave</span>
        </div>

        <div className="rounded-2xl border border-purple-500/30 bg-[#160E2E] p-3 sm:p-4 text-center shadow-lg">
          <Sun className="w-5 h-5 text-purple-400 mx-auto mb-1" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Floating Holiday</span>
          <span className="text-xl sm:text-2xl font-black text-white block mt-0.5">2 Days</span>
          <span className="text-[10px] text-purple-300">Flexible Use</span>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          EMERGENCY VAN BREAKDOWN FAST-TRACK ACTION
      ───────────────────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-rose-500/40 bg-gradient-to-r from-rose-950/60 via-[#180A10] to-[#12080D] p-4 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
            <Truck className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
              <span>Van Breakdown &bull; Roadside Emergency</span>
              <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-rose-500 text-white">
                1-TAP FAST TRACK
              </span>
            </h3>
            <p className="text-xs text-rose-200/80 mt-0.5">
              Instantly summon tow truck &amp; auto-reassign today&apos;s remaining customer stops.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleVanBreakdownAlert}
          className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-black shadow-lg shadow-rose-600/30 transition-all shrink-0 cursor-pointer self-start sm:self-auto"
        >
          Alert Dispatch Now
        </button>
      </div>

      {/* Tab Switcher on Mobile/Tablet: Form vs History */}
      <div className="flex lg:hidden items-center gap-1 rounded-xl bg-[#080D16] p-1 border border-white/5 text-xs font-bold">
        <button
          type="button"
          onClick={() => setActiveTab("form")}
          className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
            activeTab === "form"
              ? "bg-[#F97316] text-[#0C1523] shadow-md shadow-orange-500/20"
              : "text-slate-400 hover:text-white"
          }`}
        >
          Submit Leave Request
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("history")}
          className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
            activeTab === "history"
              ? "bg-[#F97316] text-[#0C1523] shadow-md shadow-orange-500/20"
              : "text-slate-400 hover:text-white"
          }`}
        >
          Request History &amp; Status ({leaveHistory.length})
        </button>
      </div>

      {/* Responsive Desktop 2-Column Layout & Mobile Tabbed View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className={`lg:col-span-7 ${activeTab === "form" ? "block" : "hidden lg:block"}`}>
          <form onSubmit={handleSubmit} className="rounded-2xl border border-white/10 bg-[#0F172A]/85 backdrop-blur-xl p-5 sm:p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h2 className="text-sm sm:text-base font-black text-white tracking-tight">Submit Leave / Absence Request</h2>
                <p className="text-xs text-slate-400 mt-0.5">Notify Central Dispatch to adjust your upcoming route stops.</p>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-400">
                Instant Sync
              </span>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Technician / Unit</label>
              <input
                type="text"
                value={workerName}
                disabled
                className="w-full rounded-xl border border-white/10 bg-[#080D16] px-3 py-2.5 text-xs text-slate-400 font-semibold cursor-not-allowed"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                  className="w-full rounded-xl border border-white/10 bg-[#080D16] px-3 py-2.5 text-xs text-white focus:border-orange-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                  className="w-full rounded-xl border border-white/10 bg-[#080D16] px-3 py-2.5 text-xs text-white focus:border-orange-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Leave Reason</label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#080D16] px-3 py-2.5 text-xs text-white focus:border-orange-500 focus:outline-none cursor-pointer"
              >
                {LEAVE_REASONS.map((r) => (
                  <option key={r} value={r} className="bg-[#0F172A] text-white">
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Duration Preset</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {DURATION_PRESETS.map((d) => (
                  <button
                    key={d.value}
                    type="button"
                    onClick={() => setDuration(d.value)}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      duration === d.value
                        ? "border-orange-500 bg-orange-500/20 text-orange-400"
                        : "border-white/10 bg-[#080D16] text-slate-300 hover:border-white/20"
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Handover Notes for Dispatch Lead
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="State coverage arrangements, pending parts, or key information for dispatch..."
                className="w-full rounded-xl border border-white/10 bg-[#080D16] p-3 text-xs text-white placeholder:text-slate-500 focus:border-orange-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-[#F97316] py-3 text-xs font-bold text-[#0C1523] hover:bg-orange-600 shadow-lg shadow-orange-500/20 transition-all cursor-pointer"
            >
              Submit Leave Request
            </button>
          </form>
        </div>

        <div className={`lg:col-span-5 space-y-3 ${activeTab === "history" ? "block" : "hidden lg:block"}`}>
          <div className="rounded-2xl border border-white/10 bg-[#0F172A]/85 backdrop-blur-xl px-4 py-3 shadow-xl flex items-center justify-between">
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-300">
              Request History &amp; Approval Ledger
            </h2>
            <span className="text-[11px] font-bold text-orange-400">{leaveHistory.length} Records</span>
          </div>
          {leaveHistory.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-white/10 bg-[#0F172A]/85 backdrop-blur-xl p-4 shadow-xl space-y-3"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-orange-400">{item.id}</span>
                  <span className="text-xs font-bold text-white">{item.reason}</span>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    item.status === "approved"
                      ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-400"
                      : item.status === "emergency_dispatched"
                      ? "bg-rose-500/15 border border-rose-500/30 text-rose-400"
                      : "bg-amber-500/15 border border-amber-500/30 text-amber-400"
                  }`}
                >
                  {item.status.replace("_", " ")}
                </span>
              </div>

              {/* Visual Request Status Timeline */}
              <div className="py-1">
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider pb-1">
                  <span>1. Submitted</span>
                  <span>2. Review</span>
                  <span>3. Final Decision</span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden flex">
                  <div className="h-full bg-emerald-500 w-1/3" />
                  <div
                    className={`h-full w-1/3 ${
                      item.status !== "pending" ? "bg-emerald-500" : "bg-slate-700 animate-pulse"
                    }`}
                  />
                  <div
                    className={`h-full w-1/3 ${
                      item.status === "approved"
                        ? "bg-emerald-500"
                        : item.status === "emergency_dispatched"
                        ? "bg-rose-500"
                        : "bg-slate-700"
                    }`}
                  />
                </div>
              </div>

              <div className="text-xs text-slate-300 space-y-1 pt-1">
                <p>
                  <strong>Dates:</strong> {item.startDate} to {item.endDate} ({item.timeRange})
                </p>
                <p className="text-slate-400 italic">
                  <strong>Notes:</strong> {item.notes}
                </p>
                <p className="text-[10px] text-slate-500">Submitted: {item.submittedAt}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
