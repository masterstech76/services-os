import React, { useState, useRef } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { downloadCSV } from '../../utils/exportUtils';
import { 
  ArrowLeft, 
  ShieldCheck, 
  Phone, 
  Star, 
  CheckCircle, 
  Wrench, 
  Truck, 
  Award, 
  DollarSign, 
  Clock, 
  Calendar,
  AlertTriangle,
  Camera,
  CheckCircle2,
  Sparkles,
  Edit3,
  Share2,
  Send,
  ThumbsUp,
  MessageSquare,
  Image as ImageIcon,
  Tag,
  MapPin,
  Key,
  Briefcase,
  GraduationCap,
  MoreHorizontal,
  Pin,
  Copy,
  Trash2
} from 'lucide-react';

interface TechComment {
  id: string;
  author: string;
  avatar: string;
  time: string;
  text: string;
}

interface TechPost {
  id: string;
  author: string;
  authorRole: string;
  avatar: string;
  time: string;
  badge?: { label: string; color: string };
  content: string;
  mediaUrl?: string;
  jobCard?: {
    id: string;
    title: string;
    customer: string;
    address: string;
    price: string;
    status: string;
  };
  likes: number;
  isLiked?: boolean;
  isPinned?: boolean;
  comments: TechComment[];
}

export const Page23TechnicianProfile: React.FC = () => {
  const { 
    technicians, 
    selectedTechnicianId, 
    setSelectedTechnicianId, 
    navigateToPage, 
    addToast,
    openUniversalEditModal,
    openSMSModal,
    bookings,
    setIsCreateTechnicianModalOpen
  } = useAdmin();

  const tech = technicians.find(t => t.id === selectedTechnicianId) || technicians[0] || null;

  const [activeTab, setActiveTab] = useState<'timeline' | 'licenses' | 'van' | 'photos' | 'reviews'>('timeline');

  // Cover photo presets using clean gradients
  const coverPresets = [
    'linear-gradient(135deg, #0C3832 0%, #134E45 50%, #1E293B 100%)',
    'linear-gradient(135deg, #1E1B4B 0%, #312E81 50%, #4338CA 100%)',
    'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #334155 100%)'
  ];
  const [coverPhoto, setCoverPhoto] = useState(coverPresets[0]);
  const [showCoverMenu, setShowCoverMenu] = useState(false);

  const photoInputRef = useRef<HTMLInputElement>(null);
  const [techPhotos, setTechPhotos] = useState<{ title: string; url: string }[]>([]);

  // Timeline posts state
  const [posts, setPosts] = useState<TechPost[]>([]);

  const [newDispatchNote, setNewDispatchNote] = useState('');
  const [commentInputs, setCommentInputs] = useState<{ [postId: string]: string }>({});
  const [activePostMenuId, setActivePostMenuId] = useState<string | null>(null);
  const [timelineFilter, setTimelineFilter] = useState<'all' | 'jobs' | 'routes'>('all');
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [isEmergencyPriority, setIsEmergencyPriority] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!tech) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigateToPage(22)}
            className="p-2 bg-white border border-slate-200 hover:border-slate-300 rounded-xl text-slate-600 shadow-2xs transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Technician Profile</h1>
            <p className="text-xs text-slate-500 mt-1">Field technician credential dossier, license verification, and work history</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-12 border border-slate-200/80 shadow-xs text-center flex flex-col items-center justify-center max-w-xl mx-auto my-12">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mb-4">
            <Wrench className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">No Technicians Onboarded</h2>
          <p className="text-xs text-slate-500 mt-2 max-w-sm">
            The technician directory is currently clean and empty. Onboard your first technician to view dossiers, licenses, vehicle inventories, and customer feedback.
          </p>
          <div className="flex items-center gap-3 mt-6">
            <button
              onClick={() => navigateToPage(22)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
            >
              ← Technician Fleet
            </button>
            <button
              onClick={() => setIsCreateTechnicianModalOpen(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
            >
              + Onboard First Technician
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setAttachedImage(reader.result as string);
        addToast('Worksite equipment photo attached to technician log!', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePinPost = (postId: string) => {
    setPosts(prev => {
      const target = prev.find(p => p.id === postId);
      if (!target) return prev;
      const willPin = !target.isPinned;
      const updated = prev.map(p => p.id === postId ? { ...p, isPinned: willPin } : p);
      if (willPin) {
        const pinned = updated.find(p => p.id === postId)!;
        const rest = updated.filter(p => p.id !== postId);
        addToast('Technician record pinned to top of history!', 'success');
        return [pinned, ...rest];
      } else {
        addToast('Record unpinned from top.', 'info');
        return updated;
      }
    });
    setActivePostMenuId(null);
  };

  const handleCopyLink = (postId: string) => {
    const url = `${window.location.origin}${window.location.pathname}#post-${postId}`;
    navigator.clipboard.writeText(url);
    addToast('Direct link to technician log copied!', 'success');
    setActivePostMenuId(null);
  };

  const handleDeletePost = (postId: string) => {
    setPosts(prev => prev.filter(p => p.id !== postId));
    addToast('Dispatch log removed from technician profile.', 'info');
    setActivePostMenuId(null);
  };

  const handlePostNote = () => {
    if (!newDispatchNote.trim() && !attachedImage) {
      addToast('Please enter a dispatch log or attach a photo first.', 'warning');
      return;
    }

    const post: TechPost = {
      id: `p-${Date.now()}`,
      author: 'Operations Dispatch Desk',
      authorRole: 'Central Operations Hub',
      avatar: '',
      time: 'Just now • Dispatch Audit',
      badge: isEmergencyPriority 
        ? { label: 'CRITICAL SLA ROUTE', color: 'bg-rose-100 text-rose-800' }
        : { label: 'Dispatch Log', color: 'bg-purple-100 text-purple-800' },
      content: newDispatchNote.trim() || 'Worksite equipment photo logged to technician profile.',
      mediaUrl: attachedImage || undefined,
      likes: 0,
      isLiked: false,
      comments: []
    };

    setPosts([post, ...posts]);
    setNewDispatchNote('');
    setAttachedImage(null);
    setIsEmergencyPriority(false);
    addToast('Dispatch log recorded to technician timeline!', 'success');
  };

  const handleToggleLike = (postId: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const isLiked = !p.isLiked;
        return {
          ...p,
          isLiked,
          likes: isLiked ? p.likes + 1 : p.likes - 1
        };
      }
      return p;
    }));
  };

  const handleAddComment = (postId: string) => {
    const text = (commentInputs[postId] || '').trim();
    if (!text) return;

    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          comments: [
            ...p.comments,
            {
              id: `c-${Date.now()}`,
              author: 'Operations Dispatch Desk',
              avatar: '',
              time: 'Just now',
              text
            }
          ]
        };
      }
      return p;
    }));

    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
    addToast('Comment added to timeline thread', 'info');
  };

  return (
    <div className="space-y-4 max-w-6xl mx-auto pb-12 animate-in fade-in duration-200">
      {/* 1. Header Navigation Bar & Technician Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigateToPage(22)}
            className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl border border-slate-200 transition-colors flex items-center gap-1.5 text-xs font-bold cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>All Technicians</span>
          </button>

          <div className="h-4 w-[1px] bg-slate-200 hidden sm:block" />

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Technician Profile:</span>
            <span className="text-xs font-bold text-slate-900 bg-emerald-50 text-emerald-800 px-2.5 py-0.5 rounded-lg border border-emerald-200">
              {tech.name}
            </span>
          </div>
        </div>

        {/* Quick Technician Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-semibold">Switch Pro:</span>
          <select
            value={tech.id}
            onChange={e => setSelectedTechnicianId(e.target.value)}
            className="text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-slate-800 focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            {technicians.map(t => (
              <option key={t.id} value={t.id}>{t.name} ({t.specialization})</option>
            ))}
          </select>
        </div>
      </div>

      {/* 2. Hero Area: Landscape Cover + Overlapping Avatar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        {/* Cover Photo Banner */}
        <div className="relative h-60 sm:h-72 md:h-80 w-full bg-gradient-to-r from-[#07241f] via-[#0e433b] to-[#1a6659] group overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#34d399_1px,transparent_1px)] [background-size:20px_20px] opacity-25" />
          
          <img
            src={coverPhoto}
            alt="Field Fleet Cover"
            onError={(e) => { (e.currentTarget as HTMLElement).style.display = 'none'; }}
            className="w-full h-full object-cover mix-blend-overlay opacity-80 transition-all duration-300 group-hover:scale-102"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/25" />

          {/* Watermark in Cover */}
          <div className="absolute top-4 left-6 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="font-extrabold text-[11px] tracking-wide uppercase">Verified Pro Field Specialist</span>
          </div>

          {/* Change Cover Trigger */}
          <div className="absolute bottom-4 right-4 z-10">
            <button
              onClick={() => setShowCoverMenu(prev => !prev)}
              className="px-3.5 py-2 bg-white/95 hover:bg-white text-slate-900 font-extrabold text-xs rounded-xl shadow-lg backdrop-blur-md transition-all flex items-center gap-2 cursor-pointer border border-white/40"
            >
              <Camera className="w-4 h-4 text-slate-700" />
              <span>Edit Cover Photo</span>
            </button>

            {showCoverMenu && (
              <div className="absolute right-0 bottom-12 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200 p-2 z-30">
                <div className="text-[11px] font-bold text-slate-500 px-3 py-1.5 uppercase tracking-wider">
                  Select Cover Preset
                </div>
                <div className="space-y-1">
                  <button
                    onClick={() => { setCoverPhoto(coverPresets[0]); setShowCoverMenu(false); addToast('Cover updated: Service Fleet & Van', 'success'); }}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl flex items-center gap-2"
                  >
                    🚐 Field Fleet &amp; Van
                  </button>
                  <button
                    onClick={() => { setCoverPhoto(coverPresets[1]); setShowCoverMenu(false); addToast('Cover updated: Corporate HQ', 'success'); }}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl flex items-center gap-2"
                  >
                    🏢 Corporate HQ
                  </button>
                  <button
                    onClick={() => { setCoverPhoto(coverPresets[2]); setShowCoverMenu(false); addToast('Cover updated: Modern Luxury Home', 'success'); }}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl flex items-center gap-2"
                  >
                    🏡 Luxury Smart Home
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Profile Info Row: Avatar + Headline + Action Buttons */}
        <div className="px-6 md:px-10 pb-6 pt-0 bg-white">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4">
            {/* Left: Overlapping Avatar & Primary Identity */}
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 text-center sm:text-left">
              <div className="relative -mt-16 sm:-mt-20 md:-mt-24 shrink-0 z-10">
                {tech.photo ? (
                  <img
                    src={tech.photo}
                    alt={tech.name}
                    className="w-32 h-32 sm:w-36 sm:h-36 md:w-42 md:h-42 rounded-full object-cover ring-4 ring-white shadow-2xl bg-white"
                  />
                ) : (
                  <div className="w-32 h-32 sm:w-36 sm:h-36 md:w-42 md:h-42 rounded-full bg-emerald-700 text-white flex items-center justify-center font-black text-4xl ring-4 ring-white shadow-2xl">
                    {tech.name ? tech.name.charAt(0).toUpperCase() : 'T'}
                  </div>
                )}
                <div className="absolute bottom-2 right-2 w-6 h-6 rounded-full bg-emerald-500 ring-4 ring-white shadow-sm flex items-center justify-center">
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                </div>
                <button
                  onClick={() => openUniversalEditModal({ type: 'technician', id: tech.id })}
                  className="absolute bottom-2 left-2 p-2 bg-slate-900/80 hover:bg-slate-900 text-white rounded-full shadow-lg transition-transform hover:scale-110 cursor-pointer"
                  title="Update technician photo"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Identity Titles on pure white card */}
              <div className="space-y-1.5 pt-3 md:pt-4">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    {tech.name}
                  </h1>
                  <div 
                    className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs"
                    title="Verified Pro"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    {tech.specialization} Master Pro
                  </span>
                </div>

                <div className="text-xs text-slate-500 font-medium flex flex-wrap items-center justify-center sm:justify-start gap-3">
                  <span className="font-bold text-slate-700">@{tech.name.toLowerCase().replace(/\s+/g, '_')}_pro</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    Primary Service Territory
                  </span>
                  <span>•</span>
                  <span>{tech.jobsCompleted} Completed Work Orders</span>
                </div>

                {/* Team Collaborators */}
                <div className="flex items-center justify-center sm:justify-start gap-2 pt-1">
                  <span className="text-[11px] text-slate-500 font-medium">
                    Operating in active field service workforce
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Action Buttons */}
            <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2.5 pt-2 md:pt-0">
              <button
                onClick={() => {
                  const input = document.getElementById('tech-dispatch-note-input');
                  input?.focus();
                  addToast('Focusing on dispatch note composer', 'info');
                }}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>+ Add Dispatch Note</span>
              </button>

              <button
                onClick={() => openUniversalEditModal({ type: 'technician', id: tech.id })}
                className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer border border-slate-200"
              >
                <Edit3 className="w-4 h-4 text-slate-600" />
                <span>Edit Profile</span>
              </button>

              <button
                onClick={() => navigateToPage(24)}
                className="px-3.5 py-2.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-bold text-xs rounded-xl shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5 text-slate-600" />
                <span>Shift Schedule</span>
              </button>

              <button
                onClick={() => navigateToPage(25)}
                className="px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Award className="w-3.5 h-3.5" />
                <span>Performance Scorecard</span>
              </button>
            </div>
          </div>

          {/* Horizontal Navigation Tabs */}
          <div className="border-t border-slate-200 pt-1 mt-4">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              <button
                onClick={() => setActiveTab('timeline')}
                className={`px-4 py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                  activeTab === 'timeline'
                    ? 'border-emerald-600 text-emerald-700 font-extrabold'
                    : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
                }`}
              >
                <span>📌 Timeline &amp; Work Orders</span>
              </button>

              <button
                onClick={() => setActiveTab('licenses')}
                className={`px-4 py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                  activeTab === 'licenses'
                    ? 'border-emerald-600 text-emerald-700 font-extrabold'
                    : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
                }`}
              >
                <span>👤 Trade Certifications &amp; Licenses</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 font-bold">Verified</span>
              </button>

              <button
                onClick={() => setActiveTab('van')}
                className={`px-4 py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                  activeTab === 'van'
                    ? 'border-emerald-600 text-emerald-700 font-extrabold'
                    : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
                }`}
              >
                <span>🚐 Van &amp; Inventory (#104)</span>
              </button>

              <button
                onClick={() => setActiveTab('photos')}
                className={`px-4 py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                  activeTab === 'photos'
                    ? 'border-emerald-600 text-emerald-700 font-extrabold'
                    : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
                }`}
              >
                <span>📷 Completed Job Photos</span>
              </button>

              <button
                onClick={() => setActiveTab('reviews')}
                className={`px-4 py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                  activeTab === 'reviews'
                    ? 'border-emerald-600 text-emerald-700 font-extrabold'
                    : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
                }`}
              >
                <span>⭐ Customer Reviews &amp; SLA</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800 font-bold">
                  ★ {tech.rating}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Two-Column Body Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Intro, Licenses & Vitals (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Pro Vitals Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
            <h2 className="text-base font-extrabold text-slate-900 tracking-tight">Technician Vitals</h2>

            <p className="text-xs text-slate-600 leading-relaxed text-center bg-slate-50 p-3 rounded-2xl border border-slate-100 italic">
              “Master HVAC &amp; Electrical Pro with EPA Section 608 Universal License. Operating fully stocked Ford Transit Van #104.”
            </p>

            <div className="space-y-3 pt-2 text-xs text-slate-700">
              <div className="flex items-center gap-3">
                <Briefcase className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Fleet Unit: <strong className="text-slate-900">ServicePro Field Fleet</strong></span>
              </div>

              <div className="flex items-center gap-3">
                <GraduationCap className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Certification: <strong className="text-slate-900">EPA Universal • Master License • NATE</strong></span>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Direct Phone: <a href={`tel:${tech.phone}`} className="font-bold text-emerald-700 hover:underline">{tech.phone}</a></span>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Shift Hours: <strong className="text-slate-900">{tech.workingHours} (On-Duty)</strong></span>
              </div>

              <div className="flex items-center gap-3">
                <Truck className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Service Van: <strong className="text-slate-900 font-mono text-[11px] bg-amber-50 px-2 py-0.5 rounded border border-amber-200">Ford Transit #104 (TX-892-PRO)</strong></span>
              </div>
            </div>

            {/* Performance Summary Metrics */}
            <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100">
              <div className="p-3 rounded-2xl bg-amber-50 border border-amber-100 text-center">
                <div className="text-[10px] text-amber-800 font-bold uppercase">Customer Rating</div>
                <div className="text-base font-black text-amber-900 flex items-center justify-center gap-1">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{tech.rating} / 5.0</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-100 text-center">
                <div className="text-[10px] text-emerald-800 font-bold uppercase">On-Time SLA</div>
                <div className="text-base font-black text-emerald-900">
                  {tech.onTimeRate}%
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                <div className="text-[10px] text-slate-500 font-bold uppercase">Jobs Completed</div>
                <div className="text-base font-black text-slate-900">
                  {tech.jobsCompleted}
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-blue-50 border border-blue-100 text-center">
                <div className="text-[10px] text-blue-800 font-bold uppercase">Active Orders</div>
                <div className="text-base font-black text-blue-900">
                  {tech.currentJobsCount} In Progress
                </div>
              </div>
            </div>
          </div>

          {/* Trade Licenses & Compliance */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-slate-900">Verified Trade Licenses</h3>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">100% Verified</span>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
                <div className="font-extrabold text-slate-900 text-xs">EPA Section 608 Universal Certification</div>
                <div className="text-slate-500 text-[11px]">License #HVAC-9921-TX • Valid thru Oct 2028</div>
                <div className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  <span>Verified via National Registry</span>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
                <div className="font-extrabold text-slate-900 text-xs">State of Texas Master Mechanical License</div>
                <div className="text-slate-500 text-[11px]">License #TDLR-TX-78401 • In Good Standing</div>
                <div className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  <span>Active State TDLR License</span>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
                <div className="font-extrabold text-slate-900 text-xs">Municipal Background Check &amp; Clearance</div>
                <div className="text-slate-500 text-[11px]">Clearance #BC-4482 • 0 Infractions</div>
                <div className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  <span>Background Cleared for Residential Entry</span>
                </div>
              </div>
            </div>
          </div>

          {/* Van Inventory & Tool Readiness Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">Van Inventory &amp; Stock (#104)</h3>
                <span className="text-[11px] text-slate-500">Replenished yesterday at Central Depot</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">100% Stocked</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-center justify-between">
                <div>
                  <div className="font-extrabold text-slate-900">Carrier Condenser Fan Motors (1/4 HP)</div>
                  <div className="text-[10px] text-slate-500">Bin #A-14 • OEM Certified</div>
                </div>
                <span className="font-black text-slate-900">4 Units</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-center justify-between">
                <div>
                  <div className="font-extrabold text-slate-900">R-410A Puron Refrigerant Cylinder</div>
                  <div className="text-[10px] text-slate-500">Rack #B-02 • 25 lb Tank (EPA Reg)</div>
                </div>
                <span className="font-black text-emerald-700">2 Tanks</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-center justify-between">
                <div>
                  <div className="font-extrabold text-slate-900">Digital Fieldpiece Micron Vacuum Gauge</div>
                  <div className="text-[10px] text-slate-500">Tool Locker #1 • Calibrated Oct 2026</div>
                </div>
                <span className="font-black text-blue-700">Active</span>
              </div>
            </div>
          </div>

          {/* Sticky Dispatch Desk (Eliminates All Empty Scrolling Space) */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3 lg:sticky lg:top-20 z-10">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-slate-900">Field Dispatch Actions</h3>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            <div className="space-y-2">
              <button
                onClick={() => {
                  const cleanPhone = tech.phone.replace(/[^0-9+]/g, '');
                  window.open(`tel:${cleanPhone}`);
                  addToast(`Placing direct call to ${tech.name} (${tech.phone})...`, 'info');
                }}
                className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Phone className="w-4 h-4" />
                <span>Call {tech.name.split(' ')[0]} Direct</span>
              </button>

              <button
                onClick={() => openSMSModal({ name: tech.name, phone: tech.phone, role: tech.specialization })}
                className="w-full py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl border border-slate-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4 text-emerald-600" />
                <span>Send Emergency Dispatch Ping</span>
              </button>

              <button
                onClick={() => {
                  downloadCSV(`${tech.name}_scorecard`, ['Metric', 'Value'], [
                    ['Technician Name', tech.name],
                    ['Specialization', tech.specialization],
                    ['Direct Phone', tech.phone],
                    ['Rating', `${tech.rating} Stars`],
                    ['Completed Orders', tech.jobsCompleted],
                    ['On-Time Arrival Rate', `${tech.onTimeRate}%`],
                    ['Current Duty Status', tech.status],
                    ['Working Shift Hours', tech.workingHours]
                  ]);
                  addToast(`Official scorecard for ${tech.name} downloaded as CSV!`, 'success');
                }}
                className="w-full py-2.5 px-3 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-xs rounded-xl border border-slate-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Award className="w-4 h-4 text-slate-500" />
                <span>Download Pro Credential CSV</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Dispatch Timeline & Activity Feed (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {activeTab === 'timeline' && (
            <>
              {/* Dispatch Note Composer */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleImageUpload} 
                />

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs ring-2 ring-emerald-500/30 shrink-0">
                    DS
                  </div>
                  <input
                    id="tech-dispatch-note-input"
                    type="text"
                    placeholder={`Post dispatch log, SLA update or job note for ${tech.name}...`}
                    value={newDispatchNote}
                    onChange={e => setNewDispatchNote(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') handlePostNote();
                    }}
                    className="flex-1 bg-slate-100 hover:bg-slate-200/70 focus:bg-white text-xs px-4 py-3 rounded-full border border-transparent focus:border-emerald-500 focus:outline-none transition-all placeholder:text-slate-400 text-slate-900"
                  />
                </div>

                {/* Attached Photo Preview */}
                {attachedImage && (
                  <div className="relative inline-block mt-2">
                    <img 
                      src={attachedImage} 
                      alt="Worksite preview" 
                      className="h-20 w-32 object-cover rounded-xl border border-emerald-500 ring-2 ring-emerald-400/20 shadow-xs" 
                    />
                    <button
                      type="button"
                      onClick={() => setAttachedImage(null)}
                      className="absolute -top-2 -right-2 w-5 h-5 bg-rose-500 hover:bg-rose-600 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-xs cursor-pointer"
                      title="Remove photo"
                    >
                      ×
                    </button>
                  </div>
                )}

                <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
                  <div className="flex items-center gap-1 sm:gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                        attachedImage ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold' : 'hover:bg-slate-100 text-slate-600'
                      }`}
                    >
                      <ImageIcon className="w-4 h-4 text-emerald-600" />
                      <span className="hidden sm:inline">{attachedImage ? 'Photo Attached' : 'Add Photo'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setNewDispatchNote(prev => prev ? `${prev} [GPS Waypoint: Central Hub #04] ` : '[GPS Waypoint: Central Hub #04] ');
                        addToast('Attached live GPS waypoint to dispatch note', 'info');
                      }}
                      className="px-2.5 py-1.5 rounded-xl hover:bg-slate-100 text-slate-600 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <MapPin className="w-4 h-4 text-blue-600" />
                      <span className="hidden sm:inline">Route Log</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIsEmergencyPriority(prev => !prev);
                        addToast(!isEmergencyPriority ? 'Emergency dispatch SLA flagged!' : 'Emergency flag removed.', !isEmergencyPriority ? 'warning' : 'info');
                      }}
                      className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                        isEmergencyPriority ? 'bg-rose-50 text-rose-700 border border-rose-300 font-bold' : 'hover:bg-slate-100 text-slate-600'
                      }`}
                    >
                      <AlertTriangle className="w-4 h-4 text-rose-500" />
                      <span className="hidden sm:inline">{isEmergencyPriority ? 'Emergency SLA' : 'Emergency'}</span>
                    </button>
                  </div>

                  <button
                    onClick={handlePostNote}
                    className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Record Log</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Timeline Filter Bar */}
              <div className="flex items-center justify-between bg-white px-4 py-2.5 rounded-2xl border border-slate-200/90 shadow-2xs">
                <span className="text-xs font-extrabold text-slate-800">Technician Activity Stream</span>
                <div className="flex items-center gap-1 text-[11px] font-bold">
                  <button
                    onClick={() => setTimelineFilter('all')}
                    className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                      timelineFilter === 'all' ? 'bg-[#0C3832] text-white' : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    All Logs ({posts.length})
                  </button>
                  <button
                    onClick={() => setTimelineFilter('jobs')}
                    className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                      timelineFilter === 'jobs' ? 'bg-[#0C3832] text-white' : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    Dispatched Jobs
                  </button>
                  <button
                    onClick={() => setTimelineFilter('routes')}
                    className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                      timelineFilter === 'routes' ? 'bg-[#0C3832] text-white' : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    GPS &amp; Reviews
                  </button>
                </div>
              </div>

          {/* Timeline Feed Stream */}
          <div className="space-y-4">
            {posts
              .filter(post => {
                if (timelineFilter === 'jobs') return !!post.jobCard;
                if (timelineFilter === 'routes') return post.content.includes('GPS') || post.badge?.label.includes('Review');
                return true;
              })
              .map(post => (
              <div 
                key={post.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-4 transition-all hover:shadow-sm"
              >
                {/* Post Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={post.avatar}
                      alt={post.author}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-100"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-xs text-slate-900">{post.author}</span>
                        {post.isPinned && (
                          <span className="text-[9px] px-2 py-0.5 rounded-full font-bold uppercase bg-amber-100 text-amber-900 flex items-center gap-1">
                            <Pin className="w-2.5 h-2.5" />
                            Pinned
                          </span>
                        )}
                        {post.badge && (
                          <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${post.badge.color}`}>
                            {post.badge.label}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 font-medium">
                        {post.time}
                      </div>
                    </div>
                  </div>

                  <div className="relative">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setActivePostMenuId(activePostMenuId === post.id ? null : post.id);
                      }}
                      className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors"
                      title="Post Options"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>

                    {/* Popover Dropdown Menu */}
                    {activePostMenuId === post.id && (
                      <div 
                        className="absolute right-0 top-8 w-44 bg-white rounded-2xl shadow-xl border border-slate-200/90 py-1.5 z-20 animate-in fade-in zoom-in-95 text-xs text-slate-700"
                        onClick={e => e.stopPropagation()}
                      >
                        <button
                          onClick={() => handlePinPost(post.id)}
                          className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center gap-2 cursor-pointer font-medium"
                        >
                          <Pin className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{post.isPinned ? 'Unpin from Top' : 'Pin Log to Top'}</span>
                        </button>
                        <button
                          onClick={() => handleCopyLink(post.id)}
                          className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center gap-2 cursor-pointer font-medium"
                        >
                          <Copy className="w-3.5 h-3.5 text-blue-600" />
                          <span>Copy Link</span>
                        </button>
                        <div className="my-1 border-t border-slate-100" />
                        <button
                          onClick={() => handleDeletePost(post.id)}
                          className="w-full text-left px-3 py-2 hover:bg-rose-50 text-rose-600 flex items-center gap-2 cursor-pointer font-medium"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete Log</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Content */}
                <p className="text-xs text-slate-800 leading-relaxed">
                  {post.content}
                </p>

                {/* Job Card Attachment */}
                {post.jobCard && (
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                          {post.jobCard.id}
                        </span>
                        <span className="text-xs font-bold text-slate-900">{post.jobCard.title}</span>
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {post.jobCard.customer} • {post.jobCard.address}
                      </div>
                    </div>
                    <div className="text-right flex sm:flex-col items-center sm:items-end justify-between gap-1">
                      <span className="text-xs font-black text-slate-900">{post.jobCard.price}</span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        {post.jobCard.status}
                      </span>
                    </div>
                  </div>
                )}

                {/* Metrics */}
                <div className="flex items-center justify-between text-[11px] text-slate-500 px-1 pt-1 border-t border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[9px]">
                      👍
                    </span>
                    <span>{post.likes} Likes</span>
                  </div>
                  <div>
                    <span>{post.comments.length} Comments • Field Certified</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2 border-t border-b border-slate-100 py-1 text-xs">
                  <button
                    onClick={() => handleToggleLike(post.id)}
                    className={`py-1.5 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                      post.isLiked ? 'text-emerald-600 bg-emerald-50' : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>Acknowledge ({post.likes})</span>
                  </button>

                  <button
                    onClick={() => {
                      const input = document.getElementById(`tech-comment-${post.id}`);
                      input?.focus();
                    }}
                    className="py-1.5 rounded-xl text-slate-600 hover:bg-slate-100 font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Comment / Log</span>
                  </button>
                </div>

                {/* Comment Thread */}
                {post.comments.length > 0 && (
                  <div className="space-y-2 pt-1">
                    {post.comments.map(c => (
                      <div key={c.id} className="flex items-start gap-2.5">
                        <img
                          src={c.avatar}
                          alt={c.author}
                          className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5"
                        />
                        <div className="flex-1 bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
                          <div className="flex items-center justify-between">
                            <span className="font-extrabold text-[11px] text-slate-900">{c.author}</span>
                            <span className="text-[10px] text-slate-400">{c.time}</span>
                          </div>
                          <p className="text-xs text-slate-700 mt-0.5">{c.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Comment Input Box */}
                <div className="flex items-center gap-2 pt-1">
                  <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-[10px] shrink-0">
                    DS
                  </div>
                  <input
                    id={`tech-comment-${post.id}`}
                    type="text"
                    placeholder="Write a dispatch log or comment..."
                    value={commentInputs[post.id] || ''}
                    onChange={e => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                    onKeyDown={e => {
                      if (e.key === 'Enter') handleAddComment(post.id);
                    }}
                    className="flex-1 bg-slate-100 focus:bg-white text-xs px-3.5 py-2 rounded-full border border-transparent focus:border-emerald-500 focus:outline-none transition-all placeholder:text-slate-400 text-slate-900"
                  />
                  <button
                    onClick={() => handleAddComment(post.id)}
                    className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full transition-colors cursor-pointer shrink-0"
                  >
                    <Send className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
            </>
          )}

          {/* TAB 2: LICENSES & CREDENTIALS */}
          {activeTab === 'licenses' && (
            <div className="space-y-4">
              <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">Trade Certifications &amp; EPA Licenses</h3>
                    <p className="text-xs text-slate-500">Verified state licenses, municipal registrations, and safety badges</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    100% Verified
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                    <div className="flex items-center gap-2 text-emerald-700 font-extrabold">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>EPA Section 608 Universal Certification</span>
                    </div>
                    <div className="text-slate-600 font-mono">#EPA-TX-882194</div>
                    <p className="text-slate-500 text-[11px]">Authorized for Type I, II, and III high-pressure refrigerants (R-410A, R-32, R-22).</p>
                    <div className="text-[10px] text-emerald-700 font-bold">✓ Active through Dec 2028</div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                    <div className="flex items-center gap-2 text-blue-700 font-extrabold">
                      <Award className="w-4 h-4 text-blue-600" />
                      <span>Texas Master HVAC Contractor</span>
                    </div>
                    <div className="text-slate-600 font-mono">#TDLR-HVAC-94021</div>
                    <p className="text-slate-500 text-[11px]">Texas Department of Licensing &amp; Regulation Class A License.</p>
                    <div className="text-[10px] text-blue-700 font-bold">✓ Bonded &amp; Insured</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: FLEET VAN & REPLACEMENT PARTS */}
          {activeTab === 'van' && (
            <div className="space-y-4">
              <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">Assigned Fleet Van &amp; Inventory</h3>
                    <p className="text-xs text-slate-500">Vehicle tracking, tool audit status, and live replenishment queue</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-blue-100 text-blue-800 border border-blue-200">
                    Van #104 Active
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                      <Truck className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-extrabold text-slate-900">2024 Ford Transit 250 High-Roof (Fleet #104)</div>
                      <div className="text-[10px] text-slate-500">Odometer: 18,420 mi • Next Service: 22,000 mi • Fleet GPS Beacon Online</div>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-slate-700">TX-SVC-8492</span>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">Live Van Inventory</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {[
                      { item: 'Honeywell T6 Pro Thermostat', stock: '4 units in rack A' },
                      { item: 'R-410A Refrigerant Tank 25lb', stock: '2 tanks certified' },
                      { item: 'Copeland Scroll Dual Capacitor', stock: '8 units in bin C' },
                      { item: 'Fieldpiece Digital Manifold', stock: 'Calibrated Oct 2026' }
                    ].map((p, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
                        <div className="font-bold text-slate-800">{p.item}</div>
                        <div className="text-[10px] text-slate-500">{p.stock}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: WORKSITE PHOTOS */}
          {activeTab === 'photos' && (
            <div className="space-y-4">
              <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">Worksite Photos &amp; Job Gallery</h3>
                    <p className="text-xs text-slate-500">Camera captures from verified field dispatches</p>
                  </div>
                  <input 
                    type="file" 
                    ref={photoInputRef} 
                    className="hidden" 
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          const url = event.target?.result as string;
                          setTechPhotos(prev => [
                            { title: file.name.replace(/\.[^/.]+$/, ''), url },
                            ...prev
                          ]);
                          addToast(`Photo "${file.name}" uploaded to worksite gallery!`, 'success');
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                  <button 
                    onClick={() => photoInputRef.current?.click()}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
                  >
                    + Upload Photo
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {techPhotos.map((p, i) => (
                    <div key={i} className="rounded-2xl overflow-hidden border border-slate-200/80 bg-slate-50 p-2 space-y-1">
                      <img src={p.url} alt={p.title} className="w-full h-28 object-cover rounded-xl" />
                      <div className="text-[11px] font-bold text-slate-900 truncate">{p.title}</div>
                      <div className="text-[9px] text-slate-400">Verified by {tech.name}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: REVIEWS & CSAT */}
          {activeTab === 'reviews' && (
            <div className="space-y-4">
              <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">Verified Customer CSAT Ratings</h3>
                    <p className="text-xs text-slate-500">Average: <strong className="text-amber-500">★ {tech.rating}</strong> across {tech.jobsCompleted} dispatches</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-800">
                    Top Tier Fleet Pro
                  </span>
                </div>

                <div className="space-y-3">
                  {[
                    { customer: 'Eleanor Vance', rating: 5, comment: 'Michael arrived exactly on time, diagnosed our heat pump capacitor failure in 10 minutes, and had our AC cooling again immediately. Exceptional work!', date: 'Nov 12, 2026' },
                    { customer: 'David Stern', rating: 5, comment: 'Very professional, clean shoe covers, and explained the refrigerant pressure readings clearly. Highly recommend.', date: 'Nov 8, 2026' }
                  ].map((rev, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-xs text-slate-900">{rev.customer}</span>
                        <span className="text-[11px] font-bold text-amber-500">{'★'.repeat(rev.rating)}</span>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed">{rev.comment}</p>
                      <div className="text-[10px] text-slate-400">{rev.date} • Verified ServiceOS Booking</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
