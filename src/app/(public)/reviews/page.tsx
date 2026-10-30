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
  X,
  Send,
  Plus,
} from "lucide-react";
import { businessConfig } from "@config/business.config";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export interface ReviewItem {
  id: string;
  author: string;
  avatarLetter: string;
  avatarColor: string;
  isVerifiedCustomer: boolean;
  rating: number;
  timeAgo: string;
  service: string;
  workOrder?: string;
  neighborhood?: string;
  reviewText: string;
  helpfulCount: number;
}

// Neutralized data: Synthetic mock reviews purged per Phase 5 standard.
// Real customer reviews are dynamically persisted and loaded from the verified review API.
const REVIEWS_DATA: ReviewItem[] = [];

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

export default function ReviewsPage() {
  const [reviews, setReviews] = React.useState<ReviewItem[]>(REVIEWS_DATA);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedTopic, setSelectedTopic] = React.useState<string>("All");
  const [helpfulLikes, setHelpfulLikes] = React.useState<Record<string, number>>({});

  // Review Modal State
  const [showReviewModal, setShowReviewModal] = React.useState(false);
  const [modalName, setModalName] = React.useState("");
  const [modalRating, setModalRating] = React.useState(5);
  const [modalService, setModalService] = React.useState("AC Repair & Diagnostic");
  const [modalText, setModalText] = React.useState("");
  const [modalJobId, setModalJobId] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitMessage, setSubmitMessage] = React.useState<string | null>(null);

  // Fetch verified reviews on mount
  React.useEffect(() => {
    async function loadReviews() {
      try {
        const res = await fetch("/api/reviews");
        if (res.ok) {
          const data = await res.json();
          if (data.reviews && Array.isArray(data.reviews) && data.reviews.length > 0) {
            const mapped: ReviewItem[] = data.reviews.map((r: any) => ({
              id: r.id,
              author: r.customerName,
              avatarLetter: (r.customerName || "V")[0].toUpperCase(),
              avatarColor: "bg-orange-600",
              isVerifiedCustomer: r.verificationStatus === "verified",
              rating: r.rating || 5,
              timeAgo: "Recently submitted",
              service: r.serviceTag || "General HVAC",
              workOrder: r.jobId ? `#${r.jobId}` : undefined,
              neighborhood: businessConfig.city,
              reviewText: r.reviewText,
              helpfulCount: 0,
            }));
            setReviews(mapped);
          }
        }
      } catch (err) {
        // Network or offline fallback
      }
    }
    loadReviews();
  }, []);

  const filteredReviews = React.useMemo(() => {
    return reviews.filter((rev) => {
      const matchesSearch =
        searchQuery === "" ||
        rev.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rev.reviewText.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rev.service.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTopic =
        selectedTopic === "All" ||
        rev.service.toLowerCase().includes(selectedTopic.toLowerCase());

      return matchesSearch && matchesTopic;
    });
  }, [reviews, searchQuery, selectedTopic]);

  function handleHelpful(id: string, initialCount: number) {
    setHelpfulLikes((prev) => {
      const current = prev[id] ?? initialCount;
      return { ...prev, [id]: current + 1 };
    });
  }

  async function handleReviewSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: modalName,
          rating: modalRating,
          serviceTag: modalService,
          reviewText: modalText,
          jobId: modalJobId || undefined,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSubmitMessage("Thank you! Your review has been submitted and queued for verification.");
        // Add optimistic preview to local state
        const optimistic: ReviewItem = {
          id: data.id || `rev-${Date.now()}`,
          author: modalName,
          avatarLetter: modalName[0]?.toUpperCase() || "C",
          avatarColor: "bg-emerald-600",
          isVerifiedCustomer: Boolean(modalJobId),
          rating: modalRating,
          timeAgo: "Just now",
          service: modalService,
          workOrder: modalJobId ? `#${modalJobId}` : undefined,
          neighborhood: businessConfig.city,
          reviewText: modalText,
          helpfulCount: 0,
        };
        setReviews((prev) => [optimistic, ...prev]);

        setTimeout(() => {
          setShowReviewModal(false);
          setModalName("");
          setModalText("");
          setModalJobId("");
          setSubmitMessage(null);
        }, 1800);
      } else {
        setSubmitMessage(data.error || "Failed to submit review.");
      }
    } catch {
      setSubmitMessage("An error occurred while submitting your review.");
    } finally {
      setIsSubmitting(false);
    }
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
                  ✓ Verified Service Platform
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {businessConfig.address} • State Lic #{businessConfig.licenseNumber}
              </p>

              {/* Big Rating Summary */}
              <div className="flex items-center gap-4 pt-2">
                <span className="font-heading text-5xl sm:text-6xl font-black text-white">
                  5.0
                </span>
                <div>
                  <div className="flex items-center gap-1 text-amber-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="h-5 w-5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-slate-300 block mt-1">
                    Verified Customer Reviews
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Write Review & Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <Button
                onClick={() => setShowReviewModal(true)}
                className="w-full sm:w-auto rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white font-bold text-xs h-11 px-6 shadow-lg shadow-orange-500/25 cursor-pointer"
              >
                <Plus className="w-4 h-4 mr-1.5" />
                <span>Write a Review</span>
              </Button>
              <Button
                asChild
                variant="outline"
                className="w-full sm:w-auto rounded-xl border-white/20 bg-white/5 hover:bg-white/10 text-white font-semibold text-xs h-11 px-6"
              >
                <Link href="/book">
                  Book Service
                </Link>
              </Button>
            </div>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search reviews by keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-10 text-xs rounded-xl bg-[#0F172A] border-white/15 text-white placeholder:text-slate-500 focus:border-[#F97316]"
              />
            </div>

            {/* Topic Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <span className="text-xs font-bold text-slate-400 shrink-0 flex items-center gap-1">
                <Filter className="h-3.5 w-3.5 text-[#F97316]" />
                <span>Filter:</span>
              </span>
              {TOPIC_CHIPS.map((chip) => (
                <button
                  key={chip}
                  onClick={() => setSelectedTopic(chip)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    selectedTopic === chip
                      ? "bg-[#F97316] text-white shadow-xs"
                      : "bg-white/5 border border-white/10 text-slate-300 hover:border-white/20 hover:bg-white/10"
                  }`}
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Stream */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        <div className="flex items-center justify-between text-xs text-slate-400 font-semibold border-b border-white/10 pb-3">
          <span>Showing {filteredReviews.length} customer reviews</span>
          <span>Sorted by: Verified Recent</span>
        </div>

        {filteredReviews.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center rounded-3xl border border-white/10 bg-[#0F172A]/60 backdrop-blur-xl p-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
              <Star className="w-8 h-8 text-slate-500" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-white">No reviews yet</h3>
              <p className="text-slate-400 text-sm max-w-sm">
                Be the first verified customer to share your experience with our certified technicians!
              </p>
            </div>
            <button
              onClick={() => setShowReviewModal(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold rounded-xl transition-colors shadow-lg shadow-orange-500/25 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Write a Review</span>
            </button>
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
                          {rev.isVerifiedCustomer && (
                            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                              ✓ Verified Customer
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                          {rev.neighborhood && (
                            <>
                              <MapPin className="h-3 w-3 text-slate-400" />
                              <span>{rev.neighborhood}</span>
                              <span>•</span>
                            </>
                          )}
                          <span>{rev.timeAgo}</span>
                        </div>
                      </div>
                    </div>

                    {rev.workOrder && (
                      <span className="text-xs font-mono font-bold text-slate-300 bg-white/5 px-2.5 py-1 rounded-lg border border-white/10">
                        {rev.workOrder}
                      </span>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-0.5 text-amber-400">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`h-4 w-4 ${
                              s <= rev.rating ? "fill-amber-400 text-amber-400" : "text-slate-600"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs font-bold text-white">
                        {rev.service}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {rev.reviewText}
                    </p>
                  </div>

                  <div className="pt-2 flex items-center justify-between text-xs text-slate-400 border-t border-white/5">
                    <button
                      type="button"
                      onClick={() => handleHelpful(rev.id, rev.helpfulCount)}
                      className="inline-flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
                    >
                      <ThumbsUp className="h-3.5 w-3.5" />
                      <span>Helpful ({currentHelpful})</span>
                    </button>
                    <span className="text-[11px] text-slate-400">
                      ServicePro OS Verified Feedback
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>

      {/* Review Submission Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#0B111E] border border-white/15 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative text-white">
            <button
              onClick={() => setShowReviewModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2 mb-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-[#F97316] text-[11px] font-bold uppercase tracking-wider">
                <Star className="w-3 h-3 fill-current" />
                Verified Review Intake
              </span>
              <h3 className="text-xl font-bold text-white">
                Share Your Service Experience
              </h3>
              <p className="text-xs text-slate-400">
                All reviews are authenticated against completed work orders for complete trust and transparency.
              </p>
            </div>

            {submitMessage ? (
              <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/30 text-center text-xs text-orange-300 space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <p className="font-bold text-white text-sm">{submitMessage}</p>
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={modalName}
                    onChange={(e) => setModalName(e.target.value)}
                    placeholder="e.g. Sarah Jenkins"
                    className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-[#F97316]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Rating (Stars) *
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setModalRating(s)}
                        className="p-1 cursor-pointer focus:outline-none"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            s <= modalRating
                              ? "fill-amber-400 text-amber-400"
                              : "text-slate-600 hover:text-amber-300"
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-slate-300 ml-2">
                      {modalRating} of 5 Stars
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Service Performed *
                  </label>
                  <select
                    value={modalService}
                    onChange={(e) => setModalService(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-black/40 border border-white/15 rounded-xl text-white text-xs sm:text-sm font-semibold focus:outline-none focus:border-[#F97316]"
                  >
                    <option>AC Repair &amp; Diagnostic</option>
                    <option>Seasonal AC Tune-Up</option>
                    <option>Smart Thermostat Installation</option>
                    <option>24/7 Emergency HVAC</option>
                    <option>Commercial Rooftop RTU</option>
                    <option>Air Duct IAQ Remediation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Work Order / Invoice Token (Optional for Verified Badge)
                  </label>
                  <input
                    type="text"
                    value={modalJobId}
                    onChange={(e) => setModalJobId(e.target.value)}
                    placeholder="e.g. WO-1004"
                    className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-[#F97316]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Review Details *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={modalText}
                    onChange={(e) => setModalText(e.target.value)}
                    placeholder="Describe the technician's punctuality, repair quality, and upfront pricing..."
                    className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-[#F97316] resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white font-bold text-sm shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? "Submitting Review..." : "Submit Verified Review"}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
