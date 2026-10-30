"use client";

import * as React from "react";
import {
  Smartphone,
  Tablet,
  Monitor,
  Navigation,
  MapPin,
  Clock,
  ShieldCheck,
  Star,
  CheckCircle2,
  Wrench,
  Wifi,
  Battery,
  Truck,
  Activity,
  CreditCard,
  PhoneCall,
  Check,
  Radio,
  Sliders,
  DollarSign,
  TrendingUp,
  AlertCircle,
  Eye,
  RefreshCw,
  Search,
  Zap,
  PenTool,
  FileCheck,
  Lock,
  Globe,
  ExternalLink,
  ChevronRight,
  User,
  Sparkles,
  ArrowRight,
  Play,
  Pause,
  Video,
} from "lucide-react";
import { cn } from "@/lib/utils";

type DeviceMode = "mobile" | "tablet" | "desktop";

export function AuthShowcase() {
  // Dot 1 = Mobile, Dot 2 = Tablet, Dot 3 = Desktop
  const [activeDevice, setActiveDevice] = React.useState<DeviceMode>("desktop");
  
  // Continuous video timeline (0 to 100 progress)
  const [videoProgress, setVideoProgress] = React.useState(0);
  const [videoScene, setVideoScene] = React.useState(0); // 0, 1, 2
  const [isPaused, setIsPaused] = React.useState(false);

  // Smooth video playback loop: 12 seconds total loop (4s per scene)
  React.useEffect(() => {
    if (isPaused) return;
    const interval = 80; // update every 80ms
    const step = (interval / 12000) * 100; // 12 seconds per full video loop

    const timer = setInterval(() => {
      setVideoProgress((prev) => {
        const next = (prev + step) % 100;
        if (next < 33.33) {
          setVideoScene(0);
        } else if (next < 66.66) {
          setVideoScene(1);
        } else {
          setVideoScene(2);
        }
        return next;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [isPaused]);

  return (
    <div
      className="relative select-none flex flex-col items-center justify-between w-[540px] xl:w-[590px] h-full min-h-[660px]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background ambient glow */}
      <div className="absolute -inset-10 bg-gradient-to-tr from-[#F97316]/20 via-blue-600/15 to-amber-500/15 rounded-[60px] blur-3xl opacity-80 pointer-events-none" />

      {/* ─────────────────────────────────────────────────────────────
          TOP CONTROL BAR:
          Switch Dot Buttons: Dot 1 (Mobile), Dot 2 (Tablet), Dot 3 (Desktop)
          (NO extra sub-buttons! Clean live video auto-playing)
      ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col items-center gap-2 mb-3.5 w-full z-30 shrink-0">
        {/* Device Switcher Dots Capsule */}
        <div className="flex items-center gap-2 p-1.5 rounded-full bg-[#080E1A]/95 border border-white/20 backdrop-blur-xl shadow-2xl">
          {/* DOT 1: Mobile */}
          <button
            type="button"
            id="dot-1-mobile-btn"
            onClick={() => {
              setActiveDevice("mobile");
              setVideoProgress(0);
              setVideoScene(0);
            }}
            className={cn(
              "flex items-center gap-1.5 sm:gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 cursor-pointer shadow-sm",
              activeDevice === "mobile"
                ? "bg-[#F97316] text-[#0C1523] shadow-lg shadow-orange-500/40 font-black scale-[1.02]"
                : "text-slate-300 hover:text-white hover:bg-white/10"
            )}
            aria-label="Dot 1: Show Mobile View"
          >
            <span
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                activeDevice === "mobile" ? "bg-[#0C1523]" : "bg-orange-400"
              )}
            />
            <Smartphone className="h-4 w-4" />
            <span>Dot 1: Mobile</span>
          </button>

          {/* DOT 2: Tablet */}
          <button
            type="button"
            id="dot-2-tablet-btn"
            onClick={() => {
              setActiveDevice("tablet");
              setVideoProgress(0);
              setVideoScene(0);
            }}
            className={cn(
              "flex items-center gap-1.5 sm:gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 cursor-pointer shadow-sm",
              activeDevice === "tablet"
                ? "bg-[#F97316] text-[#0C1523] shadow-lg shadow-orange-500/40 font-black scale-[1.02]"
                : "text-slate-300 hover:text-white hover:bg-white/10"
            )}
            aria-label="Dot 2: Show Tablet View"
          >
            <span
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                activeDevice === "tablet" ? "bg-[#0C1523]" : "bg-orange-400"
              )}
            />
            <Tablet className="h-4 w-4" />
            <span>Dot 2: Tablet</span>
          </button>

          {/* DOT 3: Desktop */}
          <button
            type="button"
            id="dot-3-desktop-btn"
            onClick={() => {
              setActiveDevice("desktop");
              setVideoProgress(0);
              setVideoScene(0);
            }}
            className={cn(
              "flex items-center gap-1.5 sm:gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 cursor-pointer shadow-sm",
              activeDevice === "desktop"
                ? "bg-[#F97316] text-[#0C1523] shadow-lg shadow-orange-500/40 font-black scale-[1.02]"
                : "text-slate-300 hover:text-white hover:bg-white/10"
            )}
            aria-label="Dot 3: Show Desktop View"
          >
            <span
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                activeDevice === "desktop" ? "bg-[#0C1523]" : "bg-orange-400"
              )}
            />
            <Monitor className="h-4 w-4" />
            <span>Dot 3: Desktop</span>
          </button>
        </div>

        {/* Live Video Auto-Playing Indicator */}
        <div className="flex items-center gap-2.5 text-slate-300 text-xs">
          <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 font-mono font-bold text-[10px]">
            <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping" />
            LIVE TELEMETRY &bull; ENTERPRISE PREVIEW
          </span>
          <span className="text-slate-400 text-[11px] hidden sm:inline">
            {activeDevice === "mobile" && "Live Customer GPS Arrival & Tap-to-Pay"}
            {activeDevice === "tablet" && "Field Diagnostic Dossier & Multi-Zone Schematics"}
            {activeDevice === "desktop" && "Fleet Command Radar & Real-Time Stripe Settlements"}
          </span>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          REAL PAGE VIEW LIVE VIDEO VIEWPORT
      ───────────────────────────────────────────────────────────── */}
      <div className="relative w-full flex-1 flex items-center justify-center min-h-[550px]">

        {/* ═══════════════════════════════════════════════════════════
            DOT 3: DESKTOP WORKSTATION - LIVE VIDEO SIMULATION
        ════════════════════════════════════════════════════════════ */}
        <div
          className={cn(
            "transition-all duration-500 ease-out flex flex-col items-center w-full max-w-[550px] xl:max-w-[590px]",
            activeDevice === "desktop"
              ? "opacity-100 scale-100 translate-y-0 pointer-events-auto z-20"
              : "opacity-0 scale-95 translate-y-4 pointer-events-none absolute z-10"
          )}
        >
          {/* Monitor Chassis */}
          <div className="w-full h-[470px] xl:h-[490px] rounded-[22px] bg-[#070B14] p-3 shadow-2xl border-[5px] border-[#1E293B] ring-2 ring-white/15 flex flex-col justify-between">
            {/* Webcam */}
            <div className="w-2.5 h-2.5 rounded-full bg-slate-800 border border-slate-700 mx-auto -mt-1.5 mb-1.5 flex items-center justify-center">
              <span className="w-1 h-1 rounded-full bg-blue-500/70" />
            </div>

            {/* Inner Monitor Display with Video Scrubber */}
            <div className="relative w-full flex-1 rounded-[14px] bg-[#0C1524] overflow-hidden border border-white/10 flex flex-col text-white select-none">
              
              {/* Continuous Video Timeline Progress Bar (Like a video player scrubber) */}
              <div className="w-full bg-black/80 h-1 overflow-hidden relative">
                <div
                  className="bg-gradient-to-r from-[#F97316] to-amber-400 h-full transition-all duration-100 ease-linear"
                  style={{ width: `${videoProgress}%` }}
                />
              </div>

              {/* Browser Header Bar */}
              <div className="bg-[#090F1A] px-3 py-1.5 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500/90 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/90 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/90 inline-block" />
                </div>

                <div className="flex items-center gap-1.5 bg-black/60 rounded-md px-3 py-0.5 border border-white/10 text-[9px] text-slate-300 font-mono">
                  <Lock className="h-2.5 w-2.5 text-emerald-400" />
                  <span>https://servicepro.app</span>
                  <span className="text-[#F97316]">
                    {videoScene === 0 && "/admin/dispatch"}
                    {videoScene === 1 && "/admin/jobs"}
                    {videoScene === 2 && "/admin/reports"}
                  </span>
                </div>

                <span className="text-[8px] font-mono text-emerald-400 font-bold flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Auto-Play
                </span>
              </div>

              {/* Live Video Content Viewport */}
              <div className="flex-1 p-3.5 flex flex-col justify-between overflow-hidden bg-[#0C1524]">
                {/* Real ServicePro OS Top Navbar */}
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <img
                      src="/images/servicepro-icon-transparent.png?v=green"
                      alt="ServicePro OS"
                      className="h-6 w-auto object-contain"
                    />
                    <div>
                      <span className="font-extrabold text-white text-xs">ServicePro <span className="text-[#F97316]">OS</span></span>
                      <span className="text-[9px] text-slate-400 block -mt-0.5">Fleet Operations Command</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-[9px]">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-bold">
                      ● 4 Vans Active
                    </span>
                    <div className="h-6 w-6 rounded-full bg-gradient-to-tr from-[#F97316] to-amber-400 text-[#0C1523] font-black text-[9px] flex items-center justify-center">
                      AD
                    </div>
                  </div>
                </div>

                {/* Auto-Cycling Live Video Scenes */}
                <div className="flex-1 my-2 overflow-hidden flex flex-col justify-between">
                  {videoScene === 0 && (
                    /* Scene 1: Active Fleet Radar Video */
                    <div className="space-y-2.5 animate-in fade-in duration-500">
                      <div className="grid grid-cols-4 gap-2 text-[9px]">
                        <div className="p-1.5 rounded-xl bg-white/5 border border-white/5">
                          <span className="text-slate-400 block text-[8px]">Daily Revenue</span>
                          <span className="font-mono font-bold text-white text-xs">$4,850.00</span>
                        </div>
                        <div className="p-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                          <span className="text-emerald-400 block text-[8px]">Stripe Payout</span>
                          <span className="font-mono font-bold text-emerald-300 text-xs">100% Instant</span>
                        </div>
                        <div className="p-1.5 rounded-xl bg-orange-500/10 border border-orange-500/20">
                          <span className="text-orange-400 block text-[8px]">Avg Response</span>
                          <span className="font-mono font-bold text-orange-300 text-xs">14 mins</span>
                        </div>
                        <div className="p-1.5 rounded-xl bg-blue-500/10 border border-blue-500/20">
                          <span className="text-blue-400 block text-[8px]">First-Fix Rate</span>
                          <span className="font-mono font-bold text-blue-300 text-xs">98.4%</span>
                        </div>
                      </div>

                      {/* Radar Screen with sweeping beam */}
                      <div className="h-36 rounded-xl bg-gradient-to-br from-blue-950/80 via-slate-900 to-[#0A111E] border border-blue-500/30 p-2.5 relative overflow-hidden flex flex-col justify-between">
                        <div className="flex justify-between items-center text-[10px]">
                          <span className="font-bold text-white flex items-center gap-1.5">
                            <Navigation className="h-3.5 w-3.5 text-[#F97316] animate-pulse" />
                            South Florida Active GPS Fleet Grid
                          </span>
                          <span className="text-emerald-400 font-mono text-[9px] font-bold">Radar Ping: 12ms</span>
                        </div>

                        {/* Live moving vans */}
                        <div className="grid grid-cols-3 gap-2 text-[8px]">
                          <div className="p-2 rounded-lg bg-black/60 border border-orange-500/40 relative overflow-hidden">
                            <div className="font-bold text-orange-400">Fleet Alpha (Lead Field Specialist)</div>
                            <div className="text-white text-[9px] mt-0.5 font-semibold">Brickell Ave &bull; 6m ETA</div>
                            <div className="w-full bg-white/10 h-1 rounded-full mt-1.5 overflow-hidden">
                              <div className="bg-[#F97316] h-full w-[80%] animate-pulse" />
                            </div>
                          </div>

                          <div className="p-2 rounded-lg bg-black/60 border border-blue-500/30">
                            <div className="font-bold text-blue-400">Fleet Beta (Diagnostic Specialist)</div>
                            <div className="text-white text-[9px] mt-0.5">Coconut Grove &bull; On Site</div>
                            <div className="text-[7px] text-emerald-400 mt-1 font-mono">Coil Test In Progress</div>
                          </div>

                          <div className="p-2 rounded-lg bg-black/60 border border-emerald-500/30">
                            <div className="font-bold text-emerald-400">Fleet Gamma (Senior Field Tech)</div>
                            <div className="text-white text-[9px] mt-0.5">Coral Gables &bull; Dispatched</div>
                            <div className="text-[7px] text-slate-400 mt-1 font-mono">Standby Roster Unit 03</div>
                          </div>
                        </div>

                        {/* Scanner Bar */}
                        <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-[#F97316] h-full w-[88%] animate-pulse" />
                        </div>
                      </div>
                    </div>
                  )}

                  {videoScene === 1 && (
                    /* Scene 2: Live Dispatch Work Orders Stream */
                    <div className="space-y-2 animate-in fade-in duration-500 text-[9px]">
                      <div className="flex justify-between items-center text-[10px] font-bold text-white">
                        <span>Active Dispatch Work Orders Queue</span>
                        <span className="text-orange-400 font-mono text-[9px]">Real-Time Feed</span>
                      </div>

                      <div className="space-y-1.5">
                        <div className="p-2.5 rounded-xl bg-orange-500/15 border border-orange-500/40 flex justify-between items-center shadow-lg">
                          <div>
                            <span className="font-bold text-white block text-[10px]">#WO-1004 &bull; Verified Customer</span>
                            <span className="text-[8px] text-slate-300">1421 Brickell Ave &bull; Emergency AC Dual Capacitor Replacement</span>
                          </div>
                          <div className="text-right">
                            <span className="px-2 py-0.5 rounded bg-orange-500/25 text-orange-300 font-bold text-[8px] uppercase">
                              In Progress
                            </span>
                            <span className="text-[8px] text-slate-400 block mt-0.5">Lead Field Specialist</span>
                          </div>
                        </div>

                        <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex justify-between items-center">
                          <div>
                            <span className="font-bold text-white block text-[10px]">#WO-1002 &bull; Senior HVAC Specialist</span>
                            <span className="text-[8px] text-slate-300">3200 Grand Ave, Coconut Grove &bull; Comprehensive AC Tune-Up</span>
                          </div>
                          <div className="text-right">
                            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold text-[8px] uppercase">
                              En Route (8m)
                            </span>
                            <span className="text-[8px] text-slate-400 block mt-0.5">Diagnostic Specialist</span>
                          </div>
                        </div>

                        <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex justify-between items-center">
                          <div>
                            <span className="font-bold text-white block text-[10px]">#WO-1005 &bull; Commercial Systems Specialist</span>
                            <span className="text-[8px] text-slate-300">540 Biltmore Way, Coral Gables &bull; R-410A Refrigerant Recharge</span>
                          </div>
                          <div className="text-right">
                            <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold text-[8px] uppercase">
                              Assigned
                            </span>
                            <span className="text-[8px] text-slate-400 block mt-0.5">Senior Field Tech</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {videoScene === 2 && (
                    /* Scene 3: Instant Stripe Accounts Receivable Ledger */
                    <div className="space-y-2.5 animate-in fade-in duration-500">
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                          <CreditCard className="h-3.5 w-3.5" /> Stripe Connected Accounts Receivable
                        </span>
                        <span className="text-slate-400 font-mono text-[9px]">Zero Latency Payout</span>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-950/60 to-slate-900 border border-emerald-500/30 flex justify-between items-center">
                        <div>
                          <span className="text-xs font-bold text-white block">Auto-Settled to Chase Business</span>
                          <span className="text-[9px] text-slate-400">Next Payout: Immediate (Stripe Instant)</span>
                        </div>
                        <span className="font-mono text-2xl font-black text-emerald-400">$4,850.00</span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-[9px] space-y-1.5">
                        <div className="flex justify-between text-slate-300">
                          <span>INV-2024-88 &bull; Verified Customer (Apple Pay Tap-to-Pay)</span>
                          <span className="font-mono text-emerald-400 font-bold">$199.00 Settled</span>
                        </div>
                        <div className="flex justify-between text-slate-300">
                          <span>INV-2024-87 &bull; Senior HVAC Specialist (Visa •••• 4242)</span>
                          <span className="font-mono text-emerald-400 font-bold">$349.00 Settled</span>
                        </div>
                        <div className="flex justify-between text-slate-300">
                          <span>INV-2024-86 &bull; Commercial Systems Specialist (Stripe Terminal)</span>
                          <span className="font-mono text-emerald-400 font-bold">$280.00 Settled</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom Video Progress Timeline Bar */}
                <div className="pt-2 border-t border-white/10 flex justify-between items-center text-[8px] text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-orange-400 font-bold">
                      Scene {videoScene + 1}/3
                    </span>
                    <span>&bull;</span>
                    <span>{videoScene === 0 ? "Radar Map" : videoScene === 1 ? "Job Queue" : "Stripe Ledger"}</span>
                  </div>
                  <span className="text-emerald-400 font-bold">Live Continuous Playback</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stand */}
          <div className="flex flex-col items-center">
            <div className="w-14 h-6 bg-gradient-to-b from-[#1E293B] to-[#0F172A] border-x border-[#334155]" />
            <div className="w-44 h-3 rounded-full bg-gradient-to-r from-slate-700 via-slate-400 to-slate-700 shadow-xl border-t border-white/30" />
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════
            DOT 2: TABLET - LIVE VIDEO SIMULATION
        ════════════════════════════════════════════════════════════ */}
        <div
          className={cn(
            "transition-all duration-500 ease-out flex flex-col items-center w-full max-w-[460px] xl:max-w-[490px]",
            activeDevice === "tablet"
              ? "opacity-100 scale-100 translate-y-0 pointer-events-auto z-20"
              : "opacity-0 scale-95 translate-y-4 pointer-events-none absolute z-10"
          )}
        >
          {/* Tablet Frame */}
          <div className="relative w-full h-[530px] rounded-[36px] bg-[#070B14] p-3.5 shadow-2xl border-[5px] border-[#1E293B] ring-2 ring-white/15 flex flex-col justify-between">
            {/* Tablet Camera & Pencil */}
            <div className="w-full flex items-center justify-between px-6 -mt-1 mb-1.5 text-[8px] text-slate-400">
              <div className="h-1 w-16 bg-white/20 rounded-full" />
              <div className="w-2 h-2 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
                <span className="w-0.5 h-0.5 rounded-full bg-blue-500/70" />
              </div>
              <span className="text-[7px] text-emerald-400 font-mono">Pencil 100%</span>
            </div>

            {/* Inner Tablet Display */}
            <div className="relative w-full flex-1 rounded-[24px] bg-[#0C1524] overflow-hidden border border-white/10 flex flex-col justify-between text-white p-3.5 select-none">
              
              {/* Video Timeline Scrubber */}
              <div className="w-full bg-black/80 h-1 overflow-hidden relative -mx-3.5 -mt-3.5 mb-2.5">
                <div
                  className="bg-gradient-to-r from-[#F97316] to-amber-400 h-full transition-all duration-100 ease-linear"
                  style={{ width: `${videoProgress}%` }}
                />
              </div>

              {/* Tablet Top Status Bar */}
              <div className="border-b border-white/10 pb-2 mb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <img
                      src="/images/servicepro-icon-transparent.png?v=green"
                      alt="ServicePro OS"
                      className="h-5 w-auto object-contain"
                    />
                    <span className="font-bold text-xs text-white">ServicePro Field Tablet</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] text-slate-400 font-mono">Van 104</span>
                    <div className="h-6 w-6 rounded-full bg-gradient-to-tr from-[#F97316] to-amber-400 text-slate-950 font-black text-[9px] flex items-center justify-center">
                      CM
                    </div>
                  </div>
                </div>

                <div className="flex gap-1 mt-1.5 text-[9px] font-bold">
                  <span className={cn("px-2 py-0.5 rounded-full transition-colors", videoScene === 0 ? "bg-[#F97316] text-[#0C1523]" : "bg-white/5 text-slate-400")}>
                    Dashboard
                  </span>
                  <span className={cn("px-2 py-0.5 rounded-full transition-colors", videoScene === 1 ? "bg-[#F97316] text-[#0C1523]" : "bg-white/5 text-slate-400")}>
                    Diagnostics
                  </span>
                  <span className={cn("px-2 py-0.5 rounded-full transition-colors", videoScene === 2 ? "bg-[#F97316] text-[#0C1523]" : "bg-white/5 text-slate-400")}>
                    Sign &amp; Pay
                  </span>
                </div>
              </div>

              {/* Auto-Cycling Tablet Scenes */}
              <div className="flex-1 flex flex-col justify-between overflow-hidden">
                {videoScene === 0 && (
                  /* Real Tech Dashboard View */
                  <div className="space-y-2 animate-in fade-in duration-500">
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex justify-between items-center text-[9px]">
                      <div>
                        <span className="text-white font-bold block text-[10px]">Lead Field Specialist (#TECH-101)</span>
                        <span className="text-emerald-400 font-mono">● Active Shift &bull; Miami Brickell Corridor</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[8px]">
                        3 Stops Remaining
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5 text-[9px]">
                      <div className="p-2 rounded-xl bg-black/40 border border-white/10">
                        <span className="text-slate-400 block text-[8px]">Today&apos;s Shift</span>
                        <span className="font-bold text-white text-[10px]">07:00 AM – 04:30 PM</span>
                      </div>
                      <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                        <span className="text-emerald-400 block text-[8px]">Today&apos;s Earnings</span>
                        <span className="font-bold text-emerald-300 text-[10px]">$245.00 (+$45 tips)</span>
                      </div>
                    </div>

                    {/* Spotlight Work Order */}
                    <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/30 text-[9px] space-y-1.5">
                      <div className="flex justify-between font-bold text-white">
                        <span>#WO-1004 &bull; Verified Customer</span>
                        <span className="text-orange-400 uppercase animate-pulse">In Progress</span>
                      </div>
                      <div className="text-[8px] text-slate-300">1421 Brickell Ave &bull; Emergency AC Diagnostic</div>
                      <div className="pt-1">
                        <div className="px-3 py-1.5 rounded-lg bg-[#F97316] text-[#0C1523] font-bold text-[8px] text-center">
                          Continue Job &amp; Collect Payment &rarr;
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {videoScene === 1 && (
                  /* HVAC Schematics & Delta-T */
                  <div className="space-y-2 animate-in fade-in duration-500">
                    <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-950/60 to-slate-900 border border-blue-500/30 text-[9px] space-y-1.5">
                      <div className="flex justify-between text-white font-bold">
                        <span>HVAC System Topology Schematics</span>
                        <span className="text-emerald-400 font-mono">Trane XR14</span>
                      </div>
                      <div className="grid grid-cols-3 gap-1.5 text-center text-[8px]">
                        <div className="p-1.5 rounded-lg bg-black/40 border border-white/10">
                          <span className="text-slate-400 block">Suction</span>
                          <span className="text-emerald-400 font-bold text-[10px]">118 PSI</span>
                        </div>
                        <div className="p-1.5 rounded-lg bg-black/40 border border-white/10">
                          <span className="text-slate-400 block">Liquid</span>
                          <span className="text-white font-bold text-[10px]">325 PSI</span>
                        </div>
                        <div className="p-1.5 rounded-lg bg-black/40 border border-white/10">
                          <span className="text-slate-400 block">Delta-T</span>
                          <span className="text-orange-400 font-bold text-[10px]">18.4°F Pass</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-[9px] space-y-1">
                      <span className="font-bold text-white block">Digital Checkpoints Passed</span>
                      <div className="flex items-center gap-1.5 text-emerald-400 text-[8px]">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Capacitor Tested (45/5 µF Pass)
                      </div>
                      <div className="flex items-center gap-1.5 text-emerald-400 text-[8px]">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Condenser Coil Sanitized &amp; Pre-Trip Proof Logged
                      </div>
                    </div>
                  </div>
                )}

                {videoScene === 2 && (
                  /* Customer Digital Sign-Off */
                  <div className="space-y-2 animate-in fade-in duration-500">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-950/40 to-slate-900 border border-emerald-500/30 text-[9px] space-y-1.5">
                      <span className="font-bold text-emerald-300 block">Customer Touch Signature</span>
                      <div className="h-12 bg-black/60 rounded-lg border border-white/10 flex items-center justify-center">
                        <span className="font-serif italic text-base text-amber-200">Service Client</span>
                      </div>
                      <span className="text-[7px] text-slate-400 block">GPS Verified: 1421 Brickell Ave &bull; Oct 25, 2026</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-orange-500/15 border border-orange-500/30 flex justify-between items-center text-[9px]">
                      <div>
                        <span className="font-bold text-white block">Collect $199.00 Balance</span>
                        <span className="text-[7px] text-slate-300">Tap to Pay Approved</span>
                      </div>
                      <div className="px-3 py-1 rounded-lg bg-[#F97316] text-[#0C1523] font-bold text-[8px]">
                        Settled &bull; Stripe
                      </div>
                    </div>
                  </div>
                )}

                {/* Tablet Footer */}
                <div className="pt-2 border-t border-white/10 flex justify-between text-[7px] text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-orange-400 font-bold">
                      Scene {videoScene + 1}/3
                    </span>
                    <span>&bull;</span>
                    <span>{videoScene === 0 ? "Dashboard" : videoScene === 1 ? "Diagnostics" : "Sign-Off"}</span>
                  </div>
                  <span className="text-emerald-400 font-bold">Encrypted SSL</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════
            DOT 1: MOBILE SMARTPHONE - LIVE VIDEO SIMULATION
        ════════════════════════════════════════════════════════════ */}
        <div
          className={cn(
            "transition-all duration-500 ease-out flex flex-col items-center",
            activeDevice === "mobile"
              ? "opacity-100 scale-100 translate-y-0 pointer-events-auto z-20"
              : "opacity-0 scale-95 translate-y-4 pointer-events-none absolute z-10"
          )}
        >
          {/* Smartphone Chassis */}
          <div className="relative w-[320px] sm:w-[335px] h-[540px] rounded-[50px] bg-[#070B14] p-3.5 shadow-2xl border-[6px] border-[#1E293B] ring-2 ring-white/15 flex flex-col justify-between">
            {/* Inner Phone Screen */}
            <div className="relative w-full h-full rounded-[38px] bg-[#0A101D] overflow-hidden border border-white/10 flex flex-col justify-between text-white p-3.5 select-none">
              
              {/* Dynamic Island */}
              <div className="w-28 h-5 bg-black rounded-full mx-auto mb-1 flex items-center justify-between px-3 border border-white/10 shadow-inner">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[8px] text-slate-300 font-mono tracking-tight">Active</span>
                </div>
                <div className="w-2 h-2 rounded-full bg-blue-500/40 border border-blue-400/50" />
              </div>

              {/* Video Timeline Scrubber */}
              <div className="w-full bg-black/80 h-1 overflow-hidden relative -mx-3.5 my-1.5">
                <div
                  className="bg-gradient-to-r from-[#F97316] to-amber-400 h-full transition-all duration-100 ease-linear"
                  style={{ width: `${videoProgress}%` }}
                />
              </div>

              {/* Real Mobile App Viewport */}
              <div className="flex-1 flex flex-col justify-between overflow-hidden">
                {videoScene === 0 && (
                  /* Live GPS Tracking Scene */
                  <div className="space-y-3 animate-in fade-in duration-500">
                    <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-950/70 to-slate-900 border border-blue-500/30 relative overflow-hidden">
                      <div className="flex items-center justify-between text-[9px] mb-1">
                        <span className="font-bold text-orange-400 flex items-center gap-1">
                          <Navigation className="h-3 w-3 animate-bounce" /> Live GPS Arrival
                        </span>
                        <span className="text-emerald-400 font-mono font-bold">6 mins away</span>
                      </div>
                      <div className="text-sm font-black text-white">Approaching Brickell Ave</div>
                      <p className="text-[9px] text-slate-300 mt-0.5">Technician Lead Field Specialist &bull; Lead Specialist</p>
                      <div className="mt-2.5 w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-[#F97316] h-full w-[82%] animate-pulse" />
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 space-y-1.5 text-[9px]">
                      <div className="flex justify-between items-center text-slate-300">
                        <span className="font-bold text-white">Service Appointment</span>
                        <span className="text-orange-400 font-bold">WO-1004</span>
                      </div>
                      <div className="flex items-center gap-1 text-slate-300">
                        <MapPin className="h-3 w-3 text-emerald-400 shrink-0" />
                        <span className="truncate">1421 Brickell Ave, Penthouse 4</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <div className="flex-1 p-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-[9px] font-bold text-center text-emerald-300">
                        Gate Code: #4912
                      </div>
                      <div className="p-2 px-3 rounded-xl bg-white/10 text-[9px] font-bold text-center text-white flex items-center justify-center gap-1">
                        <PhoneCall className="h-3 w-3 text-orange-400" /> Call Tech
                      </div>
                    </div>
                  </div>
                )}

                {videoScene === 1 && (
                  /* Digital Sign-off & Diagnosis */
                  <div className="space-y-3 animate-in fade-in duration-500">
                    <div className="p-3 rounded-2xl bg-orange-500/10 border border-orange-500/30 space-y-1.5">
                      <div className="flex justify-between items-center text-[9px]">
                        <span className="font-bold text-orange-300 uppercase tracking-wide">Field Diagnostic</span>
                        <span className="font-mono text-emerald-400 font-bold">$199.00</span>
                      </div>
                      <div className="text-xs font-bold text-white">Trane XR14 Dual Run Capacitor</div>
                      <div className="flex items-center gap-1.5 text-[9px] text-emerald-400">
                        <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                        <span>Replaced &amp; Delta-T Calibrated</span>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-center">
                      <div className="text-[9px] font-bold text-emerald-400 uppercase tracking-wide">
                        ✓ Digital Signature Captured
                      </div>
                      <div className="font-mono text-[10px] text-slate-300 mt-0.5 italic">
                        Signed by Service Client
                      </div>
                    </div>
                  </div>
                )}

                {videoScene === 2 && (
                  /* Instant Tap-to-Pay Settlement */
                  <div className="space-y-3 animate-in fade-in duration-500">
                    <div className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-950/60 to-slate-900 border border-emerald-500/30 text-center space-y-1">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                        Instant Invoice Settlement
                      </span>
                      <div className="text-2xl font-black text-white font-mono">$199.00</div>
                      <div className="inline-flex items-center gap-1 text-[8px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                        <ShieldCheck className="h-2.5 w-2.5" /> Apple Pay &bull; Settled
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-orange-500/15 border border-orange-500/30 text-center space-y-0.5">
                      <div className="text-orange-400 text-xs font-bold">★★★★★</div>
                      <div className="text-[9px] font-bold text-white">&ldquo;Arrived in 20 mins, cold air restored!&rdquo;</div>
                      <div className="text-[8px] text-emerald-400 font-semibold">+$25.00 Driver Tip Added</div>
                    </div>
                  </div>
                )}

                {/* Bottom App Bar */}
                <div className="pt-2 border-t border-white/10 flex justify-between text-[8px] text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-orange-400 font-bold">
                      Scene {videoScene + 1}/3
                    </span>
                    <span>&bull;</span>
                    <span>{videoScene === 0 ? "Live Arrival" : videoScene === 1 ? "Diagnostic" : "Payment"}</span>
                  </div>
                  <span className="text-emerald-400 font-bold">Continuous Loop</span>
                </div>
              </div>

              {/* Bottom Home Indicator Bar */}
              <div className="w-24 h-1 bg-white/30 rounded-full mx-auto mt-2" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
