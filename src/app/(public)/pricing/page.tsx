"use client";

import * as React from "react";
import Link from "next/link";
import {
  Check,
  Zap,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  CreditCard,
  Star,
  CheckCircle2,
  Calendar,
  Phone,
  Clock,
  Wrench,
  DollarSign,
  Truck,
} from "lucide-react";
import { businessConfig } from "@config/business.config";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { Button } from "@/components/ui/button";

interface ServiceRate {
  id: string;
  name: string;
  price: string;
  depositNote: string;
  tagline: string;
  popular: boolean;
  features: string[];
  bookUrl: string;
}

export default function PricingPage() {
  const cleanPhoneHref = `tel:${businessConfig.phone.replace(/\D/g, "")}`;

  const serviceRates: ServiceRate[] = [
    {
      id: "tuneup",
      name: "Precision AC Tune-Up",
      price: "$99",
      depositNote: "Flat rate per condenser system",
      tagline: "Comprehensive 24-point seasonal inspection & coil sanitization.",
      popular: false,
      features: [
        "24-point electrical & refrigerant safety check",
        "Evaporator & condenser coil surface rinse",
        "Capacitor, contactor & motor amp-draw testing",
        "Condensate drain line flush & algae tablet",
        "Airflow static pressure & temp-split check",
        "Detailed digital equipment condition report",
      ],
      bookUrl: "/book?service=svc-ac-tuneup",
    },
    {
      id: "diagnostic",
      name: "Standard Diagnostic & Estimate",
      price: "$129",
      depositNote: "100% credited toward completed repair",
      tagline: "On-site troubleshooting by a certified senior field technician.",
      popular: true,
      features: [
        "Complete electrical & thermodynamic troubleshooting",
        "Multi-stage compressor & inverter diagnosis",
        "Digital manifold gauge pressure analysis",
        "Itemized, upfront digital repair estimate",
        "100% diagnostic fee credited upon repair approval",
        "Fully stocked van ready for same-day repair",
      ],
      bookUrl: "/book?service=svc-ac-repair",
    },
    {
      id: "emergency",
      name: "24/7 Priority Emergency Dispatch",
      price: "$169",
      depositNote: "Sub-60 minute rapid arrival guarantee",
      tagline: "Immediate dispatch for total cooling loss, leaks, and electrical shorts.",
      popular: false,
      features: [
        "Priority emergency fleet dispatch queue",
        "Under-60 minute arrival window across all metro zones",
        "Live GPS en-route technician tracking",
        "Same-day emergency cooling restoration",
        "100% fee credited toward approved repair work",
        "No hidden weekend or late-night surcharges",
      ],
      bookUrl: "/book?service=svc-emergency-hvac",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0C1523] text-white selection:bg-[#F97316] selection:text-white pb-16">
      <Breadcrumbs items={[{ label: "Transparent Pricing" }]} />

      {/* Hero Header */}
      <section className="relative overflow-hidden pt-12 pb-14 sm:py-16 border-b border-white/10">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#F97316]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10 space-y-4">
          <span className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#F97316]">
            <Sparkles className="w-3.5 h-3.5" />
            100% Upfront Transparent Rates
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Fair, flat-rate pricing. Zero surprise invoices.
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Every diagnostic service is backed by our deposit credit guarantee: your diagnostic fee is <strong className="text-white">100% credited toward your completed repair</strong>.
          </p>
        </div>
      </section>

      {/* Customer Service Rates Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 sm:-mt-10 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {serviceRates.map((rate) => (
            <div
              key={rate.id}
              className={`rounded-2xl p-8 flex flex-col justify-between transition-all duration-300 relative backdrop-blur-xl ${
                rate.popular
                  ? "bg-[#0F172A]/90 border-2 border-[#F97316] shadow-2xl shadow-orange-500/20 scale-100 lg:-translate-y-3"
                  : "bg-[#0F172A]/70 border border-white/10 shadow-lg hover:border-white/20"
              }`}
            >
              {rate.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#F97316] text-white text-[11px] font-black px-4 py-1 rounded-full uppercase tracking-wider shadow-md">
                  Most Requested
                </div>
              )}

              <div>
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white tracking-tight">{rate.name}</h2>
                  {rate.popular && (
                    <span className="text-xs font-bold text-[#F97316] bg-orange-500/10 px-2.5 py-0.5 rounded-full border border-orange-500/20">
                      100% Credited
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-300 mt-2 min-h-[34px] leading-relaxed">
                  {rate.tagline}
                </p>

                <div className="mt-6 mb-6 pb-6 border-b border-white/10">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-4xl sm:text-5xl font-black text-white">
                      {rate.price}
                    </span>
                    <span className="text-sm font-semibold text-slate-400">
                      flat rate
                    </span>
                  </div>
                  <span className="text-xs text-emerald-400 font-semibold block mt-1.5">
                    {rate.depositNote}
                  </span>
                </div>

                <div className="space-y-3.5 mb-8">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                    Included with service:
                  </span>
                  {rate.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-3 text-xs text-slate-200">
                      <div className="w-4 h-4 rounded-full bg-orange-500/20 text-[#F97316] flex items-center justify-center shrink-0 mt-0.5 border border-orange-500/30">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                      <span className="leading-snug">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Button asChild size="lg" className={`w-full py-3.5 rounded-xl font-bold text-sm text-center transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer ${
                rate.popular
                  ? "bg-[#F97316] hover:bg-[#EA580C] text-white shadow-orange-500/25"
                  : "bg-white/10 hover:bg-white/15 text-white border border-white/15"
              }`}>
                <Link href={rate.bookUrl}>
                  <span>Book This Service</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          ))}
        </div>

        {/* Guarantees Strip */}
        <div className="mt-12 p-6 sm:p-8 rounded-2xl bg-[#0F172A]/70 border border-white/10 backdrop-blur-xl flex flex-wrap items-center justify-around gap-6 text-xs text-slate-200">
          <div className="flex items-center gap-2.5 font-semibold">
            <DollarSign className="w-5 h-5 text-[#F97316]" />
            <span>100% Diagnostic Fee Credited to Repair</span>
          </div>
          <div className="flex items-center gap-2.5 font-semibold">
            <ShieldCheck className="w-5 h-5 text-[#F97316]" />
            <span>30-Day Fixed-Right Guarantee</span>
          </div>
          <div className="flex items-center gap-2.5 font-semibold">
            <Clock className="w-5 h-5 text-[#F97316]" />
            <span>Sub-60 Minute Emergency Dispatch</span>
          </div>
          <div className="flex items-center gap-2.5 font-semibold">
            <CheckCircle2 className="w-5 h-5 text-[#F97316]" />
            <span>EPA &amp; NATE Certified Technicians</span>
          </div>
        </div>

        {/* Contractor Fleet Signpost Section */}
        <div className="mt-16 rounded-3xl bg-gradient-to-r from-blue-950/60 to-slate-900 border border-blue-500/30 p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="max-w-3xl space-y-4">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider">
              <Truck className="w-3.5 h-3.5" />
              Contractor Operations &amp; Fleet Management
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Are You an HVAC Contractor or Field Fleet Operator?
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              If you are looking for the software platform that powers dispatching, technician mobile PWAs, GPS tracking, and instant invoicing for service companies, explore ServicePro OS SaaS Fleet Subscriptions.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Button asChild size="lg" className="bg-[#F97316] hover:bg-[#EA580C] text-white font-bold px-6 rounded-xl">
                <Link href="/subscribe" className="flex items-center gap-2">
                  <span>Explore Contractor Fleet Plans &amp; Subscribe</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white/20 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-xl">
                <a href={cleanPhoneHref}>
                  <Phone className="w-4 h-4 mr-2 text-[#F97316]" />
                  Call Fleet Sales: {businessConfig.phone}
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
