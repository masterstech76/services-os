import * as React from "react";
import { CheckCircle2, CalendarPlus, Phone } from "lucide-react";
import { businessConfig } from "@config/business.config";
import type { ConfirmedJobDTO } from "@/lib/api/types";
import { Button } from "@/components/ui/button";
import { Money } from "@/components/shared/Money";
import {
  formatBusinessDate,
  formatBusinessTimeWithZone,
  formatDisplayPhone,
} from "@/lib/domain/format";

export interface StepConfirmedProps {
  confirmedJob: ConfirmedJobDTO;
}

function buildCalendarHref(job: ConfirmedJobDTO): string {
  const fmt = (iso: string) =>
    new Date(iso).toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "BEGIN:VEVENT",
    `SUMMARY:${businessConfig.businessName} - ${job.serviceName} (Job #${job.jobNumber})`,
    `DTSTART:${fmt(job.scheduledStart)}`,
    `DTEND:${fmt(job.scheduledEnd)}`,
    `LOCATION:${job.addressLine1}, ${job.city}, ${job.state} ${job.zip}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}`;
}

export function StepConfirmed({ confirmedJob }: StepConfirmedProps) {
  return (
    <section
      aria-labelledby="step-7-heading"
      data-testid="booking-confirmed-step"
      className="space-y-6 text-center py-4"
    >
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 shadow-lg">
        <CheckCircle2 className="h-9 w-9" aria-hidden="true" />
      </div>

      <div>
        <h1
          id="step-7-heading"
          className="font-heading text-[28px] sm:text-[32px] leading-tight font-extrabold text-white"
        >
          You&apos;re booked!
        </h1>
        <p
          data-testid="confirmed-job-number"
          className="inline-flex items-center rounded-full bg-orange-500/15 border border-orange-500/30 px-4 py-1 text-base font-extrabold text-[#F97316] mt-2 shadow-sm"
        >
          Job #{confirmedJob.jobNumber}
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-left space-y-2.5 text-sm shadow-xl">
        <div className="font-heading font-bold text-base text-white">
          {confirmedJob.serviceName}
        </div>
        <div className="text-white font-semibold">
          {formatBusinessDate(confirmedJob.scheduledStart)} ·{" "}
          {formatBusinessTimeWithZone(confirmedJob.scheduledStart)}
        </div>
        <div className="text-slate-300 text-xs">
          {confirmedJob.addressLine1}, {confirmedJob.city},{" "}
          {confirmedJob.state} {confirmedJob.zip}
        </div>
        <div className="pt-2.5 border-t border-white/10 flex items-center justify-between text-xs text-slate-300">
          <span>Deposit paid</span>
          <Money cents={confirmedJob.depositCents} emphasis className="text-emerald-400 font-extrabold" />
        </div>
      </div>

      <p className="text-sm text-slate-300">
        We texted a confirmation to{" "}
        <span className="font-semibold text-white">
          {formatDisplayPhone(confirmedJob.customerPhone)}
        </span>
        .
      </p>

      <div className="grid grid-cols-2 gap-3 pt-2">
        <Button asChild variant="outline" size="md" className="rounded-xl border-white/15 bg-white/5 hover:bg-white/10 text-white text-xs font-bold h-11">
          <a
            href={buildCalendarHref(confirmedJob)}
            download={`job-${confirmedJob.jobNumber}.ics`}
          >
            <CalendarPlus className="mr-2 h-4 w-4 text-[#F97316]" aria-hidden="true" />
            <span>Add to calendar</span>
          </a>
        </Button>
        <Button asChild variant="secondary" size="md" className="rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-[#0F172A] hover:text-[#0F172A] text-xs font-black h-11 shadow-md shadow-orange-500/20">
          <a href={`tel:${businessConfig.phone.replace(/\D/g, "")}`}>
            <Phone className="mr-2 h-4 w-4" aria-hidden="true" />
            <span>Call us</span>
          </a>
        </Button>
      </div>
    </section>
  );
}
