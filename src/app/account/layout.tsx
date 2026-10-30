"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  FileText,
  CreditCard,
  MapPin,
  User,
  HelpCircle,
  Bell,
  LogOut,
  ShieldCheck,
  Star,
  Bookmark,
  Navigation,
  Menu,
  ChevronDown,
  X,
  Wrench,
  Sparkles,
  ArrowRight,
  UserCheck,
  Globe,
  ExternalLink,
  CheckCircle2,
  DollarSign,
  Users,
  Briefcase,
  Camera,
  Phone,
  Tag,
  Building2,
} from "lucide-react";
import { businessConfig } from "@config/business.config";
import { BrandTagline } from "@/components/brand/BrandTagline";
import { cn } from "@/lib/utils";

interface ClientNavGroup {
  groupName: string;
  items: {
    href: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    exact?: boolean;
    badgeCount?: number;
  }[];
}

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [unreadCount, setUnreadCount] = React.useState(0);
  const [loggingOut, setLoggingOut] = React.useState(false);
  const [locationSharing, setLocationSharing] = React.useState(true);
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = React.useState(false);
  const [notificationsOpen, setNotificationsOpen] = React.useState(false);

  // Close overlays on Escape key
  React.useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setSidebarOpen(false);
        setProfileMenuOpen(false);
        setNotificationsOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Prevent background scrolling when sidebar drawer is open
  React.useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  // Fetch unread notification count
  React.useEffect(() => {
    async function fetchUnread() {
      try {
        const res = await fetch("/api/account/notifications");
        if (res.ok) {
          const data = await res.json();
          setUnreadCount(data.unreadCount || 0);
        }
      } catch {
        // silent
      }
    }
    fetchUnread();
  }, [pathname]);

  async function handleSignOut() {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/demo-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: "clear" }),
      });
      router.push("/login");
      router.refresh();
    } finally {
      setLoggingOut(false);
    }
  }

  const clientNavGroups: ClientNavGroup[] = [
    {
      groupName: "My Orders & Bookings",
      items: [
        { href: "/account", label: "Dashboard Overview", icon: LayoutDashboard, exact: true },
        { href: "/account/appointments", label: "Service Appointments", icon: Calendar },
        { href: "/account/invoices", label: "Invoices & Receipts", icon: FileText },
        { href: "/account/payments", label: "Payment Methods", icon: CreditCard },
      ],
    },
    {
      groupName: "Preferences & Care",
      items: [
        { href: "/account/favorites", label: "Saved Services", icon: Bookmark },
        { href: "/account/reviews", label: "My Reviews & Feedback", icon: Star },
        { href: "/account/addresses", label: "Saved Service Addresses", icon: MapPin },
        { href: "/account/profile", label: "Profile & Security", icon: User },
      ],
    },
    {
      groupName: "Field Fleet & Support",
      items: [
        { href: "/account/technicians", label: "Assigned Technicians", icon: Wrench },
        { href: "/account/support", label: "Support Desk & Chat", icon: HelpCircle },
        {
          href: "/account/notifications",
          label: "Notifications & Alerts",
          icon: Bell,
          badgeCount: unreadCount,
        },
      ],
    },
    {
      groupName: "Storefront & Actions",
      items: [
        { href: "/book", label: "Book Service", icon: Sparkles },
        { href: "/book/track", label: "Track Booking", icon: Navigation },
        { href: "/services", label: "Services", icon: Wrench },
        { href: "/technicians", label: "Technicians", icon: Users },
        { href: "/pricing", label: "Pricing", icon: DollarSign },
        { href: "/gallery", label: "Gallery", icon: Camera },
        { href: "/service-areas", label: "Service Areas", icon: MapPin },

      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#0C1523] text-white selection:bg-[#F97316] selection:text-white flex flex-col antialiased">
      {/* ─────────────────────────────────────────────────────────────
          1ST NAVBAR ROW: Exact Same as Admin Page Navbar
          Left: Brand Logo + Tagline
          Right: ONLY 2 Buttons
            1) Notification Bell
            2) Client Profile
      ───────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-[#0C1523]/95 backdrop-blur-md border-b border-white/10 shadow-lg transition-colors">
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* Brand Logo & Tagline (Matches Public & Admin Standard) */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <img
              src="/images/servicepro-icon-transparent.png?v=green"
              alt="ServicePro OS"
              className="h-8 sm:h-9 md:h-10 w-auto object-contain group-hover:scale-105 transition-transform"
            />
            <div className="flex flex-col justify-center">
              <span className="text-lg sm:text-xl font-bold tracking-tight text-white leading-tight">
                ServicePro <span className="text-[#F97316]">OS</span>
              </span>
              <BrandTagline size="base" className="mt-0.5" />
            </div>
          </Link>

          {/* Right-Side Controls: STRICTLY ONLY 2 BUTTONS (Bell & Profile) */}
          <div className="flex items-center gap-3 ml-auto">
            {/* 1. Notification Bell Button & Dropdown */}
            <div className="relative">
              <button
                type="button"
                aria-label="Customer notifications"
                onClick={() => setNotificationsOpen((prev) => !prev)}
                className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white transition-all cursor-pointer"
              >
                <Bell className="h-4 w-4" aria-hidden="true" />
              </button>
              {unreadCount > 0 && (
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#F97316] px-1 text-[10px] font-bold text-[#0C1523] shadow-md shadow-orange-500/50"
                >
                  {unreadCount}
                </span>
              )}

              {/* Notification Dropdown Flyout */}
              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-white/10 bg-[#0F172A] p-3 shadow-2xl z-50 space-y-2 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="text-xs font-bold text-white">
                      Notifications &amp; Activity ({unreadCount} new)
                    </span>
                    <button
                      type="button"
                      onClick={() => setNotificationsOpen(false)}
                      className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
                    >
                      Close
                    </button>
                  </div>

                  <div className="space-y-1.5 max-h-60 overflow-y-auto">
                    <Link
                      href="/account/appointments"
                      onClick={() => setNotificationsOpen(false)}
                      className="flex items-start gap-2 rounded-xl bg-orange-500/10 border border-orange-500/20 p-2.5 text-xs text-orange-200 hover:bg-orange-500/20 transition-colors"
                    >
                      <Wrench className="h-3.5 w-3.5 text-orange-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold text-white">Technician Assigned</div>
                        <div className="text-[11px] text-slate-300">Your technician is scheduled for your upcoming service.</div>
                      </div>
                    </Link>

                    <Link
                      href="/account/invoices"
                      onClick={() => setNotificationsOpen(false)}
                      className="flex items-start gap-2 rounded-xl bg-white/5 border border-white/5 p-2.5 text-xs text-slate-300 hover:bg-white/10 transition-colors"
                    >
                      <FileText className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold text-white">Invoice #INV-2024-001</div>
                        <div className="text-[11px] text-slate-400">Payment receipt is available to download.</div>
                      </div>
                    </Link>
                  </div>

                  <div className="pt-2 mt-2 border-t border-white/10 text-center">
                    <Link
                      href="/account/notifications"
                      onClick={() => setNotificationsOpen(false)}
                      className="text-xs font-semibold text-orange-400 hover:text-orange-300 block py-1 transition-colors"
                    >
                      View All Notifications &rarr;
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* 2. Client Profile Button & Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileMenuOpen((prev) => !prev)}
                className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 hover:border-white/30 text-white transition-all cursor-pointer group"
                aria-label="Client profile menu"
                aria-expanded={profileMenuOpen}
              >
                <div className="relative flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-tr from-[#F97316] to-amber-400 font-bold text-xs text-slate-950 shadow-sm">
                  MR
                  <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 border-2 border-[#0C1523]" />
                </div>
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-xs font-bold leading-tight text-white group-hover:text-orange-400 transition-colors">
                    My Account
                  </span>
                  <span className="text-[10px] text-slate-400 leading-tight">
                    Homeowner Client
                  </span>
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400 group-hover:text-white transition-transform" />
              </button>

              {/* Profile Dropdown Menu */}
              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-72 rounded-2xl border border-white/10 bg-[#0F172A] p-4 shadow-2xl z-50 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center gap-3 pb-3 border-b border-white/10">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-[#F97316] to-amber-400 font-black text-sm text-slate-950">
                      MR
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">My Account</div>
                      <div className="text-[11px] text-emerald-400 flex items-center gap-1.5 mt-0.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Verified Account &bull; Verified Account
                      </div>
                    </div>
                  </div>

                  <div className="py-2 space-y-1">
                    <Link
                      href="/account/profile"
                      onClick={() => setProfileMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-200 hover:text-white hover:bg-white/10 transition-colors"
                    >
                      <User className="w-3.5 h-3.5 text-orange-400" />
                      <span>Profile &amp; Contact Info</span>
                    </Link>

                    <Link
                      href="/account/addresses"
                      onClick={() => setProfileMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-200 hover:text-white hover:bg-white/10 transition-colors"
                    >
                      <MapPin className="w-3.5 h-3.5 text-orange-400" />
                      <span>Saved Service Addresses</span>
                    </Link>

                    <Link
                      href="/account/invoices"
                      onClick={() => setProfileMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-200 hover:text-white hover:bg-white/10 transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5 text-orange-400" />
                      <span>Billing &amp; Invoices</span>
                    </Link>
                  </div>

                  <div className="pt-2 border-t border-white/10">
                    <button
                      type="button"
                      onClick={() => {
                        setProfileMenuOpen(false);
                        handleSignOut();
                      }}
                      disabled={loggingOut}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors cursor-pointer"
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

        {/* ─────────────────────────────────────────────────────────────
            2ND NAVBAR ROW: Exactly 3 Buttons (No Duplicates)
            1) All Menu (Sidebar with Dropdown containing all buttons)
            2) Share Location With Tech
            3) Technicians
        ───────────────────────────────────────────────────────────── */}
        <div className="border-t border-white/10 bg-[#080D16]/95 backdrop-blur-md">
          <nav
            className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center gap-3"
            aria-label="Client 2nd Navbar: All Menu, Share Location With Tech, Technicians"
          >
            {/* 1. All Menu Button (Triggers full sidebar drawer with dropdown menus) */}
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-orange-500/40 bg-orange-500/10 hover:bg-orange-500/20 text-[#F97316] hover:text-orange-300 text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
              aria-label="Open All Menu sidebar"
            >
              <Menu className="w-4 h-4" />
              <span>All Menu</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-70" />
            </button>

            {/* 2. Share Location With Tech Button (Toggle with live active indicator) */}
            <button
              type="button"
              onClick={() => setLocationSharing(!locationSharing)}
              className={cn(
                "inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all shadow-sm cursor-pointer border",
                locationSharing
                  ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/25"
                  : "bg-white/5 border-white/15 text-slate-400 hover:text-white hover:bg-white/10"
              )}
              title="Toggle Live Location Sharing With Assigned Technician"
            >
              <Navigation className={cn("w-3.5 h-3.5", locationSharing ? "text-emerald-400 animate-pulse" : "text-slate-500")} />
              <span>Share Location With Tech</span>
              <span
                className={cn(
                  "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ml-0.5",
                  locationSharing
                    ? "bg-emerald-500/30 text-emerald-300"
                    : "bg-white/10 text-slate-400"
                )}
              >
                {locationSharing ? "Active" : "Off"}
              </span>
            </button>

            {/* 3. Technicians Button */}
            <Link
              href="/account/technicians"
              className={cn(
                "inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all shadow-sm cursor-pointer",
                pathname === "/account/technicians"
                  ? "bg-[#F97316] text-[#0C1523] shadow-orange-500/25 ring-1 ring-orange-400/50"
                  : "bg-white/5 hover:bg-white/10 border border-white/15 text-white"
              )}
            >
              <Wrench className={cn("w-3.5 h-3.5", pathname === "/account/technicians" ? "text-[#0C1523]" : "text-[#F97316]")} />
              <span>Technicians</span>
            </Link>

            {/* Right: Public Storefront Quick Link */}
            <div className="ml-auto flex items-center gap-2 shrink-0">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-slate-300 hover:text-white text-xs font-semibold transition-all shadow-sm cursor-pointer"
                title="Return to Home"
              >
                <Globe className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">Home</span>
              </Link>
            </div>
          </nav>
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────
          "ALL MENU" SLIDE-OUT SIDEBAR DRAWER WITH DROPDOWN CATEGORIES
          (Contains all client buttons inside + Exit/Logout shifted here)
      ───────────────────────────────────────────────────────────── */}
      {sidebarOpen && (
        <>
          {/* Backdrop Click to Close */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[999] animate-in fade-in" style={{ backgroundColor: "rgba(0, 0, 0, 0.85)" }} aria-label="backdrop duration-200"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />

          {/* Left Slide-out Sidebar Drawer */}
          <aside
            id="client-all-menu-sidebar"
            className="fixed inset-y-0 left-0 w-80 sm:w-96 h-full h-[100dvh] bg-[#0B132B] border-r border-white/10 z-[1000] flex flex-col justify-between shadow-2xl animate-in slide-in-from-left duration-250" style={{ backgroundColor: "#0B132B", opacity: 1 }}
            aria-label="Client All Menu Navigation"
          >
            {/* Sidebar Top Header */}
            <div className="p-5 border-b border-white/10 flex items-center justify-between bg-black/20">
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
                    Customer Account Hub
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

            {/* Sidebar Scrollable Categorized Nav Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {clientNavGroups.map((group) => (
                <div key={group.groupName} className="space-y-1.5">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 pb-1">
                    {group.groupName}
                  </div>
                  <div className="space-y-1">
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = item.exact
                        ? pathname === item.href
                        : pathname.startsWith(item.href);

                      const isPublicStorefront = !item.href.startsWith("/account");

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          target={isPublicStorefront ? "_blank" : undefined}
                          rel={isPublicStorefront ? "noopener noreferrer" : undefined}
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

                          {isPublicStorefront ? (
                            <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300 shrink-0" />
                          ) : item.badgeCount && item.badgeCount > 0 ? (
                            <span
                              className={cn(
                                "px-2 py-0.5 rounded-full text-[10px] font-black",
                                isActive
                                  ? "bg-[#0C1523] text-[#F97316]"
                                  : "bg-[#F97316] text-[#0C1523]"
                              )}
                            >
                              {item.badgeCount}
                            </span>
                          ) : null}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Sidebar Footer: Exit / Sign Out Button */}
            <div className="p-4 border-t border-white/10 bg-black/30 space-y-2">
              <button
                type="button"
                onClick={() => {
                  setSidebarOpen(false);
                  handleSignOut();
                }}
                disabled={loggingOut}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 hover:text-rose-200 text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
              >
                <LogOut className="w-4 h-4 text-rose-400" />
                <span>{loggingOut ? "Signing Out..." : "Sign Out & Exit"}</span>
              </button>
            </div>
          </aside>
        </>
      )}

      {/* ─────────────────────────────────────────────────────────────
          FULL-WIDTH MAIN CONTENT AREA: Direct Below 2-Row Navbar
      ───────────────────────────────────────────────────────────── */}
      <main className="flex-1 w-full min-w-0 p-4 sm:p-6 lg:p-8">
        {children}
      </main>

      {/* Compact Customer Support Footer (Hidden on Live GPS Tracking Workspace) */}
      {!pathname?.endsWith("/track") && (
        <footer className="hidden md:block border-t border-white/10 bg-[#080E1A] px-4 sm:px-6 lg:px-8 py-4 text-xs text-slate-400">
          <div className="max-w-[1600px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-4">
              <span className="text-slate-300 font-medium">Need Support?</span>
              <Link href="/account/support" className="text-orange-400 font-semibold hover:text-orange-300 transition-colors">
                Open Ticket
              </Link>
              <span className="text-slate-700">·</span>
              <Link href="/terms" className="hover:text-white transition-colors">
                Warranty Center
              </Link>
              <span className="text-slate-700">·</span>
              <a
                href={`tel:${businessConfig.phone.replace(/[^0-9]/g, "")}`}
                className="hover:text-white transition-colors"
              >
                Emergency Dispatch: {businessConfig.phone}
              </a>
            </div>
            <div className="text-slate-500">
              © {new Date().getFullYear()} ServicePro OS
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
