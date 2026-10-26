"use client";

import * as React from "react";
import Link from "next/link";
import {
  Wrench,
  ShieldCheck,
  Star,
  MapPin,
  Phone,
  Navigation,
  Calendar,
  Clock,
  Sparkles,
  Award,
  CheckCircle2,
  ExternalLink,
  Car,
  ChevronRight,
} from "lucide-react";
import { businessConfig } from "@config/business.config";
import { BookingMiniWindowModal } from "@/components/booking/BookingMiniWindowModal";

const ASSIGNED_TECHNICIAN = {
  id: "tech-carlos",
  name: "Carlos Mendez",
  title: "Lead Master HVAC Specialist",
  rating: 4.98,
  reviewsCount: 142,
  completedJobs: 820,
  yearsExperience: 14,
  license: "FL-HVAC-94021",
  status: "En Route to Property",
  etaMinutes: 18,
  vehicle: "ServicePro Mobile Tech Van #04 (Equipped)",
  phone: "(305) 555-0188",
  jobId: "job-1004",
  serviceName: "Emergency HVAC Diagnostic & Coil Restoration",
  avatarUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80",
  bio: "Master EPA Universal and NATE-certified specialist with 14+ years servicing commercial and residential cooling systems across South Florida.",
  badges: ["EPA Universal Certified", "NATE Certified", "Emergency Specialist", "Clean Background Verified"],
};

const FLEET_TECHNICIANS = [
  {
    id: "tech-marcus",
    name: "Marcus Vance",
    title: "Senior Heat Pump & Inverter Technician",
    rating: 4.95,
    reviewsCount: 98,
    yearsExperience: 11,
    status: "On-Call / Standby",
    phone: "(305) 555-0192",
    badges: ["Inverter Systems", "Heat Pump Pro", "EPA Certified"],
  },
  {
    id: "tech-elena",
    name: "Elena Rostova",
    title: "IAQ & Smart Thermostat Specialist",
    rating: 4.99,
    reviewsCount: 115,
    yearsExperience: 8,
    status: "Available for Next Dispatch",
    phone: "(305) 555-0147",
    badges: ["IAQ Master", "Ecobee/Nest Pro", "Ductwork Specialist"],
  },
];

