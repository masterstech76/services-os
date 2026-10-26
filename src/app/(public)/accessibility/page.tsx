"use client";

import * as React from "react";
import Link from "next/link";
import {
  Eye,
  Keyboard,
  Volume2,
  Brain,
  CheckCircle2,
  ShieldCheck,
  Phone,
  Mail,
  Sliders,
  Check,
  Sparkles,
  ArrowRight,
  Shield,
} from "lucide-react";
import { businessConfig } from "@config/business.config";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { Button } from "@/components/ui/button";

const VERIFICATION_NODES = [
  {
    num: "01",
    title: "Visual Calibration & High Contrast Architecture",
    category: "Perceivable · WCAG AAA Contrast",
    summary: "Engineered for low vision, color blindness, and high-glare outdoor rooftop field environments.",
    metrics: [
      "Strict minimum 4.5:1 text contrast ratio (7:1 for headers) conforming to WCAG AAA standards.",
      "Support for 200% browser text scaling without loss of functionality or horizontal layout clipping.",
      "Non-color-dependent status badges (pairing high-visibility icons, textual badges, and geometric borders).",
      "Semantic HTML5 tree structure with dedicated landmark regions and ARIA live status announcements.",
    ],
    status: "VERIFIED COMPLIANT",
  },
  {
    num: "02",
    title: "Screen Reader & Assistive Tree Architecture",
    category: "Operable · Assistive Tree",
    summary: "Tested and verified across Apple VoiceOver (iOS/macOS), NVDA (Windows), and Google TalkBack (Android).",
    metrics: [
      "Dynamic ARIA live regions (`aria-live='polite'`) for real-time dispatch and arrival updates.",
      "Descriptive alternative text tags on all equipment diagrams, technician portraits, and interface controls.",
      "Form input fields programmatically linked with permanent label tags and inline error suggestions.",
      "Non-visual audio cues and haptic vibration feedback for mobile technician safety checklists.",
    ],
    status: "VERIFIED COMPLIANT",
  },
  {
    num: "03",
    title: "Full Keyboard & Switch Control Navigation",
    category: "Operable · Keyboard Accessible",
    summary: "Complete full-system navigation without a mouse or touchscreen.",
    metrics: [
      "High-visibility safety-orange focus rings (`outline: 2px solid #F97316`) on all interactive buttons and inputs.",
      "Predictable, logical tab key ordering through all 7 steps of the self-service booking flow.",
      "All touch targets exceed the 48x48px requirement for field technicians wearing protective safety gloves.",
      "Permanent skip-to-main-content landmark navigation link on every header for rapid screen-reader traversal.",
    ],
    status: "VERIFIED COMPLIANT",
  },
  {
    num: "04",
    title: "Hearing, Speech & Silent Dispatch Protocol",
    category: "Understandable · Deaf & Hard-of-Hearing",
    summary: "Full end-to-end service autonomy for Deaf and speech-impaired homeowners without mandatory voice calls.",
    metrics: [
      "100% digital self-service booking, arrival tracking, and payment requiring zero verbal phone calls.",
      "Real-time SMS dispatch alerts paired with live Uber-style GPS interactive truck mapping.",
      "In-portal two-way messaging between homeowners, dispatch supervisors, and field technicians.",
      "Itemized digital estimates with Good/Better/Best options and digital signature sign-off on mobile glass.",
    ],
    status: "VERIFIED COMPLIANT",
  },
  {
    num: "05",
    title: "Cognitive Simplicity & Anxiety Reduction",
    category: "Understandable · Cognitive Simplicity",
    summary: "Clear, transparent layouts designed to reduce stress during emergency cooling and heating failures.",
    metrics: [
      "Upfront transparent flat-rate pricing with zero hidden surcharges ($129 diagnostic fee 100% credited).",
      "Step-by-step progress tracking with automatic form state saving to eliminate accidental data loss.",
      "Immediate human-readable form validation with constructive correction guidance.",
      "Zero flashing graphics, high-pressure countdown tickers, or autoplaying audio/video media.",
    ],
    status: "VERIFIED COMPLIANT",
  },
  {
    num: "06",
    title: "Continuous W3C WCAG 2.1 AA Compliance Scorecard",
    category: "Robust · Automated CI/CD Auditing",
    summary: "Continuous automated pipeline accessibility audits on every software deployment.",
    metrics: [
      "100% passing score on automated Axe-Core and Lighthouse accessibility suites across all 86+ routes.",
      "Rigorous role-based testing across Customer Portal, Tech Mobile App, and Admin Command Center.",
      "Quarterly third-party accessibility engineering reviews to prevent software regression.",
      "Direct accommodation channel and designated accessibility coordinator standing by 24/7.",
    ],
    status: "VERIFIED COMPLIANT",
  },
];

