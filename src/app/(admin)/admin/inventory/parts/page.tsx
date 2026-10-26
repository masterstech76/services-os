"use client";

import * as React from "react";
import Link from "next/link";
import {
  Package,
  Plus,
  Search,
  Filter,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Edit2,
  Trash2,
  Layers,
  CheckCircle2,
  AlertTriangle,
  X,
  Eye,
  Wrench,
  Zap,
  Droplets,
  Cog,
} from "lucide-react";
import { toast } from "sonner";
import { formatMoney } from "@/components/shared/Money";

export interface PartRecord {
  id: string;
  name: string;
  sku: string;
  category: "HVAC" | "Mechanical" | "Electrical" | "Plumbing";
  priceCents: number;
  stock: number;
  status: "In Stock" | "Low Stock" | "Out of Stock";
}

const DEFAULT_PARTS: PartRecord[] = [
  {
    id: "p-1",
    name: "AC Filter",
    sku: "ACF-001",
    category: "HVAC",
    priceCents: 1250,
    stock: 3,
    status: "Low Stock",
  },
  {
    id: "p-2",
    name: "Refrigerant R134a",
    sku: "REF-134a",
    category: "HVAC",
    priceCents: 4500,
    stock: 2,
    status: "Low Stock",
  },
  {
    id: "p-3",
    name: "Compressor",
    sku: "CMP-001",
    category: "HVAC",
    priceCents: 32000,
    stock: 12,
    status: "In Stock",
  },
  {
    id: "p-4",
    name: "Belt Drive",
    sku: "BD-012",
    category: "Mechanical",
    priceCents: 2800,
    stock: 0,
    status: "Out of Stock",
  },
  {
    id: "p-5",
    name: "Spark Plug",
    sku: "SPK-004",
    category: "Electrical",
    priceCents: 850,
    stock: 4,
    status: "Low Stock",
  },
  {
    id: "p-6",
    name: "Circuit Breaker",
    sku: "CB-015",
    category: "Electrical",
    priceCents: 3400,
    stock: 20,
    status: "In Stock",
  },
  {
    id: "p-7",
    name: "Thermostat",
    sku: "TH-007",
    category: "HVAC",
    priceCents: 6500,
    stock: 15,
    status: "In Stock",
  },
  {
    id: "p-8",
    name: "Water Pump",
    sku: "WP-022",
    category: "Plumbing",
    priceCents: 11000,
    stock: 6,
    status: "Low Stock",
  },
  {
    id: "p-9",
    name: "Seal Kit",
    sku: "SK-031",
    category: "Mechanical",
    priceCents: 4200,
    stock: 18,
    status: "In Stock",
  },
  {
    id: "p-10",
    name: "Control Board",
    sku: "CB-044",
    category: "Electrical",
    priceCents: 18000,
    stock: 5,
    status: "Low Stock",
  },
];

