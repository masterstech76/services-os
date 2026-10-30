"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import {
  Star,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  ArrowLeft,
  ArrowRight,
  MapPin,
  Clock,
  Sparkles,
  Wrench,
  Truck,
  ThumbsUp,
  Award,
  Send,
  MessageSquare,
  ChevronRight,
  Filter,
} from "lucide-react";
import { businessConfig } from "@config/business.config";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { BookingMiniWindowModal } from "@/components/booking/BookingMiniWindowModal";

interface WorkerReview {
  id: string;
  author: string;
  neighborhood: string;
  service: string;
  workOrder: string;
  rating: number;
  date: string;
  headline: string;
  comment: string;
  problemSummary?: string;
  resolutionSummary?: string;
  techReply?: string;
  helpfulCount: number;
}

interface WorkerProfile {
  id: string;
  slug: string;
  name: string;
  title: string;
  roleType: string;
  rating: number;
  totalReviews: number;
  onTimeRate: string;
  experienceYears: string;
  vanNumber: string;
  vanModel: string;
  avatar: string;
  bio: string;
  specialties: string[];
  certifications: string[];
  reviews: WorkerReview[];
}

const WORKERS: Record<string, WorkerProfile> = {
  "carlos-mendez": {
    id: "tech-1",
    slug: "carlos-mendez",
    name: "Lead Field Specialist",
    title: "Lead Master HVAC Diagnostic Specialist",
    roleType: "Master Lead Technician",
    rating: 4.96,
    totalReviews: 148,
    onTimeRate: "99.4%",
    experienceYears: "12+ Years",
    vanNumber: "Fleet Unit Alpha",
    vanModel: "2024 Ford Transit High-Roof",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80",
    bio: "EPA Universal 608 and NATE-certified master technician specializing in tricky electrical diagnostics, inverter heat pump diagnostics, and 24/7 emergency compressor troubleshooting across Miami-Dade.",
    specialties: ["Complex Diagnostics", "Inverter Systems", "Capacitor & Fan Overhauls", "Emergency Restorations"],
    certifications: ["EPA Universal Section 608", "NATE Master Certified", "OSHA 30 Safety Standard", "Factory Trane/Carrier Trained"],
    reviews: [
      {
        id: "rev-1",
        author: "Verified Customer",
        neighborhood: "Brickell, Miami, FL",
        service: "Same-Day AC Diagnostic & Capacitor Overhaul",
        workOrder: "#WO-1004",
        rating: 5,
        date: "October 14, 2026",
        headline: "Fast Sunday dispatch and saved us from unbearable 92° heat",
        comment:
          "AC completely ceased blowing cold air on a scorching 92° Sunday afternoon. I booked through the portal at 11:00 AM, and Carlos arrived in his fully stocked van by 11:35 AM. He immediately identified the blown dual run capacitor, tested compressor winding impedance, and had cool 56° air circulating within 40 minutes. Zero surprise fees, exact upfront quote before touch.",
        problemSummary: "Compressor hummed without starting, indoor blower blowing warm humid air.",
        resolutionSummary: "Installed heavy-duty Titan HD 45/5 MFD dual run capacitor, cleaned condenser coil fins, calibrated thermostat.",
        techReply: "Glad we got that capacitor swapped before the afternoon peak heat David! Enjoy that crisp 56° air! 🔧❄️",
        helpfulCount: 24,
      },
      {
        id: "rev-3",
        author: "Service Client V",
        neighborhood: "Coral Gables, FL",
        service: "Smart Thermostat Installation & 24V Bridge",
        workOrder: "#WO-1001",
        rating: 5,
        date: "September 29, 2026",
        headline: "Seamless Google Nest C-Wire installation in older historic home",
        comment:
          "Our 1950s Coral Gables house did not have a dedicated 24V common wire (C-wire) for modern smart thermostats. Carlos fished the new low-voltage wire cleanly, installed our Nest Learning Thermostat, and paired it with our phones before leaving. Transparent pricing with deposit applied directly to final bill.",
        problemSummary: "Intermittent power cycling and battery drainage on DIY smart thermostat install.",
        resolutionSummary: "Installed 24V fast-stat transformer bridge and dedicated C-wire terminal at the air handler.",
        techReply: "That historic wall cavity was tight, but that 24V bridge worked like a charm! Enjoy remote climate control!",
        helpfulCount: 16,
      },
      {
        id: "rev-5",
        author: "Service Client Q",
        neighborhood: "Doral, FL",
        service: "Emergency Condenser Fan Motor Replacement",
        workOrder: "#WO-0988",
        rating: 5,
        date: "September 15, 2026",
        headline: "Late night emergency repair during severe heat wave",
        comment:
          "Our central AC stopped blowing cold at 9:30 PM on a Tuesday with a 3-month-old infant in the home. ServicePro OS dispatch had Carlos at our door within 45 minutes. He diagnosed a locked rotor on the condenser fan, installed a rescue motor to get cold air circulating, and returned the next morning with the exact OEM replacement. Lifesavers.",
        problemSummary: "Condenser fan motor thermal overload trip resulting in complete system shutdown.",
        resolutionSummary: "Installed universal rescue motor, restored airflow, flushed primary drain line, and verified 18-degree delta split.",
        techReply: "Babies and Florida heat don't mix! Very proud our emergency truck was pre-stocked and ready to go Anthony!",
        helpfulCount: 38,
      },
    ],
  },
  "marcus-vance": {
    id: "tech-2",
    slug: "marcus-vance",
    name: "Senior HVAC Specialist",
    title: "Senior AC Maintenance & IAQ Diagnostic Specialist",
    roleType: "Senior Maintenance Specialist",
    rating: 4.94,
    totalReviews: 112,
    onTimeRate: "99.1%",
    experienceYears: "9+ Years",
    vanNumber: "Fleet Unit Beta",
    vanModel: "2023 Ford Transit Cargo",
    avatar: "/images/test-mike-1.jpg",
    bio: "Passionate preventative maintenance and indoor air quality specialist. Expert in static pressure balancing, micro-leak detection, and microbial coil treatments.",
    specialties: ["Seasonal Tune-Ups", "Indoor Air Quality", "Condensate Line Clear", "Micro-Leak Testing"],
    certifications: ["EPA Universal 608", "NATE Air Quality Specialist", "Florida HVAC Journeyman"],
    reviews: [
      {
        id: "rev-2",
        author: "Service Client U",
        neighborhood: "Downtown Miami, FL",
        service: "Seasonal AC Tune-Up & Precision Inspection",
        workOrder: "#WO-1002",
        rating: 5,
        date: "October 8, 2026",
        headline: "Unmatched professionalism & detailed photo inspection report",
        comment:
          "We take preventive maintenance seriously in Florida. Marcus arrived on time wearing shoe covers. He performed a 21-point inspection, flushed our condensate drain with biocidal cleaner, rinsed the outdoor coils, and emailed high-res before/after photos with motor amp draw readings on his tablet. Best HVAC contractor experience in 10 years in South Florida.",
        problemSummary: "Preventative seasonal maintenance check before high-humidity summer peaks.",
        resolutionSummary: "Comprehensive 21-point check, drain line nitrogen purge, electrical contact polishing, air filter renewal.",
        techReply: "Those coils were definitely due for that deep rinse! Happy to keep your energy bills low Elena!",
        helpfulCount: 31,
      },
      {
        id: "rev-4",
        author: "Service Client S",
        neighborhood: "Coconut Grove, FL",
        service: "Refrigerant Schrader Valve Repair & Precision Recharge",
        workOrder: "#WO-0994",
        rating: 5,
        date: "September 21, 2026",
        headline: "Honest diagnosis when other contractors quoted an $8,000 replacement",
        comment:
          "Another company insisted our entire 6-year-old system was finished and needed an $8,000 replacement. ServicePro OS came out for a second opinion, found a microscopic Schrader core leak at the low-side service valve, replaced the valve core, pulled a 450-micron deep vacuum, and restored optimal R-410A charge. Honest contractors are rare — Marcus is the real deal.",
        problemSummary: "Evaporator coil frosting over with sub-normal low-side suction pressure.",
        resolutionSummary: "Schrader service valve replacement, nitrogen pressure test to 350 PSI, precision subcooling recharge.",
        techReply: "Always test before you replace! So glad we saved you thousands of dollars Sophia!",
        helpfulCount: 42,
      },
    ],
  },
  "elena-rivera": {
    id: "tech-3",
    slug: "elena-rivera",
    name: "Commercial Systems Specialist",
    title: "Commercial HVAC & Clean Room Air Quality Specialist",
    roleType: "Commercial Lead Mechanic",
    rating: 4.98,
    totalReviews: 94,
    onTimeRate: "99.8%",
    experienceYears: "11+ Years",
    vanNumber: "Fleet Unit Gamma",
    vanModel: "2024 Ford Transit Heavy Duty",
    avatar: "/images/test-sarah-1.jpg",
    bio: "Lead commercial specialist handling rooftop packaged units (RTUs), chillers, and large residential VRF zoning systems with precision thermal airflow balancing.",
    specialties: ["Commercial RTU", "Duct IAQ Sanitize", "VRF Zoning", "Chiller Diagnostics"],
    certifications: ["EPA Universal 608", "Commercial Refrigeration Tech", "OSHA 30", "ASHRAE Standard Specialist"],
    reviews: [
      {
        id: "rev-6",
        author: "Service Client W",
        neighborhood: "Miami Beach, FL",
        service: "Commercial Rooftop RTU Emergency Blower Repair",
        workOrder: "#WO-0972",
        rating: 5,
        date: "September 8, 2026",
        headline: "Saved our boutique hotel dining room during dinner rush",
        comment:
          "Our rooftop packaged unit started squealing loudly and tripping the breaker at 4:30 PM just before dining service. Elena arrived with rooftop climbing harness, replaced the worn blower belt and seized bearings within an hour. Professional, fearless, and extremely knowledgeable.",
        problemSummary: "Blower belt snapped, motor pulley out of alignment causing high amp draw.",
        resolutionSummary: "Replaced dual V-belts, aligned pulleys with laser tool, greased bearings, verified 400 CFM/ton airflow.",
        techReply: "Glad the hotel guests enjoyed a comfortable dinner Robert! Happy to keep your rooftop running smooth!",
        helpfulCount: 29,
      },
    ],
  },
  "david-kim": {
    id: "tech-4",
    slug: "david-kim",
    name: "Service Client H",
    title: "Master Heat Pump & Inverter Systems Specialist",
    roleType: "Senior Installation Mechanic",
    rating: 4.92,
    totalReviews: 78,
    onTimeRate: "98.9%",
    experienceYears: "8+ Years",
    vanNumber: "Fleet Unit Delta",
    vanModel: "2023 Ford Transit Cargo",
    avatar: "/images/avatar-david.jpg",
    bio: "Specialist in high-efficiency heat pumps, ductless mini-splits, and smart variable-speed ECM motor upgrades for modern eco-conscious homeowners.",
    specialties: ["Mini-Split Inverters", "Heat Pump Reversals", "ECM Blower Motors", "SEER2 Optimizations"],
    certifications: ["EPA Universal 608", "Mitsubishi Diamond Certified", "Daikin Inverter Specialist"],
    reviews: [
      {
        id: "rev-7",
        author: "Service Client W",
        neighborhood: "Kendall, FL",
        service: "Ductless Mini-Split Installation & Commissioning",
        workOrder: "#WO-0965",
        rating: 5,
        date: "August 28, 2026",
        headline: "Flawless garage conversion mini-split installation",
        comment:
          "David installed a 18,000 BTU dual-zone ductless mini-split in our garage home office conversion. Line sets were hidden cleanly in exterior slim ducts, power was pulled from the sub-panel safely, and the unit is whisper-quiet. Electricity bill barely nudged.",
        problemSummary: "Unconditioned garage room requiring independent high-efficiency cooling.",
        resolutionSummary: "Installed 20 SEER2 multi-zone heat pump, vacuumed line sets to 250 microns, tested condensation gravity drain.",
        techReply: "That mini-split is whisper quiet Jessica! Enjoy that air-conditioned workspace!",
        helpfulCount: 19,
      },
    ],
  },
};