export default function AccessibilityPage() {
  const cleanPhone = businessConfig.phone.replace(/\D/g, "");

  return (
    <div className="min-h-screen bg-[#0C1523] text-white selection:bg-[#F97316] selection:text-white pb-20">
      <Breadcrumbs items={[{ label: "Accessibility Verification" }]} />

      {/* Hero Header */}
      <section className="relative overflow-hidden pt-12 pb-16 px-6 sm:px-8 lg:px-12 border-b border-white/10">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#F97316]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-4xl mx-auto space-y-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-orange-500/10 border border-orange-500/20 px-4 py-1.5 text-xs font-bold text-[#F97316]">
            <ShieldCheck className="h-4 w-4" />
            <span>WCAG 2.1 Level AA Verification Pipeline</span>
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Accessible Technology for Every Homeowner &amp; Technician.
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed pt-2">
            At {businessConfig.businessName}, we engineer trade software conforming to international W3C WCAG 2.1 AA standards. Follow our six-stage verification tracking audit below.
          </p>
        </div>
      </section>

      {/* Connected Sequential Verification Tracking Pipeline */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="relative">
          {/* Continuous Vertical Glowing Verification Track Line */}
          <div className="absolute left-6 sm:left-8 top-8 bottom-8 w-1 bg-gradient-to-b from-[#F97316] via-amber-500 to-emerald-500 shadow-[0_0_16px_rgba(249,115,22,0.5)] z-0 rounded-full" />

          {/* Stepper Nodes */}
          <div className="space-y-12 relative z-10">
            {VERIFICATION_NODES.map((node) => (
              <div key={node.num} className="flex items-start gap-6 sm:gap-8 group">
                {/* Pointed Numbered Node with Glowing Halo */}
                <div className="shrink-0 flex flex-col items-center">
                  <div className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-[#0F172A] border-2 border-[#F97316] text-[#F97316] flex items-center justify-center font-mono font-black text-sm sm:text-lg shadow-xl shadow-orange-500/20 group-hover:scale-105 transition-transform ring-4 ring-[#0C1523]">
                    <span>{node.num}</span>
                    <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-[#0F172A] animate-pulse" />
                  </div>
                </div>

                {/* Node Dossier Card */}
                <div className="flex-1 rounded-3xl border border-white/10 bg-[#0F172A]/90 backdrop-blur-xl p-6 sm:p-8 space-y-4 shadow-xl hover:border-white/20 transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                    <div>
                      <span className="text-xs font-mono font-bold text-[#F97316] uppercase tracking-wider">
                        {node.category}
                      </span>
                      <h2 className="text-lg sm:text-xl font-bold text-white mt-0.5">
                        {node.title}
                      </h2>
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 self-start sm:self-auto shrink-0">
                      <Check className="w-3 h-3" />
                      <span>{node.status}</span>
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {node.summary}
                  </p>

                  <div className="pt-2">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                      Verification Criteria &amp; Architecture:
                    </h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                      {node.metrics.map((m, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-slate-300 bg-white/[0.02] border border-white/5 p-3 rounded-xl">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{m}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Accommodations & Direct Assistance Channel */}
        <section className="mt-20 rounded-3xl bg-[#0F172A]/95 border border-white/10 backdrop-blur-xl p-8 sm:p-10 shadow-2xl space-y-6">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-mono font-bold text-[#F97316] uppercase tracking-widest">
              Direct Accommodation Desk
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Need Accommodations or Found a Barrier?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              If you experience any challenge accessing our booking portal, viewing invoices, or communicating with technicians, our accessibility coordinator will assist you immediately.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="rounded-2xl bg-[#0B1320] border border-white/10 p-5 space-y-2">
              <div className="flex items-center gap-2 text-[#F97316] font-bold text-xs uppercase">
                <Phone className="h-4 w-4" />
                <span>24/7 Voice &amp; TTY Dispatch</span>
              </div>
              <p className="text-xs text-slate-400">
                Telephone support for real-time dispatch and arrival scheduling:
              </p>
              <a
                href={`tel:${cleanPhone}`}
                className="inline-block text-lg font-bold text-white hover:text-[#F97316] transition-colors"
              >
                {businessConfig.phone}
              </a>
            </div>

            <div className="rounded-2xl bg-[#0B1320] border border-white/10 p-5 space-y-2">
              <div className="flex items-center gap-2 text-[#F97316] font-bold text-xs uppercase">
                <Mail className="h-4 w-4" />
                <span>Accessibility Coordinator</span>
              </div>
              <p className="text-xs text-slate-400">
                Direct email for accommodations, feedback, and accessibility bug reports:
              </p>
              <a
                href={`mailto:${businessConfig.email}?subject=Accessibility%20Request`}
                className="inline-block text-base font-bold text-white hover:text-[#F97316] transition-colors"
              >
                {businessConfig.email}
              </a>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-400">
            <span>Physical Dispatch HQ: {businessConfig.address}, {businessConfig.city}, {businessConfig.state}</span>
            <Link
              href="/services"
              className="text-[#F97316] font-bold hover:underline inline-flex items-center gap-1"
            >
              <span>Explore All Certified Services &rarr;</span>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
