"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, ArrowLeft } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  backHref?: string;
  badge?: React.ReactNode;
  statusBadge?:
    | {
        label: string;
        variant?: "emerald" | "amber" | "rose" | "blue" | "default" | string;
      }
    | React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  breadcrumbs,
  backHref,
  badge,
  statusBadge,
  actions,
  className = "",
}: PageHeaderProps) {
  const renderStatusBadge = () => {
    if (!statusBadge) return null;
    if (React.isValidElement(statusBadge)) return statusBadge;

    const sb = statusBadge as { label: string; variant?: string };
    const v = sb.variant || "default";

    let colorClasses = "bg-white/10 text-slate-300 border-white/10";
    if (v === "emerald") {
      colorClasses = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    } else if (v === "amber") {
      colorClasses = "bg-amber-500/10 text-amber-400 border-amber-500/20";
    } else if (v === "rose") {
      colorClasses = "bg-rose-500/10 text-rose-400 border-rose-500/20";
    } else if (v === "blue") {
      colorClasses = "bg-blue-500/10 text-blue-400 border-blue-500/20";
    }

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold tracking-wide ${colorClasses}`}
      >
        <span className="h-2 w-2 rounded-full bg-current" />
        {sb.label}
      </span>
    );
  };

  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/10 pb-5 ${className}`}
    >
      <div>
        {breadcrumbs && breadcrumbs.length > 0 ? (
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-400 mb-1.5 flex-wrap">
            <Link href="/admin" className="hover:text-white transition-colors">
              Admin
            </Link>
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                <ChevronRight className="h-3 w-3 text-slate-500 shrink-0" />
                {crumb.href ? (
                  <Link href={crumb.href} className="hover:text-white transition-colors">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-slate-300 font-semibold">{crumb.label}</span>
                )}
              </React.Fragment>
            ))}
          </nav>
        ) : null}

        {eyebrow ? (
          <span className="text-[#F97316] font-bold text-xs uppercase tracking-wider block mb-1">
            {eyebrow}
          </span>
        ) : null}

        <div className="flex items-center gap-3 flex-wrap">
          {backHref ? (
            <Link
              href={backHref}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/20 bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Back"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
          ) : null}

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{title}</h1>

          {badge ? (
            <span className="rounded-full bg-[#F97316]/10 border border-[#F97316]/30 px-3 py-0.5 text-xs font-bold text-[#F97316]">
              {badge}
            </span>
          ) : null}

          {renderStatusBadge()}
        </div>

        {subtitle ? (
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl leading-relaxed">{subtitle}</p>
        ) : null}
      </div>

      {actions ? <div className="flex items-center gap-2.5 flex-wrap shrink-0">{actions}</div> : null}
    </div>
  );
}

export default PageHeader;
