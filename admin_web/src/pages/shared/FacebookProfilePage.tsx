import React, { useState, useRef } from 'react';
import { useAdmin, ViewingProfileTarget } from '../../context/AdminContext';
import { downloadCSV } from '../../utils/exportUtils';
import { 
  Camera, 
  MapPin, 
  Phone, 
  Mail, 
  Briefcase, 
  GraduationCap, 
  Calendar, 
  ShieldCheck, 
  CheckCircle2, 
  Edit3, 
  Share2, 
  MoreHorizontal, 
  ThumbsUp, 
  MessageSquare, 
  Send, 
  Image as ImageIcon, 
  Tag, 
  AlertTriangle, 
  Sparkles, 
  Lock, 
  ChevronDown, 
  ArrowLeft,
  FileText,
  Clock,
  Star,
  DollarSign,
  Truck,
  Key,
  Flame,
  Award,
  Layers,
  Search,
  ExternalLink,
  Pin,
  Copy,
  Trash2,
  Check
} from 'lucide-react';

interface FeedComment {
  id: string;
  author: string;
  avatar: string;
  time: string;
  text: string;
}

interface FeedPost {
  id: string;
  author: string;
  authorRole: string;
  avatar: string;
  time: string;
  privacy: 'public' | 'team' | 'confidential';
  content: string;
  badge?: { label: string; color: string };
  mediaUrl?: string;
  mediaCaption?: string;
  beforeAfter?: { before: string; after: string; title: string };
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
  comments: FeedComment[];
}

