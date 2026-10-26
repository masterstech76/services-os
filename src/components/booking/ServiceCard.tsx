"use client";

import * as React from "react";
import {
  Wrench,
  Sparkles,
  Flame,
  Cpu,
  Wind,
  AlertTriangle,
  Clock,
  Check,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatMoneyCents } from "@/lib/domain/format";
import type { ServiceDTO } from "@/lib/api";

function formatDurationMinutes(mins: number): string {
  return `${mins} min`;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Wrench,
  Sparkles,
  Flame,
  Cpu,
  Wind,
  AlertTriangle,
};

const serviceMeta: Record<
  string,
  { badge: string; accent: string; image: string; highlights: string[] }
> = {
  "svc-ac-repair": {
    badge: "Most Popular",
    accent: "from-orange-500/25 via-amber-500/10 to-slate-900",
    image: "/images/svc-ac-repair.jpg",
    highlights: ["Full 10-Point Diagnostic", "OEM Truck Stock Parts"],
  },
  "ac-repair": {
    badge: "Most Popular",
    accent: "from-orange-500/25 via-amber-500/10 to-slate-900",
    image: "/images/svc-ac-repair.jpg",
    highlights: ["Full 10-Point Diagnostic", "OEM Truck Stock Parts"],
  },
  "svc-ac-tuneup": {
    badge: "Seasonal Value",
    accent: "from-sky-500/25 via-cyan-500/10 to-slate-900",
    image: "/images/svc-ac-tuneup.jpg",
    highlights: ["21-Point Precision Tune-Up", "Coil & Drain Line Flush"],
  },
  "ac-tuneup": {
    badge: "Seasonal Value",
    accent: "from-sky-500/25 via-cyan-500/10 to-slate-900",
    image: "/images/svc-ac-tuneup.jpg",
    highlights: ["21-Point Precision Tune-Up", "Coil & Drain Line Flush"],
  },
  "svc-heating-repair": {
    badge: "Heat Pump & Furnace",
    accent: "from-amber-500/25 via-orange-500/10 to-slate-900",
    image: "/images/svc-furnace-repair.jpg",
    highlights: ["Safety & Ignition Check", "Reversing Valve Test"],
  },
  "heating-repair": {
    badge: "Heat Pump & Furnace",
    accent: "from-amber-500/25 via-orange-500/10 to-slate-900",
    image: "/images/svc-furnace-repair.jpg",
    highlights: ["Safety & Ignition Check", "Reversing Valve Test"],
  },
  "svc-thermostat-install": {
    badge: "Smart Home Ready",
    accent: "from-emerald-500/25 via-teal-500/10 to-slate-900",
    image: "/images/svc-thermostat-install.jpg",
    highlights: ["Nest, Ecobee & Honeywell", "Wi-Fi App Calibration"],
  },
  "thermostat-install": {
    badge: "Smart Home Ready",
    accent: "from-emerald-500/25 via-teal-500/10 to-slate-900",
    image: "/images/svc-thermostat-install.jpg",
    highlights: ["Nest, Ecobee & Honeywell", "Wi-Fi App Calibration"],
  },
  "svc-duct-cleaning": {
    badge: "Indoor Air Quality",
    accent: "from-indigo-500/25 via-blue-500/10 to-slate-900",
    image: "/images/svc-duct-cleaning.jpg",
    highlights: ["HEPA Negative-Air Vacuum", "Antimicrobial Sanitizer"],
  },
  "duct-cleaning": {
    badge: "Indoor Air Quality",
    accent: "from-indigo-500/25 via-blue-500/10 to-slate-900",
    image: "/images/svc-duct-cleaning.jpg",
    highlights: ["HEPA Negative-Air Vacuum", "Antimicrobial Sanitizer"],
  },
  "svc-refrigerant-recharge": {
    badge: "Subcooling & Freon",
    accent: "from-cyan-500/25 via-sky-500/10 to-slate-900",
    image: "/images/svc-refrigerant-recharge.jpg",
    highlights: ["Electronic Leak Search", "R-410A Balance & Charge"],
  },
  "svc-emergency-hvac": {
    badge: "24/7 Priority Dispatch",
    accent: "from-rose-500/25 via-orange-500/10 to-slate-900",
    image: "/images/svc-commercial-hvac.jpg",
    highlights: ["Under 60-Min Target ETA", "Senior Master Tech"],
  },
  "emergency-hvac": {
    badge: "24/7 Priority Dispatch",
    accent: "from-rose-500/25 via-orange-500/10 to-slate-900",
    image: "/images/svc-commercial-hvac.jpg",
    highlights: ["Under 60-Min Target ETA", "Senior Master Tech"],
  },
};

export interface ServiceCardProps {
  service: ServiceDTO;
  selected: boolean;
  onSelect: (service: ServiceDTO) => void;
  onSelectAndContinue?: (service: ServiceDTO) => void;
}

