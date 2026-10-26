"use client";

import React from "react";
import type { LucideIcon } from "lucide-react";

export interface StatCardProps {
  title?: string;
  label?: string;
  value: React.ReactNode;
  subtitle?: string;
  icon: LucideIcon;
  accentColor?:
    | "emerald"
    | "amber"
    | "blue"
    | "purple"
    | "orange"
    | "sky"
    | "rose"
    | "indigo"
    | "info"
    | "default"
    | string;
  variant?: string;
  trend?: {
    value: string;
    positive?: boolean;
    label?: string;
  };
  badge?: string;
  loading?: boolean;
  className?: string;
  onClick?: () => void;
}

const ACCENT_STYLES: Record<
  string,
  {
    topBar: string;
    iconHalo: string;
    iconColor: string;
    valueColor: string;
    hoverBorder: string;
    glow: string;
  }
> = {
  orange: {
    topBar: "bg-[#F97316]",
    iconHalo: "bg-[#F97316]/15 border-[#F97316]/30 text-[#F97316]",
    iconColor: "text-[#F97316]",
    valueColor: "text-white",
    hoverBorder: "hover:border-[#F97316]/50",
    glow: "bg-[#F97316]/10",
  },
  emerald: {
    topBar: "bg-emerald-500",
    iconHalo: "bg-emerald-500/15 border-emerald-500/30 text-emerald-400",
    iconColor: "text-emerald-400",
    valueColor: "text-white",
    hoverBorder: "hover:border-emerald-500/50",
    glow: "bg-emerald-500/10",
  },
  amber: {
    topBar: "bg-amber-500",
    iconHalo: "bg-amber-500/15 border-amber-500/30 text-amber-400",
    iconColor: "text-amber-400",
    valueColor: "text-white",
    hoverBorder: "hover:border-amber-500/50",
    glow: "bg-amber-500/10",
  },
  blue: {
    topBar: "bg-blue-500",
    iconHalo: "bg-blue-500/15 border-blue-500/30 text-blue-400",
    iconColor: "text-blue-400",
    valueColor: "text-white",
    hoverBorder: "hover:border-blue-500/50",
    glow: "bg-blue-500/10",
  },
  sky: {
    topBar: "bg-sky-500",
    iconHalo: "bg-sky-500/15 border-sky-500/30 text-sky-400",
    iconColor: "text-sky-400",
    valueColor: "text-white",
    hoverBorder: "hover:border-sky-500/50",
    glow: "bg-sky-500/10",
  },
  info: {
    topBar: "bg-[#F97316]",
    iconHalo: "bg-[#F97316]/15 border-[#F97316]/30 text-[#F97316]",
    iconColor: "text-[#F97316]",
    valueColor: "text-white",
    hoverBorder: "hover:border-[#F97316]/50",
    glow: "bg-[#F97316]/10",
  },
  rose: {
    topBar: "bg-rose-500",
    iconHalo: "bg-rose-500/15 border-rose-500/30 text-rose-400",
    iconColor: "text-rose-400",
    valueColor: "text-white",
    hoverBorder: "hover:border-rose-500/50",
    glow: "bg-rose-500/10",
  },
  purple: {
    topBar: "bg-purple-500",
    iconHalo: "bg-purple-500/15 border-purple-500/30 text-purple-400",
    iconColor: "text-purple-400",
    valueColor: "text-white",
    hoverBorder: "hover:border-purple-500/50",
    glow: "bg-purple-500/10",
  },
  default: {
    topBar: "bg-[#F97316]",
    iconHalo: "bg-[#F97316]/15 border-[#F97316]/30 text-[#F97316]",
    iconColor: "text-[#F97316]",
    valueColor: "text-white",
    hoverBorder: "hover:border-[#F97316]/50",
    glow: "bg-[#F97316]/10",
  },
};

export function StatCard({
  title,
  label,
  value,
  subtitle,
  icon: Icon,
  accentColor,
  variant,
  trend,
  badge,
  loading = false,
  className = "",
  onClick,
}: StatCardProps) {
  const displayTitle = title || label || "";
  const rawKey = accentColor || variant || "orange";
  const styles = ACCENT_STYLES[rawKey] || ACCENT_STYLES.orange;

  if (loading) {
    return (
      <div
        className={`relative overflow-hidden rounded-2xl border border-white/10 bg-[#0F172A]/90 p-5 backdrop-blur-xl animate-pulse ${className}`}
      >
        <div className="h-4 w-24 bg-white/10 rounded mb-3" />
        <div className="h-8 w-32 bg-white/15 rounded mb-2" />
        <div className="h-3 w-20 bg-white/5 rounded" />
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0F172A]/90 p-5 backdrop-blur-xl shadow-xl transition-all duration-200 ${styles.hoverBorder} ${
        onClick ? "cursor-pointer hover:-translate-y-0.5 active:translate-y-0" : ""
      } ${className}`}
    >
      {/* 3px Top Accent Bar matching Landing Page styling */}
      <div
        className={`absolute inset-x-0 top-0 h-[3px] ${styles.topBar} transition-all duration-300 group-hover:h-[4px]`}
      />

      {/* Subtle Ambient Radial Glow matching Landing Page Hero */}
      <div
        className={`absolute -top-12 -right-12 w-28 h-28 ${styles.glow} rounded-full blur-2xl pointer-events-none transition-opacity duration-300 group-hover:opacity-100 opacity-60`}
      />

      <div className="relative z-10 flex items-start justify-between gap-3">
        <div className="space-y-1.5 min-w-0 flex-1">
          {/* Eyebrow Label */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#F97316] truncate">
              {displayTitle}
            </span>
            {badge ? (
              <span className="rounded-full border border-orange-500/30 bg-orange-500/10 px-2 py-0.5 text-[9px] font-bold text-[#F97316] uppercase tracking-wide">
                {badge}
              </span>
            ) : null}
          </div>

          {/* Metric Value */}
          <div
            className={`text-2xl sm:text-3xl font-extrabold tracking-tight font-mono ${styles.valueColor} truncate`}
          >
            {value}
          </div>

          {/* Subtitle / Trend */}
          <div className="flex items-center gap-2 pt-0.5 text-xs text-slate-400">
            {trend ? (
              <span
                className={`inline-flex items-center gap-0.5 font-bold ${
                  trend.positive ? "text-emerald-400" : "text-rose-400"
                }`}
              >
                <span>{trend.positive ? "↑" : "↓"}</span>
                <span>{trend.value}</span>
                {trend.label ? (
                  <span className="font-normal text-slate-400 ml-1">{trend.label}</span>
                ) : null}
              </span>
            ) : subtitle ? (
              <span className="truncate">{subtitle}</span>
            ) : null}
          </div>
        </div>

        {/* Halo-styled Icon Container matching Landing Page Circular Badges */}
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${styles.iconHalo} shadow-sm transition-transform duration-200 group-hover:scale-105`}
        >
          <Icon className={`h-5 w-5 ${styles.iconColor}`} />
        </div>
      </div>
    </div>
  );
}

export default StatCard;
