import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { 
  LayoutDashboard, 
  Compass, 
  Briefcase, 
  HardHat, 
  Users, 
  Layers, 
  Landmark, 
  HelpCircle, 
  Settings, 
  LogOut,
  ChevronDown,
  ChevronRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { MODULES_8 } from '../../data/pagesMaster';

export const AdminSidebar: React.FC = () => {
  const { 
    agencyName,
    agencyTagline,
    activeModuleId, 
    currentPageId, 
    navigateToPage, 
    navigateToModule, 
    isSidebarCollapsed, 
    addToast,
    logout,
    tickets,
    bookings
  } = useAdmin();

  // Active module is always expanded
  const [expandedModules, setExpandedModules] = useState<number[]>([1, 2]);

  const toggleExpand = (modId: number) => {
    setExpandedModules(prev => 
      prev.includes(modId) ? prev.filter(id => id !== modId) : [...prev, modId]
    );
  };

  const navModules = [
    { id: 1, name: 'Dashboard & Operations', icon: LayoutDashboard },
    { id: 2, name: 'Bookings & Dispatch', icon: Compass },
    { id: 3, name: 'Services & Pricing', icon: Layers },
    { id: 4, name: 'Customer Management', icon: Users },
    { id: 5, name: 'Technician Management', icon: HardHat },
    { id: 6, name: 'Finance & Payments', icon: Landmark },
    { id: 7, name: 'Support & Reviews', icon: HelpCircle },
    { id: 8, name: 'Platform Settings', icon: Settings },
  ];

  const pendingBookingsCount = bookings.filter(b => b.status === 'Pending').length;
  const openTicketsCount = tickets.filter(t => t.status === 'Open').length;

  return (
    <aside
      className={`shrink-0 h-full select-none flex flex-col justify-between transition-all duration-300 servicepro-sidebar border-r border-[#092b26] ${
        isSidebarCollapsed ? 'w-20' : 'w-80 min-w-[320px]'
      }`}
    >
      {/* 1. Header & Brand Logo */}
      <div>
        <div className="h-18 px-5 flex items-center gap-3 border-b border-[#11423b]">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 shrink-0 shadow-sm">
            <span className="font-extrabold text-xl tracking-tight">{agencyName ? agencyName.charAt(0).toUpperCase() : 'A'}</span>
          </div>
          {!isSidebarCollapsed && (
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-white text-base tracking-tight truncate">{agencyName || 'Admin Console'}</span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-emerald-400 text-slate-950 uppercase tracking-wider shrink-0">ADMIN</span>
              </div>
              <div className="text-[11px] text-emerald-300/80 font-medium truncate">{agencyTagline || 'Executive Operations Portal'}</div>
            </div>
          )}
        </div>

        {/* 2. Primary 8 Navigation Modules with Clean Sub-Pages (Zero Numbering) */}
        <div className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-220px)] thin-scrollbar">
          {!isSidebarCollapsed && (
            <div className="px-3 pt-2 pb-1 text-[10px] font-extrabold text-emerald-300/50 uppercase tracking-wider">
              Management Modules
            </div>
          )}

          {navModules.map((item) => {
            const Icon = item.icon;
            const isActive = activeModuleId === item.id;
            const isExpanded = expandedModules.includes(item.id) || isActive;
            const targetModule = MODULES_8.find(m => m.id === item.id);
            const modulePages = targetModule ? targetModule.pages : [];

            // Real business status badge
            const operationalBadge = 
              item.id === 2 && pendingBookingsCount > 0 ? `${pendingBookingsCount} Pending` :
              item.id === 7 && openTicketsCount > 0 ? `${openTicketsCount} Open` :
              null;

            return (
              <div key={item.id} className="space-y-0.5">
                {/* Module Header Button */}
                <button
                  onClick={() => {
                    navigateToModule(item.id);
                    toggleExpand(item.id);
                  }}
                  className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#11423b] text-white border border-emerald-500/40'
                      : 'text-slate-200 hover:bg-[#11423b]/60'
                  } ${isSidebarCollapsed ? 'justify-center' : 'justify-between'}`}
                  title={item.name}
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1 overflow-hidden">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-emerald-400' : 'text-emerald-400/80'}`} />
                    {!isSidebarCollapsed && (
                      <span className="truncate font-bold text-xs">{item.name}</span>
                    )}
                  </div>

                  {!isSidebarCollapsed && (
                    <div className="flex items-center gap-1.5 shrink-0 ml-2">
                      {operationalBadge && (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap shrink-0 ${
                          item.id === 2 ? 'bg-amber-500/20 text-amber-300 border border-amber-400/30' : 'bg-rose-500/20 text-rose-300 border border-rose-400/30'
                        }`}>
                          {operationalBadge}
                        </span>
                      )}
                      {isExpanded ? (
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      )}
                    </div>
                  )}
                </button>

                {/* Sub-pages list with clean business labels (NO #1, #2 numbering) */}
                {!isSidebarCollapsed && isExpanded && (
                  <div className="pl-6 pr-1 py-1 space-y-0.5 border-l-2 border-emerald-500/30 ml-4">
                    {modulePages.map(page => {
                      const isPageActive = currentPageId === page.id;
                      const label = page.tabName || page.name;
                      return (
                        <button
                          key={page.id}
                          onClick={() => navigateToPage(page.id)}
                          className={`w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all flex items-center justify-between cursor-pointer ${
                            isPageActive
                              ? 'servicepro-nav-active text-white font-bold shadow-xs'
                              : 'text-slate-300 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          <span className="truncate">{label}</span>
                          {isPageActive && (
                            <span className="w-1.5 h-1.5 rounded-full bg-white shrink-0"></span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Bottom: Operational Status Badge */}
      <div className="p-3 border-t border-[#11423b]">
        {!isSidebarCollapsed && (
          <div className="mb-2 p-2.5 rounded-xl bg-[#082622] border border-[#144d44] flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] font-bold text-white truncate">All Systems Operational</div>
              <div className="text-[10px] text-emerald-400/80 truncate">Cloud Supabase Connected</div>
            </div>
          </div>
        )}

        <button
          onClick={logout}
          className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-[#11423b] transition-all cursor-pointer ${
            isSidebarCollapsed ? 'justify-center' : ''
          }`}
          title="Sign Out"
        >
          <LogOut className="w-4 h-4 text-emerald-400/70 shrink-0" />
          {!isSidebarCollapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
};
