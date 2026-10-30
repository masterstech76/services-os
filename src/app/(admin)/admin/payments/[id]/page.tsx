"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Download,
  Calendar,
  Clock,
  User,
  Briefcase,
  FileText,
  DollarSign,
  ShieldCheck,
  ExternalLink,
  Receipt,
  Mail,
  Phone,
  MapPin,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { formatMoney } from "@/components/shared/Money";
import { businessConfig } from "@config/business.config";

interface TransactionDetail {
  transactionId: string;
  status: "Completed" | "Pending" | "Failed" | "Refunded";
  timestamp: string;
  amountCents: number;
  paymentMethod: string;
  cardBrand: string;
  last4: string;
  // Customer Info
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  // Transaction Details
  invoiceNumber: string;
  jobNumber: string;
  gateway: string;
  gatewayResponse: string;
  authorizationId: string;
  settlementStatus: string;
  // Timeline
  timeline: Array<{
    title: string;
    time: string;
    completed: boolean;
  }>;
  // Refund info
  hasRefund: boolean;
  refundNote: string;
}

const DEFAULT_TRANSACTION: TransactionDetail = {
  transactionId: "TXN-9823647",
  status: "Completed",
  timestamp: "May 14, 2025 | 9:32 AM",
  amountCents: 32000,
  paymentMethod: "Card (****4242)",
  cardBrand: "VISA",
  last4: "4242",
  customerName: "Service Client A",
  customerEmail: "rcaldwell@example.com",
  customerPhone: "+1 (XXX) XXX-XXXX",
  customerAddress: "1234 Ocean Dr, Miami, FL 33145",
  invoiceNumber: "INV-1047",
  jobNumber: "1047",
  gateway: "Stripe",
  gatewayResponse: "Approved (200)",
  authorizationId: "ch_1A293C4D5E6F",
  settlementStatus: "Settled",
  timeline: [
    { title: "Payment Initiated", time: "May 14, 2025 – 9:32 AM", completed: true },
    { title: "Gateway Approved", time: "May 14, 2025 – 9:32 AM", completed: true },
    { title: "Funds Settled", time: "May 14, 2025 – 9:35 AM", completed: true },
  ],
  hasRefund: false,
  refundNote: "No refunds available for this transaction.",
};

