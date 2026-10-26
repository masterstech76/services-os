"use client";

import * as React from "react";
import Link from "next/link";
import { CheckCircle2, Printer, ArrowRight, ShieldCheck, FileText, CreditCard } from "lucide-react";
import { businessConfig } from "@config/business.config";

export default function PaymentSuccessPage() {
  return (
    <div className="flex-1 bg-[#0C1523] text-white py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-2xl w-full rounded-3xl border border-emerald-500/30 bg-[#0F172A]/95 p-7 sm:p-10 shadow-2xl backdrop-blur-2xl space-y-6">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-lg">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            STRIPE SETTLEMENT CONFIRMED · RECEIPT GENERATED
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Payment Successful — Thank You!
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
            Your payment has been authorized and settled. A copy of your official itemized receipt and 1-year warranty certificate has been sent to your email.
          </p>
        </div>

        {/* Receipt Summary Ledger */}
        <div className="rounded-2xl bg-black/40 border border-white/10 p-5 space-y-3 text-xs sm:text-sm">
          <div className="flex items-center justify-between pb-2.5 border-b border-white/10">
            <span className="text-slate-400">Receipt / Transaction ID</span>
            <span className="font-mono font-bold text-emerald-400">pi_3Qx92KLkdIwHu7ix01004</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Invoice / Reference</span>
            <span className="font-bold text-white">INV-1004 (Work Order #1004)</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Service Completed</span>
            <span className="font-semibold text-white">AC Diagnostic &amp; Dual Capacitor Repair</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Payment Method</span>
            <span className="inline-flex items-center gap-1.5 text-white font-semibold">
              <CreditCard className="w-3.5 h-3.5 text-orange-400" /> Visa •••• 4242
            </span>
          </div>
          <div className="flex items-center justify-between pt-3 border-t border-white/10 text-base font-black">
            <span className="text-white">Total Amount Paid</span>
            <span className="text-emerald-400 font-mono text-lg">$201.38</span>
          </div>
        </div>

        {/* Warranty Notice */}
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 flex items-center gap-3 text-xs text-emerald-200">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>
            12-Month Parts &amp; Workmanship Warranty is now active for your property at 1421 Brickell Ave, Miami, FL.
          </span>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <button
            type="button"
            onClick={() => window.print()}
            className="h-11 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-white font-bold text-xs inline-flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4 text-orange-400" />
            <span>Download / Print PDF</span>
          </button>

          <Link
            href="/account/invoices"
            className="h-11 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-white font-bold text-xs inline-flex items-center justify-center gap-2 transition-all"
          >
            <FileText className="w-4 h-4 text-orange-400" />
            <span>View All Invoices</span>
          </Link>

          <Link
            href="/account"
            className="h-11 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-[#0C1523] font-black text-xs inline-flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 transition-all"
          >
            <span>Customer Portal</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="text-center text-[11px] text-slate-500">
          Questions about your receipt? Call {businessConfig.businessName} Billing Support at {businessConfig.phone}.
        </div>
      </div>
    </div>
  );
}
