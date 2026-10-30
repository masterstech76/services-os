"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Star,
  ShieldCheck,
  Search,
  ThumbsUp,
  MapPin,
  Calendar,
  CheckCircle2,
  Filter,
  MessageSquare,
  ArrowRight,
  ExternalLink,
  ChevronDown,
} from "lucide-react";
import { businessConfig } from "@config/business.config";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface GoogleReviewItem {
  id: string;
  author: string;
  avatarLetter: string;
  avatarColor: string;
  isLocalGuide: boolean;
  reviewsCount: number;
  rating: number;
  timeAgo: string;
  service: string;
  serviceSlug: string;
  workOrder: string;
  neighborhood: string;
  positiveTags: string[];
  reviewText: string;
  helpfulCount: number;
  image?: string;
  ownerReply?: {
    author: string;
    date: string;
    text: string;
  };
}

const REVIEWS_DATA: GoogleReviewItem[] = [
  {
    id: "rev-1",
    author: "Verified Customer",
    avatarLetter: "D",
    avatarColor: "bg-blue-600",
    isLocalGuide: true,
    reviewsCount: 38,
    rating: 5,
    timeAgo: "3 days ago",
    service: "AC Repair & Diagnostic",
    serviceSlug: "/services/ac-repair",
    workOrder: "#WO-1004",
    neighborhood: "Brickell, Miami",
    positiveTags: ["Professionalism", "Punctuality", "Quality", "Value"],
    reviewText:
      "AC completely stopped cooling on a scorching 92° Sunday afternoon. I booked through their portal at 11:00 AM, and Carlos arrived in his fully stocked van by 11:35 AM. He immediately identified the blown dual run capacitor, tested compressor winding impedance, and had cool 56° air blasting within 40 minutes. Zero surprise fees — exact upfront quote before touching anything.",
    helpfulCount: 24,
    image: "/images/svc-ac-repair.jpg",
    ownerReply: {
      author: "ServicePro OS (Owner)",
      date: "3 days ago",
      text: "Thank you David! Glad Carlos was able to get to Brickell within 35 minutes and swap out that capacitor before peak afternoon heat. Enjoy the crisp 56° air!",
    },
  },
  {
    id: "rev-2",
    author: "Service Client U",
    avatarLetter: "E",
    avatarColor: "bg-rose-600",
    isLocalGuide: true,
    reviewsCount: 19,
    rating: 5,
    timeAgo: "1 week ago",
    service: "Seasonal AC Tune-Up",
    serviceSlug: "/services/ac-tuneup",
    workOrder: "#WO-1002",
    neighborhood: "Downtown Miami",
    positiveTags: ["Punctuality", "Quality", "Responsiveness"],
    reviewText:
      "We take preventive maintenance seriously in Florida. Marcus arrived on time wearing shoe covers. He performed a 21-point inspection, flushed our condensate drain with biocidal cleaner, rinsed the outdoor coils, and emailed high-res before/after photos with motor amp draw readings on his tablet. Best HVAC contractor experience in 10 years in South Florida.",
    helpfulCount: 31,
    image: "/images/svc-ac-tuneup.jpg",
    ownerReply: {
      author: "ServicePro OS (Owner)",
      date: "6 days ago",
      text: "Elena, thank you for trusting us with your seasonal tune-up! Keeping those coils rinsed and the drain lines clean keeps your electric bills low all summer long.",
    },
  },
  {
    id: "rev-3",
    author: "Service Client V",
    avatarLetter: "M",
    avatarColor: "bg-emerald-600",
    isLocalGuide: false,
    reviewsCount: 7,
    rating: 5,
    timeAgo: "2 weeks ago",
    service: "Smart Thermostat Installation",
    serviceSlug: "/services/thermostat-install",
    workOrder: "#WO-1001",
    neighborhood: "Coral Gables",
    positiveTags: ["Professionalism", "Quality"],
    reviewText:
      "Our 1950s Coral Gables house did not have a dedicated 24V common wire (C-wire) for modern smart thermostats. Carlos fished the new low-voltage wire cleanly, installed our Nest Learning Thermostat, and paired it with our phones before leaving. Transparent pricing with deposit applied directly to final bill.",
    helpfulCount: 16,
    image: "/images/svc-thermostat-install.jpg",
    ownerReply: {
      author: "ServicePro OS (Owner)",
      date: "2 weeks ago",
      text: "Marcus, historic homes in Coral Gables always need a gentle hand with low-voltage wiring. Enjoy the smart humidity scheduling!",
    },
  },
  {
    id: "rev-4",
    author: "Service Client S",
    avatarLetter: "S",
    avatarColor: "bg-amber-600",
    isLocalGuide: true,
    reviewsCount: 52,
    rating: 5,
    timeAgo: "3 weeks ago",
    service: "Refrigerant Leak Repair",
    serviceSlug: "/services/refrigerant-recharge",
    workOrder: "#WO-0994",
    neighborhood: "Coconut Grove",
    positiveTags: ["Honesty", "Professionalism", "Value"],
    reviewText:
      "Another company insisted our entire 6-year-old system was finished and needed an $8,000 replacement. ServicePro OS came out for a second opinion, found a microscopic Schrader core leak at the low-side service valve, replaced the valve core, pulled a 450-micron deep vacuum, and restored optimal R-410A charge. Honest contractors are rare — ServicePro OS is the real deal.",
    helpfulCount: 47,
    image: "/images/svc-refrigerant-recharge.jpg",
    ownerReply: {
      author: "ServicePro OS (Owner)",
      date: "3 weeks ago",
      text: "Sophia, we live by upfront honesty. A $15 Schrader valve should never turn into an $8,000 system replacement. Thank you for your trust!",
    },
  },
  {
    id: "rev-5",
    author: "Service Client Q",
    avatarLetter: "A",
    avatarColor: "bg-purple-600",
    isLocalGuide: false,
    reviewsCount: 12,
    rating: 5,
    timeAgo: "1 month ago",
    service: "Emergency AC Repair",
    serviceSlug: "/services/emergency-hvac",
    workOrder: "#WO-0988",
    neighborhood: "Miami Beach",
    positiveTags: ["Fast Arrival", "Quality", "Clean Work"],
    reviewText:
      "Our South Beach restaurant walk-in split condenser shut down on a Saturday night with 80 dinner reservations. Dispatch routed Carlos who had the high-pressure cutout reset and replaced a burned contactor in 45 minutes flat. Saved thousands in inventory.",
    helpfulCount: 38,
    image: "/images/svc-commercial-hvac.jpg",
    ownerReply: {
      author: "ServicePro OS (Owner)",
      date: "1 month ago",
      text: "Anthony, commercial kitchens in Miami can't afford downtime. We keep our vans stocked with commercial 2-pole contactors 24/7. Always happy to keep your kitchen operating smoothly!",
    },
  },
  {
    id: "rev-6",
    author: "Service Client W",
    avatarLetter: "J",
    avatarColor: "bg-teal-600",
    isLocalGuide: true,
    reviewsCount: 29,
    rating: 5,
    timeAgo: "1 month ago",
    service: "Whole-Home Duct Cleaning",
    serviceSlug: "/services/duct-cleaning",
    workOrder: "#WO-0975",
    neighborhood: "Kendall",
    positiveTags: ["Air Quality", "Punctuality", "Cleanliness"],
    reviewText:
      "After remodeling, our air was full of drywall dust and my son's allergies flared up. ServicePro OS brought their negative-pressure HEPA truck, sealed all supply boots, brushed the branch lines, and sanitized the evaporator coil with natural botanical disinfectant. Night and day air difference.",
    helpfulCount: 19,
    image: "/images/svc-duct-cleaning.jpg",
    ownerReply: {
      author: "ServicePro OS (Owner)",
      date: "1 month ago",
      text: "Jessica, post-renovation dust can clog cooling coils fast. Glad the family is breathing clean, allergen-free air!",
    },
  },
];