export default function AdminPartsCataloguePage() {
  const [parts, setParts] = React.useState<PartRecord[]>(DEFAULT_PARTS);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [categoryFilter, setCategoryFilter] = React.useState("all");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [activeMenuId, setActiveMenuId] = React.useState<string | null>(null);
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [addModalOpen, setAddModalOpen] = React.useState(false);

  // New Part State
  const [newName, setNewName] = React.useState("");
  const [newSku, setNewSku] = React.useState("");
  const [newCategory, setNewCategory] = React.useState<"HVAC" | "Mechanical" | "Electrical" | "Plumbing">("HVAC");
  const [newPrice, setNewPrice] = React.useState("");
  const [newStock, setNewStock] = React.useState("10");

  const filtered = React.useMemo(() => {
    return parts.filter((item) => {
      if (categoryFilter !== "all" && item.category !== categoryFilter) return false;
      if (statusFilter !== "all" && item.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesSku = item.sku.toLowerCase().includes(q);
        const matchesCat = item.category.toLowerCase().includes(q);
        if (!matchesName && !matchesSku && !matchesCat) return false;
      }
      return true;
    });
  }, [parts, categoryFilter, statusFilter, searchQuery]);

  function handleCreatePart(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim() || !newSku.trim() || !newPrice) {
      toast.error("Please fill in all required fields.");
      return;
    }
    const cleanSku = newSku.trim().toUpperCase();
    const stockNum = parseInt(newStock) || 0;
    const created: PartRecord = {
      id: `p-${Date.now()}`,
      name: newName.trim(),
      sku: cleanSku,
      category: newCategory,
      priceCents: Math.round(parseFloat(newPrice) * 100),
      stock: stockNum,
      status: stockNum === 0 ? "Out of Stock" : stockNum < 5 ? "Low Stock" : "In Stock",
    };
    setParts([created, ...parts]);
    setAddModalOpen(false);
    setNewName("");
    setNewSku("");
    setNewPrice("");
    toast.success(`Part ${created.name} (${created.sku}) added successfully!`);
  }

  function handleDeletePart(partId: string) {
    setParts((prev) => prev.filter((p) => p.id !== partId));
    setActiveMenuId(null);
    toast.success("Part removed from catalogue");
  }

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* ─────────────────────────────────────────────────────────────
          1. HEADER (Exact match to Reference Screenshot)
      ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Parts Catalogue
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage parts, SKUs, prices, quantities, and restocking.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold text-xs shadow-lg shadow-[#F97316]/20 transition-all w-fit cursor-pointer active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Part</span>
        </button>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. FILTER BAR (Search, Category, Status, Filter)
      ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search parts, SKU, or category..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#0B1322] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#F97316] transition-all"
          />
        </div>

        {/* Dropdowns & Filter */}
        <div className="flex items-center gap-3">
          {/* Category Dropdown */}
          <div className="relative">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="appearance-none px-3.5 py-2 pr-8 rounded-xl bg-[#0B1322] border border-white/10 text-xs text-slate-300 focus:outline-none focus:border-[#F97316] transition-all cursor-pointer"
            >
              <option value="all">All Categories</option>
              <option value="HVAC">HVAC</option>
              <option value="Mechanical">Mechanical</option>
              <option value="Electrical">Electrical</option>
              <option value="Plumbing">Plumbing</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Status Dropdown */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none px-3.5 py-2 pr-8 rounded-xl bg-[#0B1322] border border-white/10 text-xs text-slate-300 focus:outline-none focus:border-[#F97316] transition-all cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="In Stock">In Stock</option>
              <option value="Low Stock">Low Stock</option>
              <option value="Out of Stock">Out of Stock</option>
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
          3. METRIC KPI CARDS (4 Columns matching Reference)
      ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Parts */}
        <div className="rounded-2xl border border-white/10 bg-[#0B1322] p-4 sm:p-5 flex flex-col justify-between">
          <div className="text-xs font-medium text-slate-400">Total Parts</div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              245
            </span>
          </div>
          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>8%</span>
          </div>
        </div>

        {/* Total Value */}
        <div className="rounded-2xl border border-white/10 bg-[#0B1322] p-4 sm:p-5 flex flex-col justify-between">
          <div className="text-xs font-medium text-slate-400">Total Value</div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              $48,320
            </span>
          </div>
          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>12%</span>
          </div>
        </div>

        {/* Low Stock */}
        <div className="rounded-2xl border border-white/10 bg-[#0B1322] p-4 sm:p-5 flex flex-col justify-between">
          <div className="text-xs font-medium text-slate-400">Low Stock</div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              18
            </span>
          </div>
          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-rose-400 font-medium">
            <TrendingDown className="w-3.5 h-3.5" />
            <span>5%</span>
          </div>
        </div>

        {/* Out of Stock */}
        <div className="rounded-2xl border border-white/10 bg-[#0B1322] p-4 sm:p-5 flex flex-col justify-between">
          <div className="text-xs font-medium text-slate-400">Out of Stock</div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              6
            </span>
          </div>
          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-rose-400 font-medium">
            <TrendingDown className="w-3.5 h-3.5" />
            <span>2%</span>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          4. PARTS TABLE (Exact match to Reference Screenshot)
      ───────────────────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-white/10 bg-[#0B1322] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 bg-[#0F172A]/70 text-slate-400 font-semibold tracking-wider">
                <th className="py-3 px-4">Part Name</th>
                <th className="py-3 px-4">SKU</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Stock</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {filtered.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-white/[0.02] transition-colors group"
                >
                  {/* Part Name with Thumbnail */}
                  <td className="py-3.5 px-4 font-medium text-white">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-slate-800 border border-white/10 flex items-center justify-center text-slate-400 flex-shrink-0">
                        {item.category === "HVAC" && <Wrench className="w-3.5 h-3.5 text-sky-400" />}
                        {item.category === "Electrical" && <Zap className="w-3.5 h-3.5 text-amber-400" />}
                        {item.category === "Plumbing" && <Droplets className="w-3.5 h-3.5 text-blue-400" />}
                        {item.category === "Mechanical" && <Cog className="w-3.5 h-3.5 text-emerald-400" />}
                      </div>
                      <span className="font-semibold text-white">{item.name}</span>
                    </div>
                  </td>

                  {/* SKU */}
                  <td className="py-3.5 px-4 font-mono text-slate-400">
                    {item.sku}
                  </td>

                  {/* Category */}
                  <td className="py-3.5 px-4 text-slate-300">
                    {item.category}
                  </td>

                  {/* Price */}
                  <td className="py-3.5 px-4 font-semibold text-white">
                    {formatMoney(item.priceCents)}
                  </td>

                  {/* Stock */}
                  <td className="py-3.5 px-4 font-mono font-bold">
                    <span
                      className={
                        item.stock === 0
                          ? "text-rose-400"
                          : item.stock < 5
                          ? "text-amber-400"
                          : "text-white"
                      }
                    >
                      {item.stock}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4">
                    {item.status === "In Stock" ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        In Stock
                      </span>
                    ) : item.status === "Low Stock" ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                        Low Stock
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/30">
                        Out of Stock
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
                            href="/admin/inventory/transactions"
                            className="flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:bg-white/10 hover:text-white"
                            onClick={() => setActiveMenuId(null)}
                          >
                            <Layers className="w-3.5 h-3.5 text-slate-400" />
                            <span>Stock History</span>
                          </Link>
                          <button
                            type="button"
                            onClick={() => {
                              toast.success(`Purchase order initiated for ${item.name}`);
                              setActiveMenuId(null);
                            }}
                            className="flex items-center gap-2 w-full px-3 py-2 text-xs text-sky-400 hover:bg-sky-500/10 text-left"
                          >
                            <Package className="w-3.5 h-3.5" />
                            <span>Reorder Stock</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeletePart(item.id)}
                            className="flex items-center gap-2 w-full px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 text-left"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete Part</span>
                          </button>
                        </div>
                      )}
                    </div>
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
            Showing 1 to {filtered.length} of 245 parts
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
                onClick={() => setPage(25)}
                className="w-7 h-7 flex items-center justify-center rounded-lg border border-transparent text-slate-400 hover:text-white hover:bg-white/5"
              >
                25
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
                <option value={50} className="bg-[#0F172A] text-white">50 / page</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          6. ADD PART MODAL
      ───────────────────────────────────────────────────────────── */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#0B1322] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Package className="w-4 h-4 text-[#F97316]" />
                Add New Inventory Item
              </h3>
              <button
                type="button"
                onClick={() => setAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreatePart} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Part Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Copper Pipe 3/4"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0F172A] border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-[#F97316]"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1">SKU</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. PLM-008"
                    value={newSku}
                    onChange={(e) => setNewSku(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 rounded-xl bg-[#0F172A] border border-white/10 text-white placeholder-slate-500 font-mono focus:outline-none focus:border-[#F97316]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0F172A] border border-white/10 text-white focus:outline-none focus:border-[#F97316]"
                  >
                    <option value="HVAC">HVAC</option>
                    <option value="Mechanical">Mechanical</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Plumbing">Plumbing</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Unit Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="45.00"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0F172A] border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-[#F97316]"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Initial Stock</label>
                  <input
                    type="number"
                    required
                    placeholder="10"
                    value={newStock}
                    onChange={(e) => setNewStock(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0F172A] border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-[#F97316]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-white/10 text-slate-300 hover:text-white hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white font-bold"
                >
                  Save to Catalogue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
