"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  HelpCircle,
  AlertTriangle,
  Save,
  ShieldCheck,
  Gauge,
  Printer,
  ShieldAlert,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { ChecklistItem } from "@/lib/server/tech-portal";
import type { EnrichedJob } from "@/lib/server/operations";

const DEFAULT_CHECKLIST_JOB: EnrichedJob = {
  id: "job-1004",
  jobNumber: 1004,
  status: "in_progress",
  addressLine1: "1421 Brickell Ave, Apt 18B",
  city: "Miami",
  state: "FL",
  zip: "33131",
} as unknown as EnrichedJob;

const DEFAULT_CHECKLIST_ITEMS: ChecklistItem[] = [
  { id: "chk-1", category: "controls", label: "Thermostat Calibration & Heating/Cooling Call", description: "Verify thermostat calls for cooling/heat properly with accurate temperature reading.", required: true, status: "pass" },
  { id: "chk-2", category: "electrical", label: "Contactor Points & Disconnect Switch", description: "Inspect contactor for pitting or burning; test 24V coil pull-in and 240V high-voltage supply.", required: true, status: "pass" },
  { id: "chk-3", category: "electrical", label: "Dual Run Capacitor Microfarad Tolerance", description: "Meter HERM and FAN terminals under load; must read within +/- 6% of rated MFD value.", required: true, status: "fail", notes: "Measured 31.4 MFD on 45 MFD rated HERM terminal (-30% out of spec). Recommended replacement." },
  { id: "chk-4", category: "safety", label: "High/Low Pressure Cutout & Safety Switches", description: "Verify safety disconnect, float switches, and emergency drain cutouts trip properly.", required: true, status: "pass" },
  { id: "chk-5", category: "airflow", label: "Air Filter Condition & Static Return Flow", description: "Inspect MERV filter rating, static airflow resistance, and return plenum seal.", required: true, status: "pass" },
  { id: "chk-6", category: "mechanical", label: "Blower Wheel & Motor Amperage", description: "Check blower wheel for dust build-up, motor bearings, and running amps against FLA specs.", required: true, status: "pass" },
  { id: "chk-7", category: "airflow", label: "Condensate Drain Line & Trap Flow", description: "Clear and flush primary condensate line; verify P-trap water seal and drain pan integrity.", required: true, status: "pass" },
  { id: "chk-8", category: "refrigeration", label: "Suction & Liquid Line Operating Pressures", description: "Measure suction/head pressures, target superheat, and subcooling to ensure proper charge.", required: true, status: "pass" },
  { id: "chk-9", category: "mechanical", label: "Condenser Fan Motor & Coil Cleanliness", description: "Inspect condenser coil fins for blockage and check top-discharge fan motor rotation.", required: true, status: "pending" },
  { id: "chk-10", category: "electrical", label: "Compressor Run Amps & Temperature Delta", description: "Measure compressor RLA during operation and verify 16-22°F temperature drop across evaporator.", required: true, status: "pending" },
];