export default function WorkerReviewsProfilePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const rawId = (params?.id ?? "").toLowerCase();

  // Resolve alias: e.g. rev-1 -> carlos-mendez, rev-2 -> marcus-vance, tech-1 -> carlos-mendez
  let workerKey = "carlos-mendez";
  if (rawId.includes("marcus") || rawId === "rev-2" || rawId === "rev-4" || rawId === "tech-2") {
    workerKey = "marcus-vance";
  } else if (rawId.includes("elena") || rawId === "rev-6" || rawId === "tech-3") {
    workerKey = "elena-rivera";
  } else if (rawId.includes("david") || rawId === "rev-7" || rawId === "tech-4") {
    workerKey = "david-kim";
  } else if (rawId in WORKERS) {
    workerKey = rawId;
  }

  const worker = WORKERS[workerKey] || WORKERS["carlos-mendez"];
  const [reviewsList, setReviewsList] = React.useState<WorkerReview[]>(worker.reviews);

  // Filter state
  const [filterRating, setFilterRating] = React.useState<number | "all">("all");

  // Interactive review submission form state
  const [reviewAuthor, setReviewAuthor] = React.useState("");
  const [reviewNeighborhood, setReviewNeighborhood] = React.useState("");
  const [reviewWorkOrder, setReviewWorkOrder] = React.useState("");
  const [reviewRating, setReviewRating] = React.useState(5);
  const [reviewHeadline, setReviewHeadline] = React.useState("");
  const [reviewComment, setReviewComment] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [reviewSuccess, setReviewSuccess] = React.useState(false);
  const [bookingModalOpen, setBookingModalOpen] = React.useState(false);

  // Reset reviews if worker changes
  React.useEffect(() => {
    setReviewsList(worker.reviews);
    setReviewSuccess(false);
  }, [worker]);

  const filteredReviews = reviewsList.filter((r) => {
    if (filterRating === "all") return true;
    return r.rating === filterRating;
  });

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      const newReview: WorkerReview = {
        id: `rev-user-${Date.now()}`,
        author: reviewAuthor || "Verified Homeowner",
        neighborhood: reviewNeighborhood || "Miami, FL",
        service: "Verified Field Service Visit",
        workOrder: reviewWorkOrder ? (reviewWorkOrder.startsWith("#") ? reviewWorkOrder : `#${reviewWorkOrder}`) : `#WO-${Math.floor(1000 + Math.random() * 9000)}`,
        rating: reviewRating,
        date: "Just now",
        headline: reviewHeadline || "Excellent, prompt and honest service!",
        comment: reviewComment,
        helpfulCount: 1,
        techReply: `Thank you for taking the time to share your feedback ${reviewAuthor.split(" ")[0]}! It was an absolute pleasure servicing your home. — ${worker.name}`,
      };
      setReviewsList([newReview, ...reviewsList]);
      setIsSubmitting(false);
      setReviewSuccess(true);
      setReviewComment("");
      setReviewHeadline("");
      setReviewWorkOrder("");
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#0C1523] text-white selection:bg-[#F97316] selection:text-white pb-24">
      <Breadcrumbs
        items={[
          { label: "Verified Reviews", href: "/reviews" },
          { label: `${worker.name} — Profile & Reviews` },
        ]}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-10">
        {/* Navigation & Other Technicians Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <Link
            href="/reviews"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300 hover:text-white transition-all w-fit"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>&larr; All Customer Reviews</span>
          </Link>

          {/* Quick Switch Between Workers */}
          <div className="flex items-center gap-2 overflow-x-auto text-xs pb-1">
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[11px] shrink-0">
              Switch Pro:
            </span>
            {Object.values(WORKERS).map((w) => (
              <Link
                key={w.slug}
                href={`/reviews/${w.slug}`}
                className={`px-3 py-1.5 rounded-full font-semibold transition-all shrink-0 ${
                  w.slug === worker.slug
                    ? "bg-[#F97316] text-white shadow-sm"
                    : "bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                {w.name.split(" ")[0]} ({w.rating}★)
              </Link>
            ))}
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            1. WORKER HERO PROFILE CARD
        ───────────────────────────────────────────────────────────── */}
        <div className="bg-[#0F172A]/90 border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-[#F97316]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            {/* Worker Avatar & Fast Facts */}
            <div className="lg:col-span-4 flex flex-col items-center sm:items-start text-center sm:text-left space-y-4">
              <div className="relative">
                <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl overflow-hidden border-2 border-orange-500/50 shadow-2xl relative bg-black/40">
                  <img
                    src={worker.avatar}
                    alt={worker.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="absolute -bottom-2 -right-2 px-3 py-1 rounded-full bg-[#F97316] text-white text-[11px] font-black uppercase tracking-wider shadow-md">
                  {worker.vanNumber}
                </span>
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#F97316]">
                  {worker.roleType}
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                  {worker.name}
                </h1>
                <p className="text-xs text-slate-400 mt-0.5">{worker.title}</p>
              </div>

              {/* Star Rating Badge */}
              <div className="flex items-center gap-2">
                <div className="flex items-center text-[#F97316] gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#F97316]" />
                  ))}
                </div>
                <span className="text-lg font-black text-white font-mono">{worker.rating}</span>
                <span className="text-xs text-slate-400 font-semibold">
                  ({worker.totalReviews} verified reviews)
                </span>
              </div>
            </div>

            {/* Worker Credentials, Stats & Dispatch CTA */}
            <div className="lg:col-span-8 space-y-6">
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {worker.bio}
              </p>

              {/* Key Metric Chips */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Experience</span>
                  <span className="text-base font-extrabold text-white mt-0.5 block">{worker.experienceYears}</span>
                </div>
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">On-Time Arrival</span>
                  <span className="text-base font-extrabold text-emerald-400 mt-0.5 block">{worker.onTimeRate}</span>
                </div>
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Service Vehicle</span>
                  <span className="text-base font-extrabold text-white mt-0.5 block">{worker.vanNumber}</span>
                </div>
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">5-Star Ratio</span>
                  <span className="text-base font-extrabold text-[#F97316] mt-0.5 block">99.2%</span>
                </div>
              </div>

              {/* Verified Badges & Certifications */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Active Trade Credentials &amp; Specializations:
                </span>
                <div className="flex flex-wrap gap-2">
                  {worker.certifications.map((cert) => (
                    <span
                      key={cert}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-semibold"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{cert}</span>
                    </span>
                  ))}
                  {worker.specialties.map((spec) => (
                    <span
                      key={spec}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-orange-500/10 border border-orange-500/25 text-[#F97316] text-xs font-semibold"
                    >
                      <Wrench className="w-3.5 h-3.5" />
                      <span>{spec}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Booking CTA Button (Triggers Mini Window Modal) */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
                <button
                  type="button"
                  onClick={() => setBookingModalOpen(true)}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white font-bold text-xs sm:text-sm shadow-xl shadow-orange-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer group"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book {worker.name} (Open Mini Window)</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
                <span className="text-xs text-slate-400">
                  Instant dispatch window · 100% credited diagnostic fee · Zero risk.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            2. REVIEWS FEATURE STREAM & FILTER
        ───────────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Column 1: Review Stream (lg:col-span-8) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                  <span>Homeowner Reviews for {worker.name}</span>
                  <span className="text-xs font-mono font-bold text-[#F97316] bg-orange-500/10 px-2.5 py-0.5 rounded-full border border-orange-500/20">
                    {filteredReviews.length}
                  </span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Verified customer feedback collected automatically post-service.
                </p>
              </div>

              {/* Filter Rating Tabs */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/40 border border-white/10 text-xs">
                <button
                  type="button"
                  onClick={() => setFilterRating("all")}
                  className={`px-3 py-1 rounded-lg font-bold transition-all ${
                    filterRating === "all" ? "bg-[#F97316] text-white shadow" : "text-slate-400 hover:text-white"
                  }`}
                >
                  All ({reviewsList.length})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterRating(5)}
                  className={`px-3 py-1 rounded-lg font-bold transition-all flex items-center gap-1 ${
                    filterRating === 5 ? "bg-[#F97316] text-white shadow" : "text-slate-400 hover:text-white"
                  }`}
                >
                  <span>5 Stars</span>
                  <Star className="w-3 h-3 fill-current" />
                </button>
              </div>
            </div>

            {/* Review Cards List */}
            <div className="space-y-4">
              {filteredReviews.map((rev) => (
                <div
                  key={rev.id}
                  className="rounded-3xl border border-white/10 bg-[#0F172A]/85 p-6 sm:p-8 space-y-4 shadow-xl backdrop-blur-xl hover:border-orange-500/30 transition-all"
                >
                  <div className="flex items-start justify-between flex-wrap gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{rev.author}</span>
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Verified Homeowner</span>
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#F97316]" />
                          <span>{rev.neighborhood}</span>
                        </span>
                        <span>&bull;</span>
                        <span className="font-mono text-orange-400 font-bold">{rev.workOrder}</span>
                        <span>&bull;</span>
                        <span>{rev.date}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-[#F97316]">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-[#F97316]" />
                      ))}
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-white leading-snug">
                    &ldquo;{rev.headline}&rdquo;
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {rev.comment}
                  </p>

                  {/* Problem & Resolution Breakdown (if present) */}
                  {(rev.problemSummary || rev.resolutionSummary) && (
                    <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      {rev.problemSummary && (
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Reported Issue:</span>
                          <span className="text-slate-300 mt-0.5 block">{rev.problemSummary}</span>
                        </div>
                      )}
                      {rev.resolutionSummary && (
                        <div>
                          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">Technician Fix:</span>
                          <span className="text-slate-300 mt-0.5 block">{rev.resolutionSummary}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Technician Verified Reply */}
                  {rev.techReply && (
                    <div className="p-4 rounded-2xl bg-orange-500/10 border border-orange-500/25 space-y-1.5 text-xs">
                      <div className="flex items-center gap-1.5 font-bold text-[#F97316]">
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Reply from {worker.name} ({worker.roleType})</span>
                      </div>
                      <p className="text-slate-200 italic leading-relaxed">
                        &ldquo;{rev.techReply}&rdquo;
                      </p>
                    </div>
                  )}

                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <ThumbsUp className="w-3.5 h-3.5 text-slate-400" />
                      <span>{rev.helpfulCount} homeowners found this helpful</span>
                    </span>
                    <span className="text-slate-500">Service: {rev.service}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Column 2: Mini Window Dispatch Terminal & Verified Review Terminal (lg:col-span-4) */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            {/* Card 1: Direct Dispatch Mini Window Screen */}
            <div className="bg-[#0B111E] border border-orange-500/30 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-xl">
              {/* macOS Window Title Bar */}
              <div className="flex items-center justify-between px-4 py-3 bg-[#070D18] border-b border-white/10">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56] inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E] inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F] inline-block" />
                  <span className="text-[11px] font-mono text-slate-400 ml-2">
                    dispatch/{worker.slug}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  {worker.vanNumber}
                </span>
              </div>

              <div className="p-6 space-y-4">
                <div className="space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full inline-flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Available for Dispatch
                  </span>
                  <h3 className="text-xl font-bold text-white mt-1">Book {worker.name}</h3>
                  <p className="text-xs text-slate-300">
                    Skip full-page forms. Launch the instant macOS-style mini window booking modal directly to schedule your service with {worker.name.split(" ")[0]}.
                  </p>
                </div>

                {/* Dispatch Speed Key Indicators */}
                <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1.5 text-[11px]">
                  <span className="font-bold text-slate-300 uppercase tracking-wider block text-[10px]">
                    Available Service Speeds:
                  </span>
                  <div className="flex items-center gap-1.5 text-blue-400 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    <span>Blue = Fast (15–25m Emergency Dispatch)</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>Green = Medium Time (Same-Day Diagnostic)</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-orange-400 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-[#F97316]" />
                    <span>Orange = Regular (Scheduled Maintenance)</span>
                  </div>
                </div>

                {/* Launch Mini Window Booking Button */}
                <button
                  type="button"
                  onClick={() => setBookingModalOpen(true)}
                  className="w-full h-12 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white font-bold text-xs sm:text-sm shadow-xl shadow-orange-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer group"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Open Mini Window Booking →</span>
                </button>

                <p className="text-[11px] text-slate-400 text-center">
                  $129 diagnostic fee is 100% credited toward your repair.
                </p>
              </div>
            </div>

            {/* Card 2: Leave a Verified Review Mini Screen Form */}
            <div className="bg-[#0B111E] border border-white/15 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-xl">
              {/* macOS Window Title Bar */}
              <div className="flex items-center justify-between px-4 py-3 bg-[#070D18] border-b border-white/10">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56] inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E] inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F] inline-block" />
                  <span className="text-[11px] font-mono text-slate-400 ml-2">
                    reviews/{worker.slug}/post
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">
                  Verified Portal
                </span>
              </div>

              <div className="p-6 space-y-5">
                <div className="space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#F97316] bg-orange-500/10 border border-orange-500/20 px-3 py-1 rounded-full inline-block">
                    Leave a Verified Review
                  </span>
                  <h3 className="text-xl font-bold text-white">Rate {worker.name}</h3>
                  <p className="text-xs text-slate-400">
                    Did {worker.name} service your HVAC system? Share your experience to help local homeowners.
                  </p>
                </div>

                {reviewSuccess ? (
                  <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-6 text-center space-y-3 animate-in fade-in zoom-in-95">
                    <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <h4 className="text-base font-bold text-white">Review Published!</h4>
                    <p className="text-xs text-slate-300">
                      Thank you! Your verified review has been posted directly to {worker.name}&apos;s profile stream.
                    </p>
                    <button
                      type="button"
                      onClick={() => setReviewSuccess(false)}
                      className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-colors"
                    >
                      Write Another Review
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleReviewSubmit} className="space-y-4">
                    {/* Rating Stars Selector */}
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">
                        Your Rating:
                      </label>
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setReviewRating(star)}
                            className="p-1 hover:scale-110 transition-transform cursor-pointer"
                            aria-label={`Rate ${star} stars`}
                          >
                            <Star
                              className={`w-6 h-6 ${
                                star <= reviewRating
                                  ? "text-[#F97316] fill-[#F97316]"
                                  : "text-slate-600 hover:text-slate-400"
                              }`}
                            />
                          </button>
                        ))}
                        <span className="text-xs font-bold text-white ml-2">
                          {reviewRating} of 5 Stars
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300">Your Full Name *</label>
                      <input
                        type="text"
                        required
                        value={reviewAuthor}
                        onChange={(e) => setReviewAuthor(e.target.value)}
                        placeholder="e.g. Maria Gonzalez"
                        className="w-full h-10 px-3.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:ring-2 focus:ring-[#F97316] outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300">Neighborhood</label>
                        <input
                          type="text"
                          required
                          value={reviewNeighborhood}
                          onChange={(e) => setReviewNeighborhood(e.target.value)}
                          placeholder="e.g. Brickell"
                          className="w-full h-10 px-3.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:ring-2 focus:ring-[#F97316] outline-none"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300">Work Order #</label>
                        <input
                          type="text"
                          value={reviewWorkOrder}
                          onChange={(e) => setReviewWorkOrder(e.target.value)}
                          placeholder="#WO-1004"
                          className="w-full h-10 px-3.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono focus:ring-2 focus:ring-[#F97316] outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300">Headline Summary</label>
                      <input
                        type="text"
                        required
                        value={reviewHeadline}
                        onChange={(e) => setReviewHeadline(e.target.value)}
                        placeholder="e.g. Super fast arrival & restored cold air!"
                        className="w-full h-10 px-3.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:ring-2 focus:ring-[#F97316] outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300">Detailed Review Comments *</label>
                      <textarea
                        rows={3}
                        required
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        placeholder={`Describe the repair or diagnostic work ${worker.name} performed...`}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder:text-slate-500 focus:ring-2 focus:ring-[#F97316] outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-11 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Posting Review...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>Post Review for {worker.name}</span>
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Global Booking Mini Window Modal */}
      <BookingMiniWindowModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        preselectedTechId={worker.slug}
        preselectedTechName={worker.name}
        preselectedSpeedTier="medium"
      />
    </div>
  );
}
