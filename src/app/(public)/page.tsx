/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Calendar,
  Truck,
  CreditCard,
  Smartphone,
  ShieldCheck,
  ArrowRight,
  Play,
  Check,
  CheckCircle2,
  Star,
  Menu,
  X,
  Zap,
  Snowflake,
  Wrench,
  ChevronRight,
  Flame,
  Paintbrush,
  Sparkles,
  Home,
  Twitter,
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
  Github,
  Maximize2,
  Volume2,
  Pause,
  TrendingUp,
  ExternalLink,
  ChevronLeft,
} from "lucide-react";
import { BookingWizard } from "@/components/booking/BookingWizard";
import { BrandTagline } from "@/components/brand/BrandTagline";

// Application Process Action Steps (Using real app UI screenshots & workflows)
const appActionSteps = [
  {
    step: 1,
    shortTitle: "1. Intake Booking",
    shortRole: "Customer",
    role: "Customer Self-Service",
    route: "servicepro-os.com/book",
    tagline: "Instant 60-Second Customer Online Intake Wizard",
    description: "Homeowners select their exact issue (HVAC, Plumbing, Electrical), enter their ZIP code for automatic service area validation, pick an available morning/afternoon appointment slot, upload diagnostic photos, and pay secure credit card deposits 24/7 without waiting on hold.",
    image: "/images/app-action-1-booking.png",
    highlights: [
      "Zero phone hold times — instant 60s customer booking",
      "Automatic ZIP code coverage check & travel surcharge",
      "Diagnostic photo upload before technician dispatch",
      "Integrated Stripe card hold prevents no-shows",
    ],
  },
  {
    step: 2,
    shortTitle: "2. Smart Dispatch",
    shortRole: "Dispatcher",
    role: "Dispatcher Command Center",
    route: "servicepro-os.com/admin/dispatch",
    tagline: "AI-Powered Proximity & Skill Certification Matching",
    description: "Dispatchers get a live interactive scheduling board and GPS fleet map. When a booking arrives, ServicePro OS calculates real-time traffic, travel distance, and technician trade certifications to recommend the optimal 92%+ match technician instantly.",
    image: "/images/app-action-2-dispatch.png",
    highlights: [
      "Real-time technician GPS tracking & live status",
      "Skill & trade certification auto-assignment match",
      "Drag-and-drop schedule rebalancing for emergency calls",
      "Automated customer SMS with live ETA updates",
    ],
  },
  {
    step: 3,
    shortTitle: "3. Mobile Field App",
    shortRole: "Technician",
    role: "Technician Mobile View",
    route: "servicepro-os.com/tech/jobs",
    tagline: "Digital Safety Checklists, Parts Logging & Work Proof",
    description: "Field technicians access their mobile PWA on iOS or Android. They get turn-by-turn driving directions, customer service history, interactive safety check-off lists, barcode parts inventory deduction, and instant on-site before/after photo documentation.",
    image: "/images/app-action-3-job-execution.png",
    highlights: [
      "100% offline support for basements & rural areas",
      "Interactive multi-point equipment inspection checklists",
      "Live truck parts inventory logging & cost deduction",
      "Customer on-glass digital signature capture",
    ],
  },
  {
    step: 4,
    shortTitle: "4. Tap-To-Pay Invoice",
    shortRole: "Accounting",
    role: "Accounting & Ledger",
    route: "servicepro-os.com/admin/invoices",
    tagline: "Itemized Billing, Contactless Tap-to-Pay & Stripe Payouts",
    description: "When the job checklist is signed, an itemized invoice is generated automatically with applied coupon discounts, labor hours, and parts used. Customers pay on-site via credit card, Apple Pay, or SMS payment link, with receipts sent via email/SMS and same-day payout.",
    image: "/images/app-action-4-invoices.png",
    highlights: [
      "One-tap credit card, Apple Pay, Google Pay & ACH checkout",
      "Automated promo code & warranty discount calculations",
      "Instant PDF & SMS receipt delivery to homeowner",
      "Zero manual paperwork or end-of-day invoice entry",
    ],
  },
  {
    step: 5,
    shortTitle: "5. Executive Cockpit",
    shortRole: "Owner",
    role: "Owner & Operations",
    route: "servicepro-os.com/admin",
    tagline: "Live Revenue Tracking, Fleet Analytics & Automated Reviews",
    description: "Business owners monitor daily gross revenue, technician billable utilization rates, completed jobs, inventory replenishment alerts, and automated 5-star Google reviews from a single unified cockpit.",
    image: "/images/app-action-admin-dashboard.png",
    highlights: [
      "Real-time financial metrics: revenue, margins & cash collected",
      "Technician leaderboard and first-time fix rate rankings",
      "Automated post-job 5-star review request sequences",
      "Complete audit logs & enterprise permission controls",
    ],
  },
];

