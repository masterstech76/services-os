"use client";

import * as React from "react";
import Link from "next/link";
import { Mail, RefreshCw, CheckCircle2, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export default function VerificationRequiredPage() {
  const [resending, setResending] = React.useState(false);
  const [resent, setResent] = React.useState(false);

  const handleResend = () => {
    setResending(true);
    setTimeout(() => {
      setResending(false);
      setResent(true);
      toast.success("Fresh verification link sent to your inbox!");
    }, 800);
  };

  return (
    <div className="w-full max-w-lg mx-auto rounded-3xl border border-white/15 bg-[#0F172A]/95 p-7 sm:p-10 shadow-2xl backdrop-blur-2xl text-center space-y-6">
      <div className="w-16 h-16 rounded-2xl bg-orange-500/20 border border-orange-500/40 text-[#F97316] flex items-center justify-center mx-auto shadow-lg">
        <Mail className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-orange-500/15 text-orange-300 border border-orange-500/30">
          EMAIL VERIFICATION REQUIRED
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-white pt-1">
          Verify Your Email to Continue
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          You are signed in, but your email address has not been verified yet. Please click the verification link sent to your email or enter your 6-digit verification code.
        </p>
      </div>

      {resent && (
        <div className="rounded-xl bg-emerald-500/15 border border-emerald-500/30 p-3 text-xs text-emerald-300 font-semibold flex items-center justify-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>New verification email dispatched! Check your inbox or spam folder.</span>
        </div>
      )}

      <div className="space-y-3 pt-1">
        <Link
          href="/verify-email"
          className="w-full h-12 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-[#0C1523] font-black text-xs sm:text-sm inline-flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 transition-all"
        >
          <span>Enter Verification Code</span>
          <ArrowRight className="w-4 h-4" />
        </Link>

        <button
          type="button"
          onClick={handleResend}
          disabled={resending}
          className="w-full h-11 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-white font-bold text-xs inline-flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 text-orange-400 ${resending ? "animate-spin" : ""}`} />
          <span>{resending ? "Sending..." : "Resend Verification Email"}</span>
        </button>

        <Link
          href="/login"
          className="block text-xs font-semibold text-slate-400 hover:text-white transition-colors pt-1"
        >
          Sign in with a different account
        </Link>
      </div>
    </div>
  );
}
