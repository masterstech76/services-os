"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  CalendarClock,
  Briefcase,
  Users,
  Wrench,
  Calendar,
  FileText,
  CreditCard,
  Package,
  Sparkles,
  BarChart3,
  Settings,
  Database,
  Bell,
  Search,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Plus,
  AlertTriangle,
  LogOut,
  ShieldAlert,
  ShieldCheck,
  Star,
  MapPin,
  Tag,
  DollarSign,
  Phone,
  CheckCircle2,
  ExternalLink,
  Send,
  UserPlus,
  Clock,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface AdminNavGroup {
  groupName: string;
  items: {
    href: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    exact?: boolean;
    badgeCount?: number;
  }[];
}

const ADMIN_NAV_GROUPS: AdminNavGroup[] = [
  {
    groupName: "Operations & Dispatch",
    items: [
      { href: "/admin", label: "Executive Overview", icon: LayoutDashboard, exact: true },
      { href: "/admin/dispatch", label: "Dispatch Board", icon: CalendarClock, exact: true },
      { href: "/admin/dispatch/board", label: "Dedicated Dispatch Grid", icon: CalendarClock },
      { href: "/admin/dispatch/calendar", label: "Schedule & Appointments", icon: Calendar },
      { href: "/admin/technicians", label: "Technicians Fleet Roster", icon: Wrench },
      { href: "/admin/services", label: "Services Trade Catalog", icon: Sparkles },
    ],
  },
  {
    groupName: "Jobs & Work Orders",
    items: [
      { href: "/admin/jobs", label: "All Jobs & Work Orders", icon: Briefcase, exact: true },
      { href: "/admin/jobs/create", label: "Create Work Order", icon: Plus },
    ],
  },
  {
    groupName: "Finance & Billing Ledger",
    items: [
      { href: "/admin/invoices", label: "Invoices Ledger", icon: FileText, exact: true },
      { href: "/admin/payments", label: "Payments & Transactions", icon: CreditCard, exact: true },
      { href: "/admin/payouts", label: "Worker Payouts & Commission", icon: DollarSign },
      { href: "/admin/coupons", label: "Coupons & Promotional Codes", icon: Tag },
    ],
  },
  {
    groupName: "Inventory & Supply Chain",
    items: [
      { href: "/admin/inventory", label: "Inventory Stock Overview", icon: Package, exact: true },
      { href: "/admin/inventory/parts", label: "Parts & Materials Catalogue", icon: Package },
      { href: "/admin/inventory/transactions", label: "Stock Movement Transactions", icon: Package },
    ],
  },
  {
    groupName: "Customers CRM & Reviews",
    items: [
      { href: "/admin/customers", label: "Customers CRM Directory", icon: Users, exact: true },
      { href: "/admin/reviews", label: "Customer Reviews Moderation", icon: Star },
      { href: "/admin/service-areas", label: "Service Areas (Coverage ZIPs)", icon: MapPin },
    ],
  },
  {
    groupName: "System, Reports & Governance",
    items: [
      { href: "/admin/reports", label: "Reports & Analytics Overview", icon: BarChart3, exact: true },
      { href: "/admin/reports/revenue", label: "Revenue Analytics Reports", icon: BarChart3 },
      { href: "/admin/reports/jobs", label: "Job Performance Analytics", icon: BarChart3 },
      { href: "/admin/reports/technicians", label: "Technician KPI Reports", icon: BarChart3 },
      { href: "/admin/audit-logs", label: "Security & Audit Logs", icon: ShieldAlert },
      { href: "/admin/approvals", label: "Multi-Admin Quorum Approvals", icon: ShieldCheck, badgeCount: 2 },
      { href: "/admin/notifications", label: "Alerts & Notifications Log", icon: Bell },
      { href: "/admin/content", label: "Content Management CMS", icon: FileText },
      { href: "/admin/settings", label: "System Settings & Policies", icon: Settings },
      { href: "/admin/infrastructure", label: "Cloud Keys & .env Locker", icon: Database },
    ],
  },
];

