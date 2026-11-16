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
  CheckCircle2,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';

interface PayoutItem {
  id: string;
  technicianName: string;
  bankAccount: string;
  jobsCount: number;
  grossAmount: number;
  status: 'Ready' | 'Processing' | 'Disbursed';
}

export const Page29TechnicianPayouts: React.FC = () => {
  const { addToast, pricingConfig, technicians, bookings } = useAdmin();

  // Track live payout processing state
  const [disbursedIds, setDisbursedIds] = useState<string[]>([]);
  const [processingIds, setProcessingIds] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const isUUID = (str: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

  const payouts: PayoutItem[] = React.useMemo(() => {
    return technicians
      .map((t, idx) => {
        const techBookings = bookings.filter(b => b.technicianId === t.id || b.technicianName === t.name);
        const completedJobs = techBookings.filter(b => b.status === 'Completed');
        const grossAmount = completedJobs.reduce((acc, b) => acc + (b.estimate || 0), 0);
        const isDisbursed = disbursedIds.includes(t.id);
        const isProcessing = processingIds.includes(t.id);

        let status: 'Ready' | 'Processing' | 'Disbursed' = 'Ready';
        if (isDisbursed || grossAmount === 0) {
          status = 'Disbursed';
        } else if (isProcessing) {
          status = 'Processing';
        }

        return {
          id: t.id || `00000000-0000-0000-0000-${String(idx + 1).padStart(12, '0')}`,
          technicianName: t.name,
          bankAccount: `Direct Deposit •••• ${t.phone ? t.phone.slice(-4) : '0000'}`,
          jobsCount: completedJobs.length,
          grossAmount,
          status
        };
      })
      .filter(p => p.jobsCount > 0 || technicians.length <= 5);
  }, [technicians, bookings, disbursedIds, processingIds]);

  const commissionRate = pricingConfig?.commissionRate || 15;
  const techSplit = 100 - commissionRate;

  const readyPayouts = payouts.filter(p => p.status === 'Ready' && p.grossAmount > 0);
  const totalReadyGross = readyPayouts.reduce((acc, p) => acc + p.grossAmount, 0);
  const totalReadyPlatformTake = totalReadyGross * (commissionRate / 100);
  const totalReadyNet = totalReadyGross - totalReadyPlatformTake;

  const handleReleaseBatch = async () => {
    if (readyPayouts.length === 0) return;
    setIsProcessing(true);
    const successfullyInitiated: string[] = [];

    try {
      for (const p of readyPayouts) {
        if (!isUUID(p.id)) {
          addToast(`Technician ${p.technicianName} lacks a valid database UUID; skipping.`, 'error');
          continue;
        }

        const net = p.grossAmount * (techSplit / 100);
        const amountCents = Math.round(net * 100);
        const idempotencyKey = `payout_batch_${p.id}_${Date.now()}`;

        const res = await apiClient.triggerPayout(p.id, amountCents, `Batch payout to ${p.technicianName}`, idempotencyKey);
        if (res.success) {
          successfullyInitiated.push(p.id);
        } else {
          addToast(`Payout for ${p.technicianName} rejected: ${res.error?.message || 'Server error'}`, 'error');
        }
      }

      if (successfullyInitiated.length > 0) {
        setProcessingIds(prev => [...prev, ...successfullyInitiated]);
        addToast(`Successfully initiated payout processing for ${successfullyInitiated.length} technicians via Fastify API.`, 'success');
      }
    } catch (err: any) {
      addToast(err?.message || 'Failed executing batch disbursals via payment gateway', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDisburseSingle = async (id: string, name: string, net: number) => {
    if (!isUUID(id)) {
      addToast(`Cannot execute payout: "${id}" is not a valid database UUID format.`, 'error');
      return;
    }

    setIsProcessing(true);
    try {
      const amountCents = Math.round(net * 100);
      const idempotencyKey = `payout_single_${id}_${Date.now()}`;
      const res = await apiClient.triggerPayout(id, amountCents, `Weekly disbursal to ${name}`, idempotencyKey);

      if (!res.success) {
        throw new Error(res.error?.message || 'Server rejected payout transaction');
      }

      setProcessingIds(prev => [...prev, id]);
      const status = res.data?.status || 'PROCESSING';
      addToast(`Payout status: ${status} for ${name}. Record reserved and posted to double-entry ledger.`, 'success');
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
            Authoritative Fastify two-phase payout engine with double-entry ledger integration
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
            disabled={readyPayouts.length === 0 || isProcessing}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
          >
            {isProcessing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
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
            <p className="text-xs text-slate-500">Itemized ledger of verified jobs, commission withholdings, and Fastify server payouts</p>
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
                        po.status === 'Disbursed' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : po.status === 'Processing'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                      }`}>
                        {po.status === 'Disbursed' 
                          ? '✓ Disbursed' 
                          : po.status === 'Processing'
                            ? '⏳ Processing'
                            : '● Ready to Disburse'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      {po.status === 'Ready' && po.grossAmount > 0 ? (
                        <button
                          onClick={() => handleDisburseSingle(po.id, po.technicianName, netPayout)}
                          disabled={isProcessing}
                          className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 disabled:opacity-50 text-emerald-800 font-bold text-[11px] rounded-lg border border-emerald-200 transition-colors cursor-pointer"
                        >
                          Disburse
                        </button>
                      ) : po.status === 'Processing' ? (
                        <span className="text-blue-600 font-bold text-[11px]">In Ledger</span>
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
