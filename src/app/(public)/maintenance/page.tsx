import * as React from "react";
import Link from "next/link";
import { Wrench, PhoneCall, ShieldCheck, Clock } from "lucide-react";
import { businessConfig } from "@config/business.config";

export default function MaintenancePage() {
  return (
    <div className="flex-1 bg-[#0C1523] text-white py-12 px-4 sm:px-6 flex items-center justify-center">
      <div className="max-w-xl w-full rounded-3xl border border-amber-500/30 bg-[#0F172A]/95 p-8 shadow-2xl backdrop-blur-2xl text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto shadow-lg">
          <Wrench className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20">
            SYSTEM STATUS: SCHEDULED UPGRADE
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white pt-1">
            Scheduled System Maintenance
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            We are performing a brief infrastructure upgrade on our online scheduling portal. Field technicians and 24/7 emergency phone dispatch remain 100% operational.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left text-xs">
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" /> Estimated Completion
            </span>
            <div className="font-bold text-white">Under 15 Minutes</div>
          </div>
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-slate-400 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Active Dispatches
            </span>
            <div className="font-bold text-emerald-400">100% Online &amp; Unaffected</div>
          </div>
        </div>

        <div className="pt-2 space-y-3">
          <a
            href={`tel:${businessConfig.phone.replace(/[^0-9]/g, "")}`}
            className="w-full h-12 inline-flex items-center justify-center gap-2 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-[#0C1523] text-xs sm:text-sm font-black transition-all shadow-lg shadow-orange-500/20"
          >
            <PhoneCall className="w-4 h-4" />
            <span>24/7 Emergency Dispatch: {businessConfig.phone}</span>
          </a>
          <Link
            href="/"
            className="block text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            ← Return to Home Page
          </Link>
        </div>
      </div>
    </div>
  );
}