export default function AccountTechniciansPage() {
  const [isBookingOpen, setIsBookingOpen] = React.useState(false);

  return (
    <div className="w-full max-w-[1400px] mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Page Title & Breadcrumb Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-orange-400 mb-2">
            <Wrench className="w-3.5 h-3.5" />
            <span>Field Fleet &amp; Assigned Specialists</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Your Service Technicians
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Track real-time specialist dispatch, verify certifications, and direct-call your assigned {businessConfig.businessName} field technicians.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setIsBookingOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#F97316] hover:bg-[#EA580C] text-[#0C1523] font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-orange-500/20 active:scale-95 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Request Tech Dispatch</span>
          </button>
        </div>
      </div>

      {/* Primary Highlight: Active Assigned Technician Card */}
      <section className="rounded-3xl border border-orange-500/30 bg-gradient-to-br from-[#0F1D38] via-[#0A1224] to-[#080D1A] p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10 border-b border-white/10 pb-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-orange-500/40 shadow-xl bg-slate-800">
                <img
                  src={ASSIGNED_TECHNICIAN.avatarUrl}
                  alt={ASSIGNED_TECHNICIAN.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-[#0A1224]" />
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold uppercase tracking-wider mb-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span>{ASSIGNED_TECHNICIAN.status}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                {ASSIGNED_TECHNICIAN.name}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300">
                {ASSIGNED_TECHNICIAN.title} &bull; <span className="text-orange-400 font-semibold">{ASSIGNED_TECHNICIAN.yearsExperience} yrs experience</span>
              </p>
            </div>
          </div>

          {/* Quick Contact & Live Track Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <Link
              href={`/account/appointments/${ASSIGNED_TECHNICIAN.jobId}/track`}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 text-[#0C1523] hover:bg-orange-400 font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 flex-1 sm:flex-none cursor-pointer"
            >
              <Navigation className="w-4 h-4" />
              <span>Track Live Van GPS ({ASSIGNED_TECHNICIAN.etaMinutes}m ETA)</span>
            </Link>

            <a
              href={`tel:${ASSIGNED_TECHNICIAN.phone}`}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white font-semibold text-xs transition-all active:scale-95 flex-1 sm:flex-none cursor-pointer"
            >
              <Phone className="w-4 h-4 text-emerald-400" />
              <span>Call Technician</span>
            </a>
          </div>
        </div>

        {/* Technician Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10 text-xs">
          <div className="space-y-2 bg-white/5 p-4 rounded-2xl border border-white/5">
            <span className="text-slate-400 uppercase tracking-wider font-semibold block text-[10px]">
              Assigned Work Order
            </span>
            <div className="font-bold text-white text-sm">{ASSIGNED_TECHNICIAN.serviceName}</div>
            <div className="text-slate-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-orange-400" />
              <span>Scheduled Window: 02:00 PM - 04:00 PM Today</span>
            </div>
          </div>

          <div className="space-y-2 bg-white/5 p-4 rounded-2xl border border-white/5">
            <span className="text-slate-400 uppercase tracking-wider font-semibold block text-[10px]">
              Mobile Fleet Unit
            </span>
            <div className="font-bold text-white text-sm flex items-center gap-1.5">
              <Car className="w-4 h-4 text-emerald-400" />
              <span>{ASSIGNED_TECHNICIAN.vehicle}</span>
            </div>
            <div className="text-slate-400 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Fully Stocked OEM Carrier, Trane &amp; Lennox Parts</span>
            </div>
          </div>

          <div className="space-y-2 bg-white/5 p-4 rounded-2xl border border-white/5">
            <span className="text-slate-400 uppercase tracking-wider font-semibold block text-[10px]">
              Verified Credentials
            </span>
            <div className="flex items-center gap-2 font-bold text-white">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>{ASSIGNED_TECHNICIAN.rating} rating ({ASSIGNED_TECHNICIAN.reviewsCount} verified homeowner reviews)</span>
            </div>
            <div className="text-slate-400">
              License: <span className="text-white font-mono">{ASSIGNED_TECHNICIAN.license}</span> &bull; 100% Background Screened
            </div>
          </div>
        </div>

        {/* Credentials Badges */}
        <div className="mt-6 pt-5 border-t border-white/10 flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400 mr-2 font-medium">Certified Qualifications:</span>
          {ASSIGNED_TECHNICIAN.badges.map((badge) => (
            <span
              key={badge}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300 text-xs font-semibold"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              {badge}
            </span>
          ))}
        </div>
      </section>

      {/* Available Fleet Specialists Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-orange-400" />
            <span>Dedicated Certified Fleet on Standby</span>
          </h3>
          <span className="text-xs text-slate-400">All technicians hold active EPA Universal credentials</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {FLEET_TECHNICIANS.map((tech) => (
            <div
              key={tech.id}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 hover:bg-white/[0.06] transition-colors flex flex-col justify-between"
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center font-bold text-base text-orange-400">
                    {tech.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-base">{tech.name}</h4>
                    <p className="text-xs text-slate-400">{tech.title}</p>
                    <div className="flex items-center gap-1.5 mt-1 text-xs text-amber-400">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span className="font-bold">{tech.rating}</span>
                      <span className="text-slate-400">({tech.reviewsCount} reviews) &bull; {tech.yearsExperience} yrs exp</span>
                    </div>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-white/10 text-[10px] font-semibold">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  {tech.status}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-1.5 pt-3 border-t border-white/5">
                {tech.badges.map((b) => (
                  <span key={b} className="px-2 py-0.5 rounded-md bg-white/5 text-[11px] text-slate-300">
                    {b}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Mini Window Booking Modal */}
      <BookingMiniWindowModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        preselectedServiceId="emergency-hvac"
      />
    </div>
  );
}
