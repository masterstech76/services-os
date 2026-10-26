"use client";

import * as React from "react";
import Link from "next/link";
import {
  Bell,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  FileText,
  Clock,
  ArrowRight,
  Shield,
  Check,
  Copy,
  Send,
  MessageSquare,
  Key,
  Package,
} from "lucide-react";
import { toast } from "sonner";

interface TechNotif {
  id: string;
  type: "job_assigned" | "schedule_change" | "customer_note" | "inventory_alert";
  category: "all" | "urgent" | "gate_codes" | "warehouse";
  title: string;
  message: string;
  gateCode?: string;
  warehouseBay?: string;
  jobId?: string;
  jobNumber?: number;
  read: boolean;
  createdAt: string;
}

const DEFAULT_TECH_NOTIFS: TechNotif[] = [
  {
    id: "notif-1",
    type: "job_assigned",
    category: "urgent",
    title: "Urgent Dispatch: #WO-1004 Assigned",
    message: "AC Repair & Diagnostic at 1421 Brickell Ave. Customer reported humming capacitor. Window 2:00 PM - 4:00 PM.",
    jobId: "job-1004",
    jobNumber: 1004,
    read: false,
    createdAt: "2026-10-26T14:15:00.000Z",
  },
  {
    id: "notif-2",
    type: "customer_note",
    category: "gate_codes",
    title: "Customer Gate Access Code: #WO-1002",
    message: "Customer added note: 'Call box code #4491, park in visitor bay 12 near management office.'",
    gateCode: "#4491",
    jobId: "job-1002",
    jobNumber: 1002,
    read: false,
    createdAt: "2026-10-26T12:45:00.000Z",
  },
  {
    id: "notif-3",
    type: "inventory_alert",
    category: "warehouse",
    title: "Truck Stock Parts Ready at Central Miami Depot",
    message: "45/5 MFD Dual Run Capacitors and R-410A cylinders staged for Mobile Service Unit at Bay #4.",
    warehouseBay: "Bay #4 (Central Depot)",
    read: true,
    createdAt: "2026-10-25T16:30:00.000Z",
  },
  {
    id: "notif-4",
    type: "schedule_change",
    category: "urgent",
    title: "Route Sequence Optimized: Stop #3 Moved Earlier",
    message: "Dispatch updated arrival window for Coral Gables Condos (#WO-1003) to 1:15 PM due to cleared I-95 corridor.",
    jobId: "job-1003",
    jobNumber: 1003,
    read: true,
    createdAt: "2026-10-26T11:20:00.000Z",
  },
];