interface AlertItem {
  id: string;
  jobId: string;
  jobNumber: number;
  message: string;
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  // "All Menu" Slide-Out Sidebar Drawer state (matches customer pages exactly)
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const [alertsOpen, setAlertsOpen] = React.useState(false);
  const [alerts, setAlerts] = React.useState<AlertItem[]>([
    {
      id: "alert-1",
      jobId: "1037",
      jobNumber: 1037,
      message: "2 jobs need immediate assignment (High Priority)",
    },
    {
      id: "alert-2",
      jobId: "1031",
      jobNumber: 1031,
      message: "Low inventory: R-410A Refrigerant (3 units remaining)",
    },
  ]);
  const [profileMenuOpen, setProfileMenuOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [searchFocused, setSearchFocused] = React.useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = React.useState(false);
  const [commandCategory, setCommandCategory] = React.useState<
    "all" | "jobs" | "customers" | "invoices" | "technicians" | "reports"
  >("all");
  const commandInputRef = React.useRef<HTMLInputElement | null>(null);

  const COMMAND_ITEMS = React.useMemo(
    () => [
      {
        id: "job-1004",
        category: "jobs" as const,
        title: "Job #1004 — Emergency AC Compressor Replacement",
        subtitle: "Maria Rodriguez · 1420 Brickell Bay Dr · En Route",
        href: "/admin/jobs/job-1004",
        badge: "URGENT",
      },
      {
        id: "job-1009",
        category: "jobs" as const,
        title: "Job #1009 — Smart Thermostat Calibration & Zoning",
        subtitle: "Admin User · Coral Gables · Scheduled Today 2:00 PM",
        href: "/admin/jobs",
        badge: "SCHEDULED",
      },
      {
        id: "job-create",
        category: "jobs" as const,
        title: "Create New Work Order & Dispatch Job",
        subtitle: "Launch manual dispatch intake wizard",
        href: "/admin/jobs/create",
        badge: "ACTION",
      },
      {
        id: "cust-maria",
        category: "customers" as const,
        title: "Maria Rodriguez (VIP Comfort Club)",
        subtitle: "(XXX) XXX-XXXX · 1420 Brickell Bay Dr, Miami, FL 33131",
        href: "/admin/customers/cust-1",
        badge: "CRM",
      },
      {
        id: "cust-david",
        category: "customers" as const,
        title: "Admin User (Commercial Account)",
        subtitle: "(XXX) XXX-XXXX · 380 Miracle Mile, Coral Gables, FL 33134",
        href: "/admin/customers",
        badge: "CRM",
      },
      {
        id: "inv-1004",
        category: "invoices" as const,
        title: "Invoice #INV-2026-1004 — $285.00",
        subtitle: "Maria Rodriguez · Paid via Stripe Apple Pay",
        href: "/admin/invoices/inv-1004",
        badge: "PAID",
      },
      {
        id: "inv-ledger",
        category: "invoices" as const,
        title: "Open Invoices & Receivables Ledger",
        subtitle: "View all pending balances, deposits, and Stripe links",
        href: "/admin/invoices",
        badge: "LEDGER",
      },
      {
        id: "tech-001",
        category: "technicians" as const,
        title: "Lead Field Technician — Senior Master HVAC Tech",
        subtitle: "Truck #04 · EPA Universal · 4.98★ Rating · En Route",
        href: "/admin/technicians/tech-carlos",
        badge: "ON SHIFT",
      },
      {
        id: "tech-002",
        category: "technicians" as const,
        title: "Senior HVAC Specialist — Commercial Chiller Specialist",
        subtitle: "Truck #07 · NATE Certified · 4.95★ Rating · Available",
        href: "/admin/technicians",
        badge: "AVAILABLE",
      },
      {
        id: "rep-revenue",
        category: "reports" as const,
        title: "Revenue, Gross Margin & Stripe Settlement Report",
        subtitle: "Financial P&L breakdown, average ticket size, and recurring MRR",
        href: "/admin/reports/revenue",
        badge: "REPORT",
      },
      {
        id: "rep-jobs",
        category: "reports" as const,
        title: "Job SLA & First-Time Fix Rate Analytics",
        subtitle: "Dispatch response times, completion velocity, and callbacks",
        href: "/admin/reports/jobs",
        badge: "REPORT",
      },
      {
        id: "rep-techs",
        category: "reports" as const,
        title: "Technician KPI & Utilization Leaderboard",
        subtitle: "Billable hours, parts attach rate, and 5-star review velocity",
        href: "/admin/reports/technicians",
        badge: "REPORT",
      },
    ],
    []
  );

  const filteredCommandItems = React.useMemo(() => {
    return COMMAND_ITEMS.filter((item) => {
      const matchesCat =
        commandCategory === "all" || item.category === commandCategory;
      const q = searchQuery.trim().toLowerCase();
      const matchesQuery =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q);
      return matchesCat && matchesQuery;
    });
  }, [COMMAND_ITEMS, commandCategory, searchQuery]);

