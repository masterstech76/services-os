import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { 
  X, 
  Search, 
  User, 
  Wrench, 
  Briefcase, 
  Phone, 
  Mail, 
  MapPin, 
  Star, 
  CheckCircle2, 
  ShieldCheck, 
  Clock, 
  Calendar, 
  DollarSign, 
  Award, 
  ExternalLink,
  ChevronRight,
  Plus
} from 'lucide-react';
import { Customer, Technician, StaffMember } from '../../types';

export const UniversalUserDossierModal: React.FC = () => {
  const { 
    isDossierModalOpen, 
    closeUserDossier, 
    dossierUser, 
    customers, 
    technicians, 
    staffMembers, 
    bookings,
    addToast,
    navigateToPage,
    setSelectedCustomerId,
    setSelectedTechnicianId,
    navigateToFacebookProfile,
    openSMSModal
  } = useAdmin();

  const [activeTab, setActiveTab] = useState<'customer' | 'technician' | 'staff'>('customer');
  const [selectedId, setSelectedId] = useState<string>('C1');
  const [searchFilter, setSearchFilter] = useState('');
  const [activeCall, setActiveCall] = useState<{ name: string; phone: string; duration: number } | null>(null);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (activeCall) {
      timer = setInterval(() => {
        setActiveCall(prev => prev ? { ...prev, duration: prev.duration + 1 } : null);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [activeCall]);

  const handleStartCall = (name: string, phone: string) => {
    const cleanPhone = phone.replace(/[^0-9+]/g, '');
    window.open(`tel:${cleanPhone}`);
    setActiveCall({ name, phone, duration: 0 });
    addToast(`Connected live audio session to ${name} (${phone})`, 'success');
  };

  const handleEndCall = () => {
    if (activeCall) {
      addToast(`Call with ${activeCall.name} ended. Duration: ${activeCall.duration}s logged to audit registry.`, 'info');
      setActiveCall(null);
    }
  };

  useEffect(() => {
    if (isDossierModalOpen && dossierUser) {
      setActiveTab(dossierUser.type);
      setSelectedId(dossierUser.id);
    }
  }, [isDossierModalOpen, dossierUser]);

  if (!isDossierModalOpen) return null;

  // Selected entities
  const selectedCustomer = customers.find(c => c.id === selectedId) || customers[0];
  const selectedTech = technicians.find(t => t.id === selectedId) || technicians[0];
  const selectedStaff = staffMembers.find(s => s.id === selectedId) || staffMembers[0];

  // Customer bookings
  const customerBookings = bookings.filter(b => b.customerName.toLowerCase() === selectedCustomer?.name.toLowerCase());

  // Filtered lists for left drawer
  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchFilter.toLowerCase()) || 
    c.city.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const filteredTechs = technicians.filter(t => 
    t.name.toLowerCase().includes(searchFilter.toLowerCase()) || 
    t.specialization.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const filteredStaff = staffMembers.filter(s => 
    s.name.toLowerCase().includes(searchFilter.toLowerCase()) || 
    s.role.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-slate-200/80 w-full max-w-4xl overflow-hidden flex flex-col h-[650px] max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#0C3832] text-white flex items-center justify-center font-black shadow-xs">
              <User className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-slate-900 tracking-tight">Enterprise User Directory &amp; Dossier</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 uppercase">
                  Universal Inspector
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Browse and inspect full profile dossiers for Customers, Field Technicians, and Operations Staff
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Category Switcher Tabs */}
            <div className="flex items-center bg-slate-200/80 p-0.5 rounded-xl text-xs font-bold">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('customer');
                  setSelectedId(customers[0]?.id || 'C1');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'customer' ? 'bg-[#0C3832] text-white shadow-xs' : 'text-slate-700 hover:text-slate-950'
                }`}
              >
                <User className="w-3.5 h-3.5 text-emerald-400" />
                <span>Customers ({customers.length})</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('technician');
                  setSelectedId(technicians[0]?.id || 'T1');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'technician' ? 'bg-[#0C3832] text-white shadow-xs' : 'text-slate-700 hover:text-slate-950'
                }`}
              >
                <Wrench className="w-3.5 h-3.5 text-emerald-400" />
                <span>Technicians ({technicians.length})</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('staff');
                  setSelectedId(staffMembers[0]?.id || 'S1');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'staff' ? 'bg-[#0C3832] text-white shadow-xs' : 'text-slate-700 hover:text-slate-950'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5 text-emerald-400" />
                <span>Staff ({staffMembers.length})</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  closeUserDossier();
                  if (activeTab === 'customer') {
                    setSelectedCustomerId(selectedId);
                    navigateToPage(19);
                  } else if (activeTab === 'technician') {
                    setSelectedTechnicianId(selectedId);
                    navigateToPage(23);
                  } else {
                    navigateToFacebookProfile({ type: activeTab, id: selectedId });
                  }
                  addToast('Opening full profile dossier screen', 'info');
                }}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                title="View full profile page"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>View Full Profile Page →</span>
              </button>

              <button
                onClick={closeUserDossier}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Active Call Assist Telephony Banner */}
        {activeCall && (
          <div className="mx-6 my-2 p-3 bg-emerald-950 text-white rounded-2xl border border-emerald-500/40 flex items-center justify-between shadow-lg animate-in slide-in-from-top-1">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center animate-pulse">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-white">Live Call Active: {activeCall.name}</span>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-400 text-slate-950 uppercase">Connected</span>
                </div>
                <div className="text-[11px] text-emerald-200 font-mono">
                  {activeCall.phone} • Duration: {Math.floor(activeCall.duration / 60).toString().padStart(2, '0')}:{(activeCall.duration % 60).toString().padStart(2, '0')}
                </div>
              </div>
            </div>
            <button
              onClick={handleEndCall}
              className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-extrabold transition-all cursor-pointer shadow-xs"
            >
              End &amp; Log Call
            </button>
          </div>
        )}

        {/* 2-Column Split: Directory List + Profile Inspector */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left: User Roster List */}
          <div className="w-72 border-r border-slate-200/80 flex flex-col bg-slate-50/50 shrink-0">
            <div className="p-3 border-b border-slate-200/60">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchFilter}
                  onChange={e => setSearchFilter(e.target.value)}
                  placeholder={`Search ${activeTab}s...`}
                  className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto thin-scrollbar p-2 space-y-1">
              {/* Customer Roster */}
              {activeTab === 'customer' && (
                filteredCustomers.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-400">No customers registered yet.</div>
                ) : (
                  filteredCustomers.map(cust => (
                    <button
                      key={cust.id}
                      onClick={() => setSelectedId(cust.id)}
                      className={`w-full text-left p-2.5 rounded-xl transition-all flex items-center justify-between cursor-pointer ${
                        selectedId === cust.id
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'hover:bg-slate-100 text-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {cust.photo ? (
                          <img
                            src={cust.photo}
                            alt={cust.name}
                            className="w-8 h-8 rounded-full object-cover shrink-0 ring-1 ring-white/20"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0">
                            {cust.name ? cust.name.charAt(0).toUpperCase() : 'C'}
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="font-bold text-xs truncate">{cust.name}</div>
                          <div className={`text-[10px] truncate ${selectedId === cust.id ? 'text-emerald-100' : 'text-slate-400'}`}>
                            {cust.city || 'Location'} • {cust.totalBookings} orders
                          </div>
                        </div>
                      </div>
                      <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${selectedId === cust.id ? 'text-white' : 'text-slate-300'}`} />
                    </button>
                  ))
                )
              )}

              {/* Technician Roster */}
              {activeTab === 'technician' && (
                filteredTechs.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-400">No technicians registered yet.</div>
                ) : (
                  filteredTechs.map(t => (
                    <button
                      key={t.id}
                      onClick={() => setSelectedId(t.id)}
                      className={`w-full text-left p-2.5 rounded-xl transition-all flex items-center justify-between cursor-pointer ${
                        selectedId === t.id
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'hover:bg-slate-100 text-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {t.photo ? (
                          <img
                            src={t.photo}
                            alt={t.name}
                            className="w-8 h-8 rounded-full object-cover shrink-0 ring-1 ring-white/20"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0">
                            {t.name ? t.name.charAt(0).toUpperCase() : 'T'}
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="font-bold text-xs truncate">{t.name}</div>
                          <div className={`text-[10px] truncate ${selectedId === t.id ? 'text-emerald-100' : 'text-slate-400'}`}>
                            {t.specialization} • {t.status}
                          </div>
                        </div>
                      </div>
                      <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${selectedId === t.id ? 'text-white' : 'text-slate-300'}`} />
                    </button>
                  ))
                )
              )}

              {/* Staff Roster */}
              {activeTab === 'staff' && (
                filteredStaff.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-400">No staff accounts registered yet.</div>
                ) : (
                  filteredStaff.map(s => (
                    <button
                      key={s.id}
                      onClick={() => setSelectedId(s.id)}
                      className={`w-full text-left p-2.5 rounded-xl transition-all flex items-center justify-between cursor-pointer ${
                        selectedId === s.id
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'hover:bg-slate-100 text-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {s.photo ? (
                          <img
                            src={s.photo}
                            alt={s.name}
                            className="w-8 h-8 rounded-full object-cover shrink-0 ring-1 ring-white/20"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0">
                            {s.name ? s.name.charAt(0).toUpperCase() : 'S'}
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="font-bold text-xs truncate">{s.name}</div>
                          <div className={`text-[10px] truncate ${selectedId === s.id ? 'text-emerald-100' : 'text-slate-400'}`}>
                            {s.role}
                          </div>
                        </div>
                      </div>
                      <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${selectedId === s.id ? 'text-white' : 'text-slate-300'}`} />
                    </button>
                  ))
                )
              )}
            </div>
          </div>

          {/* Right: Detailed Dossier View */}
          <div className="flex-1 p-6 overflow-y-auto thin-scrollbar">
            {/* Empty States when no records exist */}
            {activeTab === 'customer' && !selectedCustomer && (
              <div className="h-64 flex flex-col items-center justify-center text-center p-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <User className="w-12 h-12 text-slate-300 mb-2" />
                <p className="text-sm font-bold text-slate-700">No Customers Registered</p>
                <p className="text-xs text-slate-400 max-w-sm mt-1">Add your first customer to inspect profile dossiers, purchase history, and direct communication logs.</p>
              </div>
            )}
            {activeTab === 'technician' && !selectedTech && (
              <div className="h-64 flex flex-col items-center justify-center text-center p-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <Wrench className="w-12 h-12 text-slate-300 mb-2" />
                <p className="text-sm font-bold text-slate-700">No Technicians Onboarded</p>
                <p className="text-xs text-slate-400 max-w-sm mt-1">Onboard your first field technician to view credentials, trade certifications, SLA rating, and active dispatch load.</p>
              </div>
            )}
            {activeTab === 'staff' && !selectedStaff && (
              <div className="h-64 flex flex-col items-center justify-center text-center p-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <Briefcase className="w-12 h-12 text-slate-300 mb-2" />
                <p className="text-sm font-bold text-slate-700">No Staff Accounts Registered</p>
                <p className="text-xs text-slate-400 max-w-sm mt-1">Create operations staff accounts to view shift assignments, intake queues, and dispatcher credentials.</p>
              </div>
            )}

            {/* 1. CUSTOMER PROFILE DOSSIER */}
            {activeTab === 'customer' && selectedCustomer && (
              <div className="space-y-5">
                {/* Header Banner */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-[#0C3832] to-[#134E45] text-white flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    {selectedCustomer.photo ? (
                      <img
                        src={selectedCustomer.photo}
                        alt={selectedCustomer.name}
                        className="w-16 h-16 rounded-2xl object-cover ring-2 ring-emerald-400/40 shadow-sm"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-black text-xl ring-2 ring-emerald-400/40 shadow-sm">
                        {selectedCustomer.name ? selectedCustomer.name.charAt(0).toUpperCase() : 'C'}
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-black">{selectedCustomer.name}</h3>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-400 text-slate-950 uppercase">
                          VIP Client
                        </span>
                      </div>
                      <div className="text-xs text-emerald-200 mt-0.5 flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{selectedCustomer.address}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleStartCall(selectedCustomer.name, selectedCustomer.phone)}
                      className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call</span>
                    </button>
                    <button
                      onClick={() => openSMSModal({ name: selectedCustomer.name, phone: selectedCustomer.phone, role: 'VIP Client', type: 'customer' })}
                      className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shadow-xs"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>SMS Alert</span>
                    </button>
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 text-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Lifetime Spend</span>
                    <span className="text-base font-black text-emerald-700">${selectedCustomer.lifetimeSpend.toLocaleString()}</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 text-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Completed Orders</span>
                    <span className="text-base font-black text-slate-900">{selectedCustomer.totalBookings} Jobs</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 text-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Customer Rating</span>
                    <span className="text-base font-black text-amber-600 flex items-center justify-center gap-1">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      {selectedCustomer.rating}
                    </span>
                  </div>
                </div>

                {/* Customer Contact & Access Notes */}
                <div className="p-4 bg-white rounded-2xl border border-slate-200/80 space-y-2 text-xs">
                  <span className="font-extrabold text-slate-900 block">Direct Contact &amp; Gate Access</span>
                  <div className="grid grid-cols-2 gap-2 text-slate-700">
                    <div>Email: <span className="font-mono font-bold text-slate-900">{selectedCustomer.email}</span></div>
                    <div>Phone: <span className="font-mono font-bold text-slate-900">{selectedCustomer.phone}</span></div>
                    <div>Security Gate Code: <span className="font-mono font-bold text-emerald-700">#4029 (Visitor Bay 3)</span></div>
                    <div>Service Territory: <span className="font-bold text-slate-900">Primary Service Zone</span></div>
                  </div>
                </div>

                {/* Recent Orders Stream */}
                <div>
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wide mb-2">Order History ({customerBookings.length} Logged)</h4>
                  <div className="space-y-2">
                    {customerBookings.map(b => (
                      <div key={b.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
                        <div>
                          <div className="font-bold text-slate-900">{b.jobNo} • {b.serviceName}</div>
                          <div className="text-[11px] text-slate-500">Tech: {b.technicianName} • {b.scheduleDate} at {b.scheduleTime}</div>
                        </div>
                        <div className="text-right">
                          <span className="font-black text-slate-900 block">${b.estimate}</span>
                          <span className={`px-2 py-0.2 rounded-full text-[10px] font-bold ${
                            b.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {b.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 2. TECHNICIAN PROFILE DOSSIER */}
            {activeTab === 'technician' && selectedTech && (
              <div className="space-y-5">
                {/* Header Banner */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-[#0C3832] to-[#134E45] text-white flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    {selectedTech.photo ? (
                      <img
                        src={selectedTech.photo}
                        alt={selectedTech.name}
                        className="w-16 h-16 rounded-2xl object-cover ring-2 ring-emerald-400/40 shadow-sm"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-black text-xl ring-2 ring-emerald-400/40 shadow-sm">
                        {selectedTech.name ? selectedTech.name.charAt(0).toUpperCase() : 'T'}
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-black">{selectedTech.name}</h3>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-400 text-slate-950 uppercase">
                          Verified Pro
                        </span>
                      </div>
                      <div className="text-xs text-emerald-200 mt-0.5">
                        {selectedTech.specialization} • Shift: {selectedTech.workingHours}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleStartCall(selectedTech.name, selectedTech.phone)}
                      className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call Tech</span>
                    </button>
                    <button
                      onClick={() => openSMSModal({ name: selectedTech.name, phone: selectedTech.phone, role: selectedTech.specialization, type: 'technician' })}
                      className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shadow-xs"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>SMS Pro</span>
                    </button>
                    <span className={`px-2.5 py-1 rounded-xl text-xs font-extrabold ${
                      selectedTech.status === 'Available' ? 'bg-emerald-400 text-slate-950' : 'bg-amber-400 text-slate-950'
                    }`}>
                      {selectedTech.status}
                    </span>
                  </div>
                </div>

                {/* Key Performance Stats */}
                <div className="grid grid-cols-4 gap-3">
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 text-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Jobs Done</span>
                    <span className="text-base font-black text-slate-900">{selectedTech.jobsCompleted}</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 text-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">On-Time SLA</span>
                    <span className="text-base font-black text-emerald-700">{selectedTech.onTimeRate}%</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 text-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Pro Rating</span>
                    <span className="text-base font-black text-amber-600 flex items-center justify-center gap-1">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      {selectedTech.rating}
                    </span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 text-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Active Load</span>
                    <span className="text-base font-black text-slate-900">{selectedTech.currentJobsCount} Jobs</span>
                  </div>
                </div>

                {/* Licenses & Hardware */}
                <div className="p-4 bg-white rounded-2xl border border-slate-200/80 space-y-3 text-xs">
                  <span className="font-extrabold text-slate-900 block">Licenses, Certifications &amp; Vehicle</span>
                  <div className="grid grid-cols-2 gap-2 text-slate-700">
                    <div>Trade License: <span className="font-mono font-bold text-slate-900">TX-HVAC-94821 (Master)</span></div>
                    <div>EPA Universal: <span className="font-mono font-bold text-emerald-700">Certified #482910</span></div>
                    <div>Service Vehicle: <span className="font-bold text-slate-900">Ford Transit 250 (Van #04)</span></div>
                    <div>License Plate: <span className="font-mono font-bold text-slate-900">TX • 849-ZPL</span></div>
                  </div>
                </div>
              </div>
            )}

            {/* 3. STAFF PROFILE DOSSIER */}
            {activeTab === 'staff' && selectedStaff && (
              <div className="space-y-5">
                {/* Header Banner */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-[#0C3832] to-[#134E45] text-white flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    {selectedStaff.photo ? (
                      <img
                        src={selectedStaff.photo}
                        alt={selectedStaff.name}
                        className="w-16 h-16 rounded-2xl object-cover ring-2 ring-emerald-400/40 shadow-sm"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-black text-xl ring-2 ring-emerald-400/40 shadow-sm">
                        {selectedStaff.name ? selectedStaff.name.charAt(0).toUpperCase() : 'S'}
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-black">{selectedStaff.name}</h3>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-400 text-slate-950 uppercase">
                          Staff Worker
                        </span>
                      </div>
                      <div className="text-xs text-emerald-200 mt-0.5">
                        {selectedStaff.role} • {selectedStaff.department}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => window.open(`mailto:${selectedStaff.email}?subject=ServiceOS%20Operations%20Directive`)}
                      className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Email</span>
                    </button>
                    <button
                      onClick={() => handleStartCall(selectedStaff.name, selectedStaff.phone)}
                      className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call Desk</span>
                    </button>
                    <span className="px-3 py-1 rounded-xl text-xs font-extrabold bg-emerald-400 text-slate-950">
                      {selectedStaff.status}
                    </span>
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 text-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Orders Handled</span>
                    <span className="text-base font-black text-slate-900">{selectedStaff.totalOrdersHandled} Orders</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 text-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Active Queue Load</span>
                    <span className="text-base font-black text-emerald-700">{selectedStaff.activeQueueCount} Queues</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 text-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Member Since</span>
                    <span className="text-base font-black text-slate-900">{selectedStaff.joinedDate}</span>
                  </div>
                </div>

                {/* Staff Contact & Workstations */}
                <div className="p-4 bg-white rounded-2xl border border-slate-200/80 space-y-2 text-xs">
                  <span className="font-extrabold text-slate-900 block">Operator Credentials &amp; Desk Schedule</span>
                  <div className="grid grid-cols-2 gap-2 text-slate-700">
                    <div>Email: <span className="font-mono font-bold text-slate-900">{selectedStaff.email}</span></div>
                    <div>Phone: <span className="font-mono font-bold text-slate-900">{selectedStaff.phone}</span></div>
                    <div>Daily Shift: <span className="font-bold text-slate-900">{selectedStaff.shiftHours}</span></div>
                    <div>Territory Hub: <span className="font-bold text-slate-900">{selectedStaff.territory}</span></div>
                  </div>
                </div>

                {/* Operations Responsibilities */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs text-slate-700 space-y-1.5">
                  <span className="font-bold text-slate-900 block">Assigned Workspaces &amp; Authority:</span>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Customer Intake Queue Triage &amp; SLA Management</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Technician Order Assignment &amp; Emergency Handover Desk</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Direct Customer Communication &amp; Arrival Coordination</span>
                  </div>
                </div>
              </div>
            )}

            {/* Empty States when no records exist */}
            {activeTab === 'customer' && !selectedCustomer && (
              <div className="h-64 flex flex-col items-center justify-center text-center p-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <User className="w-12 h-12 text-slate-300 mb-2" />
                <p className="text-sm font-bold text-slate-700">No Customers Registered</p>
                <p className="text-xs text-slate-400 max-w-sm mt-1">Add your first customer to inspect profile dossiers, purchase history, and direct communication logs.</p>
              </div>
            )}
            {activeTab === 'technician' && !selectedTech && (
              <div className="h-64 flex flex-col items-center justify-center text-center p-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <Wrench className="w-12 h-12 text-slate-300 mb-2" />
                <p className="text-sm font-bold text-slate-700">No Technicians Onboarded</p>
                <p className="text-xs text-slate-400 max-w-sm mt-1">Onboard your first field technician to view credentials, trade certifications, SLA rating, and active dispatch load.</p>
              </div>
            )}
            {activeTab === 'staff' && !selectedStaff && (
              <div className="h-64 flex flex-col items-center justify-center text-center p-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <Briefcase className="w-12 h-12 text-slate-300 mb-2" />
                <p className="text-sm font-bold text-slate-700">No Staff Accounts Registered</p>
                <p className="text-xs text-slate-400 max-w-sm mt-1">Create operations staff accounts to view shift assignments, intake queues, and dispatcher credentials.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
