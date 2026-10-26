"use client";

import * as React from "react";
import Link from "next/link";
import { AlertTriangle, Calendar, MapPin, CreditCard, PhoneCall, RefreshCw } from "lucide-react";
import { businessConfig } from "@config/business.config";

export default function BookingFailedPage() {
  return (
    <div className="flex-1 bg-[#0C1523] text-white py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-2xl w-full rounded-3xl border border-amber-500/30 bg-[#0F172A]/95 p-7 sm:p-10 shadow-2xl backdrop-blur-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0 shadow-lg">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-500/15 text-amber-300 border border-amber-500/30">
                BOOKING HOLD INTERRUPTED
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
                We Couldn&apos;t Complete Your Booking
              </h1>
            </div>
          </div>
          <div className="rounded-xl bg-amber-500/10 border border-amber-500/30 px-3.5 py-2 text-left sm:text-right">
            <span className="text-[10px] text-amber-300 uppercase font-bold block">Slot Hold</span>
            <span className="text-xs font-extrabold text-amber-400">Held for 10 Mins</span>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          Your preferred arrival window was temporarily staged, but we encountered an issue finalizing your booking reservation. No deposit has been charged to your card.
        </p>

        {/* Possible Failure Scenarios */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
            <CreditCard className="w-4 h-4 text-orange-400" />
            <div className="font-bold text-white">Deposit Hold Declined</div>
            <p className="text-[11px] text-slate-400">
              The $20 diagnostic reservation authorization did not complete.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
            <MapPin className="w-4 h-4 text-orange-400" />
            <div className="font-bold text-white">Territory ZIP Check</div>
            <p className="text-[11px] text-slate-400">
              Service address may require custom regional fleet routing.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
            <Calendar className="w-4 h-4 text-orange-400" />
            <div className="font-bold text-white">Slot Contention</div>
            <p className="text-[11px] text-slate-400">
              Another emergency dispatch claimed the same technician window.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link
            href="/book"
            className="flex-1 h-12 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-[#0C1523] font-black text-xs sm:text-sm inline-flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Resume Booking Wizard</span>
          </Link>

          <a
            href={`tel:${businessConfig.phone.replace(/[^0-9]/g, "")}`}
            className="flex-1 h-12 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-white font-bold text-xs sm:text-sm inline-flex items-center justify-center gap-2 transition-all"
          >
            <PhoneCall className="w-4 h-4 text-emerald-400" />
            <span>Book Instantly by Phone: {businessConfig.phone}</span>
          </a>
        </div>
      </div>
    </div>
  );
}
