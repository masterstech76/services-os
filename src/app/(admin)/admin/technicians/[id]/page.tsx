/* eslint-disable @next/next/no-img-element */
"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Truck,
  User,
  Wrench,
  Award,
  Star,
  Edit,
  Plus,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

export default function AdminTechnicianDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const techId = params?.id ?? "tech-001";
  const isCarlos = !techId || techId.includes("carlos") || techId.includes("1038") || techId.includes("1047");
  const techName = isCarlos ? "Lead Field Technician" : "Service Client A";
  const techTag = isCarlos ? "#T1038 · HVAC Specialist" : "#T1047 · HVAC Specialist";

  const [activeTab, setActiveTab] = React.useState<
    "overview" | "skills" | "history" | "schedule" | "vehicle" | "earnings" | "notes"
  >("overview");

  return (
    <div className="min-h-screen bg-[#020617] text-white p-4 lg:p-6 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <Link
            href="/admin/technicians"
            className="inline-flex items-center gap-1.5 text-xs text-sky-400 hover:text-sky-300 transition-colors font-medium mb-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Technicians</span>
          </Link>
          <h1 className="text-2xl font-bold text-white tracking-tight">Technician Dossier</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            View detailed technician profile, skills, job history, performance and inventory.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => toast.info("Opening edit profile drawer...")}
            className="rounded-lg bg-slate-800 hover:bg-slate-700 border border-white/10 text-slate-300 px-3.5 py-2 text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <Edit className="w-3.5 h-3.5" />
            <span>Edit Profile</span>
          </button>

          <button
            onClick={() => router.push("/admin/jobs/create")}
            className="rounded-lg bg-[#F97316] hover:bg-[#EA580C] text-white px-4 py-2 text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-orange-500/20 active:scale-95 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Assign Job</span>
          </button>
        </div>
      </div>

      {/* Hero Card matching reference image */}
      <div className="rounded-2xl bg-[#0F172A]/90 border border-white/10 p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        {/* Left: Avatar, Name, Role, Availability, Contact */}
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-white/20 shrink-0 bg-slate-800 shadow-md">
            <img
              src="/images/avatar-david.jpg"
              alt={techName}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-xl font-bold text-white tracking-tight">{techName}</h2>
              <span className="border border-emerald-500/30 bg-emerald-500/15 text-emerald-400 text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Available
              </span>
            </div>
            <div className="text-xs text-slate-400 font-mono mt-0.5">
              {techTag}
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 mt-2">
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-slate-500" />
                (XXX) XXX-XXXX
              </span>
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-slate-500" />
                user@domain.com
              </span>
              <span className="flex items-center gap-1 text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                Miami, FL · 123 Ocean Dr.
              </span>
            </div>
          </div>
        </div>

        {/* Right Stats: Total Jobs, Completion Rate, Avg. Rating */}
        <div className="flex items-center gap-4 sm:gap-6 w-full md:w-auto justify-between md:justify-end pt-3 md:pt-0 border-t md:border-t-0 border-white/10">
          <div className="text-center md:text-right">
            <div className="text-xs text-slate-400">Total Jobs</div>
            <div className="text-xl font-bold text-white mt-0.5">156</div>
          </div>
          <div className="h-8 w-px bg-white/10" />
          <div className="text-center md:text-right">
            <div className="text-xs text-slate-400">Completion Rate</div>
            <div className="text-xl font-bold text-white mt-0.5">98%</div>
          </div>
          <div className="h-8 w-px bg-white/10" />
          <div className="text-center md:text-right">
            <div className="text-xs text-slate-400">Avg. Rating</div>
            <div className="text-xl font-bold text-amber-400 flex items-center justify-end gap-1 mt-0.5">
              <span>4.8</span>
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Row */}
      <div className="flex items-center gap-1 border-b border-white/10 pb-2 overflow-x-auto text-xs font-medium">
        {[
          { id: "overview", label: "Overview" },
          { id: "skills", label: "Skills & Certifications" },
          { id: "history", label: "Job History" },
          { id: "schedule", label: "Schedule" },
          { id: "vehicle", label: "Vehicle & Inventory" },
          { id: "earnings", label: "Earnings" },
          { id: "notes", label: "Notes" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              if (tab.id === "schedule") {
                router.push(`/admin/technicians/${techId}/schedule`);
                return;
              }
              setActiveTab(tab.id as any);
            }}
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

      {/* 3-Column Grid in Overview Tab */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
          {/* COLUMN 1: Employment Info, Skills, Vehicle Info */}
          <div className="space-y-4">
            {/* Employment Information */}
            <div className="rounded-2xl bg-[#0F172A]/90 border border-white/10 p-4 space-y-3">
              <h3 className="text-xs font-bold text-white uppercase tracking-wide">
                Employment Information
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Status</span>
                  <span className="border border-emerald-500/30 bg-emerald-500/15 text-emerald-400 text-[10px] font-semibold px-2 py-0.5 rounded">
                    Active
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Join Date</span>
                  <span className="text-white font-medium">May 14, 2023</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Role</span>
                  <span className="text-white font-medium">Technician</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Team</span>
                  <span className="text-white font-medium">HVAC</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Work Type</span>
                  <span className="text-white font-medium">Full-time</span>
                </div>
              </div>
            </div>

            {/* Skills & Certifications */}
            <div className="rounded-2xl bg-[#0F172A]/90 border border-white/10 p-4 space-y-2.5">
              <h3 className="text-xs font-bold text-white uppercase tracking-wide">
                Skills &amp; Certifications
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {["HVAC", "Electrical", "Plumbing", "EPA Certified", "Safety Training"].map((skill, i) => (
                  <span
                    key={i}
                    className="rounded bg-slate-800 border border-white/10 text-slate-300 text-[11px] px-2.5 py-1 font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Vehicle Information */}
            <div className="rounded-2xl bg-[#0F172A]/90 border border-white/10 p-4 space-y-2.5">
              <h3 className="text-xs font-bold text-white uppercase tracking-wide">
                Vehicle Information
              </h3>
              <div className="rounded-xl bg-[#080D1A] border border-white/5 p-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-orange-400">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Ford Transit</div>
                    <div className="text-[11px] text-slate-400 font-mono">MH-12-AB-1234</div>
                  </div>
                </div>
                <span className="border border-emerald-500/30 bg-emerald-500/15 text-emerald-400 text-[10px] font-semibold px-2 py-0.5 rounded">
                  Assigned
                </span>
              </div>
            </div>
          </div>

          {/* COLUMN 2: Current Assignment, Upcoming Schedule, Performance Summary */}
          <div className="space-y-4">
            {/* Current Assignment */}
            <div className="rounded-2xl bg-[#0F172A]/90 border border-white/10 p-4 space-y-2.5">
              <h3 className="text-xs font-bold text-white uppercase tracking-wide">
                Current Assignment
              </h3>
              <div className="rounded-xl bg-[#080D1A] border border-white/5 p-3 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">WO-8428 - AC Repair</span>
                    <span className="border border-blue-500/30 bg-blue-500/15 text-blue-400 text-[10px] font-semibold px-2 py-0.5 rounded">
                      In Progress
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">Miami, FL · 9:30 AM - 11:00 AM</div>
                </div>
                <Link
                  href="/admin/jobs/job-1047"
                  className="rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 px-2.5 py-1 text-xs font-medium transition"
                >
                  View Job
                </Link>
              </div>
            </div>

            {/* Upcoming Schedule */}
            <div className="rounded-2xl bg-[#0F172A]/90 border border-white/10 p-4 space-y-2.5">
              <h3 className="text-xs font-bold text-white uppercase tracking-wide">
                Upcoming Schedule
              </h3>
              <div className="space-y-2 divide-y divide-white/5 text-xs">
                <div className="flex items-center justify-between pt-1">
                  <div>
                    <div className="text-white font-medium">AC Repair</div>
                    <div className="text-[10px] text-slate-400">May 15, 2025 · 8:30 AM - 10:00 AM</div>
                  </div>
                  <span className="border border-blue-500/30 bg-blue-500/15 text-blue-400 text-[10px] font-semibold px-2 py-0.5 rounded">
                    Scheduled
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div>
                    <div className="text-white font-medium">Electrical Repair</div>
                    <div className="text-[10px] text-slate-400">May 16, 2025 · 1:00 PM - 3:00 PM</div>
                  </div>
                  <span className="border border-blue-500/30 bg-blue-500/15 text-blue-400 text-[10px] font-semibold px-2 py-0.5 rounded">
                    Scheduled
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div>
                    <div className="text-white font-medium">Duct Cleaning</div>
                    <div className="text-[10px] text-slate-400">May 17, 2025 · 9:00 AM - 11:30 AM</div>
                  </div>
                  <span className="border border-blue-500/30 bg-blue-500/15 text-blue-400 text-[10px] font-semibold px-2 py-0.5 rounded">
                    Scheduled
                  </span>
                </div>
              </div>
            </div>

            {/* Performance Summary */}
            <div className="rounded-2xl bg-[#0F172A]/90 border border-white/10 p-4 space-y-3">
              <h3 className="text-xs font-bold text-white uppercase tracking-wide">
                Performance Summary
              </h3>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="rounded-xl bg-[#080D1A] border border-white/5 p-3 flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full border-2 border-emerald-400 flex items-center justify-center text-xs font-bold text-white">
                    98%
                  </div>
                  <div className="text-[10px] text-slate-400 mt-2">Completion Rate</div>
                </div>

                <div className="rounded-xl bg-[#080D1A] border border-white/5 p-3 flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full border-2 border-amber-400 flex items-center justify-center text-xs font-bold text-white">
                    4.8
                  </div>
                  <div className="text-[10px] text-slate-400 mt-2">Avg. Rating</div>
                </div>

                <div className="rounded-xl bg-[#080D1A] border border-white/5 p-3 flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full border-2 border-blue-400 flex items-center justify-center text-xs font-bold text-white">
                    156
                  </div>
                  <div className="text-[10px] text-slate-400 mt-2">Total Jobs</div>
                </div>
              </div>
            </div>
          </div>

          {/* COLUMN 3: Job History & Recent Feedback */}
          <div className="space-y-4">
            {/* Job History */}
            <div className="rounded-2xl bg-[#0F172A]/90 border border-white/10 p-4 space-y-3">
              <div className="flex items-center justify-between pb-1 border-b border-white/5">
                <h3 className="text-xs font-bold text-white uppercase tracking-wide">
                  Job History
                </h3>
                <Link
                  href="/admin/jobs"
                  className="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1"
                >
                  <span>View All</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              <div className="space-y-2.5 text-xs">
                {[
                  { id: "WO-8428", title: "AC Repair", date: "May 14, 2025", status: "Scheduled", color: "text-blue-400 border-blue-500/30 bg-blue-500/15" },
                  { id: "WO-8423", title: "Electrical Repair", date: "May 13, 2025", status: "Completed", color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/15" },
                  { id: "#1037", title: "Duct Cleaning", date: "May 12, 2025", status: "Completed", color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/15" },
                  { id: "#1029", title: "Plumbing Repair", date: "May 10, 2025", status: "Completed", color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/15" },
                  { id: "#1018", title: "AC Installation", date: "May 8, 2025", status: "Completed", color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/15" },
                ].map((jh) => (
                  <div key={jh.id} className="flex items-center justify-between py-1 border-b border-white/5 last:border-0">
                    <div>
                      <div className="font-bold text-white">{jh.id} {jh.title}</div>
                      <div className="text-[10px] text-slate-400">{jh.date}</div>
                    </div>
                    <span className={`border text-[10px] font-semibold px-2 py-0.5 rounded ${jh.color}`}>
                      {jh.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Feedback */}
            <div className="rounded-2xl bg-[#0F172A]/90 border border-white/10 p-4 space-y-2">
              <h3 className="text-xs font-bold text-white uppercase tracking-wide">
                Recent Feedback
              </h3>
              <div className="rounded-xl bg-[#080D1A] border border-white/5 p-3 space-y-1.5">
                <div className="flex items-center gap-1 text-amber-400 text-xs">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                </div>
                <p className="text-xs text-slate-300 italic leading-snug">
                  &ldquo;Great service and very professional! Arrived right on time and fixed our AC compressor quickly.&rdquo;
                </p>
                <div className="text-[10px] text-slate-400 pt-1">
                  John D. · May 14, 2025
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
