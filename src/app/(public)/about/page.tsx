import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShieldCheck,
  Award,
  Users,
  CheckCircle2,
  Phone,
  Calendar,
  ArrowRight,
  Clock,
  MapPin,
  Star,
  Wrench,
  Sparkles,
  DollarSign,
} from "lucide-react";
import { businessConfig } from "@config/business.config";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: `About Us | ${businessConfig.businessName}`,
  description: `Learn about ${businessConfig.businessName}, our 14+ years serving ${businessConfig.city}, licensed master technicians, and our 100% satisfaction guarantee.`,
};

export default function AboutPage() {
  const cleanPhoneHref = `tel:${businessConfig.phone.replace(/\D/g, "")}`;

  const stats = [
    { label: "Years Serving Miami", value: "14+" },
    { label: "Verified Jobs Completed", value: "15,000+" },
    { label: "Customer Satisfaction", value: "4.9 ★" },
    { label: "Metro Service Areas", value: "12 Zones" },
  ];

  const values = [
    {
      icon: DollarSign,
      title: "Upfront Transparent Pricing",
      desc: "Every diagnostic quote is approved before repair begins. Deposit is 100% credited to your final bill.",
    },
    {
      icon: ShieldCheck,
      title: "100% Fixed-Right Guarantee",
      desc: "All parts and workmanship are backed by our 30-day fixed-right promise and 1-year limited warranty.",
    },
    {
      icon: Users,
      title: "Certified Master Technicians",
      desc: "Background-checked, drug-screened pros with NATE and EPA Section 608 mechanical certifications.",
    },
  ];

  const teamMembers = [
    {
      name: "Lead Field Specialist",
      role: "Lead Master HVAC Technician",
      exp: "12 Yrs Exp • NATE & EPA Universal",
      initial: "C",
      color: "from-blue-600 to-indigo-700",
    },
    {
      name: "Diagnostic Specialist",
      role: "Senior Refrigeration Specialist",
      exp: "8 Yrs Exp • EPA Section 608",
      initial: "D",
      color: "from-orange-500 to-amber-600",
    },
    {
      name: "Senior Field Tech",
      role: "Controls & Smart Systems Lead",
      exp: "7 Yrs Exp • Low-Voltage Controls",
      initial: "M",
      color: "from-emerald-500 to-teal-700",
    },
    {
      name: "HVAC Systems Lead",
      role: "Commercial HVAC & Airflow Specialist",
      exp: "10 Yrs Exp • Indoor Air Quality",
      initial: "T",
      color: "from-purple-500 to-pink-600",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0C1523] text-white selection:bg-[#F97316] selection:text-white pb-20">
      {/* 1. Breadcrumb Navigation */}
      <Breadcrumbs items={[{ label: "About Us" }]} />

      {/* 2. Hero Header with Ambient Lighting */}
      <section className="relative bg-[#0C1523] border-b border-white/10 py-12 lg:py-20 px-4 sm:px-6 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#F97316]/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          <div className="lg:col-span-8 space-y-4">
            <span className="text-xs font-bold text-[#F97316] uppercase tracking-wider bg-white/5 border border-white/10 px-3.5 py-1 rounded-full inline-block">
              About {businessConfig.businessName} • FL License #{businessConfig.licenseNumber}
            </span>
            <h1 className="font-heading text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Fast, Transparent HVAC Service Built for South Florida Homeowners
            </h1>
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              Founded to eliminate 4-hour waiting windows, hidden fees, and high-pressure replacement quotas. We bring honest diagnostics and cold air back to your home.
            </p>
          </div>

          <div className="lg:col-span-4 grid grid-cols-2 gap-3.5">
            <div className="p-6 rounded-2xl bg-[#0F172A]/80 backdrop-blur-xl border border-white/10 shadow-lg text-center space-y-1">
              <div className="text-3xl font-black text-[#F97316]">14+</div>
              <div className="text-xs font-bold text-white">Years Active</div>
              <div className="text-[11px] text-slate-400">Founded in Miami</div>
            </div>
            <div className="p-6 rounded-2xl bg-[#0F172A]/80 backdrop-blur-xl border border-white/10 shadow-lg text-center space-y-1">
              <div className="text-3xl font-black text-white">60m</div>
              <div className="text-xs font-bold text-white">Dispatch Window</div>
              <div className="text-[11px] text-slate-400">Emergency Response</div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-20 pt-16">
        {/* 3. Story Section - 2 Col: Overlapping Imagery Left, Journey & Timeline Right */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 relative">
            <div className="relative h-[380px] w-full rounded-3xl overflow-hidden shadow-2xl border border-white/10">
              <Image
                src="/images/hero.jpg"
                alt="HVAC work van and team"
                fill
                sizes="(max-width: 1024px) 100vw, 42vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0C1523]/60 via-transparent to-transparent pointer-events-none" />
            </div>
            <div className="absolute -bottom-6 -right-4 w-48 h-36 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20 bg-[#0F172A] hidden sm:block">
              <Image
                src="/images/svc-ac-repair.jpg"
                alt="HVAC technician at work"
                fill
                sizes="192px"
                className="object-cover"
              />
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <h2 className="font-heading text-2xl sm:text-3xl font-black text-white">
              Our Journey: From One Truck to {businessConfig.city}&apos;s Highest-Rated Team
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              When {businessConfig.businessName} started in 2012, homeowners were frustrated by HVAC contractors who wouldn&apos;t give upfront prices or show up on time. We built our entire business model on radical transparency: exact 2-hour arrival windows, GPS technician tracking, and zero diagnostic fees when you approve repairs.
            </p>

            {/* Vertical Milestones Timeline */}
            <div className="space-y-4 pt-2">
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-3.5 h-3.5 rounded-full bg-[#F97316] ring-4 ring-[#F97316]/20" />
                  <div className="w-0.5 h-full bg-white/10" />
                </div>
                <div className="pb-4">
                  <span className="font-bold text-xs text-[#F97316]">2012 — Founded in Miami</span>
                  <p className="text-xs text-slate-300 mt-0.5">Started with 1 mobile warehouse van dedicated to honest residential diagnostics.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-3.5 h-3.5 rounded-full bg-white/60 ring-4 ring-white/10" />
                  <div className="w-0.5 h-full bg-white/10" />
                </div>
                <div className="pb-4">
                  <span className="font-bold text-xs text-white">2018 — 10,000th Home Fixed</span>
                  <p className="text-xs text-slate-300 mt-0.5">Expanded fleet coverage across 12 zones with full EPA Section 608 certification.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20" />
                </div>
                <div>
                  <span className="font-bold text-xs text-emerald-400">2026 — Modern Digital Dispatch</span>
                  <p className="text-xs text-slate-300 mt-0.5">Launched real-time online booking, slot locking, and 1-year fixed-right warranties.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Stats Row - 4 Cols Glassmorphic Cards */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 sm:p-8 rounded-3xl bg-[#0F172A]/80 backdrop-blur-xl border border-white/10 shadow-xl">
          {stats.map((s, idx) => (
            <div key={idx} className="text-center space-y-1">
              <div className="font-heading font-black text-2xl sm:text-4xl text-white">{s.value}</div>
              <div className="text-xs font-semibold text-slate-400">{s.label}</div>
            </div>
          ))}
        </section>

        {/* 5. Core Values - 3 Cols Equal Height Glassmorphic Cards */}
        <section className="space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-1">
            <h2 className="font-heading text-2xl sm:text-3xl font-black text-white">
              The Principles That Guide Every Dispatch
            </h2>
            <p className="text-xs text-slate-400 font-medium">Clear commitments to our customers on every service call.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((v, idx) => {
              const Icon = v.icon;
              return (
                <div key={idx} className="p-6 rounded-2xl bg-[#0F172A]/80 backdrop-blur-xl border border-white/10 shadow-lg flex flex-col justify-between space-y-4 hover:border-white/20 transition-all">
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-xl bg-[#F97316]/10 border border-[#F97316]/20 text-[#F97316] flex items-center justify-center">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-heading text-base font-bold text-white">{v.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{v.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 6. Office & Dispatch Center - 2 Col: Map Card Left, Info List Right */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 sm:p-8 rounded-3xl bg-[#0F172A]/90 backdrop-blur-xl text-white border border-white/10 shadow-2xl">
          <div className="lg:col-span-6 relative aspect-[16/10] rounded-2xl overflow-hidden bg-[#0C1523] border border-white/10">
            <Image
              src="/images/cart-illustration.jpg"
              alt="Dispatch headquarters"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
              <span className="text-xs font-bold text-white bg-[#F97316] px-3 py-1 rounded-full shadow-sm">
                Central Operations Base
              </span>
              <span className="text-xs text-slate-300 font-mono">25.7617° N, 80.1918° W</span>
            </div>
          </div>

          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="text-xs font-bold text-[#F97316] uppercase tracking-wider">Local Headquarters</span>
              <h3 className="font-heading text-2xl font-black text-white">Central Dispatch &amp; Mobile Warehouse</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Our main dispatch facility is located at {businessConfig.address}. We stage mobile vans with 95% of replacement parts throughout {businessConfig.city} for sub-60 minute arrival.
              </p>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-slate-300">
              <div className="flex items-center gap-2.5">
                <MapPin className="h-4 w-4 text-[#F97316] shrink-0" />
                <span>{businessConfig.address}, {businessConfig.city}, {businessConfig.state} {businessConfig.zipCodes[0]}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="h-4 w-4 text-[#F97316] shrink-0" />
                <span>Monday–Sunday: 7:00 AM – 8:00 PM (24/7 Emergency Dispatch)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-[#F97316] shrink-0" />
                <a href={cleanPhoneHref} className="text-[#F97316] font-bold hover:underline">{businessConfig.phone}</a>
              </div>
            </div>
          </div>
        </section>

        {/* 7. Certified Team - 4 Avatars Horizontal */}
        <section className="space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-1">
            <h2 className="font-heading text-2xl sm:text-3xl font-black text-white">
              Meet Our Senior Field Specialists
            </h2>
            <p className="text-xs text-slate-400 font-medium">
              Every dispatched technician is drug-screened, background-checked, and manufacturer-trained.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {teamMembers.map((m, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-[#0F172A]/80 backdrop-blur-xl border border-white/10 shadow-md text-center space-y-3">
                <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-tr ${m.color} text-white font-black text-xl flex items-center justify-center shadow-lg ring-4 ring-white/10`}>
                  {m.initial}
                </div>
                <div>
                  <h3 className="font-heading font-bold text-sm text-white">{m.name}</h3>
                  <p className="text-xs text-[#F97316] font-semibold">{m.role}</p>
                  <p className="text-[11px] text-slate-400 font-medium mt-1">{m.exp}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 8. The Platform Behind the Service: How ServicePro OS Operates */}
        <section className="rounded-3xl bg-gradient-to-b from-[#0F172A] to-[#0A0F1D] text-white p-8 sm:p-12 space-y-8 shadow-2xl border border-white/10">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-[#F97316] text-xs font-bold uppercase tracking-wider">
              Operating Architecture
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl font-black text-white">
              The Platform Behind the Service: How ServicePro OS Operates
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              ServicePro OS was engineered to replace fragmented legacy dispatching, paper work orders, and delayed billing with a unified, real-time operating system. Designed specifically for high-demand trades, the platform connects homeowners, mobile service fleets, and executive dispatchers into a seamless operational loop.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 text-[#F97316] flex items-center justify-center font-black">
                1
              </div>
              <h3 className="font-heading font-bold text-lg text-white">Intelligent Dispatch &amp; Fleet Telemetry</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Dynamic Gantt-based scheduling that matches job skill requirements with the closest available technician, factoring in real-time travel times and van parts inventory.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 text-[#F97316] flex items-center justify-center font-black">
                2
              </div>
              <h3 className="font-heading font-bold text-lg text-white">Offline-Ready Field Tech Mobile PWA</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Equips technicians on-site with guided diagnostic checklists, digital safety inspections, van stock requisition, and multi-tier estimate builders with digital homeowner signature sign-off.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 text-[#F97316] flex items-center justify-center font-black">
                3
              </div>
              <h3 className="font-heading font-bold text-lg text-white">Self-Service &amp; Live GPS Tracking</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                An interactive 60-second booking engine, live en-route technician vehicle tracking on an interactive map, itemized digital receipts, and secure 1-click Stripe payment settlement.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-slate-400">
            <p>
              Built with strict role-based access control, automated inventory reconciliation, and immutable audit logging for complete operational transparency.
            </p>
            <div className="flex items-center gap-2 text-emerald-400 font-semibold shrink-0">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Real-Time Cloud Telemetry Active</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