  // Global Ctrl+K / Cmd+K Command Palette & Escape key handler
  React.useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
        setTimeout(() => commandInputRef.current?.focus(), 50);
        return;
      }
      if (e.key === "Escape") {
        setAlertsOpen(false);
        setSidebarOpen(false);
        setProfileMenuOpen(false);
        setSearchFocused(false);
        setCommandPaletteOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Prevent background scrolling when sidebar drawer or command palette is open
  React.useEffect(() => {
    if (sidebarOpen || commandPaletteOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen, commandPaletteOpen]);

  // Fetch live SLA alerts
  React.useEffect(() => {
    let mounted = true;
    async function fetchAlerts() {
      try {
        const res = await fetch("/api/dispatch/board");
        if (!res.ok) return;
        const data = (await res.json()) as { alerts?: AlertItem[] };
        if (mounted && Array.isArray(data.alerts) && data.alerts.length > 0) {
          setAlerts(data.alerts);
        }
      } catch {
        // use fallback alerts
      }
    }
    void fetchAlerts();
    const timer = setInterval(() => {
      if (typeof document !== "undefined" && document.visibilityState !== "visible") return;
      void fetchAlerts();
    }, 60000);
    return () => {
      mounted = false;
      clearInterval(timer);
    };
  }, []);

  async function switchToTechPwa() {
    await fetch("/api/auth/demo-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: "technician", technicianId: "tech-001" }),
    });
    router.push("/tech");
  }

  async function handleSignOut() {
    await fetch("/api/auth/demo-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: "clear" }),
    });
    router.push("/login");
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const q = encodeURIComponent(searchQuery.trim());
    setSearchFocused(false);
    router.push(`/admin/jobs?q=${q}`);
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white flex flex-col selection:bg-[#F97316] selection:text-[#020617] antialiased">
      {/* ─────────────────────────────────────────────────────────────
          1. EXACT ADMIN NAVBAR (Preserved for concurrent chat session)
             Row 1: Brand Logo & Tagline (Left) | Bell (2) & Profile Pill (Right)
             Row 2: "All Menu ∨" | "Vacancies" | "Requests" | Quick Jump Search
      ───────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-[#070D18]/95 backdrop-blur-xl border-b border-white/10 shadow-xl transition-colors">
        {/* ROW 1: TOP HEADER BAR */}
        <div className="w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Brand Logo & Italic Tagline */}
          <Link href="/admin" className="flex items-center gap-3 group shrink-0">
            <img
              src="/images/servicepro-icon-transparent.png?v=green"
              alt="ServicePro OS"
              className="h-8 sm:h-9 w-auto object-contain group-hover:scale-105 transition-transform"
            />
            <div className="flex flex-col justify-center">
              <span className="text-base sm:text-lg font-bold tracking-tight text-white leading-tight">
                ServicePro <span className="text-[#F97316]">OS</span>
              </span>
              <span className="text-[11px] text-slate-400 italic tracking-tight font-normal leading-tight mt-0.5">
                Trusted Service, Every Time.
              </span>
            </div>
          </Link>

          {/* Right Controls: Bell with '2' badge + Profile Pill */}
          <div className="flex items-center gap-3 ml-auto">
            {/* SLA Operations Alerts Bell Button */}
            <div className="relative">
              <button
                type="button"
                aria-label="Operations alerts"
                onClick={() => setAlertsOpen((prev) => !prev)}
                className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-[#0F172A] text-slate-300 hover:text-white hover:border-white/20 transition-all cursor-pointer shadow-inner"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white shadow-md shadow-rose-500/50">
                  {alerts.length > 0 ? alerts.length : 2}
                </span>
              </button>

              {/* Alerts Dropdown Flyout */}
              {alertsOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-white/10 bg-[#0F172A] p-3 shadow-2xl z-50 space-y-2 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="text-xs font-bold text-white">
                      Operations Alerts ({alerts.length})
                    </span>
                    <button
                      type="button"
                      onClick={() => setAlertsOpen(false)}
                      className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
                    >
                      Close
                    </button>
                  </div>
                  <div className="space-y-1.5 max-h-60 overflow-y-auto">
                    {alerts.map((a) => (
                      <Link
                        key={a.id}
                        href="/admin/dispatch"
                        onClick={() => setAlertsOpen(false)}
                        className="flex items-start gap-2 rounded-xl bg-rose-500/10 border border-rose-500/30 p-2.5 text-xs text-rose-300 hover:bg-rose-500/20 transition-colors"
                      >
                        <AlertTriangle className="h-3.5 w-3.5 text-rose-400 shrink-0 mt-0.5" />
                        <span>{a.message}</span>
                      </Link>
                    ))}
                  </div>
                  <div className="pt-2 border-t border-white/10 text-center">
                    <Link
                      href="/admin/notifications"
                      onClick={() => setAlertsOpen(false)}
                      className="text-xs font-semibold text-[#F97316] hover:text-[#EA580C] block py-1 transition-colors"
                    >
                      View All Notification History &rarr;
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Admin & Team Profile Pill */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileMenuOpen((prev) => !prev)}
                className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-white/10 bg-[#0F172A] hover:border-white/20 text-white transition-all cursor-pointer group shadow-sm"
                aria-label="Admin and team profile"
                aria-expanded={profileMenuOpen}
              >
                <div className="relative flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-tr from-[#F97316] to-amber-400 font-bold text-xs text-[#020617] shadow-sm">
                  AD
                  <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-400 border border-[#0F172A]" />
                </div>
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-xs font-bold leading-tight text-white group-hover:text-[#F97316] transition-colors">
                    Admin &amp; Team
                  </span>
                  <span className="text-[10px] text-slate-400 leading-tight">
                    Operations Lead
                  </span>
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400 group-hover:text-white transition-transform" />
              </button>

              {/* Profile Dropdown Menu */}
              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-72 rounded-2xl border border-white/10 bg-[#0F172A] p-4 shadow-2xl z-50 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center gap-3 pb-3 border-b border-white/10">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-[#F97316] to-amber-400 font-black text-sm text-[#020617]">
                      AD
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">Admin Operations Lead</div>
                      <div className="text-[11px] text-emerald-400 flex items-center gap-1.5 mt-0.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        HQ Live Desk Connected
                      </div>
                    </div>
                  </div>

                  <div className="py-2.5 text-xs text-slate-300 space-y-1.5">
                    <div className="flex items-center justify-between text-xs py-0.5">
                      <span className="text-slate-400">Dispatch Sector:</span>
                      <span className="font-semibold text-white">South Florida Metro</span>
                    </div>
                    <div className="flex items-center justify-between text-xs py-0.5">
                      <span className="text-slate-400">Certified Techs:</span>
                      <span className="font-semibold text-emerald-400">4 Active On-Shift</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/10 flex flex-col gap-1">
                    <Link
                      href="/admin/settings"
                      onClick={() => setProfileMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-200 hover:text-white hover:bg-white/10 transition-colors"
                    >
                      <Settings className="w-3.5 h-3.5 text-[#F97316]" />
                      <span>Business Settings &amp; Policies</span>
                    </Link>
                    <Link
                      href="/admin/infrastructure"
                      onClick={() => setProfileMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-200 hover:text-white hover:bg-white/10 transition-colors"
                    >
                      <Database className="w-3.5 h-3.5 text-[#F97316]" />
                      <span>Cloud Keys &amp; .env Locker</span>
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        setProfileMenuOpen(false);
                        void switchToTechPwa();
                      }}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-200 hover:text-white hover:bg-white/10 transition-colors text-left cursor-pointer"
                    >
                      <Wrench className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Switch to Technician PWA</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setProfileMenuOpen(false);
                        void handleSignOut();
                      }}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors text-left mt-1 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ROW 2: SUB-BAR STRIP (All Menu | Vacancies | Requests | Search) */}
        <div className="border-t border-white/10 bg-[#050A14]/90 px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            {/* 1. All Menu Pill (Triggers Slide-Out Sidebar Drawer - Matches Customer Account Hub) */}
            <button
              type="button"
              onClick={() => setSidebarOpen((prev) => !prev)}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#F97316]/60 bg-[#F97316]/10 hover:bg-[#F97316]/20 text-[#F97316] text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
              aria-label="Open All Menu sidebar"
            >
              <Menu className="w-3.5 h-3.5 text-[#F97316]" />
              <span>All Menu</span>
              <ChevronDown
                className={cn(
                  "w-3.5 h-3.5 text-[#F97316] transition-transform duration-200",
                  sidebarOpen ? "rotate-180" : ""
                )}
              />
            </button>

            {/* 2. Vacancies Pill */}
            <Link
              href="/careers"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/10 bg-[#0F172A] hover:bg-white/10 text-white text-xs font-semibold transition-all shadow-sm cursor-pointer"
              title="Careers &amp; Technician Vacancies"
            >
              <Briefcase className="w-3.5 h-3.5 text-[#F97316]" />
              <span>Vacancies</span>
            </Link>

            {/* 3. Requests Pill */}
            <Link
              href="/admin/jobs"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/10 bg-[#0F172A] hover:bg-white/10 text-white text-xs font-semibold transition-all shadow-sm cursor-pointer"
              title="Service Requests &amp; Jobs Queue"
            >
              <Wrench className="w-3.5 h-3.5 text-emerald-400" />
              <span>Requests</span>
            </Link>
          </div>

          {/* Right Side: Global Search Bar + Ctrl+K Command Palette Trigger */}
          <form onSubmit={handleSearchSubmit} className="relative w-full max-w-xs hidden sm:block">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setCommandPaletteOpen(true)}
              placeholder="Search jobs, customers, invoices..."
              className="w-full pl-9 pr-16 py-1.5 rounded-full bg-[#0F172A] border border-white/10 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] transition-all shadow-inner cursor-pointer"
            />
            <button
              type="button"
              onClick={() => setCommandPaletteOpen(true)}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-0.5 rounded-md bg-white/[0.06] border border-white/10 text-[10px] font-mono font-bold text-slate-300 hover:text-white hover:border-[#F97316]/40 transition-colors cursor-pointer"
              title="Open Global Command Palette (Ctrl + K)"
            >
              Ctrl K
            </button>
          </form>
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────
          2. "ALL MENU" SLIDE-OUT SIDEBAR DRAWER (Exact Match to Customer Pages)
             Opens smoothly when "All Menu ∨" is clicked
      ───────────────────────────────────────────────────────────── */}
      {sidebarOpen && (
        <>
          {/* Backdrop Click to Close */}
          <div
            className="fixed inset-0 z-[999] bg-black/85 backdrop-blur-sm animate-in fade-in duration-200"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.85)" }}
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />

          {/* Left Slide-out Sidebar Drawer (Identical to Customer Account Layout) */}
          <aside
            id="admin-all-menu-sidebar"
            className="fixed inset-y-0 left-0 w-80 sm:w-96 h-full h-[100dvh] bg-[#0B132B] border-r border-white/10 z-[1000] flex flex-col justify-between shadow-2xl animate-in slide-in-from-left duration-250"
            style={{ backgroundColor: "#0B132B", opacity: 1 }}
            aria-label="Admin All Menu Navigation"
          >
            {/* Sidebar Top Header */}
            <div className="p-5 border-b border-white/10 flex items-center justify-between bg-black/20 shrink-0">
              <div className="flex items-center gap-2.5">
                <img
                  src="/images/servicepro-icon-transparent.png?v=green"
                  alt="ServicePro OS"
                  className="h-7 w-auto object-contain"
                />
                <div>
                  <span className="text-sm font-bold text-white tracking-tight">
                    ServicePro <span className="text-[#F97316]">OS</span>
                  </span>
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                    Admin Operations Hub
                  </div>
                </div>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Close All Menu sidebar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Sidebar Scrollable Categorized Nav Items (Exact Same Style as Customer Hub) */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-white/10">
              {ADMIN_NAV_GROUPS.map((group) => (
                <div key={group.groupName} className="space-y-1.5">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 pb-1">
                    {group.groupName}
                  </div>
                  <div className="space-y-1">
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = item.exact
                        ? pathname === item.href
                        : pathname === item.href ||
                          (item.href !== "/admin" &&
                            pathname.startsWith(item.href) &&
                            !pathname.startsWith("/admin/dispatch/calendar") &&
                            item.href !== "/admin/dispatch/calendar") ||
                          (item.href === "/admin/dispatch/calendar" &&
                            pathname === "/admin/dispatch/calendar");

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setSidebarOpen(false)}
                          className={cn(
                            "flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group cursor-pointer",
                            isActive
                              ? "bg-[#F97316] text-[#0C1523] font-bold shadow-md shadow-orange-500/25"
                              : "text-slate-300 hover:text-white hover:bg-white/5"
                          )}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <Icon
                              className={cn(
                                "w-4 h-4 transition-colors shrink-0",
                                isActive
                                  ? "text-[#0C1523]"
                                  : "text-slate-400 group-hover:text-white"
                              )}
                            />
                            <span className="truncate">{item.label}</span>
                          </div>

                          {isActive && (
                            <span className="w-1.5 h-1.5 rounded-full bg-[#0C1523] shrink-0 ml-2" />
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Sidebar Footer: Exit / Sign Out Button */}
            <div className="p-4 border-t border-white/10 bg-black/30 space-y-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setSidebarOpen(false);
                  void handleSignOut();
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 hover:text-rose-200 text-xs font-bold transition-all cursor-pointer"
              >
                <LogOut className="w-4 h-4 text-rose-400" />
                <span>Sign Out &amp; Exit</span>
              </button>
            </div>
          </aside>
        </>
      )}

      {/* ─────────────────────────────────────────────────────────────
          GLOBAL COMMAND PALETTE MODAL (Ctrl + K / Cmd + K)
          Searches Jobs, Customers, Invoices, Technicians, Reports
      ───────────────────────────────────────────────────────────── */}
      {commandPaletteOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/75 backdrop-blur-sm pt-16 sm:pt-24 px-4 animate-in fade-in duration-150"
          onClick={() => setCommandPaletteOpen(false)}
        >
          <div
            className="w-full max-w-2xl rounded-2xl border border-white/15 bg-[#0B132B] shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input Header */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/10 bg-[#070D18]">
              <Search className="h-4 w-4 text-[#F97316] shrink-0" />
              <input
                ref={commandInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Type a command or search Jobs, Customers, Invoices, Technicians, Reports..."
                className="w-full bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setCommandPaletteOpen(false)}
                className="px-2 py-0.5 rounded bg-white/10 text-[10px] font-mono text-slate-300 hover:text-white cursor-pointer shrink-0"
              >
                ESC
              </button>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-white/10 bg-[#091020] overflow-x-auto">
              {(
                [
                  { id: "all", label: "All Results" },
                  { id: "jobs", label: "Jobs" },
                  { id: "customers", label: "Customers" },
                  { id: "invoices", label: "Invoices" },
                  { id: "technicians", label: "Technicians" },
                  { id: "reports", label: "Reports" },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setCommandCategory(tab.id)}
                  className={cn(
                    "px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer capitalize shrink-0",
                    commandCategory === tab.id
                      ? "bg-[#F97316] text-[#020617]"
                      : "bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.08]"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Results List */}
            <div className="max-h-80 overflow-y-auto divide-y divide-white/5 p-2">
              {filteredCommandItems.length === 0 ? (
                <div className="py-10 text-center text-xs text-slate-400">
                  No matching records found for &ldquo;{searchQuery}&rdquo;. Press Enter to search all jobs.
                </div>
              ) : (
                filteredCommandItems.map((item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={() => setCommandPaletteOpen(false)}
                    className="flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl hover:bg-white/[0.06] transition-colors group"
                  >
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white group-hover:text-[#F97316] transition-colors truncate">
                        {item.title}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate mt-0.5">
                        {item.subtitle}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="px-2 py-0.5 rounded-md bg-white/[0.06] border border-white/10 text-[10px] font-mono font-bold text-slate-300 uppercase">
                        {item.badge}
                      </span>
                      <ChevronRight className="h-3.5 w-3.5 text-slate-500 group-hover:text-[#F97316]" />
                    </div>
                  </Link>
                ))
              )}
            </div>

            {/* Footer Hints */}
            <div className="px-4 py-2.5 border-t border-white/10 bg-[#070D18] flex items-center justify-between text-[11px] text-slate-400">
              <div className="flex items-center gap-3">
                <span><strong className="text-white font-mono">↵</strong> to open</span>
                <span><strong className="text-white font-mono">Ctrl + K</strong> to toggle</span>
                <span><strong className="text-white font-mono">ESC</strong> to close</span>
              </div>
              <span className="text-slate-500">ServicePro OS Global Command</span>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          3. FULL-WIDTH MAIN CONTENT AREA: Direct Below 2-Row Navbar
             (No permanent sidebar occupying side space - matches tech & customer pages)
      ───────────────────────────────────────────────────────────── */}
      <main className="flex-1 w-full min-w-0 p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto">
        {children}
      </main>

      {/* Thin Enterprise System Status Footer (Hidden on Fullscreen /admin/dispatch Board) */}
      {pathname !== "/admin/dispatch" && (
        <footer className="border-t border-white/10 bg-[#070C16] px-4 sm:px-6 lg:px-8 py-3 text-[11px] text-slate-400">
          <div className="max-w-[1600px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/status"
                className="inline-flex items-center gap-1.5 text-emerald-400 font-semibold hover:underline"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Production
              </Link>
              <span className="text-slate-700">·</span>
              <Link
                href="/releases"
                className="font-mono text-slate-300 hover:text-[#F97316] transition-colors"
              >
                v2.6.4
              </Link>
              <span className="text-slate-700">·</span>
              <Link href="/status" className="hover:text-white transition-colors">
                API Health: 99.98%
              </Link>
              <span className="text-slate-700">·</span>
              <span className="text-emerald-400/90">Stripe Connected</span>
              <span className="text-slate-700">·</span>
              <span className="text-emerald-400/90">Twilio Connected</span>
            </div>
            <div className="flex items-center gap-3 text-slate-500">
              <span>Last Sync: Live</span>
              <span className="text-slate-700">·</span>
              <span>© {new Date().getFullYear()} ServicePro OS</span>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
