import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  X, 
  AlertCircle, 
  Save, 
  UserCheck, 
  Moon, 
  Sun,
  ShieldCheck
} from 'lucide-react';

interface ShiftDay {
  day: string;
  active: boolean;
  start: string;
  end: string;
  onCall: boolean;
}

const DEFAULT_DAYS: ShiftDay[] = [
  { day: 'Monday', active: true, start: '08:00 AM', end: '06:00 PM', onCall: false },
  { day: 'Tuesday', active: true, start: '08:00 AM', end: '06:00 PM', onCall: false },
  { day: 'Wednesday', active: true, start: '08:00 AM', end: '06:00 PM', onCall: false },
  { day: 'Thursday', active: true, start: '08:00 AM', end: '06:00 PM', onCall: true },
  { day: 'Friday', active: true, start: '08:00 AM', end: '06:00 PM', onCall: false },
  { day: 'Saturday', active: true, start: '09:00 AM', end: '04:00 PM', onCall: true },
  { day: 'Sunday', active: false, start: 'OFF', end: 'OFF', onCall: false }
];

export const Page24TechnicianAvailability: React.FC = () => {
  const { technicians, addToast, navigateToPage } = useAdmin();
  const [selectedTechId, setSelectedTechId] = useState<string>(technicians[0]?.id || '');

  const [techSchedules, setTechSchedules] = useState<Record<string, ShiftDay[]>>(() => {
    const saved = localStorage.getItem('servicepro_tech_schedules');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    const initial: Record<string, ShiftDay[]> = {};
    technicians.forEach((t, i) => {
      initial[t.id] = DEFAULT_DAYS.map((d, dIdx) => ({
        ...d,
        active: dIdx !== 6 && (i % 2 === 0 ? dIdx !== 5 : true),
        onCall: (i + dIdx) % 3 === 0
      }));
    });
    return initial;
  });

  const selectedTech = technicians.find(t => t.id === selectedTechId) || technicians[0];
  const currentShifts = selectedTech ? (techSchedules[selectedTech.id] || DEFAULT_DAYS) : DEFAULT_DAYS;

  const updateShift = (dayIdx: number, updates: Partial<ShiftDay>) => {
    if (!selectedTech) return;
    setTechSchedules(prev => {
      const existing = prev[selectedTech.id] || DEFAULT_DAYS;
      const updated = existing.map((s, i) => i === dayIdx ? { ...s, ...updates } : s);
      const next = { ...prev, [selectedTech.id]: updated };
      localStorage.setItem('servicepro_tech_schedules', JSON.stringify(next));
      return next;
    });
  };

  const handleSave = () => {
    if (!selectedTech) return;
    localStorage.setItem('servicepro_tech_schedules', JSON.stringify(techSchedules));
    addToast(`Weekly shifts and on-call roster saved for ${selectedTech.name}!`, 'success');
  };

  if (!selectedTech) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Technician Shift Availability &amp; Hours</h1>
          <p className="text-xs text-slate-500 mt-1">Configure weekly operating shifts, on-call night rotation, and leave approvals for fleet technicians</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center max-w-lg mx-auto shadow-xs">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <UserCheck className="w-6 h-6" />
          </div>
          <h3 className="text-base font-extrabold text-slate-900 mb-1">No Technicians Onboarded</h3>
          <p className="text-xs text-slate-500 mb-6">
            Fleet roster is currently empty. Onboard technicians in Fleet Management to configure operating shifts, working hours, and emergency on-call schedules.
          </p>
          <button
            onClick={() => navigateToPage(22)}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
          >
            + Onboard First Technician
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Technician Shift Availability &amp; Hours</h1>
          <p className="text-xs text-slate-500 mt-1">Configure weekly operating shifts, on-call night rotation, and leave approvals for fleet technicians</p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedTechId}
            onChange={e => setSelectedTechId(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-800 shadow-2xs focus:outline-none cursor-pointer"
          >
            {technicians.map(t => (
              <option key={t.id} value={t.id}>{t.name} ({t.specialization})</option>
            ))}
          </select>

          <button
            onClick={handleSave}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            Save Shifts
          </button>
        </div>
      </div>

      {/* Shifts Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/60 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <span>Weekly Shift Schedule for {selectedTech.name}</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                {selectedTech.status}
              </span>
            </h2>
            <p className="text-xs text-slate-500">Dispatch engine will only route customer jobs during active shift hours</p>
          </div>
          <span className="text-xs font-mono font-bold text-slate-600">
            {selectedTech.workingHours}
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {currentShifts.map((shift, idx) => (
            <div key={idx} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50">
              <div className="flex items-center gap-3 min-w-[140px]">
                <input
                  type="checkbox"
                  checked={shift.active}
                  onChange={e => updateShift(idx, { active: e.target.checked })}
                  className="rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <span className={`text-xs font-bold ${shift.active ? 'text-slate-900' : 'text-slate-400'}`}>
                  {shift.day}
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs">
                {shift.active ? (
                  <>
                    <div className="flex items-center gap-1.5 font-mono text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                      <Sun className="w-3.5 h-3.5 text-amber-500" />
                      <span>{shift.start}</span>
                      <span className="text-slate-400">to</span>
                      <span>{shift.end}</span>
                    </div>

                    <label className="flex items-center gap-1.5 cursor-pointer text-[11px] font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200">
                      <Moon className="w-3 h-3 text-purple-600" />
                      <input
                        type="checkbox"
                        checked={shift.onCall}
                        onChange={e => updateShift(idx, { onCall: e.target.checked })}
                        className="rounded text-purple-600"
                      />
                      <span>Emergency On-Call</span>
                    </label>
                  </>
                ) : (
                  <span className="text-slate-400 font-bold bg-slate-100 px-3 py-1 rounded-lg">
                    Scheduled Day Off
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