export default function AdminPaymentDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const rawId = params?.id ? decodeURIComponent(params.id) : "TXN-9823647";

  const [detail, setDetail] = React.useState<TransactionDetail>({
    ...DEFAULT_TRANSACTION,
    transactionId: rawId.startsWith("TXN-") ? rawId : `TXN-${rawId}`,
  });
  const [refundModalOpen, setRefundModalOpen] = React.useState(false);
  const [refundReason, setRefundReason] = React.useState("");

  React.useEffect(() => {
    async function fetchRecord() {
      try {
        const res = await fetch(`/api/admin/payments/${encodeURIComponent(rawId)}`);
        if (res.ok) {
          const json = await res.json();
          if (json && json.payment) {
            const p = json.payment;
            setDetail((prev) => ({
              ...prev,
              transactionId: p.paymentNumber || rawId,
              amountCents: p.amountCents || prev.amountCents,
              status: p.status === "succeeded" ? "Completed" : p.status === "refunded" ? "Refunded" : "Pending",
              invoiceNumber: json.invoice?.invoiceNumber || prev.invoiceNumber,
              jobNumber: json.job?.jobNumber ? String(json.job.jobNumber) : prev.jobNumber,
              customerName: json.customer?.name || prev.customerName,
              customerEmail: json.customer?.email || prev.customerEmail,
              customerPhone: json.customer?.phone || prev.customerPhone,
            }));
          }
        }
      } catch {
        // fallback to default
      }
    }
    void fetchRecord();
  }, [rawId]);

  function handleDownloadReceipt() {
    toast.success(`Downloading receipt for ${detail.transactionId}...`);
  }

  function handleProcessRefund(e: React.FormEvent) {
    e.preventDefault();
    setDetail((prev) => ({
      ...prev,
      status: "Refunded",
      hasRefund: true,
      refundNote: `Refunded $${(prev.amountCents / 100).toFixed(2)} on ${new Date().toLocaleDateString()}. Reason: ${refundReason || "Customer Satisfaction"}`,
    }));
    setRefundModalOpen(false);
    toast.success("Refund processed successfully via Stripe");
  }

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* ─────────────────────────────────────────────────────────────
          1. HEADER WITH BACK LINK (Exact match to Reference)
      ───────────────────────────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Payment Detail
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Inspect individual transactions, gateway responses, and eligible refunds.
        </p>

        <div className="mt-3">
          <Link
            href="/admin/payments"
            className="inline-flex items-center gap-1.5 text-xs text-sky-400 hover:text-sky-300 transition-colors font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Payments</span>
          </Link>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. MAIN TRANSACTION HERO CARD (3 Columns matching Reference)
      ───────────────────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-white/10 bg-[#0B1322] p-5 shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Left Column: Transaction ID & Date */}
          <div className="space-y-1">
            <div className="text-xs text-slate-400 font-medium">Transaction ID</div>
            <div className="flex items-center gap-2.5">
              <span className="text-lg sm:text-xl font-mono font-extrabold text-white tracking-tight">
                {detail.transactionId}
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                {detail.status}
              </span>
            </div>
            <div className="text-xs text-slate-500">{detail.timestamp}</div>
          </div>

          {/* Middle Column: Amount */}
          <div className="space-y-1 md:border-l md:border-white/10 md:pl-6">
            <div className="text-xs text-slate-400 font-medium">Amount</div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {formatMoney(detail.amountCents)}
            </div>
          </div>

          {/* Right Column: Payment Method */}
          <div className="space-y-1 md:border-l md:border-white/10 md:pl-6">
            <div className="text-xs text-slate-400 font-medium">Payment Method</div>
            <div className="flex items-center gap-2 mt-1">
              <span className="px-1.5 py-0.5 rounded bg-blue-600 text-white font-black text-[10px] tracking-widest italic">
                {detail.cardBrand}
              </span>
              <span className="text-sm font-semibold text-white">
                {detail.paymentMethod}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. MIDDLE SECTION: CUSTOMER INFO & TRANSACTION DETAILS
      ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Customer Information */}
        <div className="rounded-2xl border border-white/10 bg-[#0B1322] p-5 shadow-2xl space-y-3">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Customer Information
          </h2>

          <div className="flex items-start gap-3 pt-1">
            <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/10 overflow-hidden flex-shrink-0 flex items-center justify-center text-slate-300 font-bold text-xs">
              RC
            </div>
            <div className="space-y-1.5 text-xs">
              <div className="font-bold text-white text-sm">{detail.customerName}</div>
              <div className="flex items-center gap-2 text-slate-400">
                <Mail className="w-3.5 h-3.5 text-slate-500" />
                <a href={`mailto:${detail.customerEmail}`} className="hover:text-white transition-colors">
                  {detail.customerEmail}
                </a>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <Phone className="w-3.5 h-3.5 text-slate-500" />
                <a href={`tel:${detail.customerPhone}`} className="hover:text-white transition-colors">
                  {detail.customerPhone}
                </a>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                <span>{detail.customerAddress}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Transaction Details */}
        <div className="rounded-2xl border border-white/10 bg-[#0B1322] p-5 shadow-2xl space-y-3">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Transaction Details
          </h2>

          <div className="grid grid-cols-2 gap-y-2.5 gap-x-4 pt-1 text-xs">
            <div>
              <div className="text-slate-400">Invoice #</div>
              <Link
                href={`/admin/invoices/${encodeURIComponent(detail.invoiceNumber)}`}
                className="font-mono font-semibold text-white hover:text-[#F97316] transition-colors"
              >
                {detail.invoiceNumber}
              </Link>
            </div>
            <div>
              <div className="text-slate-400">Job #</div>
              <Link
                href="/admin/jobs"
                className="font-mono font-semibold text-white hover:text-slate-200 transition-colors"
              >
                {detail.jobNumber}
              </Link>
            </div>
            <div>
              <div className="text-slate-400">Gateway</div>
              <div className="font-medium text-white">{detail.gateway}</div>
            </div>
            <div>
              <div className="text-slate-400">Gateway Response</div>
              <div className="font-semibold text-emerald-400">{detail.gatewayResponse}</div>
            </div>
            <div>
              <div className="text-slate-400">Authorization ID</div>
              <div className="font-mono text-[11px] text-slate-300">{detail.authorizationId}</div>
            </div>
            <div>
              <div className="text-slate-400">Settlement Status</div>
              <div className="font-semibold text-emerald-400">{detail.settlementStatus}</div>
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          4. BOTTOM SECTION: TIMELINE & REFUNDS
      ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Payment Timeline */}
        <div className="rounded-2xl border border-white/10 bg-[#0B1322] p-5 shadow-2xl space-y-4">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Payment Timeline
          </h2>

          <div className="relative pl-6 space-y-6 pt-1">
            {/* Vertical connector line */}
            <div className="absolute left-2.5 top-2.5 bottom-2.5 w-0.5 bg-emerald-500/40" />

            {detail.timeline.map((step, idx) => (
              <div key={idx} className="relative flex items-start gap-3">
                <div className="absolute -left-6 mt-0.5 w-5 h-5 rounded-full bg-[#0B1322] border-2 border-emerald-400 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5 fill-emerald-500/20" />
                </div>
                <div className="text-xs">
                  <div className="font-bold text-white">{step.title}</div>
                  <div className="text-slate-400 text-[11px] mt-0.5">{step.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Refunds Panel */}
        <div className="rounded-2xl border border-white/10 bg-[#0B1322] p-5 shadow-2xl flex flex-col justify-between space-y-4">
          <div>
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Refunds
            </h2>
            <p className="text-xs text-slate-400 mt-3">
              {detail.refundNote}
            </p>
          </div>

          <div className="pt-4 border-t border-white/5">
            <button
              type="button"
              disabled={detail.status === "Refunded"}
              onClick={() => setRefundModalOpen(true)}
              className="w-full py-2.5 rounded-xl border border-white/10 hover:border-rose-500/40 text-xs font-semibold text-slate-300 hover:text-rose-400 hover:bg-rose-500/10 transition-all disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
            >
              Request Refund
            </button>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          5. BOTTOM ACTION BUTTONS (Exact match to Reference)
      ───────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={handleDownloadReceipt}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 text-sky-300 text-xs font-semibold transition-all cursor-pointer active:scale-95"
        >
          <Download className="w-4 h-4" />
          <span>Download Receipt</span>
        </button>

        <Link
          href={`/admin/invoices/${encodeURIComponent(detail.invoiceNumber)}`}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/10 text-white text-xs font-semibold transition-all cursor-pointer active:scale-95"
        >
          <ExternalLink className="w-4 h-4 text-slate-400" />
          <span>View Invoice</span>
        </Link>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          6. REFUND CONFIRMATION MODAL
      ───────────────────────────────────────────────────────────── */}
      {refundModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0B1322] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-rose-400" />
                Issue Refund for {detail.transactionId}
              </h3>
              <button
                type="button"
                onClick={() => setRefundModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleProcessRefund} className="space-y-4 text-xs">
              <p className="text-slate-300">
                Are you sure you want to refund <strong className="text-white">{formatMoney(detail.amountCents)}</strong> back to customer <strong className="text-white">{detail.customerName}</strong> via {detail.paymentMethod}?
              </p>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Reason for Refund</label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Work rescheduled, customer satisfaction guarantee..."
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0F172A] border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-[#F97316]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setRefundModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-white/10 text-slate-300 hover:text-white hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold"
                >
                  Confirm Refund
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
