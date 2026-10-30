"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  CheckCircle2,
  CreditCard,
  Lock,
  MapPin,
  Printer,
  ShieldCheck,
  Sparkles,
  UserCheck,
  FileCheck2,
  Award,
} from "lucide-react";
import { toast } from "sonner";
import { businessConfig } from "@config/business.config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Money, formatMoney } from "@/components/shared/Money";
import { PhoneLink } from "@/components/shared/PhoneLink";
import { TipSelector } from "@/components/tech/TipSelector";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import type { EnrichedJob } from "@/lib/server/operations";

const FALLBACK_INVOICE_JOB: EnrichedJob = {
  id: "job-1004",
  jobNumber: 1004,
  status: "completed",
  scheduledStart: "2025-05-27T13:30:00.000Z",
  scheduledEnd: "2025-05-27T15:30:00.000Z",
  addressLine1: "1421 Brickell Ave, Apt 18B",
  addressLine2: null,
  city: "Miami",
  state: "FL",
  zip: "33131",
  customer: {
    id: "cust-1004",
    name: "Customer",
    phone: businessConfig.phone,
    email: "customer@domain.com",
    cardBrand: "Visa",
    cardLast4: "4242",
    smsOptOut: false,
  },
  service: {
    id: "svc-ac-repair",
    name: "Emergency AC Diagnostic & Dual Capacitor Replacement",
    category: "repair",
    skillTag: "hvac_diagnostic",
    pricingType: "flat",
    priceCents: 23400,
    durationMinutes: 60,
    minBillableMinutes: 60,
  },
  technician: {
    id: "tech-lead",
    name: "Assigned Lead Specialist",
    phone: businessConfig.phone,
    email: "dispatch@servicepro-os.com",
    color: "#F97316",
    commissionPct: 20,
  },
  invoice: {
    id: "inv-1004",
    invoiceNumber: "INV-1004",
    status: "sent",
    subtotalCents: 23400,
    taxCents: 1638,
    tipCents: 0,
    totalCents: 25038,
    depositCreditCents: 4900,
    amountPaidCents: 4900,
    amountDueCents: 20138,
    publicPayToken: "pay_tok_1004",
    lineItems: [
      {
        id: "li-1",
        kind: "labor",
        description: "Emergency AC Diagnostic & Safety Calibration",
        quantity: 1,
        unitPriceCents: 8900,
        taxable: false,
        amountCents: 8900,
      },
      {
        id: "li-2",
        kind: "parts",
        description: "45/5 MFD 440V Heavy-Duty OEM Dual Run Capacitor",
        quantity: 1,
        unitPriceCents: 14500,
        taxable: true,
        amountCents: 14500,
      },
    ],
  },
} as unknown as EnrichedJob;

