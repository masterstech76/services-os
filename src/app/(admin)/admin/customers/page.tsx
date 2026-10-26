"use client";

import * as React from "react";
import Link from "next/link";
import {
  Users,
  Search,
  Filter,
  Plus,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Mail,
  Phone,
  MapPin,
  Download,
  Upload,
  BarChart3,
  UserPlus,
  Eye,
  Calendar,
  X,
} from "lucide-react";
import { toast } from "sonner";

export interface CustomerDirectoryItem {
  id: string;
  name: string;
  avatarInitials: string;
  phone: string;
  email: string;
  location: string;
  status: "Active" | "Inactive";
  jobsCount: number;
}

const DEFAULT_CUSTOMERS: CustomerDirectoryItem[] = [
  {
    id: "C10047",
    name: "Robert Caldwell",
    avatarInitials: "RC",
    phone: "(555) 310-7842",
    email: "robert@servicepro.com",
    location: "Miami, FL",
    status: "Active",
    jobsCount: 12,
  },
  {
    id: "C10046",
    name: "Maria Alvarez",
    avatarInitials: "MA",
    phone: "(555) 310-6723",
    email: "maria@servicepro.com",
    location: "Miami, FL",
    status: "Active",
    jobsCount: 8,
  },
  {
    id: "C10045",
    name: "Danny Reyes",
    avatarInitials: "DR",
    phone: "(555) 310-3657",
    email: "danny@servicepro.com",
    location: "Orlando, FL",
    status: "Active",
    jobsCount: 15,
  },
  {
    id: "C10044",
    name: "Sarah Mitchell",
    avatarInitials: "SM",
    phone: "(555) 310-4433",
    email: "sarah@servicepro.com",
    location: "Tampa, FL",
    status: "Active",
    jobsCount: 7,
  },
  {
    id: "C10043",
    name: "Michael Johnson",
    avatarInitials: "MJ",
    phone: "(555) 310-2211",
    email: "michael@servicepro.com",
    location: "Jacksonville, FL",
    status: "Active",
    jobsCount: 10,
  },
  {
    id: "C10042",
    name: "Jessica Lee",
    avatarInitials: "JL",
    phone: "(555) 310-1168",
    email: "jessica@servicepro.com",
    location: "Tallahassee, FL",
    status: "Active",
    jobsCount: 6,
  },
  {
    id: "C10041",
    name: "David Kim",
    avatarInitials: "DK",
    phone: "(555) 310-6677",
    email: "david@servicepro.com",
    location: "Miami, FL",
    status: "Active",
    jobsCount: 14,
  },
];

