"use client";

import * as React from "react";
import { X } from "lucide-react";
import { BookingWizard } from "@/components/booking/BookingWizard";

export interface BookingMiniWindowModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedTechId?: string;
  preselectedTechName?: string;
  preselectedServiceId?: string;
  preselectedSpeedTier?: "fast" | "medium" | "regular";
}

export function BookingMiniWindowModal({
  isOpen,
  onClose,
}: BookingMiniWindowModalProps) {
  // Handle Escape key to close
  React.useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      }
    }
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      // Lock scroll while open
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in">
      {/* Backdrop Click to Close */}
      <div
        className="fixed inset-0 -z-10"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Exact macOS Mini Window Screen matching Landing Page Standard */}
      <div className="bg-white rounded-2xl max-w-2xl w-full h-[82vh] max-h-[660px] flex flex-col shadow-2xl relative border border-slate-300/80 overflow-hidden ring-1 ring-black/10 z-10 animate-in zoom-in-95 duration-150">
        {/* Professional Window Title Bar with macOS Control Dots */}
        <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-white/10 bg-[#0F172A] text-white shrink-0">
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
                ServicePro OS — Instant Booking Wizard
              </span>
            </div>
          </div>

          {/* Close Button Only */}
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close booking window"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Embedded Booking Wizard (Fully contained inside Mini Screen) */}
        <div className="flex-1 flex flex-col overflow-hidden bg-slate-50 relative">
          <React.Suspense
            fallback={
              <div className="flex-1 flex items-center justify-center bg-white text-slate-600 text-sm font-medium">
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                  <span>Loading booking wizard…</span>
                </div>
              </div>
            }
          >
            <BookingWizard isModal={true} />
          </React.Suspense>
        </div>
      </div>
    </div>
  );
}
