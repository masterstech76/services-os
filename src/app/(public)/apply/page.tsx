"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Wrench,
  Truck,
  ShieldCheck,
  CheckCircle2,
  Send,
  Sparkles,
  ArrowLeft,
  ChevronRight,
  Phone,
} from "lucide-react";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { businessConfig } from "@config/business.config";

const JOB_OPENINGS = [
  { id: "tech-senior-diag", title: "Senior HVAC Diagnostic Specialist", pay: "$42.00 – $65.00 / hr" },
  { id: "tech-commercial", title: "Commercial Rooftop & Refrigeration Tech", pay: "$40.00 – $58.00 / hr" },
  { id: "tech-install-lead", title: "Lead AC & Heat Pump Installation Mechanic", pay: "$36.00 – $52.00 / hr" },
  { id: "tech-apprentice", title: "Licensed Trade Apprentice / Field Helper", pay: "$22.00 – $30.00 / hr" },
];

export default function ApplyPage() {
  const router = useRouter();
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

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      const generatedId = `APP-${Math.floor(1000 + Math.random() * 9000)}`;
      setAppId(generatedId);
      setIsSubmitting(false);
      setSubmitted(true);
    }, 900);
  }

  return (
    <div className="min-h-screen bg-[#0C1523] text-white selection:bg-[#F97316] selection:text-white pb-20">
      <Breadcrumbs items={[{ label: "Careers", href: "/careers" }, { label: "Fast Trade Application" }]} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
        {/* Top Back Navigation Pill */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/careers"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300 hover:text-white transition-all shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Career Openings</span>
          </Link>
          <span className="text-xs text-slate-400 font-mono">
            Direct Intake Desk &bull; 24-Hour Review
          </span>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            MINI SCREEN WINDOW DIALOG
        ───────────────────────────────────────────────────────────── */}
        <div className="rounded-3xl border border-white/15 bg-[#0B111E] shadow-2xl overflow-hidden backdrop-blur-2xl">
          {/* macOS-Style Window Title Bar */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10 bg-[#0F172A]/90 shrink-0">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]" />
                <span className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]" />
                <span className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]" />
              </div>
              <span className="text-xs font-semibold text-slate-300 ml-2">
                ServicePro OS — Trade Technician Application Desk (Direct Intake)
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Recruiting Live</span>
            </div>
          </div>

          {/* Mini Window Content Body */}
          <div className="p-6 sm:p-10">
            {submitted ? (
              <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-8 text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
                <div className="w-14 h-14 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/30">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                    Trade Application Submitted
                  </span>
                  <h3 className="text-2xl font-bold text-white">Application Received!</h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                  Your candidate application code is <span className="font-mono font-bold text-[#F97316]">#{appId}</span> for the position of <span className="text-white font-semibold">{selectedJob}</span>.
                </p>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 max-w-sm mx-auto text-left text-xs space-y-1.5 text-slate-300">
                  <p className="text-slate-400">Applicant: <span className="text-white font-medium">{fullName}</span></p>
                  <p className="text-slate-400">Contact Phone: <span className="text-white font-medium">{phone}</span></p>
                  <p className="text-slate-400">Review Window: <span className="text-emerald-400 font-medium">Within 24 Hours</span></p>
                </div>
                <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-colors"
                  >
                    Submit Another Application
                  </button>
                  <Link
                    href="/careers"
                    className="px-5 py-2.5 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white font-bold text-xs transition-colors shadow-md"
                  >
                    Back to Fleet Overview &rarr;
                  </Link>
                </div>
              </div>
            ) : (
              <div>
                <div className="text-center mb-8 space-y-1.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#F97316] bg-orange-500/10 border border-orange-500/20 px-3 py-1 rounded-full inline-block">
                    DIRECT INTAKE DESK
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    Fast Trade Application
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
                    No lengthy resumes required. Enter your trade qualifications and our dispatch recruitment team will call you within 24 hours.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 max-w-4xl mx-auto">
                  {/* Desired Position */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      Position Applying For
                    </label>
                    <select
                      value={selectedJob}
                      onChange={(e) => setSelectedJob(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-black/40 border border-white/15 rounded-xl text-white text-xs sm:text-sm font-semibold focus:outline-none focus:border-[#F97316]"
                    >
                      {JOB_OPENINGS.map((j) => (
                        <option key={j.id} value={j.title}>
                          {j.title} ({j.pay})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Name & Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">
                        Full Legal Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Lead Field Specialist"
                        className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-[#F97316]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">
                        Mobile Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder=""
                        className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-[#F97316]"
                      />
                    </div>
                  </div>

                  {/* Email & ZIP */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="carlos@example.com"
                        className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-[#F97316]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">
                        Residential ZIP Code *
                      </label>
                      <input
                        type="text"
                        required
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value)}
                        placeholder="e.g. 33139"
                        className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-[#F97316]"
                      />
                    </div>
                  </div>

                  {/* Experience Level */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
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

                  {/* Trade Certifications Checkbox Row */}
                  <div className="pt-2 border-t border-white/10 space-y-2">
                    <span className="block text-xs font-bold text-slate-300">
                      Trade Certifications &amp; Driving Status
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      <label className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300 cursor-pointer hover:bg-white/10">
                        <input
                          type="checkbox"
                          checked={hasEpa}
                          onChange={(e) => setHasEpa(e.target.checked)}
                          className="rounded accent-[#F97316] w-4 h-4"
                        />
                        <span>EPA 608 Universal</span>
                      </label>

                      <label className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300 cursor-pointer hover:bg-white/10">
                        <input
                          type="checkbox"
                          checked={hasNate}
                          onChange={(e) => setHasNate(e.target.checked)}
                          className="rounded accent-[#F97316] w-4 h-4"
                        />
                        <span>NATE Certified</span>
                      </label>

                      <label className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300 cursor-pointer hover:bg-white/10">
                        <input
                          type="checkbox"
                          checked={cleanLicense}
                          onChange={(e) => setCleanLicense(e.target.checked)}
                          className="rounded accent-[#F97316] w-4 h-4"
                        />
                        <span>Clean Driver License</span>
                      </label>
                    </div>
                  </div>

                  {/* Additional Notes */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      Previous Employer or Key Equipment Specialties (Optional)
                    </label>
                    <textarea
                      rows={3}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="e.g. Carrier, Trane, Lennox troubleshooting, mini-splits, commercial chillers, brazing skills..."
                      className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs sm:text-sm placeholder:text-slate-500 focus:outline-none focus:border-[#F97316]"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-12 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white font-bold text-xs sm:text-sm shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Delivering Application to Dispatch Fleet Desk...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Submit Application to Agency Fleet Desk</span>
                        </>
                      )}
                    </button>
                    <p className="text-[11px] text-center text-slate-500 mt-2">
                      Equal Opportunity Employer &bull; NATE &amp; EPA 608 Verified Trades
                    </p>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
