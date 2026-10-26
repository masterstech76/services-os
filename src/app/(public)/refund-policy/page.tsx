import * as React from "react";
import Link from "next/link";
import { ShieldCheck, RotateCcw, CreditCard, Clock, CheckCircle2 } from "lucide-react";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { businessConfig } from "@config/business.config";

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-[#0C1523] text-white selection:bg-[#F97316] selection:text-white pb-16">
      <Breadcrumbs items={[{ label: "Refund & Cancellation Policy" }]} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        <div className="space-y-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#F97316]">
            <RotateCcw className="w-3.5 h-3.5" />
            Transparent Customer Protection
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Refund, Deposit &amp; Cancellation Policy
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Clear, homeowner-friendly policies covering diagnostic deposits, appointment rescheduling, 1-year workmanship warranties, and SaaS subscriptions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-white/10 bg-[#0F172A]/85 p-5 space-y-2">
            <Clock className="w-5 h-5 text-[#F97316]" />
            <h2 className="text-sm font-bold text-white">Free Rescheduling</h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Cancel or reschedule any appointment up to 2 hours before your arrival window for a 100% automatic deposit release.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-[#0F172A]/85 p-5 space-y-2">
            <CreditCard className="w-5 h-5 text-emerald-400" />
            <h2 className="text-sm font-bold text-white">$20 Hold Credited 100%</h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Your booking deposit hold is credited dollar-for-dollar toward your diagnostic or approved repair invoice.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-[#0F172A]/85 p-5 space-y-2">
            <ShieldCheck className="w-5 h-5 text-orange-400" />
            <h2 className="text-sm font-bold text-white">1-Year Repair Guarantee</h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              If an installed OEM part fails within 12 months, we replace it and recalibrate your system at $0.00 cost.
            </p>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-[#0F172A]/90 p-6 sm:p-8 space-y-5 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <div className="space-y-2">
            <h3 className="text-base font-bold text-white">1. Service Appointment Cancellations</h3>
            <p>
              Homeowners may cancel or reschedule through the Customer Portal (<Link href="/account/appointments" className="text-orange-400 hover:underline">/account/appointments</Link>) or by calling dispatch at {businessConfig.phone}. Cancellations made before the technician is dispatched incur zero fee and release any card authorization immediately.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-base font-bold text-white">2. Upfront Estimate Approval &amp; Repair Refunds</h3>
            <p>
              No repair work is ever performed without your digital signature on a written Good / Better / Best estimate. If you decline repair options after diagnostic inspection, only the flat diagnostic fee applies.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-base font-bold text-white">3. SaaS Fleet Subscription Trials</h3>
            <p>
              Contractor software subscriptions (<Link href="/pricing" className="text-orange-400 hover:underline">/pricing</Link>) include a 14-day $0.00 free trial and can be cancelled with 1 click at any time without penalty.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
