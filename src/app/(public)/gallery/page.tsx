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
  BadgeCheck,
  Building,
  Heart,
  MessageCircle,
  Share2,
  Play,
  Pause,
  SlidersHorizontal,
  Film,
  Grid,
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
  beforeImage?: string;
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
  likes: number;
  commentsCount: number;
}

interface VideoReel {
  id: string;
  title: string;
  duration: string;
  thumbnail: string;
  views: string;
  technician: string;
  description: string;
  serviceSlug: string;
}

const VERIFIED_PROJECTS: WorkOrderProject[] = [
  {
    id: "proj-1",
    title: "5-Ton Carrier Infinity 20 SEER2 Inverter Heat Pump",
    category: "installations",
    categoryLabel: "High-Efficiency Replacement",
    image: "/images/svc-ac-repair.jpg",
    beforeImage: "/images/svc-furnace-repair.jpg",
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
    likes: 48,
    commentsCount: 6,
  },
  {
    id: "proj-2",
    title: "Seasonal 21-Point Condenser Coil Restoration & Drain Clean",
    category: "repairs",
    categoryLabel: "Precision Mechanical Repair",
    image: "/images/svc-ac-tuneup.jpg",
    beforeImage: "/images/svc-emergency-hvac.jpg",
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
    likes: 35,
    commentsCount: 4,
  },
  {
    id: "proj-3",
    title: "Smart Thermostat C-Wire Low Voltage Architecture",
    category: "installations",
    categoryLabel: "Controls & Automation",
    image: "/images/svc-thermostat-install.jpg",
    beforeImage: "/images/svc-ac-repair.jpg",
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
    likes: 52,
    commentsCount: 9,
  },
  {
    id: "proj-4",
    title: "15-Ton Multi-Zone Commercial Rooftop Package Unit Replacement",
    category: "commercial",
    categoryLabel: "Commercial HVAC Engineering",
    image: "/images/svc-commercial-hvac.jpg",
    beforeImage: "/images/svc-furnace-repair.jpg",
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
    likes: 29,
    commentsCount: 3,
  },
  {
    id: "proj-5",
    title: "Negative-Pressure Whole-Home HEPA Air Duct Remediation",
    category: "ducts",
    categoryLabel: "IAQ Remediation",
    image: "/images/svc-duct-cleaning.jpg",
    beforeImage: "/images/svc-emergency-hvac.jpg",
    neighborhood: "Miami Beach (Mid-Beach), FL",
    leadTechnician: "Indoor Air Quality Tech",
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
    likes: 64,
    commentsCount: 11,
  },
  {
    id: "proj-6",
    title: "Precision R-410A Refrigerant Leak Isolation & Electronic Calibration",
    category: "repairs",
    categoryLabel: "Refrigerant & Coil Diagnostics",
    image: "/images/svc-refrigerant-recharge.jpg",
    beforeImage: "/images/svc-ac-repair.jpg",
    neighborhood: "Pinecrest, FL",
    leadTechnician: "Diagnostic Specialist",
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
    likes: 41,
    commentsCount: 5,
  },
];

const VIDEO_REELS: VideoReel[] = [
  {
    id: "reel-1",
    title: "Multi-Stage Inverter Compressor Diagnostic & Micro-Ohm Winding Test",
    duration: "0:48",
    thumbnail: "/images/svc-ac-repair.jpg",
    views: "2.8k",
    technician: "Lead Field Specialist",
    description: "Watch our lead technician pinpoint an internal shorted scroll bypass valve in real-time using high-precision digital telemetry.",
    serviceSlug: "/services/ac-repair",
  },
  {
    id: "reel-2",
    title: "Foaming Alkaline Condenser Coil Deep Chemical Sanitization",
    duration: "0:36",
    thumbnail: "/images/svc-ac-tuneup.jpg",
    views: "4.1k",
    technician: "Senior HVAC Specialist",
    description: "Removing 3 seasons of coastal salt encrustation and micro-debris to restore maximum airflow efficiency across aluminum fins.",
    serviceSlug: "/services/ac-tuneup",
  },
  {
    id: "reel-3",
    title: "Low-Micron Vacuum Decay Test on Dual-Fuel Inverter Circuit",
    duration: "0:52",
    thumbnail: "/images/svc-refrigerant-recharge.jpg",
    views: "1.9k",
    technician: "Diagnostic Specialist",
    description: "Pulling a deep 380-micron vacuum hold with zero rise for 15 minutes prior to exact factory weigh-in of virgin refrigerant charge.",
    serviceSlug: "/services/refrigerant-recharge",
  },
];

