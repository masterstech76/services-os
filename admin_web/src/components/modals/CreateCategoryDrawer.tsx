import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { 
  X, 
  Layers, 
  Sparkles, 
  Save, 
  CheckCircle2,
  DollarSign
} from 'lucide-react';

export const CreateCategoryDrawer: React.FC = () => {
  const { 
    isCreateCategoryModalOpen, 
    setIsCreateCategoryModalOpen, 
    addCategory 
  } = useAdmin();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('Flame');

  if (!isCreateCategoryModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addCategory({
      name,
      iconName: icon,
      color: 'emerald'
    });
    setIsCreateCategoryModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-slate-200/90 w-full max-w-md overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">New Service Category</h2>
              <p className="text-xs text-slate-500">Add service domain to catalogue &amp; mobile app</p>
            </div>
          </div>
          <button 
            onClick={() => setIsCreateCategoryModalOpen(false)}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-200/50 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Category Name</label>
            <input 
              type="text" 
              required 
              value={name} 
              onChange={e => setName(e.target.value)} 
              placeholder="e.g. Solar Energy & Battery Storage"
              className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Icon Representation</label>
            <select 
              value={icon} 
              onChange={e => setIcon(e.target.value)} 
              className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:outline-none"
            >
              <option value="Flame">Flame (HVAC / Heating)</option>
              <option value="Droplets">Droplets (Plumbing)</option>
              <option value="Zap">Zap (Electrical / Solar)</option>
              <option value="Shield">Shield (Security & Alarms)</option>
              <option value="Home">Home (Carpentry & Roofing)</option>
              <option value="Sparkles">Sparkles (Deep Cleaning)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Description / Customer Scope</label>
            <textarea 
              rows={3} 
              required
              value={description} 
              onChange={e => setDescription(e.target.value)} 
              placeholder="Comprehensive installation, certified maintenance, and 24/7 emergency repair..."
              className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsCreateCategoryModalOpen(false)}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-extrabold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Create Category</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
