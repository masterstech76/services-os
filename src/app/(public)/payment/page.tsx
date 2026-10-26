"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  CreditCard,
  ShieldCheck,
  Search,
  ArrowRight,
  Lock,
  Receipt,
  FileText,
  DollarSign,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { businessConfig } from "@config/business.config";

function PaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [lookupQuery, setLookupQuery] = React.useState(searchParams.get("invoice") || searchParams.get("token") || "");
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  // Auto-redirect if token is directly passed in URL
  React.useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      router.push(`/pay/${encodeURIComponent(token)}`);
    }
  }, [searchParams, router]);

  function handleLookup(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);
    const clean = lookupQuery.trim();
    if (!clean) {
      setErrorMsg("Please enter an Invoice #, Work Order ID, or Phone Number.");
      return;
    }

    // Direct routing to demo invoice or lookup
    if (clean.toLowerCase().includes("1004") || clean.toLowerCase() === "inv-1004") {
      router.push("/pay/inv_demo_1");
    } else {
      router.push(`/pay?q=${encodeURIComponent(clean)}`);
    }
  }

  return (
    <div className="flex-1 bg-[#070D18] text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Online Payments", href: "/payment" },
          ]}
        />

        {/* Hero Section */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#F97316]/10 text-[#F97316] border border-[#F97316]/20">
            <Lock className="w-3.5 h-3.5" />
            <span>256-Bit SSL Encrypted Payment Portal</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Pay Your ServicePro Invoice
          </h1>
          <p className="text-sm sm:text-base text-slate-300">
            Fast, secure online bill payment for HVAC diagnostics, repairs, and seasonal maintenance. Look up your balance by invoice number or mobile phone.
          </p>
        </div>

        {/* Search & Lookup Card */}
        <div className="rounded-3xl border border-white/10 bg-[#0F172A]/90 p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-6">
          <div className="space-y-2">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Receipt className="w-5 h-5 text-[#F97316]" />
              <span>Instant Invoice Lookup</span>
            </h2>
            <p className="text-xs text-slate-400">
              Enter your Invoice Number (e.g. <span className="text-white font-mono">INV-1004</span>) or registered phone number:
            </p>
          </div>

          <form onSubmit={handleLookup} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={lookupQuery}
                onChange={(e) => setLookupQuery(e.target.value)}
                placeholder="Enter Invoice #, WO-1004, or Phone..."
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-black/40 border border-white/15 text-white placeholder:text-slate-500 focus:outline-none focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] text-sm"
              />
            </div>
            <button
              type="submit"
              className="px-7 py-3.5 rounded-2xl bg-[#F97316] hover:bg-[#EA580C] text-[#0F172A] font-extrabold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#F97316]/20 cursor-pointer"
            >
              <span>Find Invoice</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {errorMsg && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-xs text-red-200">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Quick Demo Invoice Links */}
          <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
            <span className="text-slate-400 font-medium">Sample Test Invoices:</span>
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href="/pay/inv_demo_1"
                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-orange-400 hover:text-orange-300 font-mono transition-colors"
              >
                INV-1004 ($349.00) →
              </Link>
              <Link
                href="/pay"
                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-colors"
              >
                Search Directory →
              </Link>
            </div>
          </div>
        </div>

        {/* Value Prop Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-sm">PCI-DSS Certified</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              All payment data is tokenized and transmitted directly to Stripe. Zero card details are ever retained on our local servers.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#F97316]/10 border border-[#F97316]/20 text-[#F97316] flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-sm">All Payment Methods</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              We accept Visa, MasterCard, American Express, Discover, Apple Pay, Google Pay, and contactless payments on-site.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-sm">Instant Warranty Coverage</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Payment completion automatically activates your 12-month parts and labor warranty and emails your official tax receipt.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <React.Suspense
      fallback={
        <div className="flex-1 bg-[#070D18] flex items-center justify-center p-12 text-slate-400 text-sm">
          Loading payment portal...
        </div>
      }
    >
      <PaymentContent />
    </React.Suspense>
  );
}
