"use client";

import * as React from "react";
import Link from "next/link";
import {
  FileText,
  Plus,
  Edit3,
  CheckCircle2,
  Clock,
  Sparkles,
  Layers,
  Globe,
  Tag,
  HelpCircle,
  X,
  Save,
  Trash2,
  ExternalLink,
  Search,
  Sliders,
  Check,
  ShieldCheck,
  Eye,
  Type,
  FileCode,
} from "lucide-react";
import { toast } from "sonner";
import { businessConfig } from "@config/business.config";

export interface ContentItem {
  id: string;
  title: string;
  category: "Pages" | "Services" | "Banners" | "FAQs";
  type: string;
  status: "Published" | "Draft" | "Scheduled";
  lastUpdated: string;
  path: string;
  headline?: string;
  subtitle?: string;
  seoTitle?: string;
  seoDescription?: string;
  bodyContent?: string;
}

const INITIAL_CONTENT_ITEMS: ContentItem[] = [
  {
    id: "cnt-1",
    title: "Home Page",
    category: "Pages",
    type: "Landing Page",
    status: "Published",
    lastUpdated: "Just now",
    path: "/",
    headline: "Fast, Reliable HVAC Diagnostics & 24/7 Rapid Emergency Dispatch",
    subtitle: "Trusted by over 4,800+ homes and businesses in South Florida. Licensed, insured, and background-checked technicians.",
    seoTitle: "ServicePro OS — Commercial & Residential HVAC Services",
    seoDescription: "Book certified master HVAC technicians with 60-minute emergency response and upfront pricing.",
    bodyContent: "Full-service heating, ventilation, and air conditioning solutions with transparent pricing and instant online dispatch.",
  },
  {
    id: "cnt-pay-1",
    title: "Customer Payment Portal",
    category: "Pages",
    type: "Billing Page",
    status: "Published",
    lastUpdated: "Just now",
    path: "/payment",
    headline: "Pay Your ServicePro Invoice Online",
    subtitle: "Fast, 256-bit SSL encrypted invoice settlement for HVAC diagnostics, repairs, and seasonal maintenance.",
    seoTitle: "Online Payment Portal — ServicePro OS",
    seoDescription: "Instant invoice lookup and secure online payment via Visa, MasterCard, Amex, Apple Pay, and Google Pay.",
    bodyContent: "Lookup and pay open work orders or invoices using invoice ID, token, or mobile phone.",
  },
  {
    id: "cnt-pay-2",
    title: "Payment Processing & Settlement",
    category: "Pages",
    type: "Transaction Flow",
    status: "Published",
    lastUpdated: "Just now",
    path: "/payment-processing",
    headline: "Processing Your Payment",
    subtitle: "Stripe 3D-Secure biometric fraud verification and automated warranty activation.",
    seoTitle: "Securing Payment — ServicePro OS",
    seoDescription: "Intermediate 3D-Secure bank authentication and transaction settlement.",
    bodyContent: "Communicating with card issuer, validating transaction tokens, and recording warranty certificates.",
  },
  {
    id: "cnt-2",
    title: "About Us",
    category: "Pages",
    type: "Company Page",
    status: "Published",
    lastUpdated: "Yesterday",
    path: "/about",
    headline: "Over 15 Years of Heating & Cooling Excellence in South Florida",
    subtitle: "Founded on integrity, precision engineering, and customer satisfaction.",
    seoTitle: "About ServicePro OS — Our Team & Certifications",
    seoDescription: "Meet our certified master technicians and explore our commitment to energy-efficient climate control.",
    bodyContent: "Our veteran team of technicians provides dependable climate solutions tailored for South Florida's coastal climate.",
  },
  {
    id: "cnt-3",
    title: "Services Catalog",
    category: "Pages",
    type: "Catalog Page",
    status: "Published",
    lastUpdated: "2 days ago",
    path: "/services",
    headline: "Complete HVAC Diagnostic, Repair & Installation Services",
    subtitle: "Explore our full suite of residential and commercial climate solutions with upfront pricing.",
    seoTitle: "HVAC Services & Pricing — ServicePro OS",
    seoDescription: "From emergency repairs to seasonal tune-ups and commercial ventilation, explore our certified services.",
    bodyContent: "Comprehensive diagnostic inspection, electrical checks, coil cleanings, and ductwork sanitation.",
  },
  {
    id: "cnt-4",
    title: "Contact Us",
    category: "Pages",
    type: "Support Page",
    status: "Published",
    lastUpdated: "3 days ago",
    path: "/contact",
    headline: "Get in Touch with Our 24/7 Operations Command Center",
    subtitle: "Call our emergency hotline or send a message for same-day service bookings.",
    seoTitle: "Contact ServicePro OS — 24/7 Hotline & Dispatch",
    seoDescription: "Reach our dispatchers and service team for urgent repairs, quotes, or commercial inquiries.",
    bodyContent: "Direct telephone dispatch line: (305) 555-0100. Emergency technicians on standby 24/7/365.",
  },
  {
    id: "cnt-9",
    title: "Emergency HVAC Rapid Dispatch",
    category: "Services",
    type: "Service Detail",
    status: "Published",
    lastUpdated: "May 20, 2026",
    path: "/services/emergency-hvac",
    headline: "60-Minute Emergency HVAC Dispatch Guaranteed",
    subtitle: "When your AC fails in the Florida heat, our rapid response fleet is rolling within minutes.",
    seoTitle: "24/7 Emergency AC Repair Miami — 60 Min Arrival",
    seoDescription: "Immediate emergency air conditioning repair across Miami-Dade and Broward counties.",
    bodyContent: "Priority dispatch protocol, on-truck diagnostic instruments, and emergency capacitor/compressor inventory.",
  },
  {
    id: "cnt-10",
    title: "AC Diagnostic & Fix",
    category: "Services",
    type: "Service Detail",
    status: "Published",
    lastUpdated: "May 19, 2026",
    path: "/services/ac-repair",
    headline: "Comprehensive 26-Point Air Conditioning Diagnostic",
    subtitle: "Pinpoint performance bottlenecks, electrical faults, and refrigerant leaks accurately.",
    seoTitle: "AC Diagnostic & Repair Specialist — Upfront Pricing",
    seoDescription: "Professional AC repair and diagnostic inspection with 1-year parts and labor warranty.",
    bodyContent: "Comprehensive capacitor, contactor, compressor, fan motor, and coil inspection with digital report.",
  },
  {
    id: "cnt-11",
    title: "$50 Off Diagnostic Summer Special",
    category: "Banners",
    type: "Promotional Banner",
    status: "Published",
    lastUpdated: "May 18, 2026",
    path: "/redeem-specials",
    headline: "Limited Time Summer Savings: $50 Off Diagnostic Fee",
    subtitle: "Valid for any residential AC repair or complete system checkup.",
    seoTitle: "HVAC Coupons & Summer Specials — Save $50",
    seoDescription: "Redeem your $50 discount on HVAC diagnostics and seasonal maintenance packages.",
    bodyContent: "Use promo code SUMMER50 during online booking or mention to your technician upon arrival.",
  },
  {
    id: "cnt-12",
    title: "What is the 60-Minute Rapid Response Guarantee?",
    category: "FAQs",
    type: "FAQ Entry",
    status: "Published",
    lastUpdated: "May 17, 2026",
    path: "/faq",
    headline: "60-Minute Emergency Guarantee Details",
    subtitle: "How our automated GPS dispatch system pairs you with the closest qualified technician.",
    seoTitle: "FAQ: Rapid Response HVAC Dispatch Protocol",
    seoDescription: "Learn how ServicePro OS fulfills rapid emergency service calls across South Florida.",
    bodyContent: "Technicians stationed regionally throughout Miami, Brickell, Coral Gables, Doral, and Fort Lauderdale.",
  },
];

