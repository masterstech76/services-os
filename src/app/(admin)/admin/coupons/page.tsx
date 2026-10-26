"use client";

import * as React from "react";
import Link from "next/link";
import {
  Tag,
  Plus,
  CheckCircle2,
  XCircle,
  Clock,
  Calendar,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Percent,
  DollarSign,
  Gift,
  X,
  Search,
  Filter,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Edit2,
  Trash2,
  Copy,
} from "lucide-react";
import { toast } from "sonner";
import { formatMoney } from "@/components/shared/Money";

export interface CouponItem {
  id: string;
  code: string;
  type: "Percentage" | "Fixed Amount" | "Free Shipping";
  discount: string;
  minOrder: string;
  usage: string;
  expiryDate: string;
  status: "Active" | "Inactive";
}

const DEFAULT_COUPONS: CouponItem[] = [
  {
    id: "cp-1",
    code: "SAVE20",
    type: "Percentage",
    discount: "20%",
    minOrder: "$100",
    usage: "124/500",
    expiryDate: "May 31, 2025",
    status: "Active",
  },
  {
    id: "cp-2",
    code: "WELCOME10",
    type: "Percentage",
    discount: "10%",
    minOrder: "$50",
    usage: "89/300",
    expiryDate: "Jun 15, 2025",
    status: "Active",
  },
  {
    id: "cp-3",
    code: "FIXED50",
    type: "Fixed Amount",
    discount: "$50",
    minOrder: "$200",
    usage: "45/200",
    expiryDate: "May 25, 2025",
    status: "Active",
  },
  {
    id: "cp-4",
    code: "SUMMER25",
    type: "Percentage",
    discount: "25%",
    minOrder: "$150",
    usage: "220/300",
    expiryDate: "Jul 31, 2025",
    status: "Active",
  },
  {
    id: "cp-5",
    code: "NEWUSER15",
    type: "Percentage",
    discount: "15%",
    minOrder: "$100",
    usage: "67/500",
    expiryDate: "Aug 15, 2025",
    status: "Active",
  },
  {
    id: "cp-6",
    code: "FREESHIP",
    type: "Free Shipping",
    discount: "$15",
    minOrder: "—",
    usage: "102/250",
    expiryDate: "Jun 30, 2025",
    status: "Active",
  },
  {
    id: "cp-7",
    code: "HOLIDAY30",
    type: "Percentage",
    discount: "30%",
    minOrder: "$250",
    usage: "12/100",
    expiryDate: "Dec 31, 2025",
    status: "Inactive",
  },
];

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = React.useState<CouponItem[]>(DEFAULT_COUPONS);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [typeFilter, setTypeFilter] = React.useState("all");
  const [activeMenuId, setActiveMenuId] = React.useState<string | null>(null);
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [createModalOpen, setCreateModalOpen] = React.useState(false);

  // Form Fields
  const [newCode, setNewCode] = React.useState("");
  const [newType, setNewType] = React.useState<"Percentage" | "Fixed Amount" | "Free Shipping">("Percentage");
  const [newDiscount, setNewDiscount] = React.useState("20");
  const [newMinOrder, setNewMinOrder] = React.useState("100");
  const [newMaxUsage, setNewMaxUsage] = React.useState("500");
  const [newExpiry, setNewExpiry] = React.useState("Jul 31, 2025");

  // Filter
  const filtered = React.useMemo(() => {
    return coupons.filter((item) => {
      if (statusFilter !== "all" && item.status.toLowerCase() !== statusFilter.toLowerCase()) return false;
      if (typeFilter !== "all") {
        if (typeFilter === "percentage" && item.type !== "Percentage") return false;
        if (typeFilter === "fixed" && item.type !== "Fixed Amount") return false;
        if (typeFilter === "shipping" && item.type !== "Free Shipping") return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesCode = item.code.toLowerCase().includes(q);
        const matchesType = item.type.toLowerCase().includes(q);
        if (!matchesCode && !matchesType) return false;
      }
      return true;
    });
  }, [coupons, statusFilter, typeFilter, searchQuery]);

  function handleCreateCoupon(e: React.FormEvent) {
    e.preventDefault();
    if (!newCode.trim()) {
      toast.error("Please provide a promo code.");
      return;
    }
    const cleanCode = newCode.trim().toUpperCase();
    if (coupons.some((c) => c.code === cleanCode)) {
      toast.error("A coupon with this code already exists.");
      return;
    }
    const created: CouponItem = {
      id: `cp-${Date.now()}`,
      code: cleanCode,
      type: newType,
      discount: newType === "Percentage" ? `${newDiscount}%` : `$${newDiscount}`,
      minOrder: newMinOrder ? `$${newMinOrder}` : "—",
      usage: `0/${newMaxUsage || "200"}`,
      expiryDate: newExpiry,
      status: "Active",
    };
    setCoupons([created, ...coupons]);
    setCreateModalOpen(false);
    setNewCode("");
    toast.success(`Coupon ${created.code} successfully created!`);
  }

  function handleToggleStatus(couponId: string) {
    setCoupons((prev) =>
      prev.map((c) =>
        c.id === couponId
          ? { ...c, status: c.status === "Active" ? ("Inactive" as const) : ("Active" as const) }
          : c
      )
    );
    setActiveMenuId(null);
    toast.success("Coupon status toggled");
  }

  function handleDeleteCoupon(couponId: string) {
    setCoupons((prev) => prev.filter((c) => c.id !== couponId));
    setActiveMenuId(null);
    toast.success("Coupon deleted");
  }

  function handleCopyCode(code: string) {
    navigator.clipboard?.writeText(code);
    toast.success(`Copied "${code}" to clipboard!`);
    setActiveMenuId(null);
  }

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* ─────────────────────────────────────────────────────────────
          1. HEADER (Exact match to Reference Screenshot)
      ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Coupons &amp; Promo Codes
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Create and manage discounts, redemption limits, and expiration rules.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setCreateModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold text-xs shadow-lg shadow-[#F97316]/20 transition-all w-fit cursor-pointer active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Create Coupon</span>
        </button>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. METRIC KPI CARDS (4 Columns matching Reference)
      ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Coupons */}
        <div className="rounded-2xl border border-white/10 bg-[#0B1322] p-4 sm:p-5 flex flex-col justify-between">
          <div className="text-xs font-medium text-slate-400">Total Coupons</div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              24
            </span>
          </div>
          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <span>Lifetime promo campaigns</span>
          </div>
        </div>

        {/* Active */}
        <div className="rounded-2xl border border-white/10 bg-[#0B1322] p-4 sm:p-5 flex flex-col justify-between">
          <div className="text-xs font-medium text-slate-400">Active</div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              18
            </span>
          </div>
          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Eligible for checkout</span>
          </div>
        </div>

        {/* Used */}
        <div className="rounded-2xl border border-white/10 bg-[#0B1322] p-4 sm:p-5 flex flex-col justify-between">
          <div className="text-xs font-medium text-slate-400">Used</div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              642
            </span>
          </div>
          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-sky-400 font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Total redemptions</span>
          </div>
        </div>

        {/* Expired */}
        <div className="rounded-2xl border border-white/10 bg-[#0B1322] p-4 sm:p-5 flex flex-col justify-between">
          <div className="text-xs font-medium text-slate-400">Expired</div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              6
            </span>
          </div>
          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-rose-400 font-medium">
            <Clock className="w-3.5 h-3.5" />
            <span>Passed validity window</span>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. FILTER BAR (Search, Status, Type, Filter)
      ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search coupons or code..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#0B1322] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#F97316] transition-all"
          />
        </div>

        {/* Dropdowns & Filter */}
        <div className="flex items-center gap-3">
          {/* Status Dropdown */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none px-3.5 py-2 pr-8 rounded-xl bg-[#0B1322] border border-white/10 text-xs text-slate-300 focus:outline-none focus:border-[#F97316] transition-all cursor-pointer"
            >
              <option value="all">Status: All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Type Dropdown */}
          <div className="relative">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="appearance-none px-3.5 py-2 pr-8 rounded-xl bg-[#0B1322] border border-white/10 text-xs text-slate-300 focus:outline-none focus:border-[#F97316] transition-all cursor-pointer"
            >
              <option value="all">Type: All Types</option>
              <option value="percentage">Percentage</option>
              <option value="fixed">Fixed Amount</option>
              <option value="shipping">Free Shipping</option>
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
          4. COUPONS TABLE (Exact match to Reference Screenshot)
      ───────────────────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-white/10 bg-[#0B1322] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 bg-[#0F172A]/70 text-slate-400 font-semibold tracking-wider">
                <th className="py-3 px-4">Code</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Discount</th>
                <th className="py-3 px-4">Min. Order</th>
                <th className="py-3 px-4">Usage</th>
                <th className="py-3 px-4">Expiry Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500">
                    No promo codes match the current filter.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-white/[0.02] transition-colors group"
                  >
                    {/* Code */}
                    <td className="py-3.5 px-4 font-mono font-bold text-white tracking-wide">
                      {item.code}
                    </td>

                    {/* Type */}
                    <td className="py-3.5 px-4 text-slate-300">
                      {item.type}
                    </td>

                    {/* Discount */}
                    <td className="py-3.5 px-4 font-semibold text-white">
                      {item.discount}
                    </td>

                    {/* Min. Order */}
                    <td className="py-3.5 px-4 text-slate-300">
                      {item.minOrder}
                    </td>

                    {/* Usage */}
                    <td className="py-3.5 px-4 font-mono text-slate-400">
                      {item.usage}
                    </td>

                    {/* Expiry Date */}
                    <td className="py-3.5 px-4 text-slate-300 whitespace-nowrap">
                      {item.expiryDate}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      {item.status === "Active" ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/30">
                          Inactive
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
                            <button
                              type="button"
                              onClick={() => handleCopyCode(item.code)}
                              className="flex items-center gap-2 w-full px-3 py-2 text-xs text-slate-300 hover:bg-white/10 hover:text-white text-left"
                            >
                              <Copy className="w-3.5 h-3.5 text-slate-400" />
                              <span>Copy Code</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleToggleStatus(item.id)}
                              className="flex items-center gap-2 w-full px-3 py-2 text-xs text-slate-300 hover:bg-white/10 hover:text-white text-left"
                            >
                              <Clock className="w-3.5 h-3.5 text-slate-400" />
                              <span>{item.status === "Active" ? "Deactivate" : "Activate"}</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteCoupon(item.id)}
                              className="flex items-center gap-2 w-full px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 text-left"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete</span>
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
            Showing 1 to {filtered.length} of 24 coupons
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

              {[2, 3, 4].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setPage(num)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg border border-transparent text-slate-400 hover:text-white hover:bg-white/5"
                >
                  {num}
                </button>
              ))}

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
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          6. CREATE COUPON MODAL
      ───────────────────────────────────────────────────────────── */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#0B1322] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Tag className="w-4 h-4 text-[#F97316]" />
                Create Promotional Offer
              </h3>
              <button
                type="button"
                onClick={() => setCreateModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Coupon Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. FLASH25"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 rounded-xl bg-[#0F172A] border border-white/10 text-white placeholder-slate-500 font-mono font-bold focus:outline-none focus:border-[#F97316]"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Discount Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0F172A] border border-white/10 text-white focus:outline-none focus:border-[#F97316]"
                  >
                    <option value="Percentage">Percentage (%)</option>
                    <option value="Fixed Amount">Fixed Amount ($)</option>
                    <option value="Free Shipping">Free Diagnostic / Shipping</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Discount Value</label>
                  <input
                    type="number"
                    required
                    placeholder="20"
                    value={newDiscount}
                    onChange={(e) => setNewDiscount(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0F172A] border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-[#F97316]"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Minimum Order ($)</label>
                  <input
                    type="number"
                    placeholder="100"
                    value={newMinOrder}
                    onChange={(e) => setNewMinOrder(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0F172A] border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-[#F97316]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Max Redemptions</label>
                  <input
                    type="number"
                    placeholder="500"
                    value={newMaxUsage}
                    onChange={(e) => setNewMaxUsage(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0F172A] border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-[#F97316]"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Expiration Date</label>
                  <input
                    type="text"
                    value={newExpiry}
                    onChange={(e) => setNewExpiry(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0F172A] border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-[#F97316]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-white/10 text-slate-300 hover:text-white hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white font-bold"
                >
                  Save Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
