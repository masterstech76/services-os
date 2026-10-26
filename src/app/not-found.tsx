import React from "react";
import Link from "next/link";
import { AlertTriangle, Home, ArrowLeft, PhoneCall, Sparkles } from "lucide-react";
import { businessConfig } from "@config/business.config";
import { BrandTagline } from "@/components/brand/BrandTagline";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0C1523] text-white flex flex-col items-center justify-center p-4 selection:bg-[#F97316] selection:text-white">
      {/* Brand Header */}
      <div className="mb-6 flex flex-col items-center">
        <Link href="/" className="flex items-center gap-3">
          <img
            src="/images/servicepro-icon-transparent.png?v=green"
            alt="ServicePro OS"
            className="h-10 w-auto object-contain"
          />
          <div className="flex flex-col text-left">
            <span className="text-xl font-bold tracking-tight text-white leading-tight">
              ServicePro <span className="text-[#F97316]">OS</span>
            </span>
            <BrandTagline size="base" className="mt-0.5" />
          </div>
        </Link>
      </div>

      {/* Centered Floating Mini-Window Error Dialog */}
      <div className="max-w-md w-full rounded-3xl border border-amber-500/30 bg-[#0F172A]/95 p-8 shadow-2xl backdrop-blur-2xl text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto shadow-lg">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20">
            ERROR CODE: 404 — PAGE NOT FOUND
          </span>
          <h1 className="text-2xl font-black text-white pt-1">
            Page Not Found or Offline
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            The URL you entered does not exist or may have been temporarily deactivated by dispatch operations.
          </p>
        </div>

        <div className="space-y-2.5 pt-2">
          <Link
            href="/"
            className="w-full h-11 inline-flex items-center justify-center gap-2 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white text-xs font-bold transition-all shadow-md shadow-orange-500/20"
          >
            <Home className="w-4 h-4" />
            <span>Return to Safety / Home</span>
          </Link>

          <Link
            href="/services"
            className="w-full h-11 inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-white text-xs font-semibold transition-all"
          >
            <Sparkles className="w-4 h-4 text-orange-400" />
            <span>Browse Available Services</span>
          </Link>

          <a
            href={`tel:${businessConfig.phone.replace(/[^0-9]/g, "")}`}
            className="w-full h-10 inline-flex items-center justify-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <PhoneCall className="w-3.5 h-3.5 text-[#F97316]" />
            <span>Call Dispatch Desk: {businessConfig.phone}</span>
          </a>
        </div>
      </div>
    </div>
  );
}
