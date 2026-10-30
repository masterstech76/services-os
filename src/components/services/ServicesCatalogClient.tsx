"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Snowflake,
  Wrench,
  Sliders,
  Flame,
  Sparkles,
  Gauge,
  ArrowRight,
  ShieldCheck,
  Clock,
  Phone,
  AlertCircle,
  Building2,
  CheckCircle2,
  HelpCircle,
  Search,
  Users,
  Star,
  MapPin,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BookingMiniWindowModal } from "@/components/booking/BookingMiniWindowModal";
import { WorkerProfileModal, type ModalWorkerData } from "@/components/workers/WorkerProfileModal";
import { SERVICES_DETAIL_DATA, MASTER_TECHNICIANS, type TechnicianAssignment } from "@/lib/services-detail-data";

interface ServiceItem {
  id: string;
  category: "cooling" | "heating" | "iaq" | "emergency" | "commercial";
  categoryLabel: string;
  title: string;
  desc: string;
  price: string;
  duration: string;
  href: string;
  bookHref: string;
  icon: React.ComponentType<{ className?: string }>;
  image: string;
}

const SERVICE_SLUG_MAP: Record<string, string> = {
  "svc-ac-repair": "ac-repair",
  "svc-ac-tuneup": "ac-tuneup",
  "svc-refrigerant-recharge": "refrigerant-recharge",
  "svc-furnace-repair": "furnace-repair",
  "svc-thermostat-install": "thermostat-install",
  "svc-duct-cleaning": "duct-cleaning",
  "svc-emergency-hvac": "emergency-hvac",
  "svc-commercial-hvac": "commercial-hvac",
};

const ALL_SERVICES: ServiceItem[] = [
  {
    id: "svc-ac-repair",
    category: "cooling",
    categoryLabel: "Cooling",
    title: "AC Repair & Diagnostics",
    desc: "Rapid troubleshooting for AC systems blowing warm air, frozen evaporator coils, strange compressor noises, or water leaks.",
    price: "$129 Flat Diagnostic",
    duration: "~90 min",
    href: "/services/ac-repair",
    bookHref: "/book?serviceId=svc-ac-repair",
    icon: Snowflake,
    image: "/images/svc-ac-repair.jpg",
  },
  {
    id: "svc-ac-tuneup",
    category: "cooling",
    categoryLabel: "Cooling",
    title: "AC Tune-Up & Maintenance",
    desc: "Comprehensive 21-point inspection, condenser coil wash, electrical terminal tightening, and precision refrigerant check.",
    price: "$89 Seasonal Special",
    duration: "~60 min",
    href: "/services/ac-tuneup",
    bookHref: "/book?serviceId=svc-ac-tuneup",
    icon: Wrench,
    image: "/images/svc-ac-tuneup.jpg",
  },
  {
    id: "svc-refrigerant-recharge",
    category: "cooling",
    categoryLabel: "Cooling",
    title: "Refrigerant Leak Test & Recharge",
    desc: "Nitrogen pressure testing, electronic sniffer leak detection, and R-410A / R-22 factory subcooling balancing.",
    price: "$125/hr + Refrigerant",
    duration: "~60 min",
    href: "/services/refrigerant-recharge",
    bookHref: "/book?serviceId=svc-refrigerant-recharge",
    icon: Gauge,
    image: "/images/svc-refrigerant-recharge.jpg",
  },
  {
    id: "svc-furnace-repair",
    category: "heating",
    categoryLabel: "Heating",
    title: "Furnace & Heating System Repair",
    desc: "Diagnostic and repair for heat pumps, electric air handlers, hot-surface igniters, and safety limit switches.",
    price: "$129 Flat Diagnostic",
    duration: "~90 min",
    href: "/services/furnace-repair",
    bookHref: "/book?serviceId=svc-furnace-repair",
    icon: Flame,
    image: "/images/svc-furnace-repair.jpg",
  },
  {
    id: "svc-thermostat-install",
    category: "cooling",
    categoryLabel: "Smart Controls",
    title: "Smart Thermostat Installation",
    desc: "Professional wiring and mobile app configuration for Google Nest, Ecobee, Honeywell Home, and multi-zone controllers.",
    price: "$149 Flat Rate",
    duration: "~60 min",
    href: "/services/thermostat-install",
    bookHref: "/book?serviceId=svc-thermostat-install",
    icon: Sliders,
    image: "/images/svc-thermostat-install.jpg",
  },
  {
    id: "svc-duct-cleaning",
    category: "iaq",
    categoryLabel: "Air Quality",
    title: "Air Duct Cleaning & Sanitization",
    desc: "Negative-pressure HEPA filtration vacuuming, trunk line dust extraction, and EPA-registered antimicrobial fogging.",
    price: "$249 Whole Home",
    duration: "~180 min",
    href: "/services/duct-cleaning",
    bookHref: "/book?serviceId=svc-duct-cleaning",
    icon: Sparkles,
    image: "/images/svc-duct-cleaning.jpg",
  },
  {
    id: "svc-emergency-hvac",
    category: "emergency",
    categoryLabel: "Emergency",
    title: "24/7 Priority Emergency HVAC",
    desc: "Immediate on-call dispatch for total cooling failure during peak summer heat, critical leaks, and severe electrical faults.",
    price: "Priority Dispatch",
    duration: "Under 60 Min",
    href: "/services/emergency-hvac",
    bookHref: "/services/emergency-hvac",
    icon: Clock,
    image: "/images/hero.jpg",
  },
  {
    id: "svc-commercial-hvac",
    category: "commercial",
    categoryLabel: "Commercial",
    title: "Commercial HVAC & Rooftop Units",
    desc: "Quarterly preventative maintenance agreements, packaged RTU service, and ventilation management for commercial properties.",
    price: "Custom Estimate",
    duration: "Scheduled",
    href: "/services/commercial-hvac",
    bookHref: "/contact",
    icon: Building2,
    image: "/images/svc-commercial-hvac.jpg",
  },
];