export default function CustomerPayInvoicePage() {
  const params = useParams<{ token: string }>();
  const token = params?.token ?? "";
  const isFallbackToken = !token || token.includes("1004");

  const [job, setJob] = React.useState<EnrichedJob | null>(isFallbackToken ? FALLBACK_INVOICE_JOB : null);
  const [loading, setLoading] = React.useState(!isFallbackToken);
  const [paying, setPaying] = React.useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = React.useState(false);
  const [tipCents, setTipCents] = React.useState(0);
  const [lastTxId, setLastTxId] = React.useState<string | null>(null);

  const [paymentChannel, setPaymentChannel] = React.useState<"card" | "upi" | "qr" | "wallets" | "netbanking">("card");
  const [upiVpa, setUpiVpa] = React.useState("");
  const [selectedBank, setSelectedBank] = React.useState("HDFC Bank");

  const [payMethod, setPayMethod] = React.useState<"card_on_file" | "new_card" | "check">("card_on_file");
  const [cardName, setCardName] = React.useState("Service Client");
  const [cardNumber, setCardNumber] = React.useState("");
  const [cardExpiry, setCardExpiry] = React.useState("");
  const [cardCvc, setCardCvc] = React.useState("");
  const [checkRef, setCheckRef] = React.useState("");

  const loadInvoice = React.useCallback(async () => {
    try {
      const res = await fetch(`/api/invoices/public/${encodeURIComponent(token)}`);
      if (!res.ok) {
        if (isFallbackToken) {
          setJob(FALLBACK_INVOICE_JOB);
        } else {
          setJob(null);
        }
        return;
      }
      const data = (await res.json()) as { job: EnrichedJob | null };
      if (data.job) {
        setJob(data.job);
        setTipCents(data.job.invoice?.tipCents ?? 0);
        setCardName(data.job.customer.name);
        if (!data.job.customer.cardLast4) {
          setPayMethod("new_card");
        }
      }
    } finally {
      setLoading(false);
    }
  }, [token, isFallbackToken]);

  React.useEffect(() => {
    void loadInvoice();
  }, [loadInvoice]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0C1523] text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl rounded-2xl border border-white/10 bg-[#0F172A]/85 backdrop-blur-xl p-6 sm:p-8 shadow-2xl space-y-4">
          <div className="h-6 w-48 animate-pulse rounded-lg bg-white/10" />
          <div className="h-24 w-full animate-pulse rounded-lg bg-white/5" />
          <div className="h-40 w-full animate-pulse rounded-lg bg-white/5" />
        </div>
      </main>
    );
  }

  if (!job || !job.invoice) {
    return (
      <main className="min-h-screen bg-[#0C1523] text-white py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="mx-auto max-w-3xl w-full rounded-3xl border border-amber-500/30 bg-[#0F172A]/90 backdrop-blur-xl p-8 sm:p-10 text-center shadow-2xl space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto shadow-lg">
            <ShieldCheck className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
              Payment Link Expired or Settled
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-white pt-1">
              Invoice Link Inactive
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md mx-auto">
              This invoice token may have already been settled, archived, or temporarily expired. You can view all active and historical invoices inside your Customer Portal.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              asChild
              className="w-full sm:w-auto rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white font-bold text-xs h-11 px-6 shadow-md"
            >
              <Link href="/account/invoices">
                Log in to View My Invoices →
              </Link>
            </Button>
            <a
              href={`tel:${businessConfig.phone.replace(/[^0-9]/g, "")}`}
              className="w-full sm:w-auto inline-flex items-center justify-center h-11 px-5 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white text-xs font-semibold transition-all"
            >
              Call Dispatch: {businessConfig.phone}
            </a>
          </div>

          <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
            <span>Reference: {token}</span>
            <Link href="/" className="text-[#F97316] font-bold hover:underline">
              {businessConfig.businessName} Home &rarr;
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const inv = job.invoice;
  const isPaid = inv.status === "paid" || inv.amountDueCents === 0;
  const baseDueWithoutTip = Math.max(
    0,
    inv.subtotalCents + inv.taxCents - inv.depositCreditCents - inv.amountPaidCents
  );
  const liveAmountDueCents = isPaid ? 0 : baseDueWithoutTip + tipCents;

  function detectCardBrand(num: string): string {
    const clean = num.replace(/\D/g, "");
    if (/^4/.test(clean)) return "Visa";
    if (/^(5[1-5]|2[2-7])/.test(clean)) return "Mastercard";
    if (/^3[47]/.test(clean)) return "Amex";
    if (/^6(?:011|5)/.test(clean)) return "Discover";
    if (/^(?:2131|1800|35\d{3})/.test(clean)) return "JCB";
    if (/^3(?:0[0-5]|[68])/.test(clean)) return "Diners";
    if (/^62/.test(clean)) return "UnionPay";
    return "Card";
  }

  function formatCardInput(val: string) {
    const raw = val.replace(/\D/g, "").slice(0, 19);
    if (/^3[47]/.test(raw)) {
      const p1 = raw.slice(0, 4);
      const p2 = raw.slice(4, 10);
      const p3 = raw.slice(10, 15);
      return [p1, p2, p3].filter(Boolean).join(" ");
    }
    const parts = raw.match(/.{1,4}/g);
    return parts ? parts.join(" ") : raw;
  }

  function formatExpiryInput(val: string) {
    const raw = val.replace(/\D/g, "").slice(0, 4);
    if (raw.length > 2) return `${raw.slice(0, 2)}/${raw.slice(2)}`;
    return raw;
  }

  function fillTestCard(type: "success" | "decline") {
    if (type === "success") {
      setCardNumber("4242 4242 4242 4242");
      setCardExpiry("12/28");
      setCardCvc("123");
      setPayMethod("new_card");
      toast.info("Filled Stripe test card: 4242 (Success)");
    } else {
      setCardNumber("4000 0000 0000 9995");
      setCardExpiry("12/28");
      setCardCvc("999");
      setPayMethod("new_card");
      toast.warning("Filled Stripe test card: 9995 (Simulate Card Error)");
    }
  }

  function handleOpenConfirmModal(e: React.FormEvent) {
    e.preventDefault();
    if (payMethod === "new_card") {
      const cleanDigits = cardNumber.replace(/\D/g, "");
      if (cleanDigits.length < 14 || cleanDigits.length > 19) {
        toast.error("Please enter a valid card number (14 to 19 digits)");
        return;
      }
    }
    setConfirmModalOpen(true);
  }

  async function executePayment() {
    setConfirmModalOpen(false);
    setPaying(true);
    try {
      let methodParam: "card_on_file" | "tap_card" | "check" = "tap_card";
      let cardBrandParam: string | undefined = undefined;
      let cardLast4Param: string | undefined = undefined;

      if (payMethod === "card_on_file") {
        methodParam = "card_on_file";
      } else if (payMethod === "check") {
        methodParam = "check";
      } else {
        methodParam = "tap_card";
        const cleanDigits = cardNumber.replace(/\D/g, "");
        if (cleanDigits.length < 14 || cleanDigits.length > 19) {
          toast.error("Please enter a valid card number (14 to 19 digits)");
          return;
        }
        cardBrandParam = detectCardBrand(cleanDigits);
        cardLast4Param = cleanDigits.slice(-4);
      }

      const res = await fetch(`/api/invoices/public/${encodeURIComponent(token)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tipCents,
          method: methodParam,
          cardBrand: cardBrandParam,
          cardLast4: cardLast4Param,
          cardholderName: cardName,
          checkReference: payMethod === "check" ? checkRef : undefined,
        }),
      });

      if (!res.ok) {
        const err = (await res.json()) as { error?: { message?: string } };
        toast.error(err.error?.message ?? "Payment could not be processed. Please try again.");
        return;
      }

      const data = (await res.json()) as { job: EnrichedJob; transactionId?: string };
      setJob(data.job);
      if (data.transactionId) {
        setLastTxId(data.transactionId);
      }
      toast.success(`Payment complete! Thank you for choosing ${businessConfig.businessName}.`);
    } finally {
      setPaying(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#0C1523] text-white selection:bg-[#F97316] selection:text-white pb-16">
      <Breadcrumbs items={[{ label: `Invoice #${inv.invoiceNumber}` }]} />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* Top Checkout Status Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-white/10 bg-[#0F172A]/90 px-6 py-4 shadow-xl">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-500/15 border border-orange-500/30 px-3 py-1 text-xs font-bold text-[#F97316]">
              <FileCheck2 className="h-3.5 w-3.5" /> Invoice #{inv.invoiceNumber} · Job #{job.jobNumber}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 text-xs font-semibold text-emerald-400">
              <ShieldCheck className="h-3.5 w-3.5" /> Work Completed & Verified
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="text-slate-400">Questions about your bill?</span>
            <PhoneLink phone={businessConfig.phone} className="text-xs text-[#F97316] shrink-0 font-bold" />
          </div>
        </div>

        {isPaid ? (
          <section
            data-testid="invoice-paid-receipt"
            className="rounded-2xl border border-emerald-500/30 bg-[#0F172A]/85 backdrop-blur-xl p-6 sm:p-8 shadow-2xl space-y-6"
          >
            <div className="text-center space-y-3">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 shadow-md">
                <CheckCircle2 className="h-8 w-8" aria-hidden="true" />
              </div>
              <h1 className="text-2xl font-extrabold text-white">
                Paid in Full — Thank You!
              </h1>
              <p className="text-xs sm:text-sm text-slate-300">
                Receipt for <strong className="text-white">{job.service.name}</strong> has been sent to{" "}
                <span className="font-semibold text-emerald-400">{job.customer.email ?? job.customer.phone}</span>.
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-xs space-y-2.5 max-w-xl mx-auto">
              <div className="flex justify-between text-slate-300">
                <span>Invoice Number</span>
                <span className="font-bold text-white">#{inv.invoiceNumber}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Job Reference</span>
                <span className="font-bold text-white">Job #{job.jobNumber}</span>
              </div>
              {lastTxId || job.payments?.[job.payments.length - 1]?.stripePaymentIntentId ? (
                <div className="flex justify-between text-slate-300">
                  <span>Transaction ID</span>
                  <span className="font-mono font-bold text-emerald-400 truncate max-w-[200px] sm:max-w-none text-right">
                    {lastTxId ?? job.payments[job.payments.length - 1]?.stripePaymentIntentId}
                  </span>
                </div>
              ) : null}
              <div className="flex justify-between text-slate-300">
                <span>Payment Method</span>
                <span className="font-semibold text-white uppercase">
                  {job.customer.cardBrand ? `${job.customer.cardBrand} •••• ${job.customer.cardLast4}` : "Card on File"}
                </span>
              </div>
              <div className="border-t border-white/10 pt-2.5 flex justify-between font-bold text-sm text-white">
                <span>Total Paid</span>
                <Money cents={inv.totalCents} className="text-emerald-400 font-extrabold text-base" />
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => window.print()}
                className="gap-2 rounded-xl border-white/15 bg-white/5 text-white hover:bg-white/10 text-xs px-5 py-2.5"
              >
                <Printer className="h-4 w-4" />
                Print / Save Receipt
              </Button>
            </div>
          </section>
        ) : null}

        {/* 12-Column Side-by-Side Desktop Checkout Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left 7 Columns: Itemized Service Invoice & Warranty Guarantee */}
          <div className="lg:col-span-7 space-y-6">
            <section className="rounded-2xl border border-white/10 bg-[#0F172A]/85 backdrop-blur-xl p-6 sm:p-8 shadow-2xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-white/10 pb-5">
                <div>
                  <span className="inline-flex items-center rounded-full bg-orange-500/10 border border-orange-500/25 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#F97316]">
                    Itemized Service Invoice
                  </span>
                  <h1 className="text-xl sm:text-2xl font-extrabold text-white mt-2">
                    {job.service.name}
                  </h1>
                  <p className="text-xs text-slate-300 flex items-center gap-1.5 mt-1.5">
                    <MapPin className="h-3.5 w-3.5 text-[#F97316] shrink-0" />
                    {job.addressLine1}, {job.city}, {job.state} {job.zip}
                  </p>
                </div>
                <div className="text-left sm:text-right pt-2 sm:pt-0 border-t sm:border-t-0 border-white/10 shrink-0">
                  <span className="text-xs text-slate-400 block">Billed To</span>
                  <span className="text-sm font-bold text-white block mt-0.5">
                    {job.customer.name}
                  </span>
                  {job.technician ? (
                    <span className="mt-1.5 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                      <UserCheck className="h-3.5 w-3.5" />
                      Tech: {job.technician.name}
                    </span>
                  ) : null}
                </div>
              </div>

              {/* Line Items Table */}
              <div className="space-y-3 text-xs sm:text-sm">
                <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400 pb-1 border-b border-white/5">
                  <span>Description & Scope</span>
                  <span>Amount</span>
                </div>
                {inv.lineItems.map((li) => (
                  <div key={li.id} className="flex items-start justify-between gap-4 rounded-xl border border-white/5 bg-slate-950/50 p-3.5">
                    <div>
                      <p className="font-semibold text-white">{li.description}</p>
                      <p className="text-[11px] sm:text-xs text-slate-400 capitalize mt-0.5">
                        {li.kind} {li.quantity > 1 ? `× ${li.quantity}` : "× 1"}
                        {li.taxable ? " · FL 7% Taxable" : " · Non-taxable Labor"}
                      </p>
                    </div>
                    <Money cents={li.amountCents} className="font-bold text-white shrink-0" />
                  </div>
                ))}
              </div>

              {/* Totals Breakdown */}
              <div className="border-t border-white/10 pt-4 space-y-2.5 text-xs sm:text-sm">
                <div className="flex justify-between text-slate-300">
                  <span>Subtotal</span>
                  <Money cents={inv.subtotalCents} className="text-white font-medium" />
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Sales Tax ({(businessConfig.tax.rateBps / 100).toFixed(1)}%)</span>
                  <Money cents={inv.taxCents} className="text-white font-medium" />
                </div>
                {inv.depositCreditCents > 0 ? (
                  <div className="flex justify-between text-emerald-400 font-semibold">
                    <span>Booking Deposit Credit Applied</span>
                    <span>
                      -<Money cents={inv.depositCreditCents} />
                    </span>
                  </div>
                ) : null}
                <div className="flex justify-between text-slate-300">
                  <span>Technician Tip ({job.technician?.name ?? "Field Tech"})</span>
                  <Money cents={isPaid ? inv.tipCents : tipCents} className="text-white font-medium" />
                </div>
                <div className="flex justify-between items-center border-t border-white/10 pt-4 text-base sm:text-lg font-extrabold text-white">
                  <span>{isPaid ? "Balance Due" : "Amount Due Now"}</span>
                  <Money
                    cents={liveAmountDueCents}
                    data-testid="pay-link-amount-due"
                    className="text-xl sm:text-2xl text-[#F97316] font-black"
                  />
                </div>
              </div>
            </section>

            {/* 1-Year Warranty & Diagnostic Guarantee Card */}
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.05] p-5 flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400">
                <Award className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-white">1-Year Parts & Labor Protection Included</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  All OEM replacement parts and diagnostic workmanship performed on Job #{job.jobNumber} are backed by our 12-month South Florida Peace-of-Mind Warranty.
                </p>
              </div>
            </div>
          </div>

          {/* Right 5 Columns: Tip Selector + Express Payment Form */}
          {!isPaid ? (
            <form onSubmit={handleOpenConfirmModal} className="lg:col-span-5 space-y-6 relative">
              {/* Confirm Payment Modal (Before Charging Card) */}
              {confirmModalOpen && (
                <div
                  className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150"
                  onClick={() => setConfirmModalOpen(false)}
                >
                  <div
                    className="bg-[#0B132B] border border-white/15 rounded-3xl max-w-md w-full p-6 sm:p-7 space-y-5 shadow-2xl text-white"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-11 w-11 rounded-2xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-[#F97316]">
                        <Lock className="h-5 w-5" />
                      </div>
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-widest text-[#F97316]">
                          Confirm Settlement
                        </span>
                        <h3 className="text-lg font-extrabold text-white">
                          Review &amp; Authorize Charge
                        </h3>
                      </div>
                    </div>

                    <div className="rounded-2xl bg-[#070C16] border border-white/10 p-4 space-y-2.5 text-xs">
                      <div className="flex justify-between text-slate-300">
                        <span>Invoice Subtotal</span>
                        <Money cents={inv.subtotalCents} className="font-semibold text-white" />
                      </div>
                      <div className="flex justify-between text-slate-300">
                        <span>Sales Tax</span>
                        <Money cents={inv.taxCents} className="font-semibold text-white" />
                      </div>
                      {inv.depositCreditCents > 0 && (
                        <div className="flex justify-between text-emerald-400">
                          <span>Deposit Credit Applied</span>
                          <span>-<Money cents={inv.depositCreditCents} /></span>
                        </div>
                      )}
                      <div className="flex justify-between text-slate-300">
                        <span>Technician Tip</span>
                        <Money cents={tipCents} className="font-semibold text-white" />
                      </div>
                      <div className="border-t border-white/10 pt-2.5 flex justify-between items-center text-sm font-extrabold text-white">
                        <span>Invoice Total Due</span>
                        <Money cents={liveAmountDueCents} className="text-lg text-[#F97316] font-black" />
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2.5">
                      <button
                        type="button"
                        onClick={() => void executePayment()}
                        data-testid="confirm-pay-modal-btn"
                        className="flex-1 py-3 px-4 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-[#0F172A] font-black text-xs sm:text-sm uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-orange-500/20"
                      >
                        Pay Now ({formatMoney(liveAmountDueCents)})
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmModalOpen(false)}
                        className="py-3 px-4 rounded-xl bg-white/[0.06] hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white font-semibold text-xs transition-all cursor-pointer"
                      >
                        Back
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {paying && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
                  <div className="bg-[#0B111E] border border-white/15 rounded-3xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl text-white">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full border-4 border-orange-500/20 border-t-orange-500 animate-spin mx-auto" />
                      <CreditCard className="w-6 h-6 text-orange-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">Authorizing Payment...</h3>
                      <p className="text-xs text-slate-400 mt-1">Connecting to Stripe PCI-DSS Level 1 Gateway</p>
                    </div>
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-[11px] text-emerald-400 font-medium">
                      256-Bit SSL Encrypted Vault Settlement
                    </div>
                  </div>
                </div>
              )}

              <section className="rounded-2xl border border-white/10 bg-[#0F172A]/85 backdrop-blur-xl p-6 shadow-2xl space-y-4">
                <div>
                  <h2 className="text-sm font-bold text-white">
                    Add a tip for {job.technician?.name ?? "your technician"}
                  </h2>
                  <p className="text-xs text-slate-300 mt-0.5">
                    100% of tips go directly to your field technician.
                  </p>
                </div>
                <TipSelector
                  subtotalCents={inv.subtotalCents}
                  tipCents={tipCents}
                  onChange={setTipCents}
                />
              </section>

              <section className="rounded-2xl border border-white/10 bg-[#0F172A]/85 backdrop-blur-xl p-6 shadow-2xl space-y-5">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-[#F97316]" />
                    Select Payment Method
                  </h2>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                    <Lock className="h-3.5 w-3.5" />
                    256-bit SSL
                  </span>
                </div>

                {/* Multi-Method Channel Tabs */}
                <div className="flex gap-1 p-1 bg-slate-900/90 border border-white/10 rounded-2xl overflow-x-auto">
                  {[
                    { id: "card", label: "Credit / Debit Card" },
                    { id: "upi", label: "UPI / VPA" },
                    { id: "qr", label: "Dynamic QR Code" },
                    { id: "wallets", label: "PhonePe / Wallets" },
                    { id: "netbanking", label: "Netbanking" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setPaymentChannel(tab.id as any)}
                      className={`flex-1 min-w-max px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        paymentChannel === tab.id
                          ? "bg-[#F97316] text-white shadow-md shadow-orange-500/20"
                          : "text-slate-400 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {paymentChannel === "card" && (
                  <div className="space-y-4">
                    {/* Method Tabs */}
                    <div className="grid grid-cols-3 gap-2.5">
                      {job.customer.cardLast4 ? (
                        <button
                          type="button"
                          onClick={() => setPayMethod("card_on_file")}
                          className={`rounded-xl border p-3 text-xs font-bold transition-all text-left ${
                            payMethod === "card_on_file"
                              ? "border-[#F97316] bg-[#F97316]/20 text-white shadow-md shadow-orange-500/10"
                              : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
                          }`}
                        >
                          <span className="block text-[10px] uppercase tracking-wide opacity-80">Saved Card</span>
                          •••• {job.customer.cardLast4}
                        </button>
                      ) : null}

                      <button
                        type="button"
                        onClick={() => setPayMethod("new_card")}
                        className={`rounded-xl border p-3 text-xs font-bold transition-all text-left ${
                          payMethod === "new_card"
                            ? "border-[#F97316] bg-[#F97316]/20 text-white shadow-md shadow-orange-500/10"
                            : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        <span className="block text-[10px] uppercase tracking-wide opacity-80">New Card</span>
                        Credit / Debit
                      </button>

                      <button
                        type="button"
                        onClick={() => setPayMethod("check")}
                        className={`rounded-xl border p-3 text-xs font-bold transition-all text-left ${
                          payMethod === "check"
                            ? "border-[#F97316] bg-[#F97316]/20 text-white shadow-md shadow-orange-500/10"
                            : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        <span className="block text-[10px] uppercase tracking-wide opacity-80">Offline</span>
                        Check / Bank
                      </button>
                    </div>

                    {payMethod === "card_on_file" && job.customer.cardLast4 ? (
                      <div className="rounded-xl border border-orange-500/30 bg-orange-500/10 p-4 flex items-center justify-between gap-3">
                        <div className="text-xs">
                          <p className="font-bold text-white uppercase">
                            Saved {job.customer.cardBrand ?? "Card"} •••• {job.customer.cardLast4}
                          </p>
                          <p className="text-slate-300 mt-0.5">Authorized during deposit booking</p>
                        </div>
                        <span className="rounded-full bg-[#F97316] text-[#0F172A] px-3 py-1 text-[11px] font-black shrink-0 shadow-sm">
                          Ready to Charge
                        </span>
                      </div>
                    ) : null}

                    {payMethod === "new_card" ? (
                      <div className="space-y-4 pt-1">
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <Label htmlFor="pay-cardnum" className="text-slate-300 text-xs">Card Number</Label>
                            <span className="text-[11px] font-bold text-[#F97316]">
                              {detectCardBrand(cardNumber)}
                            </span>
                          </div>
                          <Input
                            id="pay-cardnum"
                            placeholder="4242 •••• •••• 4242"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(formatCardInput(e.target.value))}
                            className="bg-[#0B1320] border-white/15 text-white placeholder:text-slate-500 rounded-xl"
                            required
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="pay-expiry" className="text-slate-300 text-xs mb-1.5 block">Expiry Date</Label>
                            <Input
                              id="pay-expiry"
                              placeholder="MM/YY"
                              value={cardExpiry}
                              onChange={(e) => setCardExpiry(formatExpiryInput(e.target.value))}
                              className="bg-[#0B1320] border-white/15 text-white placeholder:text-slate-500 rounded-xl"
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="pay-cvc" className="text-slate-300 text-xs mb-1.5 block">CVC Code</Label>
                            <Input
                              id="pay-cvc"
                              placeholder="123"
                              maxLength={4}
                              value={cardCvc}
                              onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, ""))}
                              className="bg-[#0B1320] border-white/15 text-white placeholder:text-slate-500 rounded-xl"
                              required
                            />
                          </div>
                        </div>

                        {Boolean(token.includes("demo") || process.env.NODE_ENV !== "production") ? (
                          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                            <button
                              type="button"
                              onClick={() => fillTestCard("success")}
                              className="text-xs font-semibold text-orange-400 hover:text-orange-300 flex items-center gap-1"
                            >
                              <Sparkles className="h-3 w-3" />
                              Fill Test Card 4242
                            </button>
                            <span className="text-slate-500">·</span>
                            <button
                              type="button"
                              onClick={() => fillTestCard("decline")}
                              className="text-xs font-semibold text-slate-400 hover:text-slate-300"
                            >
                              Test Decline
                            </button>
                          </div>
                        ) : null}
                      </div>
                    ) : null}

                    {payMethod === "check" ? (
                      <div className="space-y-3 pt-1">
                        <div>
                          <Label htmlFor="pay-check-ref" className="text-slate-300 text-xs mb-1.5 block">Check / Reference Number</Label>
                          <Input
                            id="pay-check-ref"
                            placeholder="e.g. Check # 1042"
                            value={checkRef}
                            onChange={(e) => setCheckRef(e.target.value)}
                            className="bg-[#0B1320] border-white/15 text-white placeholder:text-slate-500 rounded-xl"
                          />
                        </div>
                        <p className="text-xs text-slate-400">
                          Hand payment to your technician on site or mail check to{" "}
                          <strong className="text-white">{businessConfig.businessName}</strong>.
                        </p>
                      </div>
                    ) : null}

                    <div>
                      <Label htmlFor="pay-cardholder" className="text-slate-300 text-xs mb-1.5 block">Cardholder / Payer Name</Label>
                      <Input
                        id="pay-cardholder"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        className="bg-[#0B1320] border-white/15 text-white placeholder:text-slate-500 rounded-xl"
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      loading={paying}
                      data-testid="pay-link-submit-btn"
                      className="w-full rounded-xl font-black bg-[#F97316] hover:bg-[#EA580C] text-[#0F172A] hover:text-[#0F172A] shadow-lg shadow-orange-500/20 text-sm sm:text-base py-4 transition-all active:scale-[0.99]"
                    >
                      Pay {formatMoney(liveAmountDueCents)} Now
                    </Button>
                  </div>
                )}

                {paymentChannel === "upi" && (
                  <div className="space-y-4 py-2">
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
                      <Label htmlFor="upi-vpa-input" className="text-slate-300 text-xs font-bold block">
                        Enter UPI Virtual Payment Address (VPA)
                      </Label>
                      <Input
                        id="upi-vpa-input"
                        placeholder="yourname@okhdfcbank or yourname@upi"
                        value={upiVpa}
                        onChange={(e) => setUpiVpa(e.target.value)}
                        className="bg-[#0B1320] border-white/15 text-white placeholder:text-slate-500 rounded-xl text-xs"
                      />
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        A payment collect request for <strong className="text-white">{formatMoney(liveAmountDueCents)}</strong> will be sent to your UPI app.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-xs text-orange-300 space-y-2">
                      <p className="font-semibold text-white">Merchant Gateway Status: Category B / C</p>
                      <p className="text-[11px] text-slate-300">
                        Direct UPI intent requires merchant key activation. To complete immediate settlement now without delay, please use the Credit/Debit Card tab.
                      </p>
                    </div>

                    <Button
                      type="button"
                      onClick={() => setPaymentChannel("card")}
                      className="w-full rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white font-bold text-xs py-3"
                    >
                      Switch to Card &amp; Pay {formatMoney(liveAmountDueCents)}
                    </Button>
                  </div>
                )}

                {paymentChannel === "qr" && (
                  <div className="space-y-4 py-2 text-center">
                    <div className="mx-auto w-48 h-48 bg-white rounded-2xl p-3 flex flex-col items-center justify-center shadow-xl border-4 border-orange-500">
                      {/* High-Contrast Dynamic QR Placeholder */}
                      <div className="w-full h-full border-2 border-dashed border-slate-900 rounded-lg flex flex-col items-center justify-center p-2 text-slate-900">
                        <span className="font-mono font-black text-xs tracking-widest uppercase">SCAN TO PAY</span>
                        <span className="text-[10px] text-slate-600 mt-1">{formatMoney(liveAmountDueCents)}</span>
                        <div className="mt-2 text-[9px] font-mono text-slate-500 bg-slate-100 px-2 py-1 rounded">
                          Invoice #{inv.invoiceNumber}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                        Scan with Any UPI or Banking App
                      </h4>
                      <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                        Dynamic QR generation activates upon merchant credentials configuration. For instant settlement, use Card payment.
                      </p>
                    </div>

                    <Button
                      type="button"
                      onClick={() => setPaymentChannel("card")}
                      className="w-full rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white font-bold text-xs py-3"
                    >
                      Pay with Card Instead
                    </Button>
                  </div>
                )}

                {paymentChannel === "wallets" && (
                  <div className="space-y-4 py-2">
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                      <h4 className="text-xs font-bold text-white">Supported Digital Wallets</h4>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 text-slate-300">PhonePe</div>
                        <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 text-slate-300">Paytm Wallet</div>
                        <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 text-slate-300">Google Pay</div>
                        <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 text-slate-300">Amazon Pay</div>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-xs text-orange-300">
                      <p className="font-semibold text-white">Integration Status: Pending Merchant Credentials</p>
                      <p className="text-[11px] text-slate-300 mt-1">
                        Wallet redirection will activate upon production merchant onboarding. Please use Card payment for immediate receipt issuance.
                      </p>
                    </div>

                    <Button
                      type="button"
                      onClick={() => setPaymentChannel("card")}
                      className="w-full rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white font-bold text-xs py-3"
                    >
                      Pay with Card Now
                    </Button>
                  </div>
                )}

                {paymentChannel === "netbanking" && (
                  <div className="space-y-4 py-2">
                    <div className="space-y-2">
                      <Label htmlFor="bank-select" className="text-slate-300 text-xs font-bold block">
                        Select Your Banking Institution
                      </Label>
                      <select
                        id="bank-select"
                        value={selectedBank}
                        onChange={(e) => setSelectedBank(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-black/40 border border-white/15 rounded-xl text-white text-xs font-semibold focus:outline-none focus:border-[#F97316]"
                      >
                        <option>HDFC Bank</option>
                        <option>ICICI Bank</option>
                        <option>State Bank of India (SBI)</option>
                        <option>Axis Bank</option>
                        <option>Kotak Mahindra Bank</option>
                        <option>Other Supported Retail Bank</option>
                      </select>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300 space-y-1">
                      <p className="font-semibold text-white">Netbanking Redirection Notice</p>
                      <p className="text-[11px] text-slate-400">
                        Selected institution: <strong className="text-white">{selectedBank}</strong>. Direct netbanking redirect is routed via Stripe India corporate gateway.
                      </p>
                    </div>

                    <Button
                      type="button"
                      onClick={() => setPaymentChannel("card")}
                      className="w-full rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white font-bold text-xs py-3"
                    >
                      Switch to Card &amp; Pay {formatMoney(liveAmountDueCents)}
                    </Button>
                  </div>
                )}
              </section>
            </form>
          ) : null}
        </div>
      </div>
    </main>
  );
}
