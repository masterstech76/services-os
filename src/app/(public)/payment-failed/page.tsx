"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { XCircle, CreditCard, RefreshCw, PhoneCall, ShieldAlert, ArrowLeft, HelpCircle } from "lucide-react";
import { businessConfig } from "@config/business.config";

function PaymentFailedContent() {
  const searchParams = useSearchParams();
  const reason = searchParams.get("reason") || "card_declined";
  const source = searchParams.get("source") || "invoice";

  const reasonDetails: Record<string, { title: string; code: string; desc: string }> = {
    card_declined: {
      title: "Card Declined by Issuing Bank",
      code: "STRIPE_ERR_CARD_DECLINED",
      desc: "Your card issuer declined the authorization request. This typically happens due to daily spend limits, insufficient funds, or zip code mismatch.",
    },
    insufficient_funds: {
      title: "Insufficient Available Funds",
      code: "STRIPE_ERR_INSUFFICIENT_FUNDS",
      desc: "The card on file did not have sufficient available balance to complete the transaction.",
    },
    authentication_required: {
      title: "3D Secure Verification Failed",
      code: "STRIPE_ERR_3DS_CHALLENGE",
      desc: "Bank two-factor 3D Secure authentication timed out or was cancelled before completion.",
    },
    timeout: {
      title: "Payment Gateway Timeout",
      code: "STRIPE_ERR_GATEWAY_TIMEOUT",
      desc: "The connection to the card network timed out before authorization finished. Your card was NOT charged.",
    },
  };

  const activeReason = reasonDetails[reason] || reasonDetails.card_declined;

  return (
    <div className="flex-1 bg-[#0C1523] text-white py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-2xl w-full rounded-3xl border border-rose-500/30 bg-[#0F172A]/95 p-7 sm:p-10 shadow-2xl backdrop-blur-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center shrink-0 shadow-lg">
              <XCircle className="w-8 h-8" />
            </div>
            <div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-rose-500/15 text-rose-300 border border-rose-500/30">
                {activeReason.code}
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
                Payment Could Not Be Processed
              </h1>
            </div>
          </div>
          <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-2 text-left sm:text-right">
            <span className="text-[10px] text-emerald-300 uppercase font-bold block">Card Status</span>
            <span className="text-xs font-extrabold text-emerald-400">$0.00 Charged</span>
          </div>
        </div>

        {/* Decline Diagnosis Card */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              {activeReason.title}
            </span>
            <span className="text-xs font-mono text-slate-400">Ref: TXN-FAIL-1004</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {activeReason.desc}
          </p>
        </div>

        {/* Common Remedies */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
          <div className="p-4 rounded-2xl bg-black/30 border border-white/10 space-y-1">
            <span className="font-bold text-white flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-orange-400" /> Try Another Card or Method
            </span>
            <p className="text-slate-400 text-[11px]">
              Switch to a different Visa, Mastercard, Amex, or select Check / ACH settlement.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-black/30 border border-white/10 space-y-1">
            <span className="font-bold text-white flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-orange-400" /> Verify Billing ZIP &amp; CVC
            </span>
            <p className="text-slate-400 text-[11px]">
              Ensure your 5-digit billing ZIP code and 3-digit security code match your bank statement.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link
            href={source === "subscribe" ? "/subscribe" : "/pay/pay_tok_demo_1004"}
            className="flex-1 h-12 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-[#0C1523] font-black text-xs sm:text-sm inline-flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Retry Payment / Change Card</span>
          </Link>

          <Link
            href="/account/payments"
            className="h-12 px-5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-white font-bold text-xs sm:text-sm inline-flex items-center justify-center gap-2 transition-all"
          >
            <CreditCard className="w-4 h-4 text-orange-400" />
            <span>Manage Saved Cards</span>
          </Link>
        </div>

        <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
          <Link href="/" className="hover:text-white inline-flex items-center gap-1 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Return to Storefront
          </Link>
          <a
            href={`tel:${businessConfig.phone.replace(/[^0-9]/g, "")}`}
            className="text-orange-400 font-bold hover:text-orange-300 inline-flex items-center gap-1.5 transition-colors"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Pay by Phone with Dispatch: {businessConfig.phone}</span>
          </a>
        </div>
      </div>
    </div>
  );
}

export default function PaymentFailedPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-[#0C1523]" />}>
      <PaymentFailedContent />
    </React.Suspense>
  );
}
