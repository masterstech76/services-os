"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  X,
  Star,
  ShieldCheck,
  MapPin,
  Clock,
  Wrench,
  Truck,
  Award,
  ExternalLink,
  CalendarCheck,
  CheckCircle2,
} from "lucide-react";

export interface ModalWorkerData {
  id: string;
  slug: string;
  name: string;
  role: string;
  badge?: string;
  certifications?: string | string[];
  specialties?: string[];
  rating: number;
  reviewCount: number;
  initials: string;
  status: "available" | "busy_coming_soon" | "en_route";
  statusNote?: string;
  stagedZone?: string;
  truckStockNote?: string;
  avatar?: string;
  bio?: string;
  experienceYears?: string;
  onTimeRate?: string;
  vanNumber?: string;
  vanModel?: string;
}

interface WorkerProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  worker: ModalWorkerData | null;
  onBookNow?: (workerId: string, workerName: string) => void;
}

export function WorkerProfileModal({
  isOpen,
  onClose,
  worker,
  onBookNow,
}: WorkerProfileModalProps) {
  const router = useRouter();

  React.useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      }
    }
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !worker) return null;

  const certList = Array.isArray(worker.certifications)
    ? worker.certifications
    : worker.certifications
    ? worker.certifications.split("·").map((s) => s.trim())
    : ["EPA Universal 608", "NATE Master Certified", "OSHA 30 Safety Standard"];

  const specialtiesList = worker.specialties || [
    "Complex Diagnostics",
    "Inverter Systems",
    "Capacitor & Fan Overhauls",
    "Emergency Restorations",
  ];

  const profileHref = `/workers/${worker.slug || worker.id}`;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      {/* Backdrop click to close */}
      <div
        className="fixed inset-0 -z-10"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* macOS-style Mini Window Modal Container */}
      <div className="bg-[#0C1523] text-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl relative border border-white/15 overflow-hidden ring-1 ring-white/10 z-10 animate-in zoom-in-95 duration-150">
        
        {/* macOS Title Bar Header */}
        <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-white/10 bg-[#0F172A] shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]" />
              <span className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]" />
              <span className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]" />
            </div>
            <div className="flex items-center gap-2 ml-1">
              <img
                src="/images/servicepro-icon-transparent.png?v=green"
                alt="ServicePro OS"
                className="h-5 w-auto object-contain"
              />
              <span className="text-xs sm:text-sm font-bold text-white tracking-tight">
                Worker Profile &bull; {worker.name}
              </span>
            </div>
          </div>

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close worker profile modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 scrollbar-thin scrollbar-thumb-white/10">
          
          {/* Top Hero: Avatar, Status, Name, Rating */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5 pb-5 border-b border-white/10">
            <div className="relative shrink-0">
              <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-800 border-2 border-white/20 shadow-xl flex items-center justify-center text-white font-bold text-2xl">
                {worker.avatar ? (
                  <Image
                    src={worker.avatar}
                    alt={worker.name}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>{worker.initials}</span>
                )}
              </div>
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#F97316] text-[#0C1523] uppercase tracking-wider shadow">
                {worker.vanNumber || "Fleet Unit"}
              </span>
            </div>

            <div className="space-y-1 min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#F97316]">
                  Master Certified Specialist
                </span>
                {worker.status === "available" ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Available Now &bull; Immediate Dispatch
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    <Clock className="w-3 h-3" />
                    On Active Site &bull; Coming Soon (~35m)
                  </span>
                )}
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {worker.name}
              </h2>
              <p className="text-xs text-slate-300 font-medium">
                {worker.role}
              </p>

              <div className="flex items-center gap-2 pt-1">
                <div className="flex items-center text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-xs font-bold text-white font-mono">{worker.rating}</span>
                <span className="text-xs text-slate-400">({worker.reviewCount} verified homeowner reviews)</span>
              </div>
            </div>
          </div>

          {/* Key Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Experience</span>
              <span className="text-sm font-black text-white mt-0.5 block">{worker.experienceYears || "12+ Years"}</span>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">On-Time Arrival</span>
              <span className="text-sm font-black text-emerald-400 mt-0.5 block">{worker.onTimeRate || "99.4%"}</span>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Service Van</span>
              <span className="text-sm font-black text-white mt-0.5 block">{worker.vanNumber || "Fleet Unit"}</span>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">5-Star Ratio</span>
              <span className="text-sm font-black text-amber-400 mt-0.5 block">99.2%</span>
            </div>
          </div>

          {/* Staged Location & Live Status Note */}
          <div className="p-4 rounded-xl bg-[#0F172A] border border-white/10 space-y-2 text-xs">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block font-semibold">Active Dispatch Corridor:</strong>
                <span className="text-slate-300">{worker.stagedZone || "Miami-Dade & Broward Metro"}</span>
              </div>
            </div>
            {worker.statusNote && (
              <div className="pt-2 border-t border-white/5 text-[11px] text-slate-300">
                <strong className="text-white">Real-Time Dispatch Note: </strong>
                {worker.statusNote}
              </div>
            )}
          </div>

          {/* Bio / About */}
          {worker.bio && (
            <div className="space-y-1.5 text-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Specialist Background &amp; Focus
              </span>
              <p className="text-slate-300 leading-relaxed bg-white/[0.02] p-3.5 rounded-xl border border-white/5">
                {worker.bio}
              </p>
            </div>
          )}

          {/* Trade Certifications & Credentials */}
          <div className="space-y-2">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Verified State &amp; National Credentials
            </span>
            <div className="flex flex-wrap gap-2">
              {certList.map((cert, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/25 text-emerald-300"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{cert}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Trade Specialties */}
          <div className="space-y-2">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Core Technical Competencies
            </span>
            <div className="flex flex-wrap gap-2">
              {specialtiesList.map((spec, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/5 border border-white/10 text-slate-200"
                >
                  <Wrench className="w-3 h-3 text-[#F97316]" />
                  <span>{spec}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Rolling Warehouse Stock */}
          {worker.truckStockNote && (
            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-slate-300 space-y-1">
              <div className="flex items-center gap-1.5 text-[#F97316] font-bold text-[11px] uppercase">
                <Truck className="w-3.5 h-3.5" />
                <span>On-Board Rolling Warehouse Inventory:</span>
              </div>
              <p className="text-slate-300 text-xs">{worker.truckStockNote}</p>
            </div>
          )}
        </div>

        {/* Modal Action Footer */}
        <div className="p-4 sm:p-5 border-t border-white/10 bg-[#0F172A] shrink-0 flex flex-col sm:flex-row items-center gap-3">
          {/* Book Specialist Button */}
          <button
            type="button"
            onClick={() => {
              onClose();
              if (onBookNow) {
                onBookNow(worker.id, worker.name);
              }
            }}
            className="w-full sm:flex-1 h-11 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 active:scale-98 transition-all cursor-pointer"
          >
            <CalendarCheck className="w-4 h-4" />
            <span>Book With {worker.name.split(" ")[0]} (Open Mini Window)</span>
          </button>

          {/* Full Page Button */}
          <Link
            href={profileHref}
            onClick={onClose}
            className="w-full sm:w-auto px-4 h-11 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 hover:border-white/30 text-white font-semibold text-xs inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0"
          >
            <span>Full Profile Page</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </Link>
        </div>
      </div>
    </div>
  );
}
