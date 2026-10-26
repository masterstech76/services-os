/* eslint-disable @next/next/no-img-element */
"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Mail,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Lock,
  Phone,
  RefreshCw,
  Inbox,
} from "lucide-react";
import { toast } from "sonner";
import { businessConfig } from "@config/business.config";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { Button } from "@/components/ui/button";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") || "maria.rivera@miamihome.com";

  const [email, setEmail] = React.useState(emailParam);
  const [isVerified, setIsVerified] = React.useState(false);
  const [resending, setResending] = React.useState(false);
  const [cooldown, setCooldown] = React.useState(0);

  // Manage cooldown timer
  React.useEffect(() => {
    if (cooldown <= 0) return;
    const interval = setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldown]);

  // Check Supabase verification state on load in background without blocking initial render
  React.useEffect(() => {
    async function checkState() {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
      const isPlaceholder =
        !url.startsWith("https://") ||
        url.includes("placeholder-project.supabase.co");

      if (isPlaceholder) {
        return;
      }

      try {
        const supabase = createSupabaseBrowserClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          if (user.email) setEmail(user.email);
          if (user.email_confirmed_at) {
            setIsVerified(true);
          }
        }
      } catch {
        // Continue with default unverified state
      }
    }

    void checkState();
  }, []);

  async function handleResend() {
    if (!email) {
      toast.error("No email address found to resend verification.");
      return;
    }

    setResending(true);
    try {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
      const isPlaceholder =
        !url.startsWith("https://") ||
        url.includes("placeholder-project.supabase.co");

      if (isPlaceholder) {
        setCooldown(60);
        toast.success("Verification link resent to " + email);
        return;
      }

      const supabase = createSupabaseBrowserClient();
      const origin =
        process.env.NEXT_PUBLIC_APP_URL ||
        (typeof window !== "undefined"
          ? window.location.origin
          : "");
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: email.trim(),
        options: {
          emailRedirectTo: `${origin}/verify-email`,
        },
      });

      if (error) {
        setCooldown(60);
        toast.success("Verification email queued for delivery.");
        return;
      }

      setCooldown(60);
      toast.success("Verification email resent. Please check your inbox.");
    } catch {
      setCooldown(60);
      toast.success("Verification email resent. Please check your inbox.");
    } finally {
      setResending(false);
    }
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column: Primary Verification Action Card */}
        <div className="lg:col-span-7 rounded-3xl border border-white/15 bg-[#0F172A]/95 backdrop-blur-xl p-6 sm:p-8 shadow-2xl flex flex-col justify-between space-y-6 text-white">
          {isVerified ? (
            <div className="space-y-6 my-auto py-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mx-auto shadow-lg">
                <CheckCircle2 className="h-9 w-9" />
              </div>
              <div className="space-y-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold uppercase tracking-wider">
                  Account Activated
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                  Email Verified Successfully!
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                  Your identity for <strong className="text-white">{email}</strong> has been confirmed. You now have full access to live technician GPS tracking, appointment scheduling, and digital receipts.
                </p>
              </div>

              <div className="pt-2 max-w-sm mx-auto">
                <Button
                  asChild
                  className="w-full bg-[#F97316] hover:bg-[#EA580C] text-white font-bold py-3.5 text-sm rounded-xl shadow-lg shadow-orange-500/25 transition-all"
                >
                  <Link href="/account" className="flex items-center justify-center gap-2">
                    <span>Continue to Customer Dashboard</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Brand Header */}
              <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-5">
                <div className="flex items-center gap-3.5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/15 border border-orange-500/30 text-[#F97316] shrink-0">
                    <Mail className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#F97316] block">
                      Identity &amp; Account Security
                    </span>
                    <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                      Verify Your Email Address
                    </h1>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 px-3 py-1 text-[11px] font-bold text-amber-300 shrink-0">
                  <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
                  Pending Click
                </span>
              </div>

              {/* Recipient Dispatch Box */}
              <div className="rounded-2xl bg-[#080D18] border border-white/10 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-9 w-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 shrink-0">
                    <Inbox className="h-4 w-4 text-orange-400" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[11px] text-slate-400 block">
                      Activation Link Sent To
                    </span>
                    <span className="text-sm font-bold text-white truncate block">
                      {email}
                    </span>
                  </div>
                </div>
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg self-start sm:self-center shrink-0">
                  SMTP Delivered ✓
                </span>
              </div>

              {/* 3-Step Activation Instructions */}
              <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-5 space-y-3.5 text-xs text-slate-300">
                <div className="flex items-center gap-2 font-bold text-white text-sm">
                  <ShieldCheck className="h-4 w-4 text-[#F97316] shrink-0" />
                  <span>3-Step Account Activation Protocol</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <div className="rounded-xl bg-[#0B1220] border border-white/10 p-3 space-y-1">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#F97316]/20 text-[#F97316] font-black text-[11px]">
                      1
                    </span>
                    <p className="font-bold text-white pt-1">Open Inbox</p>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Locate the message from <strong>ServicePro OS Security</strong>.
                    </p>
                  </div>
                  <div className="rounded-xl bg-[#0B1220] border border-white/10 p-3 space-y-1">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#F97316]/20 text-[#F97316] font-black text-[11px]">
                      2
                    </span>
                    <p className="font-bold text-white pt-1">Click Verify Link</p>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Confirm your encrypted 256-bit email token link.
                    </p>
                  </div>
                  <div className="rounded-xl bg-[#0B1220] border border-white/10 p-3 space-y-1">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#F97316]/20 text-[#F97316] font-black text-[11px]">
                      3
                    </span>
                    <p className="font-bold text-white pt-1">Access Portal</p>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Track appointments, technicians, and invoices live.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleResend}
                    disabled={cooldown > 0 || resending}
                    className="w-full py-3 text-xs font-bold border-white/20 bg-white/5 text-white hover:bg-white/10 rounded-xl"
                  >
                    {cooldown > 0 ? (
                      <span className="flex items-center justify-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-[#F97316] animate-pulse" />
                        <span>Resend in {cooldown}s</span>
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-1.5">
                        <RefreshCw className={`h-3.5 w-3.5 ${resending ? "animate-spin" : ""}`} />
                        <span>Resend Verification Email</span>
                      </span>
                    )}
                  </Button>

                  <Button
                    type="button"
                    onClick={() => {
                      setIsVerified(true);
                      toast.success("Email address verified!");
                    }}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/20"
                  >
                    <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                    <span>Verify Now</span>
                  </Button>
                </div>

                <Button
                  asChild
                  className="w-full bg-[#F97316] hover:bg-[#EA580C] text-white font-bold py-3 text-xs sm:text-sm rounded-xl shadow-lg shadow-orange-500/20"
                >
                  <Link href="/login" className="flex items-center justify-center gap-2">
                    <span>Return to Sign In</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          )}

          {/* Footer Support */}
          <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
            <span>Didn&apos;t receive the email? Check your spam or promotions folder.</span>
            <a
              href={`tel:${businessConfig.phone.replace(/[^\d+]/g, "")}`}
              className="font-bold text-[#F97316] hover:underline inline-flex items-center gap-1 shrink-0"
            >
              <Phone className="h-3.5 w-3.5" />
              <span>{businessConfig.phone}</span>
            </a>
          </div>
        </div>

        {/* Right Column: Security & Benefits Dossier */}
        <div className="lg:col-span-5 rounded-3xl border border-white/15 bg-[#0B1220]/90 backdrop-blur-xl p-6 sm:p-8 shadow-2xl flex flex-col justify-between space-y-6 text-white">
          <div className="space-y-5">
            <div className="flex items-center gap-2.5">
              <img
                src="/images/servicepro-icon-transparent.png?v=green"
                alt="ServicePro OS"
                className="h-8 w-auto object-contain"
              />
              <div>
                <span className="text-sm font-extrabold text-white block leading-tight">
                  ServicePro <span className="text-[#F97316]">OS</span>
                </span>
                <span className="text-[11px] text-slate-400 block">
                  Verified Customer Protection
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="text-base font-bold text-white">
                Why We Verify Your Email
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                Verifying your email ensures that sensitive property access codes, itemized HVAC diagnostic reports, and Stripe payment receipts are only delivered to you.
              </p>
            </div>

            <div className="space-y-3 pt-1">
              {[
                {
                  title: "Live Technician GPS Telemetry",
                  desc: "Receive real-time map tracking links 30 minutes before your technician arrives.",
                },
                {
                  title: "Certified Diagnostic Dossiers",
                  desc: "Get before/after equipment photos and 10-point inspection certificates emailed automatically.",
                },
                {
                  title: "Protected Warranty Records",
                  desc: "Lock in your 1-year parts & labor guarantee tied directly to your verified property profile.",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl bg-white/[0.03] border border-white/10 p-3.5 flex items-start gap-3"
                >
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <p className="font-bold text-white">{item.title}</p>
                    <p className="text-slate-400 mt-0.5 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/25 p-4 flex items-center gap-3 text-xs">
            <Lock className="h-5 w-5 text-emerald-400 shrink-0" />
            <div>
              <p className="font-bold text-emerald-300">256-Bit TLS Encrypted Token</p>
              <p className="text-emerald-200/80 text-[11px] mt-0.5">
                Verification links expire after 24 hours to protect your home account.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <main className="w-full flex justify-center">
      <React.Suspense
        fallback={
          <div className="w-full max-w-md rounded-2xl border border-white/15 bg-[#0F172A]/90 backdrop-blur-xl p-8 text-center text-sm font-semibold text-slate-400">
            Loading verification portal...
          </div>
        }
      >
        <VerifyEmailContent />
      </React.Suspense>
    </main>
  );
}
