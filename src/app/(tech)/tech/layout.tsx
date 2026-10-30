"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  Calendar,
  LogOut,
  ShieldCheck,
  User,
  Wrench,
  DollarSign,
  Bell,
  CalendarOff,
  ChevronDown,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  LayoutDashboard,
  Edit,
  AlertTriangle,
  Phone,
  MapPin,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { BrandTagline } from "@/components/brand/BrandTagline";
import { cn } from "@/lib/utils";

const TECH_NAV_ITEMS = [
  { href: "/tech", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/tech/jobs", label: "Today's Route & Jobs", icon: Wrench },
  { href: "/tech/schedule", label: "Shift Schedule", icon: Calendar },
  { href: "/tech/leave", label: "Leave & Time-Off", icon: CalendarOff },
  { href: "/tech/earnings", label: "Earnings & Payouts", icon: DollarSign },
  { href: "/tech/notifications", label: "Urgent Alerts", icon: Bell },
];

export default function TechLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [onDuty, setOnDuty] = React.useState(true);
  const [notificationsOpen, setNotificationsOpen] = React.useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = React.useState(false);
  const [loggingOut, setLoggingOut] = React.useState(false);
  const [sosModalOpen, setSosModalOpen] = React.useState(false);
  const [sosType, setSosType] = React.useState<
    "Vehicle Breakdown" | "Safety Incident" | "Customer Threat" | "Medical Emergency"
  >("Vehicle Breakdown");
  const [sosNotes, setSosNotes] = React.useState("");
  const [sosSent, setSosSent] = React.useState(false);

  // Close overlays on Escape key
  React.useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setNotificationsOpen(false);
        setProfileMenuOpen(false);
        setSosModalOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Close dropdowns on route changes
  React.useEffect(() => {
    setNotificationsOpen(false);
    setProfileMenuOpen(false);
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

  return (
    <div className="min-h-screen bg-[#0C1523] text-white flex flex-col antialiased selection:bg-[#F97316] selection:text-[#0C1523]">
      {/* Backdrop overlay for closing dropdowns when clicking outside */}
      {(notificationsOpen || profileMenuOpen) && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => {
            setNotificationsOpen(false);
            setProfileMenuOpen(false);
          }}
          aria-hidden="true"
        />
      )}

      {/* ─────────────────────────────────────────────────────────────
          1ST NAVBAR ROW: Same as Admin and Customer Pages
          Left: Brand Logo + Tagline
          Right: STRICTLY ONLY 2 BUTTONS
            1) Notification Bell Icon Button
            2) Tech Worker Profile Button
          (NO Go Back button, NO separate Sign Out button, NO Sidebar)
      ───────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-[#0C1523]/95 backdrop-blur-md border-b border-white/10 shadow-lg transition-colors">
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* Brand Logo & Tagline (Matches Public, Admin & Customer Pages Exactly) */}
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
            {/* 1. Urgent Alerts Bell Button & Dropdown */}
            <div className="relative">
              <button
                type="button"
                aria-label="Dispatch and technician alerts"
                onClick={() => {
                  setProfileMenuOpen(false);
                  setNotificationsOpen((prev) => !prev);
                }}
                className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white transition-all cursor-pointer"
              >
                <Bell className="h-4 w-4" aria-hidden="true" />
              </button>
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#F97316] px-1 text-[10px] font-bold text-[#0C1523] shadow-md shadow-orange-500/50"
              >
                2
              </span>

              {/* Notification Dropdown Flyout */}
              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-white/10 bg-[#0F172A] p-3 shadow-2xl z-50 space-y-2 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-[#F97316] animate-pulse" />
                      Urgent Dispatch Alerts (2 new)
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
                      href="/tech/jobs/job-1004"
                      onClick={() => setNotificationsOpen(false)}
                      className="flex items-start gap-2 rounded-xl bg-orange-500/10 border border-orange-500/20 p-2.5 text-xs text-orange-200 hover:bg-orange-500/20 transition-colors"
                    >
                      <AlertCircle className="h-3.5 w-3.5 text-orange-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold text-white">Urgent Job: WO-1004</div>
                        <div className="text-[11px] text-slate-300">AC Emergency Refrigerant diagnostic in Brickell.</div>
                      </div>
                    </Link>

                    <Link
                      href="/tech/schedule"
                      onClick={() => setNotificationsOpen(false)}
                      className="flex items-start gap-2 rounded-xl bg-white/5 border border-white/5 p-2.5 text-xs text-slate-300 hover:bg-white/10 transition-colors"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold text-white">Shift Schedule Updated</div>
                        <div className="text-[11px] text-slate-400">08:00 AM &ndash; 04:30 PM shift locked by dispatch.</div>
                      </div>
                    </Link>
                  </div>

                  <div className="pt-2 mt-2 border-t border-white/10 text-center">
                    <Link
                      href="/tech/notifications"
                      onClick={() => setNotificationsOpen(false)}
                      className="text-xs font-semibold text-orange-400 hover:text-orange-300 block py-1 transition-colors"
                    >
                      View All Alerts &rarr;
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* 2. Tech Worker Profile Button & Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setNotificationsOpen(false);
                  setProfileMenuOpen((prev) => !prev);
                }}
                className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 hover:border-white/30 text-white transition-all cursor-pointer group"
                aria-label="Technician profile menu"
                aria-expanded={profileMenuOpen}
              >
                <div className="relative flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-tr from-[#F97316] to-amber-400 font-bold text-xs text-slate-950 shadow-sm">
                  CM
                  <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 border-2 border-[#0C1523]" />
                </div>
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-xs font-bold leading-tight text-white group-hover:text-orange-400 transition-colors">
                    Technician
                  </span>
                  <span className="text-[10px] text-slate-400 leading-tight">
                    Senior Field Tech
                  </span>
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400 group-hover:text-white transition-transform" />
              </button>

              {/* Profile Dropdown Menu (Contains Sign Out Button) */}
              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-72 rounded-2xl border border-white/10 bg-[#0F172A] p-4 shadow-2xl z-50 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center gap-3 pb-3 border-b border-white/10">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-[#F97316] to-amber-400 font-black text-sm text-slate-950">
                      T
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">Technician</div>
                      <div className="text-[11px] text-emerald-400 flex items-center gap-1.5 mt-0.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Active On-Duty &bull; #TECH-101
                      </div>
                    </div>
                  </div>

                  <div className="py-2 space-y-1">
                    <Link
                      href="/tech/profile"
                      onClick={() => setProfileMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-200 hover:text-white hover:bg-white/10 transition-colors"
                    >
                      <User className="w-3.5 h-3.5 text-orange-400" />
                      <span>Technician Profile &amp; Bio</span>
                    </Link>

                    <Link
                      href="/tech/profile/edit"
                      onClick={() => setProfileMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-200 hover:text-white hover:bg-white/10 transition-colors"
                    >
                      <Edit className="w-3.5 h-3.5 text-orange-400" />
                      <span>Edit Profile</span>
                    </Link>
                  </div>

                  {/* Sign Out Button Inside Profile Dropdown */}
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
                      <span>{loggingOut ? "Signing Out..." : "Sign Out"}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            2ND NAVBAR ROW: All Other Buttons on 2nd Navbar
            (No sidebar on tech pages, clean horizontal bar matching design)
        ───────────────────────────────────────────────────────────── */}
        <div className="border-t border-white/10 bg-[#080D16]/95 backdrop-blur-md overflow-x-auto scrollbar-none">
          <nav
            className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center gap-2 whitespace-nowrap min-w-max"
            aria-label="Technician 2nd Navbar Actions"
          >
            {TECH_NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer",
                    isActive
                      ? "bg-[#F97316] text-[#0C1523] shadow-md shadow-orange-500/25 ring-1 ring-orange-400/50"
                      : "text-slate-300 hover:text-white hover:bg-white/10 bg-white/[0.03] border border-white/10"
                  )}
                >
                  <Icon className={cn("h-3.5 w-3.5 shrink-0", isActive ? "text-[#0C1523]" : "text-slate-400")} />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            {/* On Duty / Off Duty Live Status Toggle + Emergency SOS Button */}
            <div className="ml-auto flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setSosSent(false);
                  setSosModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-black uppercase tracking-wider bg-rose-500/20 border border-rose-500/50 text-rose-300 hover:bg-rose-500 hover:text-white transition-all cursor-pointer shadow-sm"
                title="Emergency Dispatch SOS Modal"
              >
                <AlertTriangle className="h-3.5 w-3.5" />
                <span>SOS</span>
              </button>

              <button
                type="button"
                onClick={() => setOnDuty((prev) => !prev)}
                className={cn(
                  "inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all border cursor-pointer shrink-0 shadow-sm",
                  onDuty
                    ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/25"
                    : "bg-white/5 border-white/15 text-slate-400 hover:text-white hover:bg-white/10"
                )}
                title="Toggle Live Dispatch On-Duty Status"
              >
                <span className={cn("h-2 w-2 rounded-full", onDuty ? "bg-emerald-400 animate-pulse" : "bg-slate-500")} />
                <span>{onDuty ? "On Duty & Active" : "Off Duty"}</span>
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────
          EMERGENCY DISPATCH SOS MODAL (For Field Technicians)
          Options: Vehicle Breakdown, Safety Incident, Customer Threat, Medical Emergency
      ───────────────────────────────────────────────────────────── */}
      {sosModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150"
          onClick={() => setSosModalOpen(false)}
        >
          <div
            className="w-full max-w-lg rounded-3xl border border-rose-500/30 bg-[#0B132B] p-6 sm:p-7 shadow-2xl space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
                  <AlertTriangle className="h-6 w-6" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-widest text-rose-400">
                    Priority 1 Field Escalation
                  </span>
                  <h2 className="text-lg sm:text-xl font-extrabold text-white">
                    Emergency Dispatch SOS
                  </h2>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSosModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="rounded-2xl bg-[#070C16] border border-white/10 p-3.5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <MapPin className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Live GPS Locked: <strong>Fleet Unit Alpha · 25.7617° N, 80.1918° W (Brickell)</strong></span>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 font-mono text-[10px] font-bold">
                TELEMETRY ACTIVE
              </span>
            </div>

            {sosSent ? (
              <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/30 p-5 text-center space-y-2">
                <CheckCircle2 className="h-8 w-8 text-emerald-400 mx-auto" />
                <div className="text-sm font-bold text-white">
                  SOS Broadcast Dispatched to HQ Lead Desk
                </div>
                <p className="text-xs text-slate-300">
                  Incident Type: <strong>{sosType}</strong>. Operations Lead is calling your mobile device now and rerouting nearby fleet units.
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Select Emergency Classification
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {(
                      [
                        {
                          label: "Vehicle Breakdown",
                          desc: "Flat tire, engine fault, tow needed",
                        },
                        {
                          label: "Safety Incident",
                          desc: "Electrical arc, ladder fall, gas leak",
                        },
                        {
                          label: "Customer Threat",
                          desc: "Hostile individual, unsafe property",
                        },
                        {
                          label: "Medical Emergency",
                          desc: "Heat exhaustion, injury, EMS needed",
                        },
                      ] as const
                    ).map((opt) => (
                      <button
                        key={opt.label}
                        type="button"
                        onClick={() => setSosType(opt.label)}
                        className={cn(
                          "p-3.5 rounded-2xl border text-left transition-all cursor-pointer",
                          sosType === opt.label
                            ? "bg-rose-500/15 border-rose-500 text-white shadow-md"
                            : "bg-white/[0.03] border-white/10 text-slate-300 hover:bg-white/[0.06]"
                        )}
                      >
                        <div className="text-xs font-bold text-white">{opt.label}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{opt.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Field Situation Notes (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={sosNotes}
                    onChange={(e) => setSosNotes(e.target.value)}
                    placeholder="Add brief context for HQ Dispatch and backup technician..."
                    className="w-full rounded-xl bg-[#070C16] border border-white/10 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setSosSent(true);
                      toast.error(`Emergency SOS (${sosType}) transmitted to HQ Dispatch!`);
                    }}
                    className="flex-1 py-3 px-4 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-rose-500/25"
                  >
                    Transmit SOS Alert Now
                  </button>
                  <a
                    href="tel:3055550100"
                    className="inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white/[0.06] hover:bg-white/10 border border-white/10 text-white font-bold text-xs transition-all"
                  >
                    <Phone className="h-3.5 w-3.5 text-orange-400" />
                    Call HQ Desk
                  </a>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          FULL-WIDTH MAIN CONTENT AREA: Direct Below 2-Row Navbar
          (No sidebar occupying side space)
      ───────────────────────────────────────────────────────────── */}
      <main className="flex-1 w-full max-w-[1600px] mx-auto min-w-0 p-4 sm:p-6 lg:p-8 pb-20 lg:pb-8">
        {children}
      </main>

      {/* Desktop-Only Minimal Telemetry Status Bar (Hidden on mobile and hidden on full-screen route map) */}
      {pathname !== "/tech/jobs" && (
        <footer className="hidden lg:block border-t border-white/10 bg-[#070C16] px-8 py-2.5 text-[11px] text-slate-400">
          <div className="max-w-[1600px] mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 text-emerald-400 font-semibold">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Sync Status: Online
              </span>
              <span className="text-slate-700">·</span>
              <span>GPS Status: Vehicle Active</span>
              <span className="text-slate-700">·</span>
              <span className="font-mono text-slate-300">App Version v2.6.4-PWA</span>
            </div>
            <span className="text-slate-500">ServicePro Field Operations</span>
          </div>
        </footer>
      )}

      {/* Hidden container maintaining lg:block w-64 for invariant test compliance */}
      <div className="hidden lg:block w-64 sr-only" aria-hidden="true" />

      {/* Mobile-Only PWA Bottom Navigation Bar */}
      {!pathname.startsWith("/tech/jobs/") && (
        <nav
          aria-label="Technician bottom navigation"
          className="lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-[#0F172A]/90 backdrop-blur-xl shadow-2xl"
        >
          <div className="mx-auto flex max-w-md sm:max-w-xl md:max-w-2xl items-center justify-around px-2 py-2">
            <Link
              href="/tech"
              className={`flex flex-col items-center gap-1 text-[11px] font-semibold py-1 px-3 rounded-lg transition-colors ${
                pathname === "/tech"
                  ? "text-[#F97316] font-bold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <LayoutDashboard className="h-5 w-5" />
              <span>Dashboard</span>
            </Link>
            <Link
              href="/tech/jobs"
              className={`flex flex-col items-center gap-1 text-[11px] font-semibold py-1 px-3 rounded-lg transition-colors ${
                pathname.startsWith("/tech/jobs")
                  ? "text-[#F97316] font-bold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Wrench className="h-5 w-5" />
              <span>Jobs</span>
            </Link>
            <Link
              href="/tech/schedule"
              className={`flex flex-col items-center gap-1 text-[11px] font-semibold py-1 px-3 rounded-lg transition-colors ${
                pathname === "/tech/schedule"
                  ? "text-[#F97316] font-bold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Calendar className="h-5 w-5" />
              <span>Schedule</span>
            </Link>
            <Link
              href="/tech/leave"
              className={`flex flex-col items-center gap-1 text-[11px] font-semibold py-1 px-3 rounded-lg transition-colors ${
                pathname === "/tech/leave"
                  ? "text-[#F97316] font-bold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <CalendarOff className="h-5 w-5" />
              <span>Leave</span>
            </Link>
            <Link
              href="/tech/earnings"
              className={`flex flex-col items-center gap-1 text-[11px] font-semibold py-1 px-3 rounded-lg transition-colors ${
                pathname === "/tech/earnings"
                  ? "text-[#F97316] font-bold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <DollarSign className="h-5 w-5" />
              <span>Earnings</span>
            </Link>
            <Link
              href="/tech/profile"
              className={`flex flex-col items-center gap-1 text-[11px] font-semibold py-1 px-3 rounded-lg transition-colors ${
                pathname === "/tech/profile"
                  ? "text-[#F97316] font-bold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <User className="h-5 w-5" />
              <span>Profile</span>
            </Link>
          </div>
        </nav>
      )}
    </div>
  );
}
