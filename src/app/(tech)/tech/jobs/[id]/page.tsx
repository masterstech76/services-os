"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { formatInTimeZone } from "date-fns-tz";
import {
  ArrowLeft,
  Camera,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  CreditCard,
  ExternalLink,
  FileText,
  MapPin,
  Navigation,
  Package,
  Phone,
  Plus,
  Send,
  Trash2,
  Wallet,
  X,
  Sparkles,
  Wrench,
} from "lucide-react";
import { toast } from "sonner";
import { businessConfig } from "@config/business.config";
import { computeInvoiceTotals } from "@/lib/domain/pricing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Money, formatMoney } from "@/components/shared/Money";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { TipSelector } from "@/components/tech/TipSelector";
import type { EnrichedJob } from "@/lib/server/operations";
import type { JobStatus } from "@/lib/supabase/types";

interface DraftPartItem {
  id: string;
  description: string;
  priceCents: number;
}

const DEFAULT_FALLBACK_JOB: EnrichedJob = {
  id: "job-1002",
  jobNumber: 1002,
  status: "in_progress",
  scheduledStart: "2025-05-27T13:30:00.000Z",
  scheduledEnd: "2025-05-27T15:30:00.000Z",
  addressLine1: "1421 Brickell Ave, Suite 400",
  city: "Miami",
  state: "FL",
  zip: "33131",
  customerNotes: "AC blowing warm air since yesterday afternoon. Call box code #4491, park in visitor bay 12.",
  techNotes: "Inspected rooftop condenser unit. Found swollen 45/5 MFD dual run capacitor and pitted contactor.",
  beforePhotos: [],
  afterPhotos: [],
  customer: {
    id: "cust-2",
    name: "Sofia Martinez",
    phone: "(XXX) XXX-XXXX",
    email: "sofia.m@brickell.com",
  },
  service: {
    id: "svc-ac-repair",
    name: "Emergency AC Diagnostic & Capacitor Repair",
    slug: "ac-repair",
    category: "Repair",
    priceType: "diagnostic",
    basePriceCents: 8900,
    diagnosticFeeCents: 8900,
  },
  invoice: null,
} as unknown as EnrichedJob;

