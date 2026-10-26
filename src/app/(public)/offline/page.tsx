"use client";

import * as React from "react";
import Link from "next/link";
import { WifiOff, RefreshCw, PhoneCall, CheckCircle2 } from "lucide-react";
import { businessConfig } from "@config/business.config";

export default function OfflinePage() {
  return (
    <div className="flex-1 bg-[#0C1523] text-white py-12 px-4 sm:px-6 flex items-center justify-center">
      <div className="max-w-xl w-full rounded-3xl border border-white/15 bg-[#0F172A]/95 p-8 shadow-2xl backdrop-blur-2xl text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-orange-500/20 border border-orange-500/40 text-[#F97316] flex items-center justify-center mx-auto shadow-lg">
          <WifiOff className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider bg-orange-500/10 text-[#F97316] border border-orange-500/20">
            OFFLINE PWA CACHE ACTIVE
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white pt-1">
            You&apos;re Currently Offline
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Your device has lost cellular or Wi-Fi connectivity. Any field checklists, parts logs, or booking drafts are safely cached locally and will sync automatically when reconnected.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-left space-y-2 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Local IndexedDB queue active for job checklists &amp; signatures</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Automatic background sync upon signal restoration</span>
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="flex-1 h-11 inline-flex items-center justify-center gap-2 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-[#0C1523] text-xs font-black transition-all shadow-md cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Retry Connection</span>
          </button>
          <a
            href={`tel:${businessConfig.phone.replace(/[^0-9]/g, "")}`}
            className="flex-1 h-11 inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-white text-xs font-semibold transition-all"
          >
            <PhoneCall className="w-4 h-4 text-[#F97316]" />
            <span>Call Support: {businessConfig.phone}</span>
          </a>
        </div>
      </div>
    </div>
  );
}
