"use client";

import * as React from "react";
import Link from "next/link";
import {
  MapPin,
  Clock,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Search,
  Navigation,
  Car,
  Check,
  Filter,
} from "lucide-react";
import { businessConfig } from "@config/business.config";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { GoogleMapEmbed } from "@/components/maps/GoogleMapEmbed";

interface NeighborhoodArea {
  name: string;
  slug: string;
  region: "core" | "south" | "west" | "beach";
  regionLabel: string;
  zips: string[];
  avgEta: string;
  status: "Active Dispatch" | "Rapid Response" | "Priority Coverage";
  techniciansOnDuty: number;
  featuredStreet: string;
}

const NEIGHBORHOODS: NeighborhoodArea[] = [
  {
    name: "Brickell",
    slug: "brickell",
    region: "core",
    regionLabel: "Miami Core",
    zips: ["33129", "33130", "33131"],
    avgEta: "25 min",
    status: "Active Dispatch",
    techniciansOnDuty: 3,
    featuredStreet: "Brickell Ave & Mary Brickell Village",
  },
  {
    name: "Downtown Miami",
    slug: "downtown-miami",
    region: "core",
    regionLabel: "Miami Core",
    zips: ["33128", "33132", "33136"],
    avgEta: "30 min",
    status: "Active Dispatch",
    techniciansOnDuty: 2,
    featuredStreet: "Biscayne Blvd & Miami Design District",
  },
  {
    name: "Coral Gables",
    slug: "coral-gables",
    region: "west",
    regionLabel: "West Dade",
    zips: ["33134", "33146"],
    avgEta: "35 min",
    status: "Rapid Response",
    techniciansOnDuty: 2,
    featuredStreet: "Miracle Mile & Ponce de Leon",
  },
  {
    name: "Coconut Grove",
    slug: "coconut-grove",
    region: "south",
    regionLabel: "South Dade",
    zips: ["33133"],
    avgEta: "30 min",
    status: "Active Dispatch",
    techniciansOnDuty: 2,
    featuredStreet: "Grand Ave & South Bayshore Dr",
  },
  {
    name: "Miami Beach",
    slug: "miami-beach",
    region: "beach",
    regionLabel: "Beachside",
    zips: ["33139", "33140"],
    avgEta: "40 min",
    status: "Priority Coverage",
    techniciansOnDuty: 2,
    featuredStreet: "Collins Ave & Lincoln Rd",
  },
  {
    name: "Kendall",
    slug: "kendall",
    region: "south",
    regionLabel: "South Dade",
    zips: ["33143", "33144"],
    avgEta: "40 min",
    status: "Active Dispatch",
    techniciansOnDuty: 3,
    featuredStreet: "Kendall Dr & Dadeland Corridor",
  },
  {
    name: "Doral",
    slug: "doral",
    region: "west",
    regionLabel: "West Dade",
    zips: ["33178", "33172"],
    avgEta: "30 min",
    status: "Active Dispatch",
    techniciansOnDuty: 3,
    featuredStreet: "NW 87th Ave & Doral Blvd",
  },
  {
    name: "Wynwood / Edgewater",
    slug: "wynwood",
    region: "core",
    regionLabel: "Miami Core",
    zips: ["33127", "33137"],
    avgEta: "25 min",
    status: "Rapid Response",
    techniciansOnDuty: 2,
    featuredStreet: "NW 2nd Ave & N Miami Ave",
  },
  {
    name: "Aventura",
    slug: "aventura",
    region: "core",
    regionLabel: "North Dade",
    zips: ["33180"],
    avgEta: "35 min",
    status: "Rapid Response",
    techniciansOnDuty: 2,
    featuredStreet: "Biscayne Blvd & Country Club Dr",
  },
  {
    name: "Sunny Isles Beach",
    slug: "sunny-isles",
    region: "beach",
    regionLabel: "Beachside",
    zips: ["33160"],
    avgEta: "40 min",
    status: "Priority Coverage",
    techniciansOnDuty: 1,
    featuredStreet: "Collins Ave & Oceanfront Towers",
  },
  {
    name: "South Miami",
    slug: "south-miami",
    region: "south",
    regionLabel: "South Dade",
    zips: ["33143"],
    avgEta: "30 min",
    status: "Active Dispatch",
    techniciansOnDuty: 2,
    featuredStreet: "Sunset Dr & Dante Fascell Corridor",
  },
];

