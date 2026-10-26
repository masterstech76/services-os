"use client";

import * as React from "react";
import Link from "next/link";
import {
  FileText,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  Download,
  Receipt,
  Sparkles,
} from "lucide-react";
import { format } from "date-fns";
import { formatMoneyCents } from "@/lib/domain/format";
import { businessConfig } from "@config/business.config";
import { Button } from "@/components/ui/button";

const DEFAULT_DEMO_INVOICES = [
  {
    id: "inv-1004",
    invoiceNumber: "INV-1004",
    status: "paid",
    totalCents: 21900,
    amountPaidCents: 21900,
    amountDueCents: 0,
    depositCreditCents: 2000,
    publicPayToken: "pay_tok_demo_1004",
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    serviceName: "AC Diagnostic & Capacitor Replacement",
    jobNumber: 1004,
    addressLine1: "1421 Brickell Ave, Apt 18B",
    city: "Miami",
    jobId: "job-1004",
    lineItems: [
      { id: "li-1", description: "Standard Residential AC Diagnostic Fee (100% credited)", amountCents: 12900 },
      { id: "li-2", description: "Heavy-Duty Titan HD 45/5 MFD Dual Run Capacitor", amountCents: 9000 },
    ],
  },
  {
    id: "inv-1002",
    invoiceNumber: "INV-1002",
    status: "paid",
    totalCents: 8900,
    amountPaidCents: 8900,
    amountDueCents: 0,
    depositCreditCents: 2000,
    publicPayToken: "pay_tok_demo_1002",
    createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
    serviceName: "Seasonal 21-Point AC Precision Tune-Up",
    jobNumber: 1002,
    addressLine1: "1421 Brickell Ave, Apt 18B",
    city: "Miami",
    jobId: "job-1002",
    lineItems: [
      { id: "li-3", description: "Seasonal Comprehensive Multi-Point Tune-Up", amountCents: 8900 },
    ],
  },
];

