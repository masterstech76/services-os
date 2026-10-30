"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AUTH_LOCK_PAUSED } from "@/config/auth-lock.config";
import { ShieldAlert, Compass, X } from "lucide-react";

export function AuthLockBanner() {
  const pathname = usePathname();
  const [dismissed, setDismissed] = React.useState(false);

  // If auth lock is active or banner was dismissed or on landing page, do not render
  if (!AUTH_LOCK_PAUSED || dismissed || pathname === "/") {
    return null;
  }

  return (
    <aside
      aria-label="Preview Mode Notice"
      className="fixed bottom-4 right-4 z-30 max-w-md bg-[#0F1E36]/95 backdrop-blur-md border border-amber-500/50 shadow-2xl rounded-2xl p-4 text-white animate-in fade-in slide-in-from-bottom-5 duration-300"
    >
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-400">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              Auth Lock Paused
            </span>
            <button
              onClick={() => setDismissed(true)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors"
              aria-label="Dismiss banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
            All 87 pages are unlocked for review with mock role credentials. When you are ready, say <span className="font-semibold text-white">&quot;apply again&quot;</span> to re-enable security.
          </p>
          <div className="mt-3 flex items-center gap-2">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-semibold rounded-lg shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Compass className="w-3.5 h-3.5" />
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}