export default function AdminContentManagementPage() {
  const [activeTab, setActiveTab] = React.useState<"Pages" | "Services" | "Banners" | "FAQs">("Pages");
  const [items, setItems] = React.useState<ContentItem[]>(INITIAL_CONTENT_ITEMS);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [editingItem, setEditingItem] = React.useState<ContentItem | null>(null);
  const [addModalOpen, setAddModalOpen] = React.useState(false);
  const [newTitle, setNewTitle] = React.useState("");
  const [newType, setNewType] = React.useState("Page");
  const [newPath, setNewPath] = React.useState("");

  const filteredItems = items.filter((item) => {
    const matchesTab = item.category === activeTab;
    const matchesSearch =
      searchQuery.trim() === "" ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.headline && item.headline.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTab && matchesSearch;
  });

  function handleSaveEdit() {
    if (!editingItem) return;
    setItems((prev) =>
      prev.map((i) => (i.id === editingItem.id ? { ...editingItem, lastUpdated: "Just now" } : i))
    );
    toast.success(`"${editingItem.title}" details updated successfully.`);
    setEditingItem(null);
  }

  function handleAddContent() {
    if (!newTitle.trim()) {
      toast.error("Please enter a page/content title");
      return;
    }
    const cleanPath = newPath.trim()
      ? (newPath.trim().startsWith("/") ? newPath.trim() : "/" + newPath.trim())
      : "/" + newTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    const newItem: ContentItem = {
      id: `cnt-${Date.now()}`,
      title: newTitle.trim(),
      category: activeTab,
      type: newType,
      status: "Published",
      lastUpdated: "Just now",
      path: cleanPath,
      headline: `${newTitle.trim()} — Official Information & Booking`,
      subtitle: "Custom content section managed via ServicePro OS Content CMS.",
      seoTitle: `${newTitle.trim()} — ServicePro OS`,
      seoDescription: `Official details, service specifications, and customer assistance for ${newTitle.trim()}.`,
      bodyContent: "Custom page content managed internally from the admin panel.",
    };
    setItems((prev) => [newItem, ...prev]);
    toast.success(`"${newItem.title}" added to CMS.`);
    setNewTitle("");
    setNewPath("");
    setAddModalOpen(false);
  }

  return (
    <div className="space-y-6 pb-12 text-white">
      {/* ─────────────────────────────────────────────────────────────
          1. HEADER & METRICS
      ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Internal Content &amp; Page Details CMS
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#F97316]/15 text-[#F97316] border border-[#F97316]/30">
              Admin Protected
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Edit page metadata, titles, hero headlines, SEO descriptions, and publication status internally from this panel.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setAddModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-[#0F172A] text-xs font-black shadow-lg shadow-orange-500/20 transition-all cursor-pointer shrink-0 active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add New Page / Content</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-[#0F172A] border border-white/10 space-y-1">
          <span className="text-[11px] font-medium text-slate-400">Total Managed Pages</span>
          <p className="text-xl font-mono font-extrabold text-white">{items.length}</p>
        </div>
        <div className="p-3.5 rounded-xl bg-[#0F172A] border border-white/10 space-y-1">
          <span className="text-[11px] font-medium text-slate-400">Published Live</span>
          <p className="text-xl font-mono font-extrabold text-emerald-400">
            {items.filter((i) => i.status === "Published").length}
          </p>
        </div>
        <div className="p-3.5 rounded-xl bg-[#0F172A] border border-white/10 space-y-1">
          <span className="text-[11px] font-medium text-slate-400">Drafts / In Review</span>
          <p className="text-xl font-mono font-extrabold text-orange-400">
            {items.filter((i) => i.status === "Draft").length}
          </p>
        </div>
        <div className="p-3.5 rounded-xl bg-[#0F172A] border border-white/10 space-y-1">
          <span className="text-[11px] font-medium text-slate-400">SEO Indexed Pages</span>
          <p className="text-xl font-mono font-extrabold text-blue-400">
            {items.filter((i) => i.seoTitle).length}
          </p>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. FILTER & SEARCH BAR
      ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
        {/* Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto">
          {(["Pages", "Services", "Banners", "FAQs"] as const).map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#F97316] text-[#0F172A] shadow-md shadow-orange-500/25"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {tab} ({items.filter((i) => i.category === tab).length})
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={`Filter ${activeTab.toLowerCase()} by title, path...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-[#070D18] border border-white/15 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#F97316]"
          />
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. CONTENT LISTING TABLE
      ───────────────────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-white/10 bg-[#0F172A] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0B1322] text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-white/10">
              <tr>
                <th className="px-5 py-3.5">Page Title &amp; Target Route</th>
                <th className="px-5 py-3.5">Hero Headline &amp; SEO Description</th>
                <th className="px-5 py-3.5">Category</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredItems.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-white/[0.03] transition-colors group cursor-pointer"
                  onClick={() => setEditingItem(item)}
                >
                  {/* Title & Route */}
                  <td className="px-5 py-3.5 font-semibold text-white">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-[#F97316] shrink-0" />
                        <span className="font-bold text-sm text-white">{item.title}</span>
                      </div>
                      <span className="font-mono text-[11px] text-slate-400 pl-6 block">
                        {item.path}
                      </span>
                    </div>
                  </td>

                  {/* Headline & SEO */}
                  <td className="px-5 py-3.5 text-slate-300 max-w-xs truncate">
                    <div className="space-y-0.5">
                      <p className="text-xs text-slate-200 truncate font-medium">
                        {item.headline || "—"}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate">
                        {item.seoDescription || "—"}
                      </p>
                    </div>
                  </td>

                  {/* Category / Type */}
                  <td className="px-5 py-3.5">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-white/5 text-slate-300 border border-white/10">
                      {item.type}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-5 py-3.5">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        item.status === "Published"
                          ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                          : item.status === "Draft"
                          ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                          : "bg-blue-500/15 text-blue-400 border border-blue-500/30"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-3.5 text-right">
                    <div
                      className="inline-flex items-center gap-1.5"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        onClick={() => setEditingItem(item)}
                        className="px-2.5 py-1.5 rounded-lg bg-[#F97316]/10 hover:bg-[#F97316]/20 text-[#F97316] border border-[#F97316]/30 font-bold text-xs flex items-center gap-1 transition-colors"
                        title="Edit Page Details"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                      <Link
                        href={item.path}
                        target="_blank"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                        title="View live page"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          4. COMPREHENSIVE EDIT PAGE DETAILS MODAL
      ───────────────────────────────────────────────────────────── */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-2xl rounded-3xl border border-white/15 bg-[#0F172A] p-6 sm:p-8 shadow-2xl space-y-6 my-8">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#F97316]/15 text-[#F97316] flex items-center justify-center border border-[#F97316]/30">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-white">
                    Edit Page Details: {editingItem.title}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Modify internal content, SEO metadata, and hero banner displays.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Row 1: Title & Path */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Page Title</label>
                  <input
                    type="text"
                    value={editingItem.title}
                    onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#070D18] border border-white/15 text-white focus:outline-none focus:border-[#F97316]"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Target Route / URL</label>
                  <input
                    type="text"
                    value={editingItem.path}
                    onChange={(e) => setEditingItem({ ...editingItem, path: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#070D18] border border-white/15 text-white font-mono focus:outline-none focus:border-[#F97316]"
                  />
                </div>
              </div>

              {/* Row 2: Status & Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Publication Status</label>
                  <select
                    value={editingItem.status}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, status: e.target.value as any })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#070D18] border border-white/15 text-white focus:outline-none focus:border-[#F97316]"
                  >
                    <option value="Published">Published (Live Online)</option>
                    <option value="Draft">Draft (Internal Only)</option>
                    <option value="Scheduled">Scheduled</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Page Type</label>
                  <input
                    type="text"
                    value={editingItem.type}
                    onChange={(e) => setEditingItem({ ...editingItem, type: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#070D18] border border-white/15 text-white focus:outline-none focus:border-[#F97316]"
                  />
                </div>
              </div>

              {/* Row 3: Hero Headline & Subtitle */}
              <div>
                <label className="block text-slate-300 font-bold mb-1">Hero Main Headline</label>
                <input
                  type="text"
                  value={editingItem.headline || ""}
                  onChange={(e) => setEditingItem({ ...editingItem, headline: e.target.value })}
                  placeholder="e.g. Fast, Reliable HVAC Diagnostics..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#070D18] border border-white/15 text-white focus:outline-none focus:border-[#F97316]"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Hero Subtitle / Description</label>
                <textarea
                  rows={2}
                  value={editingItem.subtitle || ""}
                  onChange={(e) => setEditingItem({ ...editingItem, subtitle: e.target.value })}
                  placeholder="Short introductory lead paragraph..."
                  className="w-full px-3.5 py-2 rounded-xl bg-[#070D18] border border-white/15 text-white focus:outline-none focus:border-[#F97316] resize-none"
                />
              </div>

              {/* Row 4: SEO Metadata */}
              <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3">
                <div className="flex items-center gap-1.5 text-slate-200 font-bold">
                  <Globe className="w-4 h-4 text-[#F97316]" />
                  <span>SEO Meta Tags &amp; OpenGraph Snippet</span>
                </div>

                <div>
                  <label className="block text-slate-400 text-[11px] mb-1">Meta Title (Browser Tab &amp; Google)</label>
                  <input
                    type="text"
                    value={editingItem.seoTitle || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, seoTitle: e.target.value })}
                    placeholder="Page Title | ServicePro OS"
                    className="w-full px-3 py-2 rounded-xl bg-[#0F172A] border border-white/15 text-white focus:outline-none focus:border-[#F97316]"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 text-[11px] mb-1">Meta Description (Search Results Snippet)</label>
                  <textarea
                    rows={2}
                    value={editingItem.seoDescription || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, seoDescription: e.target.value })}
                    placeholder="Short description for search engine ranking (150-160 characters recommended)..."
                    className="w-full px-3 py-2 rounded-xl bg-[#0F172A] border border-white/15 text-white focus:outline-none focus:border-[#F97316] resize-none"
                  />
                </div>
              </div>

              {/* Row 5: Content Body */}
              <div>
                <label className="block text-slate-300 font-bold mb-1">Content Body / Internal Notes</label>
                <textarea
                  rows={3}
                  value={editingItem.bodyContent || ""}
                  onChange={(e) => setEditingItem({ ...editingItem, bodyContent: e.target.value })}
                  placeholder="Add custom page content, details, or notes..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#070D18] border border-white/15 text-white focus:outline-none focus:border-[#F97316] resize-none"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <Link
                href={editingItem.path}
                target="_blank"
                className="text-xs text-[#F97316] hover:underline flex items-center gap-1 font-semibold"
              >
                <span>Live Page Preview</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveEdit}
                  className="px-5 py-2 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-[#0F172A] text-xs font-black shadow-lg shadow-orange-500/20 active:scale-95 transition-all flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Page Details</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          5. ADD NEW PAGE / CONTENT MODAL
      ───────────────────────────────────────────────────────────── */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md rounded-2xl border border-white/15 bg-[#0F172A] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#F97316]" />
                <h3 className="text-base font-extrabold text-white">Create New Page / Content</h3>
              </div>
              <button
                type="button"
                onClick={() => setAddModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Page Title</label>
                <input
                  type="text"
                  placeholder="e.g. Commercial Ventilation Maintenance"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#070D18] border border-white/15 text-white focus:outline-none focus:border-[#F97316]"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Target Route / URL (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. /services/commercial-ventilation"
                  value={newPath}
                  onChange={(e) => setNewPath(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#070D18] border border-white/15 text-white font-mono focus:outline-none focus:border-[#F97316]"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Category Type</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#070D18] border border-white/15 text-white focus:outline-none focus:border-[#F97316]"
                >
                  <option value="Page">Public Landing Page</option>
                  <option value="Service">Service Detail Page</option>
                  <option value="Banner">Promotional Banner</option>
                  <option value="FAQ">Customer FAQ Entry</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => setAddModalOpen(false)}
                className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddContent}
                className="px-5 py-2 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-[#0F172A] text-xs font-black shadow-md shadow-orange-500/20 active:scale-95 transition-all"
              >
                Create Page Entry
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
