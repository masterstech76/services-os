"use client";

import * as React from "react";
import Link from "next/link";
import {
  Wrench,
  Truck,
  DollarSign,
  ShieldCheck,
  Award,
  HeartPulse,
  Smartphone,
  CheckCircle2,
  Send,
  Calendar,
  Sparkles,
  ArrowRight,
  UserCheck,
  ChevronRight,
  X,
  Phone,
} from "lucide-react";
import { businessConfig } from "@config/business.config";

interface JobOpening {
  id: string;
  title: string;
  payRange: string;
  type: string;
  vanAssigned: boolean;
  reqs: string[];
}

const JOB_OPENINGS: JobOpening[] = [
  {
    id: "tech-senior-diag",
    title: "Senior HVAC Diagnostic Specialist",
    payRange: "$42.00 – $65.00 / hr + Commission",
    type: "Full-Time · Immediate Start",
    vanAssigned: true,
    reqs: ["EPA Universal 608", "5+ Yrs Residential/Commercial", "Clean Driver's License"],
  },
  {
    id: "tech-commercial",
    title: "Commercial Rooftop & Refrigeration Tech",
    payRange: "$40.00 – $58.00 / hr + Commission",
    type: "Full-Time · Year-Round Fleet",
    vanAssigned: true,
    reqs: ["Commercial RTU Experience", "EPA 608 Universal", "Electrical Troubleshooting"],
  },
  {
    id: "tech-install-lead",
    title: "Lead AC & Heat Pump Installation Mechanic",
    payRange: "$36.00 – $52.00 / hr + Install Bonus",
    type: "Full-Time · Overtime Available",
    vanAssigned: true,
    reqs: ["Sheet metal fabrication", "Duct balancing", "Valid Driver's License"],
  },
  {
    id: "tech-apprentice",
    title: "Licensed Trade Apprentice / Field Helper",
    payRange: "$22.00 – $30.00 / hr + Paid Training",
    type: "Full-Time · Mentorship Program",
    vanAssigned: false,
    reqs: ["HVAC Trade School Grad or 1 Yr Exp", "Hunger to Learn", "Clean Background"],
  },
];

const FLEET_PERKS = [
  {
    icon: DollarSign,
    title: "Top Industry Pay + Commission",
    desc: "Earn $35 – $65/hr base pay plus up to 15% equipment replacement commission with weekly direct deposits.",
  },
  {
    icon: Truck,
    title: "Take-Home Newer Transit Van",
    desc: "Late-model Ford Transit equipped with organized shelving, company fuel card, and automatic toll pass.",
  },
  {
    icon: Wrench,
    title: "Milwaukee Diagnostic Tool Allowance",
    desc: "Never buy gauges out of pocket. Company provides high-end digital manifolds, vacuum pumps, and cordless power tools.",
  },
  {
    icon: HeartPulse,
    title: "Comprehensive Health & 401(k)",
    desc: "Health, vision, and dental insurance for you and your family, plus matching retirement plan.",
  },
  {
    icon: Smartphone,
    title: "Company iPad & Tech PWA",
    desc: "Zero paper work orders. Digital invoicing, auto parts ordering, and live turn-by-turn navigation on your company iPad.",
  },
  {
    icon: Calendar,
    title: "Paid Holidays & Emergency Time-Off",
    desc: "Paid vacation, paid national holidays, and on-demand emergency leave protection with seamless route coverage.",
  },
];

