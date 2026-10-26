"use client";

import * as React from "react";
import Link from "next/link";
import {
  Tag,
  Sparkles,
  Calendar,
  Clock,
  ArrowRight,
  ShieldCheck,
  Check,
  Copy,
  Zap,
  Flame,
  Percent,
} from "lucide-react";
import { toast } from "sonner";
import { businessConfig } from "@config/business.config";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { Button } from "@/components/ui/button";

interface SpecialDeal {
  id: string;
  code: string;
  title: string;
  category: "all" | "repair" | "tuneup" | "upgrade";
  regularPrice: string;
  dealPrice: string;
  savings: string;
  savingsBadge: string;
  description: string;
  features: string[];
  claimedPercent: number;
  dealType: "Flash Deal" | "Limited Capacity" | "Seasonal Rebate" | "Energy Rebate";
  serviceSlug: string;
  bookUrl: string;
}

const DEALS: SpecialDeal[] = [
  {
    id: "deal-1",
    code: "FIRST25",
    title: "$25 Off First AC Repair Diagnostic",
    category: "repair",
    regularPrice: "$129",
    dealPrice: "$104",
    savings: "$25 OFF",
    savingsBadge: "19% OFF",
    description: "Save $25 on your initial comprehensive system diagnostic and electrical inspection. 100% credited toward approved repair work.",
    features: [
      "Full 21-point electrical & refrigerant test",
      "Exact written estimate before any work starts",
      "Same-day dispatch across Greater Miami",
      "Waived completely if repairs approved",
    ],
    claimedPercent: 88,
    dealType: "Flash Deal",
    serviceSlug: "ac-repair",
    bookUrl: "/book?serviceId=svc-ac-repair&coupon=FIRST25",
  },
  {
    id: "deal-2",
    code: "TUNE89",
    title: "Seasonal 21-Point AC Precision Tune-Up",
    category: "tuneup",
    regularPrice: "$129",
    dealPrice: "$89",
    savings: "$40 OFF",
    savingsBadge: "31% OFF",
    description: "Prevent summer compressor burnouts, lower power consumption, and maintain factory warranty compliance with our multi-point tune-up.",
    features: [
      "Condenser coil chemical rinse & fin comb",
      "Condensate drain line flush & biocidal treatment",
      "Capacitor, contactor & motor amp testing",
      "30-day breakdown-free performance guarantee",
    ],
    claimedPercent: 92,
    dealType: "Seasonal Rebate",
    serviceSlug: "ac-tuneup",
    bookUrl: "/book?serviceId=svc-ac-tuneup&coupon=TUNE89",
  },
  {
    id: "deal-3",
    code: "CLEANAIR50",
    title: "Whole-Home Air Duct Cleaning & Sanitization",
    category: "tuneup",
    regularPrice: "$299",
    dealPrice: "$249",
    savings: "$50 OFF",
    savingsBadge: "17% OFF",
    description: "Remove accumulated South Florida dust mites, mold spores, and construction debris with high-powered negative-air HEPA extraction.",
    features: [
      "Negative-air HEPA vacuum containment",
      "Rotary brush scrubbing of all supply branch trunks",
      "Hospital-grade botanical antimicrobial mist",
      "Before & after visual inspection photos",
    ],
    claimedPercent: 74,
    dealType: "Limited Capacity",
    serviceSlug: "duct-cleaning",
    bookUrl: "/book?serviceId=svc-duct-cleaning&coupon=CLEANAIR50",
  },
  {
    id: "deal-4",
    code: "NEST30",
    title: "Smart Thermostat Pro Installation Rebate",
    category: "upgrade",
    regularPrice: "$179",
    dealPrice: "$149",
    savings: "$30 OFF",
    savingsBadge: "17% OFF",
    description: "Professional installation for Google Nest, Ecobee, or Honeywell smart thermostats, including 24V common wire (C-wire) power bridge.",
    features: [
      "Dedicated 24V C-wire testing and connection",
      "Smartphone app pairing and Wi-Fi synchronization",
      "Eco-scheduling optimization for humidity control",
      "Old thermostat safe disposal & recycling",
    ],
    claimedPercent: 65,
    dealType: "Energy Rebate",
    serviceSlug: "thermostat-install",
    bookUrl: "/book?serviceId=svc-thermostat-install&coupon=NEST30",
  },
];

