"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Truck,
  DollarSign,
  Sun,
  Calendar,
  MapPin,
  Clock,
  ChevronRight,
  ChevronDown,
  Zap,
  Package,
  MessageSquare,
  Navigation,
  ArrowRight,
  Check,
  AlertTriangle,
  Flame,
  Plus,
  Minus,
  RotateCcw,
  Compass,
  Map as MapIcon,
  ShieldCheck,
  Radio,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { GoogleMapEmbed } from "@/components/maps/GoogleMapEmbed";

// Real geographic coordinate projection for slippy map tiles (Web Mercator)
function project(lat: number, lon: number, zoom: number) {
  const sin = Math.sin((lat * Math.PI) / 180);
  const x = ((lon + 180) / 360) * 256 * Math.pow(2, zoom);
  const y = (0.5 - Math.log((1 + sin) / (1 - sin)) / (4 * Math.PI)) * 256 * Math.pow(2, zoom);
  return { x, y };
}

// Route waypoints across Miami (Stop 1 Brickell -> Biscayne Blvd -> MacArthur Causeway -> Stop 2 Ocean Dr)
const ROUTE_WAYPOINTS = [
  { lat: 25.7617, lon: -80.1918 }, // Stop 1: 123 Brickell Ave
  { lat: 25.7715, lon: -80.1882 }, // Downtown Miami
  { lat: 25.7872, lon: -80.1885 }, // Biscayne Blvd / I-395 Junction
  { lat: 25.7745, lon: -80.1600 }, // MacArthur Causeway mid-bridge
  { lat: 25.7780, lon: -80.1380 }, // Alton Rd / 5th St entrance
  { lat: 25.7743, lon: -80.1306 }, // Stop 2: 456 Ocean Dr, Miami Beach
];

