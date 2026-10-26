"use client";

import * as React from "react";
import Link from "next/link";
import { AlertOctagon, RefreshCw, Home, PhoneCall, Terminal, ShieldAlert } from "lucide-react";
import { businessConfig } from "@config/business.config";

export default function InternalServerErrorPage() {
  const [retrying, setRetrying] = React.useState(false);

  const handleRetry = () => {
    setRetrying(true);
    setTimeout(() => {
      window.location.reload();
    }, 600);
  };

  return (
    <div className="flex-1 bg-[#0C1523] text-white py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-2xl w-full rounded-3xl border border-rose-500/30 bg-[#0F172A]/95 p-7 sm:p-10 shadow-2xl backdrop-blur-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center shrink-0 shadow-lg">
              <AlertOctagon className="w-7 h-7" />
            </div>
            <div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-rose-500/15 text-rose-300 border border-rose-500/30">
                HTTP 500 — INTERNAL SERVER ERROR
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
                Something went wrong
              </h1>
            </div>
          </div>
          <div className="rounded-xl bg-black/40 border border-white/10 px-3.5 py-2 text-left sm:text-right font-mono">
            <span className="text-[10px] text-slate-400 uppercase block">Incident ID</span>
            <span className="text-xs font-bold text-orange-400">ERR-2026-8841</span>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          An unexpected server exception or database timeout prevented your request from completing. Our engineering telemetry has automatically logged this incident and active field dispatches remain unaffected.
        </p>

        {/* Diagnostic Telemetry Box */}
        <div className="rounded-2xl bg-black/50 border border-white/10 p-4 font-mono text-xs space-y-1.5 text-slate-300">
          <div className="flex items-center gap-2 text-rose-400 font-bold">
            <Terminal className="w-3.5 h-3.5" />
            <span>Exception Trace Summary</span>
          </div>
          <div className="text-[11px] text-slate-400">
            • Service: <span className="text-white">servicepro-core-api (us-east-1)</span>
          </div>
          <div className="text-[11px] text-slate-400">
            • Status: <span className="text-emerald-400">Failover Replica Active · Zero Data Loss</span>
          </div>
          <div className="text-[11px] text-slate-400">
            • Reference: <span className="text-orange-300">ERR-2026-8841</span>
          </div>
        </div>

        {/* Primary Actions: Retry | Go Home | Contact Support */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <button
            type="button"
            onClick={handleRetry}
            disabled={retrying}
            className="h-11 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-[#0C1523] font-black text-xs inline-flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${retrying ? "animate-spin" : ""}`} />
            <span>{retrying ? "Retrying..." : "Retry Request"}</span>
          </button>

          <Link
            href="/"
            className="h-11 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-white font-bold text-xs inline-flex items-center justify-center gap-2 transition-all"
          >
            <Home className="w-4 h-4 text-orange-400" />
            <span>Go Home</span>
          </Link>

          <Link
            href="/contact"
            className="h-11 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-white font-bold text-xs inline-flex items-center justify-center gap-2 transition-all"
          >
            <PhoneCall className="w-4 h-4 text-emerald-400" />
            <span>Contact Support</span>
          </Link>
        </div>

        <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
          <span className="inline-flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            Need urgent HVAC dispatch while web portal recovers?
          </span>
          <a
            href={`tel:${businessConfig.phone.replace(/[^0-9]/g, "")}`}
            className="text-orange-400 font-bold hover:text-orange-300 transition-colors"
          >
            Call 24/7 Dispatch: {businessConfig.phone}
          </a>
        </div>
      </div>
    </div>
  );
}