export const FacebookProfilePage: React.FC = () => {
  const { 
    userProfile, 
    currentRole, 
    agencyName,
    customers, 
    technicians, 
    staffMembers, 
    bookings,
    invoices,
    activeProfileTarget, 
    setActiveProfileTarget,
    navigateToPage,
    navigateToStaffPage,
    addToast,
    openUniversalEditModal,
    openSMSModal,
    setIsCreateTechnicianModalOpen
  } = useAdmin();

  // Active Tab
  const [activeTab, setActiveTab] = useState<'timeline' | 'about' | 'team' | 'photos' | 'orders' | 'security'>('timeline');

  // Cover image presets
  const coverPresets = [
    'linear-gradient(135deg, #0C3832 0%, #134E45 50%, #1E293B 100%)',
    'linear-gradient(135deg, #1E1B4B 0%, #312E81 50%, #4338CA 100%)',
    'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #334155 100%)'
  ];
  const [coverPhoto, setCoverPhoto] = useState<string>(coverPresets[0]);
  const [showCoverMenu, setShowCoverMenu] = useState(false);

  const mediaInputRef = useRef<HTMLInputElement>(null);
  const [mediaVault, setMediaVault] = useState<{ title: string; tag: string; url: string }[]>([]);

  // Determine current profile entity based on activeProfileTarget
  const targetType = activeProfileTarget?.type || (currentRole === 'ADMIN' ? 'admin' : 'staff');
  const targetId = activeProfileTarget?.id;

  let profileData = {
    name: userProfile.name,
    roleTitle: userProfile.title,
    handle: `@${userProfile.name ? userProfile.name.toLowerCase().replace(/\s+/g, '_') : 'user'}`,
    avatar: userProfile.avatar,
    bio: userProfile.bio || 'Managing multi-zone field operations, technician logistics, and emergency dispatch.',
    phone: userProfile.phone,
    email: userProfile.email,
    address: userProfile.territory,
    company: agencyName || 'Field Operations Platform',
    education: 'Operations Management',
    joinedDate: 'Active',
    accessCode: 'Verified Access Key',
    rating: 5.0,
    jobsCount: 0,
    lifetimeSpend: '$0.00',
    sla: '100%',
    verified: true,
    userCategory: 'Administrator'
  };

  if (targetType === 'customer') {
    const cust = customers.find(c => c.id === targetId) || customers[0];
    if (cust) {
      profileData = {
        name: cust.name,
        roleTitle: 'Registered Customer',
        handle: `@${cust.name.toLowerCase().replace(/\s+/g, '_')}`,
        avatar: cust.photo || '',
        bio: `Customer in ${cust.city || 'service area'}.`,
        phone: cust.phone,
        email: cust.email,
        address: cust.address,
        company: 'Customer Account',
        education: `Account #${cust.id}`,
        joinedDate: 'Active',
        accessCode: 'Verified Client',
        rating: cust.rating,
        jobsCount: cust.totalBookings,
        lifetimeSpend: `$${(cust.lifetimeSpend || 0).toLocaleString()}`,
        sla: '100% On-Time',
        verified: true,
        userCategory: 'Customer'
      };
    } else {
      profileData = {
        name: 'No Customer Selected',
        roleTitle: 'Customer',
        handle: '@customer',
        avatar: '',
        bio: 'No customer profiles currently registered.',
        phone: '',
        email: '',
        address: '',
        company: 'N/A',
        education: 'N/A',
        joinedDate: 'N/A',
        accessCode: 'N/A',
        rating: 5.0,
        jobsCount: 0,
        lifetimeSpend: '$0.00',
        sla: '100%',
        verified: false,
        userCategory: 'Customer'
      };
    }
  } else if (targetType === 'technician') {
    const tech = technicians.find(t => t.id === targetId) || technicians[0];
    if (tech) {
      profileData = {
        name: tech.name,
        roleTitle: `${tech.specialization} Pro`,
        handle: `@${tech.name.toLowerCase().replace(/\s+/g, '_')}_pro`,
        avatar: tech.photo || '',
        bio: `Field technician specializing in ${tech.specialization}. Shift: ${tech.workingHours || 'Standard'}.`,
        phone: tech.phone,
        email: tech.phone ? `${tech.phone}@servicepro.local` : '',
        address: 'Service Territory Fleet',
        company: agencyName || 'Field Fleet',
        education: `${tech.specialization} Certified`,
        joinedDate: 'Active',
        accessCode: `Status: ${tech.status}`,
        rating: tech.rating,
        jobsCount: tech.jobsCompleted,
        lifetimeSpend: `$${tech.jobsCompleted * 150} Value`,
        sla: `${tech.onTimeRate}% SLA`,
        verified: true,
        userCategory: 'Technician'
      };
    } else {
      profileData = {
        name: 'No Technician Selected',
        roleTitle: 'Technician',
        handle: '@technician',
        avatar: '',
        bio: 'No field technicians currently onboarded.',
        phone: '',
        email: '',
        address: '',
        company: 'N/A',
        education: 'N/A',
        joinedDate: 'N/A',
        accessCode: 'N/A',
        rating: 5.0,
        jobsCount: 0,
        lifetimeSpend: '$0.00',
        sla: '100%',
        verified: false,
        userCategory: 'Technician'
      };
    }
  } else if (targetType === 'staff') {
    const staff = staffMembers.find(s => s.id === targetId) || staffMembers[0];
    if (staff) {
      profileData = {
        name: staff.name,
        roleTitle: staff.role,
        handle: `@${staff.name.toLowerCase().replace(/\s+/g, '_')}`,
        avatar: staff.photo || '',
        bio: `Dispatch and customer operations staff. Handling orders and communications.`,
        phone: staff.phone,
        email: staff.email,
        address: staff.territory || staff.department || 'Operations Hub',
        company: agencyName || 'Operations Desk',
        education: 'Staff Specialist',
        joinedDate: staff.joinedDate || 'Active',
        accessCode: `Shift: ${staff.shiftHours}`,
        rating: 5.0,
        jobsCount: staff.totalOrdersHandled || 0,
        lifetimeSpend: 'Desk Triage',
        sla: '100% SLA',
        verified: true,
        userCategory: 'Staff'
      };
    } else {
      profileData = {
        name: 'No Staff Selected',
        roleTitle: 'Staff',
        handle: '@staff',
        avatar: '',
        bio: 'No operations staff currently registered.',
        phone: '',
        email: '',
        address: '',
        company: 'N/A',
        education: 'N/A',
        joinedDate: 'N/A',
        accessCode: 'N/A',
        rating: 5.0,
        jobsCount: 0,
        lifetimeSpend: 'N/A',
        sla: '100%',
        verified: false,
        userCategory: 'Staff'
      };
    }
  }

  // Interactive Feed Posts
  const [feedPosts, setFeedPosts] = useState<FeedPost[]>([]);

  // Composer State & Timeline Interactive Tools
  const [newPostContent, setNewPostContent] = useState('');
  const [commentInputs, setCommentInputs] = useState<{ [postId: string]: string }>({});
  const [activePostMenuId, setActivePostMenuId] = useState<string | null>(null);
  const [timelineFilter, setTimelineFilter] = useState<'all' | 'jobs' | 'dispatches'>('all');
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [isEmergencyFlag, setIsEmergencyFlag] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setAttachedImage(reader.result as string);
        addToast('Worksite photo attached to composer!', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePinPost = (postId: string) => {
    setFeedPosts(prev => {
      const target = prev.find(p => p.id === postId);
      if (!target) return prev;
      const willPin = !target.isPinned;
      const updated = prev.map(p => p.id === postId ? { ...p, isPinned: willPin } : p);
      if (willPin) {
        const pinned = updated.find(p => p.id === postId)!;
        const rest = updated.filter(p => p.id !== postId);
        addToast('Post pinned to top of profile feed!', 'success');
        return [pinned, ...rest];
      } else {
        addToast('Post unpinned from top.', 'info');
        return updated;
      }
    });
    setActivePostMenuId(null);
  };

  const handleCopyLink = (postId: string) => {
    const url = `${window.location.origin}${window.location.pathname}#post-${postId}`;
    navigator.clipboard.writeText(url);
    addToast('Direct link to timeline post copied to clipboard!', 'success');
    setActivePostMenuId(null);
  };

  const handleDeletePost = (postId: string) => {
    setFeedPosts(prev => prev.filter(p => p.id !== postId));
    addToast('Post permanently deleted from profile timeline.', 'info');
    setActivePostMenuId(null);
  };

  const handleCreatePost = () => {
    if (!newPostContent.trim() && !attachedImage) {
      addToast('Please enter an update or attach a photo first.', 'warning');
      return;
    }

    const newPost: FeedPost = {
      id: `post-${Date.now()}`,
      author: userProfile.name,
      authorRole: userProfile.title,
      avatar: userProfile.avatar,
      time: 'Just now • 🌐 Public Update',
      privacy: 'public',
      badge: isEmergencyFlag 
        ? { label: 'CRITICAL SLA ALERT', color: 'bg-rose-100 text-rose-800' }
        : { label: 'Staff Note', color: 'bg-purple-100 text-purple-800' },
      content: newPostContent.trim() || 'Worksite media update recorded for customer profile.',
      mediaUrl: attachedImage || undefined,
      mediaCaption: attachedImage ? 'Worksite photo logged by operator' : undefined,
      likes: 0,
      isLiked: false,
      comments: []
    };

    setFeedPosts([newPost, ...feedPosts]);
    setNewPostContent('');
    setAttachedImage(null);
    setIsEmergencyFlag(false);
    addToast('Status update published to profile timeline!', 'success');
  };

  const handleToggleLike = (postId: string) => {
    setFeedPosts(prev => prev.map(p => {
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

    setFeedPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          comments: [
            ...p.comments,
            {
              id: `c-${Date.now()}`,
              author: userProfile.name,
              avatar: userProfile.avatar,
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
      {/* 1. Return Button Bar & Quick Switcher Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (currentRole === 'ADMIN') {
                navigateToPage(1);
              } else {
                navigateToStaffPage(101);
              }
            }}
            className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl border border-slate-200 transition-colors flex items-center gap-1.5 text-xs font-bold cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>

          <div className="h-4 w-[1px] bg-slate-200 hidden sm:block" />

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Viewing Profile:</span>
            <span className="text-xs font-bold text-slate-900 bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-lg border border-emerald-200">
              {profileData.userCategory}: {profileData.name}
            </span>
          </div>
        </div>

        {/* Instant User Persona Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-semibold">Switch User Profile:</span>
          <select
            value={`${targetType}:${targetId || (targetType === 'admin' ? 'admin' : targetType === 'staff' ? 'S1' : targetType === 'customer' ? 'C1' : 'T1')}`}
            onChange={(e) => {
              const [type, id] = e.target.value.split(':') as ['admin' | 'staff' | 'technician' | 'customer', string];
              setActiveProfileTarget({ type, id });
              addToast(`Switched profile view to ${type.toUpperCase()}`, 'info');
            }}
            className="text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-slate-800 focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            <optgroup label="Administrators & Owners">
              <option value="admin:admin">{userProfile.name || 'System Admin'} ({userProfile.role})</option>
            </optgroup>
            <optgroup label="Operations Staff">
              {staffMembers.map(s => (
                <option key={s.id} value={`staff:${s.id}`}>{s.name} ({s.role})</option>
              ))}
            </optgroup>
            <optgroup label="Field Technicians">
              {technicians.map(t => (
                <option key={t.id} value={`technician:${t.id}`}>{t.name} ({t.specialization} Pro)</option>
              ))}
            </optgroup>
            <optgroup label="VIP Customers">
              {customers.map(c => (
                <option key={c.id} value={`customer:${c.id}`}>{c.name} ({c.city})</option>
              ))}
            </optgroup>
          </select>
        </div>
      </div>

      {/* 2. Facebook Profile Hero Area: Wide Cover + Overlapping Avatar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        {/* Cover Photo Banner with Rich Emerald/Slate Fallback */}
        <div className="relative h-60 sm:h-72 md:h-80 w-full bg-gradient-to-r from-[#07241f] via-[#0e433b] to-[#1a6659] group overflow-hidden">
          {/* Subtle geometric dot grid pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(#34d399_1px,transparent_1px)] [background-size:20px_20px] opacity-25" />
          
          {/* High-res background image */}
          {coverPhoto && (
            <img
              src={coverPhoto}
              alt="Profile Cover"
              onError={(e) => { (e.currentTarget as HTMLElement).style.display = 'none'; }}
              className="w-full h-full object-cover mix-blend-overlay opacity-80 transition-all duration-300 group-hover:scale-102"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/25" />

          {/* Cover Watermark Badge */}
          <div className="absolute top-4 left-6 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="font-extrabold text-[11px] tracking-wide uppercase">ServicePro OS Enterprise Fleet</span>
          </div>

          {/* Change Cover Photo Trigger */}
          <div className="absolute bottom-4 right-4 z-10">
            <button
              onClick={() => setShowCoverMenu(prev => !prev)}
              className="px-3.5 py-2 bg-white/95 hover:bg-white text-slate-900 font-extrabold text-xs rounded-xl shadow-lg backdrop-blur-md transition-all flex items-center gap-2 cursor-pointer border border-white/40"
            >
              <Camera className="w-4 h-4 text-slate-700" />
              <span>Edit Cover Photo</span>
            </button>

            {/* Cover Presets Dropdown */}
            {showCoverMenu && (
              <div className="absolute right-0 bottom-12 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200 p-2 z-30">
                <div className="text-[11px] font-bold text-slate-500 px-3 py-1.5 uppercase tracking-wider">
                  Select Cover Preset
                </div>
                <div className="space-y-1">
                  <button
                    onClick={() => { setCoverPhoto(coverPresets[0]); setShowCoverMenu(false); addToast('Cover photo updated: Corporate HQ', 'success'); }}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl flex items-center gap-2"
                  >
                    🏢 Corporate HQ
                  </button>
                  <button
                    onClick={() => { setCoverPhoto(coverPresets[1]); setShowCoverMenu(false); addToast('Cover photo updated: Field Fleet & Van', 'success'); }}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl flex items-center gap-2"
                  >
                    🚐 Service Fleet &amp; Van
                  </button>
                  <button
                    onClick={() => { setCoverPhoto(coverPresets[2]); setShowCoverMenu(false); addToast('Cover photo updated: Luxury Modern Home', 'success'); }}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl flex items-center gap-2"
                  >
                    🏡 Luxury Smart Home
                  </button>
                  <button
                    onClick={() => { setCoverPhoto(coverPresets[3]); setShowCoverMenu(false); addToast('Cover photo updated: Control Room', 'success'); }}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl flex items-center gap-2"
                  >
                    💻 Operations Control Room
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
              {/* Circular Overlapping Avatar with Camera Icon */}
              <div className="relative -mt-16 sm:-mt-20 md:-mt-24 shrink-0 z-10">
                {profileData.avatar ? (
                  <img
                    src={profileData.avatar}
                    alt={profileData.name}
                    className="w-32 h-32 sm:w-36 sm:h-36 md:w-42 md:h-42 rounded-full object-cover ring-4 ring-white shadow-2xl bg-white"
                  />
                ) : (
                  <div className="w-32 h-32 sm:w-36 sm:h-36 md:w-42 md:h-42 rounded-full bg-emerald-700 text-white flex items-center justify-center font-black text-4xl ring-4 ring-white shadow-2xl">
                    {profileData.name ? profileData.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                )}
                {/* Online indicator dot */}
                <div className="absolute bottom-2 right-2 w-6 h-6 rounded-full bg-emerald-500 ring-4 ring-white shadow-sm flex items-center justify-center">
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                </div>
                {/* Upload camera button */}
                <button
                  onClick={() => openUniversalEditModal(activeProfileTarget)}
                  className="absolute bottom-2 left-2 p-2 bg-slate-900/80 hover:bg-slate-900 text-white rounded-full shadow-lg transition-transform hover:scale-110 cursor-pointer"
                  title="Update profile picture"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Identity Titles & Connections on pure white card */}
              <div className="space-y-1.5 pt-3 md:pt-4">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    {profileData.name}
                  </h1>
                  {profileData.verified && (
                    <div 
                      className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs"
                      title="Verified Identity"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  )}
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    {profileData.roleTitle}
                  </span>
                </div>

                <div className="text-xs text-slate-500 font-medium flex flex-wrap items-center justify-center sm:justify-start gap-3">
                  <span className="font-bold text-slate-700">{profileData.handle}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {profileData.address || 'Operations Territory'}
                  </span>
                  <span>•</span>
                  <span>{profileData.jobsCount} Completed Work Orders</span>
                </div>

                {/* Team Collaborators */}
                <div className="flex items-center justify-center sm:justify-start gap-2 pt-1">
                  <span className="text-[11px] text-slate-500 font-medium">
                    Connected with verified field operations workforce
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Primary Facebook Action Buttons */}
            <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2.5 pt-4 md:pt-0">
              <button
                onClick={() => {
                  const input = document.getElementById('facebook-status-input');
                  input?.focus();
                  addToast('Focusing on status composer', 'info');
                }}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>+ Post Update / Note</span>
              </button>

              <button
                onClick={() => openUniversalEditModal(activeProfileTarget)}
                className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer border border-slate-200"
              >
                <Edit3 className="w-4 h-4 text-slate-600" />
                <span>Edit Profile</span>
              </button>

              <button
                onClick={() => {
                  navigator.clipboard?.writeText?.(window.location.href);
                  addToast('Profile link copied to clipboard!', 'success');
                }}
                className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl border border-slate-200 transition-colors cursor-pointer"
                title="Share Profile Link"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Facebook Profile Navigation Tabs */}
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
                <span>📌 Timeline Feed</span>
              </button>

              <button
                onClick={() => setActiveTab('about')}
                className={`px-4 py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                  activeTab === 'about'
                    ? 'border-emerald-600 text-emerald-700 font-extrabold'
                    : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
                }`}
              >
                <span>👤 About &amp; Vitals</span>
              </button>

              <button
                onClick={() => setActiveTab('team')}
                className={`px-4 py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                  activeTab === 'team'
                    ? 'border-emerald-600 text-emerald-700 font-extrabold'
                    : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
                }`}
              >
                <span>👥 Team &amp; Pros</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-600 font-bold">18</span>
              </button>

              <button
                onClick={() => setActiveTab('photos')}
                className={`px-4 py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                  activeTab === 'photos'
                    ? 'border-emerald-600 text-emerald-700 font-extrabold'
                    : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
                }`}
              >
                <span>📷 Worksite Photos &amp; Media</span>
              </button>

              <button
                onClick={() => setActiveTab('orders')}
                className={`px-4 py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                  activeTab === 'orders'
                    ? 'border-emerald-600 text-emerald-700 font-extrabold'
                    : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
                }`}
              >
                <span>🛠️ Jobs &amp; Orders</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                  {profileData.jobsCount}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('security')}
                className={`px-4 py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                  activeTab === 'security'
                    ? 'border-emerald-600 text-emerald-700 font-extrabold'
                    : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
                }`}
              >
                <span>🔒 Security &amp; Audit</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Facebook Two-Column Body Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Intro, Vitals & Fast Facts (Facebook Left Sidebar - 5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* A. Intro Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
            <h2 className="text-base font-extrabold text-slate-900 tracking-tight">Intro</h2>
            
            {/* Bio text */}
            <p className="text-xs text-slate-600 leading-relaxed text-center bg-slate-50 p-3 rounded-2xl border border-slate-100 italic">
              “{profileData.bio}”
            </p>

            <button
              onClick={() => openUniversalEditModal(activeProfileTarget)}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
            >
              Edit Bio &amp; Vitals
            </button>

            {/* Facebook-style quick facts list */}
            <div className="space-y-3 pt-2 text-xs text-slate-700">
              <div className="flex items-center gap-3">
                <Briefcase className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Works at <strong className="text-slate-900">{profileData.company}</strong></span>
              </div>

              <div className="flex items-center gap-3">
                <GraduationCap className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Credentials: <strong className="text-slate-900">{profileData.education}</strong></span>
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Location: <strong className="text-slate-900">{profileData.address}</strong></span>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Direct Phone: <a href={`tel:${profileData.phone}`} className="font-bold text-emerald-700 hover:underline">{profileData.phone}</a></span>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Email: <a href={`mailto:${profileData.email}`} className="font-bold text-emerald-700 hover:underline">{profileData.email}</a></span>
              </div>

              <div className="flex items-center gap-3">
                <Key className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Security / Access: <strong className="text-slate-900 font-mono text-[11px] bg-amber-50 px-2 py-0.5 rounded border border-amber-200">{profileData.accessCode}</strong></span>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Member Since <strong className="text-slate-900">{profileData.joinedDate}</strong></span>
              </div>
            </div>

            {/* Performance Pills */}
            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100">
              <div className="p-2.5 rounded-2xl bg-amber-50 border border-amber-100 text-center">
                <div className="text-[10px] text-amber-800 font-bold uppercase">Rating</div>
                <div className="text-sm font-extrabold text-amber-900 flex items-center justify-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{profileData.rating}</span>
                </div>
              </div>

              <div className="p-2.5 rounded-2xl bg-emerald-50 border border-emerald-100 text-center">
                <div className="text-[10px] text-emerald-800 font-bold uppercase">Lifetime</div>
                <div className="text-sm font-extrabold text-emerald-900">
                  {profileData.lifetimeSpend}
                </div>
              </div>

              <div className="p-2.5 rounded-2xl bg-indigo-50 border border-indigo-100 text-center">
                <div className="text-[10px] text-indigo-800 font-bold uppercase">SLA Rating</div>
                <div className="text-sm font-extrabold text-indigo-900">
                  {profileData.sla}
                </div>
              </div>
            </div>

            {/* Featured Skills / Tags */}
            <div className="pt-2">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Verified Tags &amp; Skills</div>
              <div className="flex flex-wrap gap-1.5">
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-bold">HVAC Heat Pumps</span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-bold">Central Territory</span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-bold">EPA Universal</span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-bold">Emergency SLA</span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-bold">OSHA 30</span>
              </div>
            </div>
          </div>

          {/* B. Featured Photos Grid (Facebook Photos Sidebar Box) */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">Photos &amp; Worksite Media</h3>
                <span className="text-[11px] text-slate-500">24 uploaded job photos</span>
              </div>
              <button 
                onClick={() => setActiveTab('photos')}
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:underline cursor-pointer"
              >
                See all
              </button>
            </div>

            {/* Photos & Media Vault Grid */}
            <div className="grid grid-cols-3 gap-2">
              {mediaVault.length === 0 ? (
                <div className="col-span-3 py-8 text-center text-xs text-slate-400">
                  No photos archived in media vault yet.
                </div>
              ) : (
                mediaVault.map((m, idx) => (
                  <img
                    key={idx}
                    src={m.url}
                    alt={m.title}
                    className="w-full h-24 object-cover rounded-xl shadow-2xs hover:opacity-90 transition-opacity cursor-pointer"
                  />
                ))
              )}
            </div>
          </div>

          {/* C. Collaborators & Team Pros */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">Team Pros &amp; Collaborators</h3>
                <span className="text-[11px] text-slate-500">18 active field teammates</span>
              </div>
              <button 
                onClick={() => setActiveTab('team')}
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:underline cursor-pointer"
              >
                See all
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {technicians.slice(0, 3).map(tech => (
                <div 
                  key={tech.id} 
                  onClick={() => {
                    setActiveProfileTarget({ type: 'technician', id: tech.id });
                    addToast(`Viewing technician ${tech.name}`, 'info');
                  }}
                  className="group cursor-pointer text-center space-y-1"
                >
                  <img
                    src={tech.photo}
                    alt={tech.name}
                    className="w-full h-20 object-cover rounded-xl group-hover:scale-105 transition-transform"
                  />
                  <div className="text-[11px] font-bold text-slate-800 truncate">{tech.name}</div>
                  <div className="text-[9px] text-slate-500 truncate">{tech.specialization} Pro</div>
                </div>
              ))}
            </div>
          </div>

          {/* D. Recent Invoices & Billing Summary */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">Recent Invoices &amp; Billing</h3>
                <span className="text-[11px] text-slate-500">Auto-reconciled via Stripe &amp; Cloud</span>
              </div>
              <button 
                onClick={() => navigateToPage(27)}
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:underline cursor-pointer"
              >
                Ledger
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              {invoices.length === 0 ? (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 text-center text-slate-500 text-xs">
                  No billing transactions found. Invoices generated upon completed bookings will appear here.
                </div>
              ) : (
                invoices.slice(0, 3).map((inv) => (
                  <div key={inv.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-center justify-between">
                    <div>
                      <div className="font-extrabold text-slate-900">#{inv.invoiceNo} • {inv.serviceName || 'Service'}</div>
                      <div className="text-[10px] text-slate-500">{inv.date} • Stripe Escrow</div>
                    </div>
                    <div className="text-right">
                      <span className="font-black text-emerald-700">${(inv.amount || 0).toFixed(2)}</span>
                      <span className="block text-[9px] font-bold text-emerald-600">{inv.status || 'PAID'}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* E. Active Equipment & Warranty Vault */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">Equipment &amp; Warranty Vault</h3>
                <span className="text-[11px] text-slate-500">Verified installed systems</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">Active Warranties</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-900">Carrier 4-Ton 16 SEER Heat Pump</span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">10-Yr Parts</span>
                </div>
                <div className="text-[11px] text-slate-500">Model #25HBC548A • Warranty thru Oct 2036</div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-900">ecobee Smart Thermostat Premium</span>
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">Connected</span>
                </div>
                <div className="text-[11px] text-slate-500">Firmware v4.9 • Calibrated 320 CFM Airflow</div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-900">Main Whole-Home Pressure PRV</span>
                  <span className="text-[10px] font-bold text-slate-700 bg-slate-200 px-2 py-0.5 rounded">65 PSI</span>
                </div>
                <div className="text-[11px] text-slate-500">Watts 25AUB-Z3 • City Code Compliant</div>
              </div>
            </div>
          </div>

          {/* F. Sticky Quick Actions Desk (Eliminates All Empty Scrolling Space) */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3 lg:sticky lg:top-20 z-10">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-slate-900">Quick Dispatch &amp; Actions</h3>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            <div className="space-y-2">
              <button
                onClick={() => {
                  const cleanPhone = profileData.phone.replace(/[^0-9+]/g, '');
                  window.open(`tel:${cleanPhone}`);
                  addToast(`Placing live audio call to ${profileData.name} (${profileData.phone})...`, 'info');
                }}
                className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Phone className="w-4 h-4" />
                <span>Call {profileData.name.split(' ')[0]} Direct</span>
              </button>

              <button
                onClick={() => openSMSModal({ name: profileData.name, phone: profileData.phone, role: profileData.roleTitle })}
                className="w-full py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl border border-slate-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4 text-emerald-600" />
                <span>Send Instant SMS / Dispatch Ping</span>
              </button>

              <button
                onClick={() => {
                  downloadCSV(`${profileData.name}_dossier`, ['Property', 'Details'], [
                    ['Full Legal Name', profileData.name],
                    ['Role / Trade Title', profileData.roleTitle],
                    ['Primary Phone', profileData.phone],
                    ['Primary Email', profileData.email],
                    ['Dispatch Location', profileData.address],
                    ['Completed Work Orders', profileData.jobsCount],
                    ['CSAT Rating Score', `${profileData.rating} Stars`],
                    ['Verified License / Access No', profileData.accessCode]
                  ]);
                  addToast(`Verified dossier for ${profileData.name} downloaded as CSV spreadsheet!`, 'success');
                }}
                className="w-full py-2.5 px-3 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-xs rounded-xl border border-slate-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <FileText className="w-4 h-4 text-slate-500" />
                <span>Download Official CSV / Dossier</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Content based on activeTab (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {activeTab === 'timeline' && (
            <>
              {/* 1. "What's on your mind?" Status Composer */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleImageUpload} 
                />

                <div className="flex items-center gap-3">
                  {userProfile.avatar ? (
                    <img
                      src={userProfile.avatar}
                      alt={userProfile.name}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-500/30"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-sm ring-2 ring-emerald-500/30 shrink-0">
                      {(userProfile.name || 'U').charAt(0).toUpperCase()}
                    </div>
                  )}
                  <input
                    id="facebook-status-input"
                    type="text"
                    placeholder={`What's the latest update on ${profileData.name}?`}
                    value={newPostContent}
                    onChange={e => setNewPostContent(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') handleCreatePost();
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
                      <span className="hidden sm:inline">{attachedImage ? 'Photo Attached' : 'Photo/Media'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const targetTech = technicians[0]?.name || 'On-Duty Pro';
                        setNewPostContent(prev => prev ? `${prev} @${targetTech} ` : `@${targetTech} `);
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
                        setIsEmergencyFlag(prev => !prev);
                        addToast(!isEmergencyFlag ? 'Emergency priority SLA flagged!' : 'Emergency priority removed.', !isEmergencyFlag ? 'warning' : 'info');
                      }}
                      className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                        isEmergencyFlag ? 'bg-rose-50 text-rose-700 border border-rose-300 font-bold' : 'hover:bg-slate-100 text-slate-600'
                      }`}
                    >
                      <AlertTriangle className="w-4 h-4 text-rose-500" />
                      <span className="hidden sm:inline">{isEmergencyFlag ? 'Emergency SLA' : 'Emergency'}</span>
                    </button>
                  </div>

                  <button
                    onClick={handleCreatePost}
                    className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Post</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* 2. Feed Timeline Filter Tabs */}
              <div className="flex items-center justify-between bg-white px-4 py-2.5 rounded-2xl border border-slate-200/90 shadow-2xs">
                <span className="text-xs font-extrabold text-slate-800">Timeline Activity</span>
                <div className="flex items-center gap-1 text-[11px] font-bold">
                  <button
                    onClick={() => setTimelineFilter('all')}
                    className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                      timelineFilter === 'all' ? 'bg-[#0C3832] text-white' : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    All Updates ({feedPosts.length})
                  </button>
                  <button
                    onClick={() => setTimelineFilter('jobs')}
                    className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                      timelineFilter === 'jobs' ? 'bg-[#0C3832] text-white' : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    Job Orders
                  </button>
                  <button
                    onClick={() => setTimelineFilter('dispatches')}
                    className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                      timelineFilter === 'dispatches' ? 'bg-[#0C3832] text-white' : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    Dispatches
                  </button>
                </div>
              </div>

              {/* 3. Interactive Facebook Posts Feed */}
              <div className="space-y-4">
            {feedPosts
              .filter(post => {
                if (timelineFilter === 'jobs') return !!post.jobCard;
                if (timelineFilter === 'dispatches') return !!post.mediaUrl || post.content.toLowerCase().includes('dispatch');
                return true;
              })
              .map(post => (
              <div 
                key={post.id} 
                className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-4 transition-all hover:shadow-sm"
              >
                {/* Post Header: Author + Timestamp + Privacy */}
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
                          <span>{post.isPinned ? 'Unpin from Top' : 'Pin Post to Top'}</span>
                        </button>
                        <button
                          onClick={() => handleCopyLink(post.id)}
                          className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center gap-2 cursor-pointer font-medium"
                        >
                          <Copy className="w-3.5 h-3.5 text-blue-600" />
                          <span>Copy Post Link</span>
                        </button>
                        <div className="my-1 border-t border-slate-100" />
                        <button
                          onClick={() => handleDeletePost(post.id)}
                          className="w-full text-left px-3 py-2 hover:bg-rose-50 text-rose-600 flex items-center gap-2 cursor-pointer font-medium"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete Post</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Post Text Content */}
                <p className="text-xs text-slate-800 leading-relaxed">
                  {post.content}
                </p>

                {/* Optional Job Card Attachment */}
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
                        {post.jobCard.address}
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

                {/* Optional Media Photo */}
                {post.mediaUrl && (
                  <div className="rounded-2xl overflow-hidden border border-slate-200">
                    <img
                      src={post.mediaUrl}
                      alt="Post Attachment"
                      className="w-full h-64 object-cover"
                    />
                    {post.mediaCaption && (
                      <div className="p-2.5 bg-slate-900 text-white text-[11px] font-medium flex items-center justify-between">
                        <span>{post.mediaCaption}</span>
                        <span className="text-emerald-400 font-bold">● Live GPS</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Like Count & Comments Metric Row */}
                <div className="flex items-center justify-between text-[11px] text-slate-500 px-1 pt-1 border-t border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[9px]">
                      👍
                    </span>
                    <span>{post.likes} Likes</span>
                  </div>
                  <div>
                    <span>{post.comments.length} Comments • 2 Shares</span>
                  </div>
                </div>

                {/* Action Buttons: Like, Comment, Share */}
                <div className="grid grid-cols-3 gap-2 border-t border-b border-slate-100 py-1 text-xs">
                  <button
                    onClick={() => handleToggleLike(post.id)}
                    className={`py-1.5 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                      post.isLiked ? 'text-emerald-600 bg-emerald-50' : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>Like</span>
                  </button>

                  <button
                    onClick={() => {
                      const input = document.getElementById(`comment-input-${post.id}`);
                      input?.focus();
                    }}
                    className="py-1.5 rounded-xl text-slate-600 hover:bg-slate-100 font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Comment</span>
                  </button>

                  <button
                    onClick={() => {
                      addToast('Shared to field dispatch thread', 'info');
                    }}
                    className="py-1.5 rounded-xl text-slate-600 hover:bg-slate-100 font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share</span>
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
                  {userProfile.avatar ? (
                    <img
                      src={userProfile.avatar}
                      alt={userProfile.name}
                      className="w-7 h-7 rounded-full object-cover shrink-0"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-xs shrink-0">
                      {(userProfile.name || 'U').charAt(0).toUpperCase()}
                    </div>
                  )}
                  <input
                    id={`comment-input-${post.id}`}
                    type="text"
                    placeholder="Write a comment..."
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

          {/* TAB 2: ABOUT & VITALS */}
          {activeTab === 'about' && (
            <div className="space-y-4">
              <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">About &amp; Operational Vitals</h3>
                    <p className="text-xs text-slate-500">Verified identity, registered address, and licensed credentials</p>
                  </div>
                  <button
                    onClick={() => openUniversalEditModal(activeProfileTarget)}
                    className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Profile Details</span>
                  </button>
                </div>

                {/* Primary Vitals Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                    <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400">Full Legal Name</span>
                    <div className="text-sm font-black text-slate-900">{profileData.name}</div>
                    <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200 mt-1">
                      {profileData.roleTitle}
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                    <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400">Direct Telephone</span>
                    <div className="text-sm font-black text-slate-900 flex items-center justify-between">
                      <span>{profileData.phone}</span>
                      <button 
                        onClick={() => {
                          const cleanPhone = profileData.phone.replace(/[^0-9+]/g, '');
                          window.open(`tel:${cleanPhone}`);
                        }}
                        className="text-[11px] font-bold text-emerald-600 hover:underline cursor-pointer"
                      >
                        Call Tel →
                      </button>
                    </div>
                    <span className="text-[10px] text-slate-500">Carrier: Cellular Dedicated Gateway</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                    <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400">Operating Address</span>
                    <div className="text-sm font-bold text-slate-900">{profileData.address}</div>
                    <span className="text-[10px] text-slate-500">Primary Service Zone</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                    <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400">Dispatch Email</span>
                    <div className="text-sm font-bold text-slate-900">{profileData.email}</div>
                    <span className="text-[10px] text-emerald-600 font-bold">✓ SSL &amp; DKIM Verified</span>
                  </div>
                </div>

                {/* Licenses & Regulatory Compliance */}
                <div className="space-y-3">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">Verified Municipal Credentials &amp; Insurance</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3.5 rounded-2xl border border-slate-200/80 bg-white shadow-2xs space-y-1">
                      <div className="flex items-center gap-1.5 text-emerald-600 font-extrabold">
                        <ShieldCheck className="w-4 h-4" />
                        <span>EPA 608 Universal</span>
                      </div>
                      <div className="text-[11px] text-slate-600 font-mono">#EPA-TX-99210</div>
                      <div className="text-[10px] text-slate-400">Valid through Nov 2028</div>
                    </div>

                    <div className="p-3.5 rounded-2xl border border-slate-200/80 bg-white shadow-2xs space-y-1">
                      <div className="flex items-center gap-1.5 text-blue-600 font-extrabold">
                        <Award className="w-4 h-4" />
                        <span>Master Contractor</span>
                      </div>
                      <div className="text-[11px] text-slate-600 font-mono">{profileData.accessCode}</div>
                      <div className="text-[10px] text-slate-400">Trade License Verified</div>
                    </div>

                    <div className="p-3.5 rounded-2xl border border-slate-200/80 bg-white shadow-2xs space-y-1">
                      <div className="flex items-center gap-1.5 text-purple-600 font-extrabold">
                        <Lock className="w-4 h-4" />
                        <span>Commercial Liability Policy</span>
                      </div>
                      <div className="text-[11px] text-slate-600 font-mono">#POL-ACTIVE-VERIFIED</div>
                      <div className="text-[10px] text-slate-400">Full Commercial Coverage</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: TEAM & PROS */}
          {activeTab === 'team' && (
            <div className="space-y-4">
              <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">Connected Field Pros &amp; Supervisors</h3>
                    <p className="text-xs text-slate-500">Active professionals assigned to field service territory</p>
                  </div>
                  <button 
                    onClick={() => setIsCreateTechnicianModalOpen(true)}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
                  >
                    + Add Collaborator
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {technicians.map(tech => (
                    <div 
                      key={tech.id} 
                      className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50 hover:bg-white hover:shadow-md transition-all space-y-3"
                    >
                      <div className="flex items-center gap-3">
                        <img 
                          src={tech.photo} 
                          alt={tech.name} 
                          className="w-12 h-12 rounded-2xl object-cover ring-2 ring-emerald-500/20 shadow-xs" 
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-black text-slate-900 truncate">{tech.name}</div>
                          <div className="text-[11px] text-emerald-700 font-bold">{tech.specialization} Pro</div>
                          <div className="text-[10px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                            <span className="font-extrabold text-amber-500">★ {tech.rating}</span>
                            <span>•</span>
                            <span>{tech.jobsCompleted} jobs</span>
                            <span>•</span>
                            <span className="font-bold text-slate-700">{tech.status}</span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-1.5 pt-1 border-t border-slate-200/60">
                        <button
                          onClick={() => {
                            const clean = tech.phone.replace(/[^0-9+]/g, '');
                            window.open(`tel:${clean}`);
                            addToast(`Calling ${tech.name} at ${tech.phone}...`, 'info');
                          }}
                          className="py-1.5 px-2 bg-white hover:bg-slate-100 text-slate-700 font-bold text-[10px] rounded-lg border border-slate-200 transition-colors cursor-pointer text-center"
                        >
                          Call
                        </button>
                        <button
                          onClick={() => openSMSModal({ name: tech.name, phone: tech.phone, role: tech.specialization })}
                          className="py-1.5 px-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-[10px] rounded-lg border border-blue-200 transition-colors cursor-pointer text-center"
                        >
                          SMS
                        </button>
                        <button
                          onClick={() => {
                            setActiveProfileTarget({ type: 'technician', id: tech.id });
                            setActiveTab('timeline');
                            addToast(`Viewing technician profile for ${tech.name}`, 'info');
                          }}
                          className="py-1.5 px-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] rounded-lg transition-colors cursor-pointer text-center"
                        >
                          View
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: WORKSITE PHOTOS & MEDIA VAULT */}
          {activeTab === 'photos' && (
            <div className="space-y-4">
              <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">Worksite Photos &amp; Media Vault</h3>
                    <p className="text-xs text-slate-500">High-resolution before/after documentation and inspection logs</p>
                  </div>
                  <input 
                    type="file" 
                    ref={mediaInputRef} 
                    className="hidden" 
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          const url = event.target?.result as string;
                          const title = file.name.replace(/\.[^/.]+$/, '');
                          setMediaVault(prev => [
                            { title, tag: 'Field Verified', url },
                            ...prev
                          ]);
                          addToast(`Photo "${title}" uploaded to media vault!`, 'success');
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                  <button 
                    onClick={() => mediaInputRef.current?.click()}
                    className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>+ Upload Work Photo</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
                  {mediaVault.map((photo, i) => (
                    <div 
                      key={i} 
                      onClick={() => addToast(`Viewing full high-res photo: ${photo.title}`, 'info')}
                      className="group cursor-pointer rounded-2xl overflow-hidden border border-slate-200/80 bg-slate-50 hover:shadow-lg transition-all"
                    >
                      <div className="relative h-36 overflow-hidden">
                        <img 
                          src={photo.url} 
                          alt={photo.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                        />
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-slate-900/80 text-white backdrop-blur-xs">
                          {photo.tag}
                        </span>
                      </div>
                      <div className="p-2.5">
                        <div className="text-[11px] font-bold text-slate-900 truncate">{photo.title}</div>
                        <div className="text-[9px] text-slate-500">Central Operations • Field Verified</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: JOBS & SERVICE ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">Work Orders &amp; Service History</h3>
                    <p className="text-xs text-slate-500">Itemized bookings ledger with live status &amp; totals</p>
                  </div>
                  <button
                    onClick={() => {
                      downloadCSV('service_orders_history', ['Job #', 'Service', 'Customer', 'Technician', 'Schedule', 'Amount', 'Status'], bookings.slice(0, 10).map(b => [b.jobNo, b.serviceName, b.customerName, b.technicianName, `${b.scheduleDate} ${b.scheduleTime}`, `$${b.estimate}`, b.status]));
                      addToast('Work orders exported to CSV spreadsheet!', 'success');
                    }}
                    className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
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
                        <th className="py-2.5 px-3 text-right">Amount</th>
                        <th className="py-2.5 px-3 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {bookings.slice(0, 8).map(booking => (
                        <tr key={booking.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3 px-3 font-mono font-bold text-slate-800">{booking.jobNo}</td>
                          <td className="py-3 px-3">
                            <div className="font-bold text-slate-900">{booking.serviceName}</div>
                            <div className="text-[10px] text-slate-500">{booking.category}</div>
                          </td>
                          <td className="py-3 px-3 text-slate-600">
                            <div>{booking.scheduleDate}</div>
                            <div className="text-[10px] text-slate-400">{booking.scheduleTime}</div>
                          </td>
                          <td className="py-3 px-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                              booking.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                              booking.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                              booking.status === 'Scheduled' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                            }`}>
                              {booking.status}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right font-black text-slate-900">
                            ${booking.estimate}
                          </td>
                          <td className="py-3 px-3 text-center">
                            <button
                              onClick={() => {
                                if (currentRole === 'ADMIN') navigateToPage(9);
                                else navigateToStaffPage(109);
                                addToast(`Opening job details for ${booking.jobNo}`, 'info');
                              }}
                              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold text-[10px] transition-colors cursor-pointer"
                            >
                              Inspect
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: SECURITY & AUDIT */}
          {activeTab === 'security' && (
            <div className="space-y-4">
              <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">Security Credentials &amp; Audit Trail</h3>
                    <p className="text-xs text-slate-500">Access control, gate keys, 2FA protocols, and active sign-in sessions</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    2FA Enforced
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                    <div className="flex items-center gap-2 text-slate-900 font-extrabold">
                      <Lock className="w-4 h-4 text-emerald-600" />
                      <span>Two-Factor Authentication (TOTP)</span>
                    </div>
                    <p className="text-slate-500 text-[11px]">
                      Protected by hardware authenticator app (Google Authenticator / YubiKey). Required for dispatch override.
                    </p>
                    <div className="text-[10px] text-emerald-700 font-bold">✓ Active &amp; Verified on all devices</div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                    <div className="flex items-center gap-2 text-slate-900 font-extrabold">
                      <Key className="w-4 h-4 text-amber-600" />
                      <span>Property Gate &amp; Lockbox Key</span>
                    </div>
                    <p className="text-slate-500 text-[11px]">
                      Community Gate PIN: <strong className="text-slate-900 font-mono">#8492</strong> • Lockbox Code: <strong className="text-slate-900 font-mono">5120</strong>
                    </p>
                    <div className="text-[10px] text-slate-400">Encrypted in Supabase Vault with audit log</div>
                  </div>
                </div>

                {/* Audit Trail List */}
                <div className="space-y-2 pt-2">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">Recent Security Activity Log</h4>
                  <div className="space-y-2 text-xs">
                    {[
                      { action: 'Profile vitals inspection via Admin Console', ip: '192.168.1.10 (Local NOC)', time: '2 mins ago' },
                      { action: 'SMS dispatch ping transmitted to tech mobile', ip: '192.168.1.10 (Dispatch Desk)', time: '14 mins ago' },
                      { action: 'Session token refreshed via Cloud Supabase Auth', ip: '172.56.21.90 (Mobile Session)', time: '1 hour ago' },
                      { action: 'Gate access PIN decrypted for field pro dispatch', ip: '192.168.1.10 (Secure Vault)', time: '3 hours ago' }
                    ].map((log, i) => (
                      <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-between">
                        <div>
                          <div className="font-bold text-slate-800">{log.action}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{log.ip}</div>
                        </div>
                        <span className="text-[10px] text-slate-500 font-medium">{log.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