export default function AdminCustomersDirectoryPage() {
  const [customers, setCustomers] = React.useState<CustomerDirectoryItem[]>(DEFAULT_CUSTOMERS);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [locationFilter, setLocationFilter] = React.useState("all");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [activeMenuId, setActiveMenuId] = React.useState<string | null>(null);
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [addModalOpen, setAddModalOpen] = React.useState(false);

  // Add customer fields
  const [name, setName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [location, setLocation] = React.useState("Miami, FL");

  const filtered = React.useMemo(() => {
    return customers.filter((item) => {
      if (locationFilter !== "all" && !item.location.toLowerCase().includes(locationFilter.toLowerCase())) return false;
      if (statusFilter !== "all" && item.status.toLowerCase() !== statusFilter.toLowerCase()) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesPhone = item.phone.toLowerCase().includes(q);
        const matchesEmail = item.email.toLowerCase().includes(q);
        const matchesLoc = item.location.toLowerCase().includes(q);
        if (!matchesName && !matchesPhone && !matchesEmail && !matchesLoc) return false;
      }
      return true;
    });
  }, [customers, locationFilter, statusFilter, searchQuery]);

  function handleCreateCustomer(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      toast.error("Please provide a name and phone number.");
      return;
    }
    const initials = name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

    const created: CustomerDirectoryItem = {
      id: `C${Math.floor(10050 + Math.random() * 50)}`,
      name: name.trim(),
      avatarInitials: initials || "CU",
      phone: phone.trim(),
      email: email.trim() || `${name.toLowerCase().replace(/\s+/g, ".")}@example.com`,
      location: location.trim(),
      status: "Active",
      jobsCount: 0,
    };
    setCustomers([created, ...customers]);
    setAddModalOpen(false);
    setName("");
    setPhone("");
    setEmail("");
    toast.success(`Customer ${created.name} registered successfully!`);
  }

  function handleExportCSV() {
    toast.success("Exporting complete customer records (1,248 entries)...");
  }

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* ─────────────────────────────────────────────────────────────
          1. HEADER (Exact match to Reference Screenshot)
      ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Customers Directory
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Search and manage customers, contact details, addresses, and service history.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold text-xs shadow-lg shadow-[#F97316]/20 transition-all w-fit cursor-pointer active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Customer</span>
        </button>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. FILTER BAR (Search, Location, Status, Filter)
      ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search customers by name, phone, email or address..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#0B1322] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#F97316] transition-all"
          />
        </div>

        {/* Dropdowns & Filter */}
        <div className="flex items-center gap-3">
          {/* Location Dropdown */}
          <div className="relative">
            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="appearance-none px-3.5 py-2 pr-8 rounded-xl bg-[#0B1322] border border-white/10 text-xs text-slate-300 focus:outline-none focus:border-[#F97316] transition-all cursor-pointer"
            >
              <option value="all">All Locations</option>
              <option value="Miami">Miami, FL</option>
              <option value="Orlando">Orlando, FL</option>
              <option value="Tampa">Tampa, FL</option>
              <option value="Jacksonville">Jacksonville, FL</option>
              <option value="Tallahassee">Tallahassee, FL</option>
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
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
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
        {/* Total Customers */}
        <div className="rounded-2xl border border-white/10 bg-[#0B1322] p-4 sm:p-5 flex flex-col justify-between">
          <div className="text-xs font-medium text-slate-400">Total Customers</div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              1,248
            </span>
          </div>
          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>12%</span>
          </div>
        </div>

        {/* Active Customers */}
        <div className="rounded-2xl border border-white/10 bg-[#0B1322] p-4 sm:p-5 flex flex-col justify-between">
          <div className="text-xs font-medium text-slate-400">Active Customers</div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              1,156
            </span>
          </div>
          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>10%</span>
          </div>
        </div>

        {/* New This Month */}
        <div className="rounded-2xl border border-white/10 bg-[#0B1322] p-4 sm:p-5 flex flex-col justify-between">
          <div className="text-xs font-medium text-slate-400">New This Month</div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              86
            </span>
          </div>
          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>18%</span>
          </div>
        </div>

        {/* Inactive */}
        <div className="rounded-2xl border border-white/10 bg-[#0B1322] p-4 sm:p-5 flex flex-col justify-between">
          <div className="text-xs font-medium text-slate-400">Inactive</div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              92
            </span>
          </div>
          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-rose-400 font-medium">
            <TrendingDown className="w-3.5 h-3.5" />
            <span>4%</span>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          4. CUSTOMERS TABLE (Exact match to Reference Screenshot)
      ───────────────────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-white/10 bg-[#0B1322] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 bg-[#0F172A]/70 text-slate-400 font-semibold tracking-wider">
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Service History</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {filtered.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-white/[0.02] transition-colors group"
                >
                  {/* Customer with Avatar */}
                  <td className="py-3.5 px-4 font-medium text-white">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-xs font-bold text-slate-300 flex-shrink-0">
                        {item.avatarInitials}
                      </div>
                      <Link
                        href={`/admin/customers/${encodeURIComponent(item.id)}`}
                        className="font-bold text-white hover:text-[#F97316] transition-colors"
                      >
                        {item.name}
                      </Link>
                    </div>
                  </td>

                  {/* Contact */}
                  <td className="py-3.5 px-4">
                    <div className="space-y-0.5 text-[11px]">
                      <div className="text-white font-mono">{item.phone}</div>
                      <div className="text-slate-400">{item.email}</div>
                    </div>
                  </td>

                  {/* Location */}
                  <td className="py-3.5 px-4 text-slate-300">
                    {item.location}
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      {item.status}
                    </span>
                  </td>

                  {/* Service History */}
                  <td className="py-3.5 px-4 font-mono font-medium text-slate-300">
                    <Link
                      href={`/admin/customers/${encodeURIComponent(item.id)}?tab=jobs`}
                      className="hover:text-white transition-colors"
                    >
                      {item.jobsCount} jobs
                    </Link>
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
                            href={`/admin/customers/${encodeURIComponent(item.id)}`}
                            className="flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:bg-white/10 hover:text-white"
                            onClick={() => setActiveMenuId(null)}
                          >
                            <Eye className="w-3.5 h-3.5 text-slate-400" />
                            <span>Customer 360°</span>
                          </Link>
                          <Link
                            href={`/admin/jobs/create?customer=${encodeURIComponent(item.name)}`}
                            className="flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:bg-white/10 hover:text-white"
                            onClick={() => setActiveMenuId(null)}
                          >
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            <span>Book New Job</span>
                          </Link>
                          <a
                            href={`tel:${item.phone}`}
                            className="flex items-center gap-2 px-3 py-2 text-xs text-sky-400 hover:bg-sky-500/10"
                            onClick={() => setActiveMenuId(null)}
                          >
                            <Phone className="w-3.5 h-3.5" />
                            <span>Call Customer</span>
                          </a>
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
            Showing 1 to {filtered.length} of 1,248 customers
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
                onClick={() => setPage(179)}
                className="w-7 h-7 flex items-center justify-center rounded-lg border border-transparent text-slate-400 hover:text-white hover:bg-white/5"
              >
                179
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
          6. QUICK ACTIONS TILES (Exact match to Reference)
      ───────────────────────────────────────────────────────────── */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#F97316]" />
          <h3 className="text-xs font-bold text-[#F97316] uppercase tracking-wider">
            Quick Actions
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {/* Add Customer */}
          <button
            type="button"
            onClick={() => setAddModalOpen(true)}
            className="p-4 rounded-2xl border border-white/10 bg-[#0B1322] hover:bg-white/[0.04] transition-all flex flex-col items-center justify-center text-center gap-2 group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 group-hover:scale-110 transition-transform">
              <UserPlus className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-white">Add Customer</span>
          </button>

          {/* Import */}
          <button
            type="button"
            onClick={() => toast.info("Opening CSV/vCard contact importer...")}
            className="p-4 rounded-2xl border border-white/10 bg-[#0B1322] hover:bg-white/[0.04] transition-all flex flex-col items-center justify-center text-center gap-2 group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
              <Upload className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-white">Import</span>
          </button>

          {/* Export */}
          <button
            type="button"
            onClick={handleExportCSV}
            className="p-4 rounded-2xl border border-white/10 bg-[#0B1322] hover:bg-white/[0.04] transition-all flex flex-col items-center justify-center text-center gap-2 group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
              <Download className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-white">Export</span>
          </button>

          {/* Customer Report */}
          <button
            type="button"
            onClick={() => toast.success("Generating customer acquisition & retention report...")}
            className="p-4 rounded-2xl border border-white/10 bg-[#0B1322] hover:bg-white/[0.04] transition-all flex flex-col items-center justify-center text-center gap-2 group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
              <BarChart3 className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-white">Customer Report</span>
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          7. ADD CUSTOMER MODAL
      ───────────────────────────────────────────────────────────── */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0B1322] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-[#F97316]" />
                Register New Customer
              </h3>
              <button
                type="button"
                onClick={() => setAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomer} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Eleanor Vance"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0F172A] border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-[#F97316]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="(555) 019-2831"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0F172A] border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-[#F97316]"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="e.vance@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0F172A] border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-[#F97316]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Location / Service City</label>
                <input
                  type="text"
                  placeholder="Miami, FL"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0F172A] border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-[#F97316]"
                />
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
                  Add Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
