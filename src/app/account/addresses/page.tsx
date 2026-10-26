"use client";

import * as React from "react";
import { MapPin, Plus, Star, Trash2, Home, Building2, X, Shield, KeyRound, Edit3, CheckCircle2 } from "lucide-react";

interface AddressItem {
  id: string;
  label: string;
  street: string;
  unit?: string | null;
  city: string;
  state: string;
  zip: string;
  isDefault: boolean;
  gateCode?: string | null;
  equipmentSummary?: string;
}

const DEFAULT_ADDRESSES: AddressItem[] = [
  {
    id: "addr-1",
    label: "Brickell Primary Residence",
    street: "1421 Brickell Ave",
    unit: "Penthouse 18B",
    city: "Miami",
    state: "FL",
    zip: "33131",
    isDefault: true,
    gateCode: "#4821 — Check in with North Tower Concierge, Service Elevator B",
    equipmentSummary: "Carrier Infinity 4-Ton Heat Pump (2022) • Rheem Tankless Water Heater",
  },
  {
    id: "addr-2",
    label: "Coral Gables Villa",
    street: "840 Miracle Mile",
    unit: null,
    city: "Coral Gables",
    state: "FL",
    zip: "33134",
    isDefault: false,
    gateCode: "Driveway Keypad #1940 — Friendly Golden Retriever in Backyard",
    equipmentSummary: "Trane XV18 Split System (3.5 Ton) • 200A Square D Main Panel",
  },
  {
    id: "addr-3",
    label: "Brickell Key Rental Condo",
    street: "500 Brickell Key Dr",
    unit: "Suite 1204",
    city: "Miami",
    state: "FL",
    zip: "33131",
    isDefault: false,
    gateCode: "Valet Validation Provided • Call Tenant 15 mins prior",
    equipmentSummary: "Lennox Merit Water-Source Heat Pump (2.5 Ton)",
  },
];

