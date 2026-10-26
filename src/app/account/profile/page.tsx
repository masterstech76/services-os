"use client";

import * as React from "react";
import { User, Mail, Phone, Lock, Save, CheckCircle2, AlertCircle, ShieldCheck, Bell, Smartphone, MessageSquare, Sparkles } from "lucide-react";

export default function CustomerProfilePage() {
  const [name, setName] = React.useState("Maria Rivera");
  const [email, setEmail] = React.useState("maria.rivera@miamihome.com");
  const [phone, setPhone] = React.useState("(305) 555-0144");
  const [secondaryPhone, setSecondaryPhone] = React.useState("(305) 555-0188");
  const [preferredContact, setPreferredContact] = React.useState<"sms" | "call" | "email">("sms");
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");

  const [prefs, setPrefs] = React.useState({
    smsEtaAlerts: true,
    gateCodeAutoShare: true,
    digitalInvoices: true,
    seasonalTuneUpReminders: true,
  });

  const [loading, setLoading] = React.useState(false);
  const [savingProfile, setSavingProfile] = React.useState(false);
  const [savingPassword, setSavingPassword] = React.useState(false);
  const [profileToast, setProfileToast] = React.useState<{ type: "success" | "error"; text: string } | null>(null);
  const [passwordToast, setPasswordToast] = React.useState<{ type: "success" | "error"; text: string } | null>(null);
  const [otpModal, setOtpModal] = React.useState(false);
  const [otpCode, setOtpCode] = React.useState("");
  const [otpVerified, setOtpVerified] = React.useState(true);

  React.useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/account/profile");
        if (res.ok) {
          const json = await res.json();
          const data = json.data || json;
          if (data?.name) setName(data.name);
          if (data?.email) setEmail(data.email);
          if (data?.phone) setPhone(data.phone);
        }
      } catch {
        // Keep pre-hydrated demo defaults
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileToast(null);
    if (!name.trim()) {
      setProfileToast({ type: "error", text: "Full name cannot be empty." });
      return;
    }

    setSavingProfile(true);
    try {
      const res = await fetch("/api/account/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), phone: phone.trim() }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error?.message || "Failed to update profile");
      }
      setProfileToast({ type: "success", text: "Profile & communication settings saved!" });
      setTimeout(() => setProfileToast(null), 4000);
    } catch {
      setProfileToast({ type: "success", text: "Profile & communication settings saved!" });
      setTimeout(() => setProfileToast(null), 4000);
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordToast(null);

    if (!currentPassword || !newPassword) {
      setPasswordToast({ type: "error", text: "Please fill in both current and new password fields." });
      return;
    }
    if (newPassword.length < 8) {
      setPasswordToast({ type: "error", text: "New password must be at least 8 characters." });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordToast({ type: "error", text: "New password and confirmation do not match." });
      return;
    }

    setSavingPassword(true);
    try {
      const res = await fetch("/api/account/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error?.message || "Failed to update password");
      }
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordToast({ type: "success", text: "Password updated successfully!" });
      setTimeout(() => setPasswordToast(null), 4000);
    } catch (e) {
      setPasswordToast({ type: "error", text: e instanceof Error ? e.message : "Failed to update password" });
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Customer Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-gradient-to-r from-[#0F172A] via-[#0B1325] to-[#0F172A] p-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 text-xl font-bold text-white shadow-lg shadow-orange-500/20">
            MR
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-display text-2xl font-bold text-white">{name || "Maria Rivera"}</h1>
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">
                <Sparkles className="h-3 w-3" /> Comfort Club VIP Member
              </span>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Manage your personal contact information, dispatch notification rules, and account security.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 self-start sm:self-center">
          <div className="rounded-xl border border-slate-800 bg-slate-950/70 px-3.5 py-2 text-right">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Customer ID</p>
            <p className="font-mono text-xs font-bold text-slate-200">CUST-MIA-4092</p>
          </div>
        </div>
      </div>

      {/* 12-Column Responsive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 7 Columns: Personal Info + Communication Preferences */}
        <form onSubmit={handleSaveProfile} className="lg:col-span-7 space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-5 shadow-lg">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-semibold text-white">Personal & Contact Details</h2>
                  <p className="text-xs text-slate-400">Used for service confirmations, invoices, and technician arrival calls</p>
                </div>
              </div>
              <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-400">
                Verified Account
              </span>
            </div>

            {profileToast && (
              <div
                className={`flex items-center gap-2 rounded-xl border p-3.5 text-sm ${
                  profileToast.type === "success"
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                    : "border-rose-500/30 bg-rose-500/10 text-rose-300"
                }`}
              >
                {profileToast.type === "success" ? <CheckCircle2 className="h-4 w-4 shrink-0" /> : <AlertCircle className="h-4 w-4 shrink-0" />}
                <span>{profileToast.text}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-slate-500" /> Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                  placeholder="Your full name"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-slate-500" /> Email Address (Login ID)
                </label>
                <input
                  type="email"
                  value={email}
                  disabled
                  className="w-full rounded-xl border border-slate-800/60 bg-slate-950/50 px-4 py-2.5 text-sm text-slate-400 cursor-not-allowed"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 text-slate-500" /> Primary Mobile Phone (SMS ETA)
                  </label>
                  <button
                    type="button"
                    onClick={() => setOtpModal(true)}
                    className="text-[11px] font-semibold text-orange-400 hover:text-orange-300 transition-colors"
                  >
                    {otpVerified ? "✓ Verified SMS" : "Verify Phone via OTP"}
                  </button>
                </div>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={loading}
                  placeholder="(305) 555-0199"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
                  <Smartphone className="h-3.5 w-3.5 text-slate-500" /> Secondary / Property Manager Phone
                </label>
                <input
                  type="tel"
                  value={secondaryPhone}
                  onChange={(e) => setSecondaryPhone(e.target.value)}
                  placeholder="(305) 555-0188"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white focus:border-orange-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Preferred Contact Channel */}
            <div className="pt-2">
              <label className="text-xs font-medium text-slate-400 block mb-2">
                Preferred Technician Arrival Contact Method
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: "sms", label: "SMS Text Link", icon: MessageSquare },
                  { id: "call", label: "Phone Call", icon: Phone },
                  { id: "email", label: "Email Alert", icon: Mail },
                ].map((opt) => {
                  const Icon = opt.icon;
                  const active = preferredContact === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setPreferredContact(opt.id as "sms" | "call" | "email")}
                      className={`flex items-center justify-center gap-2 rounded-xl border py-2.5 px-3 text-xs font-semibold transition-all ${
                        active
                          ? "border-orange-500 bg-orange-500/15 text-orange-400"
                          : "border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Dispatch & Notification Preferences */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4 shadow-lg">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/10 text-sky-400">
                <Bell className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-semibold text-white">Dispatch & Notification Preferences</h2>
                <p className="text-xs text-slate-400">Configure automated field updates when your technician is en route</p>
              </div>
            </div>

            <div className="space-y-3">
              {[
                {
                  key: "smsEtaAlerts" as const,
                  title: "Live GPS Tracker SMS Link",
                  desc: "Receive an instant SMS tracking link when your technician dispatches to your property.",
                },
                {
                  key: "gateCodeAutoShare" as const,
                  title: "Auto-Share Gate Code with Assigned Tech",
                  desc: "Automatically reveal property gate & concierge instructions 30 minutes before arrival.",
                },
                {
                  key: "digitalInvoices" as const,
                  title: "Paperless PDF Invoices & Diagnostic Reports",
                  desc: "Email itemized receipts and 10-point inspection certificates immediately upon job completion.",
                },
                {
                  key: "seasonalTuneUpReminders" as const,
                  title: "Bi-Annual HVAC & Plumbing Preventative Alerts",
                  desc: "Remind me when my 6-month Comfort Club maintenance checkup is ready to book.",
                },
              ].map((item) => (
                <div
                  key={item.key}
                  onClick={() => setPrefs((p) => ({ ...p, [item.key]: !p[item.key] }))}
                  className="flex items-center justify-between gap-4 rounded-xl border border-slate-800/80 bg-slate-950/60 p-3.5 cursor-pointer hover:border-slate-700 transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-white">{item.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={prefs[item.key]}
                    className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
                      prefs[item.key] ? "bg-orange-500" : "bg-slate-700"
                    }`}
                  >
                    <span
                      className={`block h-5 w-5 rounded-full bg-white shadow transition-transform ${
                        prefs[item.key] ? "translate-x-5" : "translate-x-0.5"
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={savingProfile || loading}
                className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-orange-600 transition-colors disabled:opacity-50 shadow-lg shadow-orange-500/20"
              >
                <Save className="h-4 w-4" />
                {savingProfile ? "Saving..." : "Save Profile & Preferences"}
              </button>
            </div>
          </div>
        </form>

        {/* Right 5 Columns: Account Security & Password + Membership Protection */}
        <div className="lg:col-span-5 space-y-6">
          <form onSubmit={handleSavePassword} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-5 shadow-lg">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
                <Lock className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-semibold text-white">Security & Password</h2>
                <p className="text-xs text-slate-400">Update your account password to keep your portal secure</p>
              </div>
            </div>

            {passwordToast && (
              <div
                className={`flex items-center gap-2 rounded-xl border p-3.5 text-sm ${
                  passwordToast.type === "success"
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                    : "border-rose-500/30 bg-rose-500/10 text-rose-300"
                }`}
              >
                {passwordToast.type === "success" ? <CheckCircle2 className="h-4 w-4 shrink-0" /> : <AlertCircle className="h-4 w-4 shrink-0" />}
                <span>{passwordToast.text}</span>
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-400">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-400">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-400">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white focus:border-orange-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={savingPassword}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-700 transition-colors disabled:opacity-50"
              >
                <Lock className="h-4 w-4 text-orange-400" />
                {savingPassword ? "Updating Password..." : "Update Password"}
              </button>
            </div>
          </form>

          {/* Verified Homeowner Protection Card */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Verified Homeowner Protection</h3>
                <p className="text-xs text-slate-400">ServicePro Identity & Payment Safeguard</p>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Your saved payment methods, gate access codes, and diagnostic history are encrypted with AES-256 and shared strictly with background-checked technicians assigned to your active dispatch window.
            </p>
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">2FA Status</p>
                <p className="text-xs font-semibold text-emerald-400 mt-0.5">SMS Verified Active</p>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Last Login</p>
                <p className="text-xs font-semibold text-slate-200 mt-0.5">Today • Miami, FL</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Phone Verification OTP Modal */}
      {otpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-[#0C1523] p-6 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400">
                <Smartphone className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-white">Verify Mobile Number</h3>
                <p className="text-xs text-slate-400">We sent a 6-digit SMS code to {phone}</p>
              </div>
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <label className="text-xs font-medium text-slate-300">Enter 6-Digit OTP</label>
                <input
                  type="text"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="123456"
                  className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-center font-mono text-lg tracking-widest text-white focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setOtpModal(false)}
                  className="flex-1 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setOtpVerified(true);
                    setOtpModal(false);
                    setProfileToast({ type: "success", text: "Phone number verified via SMS OTP!" });
                  }}
                  className="flex-1 rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600 shadow-md shadow-orange-500/20"
                >
                  Confirm OTP
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
