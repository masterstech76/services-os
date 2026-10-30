"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ShieldCheck,
  Sparkles,
  Phone,
  Clock,
  CheckCircle2,
  Wrench,
  X,
  ArrowLeft,
  Calendar,
  Zap,
} from "lucide-react";
import { businessConfig } from "@config/business.config";
import { BookingWizard } from "@/components/booking/BookingWizard";

function BookPageContent() {
  const searchParams = useSearchParams();
  const techParam = searchParams.get("tech") || searchParams.get("worker") || "";
  const serviceParam = searchParams.get("service") || "";

  const techDisplayMap: Record<string, { name: string; title: string; avatar: string }> = {
    "carlos-mendez": {
      name: "Lead Field Specialist",
      title: "Lead Master HVAC Diagnostic Specialist (Senior Field Team)",
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80",
    },
    "tech-001": {
      name: "Lead Field Specialist",
      title: "Lead Master HVAC Diagnostic Specialist (Senior Field Team)",
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80",
    },
    "marcus-vance": {
      name: "Senior HVAC Specialist",
      title: "Senior AC Maintenance Specialist (Lead Team)",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    },
    "tech-marcus": {
      name: "Senior HVAC Specialist",
      title: "Senior AC Maintenance Specialist (Lead Team)",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    },
    "elena-rivera": {
      name: "Commercial Systems Specialist",
      title: "Commercial HVAC Specialist (Senior Team)",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
    },
  };

  const assignedTech = techParam ? techDisplayMap[techParam.toLowerCase()] : null;

  return (
    <div className="w-full flex-1 bg-[#0C1523] text-white flex flex-col py-8 px-4 sm:px-6 lg:px-8 selection:bg-[#F97316] selection:text-white antialiased">
      <div className="max-w-7xl w-full mx-auto space-y-6">
        
        {/* Top Header & Context Banner */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>South Florida Live Dispatch Active</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Instant Service Booking &amp; Dispatch
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Select your service, choose an arrival window, and lock in upfront guaranteed flat-rate pricing with zero hidden fees.
            </p>
          </div>

          {/* Trust Guarantees */}
          <div className="hidden sm:flex flex-col items-start md:items-end gap-1.5 text-xs text-slate-300 shrink-0">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Fixed-Right Promise</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <Clock className="w-4 h-4 text-orange-400" />
              <span>Same-Day &amp; Emergency Dispatch</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <CheckCircle2 className="w-4 h-4 text-blue-400" />
              <span>NATE &amp; EPA Certified Technicians</span>
            </div>
          </div>
        </div>

        {/* Selected Worker Showcase Card (Shown if booked from a worker page) */}
        {assignedTech && (
          <div className="rounded-2xl border border-orange-500/30 bg-gradient-to-r from-orange-500/10 via-[#0F1D38] to-[#0A1224] p-4 flex items-center justify-between gap-4 shadow-lg animate-in fade-in duration-200">
            <div className="flex items-center gap-3.5">
              <div className="relative">
                <img
                  src={assignedTech.avatar}
                  alt={assignedTech.name}
                  className="w-12 h-12 rounded-xl object-cover border-2 border-orange-500/40 shadow-sm"
                />
                <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#0C1523]" />
              </div>
              <div>
                <span className="text-[10px] text-orange-400 font-bold uppercase tracking-wider block">
                  Direct Technician Request
                </span>
                <span className="text-base font-bold text-white">{assignedTech.name}</span>
                <span className="text-xs text-slate-400 block">{assignedTech.title}</span>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-slate-300">
              <Wrench className="w-3.5 h-3.5 text-orange-400" />
              <span>Assigned Specialist Locked</span>
            </div>
          </div>
        )}

        {/* macOS Style Mini-Window Container (Enhanced Full View) */}
        <div className="rounded-2xl bg-white shadow-2xl relative border border-slate-300/80 overflow-hidden ring-1 ring-black/10 flex flex-col">
          {/* Window Title Bar with macOS Control Dots */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-white/10 bg-[#0F172A] text-white shrink-0">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]" />
                <span className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]" />
                <span className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]" />
              </div>
              <div className="flex items-center gap-2 ml-1">
                <img
                  src="/images/servicepro-icon-transparent.png?v=green"
                  alt="ServicePro OS"
                  className="h-5 w-auto object-contain"
                />
                <span className="text-xs sm:text-sm font-bold text-white tracking-tight">
                  ServicePro OS &mdash; Verified Booking Wizard
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Dispatch Ready
              </span>
            </div>
          </div>

          {/* Embedded Booking Wizard Container (Spacious & Clean) */}
          <div className="w-full flex-1 bg-slate-900/90 relative min-h-[580px]">
            <React.Suspense
              fallback={
                <div className="min-h-[500px] flex items-center justify-center bg-[#0C1523] text-slate-400 text-sm font-medium">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                    <span>Loading booking wizard…</span>
                  </div>
                </div>
              }
            >
              <BookingWizard isModal={true} />
            </React.Suspense>
          </div>
        </div>

        {/* 24/7 Dispatch Support Banner */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2 text-center sm:text-left">
            <Phone className="w-4 h-4 text-orange-400 shrink-0" />
            <span>
              Prefer phone dispatch? Our Miami-Dade dispatch desk is available 24/7:{" "}
              <a href={`tel:${businessConfig.phone.replace(/[^0-9]/g, "")}`} className="text-white font-bold hover:text-orange-400 transition-colors">
                {businessConfig.phone}
              </a>
            </span>
          </div>

          <span className="text-[11px] text-slate-500">
            Average field response ETA: 18&ndash;24 minutes
          </span>
        </div>

      </div>
    </div>
  );
}

export default function BookPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#0C1523] text-white text-sm">
          Loading booking…
        </div>
      }
    >
      <BookPageContent />
    </React.Suspense>
  );
}
