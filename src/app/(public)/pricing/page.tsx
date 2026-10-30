"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Check,
  Zap,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  CreditCard,
  Star,
  CheckCircle2,
  Lock,
  Building,
  User,
  Mail,
  Phone,
  X,
} from "lucide-react";
import { businessConfig } from "@config/business.config";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { BrandTagline } from "@/components/brand/BrandTagline";

interface PlanItem {
  id: string;
  name: string;
  tagline: string;
  priceMonthly: number;
  priceAnnual: number;
  popular: boolean;
  features: string[];
  ctaText: string;
}

export default function PricingPage() {
  const router = useRouter();
  const [billingCycle, setBillingCycle] = React.useState<"monthly" | "annual">("monthly");
  const [activeModalPlan, setActiveModalPlan] = React.useState<PlanItem | null>(null);

  // Form State for In-Page 14-Day Trial Activation
  const [businessName, setBusinessName] = React.useState("");
  const [fullName, setFullName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [isActivating, setIsActivating] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);

  const plans: PlanItem[] = [
    {
      id: "starter",
      name: "Starter",
      tagline: "Essential tools for solo contractors & 1-2 technicians.",
      priceMonthly: 49,
      priceAnnual: 39,
      popular: false,
      features: [
        "Up to 2 technician licenses",
        "Self-service online booking wizard",
        "Mobile technician PWA with safety checklist",
        "Digital invoices & Stripe tap-to-pay",
        "Automated customer SMS reminders",
        "Standard email & chat support",
      ],
      ctaText: "Start 14-Day Free Trial",
    },
    {
      id: "pro",
      name: "Professional",
      tagline: "The complete operating system for growing service fleets.",
      priceMonthly: 149,
      priceAnnual: 119,
      popular: true,
      features: [
        "Up to 10 technician licenses",
        "AI-powered smart dispatch & GPS route matching",
        "Live customer Uber-style truck tracking & ETA",
        "Parts inventory tracking & truck stock deduction",
        "Automated 5-star Google review sequences",
        "Same-day Stripe payouts & coupon engine",
        "Priority 24/7 phone & live chat support",
      ],
      ctaText: "Start 14-Day Free Trial",
    },
    {
      id: "enterprise",
      name: "Enterprise",
      tagline: "Custom scale & dedicated controls for multi-location operations.",
      priceMonthly: 299,
      priceAnnual: 249,
      popular: false,
      features: [
        "Unlimited technician & dispatcher licenses",
        "Multi-branch & franchise territory routing",
        "Custom ERP & QuickBooks Desktop two-way sync",
        "Dedicated account manager & 1-on-1 onboarding",
        "Custom SLAs (99.99% uptime guarantee)",
        "Audit logs & role-based enterprise access",
      ],
      ctaText: "Start Enterprise Trial",
    },
  ];

  const handleOpenTrial = (plan: PlanItem) => {
    setActiveModalPlan(plan);
    setIsSuccess(false);
  };

  const handleActivateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsActivating(true);
    setTimeout(() => {
      setIsActivating(false);
      setIsSuccess(true);
      setTimeout(() => {
        router.push("/admin");
      }, 2000);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#0C1523] text-white selection:bg-[#F97316] selection:text-white pb-16">
      <Breadcrumbs items={[{ label: "Subscription Plans" }]} />

      {/* Hero Header */}
      <section className="relative overflow-hidden pt-12 pb-14 sm:py-16 border-b border-white/10">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#F97316]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10 space-y-4">
          <span className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#F97316]">
            <Sparkles className="w-3.5 h-3.5" />
            SaaS Fleet Subscription Plans
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Simple subscriptions that scale with your fleet.
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            All plans include a 14-day free trial, self-service customer booking, real-time GPS dispatching, and mobile field payments.
          </p>

          {/* Monthly vs Annual Toggle */}
          <div className="inline-flex items-center p-1.5 rounded-full bg-black/40 border border-white/10 text-xs mt-3">
            <button
              type="button"
              onClick={() => setBillingCycle("monthly")}
              className={`px-5 py-2 rounded-full font-bold transition-all ${
                billingCycle === "monthly"
                  ? "bg-[#F97316] text-white shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Monthly Billing
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle("annual")}
              className={`px-5 py-2 rounded-full font-bold transition-all flex items-center gap-1.5 ${
                billingCycle === "annual"
                  ? "bg-[#F97316] text-white shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <span>Annual Billing</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-extrabold uppercase border border-emerald-500/30">
                Save 20%
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Cards Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 sm:-mt-10 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {plans.map((p) => {
            const currentPrice = billingCycle === "monthly" ? p.priceMonthly : p.priceAnnual;
            return (
              <div
                key={p.id}
                className={`rounded-2xl p-8 flex flex-col justify-between transition-all duration-300 relative backdrop-blur-xl ${
                  p.popular
                    ? "bg-[#0F172A]/90 border-2 border-[#F97316] shadow-2xl shadow-orange-500/20 scale-100 lg:-translate-y-3"
                    : "bg-[#0F172A]/70 border border-white/10 shadow-lg hover:border-white/20"
                }`}
              >
                {p.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#F97316] text-white text-[11px] font-black px-4 py-1 rounded-full uppercase tracking-wider shadow-md">
                    Most Popular
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-white tracking-tight">{p.name}</h2>
                    {p.popular && (
                      <span className="text-xs font-bold text-[#F97316] bg-orange-500/10 px-2.5 py-0.5 rounded-full border border-orange-500/20">
                        Best Value
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-300 mt-2 min-h-[34px] leading-relaxed">
                    {p.tagline}
                  </p>

                  <div className="mt-6 mb-6 pb-6 border-b border-white/10">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-4xl sm:text-5xl font-black text-white">
                        ${currentPrice}
                      </span>
                      <span className="text-sm font-semibold text-slate-400">
                        / month
                      </span>
                    </div>
                    <span className="text-xs text-emerald-400 font-semibold block mt-1.5">
                      {billingCycle === "annual" ? "Billed annually (Save 20%)" : "Billed monthly (Cancel anytime)"}
                    </span>
                  </div>

                  <div className="space-y-3.5 mb-8">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                      Included with {p.name}:
                    </span>
                    {p.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-3 text-xs text-slate-200">
                        <div className="w-4 h-4 rounded-full bg-orange-500/20 text-[#F97316] flex items-center justify-center shrink-0 mt-0.5 border border-orange-500/30">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                        <span className="leading-snug">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleOpenTrial(p)}
                  className={`w-full py-3.5 rounded-xl font-bold text-sm text-center transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer ${
                    p.popular
                      ? "bg-[#F97316] hover:bg-[#EA580C] text-white shadow-orange-500/25"
                      : "bg-white/10 hover:bg-white/15 text-white border border-white/15"
                  }`}
                >
                  <span>{p.ctaText}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Guarantees Strip */}
        <div className="mt-12 p-6 sm:p-8 rounded-2xl bg-[#0F172A]/70 border border-white/10 backdrop-blur-xl flex flex-wrap items-center justify-around gap-6 text-xs text-slate-200">
          <div className="flex items-center gap-2.5 font-semibold">
            <ShieldCheck className="w-5 h-5 text-[#F97316]" />
            <span>14-Day Full-Feature Trial</span>
          </div>
          <div className="flex items-center gap-2.5 font-semibold">
            <CreditCard className="w-5 h-5 text-[#F97316]" />
            <span>$0.00 Due Today</span>
          </div>
          <div className="flex items-center gap-2.5 font-semibold">
            <Zap className="w-5 h-5 text-[#F97316]" />
            <span>Setup in Under 10 Minutes</span>
          </div>
          <div className="flex items-center gap-2.5 font-semibold">
            <Star className="w-5 h-5 text-[#F97316]" />
            <span>Cancel Anytime in 1 Click</span>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          IN-PAGE 14-DAY TRIAL ACTIVATION MODAL (No secondary subscription page needed)
      ───────────────────────────────────────────────────────────── */}
      {activeModalPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#0B111E] border border-white/15 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden text-white">
            <button
              onClick={() => setActiveModalPlan(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {isSuccess ? (
              <div className="text-center py-6 space-y-5 animate-in zoom-in-95">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-white">Fleet Subscription Active!</h3>
                  <p className="text-xs sm:text-sm text-slate-300">
                    Your 14-day free trial on the <span className="font-bold text-white">{activeModalPlan.name} Fleet Tier</span> is now provisioned with $0.00 charged today.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-400 text-left space-y-1">
                  <p>Admin Email: <span className="text-white font-medium">{email}</span></p>
                  <p>Billing Cycle: <span className="text-white font-medium capitalize">{billingCycle} (${billingCycle === "monthly" ? activeModalPlan.priceMonthly : activeModalPlan.priceAnnual}/mo)</span></p>
                </div>
                <p className="text-xs text-orange-400 font-semibold animate-pulse">
                  Redirecting to Admin Operations Console...
                </p>
              </div>
            ) : (
              <form onSubmit={handleActivateSubmit} className="space-y-5">
                <div className="space-y-1.5">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-[#F97316] text-[11px] font-bold uppercase tracking-wider">
                    <Sparkles className="w-3 h-3" />
                    14-Day Free Trial Intake
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white">
                    Activate {activeModalPlan.name} Tier
                  </h3>
                  <p className="text-xs text-slate-400">
                    Get instant full access to dispatching, technician apps, and automated invoicing.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-orange-500/10 border border-orange-500/25 flex items-center justify-between text-xs">
                  <span className="font-semibold text-white">Today&apos;s Charge</span>
                  <span className="font-bold text-emerald-400 text-sm">$0.00 (14-Day Trial)</span>
                </div>

                <div className="space-y-3.5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-orange-400" /> Business Name
                    </label>
                    <input
                      type="text"
                      required
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:ring-2 focus:ring-[#F97316] outline-none"
                      placeholder="e.g. Apex Cooling & Heating LLC"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-orange-400" /> Owner / Dispatcher
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full h-10 px-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:ring-2 focus:ring-[#F97316] outline-none"
                        placeholder="Full Name"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-orange-400" /> Phone
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full h-10 px-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:ring-2 focus:ring-[#F97316] outline-none"
                        placeholder="Phone Number"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-orange-400" /> Admin Email
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:ring-2 focus:ring-[#F97316] outline-none"
                      placeholder="admin@business.com"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isActivating}
                    className="w-full h-12 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white font-bold text-sm shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isActivating ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Provisioning Admin Console...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Activate 14-Day Free Trial ($0.00 Today)</span>
                      </>
                    )}
                  </button>
                  <p className="text-[11px] text-center text-slate-500 mt-2">
                    No contract lock-in. Cancel anytime with 1 click from Admin Settings.
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
