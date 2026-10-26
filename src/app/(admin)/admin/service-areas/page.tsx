/* eslint-disable @next/next/no-img-element */
"use client";

import * as React from "react";
import Link from "next/link";
import {
  MapPin,
  Plus,
  Search,
  CheckCircle2,
  MoreHorizontal,
  Compass,
  Navigation,
  Globe,
  Radio,
  SlidersHorizontal,
  X,
  Minus,
} from "lucide-react";
import { toast } from "sonner";

interface CityArea {
  id: string;
  city: string;
  zipCount: number;
  radius: string;
  status: "Active" | "Inactive";
}

const INITIAL_AREAS: CityArea[] = [
  { id: "area-1", city: "Miami, FL", zipCount: 8, radius: "25 miles", status: "Active" },
  { id: "area-2", city: "Fort Lauderdale, FL", zipCount: 6, radius: "20 miles", status: "Active" },
  { id: "area-3", city: "Hollywood, FL", zipCount: 4, radius: "20 miles", status: "Active" },
  { id: "area-4", city: "Hialeah, FL", zipCount: 5, radius: "15 miles", status: "Active" },
  { id: "area-5", city: "Pembroke Pines, FL", zipCount: 3, radius: "15 miles", status: "Active" },
  { id: "area-6", city: "Coral Gables, FL", zipCount: 2, radius: "10 miles", status: "Active" },
  { id: "area-7", city: "Miramar, FL", zipCount: 2, radius: "10 miles", status: "Active" },
  { id: "area-8", city: "Weston, FL", zipCount: 2, radius: "10 miles", status: "Active" },
];

