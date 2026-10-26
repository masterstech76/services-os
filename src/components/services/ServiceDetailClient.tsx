"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ThermometerSnowflake,
  Gauge,
  Zap,
  CheckCircle2,
  Wrench,
  Sparkles,
  Flame,
  Sliders,
  ShieldCheck,
  Clock,
  Phone,
  ArrowRight,
  AlertTriangle,
  Cpu,
  RefreshCw,
  Activity,
  Star,
  MapPin,
  Truck,
  User,
  Radio,
} from "lucide-react";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { BookingMiniWindowModal } from "@/components/booking/BookingMiniWindowModal";
import { WorkerProfileModal, type ModalWorkerData } from "@/components/workers/WorkerProfileModal";
import {
  ServiceDetail,
  SERVICES_DETAIL_DATA,
  MASTER_TECHNICIANS,
  TechnicianAssignment,
} from "@/lib/services-detail-data";

interface ServiceDetailClientProps {
  initialService: ServiceDetail;
  businessPhone: string;
}

export function ServiceDetailClient({
  initialService,
  businessPhone,
}: ServiceDetailClientProps) {
  const [service, setService] = React.useState<ServiceDetail>(initialService);
  const [telemetry, setTelemetry] = React.useState(initialService.aiTelemetry);
  const [isScanning, setIsScanning] = React.useState(false);
  const [lastScannedSecsAgo, setLastScannedSecsAgo] = React.useState(14);
  const [activeTechFilter, setActiveTechFilter] = React.useState<"all" | "available" | "busy_coming_soon">("all");
  const [bookingModalOpen, setBookingModalOpen] = React.useState(false);
  const [selectedTechForModal, setSelectedTechForModal] = React.useState<{ id: string; name: string } | undefined>();
  const [selectedWorkerForModal, setSelectedWorkerForModal] = React.useState<ModalWorkerData | null>(null);
  const [workerProfileModalOpen, setWorkerProfileModalOpen] = React.useState(false);

  const cleanPhoneHref = `tel:${businessPhone.replace(/\D/g, "")}`;

  // Check localStorage for any admin or worker panel overrides
  React.useEffect(() => {
    try {
      const storedCatalog = localStorage.getItem("servicepro_services_catalog_v2");
      if (storedCatalog) {
        const parsed = JSON.parse(storedCatalog);
        if (parsed[initialService.slug]) {
          setService(parsed[initialService.slug]);
          setTelemetry(parsed[initialService.slug].aiTelemetry);
        }
      }
    } catch {
      // LocalStorage not available or parse error
    }
  }, [initialService.slug]);

  // Auto-updating live ML timer tick
  React.useEffect(() => {
    const interval = setInterval(() => {
      setLastScannedSecsAgo((prev) => (prev > 60 ? 5 : prev + 1));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Simulate real-time ML diagnostic scan and live sensor update
  const handleRunAiTelemetryScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setTelemetry((prev) => {
        const deltaTemp = (Math.random() * 2 - 1).toFixed(1);
        const newTemp = Math.round(prev.ambientTemp + Number(deltaTemp));
        const updatedRisks = prev.failureProbabilities.map((risk) => {
          const shift = Math.floor(Math.random() * 5) - 2;
          const newProb = Math.min(95, Math.max(8, risk.probability + shift));
          return {
            ...risk,
            probability: newProb,
            risk: newProb > 40 ? "high" : newProb > 20 ? "medium" : "low",
          } as const;
        });

        return {
          ...prev,
          ambientTemp: newTemp,
          failureProbabilities: updatedRisks,
          modelConfidence: Number((94 + Math.random() * 4).toFixed(1)),
          lastUpdatedMinutesAgo: 0,
        };
      });
      setLastScannedSecsAgo(0);
      setIsScanning(false);
    }, 700);
  };

  // Filter technicians based on user toggle
  const displayedTechnicians = React.useMemo(() => {
    if (activeTechFilter === "available") {
      return service.assignedTechnicians.filter((t) => t.status === "available");
    }
    if (activeTechFilter === "busy_coming_soon") {
      return service.assignedTechnicians.filter((t) => t.status === "busy_coming_soon");
    }
    return service.assignedTechnicians;
  }, [service.assignedTechnicians, activeTechFilter]);

  // Icon resolver for dynamic diagnostic phases
  const renderPhaseIcon = (iconName: string) => {
    switch (iconName) {
      case "ThermometerSnowflake":
        return <ThermometerSnowflake className="h-4 w-4 text-[#F97316]" />;
      case "Gauge":
        return <Gauge className="h-4 w-4 text-[#F97316]" />;
      case "Zap":
        return <Zap className="h-4 w-4 text-[#F97316]" />;
      case "Wrench":
        return <Wrench className="h-4 w-4 text-[#F97316]" />;
      case "Sparkles":
        return <Sparkles className="h-4 w-4 text-[#F97316]" />;
      case "Flame":
        return <Flame className="h-4 w-4 text-[#F97316]" />;
      case "Sliders":
        return <Sliders className="h-4 w-4 text-[#F97316]" />;
      default:
        return <CheckCircle2 className="h-4 w-4 text-[#F97316]" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0C1523] text-white selection:bg-[#F97316] selection:text-white pb-20">
      <Breadcrumbs
        items={[
          { label: "Services", href: "/services" },
          { label: service.title },
        ]}
      />

      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-10 pb-16 px-4 sm:px-6 border-b border-white/10">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#F97316]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-[#F97316] uppercase tracking-wider bg-orange-500/10 px-3.5 py-1 rounded-full border border-orange-500/20 inline-flex items-center gap-1.5">
                <Wrench className="h-3.5 w-3.5" />
                {service.categoryLabel}
              </span>
              <span className="text-xs font-bold text-slate-300 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                {service.speedBadge}
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              {service.headlinePrefix}{" "}
              <span className="text-[#F97316]">{service.highlightWord}</span>{" "}
              {service.headlineSuffix}
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
              {service.description}
            </p>

            <div className="flex flex-wrap gap-4 text-xs font-bold text-slate-300">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-[#F97316]" /> {service.valueProps.warranty}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-[#F97316]" /> {service.valueProps.arrivalWindow}
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" /> {service.valueProps.pricingNote}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                type="button"
                size="lg"
                onClick={() => {
                  setSelectedTechForModal(undefined);
                  setBookingModalOpen(true);
                }}
                className="rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white font-bold h-12 px-6 shadow-md transition-all cursor-pointer"
              >
                <span>Schedule Service ({service.price})</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <a
                href={cleanPhoneHref}
                className="inline-flex h-12 items-center justify-center rounded-xl border border-white/20 bg-white/5 px-6 font-bold text-sm text-white hover:bg-white/10 transition-all shadow-sm gap-2"
              >
                <Phone className="h-4 w-4 text-orange-400" />
                <span>Call Dispatch: {businessPhone}</span>
              </a>
            </div>

            {/* Hero Service Speed Color Meaning Legend */}
            <div className="pt-2">
              <div className="inline-flex flex-wrap items-center gap-2 sm:gap-3 p-2.5 sm:px-4 sm:py-2 rounded-2xl bg-white/[0.04] border border-white/10 text-xs shadow-sm">
                <span className="font-bold text-slate-300 text-[11px] uppercase tracking-wider">
                  Service Speed Key:
                </span>
                <span className="inline-flex items-center gap-1.5 font-semibold text-blue-400">
                  <span className="h-2 w-2 rounded-full bg-blue-500 shadow-sm shadow-blue-500/50" />
                  Blue = Fast Services (15–25m Urgent)
                </span>
                <span className="text-white/20 hidden sm:inline">•</span>
                <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
                  Green = Medium Time (20–30m Standby)
                </span>
                <span className="text-white/20 hidden sm:inline">•</span>
                <span className="inline-flex items-center gap-1.5 font-semibold text-orange-400">
                  <span className="h-2 w-2 rounded-full bg-[#F97316] shadow-sm shadow-orange-500/50" />
                  Orange = Regular Services (Maintenance)
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative h-80 sm:h-96 w-full rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-slate-900">
              <Image
                src={service.image}
                alt={service.title}
                fill
                quality={85}
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
                priority
              />
              <div className="absolute bottom-4 left-4 right-4 bg-[#0C1523]/95 backdrop-blur-md text-white p-4 rounded-2xl border border-white/10 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-[#F97316] block">Mobile Warehouse Van</span>
                  <span className="text-[11px] text-slate-300">Over 300 OEM HVAC Parts Onboard</span>
                </div>
                <span className="font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                  94% 1st-Trip Fix
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. AI / ML Predictive Diagnostics & Live Fleet Telemetry Engine */}
      <section className="py-10 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#0F172A] via-[#131F33] to-[#0A101D] border border-blue-500/30 shadow-2xl space-y-6 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Cpu className="h-3.5 w-3.5 text-blue-400 animate-pulse" />
                  Neural HVAC Diagnostic Engine v4.2 · Live Auto-Telemetry
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                  <Activity className="h-3 w-3" /> Real-Time Telemetry
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Live Sensor Telemetry &amp; Component Failure Probability Matrix
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400 font-mono hidden sm:inline">
                Auto-updated {lastScannedSecsAgo}s ago
              </span>
              <Button
                onClick={handleRunAiTelemetryScan}
                disabled={isScanning}
                size="sm"
                className="rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs h-9 px-4 gap-1.5 shadow-md shadow-blue-500/20"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isScanning ? "animate-spin" : ""}`} />
                <span>{isScanning ? "Scanning Fleet..." : "Re-Scan Sensor Telemetry"}</span>
              </Button>
            </div>
          </div>

          {/* Telemetry Sensor Metrics Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
              <span className="text-xs text-slate-400">Ambient Sensor Temperature</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-extrabold text-amber-400 font-mono">
                  {telemetry.ambientTemp}°F
                </span>
                <span className="text-xs text-slate-400">Peak Thermal Load</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
              <span className="text-xs text-slate-400">Outdoor Relative Humidity</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-extrabold text-blue-400 font-mono">
                  {telemetry.humidity}%
                </span>
                <span className="text-xs text-slate-400">Subtropical Latent Heat</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
              <span className="text-xs text-slate-400">ML Model Precision Confidence</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-extrabold text-emerald-400 font-mono">
                  {telemetry.modelConfidence}%
                </span>
                <span className="text-xs text-slate-400">Historical Field Fix Matches</span>
              </div>
            </div>
          </div>

          {/* AI Predictive Failure Probabilities Bar */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-300">
              <span className="uppercase tracking-wider">Predictive Component Risk Factors (Calculated in Real-Time):</span>
              <span className="text-slate-400 font-mono">Auto-Calculated from 1,240+ Area Repairs</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {telemetry.failureProbabilities.map((risk, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-black/30 border border-white/10 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-white">{risk.component}</span>
                    <span
                      className={`font-mono font-bold px-2 py-0.5 rounded text-[11px] ${
                        risk.risk === "high"
                          ? "bg-red-500/20 text-red-400 border border-red-500/30"
                          : risk.risk === "medium"
                          ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                          : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      }`}
                    >
                      {risk.probability}% Probability
                    </span>
                  </div>
                  {/* Progress track */}
                  <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        risk.risk === "high"
                          ? "bg-red-500"
                          : risk.risk === "medium"
                          ? "bg-amber-500"
                          : "bg-emerald-500"
                      }`}
                      style={{ width: `${risk.probability}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Diagnostic Summary Box */}
          <div className="p-4 rounded-2xl bg-blue-950/40 border border-blue-500/25 flex items-start gap-3 text-xs sm:text-sm text-slate-300">
            <Radio className="h-5 w-5 text-blue-400 shrink-0 mt-0.5 animate-pulse" />
            <div>
              <strong className="text-white block font-bold mb-0.5">AI Telemetry Insight:</strong>
              {telemetry.aiDiagnosticInsight}
            </div>
          </div>
        </div>
      </section>

      {/* 3. 4-Phase Systematic Protocol */}
      <section className="py-12 px-4 sm:px-6 max-w-7xl mx-auto space-y-8">
        <div className="max-w-3xl space-y-2">
          <span className="text-xs font-mono font-bold text-[#F97316] uppercase tracking-wider">
            Engineering Precision
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Our 4-Phase Systematic {service.shortTitle} Standard
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            We don&apos;t guess or swap parts blindly. Every visit follows our rigorous digital procedure to ensure long-term equipment reliability and peace of mind.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {service.diagnosticPhases.map((phase, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-white/10 bg-[#0F172A]/80 backdrop-blur-xl p-6 shadow-lg hover:border-white/20 transition-all space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-[#F97316] bg-orange-500/10 px-2.5 py-0.5 rounded-full border border-orange-500/20">
                    {phase.phase}
                  </span>
                  <div className="h-8 w-8 rounded-xl bg-white/5 text-slate-300 flex items-center justify-center border border-white/10">
                    {renderPhaseIcon(phase.iconName)}
                  </div>
                </div>
                <h3 className="font-bold text-sm text-white">{phase.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{phase.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Common Symptoms & Root Causes We Resolve */}
      <section className="py-12 px-4 sm:px-6 max-w-7xl mx-auto bg-[#0F172A]/70 backdrop-blur-xl rounded-3xl border border-white/10 my-8 space-y-8">
        <div className="max-w-3xl space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Symptoms &amp; Probable Root Causes We Resolve
          </h2>
          <p className="text-sm text-slate-300">
            If your equipment displays any of these symptoms, our certified technicians can inspect and repair it on-site today.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {service.commonIssues.map((issue, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl border border-white/10 bg-[#0B1320]/80 shadow-sm space-y-2 text-xs"
            >
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="h-4 w-4 text-[#F97316] shrink-0 mt-0.5" />
                <span className="font-bold text-white text-sm leading-snug">{issue.symptom}</span>
              </div>
              <p className="text-slate-300 pl-6 leading-relaxed">
                <strong className="text-slate-100">Probable Cause:</strong> {issue.cause}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Truck Stock Inventory Spec */}
      <section className="py-12 px-4 sm:px-6 max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono font-bold text-[#F97316] uppercase tracking-wider">
              Rolling Warehouse Fleet
            </span>
            <h2 className="text-2xl font-bold text-white mt-1">
              OEM Replacement Parts Carried on Every Dispatch Van
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Certified Rolling Inventory
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {service.truckStockParts.map((part, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl border border-white/10 bg-[#0F172A]/80 backdrop-blur-xl text-xs space-y-1 shadow-sm"
            >
              <Wrench className="h-3.5 w-3.5 text-[#F97316] mb-1" />
              <p className="font-bold text-white leading-tight">{part.name}</p>
              <p className="text-[11px] text-slate-400">{part.spec}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. On-Duty Qualified Technicians Roster (Multi-Worker Standard) */}
      <section className="py-12 px-4 sm:px-6 max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              Workers List · Qualified Specialists Who Can Do This Work
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Workers Who Can Do This Work: {service.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Multiple master technicians work for this service. Check real-time availability notes to see which specialist is available now or coming soon after completing an active site.
            </p>
          </div>

          {/* Quick Availability Filters */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTechFilter("all")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTechFilter === "all"
                  ? "bg-[#F97316] text-white"
                  : "bg-white/5 text-slate-300 hover:text-white border border-white/10"
              }`}
            >
              All Specialists ({service.assignedTechnicians.length})
            </button>
            <button
              onClick={() => setActiveTechFilter("available")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTechFilter === "available"
                  ? "bg-emerald-600 text-white"
                  : "bg-white/5 text-slate-300 hover:text-white border border-white/10"
              }`}
            >
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Available Now
            </button>
            <button
              onClick={() => setActiveTechFilter("busy_coming_soon")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTechFilter === "busy_coming_soon"
                  ? "bg-amber-600 text-white"
                  : "bg-white/5 text-slate-300 hover:text-white border border-white/10"
              }`}
            >
              <span className="h-2 w-2 rounded-full bg-amber-400" />
              Coming Soon
            </button>
          </div>
        </div>

        {/* Top Side of Cards: Service Button Color Meaning */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl bg-[#0F172A]/90 border border-white/10 shadow-lg">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Dispatch Button Color Code:
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-300 font-bold text-[11px]">
              <span className="h-2 w-2 rounded-full bg-blue-500 shadow-sm shadow-blue-500/50" />
              Blue = Fast Services (15–25m Urgent)
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-bold text-[11px]">
              <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
              Green = Medium Time Services (20–30m Standby)
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-orange-500/15 border border-orange-500/30 text-orange-300 font-bold text-[11px]">
              <span className="h-2 w-2 rounded-full bg-[#F97316] shadow-sm shadow-orange-500/50" />
              Orange = Regular Services (Maintenance)
            </span>
          </div>
        </div>

        {/* Dynamic Multi-Worker Specialist Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedTechnicians.map((tech) => (
            <div
              key={tech.id}
              className={`p-6 rounded-3xl border bg-[#0F172A]/90 backdrop-blur-xl shadow-xl flex flex-col justify-between space-y-5 transition-all ${
                tech.status === "available"
                  ? "border-emerald-500/30 hover:border-emerald-500/50"
                  : "border-amber-500/30 hover:border-amber-500/50"
              }`}
            >
              <div className="space-y-4">
                {/* Status indicator pill */}
                <div className="flex items-center justify-between">
                  {tech.status === "available" ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Available Now · Immediate Dispatch
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      <Clock className="h-3 w-3" />
                      On Active Site · Coming Soon
                    </span>
                  )}
                  <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    {tech.rating} ({tech.reviewCount})
                  </span>
                </div>

                {/* Worker Identity */}
                <div
                  onClick={() => {
                    setSelectedWorkerForModal({
                      ...tech,
                      slug: tech.id,
                    });
                    setWorkerProfileModalOpen(true);
                  }}
                  className="flex items-start gap-4 cursor-pointer group/tech"
                  role="button"
                  tabIndex={0}
                  aria-label={`View profile for ${tech.name}`}
                >
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-slate-700 to-slate-800 border border-white/10 text-white font-bold text-base flex items-center justify-center shrink-0 shadow-md group-hover/tech:scale-105 group-hover/tech:border-orange-500/50 transition-all">
                    {tech.initials}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover/tech:text-[#F97316] transition-colors">{tech.name}</h3>
                    <p className="text-xs text-orange-400 font-semibold">{tech.role}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{tech.certifications}</p>
                  </div>
                </div>

                {/* Live Location & Availability Note */}
                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2 text-xs text-slate-300">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block font-semibold">Current Staged Zone:</strong>
                      <span className="text-slate-300">{tech.stagedZone}</span>
                    </div>
                  </div>

                  <div className="pt-1 border-t border-white/5 text-[11px] text-slate-400">
                    <strong className="text-slate-200">Live Status Note: </strong>
                    {tech.statusNote}
                  </div>
                </div>
              </div>

              {/* Action Buttons: Worker Profile Link + Colored Dispatch Button */}
              <div className="space-y-2 pt-2">
                <Button
                  type="button"
                  onClick={() => {
                    setSelectedTechForModal({ id: tech.id, name: tech.name });
                    setBookingModalOpen(true);
                  }}
                  className={`w-full rounded-xl text-white font-bold text-xs h-11 shadow-lg cursor-pointer ${
                    tech.speedTier === "fast"
                      ? "bg-blue-600 hover:bg-blue-500 shadow-blue-500/25"
                      : tech.speedTier === "medium"
                      ? "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/25"
                      : "bg-[#F97316] hover:bg-[#EA580C] shadow-orange-500/25"
                  }`}
                >
                  {tech.buttonText}
                </Button>

                <Button
                  type="button"
                  onClick={() => {
                    setSelectedWorkerForModal({
                      ...tech,
                      slug: tech.id,
                    });
                    setWorkerProfileModalOpen(true);
                  }}
                  variant="outline"
                  className="w-full h-9 rounded-xl border-white/15 bg-white/5 hover:bg-white/10 text-white font-semibold text-xs transition-colors cursor-pointer"
                >
                  <User className="mr-1.5 h-3.5 w-3.5 text-slate-300" />
                  <span>View {tech.name.split(" ")[0]}&apos;s Profile &amp; Reviews →</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Global Booking Mini Window Modal */}
      <BookingMiniWindowModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        preselectedTechId={selectedTechForModal?.id}
        preselectedTechName={selectedTechForModal?.name}
        preselectedServiceId={service.slug}
        preselectedSpeedTier={service.speedTier}
      />

      {/* Global Worker Profile Mini Window Modal */}
      <WorkerProfileModal
        isOpen={workerProfileModalOpen}
        onClose={() => setWorkerProfileModalOpen(false)}
        worker={selectedWorkerForModal}
        onBookNow={(workerId, workerName) => {
          setSelectedTechForModal({ id: workerId, name: workerName });
          setBookingModalOpen(true);
        }}
      />
    </div>
  );
}
