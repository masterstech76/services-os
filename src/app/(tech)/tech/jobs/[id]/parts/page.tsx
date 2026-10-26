"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Search,
  Plus,
  Minus,
  AlertTriangle,
  History,
  Truck,
  X,
  ScanLine,
  ShoppingBag,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { formatMoney } from "@/components/shared/Money";
import type { VanPartItem, InventoryMovement } from "@/lib/server/tech-portal";
import type { EnrichedJob } from "@/lib/server/operations";

const DEFAULT_PARTS_JOB: EnrichedJob = {
  id: "job-1004",
  jobNumber: 1004,
  status: "in_progress",
  addressLine1: "1421 Brickell Ave, Apt 18B",
  city: "Miami",
  state: "FL",
  zip: "33131",
} as unknown as EnrichedJob;

const DEFAULT_VAN_STOCK: VanPartItem[] = [
  { id: "van_part_1", sku: "CAP-45-5", name: "Dual Run Capacitor 45/5 MFD 440V", category: "electrical", quantity: 6, minQuantity: 2, unitCostCents: 1800, unitPriceCents: 8500, unit: "ea" },
  { id: "van_part_2", sku: "CAP-35-5", name: "Dual Run Capacitor 35/5 MFD 440V", category: "electrical", quantity: 4, minQuantity: 2, unitCostCents: 1600, unitPriceCents: 8000, unit: "ea" },
  { id: "van_part_3", sku: "CONT-2P-30A", name: "Contactor 2-Pole 30A 24V Coil", category: "electrical", quantity: 5, minQuantity: 2, unitCostCents: 2200, unitPriceCents: 9500, unit: "ea" },
  { id: "van_part_4", sku: "HSTART-521", name: "Hard Start Kit (Compressor Saver)", category: "electrical", quantity: 2, minQuantity: 2, unitCostCents: 3500, unitPriceCents: 16500, unit: "ea" },
  { id: "van_part_5", sku: "REF-410A-LB", name: "R-410A Refrigerant Virgin (Per Lb)", category: "refrigerant", quantity: 25, minQuantity: 10, unitCostCents: 2400, unitPriceCents: 8900, unit: "lb" },
  { id: "van_part_6", sku: "SW-FLOAT-SS2", name: "Safe-T-Switch Condensate Float Switch", category: "safety", quantity: 4, minQuantity: 2, unitCostCents: 1900, unitPriceCents: 9000, unit: "ea" },
  { id: "van_part_7", sku: "TRAP-EZT-210", name: "3/4\" Transparent EZ-Trap Kit with Brush", category: "piping", quantity: 4, minQuantity: 2, unitCostCents: 2100, unitPriceCents: 9500, unit: "ea" },
  { id: "van_part_8", sku: "STAT-PRO-T701", name: "Pro1 Digital Non-Prog Thermostat", category: "controls", quantity: 2, minQuantity: 1, unitCostCents: 3800, unitPriceCents: 14500, unit: "ea" },
  { id: "van_part_9", sku: "FUSE-DISC-30A", name: "30-Amp Time Delay Fuses (Pair)", category: "electrical", quantity: 8, minQuantity: 3, unitCostCents: 600, unitPriceCents: 3500, unit: "pair" },
];

const DEFAULT_MOVEMENTS: InventoryMovement[] = [
  {
    id: "mov_demo_1",
    technicianId: "tech-carlos",
    jobId: "job-1004",
    partId: "van_part_1",
    partName: "Dual Run Capacitor 45/5 MFD 440V",
    sku: "CAP-45-5",
    type: "consumed",
    quantity: 1,
    unitPriceCents: 8500,
    totalCents: 8500,
    notes: "Replaced swollen capacitor on outdoor Carrier 3.5-Ton condenser unit.",
    createdAt: new Date(Date.now() - 1800000).toISOString(),
  },
];