export default function AdminServiceAreasPage() {
  const [areas, setAreas] = React.useState<CityArea[]>(INITIAL_AREAS);
  const [search, setSearch] = React.useState("");
  const [mapZoom, setMapZoom] = React.useState(1);

  // Modal State
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [newCity, setNewCity] = React.useState("");
  const [newZips, setNewZips] = React.useState("");
  const [newRadius, setNewRadius] = React.useState("15 miles");

  // Top 4 KPI Metrics matching reference image
  const kpis = [
    {
      title: "Total ZIP Codes",
      value: "48",
      subtext: "+ 5 this month",
      subtextColor: "text-emerald-400",
    },
    {
      title: "Coverage Cities",
      value: "12",
      subtext: "+ 2 this month",
      subtextColor: "text-emerald-400",
    },
    {
      title: "Active Areas",
      value: "10",
      subtext: "83% of total",
      subtextColor: "text-blue-400",
    },
    {
      title: "Service Radius",
      value: "25 miles",
      subtext: "Standard coverage",
      subtextColor: "text-slate-400",
    },
  ];

  // Filtered areas
  const filteredAreas = React.useMemo(() => {
    return areas.filter((a) =>
      search === "" || a.city.toLowerCase().includes(search.toLowerCase())
    );
  }, [areas, search]);

  // Handle Add Area
  const handleAddArea = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCity) {
      toast.error("Please enter a city name");
      return;
    }

    const zCount = newZips ? newZips.split(",").length : 2;
    const newArea: CityArea = {
      id: `area-${Date.now()}`,
      city: newCity,
      zipCount: zCount,
      radius: newRadius,
      status: "Active",
    };

    setAreas([...areas, newArea]);
    setShowAddModal(false);
    setNewCity("");
    setNewZips("");
    toast.success(`Service area "${newArea.city}" added!`);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white p-4 lg:p-6 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Service Areas</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Manage ZIP codes, cities and booking coverage.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="rounded-lg bg-[#F97316] hover:bg-[#EA580C] text-white px-4 py-2 text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-orange-500/20 active:scale-95 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add Service Area</span>
        </button>
      </div>

      {/* Top 4 KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpis.map((kpi, idx) => (
          <div
            key={idx}
            className="rounded-xl bg-[#0F172A]/90 border border-white/10 p-3.5 flex flex-col justify-between shadow-md"
          >
            <div className="text-xs font-medium text-slate-400">{kpi.title}</div>
            <div className="mt-2">
              <div className="text-2xl font-bold text-white tracking-tight">{kpi.value}</div>
              <div className={`text-xs font-medium mt-0.5 ${kpi.subtextColor}`}>
                {kpi.subtext}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 2-Column Main Layout: Areas by City & Area Coverage Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* LEFT COLUMN: Areas by City Table */}
        <div className="lg:col-span-6 rounded-2xl bg-[#0F172A]/90 border border-white/10 p-4 space-y-3 shadow-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-white uppercase tracking-wide">
              Areas by City
            </h2>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search cities..."
              className="w-full rounded-lg bg-[#080D1A] border border-white/10 pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition"
            />
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 text-[11px] uppercase">
                  <th className="py-2.5 px-3 font-semibold">City</th>
                  <th className="py-2.5 px-3 font-semibold">ZIP Codes</th>
                  <th className="py-2.5 px-3 font-semibold">Coverage Radius</th>
                  <th className="py-2.5 px-3 font-semibold">Status</th>
                  <th className="py-2.5 px-3 font-semibold text-right">•••</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredAreas.map((area) => (
                  <tr
                    key={area.id}
                    className="hover:bg-slate-800/40 transition group cursor-pointer"
                    onClick={() => toast.info(`Viewing coverage for ${area.city}`)}
                  >
                    <td className="py-2.5 px-3 font-bold text-white flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                      <span>{area.city}</span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-300 font-mono">{area.zipCount}</td>
                    <td className="py-2.5 px-3 text-slate-300">{area.radius}</td>
                    <td className="py-2.5 px-3">
                      <span className="border border-emerald-500/30 bg-emerald-500/15 text-emerald-400 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                        {area.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toast.info(`Options for ${area.city}`);
                        }}
                        className="p-1 text-slate-400 hover:text-white transition"
                      >
                        <MoreHorizontal className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT COLUMN: Area Coverage Map */}
        <div className="lg:col-span-6 rounded-2xl bg-[#0F172A]/90 border border-white/10 p-4 space-y-3 shadow-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-white uppercase tracking-wide">
              Area Coverage Map
            </h2>
          </div>

          {/* Interactive Map Visual */}
          <div className="relative w-full h-80 sm:h-96 rounded-xl bg-[#08101E] border border-white/10 overflow-hidden select-none">
            {/* Dark Styled SVG Map of South Florida Corridor */}
            <svg
              viewBox="0 0 500 400"
              className="w-full h-full object-cover transition-transform duration-300 ease-out"
              style={{ transform: `scale(${mapZoom})` }}
            >
              {/* Ocean / Biscayne Bay & Atlantic */}
              <rect width="500" height="400" fill="#070E1A" />

              {/* Coastal Mainland Path */}
              <path
                d="M0,0 L320,0 L325,100 L320,180 L300,280 L280,360 L260,400 L0,400 Z"
                fill="#0B1528"
                stroke="#1E293B"
                strokeWidth="1.5"
              />

              {/* Barrier Islands */}
              <path
                d="M345,60 L350,150 L340,240 L325,310 L320,360 L330,360 L350,300 L365,210 L360,60 Z"
                fill="#0D1A30"
                stroke="#1E293B"
                strokeWidth="1.2"
              />

              {/* Primary North-South Arteries (I-95 & Turnpike) */}
              <path
                d="M260,0 L270,100 L265,220 L250,320 L230,400"
                fill="none"
                stroke="#1E293B"
                strokeWidth="3"
              />
              <path
                d="M260,0 L270,100 L265,220 L250,320 L230,400"
                fill="none"
                stroke="#334155"
                strokeWidth="1"
              />
              <path
                d="M180,0 L200,120 L205,240 L195,340 L170,400"
                fill="none"
                stroke="#1E293B"
                strokeWidth="2"
                strokeDasharray="4 2"
              />

              {/* East-West Connectors & Causeways */}
              <line x1="80" y1="90" x2="330" y2="90" stroke="#13233D" strokeWidth="1" />
              <line x1="80" y1="160" x2="325" y2="160" stroke="#13233D" strokeWidth="1" />
              <line x1="80" y1="230" x2="320" y2="230" stroke="#13233D" strokeWidth="1" />
              <line x1="80" y1="300" x2="310" y2="300" stroke="#13233D" strokeWidth="1" />

              {/* Concentric 25-Mile Service Area Radius Circles around Miami */}
              {/* Outer 25-mile boundary with glowing blue pulse */}
              <circle
                cx="250"
                cy="310"
                r="70"
                fill="rgba(59, 130, 246, 0.12)"
                stroke="#3B82F6"
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />
              <circle
                cx="250"
                cy="310"
                r="45"
                fill="rgba(59, 130, 246, 0.08)"
                stroke="#3B82F6"
                strokeWidth="1"
                opacity="0.6"
              />
              <circle
                cx="250"
                cy="310"
                r="20"
                fill="rgba(59, 130, 246, 0.15)"
                stroke="#60A5FA"
                strokeWidth="1"
              />

              {/* City Dots & Text Labels */}
              {/* Boca Raton */}
              <circle cx="270" cy="80" r="3.5" fill="#FFFFFF" stroke="#3B82F6" strokeWidth="1.5" />
              <text x="278" y="83" fill="#94A3B8" fontSize="10" fontWeight="600">Boca Raton</text>

              {/* Fort Lauderdale */}
              <circle cx="265" cy="150" r="4" fill="#FFFFFF" stroke="#3B82F6" strokeWidth="2" />
              <text x="274" y="154" fill="#E2E8F0" fontSize="11" fontWeight="700">Fort Lauderdale</text>

              {/* Hollywood */}
              <circle cx="260" cy="220" r="3.5" fill="#FFFFFF" stroke="#3B82F6" strokeWidth="1.5" />
              <text x="268" y="223" fill="#94A3B8" fontSize="10" fontWeight="600">Hollywood</text>

              {/* Miami Core Center */}
              <circle cx="250" cy="310" r="5" fill="#3B82F6" stroke="#FFFFFF" strokeWidth="2" />
              <text x="260" y="315" fill="#FFFFFF" fontSize="13" fontWeight="800" letterSpacing="0.5">Miami</text>

              {/* Scattered Yellow ZIP Code Markers matching screenshot */}
              {[
                { cx: 285, cy: 190 },
                { cx: 240, cy: 260 },
                { cx: 275, cy: 270 },
                { cx: 215, cy: 305 },
                { cx: 230, cy: 330 },
                { cx: 270, cy: 345 },
                { cx: 295, cy: 310 },
                { cx: 220, cy: 350 },
                { cx: 185, cy: 280 },
              ].map((pin, i) => (
                <g key={i}>
                  <circle cx={pin.cx} cy={pin.cy} r="3" fill="#F59E0B" stroke="#0F172A" strokeWidth="1" />
                </g>
              ))}
            </svg>

            {/* Map Zoom Controls on Top Right */}
            <div className="absolute top-2.5 right-2.5 flex flex-col rounded bg-[#0F172A]/90 border border-white/10 overflow-hidden shadow-lg backdrop-blur-md">
              <button
                onClick={() => setMapZoom((z) => Math.min(z + 0.25, 2.0))}
                className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 transition"
                title="Zoom In"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
              <div className="h-px bg-white/10" />
              <button
                onClick={() => setMapZoom((z) => Math.max(z - 0.25, 1.0))}
                className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 transition"
                title="Zoom Out"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Map Legend Overlay at Bottom */}
            <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-center gap-4 rounded-lg bg-[#0F172A]/90 border border-white/10 py-1.5 px-3 backdrop-blur-md text-[10px] text-slate-300 shadow-lg">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span>Service Area</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span>ZIP Code</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-white" />
                <span>City Center</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Service Area Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="rounded-2xl bg-[#0F172A] border border-white/10 p-5 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h3 className="text-sm font-bold text-white">Add New Service Area</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddArea} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300">City, State *</label>
                <input
                  type="text"
                  required
                  value={newCity}
                  onChange={(e) => setNewCity(e.target.value)}
                  placeholder="e.g. Doral, FL"
                  className="w-full rounded-lg bg-[#080D1A] border border-white/10 p-2 text-xs text-white mt-1"
                />
              </div>

              <div>
                <label className="text-slate-300">ZIP Codes (comma-separated)</label>
                <input
                  type="text"
                  value={newZips}
                  onChange={(e) => setNewZips(e.target.value)}
                  placeholder="33178, 33172"
                  className="w-full rounded-lg bg-[#080D1A] border border-white/10 p-2 text-xs text-white mt-1"
                />
              </div>

              <div>
                <label className="text-slate-300">Coverage Radius</label>
                <select
                  value={newRadius}
                  onChange={(e) => setNewRadius(e.target.value)}
                  className="w-full rounded-lg bg-[#080D1A] border border-white/10 p-2 text-xs text-white mt-1"
                >
                  <option value="10 miles">10 miles</option>
                  <option value="15 miles">15 miles</option>
                  <option value="20 miles">20 miles</option>
                  <option value="25 miles">25 miles</option>
                  <option value="30 miles">30 miles</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded px-3 py-1.5 text-xs text-slate-300 bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded px-4 py-1.5 text-xs font-bold text-white bg-[#F97316] shadow-md shadow-orange-500/20"
                >
                  Add Area
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
