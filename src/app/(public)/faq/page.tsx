"use client";

import * as React from "react";
import Link from "next/link";
import {
  HelpCircle,
  Search,
  ChevronDown,
  ChevronUp,
  Phone,
  Calendar,
  ShieldCheck,
  CreditCard,
  Clock,
  Sparkles,
  DollarSign,
  Wrench,
  Building,
  Flame,
  CheckCircle2,
} from "lucide-react";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { businessConfig } from "@config/business.config";

interface FAQItem {
  id: string;
  category:
    | "pricing"
    | "emergency"
    | "ac-services"
    | "commercial-duct"
    | "heating-refrigerant"
    | "booking-warranty";
  question: string;
  answer: string;
}

const CATEGORIES = [
  { id: "all", label: "All Questions", icon: HelpCircle },
  { id: "pricing", label: "Pricing & Subscriptions", icon: DollarSign },
  { id: "emergency", label: "Emergency & Dispatch", icon: Clock },
  { id: "ac-services", label: "AC Repair & Tune-Up", icon: Wrench },
  { id: "commercial-duct", label: "Commercial & Duct IAQ", icon: Building },
  { id: "heating-refrigerant", label: "Heating & Refrigerant", icon: Flame },
  { id: "booking-warranty", label: "Booking & Warranties", icon: ShieldCheck },
];

