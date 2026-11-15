import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { 
  Settings, 
  Save, 
  ShieldCheck, 
  Globe, 
  Clock, 
  MapPin, 
  Lock, 
  Sliders, 
  Zap,
  Building,
  User,
  Key,
  Mail,
  Phone
} from 'lucide-react';

export const Page35GeneralPlatformSettings: React.FC = () => {
  const { agencyName, agencyTagline, updateAgencyBranding, addToast, userProfile, openProfileModal, currentRole } = useAdmin();

  const [platformName, setPlatformName] = useState<string>(agencyName);
  const [platformTagline, setPlatformTagline] = useState<string>(agencyTagline);
  const [supportPhone, setSupportPhone] = useState<string>('');
  const [supportEmail, setSupportEmail] = useState<string>('');
  const [currency, setCurrency] = useState<string>('USD ($)');
  const [timezone, setTimezone] = useState<string>('UTC-05:00 Eastern Time (US & Canada)');
  const [dispatchRadius, setDispatchRadius] = useState<number>(15);
  const [acceptTimeout, setAcceptTimeout] = useState<number>(60);
  const [requireSecurityPin, setRequireSecurityPin] = useState<boolean>(true);
  const [autoReassignFailed, setAutoReassignFailed] = useState<boolean>(true);

  const handleSave = () => {
    updateAgencyBranding(platformName, platformTagline);
    addToast('White-label agency name and platform configurations successfully saved everywhere!', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Top Header matching Screenshot 01 Bottom Right & Screenshot 04 Top Right */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">General Platform Settings</h1>
          <p className="text-xs text-slate-500 mt-1">Configure global platform metadata, automated dispatch algorithms, and security policies</p>
        </div>

        <button
          onClick={handleSave}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
        >
          <Save className="w-3.5 h-3.5" />
          Save Platform Settings
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Brand & Contact Identity */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
            <Building className="w-4 h-4 text-emerald-600" />
            Platform Brand &amp; Identity
          </h2>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-extrabold text-slate-800">Application / Agency Name (White-Label)</label>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Updates Everywhere
                </span>
              </div>
              <input
                type="text"
                value={platformName}
                onChange={e => setPlatformName(e.target.value)}
                placeholder="e.g. Apex HVAC Solutions, Vance Operations Group"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-black text-slate-900 focus:outline-none focus:border-emerald-500"
              />
              <p className="text-[10px] text-slate-500 mt-1">
                Dynamically updates top navigation headers, sidebar brand logos, customer invoices, and email templates across both Admin and Staff panels.
              </p>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Agency Subtitle / Tagline</label>
              <input
                type="text"
                value={platformTagline}
                onChange={e => setPlatformTagline(e.target.value)}
                placeholder="e.g. Commercial & Residential Field Service"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium text-slate-800 focus:outline-none"
              />
            </div>

            {/* Live Agency Branding Preview Card */}
            <div className="bg-[#0C3832] p-3.5 rounded-xl border border-emerald-500/30 text-white flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 font-black text-sm shrink-0">
                  {platformName.charAt(0) || 'S'}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-black truncate">{platformName || 'ServicePro OS'}</div>
                  <div className="text-[10px] text-emerald-300/80 truncate">{platformTagline || 'US / UK Field Operations'}</div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  updateAgencyBranding(platformName, platformTagline);
                }}
                className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-[11px] shrink-0 transition-all cursor-pointer shadow-xs"
              >
                Apply Instantly
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Customer Support Phone</label>
                <input
                  type="text"
                  value={supportPhone}
                  onChange={e => setSupportPhone(e.target.value)}
                  placeholder="+1 (800) 000-0000"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium text-slate-800 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Official Dispatch Email</label>
                <input
                  type="email"
                  value={supportEmail}
                  onChange={e => setSupportEmail(e.target.value)}
                  placeholder="dispatch@company.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium text-slate-800 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Standard Operating Currency</label>
                <select
                  value={currency}
                  onChange={e => setCurrency(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold text-slate-800 focus:outline-none"
                >
                  <option value="USD ($)">USD ($) - US Dollar</option>
                  <option value="INR (₹)">INR (₹) - Indian Rupee</option>
                  <option value="EUR (€)">EUR (€) - Euro</option>
                  <option value="GBP (£)">GBP (£) - British Pound</option>
                  <option value="AED (AED)">AED (AED) - UAE Dirham</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">System Timezone</label>
                <select
                  value={timezone}
                  onChange={e => setTimezone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold text-slate-800 focus:outline-none"
                >
                  <option value="UTC-05:00 Eastern Time (US & Canada)">UTC-05:00 Eastern Time (US &amp; Canada)</option>
                  <option value="UTC+05:30 India Standard Time (IST)">UTC+05:30 India Standard Time (IST)</option>
                  <option value="UTC+04:00 Gulf Standard Time (Dubai)">UTC+04:00 Gulf Standard Time (Dubai)</option>
                  <option value="UTC+00:00 London (GMT)">UTC+00:00 London (GMT)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Dispatch Engine Algorithm Parameters */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-500 fill-current" />
            AI Dispatch Engine Parameters
          </h2>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between font-bold text-slate-700 mb-1">
                <span>Maximum Technician Search Radius</span>
                <span className="text-emerald-700 font-extrabold">{dispatchRadius} km</span>
              </div>
              <input
                type="range"
                min="3"
                max="30"
                value={dispatchRadius}
                onChange={e => setDispatchRadius(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                <span>3 km (dense city)</span>
                <span>30 km (suburban)</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between font-bold text-slate-700 mb-1">
                <span>Technician Acceptance Timeout</span>
                <span className="text-amber-700 font-extrabold">{acceptTimeout} Seconds</span>
              </div>
              <input
                type="range"
                min="30"
                max="180"
                step="15"
                value={acceptTimeout}
                onChange={e => setAcceptTimeout(Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                <span>30s (fast)</span>
                <span>180s (extended)</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 space-y-2">
              <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                <input
                  type="checkbox"
                  checked={requireSecurityPin}
                  onChange={e => setRequireSecurityPin(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>Mandate 4-Digit Customer Safety PIN on Technician Entry</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                <input
                  type="checkbox"
                  checked={autoReassignFailed}
                  onChange={e => setAutoReassignFailed(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>Auto-Reassign to Next Pro if First Technician Declines / Timeouts</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Card 3: Administrator & Operator Profile Dossier & Editor */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
              <User className="w-4 h-4 text-emerald-600" />
              <span>Operator Profile Details &amp; Security Credentials</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Current active profile session for {currentRole === 'ADMIN' ? 'Main Head (Admin)' : 'Field Staff (Worker)'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => openProfileModal('view')}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
            >
              <User className="w-3.5 h-3.5 text-emerald-600" />
              <span>View Profile Details</span>
            </button>
            <button
              type="button"
              onClick={() => openProfileModal('edit')}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Edit Profile &amp; 2FA</span>
            </button>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 min-w-0">
            <img
              src={userProfile.avatar}
              alt={userProfile.name}
              className="w-14 h-14 rounded-2xl object-cover ring-2 ring-emerald-500/40 shadow-xs shrink-0"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-black text-sm text-slate-900">{userProfile.name}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                  {userProfile.role}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                  {userProfile.twoFactorEnabled ? '2FA Active' : '2FA Off'}
                </span>
              </div>
              <div className="text-xs text-slate-600 font-medium">{userProfile.title} • {userProfile.department}</div>
              <div className="text-[11px] text-slate-400 mt-1 flex flex-wrap items-center gap-3">
                <span className="flex items-center gap-1">
                  <Mail className="w-3 h-3 text-slate-400" />
                  {userProfile.email}
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3 h-3 text-slate-400" />
                  {userProfile.phone}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  {userProfile.territory}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => openProfileModal('edit')}
              className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 shadow-2xs transition-all cursor-pointer"
            >
              Change Photo &amp; Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
