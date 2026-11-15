import React, { useState } from 'react';
import { 
  X, 
  Palette, 
  DollarSign, 
  Globe, 
  Building2, 
  Check, 
  ShieldCheck, 
  Percent, 
  Phone, 
  Mail, 
  FileText,
  Sparkles
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

interface WhiteLabelBrandModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar (USD)', flag: '🇺🇸' },
  { code: 'EUR', symbol: '€', name: 'Euro (EUR)', flag: '🇪🇺' },
  { code: 'GBP', symbol: '£', name: 'British Pound (GBP)', flag: '🇬🇧' },
  { code: 'CAD', symbol: '$', name: 'Canadian Dollar (CAD)', flag: '🇨🇦' },
  { code: 'AUD', symbol: '$', name: 'Australian Dollar (AUD)', flag: '🇦🇺' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee (INR)', flag: '🇮🇳' },
  { code: 'AED', symbol: 'AED ', name: 'UAE Dirham (AED)', flag: '🇦🇪' },
  { code: 'SAR', symbol: 'SAR ', name: 'Saudi Riyal (SAR)', flag: '🇸🇦' }
];

const ACCENT_COLORS = [
  { name: 'Royal Purple (Default)', value: '#6366F1', class: 'bg-[#6366F1]' },
  { name: 'Vivid Violet', value: '#7C3AED', class: 'bg-[#7C3AED]' },
  { name: 'Emerald Green', value: '#059669', class: 'bg-[#059669]' },
  { name: 'Electric Cyan', value: '#0284C7', class: 'bg-[#0284C7]' },
  { name: 'Sunset Amber', value: '#D97706', class: 'bg-[#D97706]' },
  { name: 'Crimson Slate', value: '#E11D48', class: 'bg-[#E11D48]' }
];

export const WhiteLabelBrandModal: React.FC<WhiteLabelBrandModalProps> = ({ isOpen, onClose }) => {
  const { 
    agencyName, 
    agencyTagline, 
    updateAgencyBranding, 
    pricingConfig, 
    updatePricingConfig,
    addToast 
  } = useAdmin();

  const [name, setName] = useState(agencyName || 'ServicePro OS');
  const [tagline, setTagline] = useState(agencyTagline || 'Enterprise Home Services Management');
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [selectedColor, setSelectedColor] = useState('#6366F1');
  const [commissionRate, setCommissionRate] = useState(pricingConfig?.commissionRate?.toString() || '15.0');
  const [minFee, setMinFee] = useState(pricingConfig?.minCalloutFee?.toString() || '49.0');
  const [surgeMultiplier, setSurgeMultiplier] = useState(pricingConfig?.surgeMultiplier?.toString() || '1.25');
  const [supportPhone, setSupportPhone] = useState(() => localStorage.getItem('servicepro_support_phone') || '');
  const [taxId, setTaxId] = useState(() => localStorage.getItem('servicepro_tax_id') || '');

  if (!isOpen) return null;

  const handleSave = () => {
    updateAgencyBranding(name, tagline);
    updatePricingConfig({
      commissionRate: parseFloat(commissionRate) || 15.0,
      minCalloutFee: parseFloat(minFee) || 49.0,
      surgeMultiplier: parseFloat(surgeMultiplier) || 1.25
    });

    localStorage.setItem('servicepro_currency_code', selectedCurrency);
    const curr = CURRENCIES.find(c => c.code === selectedCurrency);
    if (curr) {
      localStorage.setItem('servicepro_currency_symbol', curr.symbol);
    }
    localStorage.setItem('servicepro_brand_color', selectedColor);
    localStorage.setItem('servicepro_support_phone', supportPhone);
    localStorage.setItem('servicepro_tax_id', taxId);

    addToast('White-label branding & financial parameters saved live!', 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl flex flex-col my-auto max-h-[95vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/30 rounded-2xl text-indigo-400">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">White-Label & Multi-Currency Engine</h2>
                <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full">
                  Instant Rebranding
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Customize platform identity, currency symbols, and commission take-rate across all apps.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-xl border border-slate-700 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <div className="py-5 space-y-5 overflow-y-auto flex-1">
          {/* Section 1: Brand Identity */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5" /> Company & Software Identity
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Company / Platform Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. UrbanPro, ServiceHub"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Brand Tagline</label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="e.g. Your Service Our Priority"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Accent Color */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 block">Brand Accent Color</label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {ACCENT_COLORS.map(c => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setSelectedColor(c.value)}
                  className={`p-2 rounded-xl border flex flex-col items-center gap-1.5 text-[10px] font-bold cursor-pointer transition-all ${
                    selectedColor === c.value
                      ? 'border-indigo-500 bg-indigo-500/10 text-white'
                      : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full ${c.class} shadow-xs`}></div>
                  <span className="truncate max-w-[70px]">{c.name.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Section 3: Currency & Commission */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <h3 className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5" /> International Currency & Take-Rate
            </h3>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Active Currency Format</label>
              <div className="grid grid-cols-4 gap-2">
                {CURRENCIES.map(curr => (
                  <button
                    key={curr.code}
                    type="button"
                    onClick={() => setSelectedCurrency(curr.code)}
                    className={`p-2 rounded-xl border flex items-center justify-between text-xs font-bold cursor-pointer transition-all ${
                      selectedCurrency === curr.code
                        ? 'border-emerald-500 bg-emerald-500/10 text-white'
                        : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span>{curr.flag} {curr.code}</span>
                    <span className="text-emerald-400 text-[11px]">{curr.symbol}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Platform Take-Rate (%)</label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.5"
                    value={commissionRate}
                    onChange={(e) => setCommissionRate(e.target.value)}
                    className="w-full pl-3 pr-8 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                  <Percent className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Min Callout Fee</label>
                <div className="relative">
                  <input
                    type="number"
                    value={minFee}
                    onChange={(e) => setMinFee(e.target.value)}
                    className="w-full pl-3 pr-8 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                  <DollarSign className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Emergency Surge</label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.05"
                    value={surgeMultiplier}
                    onChange={(e) => setSurgeMultiplier(e.target.value)}
                    className="w-full pl-3 pr-8 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                  <span className="text-xs text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 font-bold">x</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Compliance & Support */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <h3 className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" /> Support & Legal Entity
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">24/7 Operations Hotline</label>
                <input
                  type="text"
                  value={supportPhone}
                  placeholder="e.g. +1 (800) 222-0199"
                  onChange={(e) => setSupportPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">GSTIN / Tax ID</label>
                <input
                  type="text"
                  value={taxId}
                  placeholder="e.g. TAX-REG-1002"
                  onChange={(e) => setTaxId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>Updates immediately across Web & Mobile</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold text-xs"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Apply White-Label Settings</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
