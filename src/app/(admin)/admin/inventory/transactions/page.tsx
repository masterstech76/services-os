"use client";

import * as React from "react";
import Link from "next/link";
import {
  Layers,
  Search,
  Filter,
  Plus,
  ArrowDownLeft,
  ArrowUpRight,
  RotateCcw,
  User,
  FileText,
  Calendar,
  Clock,
  TrendingUp,
  TrendingDown,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  X,
} from "lucide-react";
import { toast } from "sonner";

export interface StockTransaction {
  id: string;
  dateTime: string;
  type: "Restock" | "Consumption" | "Adjustment";
  partName: string;
  sku: string;
  quantityChange: number;
  reference: string;
  userRole: "Admin" | "Technician";
}

const DEFAULT_TRANSACTIONS: StockTransaction[] = [
  {
    id: "tx-1",
    dateTime: "May 20, 2025 10:24 AM",
    type: "Restock",
    partName: "AC Filter",
    sku: "ACF-001",
    quantityChange: 20,
    reference: "PO-4887",
    userRole: "Admin",
  },
  {
    id: "tx-2",
    dateTime: "May 20, 2025 09:15 AM",
    type: "Consumption",
    partName: "Refrigerant R134a",
    sku: "REF-134a",
    quantityChange: -4,
    reference: "WO-8427",
    userRole: "Technician",
  },
  {
    id: "tx-3",
    dateTime: "May 19, 2025 04:32 PM",
    type: "Adjustment",
    partName: "Belt Drive",
    sku: "BD-012",
    quantityChange: 5,
    reference: "Adjustment",
    userRole: "Admin",
  },
  {
    id: "tx-4",
    dateTime: "May 19, 2025 12:17 PM",
    type: "Restock",
    partName: "Compressor",
    sku: "CMP-001",
    quantityChange: 2,
    reference: "PO-4886",
    userRole: "Admin",
  },
  {
    id: "tx-5",
    dateTime: "May 18, 2025 03:45 PM",
    type: "Consumption",
    partName: "Spark Plug",
    sku: "SPK-004",
    quantityChange: -3,
    reference: "WO-8425",
    userRole: "Technician",
  },
  {
    id: "tx-6",
    dateTime: "May 18, 2025 11:22 AM",
    type: "Restock",
    partName: "Thermostat",
    sku: "TH-007",
    quantityChange: 8,
    reference: "PO-4885",
    userRole: "Admin",
  },
  {
    id: "tx-7",
    dateTime: "May 17, 2025 02:11 PM",
    type: "Adjustment",
    partName: "Control Board",
    sku: "CB-044",
    quantityChange: -1,
    reference: "Manual",
    userRole: "Admin",
  },
  {
    id: "tx-8",
    dateTime: "May 17, 2025 09:37 AM",
    type: "Consumption",
    partName: "Water Pump",
    sku: "WP-022",
    quantityChange: -2,
    reference: "WO-8422",
    userRole: "Technician",
  },
  {
    id: "tx-9",
    dateTime: "May 16, 2025 04:18 PM",
    type: "Restock",
    partName: "Seal Kit",
    sku: "SK-031",
    quantityChange: 15,
    reference: "PO-4884",
    userRole: "Admin",
  },
  {
    id: "tx-10",
    dateTime: "May 16, 2025 01:05 PM",
    type: "Consumption",
    partName: "Circuit Breaker",
    sku: "CB-015",
    quantityChange: -4,
    reference: "WO-8421",
    userRole: "Technician",
  },
];

