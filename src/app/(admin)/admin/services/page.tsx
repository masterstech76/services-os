/* eslint-disable @next/next/no-img-element */
"use client";

import * as React from "react";
import Link from "next/link";
import {
  Wrench,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Flame,
  Droplet,
  Zap,
  Refrigerator,
  Home,
  Trees,
  Sparkles,
  Paintbrush,
  CheckCircle2,
  Clock,
  DollarSign,
  ChevronDown,
  X,
} from "lucide-react";
import { toast } from "sonner";

interface ServiceItem {
  id: string;
  name: string;
  category: "HVAC" | "Plumbing" | "Electrical" | "Appliances" | "General" | "Outdoor" | "Cleaning";
  price: string;
  priceNumber: number;
  duration: string;
  skills: string[];
  status: "Active" | "Inactive";
  icon: any;
  iconBg: string;
  iconColor: string;
}

const INITIAL_SERVICES: ServiceItem[] = [
  {
    id: "svc-1",
    name: "AC Repair",
    category: "HVAC",
    price: "$120.00",
    priceNumber: 120,
    duration: "2 hrs",
    skills: ["HVAC", "Electrical"],
    status: "Active",
    icon: Flame,
    iconBg: "bg-blue-600",
    iconColor: "text-white",
  },
  {
    id: "svc-2",
    name: "Water Heater Repair",
    category: "Plumbing",
    price: "$95.00",
    priceNumber: 95,
    duration: "1.5 hrs",
    skills: ["Plumbing", "Electrical"],
    status: "Active",
    icon: Droplet,
    iconBg: "bg-blue-500",
    iconColor: "text-white",
  },
  {
    id: "svc-3",
    name: "Electrical Panel Upgrade",
    category: "Electrical",
    price: "$150.00",
    priceNumber: 150,
    duration: "3 hrs",
    skills: ["Electrical", "Safety"],
    status: "Active",
    icon: Zap,
    iconBg: "bg-amber-500",
    iconColor: "text-white",
  },
  {
    id: "svc-4",
    name: "Appliance Repair",
    category: "Appliances",
    price: "$80.00",
    priceNumber: 80,
    duration: "1 hr",
    skills: ["Diagnostics", "Repair"],
    status: "Active",
    icon: Refrigerator,
    iconBg: "bg-slate-700",
    iconColor: "text-white",
  },
  {
    id: "svc-5",
    name: "Roof Repair",
    category: "General",
    price: "$200.00",
    priceNumber: 200,
    duration: "4 hrs",
    skills: ["Construction", "Safety"],
    status: "Active",
    icon: Home,
    iconBg: "bg-rose-600",
    iconColor: "text-white",
  },
  {
    id: "svc-6",
    name: "Lawn Care",
    category: "Outdoor",
    price: "$60.00",
    priceNumber: 60,
    duration: "1 hr",
    skills: ["Landscaping", "Tools"],
    status: "Active",
    icon: Trees,
    iconBg: "bg-emerald-600",
    iconColor: "text-white",
  },
  {
    id: "svc-7",
    name: "House Cleaning",
    category: "Cleaning",
    price: "$75.00",
    priceNumber: 75,
    duration: "1.5 hrs",
    skills: ["Cleaning", "Attention to Detail"],
    status: "Active",
    icon: Sparkles,
    iconBg: "bg-teal-600",
    iconColor: "text-white",
  },
  {
    id: "svc-8",
    name: "Painting",
    category: "General",
    price: "$110.00",
    priceNumber: 110,
    duration: "3 hrs",
    skills: ["Painting", "Preparation"],
    status: "Active",
    icon: Paintbrush,
    iconBg: "bg-orange-600",
    iconColor: "text-white",
  },
];

