/* eslint-disable @next/next/no-img-element */
"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Wrench,
  Plus,
  Download,
  Search,
  Filter,
  Phone,
  Mail,
  ChevronDown,
  Star,
  MessageSquare,
  PhoneCall,
  MoreHorizontal,
  User,
  Users,
  ShieldCheck,
  Pause,
  AlertTriangle,
  Truck,
  CheckCircle2,
  Calendar,
  X,
} from "lucide-react";
import { toast } from "sonner";

interface TechDirectoryItem {
  id: string;
  name: string;
  empId: string;
  avatar: string;
  specialization: "HVAC" | "Plumbing" | "Electrical" | "Appliances" | "Cleaning" | "General";
  phone: string;
  email: string;
  address: string;
  availability: "On Job" | "Available" | "En Route" | "On Leave" | "Off Duty";
  availabilityColor: string;
  currentJob: string;
  vehicle: string;
  rating: number;
  reviewsCount: number;
  completedJobs: number;
  onTimeRate: string;
  skills: string[];
}

const TECHNICIANS_DATA: TechDirectoryItem[] = [
  {
    id: "tech-carlos",
    name: "Robert Caldwell",
    empId: "#T1047",
    avatar: "/images/avatar-david.jpg",
    specialization: "HVAC",
    phone: "(555) 010-7842",
    email: "robert@servicepro.com",
    address: "Miami, FL · 123 Ocean Dr.",
    availability: "On Job",
    availabilityColor: "bg-emerald-400",
    currentJob: "WO-8428 - AC Repair, ETA: 30 mins",
    vehicle: "MH-12-AB-1234 Ford Transit",
    rating: 4.8,
    reviewsCount: 156,
    completedJobs: 156,
    onTimeRate: "95%",
    skills: ["HVAC", "Electrical", "Plumbing", "EPA Certified"],
  },
  {
    id: "tech-maria",
    name: "Maria Alvarez",
    empId: "#T1048",
    avatar: "/images/avatar-sarah.jpg",
    specialization: "Plumbing",
    phone: "(555) 010-6723",
    email: "maria@servicepro.com",
    address: "Miami Beach, FL · 450 Collins Ave.",
    availability: "Available",
    availabilityColor: "bg-teal-400",
    currentJob: "No assignment",
    vehicle: "MH-12-CD-5678 Ford Transit",
    rating: 4.7,
    reviewsCount: 142,
    completedJobs: 142,
    onTimeRate: "97%",
    skills: ["Plumbing", "Water Heaters", "Pipe Fitting"],
  },
  {
    id: "tech-danny",
    name: "Danny Reyes",
    empId: "#T1049",
    avatar: "/images/avatar-mike.jpg",
    specialization: "Electrical",
    phone: "(555) 010-5567",
    email: "danny@servicepro.com",
    address: "Coral Gables, FL · 800 Ponce de Leon",
    availability: "En Route",
    availabilityColor: "bg-blue-400",
    currentJob: "#1052 - Electrical Repair, ETA: 15 mins",
    vehicle: "MH-12-EF-9012 Chevrolet Van",
    rating: 4.6,
    reviewsCount: 98,
    completedJobs: 98,
    onTimeRate: "93%",
    skills: ["Electrical", "Panel Upgrades", "Safety"],
  },
  {
    id: "tech-sarah",
    name: "Sarah Mitchell",
    empId: "#T1050",
    avatar: "/images/avatar-sarah.jpg",
    specialization: "HVAC",
    phone: "(555) 010-4433",
    email: "sarah@servicepro.com",
    address: "Brickell, FL · 1000 Brickell Ave.",
    availability: "On Leave",
    availabilityColor: "bg-purple-400",
    currentJob: "No assignment",
    vehicle: "MH-12-GH-3456 Ford Transit",
    rating: 4.9,
    reviewsCount: 176,
    completedJobs: 176,
    onTimeRate: "98%",
    skills: ["HVAC", "Heat Pumps", "Diagnostics"],
  },
  {
    id: "tech-michael",
    name: "Michael Johnson",
    empId: "#T1051",
    avatar: "/images/avatar-1.jpg",
    specialization: "Appliances",
    phone: "(555) 010-2211",
    email: "michael@servicepro.com",
    address: "Hialeah, FL · 400 W 49th St.",
    availability: "Available",
    availabilityColor: "bg-teal-400",
    currentJob: "No assignment",
    vehicle: "MH-12-JK-7890 Ram ProMaster",
    rating: 4.5,
    reviewsCount: 87,
    completedJobs: 87,
    onTimeRate: "91%",
    skills: ["Appliances", "Refrigeration", "Motors"],
  },
  {
    id: "tech-jessica",
    name: "Jessica Lee",
    empId: "#T1052",
    avatar: "/images/avatar-2.jpg",
    specialization: "Cleaning",
    phone: "(555) 010-1188",
    email: "jessica@servicepro.com",
    address: "Downtown Miami, FL · 200 Biscayne Blvd.",
    availability: "Off Duty",
    availabilityColor: "bg-slate-500",
    currentJob: "No assignment",
    vehicle: "MH-12-LM-2345 Nissan NV200",
    rating: 4.3,
    reviewsCount: 64,
    completedJobs: 64,
    onTimeRate: "94%",
    skills: ["Cleaning", "Sanitization", "Air Quality"],
  },
  {
    id: "tech-david",
    name: "David Kim",
    empId: "#T1053",
    avatar: "/images/avatar-3.jpg",
    specialization: "General",
    phone: "(555) 010-6677",
    email: "david@servicepro.com",
    address: "Weston, FL · 1500 Weston Rd.",
    availability: "On Job",
    availabilityColor: "bg-emerald-400",
    currentJob: "#1055 - Duct Cleaning, ETA: 45 mins",
    vehicle: "MH-12-NP-6789 Ford Transit",
    rating: 4.7,
    reviewsCount: 93,
    completedJobs: 93,
    onTimeRate: "96%",
    skills: ["General Maintenance", "Drywall", "Roofing"],
  },
];

