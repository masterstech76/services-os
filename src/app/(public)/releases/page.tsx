"use client";

import * as React from "react";
import { Sparkles, CheckCircle2, Tag, Wrench, ShieldCheck } from "lucide-react";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";

const RELEASES = [
  {
    version: "v2.6.4",
    date: "October 2026",
    badge: "Latest Production",
    title: "Global Command Palette (Ctrl+K), Technician SOS Dispatch & Enterprise Footers",
    highlights: [
      "Added desktop Ctrl+K Global Command Palette in Admin Operations Console for instant search across Jobs, Customers, Invoices, Technicians, and Reports.",
      "Added Technician Emergency SOS modal in the Field PWA for immediate breakdown, safety, or medical escalation.",
      "Added in-place Job Reassignment modal and pre-charge Payment Confirmation modal on customer invoice links.",
      "Implemented context-specific enterprise footer architecture across all 125+ routes.",
    ],
  },
  {
    version: "v2.6.0",
    date: "September 2026",
    badge: "Major Release",
    title: "Live Uber-Style Technician GPS Radar & Good/Better/Best Field Estimates",
    highlights: [
      "Real-time homeowner GPS technician tracker with vehicle speed, ETA countdown, and direct masked SMS/call.",
      "Interactive 3-tier Good / Better / Best field estimate builder with on-glass customer signature capture.",
      "Automated truck inventory parts deduction linked directly to invoice line items.",
    ],
  },
  {
    version: "v2.5.0",
    date: "August 2026",
    badge: "Platform Update",
    title: "AI Proximity Dispatch Matching & Stripe Tap-to-Pay Settlement",
    highlights: [
      "92%+ skill and proximity technician matching on the drag-and-drop Gantt dispatch board.",
      "Instant SMS pay-by-link checkout tokens with tip selector and 1-year warranty certificate generation.",
      "Offline-first IndexedDB caching for technician 24-point safety and pressure checklists.",
    ],
  },
  {
    version: "v2.4.1",
    date: "July 2026",
    badge: "Security Patch",
    title: "Immutable Security Audit Logs & Role-Based Portal Gatekeeping",
    highlights: [
      "Append-only cryptographic audit trail for all pricing overrides, refunds, and dispatch reassignments.",
      "Zero-trust CSRF origin verification and tiered IP rate limiting across all 75+ API mutation routes.",
    ],
  },
];

export default function ReleasesPage() {
  return (
    <div className="min-h-screen bg-[#0C1523] text-white selection:bg-[#F97316] selection:text-white pb-16">
      <Breadcrumbs items={[{ label: "Release Notes & Changelog" }]} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        <div className="space-y-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#F97316]">
            <Sparkles className="w-3.5 h-3.5" />
            Platform Engineering Changelog
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            ServicePro OS Release Notes
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            New features, dispatch improvements, mobile PWA updates, and security patches deployed for admins and field technicians.
          </p>
        </div>

        <div className="space-y-6">
          {RELEASES.map((rel) => (
            <div
              key={rel.version}
              className="rounded-3xl border border-white/10 bg-[#0F172A]/90 backdrop-blur-xl p-6 sm:p-8 shadow-2xl space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-lg font-black text-[#F97316] bg-orange-500/10 border border-orange-500/30 px-3 py-1 rounded-xl">
                    {rel.version}
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    {rel.badge}
                  </span>
                </div>
                <span className="text-xs text-slate-400 font-medium">{rel.date}</span>
              </div>

              <h2 className="text-lg sm:text-xl font-bold text-white">{rel.title}</h2>

              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300">
                {rel.highlights.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