const CATEGORIES = [
  { id: "all", label: "All Services" },
  { id: "cooling", label: "Cooling & AC" },
  { id: "heating", label: "Heating & Furnaces" },
  { id: "iaq", label: "Air Quality & Ducts" },
  { id: "emergency", label: "24/7 Emergency" },
  { id: "commercial", label: "Commercial HVAC" },
] as const;

interface ServicesCatalogClientProps {
  businessPhone: string;
  city: string;
}

export function ServicesCatalogClient({ businessPhone, city }: ServicesCatalogClientProps) {
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all");
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [bookingModalOpen, setBookingModalOpen] = React.useState(false);
  const [modalServiceId, setModalServiceId] = React.useState<string>("svc-ac-repair");
  const [modalSpeedTier, setModalSpeedTier] = React.useState<"fast" | "medium" | "regular">("medium");
  const [selectedWorkerForModal, setSelectedWorkerForModal] = React.useState<ModalWorkerData | null>(null);
  const [workerProfileModalOpen, setWorkerProfileModalOpen] = React.useState(false);
  const cleanPhoneHref = `tel:${businessPhone.replace(/\D/g, "")}`;

  const filteredServices = React.useMemo(() => {
    let list = ALL_SERVICES;
    if (selectedCategory !== "all") {
      list = list.filter((svc) => svc.category === selectedCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (svc) =>
          svc.title.toLowerCase().includes(q) ||
          svc.desc.toLowerCase().includes(q) ||
          svc.categoryLabel.toLowerCase().includes(q) ||
          svc.price.toLowerCase().includes(q)
      );
    }
    return list;
  }, [selectedCategory, searchQuery]);

  return (
    <div className="space-y-12">
      {/* Search & Filter Bar */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? "bg-[#F97316] text-[#0C1523] shadow-lg shadow-orange-500/20"
                    : "bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search HVAC services…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs sm:text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Speed Key Meaning Guide Bar */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 p-3 rounded-2xl bg-white/[0.04] border border-white/10 text-xs">
          <span className="font-bold text-slate-300 text-[11px] uppercase tracking-wider">
            Booking Speed Indicator:
          </span>
          <span className="inline-flex items-center gap-1.5 font-semibold text-blue-400">
            <span className="h-2 w-2 rounded-full bg-blue-500 shadow-sm shadow-blue-500/50" />
            Blue = Fast Services (15–25m Urgent Dispatch)
          </span>
          <span className="text-white/20 hidden sm:inline">•</span>
          <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
            Green = Medium Time (Same-Day Diagnostics)
          </span>
          <span className="text-white/20 hidden sm:inline">•</span>
          <span className="inline-flex items-center gap-1.5 font-semibold text-orange-400">
            <span className="h-2 w-2 rounded-full bg-[#F97316] shadow-sm shadow-orange-500/50" />
            Orange = Regular Services (Maintenance &amp; Controls)
          </span>
        </div>
      </div>

      {/* Services Grid with Embedded Workers List Card for Each Service */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400 pb-2">
          <span>
            Showing <strong className="text-white">{filteredServices.length}</strong> available HVAC services in {city}
          </span>
          <span className="hidden sm:inline">Certified Technicians Dispatched Daily</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((svc) => {
            const Icon = svc.icon;
            const slug = SERVICE_SLUG_MAP[svc.id] || "ac-repair";
            const serviceDetail = SERVICES_DETAIL_DATA[slug];
            const workers = serviceDetail?.assignedTechnicians || [
              MASTER_TECHNICIANS["carlos-mendez"],
              MASTER_TECHNICIANS["marcus-vance"],
            ];

            return (
              <div
                key={svc.id}
                className="group rounded-3xl border border-white/10 bg-[#0F172A]/80 backdrop-blur-xl p-5 shadow-lg hover:border-white/20 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Image container with price badge */}
                  <div className="relative h-44 w-full rounded-2xl overflow-hidden bg-slate-900 mb-4">
                    <Image
                      src={svc.image}
                      alt={svc.title}
                      fill
                      quality={85}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      loading="lazy"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 bg-[#0C1523]/90 backdrop-blur-md text-white font-bold text-[11px] px-2.5 py-1 rounded-full border border-white/10 shadow-sm flex items-center gap-1.5">
                      <Icon className="h-3 w-3 text-[#F97316]" />
                      <span>{svc.categoryLabel}</span>
                    </div>
                    <div className="absolute bottom-3 right-3 bg-[#0C1523]/95 backdrop-blur-md text-[#F97316] font-mono font-bold text-xs px-3 py-1 rounded-full border border-white/10 shadow-md">
                      {svc.price}
                    </div>
                  </div>

                  {/* Header info */}
                  <div className="space-y-1.5 mb-3">
                    <h4 className="text-lg font-bold text-white group-hover:text-[#F97316] transition-colors line-clamp-1">
                      {svc.title}
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                      {svc.desc}
                    </p>
                  </div>

                  {/* Workers List Card: Who Can Do This Work (Conditional) */}
                  {workers && workers.length > 0 && (
                    <div className="mt-3 p-3 rounded-2xl bg-[#070D18]/90 border border-white/10 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-300 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                          <Users className="w-3.5 h-3.5 text-[#F97316]" />
                          <span>Workers Who Can Do This ({workers.length})</span>
                        </span>
                        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                          {workers.filter((w) => w.status === "available").length} Ready Now
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        {workers.slice(0, 2).map((worker) => (
                          <div
                            key={worker.id}
                            onClick={() => {
                              setSelectedWorkerForModal({
                                ...worker,
                                slug: worker.id,
                              });
                              setWorkerProfileModalOpen(true);
                            }}
                            className="flex items-center justify-between p-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 hover:border-orange-500/40 transition-all text-xs cursor-pointer group/worker"
                            role="button"
                            tabIndex={0}
                            aria-label={`Open profile for ${worker.name}`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              {worker.avatarUrl ? (
                                <img
                                  src={worker.avatarUrl}
                                  alt={worker.name}
                                  className="w-6 h-6 rounded-lg object-cover border border-white/10 shrink-0 group-hover/worker:scale-105 transition-transform"
                                />
                              ) : (
                                <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-slate-700 to-slate-800 border border-white/10 text-white font-bold text-[10px] flex items-center justify-center shrink-0 group-hover/worker:scale-105 transition-transform">
                                  {worker.initials}
                                </div>
                              )}
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <span className="font-bold text-white text-xs truncate group-hover/worker:text-[#F97316] transition-colors">
                                    {worker.name}
                                  </span>
                                  <span className="text-[10px] text-amber-400 flex items-center gap-0.5 shrink-0">
                                    <Star className="w-2.5 h-2.5 fill-amber-400" />
                                    {worker.rating}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1 text-[10px] text-slate-400 truncate">
                                  {worker.status === "available" ? (
                                    <span className="text-emerald-400 font-medium flex items-center gap-1">
                                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                      Available Now
                                    </span>
                                  ) : (
                                    <span className="text-amber-400 font-medium flex items-center gap-1">
                                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                                      On Active Site (~35m)
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedWorkerForModal({
                                  ...worker,
                                  slug: worker.id,
                                });
                                setWorkerProfileModalOpen(true);
                              }}
                              className="shrink-0 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-[#F97316] border border-white/10 text-slate-300 hover:text-[#0C1523] text-[10px] font-bold transition-all flex items-center gap-1 cursor-pointer shadow-sm"
                            >
                              <span>Profile</span>
                              <ArrowRight className="w-2.5 h-2.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-white/10 space-y-3">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-slate-400" />
                      {svc.duration}
                    </span>
                    <span className="flex items-center gap-1 text-emerald-400 font-bold">
                      <ShieldCheck className="h-3 w-3" />
                      100% Guaranteed
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={svc.href}
                      className="flex-1 h-9 rounded-xl border border-white/15 hover:border-white/25 bg-white/5 hover:bg-white/10 text-white font-bold text-xs inline-flex items-center justify-center gap-1 transition-colors"
                    >
                      <span>Details</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => {
                        setModalServiceId(svc.id);
                        setModalSpeedTier(
                          svc.category === "emergency" || svc.id.includes("emergency")
                            ? "fast"
                            : svc.id === "svc-ac-repair" || svc.id === "svc-refrigerant-recharge"
                            ? "medium"
                            : "regular"
                        );
                        setBookingModalOpen(true);
                      }}
                      className={`flex-1 h-9 rounded-xl text-white font-bold text-xs shadow-sm cursor-pointer ${
                        svc.category === "emergency" || svc.id.includes("emergency")
                          ? "bg-blue-600 hover:bg-blue-500 shadow-blue-500/25"
                          : svc.id === "svc-ac-repair" || svc.id === "svc-refrigerant-recharge"
                          ? "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/25"
                          : "bg-[#F97316] hover:bg-[#EA580C] shadow-orange-500/25"
                      }`}
                    >
                      Book Now
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Certified Trade Technicians Roster: Workers Who Can Do This Work */}
      <section className="space-y-6 pt-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <span className="text-xs font-bold text-[#F97316] uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-[#F97316]" />
              Verified Technician Fleet · Multi-Worker Trade Roster
            </span>
            <h2 className="text-2xl font-black text-white">
              Workers Who Can Do This Work &amp; Current Availability
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Multiple certified specialists work for each service. See who is currently available for dispatch or finishing up active jobs.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {Object.values(MASTER_TECHNICIANS).map((worker) => (
            <div
              key={worker.id}
              className="p-5 rounded-3xl bg-[#0F172A]/90 border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between space-y-4 shadow-xl"
            >
              <div className="space-y-3">
                {/* Status indicator */}
                <div className="flex items-center justify-between">
                  {worker.status === "available" ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Available Now
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      <Clock className="h-3 w-3" />
                      On Active Site · Coming Soon
                    </span>
                  )}
                  <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    {worker.rating} ({worker.reviewCount})
                  </span>
                </div>

                {/* Worker Identity */}
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-slate-700 to-slate-800 border border-white/10 text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-md">
                    {worker.initials}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-white truncate">{worker.name}</h3>
                    <p className="text-[11px] text-[#F97316] font-semibold truncate">{worker.badge}</p>
                  </div>
                </div>

                {/* Certifications & Specialties */}
                <p className="text-[11px] text-slate-300 leading-relaxed line-clamp-2">
                  {worker.certifications}
                </p>

                {/* Live Status Note */}
                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 text-[11px] text-slate-400 space-y-1">
                  <div className="flex items-center gap-1 text-slate-300 font-semibold text-[10px] uppercase">
                    <MapPin className="w-3 h-3 text-orange-400" />
                    <span>Current Zone:</span>
                  </div>
                  <p className="text-slate-300 text-[11px] line-clamp-2">{worker.statusNote}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1 border-t border-white/10">
                <Button
                  type="button"
                  size="sm"
                  onClick={() => {
                    setModalServiceId(worker.id === "elena-rivera" ? "svc-commercial-hvac" : "svc-ac-repair");
                    setModalSpeedTier(worker.speedTier);
                    setBookingModalOpen(true);
                  }}
                  className={`w-full h-9 rounded-xl text-white font-bold text-xs shadow-sm cursor-pointer ${
                    worker.speedTier === "fast"
                      ? "bg-blue-600 hover:bg-blue-500 shadow-blue-500/25"
                      : worker.speedTier === "medium"
                      ? "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/25"
                      : "bg-[#F97316] hover:bg-[#EA580C] shadow-orange-500/25"
                  }`}
                >
                  Dispatch Available Specialist
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    setSelectedWorkerForModal({
                      ...worker,
                      slug: worker.id,
                    });
                    setWorkerProfileModalOpen(true);
                  }}
                  variant="outline"
                  size="sm"
                  className="w-full h-8 rounded-xl border-white/15 bg-white/5 hover:bg-white/10 text-white font-semibold text-xs cursor-pointer"
                >
                  <User className="w-3 h-3 mr-1 text-slate-400" />
                  <span>View Profile &amp; Reviews →</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Unified 3-in-1 Bottom CTA Section */}
      <section className="space-y-4 pt-4">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <span className="text-xs font-bold text-[#F97316] uppercase tracking-wider">Fast Response &amp; Custom Care</span>
          <h2 className="text-2xl font-black text-white">How Can We Help You Today?</h2>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs pt-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-300 font-semibold text-[11px]">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-500" /> Blue = Fast Services
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-semibold text-[11px]">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Green = Medium Time Services
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-300 font-semibold text-[11px]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#F97316]" /> Orange = Regular Services
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Card 1: 24/7 Priority Emergency Dispatch */}
          <div className="rounded-3xl bg-[#0F172A]/90 border border-orange-500/30 p-6 flex flex-col justify-between space-y-5 shadow-xl relative overflow-hidden">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 border border-orange-500/30 text-xs font-bold text-orange-400 uppercase tracking-wider">
                <span className="h-2 w-2 rounded-full bg-orange-400 animate-ping" />
                24/7 Priority Emergency
              </div>
              <h3 className="text-xl font-bold text-white">AC Down in the Heat?</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Guaranteed 60-minute emergency arrival for cooling breakdowns across {city}. Staged mobile vans with 95% of parts on board.
              </p>
              <ul className="text-xs text-slate-400 space-y-1 pt-1">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" /> No Weekend Surcharges</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" /> Live GPS En-Route SMS</li>
              </ul>
            </div>
            <div className="space-y-2 pt-2">
              <a
                href={cleanPhoneHref}
                className="w-full inline-flex items-center justify-center gap-2 h-11 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-500/25 transition-all text-center"
              >
                <Phone className="h-4 w-4" />
                <span>Call Dispatch: {businessPhone}</span>
              </a>
              <Button asChild variant="outline" className="w-full h-10 px-4 rounded-xl border-white/20 bg-white/5 hover:bg-white/10 text-white font-semibold text-xs">
                <Link href="/services/emergency-hvac">
                  Emergency Protocol Details →
                </Link>
              </Button>
            </div>
          </div>

          {/* Card 2: Diagnostic Inspection (Homeowner Help) */}
          <div className="rounded-3xl bg-[#0F172A]/90 border border-white/10 p-6 flex flex-col justify-between space-y-5 shadow-xl">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-xs font-bold text-emerald-400 uppercase tracking-wider border border-emerald-500/30">
                <HelpCircle className="h-3.5 w-3.5 text-emerald-400" />
                Diagnostic Inspection (Medium Time)
              </div>
              <h3 className="text-xl font-bold text-white">Not Sure What&apos;s Wrong?</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Pinpoint capacitor, refrigerant, or compressor issues with zero guesswork. The $129 fee is 100% credited toward your approved repair.
              </p>
              <ul className="text-xs text-slate-400 space-y-1 pt-1">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" /> Standard 24-Point Physical Check</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" /> 1-Year Workmanship Warranty</li>
              </ul>
            </div>
            <div className="space-y-2 pt-2">
              <Button
                type="button"
                onClick={() => {
                  setModalServiceId("svc-ac-repair");
                  setModalSpeedTier("medium");
                  setBookingModalOpen(true);
                }}
                className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs h-11 px-4 shadow-md shadow-emerald-500/25 cursor-pointer"
              >
                Book $129 Diagnostic (Mini Window)
              </Button>
              <a
                href={cleanPhoneHref}
                className="w-full inline-flex items-center justify-center gap-2 h-10 px-4 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white font-semibold text-xs transition-colors shadow-sm"
              >
                <Phone className="h-3.5 w-3.5 text-slate-300" />
                <span>Speak With Dispatch</span>
              </a>
            </div>
          </div>

          {/* Card 3: Commercial & Property Management */}
          <div className="rounded-3xl bg-[#0F172A]/90 border border-white/10 p-6 flex flex-col justify-between space-y-5 shadow-xl">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 text-xs font-bold text-orange-400 uppercase tracking-wider border border-orange-500/30">
                <Building2 className="h-3.5 w-3.5 text-orange-400" />
                Commercial &amp; RFP (Regular Services)
              </div>
              <h3 className="text-xl font-bold text-white">Commercial HVAC &amp; Rooftops</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Custom preventative maintenance proposals, dedicated account managers, and Net 30 terms for multi-unit retail, offices, and clinics.
              </p>
              <ul className="text-xs text-slate-400 space-y-1 pt-1">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" /> Custom Quarterly PM Plans</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" /> Net 30 Commercial Invoicing</li>
              </ul>
            </div>
            <div className="space-y-2 pt-2">
              <Button asChild className="w-full h-11 px-4 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white font-bold text-xs shadow-md shadow-orange-500/25">
                <Link href="/services/commercial-hvac">
                  Explore Commercial HVAC →
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full h-10 px-4 rounded-xl border-white/20 bg-transparent hover:bg-white/5 text-white font-semibold text-xs">
                <Link href="/contact?service=Commercial+HVAC">
                  Request Custom RFP Quote
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Global Booking Mini Window Screen Modal */}
      <BookingMiniWindowModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        preselectedServiceId={modalServiceId}
        preselectedSpeedTier={modalSpeedTier}
      />

      {/* Global Worker Profile Mini Window Modal */}
      <WorkerProfileModal
        isOpen={workerProfileModalOpen}
        onClose={() => setWorkerProfileModalOpen(false)}
        worker={selectedWorkerForModal}
        onBookNow={(workerId) => {
          setModalServiceId(workerId === "elena-rivera" ? "svc-commercial-hvac" : "svc-ac-repair");
          setBookingModalOpen(true);
        }}
      />
    </div>
  );
}
