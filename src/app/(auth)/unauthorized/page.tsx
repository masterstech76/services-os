"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldAlert, ArrowLeft, LogOut, Home, UserCheck, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { businessConfig } from "@config/business.config";
import { Button } from "@/components/ui/button";
import { getHomeForRole } from "@/lib/shared/redirect-safety";
import type { UserRole } from "@/lib/supabase/types";

function UnauthorizedContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requiredRole = searchParams.get("required") || "elevated";
  const currentRole = searchParams.get("current") || "unspecified";

  const [loadingClear, setLoadingClear] = React.useState(false);

  async function handleSwitchAccount() {
    setLoadingClear(true);
    try {
      await fetch("/api/auth/demo-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: "clear" }),
      });

      router.push("/login");
      router.refresh();
    } catch {
      toast.error("Failed to sign out. Please navigate to login directly.");
      router.push("/login");
    } finally {
      setLoadingClear(false);
    }
  }

  const roleHome = getHomeForRole(currentRole as UserRole);

  const roleTitleMap: Record<string, { title: string; desc: string }> = {
    admin: {
      title: "Administrator Privileges Required",
      desc: "This area is reserved for ServicePro OS system administrators and dispatch operations. Your account does not have owner-level clearance.",
    },
    tech: {
      title: "Technician Field Access Required",
      desc: "This section is restricted to authorized field service technicians with active daily routes.",
    },
    customer: {
      title: "Customer Account Required",
      desc: "This section is reserved for customer account holders.",
    },
  };

  const currentInfo = roleTitleMap[requiredRole] || {
    title: "Access Restricted (403 Forbidden)",
    desc: "You are currently signed in, but your account permissions do not permit access to this specific resource.",
  };

  return (
    <div className="w-full max-w-lg rounded-2xl border border-white/15 bg-[#0F172A]/90 backdrop-blur-xl p-6 sm:p-9 shadow-2xl space-y-6 text-white">
      {/* Icon */}
      <div className="flex flex-col items-center text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/20 text-red-400 mb-4 shadow-sm">
          <ShieldAlert className="h-8 w-8" />
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300 text-xs font-bold mb-2">
          <span>Error 403 • Authorization Denied</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-white">
          {currentInfo.title}
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-sm">
          {currentInfo.desc}
        </p>
      </div>

      {/* Role State Banner */}
      <div className="rounded-xl bg-white/5 border border-white/10 p-4 text-xs space-y-2">
        <div className="flex justify-between items-center text-slate-400">
          <span>Your Active Role:</span>
          <span className="font-bold text-white uppercase tracking-wide">
            {currentRole}
          </span>
        </div>
        <div className="flex justify-between items-center text-slate-400">
          <span>Required Privilege:</span>
          <span className="font-bold text-[#F97316] uppercase tracking-wide">
            {requiredRole}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3 pt-2">
        <Button
          asChild
          className="w-full bg-[#F97316] hover:bg-[#EA580C] text-white font-bold py-3 text-sm rounded-xl shadow-lg transition-all"
        >
          <Link href={roleHome} className="flex items-center justify-center gap-2">
            <UserCheck className="h-4 w-4" />
            <span>Go to Your Authorized Dashboard ({roleHome})</span>
          </Link>
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={handleSwitchAccount}
          disabled={loadingClear}
          className="w-full text-xs font-bold border-white/20 bg-white/5 text-white hover:bg-white/10 flex items-center justify-center gap-2"
        >
          <LogOut className="h-4 w-4 text-slate-400" />
          <span>Switch Account / Sign In with Another Role</span>
        </Button>

        <Button
          asChild
          variant="ghost"
          className="w-full text-xs font-bold text-slate-400 hover:text-white flex items-center justify-center gap-1.5"
        >
          <Link href="/">
            <Home className="h-4 w-4" />
            <span>Return to Homepage</span>
          </Link>
        </Button>
      </div>

      {/* Support Strip */}
      <div className="text-center pt-3 border-t border-white/10 text-xs text-slate-400">
        Need assistance with your permissions? Contact{" "}
        <a
          href={`tel:${businessConfig.phone.replace(/[^\d+]/g, "")}`}
          className="font-bold text-[#F97316] hover:underline"
        >
          Support Desk
        </a>
      </div>
    </div>
  );
}

export default function UnauthorizedPage() {
  return (
    <main className="w-full flex justify-center">
      <React.Suspense
        fallback={
          <div className="w-full max-w-lg rounded-2xl border border-white/15 bg-[#0F172A]/90 backdrop-blur-xl p-8 text-center text-sm font-semibold text-slate-400">
            Checking access permissions...
          </div>
        }
      >
        <UnauthorizedContent />
      </React.Suspense>
    </main>
  );
}
