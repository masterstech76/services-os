import * as React from "react";
import Link from "next/link";
import { Shield, Lock, Eye, FileText, CheckCircle2, Phone, Mail, ShieldCheck } from "lucide-react";
import { businessConfig } from "@config/business.config";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";

export const metadata = {
  title: `Privacy Policy | ${businessConfig.businessName}`,
  description: `Privacy Policy and data protection terms for ${businessConfig.businessName}. Learn how we protect your personal and payment information.`,
};

const PRIVACY_SECTIONS = [
  { id: "summary", label: "Summary of Commitment" },
  { id: "collect", label: "1. Information We Collect" },
  { id: "use", label: "2. How We Use Information" },
  { id: "sms", label: "3. SMS & Communication Consent" },
  { id: "security", label: "4. Data Security & Retention" },
  { id: "rights", label: "5. Your Privacy Rights" },
  { id: "contact", label: "6. Contact Privacy Officer" },
];

export default function PrivacyPolicyPage() {
  const lastUpdated = "October 19, 2026";
  const cleanPhoneHref = `tel:${businessConfig.phone.replace(/\D/g, "")}`;

  return (
    <div className="min-h-screen bg-[#0C1523] text-white selection:bg-[#F97316] selection:text-white pb-20">
      <Breadcrumbs items={[{ label: "Privacy Policy" }]} />

      {/* Header */}
      <section className="relative overflow-hidden pt-10 pb-12 px-6 sm:px-8 lg:px-12 border-b border-white/10">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#F97316]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-orange-500/10 border border-orange-500/20 px-3.5 py-1 text-xs font-bold text-[#F97316]">
            <Shield className="h-3.5 w-3.5" />
            <span>Customer Data Protection Standard</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-sm text-slate-400 font-medium">
            Effective Date: {lastUpdated} • Version 2.4 • Certified PCI-DSS Level 1 Compliance
          </p>
        </div>
      </section>

      {/* Full-Enterprise 2-Column Layout */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Fixed Navigation & Compliance Badges (lg:col-span-4) */}
          <aside className="lg:col-span-4 hidden lg:block">
            <div className="sticky top-28 space-y-6">
              <div className="p-6 rounded-3xl border border-white/10 bg-[#0F172A]/85 backdrop-blur-xl shadow-xl space-y-4">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                  Privacy Topics &amp; Sections
                </h3>
                <nav className="space-y-1.5 text-xs">
                  {PRIVACY_SECTIONS.map((sec) => (
                    <a
                      key={sec.id}
                      href={`#${sec.id}`}
                      className="block py-2 px-3 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition-colors font-medium"
                    >
                      {sec.label}
                    </a>
                  ))}
                </nav>
              </div>

              {/* Compliance Trust Badges */}
              <div className="p-5 rounded-3xl border border-white/10 bg-[#0F172A]/80 backdrop-blur-xl space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-white">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Security &amp; Trust Commitments</span>
                </div>
                <div className="space-y-2 text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>PCI-DSS Level 1 Payment Security</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>256-Bit TLS Encryption in Transit</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>Zero Data Selling Guarantee</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Right Column: Full-Width Clauses (lg:col-span-8) */}
          <main className="lg:col-span-8 space-y-8 text-slate-300 leading-relaxed text-sm">
            <div id="summary" className="bg-[#0F172A]/80 border border-white/10 rounded-3xl p-6 text-xs text-slate-300 space-y-2 backdrop-blur-xl shadow-xl scroll-mt-28">
              <p className="font-bold text-white text-sm">Summary of our Commitment:</p>
              <p className="leading-relaxed">
                At {businessConfig.businessName} (&quot;Company&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;), we respect your privacy and are committed to safeguarding your personal data. We never sell customer records, phone numbers, or email addresses to third-party data brokers.
              </p>
            </div>

            <div id="collect" className="space-y-4 scroll-mt-28">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-orange-500/20 text-[#F97316] text-xs font-black border border-orange-500/30">1</span>
                Information We Collect
              </h2>
              <p>We collect information necessary to provide, manage, and invoice heating, ventilation, and air conditioning services:</p>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
                <li><strong>Contact Details:</strong> Name, phone number, email address, and service delivery addresses.</li>
                <li><strong>HVAC Equipment Information:</strong> System make, model, tonnage, filter sizes, and photos taken during inspections.</li>
                <li><strong>Transaction &amp; Billing Data:</strong> Payment transaction identifiers, partial card numbers (last 4 digits only), and billing history. Complete card credentials are processed directly by our PCI-DSS Level 1 certified payment processor (Stripe) and are never stored on our servers.</li>
                <li><strong>Communications:</strong> SMS appointment reminders, dispatch notifications, technician arrival alerts, and customer service inquiries.</li>
              </ul>
            </div>

            <div id="use" className="space-y-4 scroll-mt-28">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-orange-500/20 text-[#F97316] text-xs font-black border border-orange-500/30">2</span>
                How We Use Your Information
              </h2>
              <p>Your information is used strictly for operational and service delivery purposes:</p>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
                <li>Scheduling and dispatching certified HVAC technicians to your premises.</li>
                <li>Sending real-time arrival estimates and live tracking links with your assigned technician&apos;s photo.</li>
                <li>Processing service diagnostics, repair estimates, invoices, and receipts.</li>
                <li>Administering our 1-year labor warranty and seasonal maintenance records.</li>
              </ul>
            </div>

            <div id="sms" className="space-y-4 scroll-mt-28">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-orange-500/20 text-[#F97316] text-xs font-black border border-orange-500/30">3</span>
                SMS &amp; Communication Consent
              </h2>
              <p>
                By booking a service or submitting your phone number, you consent to receive service-related transactional SMS messages (arrival alerts, quote approvals, invoices). Message frequency varies based on active job status. Message and data rates may apply. You may opt out at any time by replying STOP to any message or updating your preferences in your customer account.
              </p>
            </div>

            <div id="security" className="space-y-4 scroll-mt-28">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-orange-500/20 text-[#F97316] text-xs font-black border border-orange-500/30">4</span>
                Data Security &amp; Retention
              </h2>
              <p>
                We implement industry-standard technical safeguards including 256-bit TLS encryption in transit and AES-256 encryption at rest. Customer records are maintained for as long as needed to fulfill ongoing warranties, accounting obligations, and Florida statutory record-retention requirements.
              </p>
            </div>

            <div id="rights" className="space-y-4 scroll-mt-28">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-orange-500/20 text-[#F97316] text-xs font-black border border-orange-500/30">5</span>
                Your Privacy Rights
              </h2>
              <p>
                You may access, update, or request deletion of your personal data at any time via your Customer Portal or by contacting our administrative office. Florida homeowners may also request an itemized disclosure of collected records.
              </p>
            </div>

            <div id="contact" className="space-y-4 scroll-mt-28 pt-4 border-t border-white/10">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-orange-500/20 text-[#F97316] text-xs font-black border border-orange-500/30">6</span>
                Contact Privacy Officer
              </h2>
              <p>For questions regarding our privacy practices or data policies, contact us directly:</p>
              <div className="p-6 rounded-2xl bg-[#0F172A]/80 border border-white/10 space-y-2 text-xs">
                <p className="font-bold text-white">{businessConfig.businessName} Compliance Office</p>
                <p>Address: {businessConfig.address}, {businessConfig.city}, {businessConfig.state} {businessConfig.zipCodes[0]}</p>
                <p>
                  Email: <a href={`mailto:${businessConfig.email}`} className="text-[#F97316] font-bold hover:underline">{businessConfig.email}</a>
                </p>
                <p>
                  Phone: <a href={cleanPhoneHref} className="text-[#F97316] font-bold hover:underline">{businessConfig.phone}</a>
                </p>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
