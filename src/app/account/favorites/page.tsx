"use client";

import * as React from "react";
import Link from "next/link";
import {
  Bookmark,
  Trash2,
  Calendar,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BookingMiniWindowModal } from "@/components/booking/BookingMiniWindowModal";

interface FavoriteItem {
  id: string;
  customerId: string;
  serviceId: string;
  serviceName: string;
  category: string;
  priceCents: number;
  durationMinutes: number;
  savedAt: string;
}

export default function CustomerFavoritesPage() {
  const [favorites, setFavorites] = React.useState<FavoriteItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [bookingModalOpen, setBookingModalOpen] = React.useState(false);
  const [selectedServiceId, setSelectedServiceId] = React.useState<string | undefined>();

  const loadFavorites = React.useCallback(async () => {
    try {
      const res = await fetch("/api/account/favorites");
      if (res.ok) {
        const data = await res.json();
        setFavorites(data.favorites || []);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  async function handleRemove(serviceId: string) {
    // optimistic update
    setFavorites((prev) => prev.filter((f) => f.serviceId !== serviceId));
    try {
      await fetch("/api/account/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serviceId }),
      });
    } catch {
      // reload if failed
      loadFavorites();
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Bookmark className="h-6 w-6 text-orange-400 fill-orange-400" />
            Saved Services
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Quickly book your favorite regular maintenance packages and home services.
          </p>
        </div>

        <Button
          type="button"
          onClick={() => {
            setSelectedServiceId(undefined);
            setBookingModalOpen(true);
          }}
          variant="outline"
          className="rounded-xl text-xs font-bold self-start sm:self-auto border-white/10 bg-white/5 hover:bg-white/10 text-white cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 mr-1 text-[#F97316]" />
          <span>Book a Service</span>
        </Button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="py-12 text-center text-xs text-slate-400 animate-pulse">
          Loading saved services...
        </div>
      ) : favorites.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/15 bg-[#0F172A]/85 backdrop-blur-xl p-12 text-center space-y-3 shadow-xl">
          <Bookmark className="mx-auto h-10 w-10 text-slate-500" />
          <h2 className="text-base font-bold text-white">No Saved Services</h2>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Bookmark services you order often (like seasonal AC tune-ups or duct cleaning) for instant 1-click rebooking.
          </p>
          <Button
            type="button"
            onClick={() => {
              setSelectedServiceId(undefined);
              setBookingModalOpen(true);
            }}
            className="rounded-xl bg-[#F97316] hover:bg-orange-600 text-[#0C1523] font-bold text-xs mt-2 shadow-lg shadow-orange-500/20 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            <span>Book a Service</span>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {favorites.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-white/10 bg-[#0F172A]/85 backdrop-blur-xl p-5 shadow-xl space-y-4 flex flex-col justify-between hover:border-orange-500/30 transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400 bg-orange-500/10 px-2.5 py-0.5 rounded-full border border-orange-500/20">
                    {item.category}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemove(item.serviceId)}
                    className="text-slate-500 hover:text-rose-400 p-1 rounded-md transition-colors"
                    title="Remove from saved"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white">
                    {item.serviceName}
                  </h3>
                  <div className="mt-2 flex items-center gap-4 text-xs text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-slate-500" />
                      {item.durationMinutes} mins duration
                    </span>
                    <span className="font-mono font-bold text-emerald-400 text-sm">
                      ${(item.priceCents / 100).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">
                  Saved on {new Date(item.savedAt).toLocaleDateString()}
                </span>

                <Button
                  type="button"
                  size="sm"
                  onClick={() => {
                    setSelectedServiceId(item.serviceId);
                    setBookingModalOpen(true);
                  }}
                  className="rounded-xl bg-[#F97316] hover:bg-orange-600 text-[#0C1523] font-bold text-xs h-9 px-4 shadow-lg shadow-orange-500/20 cursor-pointer"
                >
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>Book Now</span>
                  </div>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Global Booking Mini Window Modal */}
      <BookingMiniWindowModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        preselectedServiceId={selectedServiceId}
      />
    </div>
  );
}
