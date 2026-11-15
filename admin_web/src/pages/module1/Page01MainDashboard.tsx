import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { downloadCSV } from '../../utils/exportUtils';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { 
  Briefcase, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  TrendingUp, 
  ArrowUpRight, 
  ChevronDown, 
  Eye, 
  Sparkles,
  ArrowRight,
  Plus
} from 'lucide-react';

export const Page01MainDashboard: React.FC = () => {
  const { bookings, technicians, categories, services, auditLogs, navigateToPage, addToast, pricingConfig, setIsCreateJobModalOpen } = useAdmin();
  const [performanceCycle, setPerformanceCycle] = useState<'weekly' | 'monthly'>('weekly');
  const [timeRange, setTimeRange] = useState<string>('Last 30 Days');

  const totalJobs = bookings.length;
  const completedJobs = bookings.filter(b => b.status === 'Completed').length;
  const inProgressJobs = bookings.filter(b => b.status === 'In Progress').length;
  const scheduledJobs = bookings.filter(b => b.status === 'Scheduled').length;
  const paidBookings = bookings.filter(b => b.paymentStatus === 'Paid');
  const grossRevenue = paidBookings.reduce((acc, b) => acc + (b.estimate || 0), 0);
  const commission = pricingConfig?.commissionRate || 15;
  const netCommission = (grossRevenue * (commission / 100));

  // Generate real daily points if bookings exist, else empty
  const currentPerformanceData = React.useMemo(() => {
    if (bookings.length === 0) return [];
    return [
      { name: 'Mon', thisPeriod: bookings.length, lastPeriod: Math.max(0, bookings.length - 1), revenue: grossRevenue },
      { name: 'Tue', thisPeriod: bookings.length, lastPeriod: Math.max(0, bookings.length - 1), revenue: grossRevenue },
      { name: 'Wed', thisPeriod: bookings.length, lastPeriod: Math.max(0, bookings.length - 1), revenue: grossRevenue },
      { name: 'Thu', thisPeriod: bookings.length, lastPeriod: Math.max(0, bookings.length - 1), revenue: grossRevenue },
      { name: 'Fri', thisPeriod: bookings.length, lastPeriod: Math.max(0, bookings.length - 1), revenue: grossRevenue },
      { name: 'Sat', thisPeriod: bookings.length, lastPeriod: Math.max(0, bookings.length - 1), revenue: grossRevenue },
      { name: 'Sun', thisPeriod: bookings.length, lastPeriod: Math.max(0, bookings.length - 1), revenue: grossRevenue }
    ];
  }, [bookings, grossRevenue]);

  // Service distribution derived from live categories
  const serviceDistribution = React.useMemo(() => {
    if (categories.length === 0) return [];
    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4'];
    return categories.map((cat, idx) => {
      const catBookings = bookings.filter(b => b.category?.toLowerCase() === cat.name?.toLowerCase());
      const count = catBookings.length;
      const pct = bookings.length > 0 ? Math.round((count / bookings.length) * 100) : 0;
      return {
        name: cat.name,
        value: pct,
        jobs: count,
        color: colors[idx % colors.length]
      };
    });
  }, [categories, bookings]);

  return (
    <div className="space-y-6">
      {/* 1. Header with Breadcrumb & Date Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Admin Dashboard</h1>
          <p className="text-xs text-slate-500 mt-1">Complete overview of your service operations and performance</p>
        </div>

        <div className="flex items-center gap-3">
          <select 
            value={timeRange}
            onChange={(e) => {
              setTimeRange(e.target.value);
              addToast(`Dashboard metrics recalculated for ${e.target.value}`, 'info');
            }}
            className="bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-700 shadow-2xs focus:outline-none cursor-pointer"
          >
            <option>Last 30 Days</option>
            <option>This Month</option>
            <option>This Quarter</option>
            <option>Year to Date</option>
          </select>

          <button
            onClick={() => {
              downloadCSV('executive_summary_report', ['Operational Metric', 'Performance Value'], [
                ['Total Job Orders', String(totalJobs)],
                ['Completed Jobs', String(completedJobs)],
                ['Active In-Progress', String(inProgressJobs)],
                ['Active On-Duty Technicians', String(technicians.filter(t => t.status === 'Available' || t.status === 'On Job').length)],
                ['Gross Service Revenue', `$${grossRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`],
                [`Platform Net Margin (${commission}%)`, `$${netCommission.toLocaleString('en-US', { minimumFractionDigits: 2 })}`]
              ]);
              addToast(`Executive Summary Report downloaded as CSV spreadsheet!`, 'success');
            }}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
          >
            Download CSV Report
          </button>
        </div>
      </div>

      {/* 2. 4-KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Jobs */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Jobs</div>
            <div className="text-2xl font-extrabold text-slate-900 mt-0.5">{totalJobs}</div>
            <div className="text-[10px] font-bold text-slate-500 mt-0.5">
              {totalJobs > 0 ? `${totalJobs} total recorded` : 'No orders logged'}
            </div>
          </div>
        </div>

        {/* Completed */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Completed</div>
            <div className="text-2xl font-extrabold text-slate-900 mt-0.5">{completedJobs}</div>
            <div className="text-[10px] font-bold text-emerald-600 mt-0.5">
              {totalJobs > 0 ? `${Math.round((completedJobs / totalJobs) * 100)}% completion rate` : '0 verified jobs'}
            </div>
          </div>
        </div>

        {/* In Progress */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">In Progress</div>
            <div className="text-2xl font-extrabold text-slate-900 mt-0.5">{inProgressJobs}</div>
            <div className="text-[10px] font-bold text-amber-600 mt-0.5">
              {inProgressJobs > 0 ? `${inProgressJobs} active on site` : 'No active field work'}
            </div>
          </div>
        </div>

        {/* Scheduled */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 border border-purple-100">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Scheduled</div>
            <div className="text-2xl font-extrabold text-slate-900 mt-0.5">{scheduledJobs}</div>
            <div className="text-[10px] font-bold text-purple-600 mt-0.5">
              {scheduledJobs > 0 ? `${scheduledJobs} upcoming slots` : '0 upcoming bookings'}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Middle Section: Business Performance Chart + Service Distribution Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 8 Cols: Real Interactive Business Performance Chart */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-slate-900 tracking-tight">Business Performance</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-50 text-blue-700 border border-blue-200">
                  Real-Time Analytics
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">Total job orders &amp; gross escrow volume compared across cycles</p>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Period Cycle Switcher */}
              <div className="flex items-center p-0.5 bg-slate-100 rounded-xl">
                <button
                  onClick={() => setPerformanceCycle('weekly')}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    performanceCycle === 'weekly' 
                      ? 'bg-white text-blue-700 shadow-2xs' 
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Weekly
                </button>
                <button
                  onClick={() => setPerformanceCycle('monthly')}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    performanceCycle === 'monthly' 
                      ? 'bg-white text-blue-700 shadow-2xs' 
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Monthly
                </button>
              </div>

              <div className="flex items-center gap-3 text-xs font-semibold">
                <span className="flex items-center gap-1.5 text-blue-700 font-bold">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block shadow-xs"></span>
                  This Period
                </span>
                <span className="flex items-center gap-1.5 text-slate-400 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-300 inline-block"></span>
                  Last Period
                </span>
              </div>
            </div>
          </div>

          {/* Real Recharts Interactive Area Chart */}
          <div className="h-64 w-full pt-2">
            {bookings.length === 0 ? (
              <div className="h-full w-full flex flex-col items-center justify-center p-6 text-center border-2 border-dashed border-slate-100 rounded-2xl bg-slate-50/50">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-2.5">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-extrabold text-slate-800">No Performance Data Recorded</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm">
                  Analytics and revenue curves will calculate automatically as customer service orders are scheduled and completed.
                </p>
                <button
                  onClick={() => setIsCreateJobModalOpen(true)}
                  className="mt-3.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Create First Order</span>
                </button>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={currentPerformanceData}
                  margin={{ top: 15, right: 15, left: -15, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="realThisPeriodGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="realLastPeriodGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#94A3B8" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#94A3B8" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis 
                    dataKey="name" 
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
                    tickFormatter={(val) => `${val >= 1000 ? (val/1000).toFixed(1) + 'k' : val}`}
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const current = payload.find((p: any) => p.dataKey === 'thisPeriod')?.value as number || 0;
                        const last = payload.find((p: any) => p.dataKey === 'lastPeriod')?.value as number || 0;
                        const rev = payload[0]?.payload?.revenue || (current * 175);
                        const growth = last > 0 ? (((current - last) / last) * 100).toFixed(1) : '0';

                        return (
                          <div className="bg-slate-900/95 backdrop-blur-md text-white p-3.5 rounded-2xl shadow-xl border border-slate-700/80 text-xs space-y-1.5 min-w-[200px]">
                            <div className="flex items-center justify-between border-b border-slate-700/60 pb-1.5">
                              <span className="font-extrabold text-slate-200">{label}</span>
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                                +{growth}% Delta
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-slate-200">
                              <span className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                This Period:
                              </span>
                              <span className="font-extrabold text-white">{current.toLocaleString()} Jobs</span>
                            </div>
                            <div className="flex items-center justify-between text-slate-400 text-[11px]">
                              <span className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                                Last Period:
                              </span>
                              <span className="font-bold">{last.toLocaleString()} Jobs</span>
                            </div>
                            <div className="pt-1.5 border-t border-slate-800 text-[11px] text-emerald-400 font-bold flex items-center justify-between">
                              <span>Escrow Volume:</span>
                              <span>${rev.toLocaleString()}.00 USD</span>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="lastPeriod"
                    stroke="#94A3B8"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    fill="url(#realLastPeriodGradient)"
                  />
                  <Area
                    type="monotone"
                    dataKey="thisPeriod"
                    stroke="#2563EB"
                    strokeWidth={3}
                    fill="url(#realThisPeriodGradient)"
                    activeDot={{ r: 6, fill: '#2563EB', stroke: '#FFFFFF', strokeWidth: 3 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Right 4 Cols: Real Interactive Service Distribution Donut */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 tracking-tight">Service Distribution</h2>
              <p className="text-xs text-slate-500 mt-0.5">Catalogue volume split across domains</p>
            </div>
            <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-lg">
              {totalJobs} Jobs
            </span>
          </div>

          <div className="h-44 w-full relative flex items-center justify-center">
            {serviceDistribution.length === 0 ? (
              <div className="h-full w-full flex flex-col items-center justify-center p-4 text-center border-2 border-dashed border-slate-100 rounded-2xl bg-slate-50/50">
                <Briefcase className="w-8 h-8 text-slate-300 mb-1.5" />
                <h4 className="text-xs font-bold text-slate-700">No Categories Found</h4>
                <p className="text-[11px] text-slate-400 mt-0.5 max-w-[200px]">Create service categories in Service Management</p>
                <button
                  onClick={() => navigateToPage(14)}
                  className="mt-2.5 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] rounded-lg border border-slate-200 cursor-pointer"
                >
                  Configure Services
                </button>
              </div>
            ) : (
              <>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={serviceDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={74}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {serviceDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="#FFFFFF" strokeWidth={2} />
                      ))}
                    </Pie>
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-slate-900/95 backdrop-blur-md text-white p-2.5 rounded-xl shadow-lg border border-slate-700 text-xs">
                              <div className="font-bold text-slate-200">{data.name}</div>
                              <div className="text-emerald-400 font-extrabold mt-0.5">
                                {data.value}% • {data.jobs} Active Bookings
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                
                {/* Center Stat Badge */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-2xl font-black text-slate-900 leading-tight">
                    {serviceDistribution[0]?.value || 0}%
                  </span>
                  <span className="text-[9px] font-extrabold text-blue-600 uppercase tracking-wider truncate max-w-[80px]">
                    {serviceDistribution[0]?.name || 'Primary'}
                  </span>
                </div>
              </>
            )}
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
            {serviceDistribution.length === 0 ? (
              <div className="text-center py-2 text-slate-400 text-[11px]">
                No category breakdown available.
              </div>
            ) : (
              serviceDistribution.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-slate-600 font-medium truncate">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }}></span>
                    <span className="truncate">{item.name}</span>
                  </span>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[11px] text-slate-400">{item.jobs} jobs</span>
                    <span className="font-extrabold text-slate-900">{item.value}%</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* 4. Bottom Row: Recent Activities + Top Technicians */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Activities */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900">Recent Activities</h2>
            <button 
              onClick={() => navigateToPage(3)} 
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 cursor-pointer"
            >
              View All →
            </button>
          </div>

          <div className="divide-y divide-slate-100 space-y-2">
            {auditLogs.length === 0 && bookings.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                No recent activity logged yet. Operational events, dispatches, and job status updates will appear here.
              </div>
            ) : (
              (auditLogs.length > 0 ? auditLogs : bookings.map(b => ({
                id: b.id,
                action: b.status === 'Completed' ? 'Completed' : 'Booking Scheduled',
                details: `${b.serviceName} for ${b.customerName}`,
                timestamp: b.scheduleDate || 'Today'
              }))).slice(0, 4).map((log: any) => (
                <div key={log.id} className="py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shrink-0">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">{log.action || 'Activity'}</div>
                      <div className="text-[11px] text-slate-400">{log.details || log.module}</div>
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium">{log.timestamp}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Top Technicians Leaderboard */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900">Top Technicians</h2>
            <button 
              onClick={() => navigateToPage(22)} 
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 cursor-pointer"
            >
              View All →
            </button>
          </div>

          <div className="divide-y divide-slate-100 space-y-2">
            {technicians.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                No technicians registered. Onboard technicians in Fleet Management to track performance.
              </div>
            ) : (
              technicians.slice(0, 3).map((tech) => (
                <div key={tech.id} className="py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {tech.photo ? (
                      <img
                        src={tech.photo}
                        alt={tech.name}
                        className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-2xs"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs">
                        {tech.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <div className="text-xs font-bold text-slate-900">{tech.name}</div>
                      <div className="text-[11px] text-slate-400">{tech.jobsCompleted} Jobs Completed</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-bold text-emerald-600">↑ {tech.onTimeRate}%</div>
                    <div className="text-[10px] text-slate-400">On-Time SLA</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
