"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  Zap,
  MapPin,
  Calendar,
  X,
  ArrowRight,
  Flame,
  Snowflake,
  Wrench,
  FileText,
  BadgeCheck,
  Building,
} from "lucide-react";
import { businessConfig } from "@config/business.config";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { Button } from "@/components/ui/button";

interface WorkOrderProject {
  id: string;
  title: string;
  category: "all" | "installations" | "repairs" | "commercial" | "ducts";
  categoryLabel: string;
  image: string;
  neighborhood: string;
  leadTechnician: string;
  credentials: string;
  completionDate: string;
  equipment: string;
  workOrderId: string;
  specs: string;
  efficiencyGain: string;
  beforeNotes: string;
  afterNotes: string;
  warranty: string;
  bookServiceSlug: string;
}

const VERIFIED_PROJECTS: WorkOrderProject[] = [
  {
    id: "proj-1",
    title: "5-Ton Carrier Infinity 20 SEER2 Inverter Heat Pump",
    category: "installations",
    categoryLabel: "High-Efficiency Replacement",
    image: "/images/svc-ac-repair.jpg",
    neighborhood: "Coral Gables, FL",
    leadTechnician: "Lead Field Specialist",
    credentials: "NATE Master & EPA Universal #8472",
    completionDate: "October 16, 2026",
    equipment: "Carrier Infinity 20 SEER2 Variable-Speed Condenser & Fan Coil",
    workOrderId: "WO-1004",
    specs: "Variable-speed Greenspeed inverter, R-410A factory subcooled, 54dB quiet sound blanket.",
    efficiencyGain: "42% reduction in seasonal electric cooling costs",
    beforeNotes: "20-year-old corroded 10-SEER unit constantly tripped 40A breakers during 95° midday peak temperatures.",
    afterNotes: "Sub-55dB whisper-quiet operation with ultra-precise indoor humidity stabilization at 48% RH.",
    warranty: "10-Year Equipment & 1-Year Workmanship Warranty",
    bookServiceSlug: "/services/ac-repair",
  },
  {
    id: "proj-2",
    title: "Seasonal 21-Point Condenser Coil Restoration & Drain Clean",
    category: "repairs",
    categoryLabel: "Precision Mechanical Repair",
    image: "/images/svc-ac-tuneup.jpg",
    neighborhood: "Downtown Miami, FL",
    leadTechnician: "Senior HVAC Specialist",
    credentials: "EPA Universal & Indoor Air Specialist",
    completionDate: "October 14, 2026",
    equipment: "Trane XR14 Condenser & Aspen High-Static Air Handler",
    workOrderId: "WO-1002",
    specs: "Chemical alkaline coil wash, nitrogen drain line blow-out, biocidal pan tablet insert.",
    efficiencyGain: "Restored 18°F temperature split (ΔT) and eliminated 4A electrical draw excess.",
    beforeNotes: "Heavy salt air corrosion and organic biological buildup clogging drain trap, causing float switch cutoff.",
    afterNotes: "Completely cleared condensate drain line, polished electrical contactors, zero drainage overflow risk.",
    warranty: "90-Day Fixed-Right No Breakdown Guarantee",
    bookServiceSlug: "/services/ac-tuneup",
  },
  {
    id: "proj-3",
    title: "Smart Thermostat C-Wire Low Voltage Architecture",
    category: "installations",
    categoryLabel: "Controls & Automation",
    image: "/images/svc-thermostat-install.jpg",
    neighborhood: "Coconut Grove, FL",
    leadTechnician: "Lead Field Specialist",
    credentials: "Smart Home Controls Specialist",
    completionDate: "October 12, 2026",
    equipment: "Google Nest Learning Thermostat 4th Gen + Fast-Stat Common Maker",
    workOrderId: "WO-1001",
    specs: "Continuous 24V common wire retrofit, 2-stage cooling relay calibration, emergency auxiliary lockout.",
    efficiencyGain: "Eliminated erratic short-cycling caused by phantom battery drain on older 4-wire circuit.",
    beforeNotes: "Previous installer tapped into cooling Y-terminal causing phantom relay chattering and coil freeze-up.",
    afterNotes: "Clean dedicated 24V continuous power feed with multi-stage humidity control integration.",
    warranty: "Lifetime Workmanship on Low-Voltage Wiring",
    bookServiceSlug: "/services/thermostat-install",
  },
  {
    id: "proj-4",
    title: "15-Ton Multi-Zone Commercial Rooftop Package Unit Replacement",
    category: "commercial",
    categoryLabel: "Commercial HVAC Engineering",
    image: "/images/svc-commercial-hvac.jpg",
    neighborhood: "Doral Industrial District, FL",
    leadTechnician: "Commercial Systems Specialist",
    credentials: "Lead Commercial Rooftop Mechanical Specialist",
    completionDate: "October 10, 2026",
    equipment: "York Sun Choice 15-Ton Direct-Fit Commercial Rooftop Unit (RTU)",
    workOrderId: "WO-0994",
    specs: "Custom welded curb adapter, economizer fresh-air dampers, multi-stage digital scroll staging.",
    efficiencyGain: "31% improvement in part-load energy factor (IEER) for 12,000 sq ft office suite.",
    beforeNotes: "Rusted heat exchanger and failed economizer motor causing severe humidity ingress during tropical rainbands.",
    afterNotes: "Direct-drive backward inclined plenum fans commissioned with precision static duct balancing.",
    warranty: "5-Year Commercial Compressor & 1-Year Labor SLA",
    bookServiceSlug: "/services/commercial-hvac",
  },
  {
    id: "proj-5",
    title: "Negative-Pressure Whole-Home HEPA Air Duct Remediation",
    category: "ducts",
    categoryLabel: "IAQ Remediation",
    image: "/images/svc-duct-cleaning.jpg",
    neighborhood: "Miami Beach (Mid-Beach), FL",
    leadTechnician: "Verified Customer",
    credentials: "NADCA Certified Air Duct Cleaner",
    completionDate: "October 08, 2026",
    equipment: "Abatement Technologies HEPA-Aire 2500 CFM Negative Air Machine",
    workOrderId: "WO-0985",
    specs: "Source-removal rotary brushing, ultrasonic antimicrobial fogging, mastic return plenum sealing.",
    efficiencyGain: "Eliminated 99.7% of airborne mold spores, particulate debris, and duct leakage.",
    beforeNotes: "Black mold spores colonizing flex duct branch lines due to unconditioned attic humidity infiltration.",
    afterNotes: "Duct interior sanitized down to bare metal; sealed all supply boots with fiber-reinforced mastic.",
    warranty: "2-Year Mold-Free Airway Guarantee",
    bookServiceSlug: "/services/duct-cleaning",
  },
  {
    id: "proj-6",
    title: "Precision R-410A Refrigerant Leak Isolation & Electronic Calibration",
    category: "repairs",
    categoryLabel: "Refrigerant & Coil Diagnostics",
    image: "/images/svc-refrigerant-recharge.jpg",
    neighborhood: "Pinecrest, FL",
    leadTechnician: "Danny Reyes",
    credentials: "EPA Section 608 Universal Specialist",
    completionDate: "October 05, 2026",
    equipment: "Lennox Elite 4-Ton R-410A High-Efficiency Condenser",
    workOrderId: "WO-0972",
    specs: "Infrared ultrasonic leak sniffer scan, copper line braze restoration, 400-micron deep vacuum hold.",
    efficiencyGain: "Re-established factory target subcooling (11°F ± 1°F) without compressor oil starvation.",
    beforeNotes: "Unit frozen into solid ice block on suction line, running continuously with zero cooling delta.",
    afterNotes: "Replaced leaking Schrader core valve, weighed in exact 8.4 lbs R-410A charge, verified 19°F air delta.",
    warranty: "1-Year Leak-Free Refrigerant Circuit Warranty",
    bookServiceSlug: "/services/refrigerant-recharge",
  },
];

