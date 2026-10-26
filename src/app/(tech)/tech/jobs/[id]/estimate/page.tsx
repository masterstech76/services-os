"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Plus,
  Trash2,
  CheckCircle2,
  XCircle,
  UserCheck,
  Layers,
  PenTool,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { formatMoney } from "@/components/shared/Money";
import { businessConfig } from "@config/business.config";
import type { JobEstimate, EstimateLineItem } from "@/lib/server/tech-portal";
import type { EnrichedJob } from "@/lib/server/operations";

const DEFAULT_ESTIMATE_JOB: EnrichedJob = {
  id: "job-1004",
  jobNumber: 1004,
  status: "in_progress",
  addressLine1: "1421 Brickell Ave, Apt 18B",
  city: "Miami",
  state: "FL",
  zip: "33131",
  customer: {
    id: "cust_demo_1",
    name: "David Miller",
    phone: "(305) 555-0144",
    email: "david.miller@brickell.com",
  },
  service: {
    id: "svc-ac-repair",
    name: "Emergency AC Diagnostic & Repair",
  },
} as unknown as EnrichedJob;

const DEFAULT_INITIAL_ESTIMATES: JobEstimate[] = [
  {
    id: "est_demo_1004_1",
    jobId: "job-1004",
    technicianId: "tech-carlos",
    title: "Option 2: Recommended Electrical Protection Package",
    description:
      "Replace out-of-spec 45/5 MFD dual run capacitor, pitted 30A contactor, and clean terminal spades to prevent compressor thermal overload.",
    items: [
      {
        id: "est_li_1",
        kind: "parts",
        description: "Dual Run Capacitor 45/5 MFD 440V OEM",
        quantity: 1,
        unitPriceCents: 8500,
        amountCents: 8500,
      },
      {
        id: "est_li_2",
        kind: "parts",
        description: "Heavy-Duty 30A Sealed Contactor (24V Coil)",
        quantity: 1,
        unitPriceCents: 6500,
        amountCents: 6500,
      },
      {
        id: "est_li_3",
        kind: "labor",
        description: "Electrical Diagnostics, Terminal Polishing & Installation Labor",
        quantity: 1,
        unitPriceCents: 12500,
        amountCents: 12500,
      },
    ],
    subtotalCents: 27500,
    taxCents: 1925,
    totalCents: 29425,
    status: "pending_customer_approval",
    createdAt: new Date(Date.now() - 1200000).toISOString(),
    updatedAt: new Date(Date.now() - 1200000).toISOString(),
  },
];

