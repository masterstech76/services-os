"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Building,
  User,
  Mail,
  Phone,
  Calendar,
  FileText,
  Download,
  AlertCircle,
} from "lucide-react";
import { businessConfig } from "@config/business.config";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface PlanTier {
  id: string;
  name: string;
  priceMonthly: number;
  priceAnnual: number;
  tagline: string;
  features: string[];
}

const TIERS: Record<string, PlanTier> = {
  starter: {
    id: "starter",
    name: "Starter Fleet",
    priceMonthly: 79,
    priceAnnual: 64,
    tagline: "Essential dispatching & mobile tools for 1-3 vans",
    features: [
      "Up to 3 Active Technician Vans",
      "Real-time GPS Dispatch Board",
      "Mobile PWA with Digital Signatures",
      "Stripe Automated Invoicing & Tap-to-Pay",
    ],
  },
  pro: {
    id: "pro",
    name: "Professional Fleet Operations",
    priceMonthly: 149,
    priceAnnual: 119,
    tagline: "Complete multi-truck operations & AI automation",
    features: [
      "Up to 10 Active Technician Vans",
      "AI Smart Route Optimization",
      "Truck Inventory & Parts Requisition",
      "Customer Portal with Live GPS Van Tracking",
      "Automated SMS Appointment Reminders",
    ],
  },
  enterprise: {
    id: "enterprise",
    name: "Enterprise Multi-Branch",
    priceMonthly: 299,
    priceAnnual: 239,
    tagline: "Unlimited multi-depot fleet management",
    features: [
      "Unlimited Technicians & Fleet Vans",
      "Custom ERP & QuickBooks Integration",
      "Dedicated 24/7 Priority VIP Dispatch Hotline",
      "Custom Subdomain & White-Label Branding",
    ],
  },
};

