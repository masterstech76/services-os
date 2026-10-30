"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Snowflake, ShieldCheck, CheckCircle2, AlertCircle, Eye, EyeOff, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { businessConfig } from "@config/business.config";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { sanitizeRedirectUrl, validatePasswordStrength } from "@/lib/shared/redirect-safety";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawRedirect = searchParams.get("redirectTo") || searchParams.get("redirect");

  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [agreeConsent, setAgreeConsent] = React.useState(false);
  const [selectedRole, setSelectedRole] = React.useState<"customer" | "technician" | "owner">("customer");

  const [loading, setLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [duplicateAccount, setDuplicateAccount] = React.useState(false);

  // Real-time password validation
  const passwordValidation = React.useMemo(() => {
    return validatePasswordStrength(password);
  }, [password]);

  const passwordsMatch = password.length > 0 && password === confirmPassword;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage(null);
    setDuplicateAccount(false);

    // Validation checks
    if (!firstName.trim() || !lastName.trim()) {
      setErrorMessage("Please enter both your first and last name.");
      return;
    }

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    if (!passwordValidation.valid) {
      setErrorMessage("Please ensure your password meets all security criteria.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match. Please verify both fields.");
      return;
    }

    if (!agreeConsent) {
      setErrorMessage("You must agree to the Terms of Service and Privacy Policy to continue.");
      return;
    }

    setLoading(true);

    try {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
      const isPlaceholder =
        !url.startsWith("https://") ||
        url.includes("placeholder-project.supabase.co");

      if (isPlaceholder) {
        // Mock / development registration fallback
        await fetch("/api/auth/demo-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            role: selectedRole,
            technicianId: selectedRole === "technician" ? "tech-carlos" : undefined,
          }),
        });

        toast.success(`Account created successfully as ${selectedRole}.`);
        const targetHome =
          selectedRole === "owner"
            ? "/admin/dispatch"
            : selectedRole === "technician"
            ? "/tech"
            : "/account";
        const safeDestination = sanitizeRedirectUrl(rawRedirect, targetHome);
        router.push(safeDestination);
        router.refresh();
        return;
      }

      const supabase = createSupabaseBrowserClient();
      const origin =
        process.env.NEXT_PUBLIC_APP_URL ||
        (typeof window !== "undefined" ? window.location.origin : "");

      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: `${firstName.trim()} ${lastName.trim()}`,
            first_name: firstName.trim(),
            last_name: lastName.trim(),
            phone: phone.trim(),
            role: "customer",
          },
          emailRedirectTo: `${origin}/verify-email`,
        },
      });

      if (error) {
        const lowMsg = error.message.toLowerCase();
        if (
          lowMsg.includes("already registered") ||
          lowMsg.includes("already exists") ||
          error.status === 422
        ) {
          setDuplicateAccount(true);
          setErrorMessage("An account with this email address already exists.");
        } else {
          setErrorMessage(error.message);
        }
        return;
      }

      // Check if user already existed (Supabase returns empty identities array in some setups)
      if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
        setDuplicateAccount(true);
        setErrorMessage("An account with this email address already exists.");
        return;
      }

      // Check if email confirmation is required
      if (data.user && !data.session) {
        toast.info("Activation link sent. Please verify your email.");
        router.push(`/verify-email?email=${encodeURIComponent(email.trim())}`);
        return;
      }

      // Active session granted
      toast.success("Welcome! Your account is active.");
      const safeDestination = sanitizeRedirectUrl(rawRedirect, "/account");
      router.push(safeDestination);
      router.refresh();
    } catch {
      setErrorMessage("Registration failed due to a network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const loginHref = rawRedirect
    ? `/login?redirectTo=${encodeURIComponent(rawRedirect)}`
    : "/login";

/* eslint-disable @next/next/no-img-element */
  return (
    <div className="w-full max-w-lg rounded-2xl border border-white/15 bg-[#0F172A]/90 backdrop-blur-xl p-6 sm:p-8 shadow-2xl space-y-5 sm:space-y-6 text-white">
      {/* Brand Header */}
      <div className="flex flex-col items-center text-center">
        <img
          src="/images/servicepro-icon-transparent.png?v=green"
          alt="ServicePro OS"
          className="h-11 w-auto object-contain mb-3"
        />
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Create Your ServicePro <span className="text-[#F97316]">OS</span> Account
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-md">
          Join ServicePro OS to manage service appointments, view invoices, and track your technician in real time.
        </p>
      </div>

      {/* Duplicate Account Alert */}
      {duplicateAccount && (
        <div
          role="alert"
          className="rounded-xl bg-amber-50 border border-amber-200 p-4 space-y-3"
        >
          <div className="flex items-start gap-2.5">
            <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900">
              <p className="font-bold">Account already exists</p>
              <p className="mt-0.5">
                We found an existing account for <span className="font-semibold">{email}</span>. You can sign in directly or request a password reset if you forgot your credentials.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 pt-1">
            <Button
              asChild
              size="sm"
              className="bg-navy-900 hover:bg-navy-800 text-white text-xs font-bold"
            >
              <Link href={loginHref}>Sign In with This Email</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="sm"
              className="text-xs font-bold border-amber-300 text-amber-900 hover:bg-amber-100"
            >
              <Link href="/forgot-password">Reset Password</Link>
            </Button>
          </div>
        </div>
      )}

      {/* General Error Alert */}
      {errorMessage && !duplicateAccount && (
        <div
          role="alert"
          className="rounded-xl bg-red-50 border border-red-200 p-3.5 text-xs text-red-800 flex items-start gap-2"
        >
          <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Registration Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Account Role Selector */}
        <div className="space-y-1.5">
          <Label className="text-xs font-bold text-slate-300">
            Select Account Role to Register:
          </Label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setSelectedRole("customer")}
              className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                selectedRole === "customer"
                  ? "bg-[#F97316] text-[#0C1523] border-[#F97316] font-bold shadow-md shadow-orange-500/20"
                  : "bg-white/5 border-white/10 text-slate-300 hover:text-white hover:bg-white/10"
              }`}
            >
              <span className="block text-xs font-bold">Customer</span>
              <span className="block text-[9px] opacity-80">Homeowner</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedRole("technician")}
              className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                selectedRole === "technician"
                  ? "bg-[#F97316] text-[#0C1523] border-[#F97316] font-bold shadow-md shadow-orange-500/20"
                  : "bg-white/5 border-white/10 text-slate-300 hover:text-white hover:bg-white/10"
              }`}
            >
              <span className="block text-xs font-bold">Technician</span>
              <span className="block text-[9px] opacity-80">Trade Pro</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedRole("owner")}
              className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                selectedRole === "owner"
                  ? "bg-[#F97316] text-[#0C1523] border-[#F97316] font-bold shadow-md shadow-orange-500/20"
                  : "bg-white/5 border-white/10 text-slate-300 hover:text-white hover:bg-white/10"
              }`}
            >
              <span className="block text-xs font-bold">Owner</span>
              <span className="block text-[9px] opacity-80">Admin Ops</span>
            </button>
          </div>
        </div>

        {/* Name Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <Label htmlFor="reg-first-name" className="text-xs font-bold text-slate-300">
              First Name *
            </Label>
            <Input
              id="reg-first-name"
              type="text"
              required
              autoComplete="given-name"
              placeholder="John"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="mt-1 bg-[#0B111E]/80 border-white/15 text-white placeholder:text-slate-500 focus:border-[#F97316] focus:ring-[#F97316]"
            />
          </div>
          <div>
            <Label htmlFor="reg-last-name" className="text-xs font-bold text-slate-300">
              Last Name *
            </Label>
            <Input
              id="reg-last-name"
              type="text"
              required
              autoComplete="family-name"
              placeholder="Smith"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="mt-1 bg-[#0B111E]/80 border-white/15 text-white placeholder:text-slate-500 focus:border-[#F97316] focus:ring-[#F97316]"
            />
          </div>
        </div>

        {/* Contact Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <Label htmlFor="reg-email" className="text-xs font-bold text-slate-300">
              Email Address *
            </Label>
            <Input
              id="reg-email"
              type="email"
              required
              autoComplete="email"
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 bg-[#0B111E]/80 border-white/15 text-white placeholder:text-slate-500 focus:border-[#F97316] focus:ring-[#F97316]"
            />
          </div>
          <div>
            <Label htmlFor="reg-phone" className="text-xs font-bold text-slate-300">
              Mobile Phone
            </Label>
            <Input
              id="reg-phone"
              type="tel"
              autoComplete="tel"
              placeholder=""
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1 bg-[#0B111E]/80 border-white/15 text-white placeholder:text-slate-500 focus:border-[#F97316] focus:ring-[#F97316]"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <Label htmlFor="reg-password" className="text-xs font-bold text-slate-300">
              Create Password *
            </Label>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-[11px] font-semibold text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
            >
              {showPassword ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
              <span>{showPassword ? "Hide" : "Show"}</span>
            </button>
          </div>
          <Input
            id="reg-password"
            type={showPassword ? "text" : "password"}
            required
            autoComplete="new-password"
            placeholder="At least 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-[#0B111E]/80 border-white/15 text-white placeholder:text-slate-500 focus:border-[#F97316] focus:ring-[#F97316]"
          />

          {/* Password Strength Indicator */}
          {password.length > 0 && (
            <div className="mt-2 space-y-1.5 bg-white/5 border border-white/10 rounded-lg p-2.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold text-slate-400">Password Strength:</span>
                <span
                  className={`font-bold ${
                    passwordValidation.score <= 2
                      ? "text-red-400"
                      : passwordValidation.score === 3
                      ? "text-amber-400"
                      : "text-emerald-400"
                  }`}
                >
                  {passwordValidation.score <= 2
                    ? "Weak"
                    : passwordValidation.score === 3
                    ? "Good"
                    : "Strong"}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-1 h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                <div
                  className={`h-full ${
                    passwordValidation.score >= 1 ? "bg-orange-500" : "bg-transparent"
                  }`}
                />
                <div
                  className={`h-full ${
                    passwordValidation.score >= 2 ? "bg-orange-500" : "bg-transparent"
                  }`}
                />
                <div
                  className={`h-full ${
                    passwordValidation.score >= 3 ? "bg-amber-500" : "bg-transparent"
                  }`}
                />
                <div
                  className={`h-full ${
                    passwordValidation.score >= 4 ? "bg-emerald-500" : "bg-transparent"
                  }`}
                />
              </div>
              <ul className="text-[10px] text-slate-500 grid grid-cols-2 gap-x-2 gap-y-0.5 pt-1">
                <li className={password.length >= 8 ? "text-emerald-700 font-semibold" : ""}>
                  ✓ 8+ characters
                </li>
                <li className={/[a-z]/.test(password) ? "text-emerald-700 font-semibold" : ""}>
                  ✓ Lowercase letter
                </li>
                <li className={/[A-Z]/.test(password) ? "text-emerald-700 font-semibold" : ""}>
                  ✓ Uppercase letter
                </li>
                <li className={/[0-9]/.test(password) ? "text-emerald-700 font-semibold" : ""}>
                  ✓ Number
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <Label htmlFor="reg-confirm-password" className="text-xs font-bold text-slate-300">
            Confirm Password *
          </Label>
          <Input
            id="reg-confirm-password"
            type={showPassword ? "text" : "password"}
            required
            autoComplete="new-password"
            placeholder="Re-enter your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="mt-1 bg-[#0B111E]/80 border-white/15 text-white placeholder:text-slate-500 focus:border-[#F97316] focus:ring-[#F97316]"
          />
          {confirmPassword.length > 0 && (
            <p
              className={`text-[11px] mt-1 font-semibold flex items-center gap-1 ${
                passwordsMatch ? "text-emerald-400" : "text-amber-400"
              }`}
            >
              {passwordsMatch ? (
                <>
                  <CheckCircle2 className="h-3 w-3" />
                  <span>Passwords match</span>
                </>
              ) : (
                <>
                  <AlertCircle className="h-3 w-3" />
                  <span>Passwords do not match yet</span>
                </>
              )}
            </p>
          )}
        </div>

        {/* Consent Checkbox */}
        <div className="pt-1">
          <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-300 select-none">
            <input
              type="checkbox"
              required
              checked={agreeConsent}
              onChange={(e) => setAgreeConsent(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-white/20 bg-[#0B111E] text-[#F97316] focus:ring-[#F97316]"
            />
            <span>
              I agree to the{" "}
              <Link href="/terms" className="text-[#F97316] underline font-semibold hover:text-[#EA580C]">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-[#F97316] underline font-semibold hover:text-[#EA580C]">
                Privacy Policy
              </Link>
              , and consent to receive appointment updates by SMS and email.
            </span>
          </label>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          loading={loading}
          disabled={!passwordsMatch || !agreeConsent || !passwordValidation.valid}
          className="w-full bg-[#F97316] hover:bg-[#EA580C] text-white font-bold py-3 text-sm rounded-xl shadow-lg shadow-[#F97316]/25 hover:shadow-[#F97316]/40 transition-all disabled:opacity-60 cursor-pointer"
        >
          Create My Account
        </Button>
      </form>

      {/* Sign In Link (No security leak text, No guest/homepage footer buttons) */}
      <div className="text-center pt-2 border-t border-white/10">
        <p className="text-xs text-slate-400">
          Already have an account?{" "}
          <Link
            href={loginHref}
            className="font-bold text-[#F97316] hover:underline inline-flex items-center gap-0.5"
          >
            <span>Sign In</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <main className="w-full flex justify-center">
      <React.Suspense
        fallback={
          <div className="w-full max-w-lg rounded-2xl border border-white/15 bg-[#0F172A]/90 p-7 text-center text-sm font-semibold text-slate-300">
            Loading registration form...
          </div>
        }
      >
        <RegisterForm />
      </React.Suspense>
    </main>
  );
}
