import * as React from "react";
import Link from "next/link";
import {
  Calendar,
  Phone,
  CheckCircle2,
  ShieldCheck,
  Clock,
  ArrowRight,
  MessageSquare,
  Smartphone,
  Navigation,
  FileText,
  CreditCard,
  Sparkles,
  HelpCircle,
} from "lucide-react";
import { businessConfig } from "@config/business.config";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: `How It Works — 60-Second Booking & Live GPS Dispatch | ${businessConfig.businessName}`,
  description: `Learn how ${businessConfig.businessName}'s transparent HVAC booking, real-time technician GPS tracking, and upfront pricing work.`,
};

export default function HowItWorksPage() {
  const cleanPhoneHref = `tel:${businessConfig.phone.replace(/\D/g, "")}`;

  const steps = [
    {
      num: "01",
      title: "Select Service & 60-Minute Arrival Slot",
      desc: "Choose the exact issue (AC diagnostic, seasonal tune-up, or duct cleaning) and select a guaranteed arrival window that fits your schedule. Upfront flat-rate pricing is displayed before you book.",
      badge: "60 Seconds Online",
      preview: {
        tag: "Step 1 Preview",
        headline: "AC Diagnostic & Troubleshooting",
        sub: "Guaranteed 2-Hour Arrival Window: Today, 2:00 PM - 4:00 PM",
        badgeText: "$129 Flat Rate Diagnostic",
      },
    },
    {
      num: "02",
      title: "Instant SMS Confirmation & $20 Hold",
      desc: "A $20 deposit reserves your slot and is 100% credited toward your final repair invoice. You immediately receive a confirmation text and calendar invite with your booking reference.",
      badge: "Zero Phone Tag",
      preview: {
        tag: "Automated SMS Alert",
        headline: `${businessConfig.businessName} Dispatch: Work Order WO-8422 Confirmed`,
        sub: "Your appointment is confirmed for Carlos Rodriguez (Master Tech). $20 deposit credited to final bill.",
        badgeText: "SMS & Email Sent",
      },
    },
    {
      num: "03",
      title: "Live GPS Technician En-Route Tracking",
      desc: "When your master technician departs for your property, you receive a text with their photo, vehicle ID, and live interactive GPS map showing their real-time estimated arrival.",
      badge: "Live GPS Tracking",
      preview: {
        tag: "Live Route Telemetry",
        headline: "Tech Carlos is En Route (14 min away)",
        sub: "Vehicle: 2024 Ford Transit 250 (Fleet Unit Alpha) • NATE & EPA Universal Certified",
        badgeText: "Live GPS Active",
      },
    },
    {
      num: "04",
      title: "Fixed-Right Diagnostic & Digital Payment",
      desc: "Your technician tests your system, presents a digital itemized quote before turning a wrench, completes the repair from truck stock, and issues a digital receipt with before/after photos.",
      badge: "1-Year Warranty",
      preview: {
        tag: "Digital Work Order",
        headline: "Dual Run Capacitor Replaced",
        sub: "System balanced at 58°F supply temp. 1-Year Workmanship Warranty included.",
        badgeText: "Settled on Glass",
      },
    },
  ];

  return (
    <div className="min-h-screen bg-[#0C1523] text-white selection:bg-[#F97316] selection:text-white pb-20">
      <Breadcrumbs items={[{ label: "How It Works" }]} />

      {/* Editorial Dark Navy Hero */}
      <section className="relative overflow-hidden pt-12 pb-16 sm:py-20 border-b border-white/10">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#F97316]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10 space-y-4">
          <span className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#F97316]">
            <Sparkles className="h-3.5 w-3.5" />
            Frictionless Field Service
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            How {businessConfig.businessName} Online Booking Works
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            We redesigned the HVAC contractor experience around your convenience. No waiting on hold, no 8-hour waiting windows, and zero surprise prices.
          </p>
        </div>
      </section>

      {/* Connected Numbered Steps (Airy Glassmorphic Cards) */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="space-y-10 relative">
          {/* Vertical continuous accent line for desktop */}
          <div className="hidden lg:block absolute left-8 top-10 bottom-10 w-0.5 bg-gradient-to-b from-[#F97316] via-orange-500/40 to-white/10 z-0" />

          {steps.map((st) => (
            <div
              key={st.num}
              className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center rounded-3xl border border-white/10 bg-[#0F172A]/80 backdrop-blur-xl p-6 sm:p-10 shadow-lg hover:border-white/20 transition-all"
            >
              {/* Left Column: Number + Content (7 cols) */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-2xl bg-[#0C1523] text-[#F97316] font-mono font-black text-2xl flex items-center justify-center shrink-0 border border-orange-500/30 shadow-md">
                    {st.num}
                  </div>
                  <span className="text-xs font-bold text-orange-400 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20">
                    {st.badge}
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {st.title}
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed max-w-xl">
                  {st.desc}
                </p>
              </div>

              {/* Right Column: Visual UI Mockup (5 cols) */}
              <div className="lg:col-span-5">
                <div className="rounded-2xl border border-white/10 bg-[#0B1320]/90 p-5 shadow-inner space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                      {st.preview.tag}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      {st.preview.badgeText}
                    </span>
                  </div>
                  <div className="font-bold text-sm text-white">
                    {st.preview.headline}
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {st.preview.sub}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Under the Hood: Real-World Service & Field Engineering Protocol */}
        <div className="mt-16 p-8 sm:p-12 rounded-3xl bg-[#0F172A]/90 border border-white/10 backdrop-blur-xl space-y-8 shadow-xl">
          <div className="space-y-3 text-center max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-[#F97316] text-xs font-bold uppercase tracking-wider">
              Engineering Rigor
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              Under the Hood: Real-World Service &amp; Field Engineering Protocol
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Every appointment executes a standardized four-phase engineering procedure to guarantee safety, transparency, and lasting mechanical performance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
              <span className="text-xs font-bold text-[#F97316] uppercase tracking-wider">Phase 01</span>
              <h4 className="text-base font-bold text-white">Dynamic Dispatch &amp; Inventory Verification</h4>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Automated telemetry matches technician location, traffic data, and specific truck inventory (capacitors, contactors, motors) before dispatching to eliminate parts-run delays.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
              <span className="text-xs font-bold text-[#F97316] uppercase tracking-wider">Phase 02</span>
              <h4 className="text-base font-bold text-white">Standardized 24-Point Physical Diagnostics</h4>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Digital manifold gauge pressure test, amp draw readings, superheat &amp; subcooling calibration, and static duct pressure analysis with zero guesswork.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
              <span className="text-xs font-bold text-[#F97316] uppercase tracking-wider">Phase 03</span>
              <h4 className="text-base font-bold text-white">Transparent Good / Better / Best Estimates</h4>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Presented directly on the technician tablet with upfront pricing, itemized part costs, and zero obligation before any wrench is turned.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
              <span className="text-xs font-bold text-[#F97316] uppercase tracking-wider">Phase 04</span>
              <h4 className="text-base font-bold text-white">Post-Service Verification &amp; Warranty</h4>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Certified supply air delta-T temperature test verification, photographic audit trail, and automatic 1-year warranty registration in your Customer Portal.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