export default function ServiceAreasHubPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedRegion, setSelectedRegion] = React.useState<"all" | "core" | "west" | "south" | "beach">("all");

  const filteredAreas = React.useMemo(() => {
    return NEIGHBORHOODS.filter((area) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        q === "" ||
        area.name.toLowerCase().includes(q) ||
        area.zips.some((z) => z.includes(q)) ||
        area.featuredStreet.toLowerCase().includes(q);

      const matchesRegion =
        selectedRegion === "all" || area.region === selectedRegion;

      return matchesSearch && matchesRegion;
    });
  }, [searchQuery, selectedRegion]);

  return (
    <div className="min-h-screen bg-[#0C1523] text-white selection:bg-[#F97316] selection:text-white pb-20">
      <Breadcrumbs items={[{ label: "Service Areas" }]} />

      {/* Directory Header */}
      <section className="relative overflow-hidden pt-10 pb-12 px-4 sm:px-6 lg:px-8 border-b border-white/10">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#F97316]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto space-y-6 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <span className="text-xs font-bold text-[#F97316] uppercase tracking-wider bg-orange-500/10 px-3.5 py-1 rounded-full border border-orange-500/20 inline-flex items-center gap-1.5">
                <Navigation className="h-3.5 w-3.5" />
                <span>60-Minute Rapid Dispatch Zone</span>
              </span>
              <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
                Service Areas &amp; Live Territory Map
              </h1>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                We keep our fully stocked HVAC repair vans strategically staged across {businessConfig.city} for immediate 60-minute emergency arrival.
              </p>
            </div>

            {/* Live Dispatch Telemetry Card */}
            <div className="rounded-2xl border border-white/10 bg-[#0F172A]/80 backdrop-blur-xl p-5 shadow-lg space-y-3 min-w-[260px]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                  Live Dispatch Grid
                </span>
                <span className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Online
                </span>
              </div>
              <div className="space-y-1.5 text-xs">
                <div className="flex items-baseline justify-between">
                  <span className="text-slate-400">Active Trucks Staged:</span>
                  <span className="font-mono font-bold text-white">14 Vans</span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-slate-400">Average City ETA:</span>
                  <span className="font-mono font-bold text-[#F97316]">28 Mins</span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-slate-400">On-Time Arrival:</span>
                  <span className="font-mono font-bold text-emerald-400">99.2%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Search & Region Filter Bar */}
          <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search neighborhood or 5-digit ZIP code (e.g. 33129, Brickell)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 h-11 text-xs rounded-xl bg-[#0F172A]/90 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-[#F97316] transition-all"
              />
            </div>

            {/* Region Filter Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {[
                { id: "all", label: "All Regions" },
                { id: "core", label: "Miami Core" },
                { id: "west", label: "West Dade / Doral" },
                { id: "south", label: "South Dade / Grove" },
                { id: "beach", label: "Beachside" },
              ].map((reg) => (
                <button
                  key={reg.id}
                  onClick={() => setSelectedRegion(reg.id as any)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${
                    selectedRegion === reg.id
                      ? "bg-[#F97316] text-white shadow-md shadow-orange-500/20"
                      : "bg-[#0F172A]/80 text-slate-300 hover:text-white border border-white/10"
                  }`}
                >
                  {reg.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Live Territory Map Section with Tagged Radar Pins */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="rounded-3xl border border-white/10 bg-[#0F172A]/90 backdrop-blur-xl p-6 sm:p-8 shadow-2xl relative overflow-hidden space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-bold text-[#F97316] uppercase tracking-wider flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                Live Fleet Radar &amp; Telemetry
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white">South Florida Active Dispatch Map</h2>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <span className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 font-mono">
                🚐 18 Warehouse Vans Active
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-400 font-mono">
                ⚡ 28-Min Avg Response
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono">
                🛡️ 99.4% On-Time Guarantee
              </span>
            </div>
          </div>

          {/* Real Google Maps Live Interactive Territory Board */}
          <GoogleMapEmbed
            query="Miami, FL"
            title="South Florida Real Google Maps Territory Coverage"
            height="h-80 sm:h-96"
          />
        </div>
      </section>

      {/* Main Neighborhood Cards Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAreas.map((area) => (
            <div
              key={area.slug}
              className="p-6 rounded-2xl border border-white/10 bg-[#0F172A]/80 backdrop-blur-xl shadow-lg hover:border-white/20 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-[#F97316] flex items-center justify-center border border-orange-500/20">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <span className="font-bold text-lg text-white">
                      {area.name}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    {area.status}
                  </span>
                </div>

                <p className="text-xs text-slate-400">
                  Corridor: <span className="text-slate-200 font-medium">{area.featuredStreet}</span>
                </p>

                <div className="rounded-xl bg-[#0B1320]/80 p-3 space-y-1.5 text-xs border border-white/5">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Avg Arrival Window:</span>
                    <span className="font-mono font-bold text-white">{area.avgEta}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Vans Staged Nearby:</span>
                    <span className="font-mono font-bold text-[#F97316]">{area.techniciansOnDuty} Trucks</span>
                  </div>
                </div>

                <div className="text-[11px] font-mono text-slate-400">
                  ZIP Codes: {area.zips.join(", ")}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                <span className="text-xs text-slate-400 font-medium">
                  {area.regionLabel}
                </span>
                <Button
                  asChild
                  size="sm"
                  className="rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white font-bold text-xs h-8 px-4 shadow-sm"
                >
                  <Link href="/book">
                    Book Slot
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
