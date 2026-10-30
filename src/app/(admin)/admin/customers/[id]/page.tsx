"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Users,
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  FileText,
  CreditCard,
  CheckCircle2,
  Clock,
  Edit2,
  MoreVertical,
  Plus,
  Send,
  MessageSquare,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  Star,
  DollarSign,
  Wrench,
} from "lucide-react";
import { toast } from "sonner";
import { formatMoney } from "@/components/shared/Money";

interface CustomerDossier {
  id: string;
  name: string;
  avatarInitials: string;
  status: "Active" | "Inactive";
  customerIdTag: string;
  phone: string;
  email: string;
  primaryAddress: string;
  totalJobs: number;
  totalSpentCents: number;
  lastServiceDate: string;
  customerType: string;
  secondaryAddress: string;
  serviceHistory: Array<{
    id: string;
    service: string;
    date: string;
    status: string;
  }>;
  recentInvoices: Array<{
    id: string;
    invoiceNumber: string;
    amountCents: number;
    status: string;
  }>;
}

const DEFAULT_DOSSIER: CustomerDossier = {
  id: "C10047",
  name: "Service Client A",
  avatarInitials: "RC",
  status: "Active",
  customerIdTag: "#C10047",
  phone: "(XXX) XXX-XXXX",
  email: "user@domain.com",
  primaryAddress: "1234 Ocean Dr, Miami, FL 33145",
  totalJobs: 12,
  totalSpentCents: 432000,
  lastServiceDate: "May 14, 2025",
  customerType: "Residential",
  secondaryAddress: "456 Palm St, Miami, FL 33137",
  serviceHistory: [
    { id: "s-1", service: "AC Repair", date: "May 14, 2025", status: "Completed" },
    { id: "s-2", service: "Water Heater Repair", date: "Mar 8, 2025", status: "Completed" },
    { id: "s-3", service: "Duct Cleaning", date: "Jan 22, 2025", status: "Completed" },
    { id: "s-4", service: "Electrical Panel Upgrade", date: "Nov 10, 2024", status: "Completed" },
  ],
  recentInvoices: [
    { id: "inv-1", invoiceNumber: "#INV-1047", amountCents: 32000, status: "Paid" },
    { id: "inv-2", invoiceNumber: "#INV-0981", amountCents: 18500, status: "Paid" },
    { id: "inv-3", invoiceNumber: "#INV-0765", amountCents: 45000, status: "Paid" },
    { id: "inv-4", invoiceNumber: "#INV-0621", amountCents: 27500, status: "Paid" },
    { id: "inv-5", invoiceNumber: "#INV-0489", amountCents: 18000, status: "Paid" },
  ],
};