export default function AdminTechniciansPage() {
  const router = useRouter();
  const [technicians, setTechnicians] = React.useState<TechDirectoryItem[]>(TECHNICIANS_DATA);
  const [selectedTech, setSelectedTech] = React.useState<TechDirectoryItem>(TECHNICIANS_DATA[0]);

  // Filters
  const [search, setSearch] = React.useState("");
  const [skillFilter, setSkillFilter] = React.useState("all");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [locationFilter, setLocationFilter] = React.useState("all");
  const [sortBy, setSortBy] = React.useState("Name");

  // Add Tech Modal
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [newName, setNewName] = React.useState("");
  const [newSpecialization, setNewSpecialization] = React.useState<TechDirectoryItem["specialization"]>("HVAC");
  const [newPhone, setNewPhone] = React.useState("");
  const [newEmail, setNewEmail] = React.useState("");

  // Top 5 KPI Metrics matching reference image
  const kpis = [
    {
      title: "Total Technicians",
      value: "24",
      subtext: "↑ 2 new this month",
      subtextColor: "text-emerald-400",
      icon: Users,
      iconColor: "text-blue-400",
      iconBg: "bg-blue-500/15 border-blue-500/30",
    },
    {
      title: "Active Technicians",
      value: "18",
      subtext: "75% of total",
      subtextColor: "text-slate-400",
      icon: ShieldCheck,
      iconColor: "text-emerald-400",
      iconBg: "bg-emerald-500/15 border-emerald-500/30",
    },
    {
      title: "Available Now",
      value: "8",
      subtext: "33% of total",
      subtextColor: "text-slate-400",
      icon: User,
      iconColor: "text-teal-400",
      iconBg: "bg-teal-500/15 border-teal-500/30",
    },
    {
      title: "On Job",
      value: "10",
      subtext: "42% of total",
      subtextColor: "text-slate-400",
      icon: Wrench,
      iconColor: "text-rose-400",
      iconBg: "bg-rose-500/15 border-rose-500/30",
    },
    {
      title: "On Leave",
      value: "3",
      subtext: "12% of total",
      subtextColor: "text-slate-400",
      icon: Pause,
      iconColor: "text-purple-400",
      iconBg: "bg-purple-500/15 border-purple-500/30",
    },
  ];

  // Filtered Techs
  const filteredTechs = React.useMemo(() => {
    return technicians.filter((tech) => {
      const matchSearch =
        search === "" ||
        tech.name.toLowerCase().includes(search.toLowerCase()) ||
        tech.empId.toLowerCase().includes(search.toLowerCase()) ||
        tech.phone.includes(search) ||
        tech.specialization.toLowerCase().includes(search.toLowerCase());

      const matchSkill = skillFilter === "all" || tech.specialization === skillFilter;
      const matchStatus = statusFilter === "all" || tech.availability === statusFilter;

      return matchSearch && matchSkill && matchStatus;
    });
  }, [technicians, search, skillFilter, statusFilter]);

  // Handle Add Technician
  const handleAddTech = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName) {
      toast.error("Please enter technician name");
      return;
    }

    const newTech: TechDirectoryItem = {
      id: `tech-${Date.now()}`,
      name: newName,
      empId: `#T${1050 + technicians.length}`,
      avatar: "/images/avatar-david.jpg",
      specialization: newSpecialization,
      phone: newPhone || "(555) 010-9900",
      email: newEmail || `${newName.toLowerCase().replace(/\s+/g, ".")}@servicepro.com`,
      address: "Miami, FL",
      availability: "Available",
      availabilityColor: "bg-teal-400",
      currentJob: "No assignment",
      vehicle: "MH-12-NEW-01 Ford Transit",
      rating: 5.0,
      reviewsCount: 1,
      completedJobs: 0,
      onTimeRate: "100%",
      skills: [newSpecialization, "Safety"],
    };

    setTechnicians([newTech, ...technicians]);
    setSelectedTech(newTech);
    setShowAddModal(false);
    setNewName("");
    toast.success(`Technician ${newTech.name} added to roster!`);
  };

  const getSpecializationBadgeClass = (spec: TechDirectoryItem["specialization"]) => {
    switch (spec) {
      case "HVAC":
        return "bg-indigo-500/20 text-indigo-400 border-indigo-500/30";
      case "Plumbing":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "Electrical":
        return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      case "Appliances":
        return "bg-cyan-500/20 text-cyan-400 border-cyan-500/30";
      case "Cleaning":
        return "bg-teal-500/20 text-teal-400 border-teal-500/30";
      case "General":
      default:
        return "bg-purple-500/20 text-purple-400 border-purple-500/30";
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white p-4 lg:p-6 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Technicians Directory</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Manage your technician workforce, skills, availability, vehicles and assignments.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="rounded-lg bg-[#F97316] hover:bg-[#EA580C] text-white px-4 py-2 text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-orange-500/20 active:scale-95 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add Technician</span>
          </button>

          <button
            onClick={() => toast.success("Exporting technicians directory CSV...")}
            className="rounded-lg bg-slate-800 hover:bg-slate-700 border border-white/10 text-slate-300 px-3.5 py-2 text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Top 5 KPI Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className="rounded-xl bg-[#0F172A]/90 border border-white/10 p-3.5 flex flex-col justify-between shadow-md"
            >
              <div className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center border shrink-0 ${kpi.iconBg} ${kpi.iconColor}`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-medium text-slate-300 truncate">{kpi.title}</span>
              </div>

              <div className="mt-2.5">
                <div className="text-2xl font-bold text-white tracking-tight">{kpi.value}</div>
                <div className={`text-xs font-medium mt-0.5 ${kpi.subtextColor}`}>
                  {kpi.subtext}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Workspace Split: Table Area (Left 75%) + Quick Inspector (Right 25%) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-start">
        {/* LEFT / CENTER TABLE AREA */}
        <div className="xl:col-span-9 space-y-3">
          {/* Filter Toolbar */}
          <div className="rounded-xl bg-[#0F172A]/90 border border-white/10 p-3 flex flex-wrap items-center justify-between gap-2.5 shadow-md">
            {/* Search */}
            <div className="relative flex-1 min-w-[220px]">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search technicians by name, skill, or location..."
                className="w-full rounded-lg bg-[#080D1A] border border-white/10 pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition"
              />
            </div>

            {/* Filter Dropdowns */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Skills */}
              <div className="relative">
                <select
                  value={skillFilter}
                  onChange={(e) => setSkillFilter(e.target.value)}
                  className="rounded-lg bg-[#080D1A] border border-white/10 px-3 py-1.5 text-xs text-slate-300 appearance-none pr-7 focus:outline-none focus:border-orange-500 transition cursor-pointer"
                >
                  <option value="all">All Skills</option>
                  <option value="HVAC">HVAC</option>
                  <option value="Plumbing">Plumbing</option>
                  <option value="Electrical">Electrical</option>
                  <option value="Appliances">Appliances</option>
                  <option value="Cleaning">Cleaning</option>
                  <option value="General">General</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Status */}
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="rounded-lg bg-[#080D1A] border border-white/10 px-3 py-1.5 text-xs text-slate-300 appearance-none pr-7 focus:outline-none focus:border-orange-500 transition cursor-pointer"
                >
                  <option value="all">All Status</option>
                  <option value="Available">Available</option>
                  <option value="On Job">On Job</option>
                  <option value="En Route">En Route</option>
                  <option value="On Leave">On Leave</option>
                  <option value="Off Duty">Off Duty</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Locations */}
              <div className="relative">
                <select
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="rounded-lg bg-[#080D1A] border border-white/10 px-3 py-1.5 text-xs text-slate-300 appearance-none pr-7 focus:outline-none focus:border-orange-500 transition cursor-pointer"
                >
                  <option value="all">All Locations</option>
                  <option value="Miami">Miami</option>
                  <option value="Miami Beach">Miami Beach</option>
                  <option value="Coral Gables">Coral Gables</option>
                  <option value="Brickell">Brickell</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Sort By */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="rounded-lg bg-[#080D1A] border border-white/10 px-3 py-1.5 text-xs text-slate-300 appearance-none pr-7 focus:outline-none focus:border-orange-500 transition cursor-pointer"
                >
                  <option value="Name">Sort by: Name</option>
                  <option value="Rating">Sort by: Rating</option>
                  <option value="Completed">Sort by: Jobs</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Reset Filter Button */}
              <button
                onClick={() => {
                  setSearch("");
                  setSkillFilter("all");
                  setStatusFilter("all");
                  setLocationFilter("all");
                  toast.info("Filters reset");
                }}
                className="rounded-lg bg-[#080D1A] hover:bg-slate-800 border border-white/10 px-3 py-1.5 text-xs font-medium text-slate-300 flex items-center gap-1 transition"
              >
                <Filter className="w-3 h-3" />
                <span>Filter</span>
              </button>
            </div>
          </div>

          {/* Table Container */}
          <div className="rounded-2xl bg-[#0F172A]/90 border border-white/10 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400 bg-white/[0.02]">
                    <th className="py-3 px-3 w-8">
                      <input type="checkbox" className="rounded border-white/20 bg-slate-900" />
                    </th>
                    <th className="py-3 px-3 font-semibold uppercase tracking-wider text-[11px]">Technician</th>
                    <th className="py-3 px-3 font-semibold uppercase tracking-wider text-[11px]">Specialization</th>
                    <th className="py-3 px-3 font-semibold uppercase tracking-wider text-[11px]">Contact</th>
                    <th className="py-3 px-3 font-semibold uppercase tracking-wider text-[11px]">Availability</th>
                    <th className="py-3 px-3 font-semibold uppercase tracking-wider text-[11px]">Current Job</th>
                    <th className="py-3 px-3 font-semibold uppercase tracking-wider text-[11px]">Vehicle</th>
                    <th className="py-3 px-3 font-semibold uppercase tracking-wider text-[11px]">Performance</th>
                    <th className="py-3 px-3 font-semibold uppercase tracking-wider text-[11px] text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredTechs.map((tech) => {
                    const isSelected = selectedTech.id === tech.id;
                    return (
                      <tr
                        key={tech.id}
                        onClick={() => setSelectedTech(tech)}
                        className={`transition cursor-pointer ${
                          isSelected
                            ? "bg-slate-800/80 ring-1 ring-white/10"
                            : "hover:bg-slate-800/40"
                        }`}
                      >
                        {/* Checkbox */}
                        <td className="py-3 px-3" onClick={(e) => e.stopPropagation()}>
                          <input type="checkbox" className="rounded border-white/20 bg-slate-900" />
                        </td>

                        {/* Technician Avatar, Name & Emp ID */}
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2.5">
                            <div className="relative w-8 h-8 rounded-full overflow-hidden border border-white/20 shrink-0 bg-slate-800">
                              <img
                                src={tech.avatar}
                                alt={tech.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <div className="font-bold text-white leading-tight">{tech.name}</div>
                              <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                                {tech.empId}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Specialization */}
                        <td className="py-3 px-3">
                          <span
                            className={`border text-[10px] font-semibold px-2 py-0.5 rounded ${getSpecializationBadgeClass(
                              tech.specialization
                            )}`}
                          >
                            {tech.specialization}
                          </span>
                        </td>

                        {/* Contact */}
                        <td className="py-3 px-3">
                          <div className="text-white text-[11px] font-medium leading-tight">
                            {tech.phone}
                          </div>
                          <div className="text-slate-400 text-[10px] mt-0.5 truncate">
                            {tech.email}
                          </div>
                        </td>

                        {/* Availability */}
                        <td className="py-3 px-3">
                          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-800/80 border border-white/10 text-[11px] font-medium text-slate-200">
                            <span className={`w-1.5 h-1.5 rounded-full ${tech.availabilityColor}`} />
                            <span>{tech.availability}</span>
                          </div>
                        </td>

                        {/* Current Job */}
                        <td className="py-3 px-3">
                          <div className="text-[11px] text-slate-200 max-w-[170px] truncate leading-tight">
                            {tech.currentJob}
                          </div>
                        </td>

                        {/* Vehicle */}
                        <td className="py-3 px-3">
                          <div className="text-[11px] text-slate-300 max-w-[150px] truncate">
                            {tech.vehicle}
                          </div>
                        </td>

                        {/* Performance */}
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-1 font-bold text-amber-400 text-[11px]">
                            <span>{tech.rating}</span>
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            <span className="text-slate-400 font-normal text-[10px]">
                              ({tech.reviewsCount})
                            </span>
                          </div>
                        </td>

                        {/* Actions (Message, Call, Menu) */}
                        <td className="py-3 px-3 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => toast.success(`SMS dispatched to ${tech.name}`)}
                              className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                              title="Message"
                            >
                              <MessageSquare className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => toast.info(`Dialing ${tech.name} (${tech.phone})...`)}
                              className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                              title="Call"
                            >
                              <PhoneCall className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => toast.info(`Options for ${tech.name}`)}
                              className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                              title="More"
                            >
                              <MoreHorizontal className="w-3 h-3" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <div className="p-3 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
              <div>Showing 1 to 7 of 24 technicians</div>
              <div className="flex items-center gap-1">
                <button className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300">
                  &lt;
                </button>
                <button className="px-2.5 py-1 rounded bg-[#F97316] text-white font-bold">1</button>
                <button className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300">2</button>
                <button className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300">3</button>
                <button className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300">4</button>
                <button className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300">5</button>
                <span className="px-1 text-slate-500">...</span>
                <button className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300">10</button>
                <button className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300">
                  &gt;
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Selected Technician Quick Inspector Panel */}
        <div className="xl:col-span-3 rounded-2xl bg-[#0F172A]/90 border border-white/10 p-4 space-y-4 shadow-xl">
          {/* Header Card */}
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-full overflow-hidden border border-white/20 shrink-0 bg-slate-800">
              <img
                src={selectedTech.avatar}
                alt={selectedTech.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white truncate">{selectedTech.name}</h3>
                <span className="border border-emerald-500/30 bg-emerald-500/15 text-emerald-400 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                  {selectedTech.availability}
                </span>
              </div>
              <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                {selectedTech.empId}
              </div>
              <div className="flex items-center gap-1 text-[11px] text-amber-400 font-medium mt-0.5">
                <Star className="w-3 h-3 fill-amber-400" />
                <span>{selectedTech.rating} ({selectedTech.reviewsCount} reviews)</span>
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="space-y-1.5 text-xs text-slate-300 pt-2 border-t border-white/10">
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span>{selectedTech.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span className="truncate">{selectedTech.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3.5 text-center text-slate-500">📍</span>
              <span className="truncate">{selectedTech.address}</span>
            </div>
          </div>

          {/* Skills & Certifications */}
          <div className="pt-2 border-t border-white/10 space-y-1.5">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Skills &amp; Certifications
            </div>
            <div className="flex flex-wrap gap-1.5">
              {selectedTech.skills.map((skill, i) => (
                <span
                  key={i}
                  className="rounded bg-slate-800 border border-white/10 text-slate-300 text-[10px] px-2 py-0.5"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Current Assignment */}
          <div className="pt-2 border-t border-white/10 space-y-1.5">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Current Assignment
            </div>
            <div className="rounded-lg bg-[#080D1A] border border-white/5 p-2.5 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">{selectedTech.currentJob.split(",")[0]}</span>
                <span className="border border-blue-500/30 bg-blue-500/15 text-blue-400 text-[10px] font-semibold px-2 py-0.5 rounded">
                  In Progress
                </span>
              </div>
              <div className="text-[11px] text-slate-400">Miami, FL · 9:30 AM - 11:00 AM</div>
            </div>
          </div>

          {/* Vehicle */}
          <div className="pt-2 border-t border-white/10 space-y-1.5">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Vehicle
            </div>
            <div className="rounded-lg bg-[#080D1A] border border-white/5 p-2 flex items-center gap-2 text-xs text-slate-200">
              <Truck className="w-4 h-4 text-orange-400 shrink-0" />
              <span className="truncate">{selectedTech.vehicle}</span>
            </div>
          </div>

          {/* Performance 3 Metrics */}
          <div className="pt-2 border-t border-white/10 space-y-1.5">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Performance
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="rounded-lg bg-[#080D1A] border border-white/5 p-2">
                <div className="text-[10px] text-slate-400">Completed</div>
                <div className="text-xs font-bold text-white mt-0.5">{selectedTech.completedJobs}</div>
              </div>
              <div className="rounded-lg bg-[#080D1A] border border-white/5 p-2">
                <div className="text-[10px] text-slate-400">Avg. Rating</div>
                <div className="text-xs font-bold text-amber-400 mt-0.5">{selectedTech.rating} ★</div>
              </div>
              <div className="rounded-lg bg-[#080D1A] border border-white/5 p-2">
                <div className="text-[10px] text-slate-400">On-Time</div>
                <div className="text-xs font-bold text-emerald-400 mt-0.5">{selectedTech.onTimeRate}</div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-white/10 space-y-2">
            <Link
              href={`/admin/technicians/${selectedTech.id}`}
              className="w-full rounded-lg bg-slate-800 hover:bg-slate-700 border border-white/10 text-slate-200 py-2 text-xs font-semibold flex items-center justify-center transition"
            >
              View Full Profile
            </Link>

            <button
              onClick={() => toast.info(`Dialing ${selectedTech.name}...`)}
              className="w-full rounded-lg bg-[#059669] hover:bg-[#047857] text-white py-2 text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 transition active:scale-95"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Contact</span>
            </button>
          </div>
        </div>
      </div>

      {/* Add Technician Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="rounded-2xl bg-[#0F172A] border border-white/10 p-5 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h3 className="text-sm font-bold text-white">Add New Technician</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddTech} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300">Full Name *</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Jason Scott"
                  className="w-full rounded-lg bg-[#080D1A] border border-white/10 p-2 text-xs text-white mt-1"
                />
              </div>

              <div>
                <label className="text-slate-300">Specialization</label>
                <select
                  value={newSpecialization}
                  onChange={(e) => setNewSpecialization(e.target.value as any)}
                  className="w-full rounded-lg bg-[#080D1A] border border-white/10 p-2 text-xs text-white mt-1"
                >
                  <option value="HVAC">HVAC</option>
                  <option value="Plumbing">Plumbing</option>
                  <option value="Electrical">Electrical</option>
                  <option value="Appliances">Appliances</option>
                  <option value="Cleaning">Cleaning</option>
                  <option value="General">General</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300">Phone</label>
                <input
                  type="text"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="(555) 010-8822"
                  className="w-full rounded-lg bg-[#080D1A] border border-white/10 p-2 text-xs text-white mt-1"
                />
              </div>

              <div>
                <label className="text-slate-300">Email</label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="jason@servicepro.com"
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
                  Add Technician
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