export default function TechDashboardOverviewPage() {
  const router = useRouter();

  // State
  const [onDuty, setOnDuty] = React.useState(true);
  const [clockedIn, setClockedIn] = React.useState(true);
  const [shiftSeconds, setShiftSeconds] = React.useState(19320); // 5h 22m

  // Live real map state
  const mapContainerRef = React.useRef<HTMLDivElement>(null);
  const [mapZoom, setMapZoom] = React.useState(12);
  const [centerCoord, setCenterCoord] = React.useState({ lat: 25.7725, lon: -80.1650 });
  const [panOffset, setPanOffset] = React.useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = React.useState(false);
  const dragStartRef = React.useRef({ x: 0, y: 0 });
  const [activeMarkerTooltip, setActiveMarkerTooltip] = React.useState<string | null>(null);

  // Shift elapsed timer ticker
  React.useEffect(() => {
    if (!clockedIn) return;
    const interval = setInterval(() => {
      setShiftSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [clockedIn]);

  const formatShiftDuration = (totalSecs: number) => {
    const hours = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    return `${hours}h ${mins}m`;
  };

  // Toggle on duty
  const handleToggleDuty = () => {
    setOnDuty((prev) => {
      const next = !prev;
      if (next) {
        toast.success("Status updated: On Duty & Active. Live GPS broadcasting to Dispatch.");
      } else {
        toast.info("Status updated: Off Duty.");
      }
      return next;
    });
  };

  // Toggle clock in/out
  const handleClockToggle = () => {
    setClockedIn((prev) => {
      const next = !prev;
      if (next) {
        toast.success("Clocked in (GPS Verified: Miami Metro • Service Fleet Vehicle)");
      } else {
        toast.info("Clocked out for rest break");
      }
      return next;
    });
  };

  // 1-Tap Distress Pings to Dispatch
  const sendDistressPing = (type: "traffic" | "no_show" | "hazard") => {
    if (type === "traffic") {
      toast.warning("Traffic Delay Alert sent to Dispatch", {
        description: "+15 minutes added to Stop #2 ETA. Customer SMS automatically sent.",
      });
    } else if (type === "no_show") {
      toast.warning("Customer No-Show Alert sent", {
        description: "Doorbell rung twice, phone called. Dispatch notified to attempt phone contact.",
      });
    } else if (type === "hazard") {
      toast.error("Safety Hazard Hold Flagged", {
        description: "Attic temp > 125°F or electrical risk logged. Lead supervisor notified.",
      });
    }
  };

  // Map panning drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX - panOffset.x, y: e.clientY - panOffset.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPanOffset({
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleRecenter = () => {
    setPanOffset({ x: 0, y: 0 });
    setMapZoom(12);
    setCenterCoord({ lat: 25.7725, lon: -80.1650 });
    toast.success("Map recentered on Carlos's active Miami route");
  };

  // Compute slippy map tiles for the visible viewport
  const viewWidth = 460;
  const viewHeight = 240;
  const centerProj = project(centerCoord.lat, centerCoord.lon, mapZoom);
  const adjustedCenterX = centerProj.x - panOffset.x;
  const adjustedCenterY = centerProj.y - panOffset.y;

  const minTileX = Math.floor((adjustedCenterX - viewWidth / 2) / 256);
  const maxTileX = Math.floor((adjustedCenterX + viewWidth / 2) / 256);
  const minTileY = Math.floor((adjustedCenterY - viewHeight / 2) / 256);
  const maxTileY = Math.floor((adjustedCenterY + viewHeight / 2) / 256);

  const tiles = [];
  for (let tx = minTileX; tx <= maxTileX; tx++) {
    for (let ty = minTileY; ty <= maxTileY; ty++) {
      const left = tx * 256 - (adjustedCenterX - viewWidth / 2);
      const top = ty * 256 - (adjustedCenterY - viewHeight / 2);
      tiles.push({ tx, ty, left, top });
    }
  }

  // Calculate screen positions for Stop 1 & Stop 2 markers
  const stop1Proj = project(25.7617, -80.1918, mapZoom);
  const stop1Pos = {
    x: viewWidth / 2 + (stop1Proj.x - adjustedCenterX),
    y: viewHeight / 2 + (stop1Proj.y - adjustedCenterY),
  };

  const stop2Proj = project(25.7743, -80.1306, mapZoom);
  const stop2Pos = {
    x: viewWidth / 2 + (stop2Proj.x - adjustedCenterX),
    y: viewHeight / 2 + (stop2Proj.y - adjustedCenterY),
  };

  // Van live GPS marker along Biscayne Blvd
  const vanProj = project(25.7790, -80.1884, mapZoom);
  const vanPos = {
    x: viewWidth / 2 + (vanProj.x - adjustedCenterX),
    y: viewHeight / 2 + (vanProj.y - adjustedCenterY),
  };

  // SVG route polyline path string
  const routePathSvg = ROUTE_WAYPOINTS.map((w, i) => {
    const p = project(w.lat, w.lon, mapZoom);
    const sx = viewWidth / 2 + (p.x - adjustedCenterX);
    const sy = viewHeight / 2 + (p.y - adjustedCenterY);
    return `${i === 0 ? "M" : "L"} ${sx.toFixed(1)} ${sy.toFixed(1)}`;
  }).join(" ");

  return (
    <div className="space-y-4 max-w-[1600px] mx-auto text-white selection:bg-[#F97316] selection:text-[#0C1523]">
      {/* ─────────────────────────────────────────────────────────────
          1. HEADER HERO GREETING CARD (Exact Match to Reference)
      ───────────────────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-white/10 bg-[#0B1322] p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3.5">
          {/* Avatar Badge */}
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F97316] text-[#020617] font-black text-base shadow-md shrink-0">
            CM
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Good morning, Carlos
            </h1>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Tuesday, May 27, 2025 &bull; 07:42 AM
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          {/* Live Shift Duration Pill */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300 text-xs font-semibold">
            <Clock className="w-3.5 h-3.5 text-blue-400" />
            <span>Shift: {formatShiftDuration(shiftSeconds)} elapsed</span>
          </div>

          {/* On Duty & Active Status Pill Toggle */}
          <button
            type="button"
            onClick={handleToggleDuty}
            className={cn(
              "inline-flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-semibold transition-all cursor-pointer shadow-sm",
              onDuty
                ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25"
                : "border-white/15 bg-white/5 text-slate-400 hover:text-white hover:bg-white/10"
            )}
            title="Click to toggle active dispatch status"
          >
            <span
              className={cn(
                "w-2 h-2 rounded-full",
                onDuty ? "bg-emerald-400 animate-pulse" : "bg-slate-500"
              )}
            />
            <span>{onDuty ? "On Duty & Active" : "Off Duty"}</span>
            <ChevronDown className="w-3.5 h-3.5 opacity-70" />
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. TOP 4 METRIC CARDS (Route | Earnings | Van Stock | Weather)
      ───────────────────────────────────────────────────────────── */}
      <section aria-label="Key Metrics" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Today's Route (Blue Accent) */}
        <div className="rounded-2xl border border-blue-500/30 bg-[#0B1528] p-4 sm:p-5 flex flex-col justify-between shadow-lg relative group transition-all hover:border-blue-500/50">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                <Truck className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-slate-300">Today&apos;s Route</span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-white mt-3 tracking-tight">
              2 Stops
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Next: AC Repair at 9:00 AM
            </p>
          </div>
          <div className="pt-3 flex justify-end">
            <Link
              href="/tech/jobs"
              className="text-xs font-semibold text-blue-400 hover:text-blue-300 inline-flex items-center gap-1 transition-colors"
            >
              <span>View Route</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Card 2: Today's Earnings (Emerald Accent) */}
        <div className="rounded-2xl border border-emerald-500/30 bg-[#0B1E22] p-4 sm:p-5 flex flex-col justify-between shadow-lg relative group transition-all hover:border-emerald-500/50">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <DollarSign className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-slate-300">Today&apos;s Earnings</span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-emerald-400 mt-3 tracking-tight">
              $245.00
            </div>
            <p className="text-xs text-slate-400 mt-1">
              + $45.00 vs. yesterday
            </p>
          </div>
          <div className="pt-3 flex justify-end">
            <Link
              href="/tech/earnings"
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-1 transition-colors"
            >
              <span>View Details</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Card 3: Fleet Unit Alpha (Purple Accent) */}
        <div className="rounded-2xl border border-purple-500/30 bg-[#160E2E] p-4 sm:p-5 flex flex-col justify-between shadow-lg relative group transition-all hover:border-purple-500/50">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                <Truck className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-slate-300">Fleet Unit Alpha</span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-white mt-3 tracking-tight">
              48 Parts Stocked
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Fuel: 78% &bull; Tires: OK &bull; Tools: Complete
            </p>
          </div>
          <div className="pt-3 flex justify-end">
            <Link
              href="/tech/jobs/job-1004/parts"
              className="text-xs font-semibold text-purple-400 hover:text-purple-300 inline-flex items-center gap-1 transition-colors"
            >
              <span>Check Inventory</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Card 4: Miami Corridor (Amber Accent) */}
        <div className="rounded-2xl border border-amber-500/30 bg-[#1F140A] p-4 sm:p-5 flex flex-col justify-between shadow-lg relative group transition-all hover:border-amber-500/50">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                <Sun className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-slate-300">Miami Corridor</span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-amber-400 mt-3 tracking-tight">
              89°F &bull; Heat Alert
            </div>
            <p className="text-xs text-slate-400 mt-1">
              High UV &bull; Stay Hydrated &bull; Take Breaks
            </p>
          </div>
          <div className="pt-3 flex justify-end">
            <button
              type="button"
              onClick={() => toast.info("Miami Heat Advisory: Max heat index 102°F. Drink electrolyte fluids.")}
              className="text-xs font-semibold text-amber-400 hover:text-amber-300 inline-flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>View Weather</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          2.5 DISPATCH DISTRESS QUICK PINGS (Field Operational Controls)
      ───────────────────────────────────────────────────────────── */}
      <div className="rounded-xl border border-white/10 bg-[#0E1726] p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-300 font-semibold">
          <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span>Quick Dispatch Pings:</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => sendDistressPing("traffic")}
            className="px-3 py-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-medium transition-colors"
          >
            +15m Traffic Delay
          </button>
          <button
            type="button"
            onClick={() => sendDistressPing("no_show")}
            className="px-3 py-1.5 rounded-lg border border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 font-medium transition-colors"
          >
            Customer No-Show
          </button>
          <button
            type="button"
            onClick={() => sendDistressPing("hazard")}
            className="px-3 py-1.5 rounded-lg border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-300 font-medium transition-colors"
          >
            Attic Heat / Safety Hold
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. MIDDLE SECTION: TODAY'S JOBS (Left) + TODAY'S ROUTE REAL MAP (Right)
      ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* LEFT COLUMN: TODAY'S JOBS */}
        <div className="rounded-2xl border border-white/10 bg-[#0B1322] p-5 shadow-xl flex flex-col justify-between space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between pb-2 border-b border-white/5">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
                <Calendar className="w-4 h-4" />
              </div>
              <h2 className="text-base font-bold text-white tracking-tight">Today&apos;s Jobs</h2>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-xs text-slate-400 font-semibold">2 of 2 Completed</div>
              <div className="w-24 sm:w-32 h-2 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-emerald-400 rounded-full w-full" />
              </div>
              <Link href="/tech/jobs" className="text-slate-400 hover:text-white transition-colors">
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Job Cards */}
          <div className="space-y-3 flex-1">
            {/* Job 1: Completed */}
            <div className="rounded-xl border border-white/10 border-l-4 border-l-emerald-500 bg-[#0E1726] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md hover:border-white/20 transition-all">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-white">07:00 AM &ndash; 04:30 PM</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase bg-emerald-500/20 text-emerald-400 tracking-wider">
                      Completed
                    </span>
                  </div>
                  <div className="text-sm font-bold text-white mt-1">
                    WO-#1030 &bull; <span className="font-normal text-slate-300">AC Repair</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span>123 Brickell Ave, Miami 33131</span>
                  </div>
                </div>
              </div>

              <div className="self-end sm:self-center shrink-0">
                <Link
                  href="/tech/jobs/job-1004"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-white text-xs font-semibold transition-colors"
                >
                  <span>View Details</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </Link>
              </div>
            </div>

            {/* Job 2: Assigned */}
            <div className="rounded-xl border border-white/10 border-l-4 border-l-[#F97316] bg-[#0E1726] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md hover:border-white/20 transition-all">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-orange-500/20 text-[#F97316] flex items-center justify-center shrink-0 mt-0.5">
                  <Clock className="w-3.5 h-3.5 stroke-[2.5]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-white">01:00 PM &ndash; 02:30 PM</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase bg-orange-500/20 text-[#F97316] tracking-wider">
                      Assigned
                    </span>
                  </div>
                  <div className="text-sm font-bold text-white mt-1">
                    WO-#1034 &bull; <span className="font-normal text-slate-300">AC Repair</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span>456 Ocean Dr, Miami 33139</span>
                  </div>
                </div>
              </div>

              <div className="self-end sm:self-center shrink-0">
                <Link
                  href="/tech/jobs/job-1002"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-white text-xs font-semibold transition-colors"
                >
                  <span>View Details</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: TODAY'S ROUTE (REAL INTERACTIVE MAP + STOPS) */}
        <div className="rounded-2xl border border-white/10 bg-[#0B1322] p-5 shadow-xl flex flex-col justify-between space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between pb-2 border-b border-white/5">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <MapIcon className="w-4 h-4" />
              </div>
              <h2 className="text-base font-bold text-white tracking-tight">Today&apos;s Route</h2>
            </div>

            <Link
              href="/tech/jobs"
              className="text-xs font-semibold text-slate-400 hover:text-white inline-flex items-center gap-1 transition-colors"
            >
              <span>2 Stops</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Map + Stops Split Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 flex-1 items-stretch">
            {/* Real Interactive Google Maps Route Viewport */}
            <div className="sm:col-span-7 rounded-xl overflow-hidden shadow-md">
              <GoogleMapEmbed
                query="123 Brickell Ave to 456 Ocean Dr, Miami, FL"
                title="Live Google Maps Route — Service Fleet Vehicle"
                height="h-64 sm:h-72"
              />
            </div>

            {/* Timeline Stops Details */}
            <div className="sm:col-span-5 flex flex-col justify-between space-y-3 py-1">
              <div className="space-y-4">
                {/* Stop 1 Item */}
                <div className="flex items-start gap-2.5 relative">
                  <div className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 font-black text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    1
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-white">07:00 AM &ndash; 04:30 PM</div>
                    <div className="text-xs font-medium text-slate-300 mt-0.5">AC Repair</div>
                    <div className="text-[11px] text-slate-400 truncate">123 Brickell Ave, Miami 33131</div>
                    <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full uppercase bg-emerald-500/20 text-emerald-400 mt-1">
                      Completed
                    </span>
                  </div>
                </div>

                {/* Connecting Line */}
                <div className="w-px h-4 bg-white/15 ml-2.5 -my-2" />

                {/* Stop 2 Item */}
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-[#F97316] text-slate-950 font-black text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    2
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-white">01:00 PM &ndash; 02:30 PM</div>
                    <div className="text-xs font-medium text-slate-300 mt-0.5">AC Repair</div>
                    <div className="text-[11px] text-slate-400 truncate">456 Ocean Dr, Miami 33139</div>
                    <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full uppercase bg-orange-500/20 text-[#F97316] mt-1">
                      Assigned
                    </span>
                  </div>
                </div>
              </div>

              {/* View Full Route Button */}
              <Link
                href="/tech/jobs"
                className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-blue-500/40 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 hover:text-blue-300 text-xs font-semibold transition-all shadow-sm"
              >
                <span>View Full Route</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          4. BOTTOM ROW: QUICK ACTIONS (8 COLS) + NEXT SCHEDULE (4 COLS)
      ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* QUICK ACTIONS (8 Columns) */}
        <div className="lg:col-span-8 rounded-2xl border border-white/10 bg-[#0B1322] p-5 shadow-xl space-y-3.5">
          <div className="flex items-center gap-2 pb-1 border-b border-white/5">
            <Zap className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white tracking-tight">Quick Actions</h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Action 1: View Route (Solid Blue) */}
            <Link
              href="/tech/jobs"
              className="bg-[#1D6AE5] hover:bg-[#185AC2] text-white p-3.5 rounded-2xl flex items-center gap-3 transition-all shadow-lg shadow-blue-500/20 group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Navigation className="w-4 h-4 text-white" />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-bold leading-tight">View Route</div>
                <div className="text-[11px] text-blue-100 truncate mt-0.5">Check today&apos;s jobs</div>
              </div>
            </Link>

            {/* Action 2: Clock In/Out (Navy) */}
            <button
              type="button"
              onClick={handleClockToggle}
              className="border border-white/10 bg-[#0E1A33] hover:bg-[#132347] text-white p-3.5 rounded-2xl flex items-center gap-3 transition-all text-left group cursor-pointer shadow-sm"
            >
              <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Clock className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-bold leading-tight">Clock In/Out</div>
                <div className="text-[11px] text-slate-400 truncate mt-0.5">
                  {clockedIn ? "Logged at 07:00 AM" : "Manage your time"}
                </div>
              </div>
            </button>

            {/* Action 3: Parts Lookup (Purple) */}
            <Link
              href="/tech/jobs/job-1004/parts"
              className="border border-purple-500/30 bg-[#24134A] hover:bg-[#2F1960] text-white p-3.5 rounded-2xl flex items-center gap-3 transition-all group cursor-pointer shadow-sm"
            >
              <div className="w-8 h-8 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Package className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-bold leading-tight">Parts Lookup</div>
                <div className="text-[11px] text-purple-200 truncate mt-0.5">Check inventory</div>
              </div>
            </Link>

            {/* Action 4: Send Message (Emerald) */}
            <Link
              href="/tech/notifications"
              className="border border-emerald-500/30 bg-[#0E3326] hover:bg-[#134735] text-white p-3.5 rounded-2xl flex items-center gap-3 transition-all group cursor-pointer shadow-sm"
            >
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-bold leading-tight">Send Message</div>
                <div className="text-[11px] text-emerald-200 truncate mt-0.5">Contact dispatch</div>
              </div>
            </Link>
          </div>
        </div>

        {/* NEXT SCHEDULE (4 Columns) */}
        <div className="lg:col-span-4 rounded-2xl border border-white/10 bg-[#0B1322] p-5 shadow-xl flex flex-col justify-between space-y-3.5">
          <div className="flex items-center justify-between pb-1 border-b border-white/5">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-400" />
              <h3 className="text-sm font-bold text-white tracking-tight">Next Schedule</h3>
            </div>
            <Link
              href="/tech/schedule"
              className="text-xs font-semibold text-slate-400 hover:text-white inline-flex items-center gap-1 transition-colors"
            >
              <span>View Calendar</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="rounded-xl border border-white/10 bg-[#0E1726] p-4 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-white">Tomorrow, May 28</div>
                <div className="text-xs text-slate-400 mt-0.5">08:00 AM &ndash; 04:00 PM</div>
              </div>
            </div>

            <span className="text-xs font-semibold text-slate-300 border border-white/10 bg-white/5 px-3 py-1 rounded-full shrink-0">
              Full Day
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
