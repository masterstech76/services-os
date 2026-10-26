"use client";

import * as React from "react";
import Link from "next/link";
import {
  Building2,
  Receipt,
  AlertTriangle,
  CreditCard,
  MessageSquare,
  Mail,
  ChevronRight,
  X,
  Save,
  CheckCircle2,
  Clock,
  Shield,
  Phone,
  DollarSign,
  Percent,
} from "lucide-react";
import { toast } from "sonner";
import { businessConfig } from "@config/business.config";

type SettingCategory =
  | "business"
  | "taxes"
  | "cancellation"
  | "payment"
  | "sms"
  | "email"
  | null;

export default function AdminSettingsPage() {
  const [activeModal, setActiveModal] = React.useState<SettingCategory>(null);

  // Business Information State
  const [bizName, setBizName] = React.useState(businessConfig.businessName);
  const [bizPhone, setBizPhone] = React.useState(businessConfig.phone);
  const [bizEmail, setBizEmail] = React.useState(businessConfig.email);
  const [bizTimezone, setBizTimezone] = React.useState(businessConfig.timezone);

  // Taxes & Fees State
  const [taxRatePct, setTaxRatePct] = React.useState("7.0");
  const [diagnosticFee, setDiagnosticFee] = React.useState("99");
  const [depositPct, setDepositPct] = React.useState("20");

  // Cancellation Rules State
  const [cancelHours, setCancelHours] = React.useState("24");
  const [cancelFee, setCancelFee] = React.useState("50");

  // Payment Settings State
  const [stripeEnabled, setStripeEnabled] = React.useState(true);
  const [cashEnabled, setCashEnabled] = React.useState(true);
  const [currency, setCurrency] = React.useState("USD ($)");

  // SMS Settings State
  const [smsProvider, setSmsProvider] = React.useState("Twilio");
  const [smsSenderId, setSmsSenderId] = React.useState("+1 (800) 555-0199");
  const [smsDispatches, setSmsDispatches] = React.useState(true);

  // Email Settings State
  const [smtpHost, setSmtpHost] = React.useState("smtp.sendgrid.net");
  const [emailSender, setEmailSender] = React.useState("dispatch@servicepro.com");
  const [emailReceipts, setEmailReceipts] = React.useState(true);

  function handleSave(categoryName: string) {
    toast.success(`${categoryName} saved successfully.`);
    setActiveModal(null);
  }

  return (
    <div className="space-y-6 pb-12">
      {/* ─────────────────────────────────────────────────────────────
          1. HEADER (Title & Subtitle)
      ───────────────────────────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Configure business information, taxes, cancellation rules, payment settings, and SMS.
        </p>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. 6 CONFIGURATION CARDS (2 COLUMNS x 3 ROWS)
      ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        {/* Card 1: Business Information */}
        <div
          onClick={() => setActiveModal("business")}
          className="rounded-2xl border border-white/10 bg-[#0F172A] p-5 hover:bg-white/[0.03] hover:border-blue-500/40 transition-all cursor-pointer group flex items-center justify-between shadow-xl"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0 group-hover:scale-105 transition-transform">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">
                Business Information
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Update company details, logo, and contact information.
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-white group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
        </div>

        {/* Card 2: Taxes & Fees */}
        <div
          onClick={() => setActiveModal("taxes")}
          className="rounded-2xl border border-white/10 bg-[#0F172A] p-5 hover:bg-white/[0.03] hover:border-emerald-500/40 transition-all cursor-pointer group flex items-center justify-between shadow-xl"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 group-hover:scale-105 transition-transform">
              <Receipt className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
                Taxes &amp; Fees
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Set tax rates, service fees and additional charges.
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-white group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
        </div>

        {/* Card 3: Cancellation Rules */}
        <div
          onClick={() => setActiveModal("cancellation")}
          className="rounded-2xl border border-white/10 bg-[#0F172A] p-5 hover:bg-white/[0.03] hover:border-orange-500/40 transition-all cursor-pointer group flex items-center justify-between shadow-xl"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-[#F97316] shrink-0 group-hover:scale-105 transition-transform">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white group-hover:text-[#F97316] transition-colors">
                Cancellation Rules
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Define cancellation period, reset reform policies.
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-white group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
        </div>

        {/* Card 4: Payment Settings */}
        <div
          onClick={() => setActiveModal("payment")}
          className="rounded-2xl border border-white/10 bg-[#0F172A] p-5 hover:bg-white/[0.03] hover:border-purple-500/40 transition-all cursor-pointer group flex items-center justify-between shadow-xl"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0 group-hover:scale-105 transition-transform">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white group-hover:text-purple-400 transition-colors">
                Payment Settings
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Configure payment methods, gateways and currencies.
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-white group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
        </div>

        {/* Card 5: SMS Settings */}
        <div
          onClick={() => setActiveModal("sms")}
          className="rounded-2xl border border-white/10 bg-[#0F172A] p-5 hover:bg-white/[0.03] hover:border-cyan-500/40 transition-all cursor-pointer group flex items-center justify-between shadow-xl"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 group-hover:scale-105 transition-transform">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">
                SMS Settings
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Manage SMS providers, templates and notification settings.
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-white group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
        </div>

        {/* Card 6: Email Settings */}
        <div
          onClick={() => setActiveModal("email")}
          className="rounded-2xl border border-white/10 bg-[#0F172A] p-5 hover:bg-white/[0.03] hover:border-indigo-500/40 transition-all cursor-pointer group flex items-center justify-between shadow-xl"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0 group-hover:scale-105 transition-transform">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">
                Email Settings
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Configure email templates and SMTP settings.
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-white group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. CONFIGURATION MODAL (Dynamic for Selected Category)
      ───────────────────────────────────────────────────────────── */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#0F172A] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white capitalize">
                  {activeModal === "business" && "Business Information"}
                  {activeModal === "taxes" && "Taxes & Fees Configuration"}
                  {activeModal === "cancellation" && "Cancellation & Refund Policies"}
                  {activeModal === "payment" && "Payment Gateway & Currencies"}
                  {activeModal === "sms" && "SMS Gateway & Automated Notifications"}
                  {activeModal === "email" && "Email SMTP & Template Settings"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="space-y-3.5 text-xs">
              {activeModal === "business" && (
                <>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Company Name</label>
                    <input
                      type="text"
                      value={bizName}
                      onChange={(e) => setBizName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#020617] border border-white/10 text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Support Phone</label>
                      <input
                        type="text"
                        value={bizPhone}
                        onChange={(e) => setBizPhone(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-[#020617] border border-white/10 text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Support Email</label>
                      <input
                        type="email"
                        value={bizEmail}
                        onChange={(e) => setBizEmail(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-[#020617] border border-white/10 text-white focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Operating Timezone</label>
                    <input
                      type="text"
                      value={bizTimezone}
                      onChange={(e) => setBizTimezone(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#020617] border border-white/10 text-white focus:outline-none"
                    />
                  </div>
                </>
              )}

              {activeModal === "taxes" && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Sales Tax Rate (%)</label>
                      <input
                        type="number"
                        value={taxRatePct}
                        onChange={(e) => setTaxRatePct(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-[#020617] border border-white/10 text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Standard Diagnostic Fee ($)</label>
                      <input
                        type="number"
                        value={diagnosticFee}
                        onChange={(e) => setDiagnosticFee(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-[#020617] border border-white/10 text-white focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Default Deposit Percentage (%)</label>
                    <input
                      type="number"
                      value={depositPct}
                      onChange={(e) => setDepositPct(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#020617] border border-white/10 text-white focus:outline-none"
                    />
                  </div>
                </>
              )}

              {activeModal === "cancellation" && (
                <>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Free Cancellation Window (Hours)</label>
                    <input
                      type="number"
                      value={cancelHours}
                      onChange={(e) => setCancelHours(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#020617] border border-white/10 text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Late Cancellation Fee ($)</label>
                    <input
                      type="number"
                      value={cancelFee}
                      onChange={(e) => setCancelFee(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#020617] border border-white/10 text-white focus:outline-none"
                    />
                  </div>
                </>
              )}

              {activeModal === "payment" && (
                <>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={stripeEnabled}
                        onChange={(e) => setStripeEnabled(e.target.checked)}
                        className="rounded accent-blue-500 w-4 h-4"
                      />
                      <span className="text-white font-medium">Enable Stripe Card Processing</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={cashEnabled}
                        onChange={(e) => setCashEnabled(e.target.checked)}
                        className="rounded accent-blue-500 w-4 h-4"
                      />
                      <span className="text-white font-medium">Enable Cash / Check on Delivery</span>
                    </label>
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Operating Currency</label>
                    <input
                      type="text"
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#020617] border border-white/10 text-white focus:outline-none"
                    />
                  </div>
                </>
              )}

              {activeModal === "sms" && (
                <>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">SMS Provider</label>
                    <input
                      type="text"
                      value={smsProvider}
                      onChange={(e) => setSmsProvider(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#020617] border border-white/10 text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Sender Phone Number</label>
                    <input
                      type="text"
                      value={smsSenderId}
                      onChange={(e) => setSmsSenderId(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#020617] border border-white/10 text-white focus:outline-none"
                    />
                  </div>
                </>
              )}

              {activeModal === "email" && (
                <>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">SMTP Host</label>
                    <input
                      type="text"
                      value={smtpHost}
                      onChange={(e) => setSmtpHost(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#020617] border border-white/10 text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">From Email Address</label>
                    <input
                      type="email"
                      value={emailSender}
                      onChange={(e) => setEmailSender(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#020617] border border-white/10 text-white focus:outline-none"
                    />
                  </div>
                </>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleSave(activeModal || "Settings")}
                className="px-4 py-1.5 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white text-xs font-semibold shadow-md shadow-orange-500/20 active:scale-95 transition-all"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