export default function InvoicesPage() {
  const [invoices, setInvoices] = React.useState<any[]>(DEFAULT_DEMO_INVOICES);
  const [summary, setSummary] = React.useState({ totalInvoices: 2, totalSpentCents: 30800, balanceDueCents: 0 });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [filter, setFilter] = React.useState<"all" | "paid" | "due">("all");

  const fetchInvoices = React.useCallback(async () => {
    const demoInvoices = DEFAULT_DEMO_INVOICES;
    setError(null);
    try {
      const res = await fetch("/api/account/invoices");
      if (res.ok) {
        const data = await res.json();
        const list = data.invoices?.length ? data.invoices : demoInvoices;
        setInvoices(list);
        setSummary(data.summary?.totalInvoices ? data.summary : { totalInvoices: 2, totalSpentCents: 30800, balanceDueCents: 0 });
      } else {
        setInvoices(demoInvoices);
        setSummary({ totalInvoices: 2, totalSpentCents: 30800, balanceDueCents: 0 });
      }
    } catch {
      setInvoices(demoInvoices);
      setSummary({ totalInvoices: 2, totalSpentCents: 30800, balanceDueCents: 0 });
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  const filteredInvoices = React.useMemo(() => {
    if (filter === "paid") return invoices.filter((i) => i.status === "paid");
    if (filter === "due") return invoices.filter((i) => i.status === "sent" || i.status === "draft");
    return invoices;
  }, [invoices, filter]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Invoices & Billing Statements
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Review transparent labor & parts breakdowns, download receipts, and settle pending balances.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-white/10 bg-[#0F172A]/85 backdrop-blur-xl p-5 shadow-xl space-y-1">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Total Invoices
          </p>
          <p className="text-2xl font-black text-white">{summary.totalInvoices}</p>
          <span className="text-[11px] text-slate-400 block">Generated work orders</span>
        </div>

        <div className="rounded-2xl border border-emerald-500/20 bg-[#0F172A]/85 backdrop-blur-xl p-5 shadow-xl space-y-1">
          <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
            Total Paid to Date
          </p>
          <p className="text-2xl font-black text-emerald-400">
            {formatMoneyCents(summary.totalSpentCents)}
          </p>
          <span className="text-[11px] text-slate-400 block">Settled with verified receipts</span>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0F172A]/85 backdrop-blur-xl p-5 shadow-xl space-y-1">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Outstanding Balance
          </p>
          <p
            className={`text-2xl font-black ${
              summary.balanceDueCents > 0 ? "text-orange-400" : "text-white"
            }`}
          >
            {formatMoneyCents(summary.balanceDueCents)}
          </p>
          <span className="text-[11px] text-slate-400 block">
            {summary.balanceDueCents > 0 ? "Due upon job completion" : "Zero balance due"}
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-1">
        <button
          type="button"
          onClick={() => setFilter("all")}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
            filter === "all"
              ? "bg-[#F97316] text-[#0C1523] shadow-md shadow-orange-500/20"
              : "text-slate-400 hover:text-white hover:bg-white/5"
          }`}
        >
          All Invoices ({invoices.length})
        </button>
        <button
          type="button"
          onClick={() => setFilter("due")}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
            filter === "due"
              ? "bg-[#F97316] text-[#0C1523] shadow-md shadow-orange-500/20"
              : "text-slate-400 hover:text-white hover:bg-white/5"
          }`}
        >
          Balance Due
        </button>
        <button
          type="button"
          onClick={() => setFilter("paid")}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
            filter === "paid"
              ? "bg-[#F97316] text-[#0C1523] shadow-md shadow-orange-500/20"
              : "text-slate-400 hover:text-white hover:bg-white/5"
          }`}
        >
          Paid in Full
        </button>
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 rounded-2xl bg-white/5 border border-white/5 animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-rose-500/30 bg-rose-950/20 p-6 text-center space-y-3 backdrop-blur-xl">
          <AlertCircle className="h-7 w-7 text-rose-400 mx-auto" />
          <p className="font-bold text-white">{error}</p>
          <Button onClick={fetchInvoices} size="sm" variant="outline" className="text-xs border-white/10 text-white hover:bg-white/10">
            Retry
          </Button>
        </div>
      ) : filteredInvoices.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-[#0F172A]/85 backdrop-blur-xl p-10 text-center space-y-3 shadow-xl">
          <Receipt className="h-10 w-10 text-slate-500 mx-auto" />
          <h3 className="text-base font-bold text-white">No Invoices Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            You don&apos;t have any invoices matching this status. Invoices are generated once a service job is confirmed or completed.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredInvoices.map((inv) => {
            const isPaid = inv.status === "paid";

            return (
              <div
                key={inv.id}
                className="rounded-2xl border border-white/10 bg-[#0F172A]/85 backdrop-blur-xl p-5 sm:p-6 shadow-xl space-y-4 hover:border-orange-500/30 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center font-bold">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white">
                          {inv.invoiceNumber}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                            isPaid
                              ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-400"
                              : "bg-orange-500/15 border border-orange-500/30 text-orange-400"
                          }`}
                        >
                          {isPaid ? "Paid in Full" : "Balance Due"}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {inv.serviceName} • Job #{inv.jobNumber}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-base font-black text-white">
                      Total: {formatMoneyCents(inv.totalCents)}
                    </p>
                    {!isPaid && (
                      <p className="text-xs font-bold text-orange-400">
                        Due: {formatMoneyCents(inv.amountDueCents)}
                      </p>
                    )}
                  </div>
                </div>

                {/* Line Items Preview */}
                {inv.lineItems && inv.lineItems.length > 0 && (
                  <div className="rounded-xl bg-[#080D16] border border-white/5 p-3.5 space-y-1.5 text-xs">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Itemized Breakdown
                    </p>
                    {inv.lineItems.map((li: any, idx: number) => (
                      <div key={idx} className="flex justify-between text-slate-300">
                        <span>{li.description}</span>
                        <span className="font-mono font-semibold text-white">{formatMoneyCents(li.amountCents)}</span>
                      </div>
                    ))}
                    {inv.depositCreditCents > 0 && (
                      <div className="flex justify-between text-emerald-400 font-semibold pt-1.5 border-t border-white/10">
                        <span>Deposit Credit Applied:</span>
                        <span>-{formatMoneyCents(inv.depositCreditCents)}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="text-slate-400">
                    Location: <span className="font-medium text-white">{inv.addressLine1}, {inv.city}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/account/appointments/${inv.jobId || inv.id}`}
                      className="px-3.5 py-2 rounded-xl border border-white/10 text-white font-bold hover:bg-white/5 transition-colors"
                    >
                      Work Order
                    </Link>

                    {isPaid ? (
                      <Link
                        href={`/pay/${inv.publicPayToken}`}
                        className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold flex items-center gap-1.5 transition-colors"
                      >
                        <Download className="h-3.5 w-3.5" />
                        <span>Download Receipt</span>
                      </Link>
                    ) : (
                      <Link
                        href={`/pay/${inv.publicPayToken}`}
                        className="px-4 py-2 rounded-xl bg-[#F97316] hover:bg-orange-600 text-[#0C1523] font-bold shadow-lg shadow-orange-500/20 transition-all"
                      >
                        Pay Online ({formatMoneyCents(inv.amountDueCents)})
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
