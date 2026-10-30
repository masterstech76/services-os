"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  Phone,
  Calendar,
  Navigation,
  Clock,
  ShieldCheck,
  MapPin,
  ArrowRight,
  Download,
  Share2,
} from "lucide-react";
import { toast } from "sonner";
import { businessConfig } from "@config/business.config";
import { getBookingApi, type ConfirmedJobDTO } from "@/lib/api";
import {
  formatBusinessDate,
  formatBusinessTimeWithZone,
  formatDisplayPhone,
} from "@/lib/domain/format";
import { Button } from "@/components/ui/button";
import { Money } from "@/components/shared/Money";

const DEMO_CONFIRMED_JOB: ConfirmedJobDTO = {
  jobNumber: 1004,
  serviceName: "AC Repair & Diagnostic",
  scheduledStart: new Date(Date.now() + 3600000 * 2).toISOString(),
  scheduledEnd: new Date(Date.now() + 3600000 * 4).toISOString(),
  addressLine1: "1421 Brickell Ave, Apt 18B",
  city: "Miami",
  state: "FL",
  zip: "33131",
  customerFirstName: "David",
  customerPhone: "",
  depositCents: 2000,
};

function escapeIcsText(str: string): string {
  return str
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const pi = searchParams.get("pi") ?? "";
  const [job, setJob] = React.useState<ConfirmedJobDTO | null>(DEMO_CONFIRMED_JOB);
  const [loading, setLoading] = React.useState(Boolean(pi));
  const [lookupFailed, setLookupFailed] = React.useState(false);

  React.useEffect(() => {
    if (!pi) {
      setJob(DEMO_CONFIRMED_JOB);
      setLoading(false);
      return;
    }

    let active = true;
    const api = getBookingApi();

    async function poll() {
      for (let i = 0; i < 15; i++) {
        if (!active) return;
        try {
          const found = await api.getJobByIntent(pi);
          if (found) {
            if (active) {
              setJob(found);
              setLoading(false);
            }
            return;
          }
        } catch {
          // continue polling
        }
        await new Promise((r) => setTimeout(r, 1000));
      }
      if (active) {
        setLookupFailed(true);
        setLoading(false);
      }
    }

    poll();
    return () => {
      active = false;
    };
  }, [pi]);

  function handleCalendarDownload(activeJob: ConfirmedJobDTO) {
    const start = new Date(activeJob.scheduledStart);
    const end = new Date(activeJob.scheduledEnd);
    const pad = (n: number) => String(n).padStart(2, "0");
    const toIcs = (d: Date) =>
      `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`;

    const summary = `${businessConfig.businessName}: ${activeJob.serviceName}`;
    const desc = `Work Order #${activeJob.jobNumber} with ${businessConfig.businessName}. Questions? Call ${businessConfig.phone}.`;
    const loc = `${activeJob.addressLine1}, ${activeJob.city}, ${activeJob.state} ${activeJob.zip}`;

    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//ServicePro OS//ServicePro Booking//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "BEGIN:VEVENT",
      `UID:sp-job-${activeJob.jobNumber}@servicepro-os.internal`,
      `DTSTAMP:${toIcs(new Date())}`,
      `DTSTART:${toIcs(start)}`,
      `DTEND:${toIcs(end)}`,
      `SUMMARY:${escapeIcsText(summary)}`,
      `DESCRIPTION:${escapeIcsText(desc)}`,
      `LOCATION:${escapeIcsText(loc)}`,
      "STATUS:CONFIRMED",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `servicepro-booking-${activeJob.jobNumber}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Calendar invite (.ics) downloaded!");
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0C1523] text-white py-12 px-4 sm:px-6 flex items-center justify-center">
        <div className="mx-auto w-full max-w-3xl rounded-3xl border border-white/10 bg-[#0F172A]/85 backdrop-blur-xl p-8 sm:p-10 text-center space-y-4 shadow-2xl">
          <div className="h-14 w-14 rounded-full bg-orange-500/10 border border-orange-500/20 text-[#F97316] flex items-center justify-center mx-auto animate-pulse">
            <Calendar className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-bold text-white">Finalizing Reservation…</h2>
          <p className="text-xs text-slate-300">
            Confirming your card authorization and assigning your staging slot on the dispatch board.
          </p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-[#0C1523] text-white py-12 px-4 sm:px-6 flex items-center justify-center">
        <div className="mx-auto w-full max-w-3xl rounded-3xl border border-white/10 bg-[#0F172A]/85 backdrop-blur-xl p-8 text-center space-y-5 shadow-2xl">
          <Calendar className="h-12 w-12 text-slate-400 mx-auto" />
          <h2 className="text-xl font-bold text-white">
            {lookupFailed ? "Booking Staged" : "No Active Confirmation"}
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            {lookupFailed
              ? "Your payment was received. Dispatch is staging your appointment and will send an SMS confirmation shortly."
              : "If you just completed a booking, please check your text messages or visit your customer appointments dashboard."}
          </p>
          <div className="pt-2 flex flex-col sm:flex-row justify-center gap-2.5">
            <Button asChild className="w-full sm:w-auto px-6 bg-[#F97316] hover:bg-[#EA580C] text-white font-bold text-xs h-11 rounded-xl shadow-md">
              <Link href="/account/appointments">View My Appointments</Link>
            </Button>
            <Button asChild variant="outline" className="w-full sm:w-auto px-6 text-xs h-11 rounded-xl border-white/15 bg-white/5 hover:bg-white/10 text-white">
              <Link href="/book">Schedule a Service</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const activeJob = job;

  return (
    <div className="min-h-screen bg-[#0C1523] text-white selection:bg-[#F97316] selection:text-white py-12 px-4 sm:px-6 flex items-center justify-center">
      <main className="mx-auto w-full max-w-3xl rounded-3xl border border-white/10 bg-[#0F172A]/85 backdrop-blur-xl p-7 sm:p-10 shadow-2xl space-y-6">
        {/* Top Success Badge */}
        <div className="flex flex-col items-center text-center space-y-2.5">
          <div className="h-16 w-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shadow-lg ring-8 ring-emerald-500/5">
            <CheckCircle2 className="h-9 w-9" />
          </div>
          <span className="text-xs font-mono font-bold text-[#F97316] uppercase tracking-widest bg-orange-500/10 px-3.5 py-1 rounded-full border border-orange-500/25">
            Dispatch Queue Confirmed
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            You&apos;re Confirmed!
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-sm leading-relaxed">
            Work order has been created and staged on today&apos;s Miami dispatch board.
          </p>
        </div>

        {/* Receipt Card */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-4">
          <div className="flex items-center justify-between pb-3.5 border-b border-white/10">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Work Order Number
              </span>
              <span
                data-testid="confirmed-job-number"
                className="font-mono text-xl sm:text-2xl font-black text-white"
              >
                #{activeJob.jobNumber}
              </span>
            </div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              Slot Reserved
            </span>
          </div>

          <div className="space-y-3 text-xs sm:text-sm text-slate-300">
            <div className="flex items-start gap-3">
              <Clock className="h-4 w-4 text-[#F97316] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white block">
                  {activeJob.serviceName}
                </span>
                <span className="text-slate-400 text-xs">
                  {formatBusinessDate(activeJob.scheduledStart)} • {formatBusinessTimeWithZone(activeJob.scheduledStart)}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="h-4 w-4 text-[#F97316] shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-white">
                  {activeJob.addressLine1}
                </span>
                <span className="text-slate-400 text-xs block">
                  {activeJob.city}, {activeJob.state} {activeJob.zip}
                </span>
              </div>
            </div>
          </div>

          {/* Pricing & Deposit Line */}
          <div className="pt-3.5 border-t border-white/10 flex items-center justify-between text-xs sm:text-sm">
            <div className="space-y-0.5">
              <span className="font-bold text-white">Diagnostic Reservation Deposit</span>
              <p className="text-[11px] text-slate-400">
                100% credited toward approved repair work
              </p>
            </div>
            <div className="text-right">
              <span className="font-mono text-sm sm:text-base font-black text-emerald-400">
                $<Money cents={activeJob.depositCents} />
              </span>
              <span className="block text-[10px] text-slate-500">Card Hold Processed</span>
            </div>
          </div>
        </div>

        {/* SMS Notification Confirmation */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-4 flex items-center gap-3 text-xs text-slate-300">
          <div className="h-8 w-8 rounded-lg bg-orange-500/15 border border-orange-500/30 text-[#F97316] flex items-center justify-center shrink-0">
            <Navigation className="h-4 w-4" />
          </div>
          <p>
            We texted an arrival window confirmation with live van tracking link to{" "}
            <strong className="text-white">{formatDisplayPhone(activeJob.customerPhone)}</strong>.
          </p>
        </div>

        {/* Next Actions */}
        <div className="space-y-3">
          <Button
            asChild
            className="w-full rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white font-black h-12 text-sm shadow-lg shadow-orange-500/20 transition-all"
          >
            <Link
              href="/account/appointments/job_today_1/track"
              className="flex items-center justify-center gap-2"
            >
              <Navigation className="h-4 w-4" />
              <span>Track Technician Live Now</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>

          <div className="grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleCalendarDownload(activeJob)}
              className="rounded-xl border-white/15 bg-white/5 text-white text-xs font-bold h-11 hover:bg-white/10 flex items-center justify-center gap-2"
            >
              <Calendar className="h-4 w-4 text-[#F97316]" />
              <span>Add to Calendar</span>
            </Button>

            <Button
              asChild
              variant="outline"
              className="rounded-xl border-white/15 bg-white/5 text-white text-xs font-bold h-11 hover:bg-white/10 flex items-center justify-center gap-2"
            >
              <a href={`tel:${businessConfig.phone.replace(/\D/g, "")}`}>
                <Phone className="h-4 w-4 text-[#F97316]" />
                <span>Call Dispatch</span>
              </a>
            </Button>
          </div>
        </div>

        {/* Return Home Footer */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
          <Link href="/" className="hover:text-white font-semibold transition-colors">
            ← Return to Home
          </Link>
          <Link href="/account/appointments" className="hover:text-[#F97316] font-semibold transition-colors">
            View All My Appointments →
          </Link>
        </div>
      </main>
    </div>
  );
}

export default function BookingConfirmationPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-[#0C1523] text-white flex items-center justify-center text-sm font-medium">Loading confirmed booking receipt…</div>}>
      <ConfirmationContent />
    </React.Suspense>
  );
}