export default function TechNotificationsPage() {
  const [notifications, setNotifications] = React.useState<TechNotif[]>(DEFAULT_TECH_NOTIFS);
  const [unreadCount, setUnreadCount] = React.useState<number>(2);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [categoryFilter, setCategoryFilter] = React.useState<"all" | "urgent" | "gate_codes" | "warehouse">("all");

  const loadNotifications = React.useCallback(async () => {
    try {
      const res = await fetch("/api/technicians/notifications");
      if (res.ok) {
        const data = await res.json();
        if (data.notifications?.length) {
          setNotifications(data.notifications);
          setUnreadCount(data.unreadCount ?? 2);
        }
      }
    } catch {
      // Keep default notifications
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  async function markAsRead(id: string) {
    try {
      const res = await fetch("/api/technicians/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, read: true } : n))
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch {
      // noop
    }
  }

  // 1-Tap Action Handlers
  const handleCopyGateCode = (code: string) => {
    navigator.clipboard?.writeText(code);
    toast.success(`Copied gate code "${code}" to clipboard!`);
  };

  const handleAcknowledgeRoute = (jobNumber: number) => {
    toast.success(`Route Acknowledged for WO-#${jobNumber}`, {
      description: "Dispatch alerted that you have confirmed arrival schedule.",
    });
  };

  const handleSendCannedReply = (text: string) => {
    toast.success(`Dispatch Ping Sent: "${text}"`, {
      description: "Lead dispatcher received your quick operational status update.",
    });
  };

  const filtered = notifications.filter((n) => {
    if (categoryFilter === "all") return true;
    return n.category === categoryFilter;
  });

  const getIcon = (type: TechNotif["type"]) => {
    switch (type) {
      case "job_assigned":
        return <Calendar className="h-5 w-5 text-orange-400" />;
      case "customer_note":
        return <Key className="h-5 w-5 text-emerald-400" />;
      case "inventory_alert":
        return <Package className="h-5 w-5 text-purple-400" />;
      default:
        return <Bell className="h-5 w-5 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-5 w-full pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <Link href="/tech" className="hover:text-white transition-colors">
              Technician Dashboard
            </Link>
            <span>/</span>
            <span className="text-[#F97316] font-bold">Dispatch Comms</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Bell className="h-6 w-6 text-orange-400" />
            Dispatch Push Alerts &amp; Comms Feed
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time route updates, customer gate codes, and warehouse pickup slips.
          </p>
        </div>

        {/* Categorized Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 bg-[#080D16] border border-white/10 p-1 rounded-xl text-xs font-semibold self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setCategoryFilter("all")}
            className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
              categoryFilter === "all"
                ? "bg-[#F97316] text-[#0C1523] shadow-md shadow-orange-500/20 font-bold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            All Alerts ({notifications.length})
          </button>
          <button
            type="button"
            onClick={() => setCategoryFilter("urgent")}
            className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
              categoryFilter === "urgent"
                ? "bg-[#F97316] text-[#0C1523] shadow-md shadow-orange-500/20 font-bold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Urgent Dispatch
          </button>
          <button
            type="button"
            onClick={() => setCategoryFilter("gate_codes")}
            className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
              categoryFilter === "gate_codes"
                ? "bg-[#F97316] text-[#0C1523] shadow-md shadow-orange-500/20 font-bold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Gate Codes
          </button>
          <button
            type="button"
            onClick={() => setCategoryFilter("warehouse")}
            className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
              categoryFilter === "warehouse"
                ? "bg-[#F97316] text-[#0C1523] shadow-md shadow-orange-500/20 font-bold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Parts &amp; Depot
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          QUICK DISPATCH CANNED REPLY BAR
      ───────────────────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-white/10 bg-[#0F172A]/85 backdrop-blur-xl p-3 sm:p-4 shadow-xl space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
          <MessageSquare className="w-4 h-4 text-emerald-400" />
          <span>Quick Dispatch Status Broadcast:</span>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          {[
            "Arrived at customer gate",
            "Customer not answering doorbell",
            "Parts successfully installed & testing",
            "Stuck in I-95 MacArthur traffic (+15m)",
            "Need second helper for heavy compressor",
          ].map((msg) => (
            <button
              key={msg}
              type="button"
              onClick={() => handleSendCannedReply(msg)}
              className="px-3 py-1.5 rounded-xl border border-white/10 bg-[#080D16] hover:bg-white/10 text-slate-300 hover:text-white transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Send className="w-3 h-3 text-orange-400" />
              <span>{msg}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Notifications Feed */}
      {loading ? (
        <div className="py-12 text-center text-xs text-slate-400 animate-pulse">
          Loading field notifications...
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/15 bg-[#0F172A]/85 backdrop-blur-xl p-8 text-center shadow-xl">
          <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-400 mb-2" />
          <p className="text-sm font-bold text-white">All caught up!</p>
          <p className="text-xs text-slate-400 mt-1">
            No dispatch alerts in this category at this moment.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className={`rounded-2xl border p-4 sm:p-5 transition-all bg-[#0F172A]/85 backdrop-blur-xl shadow-xl ${
                !item.read
                  ? "border-orange-500/40 ring-1 ring-orange-500/20 shadow-orange-500/10"
                  : "border-white/10 text-slate-300"
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div
                  className={`mt-0.5 p-2 rounded-xl shrink-0 ${
                    !item.read ? "bg-orange-500/10 border border-orange-500/20" : "bg-white/5 border border-white/5"
                  }`}
                >
                  {getIcon(item.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h2
                      className={`text-sm font-bold ${
                        !item.read ? "text-white" : "text-slate-200"
                      }`}
                    >
                      {item.title}
                    </h2>
                    <span
                      suppressHydrationWarning
                      className="text-[10px] text-slate-400 whitespace-nowrap flex items-center gap-1 font-mono"
                    >
                      <Clock className="h-3 w-3" />
                      {new Date(item.createdAt).toLocaleTimeString([], {
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                    {item.message}
                  </p>

                  {/* Direct Action Pills */}
                  <div className="flex flex-wrap items-center gap-2 pt-2.5">
                    {item.gateCode && (
                      <button
                        type="button"
                        onClick={() => handleCopyGateCode(item.gateCode!)}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border border-emerald-500/40 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 text-xs font-bold transition-colors cursor-pointer"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Gate Code: {item.gateCode}</span>
                      </button>
                    )}

                    {item.jobNumber && (
                      <button
                        type="button"
                        onClick={() => handleAcknowledgeRoute(item.jobNumber!)}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border border-blue-500/40 bg-blue-500/15 hover:bg-blue-500/25 text-blue-300 text-xs font-bold transition-colors cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Acknowledge Route</span>
                      </button>
                    )}

                    {item.warehouseBay && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border border-purple-500/40 bg-purple-500/15 text-purple-300 text-xs font-bold">
                        <Package className="w-3.5 h-3.5" />
                        <span>{item.warehouseBay}</span>
                      </span>
                    )}
                  </div>

                  <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-2.5 text-xs">
                    {item.jobId ? (
                      <Link
                        href={`/tech/jobs/${item.jobId}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-orange-400 hover:text-orange-300 transition-colors"
                      >
                        Open Work Order #{item.jobNumber || item.jobId}
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    ) : (
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Shield className="h-3 w-3" /> Dispatch System
                      </span>
                    )}

                    {!item.read && (
                      <button
                        type="button"
                        onClick={() => markAsRead(item.id)}
                        className="inline-flex items-center gap-1 text-xs font-medium text-slate-400 hover:text-white transition-colors cursor-pointer"
                      >
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                        Mark Read
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
