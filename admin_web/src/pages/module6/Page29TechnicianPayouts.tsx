import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { apiClient } from '../../services/apiClient';
import { downloadCSV } from '../../utils/exportUtils';
import { 
  DollarSign, 
  CheckCircle, 
  Clock, 
  Send, 
  Download, 
  ShieldCheck, 
  Building,
  Percent,
  CheckCircle2
} from 'lucide-react';

interface PayoutItem {
  id: string;
  technicianName: string;
  bankAccount: string;
  jobsCount: number;
  grossAmount: number;
  status: 'Ready' | 'Disbursed';
}

export const Page29TechnicianPayouts: React.FC = () => {
  const { addToast, pricingConfig, technicians, bookings } = useAdmin();

  // Compute live payouts strictly from registered technicians and completed bookings
  const [disbursedIds, setDisbursedIds] = useState<string[]>([]);

  const payouts: PayoutItem[] = React.useMemo(() => {
    return technicians
      .map((t, idx) => {
        const techBookings = bookings.filter(b => b.technicianId === t.id || b.technicianName === t.name);
        const completedJobs = techBookings.filter(b => b.status === 'Completed');
        const grossAmount = completedJobs.reduce((acc, b) => acc + (b.estimate || 0), 0);
        const isDisbursed = disbursedIds.includes(t.id);

        return {
          id: t.id || `po-${idx}`,
          technicianName: t.name,
          bankAccount: `Direct Deposit •••• ${t.phone ? t.phone.slice(-4) : '0000'}`,
          jobsCount: completedJobs.length,
          grossAmount,
          status: (isDisbursed || grossAmount === 0 ? 'Disbursed' : 'Ready') as 'Ready' | 'Disbursed'
        };
      })
      .filter(p => p.jobsCount > 0 || technicians.length <= 5);
  }, [technicians, bookings, disbursedIds]);

  const commissionRate = pricingConfig?.commissionRate || 15;
  const techSplit = 100 - commissionRate;

  const readyPayouts = payouts.filter(p => p.status === 'Ready' && p.grossAmount > 0);
  const totalReadyGross = readyPayouts.reduce((acc, p) => acc + p.grossAmount, 0);
  const totalReadyPlatformTake = totalReadyGross * (commissionRate / 100);
  const totalReadyNet = totalReadyGross - totalReadyPlatformTake;

  const [isProcessing, setIsProcessing] = useState(false);

  const handleReleaseBatch = async () => {
    setIsProcessing(true);
    try {
      for (const p of readyPayouts) {
        const net = p.grossAmount * (techSplit / 100);
        const amountCents = Math.round(net * 100);
        await apiClient.triggerPayout(p.id, amountCents, `Batch payout to ${p.technicianName}`);
      }
      const ids = readyPayouts.map(p => p.id);
      setDisbursedIds(prev => [...prev, ...ids]);
      addToast(`Successfully disbursed $${totalReadyNet.toFixed(2)} to ${readyPayouts.length} technicians via Stripe Connect!`, 'success');
    } catch (err: any) {
      addToast(err?.message || 'Failed executing batch disbursals via payment gateway', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDisburseSingle = async (id: string, name: string, net: number) => {
    setIsProcessing(true);
    try {
      const amountCents = Math.round(net * 100);
      await apiClient.triggerPayout(id, amountCents, `Weekly disbursal to ${name}`);
      setDisbursedIds(prev => [...prev, id]);
      addToast(`Disbursed $${net.toFixed(2)} to ${name} via Stripe Connect ACH.`, 'success');
    } catch (err: any) {
      addToast(err?.message || `Failed to disburse payout to ${name}`, 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Technician Payouts &amp; Disbursals</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
              Weekly Disbursal Cycle ({techSplit}% Pro Split)
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Automated Stripe Connect ACH batch disbursals with configurable {commissionRate}% platform commission take-rate
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              downloadCSV('technician_payouts_ledger', payouts.map(p => {
                const take = p.grossAmount * (commissionRate / 100);
                const net = p.grossAmount - take;
                return {
                  'Technician': p.technicianName,
                  'Account': p.bankAccount,
                  'Jobs Count': p.jobsCount,
                  'Gross ($)': p.grossAmount.toFixed(2),
                  [`Platform Take (${commissionRate}%)`]: take.toFixed(2),
                  [`Net Payout (${techSplit}%)`]: net.toFixed(2),
                  'Disbursal Status': p.status
                };
              }));
              addToast('Technician payouts statement exported as CSV!', 'success');
            }}
            className="px-3.5 py-2 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-bold text-xs rounded-xl shadow-2xs transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>

          <button
            onClick={handleReleaseBatch}
            disabled={readyPayouts.length === 0}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            Release Batch (${totalReadyNet.toFixed(2)})
          </button>
        </div>
      </div>

      {/* 4 KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Pending Batch Disbursal</div>
          <div className="text-2xl font-extrabold text-slate-900 mt-0.5">${totalReadyNet.toFixed(2)}</div>
          <div className="text-[10px] text-amber-600 font-bold mt-0.5">{readyPayouts.length} Technicians awaiting release</div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Platform Take Realized</div>
          <div className="text-2xl font-extrabold text-emerald-700 mt-0.5">${totalReadyPlatformTake.toFixed(2)}</div>
          <div className="text-[10px] text-emerald-600 font-bold mt-0.5">{commissionRate}% platform margin retained</div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Disbursed This Month</div>
          <div className="text-2xl font-extrabold text-slate-900 mt-0.5">
            ${payouts
              .filter(p => p.status === 'Disbursed' && p.grossAmount > 0)
              .reduce((acc, p) => acc + p.grossAmount * (1 - commissionRate / 100), 0)
              .toFixed(2)}
          </div>
          <div className="text-[10px] text-emerald-600 font-bold mt-0.5">Computed from live disbursed payouts</div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Commission Take-Rate</div>
          <div className="text-2xl font-extrabold text-purple-700 mt-0.5">{commissionRate}%</div>
          <div className="text-[10px] text-slate-400 font-bold mt-0.5">Configured via Admin Pricing Matrix</div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/60 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-extrabold text-slate-900">Technician Payout &amp; Disbursal Queue</h2>
            <p className="text-xs text-slate-500">Itemized ledger of verified jobs, commission withholdings, and Stripe accounts</p>
          </div>
          <span className="text-xs font-mono font-bold text-slate-600">
            {payouts.length} Pro Profiles
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">Technician</th>
                <th className="py-3 px-4">Bank / Stripe Account</th>
                <th className="py-3 px-4">Jobs Finished</th>
                <th className="py-3 px-4">Gross Earned</th>
                <th className="py-3 px-4">Platform Take ({commissionRate}%)</th>
                <th className="py-3 px-4">Net Payout ({techSplit}%)</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {payouts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 text-xs">
                    <div className="flex flex-col items-center justify-center">
                      <DollarSign className="w-10 h-10 text-slate-300 mb-2" />
                      <p className="font-bold text-slate-700 text-sm">No Payout Disbursals Due</p>
                      <p className="text-slate-400 text-xs max-w-sm mt-1">
                        Technician earnings from completed work orders will aggregate here for weekly Stripe Connect escrow releases.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                payouts.map(po => {
                const platformTake = po.grossAmount * (commissionRate / 100);
                const netPayout = po.grossAmount - platformTake;

                return (
                  <tr key={po.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-extrabold text-slate-900">
                      {po.technicianName}
                    </td>

                    <td className="py-3.5 px-4 text-slate-600 font-mono text-[11px]">
                      {po.bankAccount}
                    </td>

                    <td className="py-3.5 px-4 font-bold text-slate-800">
                      {po.jobsCount} Orders
                    </td>

                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      ${po.grossAmount.toFixed(2)}
                    </td>

                    <td className="py-3.5 px-4 text-slate-500 font-medium">
                      -${platformTake.toFixed(2)}
                    </td>

                    <td className="py-3.5 px-4 font-extrabold text-emerald-700 text-sm">
                      ${netPayout.toFixed(2)}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        po.status === 'Disbursed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {po.status === 'Disbursed' ? '✓ Disbursed' : '● Ready to Disburse'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      {po.status === 'Ready' && po.grossAmount > 0 ? (
                        <button
                          onClick={() => handleDisburseSingle(po.id, po.technicianName, netPayout)}
                          className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-[11px] rounded-lg border border-emerald-200 transition-colors cursor-pointer"
                        >
                          Disburse
                        </button>
                      ) : (
                        <span className="text-slate-400 font-medium text-[11px]">Settled</span>
                      )}
                    </td>
                  </tr>
                );
              }))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
