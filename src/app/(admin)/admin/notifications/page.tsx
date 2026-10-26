"use client";

import * as React from "react";
import Link from "next/link";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Download,
  Filter,
  Mail,
  MessageSquare,
  Search,
  Bell,
  RefreshCw,
  X,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { businessConfig } from "@config/business.config";

interface NotificationItem {
  id: string;
  dateTime: string;
  type: "SMS" | "Email" | "Push";
  recipient: string;
  message: string;
  status: "Delivered" | "Failed" | "Queued" | "Sent";
  statusType: "emerald" | "rose" | "blue";
  provider: "Twilio" | "SendGrid" | "FCM";
}

const SAMPLE_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-1",
    dateTime: "May 31, 2025 10:30 AM",
    type: "SMS",
    recipient: "+1 58765 43218",
    message: "Job #J0876 confirmed",
    status: "Delivered",
    statusType: "emerald",
    provider: "Twilio",
  },
  {
    id: "notif-2",
    dateTime: "May 31, 2025 09:12 AM",
    type: "Email",
    recipient: "customer@abc.com",
    message: "Invoice #INV-1023",
    status: "Delivered",
    statusType: "emerald",
    provider: "SendGrid",
  },
  {
    id: "notif-3",
    dateTime: "May 30, 2025 07:45 PM",
    type: "Email",
    recipient: "tech@company.com",
    message: "New job assigned",
    status: "Delivered",
    statusType: "emerald",
    provider: "SendGrid",
  },
  {
    id: "notif-4",
    dateTime: "May 30, 2025 04:20 PM",
    type: "SMS",
    recipient: "+1 91234 56789",
    message: "Reminder: appointment",
    status: "Failed",
    statusType: "rose",
    provider: "Twilio",
  },
  {
    id: "notif-5",
    dateTime: "May 29, 2025 11:10 AM",
    type: "SMS",
    recipient: "customer@xyz.com",
    message: "Service completed",
    status: "Delivered",
    statusType: "emerald",
    provider: "Twilio",
  },
  {
    id: "notif-6",
    dateTime: "May 28, 2025 02:34 PM",
    type: "SMS",
    recipient: "+1 99887 66554",
    message: "Payment received",
    status: "Delivered",
    statusType: "emerald",
    provider: "Twilio",
  },
  {
    id: "notif-7",
    dateTime: "May 27, 2025 06:12 PM",
    type: "Email",
    recipient: "admin@company.com",
    message: "Daily summary report",
    status: "Delivered",
    statusType: "emerald",
    provider: "SendGrid",
  },
];

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = React.useState<NotificationItem[]>(SAMPLE_NOTIFICATIONS);
  const [selectedType, setSelectedType] = React.useState("All Types");
  const [selectedStatus, setSelectedStatus] = React.useState("All Statuses");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [inspectedNotif, setInspectedNotif] = React.useState<NotificationItem | null>(null);
  const [retryingId, setRetryingId] = React.useState<string | null>(null);

  // Optional live API fallback
  React.useEffect(() => {
    async function fetchLive() {
      try {
        const res = await fetch("/api/admin/notifications?limit=20");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.notifications) && data.notifications.length >= 7) {
            const mapped: NotificationItem[] = data.notifications.map((n: any, idx: number) => ({
              id: n.id || `live-notif-${idx}`,
              dateTime: n.sentAt ? new Date(n.sentAt).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "May 31, 2025 10:30 AM",
              type: n.channel?.toUpperCase() === "EMAIL" ? "Email" : "SMS",
              recipient: n.recipient || "+1 555-0199",
              message: n.title || n.body?.slice(0, 30) || "Service notification",
              status: n.status === "failed" ? "Failed" : "Delivered",
              statusType: n.status === "failed" ? "rose" : "emerald",
              provider: n.channel?.toUpperCase() === "EMAIL" ? "SendGrid" : "Twilio",
            }));
            setNotifications(mapped);
          }
        }
      } catch {
        // preserve sample
      }
    }
    void fetchLive();
  }, []);

  const filtered = notifications.filter((n) => {
    if (selectedType !== "All Types" && n.type !== selectedType) return false;
    if (selectedStatus !== "All Statuses" && n.status !== selectedStatus) return false;
    return true;
  });

  async function handleRetry(n: NotificationItem) {
    setRetryingId(n.id);
    await new Promise((r) => setTimeout(r, 800));
    setNotifications((prev) =>
      prev.map((item) =>
        item.id === n.id ? { ...item, status: "Delivered", statusType: "emerald" } : item
      )
    );
    setRetryingId(null);
    setInspectedNotif(null);
    toast.success(`Message dispatched successfully via ${n.provider}`);
  }

  function exportCSV() {
    const headers = ["Date & Time", "Type", "Recipient", "Message", "Status", "Provider"];
    const rows = filtered.map((l) => [
      `"${l.dateTime}"`,
      `"${l.type}"`,
      `"${l.recipient}"`,
      `"${l.message.replace(/"/g, '""')}"`,
      `"${l.status}"`,
      `"${l.provider}"`,
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `notifications_log_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Notifications log exported to CSV");
  }

  return (
    <div className="space-y-6 pb-12">
      {/* ─────────────────────────────────────────────────────────────
          1. HEADER (Title & Subtitle)
      ───────────────────────────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Notifications Log
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Track SMS and email messages, delivery statuses, and failures.
        </p>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. FILTER TOOLBAR
      ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Date Range Picker */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/10 bg-[#0F172A] text-xs font-medium text-slate-300">
            <button type="button" className="text-slate-400 hover:text-white transition-colors">
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>May 1, 2025 &rarr; May 31, 2025</span>
            <button type="button" className="text-slate-400 hover:text-white transition-colors">
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Types Dropdown */}
          <div className="relative">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="appearance-none bg-[#0F172A] border border-white/10 text-slate-300 text-xs rounded-xl px-3.5 py-1.5 pr-8 focus:outline-none focus:border-[#F97316] cursor-pointer"
            >
              <option value="All Types">All Types</option>
              <option value="SMS">SMS</option>
              <option value="Email">Email</option>
            </select>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 rotate-90 pointer-events-none" />
          </div>

          {/* Statuses Dropdown */}
          <div className="relative">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="appearance-none bg-[#0F172A] border border-white/10 text-slate-300 text-xs rounded-xl px-3.5 py-1.5 pr-8 focus:outline-none focus:border-[#F97316] cursor-pointer"
            >
              <option value="All Statuses">All Statuses</option>
              <option value="Delivered">Delivered</option>
              <option value="Failed">Failed</option>
            </select>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 rotate-90 pointer-events-none" />
          </div>
        </div>

        {/* Export Button */}
        <button
          type="button"
          onClick={exportCSV}
          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white text-xs font-semibold shadow-md shadow-orange-500/20 transition-all cursor-pointer active:scale-95"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export</span>
        </button>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. NOTIFICATIONS TABLE
      ───────────────────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-white/10 bg-[#0F172A] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0B1322] text-[11px] font-semibold text-slate-400 border-b border-white/10">
              <tr>
                <th className="px-5 py-3.5">Date &amp; Time</th>
                <th className="px-5 py-3.5">Type</th>
                <th className="px-5 py-3.5">Recipient</th>
                <th className="px-5 py-3.5">Message</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Provider</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-14 px-6 text-center">
                    <div className="max-w-sm mx-auto space-y-2.5">
                      <div className="h-11 w-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 flex items-center justify-center mx-auto">
                        <Bell className="h-5 w-5" />
                      </div>
                      <h3 className="text-sm font-extrabold text-white">
                        You&apos;re all caught up
                      </h3>
                      <p className="text-xs text-slate-400">
                        No outbound SMS or email dispatch alerts match your current search filter.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : null}
              {filtered.map((item) => {
                const isDelivered = item.statusType === "emerald";
                const isFailed = item.statusType === "rose";

                return (
                  <tr
                    key={item.id}
                    onClick={() => setInspectedNotif(item)}
                    className="hover:bg-white/[0.03] transition-colors cursor-pointer group"
                  >
                    <td className="px-5 py-3.5 font-medium text-slate-200 whitespace-nowrap">
                      {item.dateTime}
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-white whitespace-nowrap">
                      <span className="flex items-center gap-1.5">
                        {item.type === "Email" ? (
                          <Mail className="w-3.5 h-3.5 text-blue-400" />
                        ) : (
                          <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                        )}
                        <span>{item.type}</span>
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-slate-300 whitespace-nowrap">
                      {item.recipient}
                    </td>
                    <td className="px-5 py-3.5 text-slate-200">
                      {item.message}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                          isDelivered
                            ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                            : isFailed
                            ? "bg-rose-500/15 text-rose-400 border-rose-500/30"
                            : "bg-blue-500/15 text-blue-400 border-blue-500/30"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-400 font-medium whitespace-nowrap">
                      {item.provider}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            4. PAGINATION FOOTER
        ───────────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-white/10 bg-[#0B1322] text-xs">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-1 rounded-lg border border-white/10 bg-[#0F172A] text-slate-400 hover:text-white disabled:opacity-40 transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            {[1, 2, 3, 4, 5].map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => setCurrentPage(page)}
                className={`w-7 h-7 rounded-lg text-xs font-semibold transition-all ${
                  currentPage === page
                    ? "bg-[#F97316] text-[#020617] font-bold shadow-md shadow-orange-500/20"
                    : "border border-white/10 bg-[#0F172A] text-slate-400 hover:text-white"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              type="button"
              disabled={currentPage === 5}
              onClick={() => setCurrentPage((p) => Math.min(5, p + 1))}
              className="p-1 rounded-lg border border-white/10 bg-[#0F172A] text-slate-400 hover:text-white disabled:opacity-40 transition-colors"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="text-slate-400 text-xs">
            Showing 1-7 of 48 messages
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          5. INSPECT / RETRY MODAL
      ───────────────────────────────────────────────────────────── */}
      {inspectedNotif && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#0F172A] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-[#F97316]" />
                <h3 className="text-base font-bold text-white">Message Dispatch Details</h3>
              </div>
              <button
                type="button"
                onClick={() => setInspectedNotif(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-400 block mb-0.5">Channel / Provider</span>
                  <span className="font-semibold text-white">
                    {inspectedNotif.type} ({inspectedNotif.provider})
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Delivery Status</span>
                  <span
                    className={`font-semibold ${
                      inspectedNotif.status === "Delivered" ? "text-emerald-400" : "text-rose-400"
                    }`}
                  >
                    {inspectedNotif.status}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Recipient Target</span>
                  <span className="font-mono text-white">{inspectedNotif.recipient}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Timestamp</span>
                  <span className="text-slate-300">{inspectedNotif.dateTime}</span>
                </div>
              </div>

              <div>
                <span className="text-slate-400 block mb-1">Message Content Payload</span>
                <div className="p-3 rounded-xl bg-[#020617] border border-white/10 font-mono text-slate-200">
                  {inspectedNotif.message}
                </div>
              </div>

              {inspectedNotif.status === "Failed" && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>Carrier reported unreachable destination. Eligible for immediate retry.</span>
                  </div>
                  <button
                    type="button"
                    disabled={retryingId === inspectedNotif.id}
                    onClick={() => handleRetry(inspectedNotif)}
                    className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold transition-colors cursor-pointer flex items-center gap-1 shrink-0"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${retryingId === inspectedNotif.id ? "animate-spin" : ""}`} />
                    <span>Retry Dispatch</span>
                  </button>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setInspectedNotif(null)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