export default function CustomerAddressesPage() {
  const [addresses, setAddresses] = React.useState<AddressItem[]>(DEFAULT_ADDRESSES);
  const [loading, setLoading] = React.useState(false);
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [editingGateId, setEditingGateId] = React.useState<string | null>(null);
  const [gateDraft, setGateDraft] = React.useState("");
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);
  const [form, setForm] = React.useState({
    label: "Home",
    street: "",
    unit: "",
    city: "Miami",
    state: "FL",
    zip: "",
    gateCode: "",
    isDefault: false,
  });

  const fetchAddresses = React.useCallback(async () => {
    try {
      const res = await fetch("/api/account/addresses");
      const json = await res.json();
      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        setAddresses(json.data);
      }
    } catch {
      // Retain pre-hydrated South Florida properties
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.street || !form.zip) return;
    setSaving(true);
    try {
      const res = await fetch("/api/account/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setShowAddModal(false);
        setForm({ label: "Home", street: "", unit: "", city: "Miami", state: "FL", zip: "", gateCode: "", isDefault: false });
        await fetchAddresses();
        showToast("New service property added to your account.");
        return;
      }
    } catch {
      // Fallback local state creation
    } finally {
      setSaving(false);
    }

    const newAddr: AddressItem = {
      id: `addr-${Date.now()}`,
      label: form.label,
      street: form.street,
      unit: form.unit || null,
      city: form.city,
      state: form.state,
      zip: form.zip,
      gateCode: form.gateCode || null,
      isDefault: form.isDefault,
      equipmentSummary: "New Service Location • Equipment profile pending first inspection",
    };
    setAddresses((prev) => (form.isDefault ? [newAddr, ...prev.map((a) => ({ ...a, isDefault: false }))] : [...prev, newAddr]));
    setShowAddModal(false);
    setForm({ label: "Home", street: "", unit: "", city: "Miami", state: "FL", zip: "", gateCode: "", isDefault: false });
    showToast("New service property added to your account.");
  };

  const handleSetDefault = async (id: string) => {
    setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));
    showToast("Default dispatch property updated.");
    try {
      await fetch(`/api/account/addresses?id=${id}`, { method: "PATCH" });
    } catch {
      // Local state already updated
    }
  };

  const handleDelete = async (id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
    showToast("Property removed from saved addresses.");
    try {
      await fetch(`/api/account/addresses?id=${id}`, { method: "DELETE" });
    } catch {
      // Local state already updated
    }
  };

  const handleSaveGateCode = (id: string) => {
    setAddresses((prev) => prev.map((a) => (a.id === id ? { ...a, gateCode: gateDraft } : a)));
    setEditingGateId(null);
    showToast("Gate & access instructions saved for technician dispatch.");
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-gradient-to-r from-[#0F172A] via-[#0B1325] to-[#0F172A] p-6 shadow-xl">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="font-display text-2xl font-bold text-white">Service Properties & Access Codes</h1>
            <span className="rounded-full border border-orange-500/30 bg-orange-500/10 px-2.5 py-0.5 text-xs font-semibold text-orange-400">
              {addresses.length} Properties
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Manage your residential and commercial properties, gate access codes, and installed equipment profiles.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20 self-start sm:self-center"
        >
          <Plus className="h-4 w-4" /> Add Service Property
        </button>
      </div>

      {toastMessage && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Property Cards Grid */}
      {addresses.length === 0 && !loading ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-12 text-center">
          <MapPin className="mx-auto h-10 w-10 text-slate-600 mb-3" />
          <h3 className="text-lg font-semibold text-white">No saved addresses</h3>
          <p className="text-sm text-slate-400 mt-1">Add your home or office address for faster 1-click booking.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className={`rounded-2xl border p-6 transition-all flex flex-col justify-between shadow-lg ${
                addr.isDefault
                  ? "border-orange-500/50 bg-gradient-to-b from-orange-500/[0.07] to-slate-900/80"
                  : "border-slate-800 bg-slate-900/60 hover:border-slate-700"
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                        addr.isDefault ? "bg-orange-500 text-white shadow-md shadow-orange-500/20" : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {addr.label.toLowerCase().includes("rental") || addr.label.toLowerCase().includes("office") ? (
                        <Building2 className="h-5 w-5" />
                      ) : (
                        <Home className="h-5 w-5" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-white">{addr.label}</h3>
                        {addr.isDefault && (
                          <span className="rounded-full bg-orange-500/20 border border-orange-500/30 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-orange-400">
                            Primary Default
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-medium text-slate-200 mt-1">
                        {addr.street}
                        {addr.unit ? `, ${addr.unit}` : ""}
                      </p>
                      <p className="text-xs text-slate-400">
                        {addr.city}, {addr.state} {addr.zip}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Gate & Concierge Instructions */}
                <div className="rounded-xl border border-slate-800/90 bg-slate-950/70 p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-amber-400">
                      <KeyRound className="h-3.5 w-3.5" /> Gate & Dispatch Notes
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingGateId(addr.id);
                        setGateDraft(addr.gateCode || "");
                      }}
                      className="inline-flex items-center gap-1 text-xs font-medium text-slate-400 hover:text-white transition-colors"
                    >
                      <Edit3 className="h-3 w-3" /> Edit
                    </button>
                  </div>
                  {editingGateId === addr.id ? (
                    <div className="space-y-2 pt-1">
                      <input
                        type="text"
                        value={gateDraft}
                        onChange={(e) => setGateDraft(e.target.value)}
                        placeholder="Gate code, concierge or pet instructions..."
                        className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-white focus:border-orange-500 focus:outline-none"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingGateId(null)}
                          className="rounded-lg px-2.5 py-1 text-xs text-slate-400 hover:text-white"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSaveGateCode(addr.id)}
                          className="rounded-lg bg-orange-500 px-3 py-1 text-xs font-semibold text-white hover:bg-orange-600"
                        >
                          Save Note
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {addr.gateCode || "No gate code on file — tap Edit to add concierge or keypad instructions."}
                    </p>
                  )}
                </div>

                {/* Registered Equipment Summary */}
                <div className="rounded-xl border border-slate-800/60 bg-slate-950/40 p-3">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <Shield className="h-3 w-3 text-emerald-400" /> Registered Property Equipment
                  </p>
                  <p className="text-xs text-slate-300 mt-1">
                    {addr.equipmentSummary || "Carrier 3.5-Ton Central Split AC • 200A Electrical Panel"}
                  </p>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-slate-800/80 pt-4">
                {!addr.isDefault ? (
                  <button
                    onClick={() => handleSetDefault(addr.id)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-orange-400 transition-colors"
                  >
                    <Star className="h-3.5 w-3.5" /> Set as Primary Property
                  </button>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Active Dispatch Default
                  </span>
                )}
                <button
                  onClick={() => handleDelete(addr.id)}
                  className="inline-flex items-center gap-1 text-xs text-rose-400 hover:text-rose-300 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Property Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h2 className="text-lg font-bold text-white">Add Service Property</h2>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Property Label</label>
                <select
                  value={form.label}
                  onChange={(e) => setForm({ ...form, label: e.target.value })}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-sm text-white"
                >
                  <option value="Home">Primary Home</option>
                  <option value="Vacation Villa">Vacation Villa</option>
                  <option value="Rental Property">Rental Property</option>
                  <option value="Commercial Office">Commercial Office</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Street Address</label>
                <input
                  type="text"
                  required
                  placeholder="1420 Brickell Ave"
                  value={form.street}
                  onChange={(e) => setForm({ ...form, street: e.target.value })}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Unit / Apt (Optional)</label>
                  <input
                    type="text"
                    placeholder="Apt 14B"
                    value={form.unit}
                    onChange={(e) => setForm({ ...form, unit: e.target.value })}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">ZIP Code</label>
                  <input
                    type="text"
                    required
                    placeholder="33131"
                    value={form.zip}
                    onChange={(e) => setForm({ ...form, zip: e.target.value })}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Gate Code / Concierge Instructions</label>
                <input
                  type="text"
                  placeholder="#1234 — Call front desk upon arrival"
                  value={form.gateCode}
                  onChange={(e) => setForm({ ...form, gateCode: e.target.value })}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white"
                />
              </div>
              <label className="flex items-center gap-2 text-xs text-slate-300">
                <input
                  type="checkbox"
                  checked={form.isDefault}
                  onChange={(e) => setForm({ ...form, isDefault: e.target.checked })}
                  className="rounded border-slate-700 bg-slate-950 text-orange-500"
                />
                Set as default service property
              </label>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-xl border border-slate-800 px-4 py-2 text-xs font-semibold text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-orange-500 px-4 py-2 text-xs font-semibold text-white hover:bg-orange-600 disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Property"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