export default function AdminServicesPage() {
  const [services, setServices] = React.useState<ServiceItem[]>(INITIAL_SERVICES);
  const [search, setSearch] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("all");
  const [selectedStatus, setSelectedStatus] = React.useState("all");

  // Modal State
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [newServiceName, setNewServiceName] = React.useState("");
  const [newCategory, setNewCategory] = React.useState<ServiceItem["category"]>("HVAC");
  const [newPrice, setNewPrice] = React.useState("120.00");
  const [newDuration, setNewDuration] = React.useState("2 hrs");
  const [newSkills, setNewSkills] = React.useState("HVAC, Electrical");

  // Top 4 KPI Metrics matching screenshot
  const kpis = [
    {
      title: "Total Services",
      value: "28",
      subtext: "+ 3 this month",
      subtextColor: "text-emerald-400",
    },
    {
      title: "Active Services",
      value: "24",
      subtext: "86% of total",
      subtextColor: "text-blue-400",
    },
    {
      title: "Avg. Price",
      value: "$118.50",
      subtext: "+12% this month",
      subtextColor: "text-emerald-400",
    },
    {
      title: "Avg. Duration",
      value: "2.4 hrs",
      subtext: "-5% this month",
      subtextColor: "text-rose-400",
    },
  ];

  // Filtering
  const filteredServices = React.useMemo(() => {
    return services.filter((svc) => {
      const matchSearch =
        search === "" ||
        svc.name.toLowerCase().includes(search.toLowerCase()) ||
        svc.category.toLowerCase().includes(search.toLowerCase()) ||
        svc.skills.some((sk) => sk.toLowerCase().includes(search.toLowerCase()));

      const matchCategory = selectedCategory === "all" || svc.category === selectedCategory;
      const matchStatus = selectedStatus === "all" || svc.status === selectedStatus;

      return matchSearch && matchCategory && matchStatus;
    });
  }, [services, search, selectedCategory, selectedStatus]);

  // Handle Add Service
  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceName) {
      toast.error("Please enter a service name");
      return;
    }

    const newSvc: ServiceItem = {
      id: `svc-${Date.now()}`,
      name: newServiceName,
      category: newCategory,
      price: `$${parseFloat(newPrice || "0").toFixed(2)}`,
      priceNumber: parseFloat(newPrice || "0"),
      duration: newDuration,
      skills: newSkills.split(",").map((s) => s.trim()).filter(Boolean),
      status: "Active",
      icon: Wrench,
      iconBg: "bg-blue-600",
      iconColor: "text-white",
    };

    setServices([newSvc, ...services]);
    setShowAddModal(false);
    setNewServiceName("");
    toast.success(`Service "${newSvc.name}" added successfully!`);
  };

  // Helper for Category Badge Color
  const getCategoryBadgeClass = (category: ServiceItem["category"]) => {
    switch (category) {
      case "HVAC":
        return "bg-indigo-500/20 text-indigo-400 border-indigo-500/30";
      case "Plumbing":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "Electrical":
        return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      case "Appliances":
        return "bg-cyan-500/20 text-cyan-400 border-cyan-500/30";
      case "General":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "Outdoor":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      case "Cleaning":
        return "bg-teal-500/20 text-teal-400 border-teal-500/30";
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/30";
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white p-4 lg:p-6 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Services Catalogue</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Manage service offerings, prices, durations and required skills.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="rounded-lg bg-[#F97316] hover:bg-[#EA580C] text-white px-4 py-2 text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-orange-500/20 active:scale-95 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add Service</span>
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

      {/* Filter Toolbar */}
      <div className="rounded-xl bg-[#0F172A]/90 border border-white/10 p-3 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search services, keywords..."
            className="w-full rounded-lg bg-[#080D1A] border border-white/10 pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition"
          />
        </div>

        {/* Dropdowns & Filters Button */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Categories Dropdown */}
          <div className="relative flex-1 sm:flex-none">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full sm:w-36 rounded-lg bg-[#080D1A] border border-white/10 px-3 py-1.5 text-xs text-slate-300 appearance-none focus:outline-none focus:border-orange-500 transition cursor-pointer"
            >
              <option value="all">All Categories</option>
              <option value="HVAC">HVAC</option>
              <option value="Plumbing">Plumbing</option>
              <option value="Electrical">Electrical</option>
              <option value="Appliances">Appliances</option>
              <option value="General">General</option>
              <option value="Outdoor">Outdoor</option>
              <option value="Cleaning">Cleaning</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Status Dropdown */}
          <div className="relative flex-1 sm:flex-none">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full sm:w-32 rounded-lg bg-[#080D1A] border border-white/10 px-3 py-1.5 text-xs text-slate-300 appearance-none focus:outline-none focus:border-orange-500 transition cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Filters Button */}
          <button
            onClick={() => {
              setSearch("");
              setSelectedCategory("all");
              setSelectedStatus("all");
              toast.info("Filters reset to default");
            }}
            className="rounded-lg bg-[#080D1A] hover:bg-slate-800 border border-white/10 px-3 py-1.5 text-xs font-medium text-slate-300 flex items-center gap-1.5 transition"
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Services Table */}
      <div className="rounded-2xl bg-[#0F172A]/90 border border-white/10 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 bg-white/[0.02]">
                <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[11px]">Service</th>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[11px]">Category</th>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[11px]">Price</th>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[11px]">Duration</th>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[11px]">Required Skills</th>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[11px]">Status</th>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[11px] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredServices.map((svc) => {
                const Icon = svc.icon;
                return (
                  <tr
                    key={svc.id}
                    className="hover:bg-slate-800/40 transition group cursor-pointer"
                    onClick={() => toast.info(`Viewing details for ${svc.name}`)}
                  >
                    {/* Service Name & Icon */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${svc.iconBg} ${svc.iconColor} shadow-sm`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="font-bold text-white text-xs">{svc.name}</span>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4">
                      <span
                        className={`border text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${getCategoryBadgeClass(
                          svc.category
                        )}`}
                      >
                        {svc.category}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="py-3 px-4 text-white font-medium">{svc.price}</td>

                    {/* Duration */}
                    <td className="py-3 px-4 text-slate-300">{svc.duration}</td>

                    {/* Required Skills */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 text-slate-300 text-[11px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                        <span>{svc.skills.join(", ")}</span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      <span className="border border-emerald-500/30 bg-emerald-500/15 text-emerald-400 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                        {svc.status}
                      </span>
                    </td>

                    {/* Actions Menu */}
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toast.info(`Options for ${svc.name}`);
                        }}
                        className="p-1 text-slate-400 hover:text-white transition"
                        title="Options"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Service Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="rounded-2xl bg-[#0F172A] border border-white/10 p-5 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h3 className="text-sm font-bold text-white">Add New Service</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddService} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300">Service Name *</label>
                <input
                  type="text"
                  required
                  value={newServiceName}
                  onChange={(e) => setNewServiceName(e.target.value)}
                  placeholder="e.g. Furnace Inspection"
                  className="w-full rounded-lg bg-[#080D1A] border border-white/10 p-2 text-xs text-white mt-1"
                />
              </div>

              <div>
                <label className="text-slate-300">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full rounded-lg bg-[#080D1A] border border-white/10 p-2 text-xs text-white mt-1"
                >
                  <option value="HVAC">HVAC</option>
                  <option value="Plumbing">Plumbing</option>
                  <option value="Electrical">Electrical</option>
                  <option value="Appliances">Appliances</option>
                  <option value="General">General</option>
                  <option value="Outdoor">Outdoor</option>
                  <option value="Cleaning">Cleaning</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="w-full rounded-lg bg-[#080D1A] border border-white/10 p-2 text-xs text-white mt-1"
                  />
                </div>
                <div>
                  <label className="text-slate-300">Duration</label>
                  <input
                    type="text"
                    value={newDuration}
                    onChange={(e) => setNewDuration(e.target.value)}
                    placeholder="2 hrs"
                    className="w-full rounded-lg bg-[#080D1A] border border-white/10 p-2 text-xs text-white mt-1"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300">Required Skills (comma separated)</label>
                <input
                  type="text"
                  value={newSkills}
                  onChange={(e) => setNewSkills(e.target.value)}
                  placeholder="HVAC, Diagnostics"
                  className="w-full rounded-lg bg-[#080D1A] border border-white/10 p-2 text-xs text-white mt-1"
                />
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
                  Create Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