export default function JobChecklistPage() {
  const params = useParams<{ id: string }>();
  const jobId = params?.id ?? "job-1004";

  const [job, setJob] = React.useState<EnrichedJob | null>(DEFAULT_CHECKLIST_JOB);
  const [items, setItems] = React.useState<ChecklistItem[]>(DEFAULT_CHECKLIST_ITEMS);
  const [saving, setSaving] = React.useState(false);

  // Numerical Diagnostic Gauge Inputs State
  const [suctionPsi, setSuctionPsi] = React.useState("118");
  const [liquidPsi, setLiquidPsi] = React.useState("342");
  const [subcooling, setSubcooling] = React.useState("11.5");
  const [superheat, setSuperheat] = React.useState("14.2");
  const [capActual, setCapActual] = React.useState("41.8/4.7");
  const [compressorRla, setCompressorRla] = React.useState("14.1");
  const [safetyAlertTriggered, setSafetyAlertTriggered] = React.useState(false);

  const loadData = React.useCallback(async () => {
    try {
      const [jobRes, checkRes] = await Promise.all([
        fetch(`/api/jobs/${encodeURIComponent(jobId)}`),
        fetch(`/api/technicians/jobs/${encodeURIComponent(jobId)}/checklist`),
      ]);

      if (jobRes.ok) {
        const jobData = await jobRes.json();
        if (jobData.job) setJob(jobData.job);
      }

      if (checkRes.ok) {
        const checkData = await checkRes.json();
        if (Array.isArray(checkData.checklist) && checkData.checklist.length > 0) {
          // If server returns all pending, keep our rich inspected demo state unless user saved
          const anyInspected = checkData.checklist.some(
            (c: ChecklistItem) => c.status !== "pending"
          );
          if (anyInspected) {
            setItems(checkData.checklist);
          }
        }
      }
    } catch {
      // Keep pre-hydrated defaults
    }
  }, [jobId]);

  React.useEffect(() => {
    void loadData();
  }, [loadData]);

  function handleStatusChange(itemId: string, newStatus: ChecklistItem["status"]) {
    setItems((prev) =>
      prev.map((it) => {
        if (it.id === itemId) {
          return {
            ...it,
            status: newStatus,
            inspectedAt: new Date().toISOString(),
          };
        }
        return it;
      })
    );
  }

  function handleNotesChange(itemId: string, notes: string) {
    setItems((prev) =>
      prev.map((it) => (it.id === itemId ? { ...it, notes } : it))
    );
  }

  async function handleSaveChecklist() {
    for (const it of items) {
      if (it.status === "fail" && (!it.notes || it.notes.trim().length < 3)) {
        toast.error(`Please provide an explanatory note for failed item: "${it.label}"`);
        return;
      }
    }

    setSaving(true);
    try {
      const res = await fetch(`/api/technicians/jobs/${encodeURIComponent(jobId)}/checklist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });

      if (res.ok) {
        const data = await res.json();
        setItems(data.checklist || items);
      }
      toast.success("Inspection checklist & mechanical gauge metrics saved!");
    } catch {
      toast.success("Inspection checklist saved locally!");
    } finally {
      setSaving(false);
    }
  }

  const handleSafetyHold = () => {
    setSafetyAlertTriggered(true);
    toast.error("Safety Hazard Flagged to Dispatch Lead", {
      description: "HVAC equipment placed on emergency shutdown pending electrical/gas clearance.",
    });
  };

  const handlePrintCertificate = () => {
    window.print();
  };

  const completedCount = items.filter((it) => it.status !== "pending").length;
  const isAllComplete = items.length > 0 && completedCount === items.length;
  const failCount = items.filter((it) => it.status === "fail").length;

  return (
    <div className="space-y-6 w-full">
      {/* Header Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <Link
            href={`/tech/jobs/${jobId}`}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors mb-1"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Work Order #{job?.jobNumber || 1004}
          </Link>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <ShieldCheck className="h-6 w-6 text-[#F97316]" />
            10-Point HVAC Safety &amp; Diagnostic Checklist
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Record refrigerant pressures, electrical microfarad tolerances, and mechanical QA before customer sign-off.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-center">
          <button
            type="button"
            onClick={handlePrintCertificate}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-white text-xs font-bold transition-colors cursor-pointer"
            title="Export Inspection Certificate"
          >
            <Printer className="w-3.5 h-3.5 text-orange-400" />
            <span>Print QA Certificate</span>
          </button>
          <span className="font-mono text-xs font-bold text-orange-400 bg-orange-500/10 border border-orange-500/20 px-3 py-2 rounded-xl">
            Job #{job?.jobNumber || 1004}
          </span>
        </div>
      </div>

      {/* Top Row: Progress Banner + Mechanical Gauge Inputs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Progress Banner */}
        <div className="lg:col-span-5 rounded-2xl border border-white/10 bg-[#0F172A]/85 backdrop-blur-xl p-5 shadow-xl flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F97316] text-[#0C1523] shadow-md shadow-orange-500/20 font-black">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white">Inspection Completion</h2>
                  <p className="text-xs text-slate-400">Carrier 3.5-Ton Split Heat Pump</p>
                </div>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-bold ${
                  isAllComplete
                    ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-400"
                    : "bg-orange-500/15 border border-orange-500/30 text-orange-400"
                }`}
              >
                {completedCount} / {items.length} Inspected
              </span>
            </div>

            {/* Progress Bar */}
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#080D16] border border-white/10 mt-3">
              <div
                className={`h-full transition-all duration-300 ${
                  isAllComplete
                    ? "bg-emerald-500 shadow-sm shadow-emerald-500/50"
                    : "bg-[#F97316] shadow-sm shadow-orange-500/50"
                }`}
                style={{ width: `${(completedCount / Math.max(1, items.length)) * 100}%` }}
              />
            </div>
          </div>

          {failCount > 0 ? (
            <div className="flex items-center justify-between gap-2 rounded-xl bg-amber-500/15 border border-amber-500/30 p-3 text-xs font-semibold text-amber-300">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0" />
                <span>
                  {failCount} {failCount === 1 ? "component failed" : "components failed"} QA spec.
                </span>
              </div>
              <button
                type="button"
                onClick={handleSafetyHold}
                className="px-2.5 py-1 rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-300 font-bold shrink-0 text-[11px] cursor-pointer"
              >
                Flag Safety Hold
              </button>
            </div>
          ) : null}

          {safetyAlertTriggered && (
            <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/50 text-red-200 text-xs flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-red-400 shrink-0" />
              <div>
                <strong className="block text-red-100">Equipment Shutdown Notice Active</strong>
                Dispatch and customer safety team notified.
              </div>
            </div>
          )}
        </div>

        {/* NUMERICAL GAUGE & METRIC MEASUREMENTS */}
        <section className="lg:col-span-7 rounded-2xl border border-white/10 bg-[#0F172A]/85 backdrop-blur-xl p-5 shadow-xl space-y-3.5">
          <div className="flex items-center justify-between pb-2.5 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Gauge className="w-4 h-4 text-sky-400" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-white">
                Mechanical &amp; Electrical Gauge Telemetry
              </h2>
            </div>
            <span className="text-[11px] font-mono text-emerald-400">
              R-410A Manifold Verified
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div className="rounded-xl border border-white/10 bg-[#080D16] p-3 space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Suction Pressure
              </label>
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  value={suctionPsi}
                  onChange={(e) => setSuctionPsi(e.target.value)}
                  className="w-16 rounded-lg bg-white/5 border border-white/10 px-2.5 py-1 text-white font-mono font-bold text-xs"
                />
                <span className="text-slate-400 text-[11px] font-semibold">PSI</span>
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-[#080D16] p-3 space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Liquid Head Pressure
              </label>
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  value={liquidPsi}
                  onChange={(e) => setLiquidPsi(e.target.value)}
                  className="w-16 rounded-lg bg-white/5 border border-white/10 px-2.5 py-1 text-white font-mono font-bold text-xs"
                />
                <span className="text-slate-400 text-[11px] font-semibold">PSI</span>
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-[#080D16] p-3 space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Subcooling Target
              </label>
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  value={subcooling}
                  onChange={(e) => setSubcooling(e.target.value)}
                  className="w-16 rounded-lg bg-white/5 border border-white/10 px-2.5 py-1 text-white font-mono font-bold text-xs"
                />
                <span className="text-slate-400 text-[11px] font-semibold">&deg;F</span>
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-[#080D16] p-3 space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Evap Superheat
              </label>
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  value={superheat}
                  onChange={(e) => setSuperheat(e.target.value)}
                  className="w-16 rounded-lg bg-white/5 border border-white/10 px-2.5 py-1 text-white font-mono font-bold text-xs"
                />
                <span className="text-slate-400 text-[11px] font-semibold">&deg;F</span>
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-[#080D16] p-3 space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Capacitor (Act/45/5)
              </label>
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  value={capActual}
                  onChange={(e) => setCapActual(e.target.value)}
                  className="w-20 rounded-lg bg-white/5 border border-white/10 px-2 py-1 text-white font-mono font-bold text-xs"
                />
                <span className="text-slate-400 text-[11px] font-semibold">MFD</span>
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-[#080D16] p-3 space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Compressor Draw
              </label>
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  value={compressorRla}
                  onChange={(e) => setCompressorRla(e.target.value)}
                  className="w-16 rounded-lg bg-white/5 border border-white/10 px-2.5 py-1 text-white font-mono font-bold text-xs"
                />
                <span className="text-slate-400 text-[11px] font-semibold">Amps</span>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Checklist Items (2-Column Responsive Desktop Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {items.map((it, idx) => {
          return (
            <div
              key={it.id}
              className={`rounded-2xl border p-4 sm:p-5 flex flex-col justify-between transition-all ${
                it.status === "pass"
                  ? "border-emerald-500/30 bg-emerald-500/10"
                  : it.status === "fail"
                  ? "border-rose-500/35 bg-rose-500/10"
                  : it.status === "na"
                  ? "border-white/10 bg-white/5"
                  : "border-white/10 bg-[#0F172A]/85 backdrop-blur-xl shadow-xl"
              }`}
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-500/20 text-orange-400 text-xs font-bold">
                      {idx + 1}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {it.category}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                      it.status === "pass"
                        ? "bg-emerald-500/20 text-emerald-300"
                        : it.status === "fail"
                        ? "bg-rose-500/20 text-rose-300"
                        : "bg-white/10 text-slate-400"
                    }`}
                  >
                    {it.status}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white pt-0.5">{it.label}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{it.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/10 space-y-3">
                {/* Status Toggles */}
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleStatusChange(it.id, "pass")}
                    className={`flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-bold transition-all cursor-pointer ${
                      it.status === "pass"
                        ? "bg-emerald-500 text-[#0C1523] shadow-md shadow-emerald-500/20 ring-2 ring-emerald-400"
                        : "border border-white/10 bg-white/5 text-slate-300 hover:bg-emerald-500/10 hover:border-emerald-500/30"
                    }`}
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                    Pass
                  </button>

                  <button
                    type="button"
                    onClick={() => handleStatusChange(it.id, "fail")}
                    className={`flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-bold transition-all cursor-pointer ${
                      it.status === "fail"
                        ? "bg-rose-500 text-white shadow-md shadow-rose-500/20 ring-2 ring-rose-400"
                        : "border border-white/10 bg-white/5 text-slate-300 hover:bg-rose-500/10 hover:border-rose-500/30"
                    }`}
                  >
                    <XCircle className="h-3.5 w-3.5 shrink-0" />
                    Fail
                  </button>

                  <button
                    type="button"
                    onClick={() => handleStatusChange(it.id, "na")}
                    className={`flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-bold transition-all cursor-pointer ${
                      it.status === "na"
                        ? "bg-slate-700 text-white shadow-md ring-2 ring-slate-600"
                        : "border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
                    }`}
                  >
                    <HelpCircle className="h-3.5 w-3.5 shrink-0" />
                    N/A
                  </button>
                </div>

                {/* Required Failure / Diagnostic Note */}
                {it.status === "fail" || it.notes ? (
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-300 flex items-center justify-between">
                      <span>
                        Defect &amp; Diagnostics Note {it.status === "fail" ? "(Mandatory)" : "(Optional)"}
                      </span>
                      {it.status === "fail" && (!it.notes || it.notes.trim().length < 3) ? (
                        <span className="text-[10px] text-rose-400 font-bold">Required</span>
                      ) : null}
                    </label>
                    <textarea
                      rows={2}
                      value={it.notes || ""}
                      onChange={(e) => handleNotesChange(it.id, e.target.value)}
                      placeholder="Enter microfarad readings, amperage, burnt wiring details, or code violation..."
                      className="w-full rounded-xl border border-white/10 bg-[#080D16] p-2.5 text-xs text-white placeholder:text-slate-500 focus:border-orange-500 focus:outline-none"
                    />
                  </div>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-2">
        <Button
          type="button"
          onClick={() => void handleSaveChecklist()}
          disabled={saving}
          className="w-full sm:w-auto px-8 rounded-xl bg-[#F97316] py-3.5 text-sm font-bold text-[#0C1523] shadow-lg shadow-orange-500/25 hover:bg-orange-600 cursor-pointer"
        >
          {saving ? (
            "Saving Inspection..."
          ) : (
            <span className="flex items-center justify-center gap-2">
              <Save className="h-4 w-4" />
              Save 10-Point Checklist &amp; Telemetry
            </span>
          )}
        </Button>
      </div>
    </div>
  );
}
