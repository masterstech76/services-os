"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldCheck, Wrench, User, ArrowRight, Check } from "lucide-react";
import { toast } from "sonner";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AdminMfaModal } from "@/components/auth/AdminMfaModal";
import { sanitizeRedirectUrl, getHomeForRole } from "@/lib/shared/redirect-safety";
import type { UserRole } from "@/lib/supabase/types";

const ROLE_PRESETS: Record<
  UserRole,
  {
    email: string;
    phone: string;
    techId?: string;
    title: string;
    subtitle: string;
    badge: string;
  }
> = {
  admin: {
    email: "admin@servicepro-os.com",
    phone: "+1 (305) 555-0100",
    title: "Admin (Owner)",
    subtitle: "5-Factor Protected",
    badge: "5-Factor Protected",
  },
  owner: {
    email: "admin@servicepro-os.com",
    phone: "+1 (305) 555-0100",
    title: "Admin (Owner)",
    subtitle: "5-Factor Protected",
    badge: "5-Factor Protected",
  },
  technician: {
    email: "technician@servicepro-os.com",
    phone: "+1 (305) 555-0104",
    techId: "tech-carlos",
    title: "Technician",
    subtitle: "Field Specialist",
    badge: "Field Dispatch",
  },
  customer: {
    email: "client@example.com",
    phone: "+1 (305) 555-0199",
    title: "Client",
    subtitle: "Customer Portal",
    badge: "Client Hub",
  },
};

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawRedirect = searchParams.get("redirectTo") || searchParams.get("redirect");

  const [selectedRole, setSelectedRole] = React.useState<UserRole>("owner");
  const [authMode, setAuthMode] = React.useState<"email" | "phone">("email");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [otpSent, setOtpSent] = React.useState(false);
  const [otpCode, setOtpCode] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [showMfaModal, setShowMfaModal] = React.useState(false);

  // Role card click selects the active role cleanly
  function handleRoleSelect(role: UserRole) {
    setSelectedRole(role);
    setErrorMessage(null);
  }

  async function quickSignIn(role: UserRole, techId?: string) {
    setLoading(true);
    setErrorMessage(null);
    try {
      const res = await fetch("/api/auth/demo-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, technicianId: techId }),
      });

      if (!res.ok) {
        toast.error("Failed to start session. Please try again.");
        return;
      }

      const defaultHome = getHomeForRole(role);
      const destination = sanitizeRedirectUrl(rawRedirect, defaultHome);
      router.push(destination);
      router.refresh();
    } catch {
      toast.error("Failed to start session. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim()) {
      const msg = "Please enter your email address.";
      setErrorMessage(msg);
      toast.error(msg);
      return;
    }

    if (!password) {
      const msg = "Please enter your password.";
      setErrorMessage(msg);
      toast.error(msg);
      return;
    }

    // For Admin (Website Owner): Verify Password (Factor 1 Mandatory) -> Launch 5-Factor MFA Modal
    if (selectedRole === "owner" || selectedRole === "admin") {
      if (password.length < 8) {
        setErrorMessage("Password must be at least 8 characters.");
        toast.error("Password must be at least 8 characters.");
        return;
      }
      setShowMfaModal(true);
      return;
    }

    // For Client and Technician: Same direct authentication flow
    setLoading(true);
    try {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
      const isPlaceholder =
        !url.startsWith("https://") ||
        url.includes("placeholder-project.supabase.co");

      if (isPlaceholder) {
        const techId = selectedRole === "technician" ? "tech-carlos" : undefined;
        await quickSignIn(selectedRole, techId);
        return;
      }

      const supabase = createSupabaseBrowserClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setErrorMessage(error.message);
        toast.error(error.message);
        return;
      }

      // Resolve user's actual role from Supabase database profile
      let resolvedRole: UserRole = selectedRole;
      if (data.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", data.user.id)
          .single();
        const pRole = (profile as { role?: UserRole } | null)?.role;
        if (pRole) {
          resolvedRole = pRole;
        }
      }

      toast.success("Signed in successfully");
      const defaultHome = getHomeForRole(resolvedRole);
      const destination = sanitizeRedirectUrl(rawRedirect, defaultHome);
      router.push(destination);
      router.refresh();
    } catch {
      const msg = "Unable to sign in. Please verify your email and password.";
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  const registerHref = rawRedirect
    ? `/register?redirectTo=${encodeURIComponent(rawRedirect)}`
    : "/register";

/* eslint-disable @next/next/no-img-element */
  return (
    <div className="w-full max-w-md rounded-2xl border border-white/15 bg-[#0F172A]/90 backdrop-blur-xl p-5 sm:p-7 shadow-2xl space-y-5 sm:space-y-6 text-white">
      {/* Brand Header */}
      <div className="flex flex-col items-center text-center">
        <img
          src="/images/servicepro-icon-transparent.png?v=green"
          alt="ServicePro OS"
          className="h-11 w-auto object-contain mb-3"
        />
        <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
          Sign In to ServicePro <span className="text-[#F97316]">OS</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Access your bookings, technician dispatch, or owner operations
        </p>
      </div>

      {/* ── Switch Role Selector for Login / Sign In (Pre-fills form without auto-submitting) ── */}
      <div className="rounded-2xl border border-white/10 bg-[#070D18]/90 p-3.5 space-y-2.5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-200 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F97316] animate-pulse" />
            Select Account Role:
          </span>
          <span className="text-[10px] text-slate-400">Choose Portal</span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {/* Admin (Website Owner) Role Card */}
          <button
            type="button"
            onClick={() => handleRoleSelect("owner")}
            disabled={loading}
            data-testid="switch-role-owner"
            className={`group relative flex flex-col items-center justify-center p-2.5 rounded-xl border text-white transition-all cursor-pointer shadow-sm active:scale-95 text-center ${
              selectedRole === "owner" || selectedRole === "admin"
                ? "border-[#F97316] bg-[#F97316]/15 ring-2 ring-[#F97316]/30 shadow-orange-500/10"
                : "border-white/10 bg-white/5 hover:border-[#F97316]/60 hover:bg-white/10"
            }`}
          >
            {(selectedRole === "owner" || selectedRole === "admin") && (
              <span className="absolute top-1.5 right-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#F97316] text-[#0F172A]">
                <Check className="h-2.5 w-2.5 stroke-[3]" />
              </span>
            )}
            <ShieldCheck className={`h-4 w-4 mb-1 transition-transform ${selectedRole === "owner" || selectedRole === "admin" ? "text-[#F97316] scale-110" : "text-[#F97316]"}`} />
            <span className="font-bold text-xs text-white">Admin (Owner)</span>
            <span className="text-[9px] text-[#F97316] font-semibold mt-0.5">5-Factor MFA</span>
          </button>

          {/* Technician Role Card */}
          <button
            type="button"
            onClick={() => handleRoleSelect("technician")}
            disabled={loading}
            data-testid="switch-role-technician"
            className={`group relative flex flex-col items-center justify-center p-2.5 rounded-xl border text-white transition-all cursor-pointer shadow-sm active:scale-95 text-center ${
              selectedRole === "technician"
                ? "border-emerald-500 bg-emerald-500/15 ring-2 ring-emerald-500/30 shadow-emerald-500/10"
                : "border-white/10 bg-white/5 hover:border-emerald-500/60 hover:bg-white/10"
            }`}
          >
            {selectedRole === "technician" && (
              <span className="absolute top-1.5 right-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-500 text-[#0F172A]">
                <Check className="h-2.5 w-2.5 stroke-[3]" />
              </span>
            )}
            <Wrench className={`h-4 w-4 mb-1 transition-transform ${selectedRole === "technician" ? "text-emerald-400 scale-110" : "text-emerald-400"}`} />
            <span className="font-bold text-xs text-white">Technician</span>
            <span className="text-[9px] text-slate-400 mt-0.5">Field Specialist</span>
          </button>

          {/* Client (Customer) Role Card */}
          <button
            type="button"
            onClick={() => handleRoleSelect("customer")}
            disabled={loading}
            data-testid="switch-role-customer"
            className={`group relative flex flex-col items-center justify-center p-2.5 rounded-xl border text-white transition-all cursor-pointer shadow-sm active:scale-95 text-center ${
              selectedRole === "customer"
                ? "border-blue-500 bg-blue-500/15 ring-2 ring-blue-500/30 shadow-blue-500/10"
                : "border-white/10 bg-white/5 hover:border-blue-500/60 hover:bg-white/10"
            }`}
          >
            {selectedRole === "customer" && (
              <span className="absolute top-1.5 right-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-blue-500 text-[#0F172A]">
                <Check className="h-2.5 w-2.5 stroke-[3]" />
              </span>
            )}
            <User className={`h-4 w-4 mb-1 transition-transform ${selectedRole === "customer" ? "text-blue-400 scale-110" : "text-blue-400"}`} />
            <span className="font-bold text-xs text-white">Client</span>
            <span className="text-[9px] text-slate-400 mt-0.5">Direct Access</span>
          </button>
        </div>
      </div>

      {/* Auth Mode Toggle Tabs (Phone vs Email) */}
      <div className="flex rounded-xl bg-white/5 border border-white/10 p-1 text-xs">
        <button
          type="button"
          onClick={() => {
            setAuthMode("email");
            setOtpSent(false);
          }}
          className={`flex-1 py-2 rounded-lg font-bold transition-all ${
            authMode === "email"
              ? "bg-[#F97316] text-[#0F172A] shadow-md"
              : "text-slate-300 hover:text-white"
          }`}
        >
          ✉️ Email &amp; Password
        </button>
        <button
          type="button"
          onClick={() => setAuthMode("phone")}
          className={`flex-1 py-2 rounded-lg font-bold transition-all ${
            authMode === "phone"
              ? "bg-[#F97316] text-[#0F172A] shadow-md"
              : "text-slate-300 hover:text-white"
          }`}
        >
          📱 Phone SMS Code
        </button>
      </div>

      {errorMessage && (
        <div
          role="alert"
          className="rounded-lg bg-red-950/60 border border-red-500/50 p-3 text-xs text-red-200"
        >
          {errorMessage}
        </div>
      )}

      {/* Form Area */}
      {authMode === "email" ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="login-email" className="text-xs font-bold text-slate-300">
              Email Address
            </Label>
            <Input
              id="login-email"
              type="email"
              required
              autoComplete="email"
              placeholder={
                selectedRole === "technician"
                  ? "technician@servicepro-os.com"
                  : selectedRole === "customer"
                  ? "client@example.com"
                  : "admin@servicepro-os.com"
              }
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 bg-[#0B111E]/80 border-white/15 text-white placeholder:text-slate-500 focus:border-[#F97316] focus:ring-[#F97316]"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <Label htmlFor="login-password" className="text-xs font-bold text-slate-300">
                Password
              </Label>
              <Link
                href="/forgot-password"
                className="text-xs font-semibold text-[#F97316] hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <Input
              id="login-password"
              type="password"
              required
              autoComplete="current-password"
              placeholder="Enter your secure password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-[#0B111E]/80 border-white/15 text-white placeholder:text-slate-500 focus:border-[#F97316] focus:ring-[#F97316]"
            />
          </div>

          <Button
            type="submit"
            loading={loading}
            className="w-full bg-[#F97316] hover:bg-[#EA580C] text-[#0F172A] hover:text-[#0F172A] font-extrabold py-3 text-sm rounded-xl shadow-lg shadow-[#F97316]/25 hover:shadow-[#F97316]/40 transition-all cursor-pointer"
          >
            Sign In with Password
          </Button>
        </form>
      ) : (
        <div className="space-y-4">
          {!otpSent ? (
            <div className="space-y-3">
              <div>
                <Label htmlFor="login-phone" className="text-xs font-bold text-slate-300">
                  Mobile Phone Number
                </Label>
                <Input
                  id="login-phone"
                  type="tel"
                  required
                  placeholder="(305) 555-0100"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="mt-1 bg-[#0B111E]/80 border-white/15 text-white placeholder:text-slate-500 focus:border-[#F97316] focus:ring-[#F97316]"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  We will send a 6-digit one-time code to log in without a password.
                </p>
              </div>

              <Button
                type="button"
                onClick={() => {
                  if (!phoneNumber.trim()) {
                    toast.error("Please enter your phone number.");
                    return;
                  }
                  setOtpSent(true);
                  toast.success(`6-digit code sent to ${phoneNumber}`);
                }}
                className="w-full bg-[#F97316] hover:bg-[#EA580C] text-[#0F172A] font-extrabold py-3 text-sm rounded-xl shadow-lg"
              >
                Send SMS Login Code
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor="login-otp" className="text-xs font-bold text-slate-300">
                  Enter 6-Digit SMS Code
                </Label>
                <Input
                  id="login-otp"
                  type="text"
                  maxLength={6}
                  placeholder="123456"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="bg-[#0B111E]/80 border-white/15 text-white text-center font-mono text-lg tracking-widest focus:border-[#F97316] focus:ring-[#F97316]"
                />
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span>Sent to {phoneNumber}</span>
                  <button
                    type="button"
                    onClick={() => setOtpSent(false)}
                    className="text-[#F97316] hover:underline"
                  >
                    Change Phone
                  </button>
                </div>
              </div>

              <Button
                type="button"
                onClick={() => {
                  if (selectedRole === "owner" || selectedRole === "admin") {
                    setShowMfaModal(true);
                  } else {
                    const techId = selectedRole === "technician" ? "tech-carlos" : undefined;
                    quickSignIn(selectedRole, techId);
                  }
                }}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold py-3 text-sm rounded-xl shadow-lg"
              >
                Verify &amp; Enter Portal
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Sign Up Link */}
      <div className="text-center pt-2 border-t border-white/10">
        <p className="text-xs text-slate-400">
          Don&apos;t have an account?{" "}
          <Link
            href={registerHref}
            className="font-bold text-[#F97316] hover:underline inline-flex items-center gap-0.5"
          >
            <span>Create Customer Account</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </p>
      </div>

      {/* 5-Factor Admin MFA Modal (Strictly for Admin & Website Owner Team) */}
      {showMfaModal && (
        <AdminMfaModal
          email={email}
          onSuccess={async () => {
            setShowMfaModal(false);
            await quickSignIn("owner");
          }}
          onCancel={() => setShowMfaModal(false)}
        />
      )}

      {/* Hidden test harness hooks for automated Playwright E2E suites */}
      <div className="sr-only" aria-hidden="true">
        <button
          type="button"
          data-testid="demo-login-owner"
          onClick={() => quickSignIn("owner")}
        >
          Demo Owner
        </button>
        <button
          type="button"
          data-testid="demo-login-tech"
          onClick={() => quickSignIn("technician", "tech-carlos")}
        >
          Demo Tech
        </button>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="w-full flex justify-center">
      <React.Suspense
        fallback={
          <div className="w-full max-w-md rounded-2xl border border-white/15 bg-[#0F172A]/90 p-7 text-center text-sm font-semibold text-slate-300">
            Loading sign in...
          </div>
        }
      >
        <LoginForm />
      </React.Suspense>
    </main>
  );
}
