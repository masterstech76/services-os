"use client";

import * as React from "react";
import Link from "next/link";
import { Lock, KeyRound, PhoneCall, ShieldAlert } from "lucide-react";
import { businessConfig } from "@config/business.config";

export default function AccountLockedPage() {
  return (
    <div className="w-full max-w-lg mx-auto rounded-3xl border border-rose-500/30 bg-[#0F172A]/95 p-7 sm:p-10 shadow-2xl backdrop-blur-2xl text-center space-y-6">
      <div className="w-16 h-16 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center mx-auto shadow-lg">
        <Lock className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-rose-500/15 text-rose-300 border border-rose-500/30">
          SECURITY LOCKOUT · BRUTE-FORCE PROTECTION
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-white pt-1">
          Account Temporarily Locked
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          We detected 5 consecutive failed sign-in attempts on this account. To protect your dispatch &amp; billing data, access has been temporarily locked for 15 minutes.
        </p>
      </div>

      <div className="rounded-2xl bg-black/40 border border-white/10 p-4 text-left space-y-1.5 text-xs text-slate-300">
        <div className="flex items-center gap-2 font-bold text-rose-300">
          <ShieldAlert className="w-4 h-4 text-rose-400" />
          <span>How to Restore Immediate Access</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          Verify ownership via a password reset link sent to your registered email, or contact HQ Security Dispatch if you are a field technician on shift.
        </p>
      </div>

      <div className="space-y-3 pt-1">
        <Link
          href="/forgot-password"
          className="w-full h-12 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-[#0C1523] font-black text-xs sm:text-sm inline-flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 transition-all"
        >
          <KeyRound className="w-4 h-4" />
          <span>Unlock via Password Reset</span>
        </Link>

        <a
          href={`tel:${businessConfig.phone.replace(/[^0-9]/g, "")}`}
          className="w-full h-11 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-white font-bold text-xs inline-flex items-center justify-center gap-2 transition-all"
        >
          <PhoneCall className="w-4 h-4 text-orange-400" />
          <span>Contact Security Desk: {businessConfig.phone}</span>
        </a>
      </div>
    </div>
  );
}