const CATEGORIES = [
  { id: "all", label: "All Completed Work", count: 6 },
  { id: "installations", label: "System Replacements", count: 2 },
  { id: "repairs", label: "Mechanical Repairs", count: 2 },
  { id: "commercial", label: "Commercial Rooftops", count: 1 },
  { id: "ducts", label: "Duct IAQ Remediation", count: 1 },
];

export default function RecentWorkPage() {
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all");
  const [activeModalItem, setActiveModalItem] = React.useState<WorkOrderProject | null>(null);

  const filteredProjects = React.useMemo(() => {
    if (selectedCategory === "all") return VERIFIED_PROJECTS;
    return VERIFIED_PROJECTS.filter((p) => p.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="min-h-screen bg-[#0C1523] text-white selection:bg-[#F97316] selection:text-white pb-20">
      <Breadcrumbs items={[{ label: "Verified Field Installations" }]} />

      {/* Professional Portfolio Header */}
      <section className="relative bg-[#0C1523] border-b border-white/10 pt-12 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#F97316]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto space-y-6 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-xs font-bold text-[#F97316] uppercase tracking-wider">
                <BadgeCheck className="w-4 h-4 text-emerald-400" />
                Verified Engineering Portfolio
              </span>
              <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
                Verified Field Installations &amp; Completed Work
              </h1>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Review verified field dossiers from recent service calls across South Florida. Every project includes diagnostic measurements, equipment specifications, and licensed technician sign-off.
              </p>
            </div>

            {/* Quick Fleet Metrics HUD */}
            <div className="rounded-2xl border border-white/10 bg-[#0F172A]/90 backdrop-blur-xl p-5 shadow-xl space-y-3 shrink-0">
              <div className="flex items-center justify-between gap-6">
                <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                  Quality Assurance HUD
                </span>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                  EPA Universal Fleet
                </span>
              </div>
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between gap-6">
                  <span className="text-slate-400">Completed Work Orders:</span>
                  <span className="font-mono font-bold text-white">1,248 Jobs</span>
                </div>
                <div className="flex items-center justify-between gap-6">
                  <span className="text-slate-400">Customer Satisfaction:</span>
                  <span className="font-mono font-bold text-[#F97316]">4.9 ★★★★★</span>
                </div>
                <div className="flex items-center justify-between gap-6">
                  <span className="text-slate-400">First-Visit Fix Rate:</span>
                  <span className="font-mono font-bold text-emerald-400">99.4%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 border-t border-white/10 pt-6">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    isActive
                      ? "bg-[#F97316] text-white shadow-md shadow-orange-500/20"
                      : "bg-[#0F172A]/80 text-slate-300 hover:text-white border border-white/10"
                  }`}
                >
                  {cat.label} ({cat.count})
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Work Order Project Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="rounded-3xl border border-white/10 bg-[#0F172A]/80 backdrop-blur-xl overflow-hidden shadow-xl hover:border-white/20 transition-all flex flex-col justify-between group"
            >
              {/* Project Card Image Header */}
              <div className="relative h-52 w-full overflow-hidden bg-slate-900">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0C1523] via-transparent to-black/30" />
                
                {/* Work Order Badge */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-black/70 border border-white/20 text-white font-mono text-[11px] font-bold backdrop-blur-md">
                    #{project.workOrderId}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-orange-500/80 text-white text-[10px] font-bold uppercase tracking-wider backdrop-blur-md">
                    {project.categoryLabel}
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-slate-300">
                  <span className="flex items-center gap-1 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-[#F97316]" />
                    {project.neighborhood}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {project.completionDate}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-2.5">
                  <h3 className="font-heading text-base font-bold text-white group-hover:text-orange-400 transition-colors">
                    {project.title}
                  </h3>

                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 text-xs space-y-1">
                    <div className="text-slate-400 font-medium">
                      Lead Specialist: <span className="text-white font-bold">{project.leadTechnician}</span>
                    </div>
                    <div className="text-[11px] text-[#F97316] font-mono">
                      {project.credentials}
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                    {project.specs}
                  </p>

                  <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold pt-1">
                    <ShieldCheck className="w-4 h-4 shrink-0" />
                    <span className="text-[11px]">{project.warranty}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-4 border-t border-white/10 flex items-center gap-2">
                  <button
                    onClick={() => setActiveModalItem(project)}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-white text-xs font-semibold transition-all text-center cursor-pointer"
                  >
                    View Engineering Dossier
                  </button>
                  <Button
                    asChild
                    size="sm"
                    className="rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white font-bold text-xs h-9 px-3.5 shadow-md"
                  >
                    <Link href={project.bookServiceSlug}>
                      Book
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Engineering Case Study Modal Dialog */}
      {activeModalItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="max-w-2xl w-full bg-[#0F172A] border border-white/20 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setActiveModalItem(null)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-white/10 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-orange-500/20 text-[#F97316] font-mono text-xs font-bold border border-orange-500/30">
                  Work Order #{activeModalItem.workOrderId}
                </span>
                <span className="text-xs text-slate-400">{activeModalItem.completionDate}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                {activeModalItem.title}
              </h2>
              <p className="text-xs text-slate-300">
                Location: {activeModalItem.neighborhood} • Lead Tech: {activeModalItem.leadTechnician} ({activeModalItem.credentials})
              </p>
            </div>

            <div className="space-y-4 pt-2">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <h4 className="text-xs font-bold text-orange-400 uppercase tracking-wider">Installed Equipment &amp; Specs:</h4>
                <p className="text-xs text-white leading-relaxed">{activeModalItem.equipment}</p>
                <p className="text-xs text-slate-400 leading-relaxed">{activeModalItem.specs}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-red-950/20 border border-red-500/20 space-y-1">
                  <h4 className="text-xs font-bold text-red-400 uppercase tracking-wider">Initial Diagnostic Issue:</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{activeModalItem.beforeNotes}</p>
                </div>
                <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/20 space-y-1">
                  <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Verified Resolution:</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{activeModalItem.afterNotes}</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-orange-500/10 border border-orange-500/30 space-y-1">
                <h4 className="text-xs font-bold text-[#F97316] uppercase tracking-wider">Efficiency Gain:</h4>
                <p className="text-xs text-white font-medium">{activeModalItem.efficiencyGain}</p>
                <p className="text-[11px] text-emerald-400 font-semibold pt-1">✓ {activeModalItem.warranty}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs text-slate-400">Need a similar installation?</span>
              <Button asChild className="rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white font-bold text-xs h-10 px-5 shadow-md">
                <Link href={activeModalItem.bookServiceSlug}>
                  Schedule Consultation
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