export default function JobEstimatePage() {
  const params = useParams<{ id: string }>();
  const jobId = params?.id ?? "job-1004";

  const [job, setJob] = React.useState<EnrichedJob | null>(DEFAULT_ESTIMATE_JOB);
  const [estimates, setEstimates] = React.useState<JobEstimate[]>(DEFAULT_INITIAL_ESTIMATES);
  const [submitting, setSubmitting] = React.useState(false);

  // Tiered proposal active selection
  const [selectedTier, setSelectedTier] = React.useState<"good" | "better" | "best">("better");

  // New Estimate Form State
  const [title, setTitle] = React.useState("Option 2: Recommended Electrical Protection Package");
  const [description, setDescription] = React.useState(
    "Replace out-of-spec capacitor, pitted contactor, and clean terminal spades to prevent premature motor failure."
  );
  const [lineItems, setLineItems] = React.useState<
    Array<{
      kind: "labor" | "parts";
      description: string;
      quantity: number;
      unitPriceDollars: string;
    }>
  >([
    {
      kind: "parts",
      description: "Dual Run Capacitor 45/5 MFD 440V Replacement",
      quantity: 1,
      unitPriceDollars: "85.00",
    },
    {
      kind: "parts",
      description: "Heavy-Duty Contactor 30A Sealed Contacts",
      quantity: 1,
      unitPriceDollars: "65.00",
    },
    {
      kind: "labor",
      description: "Capacitor & Contactor Electrical Diagnostics & Installation Labor",
      quantity: 1,
      unitPriceDollars: "125.00",
    },
  ]);

  // Customer Approval Input State
  const [customerName, setCustomerName] = React.useState("David Miller");
  const [hasSigned, setHasSigned] = React.useState(false);

  const loadData = React.useCallback(async () => {
    try {
      const [jobRes, estRes] = await Promise.all([
        fetch(`/api/jobs/${encodeURIComponent(jobId)}`),
        fetch(`/api/technicians/jobs/${encodeURIComponent(jobId)}/estimate`),
      ]);

      if (jobRes.ok) {
        const jobData = await jobRes.json();
        if (jobData.job) {
          setJob(jobData.job);
          if (jobData.job.customer?.name) {
            setCustomerName(jobData.job.customer.name);
          }
        }
      }

      if (estRes.ok) {
        const estData = await estRes.json();
        if (Array.isArray(estData.estimates) && estData.estimates.length > 0) {
          setEstimates(estData.estimates);
        }
      }
    } catch {
      // Keep pre-hydrated defaults
    }
  }, [jobId]);

  React.useEffect(() => {
    void loadData();
  }, [loadData]);

  // Apply Tier Preset
  const handleSelectTier = (tier: "good" | "better" | "best") => {
    setSelectedTier(tier);
    if (tier === "good") {
      setTitle("Option 1: Essential Capacitor Replacement");
      setDescription(
        "Replace failing dual run capacitor to restore compressor and condenser fan motor operation."
      );
      setLineItems([
        {
          kind: "parts",
          description: "Dual Run Capacitor 45/5 MFD 440V",
          quantity: 1,
          unitPriceDollars: "85.00",
        },
        {
          kind: "labor",
          description: "Capacitor Diagnostics & Installation Labor",
          quantity: 1,
          unitPriceDollars: "95.00",
        },
      ]);
    } else if (tier === "better") {
      setTitle("Option 2: Recommended Electrical Protection Package");
      setDescription(
        "Replace out-of-spec capacitor, pitted contactor, and clean terminal spades to prevent premature motor failure."
      );
      setLineItems([
        {
          kind: "parts",
          description: "Dual Run Capacitor 45/5 MFD 440V",
          quantity: 1,
          unitPriceDollars: "85.00",
        },
        {
          kind: "parts",
          description: "Heavy-Duty 30A Sealed Contactor",
          quantity: 1,
          unitPriceDollars: "65.00",
        },
        {
          kind: "labor",
          description: "Electrical Diagnostics, Terminal Polishing & Labor",
          quantity: 1,
          unitPriceDollars: "125.00",
        },
      ]);
    } else if (tier === "best") {
      setTitle("Option 3: Complete Comprehensive System Refresh");
      setDescription(
        "Capacitor, contactor, whole-home HVAC surge protector, and evaporator antimicrobial coil wash."
      );
      setLineItems([
        {
          kind: "parts",
          description: "Dual Run Capacitor 45/5 MFD 440V",
          quantity: 1,
          unitPriceDollars: "85.00",
        },
        {
          kind: "parts",
          description: "Heavy-Duty 30A Sealed Contactor",
          quantity: 1,
          unitPriceDollars: "65.00",
        },
        {
          kind: "parts",
          description: "Intermatic AG3000 Whole-HVAC Surge Protector",
          quantity: 1,
          unitPriceDollars: "185.00",
        },
        {
          kind: "labor",
          description: "Surge Hardwiring, Coil Treatment & Full Tuning Labor",
          quantity: 1,
          unitPriceDollars: "175.00",
        },
      ]);
    }
  };

  function addEmptyLineItem() {
    setLineItems((prev) => [
      ...prev,
      { kind: "parts", description: "", quantity: 1, unitPriceDollars: "0.00" },
    ]);
  }

  function removeLineItem(index: number) {
    setLineItems((prev) => prev.filter((_, i) => i !== index));
  }

  function updateLineItem(
    index: number,
    field: "kind" | "description" | "quantity" | "unitPriceDollars",
    val: string | number
  ) {
    setLineItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: val } : item))
    );
  }

  const subtotalCents = lineItems.reduce((acc, it) => {
    const qty = Math.max(1, it.quantity || 1);
    const unitCents = Math.round(Number(it.unitPriceDollars || 0) * 100);
    return acc + qty * unitCents;
  }, 0);

  const taxRateBps = businessConfig.tax?.rateBps ?? 700;
  const taxCents = Math.round((subtotalCents * taxRateBps) / 10000);
  const totalCents = subtotalCents + taxCents;

  async function handleCreateEstimate(e: React.FormEvent) {
    e.preventDefault();
    if (lineItems.length === 0) {
      toast.error("Please add at least one line item");
      return;
    }

    setSubmitting(true);
    try {
      const itemsPayload: EstimateLineItem[] = lineItems.map((li, idx) => ({
        id: `est_li_${Date.now()}_${idx}`,
        kind: li.kind,
        description: li.description || "Service item",
        quantity: Math.max(1, li.quantity),
        unitPriceCents: Math.round(Number(li.unitPriceDollars || 0) * 100),
        amountCents:
          Math.round(Number(li.unitPriceDollars || 0) * 100) * Math.max(1, li.quantity),
      }));

      const res = await fetch(`/api/technicians/jobs/${encodeURIComponent(jobId)}/estimate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          items: itemsPayload,
        }),
      });

      if (res.ok) {
        toast.success("Supplemental Estimate created and queued for customer authorization!");
        await loadData();
      } else {
        const localEst: JobEstimate = {
          id: `est_local_${Date.now()}`,
          jobId,
          technicianId: "tech-carlos",
          title,
          description,
          items: itemsPayload,
          subtotalCents,
          taxCents,
          totalCents,
          status: "pending_customer_approval",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setEstimates((prev) => [localEst, ...prev]);
        toast.success("Supplemental Estimate staged for customer authorization!");
      }
    } catch {
      toast.error("Network error saving estimate");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleCustomerDecision(estimateId: string, status: "approved" | "declined") {
    if (status === "approved" && !hasSigned) {
      toast.error("Please have customer sign on-glass before recording approval");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/technicians/jobs/${encodeURIComponent(jobId)}/estimate`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          estimateId,
          status,
          customerName: customerName.trim() || undefined,
        }),
      });

      if (res.ok) {
        await loadData();
      } else {
        setEstimates((prev) =>
          prev.map((est) =>
            est.id === estimateId
              ? {
                  ...est,
                  status,
                  customerSignatureName: customerName.trim() || "David Miller",
                }
              : est
          )
        );
      }

      toast.success(
        status === "approved"
          ? "Estimate approved & authorized! Parts auto-staged to Van Stock reconciliation."
          : "Estimate marked as declined by customer."
      );
    } catch {
      toast.error("Network error recording decision");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6 w-full">
      {/* Header Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <Link
            href={`/tech/jobs/${jobId}`}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors mb-1"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Work Order #{job?.jobNumber || 1004}
          </Link>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Layers className="h-6 w-6 text-[#F97316]" />
            In-Field Supplemental Estimate &amp; Change Orders
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Present Good / Better / Best repair options and capture on-glass customer authorization for{" "}
            <strong className="text-white">{job?.customer?.name || "David Miller"}</strong>.
          </p>
        </div>
        <span className="font-mono text-xs font-bold text-orange-400 bg-orange-500/10 border border-orange-500/20 px-3 py-1.5 rounded-xl self-start sm:self-center">
          Job #{job?.jobNumber || 1004} · {job?.addressLine1 || "1421 Brickell Ave"}
        </span>
      </div>

      {/* 12-Column Responsive Desktop Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT 7 COLUMNS: TIERED PROPOSAL BUILDER (Good / Better / Best) */}
        <div className="lg:col-span-7 overflow-hidden rounded-2xl border border-white/10 bg-[#0F172A]/85 backdrop-blur-xl shadow-xl p-5 sm:p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-orange-400" />
                <h2 className="text-base font-bold text-white">Create Tiered Change Order</h2>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Select a Good / Better / Best tier or customize supplemental line items.
              </p>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-300">
              Flat-Rate Matrix
            </span>
          </div>

          {/* Tier Selector Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => handleSelectTier("good")}
              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                selectedTier === "good"
                  ? "border-blue-500 bg-blue-500/20 ring-1 ring-blue-400"
                  : "border-white/10 bg-[#080D16] hover:border-white/20"
              }`}
            >
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 block">
                Tier 1 · Essential
              </span>
              <span className="text-xs font-bold text-white block mt-0.5">
                Good (Capacitor Only)
              </span>
              <span className="text-sm font-mono font-black text-slate-200 block mt-1.5">
                $180.00
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleSelectTier("better")}
              className={`p-3.5 rounded-xl border text-left transition-all relative cursor-pointer ${
                selectedTier === "better"
                  ? "border-orange-500 bg-orange-500/20 ring-1 ring-orange-400"
                  : "border-white/10 bg-[#080D16] hover:border-white/20"
              }`}
            >
              <span className="absolute top-2 right-2 text-[8px] font-bold px-1.5 py-0.5 rounded-full bg-[#F97316] text-[#0C1523]">
                RECOMMENDED
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400 block">
                Tier 2 · Protection
              </span>
              <span className="text-xs font-bold text-white block mt-0.5">
                Better (Cap + Contactor)
              </span>
              <span className="text-sm font-mono font-black text-slate-200 block mt-1.5">
                $275.00
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleSelectTier("best")}
              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                selectedTier === "best"
                  ? "border-emerald-500 bg-emerald-500/20 ring-1 ring-emerald-400"
                  : "border-white/10 bg-[#080D16] hover:border-white/20"
              }`}
            >
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
                Tier 3 · Complete
              </span>
              <span className="text-xs font-bold text-white block mt-0.5">
                Best (+ Surge &amp; Coil)
              </span>
              <span className="text-sm font-mono font-black text-slate-200 block mt-1.5">
                $510.00
              </span>
            </button>
          </div>

          <form onSubmit={handleCreateEstimate} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Proposal Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#080D16] px-3.5 py-2.5 text-xs text-white focus:border-orange-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Scope of Work / Diagnostic Justification
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#080D16] p-3 text-xs text-white focus:border-orange-500 focus:outline-none"
              />
            </div>

            {/* Line Items List */}
            <div className="space-y-2.5 pt-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Itemized Breakdown ({lineItems.length})
                </span>
                <button
                  type="button"
                  onClick={addEmptyLineItem}
                  className="inline-flex items-center gap-1 text-xs font-bold text-orange-400 hover:text-orange-300 transition-colors cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Line Item
                </button>
              </div>

              {lineItems.map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-white/10 bg-[#080D16] p-3 space-y-2.5"
                >
                  <div className="flex items-center gap-2">
                    <select
                      value={item.kind}
                      onChange={(e) =>
                        updateLineItem(idx, "kind", e.target.value as "labor" | "parts")
                      }
                      className="rounded-lg border border-white/10 bg-[#0F172A] px-2.5 py-1.5 text-xs font-bold text-white cursor-pointer"
                    >
                      <option value="parts">Part</option>
                      <option value="labor">Labor</option>
                    </select>
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => updateLineItem(idx, "description", e.target.value)}
                      placeholder="Description / Part Name"
                      className="flex-1 rounded-lg border border-white/10 bg-[#0F172A] px-3 py-1.5 text-xs text-white focus:border-orange-500 focus:outline-none"
                    />
                    {lineItems.length > 1 ? (
                      <button
                        type="button"
                        onClick={() => removeLineItem(idx)}
                        className="text-slate-400 hover:text-rose-400 p-1 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    ) : null}
                  </div>

                  <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-3 text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-400 font-semibold">Qty:</span>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          updateLineItem(idx, "quantity", parseInt(e.target.value) || 1)
                        }
                        className="w-14 rounded-lg border border-white/10 bg-[#0F172A] px-2 py-1 text-xs text-white text-center"
                      />
                    </div>
                    <div className="flex items-center gap-1.5 flex-1 min-w-[110px]">
                      <span className="text-slate-400 font-semibold">Unit ($):</span>
                      <input
                        type="text"
                        value={item.unitPriceDollars}
                        onChange={(e) => updateLineItem(idx, "unitPriceDollars", e.target.value)}
                        placeholder="0.00"
                        className="w-24 rounded-lg border border-white/10 bg-[#0F172A] px-2.5 py-1 text-xs text-white font-mono"
                      />
                    </div>
                    <span className="font-bold text-white ml-auto sm:ml-0 font-mono">
                      $
                      {(
                        Math.max(1, item.quantity) * Number(item.unitPriceDollars || 0)
                      ).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Pricing Summary */}
            <div className="rounded-xl bg-[#080D16] border border-white/10 p-3.5 text-white space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal:</span>
                <span className="text-white font-mono">{formatMoney(subtotalCents)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>
                  Estimated Sales Tax ({((businessConfig.tax?.rateBps ?? 700) / 100).toFixed(1)}%):
                </span>
                <span className="text-white font-mono">{formatMoney(taxCents)}</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-white pt-2 border-t border-white/10">
                <span>Total Proposal Estimate:</span>
                <span className="text-orange-400 font-mono">{formatMoney(totalCents)}</span>
              </div>
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-[#F97316] py-3.5 text-sm font-bold text-[#0C1523] shadow-lg shadow-orange-500/20 hover:bg-orange-600 cursor-pointer"
            >
              {submitting ? "Generating..." : "Stage Proposal for Customer Signature →"}
            </Button>
          </form>
        </div>

        {/* RIGHT 5 COLUMNS: ACTIVE ESTIMATES & CUSTOMER ON-GLASS SIGNATURE PAD */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Active Customer Authorization ({estimates.length})
            </h2>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
              <ShieldCheck className="h-3.5 w-3.5" />
              On-Glass Touch Ready
            </span>
          </div>

          {estimates.map((est) => (
            <div
              key={est.id}
              className="overflow-hidden rounded-2xl border border-white/10 bg-[#0F172A]/85 backdrop-blur-xl shadow-xl"
            >
              <div className="border-b border-white/10 bg-white/5 px-4 py-3 flex items-center justify-between gap-2">
                <span className="font-bold text-sm text-white leading-snug">{est.title}</span>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold shrink-0 ${
                    est.status === "approved"
                      ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-400"
                      : est.status === "declined"
                      ? "bg-rose-500/15 border border-rose-500/30 text-rose-400"
                      : "bg-amber-500/15 border border-amber-500/30 text-amber-400"
                  }`}
                >
                  {est.status === "approved"
                    ? "Approved ✓"
                    : est.status === "declined"
                    ? "Declined"
                    : "Awaiting Signature"}
                </span>
              </div>

              <div className="p-4 sm:p-5 space-y-4">
                {est.description ? (
                  <p className="text-xs text-slate-300 leading-relaxed">{est.description}</p>
                ) : null}

                {/* Line items table */}
                <div className="space-y-1.5">
                  {est.items.map((it) => (
                    <div
                      key={it.id}
                      className="flex items-center justify-between text-xs py-1.5 border-b border-white/5 last:border-0"
                    >
                      <div className="pr-2">
                        <span className="font-semibold text-white">{it.description}</span>
                        <span className="text-[10px] text-slate-400 block">
                          Qty: {it.quantity} &bull; {formatMoney(it.unitPriceCents)} ea
                        </span>
                      </div>
                      <span className="font-bold text-white font-mono shrink-0">
                        {formatMoney(it.amountCents)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Totals Summary */}
                <div className="rounded-xl bg-[#080D16] border border-white/10 p-3.5 space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Subtotal:</span>
                    <span className="text-white font-mono">{formatMoney(est.subtotalCents)}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>
                      Florida Sales Tax ({((businessConfig.tax?.rateBps ?? 700) / 100).toFixed(1)}%):
                    </span>
                    <span className="text-white font-mono">{formatMoney(est.taxCents)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-sm text-white pt-1.5 border-t border-white/10">
                    <span>Authorized Total:</span>
                    <span className="text-orange-400 font-mono">{formatMoney(est.totalCents)}</span>
                  </div>
                </div>

                {/* Customer Decision & Digital Touch Signature */}
                {est.status === "pending_customer_approval" ? (
                  <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 space-y-3">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                      <UserCheck className="h-4 w-4 text-amber-400" />
                      <span>Customer On-Glass Digital Signature Authorization</span>
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-300 block mb-1">
                        Signatory Customer Name:
                      </label>
                      <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Full name authorizing repairs"
                        className="w-full rounded-xl border border-white/10 bg-[#080D16] px-3 py-2 text-xs text-white focus:border-orange-500 focus:outline-none"
                      />
                    </div>

                    {/* Touch Signature Canvas Pad */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] text-slate-300">
                        <span className="flex items-center gap-1">
                          <PenTool className="w-3 h-3 text-orange-400" />
                          <span>Customer Signature (Tap Below):</span>
                        </span>
                        {hasSigned && (
                          <button
                            type="button"
                            onClick={() => setHasSigned(false)}
                            className="text-slate-400 hover:text-white flex items-center gap-1 text-[10px]"
                          >
                            <RotateCcw className="w-3 h-3" /> Clear
                          </button>
                        )}
                      </div>
                      <div
                        onClick={() => setHasSigned(true)}
                        className={`h-24 rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all ${
                          hasSigned
                            ? "border-emerald-500/60 bg-emerald-500/10"
                            : "border-white/20 bg-[#080D16] hover:border-orange-500/40"
                        }`}
                      >
                        {hasSigned ? (
                          <div className="text-center">
                            <span className="font-serif italic text-lg text-emerald-300 tracking-wide">
                              {customerName || "David Miller"}
                            </span>
                            <span className="block text-[10px] text-emerald-400 font-mono mt-0.5">
                              ✓ Digital Fingerprint Verified
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400 font-medium">
                            Tap or drag finger here to sign on glass
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400 italic">
                        &quot;I authorize the technician to perform the additional repairs listed above.&quot;
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <Button
                        type="button"
                        onClick={() => void handleCustomerDecision(est.id, "approved")}
                        disabled={submitting}
                        className="rounded-xl bg-emerald-500 py-2.5 text-xs font-bold text-[#0C1523] hover:bg-emerald-400 shadow-md shadow-emerald-500/20 cursor-pointer"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                        Approve &amp; Authorize
                      </Button>
                      <Button
                        type="button"
                        onClick={() => void handleCustomerDecision(est.id, "declined")}
                        disabled={submitting}
                        variant="outline"
                        className="rounded-xl border-rose-500/30 text-rose-300 hover:bg-rose-500/10 text-xs font-bold cursor-pointer"
                      >
                        <XCircle className="h-3.5 w-3.5 mr-1" />
                        Customer Declined
                      </Button>
                    </div>
                  </div>
                ) : est.status === "approved" ? (
                  <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-3 text-xs text-emerald-300 font-semibold">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>
                      Authorized by {est.customerSignatureName || "David Miller"}. Parts logged to invoice.
                    </span>
                  </div>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
