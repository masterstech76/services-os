"use client";

import * as React from "react";
import { usePathname } from "next/navigation";

export function getTaglineForPath(pathname: string | null): string {
  if (!pathname) return "Trusted Service, Every Time.";

  // Tier 1 — Emergency Pages & Alert Channels
  if (
    pathname.startsWith("/services/emergency") ||
    pathname.includes("emergency")
  ) {
    return "Help Is Always On The Way.";
  }

  // Tier 2 — General Public Marketing & Discovery Pages
  const isPublicMarketing =
    pathname === "/" ||
    pathname === "/about" ||
    pathname === "/services" ||
    (pathname.startsWith("/services/") && !pathname.includes("emergency")) ||
    pathname === "/how-it-works" ||
    pathname === "/contact" ||
    pathname === "/areas" ||
    pathname.startsWith("/service-areas") ||
    pathname === "/faq" ||
    pathname === "/careers" ||
    pathname === "/apply" ||
    pathname === "/specials" ||
    pathname === "/redeem-specials" ||
    pathname === "/pricing" ||
    pathname === "/technicians" ||
    pathname === "/gallery" ||
    pathname.startsWith("/reviews");

  if (isPublicMarketing) {
    return "Your Home. Our Priority.";
  }

  // Tier 3 — All Other Operational, Portal, Legal & Checkout Pages
  return "Trusted Service, Every Time.";
}

export interface BrandTaglineProps {
  className?: string;
  theme?: "dark" | "light";
  size?: "sm" | "base";
  customText?: string;
}

/**
 * Standardized Brand Tagline for ServicePro OS
 * Adheres strictly to Section 37 & 39 design rules:
 * - Direct vertical placement under ServicePro OS
 * - Italic styling with regular font weight (font-normal)
 * - 3-tier contextual messaging
 */
export function BrandTagline({
  className = "",
  theme = "dark",
  size = "base",
  customText,
}: BrandTaglineProps) {
  const pathname = usePathname();
  const tagline = customText || getTaglineForPath(pathname);

  const colorClass = theme === "dark" ? "text-slate-300" : "text-slate-500";
  const sizeClass =
    size === "base"
      ? "text-xs sm:text-[13px] md:text-sm"
      : "text-[11px] sm:text-xs";

  return (
    <span
      className={`block italic font-normal tracking-normal leading-tight select-none transition-colors ${colorClass} ${sizeClass} ${className}`}
    >
      {tagline}
    </span>
  );
}
