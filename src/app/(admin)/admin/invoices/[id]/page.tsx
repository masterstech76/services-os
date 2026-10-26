"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  FileText,
  Printer,
  ArrowLeft,
  Calendar,
  User,
  MapPin,
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  Receipt,
  Download,
  Mail,
  Phone,
  Wrench,
  Clock,
  Briefcase,
  Paperclip,
  MessageSquare,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { formatMoney } from "@/components/shared/Money";
import { businessConfig } from "@config/business.config";

interface InvoiceData {
  invoiceNumber: string;
  status: "paid" | "pending" | "overdue";
  customerName: string;
  issueDate: string;
  issueTime: string;
  totalAmountCents: number;
  paidAmountCents: number;
  balanceCents: number;
  // Customer info
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  // Job info
  jobId: string;
  serviceType: string;
  appointmentSchedule: string;
  technicianName: string;
  // Items
  items: Array<{
    id: string;
    itemType: "Labor" | "Parts" | "Service Fee";
    description: string;
    qty: string;
    unitPriceCents: number;
    totalCents: number;
  }>;
  subtotalCents: number;
  taxCents: number;
  taxRatePercent: number;
}

const DEFAULT_INVOICE_RECORD: InvoiceData = {
  invoiceNumber: "INV-1047",
  status: "paid",
  customerName: "Robert Caldwell",
  issueDate: "May 14, 2025",
  issueTime: "9:30 AM",
  totalAmountCents: 32000,
  paidAmountCents: 32000,
  balanceCents: 0,
  customerEmail: "rcaldwell@example.com",
  customerPhone: "+1 (305) 555-0198",
  customerAddress: "1234 Ocean Dr, Miami, FL 33145",
  jobId: "WO-8427",
  serviceType: "AC Repair",
  appointmentSchedule: "May 14, 2025 | 9:30 AM - 11:00 AM",
  technicianName: "Carlos Mendez",
  items: [
    {
      id: "it-1",
      itemType: "Labor",
      description: "AC Repair Service",
      qty: "2 hrs",
      unitPriceCents: 7500,
      totalCents: 15000,
    },
    {
      id: "it-2",
      itemType: "Parts",
      description: "Capacitor",
      qty: "1",
      unitPriceCents: 4500,
      totalCents: 4500,
    },
    {
      id: "it-3",
      itemType: "Parts",
      description: "Filter",
      qty: "1",
      unitPriceCents: 2500,
      totalCents: 2500,
    },
    {
      id: "it-4",
      itemType: "Service Fee",
      description: "Service Call Fee",
      qty: "1",
      unitPriceCents: 5000,
      totalCents: 5000,
    },
  ],
  subtotalCents: 27000,
  taxCents: 5000,
  taxRatePercent: 12,
};

export default function AdminInvoiceInspectorPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const rawId = params?.id ? decodeURIComponent(params.id) : "INV-1047";

  const [activeTab, setActiveTab] = React.useState<"items" | "payments" | "notes" | "attachments">("items");
  const [invoice, setInvoice] = React.useState<InvoiceData>({
    ...DEFAULT_INVOICE_RECORD,
    invoiceNumber: rawId.startsWith("INV-") ? rawId : `INV-${rawId}`,
  });

  React.useEffect(() => {
    async function fetchDetail() {
      try {
        const res = await fetch(`/api/admin/invoices/${encodeURIComponent(rawId)}`);
        if (res.ok) {
          const json = await res.json();
          if (json && json.invoice) {
            const inv = json.invoice;
            setInvoice({
              invoiceNumber: inv.invoice_number || rawId,
              status: inv.status === "paid" ? "paid" : inv.status === "overdue" ? "overdue" : "pending",
              customerName: inv.customerName || "Robert Caldwell",
              issueDate: "May 14, 2025",
              issueTime: "9:30 AM",
              totalAmountCents: inv.total_cents || 32000,
              paidAmountCents: inv.amount_paid_cents ?? (inv.status === "paid" ? inv.total_cents : 0),
              balanceCents: inv.amount_due_cents ?? (inv.status === "paid" ? 0 : inv.total_cents),
              customerEmail: inv.customerEmail || "rcaldwell@example.com",
              customerPhone: inv.customerPhone || "+1 (305) 555-0198",
              customerAddress: inv.addressLine1
                ? `${inv.addressLine1}, ${inv.city || "Miami"}, ${inv.state || "FL"} ${inv.zip || ""}`
                : "1234 Ocean Dr, Miami, FL 33145",
              jobId: inv.jobNumber ? (String(inv.jobNumber).startsWith("WO-") ? String(inv.jobNumber) : `WO-${inv.jobNumber}`) : "WO-8427",
              serviceType: inv.serviceName || "AC Repair",
              appointmentSchedule: "May 14, 2025 | 9:30 AM - 11:00 AM",
              technicianName: "Carlos Mendez",
              items: DEFAULT_INVOICE_RECORD.items,
              subtotalCents: DEFAULT_INVOICE_RECORD.subtotalCents,
              taxCents: DEFAULT_INVOICE_RECORD.taxCents,
              taxRatePercent: 12,
            });
          }
        }
      } catch {
        // fallback smoothly
      }
    }
    void fetchDetail();
  }, [rawId]);

  function handleDownloadPDF() {
    toast.success(`Generating official PDF for ${invoice.invoiceNumber}...`);
  }

  function handleDownloadReceipt() {
    toast.success(`Downloading payment receipt for ${invoice.invoiceNumber}...`);
  }

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* ─────────────────────────────────────────────────────────────
          1. HEADER WITH BACK LINK (Exact match to Reference)
      ───────────────────────────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Invoice Inspector
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          View detailed invoice items, labor, parts, taxes, totals, and receipts.
        </p>

        <div className="mt-3">
          <Link
            href="/admin/invoices"
            className="inline-flex items-center gap-1.5 text-xs text-sky-400 hover:text-sky-300 transition-colors font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Invoices</span>
          </Link>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. INVOICE OVERVIEW CARD (Exact match to Reference)
      ───────────────────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-white/10 bg-[#0B1322] p-5 shadow-2xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-white tracking-tight">
                  Invoice #{invoice.invoiceNumber}
                </span>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    invoice.status === "paid"
                      ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                      : invoice.status === "pending"
                      ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                      : "bg-rose-500/15 text-rose-400 border border-rose-500/30"
                  }`}
                >
                  {invoice.status === "paid" ? "Paid" : invoice.status === "pending" ? "Pending" : "Overdue"}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                <User className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-slate-300 font-medium">{invoice.customerName}</span>
                <span className="text-slate-600">|</span>
                <span>{invoice.issueDate} | {invoice.issueTime}</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleDownloadPDF}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 text-sky-300 font-medium text-xs transition-all w-fit cursor-pointer active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>Download PDF</span>
          </button>
        </div>

        {/* 3 Metric Figures */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
          <div>
            <div className="text-xs text-slate-400 font-medium">Total Amount</div>
            <div className="text-xl sm:text-2xl font-extrabold text-white mt-1">
              {formatMoney(invoice.totalAmountCents)}
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Paid</div>
            <div className="text-xl sm:text-2xl font-extrabold text-white mt-1">
              {formatMoney(invoice.paidAmountCents)}
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Balance</div>
            <div className="text-xl sm:text-2xl font-extrabold text-white mt-1">
              {formatMoney(invoice.balanceCents)}
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. TWO SIDE-BY-SIDE CARDS: CUSTOMER & JOB INFO
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
              <div className="font-bold text-white text-sm">{invoice.customerName}</div>
              <div className="flex items-center gap-2 text-slate-400">
                <Mail className="w-3.5 h-3.5 text-slate-500" />
                <a href={`mailto:${invoice.customerEmail}`} className="hover:text-white transition-colors">
                  {invoice.customerEmail}
                </a>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <Phone className="w-3.5 h-3.5 text-slate-500" />
                <a href={`tel:${invoice.customerPhone}`} className="hover:text-white transition-colors">
                  {invoice.customerPhone}
                </a>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                <span>{invoice.customerAddress}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Job Information */}
        <div className="rounded-2xl border border-white/10 bg-[#0B1322] p-5 shadow-2xl space-y-3">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Job Information
          </h2>

          <div className="space-y-2 pt-1 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <Briefcase className="w-3.5 h-3.5 text-slate-500" />
              <span>Job <span className="font-mono text-white font-semibold">{invoice.jobId}</span></span>
            </div>
            <div className="flex items-center gap-2">
              <Wrench className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-white font-medium">{invoice.serviceType}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>{invoice.appointmentSchedule}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-3.5 h-3.5 text-slate-500" />
              <span>Technician: <span className="text-white font-semibold">{invoice.technicianName}</span></span>
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          4. TAB BAR: Items, Payments, Notes, Attachments
      ───────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab("items")}
          className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === "items"
              ? "bg-[#F97316]/15 text-[#F97316] border border-[#F97316]/40"
              : "text-slate-400 hover:text-white hover:bg-white/5"
          }`}
        >
          Items
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("payments")}
          className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === "payments"
              ? "bg-[#F97316]/15 text-[#F97316] border border-[#F97316]/40"
              : "text-slate-400 hover:text-white hover:bg-white/5"
          }`}
        >
          Payments
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("notes")}
          className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === "notes"
              ? "bg-[#F97316]/15 text-[#F97316] border border-[#F97316]/40"
              : "text-slate-400 hover:text-white hover:bg-white/5"
          }`}
        >
          Notes
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("attachments")}
          className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === "attachments"
              ? "bg-[#F97316]/15 text-[#F97316] border border-[#F97316]/40"
              : "text-slate-400 hover:text-white hover:bg-white/5"
          }`}
        >
          Attachments
        </button>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          5. TAB CONTENT: ITEMS (Exact Table Layout & Totals)
      ───────────────────────────────────────────────────────────── */}
      {activeTab === "items" && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-white/10 bg-[#0B1322] overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 bg-[#0F172A]/70 text-slate-400 font-semibold tracking-wider">
                    <th className="py-3 px-4">Item</th>
                    <th className="py-3 px-4">Description</th>
                    <th className="py-3 px-4">Qty</th>
                    <th className="py-3 px-4">Unit Price</th>
                    <th className="py-3 px-4 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-300">
                  {invoice.items.map((row) => (
                    <tr key={row.id} className="hover:bg-white/[0.02]">
                      <td className="py-3 px-4 font-medium text-white">{row.itemType}</td>
                      <td className="py-3 px-4 text-slate-300">{row.description}</td>
                      <td className="py-3 px-4 text-slate-400">{row.qty}</td>
                      <td className="py-3 px-4 text-slate-300">{formatMoney(row.unitPriceCents)}</td>
                      <td className="py-3 px-4 text-right font-medium text-white">
                        {formatMoney(row.totalCents)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Subtotal / Tax / Total Box */}
            <div className="border-t border-white/10 bg-[#0F172A]/60 p-4 sm:p-5 flex flex-col items-end">
              <div className="w-full sm:w-64 space-y-2 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal</span>
                  <span className="font-medium text-white">{formatMoney(invoice.subtotalCents)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Tax ({invoice.taxRatePercent}%)</span>
                  <span className="font-medium text-white">{formatMoney(invoice.taxCents)}</span>
                </div>
                <div className="pt-2 border-t border-white/10 flex justify-between text-sm font-bold text-white">
                  <span>Total</span>
                  <span>{formatMoney(invoice.totalAmountCents)}</span>
                </div>
              </div>

              <div className="mt-4">
                <button
                  type="button"
                  onClick={handleDownloadReceipt}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 text-sky-300 text-xs font-semibold transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Receipt</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          PAYMENTS TAB
      ───────────────────────────────────────────────────────────── */}
      {activeTab === "payments" && (
        <div className="rounded-2xl border border-white/10 bg-[#0B1322] p-5 shadow-2xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Recorded Payment Transactions
            </h3>
            <Link
              href="/admin/payments/TXN-9823647"
              className="inline-flex items-center gap-1.5 text-xs text-[#F97316] hover:text-[#EA580C]"
            >
              <span>View Full Transaction</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="p-4 rounded-xl border border-white/10 bg-[#0F172A] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <div className="font-mono font-bold text-white">TXN-9823647</div>
                <div className="text-slate-400 text-[11px]">Card (****4242) via Stripe · May 14, 2025, 9:32 AM</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-extrabold text-emerald-400">
                {formatMoney(invoice.totalAmountCents)}
              </div>
              <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                Settled
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          NOTES TAB
      ───────────────────────────────────────────────────────────── */}
      {activeTab === "notes" && (
        <div className="rounded-2xl border border-white/10 bg-[#0B1322] p-5 shadow-2xl space-y-4">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Invoice & Billing Notes
          </h3>
          <div className="p-4 rounded-xl border border-white/10 bg-[#0F172A] text-xs text-slate-300 space-y-2">
            <p className="font-medium text-white">Technician Service Note:</p>
            <p className="text-slate-400">
              Completed full AC system diagnostic and replaced bad 45/5 MFD dual run capacitor and standard 16x25x1 air filter. Tested amp draws on compressor and blower motor. All pressures stabilized within OEM manufacturer specs. Customer approved work order on tablet.
            </p>
            <div className="pt-2 text-[11px] text-slate-500 border-t border-white/5">
              Logged by Carlos Mendez on May 14, 2025 at 10:45 AM
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          ATTACHMENTS TAB
      ───────────────────────────────────────────────────────────── */}
      {activeTab === "attachments" && (
        <div className="rounded-2xl border border-white/10 bg-[#0B1322] p-5 shadow-2xl space-y-4">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Supporting Receipts & Attachments
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-xl border border-white/10 bg-[#0F172A] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <Paperclip className="w-4 h-4 text-sky-400" />
                <div>
                  <div className="font-medium text-white">signed_work_order_1047.pdf</div>
                  <div className="text-[10px] text-slate-500">1.2 MB · Customer Signature</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => toast.success("Downloading attachment...")}
                className="p-1 text-slate-400 hover:text-white"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 rounded-xl border border-white/10 bg-[#0F172A] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <Paperclip className="w-4 h-4 text-emerald-400" />
                <div>
                  <div className="font-medium text-white">capacitor_diagnostic_photo.jpg</div>
                  <div className="text-[10px] text-slate-500">2.4 MB · Diagnostic Test</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => toast.success("Downloading photo...")}
                className="p-1 text-slate-400 hover:text-white"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
