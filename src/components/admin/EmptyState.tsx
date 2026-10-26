"use client";

import React from "react";
import type { LucideIcon } from "lucide-react";
import { Inbox, AlertCircle, SearchX, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface EmptyStateProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  variant?: "empty" | "error" | "no-results";
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  className?: string;
}

export function EmptyState({
  title,
  description,
  icon,
  variant = "empty",
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  className = "",
}: EmptyStateProps) {
  const Icon =
    icon ||
    (variant === "error"
      ? AlertCircle
      : variant === "no-results"
      ? SearchX
      : Inbox);

  const haloStyles =
    variant === "error"
      ? "bg-rose-500/15 border-rose-500/30 text-rose-400"
      : variant === "no-results"
      ? "bg-amber-500/15 border-amber-500/30 text-amber-400"
      : "bg-[#F97316]/15 border-[#F97316]/30 text-[#F97316]";

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-white/10 bg-[#0F172A]/90 backdrop-blur-xl p-8 sm:p-12 text-center flex flex-col items-center justify-center space-y-4 shadow-xl ${className}`}
    >
      {/* Ambient Radial Glow */}
      <div className="absolute top-0 w-48 h-48 bg-[#F97316]/5 rounded-full blur-3xl pointer-events-none" />

      <div
        className={`relative z-10 h-14 w-14 rounded-xl border flex items-center justify-center shadow-md ${haloStyles}`}
      >
        <Icon className="h-7 w-7" />
      </div>

      <div className="relative z-10 max-w-md space-y-1.5">
        <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">{title}</h3>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
          {description}
        </p>
      </div>

      {(actionLabel && onAction) || (secondaryActionLabel && onSecondaryAction) ? (
        <div className="relative z-10 flex items-center gap-3 pt-2 flex-wrap justify-center">
          {actionLabel && onAction ? (
            <button
              type="button"
              onClick={onAction}
              className="bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold px-5 py-2.5 rounded-lg text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#F97316]/30 hover:shadow-[#F97316]/50 transition-all cursor-pointer"
            >
              <span>{actionLabel}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : null}

          {secondaryActionLabel && onSecondaryAction ? (
            <button
              type="button"
              onClick={onSecondaryAction}
              className="border border-white/20 bg-white/5 hover:bg-white/10 text-white font-medium px-4 py-2.5 rounded-lg text-xs sm:text-sm flex items-center justify-center gap-2 backdrop-blur-md transition-all cursor-pointer shadow-sm hover:border-white/30"
            >
              {secondaryActionLabel}
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export default EmptyState;
