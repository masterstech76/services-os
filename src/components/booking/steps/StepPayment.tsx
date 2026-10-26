import * as React from "react";
import { Clock, CreditCard, Info } from "lucide-react";
import { businessConfig } from "@config/business.config";
import type { ServiceDTO } from "@/lib/api/types";
import { Money } from "@/components/shared/Money";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatBusinessDate, formatBusinessTime } from "@/lib/domain/format";

export interface StepPaymentProps {
  remainingSeconds: number | null;
  selectedService: ServiceDTO | null;
  selectedSlotStart: string | null;
  addressLine1: string;
  addressLine2: string;
  city: string;
  zip: string;
  estimate: {
    estimateCents: number;
    depositCents: number;
    remainingEstimateCents: number;
    depositPctUsed: number;
  };
  cardNumber: string;
  cardExpiry: string;
  cardCvc: string;
  paymentError: string | null;
  onChangeCardNumber: (val: string) => void;
  onChangeCardExpiry: (val: string) => void;
  onChangeCardCvc: (val: string) => void;
}

function formatCountdown(seconds: number | null): string {
  if (seconds === null) return "10:00";
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

export function StepPayment({
  remainingSeconds,
  selectedService,
  selectedSlotStart,
  addressLine1,
  addressLine2,
  city,
  zip,
  estimate,
  cardNumber,
  cardExpiry,
  cardCvc,
  paymentError,
  onChangeCardNumber,
  onChangeCardExpiry,
  onChangeCardCvc,
}: StepPaymentProps) {
  return (
    <section aria-labelledby="step-6-heading" className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h1
          id="step-6-heading"
          className="font-heading text-[26px] sm:text-[30px] leading-tight font-extrabold text-white"
        >
          Your booking
        </h1>
        <div
          data-testid="hold-countdown"
          className="inline-flex items-center gap-1.5 rounded-full bg-orange-500/15 border border-orange-500/30 px-3.5 py-1.5 text-xs font-bold tabular-nums text-[#F97316]"
        >
          <Clock className="h-3.5 w-3.5 text-[#F97316]" aria-hidden="true" />
          <span>Hold expires in {formatCountdown(remainingSeconds)}</span>
        </div>
      </div>

      {/* Summary Card */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-sm space-y-3">
        <div>
          <div className="text-base font-bold text-white">
            {selectedService?.name} ·{" "}
            {selectedSlotStart && formatBusinessDate(selectedSlotStart)},{" "}
            {selectedSlotStart && formatBusinessTime(selectedSlotStart)}
          </div>
          <div className="text-sm text-slate-300 mt-0.5">
            {addressLine1}
            {addressLine2 ? `, ${addressLine2}` : ""}, {city} {zip}
          </div>
        </div>

        <div className="border-t border-white/10 pt-3 space-y-1.5 text-sm">
          <div className="flex items-center justify-between text-slate-300">
            <span>Service estimate</span>
            <Money cents={estimate.estimateCents} data-testid="checkout-estimate" className="text-white" />
          </div>
          <div className="flex items-center justify-between font-bold text-base text-white">
            <span>Deposit due now ({estimate.depositPctUsed}%)</span>
            <Money
              cents={estimate.depositCents}
              emphasis
              data-testid="checkout-deposit"
              className="text-[#F97316] font-black"
            />
          </div>
          <div className="flex items-center justify-between text-slate-300">
            <span>Remaining after the job</span>
            <Money
              cents={estimate.remainingEstimateCents}
              data-testid="checkout-remaining"
              className="text-white"
            />
          </div>
          <p className="text-xs text-slate-400">+ parts/tax if any</p>
        </div>
      </div>

      {/* Payment Card */}
      <div className="rounded-2xl border border-white/10 bg-[#0F172A] p-5 shadow-sm space-y-3.5">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-white flex items-center gap-1.5">
            <CreditCard className="h-4 w-4 text-[#F97316]" aria-hidden="true" />
            <span>Card payment</span>
          </span>
          <span className="text-xs font-semibold text-emerald-400">
            Secured by Stripe
          </span>
        </div>

        <div>
          <Label htmlFor="mock-card-number" className="text-slate-300 text-xs mb-1.5 block">Card number</Label>
          <Input
            id="mock-card-number"
            data-testid="mock-card-number"
            value={cardNumber}
            onChange={(e) => onChangeCardNumber(e.target.value)}
            className="bg-[#0B1320] border-white/15 text-white placeholder:text-slate-500 rounded-xl"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="mock-card-expiry" className="text-slate-300 text-xs mb-1.5 block">Expiration</Label>
            <Input
              id="mock-card-expiry"
              value={cardExpiry}
              onChange={(e) => onChangeCardExpiry(e.target.value)}
              className="bg-[#0B1320] border-white/15 text-white placeholder:text-slate-500 rounded-xl"
            />
          </div>
          <div>
            <Label htmlFor="mock-card-cvc" className="text-slate-300 text-xs mb-1.5 block">CVC</Label>
            <Input
              id="mock-card-cvc"
              value={cardCvc}
              onChange={(e) => onChangeCardCvc(e.target.value)}
              className="bg-[#0B1320] border-white/15 text-white placeholder:text-slate-500 rounded-xl"
            />
          </div>
        </div>

        {paymentError && (
          <p role="alert" className="text-xs font-semibold text-red-400">
            {paymentError}
          </p>
        )}
      </div>

      {/* Tip Info Banner */}
      <div className="flex items-start gap-2 rounded-xl bg-white/5 border border-white/10 p-3.5 text-xs text-slate-300">
        <Info className="h-4 w-4 text-[#F97316] shrink-0 mt-0.5" aria-hidden="true" />
        <span>
          You can add a tip ({businessConfig.booking.tipPresets.join("/")}%) after the job is done.
        </span>
      </div>

      {/* SMS Consent Notice */}
      <p className="text-xs text-slate-400 leading-relaxed">
        By booking you agree to receive booking and service texts from{" "}
        {businessConfig.businessName}. Msg &amp; data rates may apply. Reply STOP to opt out.
      </p>
    </section>
  );
}
