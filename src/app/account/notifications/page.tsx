"use client";

import * as React from "react";
import Link from "next/link";
import {
  Bell,
  CheckCircle2,
  Calendar,
  FileText,
  Navigation,
  Info,
  CheckCheck,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { CustomerNotification } from "@/lib/server/customer-portal";

const DEFAULT_CUSTOMER_NOTIFS: CustomerNotification[] = [
  {
    id: "cn-1",
    customerId: "cust-1",
    type: "dispatch",
    title: "Technician En Route: Carlos Mendez (Lead Specialist)",
    message: "Lead Master HVAC Specialist Carlos Mendez is on the way to 1421 Brickell Ave. Estimated arrival: 2:15 PM.",
    read: false,
    linkUrl: "/account/appointments",
    createdAt: new Date(Date.now() - 1200000).toISOString(),
  },
  {
    id: "cn-2",
    customerId: "cust-1",
    type: "invoice",
    title: "Payment Receipt #INV-2041 Available",
    message: "Thank you! Your payment of $189.00 for AC Capacitor & Diagnostic Service has been processed.",
    read: false,
    linkUrl: "/account/invoices",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "cn-3",
    customerId: "cust-1",
    type: "booking",
    title: "Seasonal 21-Point Tune-Up Confirmed",
    message: "Your upcoming maintenance appointment is confirmed for Tuesday, May 27 (2:00 PM – 4:00 PM window).",
    read: true,
    linkUrl: "/account/appointments",
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: "cn-4",
    customerId: "cust-1",
    type: "system",
    title: "1-Year Parts & Labor Warranty Activated",
    message: "Your OEM Dual Run Capacitor installation is now covered under our 100% Fixed-Right Guarantee through May 2026.",
    read: true,
    linkUrl: "/account/saved-services",
    createdAt: new Date(Date.now() - 259200000).toISOString(),
  },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = React.useState<CustomerNotification[]>(DEFAULT_CUSTOMER_NOTIFS);
  const [loading, setLoading] = React.useState(false);
  const [filter, setFilter] = React.useState<"all" | "unread">("all");

  const fetchNotifications = React.useCallback(async () => {
    try {
      const res = await fetch("/api/account/notifications");
      if (!res.ok) return;
      const data = await res.json();
      if (data.notifications?.length) {
        setNotifications(data.notifications);
      }
    } catch {
      // keep default notifications
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  async function handleMarkRead(id: string) {
    try {
      await fetch("/api/account/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationId: id }),
      });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch {
      // silent
    }
  }

  async function handleMarkAllRead() {
    try {
      await fetch("/api/account/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAll: true }),
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      toast.success("All notifications marked as read");
    } catch {
      toast.error("Failed to update notifications");
    }
  }

  const unreadCount = notifications.filter((n) => !n.read).length;
  const filtered = filter === "unread" ? notifications.filter((n) => !n.read) : notifications;

  function getNotificationIcon(type: string) {
    switch (type) {
      case "booking":
        return <Calendar className="h-4 w-4 text-orange-400" />;
      case "dispatch":
        return <Navigation className="h-4 w-4 text-orange-400" />;
      case "invoice":
        return <FileText className="h-4 w-4 text-emerald-400" />;
      default:
        return <Info className="h-4 w-4 text-sky-400" />;
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Customer Notifications
            </h1>
            {unreadCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full bg-[#F97316] text-[#0C1523] text-xs font-black shadow-md shadow-orange-500/20">
                {unreadCount} Unread
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time dispatches, appointment reminders, and billing receipts.
          </p>
        </div>

        {unreadCount > 0 && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleMarkAllRead}
            className="text-xs font-bold border-white/10 bg-white/5 hover:bg-white/10 text-white"
          >
            <CheckCheck className="h-3.5 w-3.5 mr-1.5 text-emerald-400" />
            <span>Mark All as Read</span>
          </Button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-1">
        <button
          type="button"
          onClick={() => setFilter("all")}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
            filter === "all"
              ? "bg-[#F97316] text-[#0C1523] shadow-md shadow-orange-500/20"
              : "text-slate-400 hover:text-white hover:bg-white/5"
          }`}
        >
          All ({notifications.length})
        </button>
        <button
          type="button"
          onClick={() => setFilter("unread")}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
            filter === "unread"
              ? "bg-[#F97316] text-[#0C1523] shadow-md shadow-orange-500/20"
              : "text-slate-400 hover:text-white hover:bg-white/5"
          }`}
        >
          Unread ({unreadCount})
        </button>
      </div>

      {/* Notifications List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 rounded-xl bg-white/5 border border-white/5 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/15 bg-[#0F172A]/85 backdrop-blur-xl p-8 text-center space-y-2 shadow-xl">
          <Bell className="h-8 w-8 text-slate-500 mx-auto" />
          <h3 className="font-bold text-white text-sm">No Notifications</h3>
          <p className="text-xs text-slate-400">You are all caught up on your service updates!</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-white/10 bg-[#0F172A]/85 backdrop-blur-xl overflow-hidden shadow-xl divide-y divide-white/5">
          {filtered.map((item) => (
            <div
              key={item.id}
              className={`p-4 sm:p-5 flex items-start justify-between gap-4 transition-colors ${
                !item.read ? "bg-orange-500/5 hover:bg-orange-500/10" : "hover:bg-white/5"
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className="h-9 w-9 rounded-xl bg-[#080D16] border border-white/10 flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                  {getNotificationIcon(item.type)}
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-xs sm:text-sm text-white">
                      {item.title}
                    </h3>
                    {!item.read && (
                      <span className="h-2 w-2 rounded-full bg-[#F97316] shadow-sm shadow-orange-500/50" />
                    )}
                  </div>
                  <p className="text-xs text-slate-300">{item.message}</p>
                  <p className="text-[10px] text-slate-500 pt-0.5">
                    {format(new Date(item.createdAt), "MMM d, yyyy • h:mm a")}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {item.linkUrl && (
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    onClick={() => handleMarkRead(item.id)}
                    className="text-xs font-bold border-white/10 text-white hover:bg-white/10"
                  >
                    <Link href={item.linkUrl}>View</Link>
                  </Button>
                )}
                {!item.read && (
                  <button
                    type="button"
                    onClick={() => handleMarkRead(item.id)}
                    className="text-[11px] font-semibold text-slate-400 hover:text-orange-400 transition-colors"
                    title="Mark as read"
                  >
                    Mark read
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
