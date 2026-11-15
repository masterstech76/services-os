import React from 'react';
import { useAdmin } from '../../context/AdminContext';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';
import { 
  Inbox, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  UserCheck, 
  Phone, 
  MapPin, 
  ShieldAlert, 
  ArrowRightLeft,
  Calendar,
  Sparkles
} from 'lucide-react';

export const StaffDashboard: React.FC = () => {
  const { 
    bookings, 
    technicians, 
    openAssignModal, 
    navigateToStaffPage,
    addToast,
    openSMSModal
  } = useAdmin();

  const pendingBookings = bookings.filter(b => b.status === 'Pending');
  const inProgressBookings = bookings.filter(b => b.status === 'In Progress');
  const scheduledBookings = bookings.filter(b => b.status === 'Scheduled');
  const completedBookings = bookings.filter(b => b.status === 'Completed');

  const availableTechs = technicians.filter(t => t.status === 'Available');
  const busyTechs = technicians.filter(t => t.status === 'On Job');

  return (
    <div className="space-y-6">
      {/* Top Welcome / Operations Header */}
      <div className="bg-gradient-to-r from-[#0C3832] to-[#124e45] rounded-2xl p-5 text-white shadow-xs relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-400/20 via-transparent to-transparent pointer-events-none"></div>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-400 text-slate-950 tracking-wider">
                Staff Operations Hub
              </span>
              <span className="text-emerald-300 text-xs font-semibold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Directly Reporting to Main Head
              </span>
            </div>
            <h1 className="text-xl lg:text-2xl font-extrabold tracking-tight text-white">
              Order Dispatch &amp; Operations Desk
            </h1>
            <p className="text-emerald-100/80 text-xs mt-0.5 max-w-2xl">
              Handle incoming customer requests, assign technicians based on distance and skill, supervise field execution, and ensure seamless delivery under company executive direction.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => navigateToStaffPage(104)}
              className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <UserCheck className="w-3.5 h-3.5 text-white" />
              <span>Assign Orders ({pendingBookings.length})</span>
            </button>
            <button
              onClick={() => navigateToStaffPage(107)}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowRightLeft className="w-3.5 h-3.5 text-emerald-300" />
              <span>Emergency Handover</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Operations KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Pending Intake */}
        <div 
          onClick={() => navigateToStaffPage(102)}
          className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:border-amber-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Unassigned Queue</span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Inbox className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <div className="text-2xl font-black text-slate-900">{String(pendingBookings.length).padStart(2, '0')}</div>
            <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
              Needs Assignment
            </span>
          </div>
          <div className="text-[10px] text-slate-500 mt-2 flex items-center justify-between font-medium">
            <span>Average waiting: 4m</span>
            <ArrowRight className="w-3 h-3 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 2: Dispatched & Scheduled */}
        <div 
          onClick={() => navigateToStaffPage(109)}
          className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:border-emerald-500 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Dispatched Today</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <div className="text-2xl font-black text-slate-900">{String(scheduledBookings.length).padStart(2, '0')}</div>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Techs Confirmed
            </span>
          </div>
          <div className="text-[10px] text-slate-500 mt-2 flex items-center justify-between font-medium">
            <span>Next job in 18 minutes</span>
            <ArrowRight className="w-3 h-3 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 3: In Progress On-Site */}
        <div 
          onClick={() => navigateToStaffPage(108)}
          className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:border-sky-500 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">On-Site Working</span>
            <div className="w-9 h-9 rounded-xl bg-sky-500/10 text-sky-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <div className="text-2xl font-black text-slate-900">{String(inProgressBookings.length).padStart(2, '0')}</div>
            <span className="text-[10px] font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200">
              Live Field Work
            </span>
          </div>
          <div className="text-[10px] text-slate-500 mt-2 flex items-center justify-between font-medium">
            <span>PIN Verified &amp; Active</span>
            <ArrowRight className="w-3 h-3 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 4: Completed & Verified */}
        <div 
          onClick={() => navigateToStaffPage(111)}
          className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:border-emerald-600 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Verified Today</span>
            <div className="w-9 h-9 rounded-xl bg-teal-500/10 text-teal-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <div className="text-2xl font-black text-slate-900">{String(completedBookings.length).padStart(2, '0')}</div>
            <span className="text-[10px] font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
              Signs Collected
            </span>
          </div>
          <div className="text-[10px] text-slate-500 mt-2 flex items-center justify-between font-medium">
            <span>Customer CSAT: 4.89 / 5.0</span>
            <ArrowRight className="w-3 h-3 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* Real Interactive Hourly Dispatch Radar Area Chart */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-slate-900 tracking-tight">Today's Dispatch Velocity &amp; Order Influx</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Live Field Feed
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Real-time incoming job volume vs completed technician dispatches</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-bold">
            <span className="flex items-center gap-1.5 text-blue-700">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block shadow-2xs"></span>
              Incoming Orders
            </span>
            <span className="flex items-center gap-1.5 text-emerald-700">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block shadow-2xs"></span>
              Technician Completed
            </span>
          </div>
        </div>

        <div className="h-56 w-full pt-1">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={[
                { time: '08:00 AM', incoming: 4, completed: 1 },
                { time: '10:00 AM', incoming: 9, completed: 5 },
                { time: '12:00 PM', incoming: 14, completed: 11 },
                { time: '02:00 PM', incoming: 18, completed: 15 },
                { time: '04:00 PM', incoming: 12, completed: 16 },
                { time: '06:00 PM', incoming: 7, completed: 11 }
              ]}
              margin={{ top: 10, right: 15, left: -15, bottom: 0 }}
            >
              <defs>
                <linearGradient id="staffIncomingGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="staffCompletedGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis 
                dataKey="time" 
                stroke="#94A3B8" 
                fontSize={11} 
                fontWeight={600}
                tickLine={false} 
                axisLine={{ stroke: '#E2E8F0' }} 
              />
              <YAxis 
                stroke="#94A3B8" 
                fontSize={11} 
                fontWeight={600}
                tickLine={false} 
                axisLine={false}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const incoming = payload.find((p: any) => p.dataKey === 'incoming')?.value as number || 0;
                    const completed = payload.find((p: any) => p.dataKey === 'completed')?.value as number || 0;
                    return (
                      <div className="bg-slate-900/95 backdrop-blur-md text-white p-3 rounded-2xl shadow-xl border border-slate-700 text-xs space-y-1 min-w-[170px]">
                        <div className="font-extrabold text-slate-200 border-b border-slate-700/60 pb-1">
                          {label} Slot
                        </div>
                        <div className="flex items-center justify-between text-blue-400 font-bold pt-1">
                          <span>Incoming Demand:</span>
                          <span className="text-white font-extrabold">{incoming} orders</span>
                        </div>
                        <div className="flex items-center justify-between text-emerald-400 font-bold">
                          <span>Completed on Site:</span>
                          <span className="text-white font-extrabold">{completed} signed</span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="incoming"
                stroke="#3B82F6"
                strokeWidth={2.5}
                fill="url(#staffIncomingGradient)"
              />
              <Area
                type="monotone"
                dataKey="completed"
                stroke="#10B981"
                strokeWidth={3}
                fill="url(#staffCompletedGradient)"
                activeDot={{ r: 5, fill: '#10B981', stroke: '#FFFFFF', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Main Two Columns: Unassigned Orders + Technician Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Unassigned Orders Queue */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div>
              <h2 className="text-sm font-extrabold text-slate-900">
                Incoming Orders Awaiting Assignment
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Assign qualified technician before 15-minute dispatch SLA expires
              </p>
            </div>
            <button
              onClick={() => navigateToStaffPage(104)}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
            >
              <span>Open Assignment Desk</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100 overflow-x-auto">
            {pendingBookings.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                All incoming orders have been assigned to technicians! Excellent work.
              </div>
            ) : (
              pendingBookings.map((order) => (
                <div key={order.id} className="p-4 hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                        {order.jobNo}
                      </span>
                      <span className="text-xs font-bold text-slate-900">
                        {order.serviceName}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        order.priority === 'Critical' ? 'bg-rose-100 text-rose-700' :
                        order.priority === 'High' ? 'bg-amber-100 text-amber-800' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {order.priority}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-slate-500 flex-wrap">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span className="truncate max-w-[200px]">{order.customerAddress}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span>{order.customerPhone}</span>
                      </span>
                      <span className="font-bold text-slate-700">
                        ${order.estimate}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => openAssignModal(order)}
                      className="px-3.5 py-1.5 rounded-xl bg-[#0C3832] hover:bg-[#124e45] text-white font-bold text-xs transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <UserCheck className="w-3.5 h-3.5 text-amber-300" />
                      <span>Assign Pro</span>
                    </button>
                    <button
                      onClick={() => openSMSModal({
                        name: order.customerName,
                        phone: order.customerPhone || '',
                        type: 'customer'
                      })}
                      className="px-2.5 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 text-xs font-semibold hover:bg-slate-100 transition-all cursor-pointer"
                    >
                      Notify SMS
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right 1 Col: Technician Real-Time Roster */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col justify-between">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-extrabold text-slate-900">
                Technician Roster
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                {availableTechs.length} Available
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Current status of field technicians on duty
            </p>
          </div>

          <div className="divide-y divide-slate-100 p-2 overflow-y-auto max-h-[360px] thin-scrollbar">
            {technicians.slice(0, 6).map((tech) => (
              <div key={tech.id} className="p-3 hover:bg-slate-50 rounded-2xl transition-colors flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative">
                    <img
                      src={tech.photo}
                      alt={tech.name}
                      className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-200"
                    />
                    <span className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                      tech.status === 'Available' ? 'bg-emerald-500' :
                      tech.status === 'On Job' ? 'bg-amber-500' : 'bg-slate-400'
                    }`}></span>
                  </div>

                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-900 truncate">
                      {tech.name}
                    </div>
                    <div className="text-[10px] text-slate-500 font-medium">
                      {tech.specialization} • ★ {tech.rating} ({tech.jobsCompleted} jobs)
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                    tech.status === 'Available' ? 'bg-emerald-100 text-emerald-800' :
                    tech.status === 'On Job' ? 'bg-amber-100 text-amber-800' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {tech.status}
                  </span>
                  <div className="text-[10px] text-slate-400 mt-1">
                    {tech.currentJobsCount} active jobs
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-slate-100 bg-slate-50/50">
            <button
              onClick={() => navigateToStaffPage(106)}
              className="w-full py-2 rounded-xl bg-white border border-slate-200 hover:border-emerald-500 text-xs font-bold text-slate-700 hover:text-emerald-700 shadow-2xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Manage Shift Availability</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
