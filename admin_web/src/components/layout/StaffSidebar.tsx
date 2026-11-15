import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { 
  LayoutDashboard, 
  Inbox, 
  Navigation, 
  Users, 
  Clock, 
  Calendar, 
  CalendarRange, 
  CheckCircle2, 
  MessageSquare, 
  FileSpreadsheet, 
  ArrowRightLeft, 
  Activity,
  UserCheck,
  ChevronDown,
  ChevronRight,
  LogOut,
  ShieldAlert,
  ShieldCheck
} from 'lucide-react';
import { STAFF_MODULES } from '../../data/staffPagesMaster';

export const StaffSidebar: React.FC = () => {
  const { 
    agencyName,
    agencyTagline,
    currentStaffPageId, 
    activeStaffModuleId, 
    navigateToStaffPage, 
    navigateToStaffModule, 
    isSidebarCollapsed, 
    addToast,
    logout,
    bookings
  } = useAdmin();

  const [expandedModules, setExpandedModules] = useState<number[]>([1, 2]);

  const toggleExpand = (modId: number) => {
    setExpandedModules(prev => 
      prev.includes(modId) ? prev.filter(id => id !== modId) : [...prev, modId]
    );
  };

  const getModuleIcon = (id: number) => {
    switch (id) {
      case 1: return LayoutDashboard;
      case 2: return Navigation;
      case 3: return Clock;
      case 4: return CheckCircle2;
      default: return LayoutDashboard;
    }
  };

  const pendingOrdersCount = bookings.filter(b => b.status === 'Pending').length;
  const inProgressCount = bookings.filter(b => b.status === 'In Progress').length;

  return (
    <aside
      className={`shrink-0 h-full select-none flex flex-col justify-between transition-all duration-300 servicepro-sidebar border-r border-[#092b26] ${
        isSidebarCollapsed ? 'w-20' : 'w-80 min-w-[320px]'
      }`}
    >
      {/* 1. Header & Brand Logo (Unified Brand Theme) */}
      <div>
        <div className="h-18 px-5 flex items-center gap-3 border-b border-[#11423b]">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 shrink-0 shadow-sm">
            <span className="font-extrabold text-xl tracking-tight">{agencyName ? agencyName.charAt(0).toUpperCase() : 'S'}</span>
          </div>
          {!isSidebarCollapsed && (
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-white text-base tracking-tight truncate">{agencyName || 'Operations Desk'}</span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-emerald-400 text-slate-950 uppercase tracking-wider shrink-0">STAFF</span>
              </div>
              <div className="text-[11px] text-emerald-300/80 font-medium truncate">{agencyTagline || 'Field Service Operations'}</div>
            </div>
          )}
        </div>

        {/* 2. Scrolling Navigation Modules */}
        <div className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-220px)] thin-scrollbar">
          {!isSidebarCollapsed && (
            <div className="px-3 pt-2 pb-1 text-[10px] font-extrabold text-emerald-300/50 uppercase tracking-wider flex items-center justify-between">
              <span>Operations Workspaces</span>
              <span className="text-[9px] text-emerald-300/80 font-normal">Under Main Head</span>
            </div>
          )}

          {STAFF_MODULES.map((item) => {
            const Icon = getModuleIcon(item.id);
            const isActive = activeStaffModuleId === item.id;
            const isExpanded = expandedModules.includes(item.id) || isActive;

            // Live operational badges (alert-driven, non-crowded)
            const badge = 
              item.id === 1 && pendingOrdersCount > 0 ? `${pendingOrdersCount} Queue` :
              item.id === 3 && inProgressCount > 0 ? `${inProgressCount} Field` :
              null;

            return (
              <div key={item.id} className="space-y-0.5">
                <button
                  onClick={() => {
                    navigateToStaffModule(item.id);
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
                      {badge && (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap shrink-0 ${
                          item.id === 1 ? 'bg-amber-500/20 text-amber-300 border border-amber-400/30' :
                          item.id === 3 ? 'bg-sky-500/20 text-sky-300 border border-sky-400/30' :
                          'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                        }`}>
                          {badge}
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
                    {item.pages.map(page => {
                      const isPageActive = currentStaffPageId === page.id;
                      const label = page.tabName || page.name;
                      return (
                        <button
                          key={page.id}
                          onClick={() => navigateToStaffPage(page.id)}
                          className={`w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all flex items-center justify-between cursor-pointer ${
                            isPageActive
                              ? 'bg-emerald-500/20 text-white font-bold border-l-2 border-emerald-400 pl-2'
                              : 'text-slate-300 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          <span className="truncate">{label}</span>
                          {isPageActive && (
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"></span>
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

      {/* 3. Bottom Controls */}
      <div className="p-3 border-t border-[#11423b]">
        {!isSidebarCollapsed && (
          <div className="mb-2 p-2.5 rounded-xl bg-[#082622] border border-[#144d44] flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] font-bold text-white truncate">Order Sync Active</div>
              <div className="text-[10px] text-emerald-400/80 truncate">Linked to Main Head Desk</div>
            </div>
          </div>
        )}

        <button
          onClick={logout}
          className={`w-full flex items-center gap-2 px-3 py-2 mt-1 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-[#11423b] transition-all cursor-pointer ${
            isSidebarCollapsed ? 'justify-center' : ''
          }`}
          title="Sign Out"
        >
          <LogOut className="w-4 h-4 text-slate-400 shrink-0" />
          {!isSidebarCollapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
};