export default function AdminStockTransactionsPage() {
  const [transactions, setTransactions] = React.useState<StockTransaction[]>(DEFAULT_TRANSACTIONS);
  const [activeTab, setActiveTab] = React.useState<"all" | "Restock" | "Consumption" | "Adjustment">("all");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [recordModalOpen, setRecordModalOpen] = React.useState(false);

  // Form State
  const [partName, setPartName] = React.useState("");
  const [sku, setSku] = React.useState("");
  const [movementType, setMovementType] = React.useState<"Restock" | "Consumption" | "Adjustment">("Restock");
  const [quantity, setQuantity] = React.useState("5");
  const [reference, setReference] = React.useState("PO-4888");

  const filtered = React.useMemo(() => {
    return transactions.filter((tx) => {
      if (activeTab !== "all" && tx.type !== activeTab) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = tx.partName.toLowerCase().includes(q);
        const matchesSku = tx.sku.toLowerCase().includes(q);
        const matchesRef = tx.reference.toLowerCase().includes(q);
        if (!matchesName && !matchesSku && !matchesRef) return false;
      }
      return true;
    });
  }, [transactions, activeTab, searchQuery]);

  function handleRecordTransaction(e: React.FormEvent) {
    e.preventDefault();
    if (!partName.trim() || !sku.trim()) {
      toast.error("Please enter a part name and SKU.");
      return;
    }
    const qtyNum = parseInt(quantity) || 1;
    const finalChange = movementType === "Consumption" ? -Math.abs(qtyNum) : Math.abs(qtyNum);
    const created: StockTransaction = {
      id: `tx-${Date.now()}`,
      dateTime: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
      }),
      type: movementType,
      partName: partName.trim(),
      sku: sku.trim().toUpperCase(),
      quantityChange: finalChange,
      reference: reference.trim() || "Manual",
      userRole: "Admin",
    };
    setTransactions([created, ...transactions]);
    setRecordModalOpen(false);
    setPartName("");
    setSku("");
    toast.success(`Recorded ${movementType} of ${Math.abs(finalChange)} units for ${created.partName}!`);
  }

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* ─────────────────────────────────────────────────────────────
          1. HEADER (Exact match to Reference Screenshot)
      ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Stock Transactions
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Track restocking, job consumption, manual adjustments, and stock history.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setRecordModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold text-xs shadow-lg shadow-[#F97316]/20 transition-all w-fit cursor-pointer active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Record Movement</span>
        </button>
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
              156
            </span>
          </div>
          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>12% vs last month</span>
          </div>
        </div>

        {/* Restocked */}
        <div className="rounded-2xl border border-white/10 bg-[#0B1322] p-4 sm:p-5 flex flex-col justify-between">
          <div className="text-xs font-medium text-slate-400">Restocked</div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              78
            </span>
          </div>
          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>18% vs last month</span>
          </div>
        </div>

        {/* Adjusted */}
        <div className="rounded-2xl border border-white/10 bg-[#0B1322] p-4 sm:p-5 flex flex-col justify-between">
          <div className="text-xs font-medium text-slate-400">Adjusted</div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              12
            </span>
          </div>
          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>2% this month</span>
          </div>
        </div>

        {/* Total Consumption */}
        <div className="rounded-2xl border border-white/10 bg-[#0B1322] p-4 sm:p-5 flex flex-col justify-between">
          <div className="text-xs font-medium text-slate-400">Total Consumption</div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              12
            </span>
          </div>
          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>10% $12,480</span>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. TABS FILTER BAR (All, Restocking, Consumption, Adjustments)
      ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "all"
                ? "bg-[#F97316]/15 text-[#F97316] border border-[#F97316]/40"
                : "bg-[#0B1322] border border-white/10 text-slate-300 hover:text-white hover:bg-white/5"
            }`}
          >
            All Transactions
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("Restock")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "Restock"
                ? "bg-[#F97316]/15 text-[#F97316] border border-[#F97316]/40"
                : "bg-[#0B1322] border border-white/10 text-slate-300 hover:text-white hover:bg-white/5"
            }`}
          >
            Restocking
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("Consumption")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "Consumption"
                ? "bg-[#F97316]/15 text-[#F97316] border border-[#F97316]/40"
                : "bg-[#0B1322] border border-white/10 text-slate-300 hover:text-white hover:bg-white/5"
            }`}
          >
            Consumption
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("Adjustment")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "Adjustment"
                ? "bg-[#F97316]/15 text-[#F97316] border border-[#F97316]/40"
                : "bg-[#0B1322] border border-white/10 text-slate-300 hover:text-white hover:bg-white/5"
            }`}
          >
            Adjustments
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search transactions..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-[#0B1322] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#F97316]"
          />
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          4. TRANSACTIONS TABLE (Exact match to Reference Screenshot)
      ───────────────────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-white/10 bg-[#0B1322] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 bg-[#0F172A]/70 text-slate-400 font-semibold tracking-wider">
                <th className="py-3 px-4">Date &amp; Time</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Part Name</th>
                <th className="py-3 px-4">SKU</th>
                <th className="py-3 px-4">Quantity</th>
                <th className="py-3 px-4">Reference</th>
                <th className="py-3 px-4">User</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {filtered.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-white/[0.02] transition-colors group"
                >
                  {/* Date & Time */}
                  <td className="py-3.5 px-4 text-slate-300 whitespace-nowrap">
                    {item.dateTime}
                  </td>

                  {/* Type */}
                  <td className="py-3.5 px-4">
                    {item.type === "Restock" ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        Restock
                      </span>
                    ) : item.type === "Consumption" ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                        Consumption
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                        Adjustment
                      </span>
                    )}
                  </td>

                  {/* Part Name */}
                  <td className="py-3.5 px-4 font-medium text-white">
                    {item.partName}
                  </td>

                  {/* SKU */}
                  <td className="py-3.5 px-4 font-mono text-slate-400">
                    {item.sku}
                  </td>

                  {/* Quantity */}
                  <td className="py-3.5 px-4 font-mono font-bold">
                    <span className={item.quantityChange > 0 ? "text-emerald-400" : "text-rose-400"}>
                      {item.quantityChange > 0 ? `+${item.quantityChange}` : item.quantityChange}
                    </span>
                  </td>

                  {/* Reference */}
                  <td className="py-3.5 px-4 font-mono text-slate-300">
                    {item.reference}
                  </td>

                  {/* User */}
                  <td className="py-3.5 px-4 text-slate-400">
                    {item.userRole}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            5. TABLE FOOTER (Pagination matching Reference)
        ───────────────────────────────────────────────────────────── */}
        <div className="px-4 py-3.5 border-t border-white/10 bg-[#0F172A]/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-400">
          <div>
            Showing 1 to {filtered.length} of 156 transactions
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

              {[2, 3].map((num) => (
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
                onClick={() => setPage(16)}
                className="w-7 h-7 flex items-center justify-center rounded-lg border border-transparent text-slate-400 hover:text-white hover:bg-white/5"
              >
                16
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
              <select
                value={rowsPerPage}
                onChange={(e) => setRowsPerPage(Number(e.target.value))}
                className="bg-transparent text-white focus:outline-none cursor-pointer"
              >
                <option value={10} className="bg-[#0F172A] text-white">10 / page</option>
                <option value={20} className="bg-[#0F172A] text-white">20 / page</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          6. RECORD MOVEMENT MODAL
      ───────────────────────────────────────────────────────────── */}
      {recordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0B1322] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#F97316]" />
                Record Stock Movement
              </h3>
              <button
                type="button"
                onClick={() => setRecordModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRecordTransaction} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Part Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. AC Filter"
                    value={partName}
                    onChange={(e) => setPartName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0F172A] border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-[#F97316]"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1">SKU</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ACF-001"
                    value={sku}
                    onChange={(e) => setSku(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 rounded-xl bg-[#0F172A] border border-white/10 text-white placeholder-slate-500 font-mono focus:outline-none focus:border-[#F97316]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Type</label>
                  <select
                    value={movementType}
                    onChange={(e) => setMovementType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0F172A] border border-white/10 text-white focus:outline-none focus:border-[#F97316]"
                  >
                    <option value="Restock">Restock (+)</option>
                    <option value="Consumption">Consumption (-)</option>
                    <option value="Adjustment">Adjustment (±)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    required
                    placeholder="5"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0F172A] border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-[#F97316]"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Reference</label>
                  <input
                    type="text"
                    placeholder="PO-4888 or WO-8428"
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0F172A] border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-[#F97316]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setRecordModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-white/10 text-slate-300 hover:text-white hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white font-bold"
                >
                  Save Movement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
