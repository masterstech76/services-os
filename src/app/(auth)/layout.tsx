"use client";

/* eslint-disable @next/next/no-img-element */
import * as React from "react";
import { usePathname } from "next/navigation";
import { AuthShowcase } from "@/components/auth/AuthShowcase";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Dual animation (phone + tablet with switch dots) ONLY for Sign In (/login) and Create Account (/register)
  const isDualShowcasePage = pathname === "/login" || pathname === "/register";

  return (
    <div className="min-h-screen bg-[#0C1523] text-white flex flex-col justify-between items-center relative overflow-x-hidden selection:bg-[#F97316] selection:text-white">
      {/* Ambient subtle glow matching Hero Section */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#F97316]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Authentication Viewport Area */}
      <main className="w-full max-w-7xl mx-auto flex-1 flex items-center justify-center relative z-10 px-4 sm:px-6 lg:px-8 py-6">
        {isDualShowcasePage ? (
          /* ─────────────────────────────────────────────────────────────
             INSTAGRAM-STYLE DESKTOP SPLIT: Dual Device Showcase + Form
             On mobile & tablets: showcase hides, form becomes full page
          ───────────────────────────────────────────────────────────── */
          <div className="w-full flex items-center justify-center gap-8 lg:gap-14 xl:gap-20">
            {/* Left Column: Dual Phone + Tablet Mockup Animation (Desktop Only) */}
            <aside
              aria-label="App features live preview"
              className="hidden lg:flex items-center justify-center shrink-0"
            >
              <AuthShowcase />
            </aside>

            {/* Right Column: Sign In / Create Account Card */}
            <section
              aria-label="User authentication details"
              className="w-full max-w-md shrink-0 flex justify-center min-h-screen sm:min-h-0"
            >
              {children}
            </section>
          </div>
        ) : (
          /* ─────────────────────────────────────────────────────────────
             MINI-WINDOW CONTAINER for Forgot Password, Reset Password, OTP
             On desktop: Focused macOS-style mini window screen
             On mobile & tablet: Full-page edge-to-edge
          ───────────────────────────────────────────────────────────── */
          <section
            aria-label="Password recovery and verification"
            className="w-full flex justify-center items-center min-h-screen sm:min-h-0"
          >
            <div className={pathname === "/forgot-password" ? "w-full max-w-md" : "w-full max-w-5xl"}>
              {children}
            </div>
          </section>
        )}
      </main>

      {/* Context-Specific Tiny Footer for Auth & Security Boundary Screens */}
      {pathname === "/unauthorized" ? (
        <footer id="site-footer" className="w-full py-4 text-center text-xs text-slate-400 relative z-10 border-t border-white/10 bg-[#080E1A]">
          <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <a href="/login" className="text-orange-400 font-semibold hover:text-orange-300 transition-colors">
              ← Back to Login
            </a>
            <div className="inline-flex items-center gap-4">
              <a href="/privacy" className="hover:text-white transition-colors">Privacy</a>
              <span className="text-slate-700">·</span>
              <a href="/terms" className="hover:text-white transition-colors">Terms</a>
            </div>
          </div>
        </footer>
      ) : (
        <footer id="site-footer" className="w-full py-4 text-center text-xs text-slate-500 relative z-10">
          <div className="inline-flex items-center gap-4">
            <a href="/privacy" className="hover:text-slate-300 transition-colors">Privacy</a>
            <span className="text-slate-700">·</span>
            <a href="/terms" className="hover:text-slate-300 transition-colors">Terms</a>
            <span className="text-slate-700">·</span>
            <a href="/security" className="hover:text-slate-300 transition-colors">Security</a>
          </div>
        </footer>
      )}
    </div>
  );
}
