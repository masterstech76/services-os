import * as React from "react";
import Link from "next/link";
import { ShieldCheck, Lock, KeyRound, Server, FileCheck2, CheckCircle2 } from "lucide-react";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";

export default function SecurityCompliancePage() {
  return (
    <div className="min-h-screen bg-[#0C1523] text-white selection:bg-[#F97316] selection:text-white pb-16">
      <Breadcrumbs items={[{ label: "Security & Compliance" }]} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        <div className="space-y-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            Enterprise Security Architecture
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Security, Encryption &amp; PCI-DSS Compliance
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
            ServicePro OS protects homeowner property records, payment cards, and technician telemetry with bank-grade encryption, strict role-based isolation, and append-only audit logs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-3xl border border-white/10 bg-[#0F172A]/90 p-6 space-y-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-white">PCI-DSS Level 1 Card Vaulting</h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Raw credit card numbers never touch ServicePro OS servers. All payment authorizations, deposits, and tap-to-pay settlements are tokenized directly via Stripe Elements over TLS 1.3 (256-bit AES encryption).
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-[#0F172A]/90 p-6 space-y-3">
            <div className="w-11 h-11 rounded-2xl bg-orange-500/15 border border-orange-500/30 text-[#F97316] flex items-center justify-center">
              <KeyRound className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-white">Role-Based Access &amp; Row-Level Security</h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Every API mutation and portal route enforces strict role boundaries between Homeowners (`/account`), Field Technicians (`/tech`), and Dispatch Admins (`/admin`), backed by PostgreSQL Row-Level Security (RLS).
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-[#0F172A]/90 p-6 space-y-3">
            <div className="w-11 h-11 rounded-2xl bg-blue-500/15 border border-blue-500/30 text-blue-400 flex items-center justify-center">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-white">Immutable Security Audit Trail</h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              All administrative actions—including invoice adjustments, coupon creations, technician reassignments, and login events—are recorded in an append-only audit ledger.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-[#0F172A]/90 p-6 space-y-3">
            <div className="w-11 h-11 rounded-2xl bg-purple-500/15 border border-purple-500/30 text-purple-400 flex items-center justify-center">
              <Server className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-white">CSRF &amp; Tiered Rate-Limit Protection</h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              All 75+ API mutation endpoints enforce strict Cross-Site Request Forgery (CSRF) origin verification, webhook cryptographic signature checks, and automated brute-force lockout.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