export default function CareersPage() {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedJob, setSelectedJob] = React.useState("Senior HVAC Diagnostic Specialist");
  const [fullName, setFullName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [zipCode, setZipCode] = React.useState("");
  const [experience, setExperience] = React.useState("5–10 Years (Senior Specialist)");
  const [hasEpa, setHasEpa] = React.useState(true);
  const [hasNate, setHasNate] = React.useState(false);
  const [cleanLicense, setCleanLicense] = React.useState(true);
  const [notes, setNotes] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const [appId, setAppId] = React.useState("");

  function handleOpenModal(jobTitle?: string) {
    if (jobTitle) {
      setSelectedJob(jobTitle);
    }
    setSubmitted(false);
    setIsModalOpen(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      const generatedId = `APP-${Math.floor(1000 + Math.random() * 9000)}`;
      setAppId(generatedId);
      setIsSubmitting(false);
      setSubmitted(true);
    }, 800);
  }

  return (
    <div className="min-h-screen bg-[#0C1523] text-white">
      {/* ─────────────────────────────────────────────────────────────
          1. HERO HEADER
      ───────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-24 border-b border-white/10 bg-gradient-to-b from-[#0B111E] to-[#0C1523]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs sm:text-sm font-bold mb-6">
            <Sparkles className="w-4 h-4" />
            <span>Now Hiring Licensed Technicians &amp; Installers</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white max-w-4xl mx-auto leading-tight">
            Build Your Trade Career With The Best Fleet in Miami.
          </h1>

          <p className="mt-5 text-base sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal">
            Top industry hourly rates, take-home late-model vans, company-provided diagnostic equipment, and a culture that respects your craftsmanship.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href="#openings"
              className="px-6 py-3.5 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white font-bold text-sm sm:text-base shadow-lg shadow-orange-500/25 transition-all hover:scale-105"
            >
              View Open Positions
            </a>
            <button
              type="button"
              onClick={() => handleOpenModal()}
              className="px-6 py-3.5 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white font-semibold text-sm sm:text-base transition-all cursor-pointer flex items-center gap-2"
            >
              <Send className="w-4 h-4 text-orange-400" />
              <span>Fast 2-Minute Application</span>
            </button>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          2. PERKS & BENEFITS GRID
      ───────────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-20 border-b border-white/10 bg-[#0F172A]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-400">
              Fleet Advantages
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white mt-2">
              Why Elite Technicians Choose ServicePro OS
            </h2>
            <p className="text-sm sm:text-base text-slate-400 mt-3">
              We know your value. That&apos;s why our compensation, equipment, and work-life balance are built for true professionals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FLEET_PERKS.map((perk) => {
              const Icon = perk.icon;
              return (
                <div
                  key={perk.title}
                  className="rounded-2xl border border-white/10 bg-[#0B1220]/80 p-6 shadow-xl hover:border-orange-500/40 transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/25 text-orange-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{perk.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{perk.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. OPEN POSITIONS
      ───────────────────────────────────────────────────────────── */}
      <section id="openings" className="py-16 sm:py-20 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-400">
              Immediate Openings
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white mt-2">
              Current Open Fleet Roles
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              Select a position below to quickly submit your application
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {JOB_OPENINGS.map((job) => (
              <div
                key={job.id}
                className="rounded-2xl border border-white/10 bg-[#0F172A]/85 p-5 sm:p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-orange-500/40 transition-all"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <h3 className="text-lg font-bold text-white">{job.title}</h3>
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-400">
                      {job.payRange}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mb-3">{job.type}</p>
                  <div className="flex flex-wrap gap-2">
                    {job.reqs.map((req) => (
                      <span
                        key={req}
                        className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-300 bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg"
                      >
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        <span>{req}</span>
                      </span>
                    ))}
                    {job.vanAssigned && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-orange-300 bg-orange-500/10 border border-orange-500/20 px-2.5 py-1 rounded-lg">
                        <Truck className="w-3 h-3" />
                        <span>Take-Home Van Included</span>
                      </span>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleOpenModal(job.title)}
                  className="shrink-0 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-[#F97316] text-white font-bold text-xs sm:text-sm text-center transition-all shadow-sm cursor-pointer"
                >
                  Apply for this Role &rarr;
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. SLEEK HIGH-CONVERTING CTA CARD (Replaces inline form)
      ───────────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-white/15 bg-[#0F172A]/90 p-8 sm:p-12 text-center shadow-2xl relative overflow-hidden backdrop-blur-xl">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-[#F97316]/10 rounded-full blur-3xl pointer-events-none" />
            <div className="max-w-2xl mx-auto space-y-4 relative z-10">
              <span className="text-xs font-bold uppercase tracking-wider text-[#F97316] bg-orange-500/10 border border-orange-500/20 px-3.5 py-1 rounded-full inline-block">
                Direct Fleet Intake
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                Ready to Join Miami&apos;s Elite Fleet?
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl mx-auto">
                No lengthy resumes or phone tag. Open our Fast Trade Application mini-screen and our field dispatch manager will contact you within 24 hours.
              </p>

              <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={() => handleOpenModal()}
                  className="px-6 py-3.5 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white font-bold text-xs sm:text-sm shadow-xl shadow-orange-500/20 transition-all cursor-pointer flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Open Fast Trade Application (2 Mins)</span>
                </button>
                <Link
                  href="/apply"
                  className="px-6 py-3.5 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white font-semibold text-xs sm:text-sm transition-all"
                >
                  View Application Mini-Screen &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          5. MINI SCREEN WINDOW MODAL DIALOG (Interactive Overlay)
      ───────────────────────────────────────────────────────────── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#0B111E] border border-white/15 rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col text-white relative shadow-2xl overflow-hidden">
            
            {/* macOS Window Title Bar */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10 bg-[#0F172A]/90 shrink-0">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]" />
                  <span className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]" />
                  <span className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]" />
                </div>
                <span className="text-xs font-semibold text-slate-300 ml-2 hidden sm:inline">
                  ServicePro OS — Trade Technician Application Desk
                </span>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-white/10 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 overflow-y-auto">
              {submitted ? (
                <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-8 text-center space-y-4 animate-in zoom-in-95">
                  <div className="w-14 h-14 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/30">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                      Application Submitted
                    </span>
                    <h3 className="text-2xl font-bold text-white">Application Received!</h3>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
                    Your candidate code is <span className="font-mono font-bold text-[#F97316]">#{appId}</span> for <span className="text-white font-semibold">{selectedJob}</span>.
                  </p>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 max-w-sm mx-auto text-left text-xs space-y-1.5 text-slate-300">
                    <p className="text-slate-400">Applicant: <span className="text-white font-medium">{fullName}</span></p>
                    <p className="text-slate-400">Contact: <span className="text-white font-medium">{phone}</span></p>
                    <p className="text-slate-400">Review Window: <span className="text-emerald-400 font-medium">Within 24 Hours</span></p>
                  </div>
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-6 py-2.5 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white font-bold text-xs transition-colors shadow-md"
                    >
                      Done &bull; Close Window
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="text-center mb-6 space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#F97316] bg-orange-500/10 border border-orange-500/20 px-3 py-0.5 rounded-full inline-block">
                      DIRECT INTAKE DESK
                    </span>
                    <h2 className="text-xl sm:text-2xl font-bold text-white">
                      Fast Trade Application
                    </h2>
                    <p className="text-xs text-slate-400 max-w-md mx-auto">
                      No lengthy resumes required. Enter your trade qualifications and dispatch team will call you within 24 hours.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">
                        Position Applying For
                      </label>
                      <select
                        value={selectedJob}
                        onChange={(e) => setSelectedJob(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-black/40 border border-white/15 rounded-xl text-white text-xs sm:text-sm font-semibold focus:outline-none focus:border-[#F97316]"
                      >
                        {JOB_OPENINGS.map((j) => (
                          <option key={j.id} value={j.title}>
                            {j.title} ({j.payRange.split("+")[0]})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">
                          Full Legal Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="e.g. Carlos Mendez"
                          className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#F97316]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">
                          Mobile Phone Number *
                        </label>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="(305) 555-0199"
                          className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#F97316]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="carlos@example.com"
                          className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#F97316]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">
                          Residential ZIP Code *
                        </label>
                        <input
                          type="text"
                          required
                          value={zipCode}
                          onChange={(e) => setZipCode(e.target.value)}
                          placeholder="e.g. 33139"
                          className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#F97316]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">
                        Years of Field Trade Experience
                      </label>
                      <select
                        value={experience}
                        onChange={(e) => setExperience(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-black/40 border border-white/15 rounded-xl text-white text-xs sm:text-sm font-semibold focus:outline-none focus:border-[#F97316]"
                      >
                        <option value="Under 2 Years (Apprentice / Helper)">Under 2 Years (Apprentice / Helper)</option>
                        <option value="2–5 Years (Journeyman Tech)">2–5 Years (Journeyman Tech)</option>
                        <option value="5–10 Years (Senior Specialist)">5–10 Years (Senior Specialist)</option>
                        <option value="10+ Years (Master Technician)">10+ Years (Master Technician)</option>
                      </select>
                    </div>

                    <div className="pt-2 border-t border-white/10 space-y-1.5">
                      <span className="block text-xs font-bold text-slate-300">
                        Trade Certifications &amp; Driving Status
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <label className="flex items-center gap-2 p-2 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300 cursor-pointer hover:bg-white/10">
                          <input
                            type="checkbox"
                            checked={hasEpa}
                            onChange={(e) => setHasEpa(e.target.checked)}
                            className="rounded accent-[#F97316]"
                          />
                          <span>EPA 608 Universal</span>
                        </label>
                        <label className="flex items-center gap-2 p-2 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300 cursor-pointer hover:bg-white/10">
                          <input
                            type="checkbox"
                            checked={hasNate}
                            onChange={(e) => setHasNate(e.target.checked)}
                            className="rounded accent-[#F97316]"
                          />
                          <span>NATE Certified</span>
                        </label>
                        <label className="flex items-center gap-2 p-2 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300 cursor-pointer hover:bg-white/10">
                          <input
                            type="checkbox"
                            checked={cleanLicense}
                            onChange={(e) => setCleanLicense(e.target.checked)}
                            className="rounded accent-[#F97316]"
                          />
                          <span>Clean Driver License</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">
                        Previous Employer or Key Equipment Specialties (Optional)
                      </label>
                      <textarea
                        rows={2}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="e.g. Carrier, Trane, Lennox troubleshooting, mini-splits, commercial chillers, brazing skills..."
                        className="w-full px-3.5 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-[#F97316]"
                      />
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 transition-all cursor-pointer disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <>
                            <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Submitting to Fleet Recruitment Desk...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-3.5 h-3.5" />
                            <span>Submit Application to Agency Fleet Desk</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