export default function SubscriptionCheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planParam = (searchParams.get("plan") || "pro").toLowerCase();
  const cycleParam = (searchParams.get("cycle") || "monthly").toLowerCase();

  const [selectedPlanId, setSelectedPlanId] = React.useState<string>(
    TIERS[planParam] ? planParam : "pro"
  );
  const [billingCycle, setBillingCycle] = React.useState<"monthly" | "annual">(
    cycleParam === "annual" ? "annual" : "monthly"
  );

  // Business Details Form State
  const [businessName, setBusinessName] = React.useState("");
  const [ownerName, setOwnerName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");

  // Card Details Form State
  const [cardName, setCardName] = React.useState("");
  const [cardNumber, setCardNumber] = React.useState("");
  const [cardExpiry, setCardExpiry] = React.useState("");
  const [cardCvc, setCardCvc] = React.useState("");
  const [cardZip, setCardZip] = React.useState("");
  const [agreeTerms, setAgreeTerms] = React.useState(true);

  // Processing Flow State
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [processStep, setProcessStep] = React.useState<number>(1);
  const [isSuccess, setIsSuccess] = React.useState(false);

  const selectedTier = TIERS[selectedPlanId] || TIERS.pro;
  const currentPrice =
    billingCycle === "annual"
      ? selectedTier.priceAnnual
      : selectedTier.priceMonthly;

  const handleStartTrial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeTerms) {
      toast.error("Please agree to the trial terms and subscription agreement.");
      return;
    }

    setIsProcessing(true);
    setProcessStep(1);

    // Step 1: Encrypting
    setTimeout(() => {
      setProcessStep(2);
    }, 1100);

    // Step 2: 3D Secure / Stripe
    setTimeout(() => {
      setProcessStep(3);
    }, 2200);

    // Step 3: Success
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      toast.success("14-Day Free Trial & Subscription Active!");
    }, 3200);
  };

  return (
    <div className="min-h-screen bg-[#0C1523] text-white selection:bg-[#F97316] selection:text-[#0C1523] pb-24">
      {/* ─────────────────────────────────────────────────────────────
          MINI-HEADER: Secure Checkout Header
      ───────────────────────────────────────────────────────────── */}
      <header className="border-b border-white/10 bg-[#080D16]/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/pricing" className="flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Plans</span>
          </Link>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full">
            <Lock className="w-3.5 h-3.5" />
            <span>256-Bit SSL Encrypted Checkout</span>
          </div>
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────
          MAIN CHECKOUT BODY
      ───────────────────────────────────────────────────────────── */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {isSuccess ? (
          /* ── SUCCESS RECEIPT VIEW ── */
          <div className="max-w-2xl mx-auto rounded-3xl border border-emerald-500/30 bg-[#0F172A]/90 backdrop-blur-xl p-8 sm:p-10 shadow-2xl space-y-6 text-center animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 rounded-full">
                Subscription Provisioned &bull; $0.00 Today
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Welcome to ServicePro OS Fleet!
              </h1>
              <p className="text-xs sm:text-sm text-slate-300">
                Your 14-day free trial on the <span className="font-bold text-white">{selectedTier.name}</span> is now active.
              </p>
            </div>

            <div className="rounded-2xl bg-black/40 border border-white/10 p-5 text-left text-xs space-y-2.5">
              <div className="flex justify-between pb-2 border-b border-white/10">
                <span className="text-slate-400">Subscription Token:</span>
                <span className="font-mono text-orange-400 font-bold">SUB-2026-90210</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Company:</span>
                <span className="font-bold text-white">{businessName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Card on File:</span>
                <span className="text-white">Visa •••• 4242 (Stripe Vault)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Today&apos;s Amount:</span>
                <span className="font-bold text-emerald-400 font-mono">$0.00 (14-Day Free Trial)</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-white/10">
                <span className="text-slate-400">First Billing Renewal:</span>
                <span className="text-white font-medium">14 days from today (${currentPrice}.00/{billingCycle === "annual" ? "mo billed annually" : "mo"})</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                onClick={() => router.push("/admin")}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-[#0C1523] font-bold text-xs shadow-lg shadow-orange-500/25 cursor-pointer"
              >
                <span>Launch Admin Operations Console</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push("/account/invoices")}
                className="w-full sm:w-auto px-5 py-3 rounded-xl border-white/15 bg-white/5 hover:bg-white/10 text-white text-xs font-semibold cursor-pointer"
              >
                <FileText className="w-4 h-4 mr-1.5 text-orange-400" />
                <span>Download Subscription Invoice</span>
              </Button>
            </div>
          </div>
        ) : (
          /* ── CHECKOUT GRID: SUMMARY + CARD INTAKE ── */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT: Plan Summary & Pricing Card */}
            <div className="lg:col-span-5 space-y-6">
              <div className="rounded-3xl border border-white/10 bg-[#0F172A]/85 backdrop-blur-xl p-6 sm:p-8 shadow-2xl space-y-6">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2.5 py-1 rounded-full">
                    SaaS Fleet License
                  </span>
                  <h2 className="text-2xl font-black text-white tracking-tight mt-2.5">
                    {selectedTier.name}
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">{selectedTier.tagline}</p>
                </div>

                {/* Plan Tier Switcher */}
                <div className="grid grid-cols-3 gap-1.5 bg-black/40 p-1.5 rounded-2xl border border-white/10 text-xs">
                  {Object.values(TIERS).map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setSelectedPlanId(t.id)}
                      className={`py-2 px-1 rounded-xl font-bold text-center transition-all cursor-pointer ${
                        selectedPlanId === t.id
                          ? "bg-[#F97316] text-[#0C1523] shadow-md font-black"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      <span className="block truncate">{t.name.split(" ")[0]}</span>
                    </button>
                  ))}
                </div>

                {/* Price Display */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs text-slate-400 font-semibold">Regular Rate:</span>
                    <div className="text-right">
                      <span className="text-2xl font-black text-white font-mono">${currentPrice}</span>
                      <span className="text-xs text-slate-400">/mo</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs pt-2 border-t border-white/10">
                    <span className="text-white font-bold">Due Today:</span>
                    <span className="font-bold text-emerald-400 font-mono text-sm">$0.00 (14-Day Free Trial)</span>
                  </div>
                </div>

                {/* Features Included */}
                <div className="space-y-2.5 pt-2">
                  <span className="text-xs font-bold text-white uppercase tracking-wider block">
                    What&apos;s Included in {selectedTier.name}:
                  </span>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {selectedTier.features.map((feat, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>Cancel anytime in 1 click from your Admin Portal. Zero questions asked.</span>
                </div>
              </div>
            </div>

            {/* RIGHT: Card Details & Checkout Form */}
            <div className="lg:col-span-7 rounded-3xl border border-white/10 bg-[#0F172A]/90 backdrop-blur-xl p-6 sm:p-8 shadow-2xl relative">
              
              {/* Payment Processing Overlay */}
              {isProcessing && (
                <div className="absolute inset-0 bg-[#0B111E]/95 backdrop-blur-md rounded-3xl z-30 flex flex-col items-center justify-center p-6 text-center space-y-5 animate-in fade-in">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full border-4 border-orange-500/20 border-t-orange-500 animate-spin flex items-center justify-center mx-auto" />
                    <CreditCard className="w-8 h-8 text-orange-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  </div>

                  <div className="space-y-2 max-w-sm">
                    <h3 className="text-xl font-bold text-white">
                      Processing Secure Subscription...
                    </h3>
                    <p className="text-xs text-slate-400">
                      Communicating with Stripe PaymentIntents &amp; PCI Vault
                    </p>
                  </div>

                  <div className="w-full max-w-xs space-y-2 text-left text-xs font-semibold">
                    <div className={`p-2 rounded-xl flex items-center gap-2 transition-all ${processStep >= 1 ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/30" : "text-slate-500"}`}>
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>1. Encrypting card token (256-bit SSL)</span>
                    </div>
                    <div className={`p-2 rounded-xl flex items-center gap-2 transition-all ${processStep >= 2 ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/30" : "text-slate-500"}`}>
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>2. Verifying Stripe 3D Secure Authorization</span>
                    </div>
                    <div className={`p-2 rounded-xl flex items-center gap-2 transition-all ${processStep >= 3 ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/30" : "text-slate-500"}`}>
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>3. Provisioning Fleet Operations Console</span>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleStartTrial} className="space-y-5">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    Start Your 14-Day Free Fleet Trial
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Enter business info and credit or debit card details to activate your software workspace.
                  </p>
                </div>

                {/* Company Information */}
                <div className="space-y-3 pt-2">
                  <span className="text-xs font-bold text-orange-400 uppercase tracking-wider block">
                    1. Contractor Business Details
                  </span>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-orange-400" /> Business / Company Name
                    </label>
                    <input
                      type="text"
                      required
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      className="w-full h-10 px-3.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:ring-2 focus:ring-[#F97316] outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-orange-400" /> Owner / Admin Name
                      </label>
                      <input
                        type="text"
                        required
                        value={ownerName}
                        onChange={(e) => setOwnerName(e.target.value)}
                        className="w-full h-10 px-3.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:ring-2 focus:ring-[#F97316] outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-orange-400" /> Dispatch Phone
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full h-10 px-3.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:ring-2 focus:ring-[#F97316] outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-orange-400" /> Admin Email (Login &amp; Invoices)
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full h-10 px-3.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:ring-2 focus:ring-[#F97316] outline-none"
                    />
                  </div>
                </div>

                {/* Card Details Section */}
                <div className="space-y-3 pt-3 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-orange-400 uppercase tracking-wider block">
                      2. Payment Card Details
                    </span>
                    <div className="flex items-center gap-1 text-[10px] text-slate-400">
                      <span className="px-1.5 py-0.5 rounded bg-white/10 font-bold">Visa</span>
                      <span className="px-1.5 py-0.5 rounded bg-white/10 font-bold">MC</span>
                      <span className="px-1.5 py-0.5 rounded bg-white/10 font-bold">Amex</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">Name on Card</label>
                    <input
                      type="text"
                      required
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      className="w-full h-10 px-3.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:ring-2 focus:ring-[#F97316] outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">Card Number</label>
                    <input
                      type="text"
                      required
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full h-10 px-3.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono focus:ring-2 focus:ring-[#F97316] outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-300">Expires</label>
                      <input
                        type="text"
                        required
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        maxLength={5}
                        className="w-full h-10 px-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono focus:ring-2 focus:ring-[#F97316] outline-none text-center"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-300">CVC</label>
                      <input
                        type="password"
                        required
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        maxLength={4}
                        className="w-full h-10 px-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono focus:ring-2 focus:ring-[#F97316] outline-none text-center"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-300">ZIP</label>
                      <input
                        type="text"
                        required
                        value={cardZip}
                        onChange={(e) => setCardZip(e.target.value)}
                        maxLength={10}
                        className="w-full h-10 px-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono focus:ring-2 focus:ring-[#F97316] outline-none text-center"
                      />
                    </div>
                  </div>
                </div>

                {/* Agreement Checkbox */}
                <div className="pt-2">
                  <label className="flex items-start gap-2.5 text-xs text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="mt-0.5 rounded text-[#F97316] focus:ring-[#F97316]"
                    />
                    <span>
                      I understand that <span className="font-bold text-white">$0.00 will be charged today</span> for the 14-day trial. After 14 days, my subscription continues at ${currentPrice}/mo unless cancelled.
                    </span>
                  </label>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full h-12 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-[#0C1523] font-bold text-sm shadow-xl shadow-orange-500/25 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  <span>Start 14-Day Free Trial &bull; $0.00 Due Today</span>
                </Button>

                <div className="pt-1 flex items-center justify-center gap-3 text-[11px] text-slate-500">
                  <span>Powered by Stripe</span>
                  <span>·</span>
                  <Link href="/privacy" className="hover:text-slate-300 transition-colors">
                    Privacy
                  </Link>
                  <span>·</span>
                  <Link href="/terms" className="hover:text-slate-300 transition-colors">
                    Terms
                  </Link>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
