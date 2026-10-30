"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Twitter,
  Linkedin,
  Facebook,
  Instagram,
  Youtube,
  Github,
} from "lucide-react";
import { BrandTagline } from "@/components/brand/BrandTagline";
import { businessConfig } from "@config/business.config";

export function Footer() {
  const pathname = usePathname();
  const phoneHref = `tel:${businessConfig.phone.replace(/[^0-9]/g, "")}`;

  // Landing page keeps its own dedicated footer as it is;
  // This exact footer is rendered on ALL other pages.
  const isExcluded = pathname === "/";

  if (isExcluded) {
    return null;
  }

  // Internal portals & Auth pages manage their own specialized footers (or no footer) inside their layouts.
  const isInternalPortalOrAuth =
    pathname === "/admin" ||
    pathname?.startsWith("/admin/") ||
    pathname === "/tech" ||
    pathname?.startsWith("/tech/") ||
    pathname === "/account" ||
    pathname?.startsWith("/account/") ||
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/forgot-password" ||
    pathname === "/reset-password" ||
    pathname === "/verify-email" ||
    pathname === "/verify-phone" ||
    pathname === "/unauthorized" ||
    pathname === "/session-expired" ||
    pathname === "/locked" ||
    pathname === "/verification-required" ||
    pathname?.startsWith("/auth");

  if (isInternalPortalOrAuth) {
    return (
      <footer id="site-footer" className="hidden" aria-hidden="true">
        <span>ServicePro OS Internal Enterprise System</span>
      </footer>
    );
  }

  // ALL Payments, Pricing, Checkout, Booking & Tracking pages get a TINY compact footer
  // and is completely HIDDEN on mobile screens (hidden md:block)
  const isPaymentOrCheckoutOrBooking =
    pathname === "/pricing" ||
    pathname === "/subscribe" ||
    pathname?.startsWith("/subscribe") ||
    pathname === "/subscription" ||
    pathname === "/pay" ||
    pathname?.startsWith("/pay") ||
    pathname === "/payment-success" ||
    pathname === "/payment-failed" ||
    pathname === "/book" ||
    pathname?.startsWith("/book") ||
    pathname === "/booking-success" ||
    pathname === "/booking-failed";

  if (isPaymentOrCheckoutOrBooking) {
    return (
      <footer
        id="site-footer"
        className="hidden md:block bg-[#070D18] border-t border-white/10 text-slate-400 text-xs py-3 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-emerald-400 font-semibold inline-flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              256-Bit SSL Encrypted
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-slate-300">PCI-DSS Compliant</span>
            <span className="text-slate-600">·</span>
            <span>© {new Date().getFullYear()} {businessConfig.businessName}. All rights reserved.</span>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-slate-400">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link href="/refund-policy" className="hover:text-white transition-colors">Refunds</Link>
            <Link href="/security" className="hover:text-white transition-colors">Security</Link>
          </div>
        </div>
      </footer>
    );
  }

  if (pathname === "/error") {
    return (
      <footer
        id="site-footer"
        className="hidden md:block bg-[#080E1A] border-t border-white/10 text-slate-400 text-xs py-4 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="text-rose-400 font-semibold">Incident ID: ERR-2026-8841</span>
            <span className="text-slate-600">·</span>
            <Link href="/status" className="hover:text-white transition-colors">System Status</Link>
          </div>
          <a href={phoneHref} className="text-orange-400 font-bold hover:text-orange-300 transition-colors">
            Emergency Dispatch: {businessConfig.phone}
          </a>
        </div>
      </footer>
    );
  }

  if (pathname === "/maintenance") {
    return (
      <footer
        id="site-footer"
        className="hidden md:block bg-[#080E1A] border-t border-white/10 text-slate-400 text-xs py-4 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="text-amber-400 font-semibold">System Status: Scheduled Maintenance</span>
          <a href={phoneHref} className="text-orange-400 font-bold hover:text-orange-300 transition-colors">
            Emergency Dispatch: {businessConfig.phone}
          </a>
        </div>
      </footer>
    );
  }

  if (pathname === "/offline") {
    return (
      <footer
        id="site-footer"
        className="hidden md:block bg-[#080E1A] border-t border-white/10 text-slate-400 text-xs py-4 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-amber-400 font-semibold">Offline Mode</span>
            <span className="text-slate-600">·</span>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="text-white hover:text-orange-400 font-semibold underline underline-offset-2 cursor-pointer transition-colors"
            >
              Retry Connection
            </button>
          </div>
          <a href={phoneHref} className="text-orange-400 font-bold hover:text-orange-300 transition-colors">
            Support: {businessConfig.phone}
          </a>
        </div>
      </footer>
    );
  }

  return (
    <footer
      id="site-footer"
      className="hidden md:flex relative bg-[#0B111E] overflow-hidden border-t border-b border-white/10 text-white select-none md:h-[300px] flex-col justify-center"
    >
      {/* Residential Home Photograph Background with Restrained Navy Gradient Overlay */}
      <div className="absolute right-0 top-0 bottom-0 w-full sm:w-7/12 opacity-30 sm:opacity-50 pointer-events-none">
        <img
          src="/images/final-cta-house.jpg"
          alt="Residential home and driveway in natural daylight"
          className="w-full h-full object-cover object-right"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B111E] via-[#0B111E]/90 to-transparent" />
      </div>

      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 relative z-10 flex flex-col justify-between h-full">
        {/* Top Row: Brand Logo + Tagline (Left) & Social Media Icons (Right) */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-3.5 border-b border-white/10">
          <Link href="/" className="flex items-center gap-3 group">
            <img
              src="/images/servicepro-icon-transparent.png?v=green"
              alt="ServicePro OS"
              className="h-8 w-auto object-contain group-hover:scale-105 transition-transform"
            />
            <div className="flex flex-col justify-center">
              <span className="text-base sm:text-lg font-bold tracking-tight text-white leading-tight">
                ServicePro <span className="text-[#F97316]">OS</span>
              </span>
              <span className="block italic font-normal tracking-normal leading-tight text-xs text-slate-300 mt-0.5 select-none">
                Your Home. Our Priority.
              </span>
            </div>
          </Link>

          {/* Social Media Icons */}
          <div className="flex items-center gap-2">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Follow ServicePro OS on Twitter"
              className="w-8 h-8 rounded-full border border-white/15 bg-white/5 hover:bg-[#F97316] hover:border-[#F97316] text-slate-300 hover:text-white flex items-center justify-center transition-all shadow-sm"
            >
              <Twitter className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Connect on LinkedIn"
              className="w-8 h-8 rounded-full border border-white/15 bg-white/5 hover:bg-[#F97316] hover:border-[#F97316] text-slate-300 hover:text-white flex items-center justify-center transition-all shadow-sm"
            >
              <Linkedin className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Follow on Facebook"
              className="w-8 h-8 rounded-full border border-white/15 bg-white/5 hover:bg-[#F97316] hover:border-[#F97316] text-slate-300 hover:text-white flex items-center justify-center transition-all shadow-sm"
            >
              <Facebook className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Follow on Instagram"
              className="w-8 h-8 rounded-full border border-white/15 bg-white/5 hover:bg-[#F97316] hover:border-[#F97316] text-slate-300 hover:text-white flex items-center justify-center transition-all shadow-sm"
            >
              <Instagram className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Watch on YouTube"
              className="w-8 h-8 rounded-full border border-white/15 bg-white/5 hover:bg-[#F97316] hover:border-[#F97316] text-slate-300 hover:text-white flex items-center justify-center transition-all shadow-sm"
            >
              <Youtube className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub Repository"
              className="w-8 h-8 rounded-full border border-white/15 bg-white/5 hover:bg-[#F97316] hover:border-[#F97316] text-slate-300 hover:text-white flex items-center justify-center transition-all shadow-sm"
            >
              <Github className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Middle Row: 4×4 Enterprise SaaS Footer Grid (Company, Support, Legal, Trust) */}
        <div className="py-3.5 grid grid-cols-2 md:grid-cols-4 gap-8 text-xs sm:text-[13px]">
          {/* Column 1: Company */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
              Company
            </span>
            <Link href="/about" className="text-slate-300 hover:text-[#F97316] transition-colors">
              About Us
            </Link>
            <Link href="/careers" className="text-slate-300 hover:text-[#F97316] transition-colors">
              Careers
            </Link>
            <Link href="/contact" className="text-slate-300 hover:text-[#F97316] transition-colors">
              Contact
            </Link>
            <Link href="/reviews" className="text-slate-300 hover:text-[#F97316] transition-colors">
              Reviews
            </Link>
          </div>

          {/* Column 2: Support */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
              Support
            </span>
            <Link href="/faq" className="text-slate-300 hover:text-[#F97316] transition-colors">
              Help Center
            </Link>
            <Link href="/account/support" className="text-slate-300 hover:text-[#F97316] transition-colors">
              Support Center
            </Link>
            <Link href="/services/emergency-hvac" className="text-slate-300 hover:text-[#F97316] transition-colors">
              Emergency Dispatch
            </Link>
            <Link href="/status" className="text-slate-300 hover:text-[#F97316] transition-colors">
              System Status
            </Link>
          </div>

          {/* Column 3: Legal */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
              Legal
            </span>
            <Link href="/privacy" className="text-slate-300 hover:text-[#F97316] transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-slate-300 hover:text-[#F97316] transition-colors">
              Terms of Service
            </Link>
            <Link href="/accessibility" className="text-slate-300 hover:text-[#F97316] transition-colors">
              Accessibility
            </Link>
            <Link href="/about#licenses" className="text-slate-300 hover:text-[#F97316] transition-colors">
              License Information
            </Link>
          </div>

          {/* Column 4: Trust */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
              Trust
            </span>
            <Link href="/security" className="text-slate-300 hover:text-[#F97316] transition-colors">
              Security
            </Link>
            <Link href="/refund-policy" className="text-slate-300 hover:text-[#F97316] transition-colors">
              Warranty
            </Link>
            <Link href="/security#compliance" className="text-slate-300 hover:text-[#F97316] transition-colors">
              Compliance
            </Link>
            <Link href="/about#insurance" className="text-slate-300 hover:text-[#F97316] transition-colors">
              Insurance
            </Link>
          </div>
        </div>

        {/* Bottom Copyright Line */}
        <div className="pt-3 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] sm:text-xs text-slate-400">
          <p>© 2026 ServicePro OS, Inc. All rights reserved.</p>
          <p>Empowering field service contractors with intelligent dispatch &amp; payment software.</p>
        </div>
      </div>
    </footer>
  );
}
