"use client";

import * as React from "react";
import {
  MapPin,
  ExternalLink,
  Navigation,
  Layers,
  Maximize2,
  RefreshCw,
} from "lucide-react";

interface GoogleMapEmbedProps {
  query?: string;
  lat?: number;
  lng?: number;
  zoom?: number;
  title?: string;
  className?: string;
  height?: string;
  mapType?: "m" | "k"; // m: standard map, k: satellite
  showControls?: boolean;
}

export function GoogleMapEmbed({
  query = "Miami, FL",
  lat = 25.7617,
  lng = -80.1918,
  zoom = 13,
  title = "Real Google Map Dispatch & Territory",
  className = "",
  height = "h-72 sm:h-80",
  mapType: initialMapType = "m",
  showControls = true,
}: GoogleMapEmbedProps) {
  const [mapType, setMapType] = React.useState<"m" | "k">(initialMapType);
  const [currentZoom, setCurrentZoom] = React.useState<number>(zoom);
  const [isRefreshing, setIsRefreshing] = React.useState<boolean>(false);

  const encodedQuery = encodeURIComponent(query);
  const embedUrl = `https://maps.google.com/maps?q=${encodedQuery}&t=${mapType}&z=${currentZoom}&ie=UTF8&iwloc=&output=embed`;
  const externalMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedQuery}`;

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 400);
  };

  return (
    <div
      className={`relative w-full rounded-2xl bg-[#080D1A] border border-white/10 overflow-hidden shadow-2xl flex flex-col ${className}`}
    >
      {/* Top Header Bar with Real Google Maps Controls */}
      {showControls && (
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#0B1324] border-b border-white/10 z-10 text-xs text-white">
          <div className="flex items-center gap-2 min-w-0">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="font-bold text-slate-200 truncate">{title}</span>
            <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] text-slate-400 font-mono hidden sm:inline">
              Google Maps Live
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Map vs Satellite Toggle */}
            <div className="flex rounded-lg bg-black/40 border border-white/10 p-0.5 text-[11px]">
              <button
                type="button"
                onClick={() => setMapType("m")}
                className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                  mapType === "m"
                    ? "bg-[#F97316] text-[#0C1523] shadow-sm font-bold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Map
              </button>
              <button
                type="button"
                onClick={() => setMapType("k")}
                className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                  mapType === "k"
                    ? "bg-[#F97316] text-[#0C1523] shadow-sm font-bold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Satellite
              </button>
            </div>

            {/* Refresh Button */}
            <button
              type="button"
              onClick={handleRefresh}
              title="Refresh Google Map"
              className="p-1.5 rounded-lg border border-white/10 bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
            </button>

            {/* Open in External Google Maps */}
            <a
              href={externalMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Open full directions in Google Maps"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-white/10 bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 transition-all text-[11px] font-semibold"
            >
              <span>Open Google Maps</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}

      {/* Real Google Maps iframe viewport */}
      <div className={`relative w-full ${height} overflow-hidden bg-[#0A101D]`}>
        <iframe
          src={embedUrl}
          title={title}
          className="w-full h-full border-0"
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
        />

        {/* Floating Real-Time Overlay Badge */}
        <div className="absolute bottom-3 left-3 z-10 px-3 py-1.5 rounded-xl bg-[#0B1324]/90 backdrop-blur-md border border-white/15 text-[11px] font-medium text-slate-200 shadow-xl flex items-center gap-2 pointer-events-none select-none">
          <MapPin className="w-3.5 h-3.5 text-[#F97316]" />
          <span>Active Coverage: {query}</span>
        </div>
      </div>
    </div>
  );
}