export default function RecentWorkPage() {
  const [activeTab, setActiveTab] = React.useState<"posts" | "reels">("posts");
  const [likesState, setLikesState] = React.useState<Record<string, { liked: boolean; count: number }>>(() => {
    const initial: Record<string, { liked: boolean; count: number }> = {};
    VERIFIED_PROJECTS.forEach((p) => {
      initial[p.id] = { liked: false, count: p.likes };
    });
    return initial;
  });
  const [beforeAfterMode, setBeforeAfterMode] = React.useState<Record<string, "after" | "before">>({});
  const [activeModalItem, setActiveModalItem] = React.useState<WorkOrderProject | null>(null);
  const [playingReel, setPlayingReel] = React.useState<string | null>(null);

  const toggleLike = (id: string) => {
    setLikesState((prev) => {
      const current = prev[id] || { liked: false, count: 0 };
      const liked = !current.liked;
      return {
        ...prev,
        [id]: {
          liked,
          count: liked ? current.count + 1 : current.count - 1,
        },
      };
    });
  };

  const toggleBeforeAfter = (id: string) => {
    setBeforeAfterMode((prev) => ({
      ...prev,
      [id]: prev[id] === "before" ? "after" : "before",
    }));
  };

  return (
    <div className="min-h-screen bg-[#0C1523] text-white selection:bg-[#F97316] selection:text-white pb-20">
      <Breadcrumbs items={[{ label: "Field Gallery & Work" }]} />

      {/* Header */}
      <section className="relative bg-[#0C1523] border-b border-white/10 pt-10 pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#F97316]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center space-y-4 relative z-10">
          <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-xs font-bold text-[#F97316] uppercase tracking-wider">
            <BadgeCheck className="w-4 h-4 text-emerald-400" />
            Verified Field Feed &amp; Diagnostics
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Field Installations &amp; Video Reels
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
            Explore live photo dossiers and video reels from recent field calls across South Florida. Review diagnostic measurements, equipment specs, and verified work orders.
          </p>

          {/* Instagram-Style Dual Tabs Switcher */}
          <div className="pt-4 flex items-center justify-center">
            <div className="inline-flex p-1.5 rounded-2xl bg-[#0F172A] border border-white/15 shadow-xl">
              <button
                type="button"
                onClick={() => setActiveTab("posts")}
                className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "posts"
                    ? "bg-[#F97316] text-white shadow-md shadow-orange-500/25"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Grid className="w-4 h-4" />
                <span>Posts &amp; Before/After ({VERIFIED_PROJECTS.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("reels")}
                className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "reels"
                    ? "bg-[#F97316] text-white shadow-md shadow-orange-500/25"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Film className="w-4 h-4" />
                <span>Video Reels ({VIDEO_REELS.length})</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-10">
        {activeTab === "posts" ? (
          /* POSTS FEED: Instagram-Style Cards with Before/After Slider & Likes */
          <div className="space-y-8">
            {VERIFIED_PROJECTS.map((project) => {
              const currentMode = beforeAfterMode[project.id] || "after";
              const currentImage = currentMode === "before" && project.beforeImage ? project.beforeImage : project.image;
              const likeInfo = likesState[project.id] || { liked: false, count: project.likes };

              return (
                <article
                  key={project.id}
                  className="rounded-3xl border border-white/10 bg-[#0F172A]/90 backdrop-blur-xl overflow-hidden shadow-2xl"
                >
                  {/* Post Header: Profile, Name, Badge, Location */}
                  <div className="p-4 sm:p-5 flex items-center justify-between border-b border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-500 to-amber-600 border border-white/15 text-white font-black text-sm flex items-center justify-center shadow-md">
                        {project.leadTechnician.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-white text-sm">
                            {project.leadTechnician}
                          </span>
                          <span className="inline-flex items-center text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 font-bold">
                            <BadgeCheck className="w-3 h-3 mr-0.5 inline" />
                            Verified &#x2713;
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <span className="flex items-center gap-0.5">
                            <MapPin className="w-3 h-3 text-[#F97316]" />
                            {project.neighborhood}
                          </span>
                          <span>&bull;</span>
                          <span className="font-mono text-[11px] text-slate-400">
                            #{project.workOrderId}
                          </span>
                        </div>
                      </div>
                    </div>

                    <span className="text-xs text-slate-400 font-mono hidden sm:inline">
                      {project.completionDate}
                    </span>
                  </div>

                  {/* Post Image Container with Interactive Before/After Toggle */}
                  <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full bg-slate-900 overflow-hidden">
                    <Image
                      src={currentImage}
                      alt={project.title}
                      fill
                      className="object-cover transition-all duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                    {/* Mode Indicator & Toggle Button */}
                    <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => toggleBeforeAfter(project.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/75 border border-white/20 text-white text-xs font-bold backdrop-blur-md hover:bg-black/90 transition-all cursor-pointer shadow-lg"
                      >
                        <SlidersHorizontal className="w-3.5 h-3.5 text-[#F97316]" />
                        <span>Showing: {currentMode === "before" ? "Initial Condition" : "Completed Work"}</span>
                      </button>
                    </div>

                    {/* Category Label */}
                    <div className="absolute bottom-4 left-4 z-10">
                      <span className="px-3 py-1 rounded-full bg-[#F97316] text-white text-xs font-bold uppercase tracking-wider shadow-md">
                        {project.categoryLabel}
                      </span>
                    </div>
                  </div>

                  {/* Social Action Bar (Like, Comment, Share) */}
                  <div className="px-5 py-3 border-b border-white/10 flex items-center justify-between text-slate-300">
                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        onClick={() => toggleLike(project.id)}
                        className={`flex items-center gap-1.5 text-xs font-bold transition-colors cursor-pointer ${
                          likeInfo.liked ? "text-red-500" : "hover:text-red-400"
                        }`}
                        aria-label="Like this post"
                      >
                        <Heart className={`w-5 h-5 ${likeInfo.liked ? "fill-red-500" : ""}`} />
                        <span>{likeInfo.count}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveModalItem(project)}
                        className="flex items-center gap-1.5 text-xs font-bold hover:text-white transition-colors cursor-pointer"
                        aria-label="Comments and engineering details"
                      >
                        <MessageCircle className="w-5 h-5 text-slate-400" />
                        <span>{project.commentsCount} Notes</span>
                      </button>
                    </div>

                    <Button
                      asChild
                      size="sm"
                      className="rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white font-bold text-xs h-8 px-4 shadow-sm"
                    >
                      <Link href={project.bookServiceSlug}>
                        Book Service
                      </Link>
                    </Button>
                  </div>

                  {/* Post Caption Body */}
                  <div className="p-5 sm:p-6 space-y-3">
                    <h3 className="text-base sm:text-lg font-bold text-white">
                      {project.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      <strong className="text-white">Specs:</strong> {project.specs}
                    </p>
                    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-emerald-400 font-semibold flex items-center justify-between flex-wrap gap-2">
                      <span>✓ {project.efficiencyGain}</span>
                      <span className="text-slate-400 font-mono text-[11px]">{project.warranty}</span>
                    </div>

                    <div className="pt-2 flex items-center justify-between text-xs">
                      <button
                        type="button"
                        onClick={() => setActiveModalItem(project)}
                        className="text-orange-400 hover:text-orange-300 font-semibold underline cursor-pointer"
                      >
                        View Full Engineering Case Dossier &rarr;
                      </button>
                      <span className="text-slate-400 font-mono text-[11px]">
                        Certified by: {project.credentials}
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          /* VIDEO REELS FEED: Vertical 9:16 Cards */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {VIDEO_REELS.map((reel) => {
              const isPlaying = playingReel === reel.id;

              return (
                <div
                  key={reel.id}
                  className="rounded-3xl border border-white/10 bg-[#0F172A]/90 overflow-hidden shadow-2xl flex flex-col justify-between"
                >
                  {/* Vertical 9:16 Video Container */}
                  <div className="relative aspect-[9/16] w-full bg-slate-900 overflow-hidden group">
                    <Image
                      src={reel.thumbnail}
                      alt={reel.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Duration Badge & Views */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-xs text-white">
                      <span className="px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md font-mono text-[10px] font-bold border border-white/15">
                        {reel.duration}
                      </span>
                      <span className="px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-bold border border-white/15">
                        {reel.views} views
                      </span>
                    </div>

                    {/* Centered Play/Pause Button */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => setPlayingReel(isPlaying ? null : reel.id)}
                        className="w-14 h-14 rounded-full bg-[#F97316]/90 hover:bg-[#F97316] text-white flex items-center justify-center shadow-xl shadow-orange-500/30 transition-transform hover:scale-110 cursor-pointer"
                        aria-label={isPlaying ? "Pause reel" : "Play reel"}
                      >
                        {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
                      </button>
                    </div>

                    {/* Bottom Title Overlay */}
                    <div className="absolute bottom-3 left-3 right-3 space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400">
                        {reel.technician}
                      </span>
                      <h4 className="text-xs font-bold text-white line-clamp-2 leading-tight">
                        {reel.title}
                      </h4>
                    </div>
                  </div>

                  {/* Reel Footer & CTA */}
                  <div className="p-4 space-y-3">
                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                      {reel.description}
                    </p>
                    <Button asChild size="sm" className="w-full rounded-xl bg-white/10 hover:bg-[#F97316] text-white font-bold text-xs">
                      <Link href={reel.serviceSlug}>
                        Request Diagnostic &rarr;
                      </Link>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Engineering Dossier Modal */}
      {activeModalItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="max-w-2xl w-full bg-[#0F172A] border border-white/20 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setActiveModalItem(null)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
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
                Location: {activeModalItem.neighborhood} &bull; Lead Tech: {activeModalItem.leadTechnician} ({activeModalItem.credentials})
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