export default function ServiceProLandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [trialModalOpen, setTrialModalOpen] = useState(false);
  const [selectedWorkflowService, setSelectedWorkflowService] = useState<"hvac" | "plumbing" | "electrical">("hvac");

  // Mini Window Interactive Screen State
  const [activeDemoTab, setActiveDemoTab] = useState<"actions" | "video" | "beforeAfter" | "results">("actions");
  const [activeActionStep, setActiveActionStep] = useState(0);
  const [activeVideoChapter, setActiveVideoChapter] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  // Close modals & menus on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setMobileMenuOpen(false);
        setDemoModalOpen(false);
        setTrialModalOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Lock body scroll when mobile menu, demo modal or trial modal is open
  useEffect(() => {
    if (mobileMenuOpen || demoModalOpen || trialModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen, demoModalOpen, trialModalOpen]);


  return (
    <div className="min-h-screen bg-[#060B14] font-sans text-white antialiased selection:bg-[#F97316] selection:text-white">
      
      {/* ─────────────────────────────────────────────────────────────
          1. MAIN NAVIGATION (Glassmorphism Navbar)
      ───────────────────────────────────────────────────────────── */}
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

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#industries" className="hover:text-white transition-colors">Industries</a>
            <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
            <Link href="/faq" className="hover:text-white transition-colors">Resources</Link>
            <Link href="/about" className="hover:text-white transition-colors">About</Link>
          </nav>

          {/* Right Action Button: Sign In Only (Medium Size) */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              href="/login"
              className="px-6 py-2.5 rounded-full border border-white/25 bg-white/10 text-white hover:bg-[#F97316] hover:border-[#F97316] text-sm sm:text-base font-semibold transition-all backdrop-blur-md shadow-sm hover:shadow-[#F97316]/25 hover:scale-[1.02] active:scale-95"
            >
              Sign In
            </Link>
          </div>

          {/* Accessible Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/60 focus:outline-none focus:ring-2 focus:ring-[#F97316] cursor-pointer"
            aria-label="Toggle mobile menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────
          MOBILE SLIDE-OUT DRAWER & FULL-SCREEN BACKDROP
          (Rendered outside <header> so backdrop-filter does NOT constrain fixed position)
      ───────────────────────────────────────────────────────────── */}
      {mobileMenuOpen && (
        <>
          {/* Full Screen Dim Backdrop */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[99] md:hidden animate-in fade-in duration-200"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Right-Side Drawer Panel: Solid Background, Full Screen Height, Top Z-Index */}
          <nav
            id="mobile-nav"
            className="fixed inset-y-0 right-0 w-[300px] max-w-[85vw] h-full h-[100dvh] bg-[#0C1523] border-l border-white/15 z-[100] p-6 flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-250 md:hidden overflow-y-auto"
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
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 -mr-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-[#F97316] cursor-pointer"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links */}
              <div className="py-6 space-y-1.5">
                <a
                  href="#features"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-base font-medium text-slate-200 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <span>Features</span>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </a>
                <a
                  href="#industries"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-base font-medium text-slate-200 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <span>Industries</span>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </a>
                <Link
                  href="/pricing"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-base font-medium text-slate-200 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <span>Pricing</span>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </Link>
                <Link
                  href="/faq"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-base font-medium text-slate-200 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <span>Resources</span>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </Link>
                <Link
                  href="/about"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-base font-medium text-slate-200 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <span>About</span>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </Link>
              </div>
            </div>

            {/* Bottom Action Buttons: Primary & Secondary */}
            <div className="pt-5 border-t border-white/10 flex flex-col gap-3 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setTrialModalOpen(true);
                }}
                className="w-full text-center py-3 rounded-full bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold text-sm shadow-lg shadow-[#F97316]/30 transition-all cursor-pointer"
              >
                Start Free Trial
              </button>
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-full border border-white/20 bg-white/10 text-white font-semibold text-sm hover:bg-white/20 transition-all shadow-sm"
              >
                Sign In
              </Link>
            </div>
          </nav>
        </>
      )}

      {/* ─────────────────────────────────────────────────────────────
          2. HERO SECTION (100% MATCH WITH HALF-SIDE SHADOW SCREENING)
      ───────────────────────────────────────────────────────────── */}
      <section className="relative bg-[#0C1523] text-white pt-8 pb-12 lg:pt-14 lg:pb-16 border-b border-white/10 overflow-hidden">
        
        {/* Right-Side Full-Bleed Photographic Background with Half-Side Shadow Screening */}
        <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-[58%] xl:w-[62%] pointer-events-none z-0">
          <img
            src="/images/servicepro-hero-final.jpg"
            alt="ServicePro OS field technician dispatch dashboard and mobile app"
            className="w-full h-full object-cover object-left-center"
          />
          {/* Half-Side Shadow Screening: Fades from solid #0C1523 on left into the photo */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0C1523] via-[#0C1523]/80 via-20% to-transparent" />
        </div>

        {/* Ambient Subtle Radial Glow */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#F97316]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Eyebrow, Heading, Description, CTAs, Guarantees */}
            <div className="lg:col-span-6 z-20">
              
              {/* Eyebrow Label */}
              <span className="text-[#F97316] font-bold text-xs uppercase tracking-wider block mb-3.5">
                FIELD SERVICE MANAGEMENT &amp; DISPATCH
              </span>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold text-white tracking-tight leading-[1.08]">
                The operating system<br />
                for <span className="text-[#F97316]">field service.</span>
              </h1>

              {/* Supporting Headline */}
              <p className="text-lg sm:text-xl font-semibold text-slate-100 mt-4 sm:mt-5">
                Book it. Dispatch it. Invoice it. All in one place.
              </p>

              {/* Description */}
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed mt-2.5 max-w-lg">
                ServicePro OS helps HVAC, plumbing and electrical companies run smoother, serve customers better and grow faster — with one powerful, easy-to-use platform.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 mt-8">
                <button
                  onClick={() => setTrialModalOpen(true)}
                  className="bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold px-6 py-3.5 rounded-lg text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-[#F97316]/30 hover:shadow-[#F97316]/50 transition-all cursor-pointer group"
                >
                  <span>Start Free Trial</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>

                {/* Secondary CTA: Glassmorphism Watch Demo */}
                <button
                  onClick={() => {
                    setActiveDemoTab("actions");
                    setDemoModalOpen(true);
                  }}
                  className="border border-white/20 bg-white/5 hover:bg-white/10 text-white font-medium px-5 py-3.5 rounded-lg text-sm sm:text-base flex items-center justify-center gap-2.5 backdrop-blur-md transition-all cursor-pointer shadow-sm hover:border-white/30"
                >
                  <Play className="w-4 h-4 fill-white text-white" />
                  <span>Watch Demo</span>
                </button>
              </div>

              {/* Supporting Points */}
              <div className="flex flex-wrap items-center gap-5 sm:gap-6 mt-7 text-xs sm:text-sm text-slate-300">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#F97316] flex-shrink-0" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#F97316] flex-shrink-0" />
                  <span>Setup in minutes</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#F97316] flex-shrink-0" />
                  <span>White-label ready</span>
                </div>
              </div>
            </div>

            {/* Mobile-Only Image Display (Clean, High-Res, Full-Width below text) */}
            <div className="lg:hidden mt-6 w-full rounded-xl overflow-hidden shadow-2xl border border-white/10">
              <img
                src="/images/servicepro-hero-final.jpg"
                alt="ServicePro OS field technician dispatch dashboard and mobile app"
                className="w-full h-auto object-cover"
              />
            </div>

          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. FIVE-FEATURE STRIP (Circular Icons with Thin Dividers)
      ───────────────────────────────────────────────────────────── */}
      <section id="features" className="bg-[#09111E] border-b border-white/10 py-10 lg:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-0 lg:divide-x lg:divide-white/10">
            
            {/* Feature 1: Online Booking */}
            <div className="flex flex-col items-start lg:px-6 first:lg:pl-0 group">
              <div className="w-12 h-12 rounded-full border border-orange-500/30 bg-orange-500/10 flex items-center justify-center text-[#F97316] mb-4 group-hover:border-[#F97316] group-hover:bg-[#F97316] group-hover:text-slate-950 transition-all shadow-md shadow-orange-500/10">
                <Calendar className="w-5 h-5 stroke-[1.8]" />
              </div>
              <h3 className="text-base font-bold text-white mb-1.5">Online Booking</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Let customers book 24/7 with a simple, 7-step wizard.
              </p>
            </div>

            {/* Feature 2: Smart Dispatch */}
            <div className="flex flex-col items-start lg:px-6 group">
              <div className="w-12 h-12 rounded-full border border-orange-500/30 bg-orange-500/10 flex items-center justify-center text-[#F97316] mb-4 group-hover:border-[#F97316] group-hover:bg-[#F97316] group-hover:text-slate-950 transition-all shadow-md shadow-orange-500/10">
                <Truck className="w-5 h-5 stroke-[1.8]" />
              </div>
              <h3 className="text-base font-bold text-white mb-1.5">Smart Dispatch</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                AI-powered technician assignment and live tracking.
              </p>
            </div>

            {/* Feature 3: Invoicing & Payments */}
            <div className="flex flex-col items-start lg:px-6 group">
              <div className="w-12 h-12 rounded-full border border-orange-500/30 bg-orange-500/10 flex items-center justify-center text-[#F97316] mb-4 group-hover:border-[#F97316] group-hover:bg-[#F97316] group-hover:text-slate-950 transition-all shadow-md shadow-orange-500/10">
                <CreditCard className="w-5 h-5 stroke-[1.8]" />
              </div>
              <h3 className="text-base font-bold text-white mb-1.5">Invoicing &amp; Payments</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Automated invoices, multiple payment options, and tax handling.
              </p>
            </div>

            {/* Feature 4: Technician PWA */}
            <div className="flex flex-col items-start lg:px-6 group">
              <div className="w-12 h-12 rounded-full border border-orange-500/30 bg-orange-500/10 flex items-center justify-center text-[#F97316] mb-4 group-hover:border-[#F97316] group-hover:bg-[#F97316] group-hover:text-slate-950 transition-all shadow-md shadow-orange-500/10">
                <Smartphone className="w-5 h-5 stroke-[1.8]" />
              </div>
              <h3 className="text-base font-bold text-white mb-1.5">Technician PWA</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Mobile-first job flow with GPS, photos and digital signatures.
              </p>
            </div>

            {/* Feature 5: Secure & Compliant */}
            <div className="flex flex-col items-start lg:px-6 last:lg:pr-0 group">
              <div className="w-12 h-12 rounded-full border border-emerald-500/30 bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-4 group-hover:border-emerald-400 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all shadow-md shadow-emerald-500/10">
                <ShieldCheck className="w-5 h-5 stroke-[1.8]" />
              </div>
              <h3 className="text-base font-bold text-white mb-1.5">Secure &amp; Compliant</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Built with enterprise-grade security and full audit logs.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. FOUR-STEP WORKFLOW SECTION: "From first click to final payment."
      ───────────────────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-16 lg:py-20 bg-[#060B14] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            
            {/* Left Column: Heading & Description */}
            <div className="lg:col-span-4">
              <span className="text-[#F97316] font-bold text-xs uppercase tracking-wider block mb-2.5">
                HOW IT WORKS
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                From first click<br />
                to final payment.
              </h2>
              <p className="text-slate-400 text-sm sm:text-base mt-4 leading-relaxed">
                ServicePro OS simplifies every step of the field service process — so you can focus on what matters most: your customers.
              </p>
              <button
                onClick={() => {
                  setActiveDemoTab("actions");
                  setDemoModalOpen(true);
                }}
                className="mt-6 inline-flex items-center gap-2 bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold text-sm px-6 py-3 rounded-lg shadow-md shadow-[#F97316]/25 hover:shadow-[#F97316]/40 transition-all cursor-pointer"
              >
                <span>See It In Action</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Right Column: 4 Connected Stage Cards with Subtle Right Arrows */}
            <div className="lg:col-span-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 items-start relative">
                
                {/* STEP 1: 1. Book */}
                <div className="flex flex-col items-start relative group">
                  {/* Subtle right connecting arrow for desktop */}
                  <div className="hidden xl:block absolute -right-3.5 top-24 -translate-y-1/2 text-slate-600 z-10 pointer-events-none">
                    <ArrowRight className="w-4 h-4" />
                  </div>

                  {/* Smartphone Mockup */}
                  <div className="w-full max-w-[175px] mx-auto bg-[#0F172A] rounded-[26px] border-[4px] border-slate-700 shadow-xl shadow-black/40 overflow-hidden p-2.5 pt-1.5 h-[205px] flex flex-col justify-between select-none">
                    {/* Notch / Speaker */}
                    <div className="w-14 h-2 bg-slate-950 rounded-b-md mx-auto mb-1.5 flex items-center justify-center">
                      <div className="w-4 h-0.5 bg-slate-700 rounded-full" />
                    </div>

                    {/* Phone App Header */}
                    <div className="flex items-center justify-between pb-1.5 mb-1 border-b border-white/10">
                      <div className="flex items-center gap-1">
                        <div className="w-3.5 h-3.5 rounded bg-[#F97316] flex items-center justify-center text-[7px] text-white font-bold">
                          <Flame className="w-2.5 h-2.5 text-white" />
                        </div>
                        <span className="text-[9px] font-bold text-white">ServicePro OS</span>
                      </div>
                      <div className="text-[7px] text-slate-400">9:41</div>
                    </div>

                    <div className="text-[9px] font-semibold text-slate-200 mb-1">Select Service</div>

                    {/* Interactive Service Options */}
                    <div className="space-y-1 flex-1">
                      <button
                        onClick={() => setSelectedWorkflowService("hvac")}
                        className={`w-full text-left text-[9px] px-2 py-1.5 rounded-md flex items-center justify-between border transition-all ${
                          selectedWorkflowService === "hvac"
                            ? "border-[#F97316] bg-orange-500/20 text-white font-semibold shadow-xs"
                            : "border-white/10 bg-slate-900/80 text-slate-300 hover:border-white/20"
                        }`}
                      >
                        <span className="flex items-center gap-1.5 truncate">
                          <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[8px] shrink-0">
                            <Snowflake className="w-2.5 h-2.5" />
                          </span>
                          <span className="truncate">HVAC Service</span>
                        </span>
                        <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
                      </button>

                      <button
                        onClick={() => setSelectedWorkflowService("plumbing")}
                        className={`w-full text-left text-[9px] px-2 py-1.5 rounded-md flex items-center justify-between border transition-all ${
                          selectedWorkflowService === "plumbing"
                            ? "border-[#F97316] bg-orange-500/20 text-white font-semibold shadow-xs"
                            : "border-white/10 bg-slate-900/80 text-slate-300 hover:border-white/20"
                        }`}
                      >
                        <span className="flex items-center gap-1.5 truncate">
                          <span className="w-4 h-4 rounded-full bg-sky-500 text-white flex items-center justify-center text-[8px] shrink-0">
                            <Wrench className="w-2.5 h-2.5" />
                          </span>
                          <span className="truncate">Plumbing Service</span>
                        </span>
                        <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
                      </button>

                      <button
                        onClick={() => setSelectedWorkflowService("electrical")}
                        className={`w-full text-left text-[9px] px-2 py-1.5 rounded-md flex items-center justify-between border transition-all ${
                          selectedWorkflowService === "electrical"
                            ? "border-[#F97316] bg-orange-500/20 text-white font-semibold shadow-xs"
                            : "border-white/10 bg-slate-900/80 text-slate-300 hover:border-white/20"
                        }`}
                      >
                        <span className="flex items-center gap-1.5 truncate">
                          <span className="w-4 h-4 rounded-full bg-[#F97316] text-white flex items-center justify-center text-[8px] shrink-0">
                            <Zap className="w-2.5 h-2.5" />
                          </span>
                          <span className="truncate">Electrical Service</span>
                        </span>
                        <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
                      </button>
                    </div>
                  </div>

                  {/* Step 1 Text */}
                  <div className="mt-3.5">
                    <h3 className="text-sm font-bold text-white">1. Book</h3>
                    <p className="text-xs text-slate-400 mt-1 leading-snug">
                      Customer selects a service, zip code and preferred time.
                    </p>
                  </div>
                </div>

                {/* STEP 2: 2. Dispatch */}
                <div className="flex flex-col items-start relative group">
                  {/* Subtle right connecting arrow for desktop */}
                  <div className="hidden xl:block absolute -right-3.5 top-24 -translate-y-1/2 text-slate-600 z-10 pointer-events-none">
                    <ArrowRight className="w-4 h-4" />
                  </div>

                  {/* Optimal Technician Card */}
                  <div className="w-full max-w-[175px] mx-auto bg-[#0F172A] rounded-2xl border border-white/10 shadow-xl shadow-black/40 p-3.5 h-[205px] flex flex-col justify-between">
                    <div>
                      <div className="text-[10px] font-semibold text-slate-300 mb-2">Optimal Technician</div>
                      <div className="flex items-center gap-2 mb-2.5">
                        <img
                          src="/images/avatar-mike.jpg"
                          alt="John D."
                          className="w-7 h-7 rounded-full object-cover shadow-xs border border-white/20"
                        />
                        <div>
                          <div className="text-[11px] font-bold text-white leading-tight">John D.</div>
                          <div className="text-[9px] font-semibold text-emerald-400">92% match</div>
                        </div>
                      </div>

                      <div className="space-y-1.5 text-[10px] text-slate-300">
                        <div className="flex items-center gap-1.5">
                          <span className="w-3.5 h-3.5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-[8px] font-bold">✓</span>
                          <span>Skills match</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="w-3.5 h-3.5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[8px] font-bold">✓</span>
                          <span>In coverage area</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="w-3.5 h-3.5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[8px] font-bold">✓</span>
                          <span>Available now</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="w-3.5 h-3.5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[8px] font-bold">✓</span>
                          <span>Low travel time</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Step 2 Text */}
                  <div className="mt-3.5">
                    <h3 className="text-sm font-bold text-white">2. Dispatch</h3>
                    <p className="text-xs text-slate-400 mt-1 leading-snug">
                      Our engine finds the best technician in seconds.
                    </p>
                  </div>
                </div>

                {/* STEP 3: 3. Complete */}
                <div className="flex flex-col items-start relative group">
                  {/* Subtle right connecting arrow for desktop */}
                  <div className="hidden xl:block absolute -right-3.5 top-24 -translate-y-1/2 text-slate-600 z-10 pointer-events-none">
                    <ArrowRight className="w-4 h-4" />
                  </div>

                  {/* Technician Mobile App Action Checklist Card */}
                  <div className="w-full max-w-[175px] mx-auto bg-[#0F172A] rounded-2xl border border-white/10 shadow-xl shadow-black/40 p-3 h-[205px] flex flex-col justify-between text-left">
                    <div>
                      <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-white/10">
                        <span className="text-[10px] font-bold text-white">Tech Field App</span>
                        <span className="text-[8px] bg-emerald-500/20 text-emerald-400 font-bold px-1.5 py-0.5 rounded">
                          In Progress
                        </span>
                      </div>
                      <div className="text-[10px] font-bold text-slate-200 mb-1.5 truncate">
                        Job #JOB-101: AC Service
                      </div>

                      <div className="space-y-1.5 text-[9px] text-slate-300">
                        <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                          <span className="truncate">Safety lock-out checked</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                          <span className="truncate">Capacitor replaced</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                          <span className="truncate">Proof photos uploaded</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[9px]">
                      <span className="text-slate-400 font-medium">Customer Sign</span>
                      <span className="text-emerald-400 font-bold">Signed ✓</span>
                    </div>
                  </div>

                  {/* Step 3 Text */}
                  <div className="mt-3.5">
                    <h3 className="text-sm font-bold text-white">3. Complete</h3>
                    <p className="text-xs text-slate-400 mt-1 leading-snug">
                      Tech arrives, does the work, adds photos and parts.
                    </p>
                  </div>
                </div>

                {/* STEP 4: 4. Get Paid */}
                <div className="flex flex-col items-start">
                  {/* Payment Received Card */}
                  <div className="w-full max-w-[175px] mx-auto bg-[#0F172A] rounded-2xl border border-white/10 shadow-xl shadow-black/40 p-3.5 h-[205px] flex flex-col justify-between text-center">
                    <div>
                      <div className="w-8 h-8 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center mx-auto mb-1.5 shadow-md shadow-emerald-500/20">
                        <Check className="w-4 h-4 stroke-[2.5]" />
                      </div>
                      <div className="text-[10px] text-slate-300 font-medium">Payment Received</div>
                      <div className="text-xl font-black text-white my-1">$248.00</div>
                      <Link
                        href="/admin/invoices"
                        className="text-[10px] text-[#F97316] font-semibold hover:underline cursor-pointer"
                      >
                        View Invoice
                      </Link>
                    </div>

                    <div className="pt-2 border-t border-white/10 flex items-center justify-center gap-1 text-[9px] text-slate-400">
                      <CreditCard className="w-3 h-3 text-orange-400" />
                      <span>Paid with card •••• 4242</span>
                    </div>
                  </div>

                  {/* Step 4 Text */}
                  <div className="mt-3.5">
                    <h3 className="text-sm font-bold text-white">4. Get Paid</h3>
                    <p className="text-xs text-slate-400 mt-1 leading-snug">
                      Secure payments, automatic invoicing, happy customers.
                    </p>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          5. INDUSTRY SOLUTIONS: "Trusted by service companies across multiple trades."
      ───────────────────────────────────────────────────────────── */}
      <section id="industries" className="py-16 lg:py-20 bg-[#09111E] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-start">
            
            {/* Left Column: Heading & Description */}
            <div className="lg:col-span-4 lg:self-start lg:sticky lg:top-28">
              <span className="text-[#F97316] font-bold text-xs uppercase tracking-wider block mb-2.5">
                BUILT FOR REAL BUSINESSES
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                Trusted by service companies<br />across multiple trades.
              </h2>
              <p className="text-slate-400 text-sm sm:text-base mt-4 leading-relaxed">
                Whether you&apos;re a 2-person team or a 20-person operation, ServicePro OS scales with your business.
              </p>

              <div className="mt-8 space-y-3.5 hidden lg:block">
                <div className="flex items-center gap-3 text-xs text-slate-200 font-semibold">
                  <span className="w-5 h-5 rounded-full bg-orange-500/20 text-[#F97316] flex items-center justify-center text-xs font-bold shrink-0">✓</span>
                  <span>Custom job workflows for every trade</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-200 font-semibold">
                  <span className="w-5 h-5 rounded-full bg-orange-500/20 text-[#F97316] flex items-center justify-center text-xs font-bold shrink-0">✓</span>
                  <span>Automated dispatch &amp; live mobile tracking</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-200 font-semibold">
                  <span className="w-5 h-5 rounded-full bg-orange-500/20 text-[#F97316] flex items-center justify-center text-xs font-bold shrink-0">✓</span>
                  <span>Instant digital invoicing &amp; card processing</span>
                </div>
              </div>
            </div>

            {/* Right Column: 6 Trade Cards Grid */}
            <div className="lg:col-span-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                
                {/* Card 1: HVAC */}
                <div className="bg-[#0F172A] rounded-2xl border border-white/10 overflow-hidden shadow-lg hover:border-orange-500/40 transition-all group">
                  <div className="aspect-[16/10] overflow-hidden bg-slate-900">
                    <img
                      src="/images/user-tech-roof.png"
                      alt="HVAC technician inspecting equipment on site"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-3.5 xl:p-4 flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full border border-orange-500/50 bg-orange-500/15 text-[#F97316] flex items-center justify-center shrink-0">
                      <Snowflake className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base font-bold text-white">HVAC</h3>
                      <p className="text-[11px] text-slate-400 font-medium leading-tight mt-0.5 truncate">
                        Repairs · Maintenance · Installs
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card 2: Plumbing */}
                <div className="bg-[#0F172A] rounded-2xl border border-white/10 overflow-hidden shadow-lg hover:border-orange-500/40 transition-all group">
                  <div className="aspect-[16/10] overflow-hidden bg-slate-900">
                    <img
                      src="/images/user-tech-siding.png"
                      alt="Plumber performing repairs on site"
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-3.5 xl:p-4 flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full border border-orange-500/50 bg-orange-500/15 text-[#F97316] flex items-center justify-center shrink-0">
                      <Wrench className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base font-bold text-white">Plumbing</h3>
                      <p className="text-[11px] text-slate-400 font-medium leading-tight mt-0.5 truncate">
                        Repairs · Drain Cleaning · Installs
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card 3: Electrical */}
                <div className="bg-[#0F172A] rounded-2xl border border-white/10 overflow-hidden shadow-lg hover:border-orange-500/40 transition-all group">
                  <div className="aspect-[16/10] overflow-hidden bg-slate-900">
                    <img
                      src="/images/user-tech-inspect.png"
                      alt="Electrician diagnosing circuit"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-3.5 xl:p-4 flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full border border-orange-500/50 bg-orange-500/15 text-[#F97316] flex items-center justify-center shrink-0">
                      <Zap className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base font-bold text-white">Electrical</h3>
                      <p className="text-[11px] text-slate-400 font-medium leading-tight mt-0.5 truncate">
                        Repairs · Upgrades · Panels
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card 4: Painting */}
                <div className="bg-[#0F172A] rounded-2xl border border-white/10 overflow-hidden shadow-lg hover:border-orange-500/40 transition-all group">
                  <div className="aspect-[16/10] overflow-hidden bg-slate-900">
                    <img
                      src="/images/trade-painting-clean.jpg"
                      alt="Professional painting technician"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-3.5 xl:p-4 flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full border border-orange-500/50 bg-orange-500/15 text-[#F97316] flex items-center justify-center shrink-0">
                      <Paintbrush className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base font-bold text-white">Painting</h3>
                      <p className="text-[11px] text-slate-400 font-medium leading-tight mt-0.5 truncate">
                        Interior · Exterior · Touch-Ups
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card 5: Roofing */}
                <div className="bg-[#0F172A] rounded-2xl border border-white/10 overflow-hidden shadow-lg hover:border-orange-500/40 transition-all group">
                  <div className="aspect-[16/10] overflow-hidden bg-slate-900">
                    <img
                      src="/images/trade-roofing-clean.jpg"
                      alt="Roofing contractor repairing roof shingles"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-3.5 xl:p-4 flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full border border-orange-500/50 bg-orange-500/15 text-[#F97316] flex items-center justify-center shrink-0">
                      <Home className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base font-bold text-white">Roofing</h3>
                      <p className="text-[11px] text-slate-400 font-medium leading-tight mt-0.5 truncate">
                        Repairs · Shingles · Gutters
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card 6: Cleaning */}
                <div className="bg-[#0F172A] rounded-2xl border border-white/10 overflow-hidden shadow-lg hover:border-orange-500/40 transition-all group">
                  <div className="aspect-[16/10] overflow-hidden bg-slate-900">
                    <img
                      src="/images/trade-cleaning-clean.jpg"
                      alt="Professional cleaning technician"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-3.5 xl:p-4 flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full border border-orange-500/50 bg-orange-500/15 text-[#F97316] flex items-center justify-center shrink-0">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base font-bold text-white">Cleaning</h3>
                      <p className="text-[10.5px] xl:text-[11px] text-slate-400 font-medium leading-tight mt-0.5 truncate">
                        Deep Clean · Move-In/Out · Office
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          6. RESULTS AND BUSINESS BENEFITS BAND ("Proven results for growing businesses.")
      ───────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-10 lg:my-14">
        <div className="bg-[#0C1523] rounded-2xl sm:rounded-3xl p-8 sm:p-10 lg:p-12 text-white shadow-2xl border border-white/10 relative overflow-hidden">
          
          {/* Subtle Ambient Glow Inside Dark Banner */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#F97316]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            
            {/* Left Description */}
            <div className="lg:col-span-5">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                Proven results<br />
                for growing businesses.
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm mt-3 leading-relaxed max-w-sm">
                ServicePro OS helps you save time, get more jobs and increase revenue — all with one platform.
              </p>
            </div>

            {/* Right 4 Metrics with Subtle Separators between all stat columns */}
            <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-800 pt-6 lg:pt-0 border-t lg:border-t-0 lg:border-l border-slate-800 lg:pl-6">
              
              <div className="sm:px-4 first:sm:pl-0">
                <div className="text-3xl sm:text-4xl font-extrabold text-[#F97316]">50%</div>
                <p className="text-xs text-slate-300 mt-1 leading-snug">
                  Less time on administrative work
                </p>
              </div>

              <div className="sm:px-4">
                <div className="text-3xl sm:text-4xl font-extrabold text-[#F97316]">30%</div>
                <p className="text-xs text-slate-300 mt-1 leading-snug">
                  More jobs per technician
                </p>
              </div>

              <div className="sm:px-4">
                <div className="text-3xl sm:text-4xl font-extrabold text-[#F97316]">20%</div>
                <p className="text-xs text-slate-300 mt-1 leading-snug">
                  Increase in revenue
                </p>
              </div>

              <div className="sm:px-4 last:sm:pr-0">
                <div className="text-3xl sm:text-4xl font-extrabold text-[#F97316]">99.9%</div>
                <p className="text-xs text-slate-300 mt-1 leading-snug">
                  System uptime
                </p>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          7. CUSTOMER TESTIMONIALS (Horizontal Card Layout Matching Dark Theme)
      ───────────────────────────────────────────────────────────── */}
      <section id="testimonials" className="py-20 bg-[#060B14] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div>
            <span className="text-[#F97316] font-bold text-xs uppercase tracking-wider block mb-2">
              WHAT OUR CUSTOMERS SAY
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Real businesses. Real results.
            </h2>
          </div>

          {/* 3 Testimonial Cards: Avatar on Left, Quote & Info on Right */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            
            {/* Card 1: Mike Thompson */}
            <div className="bg-[#0F172A] rounded-2xl border border-white/10 p-6 shadow-xl hover:border-orange-500/30 transition-all flex items-start gap-4">
              <img
                src="/images/testimonial-mike.jpg"
                alt="Mike Thompson portrait"
                className="w-12 h-12 rounded-full object-cover flex-shrink-0 border border-white/20 mt-1"
              />
              <div className="flex-1">
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-3">
                  &ldquo;ServicePro OS has completely changed how we run our business. The dispatch and booking system is a game changer.&rdquo;
                </p>
                <h4 className="text-sm font-bold text-white">Mike Thompson</h4>
                <p className="text-xs text-slate-400">Owner, Thompson HVAC</p>
                <div className="flex items-center text-[#F97316] gap-0.5 mt-1.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#F97316]" />
                  ))}
                </div>
              </div>
            </div>

            {/* Card 2: Sarah Lopez */}
            <div className="bg-[#0F172A] rounded-2xl border border-white/10 p-6 shadow-xl hover:border-orange-500/30 transition-all flex items-start gap-4">
              <img
                src="/images/testimonial-sarah.jpg"
                alt="Sarah Lopez portrait"
                className="w-12 h-12 rounded-full object-cover flex-shrink-0 border border-white/20 mt-1"
              />
              <div className="flex-1">
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-3">
                  &ldquo;The technician app is simple and powerful. Our team loves it, and our customers love the real-time updates.&rdquo;
                </p>
                <h4 className="text-sm font-bold text-white">Sarah Lopez</h4>
                <p className="text-xs text-slate-400">Owner, Lopez Plumbing</p>
                <div className="flex items-center text-[#F97316] gap-0.5 mt-1.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#F97316]" />
                  ))}
                </div>
              </div>
            </div>

            {/* Card 3: Service Client H */}
            <div className="bg-[#0F172A] rounded-2xl border border-white/10 p-6 shadow-xl hover:border-orange-500/30 transition-all flex items-start gap-4">
              <img
                src="/images/testimonial-david.jpg"
                alt="Service Client H portrait"
                className="w-12 h-12 rounded-full object-cover flex-shrink-0 border border-white/20 mt-1"
              />
              <div className="flex-1">
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-3">
                  &ldquo;We went from chaos to control. Everything is in one place — jobs, customers, payments, reports. Highly recommend!&rdquo;
                </p>
                <h4 className="text-sm font-bold text-white">Service Client H</h4>
                <p className="text-xs text-slate-400">Owner, Kim Electrical</p>
                <div className="flex items-center text-[#F97316] gap-0.5 mt-1.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#F97316]" />
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          8. FINAL CALL-TO-ACTION SECTION (WITH RESIDENTIAL HOME BACKGROUND)
      ───────────────────────────────────────────────────────────── */}
      <section className="relative bg-[#0B111E] overflow-hidden border-t border-white/10">
        {/* Residential Home Photograph Background with Restrained Navy Gradient Overlay */}
        <div className="absolute right-0 top-0 bottom-0 w-full sm:w-7/12 opacity-40 sm:opacity-90 pointer-events-none">
          <img
            src="/images/final-cta-house.jpg"
            alt="Residential home and driveway in natural daylight"
            className="w-full h-full object-cover object-right"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B111E] via-[#0B111E]/80 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 relative z-10">
          <div className="max-w-2xl">
            <span className="text-[#F97316] font-bold text-xs uppercase tracking-wider block mb-1.5">
              GET STARTED TODAY
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-tight">
              Ready to streamline your field service business?
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm mt-1.5 leading-relaxed">
              Join hundreds of service companies already using ServicePro OS.
            </p>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          9. ENTERPRISE 4×4 FOOTER (~300px Desktop Height)
      ───────────────────────────────────────────────────────────── */}
      <footer
        id="site-footer"
        className="relative bg-[#0B111E] overflow-hidden border-t border-b border-white/10 text-white select-none md:h-[300px] flex flex-col justify-center"
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

      {/* ─────────────────────────────────────────────────────────────
          10. WATCH DEMO: MINI WINDOW SCREEN (Interactive Product Tour & Previous Works)
      ───────────────────────────────────────────────────────────── */}
      {demoModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#0B111E] border border-white/15 rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col text-white relative shadow-2xl overflow-hidden">
            
            {/* Window Title Bar with macOS control dots */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10 bg-[#0F172A]/90 shrink-0">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]" />
                  <span className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]" />
                  <span className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]" />
                </div>
                <span className="text-xs font-semibold text-slate-300 ml-2 hidden sm:inline">
                  ServicePro OS — Interactive Product Walkthrough &amp; Service Results
                </span>
              </div>
              <button
                onClick={() => setDemoModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-white/10 transition-colors"
                aria-label="Close demo window"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Sub-nav Tab Bar inside Window */}
            <div className="flex items-center gap-2 px-5 py-2.5 border-b border-white/10 bg-[#080D17] shrink-0 text-xs sm:text-sm overflow-x-auto">
              <button
                onClick={() => setActiveDemoTab("actions")}
                className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeDemoTab === "actions"
                    ? "bg-[#F97316] text-white shadow-sm"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>Application Process in Action</span>
              </button>

              <button
                onClick={() => setActiveDemoTab("video")}
                className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeDemoTab === "video"
                    ? "bg-[#F97316] text-white shadow-sm"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Video Tour &amp; Chapters</span>
              </button>

              <button
                onClick={() => setActiveDemoTab("beforeAfter")}
                className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeDemoTab === "beforeAfter"
                    ? "bg-[#F97316] text-white shadow-sm"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Previous Works (Before &amp; After)</span>
              </button>

              <button
                onClick={() => setActiveDemoTab("results")}
                className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeDemoTab === "results"
                    ? "bg-[#F97316] text-white shadow-sm"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Customer Results &amp; ROI</span>
              </button>
            </div>

            {/* Window Content Body */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
              
              {/* TAB 1: APPLICATION PROCESS IN ACTION (Real App Screens & Workflow) */}
              {activeDemoTab === "actions" && (
                <div className="space-y-5">
                  {/* Step Selector Horizontal Bar */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {appActionSteps.map((s, idx) => (
                      <button
                        key={s.step}
                        onClick={() => setActiveActionStep(idx)}
                        className={`text-left p-2.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                          activeActionStep === idx
                            ? "bg-[#F97316]/15 border-[#F97316] text-white shadow-md shadow-[#F97316]/10 ring-1 ring-[#F97316]/50"
                            : "bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10"
                        }`}
                      >
                        <div className="flex items-center justify-between w-full mb-1">
                          <span
                            className={`w-5 h-5 rounded-full text-[10px] font-extrabold flex items-center justify-center ${
                              activeActionStep === idx
                                ? "bg-[#F97316] text-white"
                                : "bg-white/10 text-slate-300"
                            }`}
                          >
                            {s.step}
                          </span>
                          <span className="text-[9px] uppercase tracking-wider font-semibold opacity-75">
                            {s.shortRole}
                          </span>
                        </div>
                        <div className="text-xs font-bold truncate text-white">
                          {s.shortTitle}
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Active Step Browser/App Frame */}
                  <div className="rounded-xl border border-white/15 bg-[#080D17] overflow-hidden shadow-2xl">
                    {/* Simulated App Top Address Bar */}
                    <div className="px-4 py-2.5 bg-black/60 border-b border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                        </div>
                        <Link
                          href={
                            activeActionStep === 0
                              ? "/book"
                              : activeActionStep === 1
                              ? "/admin/dispatch"
                              : activeActionStep === 2
                              ? "/tech"
                              : activeActionStep === 3
                              ? "/admin/invoices"
                              : "/admin"
                          }
                          target="_blank"
                          className="font-mono text-[11px] text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 px-2.5 py-0.5 rounded border border-white/10 hidden sm:inline-flex items-center gap-1.5 transition-colors"
                          title="Open live app page in new tab"
                        >
                          <span>https://{appActionSteps[activeActionStep].route}</span>
                          <ExternalLink className="w-2.5 h-2.5 text-slate-400" />
                        </Link>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#F97316]/20 text-[#F97316] border border-[#F97316]/40">
                          {appActionSteps[activeActionStep].role}
                        </span>
                        <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          Live Application View
                        </span>
                      </div>
                    </div>

                    {/* App Screenshot Image Display */}
                    <div className="relative bg-slate-950 p-2 sm:p-3 overflow-hidden flex items-center justify-center min-h-[280px] max-h-[440px]">
                      <img
                        src={appActionSteps[activeActionStep].image}
                        alt={appActionSteps[activeActionStep].tagline}
                        className="w-full max-h-[420px] object-contain rounded-lg shadow-lg border border-white/10"
                      />
                    </div>

                    {/* Step Description & Key Highlights */}
                    <div className="p-4 sm:p-5 bg-gradient-to-b from-[#0B111E] to-[#080D17] border-t border-white/10 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <div className="text-xs uppercase font-extrabold tracking-wider text-[#F97316]">
                            Step {appActionSteps[activeActionStep].step} of 5 — {appActionSteps[activeActionStep].shortRole}
                          </div>
                          <h4 className="text-base sm:text-lg font-bold text-white mt-0.5">
                            {appActionSteps[activeActionStep].tagline}
                          </h4>
                        </div>

                        {/* Prev / Next controls */}
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            disabled={activeActionStep === 0}
                            onClick={() => setActiveActionStep((prev) => Math.max(0, prev - 1))}
                            className="px-3 py-1.5 rounded-lg border border-white/15 text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer flex items-center gap-1"
                          >
                            <ChevronLeft className="w-3.5 h-3.5" />
                            <span>Previous</span>
                          </button>
                          <button
                            disabled={activeActionStep === appActionSteps.length - 1}
                            onClick={() => setActiveActionStep((prev) => Math.min(appActionSteps.length - 1, prev + 1))}
                            className="px-3 py-1.5 rounded-lg bg-[#F97316] hover:bg-[#EA580C] text-xs font-bold text-white shadow-sm disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer flex items-center gap-1"
                          >
                            <span>Next Action</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                        {appActionSteps[activeActionStep].description}
                      </p>

                      {/* Highlights Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                        {appActionSteps[activeActionStep].highlights.map((h, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs text-slate-200">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span>{h}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: VIDEO TOUR & CHAPTERS */}
              {activeDemoTab === "video" && (
                <div className="space-y-4">
                  {/* Simulated Video Player Container */}
                  <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden border border-white/10 bg-black group shadow-lg">
                    {/* Background screen preview based on chapter */}
                    <img
                      src={
                        activeVideoChapter === 0
                          ? "/images/servicepro-hero-final.jpg"
                          : activeVideoChapter === 1
                          ? "/images/user-tech-roof.png"
                          : activeVideoChapter === 2
                          ? "/images/user-tech-siding.png"
                          : "/images/user-tech-inspect.png"
                      }
                      alt="ServicePro OS feature preview"
                      className="w-full h-full object-cover object-center opacity-85 transition-opacity"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/30" />

                    {/* Center Animated Play/Pause Button */}
                    <button
                      onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                      className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-[#F97316]/90 hover:bg-[#F97316] text-white flex items-center justify-center shadow-2xl backdrop-blur-sm transition-transform hover:scale-110 cursor-pointer"
                      aria-label={isVideoPlaying ? "Pause preview" : "Play preview"}
                    >
                      {isVideoPlaying ? (
                        <Pause className="w-7 h-7 fill-white" />
                      ) : (
                        <Play className="w-7 h-7 fill-white ml-1" />
                      )}
                    </button>

                    {/* Video Top Overlay Info */}
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-xs">
                      <span className="bg-[#0B111E]/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 font-medium text-[#F97316]">
                        {activeVideoChapter === 0 && "Chapter 1: Self-Service Customer Intake"}
                        {activeVideoChapter === 1 && "Chapter 2: AI Dispatch & Technician Matching"}
                        {activeVideoChapter === 2 && "Chapter 3: On-Site Mobile PWA & Photo Proof"}
                        {activeVideoChapter === 3 && "Chapter 4: Instant Card Invoicing & Same-Day Payout"}
                      </span>
                      <span className="bg-black/60 px-2.5 py-1 rounded text-slate-300 font-mono text-[11px] border border-white/10">
                        1080p 60fps HD
                      </span>
                    </div>

                    {/* Video Player Bottom Control Bar */}
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/80 to-transparent p-4 flex flex-col gap-2">
                      {/* Scrubber Progress Bar */}
                      <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden cursor-pointer">
                        <div
                          className="h-full bg-[#F97316] transition-all duration-300"
                          style={{
                            width:
                              activeVideoChapter === 0
                                ? "25%"
                                : activeVideoChapter === 1
                                ? "50%"
                                : activeVideoChapter === 2
                                ? "75%"
                                : "100%",
                          }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-xs text-slate-300">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                            className="text-white hover:text-[#F97316] transition-colors"
                          >
                            {isVideoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                          </button>
                          <span className="font-mono text-[11px]">
                            {activeVideoChapter === 0 && "00:42 / 03:20"}
                            {activeVideoChapter === 1 && "01:15 / 03:20"}
                            {activeVideoChapter === 2 && "02:08 / 03:20"}
                            {activeVideoChapter === 3 && "02:55 / 03:20"}
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <Volume2 className="w-4 h-4 text-slate-300 hover:text-white cursor-pointer" />
                          <Maximize2 className="w-4 h-4 text-slate-300 hover:text-white cursor-pointer" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Clickable Chapter Markers */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Jump To Chapter
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
                      {[
                        { step: 0, time: "0:00", title: "1. Self-Service Booking", desc: "60-sec customer intake" },
                        { step: 1, time: "0:48", title: "2. AI Dispatch Matching", desc: "92% skill & route match" },
                        { step: 2, time: "1:34", title: "3. Mobile Field App", desc: "Photos & checklist proof" },
                        { step: 3, time: "2:20", title: "4. Instant Invoicing", desc: "One-tap card payments" },
                      ].map((item) => (
                        <button
                          key={item.step}
                          onClick={() => setActiveVideoChapter(item.step)}
                          className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                            activeVideoChapter === item.step
                              ? "bg-white/10 border-[#F97316] text-white shadow-md shadow-[#F97316]/10"
                              : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-white"
                          }`}
                        >
                          <div className="flex items-center justify-between text-[11px] font-mono text-[#F97316] mb-1">
                            <span>{item.time}</span>
                            {activeVideoChapter === item.step && (
                              <span className="w-1.5 h-1.5 rounded-full bg-[#F97316] animate-pulse" />
                            )}
                          </div>
                          <div className="text-xs font-bold text-white leading-snug">{item.title}</div>
                          <div className="text-[10.5px] text-slate-400 leading-tight mt-0.5">{item.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: PREVIOUS WORKS (BEFORE & AFTER RESULTS) */}
              {activeDemoTab === "beforeAfter" && (
                <div className="space-y-4">
                  <div className="text-sm text-slate-300">
                    Real results from field service contractors powered by ServicePro OS:
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Work 1: HVAC */}
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between text-xs mb-2">
                          <span className="font-bold text-[#F97316]">HVAC Overhaul</span>
                          <span className="text-[10px] text-slate-400 font-mono">Job #4821</span>
                        </div>
                        <div className="aspect-[16/10] rounded-lg overflow-hidden bg-slate-800 mb-3 border border-white/10">
                          <img
                            src="/images/user-tech-roof.png"
                            alt="HVAC condenser restoration"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="space-y-2 text-xs">
                          <div>
                            <span className="text-rose-400 font-semibold block">Before Service:</span>
                            <p className="text-slate-300 text-[11px]">Blown dual-run capacitor, corroded coil fins, house at 84°F.</p>
                          </div>
                          <div>
                            <span className="text-emerald-400 font-semibold block">After Service:</span>
                            <p className="text-slate-300 text-[11px]">Installed OEM capacitor, power-flushed fins, tested 52°F delta.</p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px]">
                        <span className="text-slate-400">Tech: John D.</span>
                        <span className="text-amber-400 font-semibold">5.0 ★ (Austin, TX)</span>
                      </div>
                    </div>

                    {/* Work 2: Plumbing */}
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between text-xs mb-2">
                          <span className="font-bold text-[#F97316]">Plumbing Main Line</span>
                          <span className="text-[10px] text-slate-400 font-mono">Job #4819</span>
                        </div>
                        <div className="aspect-[16/10] rounded-lg overflow-hidden bg-slate-800 mb-3 border border-white/10">
                          <img
                            src="/images/user-tech-siding.png"
                            alt="Plumbing sewer line repair"
                            className="w-full h-full object-cover object-top"
                          />
                        </div>
                        <div className="space-y-2 text-xs">
                          <div>
                            <span className="text-rose-400 font-semibold block">Before Service:</span>
                            <p className="text-slate-300 text-[11px]">Severe tree root intrusion, complete sewer drain backup.</p>
                          </div>
                          <div>
                            <span className="text-emerald-400 font-semibold block">After Service:</span>
                            <p className="text-slate-300 text-[11px]">Hydro-jetted at 4000 PSI, cured-in-place trenchless reline.</p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px]">
                        <span className="text-slate-400">Tech: Mike T.</span>
                        <span className="text-amber-400 font-semibold">5.0 ★ (Denver, CO)</span>
                      </div>
                    </div>

                    {/* Work 3: Electrical */}
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between text-xs mb-2">
                          <span className="font-bold text-[#F97316]">200A Smart Panel</span>
                          <span className="text-[10px] text-slate-400 font-mono">Job #4805</span>
                        </div>
                        <div className="aspect-[16/10] rounded-lg overflow-hidden bg-slate-800 mb-3 border border-white/10">
                          <img
                            src="/images/user-tech-inspect.png"
                            alt="Electrical panel upgrade"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="space-y-2 text-xs">
                          <div>
                            <span className="text-rose-400 font-semibold block">Before Service:</span>
                            <p className="text-slate-300 text-[11px]">Hazardous 1970s fuse box tripping under modern heat pump loads.</p>
                          </div>
                          <div>
                            <span className="text-emerald-400 font-semibold block">After Service:</span>
                            <p className="text-slate-300 text-[11px]">Siemens 200A surge-protected breaker panel, passed city inspection.</p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px]">
                        <span className="text-slate-400">Tech: Sarah L.</span>
                        <span className="text-amber-400 font-semibold">5.0 ★ (Seattle, WA)</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: CUSTOMER RESULTS & ROI */}
              {activeDemoTab === "results" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                      <div className="text-3xl font-extrabold text-[#F97316] mb-1">+38%</div>
                      <div className="text-xs font-bold text-white">Revenue Growth</div>
                      <div className="text-[10.5px] text-slate-400 mt-1">Average increase in first 90 days</div>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                      <div className="text-3xl font-extrabold text-emerald-400 mb-1">4.8 hrs</div>
                      <div className="text-xs font-bold text-white">Saved Daily</div>
                      <div className="text-[10.5px] text-slate-400 mt-1">Per dispatcher on phone &amp; routing</div>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                      <div className="text-3xl font-extrabold text-blue-400 mb-1">99.4%</div>
                      <div className="text-xs font-bold text-white">On-Time Arrival</div>
                      <div className="text-[10.5px] text-slate-400 mt-1">Live customer ETA tracking</div>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                      <div className="text-3xl font-extrabold text-purple-400 mb-1">92%</div>
                      <div className="text-xs font-bold text-white">First-Visit Fix</div>
                      <div className="text-[10.5px] text-slate-400 mt-1">Right parts &amp; skills matched</div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-orange-500/10 via-white/5 to-transparent border border-[#F97316]/30 rounded-xl p-5 flex flex-col sm:flex-row items-center gap-4">
                    <img
                      src="/images/testimonial-mike.jpg"
                      alt="Mike Thompson, Owner of Thompson Air & Heat"
                      className="w-14 h-14 rounded-full object-cover border-2 border-[#F97316] shrink-0"
                    />
                    <div>
                      <p className="text-xs sm:text-sm text-slate-200 italic leading-relaxed">
                        &quot;ServicePro OS eliminated 90% of our scheduling phone calls. We expanded from 3 trucks to 8 trucks in 9 months, and our customers love the instant booking.&quot;
                      </p>
                      <div className="text-xs font-bold text-white mt-1.5">
                        Mike Thompson — Owner, Thompson Air &amp; Heat
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Window Footer Actions */}
            <div className="px-5 py-3.5 border-t border-white/10 bg-[#0F172A]/90 shrink-0 flex items-center justify-between">
              <button
                onClick={() => {
                  setDemoModalOpen(false);
                  setTrialModalOpen(true);
                }}
                className="bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold px-4 py-2 rounded-lg text-xs sm:text-sm shadow-md shadow-[#F97316]/25 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>Try Booking Process</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setDemoModalOpen(false)}
                className="px-4 py-2 text-xs sm:text-sm text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          11. FREE TRIAL & BOOKING PROCESS: PROFESSIONAL MINI WINDOW SCREEN
      ───────────────────────────────────────────────────────────── */}
      {trialModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full h-[82vh] max-h-[660px] flex flex-col shadow-2xl relative border border-slate-300/80 overflow-hidden ring-1 ring-black/10">
            {/* Professional Window Title Bar with macOS Control Dots (No Full Screen Link) */}
            <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-white/10 bg-[#0F172A] text-white shrink-0">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]" />
                  <span className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]" />
                  <span className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]" />
                </div>
                <div className="flex items-center gap-2 ml-1">
                  <img
                    src="/images/servicepro-icon-transparent.png?v=green"
                    alt="ServicePro OS"
                    className="h-5 w-auto object-contain"
                  />
                  <span className="text-xs sm:text-sm font-bold text-white tracking-tight">
                    ServicePro OS — Instant Booking Wizard
                  </span>
                  <span className="text-[10px] bg-[#F97316]/20 text-[#F97316] font-semibold border border-[#F97316]/40 px-2 py-0.5 rounded-full hidden sm:inline">
                    Mini Window
                  </span>
                </div>
              </div>

              {/* Close Button Only — Full Screen Link Completely Removed */}
              <button
                onClick={() => setTrialModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Close booking window"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Embedded Booking Wizard (Fully contained inside Mini Screen) */}
            <div className="flex-1 flex flex-col overflow-hidden bg-slate-50 relative">
              <React.Suspense
                fallback={
                  <div className="flex-1 flex items-center justify-center bg-white text-slate-600 text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                      <span>Loading booking wizard…</span>
                    </div>
                  </div>
                }
              >
                <BookingWizard isModal={true} />
              </React.Suspense>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
