import * as React from "react";
import Link from "next/link";
import { Phone, Mail, MapPin, Clock, ShieldCheck, AlertTriangle, ArrowRight, HelpCircle, CheckCircle2, ChevronDown } from "lucide-react";
import { businessConfig } from "@config/business.config";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { ContactForm } from "@/components/contact/ContactForm";

export const metadata = {
  title: `Contact Us & 24/7 Dispatch Desk | ${businessConfig.businessName}`,
  description: `Contact ${businessConfig.businessName} for emergency AC repair, dispatch assistance, and service inquiries in ${businessConfig.city}.`,
};

export default function ContactPage() {
  const cleanPhoneHref = `tel:${businessConfig.phone.replace(/\D/g, "")}`;

  return (
    <div className="min-h-screen bg-[#0C1523] text-white selection:bg-[#F97316] selection:text-white pb-20">
      <Breadcrumbs items={[{ label: "Contact & Dispatch" }]} />

      {/* Hero Header with Ambient Lighting */}
      <section className="relative bg-[#0C1523] py-12 px-4 sm:px-6 lg:px-8 border-b border-white/10 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#F97316]/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-[#F97316] uppercase tracking-wider">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            24/7 Live Central Dispatch Desk
          </div>
          <h1 className="font-heading text-3xl sm:text-5xl font-black text-white tracking-tight">
            Contact {businessConfig.businessName} Dispatch
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-3xl leading-relaxed">
            Need urgent AC diagnostics, seasonal tune-up booking, or technical support? Our local dispatch supervisors are standing by 24 hours a day across {businessConfig.city}.
          </p>
        </div>
      </section>

      {/* Main Content: Proportional Side-by-Side Upper Row */}
      <section className="py-12 px-4 sm:px-6 max-w-7xl mx-auto space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Direct Contact Info (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-8 rounded-3xl bg-[#0F172A]/80 backdrop-blur-xl text-white space-y-6 shadow-xl border border-white/10">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-[#F97316]">
                  Direct Line &amp; HQ
                </span>
                <h2 className="font-heading text-2xl font-black">Central Dispatch Office</h2>
              </div>

              <div className="space-y-5 text-sm text-slate-300">
                <div className="flex items-start gap-3.5">
                  <div className="h-9 w-9 rounded-xl bg-[#0C1523] text-[#F97316] flex items-center justify-center shrink-0 border border-white/10">
                    <Phone className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-bold text-white text-xs uppercase tracking-wider text-slate-400">Dispatch Phone</div>
                    <a href={cleanPhoneHref} className="text-base font-black text-[#F97316] hover:underline">
                      {businessConfig.phone}
                    </a>
                    <div className="text-[11px] text-slate-400">Available 24 Hours / 7 Days a Week</div>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="h-9 w-9 rounded-xl bg-[#0C1523] text-[#F97316] flex items-center justify-center shrink-0 border border-white/10">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-bold text-white text-xs uppercase tracking-wider text-slate-400">Email Desk</div>
                    <a href={`mailto:${businessConfig.email}`} className="text-sm font-semibold text-white hover:underline">
                      {businessConfig.email}
                    </a>
                    <div className="text-[11px] text-slate-400">Inquiries answered in &lt; 30 mins</div>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="h-9 w-9 rounded-xl bg-[#0C1523] text-[#F97316] flex items-center justify-center shrink-0 border border-white/10">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-bold text-white text-xs uppercase tracking-wider text-slate-400">Dispatch Base</div>
                    <div className="text-sm font-semibold text-white">
                      {businessConfig.address}
                    </div>
                    <div className="text-[11px] text-slate-400">{businessConfig.city}, {businessConfig.state} {businessConfig.zipCodes[0]}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="h-9 w-9 rounded-xl bg-[#0C1523] text-[#F97316] flex items-center justify-center shrink-0 border border-white/10">
                    <Clock className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-bold text-white text-xs uppercase tracking-wider text-slate-400">Operating Hours</div>
                    <div className="text-sm font-semibold text-white">Mon – Sun: 7:00 AM – 8:00 PM</div>
                    <div className="text-[11px] text-emerald-400 font-bold">24/7 On-Call Emergency Service</div>
                  </div>
                </div>
              </div>

              {/* Guarantees Box */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-white">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  <span>Licensed, Insured &amp; Certified</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Florida State Mechanical Contractor License #{businessConfig.licenseNumber}. Master certified EPA universal technicians.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form (7 cols) */}
          <div className="lg:col-span-7">
            <ContactForm />
          </div>
        </div>

        {/* Lower Row: Balanced Full-Width 2-Column Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Left Card: Regional Coverage & Dispatch Zones */}
          <div className="p-8 rounded-3xl bg-[#0F172A]/80 backdrop-blur-xl border border-white/10 space-y-5 flex flex-col justify-between shadow-xl">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-[#F97316] text-xs font-bold uppercase tracking-wider">
                  <MapPin className="h-3.5 w-3.5" />
                  Regional Staging &amp; Coverage
                </div>
                <span className="text-xs text-emerald-400 font-semibold">Sub-60 Min Response</span>
              </div>
              <h3 className="font-heading text-xl font-bold text-white">Active Dispatch Corridors</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Mobile warehouse vans are continuously staged throughout key metropolitan zones to maintain sub-60 minute arrival windows.
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {["Brickell", "Downtown", "Coral Gables", "Coconut Grove", "Doral", "Kendall", "Miami Beach", "Fort Lauderdale"].map((zone) => (
                  <span key={zone} className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-medium text-slate-200">
                    {zone}
                  </span>
                ))}
              </div>
            </div>
            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs text-slate-400">24-ZIP Directory Coverage</span>
              <Link
                href="/areas"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#F97316] hover:underline"
              >
                <span>View Full Interactive Map</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Right Card: Dispatch Protocols & Rapid Answers */}
          <div className="p-8 rounded-3xl bg-[#0F172A]/80 backdrop-blur-xl border border-white/10 space-y-5 flex flex-col justify-between shadow-xl">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-bold uppercase tracking-wider border border-white/10">
                <HelpCircle className="h-3.5 w-3.5 text-[#F97316]" />
                Dispatch Protocols &amp; Answers
              </div>
              <h3 className="font-heading text-xl font-bold text-white">Need Answers Before Booking?</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Every service call includes transparent flat rates, certified master technicians, and a full 1-year workmanship warranty on parts and labor.
              </p>
              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>$129 diagnostic fee is 100% credited toward approved repair</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Live GPS arrival tracker sent via SMS once tech departs</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>EPA Universal 608 certified &amp; background checked technicians</span>
                </div>
              </div>
            </div>
            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs text-slate-400">All questions answered</span>
              <Link
                href="/faq"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#F97316] hover:underline"
              >
                <span>Explore Full FAQ Knowledge Base</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