export default function TechJobDetailPage() {
  const params = useParams<{ id: string }>();
  const jobId = params?.id ?? "";

  const [job, setJob] = React.useState<EnrichedJob | null>(DEFAULT_FALLBACK_JOB);
  const [loading, setLoading] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const [techNotes, setTechNotes] = React.useState(DEFAULT_FALLBACK_JOB.techNotes ?? "");
  const [showCheckoutModal, setShowCheckoutModal] = React.useState(false);
  const [checkoutStep, setCheckoutStep] = React.useState<1 | 2 | 3>(1);
  const [parts, setParts] = React.useState<DraftPartItem[]>([
    { id: "pt_default_1", description: "45/5 MFD 440V Dual Run Capacitor (OEM)", priceCents: 14500 },
  ]);
  const [newPartName, setNewPartName] = React.useState("");
  const [newPartDollars, setNewPartDollars] = React.useState("");
  const [tipCents, setTipCents] = React.useState(0);

  const loadJob = React.useCallback(async () => {
    try {
      const res = await fetch(`/api/jobs/${encodeURIComponent(jobId)}`);
      if (!res.ok) return;
      const data = (await res.json()) as { job: EnrichedJob };
      if (data.job) {
        setJob(data.job);
        setTechNotes(data.job.techNotes ?? "");
        if (data.job.invoice) {
          const existingParts = data.job.invoice.lineItems
            .filter((li) => li.kind === "parts")
            .map((li) => ({
              id: li.id,
              description: li.description,
              priceCents: li.amountCents,
            }));
          setParts(existingParts);
          setTipCents(data.job.invoice.tipCents);
        }
      }
    } finally {
      setLoading(false);
    }
  }, [jobId]);

  React.useEffect(() => {
    void loadJob();
  }, [loadJob]);

  if (loading || !job) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-36 animate-pulse rounded bg-white/5 border border-white/5" />
        <div className="h-44 animate-pulse rounded-2xl bg-white/5 border border-white/5" />
        <div className="h-44 animate-pulse rounded-2xl bg-white/5 border border-white/5" />
      </div>
    );
  }

  const tz = businessConfig.timezone;
  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    `${job.addressLine1}, ${job.city}, ${job.state} ${job.zip}`
  )}`;

  const liveLineItems = [
    {
      kind: "labor" as const,
      description: `${job.service.name} Labor`,
      quantity: 1,
      unitPriceCents: job.service.priceCents,
      taxable: false,
    },
    ...parts.map((p) => ({
      kind: "parts" as const,
      description: p.description,
      quantity: 1,
      unitPriceCents: p.priceCents,
      taxable: true,
    })),
  ];

  const liveTotals = computeInvoiceTotals({
    pricingType: job.service.pricingType,
    servicePriceCents: job.service.priceCents,
    minBillableMinutes: job.service.minBillableMinutes,
    parts: parts.map((p) => ({
      description: p.description,
      quantity: 1,
      unitPriceCents: p.priceCents,
      taxable: true,
    })),
    taxRateBps: businessConfig.tax.rateBps,
    taxAppliesTo: businessConfig.tax.appliesTo,
    depositPaidCents: job.depositCents,
    customTipCents: tipCents,
  });

  async function advanceJobStatus(toStatus: JobStatus) {
    if (!job) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/jobs/${job.id}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toStatus,
          actor: "technician",
          note: techNotes,
        }),
      });
      const data = (await res.json()) as {
        job?: EnrichedJob;
        error?: { message: string };
      };
      if (!res.ok || !data.job) {
        toast.error(data.error?.message ?? "Could not update job status");
        return;
      }
      setJob(data.job);
      toast.success(
        toStatus === "on_the_way"
          ? "Status: On The Way — ETA SMS sent to customer!"
          : `Status updated to ${toStatus.replace(/_/g, " ")}`
      );
    } finally {
      setBusy(false);
    }
  }

  async function handleCaptureFieldPhoto(kind: "before" | "after") {
    if (!job) return;
    const svgBadge =
      "data:image/svg+xml;utf8," +
      encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="#0C1523"/><rect x="40" y="40" width="320" height="220" rx="16" stroke="#F97316" stroke-width="6" fill="#0F172A"/><text x="200" y="155" text-anchor="middle" fill="#FFFFFF" font-family="sans-serif" font-size="20" font-weight="bold">${kind.toUpperCase()} PHOTO #${job.jobNumber}</text></svg>`
      );
    const updatedList =
      kind === "before"
        ? [...job.beforePhotos, svgBadge]
        : [...job.afterPhotos, svgBadge];

    const res = await fetch(`/api/jobs/${job.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(
        kind === "before"
          ? { beforePhotos: updatedList }
          : { afterPhotos: updatedList }
      ),
    });
    const data = (await res.json()) as { job?: EnrichedJob };
    if (data.job) {
      setJob(data.job);
      toast.success(`Captured ${kind} photo`);
    }
  }

  function handleAddPartToDraft(e: React.FormEvent) {
    e.preventDefault();
    const cents = Math.round(Number(newPartDollars) * 100);
    if (!newPartName.trim() || !Number.isFinite(cents) || cents <= 0) {
      toast.error("Enter part name and price");
      return;
    }
    setParts((prev) => [
      ...prev,
      {
        id: `pt_${Date.now()}`,
        description: newPartName.trim(),
        priceCents: cents,
      },
    ]);
    setNewPartName("");
    setNewPartDollars("");
  }

  async function finalizeAndCollectPayment(
    method: "card_on_file" | "tap_card" | "cash" | "check" | "send_pay_link" | "bill_later"
  ) {
    if (!job) return;
    setBusy(true);
    try {
      // First save invoice line items + tip
      await fetch(`/api/jobs/${job.id}/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lineItems: liveLineItems,
          tipCents,
          techNotes,
        }),
      });

      // Then collect payment & complete job
      const finRes = await fetch(`/api/jobs/${job.id}/finish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          method,
          tipCents,
        }),
      });
      const data = (await finRes.json()) as {
        job?: EnrichedJob;
        payLinkUrl?: string;
      };
      if (data.job) {
        setJob(data.job);
        setShowCheckoutModal(false);
        toast.success(
          method === "send_pay_link"
            ? "Payment link sent via SMS and job completed!"
            : "Job completed and payment recorded!"
        );
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Link
          href="/tech"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Today’s Route
        </Link>
        <span className="font-mono text-xs font-bold text-orange-400">
          Job #{job.jobNumber}
        </span>
      </div>

      {/* Main Job Info Card */}
      <section className="rounded-2xl border border-white/10 bg-[#0F172A]/85 backdrop-blur-xl p-5 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <StatusBadge status={job.status} />
          <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-orange-400" />
            {formatInTimeZone(new Date(job.scheduledStart), tz, "h:mm a")} –{" "}
            {formatInTimeZone(new Date(job.scheduledEnd), tz, "h:mm a")}
          </span>
        </div>

        <div>
          <h1 className="text-xl font-black text-white tracking-tight">{job.service.name}</h1>
          <p className="text-sm font-semibold text-orange-400 mt-0.5">
            {job.customer.name}
          </p>
        </div>

        <p className="text-xs text-slate-400 flex items-center gap-1.5">
          <MapPin className="h-4 w-4 text-orange-400 shrink-0" />
          {job.addressLine1}, {job.city}, {job.state} {job.zip}
        </p>

        {/* Quick Call & Navigate Buttons */}
        <div className="grid grid-cols-2 gap-2.5 pt-1">
          <a
            href={`tel:${job.customer.phone}`}
            className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-2.5 text-xs font-bold text-white hover:bg-white/10 transition-colors"
          >
            <Phone className="h-4 w-4 text-emerald-400" />
            Call Customer
          </a>
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-2.5 text-xs font-bold text-white hover:bg-white/10 transition-colors"
          >
            <Navigation className="h-4 w-4 text-sky-400" />
            Navigate
            <ExternalLink className="h-3 w-3 text-slate-400" />
          </a>
        </div>
      </section>

      {/* Field Operations Shortcuts */}
      <section className="grid grid-cols-3 gap-2">
        <Link
          href={`/tech/jobs/${job.id}/checklist`}
          className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-[#0F172A]/85 backdrop-blur-xl p-3 text-center transition-all hover:border-orange-500/40 hover:bg-orange-500/10 shadow-lg"
        >
          <ClipboardCheck className="h-5 w-5 text-orange-400 mb-1" />
          <span className="text-xs font-bold text-white">Checklist</span>
          <span className="text-[10px] text-slate-400">10-Pt Safety</span>
        </Link>
        <Link
          href={`/tech/jobs/${job.id}/estimate`}
          className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-[#0F172A]/85 backdrop-blur-xl p-3 text-center transition-all hover:border-blue-500/40 hover:bg-blue-500/10 shadow-lg"
        >
          <FileText className="h-5 w-5 text-sky-400 mb-1" />
          <span className="text-xs font-bold text-white">Estimate</span>
          <span className="text-[10px] text-slate-400">On-Site Quote</span>
        </Link>
        <Link
          href={`/tech/jobs/${job.id}/parts`}
          className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-[#0F172A]/85 backdrop-blur-xl p-3 text-center transition-all hover:border-white/20 hover:bg-white/10 shadow-lg"
        >
          <Package className="h-5 w-5 text-emerald-400 mb-1" />
          <span className="text-xs font-bold text-white">Van Parts</span>
          <span className="text-[10px] text-slate-400">Truck Stock</span>
        </Link>
      </section>

      {/* Equipment Diagnostic Profile */}
      <section className="rounded-2xl border border-white/10 bg-[#0F172A]/85 backdrop-blur-xl p-4 shadow-xl space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wrench className="w-4 h-4 text-orange-400" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Installed Equipment &amp; System Specs
            </h2>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            Verified Equipment
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1 text-xs">
          <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
            <span className="text-[10px] text-slate-400 block font-semibold uppercase">Unit Spec</span>
            <span className="text-white font-bold block mt-0.5">Carrier 3.5 Ton</span>
            <span className="text-slate-400 text-[10px]">16 SEER Heat Pump</span>
          </div>
          <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
            <span className="text-[10px] text-slate-400 block font-semibold uppercase">Serial Number</span>
            <span className="text-white font-bold font-mono block mt-0.5">CR-882194</span>
            <span className="text-slate-400 text-[10px]">Model 25HPB642</span>
          </div>
          <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
            <span className="text-[10px] text-slate-400 block font-semibold uppercase">Refrigerant</span>
            <span className="text-emerald-400 font-bold block mt-0.5">R-410A Puron</span>
            <span className="text-slate-400 text-[10px]">Factory: 9.8 lbs</span>
          </div>
          <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
            <span className="text-[10px] text-slate-400 block font-semibold uppercase">Air Filter</span>
            <span className="text-white font-bold block mt-0.5">20 x 25 x 4</span>
            <span className="text-slate-400 text-[10px]">MERV 11 Pleated</span>
          </div>
        </div>
      </section>

      {/* Customer Reported Issue */}
      <section className="rounded-2xl border border-white/10 bg-[#0F172A]/85 backdrop-blur-xl p-4 shadow-xl space-y-2">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Reported Issue & Dispatcher Notes
        </h2>
        <p className="text-sm text-slate-200">
          {job.issueText || "Standard service visit."}
        </p>
        {job.notesInternal ? (
          <p className="rounded-xl bg-orange-500/10 border border-orange-500/20 p-2.5 text-xs text-orange-300">
            <strong>Dispatch Note:</strong> {job.notesInternal}
          </p>
        ) : null}
      </section>

      {/* Before / After Field Photos */}
      <section className="rounded-2xl border border-white/10 bg-[#0F172A]/85 backdrop-blur-xl p-4 shadow-xl space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Field Documentation Photos
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => void handleCaptureFieldPhoto("before")}
            data-testid="capture-before-photo-btn"
            className="flex flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-white/15 bg-[#080D16] p-3.5 text-xs font-semibold text-white hover:border-orange-500 transition-colors"
          >
            <Camera className="h-5 w-5 text-orange-400" />
            <span>+ Before Photo ({job.beforePhotos.length})</span>
          </button>
          <button
            type="button"
            onClick={() => void handleCaptureFieldPhoto("after")}
            data-testid="capture-after-photo-btn"
            className="flex flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-white/15 bg-[#080D16] p-3.5 text-xs font-semibold text-white hover:border-emerald-500 transition-colors"
          >
            <Camera className="h-5 w-5 text-emerald-400" />
            <span>+ After Photo ({job.afterPhotos.length})</span>
          </button>
        </div>
      </section>

      {/* Technician Field Notes */}
      <section className="rounded-2xl border border-white/10 bg-[#0F172A]/85 backdrop-blur-xl p-4 shadow-xl space-y-2">
        <Label htmlFor="tech-field-notes" className="text-xs font-bold text-slate-300">
          Technician Service Notes
        </Label>
        <Textarea
          id="tech-field-notes"
          rows={2}
          placeholder="Document readings, psi, parts replaced..."
          value={techNotes}
          onChange={(e) => setTechNotes(e.target.value)}
          className="border-white/10 bg-[#080D16] text-white focus:border-orange-500"
        />
      </section>

      {/* Completed Summary if already completed */}
      {job.status === "completed" && job.invoice ? (
        <section
          data-testid="tech-job-completed-banner"
          className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-400">
              <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              Job Completed
            </span>
            <Money
              cents={job.invoice.totalCents}
              className="text-base font-bold text-emerald-400"
            />
          </div>
          <p className="text-xs text-emerald-300">
            Invoice #{job.invoice.invoiceNumber} ({job.invoice.status.toUpperCase()})
            · Tip: <Money cents={job.invoice.tipCents} />
          </p>
        </section>
      ) : null}

      {/* Sticky 56px Bottom ActionBar */}
      {job.status !== "completed" && job.status !== "cancelled" ? (
        <div className="fixed bottom-0 inset-x-0 z-30 border-t border-white/10 bg-[#0F172A]/90 backdrop-blur-xl p-3 shadow-2xl">
          <div className="mx-auto w-full max-w-[1600px] px-1 sm:px-3 lg:px-5">
            {job.status === "assigned" ? (
              <Button
                type="button"
                size="lg"
                loading={busy}
                data-testid="tech-action-on-the-way"
                onClick={() => void advanceJobStatus("on_the_way")}
                className="w-full bg-[#F97316] hover:bg-orange-600 text-[#0C1523] font-bold shadow-lg shadow-orange-500/20"
              >
                Start Route · Send ETA SMS ▶
              </Button>
            ) : job.status === "on_the_way" ? (
              <Button
                type="button"
                size="lg"
                loading={busy}
                data-testid="tech-action-start-job"
                onClick={() => void advanceJobStatus("in_progress")}
                className="w-full bg-[#F97316] hover:bg-orange-600 text-[#0C1523] font-bold shadow-lg shadow-orange-500/20"
              >
                Arrived at Address · Start Job ▶
              </Button>
            ) : (
              <Button
                type="button"
                size="lg"
                data-testid="tech-action-open-checkout"
                onClick={() => {
                  setCheckoutStep(1);
                  setShowCheckoutModal(true);
                }}
                className="w-full bg-[#F97316] hover:bg-orange-600 text-[#0C1523] font-bold shadow-lg shadow-orange-500/20"
              >
                Complete & Collect Payment ▶
              </Button>
            )}
          </div>
        </div>
      ) : null}

      {/* 3-Step Completion & Payment Modal */}
      {showCheckoutModal ? (
        <div
          role="dialog"
          aria-modal="true"
          data-testid="tech-checkout-modal"
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-md p-0 sm:p-4"
        >
          <div className="w-full max-w-md rounded-t-3xl sm:rounded-3xl bg-[#0F172A] border border-white/10 p-5 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-orange-400">
                  Step {checkoutStep} of 3
                </span>
                <h2 className="text-base font-bold text-white">
                  {checkoutStep === 1
                    ? "Review Labor & Add Parts"
                    : checkoutStep === 2
                    ? "Customer Tip Selection"
                    : "Collect Remaining Balance"}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setShowCheckoutModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {checkoutStep === 1 ? (
              <div className="space-y-4">
                <div className="rounded-xl border border-white/10 bg-[#080D16] p-3 space-y-2 text-sm">
                  <div className="flex justify-between font-medium text-white">
                    <span>{job.service.name} Labor</span>
                    <Money cents={job.service.priceCents} />
                  </div>
                  {parts.map((pt) => (
                    <div
                      key={pt.id}
                      className="flex items-center justify-between text-slate-300"
                    >
                      <span className="text-xs">
                        {pt.description}{" "}
                        <span className="text-slate-500">(Part · Taxable)</span>
                      </span>
                      <div className="flex items-center gap-2">
                        <Money cents={pt.priceCents} className="text-xs font-semibold text-white" />
                        <button
                          type="button"
                          onClick={() =>
                            setParts((prev) => prev.filter((x) => x.id !== pt.id))
                          }
                          className="text-rose-400 hover:text-rose-300"
                          aria-label="Remove part"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Part Form */}
                <form
                  onSubmit={handleAddPartToDraft}
                  className="rounded-xl border border-white/10 bg-[#080D16]/50 p-3 space-y-2.5"
                >
                  <span className="text-xs font-bold text-white block">
                    + Add Replacement Part (7% FL Sales Tax Applies)
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-2">
                      <Input
                        placeholder="Dual Run Capacitor"
                        data-testid="tech-part-name-input"
                        value={newPartName}
                        onChange={(e) => setNewPartName(e.target.value)}
                        className="border-white/10 bg-[#080D16] text-white"
                      />
                    </div>
                    <div>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="120"
                        data-testid="tech-part-price-input"
                        value={newPartDollars}
                        onChange={(e) => setNewPartDollars(e.target.value)}
                        className="border-white/10 bg-[#080D16] text-white"
                      />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    size="sm"
                    variant="secondary"
                    data-testid="tech-add-part-btn"
                    className="w-full gap-1 border-white/10 bg-white/5 hover:bg-white/10 text-white"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add Part to Invoice
                  </Button>
                </form>

                {/* Live Math Preview */}
                <div className="border-t border-white/10 pt-3 space-y-1 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Subtotal</span>
                    <Money cents={liveTotals.subtotalCents} className="text-white" />
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Parts Tax (7.0%)</span>
                    <Money
                      cents={liveTotals.taxCents}
                      data-testid="tech-live-tax"
                      className="text-white"
                    />
                  </div>
                  <div className="flex justify-between text-emerald-400 font-medium">
                    <span>Deposit Credit</span>
                    <span>
                      -<Money cents={liveTotals.depositPaidCents} />
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-white pt-1">
                    <span>Balance Before Tip</span>
                    <Money cents={liveTotals.amountDueCents} />
                  </div>
                </div>

                <Button
                  type="button"
                  size="lg"
                  data-testid="tech-checkout-next-step2"
                  onClick={() => setCheckoutStep(2)}
                  className="w-full bg-[#F97316] hover:bg-orange-600 text-[#0C1523] font-bold shadow-lg shadow-orange-500/20"
                >
                  Next: Customer Tip →
                </Button>
              </div>
            ) : checkoutStep === 2 ? (
              <div className="space-y-4">
                <p className="text-xs text-slate-300">
                  Hand phone to <strong className="text-white">{job.customer.name}</strong> or select tip
                  preference on pre-tax subtotal (
                  <Money cents={liveTotals.subtotalCents} className="text-orange-400" />
                  ):
                </p>

                <TipSelector
                  subtotalCents={liveTotals.subtotalCents}
                  tipCents={tipCents}
                  onChange={setTipCents}
                />

                <div className="rounded-xl bg-[#080D16] border border-white/10 p-3 flex items-center justify-between text-sm font-bold text-white">
                  <span>Final Amount Due Now</span>
                  <Money
                    cents={liveTotals.amountDueCents}
                    data-testid="tech-final-due"
                    className="text-base text-orange-400 font-mono"
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    size="md"
                    onClick={() => setCheckoutStep(1)}
                    className="border-white/10 bg-white/5 hover:bg-white/10 text-white"
                  >
                    ← Back
                  </Button>
                  <Button
                    type="button"
                    size="lg"
                    data-testid="tech-checkout-next-step3"
                    onClick={() => setCheckoutStep(3)}
                    className="flex-1 bg-[#F97316] hover:bg-orange-600 text-[#0C1523] font-bold shadow-lg shadow-orange-500/20"
                  >
                    Continue to Payment →
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="rounded-xl bg-[#080D16] border border-white/10 p-3.5 flex items-center justify-between">
                  <span className="text-xs text-slate-400">Collect Balance</span>
                  <Money
                    cents={liveTotals.amountDueCents}
                    className="text-lg font-bold text-orange-400 font-mono"
                  />
                </div>

                <div className="space-y-2">
                  <Button
                    type="button"
                    size="lg"
                    loading={busy}
                    data-testid="tech-pay-card-on-file"
                    onClick={() => void finalizeAndCollectPayment("card_on_file")}
                    className="w-full justify-between bg-[#F97316] hover:bg-orange-600 text-[#0C1523] font-bold shadow-lg shadow-orange-500/20"
                  >
                    <span className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      Charge Saved Card ({job.customer.cardBrand ?? "Visa"} ••••{" "}
                      {job.customer.cardLast4 ?? "4242"})
                    </span>
                    <span>{formatMoney(liveTotals.amountDueCents)}</span>
                  </Button>

                  <Button
                    type="button"
                    variant="secondary"
                    size="md"
                    loading={busy}
                    onClick={() => void finalizeAndCollectPayment("tap_card")}
                    className="w-full justify-start gap-2 border-white/10 bg-white/5 hover:bg-white/10 text-white"
                  >
                    <CreditCard className="h-4 w-4 text-slate-400" />
                    Tap / Enter New Card on Device
                  </Button>

                  <Button
                    type="button"
                    variant="secondary"
                    size="md"
                    loading={busy}
                    data-testid="tech-pay-send-link"
                    onClick={() => void finalizeAndCollectPayment("send_pay_link")}
                    className="w-full justify-start gap-2 border-white/10 bg-white/5 hover:bg-white/10 text-white"
                  >
                    <Send className="h-4 w-4 text-orange-400" />
                    Text Payment Link to {job.customer.phone}
                  </Button>

                  <Button
                    type="button"
                    variant="secondary"
                    size="md"
                    loading={busy}
                    data-testid="tech-pay-cash"
                    onClick={() => void finalizeAndCollectPayment("cash")}
                    className="w-full justify-start gap-2 border-white/10 bg-white/5 hover:bg-white/10 text-white"
                  >
                    <Wallet className="h-4 w-4 text-emerald-400" />
                    Record Cash / Check Collected
                  </Button>
                </div>

                <button
                  type="button"
                  onClick={() => setCheckoutStep(2)}
                  className="text-xs font-semibold text-slate-400 hover:text-white pt-1 block"
                >
                  ← Back to Tip
                </button>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