const STAR_DISTRIBUTION = [
  { stars: 5, count: 1184, percentage: 95 },
  { stars: 4, count: 52, percentage: 4 },
  { stars: 3, count: 8, percentage: 1 },
  { stars: 2, count: 3, percentage: 0 },
  { stars: 1, count: 1, percentage: 0 },
];

const TOPIC_CHIPS = [
  "All",
  "AC Repair",
  "Tune-Up",
  "Thermostat",
  "Refrigerant",
  "Emergency",
  "Punctuality",
  "Fair Price",
];

const TOPIC_KEYWORDS: Record<string, string[]> = {
  "AC Repair": ["repair", "capacitor", "cooling", "diagnostic", "compressor"],
  "Tune-Up": ["tune-up", "maintenance", "inspection", "preventive", "coil"],
  "Thermostat": ["thermostat", "nest", "smart", "c-wire", "controls"],
  "Refrigerant": ["refrigerant", "freon", "leak", "r-410a", "charge"],
  "Emergency": ["emergency", "sunday", "saturday", "weekend", "urgent"],
  "Punctuality": ["on time", "punctual", "arrival", "fast", "minutes"],
  "Fair Price": ["upfront", "fair", "transparent", "honest", "quote", "deposit"],
};

export default function ReviewsPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedTopic, setSelectedTopic] = React.useState<string>("All");
  const [helpfulLikes, setHelpfulLikes] = React.useState<Record<string, number>>({});

  const filteredReviews = React.useMemo(() => {
    return REVIEWS_DATA.filter((rev) => {
      const matchesSearch =
        searchQuery === "" ||
        rev.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rev.reviewText.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rev.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rev.neighborhood.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTopic =
        selectedTopic === "All" ||
        (() => {
          const keywords = TOPIC_KEYWORDS[selectedTopic] || [selectedTopic.toLowerCase()];
          const haystack = `${rev.service} ${rev.reviewText} ${rev.positiveTags.join(" ")} ${rev.author} ${rev.neighborhood}`.toLowerCase();
          return keywords.some((kw) => haystack.includes(kw.toLowerCase()));
        })();

      return matchesSearch && matchesTopic;
    });
  }, [searchQuery, selectedTopic]);

  function handleHelpful(id: string, initialCount: number) {
    setHelpfulLikes((prev) => {
      const current = prev[id] ?? initialCount;
      return { ...prev, [id]: current + 1 };
    });
  }

  return (
    <div className="min-h-screen bg-[#0C1523] text-white selection:bg-[#F97316] selection:text-white pb-20">
      <Breadcrumbs items={[{ label: "Customer Reviews" }]} />

      {/* Google Maps Style Header Strip with Dark Glassmorphism */}
      <section className="relative bg-[#0C1523] border-b border-white/10 pt-8 pb-10 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#F97316]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto space-y-6 relative z-10">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
            {/* Left: Overall Rating Block */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="font-heading text-2xl font-black text-white">
                  {businessConfig.businessName}
                </span>
                <span className="inline-flex items-center gap-1 rounded bg-sky-500/20 text-sky-400 border border-sky-500/30 px-2 py-0.5 text-[11px] font-bold">
                  ✓ Google Verified Business
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {businessConfig.address} • State Lic #{businessConfig.licenseNumber}
              </p>

              {/* Big Rating Summary */}
              <div className="flex items-center gap-4 pt-2">
                <span className="font-heading text-5xl sm:text-6xl font-black text-white">
                  4.9
                </span>
                <div>
                  <div className="flex items-center gap-1 text-amber-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="h-5 w-5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-slate-300 block mt-1">
                    Based on 1,248 verified customer reviews
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Star Distribution Histogram (Google Maps Style) */}
            <div className="w-full md:w-72 space-y-1.5 bg-[#0F172A]/80 backdrop-blur-xl p-4 rounded-2xl border border-white/10 shadow-lg">
              {STAR_DISTRIBUTION.map((row) => (
                <div key={row.stars} className="flex items-center gap-2.5 text-xs">
                  <span className="w-4 font-mono font-bold text-slate-400 text-right">
                    {row.stars}
                  </span>
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400 shrink-0" />
                  <div className="h-2 flex-1 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-400 rounded-full"
                      style={{ width: `${row.percentage}%` }}
                    />
                  </div>
                  <span className="w-10 text-[11px] font-mono text-slate-400 text-right">
                    {row.count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search reviews (e.g. capacitor, Carlos, Brickell)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-10 text-xs rounded-xl bg-[#0F172A] border-white/15 text-white placeholder:text-slate-500 focus:border-[#F97316]"
              />
            </div>

            <Button
              asChild
              className="rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white font-bold text-xs h-10 px-5 shadow-sm"
            >
              <Link href="/book">
                Book Verified Service
              </Link>
            </Button>
          </div>

          {/* Topic Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1">
            <span className="text-xs font-bold text-slate-400 shrink-0 flex items-center gap-1">
              <Filter className="h-3.5 w-3.5 text-[#F97316]" />
              <span>Filter topics:</span>
            </span>
            {TOPIC_CHIPS.map((chip) => (
              <button
                key={chip}
                onClick={() => setSelectedTopic(chip)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all shrink-0 ${
                  selectedTopic === chip
                    ? "bg-[#F97316] text-white shadow-xs"
                    : "bg-white/5 border border-white/10 text-slate-300 hover:border-white/20 hover:bg-white/10"
                }`}
              >
                {chip}
              </button>
            ))}
          </div>

          {/* ─────────────────────────────────────────────────────────────
              WORKER PROFILES WITH REVIEWS SECTION
          ───────────────────────────────────────────────────────────── */}
          <div className="pt-4 border-t border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-orange-400 flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 fill-current" />
                Browse Reviews by Certified Field Technician
              </span>
              <span className="text-[11px] text-slate-400 hidden sm:inline">
                Click any technician to view their verified homeowner reviews
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { slug: "carlos-mendez", name: "Lead Field Specialist", title: "Lead Diagnostic Master", van: "Fleet Unit Alpha", rating: "4.96", count: 148, spec: "Electrical & Inverter Diagnostics" },
                { slug: "marcus-vance", name: "Senior HVAC Specialist", title: "Senior Maintenance Spec", van: "Fleet Unit Beta", rating: "4.94", count: 112, spec: "Tune-Ups & IAQ Balancing" },
                { slug: "elena-rivera", name: "Commercial Systems Specialist", title: "Commercial Lead Mechanic", van: "Fleet Unit Gamma", rating: "4.98", count: 94, spec: "Commercial Rooftop RTUs" },
                { slug: "david-kim", name: "Service Client H", title: "Heat Pump & Inverter Tech", van: "Fleet Unit Delta", rating: "4.92", count: 78, spec: "Mini-Split Heat Pumps" },
              ].map((w) => (
                <Link
                  key={w.slug}
                  href={`/reviews/${w.slug}`}
                  className="p-3.5 rounded-2xl bg-[#0F172A]/80 hover:bg-[#0F172A] border border-white/10 hover:border-orange-500/50 transition-all group flex flex-col justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white group-hover:text-[#F97316] transition-colors">{w.name}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-300 font-bold">{w.van}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-1">{w.title}</p>
                    <div className="flex items-center gap-1.5 pt-1">
                      <div className="flex items-center text-[#F97316] gap-0.5">
                        <Star className="w-3 h-3 fill-current" />
                      </div>
                      <span className="text-xs font-bold text-white">{w.rating}</span>
                      <span className="text-[11px] text-slate-400">({w.count} reviews)</span>
                    </div>
                  </div>
                  <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-orange-400 font-semibold">
                    <span>View Reviews</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Stream (Google Maps Feed Layout) */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        <div className="flex items-center justify-between text-xs text-slate-400 font-semibold border-b border-white/10 pb-3">
          <span>Showing {filteredReviews.length} customer reviews</span>
          <span>Sorted by: Most Relevant</span>
        </div>

        {filteredReviews.length === 0 ? (
          <div className="py-12 text-center text-slate-400 space-y-2">
            <MessageSquare className="h-8 w-8 mx-auto text-slate-500" />
            <p className="font-bold text-white">No matching reviews found</p>
            <p className="text-xs">Try searching for a different keyword or topic filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredReviews.map((rev) => {
              const currentHelpful = helpfulLikes[rev.id] ?? rev.helpfulCount;

              return (
                <article
                  key={rev.id}
                  className="rounded-3xl border border-white/10 bg-[#0F172A]/80 backdrop-blur-xl p-6 shadow-xl space-y-4 hover:border-white/20 transition-all text-white"
                >
                  {/* Review Header (User Profile & Star Rating) */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-11 w-11 rounded-full ${rev.avatarColor} text-white font-bold flex items-center justify-center text-sm shadow-sm ring-2 ring-white/10`}
                      >
                        {rev.avatarLetter}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-sm text-white">{rev.author}</h3>
                          {rev.isLocalGuide && (
                            <span className="text-[10px] font-bold text-[#F97316] bg-[#F97316]/10 px-2 py-0.5 rounded border border-[#F97316]/20">
                              ★ Local Guide • {rev.reviewsCount} reviews
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                          <MapPin className="h-3 w-3 text-slate-400" />
                          <span>{rev.neighborhood}</span>
                          <span>•</span>
                          <span>{rev.timeAgo}</span>
                        </div>
                      </div>
                    </div>

                    <span className="text-xs font-mono font-bold text-slate-300 bg-white/5 px-2.5 py-1 rounded-lg border border-white/10">
                      {rev.workOrder}
                    </span>
                  </div>

                  {/* Star Rating & Positive Tag Highlights */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-0.5 text-amber-400">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} className="h-4 w-4 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <span className="text-xs font-bold text-white">
                        {rev.service}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 text-[11px]">
                      <span className="text-slate-400 font-semibold">Positive:</span>
                      {rev.positiveTags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="bg-white/5 border border-white/10 text-slate-300 font-medium px-2 py-0.5 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Testimonial Text */}
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {rev.reviewText}
                  </p>

                  {/* Attached Photo Evidence */}
                  {rev.image && (
                    <div className="relative h-48 sm:h-64 w-full sm:w-80 rounded-2xl overflow-hidden border border-white/10">
                      <Image
                        src={rev.image}
                        alt={`${rev.service} photo`}
                        fill
                        sizes="(max-width: 640px) 100vw, 320px"
                        className="object-cover"
                      />
                    </div>
                  )}

                  {/* Owner Verified Response */}
                  {rev.ownerReply && (
                    <div className="rounded-2xl border-l-4 border-l-[#F97316] border border-white/10 bg-[#0C1523]/80 p-4 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between text-white font-bold">
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 className="h-4 w-4 text-[#F97316]" />
                          <span>{rev.ownerReply.author}</span>
                        </div>
                        <span className="text-[11px] text-slate-400 font-normal">
                          {rev.ownerReply.date}
                        </span>
                      </div>
                      <p className="text-slate-300 leading-relaxed">
                        {rev.ownerReply.text}
                      </p>
                    </div>
                  )}

                  {/* Card Footer: Helpful button & Link to full detail */}
                  <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                    <button
                      type="button"
                      onClick={() => handleHelpful(rev.id, rev.helpfulCount)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 text-slate-300 hover:border-[#F97316] hover:text-[#F97316] transition-colors font-semibold"
                    >
                      <ThumbsUp className="h-3.5 w-3.5" />
                      <span>Helpful ({currentHelpful})</span>
                    </button>

                    <Link
                      href={`/reviews/${rev.id}`}
                      className="text-[#F97316] hover:text-[#EA580C] font-bold flex items-center gap-1 transition-colors"
                    >
                      <span>Full Case Spotlight</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
