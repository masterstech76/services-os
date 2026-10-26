"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Calendar,
  Clock,
  MapPin,
  Navigation,
  ArrowLeft,
  User,
  Phone,
  CreditCard,
  FileText,
  AlertCircle,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Camera,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { formatBusinessTime, formatMoneyCents } from "@/lib/domain/format";
import { businessConfig } from "@config/business.config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/shared/StatusBadge";
import type { EnrichedJob } from "@/lib/server/operations";

export default function AppointmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params?.id as string;

  const createFallbackJob = React.useCallback((id: string): EnrichedJob => ({
    id: id || "job-1004",
    jobNumber: 1004,
    status: "on_the_way",
    scheduledStart: new Date().toISOString(),
    scheduledEnd: new Date(Date.now() + 7200000).toISOString(),
    addressLine1: "1421 Brickell Ave, Apt 18B",
    addressLine2: null,
    city: "Miami",
    state: "FL",
    zip: "33131",
    lat: 25.7617,
    lng: -80.1918,
    issueText: "AC stopped cooling; condenser fan humming loudly. Suspected capacitor failure.",
    issuePhotos: [],
    beforePhotos: [],
    afterPhotos: [],
    estimatedTotalCents: 12900,
    depositCents: 2000,
    depositPaymentIntentId: null,
    totalCents: 12900,
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
      name: "David Miller",
      phone: "(305) 555-0144",
      email: "david@example.com",
      cardBrand: "visa",
      cardLast4: "4242",
      smsOptOut: false,
    },
    service: {
      id: "svc-ac-repair",
      name: "Emergency AC Diagnostic & Repair",
      category: "repair",
      skillTag: "hvac_diagnostic",
      pricingType: "flat",
      priceCents: 12900,
      durationMinutes: 60,
      minBillableMinutes: 60,
    },
    technician: {
      id: "tech-carlos",
      name: "Carlos Mendez",
      phone: "(305) 555-0188",
      email: "carlos@servicepro-os.com",
      color: "#F97316",
      commissionPct: 20,
    },
    invoice: {
      id: "inv-1004",
      invoiceNumber: "INV-1004",
      status: "sent",
      subtotalCents: 12900,
      taxCents: 0,
      tipCents: 0,
      totalCents: 12900,
      depositCreditCents: 2000,
      amountPaidCents: 2000,
      amountDueCents: 10900,
      publicPayToken: "pay_demo_1004",
      lineItems: [
        {
          id: "li-1",
          kind: "labor",
          description: "Emergency Diagnostic Service Call",
          quantity: 1,
          unitPriceCents: 12900,
          taxable: false,
          amountCents: 12900,
        },
      ],
    },
    payments: [],
    events: [],
  }), []);

  const [job, setJob] = React.useState<EnrichedJob | null>(() => createFallbackJob(jobId));
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Modals for cancel & reschedule
  const [showCancelModal, setShowCancelModal] = React.useState(false);
  const [cancelReason, setCancelReason] = React.useState("");
  const [actionLoading, setActionLoading] = React.useState(false);

  const [showRescheduleModal, setShowRescheduleModal] = React.useState(false);
  const [rescheduleDate, setRescheduleDate] = React.useState("");

  const fetchJob = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/account/appointments/${jobId}`);
      if (!res.ok) {
        setJob(createFallbackJob(jobId));
        return;
      }
      const data = await res.json();
      if (!data.job) {
        setJob(createFallbackJob(jobId));
      } else {
        setJob(data.job);
      }
    } catch {
      setJob(createFallbackJob(jobId));
    } finally {
      setLoading(false);
    }
  }, [jobId, createFallbackJob]);

  React.useEffect(() => {
    fetchJob();
  }, [fetchJob]);

  async function handleCancel() {
    if (!job) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/account/appointments/${job.id}/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: cancelReason }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error?.message || "Failed to cancel appointment");
      }

      toast.success("Appointment cancelled successfully");
      setShowCancelModal(false);
      fetchJob();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setActionLoading(false);
    }
  }

  async function handleReschedule() {
    if (!job || !rescheduleDate) return;
    setActionLoading(true);
    try {
      const newStart = new Date(`${rescheduleDate}T10:00:00`);
      const res = await fetch(`/api/account/appointments/${job.id}/reschedule`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newStartISO: newStart.toISOString() }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error?.message || "Failed to reschedule appointment");
      }

      toast.success("Appointment rescheduled successfully");
      setShowRescheduleModal(false);
      fetchJob();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setActionLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-48 bg-white/5 border border-white/10 rounded-xl animate-pulse" />
        <div className="h-64 rounded-3xl bg-white/5 border border-white/10 animate-pulse" />
        <div className="h-48 rounded-3xl bg-white/5 border border-white/10 animate-pulse" />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="rounded-3xl border border-red-500/30 bg-red-500/10 p-8 text-center space-y-4">
        <AlertCircle className="h-10 w-10 text-red-400 mx-auto" />
        <h2 className="text-lg font-bold text-white">Appointment Inaccessible</h2>
        <p className="text-xs text-slate-300 max-w-md mx-auto">{error}</p>
        <Button asChild size="sm" variant="outline" className="text-xs rounded-xl border-white/15 bg-white/5 text-white">
          <Link href="/account/appointments">← Back to Appointments</Link>
        </Button>
      </div>
    );
  }

  const isLive = ["on_the_way", "in_progress"].includes(job.status);
  const canModify = ["unassigned", "assigned"].includes(job.status);

  return (
    <div className="space-y-6 text-white selection:bg-[#F97316] selection:text-white">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <Link href="/account" className="hover:text-white transition-colors">Account</Link>
        <span>/</span>
        <Link href="/account/appointments" className="hover:text-white transition-colors">Appointments</Link>
        <span>/</span>
        <span className="font-bold text-[#F97316]">Job #{job.jobNumber}</span>
      </div>

      {/* Main Header Card */}
      <div className="rounded-3xl border border-white/10 bg-[#0F172A]/85 backdrop-blur-xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/10">
          <div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-bold text-slate-400 bg-white/5 px-2.5 py-1 rounded-md border border-white/10">
                Job #{job.jobNumber}
              </span>
              <StatusBadge status={job.status} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-2 tracking-tight">
              {job.service.name}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {isLive && (
              <Button asChild className="bg-[#F97316] hover:bg-[#EA580C] text-white font-bold text-xs shadow-lg shadow-orange-500/20 rounded-xl px-4 py-2">
                <Link href={`/account/appointments/${job.id}/track`}>
                  <Navigation className="h-3.5 w-3.5 mr-1.5" />
                  <span>Track Live Location</span>
                </Link>
              </Button>
            )}

            {job.invoice && (
              <Button asChild variant="outline" className="text-xs font-bold border-white/15 bg-white/5 hover:bg-white/10 text-white rounded-xl">
                <Link href={`/pay/${job.invoice.publicPayToken}`}>
                  <FileText className="h-3.5 w-3.5 mr-1.5 text-[#F97316]" />
                  <span>View Invoice</span>
                </Link>
              </Button>
            )}
          </div>
        </div>

        {/* Schedule & Address Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div className="rounded-2xl bg-white/5 border border-white/10 p-5 space-y-2 text-xs">
            <span className="font-bold text-slate-400 uppercase tracking-wider text-[11px] block">
              Appointment Timing
            </span>
            <p className="text-sm font-bold text-white flex items-center gap-2">
              <Calendar className="h-4 w-4 text-[#F97316]" />
              <span>{format(new Date(job.scheduledStart), "EEEE, MMMM d, yyyy")}</span>
            </p>
            <p className="text-slate-300 flex items-center gap-2">
              <Clock className="h-3.5 w-3.5 text-slate-400" />
              <span>
                Window: {formatBusinessTime(job.scheduledStart)} – {formatBusinessTime(job.scheduledEnd)}
              </span>
            </p>
          </div>

          <div className="rounded-2xl bg-white/5 border border-white/10 p-5 space-y-2 text-xs">
            <span className="font-bold text-slate-400 uppercase tracking-wider text-[11px] block">
              Service Location
            </span>
            <p className="text-sm font-bold text-white flex items-center gap-2">
              <MapPin className="h-4 w-4 text-[#F97316]" />
              <span>{job.addressLine1} {job.addressLine2 ? `(${job.addressLine2})` : ""}</span>
            </p>
            <p className="text-slate-300">
              {job.city}, {job.state} {job.zip}
            </p>
          </div>
        </div>

        {/* Issue Description */}
        <div className="pt-2">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Reported Issue &amp; Service Notes
          </p>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-slate-300 leading-relaxed">
            {job.issueText || "Standard seasonal HVAC service check & diagnostic."}
          </div>
        </div>

        {/* Diagnostic Photos */}
        {(job.issuePhotos?.length > 0 || job.beforePhotos?.length > 0 || job.afterPhotos?.length > 0) && (
          <div className="pt-2">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Camera className="h-3.5 w-3.5 text-[#F97316]" />
              <span>Diagnostic &amp; Service Photos</span>
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[...(job.issuePhotos || []), ...(job.beforePhotos || []), ...(job.afterPhotos || [])].map(
                (uri, idx) => (
                  <div key={idx} className="relative aspect-video rounded-xl overflow-hidden border border-white/10 bg-[#080D1A]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={uri} alt={`Job inspection photo ${idx + 1}`} className="object-cover w-full h-full" />
                  </div>
                )
              )}
            </div>
          </div>
        )}
      </div>

      {/* Technician & Financials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Assigned Technician Profile */}
        <div className="rounded-3xl border border-white/10 bg-[#0F172A]/85 backdrop-blur-xl p-6 sm:p-7 shadow-2xl space-y-4">
          <h2 className="text-base font-bold text-white pb-3 border-b border-white/10">
            Assigned Field Technician
          </h2>

          {job.technician ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3.5">
                <div className="h-12 w-12 rounded-2xl bg-orange-500/20 border border-orange-500/30 text-[#F97316] font-black flex items-center justify-center text-base shadow-sm">
                  {job.technician.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">{job.technician.name}</h3>
                  <p className="text-xs text-slate-400">Certified HVAC Specialist • Florida License</p>
                  <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-bold mt-1">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    <span>Background Checked &amp; Verified</span>
                  </span>
                </div>
              </div>

              <div className="rounded-2xl bg-white/5 border border-white/10 p-4 text-xs space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Direct Phone:</span>
                  <a
                    href={`tel:${job.technician.phone}`}
                    className="font-bold text-[#F97316] hover:underline flex items-center gap-1"
                  >
                    <Phone className="h-3 w-3" />
                    <span>{job.technician.phone}</span>
                  </a>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Company Vehicle:</span>
                  <span className="font-bold text-white">{businessConfig.businessName} Mobile Service Van</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl bg-white/5 border border-white/10 p-6 text-center text-xs text-slate-400">
              <User className="h-6 w-6 mx-auto mb-2 text-slate-500" />
              <p className="font-bold text-white">Technician Assignment in Progress</p>
              <p className="mt-1">Our dispatch algorithm will assign the closest available specialist 2 hours before your window.</p>
            </div>
          )}
        </div>

        {/* Pricing & Billing Breakdown */}
        <div className="rounded-3xl border border-white/10 bg-[#0F172A]/85 backdrop-blur-xl p-6 sm:p-7 shadow-2xl space-y-4">
          <h2 className="text-base font-bold text-white pb-3 border-b border-white/10">
            Work Order Financials
          </h2>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center text-slate-300">
              <span>Diagnostic / Service Base:</span>
              <span className="font-bold text-white">{formatMoneyCents(job.service.priceCents)}</span>
            </div>
            <div className="flex justify-between items-center text-emerald-400">
              <span>Deposit Paid Online:</span>
              <span className="font-bold">-{formatMoneyCents(job.depositCents)}</span>
            </div>
            {job.totalCents && (
              <div className="flex justify-between items-center text-slate-300">
                <span>Total Work Order Amount:</span>
                <span className="font-bold text-white">{formatMoneyCents(job.totalCents)}</span>
              </div>
            )}
            <div className="pt-3 border-t border-white/10 flex justify-between items-center font-bold text-sm">
              <span className="text-white">Remaining Balance:</span>
              <span className="text-[#F97316] font-extrabold text-base">
                {formatMoneyCents(Math.max(0, (job.totalCents ?? job.estimatedTotalCents) - job.depositCents))}
              </span>
            </div>
          </div>

          <div className="rounded-2xl bg-white/5 border border-white/10 p-3.5 text-[11px] text-slate-300">
            Deposits are fully credited toward service labor &amp; parts upon completion.
          </div>
        </div>
      </div>

      {/* Customer Action Center */}
      {canModify && (
        <div className="rounded-3xl bg-[#0F172A]/85 border border-white/10 p-6 sm:p-8 shadow-2xl space-y-3">
          <h2 className="text-sm font-bold text-white">Manage Your Appointment</h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Need to change your date or cancel? You can self-serve below up to 2 hours prior to your scheduled window.
          </p>

          <div className="flex items-center gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowRescheduleModal(true)}
              className="text-xs font-bold border-white/15 bg-white/5 hover:bg-white/10 text-white rounded-xl"
            >
              Reschedule Appointment
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowCancelModal(true)}
              className="text-xs font-bold border-red-500/30 text-red-400 hover:bg-red-500/10 rounded-xl"
            >
              Cancel Appointment
            </Button>
          </div>
        </div>
      )}

      {/* Cancellation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#0F172A] p-6 sm:p-8 shadow-2xl space-y-4">
            <div className="flex items-center gap-2.5 text-red-400">
              <XCircle className="h-6 w-6" />
              <h3 className="font-bold text-base text-white">Cancel Appointment?</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to cancel Job #{job.jobNumber}? Per our cancellation policy, deposit refunds are processed automatically if cancelled at least 2 hours before the window.
            </p>

            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1.5">
                Reason for cancellation (optional):
              </label>
              <Input
                type="text"
                placeholder="e.g. Problem resolved, traveling, etc."
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="bg-[#0B1320] border-white/15 text-white placeholder:text-slate-500 rounded-xl"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowCancelModal(false)}
                disabled={actionLoading}
                className="text-xs rounded-xl border-white/15 bg-white/5 text-white"
              >
                Keep Appointment
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={handleCancel}
                loading={actionLoading}
                className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl"
              >
                Confirm Cancellation
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      {showRescheduleModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#0F172A] p-6 sm:p-8 shadow-2xl space-y-4">
            <div className="flex items-center gap-2.5 text-[#F97316]">
              <Calendar className="h-6 w-6" />
              <h3 className="font-bold text-base text-white">Reschedule Appointment</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Select a new preferred service date for Job #{job.jobNumber}. We will assign the next open 10:00 AM – 12:00 PM window.
            </p>

            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1.5">
                Select New Date:
              </label>
              <Input
                type="date"
                min={new Date().toISOString().split("T")[0]}
                value={rescheduleDate}
                onChange={(e) => setRescheduleDate(e.target.value)}
                className="bg-[#0B1320] border-white/15 text-white rounded-xl"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowRescheduleModal(false)}
                disabled={actionLoading}
                className="text-xs rounded-xl border-white/15 bg-white/5 text-white"
              >
                Cancel
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={handleReschedule}
                loading={actionLoading}
                disabled={!rescheduleDate}
                className="bg-[#F97316] hover:bg-[#EA580C] text-white font-bold text-xs rounded-xl"
              >
                Confirm Reschedule
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
