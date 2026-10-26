"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, ArrowLeft, PhoneCall } from "lucide-react";
import { BrandTagline } from "@/components/brand/BrandTagline";
import { businessConfig } from "@config/business.config";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  // Close mobile drawer on route change
  React.useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Handle ESC key to close drawer
  React.useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setMobileMenuOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Lock body scroll when mobile menu is open
  React.useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  // Strictly hide global navbar on:
  // 1. Landing page (which renders its own standalone locked layout)
  // 2. All authenticated portals: /admin, /tech, /account
  // 3. Auth pages: /login, /register, and recovery flows
  const isExcluded =
    pathname === "/" ||
    pathname === "/admin" ||
    pathname?.startsWith("/admin/") ||
    pathname === "/tech" ||
    pathname?.startsWith("/tech/") ||
    pathname === "/account" ||
    pathname?.startsWith("/account/") ||
    pathname?.startsWith("/login") ||
    pathname?.startsWith("/register") ||
    pathname?.startsWith("/forgot-password") ||
    pathname?.startsWith("/reset-password") ||
    pathname?.startsWith("/verify-email") ||
    pathname?.startsWith("/verify-phone") ||
    pathname?.startsWith("/unauthorized") ||
    pathname === "/session-expired" ||
    pathname === "/locked" ||
    pathname === "/verification-required";

  if (isExcluded) {
    return null;
  }

  const handleGoBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  const isEmergency = pathname?.includes("emergency");

  return (
    <header className="sticky top-0 z-50 bg-[#0C1523]/90 backdrop-blur-md border-b border-white/10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo: Clean Transparent Brand Icon + ServicePro OS + Tagline Underneath */}
        <Link href="/" className="flex items-center gap-3 group">
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

        {/* Right-Shifted Action Zone (Strictly Right Side) */}
        <div className="hidden md:flex items-center gap-3 ml-auto">
          {isEmergency && (
            <a
              href={`tel:${businessConfig.phone.replace(/[^0-9]/g, "")}`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-600/20 border border-red-500/40 text-red-400 hover:bg-red-600 hover:text-white text-sm font-semibold transition-all shadow-sm"
            >
              <PhoneCall className="w-4 h-4 animate-pulse" />
              <span>Call 24/7 Dispatch</span>
            </a>
          )}
          <button
            onClick={handleGoBack}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/20 bg-white/5 text-slate-200 hover:text-white hover:bg-white/15 hover:border-white/40 text-sm font-semibold transition-all backdrop-blur-md shadow-sm active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go Back</span>
          </button>
        </div>

        {/* Accessible Mobile Menu Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/60 focus:outline-none focus:ring-2 focus:ring-[#F97316]"
          aria-label="Toggle mobile menu"
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Right-Side Hamburger Slide-Out Drawer & Backdrop */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 md:hidden animate-in fade-in duration-200"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Right-Side Drawer Panel */}
          <nav
            id="mobile-nav"
            className="fixed inset-y-0 right-0 w-[290px] sm:w-[320px] bg-[#0C1523]/95 backdrop-blur-2xl border-l border-white/10 z-50 p-6 flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-250 md:hidden"
            aria-label="Mobile navigation"
          >
            <div>
              {/* Drawer Header: Brand + Tagline + Close Button */}
              <div className="flex items-center justify-between pb-5 border-b border-white/10">
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5"
                >
                  <img
                    src="/images/servicepro-icon-transparent.png?v=green"
                    alt="ServicePro OS"
                    className="h-8 w-auto object-contain"
                  />
                  <div className="flex flex-col">
                    <span className="text-base font-bold text-white leading-tight">
                      ServicePro <span className="text-[#F97316]">OS</span>
                    </span>
                    <BrandTagline size="sm" className="mt-0.5" />
                  </div>
                </Link>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 -mr-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-[#F97316]"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Core Quick Navigation (Non-Footer Action & Discovery Pages Only — Zero Duplicates) */}
              <div className="py-5 space-y-1.5 overflow-y-auto max-h-[65vh]">
                <Link
                  href="/book"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm font-semibold text-[#F97316] hover:bg-white/5 transition-colors"
                >
                  Book Service
                </Link>
                <Link
                  href="/book/track"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                >
                  Track Booking
                </Link>
                <Link
                  href="/services"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                >
                  Services
                </Link>
                <Link
                  href="/technicians"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                >
                  Technicians
                </Link>
                <Link
                  href="/pricing"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                >
                  Pricing
                </Link>
                <Link
                  href="/gallery"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                >
                  Gallery
                </Link>
                <Link
                  href="/service-areas"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                >
                  Service Areas
                </Link>
                <Link
                  href="/pages"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                >
                  Pages Directory
                </Link>
              </div>
            </div>

            {/* Bottom Actions Inside Mobile Right Drawer */}
            <div className="pt-5 border-t border-white/10 flex flex-col gap-3">
              {isEmergency && (
                <a
                  href={`tel:${businessConfig.phone.replace(/[^0-9]/g, "")}`}
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-full bg-red-600 text-white font-semibold text-sm shadow-md"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Call 24/7 Emergency Dispatch</span>
                </a>
              )}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleGoBack();
                }}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-full border border-white/20 bg-white/10 text-white font-semibold text-sm hover:bg-white/20 transition-all shadow-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Go Back</span>
              </button>
            </div>
          </nav>
        </>
      )}
    </header>
  );
}
