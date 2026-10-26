"use client";

import * as React from "react";
import Link from "next/link";
import {
  Package,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  ArrowRight,
  Plus,
  RefreshCw,
  BarChart3,
  FileText,
  DollarSign,
  ShoppingCart,
  Layers,
  ChevronRight,
  ExternalLink,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { formatMoney } from "@/components/shared/Money";

interface LowStockAlertItem {
  id: string;
  name: string;
  sku: string;
  currentStock: number;
  minLevel: number;
  status: "Low Stock" | "Out of Stock";
}

const LOW_STOCK_DATA: LowStockAlertItem[] = [
  {
    id: "part-1",
    name: "AC Filter",
    sku: "ACF-001",
    currentStock: 3,
    minLevel: 10,
    status: "Low Stock",
  },
  {
    id: "part-2",
    name: "Refrigerant R134a",
    sku: "REF-134a",
    currentStock: 2,
    minLevel: 8,
    status: "Low Stock",
  },
  {
    id: "part-3",
    name: "Belt Drive",
    sku: "BD-012",
    currentStock: 0,
    minLevel: 5,
    status: "Out of Stock",
  },
  {
    id: "part-4",
    name: "Spark Plug",
    sku: "SPK-004",
    currentStock: 4,
    minLevel: 10,
    status: "Low Stock",
  },
  {
    id: "part-5",
    name: "Compressor Oil",
    sku: "CO-006",
    currentStock: 6,
    minLevel: 15,
    status: "Low Stock",
  },
];

// SVG points for Stock Value Trend Line
const TREND_POINTS = [
  { label: "Apr 28", x: 10, y: 72, val: "$34,200" },
  { label: "May 5", x: 30, y: 64, val: "$38,400" },
  { label: "May 12", x: 50, y: 68, val: "$36,900" },
  { label: "May 19", x: 70, y: 44, val: "$44,800" },
  { label: "May 26", x: 92, y: 35, val: "$48,320" },
];

export default function AdminInventoryOverviewPage() {
  const [alerts, setAlerts] = React.useState<LowStockAlertItem[]>(LOW_STOCK_DATA);
  const [reorderModalItem, setReorderModalItem] = React.useState<LowStockAlertItem | null>(null);
  const [reorderQty, setReorderQty] = React.useState("20");

  function handleReorderConfirm(e: React.FormEvent) {
    e.preventDefault();
    if (!reorderModalItem) return;
    toast.success(`Purchase order created for ${reorderQty} units of ${reorderModalItem.name} (${reorderModalItem.sku})!`);
    setReorderModalItem(null);
  }

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* ─────────────────────────────────────────────────────────────
          1. HEADER (Exact match to Reference Screenshot)
      ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Inventory Overview
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Monitor stock levels, inventory value, low-stock alerts, and consumption.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/inventory/transactions"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-white/10 bg-[#0F172A] hover:bg-white/5 text-xs font-semibold text-slate-200 hover:text-white transition-all cursor-pointer"
          >
            <span>Stock History</span>
          </Link>
          <Link
            href="/admin/inventory/parts"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-[#020617] font-bold text-xs shadow-lg shadow-[#F97316]/20 transition-all cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Manage Parts</span>
          </Link>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. METRIC KPI CARDS (4 Columns matching Reference)
      ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Items */}
        <div className="rounded-2xl border border-white/10 bg-[#0B1322] p-4 sm:p-5 flex flex-col justify-between">
          <div className="text-xs font-medium text-slate-400">Total Items</div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              482
            </span>
          </div>
          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>12% vs last month</span>
          </div>
        </div>

        {/* Inventory Value */}
        <div className="rounded-2xl border border-white/10 bg-[#0B1322] p-4 sm:p-5 flex flex-col justify-between">
          <div className="text-xs font-medium text-slate-400">Inventory Value</div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              $48,320
            </span>
          </div>
          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>8% vs last month</span>
          </div>
        </div>

        {/* Low Stock Items */}
        <div className="rounded-2xl border border-white/10 bg-[#0B1322] p-4 sm:p-5 flex flex-col justify-between">
          <div className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>Low Stock Items</span>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              18
            </span>
          </div>
          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-rose-400 font-medium">
            <TrendingDown className="w-3.5 h-3.5" />
            <span>5% need attention</span>
          </div>
        </div>

        {/* Total Consumption */}
        <div className="rounded-2xl border border-white/10 bg-[#0B1322] p-4 sm:p-5 flex flex-col justify-between">
          <div className="text-xs font-medium text-slate-400">Total Consumption</div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              246
            </span>
          </div>
          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>15% this month</span>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. MIDDLE SECTION: STOCK VALUE TREND & STOCK STATUS
      ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Card (~66%): Stock Value Trend */}
        <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-[#0B1322] p-5 shadow-2xl flex flex-col justify-between">
          <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Stock Value Trend
          </h2>

          <div className="mt-4 relative h-48 w-full flex items-end">
            {/* Y-Axis scale */}
            <div className="flex flex-col justify-between h-full text-[10px] text-slate-500 font-mono pr-2 select-none">
              <span>$60K</span>
              <span>$45K</span>
              <span>$30K</span>
              <span>$15K</span>
              <span>$0</span>
            </div>

            {/* SVG Visual Chart */}
            <div className="flex-1 h-full relative">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0284c7" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#0284c7" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                {/* Horizontal reference lines */}
                <line x1="0" y1="20" x2="100" y2="20" stroke="rgba(255,255,255,0.05)" strokeDasharray="2 2" />
                <line x1="0" y1="40" x2="100" y2="40" stroke="rgba(255,255,255,0.05)" strokeDasharray="2 2" />
                <line x1="0" y1="60" x2="100" y2="60" stroke="rgba(255,255,255,0.05)" strokeDasharray="2 2" />
                <line x1="0" y1="80" x2="100" y2="80" stroke="rgba(255,255,255,0.05)" strokeDasharray="2 2" />

                {/* Area fill */}
                <polygon
                  points="10,72 30,64 50,68 70,44 92,35 92,100 10,100"
                  fill="url(#trendGradient)"
                />

                {/* Smooth Curve Line */}
                <polyline
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points="10,72 30,64 50,68 70,44 92,35"
                />

                {/* Markers */}
                {TREND_POINTS.map((pt, i) => (
                  <circle
                    key={i}
                    cx={pt.x}
                    cy={pt.y}
                    r="2.5"
                    className="fill-[#020617] stroke-sky-400 stroke-2"
                  />
                ))}
              </svg>

              {/* X-Axis Labels */}
              <div className="absolute inset-x-0 -bottom-5 flex justify-between text-[10px] text-slate-500 font-medium px-4">
                <span>Apr 28</span>
                <span>May 5</span>
                <span>May 12</span>
                <span>May 19</span>
                <span>May 26</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Card (~33%): Stock Status Donut */}
        <div className="rounded-2xl border border-white/10 bg-[#0B1322] p-5 shadow-2xl flex flex-col justify-between">
          <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Stock Status
          </h2>

          <div className="my-2 flex flex-col sm:flex-row items-center justify-center gap-6">
            {/* Donut Chart SVG */}
            <div className="relative w-32 h-32 flex-shrink-0 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                {/* Background Ring */}
                <circle cx="18" cy="18" r="14" fill="none" stroke="#1e293b" strokeWidth="4.5" />
                {/* In Stock (76%) -> 0.76 * 87.96 = 66.8 */}
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="4.5"
                  strokeDasharray="66.8 88"
                  strokeDashoffset="0"
                />
                {/* Low Stock (12%) -> 0.12 * 88 = 10.5 */}
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="4.5"
                  strokeDasharray="10.5 88"
                  strokeDashoffset="-66.8"
                />
                {/* Out of Stock (6%) -> 0.06 * 88 = 5.3 */}
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="4.5"
                  strokeDasharray="5.3 88"
                  strokeDashoffset="-77.3"
                />
                {/* Reserved (6%) */}
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="none"
                  stroke="#f43f5e"
                  strokeWidth="4.5"
                  strokeDasharray="5.3 88"
                  strokeDashoffset="-82.6"
                />
              </svg>

              {/* Center Counter */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-base font-extrabold text-white">482</span>
                <span className="text-[9px] text-slate-400">Total Items</span>
              </div>
            </div>

            {/* Legend */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
                  <span>In Stock</span>
                </div>
                <span className="font-bold text-white">76%</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <span>Low Stock</span>
                </div>
                <span className="font-bold text-white">12%</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <span>Out of Stock</span>
                </div>
                <span className="font-bold text-white">6%</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-pink-500" />
                  <span>Reserved</span>
                </div>
                <span className="font-bold text-white">6%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          4. LOW STOCK ALERTS TABLE (Exact match to Reference)
      ───────────────────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-white/10 bg-[#0B1322] overflow-hidden shadow-2xl">
        <div className="px-5 py-3.5 border-b border-white/10 bg-[#0F172A]/70 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#F97316]" />
            <h2 className="text-xs font-bold text-[#F97316] uppercase tracking-wider">
              Low Stock Alerts
            </h2>
          </div>
          <Link
            href="/admin/inventory/parts"
            className="text-xs font-medium text-sky-400 hover:text-sky-300 transition-colors"
          >
            View All
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 bg-[#0F172A]/40 text-slate-400 font-semibold tracking-wider">
                <th className="py-3 px-4">Part Name</th>
                <th className="py-3 px-4">SKU</th>
                <th className="py-3 px-4">Current Stock</th>
                <th className="py-3 px-4">Min. Level</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {alerts.map((row) => (
                <tr key={row.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-4 font-medium text-white">{row.name}</td>
                  <td className="py-3 px-4 font-mono text-slate-400">{row.sku}</td>
                  <td className="py-3 px-4 font-mono font-bold text-rose-400">{row.currentStock}</td>
                  <td className="py-3 px-4 font-mono text-slate-400">{row.minLevel}</td>
                  <td className="py-3 px-4">
                    {row.status === "Low Stock" ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                        Low Stock
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30">
                        Out of Stock
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      type="button"
                      onClick={() => setReorderModalItem(row)}
                      className="px-3 py-1 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 text-sky-300 text-xs font-semibold transition-all cursor-pointer"
                    >
                      Reorder
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          5. QUICK ACTIONS TILES (Exact match to Reference)
      ───────────────────────────────────────────────────────────── */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#F97316]" />
          <h3 className="text-xs font-bold text-[#F97316] uppercase tracking-wider">
            Quick Actions
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {/* New Part */}
          <Link
            href="/admin/inventory/parts?action=new"
            className="p-4 rounded-2xl border border-white/10 bg-[#0B1322] hover:bg-white/[0.04] transition-all flex flex-col items-center justify-center text-center gap-2 group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 group-hover:scale-110 transition-transform">
              <Package className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-white">New Part</span>
          </Link>

          {/* Add Stock */}
          <Link
            href="/admin/inventory/transactions?action=restock"
            className="p-4 rounded-2xl border border-white/10 bg-[#0B1322] hover:bg-white/[0.04] transition-all flex flex-col items-center justify-center text-center gap-2 group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
              <Layers className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-white">Add Stock</span>
          </Link>

          {/* Stock Report */}
          <button
            type="button"
            onClick={() => toast.success("Generating complete inventory valuation & stock report...")}
            className="p-4 rounded-2xl border border-white/10 bg-[#0B1322] hover:bg-white/[0.04] transition-all flex flex-col items-center justify-center text-center gap-2 group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
              <BarChart3 className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-white">Stock Report</span>
          </button>

          {/* Purchase Order */}
          <button
            type="button"
            onClick={() => toast.info("Opening supplier purchase order batch dispatch...")}
            className="p-4 rounded-2xl border border-white/10 bg-[#0B1322] hover:bg-white/[0.04] transition-all flex flex-col items-center justify-center text-center gap-2 group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-white">Purchase Order</span>
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          6. REORDER MODAL
      ───────────────────────────────────────────────────────────── */}
      {reorderModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0B1322] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-sky-400" />
                Reorder {reorderModalItem.name}
              </h3>
              <button
                type="button"
                onClick={() => setReorderModalItem(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleReorderConfirm} className="space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-[#0F172A] border border-white/10 space-y-1">
                <div className="text-slate-400">SKU: <span className="font-mono text-white">{reorderModalItem.sku}</span></div>
                <div className="text-slate-400">Current Stock: <span className="text-rose-400 font-bold">{reorderModalItem.currentStock}</span> (Min: {reorderModalItem.minLevel})</div>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Reorder Quantity</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={reorderQty}
                  onChange={(e) => setReorderQty(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0F172A] border border-white/10 text-white focus:outline-none focus:border-[#F97316]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setReorderModalItem(null)}
                  className="px-4 py-2 rounded-xl border border-white/10 text-slate-300 hover:text-white hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold"
                >
                  Issue Purchase Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
