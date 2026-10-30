"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Truck,
  ShieldCheck,
  Phone,
  Mail,
  ArrowLeft,
  Save,
  Sparkles,
  MapPin,
  Bell,
  Check,
  Navigation,
} from "lucide-react";
import { toast } from "sonner";

const ALL_CERTS = [
  "EPA Universal 608 Certified",
  "NATE Core & Heat Pump Specialist",
  "Florida State Certified Mechanical Contractor (CMC)",
  "OSHA 30-Hour Construction Safety",
  "R-410A Safety & Recovery Certified",
  "Duct IAQ & Airflow Balancing Verified",
];

export default function TechEditProfilePage() {
  const router = useRouter();
  const [saving, setSaving] = React.useState(false);

  // Form Fields — Pre-hydrated so page renders immediately without skeleton flash
  const [name, setName] = React.useState("");
  const [role, setRole] = React.useState("Senior Field Diagnostic Specialist");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [emergencyPhone, setEmergencyPhone] = React.useState("");
  const [territory, setTerritory] = React.useState("");
  const [bio, setBio] = React.useState(
    "Master HVAC diagnostic specialist with 12+ years field experience in South Florida. Specializing in high-SEER inverter systems, commercial VRF, and emergency capacitor & compressor recovery."
  );
  const [vehicleModel, setVehicleModel] = React.useState("2024 Ford Transit 250 High Roof");
  const [vehiclePlate, setVehiclePlate] = React.useState("FL-HVAC104");
  const [certs, setCerts] = React.useState<string[]>([
    "EPA Universal 608 Certified",
    "NATE Core & Heat Pump Specialist",
    "Florida State Certified Mechanical Contractor (CMC)",
    "OSHA 30-Hour Construction Safety",
  ]);

  // Preferences
  const [navApp, setNavApp] = React.useState<"google" | "apple" | "waze">("google");
  const [smsAlerts, setSmsAlerts] = React.useState(true);
  const [emergencyStandby, setEmergencyStandby] = React.useState(true);
  const [directCalling, setDirectCalling] = React.useState(true);

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem("servicepro_carlos_profile");
      if (stored) {
        const p = JSON.parse(stored);
        if (p.name) setName(p.name);
        if (p.role) setRole(p.role);
        if (p.email) setEmail(p.email);
        if (p.phone) setPhone(p.phone);
        if (p.emergencyPhone) setEmergencyPhone(p.emergencyPhone);
        if (p.territory) setTerritory(p.territory);
        if (p.bio) setBio(p.bio);
        if (p.vehicle?.model) setVehicleModel(p.vehicle.model);
        if (p.vehicle?.plate) setVehiclePlate(p.vehicle.plate);
        if (Array.isArray(p.certifications)) setCerts(p.certifications);
      }
    } catch {
      // Keep defaults
    }
  }, []);

  const toggleCert = (c: string) => {
    if (certs.includes(c)) {
      setCerts(certs.filter((item) => item !== c));
    } else {
      setCerts([...certs, c]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    setTimeout(() => {
      try {
        const updatedProfile = {
          id: "",
          name: name.trim(),
          role: role.trim() || "Senior Field Diagnostic Specialist",
          email: email.trim(),
          phone: phone.trim(),
          emergencyPhone: emergencyPhone.trim(),
          territory: territory.trim(),
          bio: bio.trim(),
          certifications: certs,
          vehicle: {
            model: vehicleModel.trim(),
            plate: vehiclePlate.trim(),
            status: "Pre-Trip Passed",
          },
          shift: {
            currentRoster: "07:00 AM – 04:30 PM (Brickell Corridor)",
            onCallWeekend: "Active Standby (89° Heat Protocol)",
            standbyStatus: "Active On-Duty",
          },
          stats: {
            completedCount: 412,
            inProgressCount: 1,
            scheduledCount: 3,
            customerRating: 4.98,
            totalReviews: 184,
            onTimeRate: "98.4%",
            vanPartsInTruck: 48,
          },
        };

        localStorage.setItem("servicepro_carlos_profile", JSON.stringify(updatedProfile));
        toast.success("Technician Profile updated successfully!");
        router.push("/tech/profile");
      } catch {
        toast.error("Failed to save technician profile.");
      } finally {
        setSaving(false);
      }
    }, 400);
  };

  return (
    <div className="space-y-6 w-full">
      {/* ─────────────────────────────────────────────────────────────
          BREADCRUMBS & TOP TITLE
      ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <Link href="/tech" className="hover:text-white transition-colors">
              Technician Dashboard
            </Link>
            <span>/</span>
            <Link href="/tech/profile" className="hover:text-white transition-colors">
              Profile
            </Link>
            <span>/</span>
            <span className="text-[#F97316] font-bold">Edit Profile</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <User className="h-6 w-6 text-[#F97316]" />
            Edit Technician Profile &amp; Preferences
          </h1>
          <p className="text-xs text-slate-300 mt-0.5">
            Update your field contact info, customer-facing introduction, assigned service vehicle, and trade certifications.
          </p>
        </div>

        <Link
          href="/tech/profile"
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-white/15 bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 text-xs font-bold transition-all self-start sm:self-auto cursor-pointer"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Profile</span>
        </Link>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          EDIT PROFILE FORM (12-COLUMN RESPONSIVE DESKTOP GRID)
      ───────────────────────────────────────────────────────────── */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT 7 COLUMNS: Personal Info, Bio & Assigned Truck */}
          <div className="lg:col-span-7 space-y-6">
            {/* 1. Personal & Contact Card */}
            <div className="rounded-2xl border border-white/10 bg-[#0F172A]/85 backdrop-blur-xl p-5 sm:p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-[#F97316]" />
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                    Personal &amp; Field Contact Info
                  </h2>
                </div>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                  #TECH-101 Verified
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1.5">
                  <label htmlFor="tech-name" className="font-bold text-slate-300 block">
                    Full Name *
                  </label>
                  <input
                    id="tech-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white font-medium focus:outline-none focus:border-[#F97316] transition-colors"
                    placeholder="Full Name"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="tech-role" className="font-bold text-slate-300 block">
                    Professional Title / Trade Role *
                  </label>
                  <input
                    id="tech-role"
                    type="text"
                    required
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white font-medium focus:outline-none focus:border-[#F97316] transition-colors"
                    placeholder="Senior Field Diagnostic Specialist"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="tech-phone" className="font-bold text-slate-300 block">
                    Direct Dispatch Mobile Phone *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-3.5 w-3.5 text-slate-400" />
                    <input
                      id="tech-phone"
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white font-medium focus:outline-none focus:border-[#F97316] transition-colors"
                      placeholder=""
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="tech-emergency-phone" className="font-bold text-slate-300 block">
                    Emergency / Standby Phone
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-3.5 w-3.5 text-orange-400" />
                    <input
                      id="tech-emergency-phone"
                      type="tel"
                      value={emergencyPhone}
                      onChange={(e) => setEmergencyPhone(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white font-medium focus:outline-none focus:border-[#F97316] transition-colors"
                      placeholder=""
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="tech-email" className="font-bold text-slate-300 block">
                    Work Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-3.5 w-3.5 text-slate-400" />
                    <input
                      id="tech-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white font-medium focus:outline-none focus:border-[#F97316] transition-colors"
                      placeholder="carlos@servicepro.com"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="tech-territory" className="font-bold text-slate-300 block">
                    Primary Service Corridor / Territory
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-3.5 w-3.5 text-emerald-400" />
                    <input
                      id="tech-territory"
                      type="text"
                      value={territory}
                      onChange={(e) => setTerritory(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white font-medium focus:outline-none focus:border-[#F97316] transition-colors"
                      placeholder="Brickell & Downtown Miami Corridor"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Customer-Facing Field Bio */}
            <div className="rounded-2xl border border-white/10 bg-[#0F172A]/85 backdrop-blur-xl p-5 sm:p-6 shadow-xl space-y-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-[#F97316]" />
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                    Public Customer Bio &amp; Service Intro
                  </h2>
                </div>
                <span className="text-[10px] text-slate-400">
                  Shown to customers on live GPS tracking screen
                </span>
              </div>

              <div className="space-y-1.5 text-xs">
                <textarea
                  id="tech-bio"
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full p-3.5 rounded-xl bg-black/40 border border-white/15 text-white font-medium focus:outline-none focus:border-[#F97316] transition-colors leading-relaxed"
                  placeholder="Describe your technical certifications and South Florida HVAC background..."
                />
              </div>
            </div>

            {/* 3. Assigned Fleet Vehicle & Truck */}
            <div className="rounded-2xl border border-white/10 bg-[#0F172A]/85 backdrop-blur-xl p-5 sm:p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-[#F97316]" />
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                    Assigned Service Truck &amp; Van
                  </h2>
                </div>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-300">
                  Fleet Unit · Pre-Trip Passed
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1.5">
                  <label htmlFor="tech-vehicle-model" className="font-bold text-slate-300 block">
                    Truck Make &amp; Model
                  </label>
                  <input
                    id="tech-vehicle-model"
                    type="text"
                    value={vehicleModel}
                    onChange={(e) => setVehicleModel(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white font-medium focus:outline-none focus:border-[#F97316] transition-colors"
                    placeholder="2024 Ford Transit 250 High Roof"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="tech-vehicle-plate" className="font-bold text-slate-300 block">
                    License Plate Tag
                  </label>
                  <input
                    id="tech-vehicle-plate"
                    type="text"
                    value={vehiclePlate}
                    onChange={(e) => setVehiclePlate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white font-medium focus:outline-none focus:border-[#F97316] transition-colors uppercase font-mono"
                    placeholder="FL-HVAC104"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT 5 COLUMNS: Certifications, GPS Nav Preference & Dispatch Alerts */}
          <div className="lg:col-span-5 space-y-6">
            {/* 4. Trade Certifications & EPA Licenses */}
            <div className="rounded-2xl border border-white/10 bg-[#0F172A]/85 backdrop-blur-xl p-5 sm:p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                    Verified Trade Certifications
                  </h2>
                </div>
                <span className="text-[10px] text-emerald-400 font-mono font-bold">
                  {certs.length} Active Badges
                </span>
              </div>

              <div className="grid grid-cols-1 gap-2.5 text-xs">
                {ALL_CERTS.map((cert) => {
                  const checked = certs.includes(cert);
                  return (
                    <button
                      key={cert}
                      type="button"
                      onClick={() => toggleCert(cert)}
                      className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        checked
                          ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-200"
                          : "bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10"
                      }`}
                    >
                      <span className="font-semibold text-xs leading-tight">{cert}</span>
                      <div
                        className={`h-5 w-5 rounded-md flex items-center justify-center shrink-0 ml-2 transition-colors ${
                          checked
                            ? "bg-emerald-500 text-slate-950"
                            : "border border-white/20"
                        }`}
                      >
                        {checked && <Check className="h-3 w-3 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Navigation App Preference */}
            <div className="rounded-2xl border border-white/10 bg-[#0F172A]/85 backdrop-blur-xl p-5 sm:p-6 shadow-xl space-y-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Navigation className="h-4 w-4 text-sky-400" />
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                    Preferred GPS Navigation App
                  </h2>
                </div>
                <span className="text-[10px] text-slate-400">
                  1-Tap Launch
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2.5 text-xs">
                {[
                  { id: "google", label: "Google Maps", sub: "Recommended" },
                  { id: "apple", label: "Apple Maps", sub: "iOS Native" },
                  { id: "waze", label: "Waze", sub: "Live Hazards" },
                ].map((app) => (
                  <button
                    key={app.id}
                    type="button"
                    onClick={() => setNavApp(app.id as "google" | "apple" | "waze")}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      navApp === app.id
                        ? "border-sky-500 bg-sky-500/20 ring-1 ring-sky-400 text-white"
                        : "border-white/10 bg-white/5 text-slate-400 hover:text-white"
                    }`}
                  >
                    <span className="font-bold text-xs block">{app.label}</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">{app.sub}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 5. Dispatch & Standby Preferences */}
            <div className="rounded-2xl border border-white/10 bg-[#0F172A]/85 backdrop-blur-xl p-5 sm:p-6 shadow-xl space-y-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4 text-[#F97316]" />
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                    Dispatch &amp; Overtime Preferences
                  </h2>
                </div>
              </div>

              <div className="space-y-2.5 text-xs">
                <label className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 cursor-pointer">
                  <div className="pr-3">
                    <span className="font-bold text-white block">SMS Route Dispatch Alerts</span>
                    <span className="text-[11px] text-slate-400">Receive instant text alerts when dispatch assigns urgent jobs</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={smsAlerts}
                    onChange={(e) => setSmsAlerts(e.target.checked)}
                    className="h-4 w-4 accent-[#F97316] rounded cursor-pointer shrink-0"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 cursor-pointer">
                  <div className="pr-3">
                    <span className="font-bold text-white block">High-Heat Emergency Overtime Standby</span>
                    <span className="text-[11px] text-slate-400">Eligible for 1.5x surge rate on heat alerts &gt;88°F</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={emergencyStandby}
                    onChange={(e) => setEmergencyStandby(e.target.checked)}
                    className="h-4 w-4 accent-[#F97316] rounded cursor-pointer shrink-0"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 cursor-pointer">
                  <div className="pr-3">
                    <span className="font-bold text-white block">Direct Homeowner In-App Tap-to-Call</span>
                    <span className="text-[11px] text-slate-400">Allow customers to call you during 30-minute en route arrival window</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={directCalling}
                    onChange={(e) => setDirectCalling(e.target.checked)}
                    className="h-4 w-4 accent-[#F97316] rounded cursor-pointer shrink-0"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* 6. Form Submission Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-3 border-t border-white/10">
          <Link
            href="/tech/profile"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-white/15 bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 text-xs font-bold transition-all text-center cursor-pointer"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#F97316] hover:bg-orange-600 text-[#0C1523] font-black text-xs shadow-lg shadow-orange-500/25 transition-all cursor-pointer active:scale-95"
          >
            <Save className="h-4 w-4" />
            <span>{saving ? "Saving Changes..." : "Save Profile Changes"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
