import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { downloadCSV } from '../../utils/exportUtils';
import { 
  Search, 
  Download, 
  Filter, 
  CreditCard, 
  CheckCircle2, 
  Clock, 
  RotateCcw,
  ExternalLink
} from 'lucide-react';

interface Transaction {
  id: string;
  txnNo: string;
  date: string;
  jobNo: string;
  customer: string;
  technician: string;
  grossAmount: number;
  platformFee: number;
  proNet: number;
  gateway: 'Stripe' | 'Apple Pay' | 'Square' | 'Razorpay';
  status: 'Settled' | 'Escrow Held' | 'Refunded';
}

export const Page27TransactionHistory: React.FC = () => {
  const { addToast, bookings, pricingConfig } = useAdmin();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('All');

  const transactions: Transaction[] = bookings.map((b, idx) => {
    const gross = b.estimate;
    const platformFee = Number(((gross * pricingConfig.commissionRate) / 100).toFixed(2));
    const proNet = Number((gross - platformFee).toFixed(2));
    const gateways: Transaction['gateway'][] = ['Stripe', 'Razorpay', 'Apple Pay', 'Square'];
    const gateway = gateways[idx % gateways.length];
    const status: Transaction['status'] = 
      b.status === 'Completed' ? 'Settled' :
      b.status === 'Cancelled' ? 'Refunded' : 'Escrow Held';

    return {
      id: `tx-${b.id}`,
      txnNo: `TXN-${98420 - idx}`,
      date: `${b.scheduleDate}, ${b.scheduleTime}`,
      jobNo: b.jobNo,
      customer: b.customerName,
      technician: b.technicianName,
      grossAmount: gross,
      platformFee,
      proNet,
      gateway,
      status
    };
  });

  const filtered = transactions.filter(tx => {
    const matchesSearch = tx.txnNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tx.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tx.jobNo.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'All' || tx.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Transaction History</h1>
          <p className="text-xs text-slate-500 mt-1">Audit log of all processed payment transactions, take-rate splits, and escrow releases</p>
        </div>

        <button
          onClick={() => {
            downloadCSV('transaction_ledger', ['TXN #', 'Date', 'Job #', 'Customer', 'Technician', 'Gross ($)', 'Platform Fee ($)', 'Pro Net ($)', 'Gateway', 'Status'], filtered.map(t => [t.txnNo, t.date, t.jobNo, t.customer, t.technician, t.grossAmount, t.platformFee, t.proNet, t.gateway, t.status]));
            addToast('Transaction ledger downloaded as CSV spreadsheet!', 'success');
          }}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
        >
          <Download className="w-3.5 h-3.5" />
          Export Ledger CSV
        </button>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Search & Tabs */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
          <div className="relative w-full max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by TXN #, customer, Job #..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center gap-1.5">
            {['All', 'Settled', 'Escrow Held', 'Refunded'].map(st => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  filterStatus === st
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Transactions Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">TXN # &amp; Date</th>
                <th className="py-3 px-4">Job &amp; Customer</th>
                <th className="py-3 px-4">Gross Settled</th>
                <th className="py-3 px-4">Platform Take (15%)</th>
                <th className="py-3 px-4">Pro Net Payout</th>
                <th className="py-3 px-4">Gateway</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(tx => (
                <tr key={tx.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-mono font-bold text-slate-900">{tx.txnNo}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{tx.date}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-800">#{tx.jobNo}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{tx.customer} → {tx.technician}</div>
                  </td>

                  <td className="py-3.5 px-4 font-extrabold text-slate-900 text-sm">
                    ${tx.grossAmount.toFixed(2)}
                  </td>

                  <td className="py-3.5 px-4 font-bold text-emerald-700">
                    +${tx.platformFee.toFixed(2)}
                  </td>

                  <td className="py-3.5 px-4 font-bold text-slate-700">
                    ${tx.proNet.toFixed(2)}
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-700">
                      {tx.gateway}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      tx.status === 'Settled' ? 'bg-emerald-100 text-emerald-800' :
                      tx.status === 'Escrow Held' ? 'bg-amber-100 text-amber-800' :
                      'bg-rose-100 text-rose-800'
                    }`}>
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