export default function AdminCustomer360Page() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const rawId = params?.id ? decodeURIComponent(params.id) : "C10047";
  const formattedTag = rawId.includes("sofia")
    ? "#C-1048"
    : rawId.startsWith("customer-")
    ? `#C-${rawId.replace("customer-", "").toUpperCase().slice(0, 5)}`
    : rawId.startsWith("#")
    ? rawId
    : `#${rawId}`;

  const [activeTab, setActiveTab] = React.useState<"overview" | "jobs" | "invoices" | "payments" | "addresses" | "notes">("overview");
  const [dossier, setDossier] = React.useState<CustomerDossier>({
    ...DEFAULT_DOSSIER,
    id: rawId,
    customerIdTag: formattedTag,
  });

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* ─────────────────────────────────────────────────────────────
          1. HEADER WITH BACK LINK (Exact match to Reference)
      ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Customer 360° View
          </h1>
          <div className="mt-2">
            <Link
              href="/admin/customers"
              className="inline-flex items-center gap-1.5 text-xs text-sky-400 hover:text-sky-300 transition-colors font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Customers</span>
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => toast.info("Opening customer edit form...")}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0B1322] border border-white/10 hover:border-white/20 text-xs font-semibold text-slate-300 hover:text-white transition-all cursor-pointer"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Edit</span>
          </button>
          <button
            type="button"
            onClick={() => toast.info("More customer actions")}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0B1322] border border-white/10 hover:border-white/20 text-xs font-semibold text-slate-300 hover:text-white transition-all cursor-pointer"
          >
            <span>More</span>
            <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. CUSTOMER HERO PROFILE CARD (Exact match to Reference)
      ───────────────────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-white/10 bg-[#0B1322] p-6 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Left: Avatar & Contact Data */}
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-slate-800 border-2 border-white/15 overflow-hidden flex-shrink-0 flex items-center justify-center text-lg font-bold text-white shadow-xl">
              RC
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5">
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {dossier.name}
                </h2>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  {dossier.status}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
                <span className="font-mono text-slate-300 font-semibold">{dossier.customerIdTag}</span>
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3 h-3 text-slate-500" />
                  <a href={`tel:${dossier.phone}`} className="hover:text-white transition-colors">{dossier.phone}</a>
                </span>
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3 h-3 text-slate-500" />
                  <a href={`mailto:${dossier.email}`} className="hover:text-white transition-colors">{dossier.email}</a>
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                <span>{dossier.primaryAddress}</span>
              </div>
            </div>
          </div>

          {/* Right: Key Figures */}
          <div className="flex items-center gap-8 border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-8 text-left">
            <div>
              <div className="text-xs text-slate-400 font-medium">Total Jobs</div>
              <div className="text-xl sm:text-2xl font-extrabold text-white mt-0.5">
                {dossier.totalJobs}
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-400 font-medium">Total Spent</div>
              <div className="text-xl sm:text-2xl font-extrabold text-white mt-0.5">
                {formatMoney(dossier.totalSpentCents)}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">Last Service: {dossier.lastServiceDate}</div>
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. TABS BAR: Overview, Jobs, Invoices, Payments, Addresses, Notes
      ───────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab("overview")}
          className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === "overview"
              ? "bg-[#F97316]/15 text-[#F97316] border border-[#F97316]/40"
              : "text-slate-400 hover:text-white hover:bg-white/5"
          }`}
        >
          Overview
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("jobs")}
          className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === "jobs"
              ? "bg-[#F97316]/15 text-[#F97316] border border-[#F97316]/40"
              : "text-slate-400 hover:text-white hover:bg-white/5"
          }`}
        >
          Jobs
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("invoices")}
          className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === "invoices"
              ? "bg-[#F97316]/15 text-[#F97316] border border-[#F97316]/40"
              : "text-slate-400 hover:text-white hover:bg-white/5"
          }`}
        >
          Invoices
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
          onClick={() => setActiveTab("addresses")}
          className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === "addresses"
              ? "bg-[#F97316]/15 text-[#F97316] border border-[#F97316]/40"
              : "text-slate-400 hover:text-white hover:bg-white/5"
          }`}
        >
          Addresses
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
      </div>

      {/* ─────────────────────────────────────────────────────────────
          4. OVERVIEW TAB: 3 COLUMNS (Contact, Service History, Invoices)
      ───────────────────────────────────────────────────────────── */}
      {activeTab === "overview" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Contact Information */}
            <div className="rounded-2xl border border-white/10 bg-[#0B1322] p-5 shadow-2xl space-y-3">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Contact Information
              </h2>
              <div className="space-y-3 pt-1 text-xs">
                <div>
                  <div className="text-slate-500 font-medium">Phone</div>
                  <div className="text-white font-mono font-semibold mt-0.5">{dossier.phone}</div>
                </div>
                <div>
                  <div className="text-slate-500 font-medium">Email</div>
                  <div className="text-white font-medium mt-0.5">{dossier.email}</div>
                </div>
                <div>
                  <div className="text-slate-500 font-medium">Billing Address</div>
                  <div className="text-slate-300 mt-0.5">{dossier.primaryAddress}</div>
                </div>
                <div>
                  <div className="text-slate-500 font-medium">Customer Type</div>
                  <div className="text-white font-semibold flex items-center gap-1 mt-0.5">
                    <span>{dossier.customerType}</span>
                    <span className="text-[#F97316]">→</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Service History */}
            <div className="rounded-2xl border border-white/10 bg-[#0B1322] p-5 shadow-2xl space-y-3">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Service History
              </h2>
              <div className="space-y-2.5 pt-1">
                {dossier.serviceHistory.map((item) => (
                  <div
                    key={item.id}
                    className="p-2.5 rounded-xl border border-white/5 bg-[#0F172A] flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
                        <Wrench className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="font-semibold text-white">{item.service}</div>
                        <div className="text-[10px] text-slate-500">{item.date}</div>
                      </div>
                    </div>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Invoices */}
            <div className="rounded-2xl border border-white/10 bg-[#0B1322] p-5 shadow-2xl flex flex-col justify-between space-y-3">
              <div>
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Recent Invoices
                </h2>
                <div className="space-y-2 pt-2">
                  {dossier.recentInvoices.map((inv) => (
                    <div
                      key={inv.id}
                      className="flex items-center justify-between py-1.5 border-b border-white/5 text-xs"
                    >
                      <Link
                        href={`/admin/invoices/${encodeURIComponent(inv.invoiceNumber)}`}
                        className="font-mono text-white hover:text-[#F97316] transition-colors"
                      >
                        {inv.invoiceNumber}
                      </Link>
                      <span className="font-semibold text-white">
                        {formatMoney(inv.amountCents)}
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        {inv.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 text-right">
                <Link
                  href="/admin/invoices"
                  className="text-xs font-medium text-sky-400 hover:text-sky-300 transition-colors"
                >
                  View All
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom 2 Cards: Saved Addresses & Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Saved Addresses */}
            <div className="rounded-2xl border border-white/10 bg-[#0B1322] p-5 shadow-2xl space-y-3">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Saved Addresses
              </h2>
              <div className="space-y-2.5 pt-1 text-xs">
                <div className="p-3 rounded-xl border border-white/10 bg-[#0F172A] flex items-center justify-between">
                  <div className="flex items-center gap-2 text-white">
                    <MapPin className="w-4 h-4 text-[#F97316]" />
                    <span>{dossier.primaryAddress}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/15 text-sky-400 border border-sky-500/30">
                    Primary
                  </span>
                </div>

                <div className="p-3 rounded-xl border border-white/5 bg-[#0F172A] flex items-center justify-between text-slate-300">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-500" />
                    <span>{dossier.secondaryAddress}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="rounded-2xl border border-white/10 bg-[#0B1322] p-5 shadow-2xl space-y-3">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <Link
                  href={`/admin/jobs/create?customer=${encodeURIComponent(dossier.name)}`}
                  className="p-3 rounded-xl border border-white/10 bg-[#0F172A] hover:bg-white/[0.04] transition-all flex flex-col items-center justify-center text-center gap-2 cursor-pointer"
                >
                  <Briefcase className="w-4 h-4 text-[#F97316]" />
                  <span className="text-xs font-bold text-white">Create Job</span>
                </Link>

                <button
                  type="button"
                  onClick={() => toast.info(`SMS message modal opened for ${dossier.phone}`)}
                  className="p-3 rounded-xl border border-white/10 bg-[#0F172A] hover:bg-white/[0.04] transition-all flex flex-col items-center justify-center text-center gap-2 cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 text-sky-400" />
                  <span className="text-xs font-bold text-white">Send Message</span>
                </button>

                <a
                  href={`tel:${dossier.phone}`}
                  className="p-3 rounded-xl border border-white/10 bg-[#0F172A] hover:bg-white/[0.04] transition-all flex flex-col items-center justify-center text-center gap-2 cursor-pointer"
                >
                  <Phone className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold text-white">Call Customer</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* JOBS TAB */}
      {activeTab === "jobs" && (
        <div className="rounded-2xl border border-white/10 bg-[#0B1322] p-5 shadow-2xl space-y-3 text-xs">
          <h3 className="font-bold text-white uppercase tracking-wider">All Associated Work Orders</h3>
          <div className="space-y-2 text-slate-300">
            {dossier.serviceHistory.map((j) => (
              <div key={j.id} className="p-3 rounded-xl bg-[#0F172A] border border-white/5 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white">{j.service}</div>
                  <div className="text-slate-400 text-[11px]">{j.date} · Serviced by Lead Field Technician</div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  {j.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* INVOICES TAB */}
      {activeTab === "invoices" && (
        <div className="rounded-2xl border border-white/10 bg-[#0B1322] p-5 shadow-2xl space-y-3 text-xs">
          <h3 className="font-bold text-white uppercase tracking-wider">Customer Invoices &amp; Balances</h3>
          <div className="space-y-2 text-slate-300">
            {dossier.recentInvoices.map((inv) => (
              <div key={inv.id} className="p-3 rounded-xl bg-[#0F172A] border border-white/5 flex items-center justify-between">
                <Link href={`/admin/invoices/${encodeURIComponent(inv.invoiceNumber)}`} className="font-mono font-bold text-white hover:text-[#F97316]">
                  {inv.invoiceNumber}
                </Link>
                <span className="font-bold text-white">{formatMoney(inv.amountCents)}</span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  {inv.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PAYMENTS TAB */}
      {activeTab === "payments" && (
        <div className="rounded-2xl border border-white/10 bg-[#0B1322] p-5 shadow-2xl space-y-3 text-xs">
          <h3 className="font-bold text-white uppercase tracking-wider">Customer Payment History</h3>
          <div className="p-3 rounded-xl bg-[#0F172A] border border-white/5 flex items-center justify-between">
            <div>
              <div className="font-bold text-white">TXN-9823647</div>
              <div className="text-slate-400 text-[11px]">Card (****4242) · May 14, 2025</div>
            </div>
            <div className="font-bold text-emerald-400">$320.00 Settled</div>
          </div>
        </div>
      )}

      {/* NOTES TAB */}
      {activeTab === "notes" && (
        <div className="rounded-2xl border border-white/10 bg-[#0B1322] p-5 shadow-2xl space-y-3 text-xs">
          <h3 className="font-bold text-white uppercase tracking-wider">Internal Customer Preferences &amp; Access Notes</h3>
          <div className="p-4 rounded-xl bg-[#0F172A] border border-white/5 text-slate-300 space-y-2">
            <p><strong>Gate access code:</strong> #4921.</p>
            <p>Customer has two friendly Golden Retrievers in the backyard. Please ring front doorbell before servicing outdoor condenser units.</p>
          </div>
        </div>
      )}
    </div>
  );
}
