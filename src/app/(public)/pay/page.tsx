"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Search,
  ArrowRight,
  Receipt,
  FileText,
  Truck,
  Wrench,
  Smartphone,
  Building,
  DollarSign,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { businessConfig } from "@config/business.config";

export default function ServicePaymentPage() {
  const router = useRouter();
  const [lookupQuery, setLookupQuery] = React.useState("");
  const [lookupError, setLookupError] = React.useState(false);

  // Card on file form state
  const [cardName, setCardName] = React.useState("Maria Rivera");
  const [cardNumber, setCardNumber] = React.useState("4242 •••• •••• 4242");
  const [cardExpiry, setCardExpiry] = React.useState("08/28");
  const [cardCvc, setCardCvc] = React.useState("382");
  const [cardZip, setCardZip] = React.useState("33131");
  const [isSavingCard, setIsSavingCard] = React.useState(false);
  const [cardSavedSuccess, setCardSavedSuccess] = React.useState(false);

  const sampleWorkOrders = [
    {
      id: "WO-1004",
      token: "inv_demo_1",
      service: "AC Diagnostic & Capacitor Replacement",
      amount: "$349.00",
      status: "Ready for Payment",
      tech: "Carlos Mendez (Van #104)",
    },
    {
      id: "WO-1002",
      token: "inv_demo_1",
      service: "Comprehensive Seasonal AC Tune-Up",
      amount: "$189.00",
      status: "Ready for Payment",
      tech: "Marcus Vance (Van #102)",
    },
    {
      id: "WO-1005",
      token: "inv_demo_1",
      service: "Refrigerant Leak Repair & R-410A Recharge",
      amount: "$749.00",
      status: "Ready for Payment",
      tech: "Elena Rivera (Van #108)",
    },
  ];

  const handleLookupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lookupQuery.trim()) {
      setLookupError(true);
      return;
    }
    // Route directly to invoice payment
    router.push(`/pay/${encodeURIComponent(lookupQuery.trim().toLowerCase())}`);
  };

  const handleSaveCardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingCard(true);
    setTimeout(() => {
      setIsSavingCard(false);
      setCardSavedSuccess(true);
      setTimeout(() => setCardSavedSuccess(false), 4000);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#0C1523] text-white selection:bg-[#F97316] selection:text-white pb-20">
      <Breadcrumbs items={[{ label: "Payment Method of Work" }]} />

      {/* Hero Header */}
      <section className="relative overflow-hidden pt-12 pb-14 sm:py-16 border-b border-white/10">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#F97316]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10 space-y-4">
          <span className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#F97316]">
            <CreditCard className="w-3.5 h-3.5" />
            Field Service &amp; Labor Settlement Portal
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Payment Methods for Service Work
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Look up completed work orders, manage your primary payment method on file, or settle technician diagnostic &amp; repair invoices securely.
          </p>

          {/* SaaS Subscription vs Field Service Work Distinction Callout */}
          <div className="max-w-2xl mx-auto mt-4 p-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs text-slate-300 flex items-center justify-between gap-3 text-left">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-orange-400 shrink-0" />
              <span>
                Looking to subscribe your contractor fleet to the {businessConfig.businessName} software platform?
              </span>
            </div>
            <Link
              href="/subscribe"
              className="px-3.5 py-1.5 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white font-bold text-[11px] whitespace-nowrap transition-all shadow-sm shrink-0"
            >
              Subscription Plans &rarr;
            </Link>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 space-y-12">
        {/* Section 1: Work Order & Invoice Lookup */}
        <section className="bg-[#0F172A]/85 border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl relative overflow-hidden">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-400">
              Instant Online Invoice Settlement
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Look Up Work Order or Invoice
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Enter the Work Order ID or Invoice Token sent via SMS or printed on your technician&apos;s physical receipt.
            </p>

            <form onSubmit={handleLookupSubmit} className="max-w-xl mx-auto mt-6 flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={lookupQuery}
                  onChange={(e) => {
                    setLookupQuery(e.target.value);
                    setLookupError(false);
                  }}
                  placeholder="Enter WO# or token (e.g. WO-1004, inv_demo_1)"
                  className="w-full h-12 pl-11 pr-4 rounded-xl bg-white/5 border border-white/10 text-white text-xs sm:text-sm focus:ring-2 focus:ring-[#F97316] outline-none"
                />
              </div>
              <button
                type="submit"
                className="h-12 px-6 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shrink-0"
              >
                <span>Pay Invoice</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
            {lookupError && (
              <p className="text-xs text-red-400 font-semibold animate-shake">
                Please enter a Work Order # or Invoice Token to look up.
              </p>
            )}

            {/* Quick Demo Sample Work Orders */}
            <div className="pt-6 border-t border-white/10">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-3">
                Or inspect active demo service work orders:
              </span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-left">
                {sampleWorkOrders.map((wo) => (
                  <Link
                    key={wo.id}
                    href={`/pay/${wo.token}`}
                    className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-orange-500/40 transition-all group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-orange-400">#{wo.id}</span>
                        <span className="text-xs font-bold text-emerald-400">{wo.amount}</span>
                      </div>
                      <p className="text-xs text-slate-200 font-medium mt-1 group-hover:text-white line-clamp-1">
                        {wo.service}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{wo.tech}</p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-orange-400 font-semibold">
                      <span>View &amp; Pay Invoice</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Accepted Payment Methods Grid */}
        <section className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Accepted Payment Methods for Service Work
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Multiple secure ways to pay your technician on-site or settle online after service verification.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-[#0F172A]/70 border border-white/10 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-[#F97316] flex items-center justify-center border border-orange-500/30">
                <CreditCard className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Credit &amp; Debit Cards</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Visa, MasterCard, American Express, and Discover. Paid online or tapped directly at the technician van.
              </p>
              <span className="text-[11px] text-slate-400 block pt-1">256-Bit SSL Encrypted</span>
            </div>

            <div className="p-6 rounded-2xl bg-[#0F172A]/70 border border-white/10 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-[#F97316] flex items-center justify-center border border-orange-500/30">
                <Smartphone className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Apple Pay &amp; Google Pay</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Contactless tap-to-pay via NFC directly on the technician&apos;s mobile PWA tablet or through your invoice link.
              </p>
              <span className="text-[11px] text-slate-400 block pt-1">Instant Digital Receipt</span>
            </div>

            <div className="p-6 rounded-2xl bg-[#0F172A]/70 border border-white/10 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-[#F97316] flex items-center justify-center border border-orange-500/30">
                <Building className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Commercial Net-30 &amp; ACH</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Electronic bank transfer and direct invoicing terms for commercial facilities, property managers, and HOAs.
              </p>
              <span className="text-[11px] text-slate-400 block pt-1">Itemized ERP Sync</span>
            </div>

            <div className="p-6 rounded-2xl bg-[#0F172A]/70 border border-white/10 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-[#F97316] flex items-center justify-center border border-orange-500/30">
                <DollarSign className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Check / Physical Receipt</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Company checks and certified drafts accepted on-site with technician photo verification and logged digital sign-off.
              </p>
              <span className="text-[11px] text-slate-400 block pt-1">Logged with Job #</span>
            </div>
          </div>
        </section>

        {/* Section 3: Add / Update Payment Method on File */}
        <section className="bg-[#0F172A]/90 border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-orange-400">
                Seamless Service Booking
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                Save Payment Method on File
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Save your card for rapid dispatch holds and post-service payment. Your card is authorized for a temporary $20 diagnostic hold, which is 100% credited toward your repairs upon arrival.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-2.5 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Zero charges until technician arrives and verifies system</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Diagnostic fee credited toward any approved repair work</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Stripe PCI-DSS Level 1 tokenized encryption (no raw card data stored)</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 bg-black/40 border border-white/10 rounded-2xl p-6 sm:p-8 space-y-5">
              <form onSubmit={handleSaveCardSubmit} className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4 text-orange-400" /> Credit or Debit Card
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <span className="px-2 py-0.5 rounded bg-white/10 text-[10px] font-bold">Visa</span>
                    <span className="px-2 py-0.5 rounded bg-white/10 text-[10px] font-bold">MC</span>
                    <span className="px-2 py-0.5 rounded bg-white/10 text-[10px] font-bold">Amex</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Cardholder Name</label>
                  <input
                    type="text"
                    required
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    className="w-full h-10 px-3.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:ring-2 focus:ring-[#F97316] outline-none"
                    placeholder="Full Name as on card"
                  />
                </div>

                <div className="space-y-1.5">
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
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Expires</label>
                    <input
                      type="text"
                      required
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder="MM/YY"
                      className="w-full h-10 px-3.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono focus:ring-2 focus:ring-[#F97316] outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">CVC</label>
                    <input
                      type="text"
                      required
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      placeholder="CVC"
                      className="w-full h-10 px-3.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono focus:ring-2 focus:ring-[#F97316] outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">ZIP</label>
                    <input
                      type="text"
                      required
                      value={cardZip}
                      onChange={(e) => setCardZip(e.target.value)}
                      placeholder="33131"
                      className="w-full h-10 px-3.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono focus:ring-2 focus:ring-[#F97316] outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSavingCard}
                  className="w-full h-11 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
                >
                  {isSavingCard ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Securing Payment Method...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5" />
                      <span>Save Payment Method for Service Work</span>
                    </>
                  )}
                </button>

                {cardSavedSuccess && (
                  <p className="text-xs text-emerald-400 font-semibold text-center animate-in fade-in">
                    ✓ Payment method successfully updated for upcoming dispatches!
                  </p>
                )}
              </form>
            </div>
          </div>
        </section>

        {/* Section 4: Real-World Service Work Payment Protocols */}
        <section className="p-8 rounded-3xl bg-[#0F172A]/70 border border-white/10 space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl font-bold text-white">
              Service Work Payment Protocols &amp; Guarantees
            </h2>
            <p className="text-xs text-slate-300">
              How payments operate for on-site diagnostic, repair, and installation work.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-300">
            <div className="space-y-2 p-5 rounded-2xl bg-white/5 border border-white/10">
              <span className="font-bold text-white text-sm block text-[#F97316]">1. Upfront Estimate Approval</span>
              <p className="leading-relaxed">
                Technicians provide transparent Good / Better / Best estimates on their mobile tablet before any repair work commences. You approve every line item before wrenches turn.
              </p>
            </div>

            <div className="space-y-2 p-5 rounded-2xl bg-white/5 border border-white/10">
              <span className="font-bold text-white text-sm block text-[#F97316]">2. Post-Service Sign-Off</span>
              <p className="leading-relaxed">
                You only pay after physical verification of the repair (supply air delta-T temperature drops, amp draw verification) and you sign the work order completion receipt.
              </p>
            </div>

            <div className="space-y-2 p-5 rounded-2xl bg-white/5 border border-white/10">
              <span className="font-bold text-white text-sm block text-[#F97316]">3. 1-Year Automatic Warranty</span>
              <p className="leading-relaxed">
                All parts and labor settled through {businessConfig.businessName} automatically register a 1-year written warranty certificate accessible inside your Customer Portal.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
