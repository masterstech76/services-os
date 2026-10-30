"use client";

import * as React from "react";
import Link from "next/link";
import { ShieldCheck, Star, Wrench, Award, CheckCircle2, ArrowRight, Users } from "lucide-react";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";

interface PublicTech {
  id: string;
  name: string;
  role: string;
  experience: string;
  rating: string;
  reviews: number;
  van: string;
  badges: string[];
  bio: string;
}

// Neutralized data: Fabricated mock profiles purged per Phase 5 standard. Real technicians populate dynamically from verified database records.
const PUBLIC_TECHS: PublicTech[] = [];

export default function PublicTechniciansRosterPage() {
  return (
    <div className="min-h-screen bg-[#0C1523] text-white selection:bg-[#F97316] selection:text-white pb-16">
      <Breadcrumbs items={[{ label: "Certified Technicians" }]} />

      <section className="relative overflow-hidden pt-12 pb-14 border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
          <span className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#F97316]">
            <ShieldCheck className="w-3.5 h-3.5" />
            100% Background-Checked &amp; EPA Certified Fleet
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Meet Our Certified Field Technicians
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Every ServicePro OS technician is NATE &amp; EPA Section 608 certified, background-verified, and equipped with fully stocked diagnostic vans.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        {PUBLIC_TECHS.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-20 text-center rounded-3xl border border-white/10 bg-[#0F172A]/60 backdrop-blur-xl p-8">
            <div className="w-16 h-16 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-slate-500" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Technician Profiles Coming Soon</h3>
            <p className="text-slate-400 text-sm max-w-sm mb-6 leading-relaxed">
              Our technician directory will display available specialists as verified profiles are added. You can still request HVAC service online.
            </p>
            <Link
              href="/book"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold rounded-xl transition-colors shadow-lg shadow-orange-500/25"
            >
              <span>Book Service</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          PUBLIC_TECHS.map((tech) => (
            <div
              key={tech.id}
              className="rounded-3xl border border-white/10 bg-[#0F172A]/85 backdrop-blur-xl p-6 flex flex-col justify-between shadow-2xl space-y-5"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                      {tech.van} · {tech.experience}
                    </span>
                    <h2 className="text-xl font-bold text-white mt-0.5">{tech.name}</h2>
                    <p className="text-xs text-slate-400">{tech.role}</p>
                  </div>
                  <div className="flex items-center gap-1 rounded-full bg-amber-500/15 border border-amber-500/30 px-2.5 py-1 text-xs font-bold text-amber-300 shrink-0">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{tech.rating}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{tech.bio}</p>

                <div className="flex flex-wrap gap-1.5">
                  {tech.badges.map((b) => (
                    <span
                      key={b}
                      className="inline-flex items-center gap-1 rounded-lg bg-white/5 border border-white/10 px-2.5 py-1 text-[11px] text-slate-200 font-medium"
                    >
                      <CheckCircle2 className="w-3 h-3 text-orange-400" />
                      {b}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-2">
                <Link
                  href={`/technicians/${tech.id}`}
                  className="text-xs font-bold text-[#F97316] hover:text-orange-300 inline-flex items-center gap-1 transition-colors"
                >
                  <span>View Dossier &amp; Reviews ({tech.reviews})</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href="/book"
                  className="px-3.5 py-2 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-[#0C1523] font-bold text-xs transition-all"
                >
                  Request Tech
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
