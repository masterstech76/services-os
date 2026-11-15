import React, { useState, useRef } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { downloadCSV } from '../../utils/exportUtils';
import { 
  ArrowLeft, 
  User,
  MapPin, 
  Phone, 
  Mail, 
  Star, 
  CreditCard, 
  Clock, 
  ShieldCheck, 
  Gift, 
  Lock, 
  AlertTriangle,
  Calendar,
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
  Key,
  Briefcase,
  DollarSign,
  Award,
  MoreHorizontal,
  FileText,
  Pin,
  Copy,
  Trash2
} from 'lucide-react';

interface CustomerComment {
  id: string;
  author: string;
  avatar: string;
  time: string;
  text: string;
}

interface CustomerPost {
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
    tech: string;
    date: string;
    price: string;
    status: string;
  };
  likes: number;
  isLiked?: boolean;
  isPinned?: boolean;
  comments: CustomerComment[];
}

export const Page19CustomerProfile: React.FC = () => {
  const { 
    customers, 
    selectedCustomerId, 
    setSelectedCustomerId, 
    navigateToPage, 
    addToast,
    openUniversalEditModal,
    openSMSModal,
    bookings,
    updateCustomer,
    setIsCreateCustomerModalOpen,
    technicians
  } = useAdmin();

  const customer = customers.find(c => c.id === selectedCustomerId) || customers[0] || null;

  const [activeTab, setActiveTab] = useState<'timeline' | 'residences' | 'bookings' | 'photos' | 'support'>('timeline');

  // Cover photo presets using clean gradients
  const coverPresets = [
    'linear-gradient(135deg, #0C3832 0%, #134E45 50%, #1E293B 100%)',
    'linear-gradient(135deg, #1E1B4B 0%, #312E81 50%, #4338CA 100%)',
    'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #334155 100%)'
  ];
  const [coverPhoto, setCoverPhoto] = useState(coverPresets[0]);
  const [showCoverMenu, setShowCoverMenu] = useState(false);

  const equipInputRef = useRef<HTMLInputElement>(null);
  const [equipmentPhotos, setEquipmentPhotos] = useState<{ name: string; url: string; serial: string }[]>([]);

  // Dynamic Timeline posts state
  const [posts, setPosts] = useState<CustomerPost[]>([]);

  const [newNote, setNewNote] = useState('');
  const [commentInputs, setCommentInputs] = useState<{ [postId: string]: string }>({});
  const [activePostMenuId, setActivePostMenuId] = useState<string | null>(null);
  const [timelineFilter, setTimelineFilter] = useState<'all' | 'jobs' | 'reviews'>('all');
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [isPriorityFlag, setIsPriorityFlag] = useState(false);
  const [showPostSuccessAlert, setShowPostSuccessAlert] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!customer) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigateToPage(18)}
            className="p-2 bg-white border border-slate-200 hover:border-slate-300 rounded-xl text-slate-600 shadow-2xs transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Customer Profile</h1>
            <p className="text-xs text-slate-500 mt-1">Detailed client dossier, communication history, and service ledger</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-12 border border-slate-200/80 shadow-xs text-center flex flex-col items-center justify-center max-w-xl mx-auto my-12">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mb-4">
            <User className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">No Customers Registered</h2>
          <p className="text-xs text-slate-500 mt-2 max-w-sm">
            The customer directory is currently clean and empty. Register a customer or record an intake booking to view complete customer profile dossiers.
          </p>
          <div className="flex items-center gap-3 mt-6">
            <button
              onClick={() => navigateToPage(18)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
            >
              ← Customer Directory
            </button>
            <button
              onClick={() => setIsCreateCustomerModalOpen(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
            >
              + Register First Customer
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
        addToast('Equipment photo attached to customer record!', 'success');
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
        addToast('Customer record pinned to top of history!', 'success');
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
    addToast('Direct link to service record copied!', 'success');
    setActivePostMenuId(null);
  };

  const handleDeletePost = (postId: string) => {
    setPosts(prev => prev.filter(p => p.id !== postId));
    addToast('Service note deleted from customer profile.', 'info');
    setActivePostMenuId(null);
  };

  const handlePostNote = () => {
    if (!newNote.trim() && !attachedImage) {
      addToast('Please enter a note or attach a photo first.', 'warning');
      return;
    }

    const post: CustomerPost = {
      id: `p-${Date.now()}`,
      author: 'Operations Staff',
      authorRole: 'Central Dispatch',
      avatar: '',
      time: 'Just now • Internal Note',
      badge: isPriorityFlag 
        ? { label: 'PRIORITY ESCALATION', color: 'bg-rose-100 text-rose-800' }
        : { label: 'Customer Note', color: 'bg-purple-100 text-purple-800' },
      content: newNote.trim() || 'Worksite equipment photo logged to customer profile.',
      mediaUrl: attachedImage || undefined,
      likes: 0,
      isLiked: false,
      comments: []
    };

    setPosts([post, ...posts]);
    setNewNote('');
    setAttachedImage(null);
    setIsPriorityFlag(false);
    addToast('Customer note recorded to timeline!', 'success');
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
              author: 'Operations Staff',
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
      {/* 1. Header Navigation Bar & Customer Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigateToPage(18)}
            className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl border border-slate-200 transition-colors flex items-center gap-1.5 text-xs font-bold cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>All Customers</span>
          </button>

          <div className="h-4 w-[1px] bg-slate-200 hidden sm:block" />

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Customer Profile:</span>
            <span className="text-xs font-bold text-slate-900 bg-emerald-50 text-emerald-800 px-2.5 py-0.5 rounded-lg border border-emerald-200">
              {customer.name}
            </span>
          </div>
        </div>

        {/* Quick Customer Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-semibold">Switch Customer:</span>
          <select
            value={customer.id}
            onChange={e => setSelectedCustomerId(e.target.value)}
            className="text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-slate-800 focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            {customers.map(c => (
              <option key={c.id} value={c.id}>{c.name} ({c.city})</option>
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
            alt="Customer Estate Cover"
            onError={(e) => { (e.currentTarget as HTMLElement).style.display = 'none'; }}
            className="w-full h-full object-cover mix-blend-overlay opacity-80 transition-all duration-300 group-hover:scale-102"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/25" />

          {/* Watermark in Cover */}
          <div className="absolute top-4 left-6 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="font-extrabold text-[11px] tracking-wide uppercase">Verified Residential Account</span>
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
                    onClick={() => { setCoverPhoto(coverPresets[0]); setShowCoverMenu(false); addToast('Cover updated: Modern Luxury Home', 'success'); }}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl flex items-center gap-2"
                  >
                    🏡 Luxury Smart Home
                  </button>
                  <button
                    onClick={() => { setCoverPhoto(coverPresets[1]); setShowCoverMenu(false); addToast('Cover updated: Corporate HQ', 'success'); }}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl flex items-center gap-2"
                  >
                    🏢 Corporate HQ
                  </button>
                  <button
                    onClick={() => { setCoverPhoto(coverPresets[2]); setShowCoverMenu(false); addToast('Cover updated: Field Service Fleet', 'success'); }}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl flex items-center gap-2"
                  >
                    🚐 Field Fleet &amp; Van
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
                {customer.photo ? (
                  <img
                    src={customer.photo}
                    alt={customer.name}
                    className="w-32 h-32 sm:w-36 sm:h-36 md:w-42 md:h-42 rounded-full object-cover ring-4 ring-white shadow-2xl bg-white"
                  />
                ) : (
                  <div className="w-32 h-32 sm:w-36 sm:h-36 md:w-42 md:h-42 rounded-full bg-emerald-700 text-white flex items-center justify-center font-black text-4xl ring-4 ring-white shadow-2xl">
                    {customer.name ? customer.name.charAt(0).toUpperCase() : 'C'}
                  </div>
                )}
                <div className="absolute bottom-2 right-2 w-6 h-6 rounded-full bg-emerald-500 ring-4 ring-white shadow-sm flex items-center justify-center">
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                </div>
                <button
                  onClick={() => openUniversalEditModal({ type: 'customer', id: customer.id })}
                  className="absolute bottom-2 left-2 p-2 bg-slate-900/80 hover:bg-slate-900 text-white rounded-full shadow-lg transition-transform hover:scale-110 cursor-pointer"
                  title="Update customer photo"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Identity Titles on pure white card */}
              <div className="space-y-1.5 pt-3 md:pt-4">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    {customer.name}
                  </h1>
                  <div 
                    className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs"
                    title="Verified Customer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-purple-100 text-purple-800 border border-purple-200">
                    VIP Platinum Member
                  </span>
                </div>

                <div className="text-xs text-slate-500 font-medium flex flex-wrap items-center justify-center sm:justify-start gap-3">
                  <span className="font-bold text-slate-700">@{customer.name.toLowerCase().replace(/\s+/g, '_')}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {customer.address}
                  </span>
                  <span>•</span>
                  <span>{customer.totalBookings} Completed Work Orders</span>
                </div>

                {/* Team Collaborators */}
                <div className="flex items-center justify-center sm:justify-start gap-2 pt-1">
                  <span className="text-[11px] text-slate-500 font-medium">
                    Serviced by certified operations fleet
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Action Buttons */}
            <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2.5 pt-2 md:pt-0">
              <button
                onClick={() => {
                  const input = document.getElementById('customer-note-input');
                  input?.focus();
                  input?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  addToast('Focusing on customer note composer', 'info');
                }}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>+ Add Note / Ticket</span>
              </button>

              <button
                onClick={() => openUniversalEditModal({ type: 'customer', id: customer.id })}
                className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer border border-slate-200"
              >
                <Edit3 className="w-4 h-4 text-slate-600" />
                <span>Edit Profile</span>
              </button>

              <button
                onClick={() => {
                  const newSpend = (customer.lifetimeSpend || 0) + 25;
                  updateCustomer(customer.id, { lifetimeSpend: newSpend });
                  const promoPost: CustomerPost = {
                    id: `p-${Date.now()}`,
                    author: 'Billing & Operations Staff',
                    authorRole: 'System Promo Desk • Operations',
                    avatar: '',
                    time: 'Just now • Account Credit Issued',
                    badge: { label: 'PROMO CREDIT: +$25.00', color: 'bg-purple-100 text-purple-800' },
                    content: `Issued $25.00 discretionary courtesy credit to ${customer.name}'s account balance. Credited toward next recurring maintenance or emergency dispatch.`,
                    likes: 1,
                    isLiked: false,
                    comments: []
                  };
                  setPosts(prev => [promoPost, ...prev]);
                  addToast(`Issued $25.00 promotional credit to ${customer.name}!`, 'success');
                }}
                className="px-3.5 py-2.5 bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs rounded-xl border border-purple-200 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Gift className="w-4 h-4 text-purple-600" />
                <span>Issue $25 Credit</span>
              </button>

              <button
                onClick={() => navigateToPage(20)}
                className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer border border-slate-200"
              >
                <Clock className="w-4 h-4 text-slate-600" />
                <span>View Past Bookings</span>
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
                <span>📌 Timeline &amp; Service History</span>
              </button>

              <button
                onClick={() => setActiveTab('residences')}
                className={`px-4 py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                  activeTab === 'residences'
                    ? 'border-emerald-600 text-emerald-700 font-extrabold'
                    : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
                }`}
              >
                <span>👤 Contact &amp; Saved Residences</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-600 font-bold">2</span>
              </button>

              <button
                onClick={() => setActiveTab('bookings')}
                className={`px-4 py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                  activeTab === 'bookings'
                    ? 'border-emerald-600 text-emerald-700 font-extrabold'
                    : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
                }`}
              >
                <span>🛠️ Past Orders &amp; Invoices</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                  {customer.totalBookings}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('photos')}
                className={`px-4 py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                  activeTab === 'photos'
                    ? 'border-emerald-600 text-emerald-700 font-extrabold'
                    : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
                }`}
              >
                <span>📷 Property Photos &amp; Equipment</span>
              </button>

              <button
                onClick={() => setActiveTab('support')}
                className={`px-4 py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                  activeTab === 'support'
                    ? 'border-emerald-600 text-emerald-700 font-extrabold'
                    : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
                }`}
              >
                <span>💬 Support Logs &amp; Communication</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Two-Column Body Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Intro, Vitals & Gate Codes (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Customer Intro Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
            <h2 className="text-base font-extrabold text-slate-900 tracking-tight">Customer Vitals</h2>

            <p className="text-xs text-slate-600 leading-relaxed text-center bg-slate-50 p-3 rounded-2xl border border-slate-100 italic">
              {customer.notes ? `“${customer.notes}”` : '“Verified client account. Service history and property specifications recorded in work orders.”'}
            </p>

            <div className="space-y-3 pt-2 text-xs text-slate-700">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Email: <a href={`mailto:${customer.email}`} className="font-bold text-emerald-700 hover:underline">{customer.email}</a></span>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Direct Phone: <a href={`tel:${customer.phone}`} className="font-bold text-emerald-700 hover:underline">{customer.phone}</a></span>
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Primary Location: <strong className="text-slate-900">{customer.address}</strong></span>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Client Since: <strong className="text-slate-900">March 2023</strong></span>
              </div>
            </div>

            {/* Lifetime Metrics Summary */}
            <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100">
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-100 text-center">
                <div className="text-[10px] text-emerald-800 font-bold uppercase">Lifetime Spend</div>
                <div className="text-base font-black text-emerald-900">
                  ${customer.lifetimeSpend.toLocaleString()}
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-amber-50 border border-amber-100 text-center">
                <div className="text-[10px] text-amber-800 font-bold uppercase">Trust Rating</div>
                <div className="text-base font-black text-amber-900 flex items-center justify-center gap-1">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{customer.rating} / 5.0</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                <div className="text-[10px] text-slate-500 font-bold uppercase">Total Bookings</div>
                <div className="text-base font-black text-slate-900">
                  {customer.totalBookings} Jobs
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-blue-50 border border-blue-100 text-center">
                <div className="text-[10px] text-blue-800 font-bold uppercase">Dispute Frequency</div>
                <div className="text-base font-black text-blue-900">
                  0 (Clean)
                </div>
              </div>
            </div>
          </div>

          {/* 100% US / UK Saved Service Residences & Gate Codes */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-slate-900">Saved Residences &amp; Gate Codes</h3>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">2 Verified</span>
            </div>

            <div className="space-y-3">
              {/* Residence 1 - US Address */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                    Primary Residence (Green Villa Estate)
                  </span>
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                    Default
                  </span>
                </div>
                <p className="text-xs text-slate-600">{customer.address || 'Service territory address'}</p>
                <div className="text-[11px] text-slate-600 font-mono bg-white p-2.5 rounded-xl border border-slate-200">
                  <span className="font-bold text-amber-700">Gate Code: #8492</span> • Security: Ring bell twice; guard verifies ServiceOS pro badge.
                </div>
              </div>

              {/* Residence 2 - US Commercial */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    Commercial Office / Tech Hub
                  </span>
                  <span className="text-[10px] font-bold bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full">
                    Secondary
                  </span>
                </div>
                <p className="text-xs text-slate-600">{customer.address ? `${customer.address} (Suite 2)` : 'No secondary address on file'}</p>
                <div className="text-[11px] text-slate-600 font-mono bg-white p-2.5 rounded-xl border border-slate-200">
                  Standard dispatch access protocol verified for ServiceOS technician.
                </div>
              </div>
            </div>
          </div>

          {/* Property Equipment Photos */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">Equipment &amp; Worksite Photos</h3>
                <span className="text-[11px] text-slate-500">6 verified onsite assets</span>
              </div>
              <button 
                onClick={() => setActiveTab('photos')}
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:underline cursor-pointer"
              >
                See all
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {equipmentPhotos.length === 0 ? (
                <div className="col-span-3 py-8 text-center text-xs text-slate-400">
                  No equipment photos uploaded yet.
                </div>
              ) : (
                equipmentPhotos.map((eq, i) => (
                  <img
                    key={i}
                    src={eq.url}
                    alt={eq.name}
                    className="w-full h-24 object-cover rounded-xl shadow-2xs hover:opacity-90 transition-opacity cursor-pointer"
                  />
                ))
              )}
            </div>
          </div>

          {/* Recent Invoices & Financial Record */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">Recent Service Invoices</h3>
                <span className="text-[11px] text-slate-500">100% payment clearance record</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">Good Standing</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-center justify-between">
                <div>
                  <div className="font-extrabold text-slate-900">#INV-2026-092 • 4-Ton Heat Pump</div>
                  <div className="text-[10px] text-slate-500">Nov 14, 2026 • Stripe ACH Transfer</div>
                </div>
                <div className="text-right">
                  <span className="font-black text-emerald-700 text-sm">$3,450.00</span>
                  <span className="block text-[9px] font-bold text-emerald-600">PAID</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-center justify-between">
                <div>
                  <div className="font-extrabold text-slate-900">#INV-2026-081 • Annual Plumbing</div>
                  <div className="text-[10px] text-slate-500">Nov 11, 2026 • Card Ending 4892</div>
                </div>
                <div className="text-right">
                  <span className="font-black text-slate-900 text-sm">$189.00</span>
                  <span className="block text-[9px] font-bold text-emerald-600">PAID</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sticky Quick Actions Desk (Eliminates All Empty Scrolling Space) */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3 lg:sticky lg:top-20 z-10">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-slate-900">Direct Actions &amp; Contact</h3>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            <div className="space-y-2">
              <button
                onClick={() => {
                  const cleanPhone = customer.phone.replace(/[^0-9+]/g, '');
                  window.open(`tel:${cleanPhone}`);
                  addToast(`Placing live audio call to ${customer.name} at ${customer.phone}...`, 'info');
                }}
                className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Phone className="w-4 h-4" />
                <span>Call {customer.name.split(' ')[0]} Direct</span>
              </button>

              <button
                onClick={() => openSMSModal({ name: customer.name, phone: customer.phone, role: 'VIP Customer' })}
                className="w-full py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl border border-slate-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4 text-emerald-600" />
                <span>Send SMS / Appointment Alert</span>
              </button>

              <button
                onClick={() => {
                  downloadCSV(`${customer.name}_statement`, ['Property', 'Details'], [
                    ['Customer Name', customer.name],
                    ['Phone', customer.phone],
                    ['Email', customer.email],
                    ['Service Property Address', customer.address],
                    ['Lifetime Service Spend', `$${customer.lifetimeSpend}`],
                    ['Total Completed Bookings', customer.totalBookings],
                    ['Account Status', customer.status]
                  ]);
                  addToast(`Official statement for ${customer.name} downloaded as CSV!`, 'success');
                }}
                className="w-full py-2.5 px-3 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-xs rounded-xl border border-slate-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <FileText className="w-4 h-4 text-slate-500" />
                <span>Download CSV Statement &amp; History</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Timeline Feed (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {activeTab === 'timeline' && (
            <>
              {/* Status / Note Composer */}
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
                    OP
                  </div>
                  <input
                    id="customer-note-input"
                    type="text"
                    placeholder={`Add internal staff note or service record for ${customer.name}...`}
                    value={newNote}
                    onChange={e => setNewNote(e.target.value)}
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
                      alt="Equipment preview" 
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
                        const targetTech = technicians[0]?.name || 'On-Duty Pro';
                        setNewNote(prev => prev ? `${prev} @${targetTech} ` : `@${targetTech} `);
                        addToast(`Tagged pro @${targetTech}`, 'info');
                      }}
                      className="px-2.5 py-1.5 rounded-xl hover:bg-slate-100 text-slate-600 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Tag className="w-4 h-4 text-blue-600" />
                      <span className="hidden sm:inline">Tag Pro</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIsPriorityFlag(prev => !prev);
                        addToast(!isPriorityFlag ? 'Priority SLA flag applied!' : 'Priority SLA flag removed.', !isPriorityFlag ? 'warning' : 'info');
                      }}
                      className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                        isPriorityFlag ? 'bg-rose-50 text-rose-700 border border-rose-300 font-bold' : 'hover:bg-slate-100 text-slate-600'
                      }`}
                    >
                      <AlertTriangle className="w-4 h-4 text-rose-500" />
                      <span className="hidden sm:inline">{isPriorityFlag ? 'Priority SLA' : 'Flag Priority'}</span>
                    </button>
                  </div>

                  <button
                    onClick={handlePostNote}
                    className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Record Note</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Timeline Filter Bar */}
              <div className="flex items-center justify-between bg-white px-4 py-2.5 rounded-2xl border border-slate-200/90 shadow-2xs">
                <span className="text-xs font-extrabold text-slate-800">Customer Activity Feed</span>
                <div className="flex items-center gap-1 text-[11px] font-bold">
                  <button
                    onClick={() => setTimelineFilter('all')}
                    className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                      timelineFilter === 'all' ? 'bg-[#0C3832] text-white' : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    All History ({posts.length})
                  </button>
                  <button
                    onClick={() => setTimelineFilter('jobs')}
                    className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                      timelineFilter === 'jobs' ? 'bg-[#0C3832] text-white' : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    Completed Jobs
                  </button>
                  <button
                    onClick={() => setTimelineFilter('reviews')}
                    className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                      timelineFilter === 'reviews' ? 'bg-[#0C3832] text-white' : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    Reviews
                  </button>
                </div>
              </div>

              {/* Posts Stream */}
              <div className="space-y-4">
                {posts
                  .filter(post => {
                    if (timelineFilter === 'jobs') return !!post.jobCard;
                    if (timelineFilter === 'reviews') return post.badge?.label.includes('Rating') || post.badge?.label.includes('Review');
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
                              <span>{post.isPinned ? 'Unpin from Top' : 'Pin Record to Top'}</span>
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
                              <span>Delete Record</span>
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
                        {post.jobCard.tech} • {post.jobCard.date}
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
                    <span>{post.comments.length} Comments • Verified Order</span>
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
                    <span>Helpful ({post.likes})</span>
                  </button>

                  <button
                    onClick={() => {
                      const input = document.getElementById(`customer-comment-${post.id}`);
                      input?.focus();
                    }}
                    className="py-1.5 rounded-xl text-slate-600 hover:bg-slate-100 font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Comment / Note</span>
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
                    OP
                  </div>
                  <input
                    id={`customer-comment-${post.id}`}
                    type="text"
                    placeholder="Write a staff comment or audit log..."
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

          {/* TAB 2: RESIDENCES & PROPERTY SPECS */}
          {activeTab === 'residences' && (
            <div className="space-y-4">
              <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">Saved Properties &amp; Residences</h3>
                    <p className="text-xs text-slate-500">Registered service addresses with verified access codes and systems</p>
                  </div>
                  <button 
                    onClick={() => openUniversalEditModal({ type: 'customer', id: customer.id })}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
                  >
                    + Manage Residences &amp; Addresses
                  </button>
                </div>

                <div className="space-y-3.5">
                  {[
                    { address: customer.address, type: 'Primary Service Location', sqft: 'Residential', gate: '#Verified', hvac: 'Central Air & Heating' },
                  ].map((res, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-emerald-600" />
                          <span className="font-extrabold text-xs text-slate-900">{res.address}</span>
                        </div>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800">
                          {res.type}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs pt-1 border-t border-slate-200/60">
                        <div><span className="text-[10px] text-slate-400">Footprint:</span> <span className="font-bold text-slate-700">{res.sqft}</span></div>
                        <div><span className="text-[10px] text-slate-400">Gate PIN:</span> <span className="font-mono font-bold text-slate-900">{res.gate}</span></div>
                        <div><span className="text-[10px] text-slate-400">HVAC Vault:</span> <span className="font-bold text-slate-700">{res.hvac}</span></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PAST ORDERS & INVOICES */}
          {activeTab === 'bookings' && (
            <div className="space-y-4">
              <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">Work Orders &amp; Invoice Ledger</h3>
                    <p className="text-xs text-slate-500">Service visits, scheduled maintenance, and paid invoices</p>
                  </div>
                  <button
                    onClick={() => {
                      downloadCSV(`${customer.name}_orders`, ['Job #', 'Service', 'Date', 'Status', 'Amount'], bookings.slice(0, 6).map(b => [b.jobNo, b.serviceName, b.scheduleDate, b.status, `$${b.estimate}`]));
                      addToast('Customer orders downloaded to CSV spreadsheet!', 'success');
                    }}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <FileText className="w-3.5 h-3.5 text-slate-500" />
                    <span>Export CSV</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200/70 text-slate-400 font-extrabold uppercase tracking-wider text-[10px]">
                        <th className="py-2.5 px-3">Job #</th>
                        <th className="py-2.5 px-3">Service</th>
                        <th className="py-2.5 px-3">Schedule</th>
                        <th className="py-2.5 px-3">Status</th>
                        <th className="py-2.5 px-3 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {bookings.slice(0, 6).map(b => (
                        <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3 px-3 font-mono font-bold text-slate-800">{b.jobNo}</td>
                          <td className="py-3 px-3">
                            <div className="font-bold text-slate-900">{b.serviceName}</div>
                            <div className="text-[10px] text-slate-500">{b.category} Pro: {b.technicianName}</div>
                          </td>
                          <td className="py-3 px-3 text-slate-600">{b.scheduleDate}</td>
                          <td className="py-3 px-3">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800">
                              {b.status}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right font-black text-slate-900">${b.estimate}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PROPERTY PHOTOS & EQUIPMENT */}
          {activeTab === 'photos' && (
            <div className="space-y-4">
              <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">Installed Equipment &amp; Property Media</h3>
                    <p className="text-xs text-slate-500">Verified serial tags, breaker specs, and installation records</p>
                  </div>
                  <input 
                    type="file" 
                    ref={equipInputRef} 
                    className="hidden" 
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          const url = event.target?.result as string;
                          const name = file.name.replace(/\.[^/.]+$/, '');
                          const serial = `SN-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
                          setEquipmentPhotos(prev => [
                            { name, url, serial },
                            ...prev
                          ]);
                          addToast(`Equipment photo tag "${name}" uploaded successfully!`, 'success');
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                  <button 
                    onClick={() => equipInputRef.current?.click()}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
                  >
                    + Add Equipment Tag
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {equipmentPhotos.map((eq, i) => (
                    <div key={i} className="rounded-2xl overflow-hidden border border-slate-200/80 bg-slate-50 space-y-1 p-2">
                      <img src={eq.url} alt={eq.name} className="w-full h-28 object-cover rounded-xl" />
                      <div className="text-[11px] font-bold text-slate-900 truncate">{eq.name}</div>
                      <div className="text-[9px] font-mono text-slate-500">{eq.serial}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: SUPPORT LOGS & COMMUNICATION */}
          {activeTab === 'support' && (
            <div className="space-y-4">
              <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">Support Logs &amp; Concierge Care</h3>
                    <p className="text-xs text-slate-500">Live communication history, SMS pings, and dispatcher overrides</p>
                  </div>
                  <button 
                    onClick={() => openSMSModal({ name: customer.name, phone: customer.phone, role: 'Customer' })}
                    className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Direct SMS</span>
                  </button>
                </div>

                <div className="space-y-2.5">
                  {bookings.filter(b => b.customerName === customer.name).length === 0 ? (
                    <div className="py-8 text-center text-xs text-slate-400">
                      No support communication logs or service dispatches recorded yet for this client.
                    </div>
                  ) : (
                    bookings.filter(b => b.customerName === customer.name).map((b, idx) => (
                      <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/60 flex items-start justify-between">
                        <div>
                          <div className="font-bold text-xs text-slate-900">{b.serviceName} ({b.jobNo})</div>
                          <div className="text-[11px] text-slate-600 mt-0.5">Assigned to {b.technicianName} • Status: {b.status}</div>
                        </div>
                        <span className="text-[10px] text-slate-400 font-medium shrink-0 ml-3">{b.scheduleDate}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
