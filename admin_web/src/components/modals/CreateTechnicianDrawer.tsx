import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { 
  X, 
  Wrench, 
  Phone, 
  Mail, 
  MapPin, 
  ShieldCheck, 
  DollarSign, 
  Truck,
  Save
} from 'lucide-react';

export const CreateTechnicianDrawer: React.FC = () => {
  const { 
    isCreateTechnicianModalOpen, 
    setIsCreateTechnicianModalOpen, 
    addTechnician 
  } = useAdmin();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [specialization, setSpecialization] = useState('HVAC & Refrigeration');
  const [hourlyRate, setHourlyRate] = useState<number>(85);
  const [location, setLocation] = useState('');
  const [vanPlate, setVanPlate] = useState('');

  if (!isCreateTechnicianModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTechnician({
      name,
      phone,
      specialization,
      photo: ''
    });
    setIsCreateTechnicianModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-slate-200/90 w-full max-w-xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">Onboard Field Technician</h2>
              <p className="text-xs text-slate-500">Register verified trade professional &amp; fleet vehicle</p>
            </div>
          </div>
          <button 
            onClick={() => setIsCreateTechnicianModalOpen(false)}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-200/50 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Technician Full Name</label>
              <input 
                type="text" 
                required 
                value={name} 
                onChange={e => setName(e.target.value)} 
                placeholder="Enter technician full name..."
                className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Primary Trade Specialization</label>
              <select 
                value={specialization} 
                onChange={e => setSpecialization(e.target.value)} 
                className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-amber-500 focus:outline-none"
              >
                <option value="HVAC & Refrigeration">HVAC &amp; Refrigeration</option>
                <option value="Master Plumber">Master Plumber</option>
                <option value="Commercial Electrical">Commercial Electrical</option>
                <option value="Smart Home & Automation">Smart Home &amp; Automation</option>
                <option value="Solar & Clean Energy">Solar &amp; Clean Energy</option>
                <option value="General Handyman & Carpentry">General Handyman</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Direct Mobile Phone</label>
              <input 
                type="text" 
                required 
                value={phone} 
                onChange={e => setPhone(e.target.value)} 
                placeholder="+1 (___) ___-____"
                className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Internal Ops Email</label>
              <input 
                type="email" 
                required 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                placeholder="technician@company.com"
                className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Hourly Billing Rate ($/hr)</label>
              <input 
                type="number" 
                required 
                value={hourlyRate} 
                onChange={e => setHourlyRate(Number(e.target.value))} 
                className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Assigned Fleet Van Plate</label>
              <input 
                type="text" 
                value={vanPlate} 
                onChange={e => setVanPlate(e.target.value)} 
                className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Dispatch Operating Territory</label>
            <input 
              type="text" 
              required 
              value={location} 
              onChange={e => setLocation(e.target.value)} 
              className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsCreateTechnicianModalOpen(false)}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-extrabold text-white bg-amber-500 hover:bg-amber-600 rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Onboard Pro to Fleet</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