export function ServiceCard({
  service,
  selected,
  onSelect,
  onSelectAndContinue,
}: ServiceCardProps) {
  const iconName =
    service.id.includes("tuneup")
      ? "Sparkles"
      : service.id.includes("heating")
      ? "Flame"
      : service.id.includes("thermostat")
      ? "Cpu"
      : service.id.includes("duct")
      ? "Wind"
      : service.id.includes("emergency")
      ? "AlertTriangle"
      : "Wrench";
  const IconComp = iconMap[iconName] ?? Wrench;
  const isEmergency = service.category === "emergency";
  const meta = serviceMeta[service.id] ?? {
    badge: "Certified Service",
    accent: "from-orange-500/20 via-slate-800/40 to-slate-900",
    image: `/images/${service.id.startsWith("svc-") ? service.id : `svc-${service.id}`}.jpg`,
    highlights: ["Upfront Flat-Rate Pricing", "1-Year Parts & Labor Warranty"],
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={selected}
      data-testid={`service-card-${service.id}`}
      onClick={() => onSelect(service)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(service);
        }
      }}
      className={cn(
        "group relative flex w-full flex-col justify-between rounded-2xl border p-5 text-left transition-all duration-200 cursor-pointer",
        "focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#F97316]",
        selected
          ? "border-[#F97316] bg-gradient-to-b from-[#17253B] to-[#0F172A] ring-2 ring-[#F97316]/30 shadow-xl shadow-orange-500/10"
          : "border-white/10 bg-[#0B1322]/90 hover:border-orange-500/40 hover:bg-[#111C30] shadow-md"
      )}
    >
      <div>
        {/* Top Visual Header Banner with Real Eager Image + Overlay Badge */}
        <div
          className={cn(
            "relative h-32 w-full mb-4 rounded-xl overflow-hidden bg-gradient-to-br border border-white/10",
            meta.accent
          )}
        >
          <img
            src={meta.image}
            alt={service.name}
            loading="eager"
            className="h-full w-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1322] via-[#0B1322]/40 to-transparent" />

          {/* Top-left Category Pill */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5">
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider backdrop-blur-md border",
                isEmergency
                  ? "bg-rose-500/90 text-white border-rose-400/50"
                  : selected
                  ? "bg-[#F97316] text-slate-950 border-orange-300/50"
                  : "bg-slate-950/80 text-slate-200 border-white/15"
              )}
            >
              {meta.badge}
            </span>
          </div>

          {/* Top-right Selected Indicator */}
          <div
            className={cn(
              "absolute top-3 right-3 flex h-7 w-7 items-center justify-center rounded-full transition-all shadow-md",
              selected
                ? "bg-[#F97316] text-slate-950 scale-105"
                : "bg-slate-950/75 text-slate-400 border border-white/15 group-hover:border-orange-400/50 group-hover:text-white"
            )}
          >
            <Check className="h-4 w-4 stroke-[2.5]" aria-hidden="true" />
          </div>

          {/* Bottom-left Service Icon + Duration */}
          <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between">
            <div
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-xl border backdrop-blur-md",
                isEmergency
                  ? "bg-rose-500/20 border-rose-500/40 text-rose-300"
                  : selected
                  ? "bg-orange-500/25 border-orange-400/50 text-orange-300"
                  : "bg-slate-900/85 border-white/15 text-orange-400"
              )}
            >
              <IconComp className="h-4 w-4" aria-hidden="true" />
            </div>

            <span className="inline-flex items-center gap-1 rounded-lg bg-slate-950/80 border border-white/10 px-2.5 py-1 text-[11px] font-semibold text-slate-200 backdrop-blur-md">
              <Clock className="h-3 w-3 text-orange-400" aria-hidden="true" />
              {formatDurationMinutes(service.durationMinutes)}
            </span>
          </div>
        </div>

        {/* Title & Description */}
        <h3 className="font-heading text-base font-bold text-white group-hover:text-orange-300 transition-colors">
          {service.name}
        </h3>
        <p className="mt-1.5 text-xs text-slate-300 leading-relaxed line-clamp-2">
          {service.description}
        </p>

        {/* Highlights */}
        <div className="mt-3 space-y-1">
          {meta.highlights.map((item) => (
            <div key={item} className="flex items-center gap-1.5 text-[11px] text-slate-300">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Card Footer: Price + Explicit Action CTA */}
      <div className="mt-4 pt-3.5 border-t border-white/10 flex items-center justify-between gap-2">
        <div>
          <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
            {service.pricing === "hourly" ? "Hourly Rate" : "Flat-Rate Diagnostic"}
          </span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="font-mono text-lg font-black text-white">
              {formatMoneyCents(service.priceCents)}
            </span>
            {service.pricing === "hourly" && (
              <span className="text-xs font-semibold text-slate-400">/hr</span>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(service);
            if (onSelectAndContinue) {
              onSelectAndContinue(service);
            }
          }}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-extrabold transition-all",
            selected
              ? "bg-[#F97316] text-slate-950 shadow-md shadow-orange-500/25 hover:bg-orange-400"
              : "border border-white/15 bg-white/5 text-white hover:border-orange-500/50 hover:bg-orange-500/15 hover:text-orange-300"
          )}
        >
          <span>{selected ? "Selected · Next" : "Select"}</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
