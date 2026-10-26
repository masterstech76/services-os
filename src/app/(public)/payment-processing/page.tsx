"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Loader2,
  ShieldCheck,
  Lock,
  CheckCircle2,
  CreditCard,
  ArrowRight,
  AlertCircle,
} from "lucide-react";

function PaymentProcessingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectStatus = searchParams.get("redirect_status");
  const paymentIntent = searchParams.get("payment_intent") || searchParams.get("payment_intent_client_secret");
  const invoiceToken = searchParams.get("token") || "inv_demo_1";

  const [step, setStep] = React.useState<number>(1);
  const [countdown, setCountdown] = React.useState<number>(3);

  React.useEffect(() => {
    // Step progression simulation for 3D-Secure settlement
    const stepTimer1 = setTimeout(() => setStep(2), 1000);
    const stepTimer2 = setTimeout(() => setStep(3), 2000);

    const redirectTimer = setTimeout(() => {
      if (redirectStatus === "failed") {
        router.push("/payment-failed");
      } else {
        router.push("/payment-success");
      }
    }, 3200);

    const countdownInterval = setInterval(() => {
      setCountdown((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => {
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      clearTimeout(redirectTimer);
      clearInterval(countdownInterval);
    };
  }, [redirectStatus, router]);

  return (
    <div className="flex-1 bg-[#070D18] text-white py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-lg w-full rounded-3xl border border-white/10 bg-[#0F172A]/90 p-8 sm:p-10 shadow-2xl backdrop-blur-2xl space-y-8 text-center">
        {/* Animated Icon */}
        <div className="relative mx-auto w-20 h-20 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-[#F97316]/15 animate-ping opacity-40" />
          <div className="w-20 h-20 rounded-full border-2 border-[#F97316] bg-[#F97316]/10 flex items-center justify-center text-[#F97316] shadow-xl shadow-[#F97316]/20">
            <Loader2 className="w-10 h-10 animate-spin" />
          </div>
        </div>

        {/* Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider bg-orange-500/15 text-orange-400 border border-orange-500/30">
            <Lock className="w-3 h-3" />
            <span>Stripe 3D-Secure Verification Active</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Processing Your Payment
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Please do not refresh or close this window while we communicate with your card issuer.
          </p>
        </div>

        {/* Verification Progress Steps */}
        <div className="rounded-2xl bg-black/40 border border-white/10 p-5 space-y-3.5 text-left text-xs">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>1. Contacting Card Issuing Bank</span>
            </span>
            <span className="font-mono text-emerald-400 text-[11px] font-bold">Authorized</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-slate-300">
              {step >= 2 ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <Loader2 className="w-4 h-4 text-[#F97316] animate-spin shrink-0" />
              )}
              <span>2. 3D-Secure Biometric &amp; Fraud Validation</span>
            </span>
            <span className={`font-mono text-[11px] font-bold ${step >= 2 ? "text-emerald-400" : "text-[#F97316]"}`}>
              {step >= 2 ? "Verified" : "Validating..."}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-slate-300">
              {step >= 3 ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <Loader2 className="w-4 h-4 text-slate-500 shrink-0" />
              )}
              <span>3. Recording Ledger &amp; Activating Warranty</span>
            </span>
            <span className={`font-mono text-[11px] font-bold ${step >= 3 ? "text-emerald-400" : "text-slate-500"}`}>
              {step >= 3 ? "Finalized" : "Pending"}
            </span>
          </div>
        </div>

        {/* Auto Redirect Countdown */}
        <div className="space-y-3">
          <p className="text-xs text-slate-400">
            Redirecting to your official receipt in{" "}
            <span className="text-white font-mono font-bold">{countdown}</span> seconds...
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link
              href="/payment-success"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-semibold text-xs transition-colors"
            >
              <span>Skip Wait — View Receipt</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Security Footer Notice */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-center gap-2 text-[11px] text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Protected by AES-256 Tokenization &amp; PCI-DSS Level 1 Gateway</span>
        </div>
      </div>
    </div>
  );
}

export default function PaymentProcessingPage() {
  return (
    <React.Suspense
      fallback={
        <div className="flex-1 bg-[#070D18] flex items-center justify-center p-12 text-slate-400 text-sm">
          Securing connection...
        </div>
      }
    >
      <PaymentProcessingContent />
    </React.Suspense>
  );
}
