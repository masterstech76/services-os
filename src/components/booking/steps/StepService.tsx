"use client";

import * as React from "react";
import { ShieldCheck, Sparkles, Clock, ArrowRight, CheckCircle2, PhoneCall } from "lucide-react";
import { ServiceCard } from "@/components/booking/ServiceCard";
import { Skeleton } from "@/components/ui/skeleton";
import { formatMoneyCents } from "@/lib/domain/format";
import { businessConfig } from "@config/business.config";
import type { ServiceDTO } from "@/lib/api";

function formatDurationMinutes(mins: number): string {
  return `${mins} min est.`;
}

export interface StepServiceProps {
  services: ServiceDTO[];
  loadingServices: boolean;
  selectedService: ServiceDTO | null;
  onSelectService: (service: ServiceDTO) => void;
  onContinue?: () => void;
}

export function StepService({
  services,
  loadingServices,
  selectedService,
  onSelectService,
  onContinue,
}: StepServiceProps) {
  return (
    <div className="space-y-6">
      {/* Top Hero Header + Instant Primary CTA Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 rounded-2xl border border-orange-500/25 bg-gradient-to-r from-[#131F36] via-[#0F192D] to-[#162238] p-5 sm:p-6 shadow-xl">
        <div className="space-y-2 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-500/15 border border-orange-500/30 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-[#F97316]">
              <Sparkles className="h-3 w-3" /> Same-Day South Florida Dispatch
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-1 text-[11px] font-semibold text-emerald-400">
              <ShieldCheck className="h-3.5 w-3.5" /> EPA 608 Licensed Techs
            </span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            What do you need help with today?
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Choose a certified service below to lock in upfront flat-rate pricing and reserve your 2-hour arrival window.
          </p>
        </div>

        {/* High-Converting Active Selection CTA Box */}
        {selectedService && (
          <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end justify-between gap-3 rounded-xl border border-white/10 bg-slate-950/75 p-4 shrink-0 min-w-[270px]">
            <div className="text-left lg:text-right">
              <div className="flex items-center lg:justify-end gap-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                <CheckCircle2 className="h-3.5 w-3.5" /> Selected Service
              </div>
              <p className="text-sm font-extrabold text-white mt-0.5">{selectedService.name}</p>
              <p className="text-xs text-slate-400 mt-0.5">
                {formatMoneyCents(selectedService.priceCents)} flat rate ·{" "}
                <span className="text-orange-400 font-semibold">
                  {formatDurationMinutes(selectedService.durationMinutes)}
                </span>
              </p>
            </div>

            {onContinue && (
              <button
                type="button"
                onClick={onContinue}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-slate-950 font-black text-xs sm:text-sm px-5 py-3 shadow-lg shadow-orange-500/25 transition-all active:scale-[0.99]"
              >
                <span>Continue with {selectedService.name}</span>
                <ArrowRight className="h-4 w-4 stroke-[2.5]" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Service Selection Cards Grid */}
      {loadingServices && services.length === 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-64 rounded-2xl bg-white/5" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((svc) => (
            <ServiceCard
              key={svc.id}
              service={svc}
              selected={selectedService?.id === svc.id}
              onSelect={onSelectService}
              onSelectAndContinue={(s) => {
                onSelectService(s);
                if (onContinue) onContinue();
              }}
            />
          ))}
        </div>
      )}

      {/* Bottom Trust & Dispatch Guarantee Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
        <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-slate-950/50 px-4 py-3">
          <ShieldCheck className="h-5 w-5 text-emerald-400 shrink-0" />
          <div className="text-xs">
            <p className="font-bold text-white">100% Upfront Pricing</p>
            <p className="text-slate-400">Approve all work before repairs begin</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-slate-950/50 px-4 py-3">
          <Clock className="h-5 w-5 text-orange-400 shrink-0" />
          <div className="text-xs">
            <p className="font-bold text-white">Live GPS Van Tracking</p>
            <p className="text-slate-400">Real-time SMS link when tech dispatches</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-slate-950/50 px-4 py-3">
          <PhoneCall className="h-5 w-5 text-sky-400 shrink-0" />
          <div className="text-xs">
            <p className="font-bold text-white">Need Urgent Advice?</p>
            <p className="text-slate-400">24/7 Dispatch: {businessConfig.phone}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
export default StepService;
