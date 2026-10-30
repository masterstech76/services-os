"use client";

import * as React from "react";
import Link from "next/link";
import {
  User,
  Truck,
  ShieldCheck,
  Star,
  Clock,
  Phone,
  Mail,
  Award,
  Package,
  Wrench,
  CheckCircle2,
  Save,
  LogOut,
  Calendar,
  Edit,
  X,
  MapPin,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface TechProfileData {
  id: string;
  name: string;
  email: string | null;
  phone: string;
  emergencyPhone?: string;
  bio?: string;
  territory?: string;
  role: string;
  color: string;
  certifications: string[];
  vehicle: {
    model: string;
    plate: string;
    status: string;
  };
  shift: {
    currentRoster: string;
    onCallWeekend: string;
    standbyStatus: string;
  };
  stats: {
    completedCount: number;
    inProgressCount: number;
    scheduledCount: number;
    customerRating: number;
    totalReviews: number;
    onTimeRate: string;
    vanPartsInTruck: number;
  };
}

const AVAILABLE_CERTS = [
  "EPA Universal 608 Certified",
  "NATE Core & Heat Pump Specialist",
  "Florida State Certified Mechanical Contractor (CMC)",
  "OSHA 30-Hour Construction Safety",
  "R-410A Safety & Recovery Certified",
  "Duct IAQ & Airflow Balancing Verified",
];

const DEFAULT_TECH_PROFILE: TechProfileData = {
  id: "",
  name: "",
  email: "",
  phone: "",
  emergencyPhone: "",
  bio: "Master HVAC Specialist with over 12 years of hands-on diagnostic and mechanical troubleshooting experience in South Florida. Expert in high-efficiency variable-speed inverters, emergency heat pumps, and duct balancing.",
  territory: "Miami-Dade & Brickell / Downtown Corridor",
  role: "Lead Master HVAC Technician",
  color: "#F97316",
  certifications: [
    "EPA Universal 608 Certified",
    "NATE Core & Heat Pump Specialist",
    "Florida State Certified Mechanical Contractor (CMC)",
    "OSHA 30-Hour Construction Safety",
  ],
  vehicle: {
    model: "Ford Transit 250 High Roof (Fleet Unit Alpha)",
    plate: "FL #FL-HVAC1",
    status: "Inspected & Stocked",
  },
  shift: {
    currentRoster: "Monday - Friday (07:00 AM - 04:30 PM)",
    onCallWeekend: "Every 3rd Weekend (24/7 Priority Hotline)",
    standbyStatus: "Active On-Duty",
  },
  stats: {
    completedCount: 318,
    inProgressCount: 1,
    scheduledCount: 4,
    customerRating: 4.98,
    totalReviews: 247,
    onTimeRate: "99.2%",
    vanPartsInTruck: 48,
  },
};

export default function TechProfilePage() {
  const [profile, setProfile] = React.useState<TechProfileData | null>(DEFAULT_TECH_PROFILE);
  const [phone, setPhone] = React.useState(DEFAULT_TECH_PROFILE.phone);
  const [loading, setLoading] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [liveStatus, setLiveStatus] = React.useState<"available" | "busy_coming_soon" | "off_duty">("available");
  const [liveNote, setLiveNote] = React.useState("On Duty · Brickell & Downtown · Ready for immediate dispatch");
  const [isBroadcasting, setIsBroadcasting] = React.useState(false);

  // Edit Profile Modal State
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [editName, setEditName] = React.useState("");
  const [editEmail, setEditEmail] = React.useState("");
  const [editPhone, setEditPhone] = React.useState("");
  const [editEmergencyPhone, setEditEmergencyPhone] = React.useState("");
  const [editBio, setEditBio] = React.useState("");
  const [editVehicleModel, setEditVehicleModel] = React.useState("");
  const [editVehiclePlate, setEditVehiclePlate] = React.useState("");
  const [editTerritory, setEditTerritory] = React.useState("");
  const [editCerts, setEditCerts] = React.useState<string[]>([]);

  const handleBroadcastStatus = () => {
    setIsBroadcasting(true);
    setTimeout(() => {
      try {
        const stored = localStorage.getItem("servicepro_services_catalog_v2");
        const catalog = stored ? JSON.parse(stored) : null;
        if (catalog) {
          Object.keys(catalog).forEach((slug) => {
            catalog[slug].assignedTechnicians = catalog[slug].assignedTechnicians.map((t: any) => {
              if (t.id === "carlos-mendez") {
                return {
                  ...t,
                  status: liveStatus === "off_duty" ? "busy_coming_soon" : liveStatus,
                  statusNote: liveNote,
                };
              }
              return t;
            });
          });
          localStorage.setItem("servicepro_services_catalog_v2", JSON.stringify(catalog));
        }
        toast.success("Broadcasted status update to all customer service pages!");
      } catch {
        toast.error("Could not sync broadcast.");
      }
      setIsBroadcasting(false);
    }, 600);
  };

  const loadProfile = React.useCallback(async () => {
    const defaultProfile = DEFAULT_TECH_PROFILE;
    try {
      // Check localStorage first for persisted edits
      const stored = localStorage.getItem("servicepro_carlos_profile");
      if (stored) {
        const parsed = JSON.parse(stored);
        setProfile(parsed);
        setPhone(parsed.phone);
        initEditState(parsed);
      } else {
        setProfile(defaultProfile);
        setPhone(defaultProfile.phone);
        initEditState(defaultProfile);
      }
    } catch {
      setProfile(defaultProfile);
      setPhone(defaultProfile.phone);
      initEditState(defaultProfile);
    } finally {
      setLoading(false);
    }
  }, []);

  function initEditState(data: TechProfileData) {
    setEditName(data.name);
    setEditEmail(data.email || "carlos@servicepro-os.com");
    setEditPhone(data.phone);
    setEditEmergencyPhone(data.emergencyPhone || "(XXX) XXX-XXXX");
    setEditBio(data.bio || "");
    setEditVehicleModel(data.vehicle.model);
    setEditVehiclePlate(data.vehicle.plate);
    setEditTerritory(data.territory || "Miami-Dade & Brickell Corridor");
    setEditCerts(data.certifications);
  }

  React.useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleSaveContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);
    try {
      const updated = { ...profile, phone };
      setProfile(updated);
      localStorage.setItem("servicepro_carlos_profile", JSON.stringify(updated));
      toast.success("Direct contact phone number saved!");
    } catch {
      toast.error("Could not update contact phone.");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveFullProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);

    setTimeout(() => {
      const updated: TechProfileData = {
        ...profile,
        name: editName.trim() || profile.name,
        email: editEmail.trim() || profile.email,
        phone: editPhone.trim() || profile.phone,
        emergencyPhone: editEmergencyPhone.trim(),
        bio: editBio.trim(),
        territory: editTerritory.trim(),
        certifications: editCerts.length > 0 ? editCerts : profile.certifications,
        vehicle: {
          ...profile.vehicle,
          model: editVehicleModel.trim() || profile.vehicle.model,
          plate: editVehiclePlate.trim() || profile.vehicle.plate,
        },
      };

      setProfile(updated);
      setPhone(updated.phone);
      localStorage.setItem("servicepro_carlos_profile", JSON.stringify(updated));
      setSaving(false);
      setIsEditModalOpen(false);
      toast.success("Technician Profile updated successfully!");
    }, 400);
  };

  const toggleCert = (cert: string) => {
    if (editCerts.includes(cert)) {
      setEditCerts(editCerts.filter((c) => c !== cert));
    } else {
      setEditCerts([...editCerts, cert]);
    }
  };

  if (loading || !profile) {
    return (
      <div className="space-y-4">
        <div className="h-32 animate-pulse rounded-2xl bg-white/5 border border-white/5" />
        <div className="h-44 animate-pulse rounded-2xl bg-white/5 border border-white/5" />
        <div className="h-44 animate-pulse rounded-2xl bg-white/5 border border-white/5" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* ─────────────────────────────────────────────────────────────
          PROFILE HEADER CARD (With Edit Profile Trigger)
      ───────────────────────────────────────────────────────────── */}
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0F172A]/85 backdrop-blur-xl shadow-xl">
        <div className="h-20 bg-gradient-to-r from-orange-500/20 via-orange-600/10 to-transparent p-4 border-b border-white/10" />
        <div className="relative px-4 pb-4 pt-0">
          <div className="-mt-10 mb-3 flex items-end justify-between">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-[#0F172A] bg-[#080D16] text-orange-400 shadow-xl overflow-hidden font-black text-2xl">
              CM
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 text-xs font-bold text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                {profile.shift.standbyStatus}
              </span>

              {/* Edit Profile Button */}
              <Link
                href="/tech/profile/edit"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-orange-500/15 hover:bg-orange-500/25 border border-orange-500/30 text-[#F97316] text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </Link>
            </div>
          </div>

          <h1 className="text-xl font-bold text-white tracking-tight">{profile.name}</h1>
          <p className="text-xs font-semibold text-orange-400 uppercase tracking-wider mt-0.5">
            {profile.role} &bull; {profile.territory}
          </p>

          <p className="text-xs text-slate-300 mt-2 leading-relaxed max-w-3xl">
            {profile.bio}
          </p>

          <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-300">
            <span className="flex items-center gap-1.5 rounded-xl bg-white/5 border border-white/5 px-3 py-1.5">
              <Mail className="h-3.5 w-3.5 text-slate-400" />
              {profile.email || "carlos.mendez@servicepro-os.com"}
            </span>
            <span className="flex items-center gap-1.5 rounded-xl bg-white/5 border border-white/5 px-3 py-1.5">
              <Phone className="h-3.5 w-3.5 text-slate-400" />
              {profile.phone}
            </span>
            <span className="flex items-center gap-1.5 rounded-xl bg-white/5 border border-white/5 px-3 py-1.5">
              <Truck className="h-3.5 w-3.5 text-slate-400" />
              {profile.vehicle.model} ({profile.vehicle.plate})
            </span>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          EDIT PROFILE MODAL (Full Worker Dossier Editor)
      ───────────────────────────────────────────────────────────── */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#0B111E] border border-white/15 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden text-white max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20">
                  <Edit className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white">Edit Technician Profile</h3>
                  <p className="text-xs text-slate-400">Update your public field bio, credentials, van, and contact details</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="text-slate-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Close edit profile modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveFullProfile} className="space-y-4 overflow-y-auto pr-1 py-4 flex-1">
              {/* Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Full Name</label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:ring-2 focus:ring-[#F97316] outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Dispatch Email</label>
                  <input
                    type="email"
                    required
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:ring-2 focus:ring-[#F97316] outline-none"
                  />
                </div>
              </div>

              {/* Phone & Emergency Contact */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Mobile Phone</label>
                  <input
                    type="tel"
                    required
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:ring-2 focus:ring-[#F97316] outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Emergency Contact</label>
                  <input
                    type="tel"
                    value={editEmergencyPhone}
                    onChange={(e) => setEditEmergencyPhone(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:ring-2 focus:ring-[#F97316] outline-none"
                  />
                </div>
              </div>

              {/* Bio & Experience */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Professional Field Bio &amp; Summary</label>
                <textarea
                  rows={3}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:ring-2 focus:ring-[#F97316] outline-none leading-relaxed"
                  placeholder="Describe your HVAC experience, specialty trades, and customer commitment..."
                />
              </div>

              {/* Vehicle & Territory */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-300">Assigned Van / Truck</label>
                  <input
                    type="text"
                    value={editVehicleModel}
                    onChange={(e) => setEditVehicleModel(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:ring-2 focus:ring-[#F97316] outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">License Plate</label>
                  <input
                    type="text"
                    value={editVehiclePlate}
                    onChange={(e) => setEditVehiclePlate(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:ring-2 focus:ring-[#F97316] outline-none"
                  />
                </div>
              </div>

              {/* Working Territory */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Primary Dispatch Territory</label>
                <input
                  type="text"
                  value={editTerritory}
                  onChange={(e) => setEditTerritory(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:ring-2 focus:ring-[#F97316] outline-none"
                />
              </div>

              {/* Certifications Selection */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                <label className="text-xs font-bold text-slate-300 block">
                  Trade Certifications &amp; Licenses
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {AVAILABLE_CERTS.map((cert) => {
                    const isSelected = editCerts.includes(cert);
                    return (
                      <button
                        key={cert}
                        type="button"
                        onClick={() => toggleCert(cert)}
                        className={`p-2.5 rounded-xl border text-left text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                          isSelected
                            ? "bg-orange-500/15 border-orange-500/40 text-orange-200"
                            : "bg-white/5 border-white/10 text-slate-400 hover:text-white"
                        }`}
                      >
                        <span className="truncate pr-2">{cert}</span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-orange-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-slate-300 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <Button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-[#F97316] hover:bg-orange-600 text-[#0C1523] font-bold text-xs shadow-md shadow-orange-500/20 cursor-pointer"
                >
                  {saving ? "Saving Changes..." : "Save Profile Changes"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Performance Stats KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="rounded-2xl border border-white/10 bg-[#0F172A]/85 backdrop-blur-xl p-3.5 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Customer Rating
            </span>
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">{profile.stats.customerRating}</span>
            <span className="text-xs text-slate-400">/ 5.0 ({profile.stats.totalReviews} reviews)</span>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0F172A]/85 backdrop-blur-xl p-3.5 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Completed Work Orders
            </span>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">{profile.stats.completedCount}</span>
            <span className="text-xs text-emerald-400 font-semibold">{profile.stats.onTimeRate} On-Time</span>
          </div>
        </div>
      </div>

      {/* Broadcast Live Dispatch Status */}
      <div className="rounded-2xl border border-orange-500/30 bg-gradient-to-br from-orange-500/10 via-[#0F172A]/90 to-[#0F172A] backdrop-blur-xl p-4 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-orange-500/20 text-[#F97316]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                Live Public Service Status
              </h3>
              <p className="text-[11px] text-slate-400">
                Shown to homeowners browsing Emergency HVAC, AC Repair, and services pages.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleBroadcastStatus}
            disabled={isBroadcasting}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-[#0C1523] font-bold text-xs transition-all shadow-md active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            {isBroadcasting ? "Broadcasting..." : "Broadcast Status"}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => setLiveStatus("available")}
            className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
              liveStatus === "available"
                ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-300 ring-1 ring-emerald-500/50"
                : "bg-white/5 border-white/5 text-slate-400 hover:text-white"
            }`}
          >
            <div className="flex items-center gap-1.5 text-xs font-bold">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Available Now</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">Ready for instant dispatch in Brickell &amp; Downtown.</p>
          </button>

          <button
            type="button"
            onClick={() => setLiveStatus("busy_coming_soon")}
            className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
              liveStatus === "busy_coming_soon"
                ? "bg-amber-500/15 border-amber-500/40 text-amber-300 ring-1 ring-amber-500/50"
                : "bg-white/5 border-white/5 text-slate-400 hover:text-white"
            }`}
          >
            <div className="flex items-center gap-1.5 text-xs font-bold">
              <span className="h-2 w-2 rounded-full bg-amber-400" />
              <span>Wrapping Up Job</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">Free in approx 30-45 minutes.</p>
          </button>

          <button
            type="button"
            onClick={() => setLiveStatus("off_duty")}
            className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
              liveStatus === "off_duty"
                ? "bg-white/10 border-white/30 text-white ring-1 ring-white/40"
                : "bg-white/5 border-white/5 text-slate-400 hover:text-white"
            }`}
          >
            <div className="flex items-center gap-1.5 text-xs font-bold">
              <span className="h-2 w-2 rounded-full bg-slate-500" />
              <span>Off Shift / Standby</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">Will accept bookings for tomorrow.</p>
          </button>
        </div>
      </div>

      {/* Van & Hardware Inventory Status */}
      <div className="rounded-2xl border border-white/10 bg-[#0F172A]/85 backdrop-blur-xl p-4 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
            <Truck className="h-4 w-4 text-orange-400" />
            <span>Assigned Field Vehicle &amp; Inventory</span>
          </div>
          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            {profile.vehicle.status}
          </span>
        </div>

        <div className="rounded-xl bg-[#080D16] border border-white/5 p-3 space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-slate-400 font-semibold">Service Van:</span>
            <span className="font-bold text-white">{profile.vehicle.model}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400 font-semibold">Tag License:</span>
            <span className="font-mono text-orange-400">{profile.vehicle.plate}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400 font-semibold">Truck Parts Stocked:</span>
            <span className="font-bold text-white">{profile.stats.vanPartsInTruck} SKUs on board</span>
          </div>
          <div className="flex justify-between pt-1 border-t border-white/5">
            <span className="text-slate-400 font-semibold">Pre-Trip Safety Stamp:</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Passed 06:45 AM &bull; 42,810 mi &bull; Tires 42 PSI
            </span>
          </div>
        </div>
      </div>

      {/* Certifications Dossier */}
      <div className="rounded-2xl border border-white/10 bg-[#0F172A]/85 backdrop-blur-xl p-4 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
            <Award className="h-4 w-4 text-orange-400" />
            <span>Trade Certifications &amp; Licenses</span>
          </div>
          <span className="text-[10px] font-bold text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded-full border border-orange-500/20">
            {profile.certifications.length} Active
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {profile.certifications.map((cert, idx) => {
            const expText =
              cert.includes("EPA")
                ? "Permanent Universal"
                : cert.includes("NATE")
                ? "Valid thru Nov 2026"
                : cert.includes("CMC")
                ? "Valid thru Aug 2027"
                : "Active & Verified";

            return (
              <div
                key={idx}
                className="flex items-center justify-between gap-2 rounded-xl bg-[#080D16] border border-white/5 p-2.5 text-xs font-semibold text-white"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span className="truncate">{cert}</span>
                </div>
                <span className="text-[10px] text-slate-400 shrink-0 bg-white/5 px-2 py-0.5 rounded border border-white/5">
                  {expText}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Shift Roster */}
      <div className="rounded-2xl border border-white/10 bg-[#0F172A]/85 backdrop-blur-xl p-4 shadow-xl space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
          <Calendar className="h-4 w-4 text-orange-400" />
          <span>Shift Schedule &amp; On-Call Roster</span>
        </div>

        <div className="rounded-xl bg-[#080D16] border border-white/5 p-3 space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-slate-400 font-semibold">Regular Shift:</span>
            <span className="font-bold text-white">{profile.shift.currentRoster}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400 font-semibold">Weekend On-Call:</span>
            <span className="font-bold text-white">{profile.shift.onCallWeekend}</span>
          </div>
        </div>
      </div>

      {/* Direct Contact Phone */}
      <div className="rounded-2xl border border-white/10 bg-[#0F172A]/85 backdrop-blur-xl p-4 shadow-xl space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Dispatch Direct Contact Phone
        </h3>
        <form onSubmit={handleSaveContact} className="flex gap-2">
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="flex-1 rounded-xl border border-white/10 bg-[#080D16] px-3 py-2 text-xs text-white focus:border-orange-500 focus:outline-none"
            placeholder="(XXX) XXX-XXXX"
          />
          <Button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-[#F97316] hover:bg-orange-600 px-4 text-xs font-bold text-[#0C1523] shadow-lg shadow-orange-500/20 cursor-pointer"
          >
            {saving ? "Saving..." : "Update"}
          </Button>
        </form>
      </div>

      {/* Customer Reviews */}
      <div className="rounded-2xl border border-white/10 bg-[#0F172A]/85 backdrop-blur-xl p-4 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
            <Star className="h-4 w-4 text-orange-400 fill-orange-400" />
            <span>My Verified Customer Reviews ({profile.stats.totalReviews})</span>
          </div>
          <span className="text-xs font-mono font-bold text-orange-400">
            {profile.stats.customerRating} ★★★★★
          </span>
        </div>

        <div className="space-y-2.5">
          <div className="rounded-xl bg-[#080D16] border border-white/5 p-3 space-y-1 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white">David M. (Brickell)</span>
              <span className="text-[11px] font-bold text-emerald-400">+$25.00 Tip</span>
            </div>
            <p className="text-slate-300 italic">
              &ldquo;Carlos arrived in under 35 mins on Sunday afternoon. Identified blown capacitor, cool 56° air back on in 40 mins!&rdquo;
            </p>
            <span className="text-[10px] text-slate-500 block">Work Order #WO-1004 &bull; 5 Stars</span>
          </div>

          <div className="rounded-xl bg-[#080D16] border border-white/5 p-3 space-y-1 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white">Anthony V. (Doral)</span>
              <span className="text-[11px] font-bold text-emerald-400">+$20.00 Tip</span>
            </div>
            <p className="text-slate-300 italic">
              &ldquo;Emergency night call with our baby in 90° heat. Carlos installed rescue motor and kept our family safe. True lifesaver!&rdquo;
            </p>
            <span className="text-[10px] text-slate-500 block">Work Order #WO-0988 &bull; 5 Stars</span>
          </div>
        </div>
      </div>
    </div>
  );
}
