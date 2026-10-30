"use client";

import * as React from "react";
import Link from "next/link";
import {
  Star,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Trash2,
  Eye,
  X,
} from "lucide-react";
import { toast } from "sonner";

export interface ModerationReviewItem {
  id: string;
  customerName: string;
  avatarInitials: string;
  avatarUrl?: string;
  rating: number;
  reviewText: string;
  date: string;
  status: "Approved" | "Pending" | "Rejected";
}

const DEFAULT_REVIEWS: ModerationReviewItem[] = [];

export default function AdminReviewsModerationPage() {
  const [reviews, setReviews] = React.useState<ModerationReviewItem[]>(DEFAULT_REVIEWS);
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [activeMenuId, setActiveMenuId] = React.useState<string | null>(null);
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [replyModalItem, setReplyModalItem] = React.useState<ModerationReviewItem | null>(null);
  const [replyText, setReplyText] = React.useState("");

  const filtered = React.useMemo(() => {
    return reviews.filter((item) => {
      if (statusFilter !== "all" && item.status.toLowerCase() !== statusFilter.toLowerCase()) return false;
      return true;
    });
  }, [reviews, statusFilter]);

  function handleApprove(id: string) {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "Approved" as const } : r))
    );
    setActiveMenuId(null);
    toast.success("Review approved and published to public site");
  }

  function handleReject(id: string) {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "Rejected" as const } : r))
    );
    setActiveMenuId(null);
    toast.info("Review marked as rejected");
  }

  function handleSendReply(e: React.FormEvent) {
    e.preventDefault();
    if (!replyModalItem) return;
    toast.success(`Public owner response posted for ${replyModalItem.customerName}!`);
    setReplyModalItem(null);
    setReplyText("");
  }

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* ─────────────────────────────────────────────────────────────
          1. HEADER (Exact match to Reference Screenshot)
      ───────────────────────────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Reviews Moderation
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Review customer feedback and manage review publishing.
        </p>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. METRIC KPI CARDS (5 Columns matching Reference)
      ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Total Reviews */}
        <div className="rounded-2xl border border-white/10 bg-[#0B1322] p-4 flex flex-col justify-between">
          <div className="text-xs font-medium text-slate-400">Total Reviews</div>
          <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            248
          </div>
          <div className="mt-2.5 flex items-center gap-1 text-xs text-emerald-400 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>12%</span>
          </div>
        </div>

        {/* Approved */}
        <div className="rounded-2xl border border-white/10 bg-[#0B1322] p-4 flex flex-col justify-between">
          <div className="text-xs font-medium text-slate-400">Approved</div>
          <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            221
          </div>
          <div className="mt-2.5 flex items-center gap-1 text-xs text-emerald-400 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>10%</span>
          </div>
        </div>

        {/* Pending */}
        <div className="rounded-2xl border border-white/10 bg-[#0B1322] p-4 flex flex-col justify-between">
          <div className="text-xs font-medium text-slate-400">Pending</div>
          <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            18
          </div>
          <div className="mt-2.5 flex items-center gap-1 text-xs text-amber-400 font-medium">
            <Clock className="w-3.5 h-3.5" />
            <span>5%</span>
          </div>
        </div>

        {/* Rejected */}
        <div className="rounded-2xl border border-white/10 bg-[#0B1322] p-4 flex flex-col justify-between">
          <div className="text-xs font-medium text-slate-400">Rejected</div>
          <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            9
          </div>
          <div className="mt-2.5 flex items-center gap-1 text-xs text-rose-400 font-medium">
            <TrendingDown className="w-3.5 h-3.5" />
            <span>2%</span>
          </div>
        </div>

        {/* Avg. Rating */}
        <div className="col-span-2 sm:col-span-1 rounded-2xl border border-white/10 bg-[#0B1322] p-4 flex flex-col justify-between">
          <div className="text-xs font-medium text-slate-400">Avg. Rating</div>
          <div className="mt-2 flex items-baseline gap-1.5 text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            <span>4.6</span>
            <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
          </div>
          <div className="mt-2.5 flex items-center gap-1 text-xs text-emerald-400 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>0.2</span>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. REVIEWS TABLE (Exact match to Reference Screenshot)
      ───────────────────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-white/10 bg-[#0B1322] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 bg-[#0F172A]/70 text-slate-400 font-semibold tracking-wider">
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Rating</th>
                <th className="py-3 px-4">Review</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <MessageSquare className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                    <p className="font-semibold text-white">No customer reviews in moderation queue</p>
                    <p className="text-xs text-slate-400 mt-1">New incoming reviews will appear here for verification and approval.</p>
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-white/[0.02] transition-colors group"
                  >
                  {/* Customer with Avatar */}
                  <td className="py-3.5 px-4 font-medium text-white whitespace-nowrap">
                    <div className="flex items-center gap-2.5">
                      {item.avatarUrl ? (
                        <img
                          src={item.avatarUrl}
                          alt={item.customerName}
                          className="w-7 h-7 rounded-full object-cover border border-white/10 shrink-0"
                        />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-[10px] font-bold text-slate-300 shrink-0">
                          {item.avatarInitials}
                        </div>
                      )}
                      <span className="font-semibold">{item.customerName}</span>
                    </div>
                  </td>

                  {/* Rating Stars */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-0.5 text-amber-400">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-3.5 h-3.5 ${
                            s <= item.rating ? "fill-amber-400" : "text-slate-600"
                          }`}
                        />
                      ))}
                    </div>
                  </td>

                  {/* Review Text - Spanned gracefully */}
                  <td className="py-3.5 px-4 max-w-md lg:max-w-xl text-slate-300">
                    &ldquo;{item.reviewText}&rdquo;
                  </td>

                  {/* Date */}
                  <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap">
                    {item.date}
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4">
                    {item.status === "Approved" ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        Approved
                      </span>
                    ) : item.status === "Pending" ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                        Pending
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/30">
                        Rejected
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-center relative">
                    <div className="inline-block text-left">
                      <button
                        type="button"
                        onClick={() => setActiveMenuId(activeMenuId === item.id ? null : item.id)}
                        className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {/* Dropdown Menu */}
                      {activeMenuId === item.id && (
                        <div className="absolute right-4 mt-1 w-44 rounded-xl bg-[#0F172A] border border-white/15 shadow-2xl py-1.5 z-30 text-left">
                          {item.status !== "Approved" && (
                            <button
                              type="button"
                              onClick={() => handleApprove(item.id)}
                              className="flex items-center gap-2 w-full px-3 py-2 text-xs text-emerald-400 hover:bg-emerald-500/10 text-left"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Approve &amp; Publish</span>
                            </button>
                          )}
                          {item.status !== "Rejected" && (
                            <button
                              type="button"
                              onClick={() => handleReject(item.id)}
                              className="flex items-center gap-2 w-full px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 text-left"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Reject Review</span>
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              setActiveMenuId(null);
                              setReplyModalItem(item);
                            }}
                            className="flex items-center gap-2 w-full px-3 py-2 text-xs text-slate-300 hover:bg-white/10 hover:text-white text-left"
                          >
                            <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                            <span>Reply as Owner</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            4. TABLE FOOTER (Pagination matching Reference)
        ───────────────────────────────────────────────────────────── */}
        <div className="px-4 py-3.5 border-t border-white/10 bg-[#0F172A]/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-400">
          <div>
            Showing 1 to {filtered.length} of 248 reviews
          </div>

          <div className="flex items-center gap-4">
            {/* Pagination Controls */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="w-7 h-7 flex items-center justify-center rounded-lg border border-white/10 text-slate-400 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:pointer-events-none"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#F97316] text-white font-bold"
              >
                1
              </button>

              {[2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setPage(num)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg border border-transparent text-slate-400 hover:text-white hover:bg-white/5"
                >
                  {num}
                </button>
              ))}

              <span className="px-1 text-slate-600">...</span>

              <button
                type="button"
                onClick={() => setPage(36)}
                className="w-7 h-7 flex items-center justify-center rounded-lg border border-transparent text-slate-400 hover:text-white hover:bg-white/5"
              >
                36
              </button>

              <button
                type="button"
                onClick={() => setPage((p) => p + 1)}
                className="w-7 h-7 flex items-center justify-center rounded-lg border border-white/10 text-slate-400 hover:text-white hover:bg-white/5"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Rows Per Page */}
            <div className="flex items-center gap-1.5 pl-2 border-l border-white/10">
              <select
                value={rowsPerPage}
                onChange={(e) => setRowsPerPage(Number(e.target.value))}
                className="bg-transparent text-white focus:outline-none cursor-pointer"
              >
                <option value={10} className="bg-[#0F172A] text-white">10 / page</option>
                <option value={20} className="bg-[#0F172A] text-white">20 / page</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          5. REPLY AS OWNER MODAL
      ───────────────────────────────────────────────────────────── */}
      {replyModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0B1322] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-sky-400" />
                Response to {replyModalItem.customerName}
              </h3>
              <button
                type="button"
                onClick={() => setReplyModalItem(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSendReply} className="space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-[#0F172A] border border-white/5 text-slate-300 italic">
                &ldquo;{replyModalItem.reviewText}&rdquo;
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Public Business Response</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Thank you for your feedback! We appreciate your trust in ServicePro OS..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0F172A] border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-[#F97316]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setReplyModalItem(null)}
                  className="px-4 py-2 rounded-xl border border-white/10 text-slate-300 hover:text-white hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold"
                >
                  Publish Response
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