const ALL_FAQS: FAQItem[] = [
  // ─────────────────────────────────────────────────────────────
  // 1. PRICING & SUBSCRIPTIONS
  // ─────────────────────────────────────────────────────────────
  {
    id: "faq-price-1",
    category: "pricing",
    question: "Is there a free trial for ServicePro OS?",
    answer:
      "Yes! Every plan includes a 14-day full-access free trial. No credit card is required to get started.",
  },
  {
    id: "faq-price-2",
    category: "pricing",
    question: "Can I change or cancel my plan anytime?",
    answer:
      "Yes. You can upgrade, downgrade, or cancel your subscription at any time with a single click from your billing dashboard.",
  },
  {
    id: "faq-price-3",
    category: "pricing",
    question: "What payment methods do you support?",
    answer:
      "We accept all major credit cards, debit cards, Apple Pay, Google Pay, and bank ACH transfers powered securely by Stripe.",
  },
  {
    id: "faq-price-4",
    category: "pricing",
    question: "Are there any hidden setup fees?",
    answer:
      "None. All features, onboarding guides, and standard customer support are included in your monthly subscription.",
  },
  {
    id: "faq-price-5",
    category: "pricing",
    question: "How does your service repair pricing work? Are there surprise fees?",
    answer:
      "We operate on 100% upfront flat-rate pricing. When our technician arrives and diagnoses the issue, you receive a written quote itemizing parts, labor, and sales tax before any work begins. There are zero surprise fees, no hidden travel surcharges, and no ticking hourly clocks.",
  },
  {
    id: "faq-price-6",
    category: "pricing",
    question: "What is the diagnostic deposit, and is it applied to my repair?",
    answer:
      "Our standard diagnostic dispatch fee is $129 ($169 for Priority Emergency Dispatch). When you approve the recommended repair during the visit, 100% of your diagnostic fee is credited directly toward the final repair invoice balance.",
  },

  // ─────────────────────────────────────────────────────────────
  // 2. EMERGENCY & DISPATCH
  // ─────────────────────────────────────────────────────────────
  {
    id: "faq-emerg-1",
    category: "emergency",
    question: "How fast can an emergency technician arrive at my property?",
    answer:
      "Our emergency mobile vans are geographically staged across the metro area. In active cooling emergencies, average arrival time is under 45-60 minutes.",
  },
  {
    id: "faq-emerg-2",
    category: "emergency",
    question: "Do you charge extra hidden fees for night or weekend calls?",
    answer:
      `No. ${businessConfig.businessName} operates on transparent flat-rate pricing. You will receive an exact diagnostic fee with zero surprise travel surcharges regardless of the hour or day.`,
  },
  {
    id: "faq-emerg-3",
    category: "emergency",
    question: "What should I do while waiting for the emergency technician?",
    answer:
      "Turn your thermostat to 'OFF' to prevent compressor burnout, especially if you notice ice on copper lines or water leaking near indoor electrical components.",
  },
  {
    id: "faq-emerg-4",
    category: "emergency",
    question: "Do you offer 24/7 emergency service across Miami and South Florida?",
    answer:
      `Yes! AC breakdowns in South Florida humidity can become dangerous fast. Our on-call dispatch fleet operates 24 hours a day, 7 days a week, 365 days a year. Call our dispatch hotline at ${businessConfig.phone} or select an emergency same-day slot in the booking wizard.`,
  },

  // ─────────────────────────────────────────────────────────────
  // 3. AC REPAIR & TUNE-UP
  // ─────────────────────────────────────────────────────────────
  {
    id: "faq-ac-1",
    category: "ac-services",
    question: "How long does a comprehensive AC tune-up take?",
    answer:
      "Our master technician spends approximately 60 to 75 minutes performing our full 21-point mechanical and electrical checklist, including coil cleaning, amperage draws, capacitor health, and delta-T airflow analysis.",
  },
  {
    id: "faq-ac-2",
    category: "ac-services",
    question: "What is your Breakdown-Free Guarantee?",
    answer:
      "If your AC system breaks down within 60 days of our tune-up service, we come back for free and credit 100% of your tune-up cost toward any required repair.",
  },
  {
    id: "faq-ac-3",
    category: "ac-services",
    question: "What if my AC system cannot be repaired?",
    answer:
      "If your compressor has suffered catastrophic internal failure or your evaporator coil is beyond safe repair, our technician provides a transparent, itemized replacement estimate with same-day emergency mobile AC unit options.",
  },
  {
    id: "faq-ac-4",
    category: "ac-services",
    question: "Do you offer a warranty on AC repair work?",
    answer:
      `Every repair performed by ${businessConfig.businessName} is backed by our 1-year limited parts and labor warranty, along with manufacturer warranties on all OEM parts.`,
  },

  // ─────────────────────────────────────────────────────────────
  // 4. COMMERCIAL & DUCT SOLUTIONS
  // ─────────────────────────────────────────────────────────────
  {
    id: "faq-comm-1",
    category: "commercial-duct",
    question: "Do you service commercial properties after hours to avoid business disruption?",
    answer:
      "Yes. Our commercial technicians operate 24/7. We can schedule rooftop maintenance, filter changes, and major repairs outside your operating hours so your tenants and customers are never disturbed.",
  },
  {
    id: "faq-comm-2",
    category: "commercial-duct",
    question: "Can you provide preventive maintenance service agreements for commercial facilities?",
    answer:
      "Yes! We design quarterly, semi-annual, and monthly preventative service agreements for office complexes, retail centers, medical suites, and restaurant refrigeration.",
  },
  {
    id: "faq-comm-3",
    category: "commercial-duct",
    question: "How often should residential air ducts be professionally cleaned?",
    answer:
      "The National Air Duct Cleaners Association (NADCA) recommends professional cleaning every 2 to 3 years, or immediately following home renovations or moving into a new residence.",
  },
  {
    id: "faq-comm-4",
    category: "commercial-duct",
    question: "Does your duct cleaning equipment remove mold, pet dander, and construction dust?",
    answer:
      "Yes. We use commercial negative-air HEPA collection machines and rotary brush agitators to pull all contaminants out of your ducts into self-contained filtration units.",
  },

  // ─────────────────────────────────────────────────────────────
  // 5. HEATING & REFRIGERANT
  // ─────────────────────────────────────────────────────────────
  {
    id: "faq-heat-1",
    category: "heating-refrigerant",
    question: "Can you repair both electric furnaces and heat pump systems?",
    answer:
      "Yes. Our technicians are factory-trained on electric air handlers, auxiliary heat strips, variable-speed heat pumps, and dual-fuel systems.",
  },
  {
    id: "faq-heat-2",
    category: "heating-refrigerant",
    question: "What is included in the $129 heating diagnostic call?",
    answer:
      "Our certified heating technician conducts comprehensive heating element testing, thermal sequencer check, limit switch diagnostics, blower motor verification, and thermostat heat-call continuity test.",
  },
  {
    id: "faq-heat-3",
    category: "heating-refrigerant",
    question: "Why shouldn't I just keep adding refrigerant without fixing the leak?",
    answer:
      "AC systems are closed loops that never 'consume' refrigerant. Adding freon without fixing the leak is illegal under EPA regulations, damages the compressor, and wastes money as gas leaks back into the atmosphere.",
  },
  {
    id: "faq-heat-4",
    category: "heating-refrigerant",
    question: "What if my old thermostat doesn't have a C-wire (common wire)?",
    answer:
      "No problem. Many older homes lack a dedicated C-wire. Our technicians carry C-wire power extender kits (PEKs) and can add continuous 24V power without cutting through drywall.",
  },
  {
    id: "faq-heat-5",
    category: "heating-refrigerant",
    question: "Can you install customer-provided smart thermostats (Nest, Ecobee, Honeywell)?",
    answer:
      "Yes. We install and configure all customer-purchased models and will ensure proper multi-stage cooling and heat pump staging.",
  },

  // ─────────────────────────────────────────────────────────────
  // 6. BOOKING & WARRANTIES
  // ─────────────────────────────────────────────────────────────
  {
    id: "faq-book-1",
    category: "booking-warranty",
    question: "Is the $20 booking deposit refundable if I cancel?",
    answer:
      "Yes. You can cancel or reschedule through your Customer Portal up to 2 hours before your appointment window for a 100% full refund.",
  },
  {
    id: "faq-book-2",
    category: "booking-warranty",
    question: "What happens if the technician arrives later than the guaranteed window?",
    answer:
      "We stand behind our punctuality. If our technician arrives outside your 60-minute or 2-hour window, we apply an automatic $50 credit toward your service bill.",
  },
  {
    id: "faq-book-3",
    category: "booking-warranty",
    question: "Do I have to pay before the technician inspects my system?",
    answer:
      "Never. Only the $20 reservation hold is collected online. Any repair work is quoted on-site with flat-rate pricing, and you only pay after approving the fix and seeing cold air restored.",
  },
  {
    id: "faq-book-4",
    category: "booking-warranty",
    question: "Can I reschedule or cancel my appointment online?",
    answer:
      "Yes. You can manage, reschedule, or cancel your booking through your Customer Portal account up to 2 hours before the scheduled appointment window without any penalty.",
  },
  {
    id: "faq-book-5",
    category: "booking-warranty",
    question: "What warranties do you provide on repairs and replacement parts?",
    answer:
      "All repair parts and workmanship carry our 30-Day '100% Fixed Right or It's Free' guarantee and 1-year limited workmanship warranty. If the same issue returns within 30 days, we come back immediately at no additional cost.",
  },
  {
    id: "faq-book-6",
    category: "booking-warranty",
    question: "Are your technicians licensed, insured, and background-checked?",
    answer:
      `Every ${businessConfig.businessName} technician is fully licensed (State Mechanical License #${businessConfig.licenseNumber}), EPA Universal 608 certified, and insured up to $2,000,000 general liability. All technicians undergo strict multi-state criminal background checks and random drug screenings.`,
  },
];

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [activeCategory, setActiveCategory] = React.useState<string>("all");
  const [openIds, setOpenIds] = React.useState<Record<string, boolean>>({
    "faq-price-1": true,
    "faq-emerg-1": true,
  });

  const toggleAccordion = (id: string) => {
    setOpenIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredFaqs = ALL_FAQS.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat =
      activeCategory === "all" || faq.category === activeCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="min-h-screen bg-[#0C1523] text-white selection:bg-[#F97316] selection:text-white pb-20">
      <Breadcrumbs items={[{ label: "Frequently Asked Questions" }]} />

      {/* Hero Header with Ambient Lighting */}
      <section className="relative bg-[#0C1523] py-16 px-4 sm:px-6 border-b border-white/10 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#F97316]/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-4xl mx-auto text-center space-y-4 relative z-10">
          <span className="text-xs font-bold text-[#F97316] uppercase tracking-wider bg-white/5 px-3.5 py-1 rounded-full border border-white/10 inline-flex items-center gap-1.5">
            <HelpCircle className="h-3.5 w-3.5" />
            Central Knowledge Base &amp; Help Desk
          </span>

          <h1 className="font-heading text-3xl sm:text-5xl font-black text-white tracking-tight">
            Frequently Asked Questions
          </h1>

          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto font-normal">
            Find immediate answers on pricing, software subscriptions, dispatch windows, AC warranties, and trade certifications.
          </p>

          {/* Interactive Search Bar */}
          <div className="max-w-xl mx-auto pt-4">
            <div className="relative">
              <Search className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by topic (e.g., 'free trial', 'emergency arrival', 'warranty', 'deposit')..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#0F172A] border border-white/15 rounded-2xl pl-11 pr-4 py-3 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main 2-Column Knowledge Base Layout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Sticky Category Sidebar (lg:col-span-4) */}
          <aside className="lg:col-span-4 lg:sticky lg:top-24 space-y-4">
            <div className="p-5 rounded-3xl bg-[#0F172A]/90 border border-white/10 shadow-xl backdrop-blur-xl space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <span className="text-xs font-bold text-white uppercase tracking-wider">Browse by Category</span>
                <span className="text-xs text-[#F97316] font-semibold">{ALL_FAQS.length} Questions</span>
              </div>

              <div className="space-y-1.5">
                {CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  const count =
                    cat.id === "all"
                      ? ALL_FAQS.length
                      : ALL_FAQS.filter((f) => f.category === cat.id).length;
                  const isActive = activeCategory === cat.id;

                  return (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`w-full px-4 py-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-between border text-left cursor-pointer ${
                        isActive
                          ? "bg-[#F97316] text-white border-[#F97316] shadow-md shadow-orange-500/20"
                          : "bg-white/[0.03] border-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="h-4 w-4 shrink-0" />
                        <span>{cat.label}</span>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                          isActive
                            ? "bg-white/20 text-white"
                            : "bg-white/10 text-slate-400"
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Contact Desk Helper */}
            <div className="p-5 rounded-3xl bg-[#0F172A]/80 border border-white/10 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-white">
                <Clock className="w-4 h-4 text-[#F97316]" />
                <span>24/7 Dispatch Desk</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Need immediate emergency response or have custom equipment specifications?
              </p>
              <a
                href={`tel:${businessConfig.phone.replace(/[^0-9]/g, "")}`}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold border border-white/10 transition-all"
              >
                <Phone className="w-3.5 h-3.5 text-[#F97316]" />
                <span>Call {businessConfig.phone}</span>
              </a>
            </div>
          </aside>

          {/* Right Column: Categorized FAQ Accordions Stream (lg:col-span-8) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between pb-2">
              <h2 className="text-xl font-bold text-white">
                {CATEGORIES.find((c) => c.id === activeCategory)?.label}
              </h2>
              <span className="text-xs text-slate-400">
                Showing {filteredFaqs.length} answered questions
              </span>
            </div>

            <div className="space-y-3">
              {filteredFaqs.length === 0 ? (
                <div className="text-center py-12 rounded-3xl bg-[#0F172A]/40 border border-white/10 p-6 space-y-3">
                  <HelpCircle className="h-8 w-8 text-slate-500 mx-auto" />
                  <p className="text-sm font-semibold text-slate-300">
                    No questions found matching &ldquo;{searchTerm}&rdquo;
                  </p>
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setActiveCategory("all");
                    }}
                    className="text-xs text-[#F97316] font-bold hover:underline"
                  >
                    Reset search &amp; filters
                  </button>
                </div>
              ) : (
                filteredFaqs.map((faq) => {
                  const isOpen = openIds[faq.id];
                  return (
                    <div
                      key={faq.id}
                      className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                        isOpen
                          ? "bg-[#0F172A]/90 border-white/20 shadow-xl"
                          : "bg-[#0F172A]/40 border-white/10 hover:border-white/15"
                      }`}
                    >
                      <button
                        onClick={() => toggleAccordion(faq.id)}
                        className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-white focus:outline-none cursor-pointer"
                        aria-expanded={isOpen}
                      >
                        <span className="flex items-center gap-3">
                          <HelpCircle className="h-4 w-4 text-[#F97316] shrink-0" />
                          <span>{faq.question}</span>
                        </span>
                        <span className="p-1 rounded-lg bg-white/5 text-slate-400 shrink-0">
                          {isOpen ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </span>
                      </button>

                      {isOpen && (
                        <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-0 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-white/5 pl-12">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Inline Action Callout */}
            <div className="mt-8 rounded-3xl border border-white/10 bg-gradient-to-r from-orange-500/10 via-[#0F172A] to-white/5 p-6 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1">
                <h3 className="text-sm sm:text-base font-bold text-white">
                  Still have questions about a specific system?
                </h3>
                <p className="text-xs text-slate-300">
                  Our dispatch team is on standby 24/7 with zero waiting time.
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <Button
                  asChild
                  className="bg-[#F97316] hover:bg-[#EA580C] text-white font-bold text-xs rounded-xl px-5 py-2 shadow-md shadow-orange-500/20"
                >
                  <Link href="/contact">Contact Dispatch</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="border-white/15 bg-white/5 text-white hover:bg-white/10 text-xs rounded-xl px-5 py-2"
                >
                  <Link href="/book">Book Service</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
