import * as React from "react";
import { businessConfig } from "@config/business.config";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { ServicesCatalogClient } from "@/components/services/ServicesCatalogClient";
import { Sparkles } from "lucide-react";

export const metadata = {
  title: `HVAC Services & Transparent Pricing | ${businessConfig.businessName}`,
  description: `Explore our full catalog of residential and commercial HVAC services with upfront flat-rate pricing and same-day arrival across ${businessConfig.city}.`,
};

export default function ServicesCatalogPage() {
  return (
    <div className="min-h-screen bg-[#0C1523] text-white selection:bg-[#F97316] selection:text-white pb-20">
      <Breadcrumbs items={[{ label: "Services & Pricing" }]} />

      {/* Hero Header */}
      <section className="relative overflow-hidden pt-12 pb-16 px-4 sm:px-6 border-b border-white/10">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#F97316]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center space-y-4 relative z-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#F97316]">
            <Sparkles className="h-3.5 w-3.5" />
            Upfront Flat-Rate Pricing
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            HVAC Services &amp; Transparent Rates
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Every repair, tune-up, and installation comes with guaranteed pricing, certified technicians, and our 100% satisfaction commitment.
          </p>

          {/* Hero Service Speed Color Meaning Legend */}
          <div className="pt-2 flex justify-center">
            <div className="inline-flex flex-wrap items-center justify-center gap-2 sm:gap-4 px-4 py-2 rounded-2xl bg-[#0F172A]/80 border border-white/10 text-xs shadow-md">
              <span className="font-bold text-slate-300 uppercase tracking-wider text-[11px]">
                Service Speed Guide:
              </span>
              <span className="inline-flex items-center gap-1.5 font-semibold text-blue-400">
                <span className="h-2 w-2 rounded-full bg-blue-500 shadow-sm shadow-blue-500/50" />
                Blue = Fast Services (Emergency Priority)
              </span>
              <span className="text-white/20 hidden sm:inline">•</span>
              <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
                Green = Medium Time Services (Diagnostics)
              </span>
              <span className="text-white/20 hidden sm:inline">•</span>
              <span className="inline-flex items-center gap-1.5 font-semibold text-orange-400">
                <span className="h-2 w-2 rounded-full bg-[#F97316] shadow-sm shadow-orange-500/50" />
                Orange = Regular Services (Maintenance)
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Catalog Sections */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 max-w-7xl mx-auto">
        <ServicesCatalogClient
          businessPhone={businessConfig.phone}
          city={businessConfig.city}
        />
      </section>
    </div>
  );
}
