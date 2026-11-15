import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { 
  X, 
  User, 
  Settings, 
  Mail, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  Save, 
  Camera, 
  Key,
  ShieldAlert,
  Building,
  Laptop
} from 'lucide-react';

export const ProfileModal: React.FC = () => {
  const { 
    isProfileModalOpen, 
    closeProfileModal, 
    profileModalTab, 
    userProfile, 
    updateUserProfile,
    currentRole 
  } = useAdmin();

  const [activeTab, setActiveTab] = useState<'view' | 'edit'>('view');

  // Form states for editing
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('');
  const [territory, setTerritory] = useState('');
  const [avatar, setAvatar] = useState('');
  const [bio, setBio] = useState('');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    if (isProfileModalOpen) {
      setActiveTab(profileModalTab);
      setName(userProfile.name);
      setEmail(userProfile.email);
      setPhone(userProfile.phone);
      setTitle(userProfile.title);
      setDepartment(userProfile.department || (currentRole === 'ADMIN' ? 'Executive Operations' : 'Field Dispatch'));
      setTerritory(userProfile.territory);
      setAvatar(userProfile.avatar);
      setBio(userProfile.bio);
      setTwoFactorEnabled(userProfile.twoFactorEnabled);
      setCurrentPassword('');
      setNewPassword('');
    }
  }, [isProfileModalOpen, profileModalTab, userProfile, currentRole]);

  if (!isProfileModalOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name,
      email,
      phone,
      title,
      department,
      territory,
      avatar,
      bio,
      twoFactorEnabled
    });
    closeProfileModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-slate-200/80 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                {activeTab === 'view' ? 'Profile Details & Security Dossier' : 'Edit Profile & Security Credentials'}
              </h2>
              <p className="text-xs text-slate-500">
                {currentRole === 'ADMIN' ? 'Main Head (Admin) Identity' : 'Operations Staff (Worker) Identity'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Tab switch buttons */}
            <div className="flex items-center bg-slate-200/80 p-0.5 rounded-xl text-xs font-bold">
              <button
                type="button"
                onClick={() => setActiveTab('view')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'view' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                View Details
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('edit')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'edit' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Edit Profile
              </button>
            </div>

            <button
              onClick={closeProfileModal}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto thin-scrollbar">
          {activeTab === 'view' ? (
            /* VIEW PROFILE DETAILS */
            <div className="space-y-6">
              {/* Profile Card Banner */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-[#0C3832] to-[#134E45] text-white flex flex-col sm:flex-row items-center gap-5 shadow-sm">
                <div className="relative">
                  {userProfile.avatar ? (
                    <img
                      src={userProfile.avatar}
                      alt={userProfile.name}
                      className="w-20 h-20 rounded-2xl object-cover ring-4 ring-emerald-400/40 shadow-md"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-black text-2xl ring-4 ring-emerald-400/40 shadow-md">
                      {userProfile.name ? userProfile.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                  )}
                  <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-[#0C3832] flex items-center justify-center">
                    <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                  </span>
                </div>

                <div className="flex-1 text-center sm:text-left min-w-0">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <h3 className="text-xl font-black tracking-tight">{userProfile.name}</h3>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-400 text-slate-950 uppercase tracking-wider">
                      {userProfile.role}
                    </span>
                  </div>
                  <div className="text-xs text-emerald-200/90 font-medium mt-0.5">{userProfile.title}</div>
                  <div className="text-[11px] text-emerald-300/80 mt-1 flex flex-wrap items-center justify-center sm:justify-start gap-3">
                    <span className="flex items-center gap-1">
                      <Building className="w-3 h-3 text-emerald-400" />
                      {userProfile.department}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-emerald-400" />
                      {userProfile.territory}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab('edit')}
                  className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all border border-white/20 flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>Edit Profile</span>
                </button>
              </div>

              {/* Bio */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs text-slate-700">
                <span className="font-bold text-slate-900 block mb-1">Operational Mandate &amp; Bio:</span>
                <p className="leading-relaxed">{userProfile.bio}</p>
              </div>

              {/* Contact & Station Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Direct Contact</span>
                  <div className="flex items-center gap-2.5 text-xs">
                    <Mail className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <span className="text-slate-400 block text-[10px]">Email Address</span>
                      <span className="font-bold text-slate-900 font-mono text-[11px]">{userProfile.email}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs">
                    <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <span className="text-slate-400 block text-[10px]">Direct Phone Line</span>
                      <span className="font-bold text-slate-900 font-mono text-[11px]">{userProfile.phone}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Security &amp; 2FA Status</span>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600">Two-Factor Authentication:</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      userProfile.twoFactorEnabled ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {userProfile.twoFactorEnabled ? '● 2FA Enabled' : '○ Disabled'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600">Active Station IP:</span>
                    <span className="font-mono text-slate-900 font-bold text-[11px]">192.168.1.104 (Active Terminal)</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600">Current Session:</span>
                    <span className="text-emerald-700 font-bold text-[11px]">Active • Hardware Encrypted</span>
                  </div>
                </div>
              </div>

              {/* Permissions Checklist */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
                <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block mb-2">
                  System Permissions &amp; Access Scope
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-2 text-slate-800">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Full Customer &amp; Technician Directory Access</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-800">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Live GPS Dispatch Board &amp; Order Handover</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-800">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Stripe &amp; Razorpay Escrow Settlement Authority</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-800">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>AWS SES Invoicing &amp; Cloud Storage Management</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* EDIT PROFILE FORM */
            <form onSubmit={handleSave} className="space-y-5">
              {/* Avatar Selector */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-2">Profile Avatar URL</label>
                <div className="flex items-center gap-4">
                  {avatar ? (
                    <img src={avatar} alt="Avatar" className="w-12 h-12 rounded-xl object-cover ring-2 ring-emerald-500" />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-lg">
                      {name ? name.charAt(0).toUpperCase() : <User className="w-6 h-6" />}
                    </div>
                  )}
                  <div className="flex-1">
                    <input
                      type="url"
                      value={avatar}
                      onChange={(e) => setAvatar(e.target.value)}
                      placeholder="Enter custom image URL (https://...)"
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono text-[11px]"
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">Leave empty to display initial monogram.</span>
                  </div>
                </div>
              </div>

              {/* Name & Title */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Job Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900"
                  />
                </div>
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-900"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-900"
                  />
                </div>
              </div>

              {/* Department & Territory */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Department</label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Operating Hub / Territory</label>
                  <input
                    type="text"
                    value={territory}
                    onChange={(e) => setTerritory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900"
                  />
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Operational Mandate / Bio</label>
                <textarea
                  rows={2}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800"
                />
              </div>

              {/* 2FA Toggle & Security */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Two-Factor Authentication (2FA)</span>
                    <span className="text-[11px] text-slate-500">Require authenticator code / SMS for every operator login</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setTwoFactorEnabled(prev => !prev)}
                    className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                      twoFactorEnabled ? 'bg-emerald-600 justify-end' : 'bg-slate-300 justify-start'
                    }`}
                  >
                    <span className="bg-white w-4 h-4 rounded-full shadow-xs"></span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200 text-xs">
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">Current Password (to confirm)</label>
                    <input
                      type="password"
                      placeholder="••••••••••••"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">New Password (optional)</label>
                    <input
                      type="password"
                      placeholder="Leave blank to keep same"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={closeProfileModal}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Profile Changes</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
