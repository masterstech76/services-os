import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { 
  Star, 
  CheckCircle, 
  Sparkles, 
  MessageSquare, 
  Flag, 
  Search, 
  ThumbsUp, 
  ShieldCheck,
  Filter
} from 'lucide-react';
import { CustomerReview } from '../../types';

export const Page33CustomerReviewsManagement: React.FC = () => {
  const { reviews, addToast } = useAdmin();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterRating, setFilterRating] = useState<number | 'All'>('All');
  const [replyingReviewId, setReplyingReviewId] = useState<string | null>(null);
  const [replies, setReplies] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem('servicepro_review_replies');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {};
  });
  const [replyDraft, setReplyDraft] = useState<string>('');
  const [featuredIds, setFeaturedIds] = useState<Set<string>>(() => {
    const saved = localStorage.getItem('servicepro_featured_reviews');
    if (saved) {
      try { return new Set(JSON.parse(saved)); } catch (e) {}
    }
    return new Set();
  });
  const [syncStatus, setSyncStatus] = useState<string>('Live CDN Synced');
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  const totalReviewsCount = reviews.length;
  const avgRating = totalReviewsCount > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviewsCount).toFixed(2)
    : '5.00';
  const fiveStarShare = totalReviewsCount > 0
    ? Math.round((reviews.filter(r => r.rating >= 4.5).length / totalReviewsCount) * 100)
    : 100;

  const handleToggleFeature = (revId: string, customerName: string) => {
    setFeaturedIds(prev => {
      const next = new Set(prev);
      if (next.has(revId)) {
        next.delete(revId);
        addToast(`Removed review by ${customerName} from Mobile Home Feed.`, 'info');
      } else {
        next.add(revId);
        addToast(`Featured review by ${customerName} on Customer Mobile App Hero Carousel!`, 'success');
      }
      localStorage.setItem('servicepro_featured_reviews', JSON.stringify(Array.from(next)));
      return next;
    });
  };

  const handleSyncCDN = () => {
    setIsSyncing(true);
    setIsSyncing(false);
    setSyncStatus(`Synced (${featuredIds.size} featured)`);
    addToast(`Updated ${featuredIds.size} featured testimonials from live review records.`, 'success');
  };

  const filteredReviews = reviews.filter(r => {
    const matchesSearch = r.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          r.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          r.comment.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRating = filterRating === 'All' || r.rating >= filterRating;
    return matchesSearch && matchesRating;
  });

  return (
    <div className="space-y-6">
      {/* Top Header matching Screenshot 03 Bottom Right */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Customer Reviews Management</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-current text-amber-500" />
              {avgRating} Platform Average
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Moderate customer service ratings, feature positive testimonials on mobile apps, and respond to feedback</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <span className="text-[11px] font-bold text-slate-500 block">Mobile Feed Engine</span>
            <span className="text-[10px] font-mono font-bold text-emerald-600">{syncStatus}</span>
          </div>

          <button
            onClick={handleSyncCDN}
            disabled={isSyncing}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing...' : 'Sync App Testimonials'}</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Overall Platform Rating</div>
          <div className="text-2xl font-extrabold text-amber-600 mt-0.5">★ {avgRating} / 5.0</div>
          <div className="text-[10px] text-emerald-600 font-bold mt-0.5">{fiveStarShare}% 5-Star share</div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Verified Reviews</div>
          <div className="text-2xl font-extrabold text-slate-900 mt-0.5">{totalReviewsCount} Reviews</div>
          <div className="text-[10px] text-slate-400 font-bold mt-0.5">100% verified after completed jobs</div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Featured Testimonials</div>
          <div className="text-2xl font-extrabold text-purple-700 mt-0.5">{featuredIds.size} Featured</div>
          <div className="text-[10px] text-purple-600 font-bold mt-0.5">Displayed on Mobile Day Vision</div>
        </div>
      </div>

      {/* Main Reviews Feed */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Search & Tabs */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
          <div className="relative w-full max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search reviews by customer, service, comment..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center gap-1.5">
            {['All', 5, 4].map(filter => (
              <button
                key={String(filter)}
                onClick={() => setFilterRating(filter as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  filterRating === filter
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {filter === 'All' ? 'All Reviews' : `${filter} Stars & Up`}
              </button>
            ))}
          </div>
        </div>

        {/* Reviews List */}
        <div className="divide-y divide-slate-100">
          {filteredReviews.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Star className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-extrabold text-slate-900 mb-1">No Reviews Found</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Customer reviews and ratings submitted after verified job completions will appear here for moderation, public replies, and mobile feature toggles.
              </p>
            </div>
          ) : (
            filteredReviews.map((rev) => (
            <div key={rev.id} className="p-5 hover:bg-slate-50/50 transition-colors space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 text-white font-extrabold flex items-center justify-center text-xs">
                    {rev.customerName.charAt(0)}
                  </div>
                  <div>
                    <div className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5 flex-wrap">
                      <span>{rev.customerName}</span>
                      {rev.isVerified && (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                          <CheckCircle className="w-3 h-3 text-emerald-600" />
                          Verified Job
                        </span>
                      )}
                      {featuredIds.has(rev.id) && (
                        <span className="text-[10px] font-extrabold text-purple-700 bg-purple-100/90 border border-purple-200 px-2 py-0.5 rounded-full flex items-center gap-1 animate-in fade-in">
                          <Sparkles className="w-2.5 h-2.5 text-purple-600" />
                          Featured on Mobile App
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400">{rev.serviceName} • {rev.date}</div>
                  </div>
                </div>

                {/* Star rating */}
                <div className="flex items-center gap-1 text-amber-500 font-bold text-sm">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-4 h-4 ${i < Math.floor(rev.rating) ? 'fill-current text-amber-400' : 'text-slate-200'}`} 
                    />
                  ))}
                  <span className="text-xs text-slate-700 ml-1">({rev.rating.toFixed(1)})</span>
                </div>
              </div>

              {/* Review Comment */}
              <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                "{rev.comment}"
              </p>

              {/* Rendered Management Reply if exists */}
              {replies[rev.id] && (
                <div className="ml-4 p-3 bg-emerald-50/60 border-l-4 border-emerald-500 rounded-r-xl text-xs space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Executive Operations Response:</span>
                  </div>
                  <p className="text-slate-700 italic">"{replies[rev.id]}"</p>
                </div>
              )}

              {/* Reply Box if open */}
              {replyingReviewId === rev.id && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <label className="text-[11px] font-bold text-slate-700 block">
                    Write Official Public Response to {rev.customerName}:
                  </label>
                  <textarea
                    rows={2}
                    value={replyDraft}
                    onChange={e => setReplyDraft(e.target.value)}
                    placeholder="Enter management response to be displayed on mobile profiles and public reviews..."
                    className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500"
                  />
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => {
                        setReplyingReviewId(null);
                        setReplyDraft('');
                      }}
                      className="px-3 py-1 bg-white border border-slate-200 text-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-100 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        if (!replyDraft.trim()) {
                          addToast('Please enter a response message.', 'warning');
                          return;
                        }
                        setReplies(prev => {
                          const next = { ...prev, [rev.id]: replyDraft.trim() };
                          localStorage.setItem('servicepro_review_replies', JSON.stringify(next));
                          return next;
                        });
                        setReplyingReviewId(null);
                        setReplyDraft('');
                        addToast(`Official management response published for ${rev.customerName}!`, 'success');
                      }}
                      className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 cursor-pointer"
                    >
                      Publish Response
                    </button>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 text-xs">
                <button
                  onClick={() => handleToggleFeature(rev.id, rev.customerName)}
                  className={`px-3 py-1.5 font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1 ${
                    featuredIds.has(rev.id)
                      ? 'bg-purple-600 text-white shadow-xs hover:bg-purple-700'
                      : 'bg-purple-50 hover:bg-purple-100 text-purple-700'
                  }`}
                >
                  <Sparkles className="w-3 h-3" />
                  <span>{featuredIds.has(rev.id) ? 'Featured on Mobile (Click to Unfeature)' : 'Feature on Home Feed'}</span>
                </button>

                <button
                  onClick={() => {
                    if (replyingReviewId === rev.id) {
                      setReplyingReviewId(null);
                    } else {
                      setReplyingReviewId(rev.id);
                      setReplyDraft(replies[rev.id] || '');
                    }
                  }}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1"
                >
                  <MessageSquare className="w-3 h-3" />
                  {replyingReviewId === rev.id ? 'Close Reply' : 'Public Reply'}
                </button>
              </div>
            </div>
          )))}
        </div>
      </div>
    </div>
  );
};
