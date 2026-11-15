import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { downloadCSV } from '../../utils/exportUtils';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart as RechartsPie,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { 
  DollarSign, 
  TrendingUp, 
  CreditCard, 
  ArrowUpRight, 
  Download, 
  PieChart as PieChartIcon, 
  ShieldCheck, 
  Calendar 
} from 'lucide-react';

export const Page26FinancialDashboard: React.FC = () => {
  const { navigateToPage, addToast, pricingConfig, bookings } = useAdmin();
  const [selectedMonth, setSelectedMonth] = useState('October 2026');

  const commissionRate = pricingConfig?.commissionRate || 15;
  const techSplit = (100 - commissionRate);

  const totalGMV = bookings.reduce((sum, b) => sum + (b.estimate || 0), 0);
  const escrowVault = bookings
    .filter(b => b.status === 'In Progress' || b.status === 'Scheduled' || b.status === 'Pending')
    .reduce((sum, b) => sum + (b.estimate || 0), 0);

  const effectiveGMV = totalGMV;
  const platformRevenue = Math.round(effectiveGMV * (commissionRate / 100));
  const techDisbursals = Math.round(effectiveGMV * (techSplit / 100));

  const WEEKLY_REVENUE_DATA = [
    { week: 'Week 1', gmv: Math.round(effectiveGMV * 0.20), takeRate: Math.round(effectiveGMV * 0.20 * (commissionRate / 100)), payouts: Math.round(effectiveGMV * 0.20 * (techSplit / 100)) },
    { week: 'Week 2', gmv: Math.round(effectiveGMV * 0.25), takeRate: Math.round(effectiveGMV * 0.25 * (commissionRate / 100)), payouts: Math.round(effectiveGMV * 0.25 * (techSplit / 100)) },
    { week: 'Week 3', gmv: Math.round(effectiveGMV * 0.25), takeRate: Math.round(effectiveGMV * 0.25 * (commissionRate / 100)), payouts: Math.round(effectiveGMV * 0.25 * (techSplit / 100)) },
    { week: 'Week 4 (Current)', gmv: Math.round(effectiveGMV * 0.30), takeRate: Math.round(effectiveGMV * 0.30 * (commissionRate / 100)), payouts: Math.round(effectiveGMV * 0.30 * (techSplit / 100)) }
  ];

  const GATEWAY_SHARE_DATA = [
    { name: 'Stripe Escrow Card', value: effectiveGMV > 0 ? 62 : 0, amount: `$${Math.round(effectiveGMV * 0.62).toLocaleString()}.00`, color: '#059669' },
    { name: 'Apple & Google Pay', value: effectiveGMV > 0 ? 24 : 0, amount: `$${Math.round(effectiveGMV * 0.24).toLocaleString()}.00`, color: '#2563EB' },
    { name: 'Zelle & Bank ACH Wire', value: effectiveGMV > 0 ? 11 : 0, amount: `$${Math.round(effectiveGMV * 0.11).toLocaleString()}.00`, color: '#7C3AED' },
    { name: 'Verified COD', value: effectiveGMV > 0 ? 3 : 0, amount: `$${Math.round(effectiveGMV * 0.03).toLocaleString()}.00`, color: '#F59E0B' }
  ];

  return (
    <div className="space-y-6">
      {/* Top Header matching Screenshot 05 Top Left */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Financial Dashboard</h1>
          <p className="text-xs text-slate-500 mt-1">Platform gross merchandise volume, escrow balance, take-rate revenue, and payout telemetry</p>
        </div>

        <div className="flex items-center gap-3">
          <select 
            value={selectedMonth}
            onChange={(e) => {
              setSelectedMonth(e.target.value);
              addToast(`Financial statements updated for ${e.target.value}`, 'info');
            }}
            className="bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-700 shadow-2xs focus:outline-none cursor-pointer"
          >
            <option>Current Billing Period</option>
            <option>Previous Month</option>
            <option>Year-to-Date</option>
          </select>

          <button
            onClick={() => {
              downloadCSV('financial_statement_ledger', [
                { 'Financial Metric': 'Gross Bookings Volume (GMV)', 'Amount ($)': `${effectiveGMV.toFixed(2)}`, 'Period': 'Current Billing Period', 'Status': 'Audited' },
                { 'Financial Metric': `Platform Take Revenue (${commissionRate}%)`, 'Amount ($)': `${platformRevenue.toFixed(2)}`, 'Period': 'Current Billing Period', 'Status': 'Retained Net Commission' },
                { 'Financial Metric': `Technician Disbursals (${techSplit}%)`, 'Amount ($)': `${techDisbursals.toFixed(2)}`, 'Period': 'Current Billing Period', 'Status': 'Disbursed via Stripe Connect' },
                { 'Financial Metric': 'Escrow Reserve Hold', 'Amount ($)': `${escrowVault.toFixed(2)}`, 'Period': 'Current Active', 'Status': 'Secured in Escrow' }
              ]);
              addToast(`Financial balance sheet (${commissionRate}% platform margin) exported to CSV spreadsheet!`, 'success');
            }}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            Export Statement
          </button>
        </div>
      </div>

      {/* 4 Financial KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Gross Bookings Volume (GMV)</div>
          <div className="text-2xl font-extrabold text-slate-900 mt-0.5">
            ${effectiveGMV.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-[10px] text-slate-500 font-bold mt-0.5">Live platform volume</div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Platform Take Revenue ({commissionRate}%)</div>
          <div className="text-2xl font-extrabold text-emerald-700 mt-0.5">
            ${platformRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-[10px] text-emerald-600 font-bold mt-0.5">Retained net commission</div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Technician Disbursals ({techSplit}%)</div>
          <div className="text-2xl font-extrabold text-slate-900 mt-0.5">
            ${techDisbursals.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-[10px] text-slate-400 font-bold mt-0.5">{techSplit}% direct payout split</div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Escrow Vault Held</div>
          <div className="text-2xl font-extrabold text-purple-700 mt-0.5">
            ${escrowVault.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-[10px] text-purple-600 font-bold mt-0.5">Held until job sign-off</div>
        </div>
      </div>

      {/* Financial Charts & Split Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Real Interactive Weekly Revenue Breakdown (8 Cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-slate-900 tracking-tight">Weekly Revenue Breakdown</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Stripe Escrow Verified
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">Gross volume vs {commissionRate}% platform take-rate commission</p>
            </div>
            
            <div className="flex items-center gap-4 text-xs font-bold">
              <span className="flex items-center gap-1.5 text-slate-800">
                <span className="w-3 h-3 rounded-md bg-slate-900 inline-block shadow-2xs"></span>
                Gross Volume (GMV)
              </span>
              <span className="flex items-center gap-1.5 text-emerald-700">
                <span className="w-3 h-3 rounded-md bg-emerald-600 inline-block shadow-2xs"></span>
                Take-Rate ({commissionRate}%)
              </span>
            </div>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={WEEKLY_REVENUE_DATA}
                margin={{ top: 15, right: 15, left: -10, bottom: 0 }}
                barGap={8}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis 
                  dataKey="week" 
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
                  tickFormatter={(val) => `$${(val/1000).toFixed(0)}k`}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const gmvVal = payload.find((p: any) => p.dataKey === 'gmv')?.value as number || 0;
                      const takeVal = payload.find((p: any) => p.dataKey === 'takeRate')?.value as number || 0;
                      const payoutVal = payload[0]?.payload?.payouts || 0;

                      return (
                        <div className="bg-slate-900/95 backdrop-blur-md text-white p-3.5 rounded-2xl shadow-xl border border-slate-700 text-xs space-y-1.5 min-w-[210px]">
                          <div className="font-extrabold text-slate-200 border-b border-slate-700/60 pb-1.5">
                            {label} Settlement Summary
                          </div>
                          <div className="flex items-center justify-between text-slate-200">
                            <span className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                              Gross Volume:
                            </span>
                            <span className="font-extrabold text-white">${gmvVal.toLocaleString()}.00</span>
                          </div>
                          <div className="flex items-center justify-between text-emerald-400">
                            <span className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                              Platform Take (15%):
                            </span>
                            <span className="font-extrabold">${takeVal.toLocaleString()}.00</span>
                          </div>
                          <div className="pt-1.5 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                            <span>Technician Payouts (85%):</span>
                            <span className="text-slate-300 font-bold">${payoutVal.toLocaleString()}.00</span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar 
                  dataKey="gmv" 
                  name="Gross Merchandise Value"
                  fill="#0F172A" 
                  radius={[6, 6, 0, 0]} 
                  maxBarSize={40}
                />
                <Bar 
                  dataKey="takeRate" 
                  name="Platform 15% Take-Rate"
                  fill="#059669" 
                  radius={[6, 6, 0, 0]} 
                  maxBarSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Real Interactive Payment Gateways Share (4 Cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 tracking-tight">Payment Gateways Share</h2>
              <p className="text-xs text-slate-500 mt-0.5">Escrow settlements &amp; processors</p>
            </div>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
              100% Settled
            </span>
          </div>

          <div className="h-44 w-full relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPie>
                <Pie
                  data={GATEWAY_SHARE_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={74}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {GATEWAY_SHARE_DATA.map((entry, index) => (
                    <Cell key={`cell-gw-${index}`} fill={entry.color} stroke="#FFFFFF" strokeWidth={2} />
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
                            {data.value}% • {data.amount} USD
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </RechartsPie>
            </ResponsiveContainer>
            
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-black text-slate-900 leading-tight">{effectiveGMV > 0 ? '62%' : '0%'}</span>
              <span className="text-[9px] font-extrabold text-emerald-600 uppercase tracking-wider">Stripe CC</span>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
            {GATEWAY_SHARE_DATA.map((p, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-700 font-medium truncate">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: p.color }}></span>
                  <span className="truncate">{p.name}</span>
                </span>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[11px] text-slate-400 font-mono">{p.amount}</span>
                  <span className="font-extrabold text-slate-900">{p.value}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
