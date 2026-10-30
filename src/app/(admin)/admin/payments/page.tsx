"use client";

import * as React from "react";
import Link from "next/link";
import {
  CreditCard,
  Download,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Clock,
  DollarSign,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Wallet,
  Search,
  Filter,
  TrendingUp,
  TrendingDown,
  MoreVertical,
  Eye,
  FileText,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { formatMoney } from "@/components/shared/Money";
import { safeFormatInTimeZone } from "@/lib/domain/format";
import { businessConfig } from "@config/business.config";

export interface PaymentItem {
  id: string;
  transactionId: string;
  date: string;
  customerName: string;
  invoiceNumber: string;
  method: string;
  amountCents: number;
  status: "Completed" | "Pending" | "Failed";
}

const DEFAULT_PAYMENTS: PaymentItem[] = [
  {
    id: "pay-1",
    transactionId: "TXN-9823647",
    date: "May 14, 2025",
    customerName: "Service Client A",
    invoiceNumber: "INV-1047",
    method: "Card (****4242)",
    amountCents: 32000,
    status: "Completed",
  },
  {
    id: "pay-2",
    transactionId: "TXN-9823646",
    date: "May 13, 2025",
    customerName: "Senior Field Tech",
    invoiceNumber: "INV-1046",
    method: "PayPal",
    amountCents: 85000,
    status: "Completed",
  },
  {
    id: "pay-3",
    transactionId: "TXN-9823645",
    date: "May 12, 2025",
    customerName: "Lead Field Technician",
    invoiceNumber: "INV-1045",
    method: "Card (****3555)",
    amountCents: 125000,
    status: "Pending",
  },
  {
    id: "pay-4",
    transactionId: "TXN-9823644",
    date: "May 11, 2025",
    customerName: "Service Client",
    invoiceNumber: "INV-1044",
    method: "Bank Transfer",
    amountCents: 7500,
    status: "Completed",
  },
  {
    id: "pay-5",
    transactionId: "TXN-9823643",
    date: "May 10, 2025",
    customerName: "Service Client H",
    invoiceNumber: "INV-1043",
    method: "Card (****4242)",
    amountCents: 54000,
    status: "Completed",
  },
  {
    id: "pay-6",
    transactionId: "TXN-9823642",
    date: "May 9, 2025",
    customerName: "Maintenance Specialist",
    invoiceNumber: "INV-1042",
    method: "PayPal",
    amountCents: 98000,
    status: "Failed",
  },
  {
    id: "pay-7",
    transactionId: "TXN-9823641",
    date: "May 8, 2025",
    customerName: "Commercial Tech",
    invoiceNumber: "INV-1041",
    method: "Card (****9899)",
    amountCents: 62000,
    status: "Completed",
  },
];

export default function AdminPaymentsPage() {
  const [payments, setPayments] = React.useState<PaymentItem[]>(DEFAULT_PAYMENTS);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [methodFilter, setMethodFilter] = React.useState("all");
  const [dateRange, setDateRange] = React.useState("Last 30 Days");
  const [activeMenuId, setActiveMenuId] = React.useState<string | null>(null);
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  // Filter payments
  const filtered = React.useMemo(() => {
    return payments.filter((item) => {
      if (methodFilter !== "all") {
        if (methodFilter === "card" && !item.method.toLowerCase().includes("card")) return false;
        if (methodFilter === "paypal" && !item.method.toLowerCase().includes("paypal")) return false;
        if (methodFilter === "bank" && !item.method.toLowerCase().includes("bank")) return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = item.customerName.toLowerCase().includes(q);
        const matchesInv = item.invoiceNumber.toLowerCase().includes(q);
        const matchesTx = item.transactionId.toLowerCase().includes(q);
        if (!matchesName && !matchesInv && !matchesTx) return false;
      }
      return true;
    });
  }, [payments, methodFilter, searchQuery]);

  function handleDownloadReceipt(item: PaymentItem) {
    toast.success(`Downloading receipt for ${item.transactionId}...`);
  }

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* ─────────────────────────────────────────────────────────────
          1. HEADER (Exact match to Reference Screenshot)
      ───────────────────────────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Payments
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Track customer transactions, payment methods, amounts, and settlement status.
        </p>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. METRIC KPI CARDS (4 Columns matching Reference)
      ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Transactions */}
        <div className="rounded-2xl border border-white/10 bg-[#0B1322] p-4 sm:p-5 flex flex-col justify-between">
          <div className="text-xs font-medium text-slate-400">Total Transactions</div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              142
            </span>
          </div>
          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>14% this month</span>
          </div>
        </div>

        {/* Total Amount */}
        <div className="rounded-2xl border border-white/10 bg-[#0B1322] p-4 sm:p-5 flex flex-col justify-between">
          <div className="text-xs font-medium text-slate-400">Total Amount</div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              $48,250
            </span>
          </div>
          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>22% this month</span>
          </div>
        </div>

        {/* Successful */}
        <div className="rounded-2xl border border-white/10 bg-[#0B1322] p-4 sm:p-5 flex flex-col justify-between">
          <div className="text-xs font-medium text-slate-400">Successful</div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              132
            </span>
            <span className="text-xs text-slate-400 font-medium">(93%)</span>
          </div>
          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>19 (14%)</span>
          </div>
        </div>

        {/* Failed */}
        <div className="rounded-2xl border border-white/10 bg-[#0B1322] p-4 sm:p-5 flex flex-col justify-between">
          <div className="text-xs font-medium text-slate-400">Failed</div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              10
            </span>
          </div>
          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-rose-400 font-medium">
            <TrendingDown className="w-3.5 h-3.5" />
            <span>0 (7%)</span>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. FILTER BAR (Search, Payment Method, Date Range, Filter)
      ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by customer, invoice or transaction ID..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#0B1322] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#F97316] transition-all"
          />
        </div>

        {/* Dropdowns & Filter */}
        <div className="flex items-center gap-3">
          {/* Method Filter */}
          <div className="relative">
            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              className="appearance-none px-3.5 py-2 pr-8 rounded-xl bg-[#0B1322] border border-white/10 text-xs text-slate-300 focus:outline-none focus:border-[#F97316] transition-all cursor-pointer"
            >
              <option value="all">Payment Method: All Methods</option>
              <option value="card">Card</option>
              <option value="paypal">PayPal</option>
              <option value="bank">Bank Transfer</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Date Range Filter */}
          <div className="relative">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="appearance-none px-3.5 py-2 pr-8 rounded-xl bg-[#0B1322] border border-white/10 text-xs text-slate-300 focus:outline-none focus:border-[#F97316] transition-all cursor-pointer"
            >
              <option value="Last 30 Days">Date Range: Last 30 Days</option>
              <option value="Last 7 Days">Date Range: Last 7 Days</option>
              <option value="Last 90 Days">Date Range: Last 90 Days</option>
              <option value="This Year">Date Range: This Year</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Filter Button */}
          <button
            type="button"
            onClick={() => toast.info("Filter applied")}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0B1322] border border-white/10 hover:border-white/20 text-xs font-semibold text-slate-300 hover:text-white transition-all cursor-pointer"
          >
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          4. PAYMENTS TABLE (Exact match to Reference Screenshot)
      ───────────────────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-white/10 bg-[#0B1322] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 bg-[#0F172A]/70 text-slate-400 font-semibold tracking-wider">
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-4">Method</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    No payment records match the current filters.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-white/[0.02] transition-colors group"
                  >
                    {/* Date */}
                    <td className="py-3.5 px-4 text-slate-300 whitespace-nowrap">
                      {item.date}
                    </td>

                    {/* Customer */}
                    <td className="py-3.5 px-4 font-medium text-white">
                      <Link
                        href="/admin/customers"
                        className="hover:text-[#F97316] transition-colors"
                      >
                        {item.customerName}
                      </Link>
                    </td>

                    {/* Invoice # */}
                    <td className="py-3.5 px-4 font-mono font-medium text-slate-300">
                      <Link
                        href={`/admin/invoices/${encodeURIComponent(item.invoiceNumber)}`}
                        className="hover:text-[#F97316] transition-colors"
                      >
                        {item.invoiceNumber}
                      </Link>
                    </td>

                    {/* Method */}
                    <td className="py-3.5 px-4 text-slate-300">
                      {item.method}
                    </td>

                    {/* Amount */}
                    <td className="py-3.5 px-4 font-semibold text-white">
                      {formatMoney(item.amountCents)}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      {item.status === "Completed" ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                          Completed
                        </span>
                      ) : item.status === "Pending" ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                          Pending
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/30">
                          Failed
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-center relative">
                      <div className="inline-block text-left">
                        <button
                          type="button"
                          onClick={() => setActiveMenuId(activeMenuId === item.id ? null : item.id)}
                          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {/* Dropdown Menu */}
                        {activeMenuId === item.id && (
                          <div className="absolute right-4 mt-1 w-44 rounded-xl bg-[#0F172A] border border-white/15 shadow-2xl py-1.5 z-30 text-left">
                            <Link
                              href={`/admin/payments/${encodeURIComponent(item.transactionId)}`}
                              className="flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:bg-white/10 hover:text-white"
                              onClick={() => setActiveMenuId(null)}
                            >
                              <Eye className="w-3.5 h-3.5 text-slate-400" />
                              <span>Payment Detail</span>
                            </Link>
                            <Link
                              href={`/admin/invoices/${encodeURIComponent(item.invoiceNumber)}`}
                              className="flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:bg-white/10 hover:text-white"
                              onClick={() => setActiveMenuId(null)}
                            >
                              <FileText className="w-3.5 h-3.5 text-slate-400" />
                              <span>View Invoice</span>
                            </Link>
                            <button
                              type="button"
                              onClick={() => {
                                handleDownloadReceipt(item);
                                setActiveMenuId(null);
                              }}
                              className="flex items-center gap-2 w-full px-3 py-2 text-xs text-slate-300 hover:bg-white/10 hover:text-white text-left"
                            >
                              <Download className="w-3.5 h-3.5 text-slate-400" />
                              <span>Download Receipt</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            5. TABLE FOOTER (Pagination matching Reference)
        ───────────────────────────────────────────────────────────── */}
        <div className="px-4 py-3.5 border-t border-white/10 bg-[#0F172A]/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-400">
          <div>
            Showing 1 to {filtered.length} of 142 payments
          </div>

          <div className="flex items-center gap-4">
            {/* Pagination Controls */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="w-7 h-7 flex items-center justify-center rounded-lg border border-white/10 text-slate-400 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:pointer-events-none"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#F97316] text-white font-bold"
              >
                1
              </button>

              {[2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setPage(num)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg border border-transparent text-slate-400 hover:text-white hover:bg-white/5"
                >
                  {num}
                </button>
              ))}

              <span className="px-1 text-slate-600">...</span>

              <button
                type="button"
                onClick={() => setPage(21)}
                className="w-7 h-7 flex items-center justify-center rounded-lg border border-transparent text-slate-400 hover:text-white hover:bg-white/5"
              >
                21
              </button>

              <button
                type="button"
                onClick={() => setPage((p) => p + 1)}
                className="w-7 h-7 flex items-center justify-center rounded-lg border border-white/10 text-slate-400 hover:text-white hover:bg-white/5"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Rows Per Page */}
            <div className="flex items-center gap-1.5 pl-2 border-l border-white/10">
              <span>Rows per page:</span>
              <select
                value={rowsPerPage}
                onChange={(e) => setRowsPerPage(Number(e.target.value))}
                className="bg-transparent text-white focus:outline-none cursor-pointer"
              >
                <option value={10} className="bg-[#0F172A] text-white">10</option>
                <option value={20} className="bg-[#0F172A] text-white">20</option>
                <option value={50} className="bg-[#0F172A] text-white">50</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
