"use client";

import * as React from "react";
import Link from "next/link";
import { Clock, LogIn, ShieldCheck, Lock } from "lucide-react";

export default function SessionExpiredPage() {
  return (
    <div className="w-full max-w-lg mx-auto rounded-3xl border border-white/15 bg-[#0F172A]/95 p-7 sm:p-10 shadow-2xl backdrop-blur-2xl text-center space-y-6">
      <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto shadow-lg">
        <Clock className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-500/15 text-amber-300 border border-amber-500/30">
          AUTH TOKEN TIMEOUT · AUTO-LOCKED
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-white pt-1">
          Your Session Expired
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          Your session expired for security reasons after 30 minutes of inactivity. Any unsaved work order drafts or checklists have been preserved locally.
        </p>
      </div>

      <div className="rounded-2xl bg-white/5 border border-white/10 p-4 text-left space-y-2 text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Zero-trust session rotation protects customer &amp; billing records</span>
        </div>
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-orange-400 shrink-0" />
          <span>Re-authenticate to resume your Customer, Tech, or Admin workspace</span>
        </div>
      </div>

      <div className="space-y-3 pt-1">
        <Link
          href="/login"
          className="w-full h-12 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-[#0C1523] font-black text-xs sm:text-sm inline-flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 transition-all"
        >
          <LogIn className="w-4 h-4" />
          <span>Sign In Again</span>
        </Link>
        <Link
          href="/"
          className="block text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          ← Return to Public Home
        </Link>
      </div>
    </div>
  );
}
