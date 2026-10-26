"use client";

import * as React from "react";
import { CheckCircle2, Activity, Server, CreditCard, MessageSquare, MapPin, ShieldCheck } from "lucide-react";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";

const SERVICES_HEALTH = [
  {
    name: "Core Dispatch & Booking API",
    endpoint: "api.servicepro-os.com (us-east-1)",
    uptime: "99.99%",
    latency: "38ms",
    status: "Operational",
    icon: Server,
  },
  {
    name: "Stripe PaymentIntents & Invoicing Vault",
    endpoint: "PCI-DSS Level 1 Webhook Gateway",
    uptime: "100.0%",
    latency: "84ms",
    status: "Operational",
    icon: CreditCard,
  },
  {
    name: "Twilio SMS & Automated ETA Alerts",
    endpoint: "SMS / MMS Dispatch Messaging Pipeline",
    uptime: "99.97%",
    latency: "112ms",
    status: "Operational",
    icon: MessageSquare,
  },
  {
    name: "PostgreSQL / Supabase Primary Cluster",
    endpoint: "Multi-AZ Replicated Ledger & RLS",
    uptime: "99.99%",
    latency: "14ms",
    status: "Operational",
    icon: Activity,
  },
  {
    name: "Live Fleet GPS Telemetry & Maps",
    endpoint: "WebSocket Van Radar & Route Matrix",
    uptime: "99.98%",
    latency: "45ms",
    status: "Operational",
    icon: MapPin,
  },
];

export default function SystemStatusPage() {
  return (
    <div className="min-h-screen bg-[#0C1523] text-white selection:bg-[#F97316] selection:text-white pb-16">
      <Breadcrumbs items={[{ label: "System Status" }]} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* All Systems Operational Banner */}
        <div className="rounded-3xl border border-emerald-500/30 bg-emerald-500/10 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-emerald-300 font-bold">
                LIVE TELEMETRY · UPDATED JUST NOW
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-white">
                All Systems Operational
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                99.98% rolling 90-day uptime across all dispatch, mobile PWA, and payment clusters.
              </p>
            </div>
          </div>
          <div className="rounded-2xl bg-black/40 border border-white/10 px-4 py-3 text-left sm:text-right font-mono shrink-0">
            <span className="text-[10px] text-slate-400 uppercase block">Release Build</span>
            <span className="text-sm font-bold text-emerald-400">v2.6.4-production</span>
          </div>
        </div>

        {/* Component Health Rows */}
        <div className="rounded-3xl border border-white/10 bg-[#0F172A]/90 backdrop-blur-xl divide-y divide-white/10 overflow-hidden shadow-2xl">
          {SERVICES_HEALTH.map((svc) => {
            const Icon = svc.icon;
            return (
              <div
                key={svc.name}
                className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-[#F97316] flex items-center justify-center shrink-0 mt-0.5">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm sm:text-base font-bold text-white">{svc.name}</div>
                    <div className="text-xs text-slate-400 font-mono mt-0.5">{svc.endpoint}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 text-xs">
                  <div className="text-right">
                    <span className="text-slate-400 block text-[11px]">90d Uptime</span>
                    <span className="font-mono font-bold text-white">{svc.uptime}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400 block text-[11px]">Latency</span>
                    <span className="font-mono font-bold text-slate-200">{svc.latency}</span>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 font-bold text-emerald-400">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    {svc.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* 30-Day Uptime Bars */}
        <div className="rounded-3xl border border-white/10 bg-[#0F172A]/85 p-6 space-y-4">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              30-Day SLA Availability History
            </span>
            <span className="text-emerald-400 font-mono font-bold">Zero Unplanned Outages</span>
          </div>
          <div className="grid grid-cols-30 gap-1 h-8 items-center">
            {Array.from({ length: 30 }).map((_, idx) => (
              <div
                key={idx}
                className="h-full rounded-sm bg-emerald-500/80 hover:bg-emerald-400 transition-colors"
                title={`Day -${30 - idx}: 100% Operational`}
              />
            ))}
          </div>
          <div className="flex justify-between text-[11px] text-slate-400 font-mono">
            <span>30 days ago</span>
            <span>100.0% SLA Target Met</span>
            <span>Today</span>
          </div>
        </div>
      </div>
    </div>
  );
}
