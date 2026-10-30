"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
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
  ArrowRight,
} from "lucide-react";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { businessConfig } from "@config/business.config";

const JOB_OPENINGS = [
  { id: "tech-senior-diag", title: "Senior HVAC Diagnostic Specialist", pay: "$42.00 – $65.00 / hr" },
  { id: "tech-commercial", title: "Commercial Rooftop & Refrigeration Tech", pay: "$40.00 – $58.00 / hr" },
  { id: "tech-install-lead", title: "Lead AC & Heat Pump Installation Mechanic", pay: "$36.00 – $52.00 / hr" },
  { id: "tech-apprentice", title: "Licensed Trade Apprentice / Field Helper", pay: "$22.00 – $30.00 / hr" },
];

function ApplyFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const jobParam = searchParams.get("job");

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

  React.useEffect(() => {
    if (jobParam) {
      const matched = JOB_OPENINGS.find(
        (j) =>
          j.id.toLowerCase() === jobParam.toLowerCase() ||
          j.title.toLowerCase().includes(jobParam.toLowerCase())
      );
      if (matched) {
        setSelectedJob(matched.title);
      }
    }
  }, [jobParam]);

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
        {/* Top Clarification Banner */}
        <div className="bg-blue-950/60 border border-blue-500/30 rounded-2xl px-5 py-4 mb-6 text-sm text-slate-300 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="font-bold text-white block sm:inline">
              This intake portal is exclusively for Field Technicians &amp; Trade Employment Applications.
            </span>{" "}
            <span>If you are a customer looking to schedule HVAC service or repairs, please</span>
          </div>
          <Link
            href="/book"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white font-bold text-xs shrink-0 shadow-md shadow-orange-500/20 transition-all"
          >
            <span>Book Online Here</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

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

        {/* Mini Screen Window Dialog */}
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
              <span>Direct Queue Ready</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Left Column: Form Intake */}
            <div className="lg:col-span-7 p-6 sm:p-8 border-b lg:border-b-0 lg:border-r border-white/10">
              {submitted ? (
                <div className="py-12 text-center space-y-4 animate-in zoom-in-95">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Application Received!</h3>
                  <p className="text-sm text-slate-300 max-w-md mx-auto">
                    Thank you, <strong className="text-white">{fullName}</strong>. Your trade file has been logged under candidate tracking code:
                  </p>
                  <div className="inline-block px-5 py-2.5 rounded-xl bg-orange-500/10 border border-orange-500/30 text-[#F97316] font-mono font-bold text-lg">
                    #{appId}
                  </div>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Our Field Operations Director will contact you within 24 hours at <strong className="text-white">{phone}</strong>.
                  </p>
                  <div className="pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setSubmitted(false);
                        setFullName("");
                        setPhone("");
                        setEmail("");
                      }}
                      className="text-xs text-orange-400 hover:text-orange-300 underline font-semibold"
                    >
                      Submit Another Trade Profile
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
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
                        placeholder="e.g. John Miller"
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
                        placeholder="(305) 555-0100"
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
                        placeholder="technician@example.com"
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
                        placeholder="e.g. 33101"
                        className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-[#F97316]"
                      />
                    </div>
                  </div>

                  {/* Experience Select */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      HVAC Field Experience Level
                    </label>
                    <select
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-black/40 border border-white/15 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-[#F97316]"
                    >
                      <option>1–2 Years (Apprentice / Field Helper)</option>
                      <option>3–5 Years (Journeyman Mechanic)</option>
                      <option>5–10 Years (Senior Specialist)</option>
                      <option>10+ Years (Master Technician / Lead)</option>
                    </select>
                  </div>

                  {/* Checkbox Qualifications */}
                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-2">
                    <label className="flex items-center gap-2.5 text-xs text-slate-200 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={hasEpa}
                        onChange={(e) => setHasEpa(e.target.checked)}
                        className="rounded border-white/20 bg-black/40 text-[#F97316] focus:ring-0"
                      />
                      <span>Active EPA Section 608 Universal Certification</span>
                    </label>

                    <label className="flex items-center gap-2.5 text-xs text-slate-200 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={hasNate}
                        onChange={(e) => setHasNate(e.target.checked)}
                        className="rounded border-white/20 bg-black/40 text-[#F97316] focus:ring-0"
                      />
                      <span>NATE or HVAC Excellence Certification (Preferred)</span>
                    </label>

                    <label className="flex items-center gap-2.5 text-xs text-slate-200 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={cleanLicense}
                        onChange={(e) => setCleanLicense(e.target.checked)}
                        className="rounded border-white/20 bg-black/40 text-[#F97316] focus:ring-0"
                      />
                      <span>Valid Driver&apos;s License with Clean Driving Record</span>
                    </label>
                  </div>

                  {/* Notes / Equipment Experience */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      Key Equipment Specialties (Inverter, Rooftop, Chillers, Controls)
                    </label>
                    <textarea
                      rows={3}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="List equipment brands (Trane, Carrier, Daikin, Lennox) or specific certifications..."
                      className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-[#F97316] resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white font-bold text-sm shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSubmitting ? "Submitting Candidate File..." : "Submit Fast Application"}</span>
                  </button>
                </form>
              )}
            </div>

            {/* Right Column: Perks & Fleet Specs */}
            <div className="lg:col-span-5 p-6 sm:p-8 bg-[#0F172A]/40 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-orange-400">
                  Technician Fleet Perks
                </span>
                <h4 className="text-xl font-bold text-white">
                  Why Technicians Stay at {businessConfig.businessName}
                </h4>

                <div className="space-y-3 pt-2 text-xs text-slate-300">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-start gap-3">
                    <Truck className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block">Take-Home Ford Transit Van</strong>
                      <span>Fully outfitted with Milwaukee cordless tools, recovery machines, and stocked van inventory.</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-start gap-3">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block">100% Paid Healthcare &amp; 401(k) Match</strong>
                      <span>Comprehensive medical, dental, and vision insurance plus 4% 401(k) employer match.</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-start gap-3">
                    <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block">Automated Dispatch &amp; Zero Paperwork</strong>
                      <span>Our field PWA logs refrigerant, generates digital invoices, and pays spiffs automatically.</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 text-xs text-slate-400">
                <p>Have questions before applying? Call our trade recruitment desk at <strong className="text-white">{businessConfig.phone}</strong>.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function ApplyPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-[#0C1523] text-white p-8">Loading application desk...</div>}>
      <ApplyFormContent />
    </React.Suspense>
  );
}
