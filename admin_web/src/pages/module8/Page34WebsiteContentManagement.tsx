import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { 
  Globe, 
  Save, 
  Image, 
  Sparkles, 
  Tag, 
  CheckCircle, 
  Upload, 
  Layout, 
  ShieldCheck,
  Smartphone
} from 'lucide-react';

export const Page34WebsiteContentManagement: React.FC = () => {
  const { addToast, navigateToPage, cmsConfig, updateCmsConfig } = useAdmin();

  const [heroHeading, setHeroHeading] = useState<string>(cmsConfig.heroHeading);
  const [heroSubheading, setHeroSubheading] = useState<string>(cmsConfig.heroSubheading);
  const [promoCoupon, setPromoCoupon] = useState<string>(cmsConfig.promoCoupon);
  const [promoDiscount, setPromoDiscount] = useState<number>(cmsConfig.promoDiscount);
  const [heroGraphicName, setHeroGraphicName] = useState<string>(cmsConfig.heroGraphicName || 'serviceos_master_ui.jpg');

  const handleSave = () => {
    updateCmsConfig({
      heroHeading,
      heroSubheading,
      promoCoupon,
      promoDiscount,
      heroGraphicName
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Website Content Management</h1>
          <p className="text-xs text-slate-500 mt-1">Configure mobile app hero banners, promotional coupon codes, trust badges, and marketing copy</p>
        </div>

        <button
          onClick={handleSave}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
        >
          <Save className="w-3.5 h-3.5" />
          Publish Content Live
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): CMS Forms */}
        <div className="lg:col-span-2 space-y-6">
          {/* Hero Banner Section */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
              <Layout className="w-4 h-4 text-purple-600" />
              1. Hero Banner Content (Master Day Vision Banner)
            </h2>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Hero Main Title</label>
                <input
                  type="text"
                  value={heroHeading}
                  onChange={e => setHeroHeading(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Hero Subtitle Copy</label>
                <textarea
                  rows={2}
                  value={heroSubheading}
                  onChange={e => setHeroSubheading(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-700 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Hero Graphic Image Asset</label>
                <div className="p-4 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-between bg-slate-50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                      <Image className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-800">{heroGraphicName}</div>
                      <div className="text-[11px] text-slate-400">Smiling woman graphic banner • 1200x600 px</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const next = heroGraphicName === 'serviceos_master_ui.jpg' ? 'serviceos_hero_alt.jpg' : 'serviceos_master_ui.jpg';
                      setHeroGraphicName(next);
                      addToast(`Switched hero asset to ${next}!`, 'info');
                    }}
                    className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-700 font-bold hover:bg-slate-100 cursor-pointer"
                  >
                    Switch Asset
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Promotional Coupon Banner */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
              <Tag className="w-4 h-4 text-emerald-600" />
              2. Promotional Campaign Coupon Banner
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Coupon Promo Code</label>
                <input
                  type="text"
                  value={promoCoupon}
                  onChange={e => setPromoCoupon(e.target.value.toUpperCase())}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono font-bold text-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Discount Value (% Off)</label>
                <input
                  type="number"
                  value={promoDiscount}
                  onChange={e => setPromoDiscount(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold text-slate-900 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (1 Col): Live Mobile Preview */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-purple-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">Mobile Day Vision Banner</h3>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white space-y-3 shadow-sm">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/20 backdrop-blur-xs">
                🏷️ Use Code {promoCoupon} ({promoDiscount}% OFF)
              </span>

              <div>
                <h4 className="text-base font-extrabold leading-tight">{heroHeading}</h4>
                <p className="text-[11px] opacity-80 mt-1 line-clamp-2">{heroSubheading}</p>
              </div>

              <div className="pt-1">
                <button 
                  onClick={() => {
                    navigateToPage(6);
                    addToast('Previewing customer mobile booking experience...', 'info');
                  }}
                  className="px-3.5 py-1.5 bg-white hover:bg-slate-100 text-indigo-700 font-extrabold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Book A Service →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