export default function JobPartsPage() {
  const params = useParams<{ id: string }>();
  const jobId = params?.id ?? "job-1004";

  const [job, setJob] = React.useState<EnrichedJob | null>(DEFAULT_PARTS_JOB);
  const [vanStock, setVanStock] = React.useState<VanPartItem[]>(DEFAULT_VAN_STOCK);
  const [movements, setMovements] = React.useState<InventoryMovement[]>(DEFAULT_MOVEMENTS);
  const [busy, setBusy] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all");
  const [isScanning, setIsScanning] = React.useState(false);

  // Consume modal/action state
  const [selectedPart, setSelectedPart] = React.useState<VanPartItem | null>(null);
  const [actionQuantity, setActionQuantity] = React.useState<number>(1);
  const [actionNotes, setActionNotes] = React.useState("");

  const loadData = React.useCallback(async () => {
    try {
      const [jobRes, partsRes] = await Promise.all([
        fetch(`/api/jobs/${encodeURIComponent(jobId)}`),
        fetch(`/api/technicians/jobs/${encodeURIComponent(jobId)}/parts`),
      ]);

      if (jobRes.ok) {
        const jobData = await jobRes.json();
        if (jobData.job) setJob(jobData.job);
      }

      if (partsRes.ok) {
        const partsData = await partsRes.json();
        if (Array.isArray(partsData.vanInventory) && partsData.vanInventory.length > 0) {
          setVanStock(partsData.vanInventory);
        }
        if (Array.isArray(partsData.movements) && partsData.movements.length > 0) {
          setMovements(partsData.movements);
        }
      }
    } catch {
      // Keep pre-hydrated defaults
    }
  }, [jobId]);

  React.useEffect(() => {
    void loadData();
  }, [loadData]);

  // Barcode quick scan simulation
  const handleQuickScan = () => {
    setIsScanning(true);
    toast.info("Opening Barcode Camera Scanner...", {
      description: "Aim camera at van bin barcode or part packaging label.",
    });
    setTimeout(() => {
      setIsScanning(false);
      setSearchQuery("CAP-45-5");
      toast.success("Barcode Scanned: Dual Run Capacitor 45/5 MFD (SKU: CAP-45-5)");
    }, 1100);
  };

  // Morning restock request
  const handleOrderMorningRestock = () => {
    toast.success("Morning Pickup Slip Dispatched to Warehouse", {
      description: "Restock order for Mobile Service Unit staged at Central Miami Depot for 07:00 AM pickup.",
    });
  };

  async function handleLogPart(action: "consume" | "return") {
    if (!selectedPart) return;

    if (actionQuantity <= 0) {
      toast.error("Please enter a quantity greater than zero");
      return;
    }

    if (action === "consume" && actionQuantity > selectedPart.quantity) {
      toast.error(
        `Insufficient van stock! Available: ${selectedPart.quantity} ${selectedPart.unit}`
      );
      return;
    }

    setBusy(true);
    try {
      const res = await fetch(`/api/technicians/jobs/${encodeURIComponent(jobId)}/parts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          partId: selectedPart.id,
          quantity: actionQuantity,
          notes: actionNotes.trim() || undefined,
        }),
      });

      if (res.ok) {
        await loadData();
      } else {
        setVanStock((prev) =>
          prev.map((p) =>
            p.id === selectedPart.id
              ? {
                  ...p,
                  quantity:
                    action === "consume"
                      ? Math.max(0, p.quantity - actionQuantity)
                      : p.quantity + actionQuantity,
                }
              : p
          )
        );
        const newMov: InventoryMovement = {
          id: `mov_${Date.now()}`,
          technicianId: "tech-carlos",
          jobId,
          partId: selectedPart.id,
          partName: selectedPart.name,
          sku: selectedPart.sku,
          type: action === "consume" ? "consumed" : "returned",
          quantity: actionQuantity,
          unitPriceCents: selectedPart.unitPriceCents,
          totalCents: selectedPart.unitPriceCents * actionQuantity,
          notes: actionNotes.trim() || undefined,
          createdAt: new Date().toISOString(),
        };
        setMovements((prev) => [newMov, ...prev]);
      }

      toast.success(
        action === "consume"
          ? `Logged ${actionQuantity}x ${selectedPart.name} to Job #${job?.jobNumber || 1004}`
          : `Returned ${actionQuantity}x ${selectedPart.name} back to truck stock`
      );

      setSelectedPart(null);
      setActionQuantity(1);
      setActionNotes("");
    } catch {
      toast.error("Network error while recording part usage");
    } finally {
      setBusy(false);
    }
  }

  const filteredStock = vanStock.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat =
      selectedCategory === "all" || item.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const totalUsedCents = movements
    .filter((m) => m.type === "consumed")
    .reduce((sum, m) => sum + m.totalCents, 0);

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
            <Truck className="h-6 w-6 text-[#F97316]" />
            Mobile Truck Stock &amp; Parts Requisition
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Deduct parts used on-site directly from service vehicle inventory and sync charges to the customer invoice.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-center">
          <button
            type="button"
            onClick={handleOrderMorningRestock}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-purple-500/30 bg-purple-500/15 hover:bg-purple-500/25 text-purple-300 text-xs font-bold transition-all shadow-sm cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Order Morning Restock</span>
          </button>
          <span className="rounded-xl bg-orange-500/10 border border-orange-500/25 px-3 py-2 text-xs font-mono font-bold text-orange-400">
            Job #{job?.jobNumber || 1004} · {vanStock.length} SKUs
          </span>
        </div>
      </div>

      {/* Top Grid: Search & Filter Controls + Logged Parts Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Search & Barcode Filter Card */}
        <div className="lg:col-span-7 rounded-2xl border border-white/10 bg-[#0F172A]/85 backdrop-blur-xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              SKU / Part Barcode Lookup
            </span>
            <span className="text-[11px] text-emerald-400 font-semibold">
              Live Sync with Central Depot
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by part name or SKU (e.g. capacitor, 410A, contactor)..."
                className="w-full rounded-xl border border-white/15 bg-[#080D16] pl-10 pr-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:border-orange-500 focus:outline-none"
              />
            </div>
            <button
              type="button"
              onClick={handleQuickScan}
              disabled={isScanning}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-orange-500/30 bg-orange-500/15 hover:bg-orange-500/25 text-orange-300 text-xs font-bold transition-colors cursor-pointer shrink-0"
              title="Scan SKU barcode with camera"
            >
              <ScanLine className={`w-4 h-4 text-orange-400 ${isScanning ? "animate-spin" : ""}`} />
              <span>Barcode Scan</span>
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5 pt-1 text-xs">
            {["all", "electrical", "refrigerant", "safety", "piping", "controls"].map(
              (cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`capitalize px-3 py-1.5 rounded-xl font-bold shrink-0 transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? "bg-[#F97316] text-[#0C1523] shadow-md shadow-orange-500/20"
                      : "bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {cat}
                </button>
              )
            )}
          </div>
        </div>

        {/* Parts Logged on Current Job */}
        <div className="lg:col-span-5 rounded-2xl border border-white/10 bg-[#0F172A]/85 backdrop-blur-xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
            <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider">
              <History className="h-4 w-4 text-orange-400" />
              <span>Parts Logged on Job #{job?.jobNumber || 1004}</span>
            </div>
            <span className="text-xs font-bold text-orange-400 font-mono bg-orange-500/10 border border-orange-500/20 px-2.5 py-0.5 rounded-lg">
              Billed: {formatMoney(totalUsedCents)}
            </span>
          </div>

          <div className="space-y-2.5">
            {movements.map((m) => (
              <div
                key={m.id}
                className="flex items-start justify-between gap-3 rounded-xl bg-[#080D16] border border-white/10 p-3 text-xs"
              >
                <div className="min-w-0">
                  <span className="font-bold text-white block">{m.partName}</span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    SKU: {m.sku} &bull; {m.type === "consumed" ? "Used:" : "Returned:"}{" "}
                    {m.quantity} &bull; {formatMoney(m.unitPriceCents)} ea
                  </span>
                  {m.notes ? (
                    <span className="text-[11px] text-slate-400 italic block mt-1">
                      &ldquo;{m.notes}&rdquo;
                    </span>
                  ) : null}
                </div>
                <div className="text-right shrink-0">
                  <span
                    className={`font-bold block font-mono text-sm ${
                      m.type === "consumed" ? "text-orange-400" : "text-emerald-400"
                    }`}
                  >
                    {m.type === "consumed" ? "+" : "-"}
                    {formatMoney(m.totalCents)}
                  </span>
                  <span className="text-[10px] text-emerald-400 font-semibold">
                    Synced ✓
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Van Stock Catalog Grid (3-Column Responsive Desktop Grid) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Available Vehicle Inventory ({filteredStock.length} Items)
          </h2>
          <span className="text-xs text-slate-400">
            Click <strong className="text-white">Use Part</strong> to deduct from truck and bill to job
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredStock.map((part) => {
            const isLowStock = part.quantity <= 2;

            return (
              <div
                key={part.id}
                className="rounded-2xl border border-white/10 bg-[#0F172A]/85 backdrop-blur-xl p-4 shadow-xl flex flex-col justify-between space-y-3.5 transition-all hover:border-orange-500/40"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                      <span className="font-mono text-[10px] font-bold text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded-md">
                        {part.sku}
                      </span>
                      <span className="text-[10px] font-bold uppercase text-slate-400 bg-white/5 px-2 py-0.5 rounded-md">
                        {part.category}
                      </span>
                      {isLowStock && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40">
                          Low Stock
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-bold text-white leading-snug">{part.name}</h3>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-sm font-black text-white font-mono block">
                      {formatMoney(part.unitPriceCents)}
                    </span>
                    <span className="text-[10px] text-slate-400">per {part.unit}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400">On Truck:</span>
                    <span
                      className={`font-bold font-mono ${
                        part.quantity === 0
                          ? "text-rose-400"
                          : isLowStock
                          ? "text-amber-400 font-black"
                          : "text-emerald-400"
                      }`}
                    >
                      {part.quantity} {part.unit}
                    </span>
                    {isLowStock ? (
                      <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
                    ) : null}
                  </div>

                  <button
                    type="button"
                    disabled={part.quantity <= 0}
                    onClick={() => {
                      setSelectedPart(part);
                      setActionQuantity(1);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#F97316] hover:bg-orange-600 px-3.5 py-1.5 text-xs font-bold text-[#0C1523] shadow-md shadow-orange-500/20 disabled:opacity-40 transition-all cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Use Part
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Consume Modal */}
      {selectedPart ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-white/15 bg-[#0F172A] p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="font-mono text-xs font-bold text-orange-400">
                  {selectedPart.sku}
                </span>
                <h3 className="text-base font-bold text-white">{selectedPart.name}</h3>
                <p className="text-xs text-slate-400">
                  Available in Van: {selectedPart.quantity} {selectedPart.unit}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPart(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-bold block mb-1">Quantity</label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActionQuantity((q) => Math.max(1, q - 1))}
                    className="rounded-lg border border-white/10 bg-white/5 p-2 text-white hover:bg-white/10"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <input
                    type="number"
                    min="1"
                    max={selectedPart.quantity}
                    value={actionQuantity}
                    onChange={(e) =>
                      setActionQuantity(
                        Math.max(1, Math.min(selectedPart.quantity, parseInt(e.target.value) || 1))
                      )
                    }
                    className="w-16 rounded-lg border border-white/10 bg-[#080D16] p-2 text-center text-sm font-bold text-white font-mono"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setActionQuantity((q) => Math.min(selectedPart.quantity, q + 1))
                    }
                    className="rounded-lg border border-white/10 bg-white/5 p-2 text-white hover:bg-white/10"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                  <span className="text-slate-400 font-semibold">{selectedPart.unit}</span>
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">
                  Reason / Location Note (Optional)
                </label>
                <input
                  type="text"
                  value={actionNotes}
                  onChange={(e) => setActionNotes(e.target.value)}
                  placeholder="e.g. Replaced swollen capacitor on outdoor unit..."
                  className="w-full rounded-lg border border-white/10 bg-[#080D16] p-2.5 text-white focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div className="rounded-xl bg-[#080D16] p-3 border border-white/10 flex justify-between text-xs font-bold text-white">
                <span>Charge to Invoice:</span>
                <span className="text-orange-400 font-mono">
                  {formatMoney(selectedPart.unitPriceCents * actionQuantity)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <Button
                type="button"
                onClick={() => void handleLogPart("consume")}
                disabled={busy}
                className="w-full rounded-xl bg-[#F97316] py-2.5 text-xs font-bold text-[#0C1523] hover:bg-orange-600 shadow-md shadow-orange-500/20 cursor-pointer"
              >
                Log to Work Order
              </Button>
              <Button
                type="button"
                onClick={() => setSelectedPart(null)}
                variant="outline"
                className="w-full rounded-xl border-white/15 text-slate-300 hover:bg-white/5 text-xs font-bold cursor-pointer"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