export default function SpecialsPage() {
  const [selectedFilter, setSelectedFilter] = React.useState<"all" | "repair" | "tuneup" | "upgrade">("all");
  const [copiedCode, setCopiedCode] = React.useState<string | null>(null);

  const filteredDeals = React.useMemo(() => {
    if (selectedFilter === "all") return DEALS;
    return DEALS.filter((d) => d.category === selectedFilter);
  }, [selectedFilter]);

  async function handleClipCoupon(code: string) {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(code);
      }
    } catch {
      // Fallback for non-secure contexts
    }
    setCopiedCode(code);
    toast.success(`Coupon code ${code} clipped to clipboard! Auto-applied to your booking.`);
    setTimeout(() => {
      setCopiedCode(null);
    }, 4000);
  }

  return (
    <div className="min-h-screen bg-[#0C1523] text-white selection:bg-[#F97316] selection:text-white pb-20">
      <Breadcrumbs items={[{ label: "Deals & Specials" }]} />

      {/* Header Banner */}
      <section className="relative overflow-hidden pt-10 pb-12 sm:pt-16 sm:pb-16 border-b border-white/10">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#F97316]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-orange-500/10 text-[#F97316] border border-orange-500/25 px-4 py-1.5 text-xs font-bold uppercase tracking-wider">
                <Flame className="h-3.5 w-3.5 fill-[#F97316] text-[#F97316]" />
                <span>Today&apos;s Verified HVAC Deals &amp; Instant Coupons</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
                Verified Savings on Professional Service
              </h1>
              <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
                Clip verified digital coupons to claim upfront discounted diagnostics, tune-ups, and duct sanitization across {businessConfig.city}.
              </p>
            </div>

            {/* Urgency Box */}
            <div className="rounded-2xl border border-orange-500/30 bg-[#0F172A]/85 backdrop-blur-xl p-5 flex flex-col items-center justify-center text-center space-y-1.5 min-w-[220px] shadow-xl">
              <span className="text-[11px] font-bold text-[#F97316] uppercase tracking-widest flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                <span>Seasonal Allocation</span>
              </span>
              <div className="text-2xl font-black text-white">
                Limited Slots
              </div>
              <span className="text-xs text-slate-300">
                100% Satisfaction Guarantee
              </span>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 pt-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setSelectedFilter("all")}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 ${
                selectedFilter === "all"
                  ? "bg-[#F97316] text-white shadow-md shadow-orange-500/20"
                  : "bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white border border-white/10"
              }`}
            >
              All Deals ({DEALS.length})
            </button>
            <button
              onClick={() => setSelectedFilter("repair")}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 ${
                selectedFilter === "repair"
                  ? "bg-[#F97316] text-white shadow-md shadow-orange-500/20"
                  : "bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white border border-white/10"
              }`}
            >
              Repair &amp; Diagnostics
            </button>
            <button
              onClick={() => setSelectedFilter("tuneup")}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 ${
                selectedFilter === "tuneup"
                  ? "bg-[#F97316] text-white shadow-md shadow-orange-500/20"
                  : "bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white border border-white/10"
              }`}
            >
              Tune-Ups &amp; Duct Care
            </button>
            <button
              onClick={() => setSelectedFilter("upgrade")}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 ${
                selectedFilter === "upgrade"
                  ? "bg-[#F97316] text-white shadow-md shadow-orange-500/20"
                  : "bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white border border-white/10"
              }`}
            >
              Smart Upgrades
            </button>
          </div>
        </div>
      </section>

      {/* Main Deals Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredDeals.map((deal) => {
            const isCopied = copiedCode === deal.code;

            return (
              <div
                key={deal.id}
                className="rounded-3xl border border-white/10 bg-[#0F172A]/85 backdrop-blur-xl p-6 sm:p-8 shadow-2xl hover:border-orange-500/30 transition-all duration-300 flex flex-col justify-between space-y-6 relative overflow-hidden group"
              >
                {/* Top Badge Strip */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-black uppercase tracking-wider bg-rose-500 text-white px-2.5 py-0.5 rounded-md shadow-sm">
                      {deal.savingsBadge}
                    </span>
                    <span className="text-[11px] font-bold text-[#F97316] bg-orange-500/10 px-2.5 py-0.5 rounded border border-orange-500/25">
                      {deal.dealType}
                    </span>
                  </div>

                  <span className="text-xs font-semibold text-slate-400">
                    Verified Deal
                  </span>
                </div>

                {/* Price & Title Block */}
                <div className="space-y-3">
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl sm:text-4xl font-black text-white">
                      {deal.dealPrice}
                    </span>
                    <span className="text-sm font-semibold text-slate-500 line-through">
                      {deal.regularPrice}
                    </span>
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20">
                      Save {deal.savings}
                    </span>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    {deal.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {deal.description}
                  </p>
                </div>

                {/* Checklist Features */}
                <div className="space-y-2.5 py-3 border-y border-white/10">
                  {deal.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 text-xs text-slate-300">
                      <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                {/* Progress Claim Bar */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
                    <span>{deal.claimedPercent}% claimed</span>
                    <span className="text-[#F97316] font-bold">Limited daily slots</span>
                  </div>
                  <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full"
                      style={{ width: `${deal.claimedPercent}%` }}
                    />
                  </div>
                </div>

                {/* Actions: Clip Coupon & Book */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                  {/* Clip Coupon Button */}
                  <button
                    type="button"
                    onClick={() => handleClipCoupon(deal.code)}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl border text-xs font-bold transition-all ${
                      isCopied
                        ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-400"
                        : "border-white/15 bg-white/5 text-slate-200 hover:border-orange-500/40 hover:bg-orange-500/10"
                    }`}
                  >
                    {isCopied ? (
                      <>
                        <Check className="h-4 w-4 text-emerald-400" />
                        <span>Code {deal.code} Clipped!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 text-slate-400" />
                        <span>Clip Code: <strong className="font-mono text-white ml-1">{deal.code}</strong></span>
                      </>
                    )}
                  </button>

                  {/* Redeem & Book Button */}
                  <Button
                    asChild
                    className="flex-1 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white font-bold text-xs h-11 shadow-lg shadow-orange-500/20"
                  >
                    <Link href={deal.bookUrl} className="flex items-center justify-center gap-1.5">
                      <span>Redeem Deal</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Commercial & Multi-Unit Promo Banner (Buttons Placed Cleanly at the Bottom) */}
        <section className="mt-12 rounded-3xl border border-white/10 bg-gradient-to-r from-[#0F172A] via-[#1E293B]/60 to-[#0F172A] text-white p-8 sm:p-10 shadow-2xl space-y-6">
          <div className="space-y-2 max-w-2xl">
            <span className="text-xs font-bold text-[#F97316] uppercase tracking-widest block">
              Commercial &amp; Property Managers
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Manage Multiple Units or Commercial Rooftops?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              We offer volume pricing agreements, quarterly preventative maintenance contracts, and Net-30 terms for commercial accounts across {businessConfig.city}.
            </p>
          </div>

          <div className="pt-2 border-t border-white/10 flex flex-col sm:flex-row items-center gap-3">
            <Button
              asChild
              className="rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white font-bold text-xs h-12 px-6 shadow-lg shadow-orange-500/20 w-full sm:w-auto"
            >
              <Link href="/services/commercial-hvac">
                Commercial Programs
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="rounded-xl border-white/15 bg-white/5 hover:bg-white/10 text-white text-xs font-bold h-12 px-6 backdrop-blur-md w-full sm:w-auto"
            >
              <Link href="/contact">
                Request Fleet Quote
              </Link>
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}
