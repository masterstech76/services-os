"use client";

import * as React from "react";
import Link from "next/link";
import { Navigation, Phone, Clock, ShieldCheck, MapPin, Wrench, ArrowRight } from "lucide-react";
import { businessConfig } from "@config/business.config";
import { GoogleMapEmbed } from "@/components/maps/GoogleMapEmbed";

export default function BookTrackPage() {
  const [workOrder, setWorkOrder] = React.useState("WO-1004");

  return (
    <div className="flex-1 bg-[#0C1523] text-white py-10 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-3xl w-full rounded-3xl border border-white/10 bg-[#0F172A]/90 backdrop-blur-xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/10">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              Live Dispatch ETA Radar
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white pt-1">
              Check Technician ETA
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Real-time arrival window and vehicle telemetry for your active booking.
            </p>
          </div>
          <div className="rounded-2xl bg-orange-500/10 border border-orange-500/30 px-4 py-3 text-center shrink-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-orange-300 block">
              Estimated Arrival
            </span>
            <span className="text-2xl font-black text-[#F97316] font-mono">14 Mins</span>
          </div>
        </div>

        {/* Lookup Bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={workOrder}
            onChange={(e) => setWorkOrder(e.target.value)}
            placeholder="Enter Work Order # (e.g. WO-1004)"
            className="flex-1 h-11 px-4 rounded-xl bg-white/5 border border-white/15 text-white text-xs sm:text-sm focus:ring-2 focus:ring-[#F97316] outline-none"
          />
          <Link
            href="/account/appointments/job-1004/track"
            className="h-11 px-5 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-[#0C1523] font-bold text-xs sm:text-sm inline-flex items-center justify-center gap-2 shadow-md transition-all"
          >
            <Navigation className="w-4 h-4" />
            <span>Open Live GPS Map</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Real Live Google Map Viewport */}
        <div className="rounded-2xl overflow-hidden shadow-xl">
          <GoogleMapEmbed
            query="1421 Brickell Ave, Miami, FL"
            title="Live En Route Technician Tracker — Google Maps"
            height="h-60 sm:h-72"
          />
        </div>

        {/* Assigned Tech Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-1">
            <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
              <Wrench className="w-3.5 h-3.5 text-orange-400" /> Assigned Technician
            </span>
            <div className="text-sm font-bold text-white">Licensed Field Specialist</div>
            <div className="text-xs text-emerald-400">EPA Certified &amp; Background Checked</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-1">
            <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-orange-400" /> Current Status
            </span>
            <div className="text-sm font-bold text-white">En Route (2.4 mi away)</div>
            <div className="text-xs text-slate-400">Via I-95 S / Brickell Ave</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-1">
            <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-orange-400" /> Destination
            </span>
            <div className="text-sm font-bold text-white">1421 Brickell Ave</div>
            <div className="text-xs text-slate-400">Miami, FL 33131</div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Gate code or arrival instructions changed?</span>
          </div>
          <a
            href={`tel:${businessConfig.phone.replace(/[^0-9]/g, "")}`}
            className="inline-flex items-center gap-1.5 text-orange-400 font-bold hover:text-orange-300 transition-colors"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Call Dispatch: {businessConfig.phone}</span>
          </a>
        </div>
      </div>
    </div>
  );
}
