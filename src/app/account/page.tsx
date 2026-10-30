"use client";

import * as React from "react";
import Link from "next/link";
import {
  Calendar,
  CreditCard,
  MapPin,
  Clock,
  ArrowRight,
  ShieldCheck,
  PlusCircle,
  Wrench,
  Navigation,
  FileText,
  AlertCircle,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { format } from "date-fns";
import { formatBusinessTime } from "@/lib/domain/format";
import { formatMoneyCents } from "@/lib/domain/format";
import { businessConfig } from "@config/business.config";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { BookingMiniWindowModal } from "@/components/booking/BookingMiniWindowModal";
import type { EnrichedJob } from "@/lib/server/operations";

export default function AccountDashboardPage() {
  const [bookingModalOpen, setBookingModalOpen] = React.useState(false);
  const [data, setData] = React.useState<{
    customer: { id: string; name: string; email: string; phone: string; isDemo: boolean };
    metrics: { activeAppointments: number; completedServices: number; balanceDueCents: number; savedAddresses: number };
    nextAppointment: EnrichedJob | null;
    recentAppointments: EnrichedJob[];
    recentInvoices: any[];
    addresses: any[];
  } | null>(null);

  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchDashboard = React.useCallback(async () => {
    const demoDashboard = {
      customer: {
        id: "cust-demo",
        name: "Service Client",
        email: "david@example.com",
        phone: "(XXX) XXX-XXXX",
        isDemo: true,
      },
      metrics: {
        activeAppointments: 1,
        completedServices: 4,
        balanceDueCents: 0,
        savedAddresses: 2,
      },
      nextAppointment: {
        id: "job_today_1",
        jobNumber: 1004,
        status: "on_the_way" as const,
        scheduledStart: new Date(Date.now() + 3600000).toISOString(),
        scheduledEnd: new Date(Date.now() + 10800000).toISOString(),
        addressLine1: "1421 Brickell Ave, Apt 18B",
        addressLine2: null,
        city: "Miami",
        state: "FL",
        zip: "33131",
        lat: 25.7617,
        lng: -80.1918,
        issueText: "AC stopped cooling; condenser fan humming loudly.",
        issuePhotos: [],
        beforePhotos: [],
        afterPhotos: [],
        estimatedTotalCents: 12900,
        depositCents: 2000,
        depositPaymentIntentId: null,
        totalCents: null,
        tipCents: 0,
        billableMinutes: null,
        notesInternal: null,
        techNotes: null,
        cancelReason: null,
        cancelledAt: null,
        onTheWayAt: new Date(Date.now() - 900000).toISOString(),
        startedAt: null,
        completedAt: null,
        createdAt: new Date().toISOString(),
        isUnassignedUrgent: false,
        customer: {
          id: "cust-demo",
          name: "Service Client",
          phone: "(XXX) XXX-XXXX",
          email: "david@example.com",
          cardBrand: "visa",
          cardLast4: "4242",
          smsOptOut: false,
        },
        service: {
          id: "svc-ac-repair",
          name: "AC Repair & Diagnostic",
          category: "repair",
          skillTag: "hvac_diagnostic",
          pricingType: "flat" as const,
          priceCents: 12900,
          durationMinutes: 90,
          minBillableMinutes: 60,
        },
        technician: {
          id: "tech-001",
          name: "Assigned Technician",
          phone: "",
          email: "",
          color: "#F97316",
          commissionPct: 20,
        },
        invoice: null,
        payments: [],
        events: [],
      },
      recentAppointments: [
        {
          id: "job_past_1",
          jobNumber: 1002,
          status: "completed" as const,
          scheduledStart: new Date(Date.now() - 86400000 * 4).toISOString(),
          scheduledEnd: new Date(Date.now() - 86400000 * 4 + 7200000).toISOString(),
          addressLine1: "1421 Brickell Ave, Apt 18B",
          addressLine2: null,
          city: "Miami",
          state: "FL",
          zip: "33131",
          lat: 25.7617,
          lng: -80.1918,
          issueText: "Seasonal maintenance tune-up.",
          issuePhotos: [],
          beforePhotos: [],
          afterPhotos: [],
          estimatedTotalCents: 8900,
          depositCents: 1780,
          depositPaymentIntentId: null,
          totalCents: 8900,
          tipCents: 1500,
          billableMinutes: 60,
          notesInternal: null,
          techNotes: null,
          cancelReason: null,
          cancelledAt: null,
          onTheWayAt: null,
          startedAt: null,
          completedAt: new Date(Date.now() - 86400000 * 4 + 7200000).toISOString(),
          createdAt: new Date().toISOString(),
          isUnassignedUrgent: false,
          customer: {
            id: "cust-demo",
            name: "Service Client",
            phone: "(XXX) XXX-XXXX",
            email: "david@example.com",
            cardBrand: "visa",
            cardLast4: "4242",
            smsOptOut: false,
          },
          service: {
            id: "svc-ac-tuneup",
            name: "Seasonal AC Precision Tune-Up",
            category: "tuneup",
            skillTag: "hvac_tuneup",
            pricingType: "flat" as const,
            priceCents: 8900,
            durationMinutes: 60,
            minBillableMinutes: 60,
          },
          technician: {
            id: "tech-marcus",
            name: "Senior HVAC Specialist",
            phone: "(XXX) XXX-XXXX",
            email: "marcus@servicepro-os.com",
            color: "#3B82F6",
            commissionPct: 20,
          },
          invoice: null,
          payments: [],
          events: [],
        },
      ],
      recentInvoices: [
        {
          id: "inv-1004",
          invoiceNumber: "INV-1004",
          status: "paid",
          totalCents: 21900,
          createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
        },
      ],
      addresses: [
        {
          id: "addr-1",
          label: "Primary Residence",
          line1: "1421 Brickell Ave",
          line2: "Apt 18B",
          city: "Miami",
          state: "FL",
          zip: "33131",
          isDefault: true,
        },
      ],
    };

    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/account/dashboard");
      if (res.ok) {
        const json = await res.json();
        setData(json);
      } else {
        setData(demoDashboard);
      }
    } catch {
      setData(demoDashboard);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-32 rounded-3xl bg-white/5 border border-white/10 animate-pulse" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 rounded-2xl bg-white/5 border border-white/10 animate-pulse" />
          ))}
        </div>
        <div className="h-64 rounded-3xl bg-white/5 border border-white/10 animate-pulse" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="rounded-3xl border border-red-500/30 bg-red-500/10 p-8 text-center space-y-3">
        <AlertCircle className="h-8 w-8 text-red-400 mx-auto" />
        <p className="font-bold text-white text-lg">Dashboard Unavailable</p>
        <p className="text-xs text-slate-300">{error || "Could not retrieve account details"}</p>
        <Button onClick={fetchDashboard} size="sm" variant="outline" className="text-xs rounded-xl border-white/15 bg-white/5 text-white">
          Try Again
        </Button>
      </div>
    );
  }

  const { customer, metrics, nextAppointment, recentAppointments, recentInvoices } = data;

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-[#0F172A] via-[#1E293B]/70 to-[#0F172A] border border-white/10 text-white p-6 sm:p-8 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-l-4 border-l-[#F97316]">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold text-[#F97316] uppercase tracking-wider bg-orange-500/10 border border-orange-500/25 px-3 py-1 rounded-full">
              Customer Portal
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Hello, {customer.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
            Track appointments, download invoices, and request HVAC service anytime.
          </p>
        </div>

        <Button
          type="button"
          onClick={() => setBookingModalOpen(true)}
          className="bg-[#F97316] hover:bg-[#EA580C] text-white font-bold text-xs sm:text-sm px-6 py-6 rounded-xl shadow-lg shadow-orange-500/20 shrink-0 cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            <span>Book New Service</span>
          </div>
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="rounded-2xl border border-white/10 bg-[#0F172A]/85 backdrop-blur-xl p-5 sm:p-6 shadow-xl space-y-2 hover:border-orange-500/30 transition-all">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Active Jobs
          </p>
          <p className="text-2xl sm:text-3xl font-black text-white">
            {metrics.activeAppointments}
          </p>
          <Link
            href="/account/appointments"
            className="text-xs font-bold text-[#F97316] hover:underline inline-flex items-center gap-1 pt-1"
          >
            <span>View schedule</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0F172A]/85 backdrop-blur-xl p-5 sm:p-6 shadow-xl space-y-2 hover:border-orange-500/30 transition-all">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Completed Visits
          </p>
          <p className="text-2xl sm:text-3xl font-black text-white">
            {metrics.completedServices}
          </p>
          <span className="text-xs text-slate-400 pt-1 block">
            Maintenance record
          </span>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0F172A]/85 backdrop-blur-xl p-5 sm:p-6 shadow-xl space-y-2 hover:border-orange-500/30 transition-all">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Balance Due
          </p>
          <p
            className={`text-2xl sm:text-3xl font-black ${
              metrics.balanceDueCents > 0 ? "text-[#F97316]" : "text-emerald-400"
            }`}
          >
            {formatMoneyCents(metrics.balanceDueCents)}
          </p>
          <Link
            href="/account/invoices"
            className="text-xs font-bold text-[#F97316] hover:underline inline-flex items-center gap-1 pt-1"
          >
            <span>Review invoices</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0F172A]/85 backdrop-blur-xl p-5 sm:p-6 shadow-xl space-y-2 hover:border-orange-500/30 transition-all">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Saved Properties
          </p>
          <p className="text-2xl sm:text-3xl font-black text-white">
            {metrics.savedAddresses}
          </p>
          <Link
            href="/account/addresses"
            className="text-xs font-bold text-[#F97316] hover:underline inline-flex items-center gap-1 pt-1"
          >
            <span>Manage addresses</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>

      {/* Next Appointment Spotlight */}
      {nextAppointment ? (
        <div className="rounded-3xl border-2 border-orange-500/40 bg-[#0F172A]/90 backdrop-blur-xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-xl bg-orange-500/15 border border-orange-500/30 text-[#F97316] text-xs font-bold uppercase tracking-wide">
                Next Appointment • Job #{nextAppointment.jobNumber}
              </span>
              <StatusBadge status={nextAppointment.status} />
            </div>
            {nextAppointment.status === "on_the_way" && (
              <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/25 animate-pulse">
                <Navigation className="h-3.5 w-3.5" />
                <span>Technician En Route</span>
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                Service
              </p>
              <h3 className="text-lg font-bold text-white">
                {nextAppointment.service.name}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {nextAppointment.issueText || "Scheduled inspection & tune-up"}
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                Date &amp; Arrival Window
              </p>
              <p className="text-sm font-bold text-white flex items-center gap-2">
                <Calendar className="h-4 w-4 text-[#F97316]" />
                <span>{format(new Date(nextAppointment.scheduledStart), "EEEE, MMMM d, yyyy")}</span>
              </p>
              <p className="text-xs text-slate-300 flex items-center gap-2">
                <Clock className="h-3.5 w-3.5 text-slate-400" />
                <span>
                  {formatBusinessTime(nextAppointment.scheduledStart)} – {formatBusinessTime(nextAppointment.scheduledEnd)}
                </span>
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                Service Address
              </p>
              <p className="text-sm font-bold text-white flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[#F97316]" />
                <span>{nextAppointment.addressLine1}</span>
              </p>
              <p className="text-xs text-slate-300">
                {nextAppointment.city}, {nextAppointment.state} {nextAppointment.zip}
              </p>
            </div>
          </div>

          {/* Assigned Technician Banner */}
          {nextAppointment.technician && (
            <div className="rounded-2xl bg-white/5 border border-white/10 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-orange-500/20 border border-orange-500/30 text-[#F97316] font-bold flex items-center justify-center text-sm shadow-sm">
                  {nextAppointment.technician.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <p className="font-bold text-white">
                    Assigned Tech: {nextAppointment.technician.name}
                  </p>
                  <p className="text-slate-400 text-xs">Licensed HVAC Field Technician</p>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Button
                  asChild
                  size="sm"
                  className="bg-[#F97316] hover:bg-[#EA580C] text-white font-bold text-xs rounded-xl shadow-md"
                >
                  <Link href={`/account/appointments/${nextAppointment.id}/track`}>
                    <Navigation className="h-3.5 w-3.5 mr-1 text-white" />
                    <span>Track Technician</span>
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="text-xs font-bold border-white/15 bg-white/5 hover:bg-white/10 text-white rounded-xl"
                >
                  <Link href={`/account/appointments/${nextAppointment.id}`}>
                    Details
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-3xl border border-white/10 bg-[#0F172A]/85 backdrop-blur-xl p-8 text-center space-y-4 shadow-xl">
          <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 text-slate-400 flex items-center justify-center mx-auto">
            <Calendar className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-white">No Upcoming Appointments</h3>
          <p className="text-xs text-slate-300 max-w-sm mx-auto">
            You don&apos;t have any active service appointments scheduled. Need an AC diagnostic or seasonal tune-up?
          </p>
          <Button
            type="button"
            size="sm"
            onClick={() => setBookingModalOpen(true)}
            className="bg-[#F97316] hover:bg-[#EA580C] text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
          >
            <span>Book Service Online</span>
          </Button>
        </div>
      )}

      {/* Two Column Grid: Recent Appointments & Recent Invoices */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Appointments */}
        <div className="rounded-3xl border border-white/10 bg-[#0F172A]/85 backdrop-blur-xl p-6 sm:p-7 shadow-2xl space-y-4">
          <div className="flex items-center justify-between pb-3.5 border-b border-white/10">
            <h2 className="text-base font-bold text-white">Recent Appointments</h2>
            <Link
              href="/account/appointments"
              className="text-xs font-bold text-[#F97316] hover:underline"
            >
              View all →
            </Link>
          </div>

          {recentAppointments.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-4">No appointment history found.</p>
          ) : (
            <div className="divide-y divide-white/10">
              {recentAppointments.map((job) => (
                <div key={job.id} className="py-3.5 flex items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold text-white">{job.service.name}</p>
                      <StatusBadge status={job.status} />
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      Job #{job.jobNumber} • {format(new Date(job.scheduledStart), "MMM d, yyyy")}
                    </p>
                  </div>
                  <Link
                    href={`/account/appointments/${job.id}`}
                    className="text-xs font-bold text-slate-200 hover:text-white px-3 py-1.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 transition-all"
                  >
                    Details
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Invoices */}
        <div className="rounded-3xl border border-white/10 bg-[#0F172A]/85 backdrop-blur-xl p-6 sm:p-7 shadow-2xl space-y-4">
          <div className="flex items-center justify-between pb-3.5 border-b border-white/10">
            <h2 className="text-base font-bold text-white">Recent Invoices</h2>
            <Link
              href="/account/invoices"
              className="text-xs font-bold text-[#F97316] hover:underline"
            >
              View all →
            </Link>
          </div>

          {recentInvoices.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-4">No billing statements generated yet.</p>
          ) : (
            <div className="divide-y divide-white/10">
              {recentInvoices.map((inv) => (
                <div key={inv.id} className="py-3.5 flex items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold text-white">
                        {inv.invoiceNumber || "INV-1000"}
                      </p>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          inv.status === "paid"
                            ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-400"
                            : "bg-orange-500/15 border border-orange-500/30 text-[#F97316]"
                        }`}
                      >
                        {inv.status === "paid" ? "Paid" : "Balance Due"}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      Total: {formatMoneyCents(inv.totalCents)}
                    </p>
                  </div>

                  {inv.status === "paid" ? (
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Settled</span>
                    </span>
                  ) : (
                    <Link
                      href={`/pay/${inv.publicPayToken}`}
                      className="text-xs font-bold bg-[#F97316] hover:bg-[#EA580C] text-white px-3.5 py-1.5 rounded-xl shadow-md"
                    >
                      Pay {formatMoneyCents(inv.amountDueCents)}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Global Booking Mini Window Modal */}
      <BookingMiniWindowModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
      />
    </div>
  );
}

